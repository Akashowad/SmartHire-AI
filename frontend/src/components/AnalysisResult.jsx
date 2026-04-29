import React, { useState } from 'react';

function Section({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="glass-panel" style={{ padding:'1.25rem', borderLeft:'3px solid var(--accent)' }}>
      <button onClick={() => setOpen(!open)} style={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', background:'none', border:'none', color:'var(--text-primary)', fontSize:'1rem', fontWeight:700, cursor:'pointer' }}>
        {title}
        <span style={{ color:'var(--text-muted)' }}>{open ? '▼' : '▶'}</span>
      </button>
      {open && <div style={{ marginTop:'1rem' }}>{children}</div>}
    </div>
  );
}

export default function AnalysisResult({ data, onClose }) {
  if (!data) return null;
  return (
    <div className="flex-center animate-fade-in" style={{ position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.85)', backdropFilter:'blur(10px)', zIndex:3000, padding:'2rem', overflowY:'auto' }}>
      <div className="glass-panel flex-col" style={{ width:'100%', maxWidth:'850px', padding:'2.5rem', position:'relative', gap:'1.5rem' }}>
        <button onClick={onClose} style={{ position:'absolute', top:'1.25rem', right:'1.5rem', background:'none', border:'none', color:'var(--text-muted)', fontSize:'1.5rem', cursor:'pointer' }}>✕</button>
        <div className="flex-between" style={{ alignItems:'flex-start', flexWrap:'wrap', gap:'1.5rem' }}>
          <div><h2 style={{ fontSize:'1.75rem', fontWeight:800 }}>AI Analysis Report</h2><p style={{ color:'var(--text-muted)' }}>Complete hiring analysis</p></div>
          <div style={{ fontSize:'2rem', fontWeight:800, color:'var(--success)' }}>{data.match_score || 0}% Match</div>
        </div>
        <Section title="Strengths"><ul style={{ paddingLeft:'1.2rem', color:'var(--success)' }}>{data.strengths?.map((s,i)=><li key={i} style={{ marginBottom:'0.5rem' }}>{s}</li>)}</ul></Section>
        <Section title="Missing Skills"><ul style={{ paddingLeft:'1.2rem', color:'var(--danger)' }}>{data.missing_skills?.map((s,i)=><li key={i} style={{ marginBottom:'0.5rem' }}>{s}</li>)}</ul></Section>
        <Section title="Improvement Suggestions"><ul style={{ paddingLeft:'1.2rem' }}>{data.improvement_suggestions?.map((s,i)=><li key={i} style={{ marginBottom:'0.5rem' }}>{s}</li>)}</ul></Section>
        <Section title="ATS Keywords"><div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>{data.ats_keywords?.map((kw,i)=><span key={i} className="badge" style={{ background:'rgba(99,102,241,0.15)', color:'var(--accent-light)' }}>{kw}</span>)}</div></Section>
      </div>
    </div>
  );
}

