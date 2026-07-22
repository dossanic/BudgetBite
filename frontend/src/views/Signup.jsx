// src/views/Signup.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BackgroundPeaches from '../components/BackgroundPeaches';
const { supabase } = require('../services/supabaseClient');
const { theme } = require('../theme');

function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [uiError, setUiError] = useState(null);
  const [uiSuccess, setUiSuccess] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setUiError(null);
    setUiSuccess(false);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: password,
      options: { data: { username: username.trim() } },
    });

    if (error) {
      setUiError(error.message);
      return;
    }

    console.log('Signup data:', data);
    setUiSuccess(true);

    // signUp() auto-creates a session; sign back out so the user has to log in themselves
    await supabase.auth.signOut();

    // Smooth transition delay so users see the success message before redirecting
    setTimeout(() => {
      navigate('/login');
    }, 2000);
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
    successBox: {
      backgroundColor: theme.color.successBg,
      border: `1px solid ${theme.color.successBorder}`,
      color: theme.color.success,
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
    loginLink: {
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
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Join BudgetBite to track pantry costs and recipes</p>

        {/* Dynamic Alerts */}
        {uiError && <div style={styles.errorBox}>⚠️ {uiError}</div>}
        {uiSuccess && (
          <div style={styles.successBox}>
            🎉 Account created successfully! Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSignup}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              className="bb-input"
              required
            />
          </div>

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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              className="bb-input"
              required
              minLength="6"
            />
          </div>

          <button type="submit" style={styles.submitBtn} className="bb-btn-primary">
            Sign Up
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account?
          <Link to="/login" style={styles.loginLink} className="bb-text-link">Log In</Link>
        </p>
      </main>
    </div>
  );
}

export default Signup;