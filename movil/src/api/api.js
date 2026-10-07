/*
 * ============================================================
 * CLIENTE HTTP — api.js
 * ============================================================
 * Usa `fetch`, la funcion nativa de JavaScript (React Native la trae de
 * fabrica, no hace falta axios). Es el unico lugar de la app que arma
 * peticiones HTTP.
 *
 * ── La direccion del backend ──
 *
 * 1. APK / produccion: se toma de EXPO_PUBLIC_API_URL, que Expo incrusta al
 *    construir la app (ver movil/.env.example y la seccion "Generar el APK" del
 *    README). Ejemplo: https://streetflex-api.onrender.com/api
 *
 * 2. Desarrollo, sin esa variable: "localhost" dentro del emulador de Android
 *    NO es la computadora, es el propio telefono virtual, asi que el emulador
 *    llega a la PC por la direccion especial 10.0.2.2. En un telefono fisico
 *    por WiFi hay que poner la IP de la PC en HOST_MANUAL.
 * ============================================================
 */

import { Platform } from 'react-native';

/*
 * Para probar en un telefono fisico contra el backend local: escriba aqui la
 * IP de su computadora. Ejemplo: 'http://192.168.1.23:4000/api'
 */
const HOST_MANUAL = null;

const DEFAULT_HOST = Platform.select({
  android: 'http://10.0.2.2:4000/api', // el emulador ve la PC en esta direccion
  ios: 'http://localhost:4000/api',
  default: 'http://localhost:4000/api',
});

const FROM_ENV = process.env.EXPO_PUBLIC_API_URL;

export const API_URL = (FROM_ENV || HOST_MANUAL || DEFAULT_HOST).replace(/\/+$/, '');

// Un servidor gratuito (Render) se duerme y la primera peticion tarda hasta un
// minuto en despertarlo; sin tope, la pantalla se quedaria cargando para siempre.
const TIMEOUT_MS = 60000;

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
  409: 'Esa accion ya no es posible',
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

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(body && !isFormData ? { 'Content-Type': 'application/json' } : {}),
        ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {}),
        ...headers,
      },
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    throw new ApiError(
      error?.name === 'AbortError'
        ? 'El servidor tardo demasiado en responder. Intente de nuevo en un momento.'
        : `No se pudo conectar con el servidor (${API_URL}). Revise su conexion a internet.`,
      0
    );
  } finally {
    clearTimeout(timer);
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

// "Despierta" un servidor gratuito dormido mientras se ve la pantalla de
// carga, para que la primera pantalla real ya lo encuentre listo. Si falla no
// pasa nada: cada pantalla maneja sus propios errores.
export const wakeUpServer = () => {
  fetch(`${API_URL}/health`).catch(() => {});
};

export default request;
