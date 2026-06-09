import React from 'react';
import { useAuth } from '../components/Auth/AuthContext';
import { Link } from 'react-router-dom';
import Button from '../components/UI/Button';

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <nav className="p-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold text-gray-900">Antigravity</h1>
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm">Hola, {user.name}</span>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-blue-600 hover:underline">Ir al Panel</Link>
              )}
              <Button onClick={logout} variant="secondary">Cerrar Sesión</Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login"><Button variant="outline">Ingresar</Button></Link>
              <Link to="/register"><Button variant="primary">Registrarse</Button></Link>
            </div>
          )}
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-16 px-4 text-center">
        <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
          Bienvenido a Antigravity
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          La mejor tienda en línea. Regístrate para comenzar a comprar o ingresa como administrador para gestionar el sistema.
        </p>
      </main>
    </div>
  );
};

export default Home;
