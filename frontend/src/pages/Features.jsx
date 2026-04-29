import React from 'react';

export default function Features() {
  return (
    <div className="animate-fade-in container" style={{ paddingTop:'4rem', paddingBottom:'4rem' }}>
      <div className="text-center" style={{ marginBottom:'3rem' }}>
        <h1 style={{ fontSize:'2.5rem', fontWeight:800, marginBottom:'1rem' }}>Features</h1>
        <p style={{ color:'var(--text-secondary)', maxWidth:'600px', margin:'0 auto' }}>A complete AI-powered recruitment stack designed for modern talent teams.</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'2rem' }}>
        {[
          { title:'AI Resume Parsing', desc:'Automatically extract skills, education, and experience from PDF and DOCX resumes using NLP.', icon:'📄' },
          { title:'Intelligent Matching', desc:'Hybrid SBERT + TF-IDF engine delivers precise candidate-job compatibility scores.', icon:'🎯' },
          { title:'Live Job Aggregation', desc:'Real-time feeds from Remotive, RemoteOK, and other global job boards.', icon:'🌍' },
          { title:'AI Apply Assistant', desc:'Generate tailored cover letters, recruiter emails, and interview prep materials.', icon:'🤖' },
          { title:'Application Tracking', desc:'Track every application with status updates and pipeline analytics.', icon:'📊' },
          { title:'Enterprise Security', desc:'JWT authentication, bcrypt hashing, and role-based access control.', icon:'🔒' },
        ].map(f => (
          <div key={f.title} className="glass-panel" style={{ padding:'2rem' }}>
            <div style={{ fontSize:'2.5rem', marginBottom:'1rem' }}>{f.icon}</div>
            <h3 style={{ fontSize:'1.2rem', fontWeight:700, marginBottom:'0.5rem' }}>{f.title}</h3>
            <p style={{ color:'var(--text-secondary)', lineHeight:1.6 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

