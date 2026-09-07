/*
 * navigationRef — para navegar desde fuera de un componente de pantalla
 * (por ejemplo, TabMenu mandando a Login cuando se toca un apartado que pide
 * sesion sin tenerla).
 */

import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

// A que apartado volver despues de iniciar sesion (o null si a ninguno en
// particular). Lo escriben TabMenu y CartScreen antes de mandar a Login.
export const pendingDestination = { current: null };

// Pasa a true la primera vez que se resuelve el arranque (con o sin sesion
// restaurada). Antes de eso, un cambio de `isAuthenticated` es el propio
// arranque resolviendose, no un login interactivo — ver RootNavigator.
export const startupResolved = { current: false };

export const navigateTo = (name, params) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
};

export const goToTabs = (destination) => {
  if (!navigationRef.isReady()) return;

  if (destination === 'Cart') {
    navigationRef.reset({ index: 1, routes: [{ name: 'Tabs' }, { name: 'Cart' }] });
    return;
  }

  navigationRef.reset({
    index: 0,
    routes: [{ name: 'Tabs', state: destination ? { routes: [{ name: destination }] } : undefined }],
  });
};
