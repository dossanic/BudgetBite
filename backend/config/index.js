require('dotenv').config({ path: '../.env' });

// API credentials
const apiId = process.env.API_ID;
const apiKey = process.env.API_KEY;
const apiUrl = process.env.ENDPOINT_URL;
const edamamAccountUser = apiId; // Edamam uses the same value for app_id and Edamam-Account-User

// Function to build ingredient search URL with query parameter
function buildIngredientSearchUrlWithQuery(query, page = 1, pageSize = 10) {  // Default to page 1 and pageSize 10 if not provided
  const safePage = Math.max(1, Number(page) || 1); // Ensure page is at least 1
  const safePageSize = Math.max(1, Number(pageSize) || 10); // Ensure pageSize is at least 1
  const from = (safePage - 1) * safePageSize; // Calculate the starting index for pagination

  const params = new URLSearchParams({
    type: 'public',
    q: query || 'recipes', // Default to 'recipes' if query is empty
    app_id: apiId,
    app_key: apiKey,
    from: String(from), // Set the starting index for pagination
    to: String(from + safePageSize) // Calculate the ending index for pagination
  });

  // Specify the fields to retrieve from the API
  params.append('field', 'label');
  params.append('field', 'image');
  params.append('field', 'source');
  params.append('field', 'url');
  params.append('field', 'uri');
  params.append('field', 'ingredients');
  params.append('field', 'ingredientLines');
  
  return `${apiUrl}?${params.toString()}`; // Return the full URL for the API request
}

// Function to build ingredient search URL with recipe ID
function buildIngredientSearchUrlWithRecipeId(recipeId) {
  const params = new URLSearchParams({
    type: 'public',
    app_id: apiId,
    app_key: apiKey
  });

  // Specify the fields to retrieve from the API
  params.append('field', 'label');
  params.append('field', 'image');
  params.append('field', 'source');
  params.append('field', 'url');
  params.append('field', 'ingredients');

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
