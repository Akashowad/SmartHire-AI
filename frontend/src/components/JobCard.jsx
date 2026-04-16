import React, { useState, useEffect } from 'react';
import { apiClient } from '../api';

export default function JobCard({ job, resumeId, resumeText, onAssist }) {
    const [matchDetails, setMatchDetails] = useState(null);
    const [loading, setLoading] = useState(false);

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
        if(resumeId) {
            getMatch();
        }
    }, [job.id, resumeId]);

    const percentageColor = matchDetails?.match_percentage > 70 ? 'var(--success)' : 
                            (matchDetails?.match_percentage > 40 ? 'var(--warning)' : 'var(--danger)');

    return (
        <div className="glass-panel flex-col gap-2" style={{ padding: '1.5rem' }}>
            <div className="flex-between" style={{ alignItems: 'flex-start' }}>
                <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '0.2rem' }}>{job.title}</h3>
                    <p className="text-secondary" style={{ fontSize: '0.95rem' }}>{job.company} • {job.location}</p>
                </div>
                {loading ? (
                    <div className="flex-center gap-1">
                      <span className="spinner" style={{ width: '16px', height: '16px' }}></span>
                      <span className="text-secondary" style={{ fontSize: '0.85rem' }}>Matching...</span>
                    </div>
                ) : matchDetails ? (
                    <div className="text-center">
                        <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: percentageColor, lineHeight: 1 }}>
                            {matchDetails.match_percentage}%
                        </div>
                        <span className="text-secondary" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Match</span>
                    </div>
                ) : null}
            </div>

            <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' }}>{job.description}</p>

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

            <div className="flex-between mt-2">
                <div />
                <button className="btn btn-primary" onClick={onAssist}>
                    ✨ AI Apply Assist
                </button>
            </div>
        </div>
    );
}
