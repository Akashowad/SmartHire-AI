import React, { useState, useEffect } from 'react';
import { apiClient } from '../api';

export default function ApplicationAssistant({ job, resumeText, onClose }) {
  const [loading, setLoading] = useState(true);
  const [aiData, setAiData] = useState(null);

  useEffect(() => {
    const fetchAI = async () => {
      try {
        const body = JSON.stringify({
            resume_text: resumeText,
            job_description: job.description
        });

        const [recData, coverData] = await Promise.all([
          apiClient('/ai/recommendations', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body
          }),
          apiClient('/ai/cover-letter', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body
          })
        ]);

        setAiData({
          recommendations: recData,
          coverLetter: coverData
        });
      } catch (err) {
        console.error("AI error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAI();
  }, [job, resumeText]);

  return (
    <div className="flex-center animate-fade-in" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
      zIndex: 1000, padding: '2rem'
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto', padding: '2.5rem', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '2rem', cursor: 'pointer', lineHeight: 1 }}>&times;</button>
        
        <div className="mb-4">
            <h2 className="text-accent mb-1" style={{ fontSize: '2rem', fontWeight: 700 }}>AI Application Assistant</h2>
            <h3 className="text-secondary" style={{ fontSize: '1.15rem', fontWeight: 400 }}>Role: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{job.title}</span> at {job.company}</h3>
        </div>

        {loading ? (
          <div className="flex-col flex-center text-center p-4 gap-3" style={{ minHeight: '300px' }}>
            <span className="spinner" style={{ width: '48px', height: '48px', borderWidth: '4px' }}></span>
            <div>
                <p className="text-accent mb-1" style={{ fontSize: '1.25rem', fontWeight: 500 }}>Scanning Profile with AI...</p>
                <p className="text-secondary" style={{ fontSize: '1.05rem' }}>Drafting the perfect cover letter and analyzing your fit.</p>
            </div>
          </div>
        ) : aiData ? (
          <div className="flex-col gap-4">
            
            <div className="glass-panel p-3" style={{ borderLeft: '4px solid var(--success)', background: 'rgba(16, 185, 129, 0.05)' }}>
              <h4 className="text-success mb-2" style={{ fontSize: '1.2rem', fontWeight: 600 }}>AI Recommendation</h4>
              <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.9)' }}>{aiData.recommendations.why_matches}</p>
              
              {aiData.recommendations.skills_to_improve.length > 0 && (
                <div className="mt-2 flex-col gap-1">
                  <strong style={{ fontSize: '0.95rem' }}>Areas to improve: </strong>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {aiData.recommendations.skills_to_improve.map((skill, idx) => (
                          <span key={idx} className="badge" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>{skill}</span>
                      ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex-col gap-1">
              <h4 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Crafted Cover Letter</h4>
              <textarea 
                className="input-field" 
                readOnly 
                value={aiData.coverLetter.cover_letter}
                style={{ minHeight: '250px', resize: 'vertical', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>

            <div className="flex-col gap-1">
              <h4 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Recruiter Email Template</h4>
              <textarea 
                className="input-field" 
                readOnly 
                value={aiData.coverLetter.email_template}
                style={{ minHeight: '150px', resize: 'vertical', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>

          </div>
        ) : (
          <div className="p-4 text-center glass-panel">
            <p className="text-danger flex-center gap-2"><span style={{ fontSize: '1.5rem' }}>⚠️</span> Failed to load AI insight data.</p>
          </div>
        )}
      </div>
    </div>
  );
}
