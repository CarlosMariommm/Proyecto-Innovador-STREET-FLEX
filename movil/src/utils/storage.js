/*
 * STORAGE — lo que sobrevive a cerrar la app.
 *
 * La web usa localStorage; en React Native no existe. Aca se usa
 * expo-secure-store (Keychain en iOS, KeyStore en Android). Con
 * `expo start --web` el modulo nativo no esta disponible, asi que se cae a un
 * Map en memoria: no sobrevive a un refresh, pero no rompe la pantalla.
 *
 * Las llaves de SecureStore solo aceptan alfanumericos, punto, guion y guion
 * bajo, por eso `storageKey` sanea cada pieza.
 */

import * as SecureStore from 'expo-secure-store';

const memoryFallback = new Map();

let secureStoreAvailable = null;

const hasSecureStore = async () => {
  if (secureStoreAvailable !== null) return secureStoreAvailable;
  try {
    secureStoreAvailable = await SecureStore.isAvailableAsync();
  } catch {
    secureStoreAvailable = false;
  }
  return secureStoreAvailable;
};

export const storageKey = (...parts) =>
  parts
    .filter((p) => p !== null && p !== undefined && p !== '')
    .map((p) => String(p).replace(/[^A-Za-z0-9._-]/g, '_'))
    .join('.');

export const readItem = async (key) => {
  if (!(await hasSecureStore())) return memoryFallback.get(key) ?? null;
  try {
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
};

export const saveItem = async (key, value) => {
  if (!(await hasSecureStore())) {
    memoryFallback.set(key, value);
    return true;
  }
  try {
    await SecureStore.setItemAsync(key, value);
    return true;
  } catch {
    return false;
  }
};

export const removeItem = async (key) => {
  if (!(await hasSecureStore())) {
    memoryFallback.delete(key);
    return;
  }
  try {
    await SecureStore.deleteItemAsync(key);
  } catch {
    /* Borrar lo que no existe ya es el resultado buscado. */
  }
};
