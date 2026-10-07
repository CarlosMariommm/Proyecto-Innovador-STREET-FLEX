/*
 * Sesion y cuenta del cliente. Son los mismos endpoints que usa la web
 * (backendST/src/routes/clientRoutes.js); login, registro y verificacion
 * devuelven el `token` que la app guarda como sesion (ver AuthContext).
 */

import { request } from './api';

export const loginClient = ({ email, password }) =>
  request('/clients/login', { method: 'POST', body: { email, password } });

export const registerClient = ({ username, email, password, full_name, phone_number, age }) =>
  request('/clients', {
    method: 'POST',
    body: { username, email, password, full_name, phone_number, age: Number(age) },
  });

export const fetchClientProfile = () => request('/clients/profile');

// Edicion del perfil por el propio cliente. Devuelve el cliente ya actualizado.
export const updateClientProfile = ({ full_name, username, phone_number, age }) =>
  request('/clients/profile', {
    method: 'PUT',
    body: { full_name, username, phone_number, age: Number(age) },
  });

// Verificacion por codigo de 6 digitos. Deja la cuenta activa y devuelve
// token + datos del cliente, igual que login.
export const verifyRegistrationCode = ({ email, code }) =>
  request('/clients/verify-code', { method: 'POST', body: { email, code } });

export const resendVerificationCode = (email) =>
  request('/clients/resend-code', { method: 'POST', body: { email } });

// Recuperacion de contrasena: se pide el codigo al correo y luego se cambia la
// contrasena con ese codigo.
export const requestPasswordReset = (email) =>
  request('/clients/forgot-password', { method: 'POST', body: { email } });

export const resetPasswordWithCode = ({ email, code, password }) =>
  request('/clients/reset-password-code', { method: 'POST', body: { email, code, password } });
