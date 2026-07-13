const API_BASE_URL = 'http://localhost:3000'; // Adjusted to backend server URL

const extractRecipeId = (uri) => {
  if (!uri) return '';
  const parts = uri.split('#recipe_');
  return parts.length > 1 ? parts[1] : '';
};

const fetchRecipesWithBudgets = async (pantryList, options = {}) => {
  if (!pantryList || pantryList.length === 0) return { recipes: [], pagination: { page: 1, pageSize: 10, totalPages: 1, totalHits: 0 } };

  const combinedQuery = pantryList.join(',');
  const page = options.page || 1;
  const pageSize = options.pageSize || 10;
  const nextUrl = options.nextUrl ? encodeURIComponent(options.nextUrl) : '';

  const recipeResponse = await fetch(`${API_BASE_URL}/recipes?q=${encodeURIComponent(combinedQuery)}&page=${page}&pageSize=${pageSize}${nextUrl ? `&nextUrl=${nextUrl}` : ''}`);
  if (!recipeResponse.ok) throw new Error('Failed to fetch recipes from server.');
  
  const recipeData = await recipeResponse.json();
  const extractedRecipes = recipeData.hits || [];

  // Map and chain through every recipe found
  const fullyProcessedRecipes = await Promise.all(
    extractedRecipes.map(async (hit) => {
      const currentRecipe = hit.recipe;
      const recipeId = extractRecipeId(currentRecipe.uri);

      let missingIngredientsList = [];
      let budgetData = { summary: { totalMin: 0, totalMax: 0 } };

      if (recipeId) {
        try {

          const missingResponse = await fetch(
            `${API_BASE_URL}/missing-ingredients?recipe_id=${recipeId}&q=${encodeURIComponent(combinedQuery)}`
          );

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

      return {
        id: recipeId || currentRecipe.uri,
        title: currentRecipe.label,
        image: currentRecipe.image,
        source: currentRecipe.source,
        recipeUrl: currentRecipe.url,
        missingIngredients: missingIngredientsList, 
        costMin: budgetData.summary?.totalMin || 0,
        costMax: budgetData.summary?.totalMax || 0
      };
    })
  );

  return {
    recipes: fullyProcessedRecipes,
    pagination: {
      page: recipeData.page || page,
      pageSize: recipeData.pageSize || pageSize,
      totalPages: recipeData.totalPages || 1,
      totalHits: recipeData.totalHits || 0,
      nextPageUrl: recipeData.nextPageUrl || null
    }
  };
};

module.exports = { fetchRecipesWithBudgets };
