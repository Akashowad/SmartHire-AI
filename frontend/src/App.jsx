import React from 'react';
import { AppProvider } from './context/AppContext';
import Dashboard from './pages/Dashboard';
import './index.css';

function App() {
  return (
    <AppProvider>
      <div className="container">
        <header className="flex-between mb-3" style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              SmartHire AI
            </h1>
            <p className="text-secondary">Next-Gen AI Job Assistant</p>
          </div>
        </header>
        <Dashboard />
      </div>
    </AppProvider>
  );
}

export default App;
