import React, { useState } from 'react';
import './App.css';
import UploadModal from './components/UploadModal';
import Dashboard from './pages/Dashboard';

function App() {
  const [resumeData, setResumeData] = useState(null);

  return (
    <div className="app-wrapper flex-col">
      <header className="glass-panel flex-between p-3" style={{ margin: '1rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700', letterSpacing: '-0.5px' }}>
          SmartHire <span className="text-accent">AI</span>
        </h1>
        {resumeData && (
          <div className="flex-center gap-2">
            <span className="text-secondary" style={{ fontSize: '0.95rem', fontWeight: '500' }}>
              Resume Analysis Active
            </span>
            <button className="btn" onClick={() => setResumeData(null)}>Start Over</button>
          </div>
        )}
      </header>

      <main className="container flex-col gap-4 animate-fade-in" style={{ flex: 1 }}>
        {!resumeData ? (
          <UploadModal onUploadSuccess={(data) => setResumeData(data)} />
        ) : (
          <Dashboard resumeData={resumeData} />
        )}
      </main>
    </div>
  );
}

export default App;
