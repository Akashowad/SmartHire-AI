const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

function getToken() {
  return localStorage.getItem('smarthire_token');
}

export const apiClient = async (endpoint, options = {}) => {
  const { method = 'GET', body, headers = {}, ...customConfig } = options;

  const token = getToken();

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...headers,
    },
    ...customConfig,
  };

  if (body) {
    config.body = body instanceof FormData ? body : JSON.stringify(body);
    // Let the browser set the boundary for FormData
    if (body instanceof FormData) {
      delete config.headers['Content-Type'];
    }
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (response.ok) {
      return data;
    }

    // Handle specific error codes or generic messages
    const errorMsg = data?.detail || 'Something went wrong';
    throw new Error(errorMsg);
  } catch (err) {
    console.error(`API Error [${endpoint}]:`, err.message);
    throw err;
  }
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
