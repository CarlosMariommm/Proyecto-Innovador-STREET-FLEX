import jwt from 'jsonwebtoken';

const generateToken = (res, adminId) => {
  const secret = process.env.JWT_SECRET || 'streetflex_super_secret_key_123';
  
  const token = jwt.sign({ id: adminId }, secret, {
    expiresIn: '30d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Usa secure SOLO en prod real
    sameSite: 'lax', // Permite testing local y móvil
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
  });
};

export default generateToken;
