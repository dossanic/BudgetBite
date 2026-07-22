const supabase = require("../supabaseClient");
const { estimatePrice } = require("../services/groqService");

// Constants for Groq AI rate limiting
const GROQ_COOLDOWN_MS = 5 * 60 * 1000;
const groqCircuit = {
  disabledUntil: 0,
  consecutiveFailures: 0,
};

// Helper function to check if an error is related to Groq AI rate limiting
function isGroqRateLimitError(error) {
  const message = error?.message || "";
  return /429|Too Many Requests|rate limit|quota/i.test(message);
}

// Function to get price estimates for a list of ingredients
async function getPriceEstimate(req, res) {
  // Require an array of ingredient names and an optional location from the request body
  // Location defaults to "Toronto, Ontario" if not provided by the user
  const { ingredients, location = "Toronto, Ontario" } = req.body;

  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({
      error: "Please provide a list of ingredients",
    });
  }

  // Loop through all ingredients name, delete white space and convert to lowercase to avoid case sensitivity
  // map function will return a new array with the normalized ingredient names, we will use this array to query the database
  const normalizedIngredients = ingredients.map((name) =>
    name.trim().toLowerCase(),
  );

  let data = [];
  let supabaseError = null;

  try {
    // Query supabase database for the ingredients that match the normalized ingredient names
    const response = await supabase
      .from("ingredient_prices")
      .select("name, price_min, price_max, last_updated")
      .in("name", normalizedIngredients);

    data = response.data || [];
    supabaseError = response.error;
  } catch (err) {
    supabaseError = err;
  }

  if (supabaseError) {
    return res.status(500).json({ error: supabaseError.message });
  }

  // Initalize variables and array to store results
  let totalMin = 0;
  let totalMax = 0;
  const found = [];
  const notFound = [];

  // Loop through the normalized ingredients and check if they exist in the database response
  for (const ingredient of normalizedIngredients) {
    // find() returns the first matching row or undefined if not found
    const match = data.find((row) => row.name === ingredient);

    if (match) {
      // calculate how many days since last updated
      // If last_updated is null, set daysSinceUpdate to 8 to refresh the data
      let daysSinceUpdate;
      if (match.last_updated) {
        daysSinceUpdate =
          (new Date() - new Date(match.last_updated)) / (1000 * 60 * 60 * 24);
      } else {
        daysSinceUpdate = 8;
      }

      if (daysSinceUpdate > 7) {
        // Price is expired, push to notFound so Groq will re-estimate
        notFound.push({ ingredient });
      } else {
        // Price is valid, add to total and push to found array
        totalMin += parseFloat(match.price_min);
        totalMax += parseFloat(match.price_max);
        found.push({
          ingredient: match.name,
          min: parseFloat(match.price_min),
          max: parseFloat(match.price_max),
        });
      }
    } else {
      // Ingredient not found in database, push to notFound for Groq to estimate
      notFound.push({ ingredient });
    }
  }

  // If there are ingredients not found in database, estimate price with Groq AI
  if (notFound.length > 0) {
    const now = Date.now();

    if (now < groqCircuit.disabledUntil) {
      for (const item of notFound) {
        item.message = "Price estimation temporarily unavailable";
      }
    } else {
      try {
        // De-dupe before asking Groq: the prompt asks it to skip repeated ingredients,
        // so sending duplicate lines (e.g. "kosher salt" appearing twice) shifts the
        // response array out of alignment with the request array.
        const uniqueNames = [...new Set(notFound.map((item) => item.ingredient))];
        const priceEstimates = await estimatePrice(uniqueNames, location); // Call the Groq AI service and send the name and location to get the estimate

        // Match estimates back to our own requested names by position rather than
        // trusting the model to echo the name back verbatim (it often strips
        // quantities/units), since our own name is what the frontend matches against.
        const estimateByName = new Map();
        uniqueNames.forEach((name, i) => {
          if (priceEstimates[i]) estimateByName.set(name, priceEstimates[i]);
        });

        for (const [name, estimate] of estimateByName.entries()) {
          // Upsert the new price estimate into the database, keyed by our own
          // normalized name so future exact-text lookups hit the cache.
          const { error: upsertError } = await supabase
            .from("ingredient_prices")
            .upsert(
              {
                name,
                price_min: estimate.min,
                price_max: estimate.max,
                unit_type: estimate.unit_type,
                base_unit: estimate.base_unit,
                last_updated: new Date(),
              },
              { onConflict: "name" },
            );
        }

        const stillNotFound = [];
        for (const item of notFound) {
          const estimate = estimateByName.get(item.ingredient);
          if (estimate) {
            totalMin += estimate.min;
            totalMax += estimate.max;
            found.push({
              ingredient: item.ingredient,
              min: estimate.min,
              max: estimate.max,
            });
          } else {
            item.message = "Price estimate unavailable right now";
            stillNotFound.push(item);
          }
        }

        notFound.length = 0;
        notFound.push(...stillNotFound);
        groqCircuit.consecutiveFailures = 0;
      } catch (err) {
        groqCircuit.consecutiveFailures += 1;
        const shouldDisable =
          isGroqRateLimitError(err) || groqCircuit.consecutiveFailures >= 3;

        if (shouldDisable) {
          groqCircuit.disabledUntil = Date.now() + GROQ_COOLDOWN_MS;
          groqCircuit.consecutiveFailures = 0;
        }

        for (const item of notFound) {
          item.message = isGroqRateLimitError(err)
            ? "Price estimation temporarily unavailable"
            : "Price estimate unavailable right now";
        }
      }
    }
  }

  // Return summary and breakdown to frontend
  return res.json({
    summary: {
      // Round to 2 decimal and parse the number to float
      totalMin: parseFloat(totalMin.toFixed(2)),
      totalMax: parseFloat(totalMax.toFixed(2)),
      // Return number of items in found and notFound arrays
      itemsFound: found.length,
    },
    breakdown: found, // Breakdown the found ingredients with their price
    notFound,
  });
}

module.exports = { getPriceEstimate };
