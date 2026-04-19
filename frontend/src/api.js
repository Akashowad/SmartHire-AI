const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const apiClient = async (endpoint, options = {}) => {
  const { method = 'GET', body, headers = {}, ...customConfig } = options;

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
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
