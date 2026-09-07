/*
 * ============================================================
 * AUTH CONTEXT — sesion del cliente
 * ============================================================
 * La sesion se guarda con expo-secure-store (Keychain/KeyStore), no en
 * memoria: sin esto, cerrar la app obligaria a iniciar sesion cada vez.
 *
 * `loading` existe porque leer del almacen es asincrono: en el primer render
 * todavia no se sabe si hay sesion guardada. Sin ese estado, SplashScreen no
 * tendria como esperar antes de decidir si manda a Login o a las Tabs.
 */

import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { readItem, saveItem, removeItem, storageKey } from '../utils/storage';
import { setAuthToken } from '../api/api';

export const AuthContext = createContext(null);

const SESSION_KEY = storageKey('streetflex', 'session');

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      const raw = await readItem(SESSION_KEY);
      if (!alive) return;

      try {
        const data = JSON.parse(raw || 'null');
        if (data?.token) {
          setToken(data.token);
          setUser(data.user || null);
          setAuthToken(data.token);
        }
      } catch {
        /* Guardado ilegible: se entra sin sesion. */
      }

      setLoading(false);
    })();

    return () => {
      alive = false;
    };
  }, []);

  const login = useCallback((newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    setAuthToken(newToken);
    saveItem(SESSION_KEY, JSON.stringify({ token: newToken, user: userData }));
  }, []);

  // Corrige datos del usuario ya logueado sin pedirle que vuelva a entrar —
  // por ejemplo, favorites despues de marcar/desmarcar un corazon. Sin esto,
  // `user.favorites` se quedaba con la foto del momento del login, y una
  // pantalla que lo mirara despues (el propio detalle del producto al volver
  // a abrirlo) mostraba el corazon como si nunca se hubiera guardado.
  const updateUser = useCallback(
    (patch) => {
      setUser((prev) => {
        const next = { ...prev, ...patch };
        saveItem(SESSION_KEY, JSON.stringify({ token, user: next }));
        return next;
      });
    },
    [token]
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
    removeItem(SESSION_KEY);
  }, []);

  const value = useMemo(
    () => ({ user, token, login, logout, updateUser, isAuthenticated: !!token, loading }),
    [user, token, login, logout, updateUser, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
