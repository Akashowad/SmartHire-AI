import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import JobCard from '../components/JobCard';
import UploadModal from '../components/UploadModal';
import ApplicationAssistant from '../components/ApplicationAssistant';
import { apiClient } from '../api';

export default function Dashboard() {
  const { 
    jobs, fetchJobs, resumeData, clearResume, 
    applications, fetchApplications, loading, error 
  } = useApp();
  
  const [selectedJob, setSelectedJob] = useState(null);
  const [keyword, setKeyword] = useState(resumeData?.extracted_skills?.[0] || '');
  const [location, setLocation] = useState('');
  const [isApplyingAll, setIsApplyingAll] = useState(false);

  useEffect(() => {
    if (resumeData) {
      fetchJobs(keyword, location);
      fetchApplications();
    }
  }, [resumeData?.id]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(keyword, location);
  };

  const handleAutoApplyAll = async () => {
    const appliedIds = new Set(applications.map(a => a.job_id));
    const toApply = jobs.filter(j => !appliedIds.has(j.id)).slice(0, 3);

    if (toApply.length === 0) return;

    setIsApplyingAll(true);
    for (const job of toApply) {
      try {
        await apiClient(`/applications/apply?resume_id=${resumeData.id}&job_id=${job.id}`, { method: 'POST' });
      } catch (err) { console.error(err); }
    }
    setIsApplyingAll(false);
    fetchApplications();
  };

  if (!resumeData) {
    return <UploadModal />;
  }

  return (
    <div className="animate-fade-in dashboard-grid">
      {/* Sidebar: Profile & Stats */}
      <aside className="sidebar">
        <div className="glass-panel profile-section">
          <div className="flex-between mb-2">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>AI Profile</h3>
            <button onClick={clearResume} className="btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderRadius: '6px' }}>Reset</button>
          </div>
          <p className="text-secondary" style={{ fontSize: '0.9rem' }}>{resumeData.original_filename}</p>
          
          <div className="mt-2 flex-col gap-1">
            <h4 className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Extracted Skills</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {resumeData.extracted_skills.map((s, i) => (
                <span key={i} className="badge" style={{ background: 'rgba(124, 77, 255, 0.1)', color: 'var(--accent)', border: '1px solid rgba(124, 77, 255, 0.2)' }}>{s}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-panel stats-section">
          <h4 className="text-muted mb-1" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Applications Sent</h4>
          <div className="stats-number">{applications.length}</div>
        </div>
      </aside>

      {/* Main Feed: Job Search & Listings */}
      <main className="flex-col gap-2">
        <header className="flex-between mb-1" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Opportunity Feed</h2>
            <p className="text-secondary">🔴 Real-time listings from Remotive</p>
          </div>
          <button 
            className="btn btn-primary" 
            onClick={handleAutoApplyAll}
            disabled={isApplyingAll || jobs.length === 0}
            style={{ whiteSpace: 'nowrap' }}
          >
            {isApplyingAll ? <div className="spinner" style={{ width: '14px', height: '14px' }}></div> : '🚀'}
            {isApplyingAll ? 'Applying...' : 'Auto-Apply Top Matches'}
          </button>
        </header>

        <form onSubmit={handleSearch} className="search-bar glass-panel">
          <div className="search-input-group">
            <span style={{ marginLeft: '1rem', opacity: 0.5 }}>🔍</span>
            <input 
              type="text" 
              placeholder="Job title or keywords" 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <div className="divider"></div>
          <div className="search-input-group">
            <span style={{ marginLeft: '1rem', opacity: 0.5 }}>📍</span>
            <input 
              type="text" 
              placeholder="Location" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary search-btn">Find Jobs</button>
        </form>

        {loading ? (
          <div className="flex-col flex-center" style={{ minHeight: '400px', gap: '1rem' }}>
            <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '4px' }}></div>
            <p className="text-secondary animate-pulse">Scanning live job boards...</p>
          </div>
        ) : error ? (
          <div className="glass-panel text-center" style={{ padding: '4rem', border: '1px solid var(--danger)' }}>
            <span style={{ fontSize: '3rem' }}>⚠️</span>
            <h3 className="mt-1">{error}</h3>
            <button onClick={() => fetchJobs()} className="btn btn-secondary mt-2">Retry Connection</button>
          </div>
        ) : (
          <div className="flex-col gap-2">
            {jobs.length === 0 ? (
              <div className="glass-panel text-center" style={{ padding: '4rem' }}>
                <span style={{ fontSize: '3rem' }}>🔍</span>
                <h3 className="mt-1">No matching jobs found</h3>
                <p className="text-secondary">Try adjusting your search keywords or location filters.</p>
              </div>
            ) : (
              jobs.map(job => (
                <JobCard key={job.id} job={job} onAssist={() => setSelectedJob(job)} />
              ))
            )}
          </div>
        )}
      </main>

      {selectedJob && (
        <ApplicationAssistant 
          job={selectedJob} 
          resumeText={resumeData.text_content} 
          onClose={() => setSelectedJob(null)} 
        />
      )}
    </div>
  );
}
