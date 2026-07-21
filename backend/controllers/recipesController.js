const { fetchFromEdamam } = require('../services/edamamService');
const { buildIngredientSearchUrlWithQuery, buildIngredientSearchUrlWithRecipeId, edamamAccountUser } = require('../config');

// Function to get multiple recipes based on a query and pagination parameters
async function getMultipleRecipes(req, res) {
    try {
        const page = req.query.page || 1;   // Default to page 1 if not provided
        const pageSize = req.query.pageSize || 10;  // Default to pageSize 10 if not provided
        const nextUrl = req.query.nextUrl ? decodeURIComponent(req.query.nextUrl) : null;
        const url = nextUrl || buildIngredientSearchUrlWithQuery(req.query.q, page, pageSize); // Build the URL with query and pagination parameters
        const data = await fetchFromEdamam(url, edamamAccountUser); // Fetch data from Edamam API

        // Calculate total pages and total hits for pagination
        const safePage = Math.max(1, Number(page) || 1); // Ensure page is at least 1
        const safePageSize = Math.max(1, Number(pageSize) || 10);   // Ensure pageSize is at least 1
        const totalHits = data.count || 0;  // Total number of hits returned by the API
        const totalPages = Math.max(1, Math.ceil(totalHits / safePageSize));    // Calculate total pages based on total hits and pageSize
        const limitedHits = Array.isArray(data.hits) ? data.hits.slice(0, safePageSize) : []; // Limit the hits to the requested pageSize

        res.json({  // Return the fetched data along with pagination information
            ...data,    // Spread the data returned from Edamam API
            hits: limitedHits, // Limit the hits to the requested pageSize
            page: safePage, // Current page number
            pageSize: safePageSize, // Current page size
            totalPages, // Total number of pages
            totalHits,   // Total number of hits
            nextPageUrl: data._links?.next?.href || null
        });
        
    } catch (err) { // Catch any errors that occur during the fetch process
        console.error(err);
        res.status(500).send('Error fetching data');
    }
}

// Function to get a single recipe's full details (including all ingredients) by its Edamam recipe ID
async function getRecipeById(req, res) {
    const recipeId = String(req.params?.id || '').trim();
    if (!recipeId) {
        return res.status(400).send('Bad Request: use "/recipes/:id"');
    }

    try {
        const url = buildIngredientSearchUrlWithRecipeId(recipeId);
        const data = await fetchFromEdamam(url, edamamAccountUser);

        const rawIngredients = data.recipe?.ingredients;
        if (!Array.isArray(rawIngredients)) {
            throw new TypeError(
                'Invalid response: object is not an array\n' +
                'data: ' + JSON.stringify(data, null, 2)
            );
        }

        res.json({
            id: recipeId,
            title: data.recipe.label,
            image: data.recipe.image,
            source: data.recipe.source,
            recipeUrl: data.recipe.url,
            ingredients: rawIngredients
        });

    } catch (err) {
        console.error(err);
        if (err instanceof TypeError)
            return res.status(502).send(err.message);
        return res.status(500).send('Error fetching data');
    }
}

module.exports = { getRecipes: getMultipleRecipes, getRecipeById };
