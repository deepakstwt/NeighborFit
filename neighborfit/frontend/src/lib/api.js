import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Debug logging
console.log('🔧 API Configuration:', {
  API_URL,
  environment: process.env.NODE_ENV,
  timestamp: new Date().toISOString()
});

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Debug logging
  console.log('📡 Making API request:', {
    method: config.method?.toUpperCase(),
    url: config.url,
    baseURL: config.baseURL,
    fullURL: `${config.baseURL}${config.url}`,
    timestamp: new Date().toISOString()
  });
  
  return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response successful:', {
      status: response.status,
      url: response.config.url,
      dataLength: Array.isArray(response.data) ? response.data.length : 'N/A',
      timestamp: new Date().toISOString()
    });
    return response;
  },
  (error) => {
    console.error('❌ API Response error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      message: error.message,
      timestamp: new Date().toISOString()
    });
    return Promise.reject(error);
  }
);

// Neighborhood API
export const neighborhoodAPI = {
  // Get all neighborhoods with optional filters
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/neighborhoods${queryString ? `?${queryString}` : ''}`);
  },

  // Get neighborhood by ID
  getById: (id) => api.get(`/neighborhoods/${id}`),

  // Get neighborhoods by city
  getByCity: (city) => api.get(`/neighborhoods/city/${city}`),

  // Search neighborhoods
  search: (query) => api.get(`/neighborhoods/search/${query}`),

  // Get neighborhood statistics
  getStats: () => api.get('/neighborhoods/stats/overview'),

  // Get filtered neighborhoods
  getFiltered: (filters) => {
    const params = new URLSearchParams();
    
    if (filters.city) params.append('city', filters.city);
    if (filters.minRent) params.append('minRent', filters.minRent);
    if (filters.maxRent) params.append('maxRent', filters.maxRent);
    if (filters.minSafetyScore) params.append('minSafetyScore', filters.minSafetyScore);
    if (filters.search) params.append('search', filters.search);
    
    // Handle amenities array
    if (filters.amenities && filters.amenities.length > 0) {
      filters.amenities.forEach(amenity => {
        params.append('amenities', amenity);
      });
    }
    
    return api.get(`/neighborhoods?${params.toString()}`);
  },

  getNearby: (lat, lng, maxDistance) => 
    api.get(`/neighborhoods/nearby/${lat}/${lng}/${maxDistance}`),

  rate: (id, rating) => api.post(`/neighborhoods/${id}/rate`, { rating }),
};

// User API
export const userAPI = {
  register: (userData) => api.post('/users/register', userData),
  login: (credentials) => api.post('/users/login', credentials),
  updatePreferences: (preferences) => api.put('/users/preferences', { preferences }),
  addFavorite: (neighborhoodId) => api.post(`/users/favorites/${neighborhoodId}`),
  removeFavorite: (neighborhoodId) => api.delete(`/users/favorites/${neighborhoodId}`),
  checkEmail: async (email) => {
    return await api.get(`/users/check-email?email=${encodeURIComponent(email)}`);
  },
  changePassword: (passwordData) => api.post('/users/change-password', passwordData),
  exportData: () => api.get('/users/export'),
  deleteAccount: () => api.delete('/users/delete'),
  forgotPassword: (email) => api.post('/users/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/users/reset-password', { token, newPassword }),
  verifyEmail: (email, otp) => api.post('/users/verify-email', { email, otp }),
  resendOTP: (email) => api.post('/users/resend-otp', { email }),
};

// Recommendation API
export const recommendationAPI = {
  // Get personalized recommendations
  getPersonalized: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/recommendations/personalized${queryString ? `?${queryString}` : ''}`);
  },

  // Get recommendations by category
  getByCategory: (category, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/recommendations/category/${category}${queryString ? `?${queryString}` : ''}`);
  },

  // Track user interaction
  trackInteraction: (neighborhoodId, interactionType, metadata = {}) => {
    return api.post('/recommendations/interaction', {
      neighborhoodId,
      interactionType,
      metadata
    });
  },

  // Get recommendation explanation
  getExplanation: (neighborhoodId) => {
    return api.get(`/recommendations/explain/${neighborhoodId}`);
  },

  // Get recommendation insights
  getInsights: () => {
    return api.get('/recommendations/insights');
  }
};

// Auth helper functions
export const auth = {
  setToken: (token) => localStorage.setItem('token', token),
  getToken: () => localStorage.getItem('token'),
  removeToken: () => localStorage.removeItem('token'),
  isAuthenticated: () => !!localStorage.getItem('token'),
};

export default api; 