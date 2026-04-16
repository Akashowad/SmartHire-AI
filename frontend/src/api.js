export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const apiClient = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
};
