import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { clientService } from '../../api/clientService';
import './ClientAuthScreen.css';

const ClientAuthScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/account';

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    phone_number: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const data = await clientService.login(formData.email, formData.password);
        localStorage.setItem('clientInfo', JSON.stringify(data));
        navigate(from, { replace: true });
      } else {
        const data = await clientService.createClient({
          ...formData,
          active: true,
          verified: false
        });
        localStorage.setItem('clientInfo', JSON.stringify(data));
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error("Auth error:", err);
      if (!err.response) {
        setError('Error de conexión. Verifica que el servidor (backend) esté encendido.');
      } else {
        setError(err.response?.data?.message || 'Error en la autenticación');
      }
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
            <h3>{isLogin ? 'Sign In' : 'Create Account'}</h3>
            <p>{isLogin ? 'Welcome back to your account.' : 'Join the Street Flex community.'}</p>
          </div>
          
          {error && <div style={{ color: '#ff4444', marginBottom: '15px' }}>{error}</div>}
          
          <form className="client-auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="form-group">
                  <label htmlFor="full_name">Full Name*</label>
                  <input type="text" id="full_name" required value={formData.full_name} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="username">Username*</label>
                  <input type="text" id="username" required value={formData.username} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="phone_number">Phone Number</label>
                  <input type="text" id="phone_number" value={formData.phone_number} onChange={handleChange} />
                </div>
              </>
            )}
            
            <div className="form-group">
              <label htmlFor="email">Email*</label>
              <input type="email" id="email" required value={formData.email} onChange={handleChange} />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password*</label>
              <input type="password" id="password" required value={formData.password} onChange={handleChange} />
              {!isLogin && <span className="password-hint">Must be at least 8 characters.</span>}
            </div>
            
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>
          
          <p className="toggle-mode">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <a onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Register now' : 'Log in'}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientAuthScreen;
