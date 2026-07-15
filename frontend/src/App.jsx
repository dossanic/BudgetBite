import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// view imports
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './views/Dashboard';
import RecipeBrowser from './views/RecipeBrowser';
import Login from './views/Login';
import Signup from './views/Signup';

// Supabase client import
import { supabase } from './services/supabaseClient';
const { appStyles } = require('./appStyles');

// Main App component
function App() {
  const [user, setUser] = useState(null); // State to track the authenticated user
  const [loading, setLoading] = useState(true); // State to track the loading status of the authentication check
  const [currentView, setCurrentView] = useState('dashboard');  // State to track the current view in the app (dashboard, browser, saved)
  
  // Effect hook to check for an authenticated user on component mount
  useEffect(() => {
    async function getUser() {  // Async function to fetch the current authenticated user from Supabase
      const { data } = await supabase.auth.getUser(); // Fetch the current user from Supabase Auth
      setUser(data.user);   // Update the user state with the fetched user data
      setLoading(false);  // Set loading to false after the user data is fetched
    }

    getUser();  // Call the async function to fetch the user data

    // Set up a listener for authentication state changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(   // Listen for auth state changes
      (_event, session) => {  // Callback function triggered on auth state change
        setUser(session?.user || null); // Update the user state based on the new session data
        setLoading(false);  // Set loading to false after the auth state change is handled
      }
    );

    return () => {
      listener.subscription.unsubscribe();  // Clean up the listener on component unmount to prevent memory leaks
    };
  }, []);

  // Display a loading message while checking for an authenticated user
  if (loading) {
    return (
      <div style={appStyles.loadingContainer}>
        <h3>Authenticating Session...</h3>
      </div>
    );
  }

  return (
    <BrowserRouter> {/* Wrap the app in BrowserRouter to enable routing */}
      <Routes>  {/* Define the routes for the application */}
        <Route // Public Routes for Login and Signup
          path="/login" 
          element={!user ? <Login /> : <Navigate to="/" replace />} // If the user is not authenticated, render the Login component; otherwise, redirect to the root path
        />
        <Route 
          path="/signup" // Public route for the signup page
          element={!user ? <Signup /> : <Navigate to="/" replace />} // If the user is not authenticated, render the Signup component; otherwise, redirect to the root path
        />

        <Route
          path="/"
          element={
            user ? (
              <div>
                {/* Pass the state setter down to your updated Header */}
                <Header setView={setCurrentView} user={user} />
                
                <main>
                  {/* 1. Pantry Dashboard (Homepage) */}
                  {currentView === 'dashboard' && <Dashboard />}
                  
                  {/* 2. Global Edamam Recipe Browser */}
                  {currentView === 'browser' && <RecipeBrowser />}

                  {/* 3. Saved Recipes Page (Placeholder for Phase 5) */}
                  {currentView === 'saved' && (
                    <div style={appStyles.savedViewContainer}>
                      <h2 style={appStyles.savedViewHeading}>
                        Your Saved Collections
                      </h2>
                      <p style={appStyles.savedViewText}>
                        Coming soon!
                      </p>
                    </div>
                  )}
                </main>

                <Footer setView={setCurrentView} />
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch-all fallback path back to root */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;