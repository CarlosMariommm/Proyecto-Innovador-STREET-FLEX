// El secreto con el que se firman y verifican los JWT.
//
// Antes estaba escrito a mano como valor de respaldo en tres archivos. Con el
// repositorio publico eso es una puerta abierta: cualquiera que lo lea puede
// fabricar un token valido. Ahora
// sale de la variable de entorno JWT_SECRET (o JWT_secret_key, el nombre que ya
// traia el .env) y en produccion el servidor se niega a arrancar si falta.
//
// Se lee al momento de usarse y no al importar el archivo: dotenv todavia puede
// no haber cargado el .env cuando se evalua el modulo.

export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET || process.env.JWT_secret_key;

  if (secret) return secret;

  if (process.env.NODE_ENV === 'production') {
    throw new Error('Falta la variable de entorno JWT_SECRET: el servidor no puede firmar sesiones sin ella.');
  }

  // Solo para desarrollo local, nunca en produccion.
  return 'streetflex_secreto_solo_para_desarrollo_local';
};
