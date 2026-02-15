import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Restaurant API functions
export const restaurantApi = {
  getAllRestaurants: async (params = {}) => {
    const response = await api.get('/restaurants', { params });
    return response.data;
  },

  getRestaurantById: async (id) => {
    const response = await api.get(`/restaurants/${id}`);
    return response.data;
  },

  // Get nearby restaurants with location
  getNearbyRestaurants: async (lat, lng, radius = 10) => {
    const response = await api.get('/restaurants', {
      params: { lat, lng, radius },
    });
    return response.data;
  },

  // Search restaurants
  searchRestaurants: async (search, lat, lng) => {
    const response = await api.get('/restaurants', {
      params: { search, lat, lng },
    });
    return response.data;
  },

  getSuggestions: async (q, mode) => {
    const response = await api.get('/restaurants/suggestions', {
      params: { q, mode },
    });
    return response.data;
  },
};

// Other API functions can be added here
export default api;
