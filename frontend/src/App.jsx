// src/App.jsx
import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './views/Dashboard';
import RecipeBrowser from './views/RecipeBrowser'; // 👈 1. Import your new page

function App() {
  // State can track: 'dashboard', 'browser', or 'saved'
  const [currentView, setCurrentView] = useState('dashboard'); 

  return (
    <div>
      {/* Pass the state setter down to the Header so buttons can trigger swaps */}
      <Header setView={setCurrentView} />
      
      {/* ======================================================================= */}
      {/* CONDITIONAL VIEWPORT ROUTING                                            */}
      {/* ======================================================================= */}
      
      {/* 1. Pantry Dashboard (Homepage) */}
      {currentView === 'dashboard' && <Dashboard />}
      
      {/* 2. Global Edamam Recipe Browser */}
      {currentView === 'browser' && <RecipeBrowser />}

      {/* 3. Saved Recipes Page (Placeholder for Phase 5) */}
      {currentView === 'saved' && (
        <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
          <h2 style={{ color: '#333', borderBottom: '2px solid #fff3ee', paddingBottom: '10px' }}>
            Your Saved Collections
          </h2>
          <p style={{ color: '#777', fontStyle: 'italic', marginTop: '20px' }}>
            Saved recipes dashboard database persistence layer coming soon in Phase 5!
          </p>
        </div>
      )}
    </div>
  );
}

export default App;