// API utility for making authenticated requests
const API_BASE = '/api';

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// Save token to localStorage
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Remove token from localStorage
export const removeToken = () => {
  localStorage.removeItem('token');
};

// Get user from localStorage
export const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Save user to localStorage
export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Remove user from localStorage
export const removeUser = () => {
  localStorage.removeItem('user');
};

// Make authenticated API request
export const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(text || `Request failed with status ${response.status}`);
    }

    if (!response.ok) {
      throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check if the backend is running.');
    }
    // Re-throw with a more user-friendly message if it's not already an Error
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(error.message || 'An unexpected error occurred');
  }
};

// Auth API calls
export const authAPI = {
  register: async (email, password) => {
    return apiRequest('/users/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  login: async (email, password) => {
    const data = await apiRequest('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.token) {
      setToken(data.token);
      setUser({ email: data.email });
    }
    
    return data;
  },
};

