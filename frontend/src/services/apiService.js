const API_BASE_URL = 'http://localhost:3000'; // Backend server URL

// Function to extract recipe ID from the URI
const extractRecipeId = (uri) => { 
  if (!uri) return ''; // Return an empty string if the URI is not provided
  const parts = uri.split('#recipe_'); // Split the URI to extract the recipe ID
  return parts.length > 1 ? parts[1] : ''; // Return the recipe ID if found, otherwise return an empty string
};

// Function to fetch recipes based on pantry ingredients and budget information
const fetchRecipesWithBudgets = async (pantryList, options = {}) => {
  if (!pantryList || pantryList.length === 0) return { recipes: [], pagination: { page: 1, pageSize: 10, totalPages: 1, totalHits: 0 } }; // Return an empty result if the pantry list is empty or not provided

  const combinedQuery = pantryList.join(','); // Combine pantry ingredients into a single query string
  const page = options.page || 1;             // Default to page 1 if not provided
  const pageSize = options.pageSize || 10;    // Default to pageSize 10 if not provided
  const nextUrl = options.nextUrl ? encodeURIComponent(options.nextUrl) : ''; // Encode the next page URL if provided
  const sortMode = options.sortMode || 'random'; // Default to 'random' sort mode if not provided
  const requestPageSize = sortMode === 'az' ? 100 : pageSize; // If sorting alphabetically, request a larger page size to ensure enough results for sorting

  const recipeResponse = await fetch(`${API_BASE_URL}/recipes?q=${encodeURIComponent(combinedQuery)}&page=${page}&pageSize=${requestPageSize}${nextUrl ? `&nextUrl=${nextUrl}` : ''}`); // Fetch recipes from the backend server with query parameters for pantry ingredients, pagination, and next page URL
  if (!recipeResponse.ok) throw new Error('Failed to fetch recipes from server.'); // Throw an error if the response is not OK
  
  const recipeData = await recipeResponse.json(); // Parse the JSON response from the server
  const extractedRecipes = recipeData.hits || []; // Extract the recipe hits from the response, defaulting to an empty array if not found

  // Process each recipe to fetch missing ingredients and budget information
  const fullyProcessedRecipes = await Promise.all(
    extractedRecipes.map(async (hit) => {
      const currentRecipe = hit.recipe;
      const recipeId = extractRecipeId(currentRecipe.uri);

      // Initialize missing ingredients list and budget data
      let missingIngredientsList = [];
      let budgetData = { summary: { totalMin: 0, totalMax: 0 } };

      // Fetch missing ingredients for the recipe if a recipe ID is available
      if (recipeId) {
        try {

          // Fetch missing ingredients from the backend server using the recipe ID and combined pantry query
          const missingResponse = await fetch(
            `${API_BASE_URL}/missing-ingredients?recipe_id=${recipeId}&q=${encodeURIComponent(combinedQuery)}`
          );

          // If the response is OK, parse the JSON and extract the missing ingredients
          if (missingResponse.ok) {
            const missingData = await missingResponse.json();
            missingIngredientsList = (missingData.ingredients || []).map(item => item.text || '');
          }
        } catch (err) {
          console.error(`Error parsing missing items for recipe ${recipeId}:`, err);
        }
      }

      if (missingIngredientsList.length === 0) {
        missingIngredientsList = currentRecipe.ingredientLines || [];
      }

      if (missingIngredientsList.length > 0) {
        try {
          const priceResponse = await fetch(`${API_BASE_URL}/ingredients/price`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ingredients: missingIngredientsList })
          });

          if (priceResponse.ok) {
            budgetData = await priceResponse.json();
          }
        } catch (err) {
          console.error('Error fetching price parameters:', err);
        }
      }

      // Return the fully processed recipe object with all necessary information
      return {
        id: recipeId || currentRecipe.uri,  // Use recipe ID if available, otherwise fallback to the URI
        title: currentRecipe.label,         // Recipe title
        image: currentRecipe.image,         // Recipe image URL
        source: currentRecipe.source,       // Recipe source name
        recipeUrl: currentRecipe.url,       // Recipe URL for full instructions
        missingIngredients: missingIngredientsList, // List of missing ingredients
        costMin: budgetData.summary?.totalMin || 0, // Minimum cost of missing ingredients
        costMax: budgetData.summary?.totalMax || 0  // Maximum cost of missing ingredients
      };
    })
  );

  // Return the fully processed recipes along with pagination information
  return {
    recipes: fullyProcessedRecipes, // Return the array of fully processed recipes
    pagination: {                   // Return pagination information
      page: recipeData.page || page, // Current page number, defaulting to the requested page if not provided
      pageSize: recipeData.pageSize || pageSize, // Current page size, defaulting to the requested pageSize if not provided
      totalPages: recipeData.totalPages || 1, // Total number of pages, defaulting to 1 if not provided
      totalHits: recipeData.totalHits || 0, // Total number of hits, defaulting to 0 if not provided
      nextPageUrl: recipeData.nextPageUrl || null // URL for the next page of results, defaulting to null if not provided
    }
  };
};

// Function to fetch a plain list of recipes (no per-recipe missing-ingredients/price calls) --
// use this instead of fetchRecipesWithBudgets when the caller won't display cost info,
// since that function fires two extra network calls (one of which can hit Groq) per recipe.
const fetchRecipesList = async (query, options = {}) => {
  const page = options.page || 1;
  const pageSize = options.pageSize || 10;
  const nextUrl = options.nextUrl ? encodeURIComponent(options.nextUrl) : '';
  const sortMode = options.sortMode || 'random';
  const requestPageSize = sortMode === 'az' ? 100 : pageSize; // Match fetchRecipesWithBudgets so A-Z accumulation still works

  const recipeResponse = await fetch(`${API_BASE_URL}/recipes?q=${encodeURIComponent(query)}&page=${page}&pageSize=${requestPageSize}${nextUrl ? `&nextUrl=${nextUrl}` : ''}`);
  if (!recipeResponse.ok) throw new Error('Failed to fetch recipes from server.');

  const recipeData = await recipeResponse.json();
  const extractedRecipes = recipeData.hits || [];

  const recipes = extractedRecipes.map((hit) => {
    const currentRecipe = hit.recipe;
    const recipeId = extractRecipeId(currentRecipe.uri);

    return {
      id: recipeId || currentRecipe.uri,
      title: currentRecipe.label,
      image: currentRecipe.image,
      source: currentRecipe.source,
      recipeUrl: currentRecipe.url
    };
  });

  return {
    recipes,
    pagination: {
      page: recipeData.page || page,
      pageSize: recipeData.pageSize || pageSize,
      totalPages: recipeData.totalPages || 1,
      totalHits: recipeData.totalHits || 0,
      nextPageUrl: recipeData.nextPageUrl || null
    }
  };
};

// Function to fetch a random sample of recipes (e.g. for dashboard "recipe ideas")
const fetchRandomRecipes = async (count = 3) => {
  const recipeResponse = await fetch(`${API_BASE_URL}/recipes?pageSize=20`); // Fetch a batch of generic recipes from the backend
  if (!recipeResponse.ok) throw new Error('Failed to fetch recipes from server.');

  const recipeData = await recipeResponse.json();
  const extractedRecipes = recipeData.hits || [];

  const mappedRecipes = extractedRecipes.map((hit) => {
    const currentRecipe = hit.recipe;
    const recipeId = extractRecipeId(currentRecipe.uri);

    return {
      id: recipeId || currentRecipe.uri,
      title: currentRecipe.label,
      image: currentRecipe.image,
      source: currentRecipe.source,
      recipeUrl: currentRecipe.url
    };
  });

  // Shuffle (Fisher-Yates) and take the first `count`
  for (let i = mappedRecipes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mappedRecipes[i], mappedRecipes[j]] = [mappedRecipes[j], mappedRecipes[i]];
  }

  return mappedRecipes.slice(0, count);
};

// Function to fetch a single recipe's full details, including all ingredients and price estimates
const fetchRecipeDetails = async (recipeId) => {
  const recipeResponse = await fetch(`${API_BASE_URL}/recipes/${encodeURIComponent(recipeId)}`);
  if (!recipeResponse.ok) throw new Error('Failed to fetch recipe details from server.');

  const recipe = await recipeResponse.json();
  const ingredients = recipe.ingredients || [];
  const ingredientTexts = ingredients.map((item) => item.text || '').filter(Boolean);

  let priceSummary = { totalMin: 0, totalMax: 0 };
  let priceBreakdown = [];
  let notFound = [];

  if (ingredientTexts.length > 0) {
    try {
      const priceResponse = await fetch(`${API_BASE_URL}/ingredients/price`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: ingredientTexts })
      });

      if (priceResponse.ok) {
        const budgetData = await priceResponse.json();
        priceSummary = { totalMin: budgetData.summary?.totalMin || 0, totalMax: budgetData.summary?.totalMax || 0 };
        priceBreakdown = budgetData.breakdown || [];
        notFound = budgetData.notFound || [];
      }
    } catch (err) {
      console.error('Error fetching price estimates for recipe details:', err);
    }
  }

  return {
    id: recipe.id,
    title: recipe.title,
    image: recipe.image,
    source: recipe.source,
    recipeUrl: recipe.recipeUrl,
    ingredients,
    priceSummary,
    priceBreakdown,
    notFound
  };
};

// Function to fetch a user's favorited recipes, or check whether one specific recipe is favorited
const fetchFavorites = async (userId, recipeId = null) => {
  const url = `${API_BASE_URL}/favorites?user_id=${encodeURIComponent(userId)}${recipeId ? `&recipe_id=${encodeURIComponent(recipeId)}` : ''}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch favorites.');
  return response.json(); // { favorites: [...] } or { favorited: boolean }
};

// Function to favorite a recipe
const addFavorite = async (userId, recipe) => {
  const response = await fetch(`${API_BASE_URL}/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, recipe })
  });
  if (!response.ok) throw new Error('Failed to save favorite.');
  return response.json();
};

// Function to unfavorite a recipe
const removeFavorite = async (userId, recipeId) => {
  const response = await fetch(`${API_BASE_URL}/favorites?user_id=${encodeURIComponent(userId)}&recipe_id=${encodeURIComponent(recipeId)}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to remove favorite.');
  return response.json();
};

module.exports = { fetchRecipesWithBudgets, fetchRecipesList, fetchRandomRecipes, fetchRecipeDetails, fetchFavorites, addFavorite, removeFavorite };
