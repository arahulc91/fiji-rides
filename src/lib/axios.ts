import axios from 'axios';
import { PickupDropoffLocation } from '../types';

const API_TOKEN = '1fb28c670954dde94383814e211dc74568d6eddd';

// Create axios instance with default config
export const api = axios.create({
  baseURL: 'https://portal.fijirides.com/api/transfers/v1',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Token ${API_TOKEN}`
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Ensure token is always present
    if (!config.headers.Authorization) {
      config.headers.Authorization = `Token ${API_TOKEN}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors here
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error('Invalid or expired token');
          break;
        case 403:
          console.error('Forbidden access');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
      }
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  pickupLocations: '/pickup-locations',
  // Add more endpoints as needed
} as const;


// API functions
export const apiService = {
  getPickupLocations: async () => {
    const response = await api.get<PickupDropoffLocation[]>(endpoints.pickupLocations);
    return response.data; // Return the data directly since it's already in the correct format
  },
  // Add more API functions as needed
}; 