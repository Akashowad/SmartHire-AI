// Browser-only API layer for standalone static deployment
// Fetches real jobs from public APIs; other features use mock data

const MOCK_DELAY = 600;

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
    // Strip HTML tags from description for excerpt
    const plainDesc = job.description
      ? job.description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
      : '';
    return {
      id: `remotive-${job.id}`,
      title: job.title,
      company: job.company_name,
      company_logo: job.company_logo || null,
      location: job.candidate_required_location || 'Remote',
      job_type: job.job_type === 'full_time' ? 'Full-time' : job.job_type === 'contract' ? 'Contract' : job.job_type || 'Full-time',
      salary: job.salary || '',
      source: 'Remotive',
      source_region: 'Global',
      excerpt: plainDesc.slice(0, 200) + (plainDesc.length > 200 ? '...' : ''),
      description: plainDesc,
      apply_url: job.url || '#',
      tags: job.tags || [],
      _raw: job
    };
  });
}

async function fetchRemoteOKJobs() {
  const res = await fetch('https://remoteok.com/api');
  if (!res.ok) throw new Error('RemoteOK API failed');
  const data = await res.json();
  // First item is usually metadata
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
      _raw: job
    };
  });
}

async function fetchRealJobs(keyword = '', location = '') {
  const results = await Promise.allSettled([
    fetchRemotiveJobs(keyword),
    fetchRemoteOKJobs()
  ]);

  let allJobs = [];

  for (const r of results) {
    if (r.status === 'fulfilled') {
      allJobs = allJobs.concat(r.value);
    } else {
      console.warn('Job source failed:', r.reason);
    }
  }

  // If both APIs failed, throw so caller can show error
  if (allJobs.length === 0 && results.every(r => r.status === 'rejected')) {
    throw new Error('All job sources failed. Please check your internet connection.');
  }

  // Location filter (client-side, since APIs don't all support it)
  if (location) {
    const loc = location.toLowerCase();
    allJobs = allJobs.filter(j =>
      j.location.toLowerCase().includes(loc) ||
      j.title.toLowerCase().includes(loc) ||
      j.tags.some(t => t.toLowerCase().includes(loc))
    );
  }

  // De-duplicate by URL
  const seen = new Set();
  allJobs = allJobs.filter(j => {
    if (seen.has(j.apply_url)) return false;
    seen.add(j.apply_url);
    return true;
  });

  return allJobs;
}
// Mock API client
export const apiClient = async (endpoint, options = {}) => {
  await wait(MOCK_DELAY);

  const token = localStorage.getItem('smarthire_token');

  // Auth endpoints
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

  // Jobs endpoint — fetch real jobs from public APIs
  if (endpoint.startsWith('/jobs/')) {
    const url = new URL('http://localhost' + endpoint);
    const keyword = url.searchParams.get('keyword') || '';
    const location = url.searchParams.get('location') || '';
    return fetchRealJobs(keyword, location);
  }

  // Resume upload
  if (endpoint === '/resumes/upload-resume') {
    const mockResumeId = 'resume-' + Date.now();
    return {
      id: mockResumeId,
      original_filename: 'resume.pdf',
      text_content: "Experienced software engineer with 6 years of experience in full-stack development.\n\nSkills: React, TypeScript, Node.js, Python, PostgreSQL, AWS, Docker, Kubernetes, GraphQL, REST APIs, CI/CD, Agile methodologies.\n\nEducation: B.Tech in Computer Science, IIT Bombay (2018).\n\nExperience:\n- Senior Engineer at TechCorp (2021-Present): Built microservices serving 10M+ users.\n- Full Stack Developer at StartupX (2018-2021): Led product development from 0 to 1.",
      extracted_skills: ["React", "TypeScript", "Node.js", "Python", "PostgreSQL", "AWS", "Docker", "Kubernetes", "GraphQL"],
      education: ["B.Tech Computer Science, IIT Bombay"],
      experience_years: 6
    };
  }

  // Match endpoint — deterministic score from job ID hash
  if (endpoint.startsWith('/matches/')) {
    const url = new URL('http://localhost' + endpoint);
    const jobId = url.searchParams.get('job_id') || '';
    // Simple hash of jobId → score 45-98
    let hash = 0;
    for (let i = 0; i < jobId.length; i++) {
      hash = ((hash << 5) - hash) + jobId.charCodeAt(i);
      hash |= 0;
    }
    const score = 45 + (Math.abs(hash) % 54);
    return { match_percentage: score };
  }

  // Applications
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
      apps.push({ job_id: jobId, applied_at: new Date().toISOString(), status: 'applied' });
      localStorage.setItem('smarthire_applications', JSON.stringify(apps));
    }
    return { success: true };
  }

  // AI Analysis
  if (endpoint === '/ai/analyze') {
    return {
      match_score: 87,
      strengths: [
        "Strong experience with React and TypeScript ecosystem",
        "6 years of proven full-stack development experience",
        "Experience with cloud infrastructure (AWS, Docker, Kubernetes)",
        "Background from a top-tier engineering institution"
      ],
      missing_skills: [
        "Next.js (specific version mentioned in job)",
        "Zustand state management",
        "CSS-in-JS libraries like styled-components"
      ],
      improvement_suggestions: [
        "Highlight quantified impact metrics (e.g., 'improved load time by 40%')",
        "Add links to GitHub projects demonstrating Next.js expertise",
        "Include any open-source contributions or technical blog posts"
      ],
      ats_keywords: ["React", "TypeScript", "Frontend", "Scalable", "Architecture", "Mentorship"],
      interview_questions: {
        technical: [
          "Explain how you would optimize a React app rendering 1000+ list items",
          "Describe your approach to state management in a large-scale application",
          "How do you handle error boundaries and fallback UIs?"
        ],
        hr: [
          "Tell us about a time you mentored a junior developer",
          "How do you prioritize tasks when multiple deadlines overlap?",
          "Why are you looking to leave your current role?"
        ],
        scenario: [
          "A critical production bug is reported. Walk us through your debugging process",
          "The design team wants a feature that hurts performance. How do you handle it?"
        ]
      }
    };
  }

  // AI Recommendations
  if (endpoint === '/ai/recommendations') {
    return {
      why_matches: "Your 6 years of full-stack experience, strong React/TypeScript skills, and cloud infrastructure knowledge align well with this role. Your background building microservices at scale is particularly relevant. The main gap is specific Next.js and Zustand experience, but your foundational skills suggest a quick ramp-up.",
      skills_to_improve: ["Next.js App Router", "Zustand", "CSS-in-JS"]
    };
  }

  // AI Cover Letter
  if (endpoint === '/ai/cover-letter') {
    return {
      cover_letter: `Dear Hiring Manager,

I am writing to express my strong interest in the Senior Frontend Engineer position at TechCorp. With 6 years of experience building scalable web applications and a deep expertise in the React ecosystem, I am confident in my ability to contribute meaningfully to your team.

At my current role, I have led the architecture of microservices serving over 10 million users, optimizing performance and mentoring junior developers along the way. My technical toolkit includes React, TypeScript, Node.js, Python, PostgreSQL, AWS, Docker, and Kubernetes — all of which position me well to tackle the challenges described in this role.

I am particularly drawn to TechCorp's commitment to building products that serve millions at scale. I am eager to bring my experience in frontend architecture, performance optimization, and team leadership to your organization.

Thank you for considering my application. I would welcome the opportunity to discuss how my background aligns with your team's goals.

Sincerely,
Demo User`,
      email_template: `Subject: Application for Senior Frontend Engineer Position

Hi Hiring Team at TechCorp,

I hope this email finds you well. My name is Demo User, and I am a Senior Software Engineer with 6 years of experience specializing in React, TypeScript, and cloud-native architectures.

I recently came across the Senior Frontend Engineer opening at TechCorp and was immediately excited by the opportunity to work on products serving millions of users. My experience building microservices at scale and leading frontend architecture decisions aligns closely with the requirements outlined in the job description.

Key highlights of my background:
• Built and maintained microservices serving 10M+ users
• Deep expertise in React, TypeScript, Node.js, and Python
• Strong experience with AWS, Docker, Kubernetes, and CI/CD pipelines
• Proven track record mentoring junior developers and leading technical initiatives

I would love the opportunity to discuss how I can contribute to TechCorp's continued growth. Please let me know if you would be open to a brief conversation.

Best regards,
Demo User
demo@smarthire.ai`
    };
  }

  // Auto apply
  if (endpoint === '/auto-apply/auto-apply') {
    return {
      status: 'success',
      message: 'Application materials generated successfully',
      cover_letter: 'Generated cover letter content...',
      recruiter_email: 'Generated recruiter email...'
    };
  }

  // Default fallback
  console.warn('Mock API: unhandled endpoint', endpoint);
  return {};
};

export const login = async (username, password) => {
  const data = await apiClient('/auth/login', {
    method: 'POST',
    body: { username, password }
  });
  if (data.access_token) {
    localStorage.setItem('smarthire_token', data.access_token);
  }
  return data;
};

export const signup = async (username, email, password) => {
  const data = await apiClient('/auth/signup', {
    method: 'POST',
    body: { username, email, password }
  });
  if (data.access_token) {
    localStorage.setItem('smarthire_token', data.access_token);
  }
  return data;
};

export const me = async () => {
  return apiClient('/auth/me');
};

export const logout = () => {
  localStorage.removeItem('smarthire_token');
  localStorage.removeItem('smarthire_resume');
  localStorage.removeItem('smarthire_applications');
};

export const autoApply = async (applyUrl, resumeText, jobDescription, userData = {}) => {
  return apiClient('/auto-apply/auto-apply', {
    method: 'POST',
    body: {
      apply_url: applyUrl,
      resume_text: resumeText,
      job_description: jobDescription,
      ...userData
    }
  });
};

