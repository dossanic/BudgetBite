import React from 'react';
import SearchBar from '../components/SearchBar';

function Dashboard() {
  return (
    <section className="dashboard" id="search">
      <div className="dashboard-card">
        <h2>Find a Recipe</h2>
        <p>Enter an ingredient you have in your kitchen to check recipe budget estimates.</p>
      
        {/* Search Bar Component */}
        <SearchBar />
      </div>
    </section>
  );
}

export default Dashboard;