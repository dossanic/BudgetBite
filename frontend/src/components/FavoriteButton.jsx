import React from 'react';
const { theme } = require('../theme');

// Heart-shaped toggle button used to favorite/unfavorite a recipe.
// Presentational only -- callers own the "filled" state and the toggle handler.
function FavoriteButton({ filled, onToggle, style, overlay = false }) {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation(); // don't trigger a parent card's navigate-on-click
    onToggle();
  };

  const baseStyle = {
    background: overlay ? 'rgba(255, 255, 255, 0.85)' : 'none',
    border: 'none',
    borderRadius: theme.radius.pill,
    padding: overlay ? '6px' : '4px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 0
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={filled ? 'Remove from favorites' : 'Add to favorites'}
      aria-pressed={filled}
      style={{ ...baseStyle, ...style }}
      className="bb-favorite-btn"
    >
      <svg width="22" height="22" viewBox="0 0 24 24">
        <path
          d="M12 21s-6.7-4.35-9.33-8.2C1.02 10.6 1.4 7.6 3.6 5.9c2-1.55 4.7-1.2 6.2.7l2.2 2.75 2.2-2.75c1.5-1.9 4.2-2.25 6.2-.7 2.2 1.7 2.58 4.7.93 6.9C18.7 16.65 12 21 12 21z"
          fill={filled ? theme.color.primary : 'none'}
          stroke={filled ? theme.color.primary : theme.color.textMuted}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export default FavoriteButton;
