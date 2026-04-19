import React, { useState, useEffect } from 'react';
import { apiClient } from '../api';
import { useApp } from '../context/AppContext';
import AutoApplyProgress from './AutoApplyProgress';

export default function JobCard({ job, onAssist }) {
    const { resumeData, fetchApplications, applications } = useApp();
    const [matchDetails, setMatchDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [applying, setApplying] = useState(false);
    
    const isApplied = applications.some(app => app.job_id === job.id);

    useEffect(() => {
        const getMatch = async () => {
            setLoading(true);
            try {
                const data = await apiClient(`/matches/?resume_id=${resumeData.id}&job_id=${job.id}`, {
                    method: 'POST'
                });
                setMatchDetails(data);
            } catch (err) {
                console.error("Match error", err);
            } finally {
                setLoading(false);
            }
        };
        if(resumeData?.id) getMatch();
    }, [job.id, resumeData?.id]);

    const handleQuickApply = () => setApplying(true);

    const onApplyComplete = async () => {
        try {
            await apiClient(`/applications/apply?resume_id=${resumeData.id}&job_id=${job.id}`, { method: 'POST' });
            fetchApplications();
        } catch (err) { console.error("Apply error", err); }
        finally { setApplying(false); }
    };

    const matchScore = matchDetails?.match_percentage || 0;
    const scoreColor = matchScore > 70 ? 'var(--success)' : (matchScore > 40 ? 'var(--warning)' : 'var(--danger)');

    return (
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {applying && <AutoApplyProgress job={job} onComplete={onApplyComplete} />}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: 0 }}>
                    {job.company_logo && (
                        <img 
                            src={job.company_logo} 
                            alt={job.company}
                            style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'contain', background: 'white', padding: '2px' }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    )}
                    <div style={{ minWidth: 0 }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.title}</h3>
                        <p className="text-secondary" style={{ fontSize: '0.85rem' }}>{job.company} • {job.location}</p>
                    </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: scoreColor, lineHeight: 1 }}>{matchScore}%</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Match Score</div>
                </div>
            </div>

            <p className="text-secondary" style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
                {job.excerpt || job.description?.substring(0, 150) + '...'}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {isApplied && <span className="badge badge-success">Applied</span>}
                    {job.salary && <span style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: 600 }}>{job.salary}</span>}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-secondary" onClick={onAssist} style={{ padding: '0.4rem 0.8rem' }}>Assistant</button>
                    <button 
                        className={`btn ${isApplied ? 'btn-secondary' : 'btn-primary'}`} 
                        onClick={handleQuickApply}
                        disabled={isApplied}
                        style={{ padding: '0.4rem 1rem' }}
                    >
                        {isApplied ? 'Completed' : 'Quick Apply'}
                    </button>
                </div>
            </div>
        </div>
    );
}
