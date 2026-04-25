import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [resumeData, setResumeData] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedResume = localStorage.getItem('smarthire_resume');
    if (savedResume) {
      try {
        setResumeData(JSON.parse(savedResume));
      } catch (e) {
        localStorage.removeItem('smarthire_resume');
      }
    }
    const savedApps = localStorage.getItem('smarthire_applications');
    if (savedApps) {
      try {
        setApplications(JSON.parse(savedApps));
      } catch (e) {
        localStorage.removeItem('smarthire_applications');
      }
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

  const fetchJobs = async (keyword = '', location = '') => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient(`/jobs/?keyword=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}`);
      setJobs(data);
    } catch (err) {
      setError('Failed to fetch jobs. Please try again.');
      console.error(err);
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

  const analyzeResume = async (resumeText, jobDescription) => {
    const data = await apiClient('/ai/analyze', {
      method: 'POST',
      body: { resume: resumeText, job_description: jobDescription }
    });
    return data;
  };

  return (
    <AppContext.Provider value={{
      jobs, setJobs,
      resumeData, updateResume, clearResume,
      applications, fetchApplications,
      loading, setLoading,
      error, setError,
      fetchJobs,
      analyzeResume
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

