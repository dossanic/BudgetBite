// src/views/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added Link for switching to signup
import BackgroundPeaches from '../components/BackgroundPeaches';
const { supabase } = require('../services/supabaseClient');
const { theme } = require('../theme');

function Login() {
  const navigate = useNavigate();

  // Stores what the user types
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [uiError, setUiError] = useState(null); // Replaces ugly window alert pop-ups

  // Handles login when the form is submitted
  async function handleLogin(e) {
    e.preventDefault();
    setUiError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      setUiError(error.message);
    } else {
      // Save the logged-in user session string
      localStorage.setItem('user', JSON.stringify(data.user));
      // Send user back to protected Dashboard area
      navigate('/');
    }
  }

  const styles = {
    wrapper: {
      position: 'relative',
      zIndex: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '80vh',
      padding: '20px'
    },
    card: {
      width: '100%',
      maxWidth: '400px',
      backgroundColor: theme.color.white,
      padding: '40px 30px',
      borderRadius: theme.radius.lg,
      boxShadow: theme.shadow.panel,
      border: `1px solid ${theme.color.border}`
    },
    title: {
      color: theme.color.primary,
      margin: '0 0 8px 0',
      fontSize: '2.2em',
      fontWeight: 'bold',
      textAlign: 'center'
    },
    subtitle: {
      color: theme.color.textMuted,
      textAlign: 'center',
      margin: '0 0 30px 0',
      fontSize: '0.95em'
    },
    inputGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      color: '#444',
      fontWeight: '600',
      marginBottom: '8px',
      fontSize: '0.9em'
    },
    input: {
      width: '100%',
      padding: '12px',
      fontSize: '1em',
      borderRadius: theme.radius.sm,
      border: `1px solid ${theme.color.primaryBorder}`,
      outline: 'none',
      backgroundColor: theme.color.inputBg
    },
    submitBtn: {
      width: '100%',
      padding: '14px',
      background: theme.color.primary,
      color: theme.color.white,
      border: 'none',
      borderRadius: theme.radius.sm,
      fontWeight: 'bold',
      fontSize: '1.05em',
      cursor: 'pointer',
      marginTop: '10px',
      boxShadow: theme.shadow.button
    },
    errorBox: {
      backgroundColor: theme.color.dangerBg,
      border: `1px solid ${theme.color.dangerBorder}`,
      color: theme.color.danger,
      padding: '12px',
      borderRadius: theme.radius.sm,
      marginBottom: '20px',
      fontSize: '0.9em',
      fontWeight: '500',
      textAlign: 'center'
    },
    footerText: {
      textAlign: 'center',
      marginTop: '25px',
      fontSize: '0.9em',
      color: theme.color.textMuted
    },
    signupLink: {
      color: theme.color.primary,
      textDecoration: 'none',
      fontWeight: 'bold',
      marginLeft: '5px'
    }
  };

  return (
    <div style={styles.wrapper}>
      <BackgroundPeaches />
      <main style={styles.card}>
        <h2 style={styles.title}>Welcome</h2>
        <p style={styles.subtitle}>Log in to access your BudgetBite kitchen</p>

        {/* Display UI Error banner if registration/auth fails */}
        {uiError && <div style={styles.errorBox}>⚠️ {uiError}</div>}

        <form onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              className="bb-input"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              className="bb-input"
              required
            />
          </div>

          <button type="submit" style={styles.submitBtn} className="bb-btn-primary">
            Log In
          </button>
        </form>

        <p style={styles.footerText}>
          Don't have an account?
          <Link to="/signup" style={styles.signupLink} className="bb-text-link">Sign Up</Link>
        </p>
      </main>
    </div>
  );
}

export default Login;