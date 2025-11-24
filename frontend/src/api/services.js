/**
 * API service layer for backend communication
 */
import api from './axios';

// Authentication
export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
};

// Packages
export const packageService = {
  getAll: async (params = {}) => {
    const response = await api.get('/packages/', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/packages/${id}`);
    return response.data;
  },
  create: async (packageData) => {
    const response = await api.post('/packages/', packageData);
    return response.data;
  },
  update: async (id, packageData) => {
    const response = await api.put(`/packages/${id}`, packageData);
    return response.data;
  },
  delete: async (id) => {
    await api.delete(`/packages/${id}`);
  },
};

// Add-ons
export const addonService = {
  getAll: async (params = {}) => {
    const response = await api.get('/addons/', { params });
    return response.data;
  },
  create: async (addonData) => {
    const response = await api.post('/addons/', addonData);
    return response.data;
  },
  update: async (id, addonData) => {
    const response = await api.put(`/addons/${id}`, addonData);
    return response.data;
  },
  delete: async (id) => {
    await api.delete(`/addons/${id}`);
  },
};

// Bookings
export const bookingService = {
  create: async (bookingData) => {
    const response = await api.post('/bookings/', bookingData);
    return response.data;
  },
  getUserBookings: async (userId) => {
    const response = await api.get(`/bookings/user/${userId}`);
    return response.data;
  },
  getAll: async (params = {}) => {
    const response = await api.get('/bookings/', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },
  updateStatus: async (id, updateData) => {
    const response = await api.put(`/bookings/${id}/status`, updateData);
    return response.data;
  },
};

// Delivery
export const deliveryService = {
  create: async (deliveryData) => {
    const response = await api.post('/delivery/', deliveryData);
    return response.data;
  },
  getByBooking: async (bookingId) => {
    const response = await api.get(`/delivery/${bookingId}`);
    return response.data;
  },
  update: async (bookingId, deliveryData) => {
    const response = await api.put(`/delivery/${bookingId}`, deliveryData);
    return response.data;
  },
};
