import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/CheapChompLogo.png';
const { theme } = require('../theme');

function Footer() {
  const navigate = useNavigate();

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
    logoImg: { height: '32px', width: 'auto', display: 'block' },
    tagline: { color: theme.color.textMuted, marginTop: '8px', fontSize: '0.95em', lineHeight: '1.5' },
    linksCol: { display: 'flex', flexDirection: 'column', gap: '8px' },
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
          <img src={logo} alt="CheapChomp" style={styles.logoImg} />
          <p style={styles.tagline}>Find recipes that fit what's already in your pantry — and what's left in your budget.</p>
        </div>

        <div style={styles.linksCol}>
          <span style={styles.colTitle}>Navigate</span>
          <button onClick={() => navigate('/')} style={styles.navLink} className="bb-nav-link">Home</button>
          <button onClick={() => navigate('/recipes')} style={styles.navLink} className="bb-nav-link">Recipes</button>
          <button onClick={() => navigate('/saved')} style={styles.navLink} className="bb-nav-link">Saved</button>
        </div>
      </div>

      <div style={styles.bottomRow}>
        <span>© {year} CheapChomp</span>
        <span>Recipe data powered by Edamam</span>
      </div>
    </footer>
  );
}

export default Footer;
