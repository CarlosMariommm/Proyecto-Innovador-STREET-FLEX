import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';

const VerifyEmailScreen = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Verificando tu correo electrónico...');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await api.get(`/clients/verify/${token}`);
        setStatus('¡Tu correo ha sido verificado con éxito! Redirigiendo al login...');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        setStatus('El token es inválido o ha expirado. Por favor, intenta registrarte nuevamente o contacta a soporte.');
      }
    };
    verifyToken();
  }, [token, navigate]);

  return (
    <div className="h-screen w-full flex justify-center items-center bg-[var(--bg-color)] text-[var(--primary-color)]">
      <div className="text-center p-8 border border-[var(--border-color)]">
        <h2 className="text-2xl mb-4 uppercase tracking-widest font-light">Verificación</h2>
        <p>{status}</p>
      </div>
    </div>
  );
};

export default VerifyEmailScreen;
