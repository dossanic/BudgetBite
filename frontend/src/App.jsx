import React from 'react';
import Header from './components/Header';
import Dashboard from './views/Dashboard';

function App() {
  return (
    <div>
        <Header />

        <main>
            <Dashboard />
        </main>
    </div>
  );
}

export default App;