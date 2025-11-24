import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ownerToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Booking APIs
export const getAvailableDates = (month, year) => 
  api.get(`/bookings/available-dates?month=${month}&year=${year}`);

export const createBooking = (bookingData) => 
  api.post('/bookings', bookingData);

export const getAllBookings = () => 
  api.get('/bookings');

export const getBookingById = (id) => 
  api.get(`/bookings/${id}`);

export const updateBooking = (id, updates) => 
  api.patch(`/bookings/${id}`, updates);

export const deleteBooking = (id) => 
  api.delete(`/bookings/${id}`);

export const toggleBlockDate = (date, reason) => 
  api.post('/bookings/block-date', { date, reason });

// Auth APIs
export const sendOTP = (phone) => 
  api.post('/auth/send-otp', { phone });

export const verifyOTP = (phone, otp) => 
  api.post('/auth/verify-otp', { phone, otp });

export default api;