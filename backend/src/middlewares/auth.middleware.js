import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    try {
        let token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: 'No autorizado, no hay token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_secret_key);
        req.user = await User.findById(decoded.userId).select('-password');
        
        next();
    } catch (error) {
        console.log("error" + error);
        res.status(401).json({ message: 'No autorizado, token falló' });
    }
};

export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'No autorizado como administrador' });
    }
};
