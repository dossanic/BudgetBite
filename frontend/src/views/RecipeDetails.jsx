import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
const { recipeDetailsStyles } = require('./recipeDetailsStyles');
const { fetchRecipeDetails } = require('../services/apiService');

// Finds the price entry matching an ingredient's text (normalized), if any
function findPriceForIngredient(ingredientText, priceBreakdown) {
  const normalized = (ingredientText || '').trim().toLowerCase();
  return priceBreakdown.find((entry) => (entry.ingredient || '').trim().toLowerCase() === normalized);
}

function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setRecipe(null);

    fetchRecipeDetails(id)
      .then((data) => setRecipe(data))
      .catch((err) => {
        console.error("Recipe Details Fetch Error:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const styles = recipeDetailsStyles;

  return (
    <section style={styles.container}>
      <div style={styles.contentWrapper}>
        <button onClick={() => navigate(-1)} style={styles.backButton} className="bb-text-link">
          ← Back
        </button>

        {loading && <p style={styles.loadingText}>🍊 Loading Recipe...</p>}
        {error && <p style={styles.errorText}>Error: {error}</p>}

        {!loading && !error && recipe && (
          <div style={styles.panel}>
            {recipe.image && <img src={recipe.image} alt={recipe.title} style={styles.image} />}
            <h2 style={styles.title}>{recipe.title || "Untitled Recipe"}</h2>
            <p style={styles.source}>Source: <em>{recipe.source || "Unknown Source"}</em></p>

            <div>
              <a href={recipe.recipeUrl} target="_blank" rel="noopener noreferrer" style={styles.link} className="bb-link">
                View Full Recipe Instructions
              </a>
            </div>

            <p style={styles.costSummary}>
              Estimated Total Cost: ${recipe.priceSummary.totalMin.toFixed(2)} – ${recipe.priceSummary.totalMax.toFixed(2)}
            </p>

            <h3 style={styles.sectionTitle}>Ingredients</h3>
            <ul style={styles.ingredientList}>
              {recipe.ingredients.map((ingredient, index) => {
                const priceEntry = findPriceForIngredient(ingredient.text, recipe.priceBreakdown);
                return (
                  <li key={index} style={styles.ingredientItem}>
                    <span style={styles.ingredientText}>{ingredient.text}</span>
                    <span style={styles.ingredientPrice}>
                      {priceEntry ? `$${priceEntry.min.toFixed(2)} – $${priceEntry.max.toFixed(2)}` : 'Price unavailable'}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

export default RecipeDetails;
