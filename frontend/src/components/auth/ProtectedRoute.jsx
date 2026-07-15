import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  const location = useLocation();

  if (loading) {
    return <div className="h-screen w-full flex justify-center items-center bg-black text-white">Cargando...</div>;
  }

  // Verifica si hay un usuario logueado. 
  // Opcionalmente, podrías restringir a role === 'client' si quieres estrictez.
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
