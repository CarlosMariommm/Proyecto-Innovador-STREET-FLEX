import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import { useToast } from '../../hooks/useToast';
import './ClientAuthScreen.css';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/clients/forgot-password', { email });
      showToast(res.data.message, 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al solicitar la recuperación', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="client-auth-container">
      <div className="client-auth-left">
        <h1 className="client-auth-phrase">
          YOUR STYLE,<br/>YOUR RULES
        </h1>
      </div>
      
      <div className="client-auth-right">
        <div className="client-auth-form-container">
          <h2 className="client-auth-title">STREET FLEX</h2>
          
          <div className="client-auth-header">
            <h3>Recuperar Contraseña</h3>
            <p>Ingresa tu correo para recibir las instrucciones.</p>
          </div>
          
          <form className="client-auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email*</label>
              <input 
                type="email" 
                id="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar enlace'}
            </button>
          </form>

          <p className="toggle-mode" style={{ marginTop: '3rem' }}>
            ¿Recordaste tu contraseña?
            <Link to="/login">
              Volver a iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;
