import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';

const ResetPasswordScreen = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Las contraseñas no coinciden');
    }
    
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await api.post(`/clients/reset-password/${token}`, { password });
      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al restablecer contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] text-[var(--primary-color)] p-4">
      <div className="w-full max-w-md p-8 border border-[var(--border-color)]">
        <h2 className="text-2xl font-light mb-6 uppercase tracking-widest text-center">Nueva Contraseña</h2>
        
        {message && <div className="mb-4 p-3 bg-green-900/20 text-green-500 border border-green-900/50">{message}</div>}
        {error && <div className="mb-4 p-3 bg-red-900/20 text-red-500 border border-red-900/50">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-light uppercase tracking-wider">Nueva Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 bg-transparent border border-[var(--border-color)] focus:outline-none focus:border-[var(--primary-color)] transition-colors"
              required
              minLength="6"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-light uppercase tracking-wider">Confirmar Contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="p-3 bg-transparent border border-[var(--border-color)] focus:outline-none focus:border-[var(--primary-color)] transition-colors"
              required
              minLength="6"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 p-3 bg-[var(--primary-color)] text-[var(--bg-color)] uppercase tracking-widest font-bold hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordScreen;
