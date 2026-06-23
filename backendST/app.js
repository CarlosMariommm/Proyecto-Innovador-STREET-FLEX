import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import adminRoutes from './src/routes/adminRoutes.js';
import employeeRoutes from './src/routes/employeeRoutes.js';
import clientRoutes from './src/routes/clientRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import supplierRoutes from './src/routes/supplierRoutes.js';
import eventRoutes from './src/routes/eventRoutes.js';
import inventoryRoutes from './src/routes/inventoryRoutes.js';
import shoppingCarRoutes from './src/routes/shoppingCarRoutes.js';
import saleRoutes from './src/routes/saleRoutes.js';
import aiTryOnRoutes from './src/routes/aiTryOnRoutes.js';
import dns from 'node:dns'; // o const dns = require('node:dns'); si usas CommonJS
dns.setDefaultResultOrder('ipv4first');

dotenv.config();
const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Rutas
app.use('/api/admins', adminRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/inventories', inventoryRoutes);
app.use('/api/shopping-cars', shoppingCarRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/ai-try-ons', aiTryOnRoutes);

export default app;
