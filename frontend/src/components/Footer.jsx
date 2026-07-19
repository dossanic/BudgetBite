import React from 'react';
const { theme } = require('../theme');

function Footer({ setView }) {
  // Change the current view and return the visitor to the top of the page.
  function openView(view) {
    setView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const styles = {
    footer: {
      background: theme.color.primaryLight,
      borderTop: `2px solid ${theme.color.primary}`,
      padding: '30px',
      width: '100%',
      marginTop: '60px'
    },
    contentWrapper: {
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '30px'
    },
    brandCol: { maxWidth: '320px' },
    logo: { color: theme.color.primary, margin: 0, fontSize: '1.5em', fontWeight: 'bold' },
    tagline: { color: theme.color.textMuted, marginTop: '8px', fontSize: '0.95em', lineHeight: '1.5' },
    linksArea: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
      gap: '55px'
    },
    linksCol: { display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '115px' },
    colTitle: { color: theme.color.text, fontWeight: '700', fontSize: '0.85em', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' },
    navLink: {
      background: 'none',
      border: 'none',
      color: theme.color.textMuted,
      fontSize: '0.95em',
      cursor: 'pointer',
      padding: 0,
      textAlign: 'left'
    },
    bottomRow: {
      maxWidth: '1200px',
      margin: '25px auto 0',
      paddingTop: '20px',
      borderTop: `1px solid ${theme.color.primaryBorder}`,
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '8px',
      color: theme.color.textFaint,
      fontSize: '0.85em'
    }
  };

  const year = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.contentWrapper}>
        <div style={styles.brandCol}>
          <h2 style={styles.logo}>CheapChomp</h2>
          <p style={styles.tagline}>
            Find recipes that fit what&apos;s already in your pantry — and what&apos;s left in your budget.
          </p>
        </div>

        <div style={styles.linksArea}>
          <div style={styles.linksCol}>
            <span style={styles.colTitle}>Navigate</span>
            <button onClick={() => openView('dashboard')} style={styles.navLink} className="bb-nav-link">Home</button>
            <button onClick={() => openView('browser')} style={styles.navLink} className="bb-nav-link">Recipes</button>
            <button onClick={() => openView('saved')} style={styles.navLink} className="bb-nav-link">Saved Recipes</button>
          </div>

          {/* These links replace the original footer placeholders with real pages. */}
          <div style={styles.linksCol}>
            <span style={styles.colTitle}>CheapChomp</span>
            <button onClick={() => openView('about')} style={styles.navLink} className="bb-nav-link">About</button>
            <button onClick={() => openView('goals')} style={styles.navLink} className="bb-nav-link">Our Goals</button>
            <button onClick={() => openView('credits')} style={styles.navLink} className="bb-nav-link">Credits</button>
          </div>

          <div style={styles.linksCol}>
            <span style={styles.colTitle}>Information</span>
            <button onClick={() => openView('privacy')} style={styles.navLink} className="bb-nav-link">Privacy</button>
            <button onClick={() => openView('safety')} style={styles.navLink} className="bb-nav-link">Food Safety</button>
          </div>
        </div>
      </div>

      <div style={styles.bottomRow}>
        <span>© {year} CheapChomp</span>
        <span>Recipe data powered by Edamam · Built by Group 25A DEVilish</span>
      </div>
    </footer>
  );
}

export default Footer;
