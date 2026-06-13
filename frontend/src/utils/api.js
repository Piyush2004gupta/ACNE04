/**
 * API utility for communicating with the Flask backend.
 * Uses Axios for HTTP requests with proper error handling.
 */

import axios from 'axios';

// Base API URL — uses Vite proxy in development
const API_BASE_URL = 'http://localhost:5000';

// Create Axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 second timeout for model inference
  headers: {
    'Accept': 'application/json',
  },
});

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

export default api;
