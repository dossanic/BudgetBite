require('dotenv').config();

// API credentials
const apiId = process.env.API_ID;
const apiKey = process.env.API_KEY;
const apiUrl = process.env.ENDPOINT_URL;
const edamamAccountUser = apiId; // Edamam uses the same value for app_id and Edamam-Account-User

// Query parameters for Recipe Search
// const recipeSearchParams = new URLSearchParams({
//     type: 'public',
//     q: 'chicken',
//     field: ['ingredients'],

//     // Credentials
//     app_id: apiId,
//     app_key: apiKey
// });

// Recipe ID for ingredient search
// const recipeId = 'fac0fed123103b648c8d6c46353cf8a5'; // Example recipe ID for ingredient search

// Full API URL
// const recipeSearchUrl = `${apiUrl}?${recipeSearchParams.toString()}`;
// const recipeReturnUrl = `${apiUrl}/${recipeId}?${recipeSearchParams.toString()}`;

// Function to build ingredient search URL with query parameter
function buildIngredientSearchUrlWithQuery(query) {
  const params = new URLSearchParams({
    type: 'public',
    q: query,
    //field: 'ingredients',
    app_id: apiId,
    app_key: apiKey
  });

  params.append('field', 'label');
  params.append('field', 'image');
  params.append('field', 'source');
  params.append('field', 'url');
  params.append('field', 'uri');
  params.append('field', 'ingredients');
  params.append('field', 'ingredientLines');
  
  return `${apiUrl}?${params.toString()}`;
}

// Function to build ingredient search URL with recipe ID
function buildIngredientSearchUrlWithRecipeId(recipeId) {
  const params = new URLSearchParams({
    type: 'public',
    field: 'ingredients',
    app_id: apiId,
    app_key: apiKey
  });

  return `${apiUrl}/${recipeId}?${params.toString()}`;
}

module.exports = {
    port: process.env.PORT || 3000,
    buildIngredientSearchUrlWithQuery,
    buildIngredientSearchUrlWithRecipeId,
    // recipeSearchUrl,
    // ingredientSearchUrl: recipeReturnUrl,
    edamamAccountUser
};
