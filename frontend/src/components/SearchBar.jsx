import React, { useState } from 'react';

function SearchBar({ onAddIngredient, pantryList, onRemoveIngredient, onTriggerSearch }){
    const [inputValue, setInputValue] = useState('');

// handle input change
// e = event object from input field
const handleInputChange = (e) => {
    setInputValue(e.target.value);
};

const handleFormSubmit = (e) => {
    e.preventDefault(); // prevent page refresh on form submit
    const cleanItem = inputValue.trim().toLowerCase(); // clean input

    // check if input is not empty and not already in pantry
    if (cleanItem && !pantryList.includes(cleanItem)) {
        onAddIngredient(cleanItem);
        setInputValue(''); // clear input field
    }
};

return (
    <div style={{ margin: '20px 0' }}>
      {/* Form for adding ingredients */}
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="pantry-search"><strong>Add Kitchen Ingredients:</strong></label>
        <div style={{ margin: '5px 0' }}>
          <input
            id="pantry-search"
            type="text"
            placeholder="e.g. chicken, rice, broccoli..."
            value={inputValue}
            onChange={handleInputChange}
          />
          <button type="submit" style={{ marginLeft: '5px' }}>Add</button>
        </div>
      </form>

      {/* Visual Pantry List Layout */}
      <div style={{ margin: '15px 0' }}>
        <h4>Your Pantry List:</h4>
        {pantryList.length === 0 ? (
          <p style={{ color: 'gray' }}>Your pantry is empty.</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', margin: '10px 0' }}>
            {pantryList.map((ingredient, index) => (
              <span 
                key={index} 
                style={{
                  background: '#f0f0f0',
                  border: '1px solid #ccc',
                  padding: '2px 8px',
                  borderRadius: '3px',
                  display: 'inline-flex',
                  alignItems: 'center'
                }}
              >
                {ingredient}
                <button 
                  onClick={() => onRemoveIngredient(ingredient)}
                  style={{
                    marginLeft: '8px',
                    background: 'none',
                    border: 'none',
                    color: 'red',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Global Action Button to search for recipes once pantry is ready */}
      {pantryList.length > 0 && (
        <button 
          onClick={onTriggerSearch} 
          style={{
            margin: '10px 0',
            padding: '5px 10px',
            cursor: 'pointer'
          }}
        >
          Find Recipes Matching My Pantry
        </button>
      )}
    </div>
  );
}



export default SearchBar;