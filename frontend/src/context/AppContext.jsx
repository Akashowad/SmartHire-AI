import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient, MOCK_JOBS } from '../api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [resumeData, setResumeData] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Persistence: Load resume from localStorage on mount
  useEffect(() => {
    const savedResume = localStorage.getItem('smarthire_resume');
    if (savedResume) {
      setResumeData(JSON.parse(savedResume));
    }
  }, []);

  const updateResume = (data) => {
    setResumeData(data);
    localStorage.setItem('smarthire_resume', JSON.stringify(data));
  };

  const clearResume = () => {
    setResumeData(null);
    localStorage.removeItem('smarthire_resume');
  };

  const fetchJobs = async (keyword = '', location = '', filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (keyword) params.set('keyword', keyword);
      if (location) params.set('location', location);
      if (filters.jobType) params.set('jobType', filters.jobType);
      if (filters.datePosted) params.set('datePosted', filters.datePosted);
      if (filters.minSalary) params.set('minSalary', filters.minSalary);

      const data = await apiClient(`/jobs/?${params.toString()}`);
      setJobs(data);
    } catch (err) {
      console.warn('Backend unavailable, using mock data:', err);
      // Fallback to mock data
      const filteredJobs = MOCK_JOBS.filter(job => {
        const matchesKeyword = !keyword || job.title.toLowerCase().includes(keyword.toLowerCase()) || job.tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase()));
        const matchesLocation = !location || job.location.toLowerCase().includes(location.toLowerCase());
        const matchesJobType = !filters.jobType || job.job_type?.toLowerCase() === filters.jobType.toLowerCase();
        const matchesMinSalary = !filters.minSalary || (job.salary_max && job.salary_max >= filters.minSalary);
        return matchesKeyword && matchesLocation && matchesJobType && matchesMinSalary;
      });
      setJobs(filteredJobs);
      setError('Using offline data - backend unavailable');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const data = await apiClient('/applications/');
      setApplications(data);
    } catch (err) {
      console.error('Failed to fetch applications', err);
    }
  };

  return (
    <AppContext.Provider value={{
      jobs, setJobs,
      resumeData, updateResume, clearResume,
      applications, fetchApplications,
      loading, setLoading,
      error, setError,
      fetchJobs
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
