const { fetchFromEdamam } = require("../services/edamamService");
const { ingredientSearchUrl, edamamAccountUser } = require("../config");
const supabase = require("../supabaseClient");
const { estimatePrice } = require("../services/groqService");

// Fetch ingredients from the Edamam API and return to the client
async function getSingleRecipe(req, res) {
  try {
    const data = await fetchFromEdamam(ingredientSearchUrl, edamamAccountUser);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data");
  }
}

// Calculate min/max price for missing ingredients
async function getPriceEstimate(req, res) {
  const { ingredients, location } = req.body; // Require an array of ingredient names and a location from frontend

  // Validate user input, check if ingredients exist, ingredients is array, and array is not empty
  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    // Return a status 400 for bad request
    return res.status(400).json({
      error: "Please provide a list of ingredients and a location", // An error message to inform about the issue
    });
  }

  // Loop through all ingredients name, delete white space and convert to lowercase to avoid case sensitivity
  // map function will return a new array with the normalized ingredient names, we will use this array to query the database
  const normalizedIngredients = ingredients.map((name) =>
    name.trim().toLowerCase(),
  );

  // Query supabase database for the ingredients that match the normalized ingredient names
  const { data, error } = await supabase
    .from("ingredient_prices")
    .select("name, price_min, price_max")
    .in("name", normalizedIngredients);
  // If error return 500 with error message
  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // Initalize variables and array to store results
  let totalMin = 0;
  let totalMax = 0;
  const found = [];
  const notFound = [];

  // Create a loop through normalizedIngredients
  for (const ingredient of normalizedIngredients) {
    // Find the ingredient in the database response
    // find function will return the first element in the array that match the condition, for this one
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
    const notFoundName = notFound.map((item) => item.ingredient); // Get the name of the ingredients not in the database
    const priceEstimates = await estimatePrice(notFoundName, location); // Call the Groq AI service and send the name and location to get the estimate

    // Loop through the priceEstimates and add the price to the total
    for (const estimate of priceEstimates) {
      totalMin += estimate.min;
      totalMax += estimate.max;

      // Push the ingredient and price to the found array
      found.push({
        ingredient: estimate.ingredient,
        min: estimate.min,
        max: estimate.max,
      });
    }
    // clear the notFound array after get all the estimate from Groq AI
    notFound.length = 0;
  }

  // Response to frontend
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

module.exports = { getSingleRecipe, getPriceEstimate };
