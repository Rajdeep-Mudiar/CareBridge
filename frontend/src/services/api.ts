import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

export const authService = {
  loginWithGoogle: () => {
    window.location.href = `${api.defaults.baseURL}/auth/google`;
  },
  logout: () => api.get('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

export default api;
