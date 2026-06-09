import React from 'react';
import { useAuth } from '../components/Auth/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Bienvenido, {user?.name}</h3>
        <p className="text-gray-500">Selecciona un módulo en el menú lateral para comenzar a administrar la tienda Antigravity.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
