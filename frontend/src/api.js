import { extractTextFromFile } from './utils/pdfParser';
import { detectSkills, detectEducation, detectExperienceYears } from './utils/skillsDatabase';
import { calculateMatchScore } from './utils/matchingEngine';

const MOCK_DELAY = 400;
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const daysAgo = (days) => new Date(Date.now() - days * 86400000).toISOString();
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const INDIAN_OPPORTUNITIES = [
  {
    id: 'india-tcs-software-engineer',
    title: 'Software Engineer',
    company: 'Tata Consultancy Services',
    location: 'India Remote - Bengaluru, Pune, Chennai',
    job_type: 'Full-time',
    salary: '₹8L - ₹18L',
    salary_min: 800000,
    salary_max: 1800000,
    source: 'SmartHire India',
    source_region: 'India',
    description: 'Build scalable enterprise web applications using React, Node.js, Python, SQL, cloud services, APIs, and agile engineering practices.',
    apply_url: 'https://www.tcs.com/careers',
    tags: ['React', 'Node.js', 'Python', 'SQL', 'AWS', 'India'],
    publication_date: daysAgo(1),
  },
  {
    id: 'india-infosys-react-developer',
    title: 'React Frontend Developer',
    company: 'Infosys',
    location: 'India Remote - Hyderabad, Bengaluru, Mysuru',
    job_type: 'Full-time',
    salary: '₹7L - ₹16L',
    salary_min: 700000,
    salary_max: 1600000,
    source: 'SmartHire India',
    source_region: 'India',
    description: 'Create accessible, high-performance React interfaces with TypeScript, REST APIs, reusable components, testing, and modern frontend tooling.',
    apply_url: 'https://www.infosys.com/careers/',
    tags: ['React', 'TypeScript', 'JavaScript', 'Frontend', 'India'],
    publication_date: daysAgo(2),
  },
  {
    id: 'india-wipro-python-backend',
    title: 'Python Backend Engineer',
    company: 'Wipro',
    location: 'India Hybrid - Bengaluru, Chennai, Noida',
    job_type: 'Full-time',
    salary: '₹9L - ₹20L',
    salary_min: 900000,
    salary_max: 2000000,
    source: 'SmartHire India',
    source_region: 'India',
    description: 'Develop backend services with Python, FastAPI, PostgreSQL, Docker, cloud deployment, monitoring, and secure API integrations.',
    apply_url: 'https://careers.wipro.com/',
    tags: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'AWS', 'India'],
    publication_date: daysAgo(1),
  },
  {
    id: 'india-zoho-fullstack',
    title: 'Full Stack Developer',
    company: 'Zoho',
    location: 'India On-site/Hybrid - Chennai',
    job_type: 'Full-time',
    salary: '₹10L - ₹24L',
    salary_min: 1000000,
    salary_max: 2400000,
    source: 'SmartHire India',
    source_region: 'India',
    description: 'Own product features across frontend and backend using JavaScript, React, Node.js, databases, APIs, debugging, and product-minded engineering.',
    apply_url: 'https://www.zoho.com/careers/',
    tags: ['React', 'Node.js', 'JavaScript', 'SQL', 'Product', 'India'],
    publication_date: daysAgo(3),
  },
  {
    id: 'india-freshworks-devops',
    title: 'DevOps Engineer',
    company: 'Freshworks',
    location: 'India Hybrid - Chennai, Bengaluru, Hyderabad',
    job_type: 'Full-time',
    salary: '₹12L - ₹28L',
    salary_min: 1200000,
    salary_max: 2800000,
    source: 'SmartHire India',
    source_region: 'India',
    description: 'Improve cloud reliability with AWS, Docker, Kubernetes, CI/CD, observability, incident response, automation, and production operations.',
    apply_url: 'https://www.freshworks.com/company/careers/',
    tags: ['AWS', 'Docker', 'Kubernetes', 'DevOps', 'CI/CD', 'India'],
    publication_date: daysAgo(2),
  },
  {
    id: 'india-razorpay-data-analyst',
    title: 'Data Analyst',
    company: 'Razorpay',
    location: 'India Hybrid - Bengaluru',
    job_type: 'Full-time',
    salary: '₹8L - ₹22L',
    salary_min: 800000,
    salary_max: 2200000,
    source: 'SmartHire India',
    source_region: 'India',
    description: 'Analyze product and business data using SQL, dashboards, experimentation, metrics, stakeholder communication, and analytical storytelling.',
    apply_url: 'https://razorpay.com/jobs/',
    tags: ['SQL', 'Analytics', 'Data', 'Communication', 'India'],
    publication_date: daysAgo(1),
  },
  {
    id: 'india-swiggy-software-engineer',
    title: 'Software Development Engineer',
    company: 'Swiggy',
    location: 'India Hybrid - Bengaluru',
    job_type: 'Full-time',
    salary: '₹14L - ₹35L',
    salary_min: 1400000,
    salary_max: 3500000,
    source: 'SmartHire India',
    source_region: 'India',
    description: 'Build high-scale consumer systems using backend services, APIs, distributed systems, cloud infrastructure, databases, and product engineering.',
    apply_url: 'https://careers.swiggy.com/',
    tags: ['Software Engineer', 'Node.js', 'Python', 'AWS', 'SQL', 'India'],
    publication_date: daysAgo(2),
  },
  {
    id: 'india-meesho-frontend',
    title: 'Frontend Engineer',
    company: 'Meesho',
    location: 'India Remote/Hybrid - Bengaluru',
    job_type: 'Full-time',
    salary: '₹12L - ₹30L',
    salary_min: 1200000,
    salary_max: 3000000,
    source: 'SmartHire India',
    source_region: 'India',
    description: 'Ship fast, polished React experiences for ecommerce workflows with TypeScript, performance optimization, design systems, and experimentation.',
    apply_url: 'https://www.meesho.io/jobs',
    tags: ['React', 'TypeScript', 'Frontend', 'Performance', 'India'],
    publication_date: daysAgo(1),
  },
];

export const MOCK_JOBS = INDIAN_OPPORTUNITIES;

function getIndianOpportunities(keyword = '', location = '') {
  const terms = `${keyword} ${location}`.toLowerCase().split(/\s+/).filter(Boolean);
  const genericTerms = new Set(['india', 'remote', 'job', 'jobs', 'role', 'roles', 'opportunity', 'opportunities']);

  return INDIAN_OPPORTUNITIES.filter((job) => {
    const haystack = `${job.title} ${job.company} ${job.location} ${job.description} ${job.tags.join(' ')}`.toLowerCase();
    const searchableTerms = terms.filter((term) => !genericTerms.has(term));
    return searchableTerms.length === 0 || searchableTerms.some((term) => haystack.includes(term));
  }).map((job) => ({
    ...job,
    company_logo: null,
    excerpt: job.description.slice(0, 200) + (job.description.length > 200 ? '...' : ''),
  }));
}

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

  if (isIndiaSearch) {
    allJobs = allJobs.concat(getIndianOpportunities(keyword, location));
  }

  if (allJobs.length === 0 && results.every(r => r.status === 'rejected')) {
    throw new Error('All job sources failed. Please check your internet connection.');
  }

  if (location) {
    const loc = location.toLowerCase();
    allJobs = allJobs.filter(j =>
      (loc === 'india' && j.source_region === 'India') ||
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
      if (j.salary_max) return Number(j.salary_max) >= filters.minSalary;
      if (j.salary_min) return Number(j.salary_min) >= filters.minSalary;
      const nums = j.salary.match(/\d+/g);
      if (!nums) return true;
      const max = Math.max(...nums.map(n => parseInt(n, 10)));
      return max >= filters.minSalary;
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

  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  const headers = {
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let body = options.body;
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }

  const response = await fetch(url, {
    method: options.method || (body ? 'POST' : 'GET'),
    headers,
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed (${response.status}): ${errorText}`);
  }

  if (response.status === 204 || response.headers.get('Content-Length') === '0') {
    return null;
  }

  return await response.json();
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
