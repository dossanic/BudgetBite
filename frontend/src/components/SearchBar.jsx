import React, { useState } from 'react';
const { theme } = require('../theme');

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
    container: {},
    label: { color: theme.color.text, fontSize: '1.1em' },
    inputGroup: { display: 'flex', gap: '8px', margin: '10px 0' },
    input: {
      padding: '10px',
      fontSize: '1em',
      borderRadius: theme.radius.sm,
      border: `1px solid ${theme.color.primaryBorder}`,
      outline: 'none',
      width: '100%',
      maxWidth: '300px'
    },
    addButton: {
      padding: '10px 20px',
      background: theme.color.primary,
      color: theme.color.white,
      border: 'none',
      borderRadius: theme.radius.sm,
      fontWeight: 'bold',
      cursor: 'pointer'
    },
    pantrySection: { margin: '20px 0' },
    pantryHeading: { color: '#444', marginBottom: '10px' },
    pantryEmpty: {
      color: theme.color.textMuted,
      textAlign: 'center',
      padding: '20px',
      border: `1px dashed ${theme.color.primaryBorder}`,
      borderRadius: theme.radius.md,
      backgroundColor: theme.color.primaryLight
    },
    pantryList: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
    badge: {
      background: theme.color.primarySoft,
      border: `1px solid ${theme.color.primaryBorder}`,
      color: '#d94814',
      padding: '6px 12px',
      borderRadius: theme.radius.pill,
      display: 'inline-flex',
      alignItems: 'center',
      fontWeight: '600',
      fontSize: '0.9em'
    },
    removeBtn: {
      marginLeft: '8px',
      background: 'none',
      border: 'none',
      color: theme.color.primary,
      fontWeight: 'bold',
      cursor: 'pointer',
      fontSize: '1.1em'
    },
    searchBtn: {
      margin: '15px 0',
      padding: '12px 24px',
      background: theme.color.primary,
      color: theme.color.white,
      border: 'none',
      borderRadius: theme.radius.sm,
      fontWeight: 'bold',
      fontSize: '1em',
      cursor: 'pointer',
      boxShadow: theme.shadow.button
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="pantry-search" style={styles.label}><strong>Add Ingredients to your Pantry:</strong></label>
        <div style={styles.inputGroup}>
          <input
            id="pantry-search"
            type="text"
            placeholder="e.g. chicken, rice, broccoli..."
            value={inputValue}
            onChange={handleInputChange}
            style={styles.input}
            className="bb-input"
          />
          <button type="submit" style={styles.addButton} className="bb-btn-primary">Add</button>
        </div>
      </form>

      <div style={styles.pantrySection}>
        <h4 style={styles.pantryHeading}>Your Pantry:</h4>
        {pantryList.length === 0 ? (
          <p style={styles.pantryEmpty}>Add an ingredient above to start building your pantry.</p>
        ) : (
          <div style={styles.pantryList}>
            {pantryList.map((ingredient, index) => (
              <span key={index} style={styles.badge} className="bb-badge">
                {ingredient}
                <button onClick={() => onRemoveIngredient(ingredient)} style={styles.removeBtn} className="bb-remove-btn">✕</button>
              </span>
            ))}
          </div>
        )}
      </div>

      {pantryList.length > 0 && (
        <button onClick={onTriggerSearch} style={styles.searchBtn} className="bb-btn-primary">
          Find Recipes Matching My Pantry
        </button>
      )}
    </div>
  );
}

export default SearchBar;