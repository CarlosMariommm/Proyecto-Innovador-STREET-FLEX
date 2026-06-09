import React from 'react';
import { useAuth } from '../components/Auth/AuthContext';
import Button from '../components/UI/Button';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white p-6 rounded-xl shadow-md flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Panel Administrativo</h1>
        <div className="flex items-center gap-4">
          <span className="font-medium text-gray-700">Admin: {user?.name}</span>
          <Button onClick={handleLogout} variant="danger">Cerrar Sesión</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Categorías</h3>
          <p className="text-gray-500 mt-2">Gestión de categorías (Próximamente)</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Productos</h3>
          <p className="text-gray-500 mt-2">Gestión de productos (Próximamente)</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
