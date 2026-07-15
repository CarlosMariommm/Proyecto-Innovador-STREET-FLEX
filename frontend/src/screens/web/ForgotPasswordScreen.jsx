import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await api.post('/clients/forgot-password', { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al solicitar la recuperación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] text-[var(--primary-color)] p-4">
      <div className="w-full max-w-md p-8 border border-[var(--border-color)]">
        <h2 className="text-2xl font-light mb-6 uppercase tracking-widest text-center">Recuperar Contraseña</h2>
        
        {message && <div className="mb-4 p-3 bg-green-900/20 text-green-500 border border-green-900/50">{message}</div>}
        {error && <div className="mb-4 p-3 bg-red-900/20 text-red-500 border border-red-900/50">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-light uppercase tracking-wider">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 bg-transparent border border-[var(--border-color)] focus:outline-none focus:border-[var(--primary-color)] transition-colors"
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 p-3 bg-[var(--primary-color)] text-[var(--bg-color)] uppercase tracking-widest font-bold hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Enviar enlace'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm font-light text-[var(--accent-color)]">
          <Link to="/login" className="hover:text-[var(--primary-color)] transition-colors underline underline-offset-4">Volver al inicio de sesión</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;
