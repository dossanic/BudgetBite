// src/views/Dashboard.jsx
import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
const { fetchRecipesWithBudgets } = require('../services/apiService');

function Dashboard() {
  const [pantryList, setPantryList] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Core array handlers (Kept local because they interact directly with pantryList state)
  const addIngredient = (item) => {
    setPantryList((prevList) => [...prevList, item]);
  };

  const removeIngredient = (itemToRemove) => {
    setPantryList((prevList) => prevList.filter(item => item !== itemToRemove));
  };

  // Execution call utilizing the clean extracted service block
  const handlePantryRecipeSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchRecipesWithBudgets(pantryList);
      setRecipes(data);
    } catch (err) {
      console.error("Dashboard Pipeline Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ padding: '20px' }}>
      <h2>BudgetBite Pantry Dashboard</h2>
      
      <SearchBar 
        pantryList={pantryList}
        onAddIngredient={addIngredient}
        onRemoveIngredient={removeIngredient}
        onTriggerSearch={handlePantryRecipeSearch}
      />

      {loading && <p>Analyzing your ingredient gaps against Ontario store baseline averages...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <div style={{ marginTop: '20px' }}>
        {recipes.length > 0 && <h3>Matching Recipes:</h3>}
        {/* Amara's grid will cleanly map over {recipes} right here */}
      </div>
    </section>
  );
}

export default Dashboard;