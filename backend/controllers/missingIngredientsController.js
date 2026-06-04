const { fetchFromEdamam } = require('../services/edamamService');
const { buildIngredientSearchUrlWithRecipeId, edamamAccountUser } = require('../config');

// Fetch ingredients THAT DO NOT CONTAIN QUERY PARAMS from the Edamam API and return to the client
// TODO: Fix rawIngredients not being array (or maybe frontend needs to add recipe ID?)
async function getMissingIngredients(req, res) {
    // Require and validate recipe ID and query parameter(s)
    const recipeId = String(req.query?.recipe_id || '').trim();
    const ingredient_query = String(req.query?.q || '').trim().toLowerCase();
    if (!ingredient_query || !recipeId) {
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

        // Remove ingredients that contain the query term
        // console.log('Raw ingredients:', rawIngredients);
        const filteredIngredients = rawIngredients.filter(ingredient => {
            const ingredientText = String(ingredient.text || '').toLowerCase();   
            return !ingredientText.includes(ingredient_query);
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