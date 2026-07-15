import React from 'react';
import { useNavigate } from 'react-router-dom'; // Used to programmatically redirect users post-authentication events
const { supabase } = require('../services/supabaseClient'); // Supabase client wrapper containing initialized instance configs
const { theme } = require('../theme');

// setView
function Header({ setView, user }) {
  const navigate = useNavigate();

  // Handle logging out through Supabase Auth
  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/login'); // Force redirect back to public login view
  }

  const styles = {
    header: {
      background: theme.color.primaryLight,
      borderBottom: `2px solid ${theme.color.primary}`,
      padding: '15px 30px',
      width: '100%'
    },
    // Centers header items and matches the 1200px max width of your dashboard
    contentWrapper: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%'
    },
    logo: {
      color: theme.color.primary,
      margin: 0,
      fontSize: '1.8em',
      fontWeight: 'bold',
      cursor: 'pointer',
      userSelect: 'none'
    },
    navList: { display: 'flex', listStyle: 'none', gap: '20px', margin: 0, padding: 0 },
    navLink: {
      background: 'none',
      border: 'none',
      color: '#444',
      fontWeight: '600',
      fontSize: '1em',
      cursor: 'pointer',
      padding: 0
    },
    userSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      color: theme.color.textMuted,
      fontWeight: '500'
    },
    logoutBtn: {
      background: theme.color.primary,
      color: theme.color.white,
      border: 'none',
      padding: '6px 12px',
      borderRadius: theme.radius.sm,
      fontWeight: 'bold',
      cursor: 'pointer',
      fontSize: '0.9em'
    }
  };

  return (
    <header style={styles.header}>
      {/* Wrapping layout container to pull everything inward */}
      <div style={styles.contentWrapper}>
        {/* Brand Title / Clicking returns home */}
        <div>
          <h1 style={styles.logo} onClick={() => setView('dashboard')}>
            CheapChomp
          </h1>
        </div>

        {/* Primary Application Navigation (State-Based View Routing) */}
        <nav>
          <ul style={styles.navList}>
            {/* Dashboard / Homepage */}
            <li>
              <button onClick={() => setView('dashboard')} style={styles.navLink} className="bb-nav-link">
                Home
              </button>
            </li>

            {/* 2. Recipe Browser */}
            <li>
              <button onClick={() => setView('browser')} style={styles.navLink} className="bb-nav-link">
                Recipes
              </button>
            </li>

            {/* 3. Saved Recipes Page */}
            <li>
              <button onClick={() => setView('saved')} style={styles.navLink} className="bb-nav-link">
                Saved
              </button>
            </li>
          </ul>
        </nav>

        {/* User Session Metadata & Actions Section */}
        <div style={styles.userSection}>
          {/* Dynamically reads user email from the passed Supabase auth token session */}
          <span>Welcome, {user?.email || "User"}</span>
          
          {/* Logout action button */}
          <button onClick={handleLogout} style={styles.logoutBtn} className="bb-btn-primary">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;