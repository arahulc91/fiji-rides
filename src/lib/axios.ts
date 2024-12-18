import axios from 'axios';
import { BookingRequest, BookingResponse, PickupDropoffLocation, TransferAddon, TransferOption } from '../types';

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
    return Promise.reject(
      error instanceof Error ? error : new Error('Request configuration error')
    );
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors here
    if (error.response) {
      const errorMessage = (() => {
        switch (error.response.status) {
          case 401:
            return 'Invalid or expired token';
          case 403:
            return 'Forbidden access';
          case 404:
            return 'Resource not found';
          case 500:
            return 'Server error';
          default:
            return `HTTP Error ${error.response.status}`;
        }
      })();

      console.error(errorMessage);
      return Promise.reject(new Error(errorMessage));
    }

    // If error doesn't have a response, wrap it in an Error if it isn't already
    return Promise.reject(
      error instanceof Error 
        ? error 
        : new Error(error?.message || 'Network error')
    );
  }
);

// API endpoints
export const endpoints = {
  pickupLocations: '/pickup-locations',
  dropoffLocations: '/dropoff-locations',
  addons: '/addons',
  transferOptions: '/rates',
  bookings: '/bookings/',
  paymentStatus: '/update-payment-status/',
  checkPaymentStatus: '/check-payment-status/',
} as const;


// API functions
export const apiService = {
  getPickupLocations: async () => {
    const response = await api.get<PickupDropoffLocation[]>(endpoints.pickupLocations);
    return response.data; // Return the data directly since it's already in the correct format
  },
  getDropoffLocations: async (pickupLocationId: number) => {
    const response = await api.get<PickupDropoffLocation[]>(
      `${endpoints.dropoffLocations}/?pickup_location=${pickupLocationId}`
    );
    return response.data;
  },
  getTransferAddons: async () => {
    const response = await api.get<TransferAddon[]>(endpoints.addons, {
      
    });
    return response.data;
  },
  getTransferOptions: async (params: {
    pickup_location: number;
    dropoff_location: number;
    pax: number;
  }) => {
    const response = await api.get<TransferOption[]>(endpoints.transferOptions, {
      params
    });
    return response.data;
  },
  createBooking: async (bookingData: BookingRequest) => {
    const response = await api.post<BookingResponse>(endpoints.bookings, bookingData);
    return response.data;
  },
  updatePaymentStatus: async (data: {
    order_id: string;
    payment_status: 'approved' | 'declined';
  }) => {
    const response = await api.post(endpoints.paymentStatus, data);
    return response.data;
  },
  checkPaymentStatus: async (data: {
    order_id: string;
  }) => {
    const response = await api.get(endpoints.checkPaymentStatus, {
      params: data
    });
    return response.data;
  },
  // Add more API functions as needed
}; 