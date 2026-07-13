import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
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

  const styles = {
    container: { padding: '30px', fontFamily: 'sans-serif', backgroundColor: '#fdfdfd', minHeight: '100vh' },
    contentWrapper: { maxWidth: '1200px', margin: '0 auto', width: '100%' },
    heading: { color: '#333', borderBottom: '2px solid #fff3ee', paddingBottom: '10px' },
    loadingText: { color: '#ff6b35', fontWeight: 'bold', fontSize: '1.1em' },
    errorText: { color: '#d9381e', fontWeight: 'bold' },
    gridSection: { marginTop: '40px' },
    gridTitle: { color: '#222', fontSize: '1.5em', marginBottom: '15px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' },
    card: {
      border: '1px solid #fff3ee',
      borderRadius: '12px',
      padding: '16px',
      backgroundColor: '#fff',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s'
    },
    image: { width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' },
    recipeTitle: { margin: '14px 0 6px 0', fontSize: '1.25em', color: '#333' },
    recipeSource: { margin: '0 0 16px 0', color: '#777', fontSize: '0.9em' },
    recipeLink: {
      display: 'block',
      textAlign: 'center',
      marginTop: 'auto',
      padding: '10px',
      background: '#ff6b35',
      color: '#fff',
      textDecoration: 'none',
      borderRadius: '6px',
      fontWeight: 'bold',
      fontSize: '0.95em'
    },
    placeholder: { color: '#888', marginTop: '25px', fontStyle: 'italic' }
  };

  return (
    <section style={styles.container}>
      {/* 👇 Added centering layout node */}
      <div style={styles.contentWrapper}>
        <h2 style={styles.heading}>Dashboard</h2>
        <p>Welcome to your BudgetBite Dashboard! Manage your pantry and discover recipes based on ingredients you have on hand.</p>
        
        <SearchBar 
          pantryList={pantryList}
          onAddIngredient={addIngredient}
          onRemoveIngredient={removeIngredient}
          onTriggerSearch={handlePantryRecipeSearch}
        />

        {loading && <p style={styles.loadingText}>🍊 Loading Recipes...</p>}
        {error && <p style={styles.errorText}>Error: {error}</p>}

        {!loading && recipes.length > 0 && (
          <div style={styles.gridSection}>
            <h3 style={styles.gridTitle}>Matching Recipes Found ({recipes.length})</h3>
            
            <div style={styles.grid}>
              {recipes.map((recipe, index) => (
                <div key={recipe.id || index} style={styles.card}>
                  {recipe.image && (
                    <img src={recipe.image} alt={recipe.title} style={styles.image} />
                  )}
                  <h4 style={styles.recipeTitle}>{recipe.title || "Untitled Recipe"}</h4>
                  <p style={styles.recipeSource}>Source: <em>{recipe.source || "Unknown Source"}</em></p>
                  <a href={recipe.recipeUrl} target="_blank" rel="noopener noreferrer" style={styles.recipeLink}>
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