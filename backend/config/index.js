require('dotenv').config();

// API credentials
const apiId = process.env.API_ID;
const apiKey = process.env.API_KEY;
const apiUrl = process.env.ENDPOINT_URL;
const edamamAccountUser = apiId; // Edamam uses the same value for app_id and Edamam-Account-User

// TODO: Combine these params into one object
// const searchParams 

// Query parameters for Recipe Search
const recipeSearchParams = new URLSearchParams({
    type: 'public',
    q: 'chicken',
    app_id: apiId,
    app_key: apiKey,
});

// Query parameters for ingredient search
const recipeId = 'fac0fed123103b648c8d6c46353cf8a5'; // Example recipe ID for ingredient search
const ingredientSearchParams = new URLSearchParams({
    type: 'public',
    app_id: apiId,
    app_key: apiKey,
});

// Full API URL
const recipeSearchUrl = `${apiUrl}?${recipeSearchParams.toString()}`;
const recipeReturnUrl = `${apiUrl}/${recipeId}?${ingredientSearchParams.toString()}`;

module.exports = {
    port: process.env.PORT || 3000,
    recipeSearchUrl,
    ingredientSearchUrl: recipeReturnUrl,
    edamamAccountUser
};
