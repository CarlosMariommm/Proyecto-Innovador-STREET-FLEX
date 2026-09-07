/*
 * ============================================================
 * CLIENTE HTTP — api.js
 * ============================================================
 * Usa `fetch` (React Native lo trae de fabrica, no hace falta axios).
 *
 * ── La direccion del backend ──
 *
 * "localhost" dentro del emulador de Android NO es la computadora, es el
 * propio telefono virtual: el backend en localhost:4000 queda invisible ahi.
 * El emulador llega a la maquina por la direccion especial 10.0.2.2, que es
 * la que se usa por defecto. En un telefono fisico por WiFi no sirve ninguna
 * de las dos: hay que poner la IP de la computadora en la red (la que Expo
 * muestra al arrancar, tipo 192.168.1.23) en HOST_MANUAL.
 * ============================================================
 */

import { Platform } from 'react-native';

/*
 * Para probar en un telefono fisico: escriba aqui la IP de su computadora.
 * Ejemplo: const HOST_MANUAL = 'http://192.168.1.23:4000/api';
 */
const HOST_MANUAL = null;

const DEFAULT_HOST = Platform.select({
  android: 'http://10.0.2.2:4000/api', // el emulador ve la PC en esta direccion
  ios: 'http://localhost:4000/api',
  default: 'http://localhost:4000/api',
});

export const API_URL = HOST_MANUAL || DEFAULT_HOST;

/*
 * El token de sesion vigente, para mandarlo por Authorization en cada
 * peticion. No hay cookies como en el navegador -fetch en React Native no
 * las administra solo-, asi que este es su reemplazo: AuthContext llama a
 * setAuthToken() cada vez que la sesion cambia (al restaurarla del
 * almacen, al entrar, al salir), y de ahi lo toma request() sin que cada
 * pantalla tenga que pasarlo a mano.
 */
let currentToken = null;

export const setAuthToken = (token) => {
  currentToken = token;
};

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    // El resto del body de error (ej. { needsVerification: true }), para
    // cuando una pantalla necesita algo mas que el mensaje.
    this.data = data;
  }
}

const FALLBACK_BY_STATUS = {
  400: 'Revise los datos e intente de nuevo',
  401: 'El correo o la contrasena son incorrectos',
  403: 'No tiene permiso para hacer esto',
  404: 'No encontramos lo que buscaba',
  500: 'Error interno del servidor',
};

/*
 * Una peticion al backend. Devuelve el JSON ya parseado, o lanza un ApiError
 * con el mensaje del servidor.
 */
export const request = async (path, { method = 'GET', body, headers } = {}) => {
  let response;

  // Un FormData (imagen) va tal cual: ni se convierte a JSON ni se le pone
  // Content-Type a mano, porque fetch necesita agregar el boundary solo.
  const isFormData = body instanceof FormData;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body && !isFormData ? { 'Content-Type': 'application/json' } : {}),
        ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {}),
        ...headers,
      },
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      `No se pudo conectar con el servidor (${API_URL}). Revise que el backend este encendido.`,
      0
    );
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = data?.message || FALLBACK_BY_STATUS[response.status] || 'Ocurrio un error inesperado';
    throw new ApiError(message, response.status, data);
  }

  return data;
};

export default request;
