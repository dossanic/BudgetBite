import React, { useState } from 'react';

function SearchBar({ onAddIngredient, pantryList, onRemoveIngredient, onTriggerSearch }){
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => setInputValue(e.target.value);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const cleanItem = inputValue.trim().toLowerCase();
    if (cleanItem && !pantryList.includes(cleanItem)) {
      onAddIngredient(cleanItem);
      setInputValue('');
    }
  };

  const styles = {
    container: { margin: '20px 0', fontFamily: 'sans-serif' },
    label: { color: '#333', fontSize: '1.1em' },
    inputGroup: { display: 'flex', gap: '8px', margin: '10px 0' },
    input: {
      padding: '10px',
      fontSize: '1em',
      borderRadius: '6px',
      border: '1px solid #ffbb9e',
      outline: 'none',
      width: '100%',
      maxWidth: '300px'
    },
    addButton: {
      padding: '10px 20px',
      background: '#ff6b35',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      fontWeight: 'bold',
      cursor: 'pointer'
    },
    badge: {
      background: '#ffe4d6',
      border: '1px solid #ffbb9e',
      color: '#d94814',
      padding: '6px 12px',
      borderRadius: '20px',
      display: 'inline-flex',
      alignItems: 'center',
      fontWeight: '600',
      fontSize: '0.9em'
    },
    removeBtn: {
      marginLeft: '8px',
      background: 'none',
      border: 'none',
      color: '#ff6b35',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontSize: '1.1em'
    },
    searchBtn: {
      margin: '15px 0',
      padding: '12px 24px',
      background: '#ff6b35',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      fontWeight: 'bold',
      fontSize: '1em',
      cursor: 'pointer',
      boxShadow: '0 4px 6px rgba(255, 107, 53, 0.2)'
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="pantry-search" style={styles.label}><strong>Add Kitchen Ingredients:</strong></label>
        <div style={styles.inputGroup}>
          <input
            id="pantry-search"
            type="text"
            placeholder="e.g. chicken, rice, broccoli..."
            value={inputValue}
            onChange={handleInputChange}
            style={styles.input}
          />
          <button type="submit" style={styles.addButton}>Add</button>
        </div>
      </form>

      <div style={{ margin: '20px 0' }}>
        <h4 style={{ color: '#444', marginBottom: '10px' }}>Your Pantry List:</h4>
        {pantryList.length === 0 ? (
          <p style={{ color: 'gray', fontStyle: 'italic' }}>Your pantry is empty.</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {pantryList.map((ingredient, index) => (
              <span key={index} style={styles.badge}>
                {ingredient}
                <button onClick={() => onRemoveIngredient(ingredient)} style={styles.removeBtn}>✕</button>
              </span>
            ))}
          </div>
        )}
      </div>

      {pantryList.length > 0 && (
        <button onClick={onTriggerSearch} style={styles.searchBtn}>
          Find Recipes Matching My Pantry
        </button>
      )}
    </div>
  );
}

export default SearchBar;