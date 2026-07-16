import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import adminRoutes from './src/routes/adminRoutes.js';
import employeeRoutes from './src/routes/employeeRoutes.js';
import clientRoutes from './src/routes/clientRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import categoryRoutes from './src/routes/categoryRoutes.js';
import supplierRoutes from './src/routes/supplierRoutes.js';
import eventRoutes from './src/routes/eventRoutes.js';
import inventoryRoutes from './src/routes/inventoryRoutes.js';
import shoppingCarRoutes from './src/routes/shoppingCarRoutes.js';
import saleRoutes from './src/routes/saleRoutes.js';
import aiTryOnRoutes from './src/routes/aiTryOnRoutes.js';
import moduleRoutes from './src/routes/moduleRoutes.js';
import bannerRoutes from './src/routes/bannerRoutes.js';

dotenv.config();
const app = express();

app.use(cors({
    origin: (origin, callback) => {
        const allowed = [
            process.env.FRONTEND_URL,
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:5175',
        ].filter(Boolean);
        if (!origin || allowed.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Rutas
app.use('/api/admins', adminRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/inventories', inventoryRoutes);
app.use('/api/shopping-cars', shoppingCarRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/ai-try-ons', aiTryOnRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/banners', bannerRoutes);

export default app;
