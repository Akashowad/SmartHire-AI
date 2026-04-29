import React from 'react';

export default function About() {
  return (
    <div className="animate-fade-in container" style={{ paddingTop:'4rem', paddingBottom:'4rem' }}>
      <div className="text-center" style={{ marginBottom:'3rem' }}>
        <h1 style={{ fontSize:'2.5rem', fontWeight:800, marginBottom:'1rem' }}>About SmartHire AI</h1>
        <p style={{ color:'var(--text-secondary)', maxWidth:'700px', margin:'0 auto', lineHeight:1.7 }}>
          We are building the future of recruitment — where AI handles the repetitive tasks so recruiters and candidates can focus on what matters: meaningful connections.
        </p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))', gap:'2rem', marginBottom:'3rem' }}>
        {[
          { value:'70%', label:'Faster Time-to-Hire' },
          { value:'3x', label:'More Qualified Candidates' },
          { value:'50+', label:'Enterprise Clients' },
          { value:'99.9%', label:'Uptime SLA' },
        ].map(s => (
          <div key={s.label} className="glass-panel text-center" style={{ padding:'2rem' }}>
            <p style={{ fontSize:'2.25rem', fontWeight:800, color:'var(--accent-light)' }}>{s.value}</p>
            <p style={{ fontSize:'0.9rem', color:'var(--text-secondary)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="glass-panel" style={{ padding:'2.5rem' }}>
        <h2 style={{ fontSize:'1.5rem', fontWeight:700, marginBottom:'1rem' }}>Our Mission</h2>
        <p style={{ color:'var(--text-secondary)', lineHeight:1.7 }}>
          To democratize access to world-class recruitment technology. We believe every company — from early-stage startups to global enterprises — deserves access to AI tools that help them find, evaluate, and hire the best talent efficiently and fairly.
        </p>
      </div>
    </div>
  );
}

