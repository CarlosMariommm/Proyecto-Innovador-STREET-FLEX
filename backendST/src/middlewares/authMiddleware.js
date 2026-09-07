import jwt from 'jsonwebtoken';
import Admin from '../models/adminModel.js';
import Client from '../models/clientModel.js';

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
      const secret = process.env.JWT_SECRET || 'streetflex_super_secret_key_123';
      const decoded = jwt.verify(token, secret);
      req.admin = await Admin.findById(decoded.id).select('-password');
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
      const secret = process.env.JWT_SECRET || 'streetflex_super_secret_key_123';
      const decoded = jwt.verify(token, secret);
      req.client = await Client.findById(decoded.id).select('-password');
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
