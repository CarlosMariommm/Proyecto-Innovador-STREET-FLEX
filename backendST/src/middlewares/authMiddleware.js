import jwt from 'jsonwebtoken';
import Admin from '../models/adminModel.js';
import Client from '../models/clientModel.js';

const protect = async (req, res, next) => {
  let token = req.cookies.jwt;

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
  let token = req.cookies.jwt;

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
