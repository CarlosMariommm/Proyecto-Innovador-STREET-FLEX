/*
 * Sesion de cliente. Mismos endpoints que usa frontend/src/screens/web/ClientAuthScreen.jsx
 * (backendST/src/routes/clientRoutes.js); el backend no se toco salvo para
 * agregar el `token` a la respuesta de login/registro (ver
 * backendST/src/controllers/clientController.js).
 */

import { request } from './api';

export const loginClient = ({ email, password }) =>
  request('/clients/login', { method: 'POST', body: { email, password } });

export const registerClient = ({ username, email, password, full_name, phone_number }) =>
  request('/clients', {
    method: 'POST',
    body: { username, email, password, full_name, phone_number },
  });

export const fetchClientProfile = () => request('/clients/profile');

// Verificacion por codigo de 6 digitos (ver backendST/src/controllers/clientController.js).
// Deja la cuenta activa y devuelve token + datos del cliente, igual que login.
export const verifyRegistrationCode = ({ email, code }) =>
  request('/clients/verify-code', { method: 'POST', body: { email, code } });

export const resendVerificationCode = (email) =>
  request('/clients/resend-code', { method: 'POST', body: { email } });
