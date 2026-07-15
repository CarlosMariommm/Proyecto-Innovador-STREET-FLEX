import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="h-screen w-full flex justify-center items-center bg-black text-white">Cargando...</div>;
  }

  // Verifica si el usuario logueado es admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
