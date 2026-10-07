import jwt from 'jsonwebtoken';
import { getJwtSecret } from './jwtSecret.js';

const generateToken = (res, adminId) => {
  const token = jwt.sign({ id: adminId }, getJwtSecret(), {
    expiresIn: '30d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Usa secure SOLO en prod real
    sameSite: 'lax', // Permite testing local y móvil
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
  });

  // Se retorna el token ademas de setear la cookie: la app movil no puede
  // depender de la cookie httpOnly (fetch en React Native no la administra
  // sola), asi que lo manda en el body y lo guarda como Bearer token.
  return token;
};

export default generateToken;
