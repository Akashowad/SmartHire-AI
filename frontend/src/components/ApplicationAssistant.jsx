import React, { useState, useEffect } from 'react';
import { apiClient } from '../api';

const extractKeywords = (text = '') => {
  const keywords = [
    'React', 'JavaScript', 'Python', 'FastAPI', 'MongoDB', 'SQL', 'AWS',
    'Docker', 'Kubernetes', 'SEO', 'content', 'writing', 'copywriting',
    'communication', 'analytics', 'marketing', 'remote', 'operations'
  ];

  return keywords.filter((keyword) =>
    text.toLowerCase().includes(keyword.toLowerCase())
  );
};

const buildFallbackAIData = (job, resumeText = '') => {
  const jobText = `${job.title || ''}\n${job.description || ''}`;
  const resumeSkills = extractKeywords(resumeText);
  const jobSkills = extractKeywords(jobText);
  const matched = resumeSkills.filter((skill) =>
    jobSkills.some((jobSkill) => jobSkill.toLowerCase() === skill.toLowerCase())
  );
  const missing = jobSkills.filter((skill) =>
    !resumeSkills.some((resumeSkill) => resumeSkill.toLowerCase() === skill.toLowerCase())
  );
  const role = job.title || 'this role';
  const company = job.company || 'your team';
  const strengths = matched.length ? matched.slice(0, 4).join(', ') : 'adaptability, communication, and relevant project experience';

  return {
    recommendations: {
      why_matches: `Your profile can be positioned well for ${role} at ${company}. Highlight ${strengths}, then connect your experience directly to the responsibilities in the job description.`,
      skills_to_improve: missing.slice(0, 5),
    },
    coverLetter: {
      cover_letter: `Dear Hiring Manager,\n\nI am excited to apply for the ${role} position at ${company}. My background in ${strengths} gives me a strong foundation to contribute to this role.\n\nI am especially interested in this opportunity because the role calls for clear execution, ownership, and the ability to adapt quickly. I would bring a practical, detail-oriented approach and a strong willingness to learn the tools and workflows your team uses.\n\nThank you for considering my application. I would welcome the opportunity to discuss how my experience can support ${company}'s goals.\n\nSincerely,\nApplicant`,
      email_template: `Subject: Application for ${role}\n\nHi Hiring Team,\n\nI hope you are doing well. I recently came across the ${role} opening at ${company} and wanted to share my interest.\n\nMy experience includes ${strengths}, and I am confident I can bring value to the team. I have attached my resume for your review and would appreciate the opportunity to discuss the role further.\n\nBest regards,\nApplicant`,
    },
  };
};

export default function ApplicationAssistant({ job, resumeText, onClose }) {
  const [loading, setLoading] = useState(true);
  const [aiData, setAiData] = useState(null);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    const fetchAI = async () => {
      try {
        const body = { resume_text: resumeText, job_description: job.description };
        const [recData, coverData] = await Promise.all([
          apiClient('/ai/recommendations', { method: 'POST', body }),
          apiClient('/ai/cover-letter', { method: 'POST', body })
        ]);
        setAiData({ recommendations: recData, coverLetter: coverData });
      } catch (err) {
        console.error("AI error", err);
        setAiData(buildFallbackAIData(job, resumeText));
      } finally {
        setLoading(false);
      }
    };
    fetchAI();
  }, [job, resumeText]);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex-center animate-fade-in" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 2000, padding: '2rem'
    }}>
      <div className="glass-panel flex-col" style={{ width: '100%', maxWidth: '900px', maxHeight: '90vh', padding: '3rem', position: 'relative', overflowY: 'auto' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '2rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '2.5rem', cursor: 'pointer' }}>&times;</button>
        
        <div className="mb-4">
            <h2 className="text-accent" style={{ fontSize: '2.2rem', fontWeight: 800 }}>AI Apply Assist</h2>
            <p className="text-secondary" style={{ fontSize: '1.1rem' }}>Strategy for <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{job.title}</span> at {job.company}</p>
        </div>

        {loading ? (
          <div className="flex-col flex-center gap-2" style={{ minHeight: '400px' }}>
            <div className="spinner" style={{ width: '50px', height: '50px', borderWidth: '5px' }}></div>
            <p className="text-secondary">Generating tailored application materials...</p>
          </div>
        ) : aiData ? (
          <div className="flex-col gap-3">
            
            <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--success)', background: 'rgba(0, 230, 118, 0.03)' }}>
              <h4 className="text-success mb-1" style={{ fontSize: '1.1rem' }}>Match Intelligence</h4>
              <p style={{ fontSize: '1rem', lineHeight: 1.6 }}>{aiData.recommendations.why_matches}</p>
              
              {aiData.recommendations.skills_to_improve.length > 0 && (
                <div className="mt-2 flex-col gap-1">
                  <strong style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Skill Gap Suggestions:</strong>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {aiData.recommendations.skills_to_improve.map((skill, idx) => (
                          <span key={idx} className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}>{skill}</span>
                      ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex-col gap-1">
              <div className="flex-between">
                <h4 className="text-secondary" style={{ fontSize: '0.9rem', textTransform: 'uppercase' }}>Tailored Cover Letter</h4>
                <button onClick={() => copyToClipboard(aiData.coverLetter.cover_letter, 'cv')} className="btn-secondary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.75rem' }}>
                  {copied === 'cv' ? 'Copied! ✓' : 'Copy Content'}
                </button>
              </div>
              <div className="glass-panel" style={{ padding: '1.5rem', fontSize: '0.95rem', lineHeight: 1.7, maxHeight: '300px', overflowY: 'auto', background: 'rgba(0,0,0,0.2)' }}>
                {aiData.coverLetter.cover_letter.split('\n').map((line, i) => <p key={i} className={line ? 'mb-2' : 'mb-1'} style={{ marginBottom: line ? '1rem' : '0.5rem' }}>{line}</p>)}
              </div>
            </div>

            <div className="flex-col gap-1">
              <div className="flex-between">
                <h4 className="text-secondary" style={{ fontSize: '0.9rem', textTransform: 'uppercase' }}>Recruiter Email</h4>
                <button onClick={() => copyToClipboard(aiData.coverLetter.email_template, 'email')} className="btn-secondary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.75rem' }}>
                  {copied === 'email' ? 'Copied! ✓' : 'Copy Content'}
                </button>
              </div>
              <pre style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', whiteSpace: 'pre-wrap', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                {aiData.coverLetter.email_template}
              </pre>
            </div>

          </div>
        ) : (
          <div className="glass-panel text-center" style={{ padding: '4rem' }}>
            <p className="text-danger">Failed to connect with AI services.</p>
          </div>
        )}
      </div>
    </div>
  );
}
