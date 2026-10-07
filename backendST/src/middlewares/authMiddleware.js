import jwt from 'jsonwebtoken';
import Admin from '../models/adminModel.js';
import Client from '../models/clientModel.js';
import { getJwtSecret } from '../utils/jwtSecret.js';

// La app movil no tiene cookies httpOnly (fetch en React Native no las
// administra), asi que manda el token por header Authorization: Bearer.
// La cookie sigue siendo la via principal para el frontend web.
const bearerToken = (req) => {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    return header.slice(7);
  }
  return null;
};

const protect = async (req, res, next) => {
  let token = req.cookies.jwt || bearerToken(req);

  if (token) {
    try {
      const decoded = jwt.verify(token, getJwtSecret());
      req.admin = await Admin.findById(decoded.id).select('-password');
      // Un token valido de un cliente no es un administrador: sin este chequeo
      // pasaba igual con req.admin = null.
      if (!req.admin) return res.status(401).json({ message: 'Not authorized' });
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const protectClient = async (req, res, next) => {
  let token = req.cookies.jwt || bearerToken(req);

  if (token) {
    try {
      const decoded = jwt.verify(token, getJwtSecret());
      req.client = await Client.findById(decoded.id).select('-password');
      // Cuenta borrada despues de emitir el token: antes seguia pasando con
      // req.client = null y los controladores reventaban al leer req.client._id.
      if (!req.client) return res.status(401).json({ message: 'Not authorized' });
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export { protect, protectClient };
