import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
const { dashboardStyles } = require('./dashboardStyles');
const { fetchRecipesWithBudgets } = require('../services/apiService');

function Dashboard() {
  const [pantryList, setPantryList] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addIngredient = (item) => setPantryList((prevList) => [...prevList, item]);
  const removeIngredient = (itemToRemove) => setPantryList((prevList) => prevList.filter(item => item !== itemToRemove));

  const handlePantryRecipeSearch = async () => {
    setLoading(true);
    setError(null);
    setRecipes([]);

    try {
      const result = await fetchRecipesWithBudgets(pantryList, { page: 1, pageSize: 10 }); // Fetch recipes based on the current pantry list with pagination options
      setRecipes(result.recipes || []); // Update the recipes state with the fetched recipes, defaulting to an empty array if none are returned
    } catch (err) {
      console.error("Dashboard Pipeline Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const styles = dashboardStyles;

  return (
    <section style={styles.container}>
      {/* 👇 Added centering layout node */}
      <div style={styles.contentWrapper}>
        <h2 style={styles.heading}>Dashboard</h2>
        <p style={styles.subtitle}>Welcome to your CheapChomp Dashboard! Manage your pantry and discover recipes based on ingredients you have on hand.</p>

        <div style={styles.panel}>
          <SearchBar
            pantryList={pantryList}
            onAddIngredient={addIngredient}
            onRemoveIngredient={removeIngredient}
            onTriggerSearch={handlePantryRecipeSearch}
          />
        </div>

        {loading && <p style={styles.loadingText}>🍊 Loading Recipes...</p>}
        {error && <p style={styles.errorText}>Error: {error}</p>}

        {!loading && recipes.length > 0 && (
          <div style={styles.gridSection}>
            <h3 style={styles.gridTitle}>Matching Recipes Found ({recipes.length})</h3>
            
            <div style={styles.grid}>
              {recipes.map((recipe, index) => (
                <div key={recipe.id || index} style={styles.card} className="bb-card">
                  {recipe.image && (
                    <img src={recipe.image} alt={recipe.title} style={styles.image} />
                  )}
                  <h4 style={styles.recipeTitle}>{recipe.title || "Untitled Recipe"}</h4>
                  <p style={styles.recipeSource}>Source: <em>{recipe.source || "Unknown Source"}</em></p>
                  <a href={recipe.recipeUrl} target="_blank" rel="noopener noreferrer" style={styles.recipeLink} className="bb-link">
                    View Full Recipe Instructions
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && recipes.length === 0 && pantryList.length > 0 && !error && (
          <p style={styles.placeholder}>Click "Find Recipes Matching My Pantry" to view available options.</p>
        )}
      </div>
    </section>
  );
}

export default Dashboard;