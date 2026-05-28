const { fetchFromEdamam } = require('../services/edamamService');
const { recipeSearchUrl, edamamAccountUser } = require('../config');

// Fetch recipes from the Edamam API and return to the client
async function getMultipleRecipes(req, res) {
    try {
        const data = await fetchFromEdamam(recipeSearchUrl, edamamAccountUser);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching data');
    }
}

module.exports = { getRecipes: getMultipleRecipes };
