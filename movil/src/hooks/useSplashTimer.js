/*
 * useSplashTimer — cuanto se queda la pantalla de carga personalizada.
 *
 * El splash nativo (app.json) ya se fue en cuanto el JS arranco. Esta pantalla
 * es la que se ve MIENTRAS se revisa si hay sesion guardada, y se queda un
 * minimo de tiempo aunque esa revision sea instantanea, para que no parpadee
 * y desaparezca antes de poder leerse.
 */

import { useEffect, useState } from 'react';

const MIN_DURATION = 1200;

export const useSplashTimer = (loading) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (loading) return undefined;
    const id = setTimeout(() => setShow(false), MIN_DURATION);
    return () => clearTimeout(id);
  }, [loading]);

  return show || loading;
};

export default useSplashTimer;
