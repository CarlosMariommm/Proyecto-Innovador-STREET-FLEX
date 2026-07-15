import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id, name, email, role: 'admin' | 'client' }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Intentar verificar la sesión al cargar
    checkAuth();
  }, []);

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
      setUser({ ...res.data, role: 'client' });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error en el login' };
    }
  };

  const logout = async () => {
    if (user?.role === 'admin') {
      await api.post('/admins/logout');
    } else {
      await api.post('/clients/logout');
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginAdmin, loginClient, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
