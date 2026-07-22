import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import FavoriteButton from '../components/FavoriteButton';
const { recipeDetailsStyles } = require('./recipeDetailsStyles');
const { fetchRecipeDetails, fetchFavorites, addFavorite, removeFavorite } = require('../services/apiService');

// Finds the price entry matching an ingredient's text (normalized), if any
function findPriceForIngredient(ingredientText, priceBreakdown) {
  const normalized = (ingredientText || '').trim().toLowerCase();
  return priceBreakdown.find((entry) => (entry.ingredient || '').trim().toLowerCase() === normalized);
}

// Normalizes a pantry term the same way the backend does (trim/lowercase + singular-strip)
function normalizePantryTerm(term) {
  const normalized = String(term || '').trim().toLowerCase();
  if (normalized.endsWith('es')) return normalized.slice(0, -2);
  if (normalized.endsWith('s')) return normalized.slice(0, -1);
  return normalized;
}

// True if the ingredient's text contains any pantry term
function matchesPantry(ingredientText, pantryTerms) {
  const normalized = (ingredientText || '').toLowerCase();
  return pantryTerms.some((term) => term && normalized.includes(term));
}

function RecipeDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const pantryList = location.state?.pantryList || [];
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkedItems, setCheckedItems] = useState(() => new Set());
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setRecipe(null);

    fetchRecipeDetails(id)
      .then((data) => {
        setRecipe(data);

        // Pre-check ingredients that match the pantry list ("I already have this")
        const pantryTerms = pantryList.map(normalizePantryTerm);
        const preChecked = new Set();
        (data.ingredients || []).forEach((ingredient, index) => {
          if (matchesPantry(ingredient.text, pantryTerms)) preChecked.add(index);
        });
        setCheckedItems(preChecked);
      })
      .catch((err) => {
        console.error("Recipe Details Fetch Error:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    fetchFavorites(user.id, id)
      .then((data) => setIsFavorited(!!data.favorited))
      .catch((err) => console.error("Recipe Details Favorites Fetch Error:", err));
  }, [user.id, id]);

  const toggleFavorite = () => {
    if (!recipe) return;
    const wasFavorited = isFavorited;
    setIsFavorited(!wasFavorited);

    const request = wasFavorited
      ? removeFavorite(user.id, recipe.id)
      : addFavorite(user.id, { id: recipe.id, title: recipe.title, image: recipe.image, source: recipe.source, recipeUrl: recipe.recipeUrl });
    request.catch((err) => console.error("Recipe Details Favorite Toggle Error:", err));
  };

  const toggleChecked = (index) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const styles = recipeDetailsStyles;

  // Total cost of only the unchecked ("still need to buy") ingredients
  let displayedTotalMin = 0;
  let displayedTotalMax = 0;
  if (recipe) {
    recipe.ingredients.forEach((ingredient, index) => {
      if (checkedItems.has(index)) return;
      const priceEntry = findPriceForIngredient(ingredient.text, recipe.priceBreakdown);
      if (priceEntry) {
        displayedTotalMin += priceEntry.min;
        displayedTotalMax += priceEntry.max;
      }
    });
  }

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
            <div style={styles.titleRow}>
              <h2 style={styles.title}>{recipe.title || "Untitled Recipe"}</h2>
              <FavoriteButton filled={isFavorited} onToggle={toggleFavorite} />
            </div>
            <p style={styles.source}>Source: <em>{recipe.source || "Unknown Source"}</em></p>

            <div>
              <a href={recipe.recipeUrl} target="_blank" rel="noopener noreferrer" style={styles.link} className="bb-link">
                View Full Recipe Instructions
              </a>
            </div>

            <p style={styles.costSummary}>
              Estimated Total Cost: ${displayedTotalMin.toFixed(2)} – ${displayedTotalMax.toFixed(2)}
            </p>
            <p style={styles.disclaimer}>
              Prices are AI-generated estimates and may not reflect actual store prices.
            </p>

            <h3 style={styles.sectionTitle}>Ingredients</h3>
            <p style={styles.checkboxHint}>Check off anything you already have to remove it from the total.</p>
            <ul style={styles.ingredientList}>
              {recipe.ingredients.map((ingredient, index) => {
                const priceEntry = findPriceForIngredient(ingredient.text, recipe.priceBreakdown);
                const isChecked = checkedItems.has(index);
                return (
                  <li key={index} style={styles.ingredientItem}>
                    <label style={styles.ingredientLabel}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleChecked(index)}
                        style={styles.ingredientCheckbox}
                      />
                      <span style={isChecked ? styles.ingredientTextChecked : styles.ingredientText}>
                        {ingredient.text}
                      </span>
                    </label>
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
