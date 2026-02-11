import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

// Add interceptor to include token in headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  loginWithGoogle: () => {
    window.location.href = `${api.defaults.baseURL}/auth/google`;
  },
  logout: () => {
    localStorage.removeItem('token');
    return api.get('/auth/logout');
  },
  getCurrentUser: () => api.get('/auth/me'),
};

export default api;
