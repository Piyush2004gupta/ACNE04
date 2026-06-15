/**
 * API utility for communicating with the Flask backend.
 * Uses Axios for HTTP requests with proper error handling.
 */

import axios from 'axios';

// Base API URL — supports Vite environment variables in production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create Axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 second timeout for model inference
  headers: {
    'Accept': 'application/json',
  },
});

// Add a request interceptor to attach the JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Send an image to the backend for acne severity analysis.
 * 
 * @param {File} imageFile - The image file to analyze.
 * @returns {Promise<Object>} Analysis results including predicted_class, confidence, recommendation.
 */
export async function analyzeImage(imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await api.post('/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const data = response.data;

    // Handle low-confidence rejection (200 status but model can't classify)
    if (data.error_type === 'low_confidence') {
      const err = new Error(data.message);
      err.errorType = 'low_confidence';
      err.confidence = data.confidence;
      throw err;
    }

    return data;
  } catch (error) {
    // Re-throw typed errors (low_confidence) as-is
    if (error.errorType) {
      throw error;
    }

    if (error.response) {
      // Server responded with an error status (400, 500, etc.)
      const serverData = error.response.data;
      const err = new Error(serverData.message || 'Analysis failed. Please try again.');
      err.errorType = serverData.error_type || 'server_error';
      throw err;
    } else if (error.request) {
      // No response received
      throw new Error('Unable to connect to the server. Please ensure the backend is running.');
    } else {
      throw new Error('An unexpected error occurred.');
    }
  }
}

/**
 * Check the health status of the backend server.
 * 
 * @returns {Promise<Object>} Health status response.
 */
export async function checkHealth() {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('Backend server is not reachable.');
  }
}

// ──────────────────────────────────────────────
// Authentication APIs
// ──────────────────────────────────────────────

export async function login(email, password) {
  try {
    const response = await api.post('/api/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
}

export async function signup(userData) {
  try {
    const response = await api.post('/api/auth/signup', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Signup failed');
  }
}

export async function requestOtp(email) {
  try {
    const response = await api.post('/api/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to request OTP');
  }
}

export async function verifyOtp(email, otp) {
  try {
    const response = await api.post('/api/auth/verify-otp', { email, otp });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Invalid OTP');
  }
}

export async function resetPassword(email, otp, newPassword) {
  try {
    const response = await api.post('/api/auth/reset-password', { email, otp, newPassword });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to reset password');
  }
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

// ──────────────────────────────────────────────
// History APIs
// ──────────────────────────────────────────────

export async function getHistory() {
  try {
    const response = await api.get('/api/history/');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch history');
  }
}

export async function saveHistory(historyData) {
  try {
    const response = await api.post('/api/history/', historyData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to save history');
  }
}

export default api;
