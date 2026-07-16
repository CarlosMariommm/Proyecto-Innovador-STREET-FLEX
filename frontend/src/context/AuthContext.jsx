import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api';

export const AuthContext = createContext();

const STORAGE_KEY = 'streetflex_user';

export const AuthProvider = ({ children }) => {
  // Initialize user from localStorage for instant persistence
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verify session with backend on mount
    checkAuth();
  }, []);

  // Sync user state to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const checkAuth = async () => {
    setLoading(true);
    try {
      // 1. Intentar validar si es admin
      const adminRes = await api.get('/admins/profile');
      if (adminRes.data) {
        setUser({ ...adminRes.data, role: 'admin' });
        setLoading(false);
        return;
      }
    } catch (error) {
      // No es admin o no hay token válido para admin
    }

    try {
      // 2. Intentar validar si es cliente
      const clientRes = await api.get('/clients/profile');
      if (clientRes.data) {
        setUser({ ...clientRes.data, role: 'client' });
        setLoading(false);
        return;
      }
    } catch (error) {
      // No es cliente o no hay token válido
    }

    // If backend rejects both, clear local state too
    setUser(null);
    setLoading(false);
  };

  const loginAdmin = async (email, password) => {
    try {
      const res = await api.post('/admins/login', { email, password });
      setUser({ ...res.data, role: 'admin' });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error en el login' };
    }
  };

  const loginClient = async (email, password) => {
    try {
      const res = await api.post('/clients/login', { email, password });
      const clientData = { ...res.data, role: 'client' };
      setUser(clientData);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error en el login' };
    }
  };

  const logout = async () => {
    try {
      if (user?.role === 'admin') {
        await api.post('/admins/logout');
      } else {
        await api.post('/clients/logout');
      }
    } catch (error) {
      // Even if logout API fails, clear local state
      console.error('Logout API error:', error);
    }
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const toggleFavorite = async (productId) => {
    if (!user || user.role !== 'client') return false;
    const isFav = user.favorites?.includes(productId);
    try {
      if (isFav) {
        await api.delete(`/clients/favorites/${productId}`);
        setUser(prev => ({
          ...prev,
          favorites: prev.favorites.filter(id => id !== productId)
        }));
      } else {
        await api.post('/clients/favorites', { productId });
        setUser(prev => ({
          ...prev,
          favorites: [...(prev.favorites || []), productId]
        }));
      }
      return true;
    } catch (e) {
      console.error('Toggle fav error', e);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginAdmin, loginClient, logout, checkAuth, toggleFavorite }}>
      {children}
    </AuthContext.Provider>
  );
};
