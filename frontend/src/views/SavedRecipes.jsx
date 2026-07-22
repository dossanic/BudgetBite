import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FavoriteButton from '../components/FavoriteButton';
const { savedRecipesStyles } = require('./savedRecipesStyles');
const { fetchFavorites, removeFavorite } = require('../services/apiService');

function SavedRecipes({ user }) {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchFavorites(user.id)
      .then((data) => setFavorites(data.favorites || []))
      .catch((err) => {
        console.error("Saved Recipes Fetch Error:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [user.id]);

  const handleUnfavorite = (recipeId) => {
    setFavorites((prev) => prev.filter((recipe) => recipe.id !== recipeId));
    removeFavorite(user.id, recipeId).catch((err) => console.error("Saved Recipes Unfavorite Error:", err));
  };

  const styles = savedRecipesStyles;

  return (
    <section style={styles.container}>
      <div style={styles.contentWrapper}>
        <h2 style={styles.heading}>Saved Recipes</h2>
        <p style={styles.subtitle}>All the recipes you've favorited, in one place.</p>

        {loading && <p style={styles.loadingText}>🍊 Loading Saved Recipes...</p>}
        {error && <p style={styles.errorText}>Error: {error}</p>}

        {!loading && !error && favorites.length === 0 && (
          <p style={styles.empty}>No saved recipes yet. Tap the heart on any recipe to save it here.</p>
        )}

        {!loading && favorites.length > 0 && (
          <div style={styles.grid}>
            {favorites.map((recipe, index) => (
              <div
                key={recipe.id || index}
                style={{ ...styles.card, cursor: 'pointer' }}
                className="bb-card"
                onClick={() => navigate(`/recipes/${encodeURIComponent(recipe.id)}`)}
              >
                <FavoriteButton
                  filled
                  onToggle={() => handleUnfavorite(recipe.id)}
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
        )}
      </div>
    </section>
  );
}

export default SavedRecipes;
