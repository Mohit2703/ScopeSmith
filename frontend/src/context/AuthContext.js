'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import api from '@/app/lib/api';
import api from '@/lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      api.get('/auth/me/', {}, token)
        .then(setUser)
        .catch(() => {
          setUser(null);
          localStorage.removeItem('auth_token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const username = email.split('@')[0]; // Derive username from email
    const result = await api.post('/auth/login/', { username, password });
    localStorage.setItem('auth_token', result.token);
    setUser(result.user);
    return result;
  };

  const signup = async ({ name, email, password }) => {
    const result = await api.post('/auth/signup/', { name, email, password });
    localStorage.setItem('auth_token', result.token);
    setUser(result.user);
    return result;
  };

  const logout = async () => {
    const token = localStorage.getItem('auth_token');
    await api.post('/auth/logout/', {}, token);
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