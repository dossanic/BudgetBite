// src/services/apiService.js

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Extracts the clean alphanumeric ID out of an Edamam URI string
 */
const extractRecipeId = (uri) => {
  if (!uri) return '';
  const parts = uri.split('#recipe_');
  return parts.length > 1 ? parts[1] : '';
};

/**
 * Executes the entire end-to-end multi-controller search and budget mapping pipeline.
 */
const fetchRecipesWithBudgets = async (pantryList) => {
  if (!pantryList || pantryList.length === 0) return [];

  const combinedQuery = pantryList.join(',');

  // ==========================================
  // CONTROLLER 1: Get Recipes (Max)
  // ==========================================
  const recipeResponse = await fetch(`${API_BASE_URL}/recipes?q=${encodeURIComponent(combinedQuery)}`);
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
          // ==========================================
          // CONTROLLER 2: Filter Missing Items (Max)
          // ==========================================
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

      // ==========================================
      // CONTROLLER 3: Calculate Budget (Ha)
      // ==========================================
      if (missingIngredientsList.length > 0) {
        try {
          const priceResponse = await fetch(`${API_BASE_URL}/ingredients/price-estimate`, {
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

  return fullyProcessedRecipes;
};

// CHANGED: Exporting using CommonJS style to keep your Webpack loader happy
module.exports = { fetchRecipesWithBudgets };