const { fetchFromEdamam } = require('../services/edamamService');
const { buildIngredientSearchUrlWithQuery, edamamAccountUser } = require('../config');

// Fetch recipes from the Edamam API and return to the client
async function getMultipleRecipes(req, res) {
    try {
        const url = buildIngredientSearchUrlWithQuery(req.query.q);
        const data = await fetchFromEdamam(url, edamamAccountUser);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching data');
    }
}

module.exports = { getRecipes: getMultipleRecipes };
