import express from 'express';
import dashboardController from '../controllers/dashboard.controller.js';
import { protect, admin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/')
    .get(protect, admin, dashboardController.getMetrics);

export default router;
