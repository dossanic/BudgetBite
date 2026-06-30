import React from 'react';

function Header({ setView }) {
  const styles = {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 30px',
      background: '#fff3ee',
      borderBottom: '2px solid #ff6b35',
      fontFamily: 'sans-serif'
    },
    logo: { 
      color: '#ff6b35', 
      margin: 0, 
      fontSize: '1.8em', 
      fontWeight: 'bold', 
      cursor: 'pointer', // 👈 Changes mouse cursor to pointer to show it's interactable
      userSelect: 'none'  // Prevents text highlighting when double-clicked quickly
    },
    navList: { display: 'flex', listStyle: 'none', gap: '20px', margin: 0, padding: 0 },
    navLink: {
      background: 'none',
      border: 'none',
      color: '#444',
      fontWeight: '600',
      fontSize: '1em',
      cursor: 'pointer',
      padding: 0,
      fontFamily: 'sans-serif'
    },
    userSection: { color: '#666', fontWeight: '500' }
  };

  return (
    <header style={styles.header}>
      <div>
        {/* 👇 Added the onClick handler here to change state back to 'dashboard' */}
        <h1 style={styles.logo} onClick={() => setView('dashboard')}>
          BudgetBite
        </h1>
      </div>

      <nav>
        <ul style={styles.navList}>
          {/* 1. Dashboard / Homepage */}
          <li>
            <button onClick={() => setView('dashboard')} style={styles.navLink}>
              Home
            </button>
          </li>
          
          {/* 2. Recipe Browser */}
          <li>
            <button onClick={() => setView('browser')} style={styles.navLink}>
              Recipes
            </button>
          </li>
          
          {/* 3. Saved Recipes Page */}
          <li>
            <button onClick={() => setView('saved')} style={styles.navLink}>
              Saved
            </button>
          </li>
        </ul>
      </nav>

      <div style={styles.userSection}><span>Welcome, User</span></div>
    </header>
  );
}

export default Header;