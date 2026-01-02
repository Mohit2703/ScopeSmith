'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '../lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkUser();
  }, []);

  const formatError = (error) => {
    if (error.data) {
      if (typeof error.data === 'string') return error.data;
      if (error.data.detail) return error.data.detail;
      if (error.data.message) return error.data.message;
      if (error.data.non_field_errors) return error.data.non_field_errors.join(', ');

      // DRF field errors
      const fields = Object.keys(error.data);
      if (fields.length > 0) {
        return fields.map(field => {
          const messages = Array.isArray(error.data[field]) ? error.data[field].join(', ') : error.data[field];
          // Capitalize field name and replace underscores with spaces
          const label = field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, ' ');
          return `${label}: ${messages}`;
        }).join(' | ');
      }
    }
    return error.message || 'Something went wrong';
  };

  const checkUser = async () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        // Assuming there is an endpoint to get current user details
        // If not, we might just trust the token exists for now, 
        // but the requirements mentioned /api/auth/me/
        const userData = await api.get('/auth/me/', {}, token);
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        localStorage.removeItem('auth_token');
        setUser(null);
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const data = await api.post('/auth/login/', { email, password });
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        await checkUser();
        router.push('/dashboard');
        return { success: true };
      }
    } catch (error) {
      return { success: false, error: formatError(error) };
    }
  };

  const signup = async (signupData) => {
    try {
      const data = await api.post('/auth/signup/', signupData);
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        await checkUser();
        router.push('/dashboard');
        return { success: true };
      }
    } catch (error) {
      return { success: false, error: formatError(error) };
    }
  };

  // Login with token directly (used after OTP verification)
  const loginWithToken = async (token, userData) => {
    localStorage.setItem('auth_token', token);
    setUser(userData);
    router.push('/dashboard');
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithToken, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);