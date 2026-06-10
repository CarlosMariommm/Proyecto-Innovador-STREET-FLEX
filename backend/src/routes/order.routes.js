import express from 'express';
import orderController from '../controllers/order.controller.js';
import { protect, admin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/')
    .get(protect, admin, orderController.getAll)
    .post(protect, orderController.create);

router.route('/:id')
    .get(protect, orderController.getById)
    .put(protect, admin, orderController.updateStatus)
    .delete(protect, admin, orderController.delete);

export default router;
