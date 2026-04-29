import { extractTextFromFile } from './utils/pdfParser';
import { detectSkills, detectEducation, detectExperienceYears } from './utils/skillsDatabase';
import { calculateMatchScore } from './utils/matchingEngine';

const MOCK_DELAY = 400;
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ─── Real Job API Fetchers ───

async function fetchRemotiveJobs(keyword = '', limit = 50) {
  const url = new URL('https://remotive.com/api/remote-jobs');
  if (keyword) url.searchParams.set('search', keyword);
  url.searchParams.set('limit', String(limit));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Remotive API failed');
  const data = await res.json();

  return (data.jobs || []).map(job => {
    const plainDesc = job.description
      ? job.description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
      : '';
    return {
      id: `remotive-${job.id}`,
      title: job.title,
      company: job.company_name || 'Unknown',
      company_logo: job.company_logo_url || null,
      location: job.candidate_required_location || 'Remote',
      job_type: job.job_type === 'full_time' ? 'Full-time' : job.job_type === 'contract' ? 'Contract' : job.job_type || 'Full-time',
      salary: job.salary || '',
      source: 'Remotive',
      source_region: 'Global',
      excerpt: plainDesc.slice(0, 200) + (plainDesc.length > 200 ? '...' : ''),
      description: plainDesc,
      apply_url: job.url || '#',
      tags: job.tags || [],
      publication_date: job.publication_date,
    };
  });
}

async function fetchRemoteOKJobs() {
  const res = await fetch('https://remoteok.com/api');
  if (!res.ok) throw new Error('RemoteOK API failed');
  const data = await res.json();
  const jobs = Array.isArray(data) ? data.slice(1) : [];

  return jobs.map((job, idx) => {
    const desc = job.description || job.position || '';
    const plainDesc = desc.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return {
      id: `remoteok-${job.id || idx}`,
      title: job.position || 'Unknown',
      company: job.company || 'Unknown',
      company_logo: job.logo || null,
      location: job.location || 'Remote',
      job_type: 'Full-time',
      salary: job.salary || '',
      source: 'RemoteOK',
      source_region: 'Global',
      excerpt: plainDesc.slice(0, 200) + (plainDesc.length > 200 ? '...' : ''),
      description: plainDesc,
      apply_url: job.apply_url || job.url || '#',
      tags: job.tags || [],
      publication_date: job.date,
    };
  });
}

async function fetchWeWorkRemotelyJobs() {
  try {
    const res = await fetch('https://weworkremotely.com/feed', { mode: 'no-cors' });
    return [];
  } catch {
    return [];
  }
}

// ─── Adzuna India API ───
// Free tier: 100 calls/day. Set VITE_ADZUNA_APP_ID and VITE_ADZUNA_APP_KEY in .env
async function fetchAdzunaIndiaJobs(keyword = '', location = '') {
  const APP_ID = import.meta.env?.VITE_ADZUNA_APP_ID || '';
  const APP_KEY = import.meta.env?.VITE_ADZUNA_APP_KEY || '';

  if (!APP_ID || !APP_KEY) {
    console.warn('Adzuna India: No API keys provided. Set VITE_ADZUNA_APP_ID and VITE_ADZUNA_APP_KEY.');
    return [];
  }

  try {
    const url = new URL('https://api.adzuna.com/v1/api/jobs/in/search/1');
    url.searchParams.set('app_id', APP_ID);
    url.searchParams.set('app_key', APP_KEY);
    url.searchParams.set('results_per_page', '50');
    if (keyword) url.searchParams.set('what', keyword);
    if (location) url.searchParams.set('where', location);

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Adzuna India API failed');
    const data = await res.json();

    return (data.results || []).map((job, idx) => {
      const company = job.company?.display_name || 'Unknown';
      const loc = job.location?.display_name || 'India';
      const title = job.title || 'Unknown';
      // Adzuna redirect_url goes directly to the company's job page (Naukri, LinkedIn, etc.)
      const applyUrl = job.redirect_url || '#';
      const desc = job.description || '';
      const plainDesc = desc.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

      return {
        id: `adzuna-in-${job.id || idx}`,
        title: title,
        company: company,
        company_logo: null,
        location: loc,
        job_type: job.contract_type === 'contract' ? 'Contract' : 'Full-time',
        salary: job.salary_max
          ? `₹${(job.salary_min / 100000).toFixed(1)}L – ₹${(job.salary_max / 100000).toFixed(1)}L`
          : '',
        source: 'Adzuna India',
        source_region: 'India',
        excerpt: plainDesc.slice(0, 200) + (plainDesc.length > 200 ? '...' : ''),
        description: plainDesc,
        apply_url: applyUrl,
        tags: job.category?.tag ? [job.category.tag] : [],
        publication_date: job.created_at,
      };
    });
  } catch (err) {
    console.warn('Adzuna India fetch failed:', err.message);
    return [];
  }
}

// ─── Remotive India search ───
async function fetchRemotiveIndiaJobs(keyword = '') {
  try {
    const searchKw = keyword ? `${keyword} India` : 'India';
    const jobs = await fetchRemotiveJobs(searchKw, 50);
    // Filter to India-specific jobs
    return jobs.filter(j =>
      j.location.toLowerCase().includes('india') ||
      j.title.toLowerCase().includes('india') ||
      j.tags.some(t => t.toLowerCase().includes('india'))
    ).map(j => ({ ...j, source_region: 'India' }));
  } catch {
    return [];
  }
}

async function fetchRealJobs(keyword = '', location = '', filters = {}) {
  const isIndiaSearch = location.toLowerCase().includes('india') || keyword.toLowerCase().includes('india');

  const results = await Promise.allSettled([
    fetchRemotiveJobs(keyword),
    fetchRemoteOKJobs(),
    fetchWeWorkRemotelyJobs(),
    // Always fetch Indian jobs when location=India or keyword contains India
    ...(isIndiaSearch ? [
      fetchAdzunaIndiaJobs(keyword, location),
      fetchRemotiveIndiaJobs(keyword),
    ] : [
      // Also silently fetch some Indian jobs for diversity
      fetchAdzunaIndiaJobs(keyword, location),
    ]),
  ]);

  let allJobs = [];
  for (const r of results) {
    if (r.status === 'fulfilled') allJobs = allJobs.concat(r.value);
    else console.warn('Job source failed:', r.reason);
  }

  if (allJobs.length === 0 && results.every(r => r.status === 'rejected')) {
    throw new Error('All job sources failed. Please check your internet connection.');
  }

  if (location) {
    const loc = location.toLowerCase();
    allJobs = allJobs.filter(j =>
      j.location.toLowerCase().includes(loc) ||
      j.title.toLowerCase().includes(loc) ||
      j.tags.some(t => t.toLowerCase().includes(loc))
    );
  }

  if (filters.jobType) {
    allJobs = allJobs.filter(j => j.job_type?.toLowerCase() === filters.jobType.toLowerCase());
  }

  if (filters.minSalary) {
    allJobs = allJobs.filter(j => {
      if (!j.salary) return true;
      const nums = j.salary.match(/\d+/g);
      if (!nums) return true;
      const min = Math.min(...nums.map(n => parseInt(n)));
      return min >= filters.minSalary;
    });
  }

  if (filters.datePosted) {
    const now = new Date();
    const daysMap = { '1d': 1, '3d': 3, '7d': 7, '14d': 14, '30d': 30 };
    const maxDays = daysMap[filters.datePosted];
    if (maxDays) {
      allJobs = allJobs.filter(j => {
        if (!j.publication_date) return true;
        const jobDate = new Date(j.publication_date);
        const diffDays = (now - jobDate) / (1000 * 60 * 60 * 24);
        return diffDays <= maxDays;
      });
    }
  }

  const seen = new Set();
  allJobs = allJobs.filter(j => {
    if (seen.has(j.apply_url)) return false;
    seen.add(j.apply_url);
    return true;
  });

  return allJobs;
}

// ─── Mock API Client ───

export const apiClient = async (endpoint, options = {}) => {
  await wait(MOCK_DELAY);
  const token = localStorage.getItem('smarthire_token');

  if (endpoint === '/auth/login') {
    const { username, password } = options.body || {};
    if (!username || !password) throw new Error('Username and password required');
    const mockToken = 'mock_jwt_' + Date.now();
    return { access_token: mockToken, token_type: 'bearer' };
  }

  if (endpoint === '/auth/signup') {
    const { username, email, password } = options.body || {};
    if (!username || !email || !password) throw new Error('All fields required');
    const mockToken = 'mock_jwt_' + Date.now();
    return { access_token: mockToken, token_type: 'bearer' };
  }

  if (endpoint === '/auth/me') {
    if (!token) throw new Error('Not authenticated');
    return { username: 'demouser', email: 'demo@smarthire.ai', id: 'user-1' };
  }

  if (endpoint.startsWith('/jobs/')) {
    const url = new URL('http://localhost' + endpoint);
    const keyword = url.searchParams.get('keyword') || '';
    const location = url.searchParams.get('location') || '';
    const filters = {};
    if (url.searchParams.has('jobType')) filters.jobType = url.searchParams.get('jobType');
    if (url.searchParams.has('datePosted')) filters.datePosted = url.searchParams.get('datePosted');
    const jobs = await fetchRealJobs(keyword, location, filters);
    localStorage.setItem('smarthire_jobs', JSON.stringify(jobs));
    return jobs;
  }

  if (endpoint === '/resumes/upload-resume') {
    const formData = options.body;
    const file = formData instanceof FormData ? formData.get('file') : null;

    if (file && file.size > 0) {
      try {
        const textContent = await extractTextFromFile(file);
        const extracted_skills = detectSkills(textContent);
        const education = detectEducation(textContent);
        const experience_years = detectExperienceYears(textContent);

        return {
          id: 'resume-' + Date.now(),
          original_filename: file.name,
          text_content: textContent,
          extracted_skills,
          education,
          experience_years,
        };
      } catch (err) {
        console.error('Resume parsing error:', err);
      }
    }

    return {
      id: 'resume-' + Date.now(),
      original_filename: file ? file.name : 'resume.pdf',
      text_content: "Experienced software engineer with 6 years of experience in full-stack development.\n\nSkills: React, TypeScript, Node.js, Python, PostgreSQL, AWS, Docker, Kubernetes, GraphQL, REST APIs, CI/CD, Agile methodologies.\n\nEducation: B.Tech in Computer Science, IIT Bombay (2018).\n\nExperience:\n- Senior Engineer at TechCorp (2021-Present): Built microservices serving 10M+ users.\n- Full Stack Developer at StartupX (2018-2021): Led product development from 0 to 1.",
      extracted_skills: ["React", "TypeScript", "Node.js", "Python", "PostgreSQL", "AWS", "Docker", "Kubernetes", "GraphQL"],
      education: ["B.Tech Computer Science, IIT Bombay"],
      experience_years: 6
    };
  }

  if (endpoint.startsWith('/matches/')) {
    const url = new URL('http://localhost' + endpoint);
    const jobId = url.searchParams.get('job_id') || '';
    const resumeId = url.searchParams.get('resume_id') || '';

    const savedResume = localStorage.getItem('smarthire_resume');
    let resumeData = null;
    if (savedResume) {
      try { resumeData = JSON.parse(savedResume); } catch (e) {}
    }

    if (!resumeData) {
      resumeData = {
        id: resumeId,
        extracted_skills: ["React", "TypeScript", "Node.js", "Python", "PostgreSQL", "AWS"],
        text_content: "Software engineer with React, TypeScript, Node.js, Python, PostgreSQL, AWS experience.",
        experience_years: 6,
      };
    }

    const storedJobs = JSON.parse(localStorage.getItem('smarthire_jobs') || '[]');
    const job = storedJobs.find(j => j.id === jobId);

    if (job) {
      return calculateMatchScore(resumeData, job);
    }

    let hash = 0;
    for (let i = 0; i < jobId.length; i++) { hash = ((hash << 5) - hash) + jobId.charCodeAt(i); hash |= 0; }
    return { match_percentage: 45 + (Math.abs(hash) % 54) };
  }

  if (endpoint === '/applications/') {
    const saved = localStorage.getItem('smarthire_applications');
    return saved ? JSON.parse(saved) : [];
  }

  if (endpoint.startsWith('/applications/apply')) {
    const url = new URL('http://localhost' + endpoint);
    const jobId = url.searchParams.get('job_id');
    const saved = localStorage.getItem('smarthire_applications');
    const apps = saved ? JSON.parse(saved) : [];
    if (!apps.some(a => a.job_id === jobId)) {
      apps.push({
        job_id: jobId,
        applied_at: new Date().toISOString(),
        status: 'applied'
      });
      localStorage.setItem('smarthire_applications', JSON.stringify(apps));
    }
    return { success: true };
  }

  if (endpoint === '/ai/analyze') {
    const body = options.body || {};
    const resumeText = body.resume || '';
    const jobDesc = body.job_description || '';
    const resumeSkills = detectSkills(resumeText);
    const jobSkills = detectSkills(jobDesc);
    const matched = resumeSkills.filter(s => jobSkills.some(js => js.toLowerCase() === s.toLowerCase()));
    const missing = jobSkills.filter(s => !resumeSkills.some(rs => rs.toLowerCase() === s.toLowerCase()));

    return {
      match_score: Math.round((matched.length / Math.max(jobSkills.length, 1)) * 100),
      strengths: matched.slice(0, 5).map(s => `Strong experience with ${s}`),
      missing_skills: missing.slice(0, 5),
      improvement_suggestions: [
        'Add quantified impact metrics to your resume',
        'Include links to relevant projects or portfolio',
        'Consider obtaining certifications in key missing skills',
        'Tailor your resume keywords for each job application',
      ],
      ats_keywords: jobSkills.slice(0, 8),
      interview_questions: {
        technical: [
          'Describe a challenging technical problem you solved recently',
          'How do you approach debugging complex issues?',
          'Explain your experience with system design at scale',
        ],
        hr: [
          'Tell us about a time you had to learn something quickly',
          'How do you handle conflicting priorities?',
          'Describe your ideal work environment',
        ],
        scenario: [
          'A critical bug is found in production on Friday evening. What do you do?',
          'Your team disagrees on the technical approach. How do you resolve it?',
        ],
      }
    };
  }

  if (endpoint === '/ai/recommendations') {
    const body = options.body || {};
    const resumeSkills = detectSkills(body.resume_text || '');
    const jobSkills = detectSkills(body.job_description || '');
    const matched = resumeSkills.filter(s => jobSkills.some(js => js.toLowerCase() === s.toLowerCase()));
    const missing = jobSkills.filter(s => !resumeSkills.some(rs => rs.toLowerCase() === s.toLowerCase()));

    return {
      why_matches: `Your profile shows expertise in ${matched.slice(0, 4).join(', ') || 'relevant technologies'} which aligns well with this role. ${matched.length >= 4 ? 'This is a strong match for the position requirements.' : 'Consider highlighting more relevant skills in your resume.'}`,
      skills_to_improve: missing.slice(0, 5),
    };
  }

  if (endpoint === '/ai/cover-letter') {
    const body = options.body || {};
    const jobDesc = body.job_description || '';
    const resumeText = body.resume_text || '';
    const resumeSkills = detectSkills(resumeText);
    const jobTitle = jobDesc.split('\n')[0].slice(0, 60) || 'this position';

    return {
      cover_letter: `Dear Hiring Manager,\n\nI am writing to express my strong interest in ${jobTitle}. With my background in ${resumeSkills.slice(0, 4).join(', ')}, I am confident in my ability to contribute meaningfully to your team.\n\nMy experience includes building scalable applications, collaborating with cross-functional teams, and continuously learning new technologies. I am particularly drawn to this opportunity because it aligns with my passion for impactful software development.\n\nThank you for considering my application. I would welcome the opportunity to discuss how my background aligns with your team's goals.\n\nSincerely,\nApplicant`,
      email_template: `Subject: Application for ${jobTitle}\n\nHi Hiring Team,\n\nI hope this email finds you well. I am a software engineer with expertise in ${resumeSkills.slice(0, 4).join(', ')}.\n\nI recently came across ${jobTitle} and was immediately excited by the opportunity to contribute to your organization.\n\nKey highlights of my background:\n• ${resumeSkills.slice(0, 3).join('\n• ')}\n\nI would love the opportunity to discuss how I can contribute to your team's continued growth.\n\nBest regards,\nApplicant`,
    };
  }

  console.warn('Mock API: unhandled endpoint', endpoint);
  return {};
};

export const login = async (username, password) => {
  const data = await apiClient('/auth/login', { method: 'POST', body: { username, password } });
  if (data.access_token) localStorage.setItem('smarthire_token', data.access_token);
  return data;
};

export const signup = async (username, email, password) => {
  const data = await apiClient('/auth/signup', { method: 'POST', body: { username, email, password } });
  if (data.access_token) localStorage.setItem('smarthire_token', data.access_token);
  return data;
};

export const me = async () => apiClient('/auth/me');

export const logout = () => {
  localStorage.removeItem('smarthire_token');
  localStorage.removeItem('smarthire_resume');
  localStorage.removeItem('smarthire_applications');
  localStorage.removeItem('smarthire_jobs');
};
