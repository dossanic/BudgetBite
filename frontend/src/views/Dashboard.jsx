import React from 'react';
import SearchBar from '../components/SearchBar';

function Dashboard() {
  return (
    <section>
      <h2>Find a Recipe</h2>
      <p>Enter an ingredient you have in your kitchen to check recipe budget estimates.</p>
      
      {/* Search Bar Component */}
      <SearchBar />
    </section>
  );
}

export default Dashboard;