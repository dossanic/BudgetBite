const { fetchFromEdamam } = require('../services/edamamService');
const { buildIngredientSearchUrlWithRecipeId, edamamAccountUser } = require('../config');

// Fetch ingredients THAT DO NOT CONTAIN QUERY PARAMS from the Edamam API and return to the client
async function getMissingIngredients(req, res) {
    // Require and validate recipe ID and query parameter(s)
    const recipeId = String(req.query?.recipe_id || '').trim(); // Edamam recipe ID

    // User inputted pantry terms, comma-separated (e.g. "milk,rice"). Normalize
    // and singular-strip each term independently so multi-item queries actually match.
    const queryTerms = String(req.query?.q || '')
        .trim()
        .toLowerCase()
        .split(',')
        .map((term) => term.trim())
        .filter(Boolean)
        .map((term) => {
            if (term.endsWith('es')) return term.slice(0, -2);
            if (term.endsWith('s')) return term.slice(0, -1);
            return term;
        });

    if (queryTerms.length === 0 || !recipeId) {
        return res.status(400).send('Bad Request: use "/missing-ingredients?recipe_id=[recipeId]&q=[ingredients]"');
    }

    try {
        // Build URL and fetch data from Edamam API
        const url = buildIngredientSearchUrlWithRecipeId(recipeId);
        const data = await fetchFromEdamam(url, edamamAccountUser);

        // Require ingredients field in response
        const rawIngredients = data.recipe?.ingredients;
        if (!Array.isArray(rawIngredients)) {
            throw new TypeError (
                'Invalid response: object is not an array\n' +
                'data: ' + JSON.stringify(data, null, 2)
            );
        }

        // Remove ingredients that contain any of the query terms
        const filteredIngredients = rawIngredients.filter(ingredient => {
            const ingredientText = String(ingredient.text || '').toLowerCase();
            return !queryTerms.some((term) => ingredientText.includes(term));
        });

        // Return ingredients list to client
        return res.json({ ingredients: filteredIngredients });

    } catch (err) {
        console.error(err);
        if (err instanceof TypeError)
            return res.status(502).send(err.message);
        return res.status(500).send('Error fetching data because reasons');
    }
}

module.exports = { getMissingIngredients };