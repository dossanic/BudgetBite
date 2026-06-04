const { fetchFromEdamam } = require("../services/edamamService");
const { ingredientSearchUrl, edamamAccountUser } = require("../config");
const supabase = require("../supabaseClient");

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
  const { ingredients } = req.body;

  // Validate user input, check if ingredients exist, ingredients is array, and array is not empty
  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    // Return 400 bad request
    return res.status(400).json({
      error: "Please provide a list of ingredients",
    });
  }

  // Loop through all ingredients name, delete white space and convert to lowercase to avoid case sensitivity
  // map function will return a new array with the normalized ingredient names
  const normalizedIngredients = ingredients.map((name) =>
    name.trim().toLowerCase(),
  );

  // Query supabase database for the ingredients that match the normalized ingredient names
  const { data, error } = await supabase
    .from("ingredient_prices")
    .select("name, price_min, price_max")
    .in("name", normalizedIngredients);
  console.log(data);
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

  // Response to frontend
  return res.json({
    summary: {
      // Round to 2 decimal and parse the number to float
      totalMin: parseFloat(totalMin.toFixed(2)),
      totalMax: parseFloat(totalMax.toFixed(2)),
      // Return number of items in found and notFound arrays
      itemsFound: found.length,
      itemsNotFound: notFound.length,
    },
    breakdown: found, // Breakdown the found ingredients with their price
    notFound,
  });
}

module.exports = { getSingleRecipe, getPriceEstimate };
