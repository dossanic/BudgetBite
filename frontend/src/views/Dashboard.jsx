import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import FavoriteButton from '../components/FavoriteButton';
const { dashboardStyles } = require('./dashboardStyles');
const { fetchRecipesWithBudgets, fetchRandomRecipes, fetchFavorites, addFavorite, removeFavorite } = require('../services/apiService');

function Dashboard({ user }) {
  const navigate = useNavigate();
  const [pantryList, setPantryList] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [randomRecipes, setRandomRecipes] = useState([]);
  const [randomLoading, setRandomLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [favoritedIds, setFavoritedIds] = useState(() => new Set());

  useEffect(() => {
    const loadRandomRecipes = async () => {
      try {
        const recipes = await fetchRandomRecipes(3);
        setRandomRecipes(recipes);
      } catch (err) {
        console.error("Dashboard Random Recipes Error:", err);
      } finally {
        setRandomLoading(false);
      }
    };

    loadRandomRecipes();
  }, []);

  useEffect(() => {
    fetchFavorites(user.id)
      .then((data) => setFavoritedIds(new Set((data.favorites || []).map((r) => r.id))))
      .catch((err) => console.error("Dashboard Favorites Fetch Error:", err));
  }, [user.id]);

  const toggleFavorite = (recipe) => {
    const isFavorited = favoritedIds.has(recipe.id);

    setFavoritedIds((prev) => {
      const next = new Set(prev);
      if (isFavorited) next.delete(recipe.id);
      else next.add(recipe.id);
      return next;
    });

    const request = isFavorited ? removeFavorite(user.id, recipe.id) : addFavorite(user.id, recipe);
    request.catch((err) => console.error("Dashboard Favorite Toggle Error:", err));
  };

  const addIngredient = (item) => setPantryList((prevList) => [...prevList, item]);
  const removeIngredient = (itemToRemove) => setPantryList((prevList) => prevList.filter(item => item !== itemToRemove));

  const handlePantryRecipeSearch = async () => {
    setHasSearched(true);
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

        {!randomLoading && !hasSearched && randomRecipes.length > 0 && (
          <div style={styles.gridSection}>
            <h3 style={styles.gridTitle}></h3>

            <div style={styles.grid}>
              {randomRecipes.map((recipe, index) => (
                <div
                  key={recipe.id || index}
                  style={{ ...styles.card, cursor: 'pointer' }}
                  className="bb-card"
                  onClick={() => navigate(`/recipes/${encodeURIComponent(recipe.id)}`, { state: { pantryList } })}
                >
                  <FavoriteButton
                    filled={favoritedIds.has(recipe.id)}
                    onToggle={() => toggleFavorite(recipe)}
                    overlay
                    style={{ position: 'absolute', top: '10px', right: '10px' }}
                  />
                  {recipe.image && (
                    <img src={recipe.image} alt={recipe.title} style={styles.image} />
                  )}
                  <h4 style={styles.recipeTitle}>{recipe.title || "Untitled Recipe"}</h4>
                  <p style={styles.recipeSource}>Source: <em>{recipe.source || "Unknown Source"}</em></p>
                  <a href={recipe.recipeUrl} target="_blank" rel="noopener noreferrer" style={styles.recipeLink} className="bb-link" onClick={(e) => e.stopPropagation()}>
                    View Full Recipe Instructions
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading && <p style={styles.loadingText}>🍊 Loading Recipes...</p>}
        {error && <p style={styles.errorText}>Error: {error}</p>}

        {!loading && recipes.length > 0 && (
          <div style={styles.gridSection}>
            <h3 style={styles.gridTitle}>Matching Recipes Found ({recipes.length})</h3>
            
            <div style={styles.grid}>
              {recipes.map((recipe, index) => (
                <div
                  key={recipe.id || index}
                  style={{ ...styles.card, cursor: 'pointer' }}
                  className="bb-card"
                  onClick={() => navigate(`/recipes/${encodeURIComponent(recipe.id)}`, { state: { pantryList } })}
                >
                  <FavoriteButton
                    filled={favoritedIds.has(recipe.id)}
                    onToggle={() => toggleFavorite(recipe)}
                    overlay
                    style={{ position: 'absolute', top: '10px', right: '10px' }}
                  />
                  {recipe.image && (
                    <img src={recipe.image} alt={recipe.title} style={styles.image} />
                  )}
                  <h4 style={styles.recipeTitle}>{recipe.title || "Untitled Recipe"}</h4>
                  <p style={styles.recipeSource}>Source: <em>{recipe.source || "Unknown Source"}</em></p>
                  <a href={recipe.recipeUrl} target="_blank" rel="noopener noreferrer" style={styles.recipeLink} className="bb-link" onClick={(e) => e.stopPropagation()}>
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