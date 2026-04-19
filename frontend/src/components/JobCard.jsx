import React, { useState, useEffect } from 'react';
import { apiClient } from '../api';
import AutoApplyProgress from './AutoApplyProgress';

export default function JobCard({ job, resumeId, resumeText, onAssist }) {
    const [matchDetails, setMatchDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [applying, setApplying] = useState(false);
    const [applied, setApplied] = useState(false);

    useEffect(() => {
        const getMatch = async () => {
            setLoading(true);
            try {
                const data = await apiClient(`/matches/?resume_id=${resumeId}&job_id=${job.id}`, {
                    method: 'POST'
                });
                setMatchDetails(data);
            } catch (err) {
                console.error("Match error", err);
            } finally {
                setLoading(false);
            }
        };

        const checkApplied = async () => {
            try {
                const apps = await apiClient('/applications/');
                const isApplied = apps.some(app => app.job_id === job.id);
                setApplied(isApplied);
            } catch (err) {
                console.error("Error checking application status", err);
            }
        };

        if(resumeId) {
            getMatch();
            checkApplied();
        }
    }, [job.id, resumeId]);

    const handleQuickApply = async () => {
        setApplying(true);
    };

    const onApplyComplete = async () => {
        try {
            await apiClient(`/applications/apply?resume_id=${resumeId}&job_id=${job.id}`, {
                method: 'POST'
            });
            setApplied(true);
        } catch (err) {
            console.error("Apply error", err);
        } finally {
            setApplying(false);
        }
    };

    const percentageColor = matchDetails?.match_percentage > 70 ? 'var(--success)' : 
                            (matchDetails?.match_percentage > 40 ? 'var(--warning)' : 'var(--danger)');

    return (
        <div className="glass-panel flex-col gap-2" style={{ padding: '1.5rem' }}>
            {applying && <AutoApplyProgress job={job} onComplete={onApplyComplete} />}
            
            <div className="flex-between" style={{ alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flex: 1 }}>
                    {job.company_logo && (
                        <img 
                            src={job.company_logo} 
                            alt={job.company}
                            style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '10px',
                                objectFit: 'contain',
                                background: 'rgba(255,255,255,0.08)',
                                padding: '4px',
                                flexShrink: 0,
                            }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    )}
                    <div style={{ flex: 1 }}>
                        <div className="flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '0.2rem' }}>{job.title}</h3>
                            {applied && <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Applied</span>}
                        </div>
                        <p className="text-secondary" style={{ fontSize: '0.95rem' }}>
                            {job.company} • {job.location}
                        </p>
                        <div className="flex-center gap-2 mt-1" style={{ justifyContent: 'flex-start' }}>
                            {job.category && (
                                <span style={{
                                    fontSize: '0.75rem',
                                    padding: '0.15rem 0.6rem',
                                    borderRadius: '12px',
                                    background: 'rgba(124, 77, 255, 0.15)',
                                    color: 'var(--accent)',
                                    fontWeight: 500,
                                }}>
                                    {job.category}
                                </span>
                            )}
                            {job.salary && (
                                <span style={{
                                    fontSize: '0.75rem',
                                    padding: '0.15rem 0.6rem',
                                    borderRadius: '12px',
                                    background: 'rgba(0, 200, 83, 0.12)',
                                    color: 'var(--success)',
                                    fontWeight: 500,
                                }}>
                                    💰 {job.salary}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                {loading ? (
                    <div className="flex-center gap-1">
                      <span className="spinner" style={{ width: '16px', height: '16px' }}></span>
                      <span className="text-secondary" style={{ fontSize: '0.85rem' }}>Matching...</span>
                    </div>
                ) : matchDetails ? (
                    <div className="text-center" style={{ flexShrink: 0 }}>
                        <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: percentageColor, lineHeight: 1 }}>
                            {matchDetails.match_percentage}%
                        </div>
                        <span className="text-secondary" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Match</span>
                    </div>
                ) : null}
            </div>

            <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>
                {job.excerpt || job.description?.substring(0, 300) + '...'}
            </p>

            {job.skills_required?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.2rem' }}>
                    {job.skills_required.slice(0, 8).map((skill, i) => (
                        <span key={i} style={{
                            fontSize: '0.7rem',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '10px',
                            background: 'rgba(255,255,255,0.06)',
                            color: 'var(--text-secondary)',
                            border: '1px solid rgba(255,255,255,0.08)',
                        }}>
                            {skill}
                        </span>
                    ))}
                </div>
            )}

            {matchDetails && matchDetails.missing_skills?.length > 0 && (
                <div className="mt-1" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.4rem' }}>
                    <span className="text-danger" style={{ fontSize: '0.85rem', fontWeight: 500 }}>Missing:</span>
                    {matchDetails.missing_skills.map((s, i) => (
                        <span key={i} className="badge badge-danger">
                            {s}
                        </span>
                    ))}
                </div>
            )}

            <div className="flex-between mt-3 gap-2">
                <div className="flex-center gap-3">
                    {job.apply_url && (
                        <a 
                            href={job.apply_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textDecoration: 'none' }}
                        >
                            🔗 Original Post
                        </a>
                    )}
                </div>
                <div className="flex-center gap-2">
                    <button className="btn" onClick={onAssist} style={{ padding: '0.6rem 1.2rem' }}>
                        ✨ Assistant
                    </button>
                    <button 
                        className={`btn ${applied ? 'btn-secondary' : 'btn-primary'}`} 
                        onClick={handleQuickApply}
                        disabled={applied || applying}
                        style={{ padding: '0.6rem 1.5rem', background: applied ? 'rgba(255,255,255,0.1)' : 'var(--accent-gradient)' }}
                    >
                        {applied ? 'Applied ✅' : 'Auto-Apply 🚀'}
                    </button>
                </div>
            </div>
        </div>
    );
}
