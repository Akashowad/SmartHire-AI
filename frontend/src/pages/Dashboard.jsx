import React, { useEffect, useState } from 'react';
import { BriefcaseBusiness, CalendarDays, IndianRupee, MapPin, RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import { useApp } from '../context/AppContext';
import JobCard from '../components/JobCard';
import UploadModal from '../components/UploadModal';
import ApplicationAssistant from '../components/ApplicationAssistant';
import { apiClient } from '../api';

const jobTypeOptions = [
  { value: '', label: 'Any type' },
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Contract', label: 'Contract' },
  { value: 'freelance', label: 'Freelance' },
];

const datePostedOptions = [
  { value: '', label: 'Any date' },
  { value: '1d', label: 'Last 24 hours' },
  { value: '3d', label: 'Last 3 days' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
];

const sortOptions = [
  { value: 'match', label: 'Best match' },
  { value: 'newest', label: 'Newest' },
  { value: 'salary', label: 'Salary signal' },
  { value: 'company', label: 'Company A-Z' },
];

const popularLocations = ['Remote', 'India', 'United States', 'Europe', 'Worldwide', 'Bengaluru', 'Delhi', 'Mumbai'];

export default function Dashboard() {
  const {
    jobs,
    fetchJobs,
    resumeData,
    clearResume,
    applications,
    fetchApplications,
    loading,
    error,
  } = useApp();

  const [selectedJob, setSelectedJob] = useState(null);
  const [keyword, setKeyword] = useState(resumeData?.extracted_skills?.[0] || '');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [datePosted, setDatePosted] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [sortBy, setSortBy] = useState('match');
  const [isApplyingAll, setIsApplyingAll] = useState(false);

  useEffect(() => {
    if (resumeData) {
      fetchJobs(keyword, location, { jobType, datePosted, minSalary });
      fetchApplications();
    }
  }, [resumeData?.id]);

  const runSearch = (nextKeyword = keyword, nextLocation = location) => {
    fetchJobs(nextKeyword.trim(), nextLocation.trim(), { jobType, datePosted, minSalary });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    runSearch();
  };

  const handleClearSearch = () => {
    const defaultKeyword = resumeData?.extracted_skills?.[0] || '';
    setKeyword(defaultKeyword);
    setLocation('');
    setJobType('');
    setDatePosted('');
    setMinSalary('');
    setSortBy('match');
    fetchJobs(defaultKeyword, '', {});
  };

  const handleSkillSearch = (skill) => {
    setKeyword(skill);
    runSearch(skill, location);
  };

  const handleAutoApplyAll = async () => {
    const appliedIds = new Set(applications.map((a) => a.job_id));
    const toApply = jobs.filter((j) => !appliedIds.has(j.id)).slice(0, 3);

    if (toApply.length === 0) return;

    setIsApplyingAll(true);
    for (const job of toApply) {
      try {
        await apiClient(`/applications/apply?resume_id=${resumeData.id}&job_id=${job.id}`, { method: 'POST' });
      } catch (err) {
        console.error(err);
      }
    }
    setIsApplyingAll(false);
    fetchApplications();
  };

  if (!resumeData) {
    return <UploadModal />;
  }

  const sortedJobs = [...jobs].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.publication_date || 0) - new Date(a.publication_date || 0);
    }
    if (sortBy === 'salary') {
      const getSalaryScore = (job) => {
        const nums = String(job.salary || '').match(/\d+/g);
        return nums ? Math.max(...nums.map(Number)) : 0;
      };
      return getSalaryScore(b) - getSalaryScore(a);
    }
    if (sortBy === 'company') {
      return String(a.company || '').localeCompare(String(b.company || ''));
    }
    return 0;
  });

  const skillSuggestions = (resumeData?.extracted_skills || []).slice(0, 8);
  const activeFilterCount = [keyword, location, jobType, datePosted, minSalary].filter(Boolean).length;

  return (
    <div className="animate-fade-in dashboard-grid">
      <aside className="sidebar">
        <div className="glass-panel profile-section">
          <div className="flex-between mb-2">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>AI Profile</h3>
            <button onClick={clearResume} className="btn btn-secondary btn-sm">Reset</button>
          </div>
          <p className="text-secondary" style={{ fontSize: '0.9rem' }}>{resumeData.original_filename}</p>

          <div className="mt-2 flex-col gap-1">
            <h4 className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Extracted Skills</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {skillSuggestions.map((skill) => (
                <button key={skill} className="skill-chip" type="button" onClick={() => handleSkillSearch(skill)}>
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-panel stats-section">
          <h4 className="text-muted mb-1" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Applications Sent</h4>
          <div className="stats-number">{applications.length}</div>
        </div>
      </aside>

      <main className="flex-col gap-2">
        <header className="flex-between mb-1" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Opportunity Feed</h2>
            <p className="text-secondary">{jobs.length} live listings matched from remote job sources</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleAutoApplyAll}
            disabled={isApplyingAll || jobs.length === 0}
            style={{ whiteSpace: 'nowrap' }}
          >
            {isApplyingAll ? <div className="spinner" style={{ width: '14px', height: '14px' }} /> : <BriefcaseBusiness size={16} />}
            {isApplyingAll ? 'Applying...' : 'Auto-Apply Top Matches'}
          </button>
        </header>

        <form onSubmit={handleSearch} className="advanced-search glass-panel">
          <div className="search-head">
            <div>
              <div className="search-title">
                <SlidersHorizontal size={16} />
                Smart job search
              </div>
              <p className="text-secondary" style={{ fontSize: '0.82rem' }}>
                Search by role, skill, company, location, job type, date, and salary signal.
              </p>
            </div>
            <span className="badge badge-accent">{activeFilterCount} active</span>
          </div>

          <div className="search-fields">
            <label className="search-input-group">
              <span><Search size={16} /></span>
              <input
                list="job-keyword-suggestions"
                type="text"
                placeholder="Role, skill, company, or keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <datalist id="job-keyword-suggestions">
                {skillSuggestions.map((skill) => <option key={skill} value={skill} />)}
                <option value="Frontend Developer" />
                <option value="Python Developer" />
                <option value="Content Writer" />
                <option value="Product Manager" />
                <option value="Data Analyst" />
              </datalist>
            </label>

            <label className="search-input-group">
              <span><MapPin size={16} /></span>
              <input
                list="job-location-suggestions"
                type="text"
                placeholder="Remote, India, city, or timezone"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <datalist id="job-location-suggestions">
                {popularLocations.map((loc) => <option key={loc} value={loc} />)}
              </datalist>
            </label>
          </div>

          <div className="filter-grid">
            <label className="filter-field">
              <span><BriefcaseBusiness size={14} /> Type</span>
              <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
                {jobTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>

            <label className="filter-field">
              <span><CalendarDays size={14} /> Posted</span>
              <select value={datePosted} onChange={(e) => setDatePosted(e.target.value)}>
                {datePostedOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>

            <label className="filter-field">
              <span><IndianRupee size={14} /> Min salary</span>
              <input
                type="number"
                min="0"
                step="1000"
                placeholder="Optional"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
              />
            </label>

            <label className="filter-field">
              <span><SlidersHorizontal size={14} /> Sort</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
          </div>

          {skillSuggestions.length > 0 && (
            <div className="skill-quick-search">
              <span className="text-muted">Quick skills:</span>
              {skillSuggestions.map((skill) => (
                <button type="button" key={skill} className="skill-chip" onClick={() => handleSkillSearch(skill)}>
                  {skill}
                </button>
              ))}
            </div>
          )}

          <div className="search-actions">
            <button type="button" className="btn btn-secondary" onClick={handleClearSearch}>
              <RotateCcw size={16} />
              Clear
            </button>
            <button type="submit" className="btn btn-primary search-btn">
              <Search size={16} />
              Find Jobs
            </button>
          </div>
        </form>

        {loading ? (
          <div className="flex-col flex-center" style={{ minHeight: '400px', gap: '1rem' }}>
            <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '4px' }} />
            <p className="text-secondary animate-pulse">Scanning live job boards...</p>
          </div>
        ) : error ? (
          <div className="glass-panel text-center" style={{ padding: '4rem', border: '1px solid var(--danger)' }}>
            <h3 className="mt-1">{error}</h3>
            <button onClick={() => runSearch()} className="btn btn-secondary mt-2">Retry Connection</button>
          </div>
        ) : (
          <div className="flex-col gap-2">
            {jobs.length === 0 ? (
              <div className="glass-panel text-center" style={{ padding: '4rem' }}>
                <Search size={36} style={{ color: 'var(--text-muted)' }} />
                <h3 className="mt-1">No matching jobs found</h3>
                <p className="text-secondary">Try adjusting your search keywords or location filters.</p>
              </div>
            ) : (
              sortedJobs.map((job) => (
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
