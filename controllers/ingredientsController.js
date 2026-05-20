const { fetchFromEdamam } = require('../services/edamamService');
const { ingredientSearchUrl, edamamAccountUser } = require('../config');

// Fetch ingredients from the Edamam API and return to the client
async function getIngredients(req, res) {
    try {
        const data = await fetchFromEdamam(ingredientSearchUrl, edamamAccountUser);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching data');
    }
}

module.exports = { getIngredients };
