import React, { useState, useEffect } from 'react';
import JobCard from '../components/JobCard';
import ApplicationAssistant from '../components/ApplicationAssistant';
import { apiClient } from '../api';

export default function Dashboard({ resumeData }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    fetchJobs();
  }, [keyword, location]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await apiClient(`/jobs/?location=${location}&keyword=${keyword}`);
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', gap: '2rem', marginTop: '1rem', flexWrap: 'wrap' }}>
      {/* Left panel: Stats & Information */}
      <div className="glass-panel" style={{ flex: '1', minWidth: '300px', padding: '2rem', height: 'fit-content' }}>
        <h2 className="mb-3 text-accent" style={{ fontSize: '1.5rem', fontWeight: 600 }}>Resume Insights</h2>
        
        <div className="mb-3">
          <h3 className="text-secondary mb-1" style={{ fontSize: '1.05rem', fontWeight: 500 }}>Detected Skills</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {resumeData.extracted_skills.length === 0 ? <p className="text-secondary">No skills detected.</p> :
              resumeData.extracted_skills.map((s, i) => (
                <span key={i} className="badge badge-accent">
                  {s}
                </span>
              ))
            }
          </div>
        </div>

        <div className="mb-3">
          <h3 className="text-secondary mb-1" style={{ fontSize: '1.05rem', fontWeight: 500 }}>Experience Hits</h3>
          <ul style={{ paddingLeft: '1.2rem', gap: '0.4rem', display: 'flex', flexDirection: 'column' }}>
            {resumeData.experience.length === 0 ? <p className="text-secondary">None identified</p> : 
              resumeData.experience.map((exp, i) => (
                <li key={i} style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{exp}</li>
              ))
            }
          </ul>
        </div>
      </div>

      {/* Right panel: Jobs list */}
      <div style={{ flex: '2', minWidth: '400px' }}>
        <div className="flex-between mb-3">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Recommended Jobs</h2>
          <span className="text-secondary" style={{ fontSize: '0.9rem' }}>Based on recent posts</span>
        </div>
        
        <div className="flex-between gap-2 mb-3">
          <input 
            type="text" 
            placeholder="Search keyword..." 
            className="input-field" 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Location..." 
            className="input-field" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex-col flex-center gap-2 mt-4">
            <span className="spinner" style={{ width: '32px', height: '32px' }}></span>
            <p className="text-secondary">Scanning job listings...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="glass-panel p-4 text-center">
            <p className="text-secondary">No jobs found matching your filters.</p>
          </div>
        ) : (
          <div className="flex-col gap-3">
              {jobs.map(job => (
                  <JobCard 
                      key={job.id} 
                      job={job} 
                      resumeId={resumeData.id} 
                      resumeText={resumeData.text_content}
                      onAssist={() => setSelectedJob(job)} 
                  />
              ))}
          </div>
        )}
      </div>

      {/* Application Assistant Modal */}
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
