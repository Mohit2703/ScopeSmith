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

  const login = async (username, password) => {
    try {
      const data = await api.post('/auth/login/', { username, password });
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        await checkUser();
        router.push('/dashboard');
        return { success: true };
      }
    } catch (error) {
      return { success: false, error: error.detail || 'Login failed' };
    }
  };

  const signup = async (username, email, password) => {
    try {
      const data = await api.post('/auth/signup/', { username, email, password });
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        await checkUser();
        router.push('/dashboard');
        return { success: true };
      }
    } catch (error) {
      return { success: false, error: error.detail || 'Signup failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);