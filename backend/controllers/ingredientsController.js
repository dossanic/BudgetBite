const { fetchFromEdamam } = require("../services/edamamService");
const { ingredientSearchUrl, edamamAccountUser } = require("../config");
const supabase = require("../supabaseClient");

// Fetch ingredients from the Edamam API and return to the client
async function getIngredients(req, res) {
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

  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({
      error: "Please provide a list of ingredients!",
    });
  }

  const normalizedIngredients = ingredients.map((name) =>
    name.trim().toLowerCase(),
  );

  const { data, error } = await supabase
    .from("ingredient_prices")
    .select("name, price_min, price_max")
    .in("name", normalizedIngredients);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  let totalMin = 0;
  let totalMax = 0;
  const found = [];
  const notFound = [];

  for (const ingredient of normalizedIngredients) {
    const match = data.find((row) => row.name === ingredient);
    if (match) {
      totalMin += parseFloat(match.price_min);
      totalMax += parseFloat(match.price_max);
      found.push({
        ingredient: match.name,
        min: parseFloat(match.price_min),
        max: parseFloat(match.price_max),
      });
    } else {
      notFound.push(ingredient);
    }
  }

  return res.json({
    summary: {
      totalMin: parseFloat(totalMin.toFixed(2)),
      totalMax: parseFloat(totalMax.toFixed(2)),
      itemsFound: found.length,
      itemsNotFound: notFound.length,
    },
    breakdown: found,
    notFound,
  });
}

module.exports = { getIngredients, getPriceEstimate };
