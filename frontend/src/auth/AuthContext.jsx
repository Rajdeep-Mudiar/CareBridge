import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    console.log('CareBridge: [checkAuth] Token in localStorage:', token ? 'Present (First 10 chars: ' + token.substring(0, 10) + '...)' : 'MISSING');
    
    console.log('CareBridge: [checkAuth] Initiating /api/auth/me request...');
    try {
      const response = await authService.getCurrentUser();
      console.log('CareBridge: [checkAuth] SUCCESS. User:', response.data.email);
      setUser(response.data);
    } catch (error) {
      console.error('CareBridge: [checkAuth] FAILED. Status:', error.response?.status);
      console.error('CareBridge: [checkAuth] Error Message:', error.response?.data?.message || error.message);
      if (error.response?.status === 401) {
        console.warn('CareBridge: [checkAuth] Server rejected token (Unauthorized). Clearing localStorage.');
        localStorage.removeItem('token');
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      console.log('CareBridge: Token found in URL, saving...');
      localStorage.setItem('token', token);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    checkAuth();
  }, []);

  const login = () => {
    authService.loginWithGoogle();
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
