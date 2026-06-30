import React from 'react';

function Header() {
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
      fontWeight: 'bold'
    },
    navList: {
      display: 'flex',
      listStyle: 'none',
      gap: '20px',
      margin: 0,
      padding: 0
    },
    navLink: {
      color: '#444',
      textDecoration: 'none',
      fontWeight: '600',
      fontSize: '1em'
    },
    userSection: {
      color: '#666',
      fontWeight: '500'
    }
  };

  return (
    <header style={styles.header}>
      <div>
        <h1 style={styles.logo}>BudgetBite</h1>
      </div>

      <nav>
        <ul style={styles.navList}>
          <li><a href="#search" style={styles.navLink}>Find Recipes</a></li>
          <li><a href="#saved" style={styles.navLink}>Saved Recipes</a></li>
        </ul>
      </nav>

      <div style={styles.userSection}>
        <span>Welcome, User</span>
      </div>
    </header>
  );
}

export default Header;