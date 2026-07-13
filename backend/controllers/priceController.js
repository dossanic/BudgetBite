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
  const { ingredients, location = "Toronto, Ontario" } = req.body; // Require an array of ingredient names and an optional location from the request body

  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({
      error: "Please provide a list of ingredients",
    });
  }

  // Loop through all ingredients name, delete white space and convert to lowercase to avoid case sensitivity
  // map function will return a new array with the normalized ingredient names, we will use this array to query the database
  const normalizedIngredients = ingredients.map((name) => name.trim().toLowerCase());

  let data = [];
  let supabaseError = null;

  try {
    const response = await supabase // Query supabase database for the ingredients that match the normalized ingredient names
      .from("ingredient_prices")
      .select("name, price_min, price_max")
      .in("name", normalizedIngredients);

    data = response.data || []; // If no data is returned, default to an empty array
    supabaseError = response.error; // If there is an error, store it in supabaseError to handle it later
  } catch (err) {
    supabaseError = err;
  }

  // Initalize variables and array to store results
  let totalMin = 0;
  let totalMax = 0;
  const found = [];
  const notFound = [];

  if (supabaseError) {
    for (const ingredient of normalizedIngredients) {
      notFound.push({
        ingredient,
        message: "Price lookup unavailable right now",
      });
    }
  } else {
    for (const ingredient of normalizedIngredients) {
      const match = data.find((row) => row.name === ingredient);

    // If found the ingredient add the price to the total variables
    // Supabase will return price as string so we need to parse it to float for calculation
    if (match) {
      totalMin += parseFloat(match.price_min);
      totalMax += parseFloat(match.price_max);

      // Push the ingredient and price to the found array
      found.push({
        ingredient: match.name,
        min: parseFloat(match.price_min),
        max: parseFloat(match.price_max),
      });
    }

    // If not found push the ingredient to the notFound array
    else {
      notFound.push({
        ingredient,
        message: "Price not available in our database",
      });
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
        const notFoundName = notFound.map((item) => item.ingredient);
        const priceEstimates = await estimatePrice(notFoundName, location);

        for (const estimate of priceEstimates || []) {
          totalMin += estimate.min;
          totalMax += estimate.max;

          found.push({
            ingredient: estimate.ingredient,
            min: estimate.min,
            max: estimate.max,
          });
        }

        notFound.length = 0;
        groqCircuit.consecutiveFailures = 0;
      } catch (err) {
        groqCircuit.consecutiveFailures += 1;
        const shouldDisable = isGroqRateLimitError(err) || groqCircuit.consecutiveFailures >= 3;

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
}

module.exports = { getPriceEstimate };
