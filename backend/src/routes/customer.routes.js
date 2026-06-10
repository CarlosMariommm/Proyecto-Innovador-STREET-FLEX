import express from 'express';
import customerController from '../controllers/customer.controller.js';
import { protect, admin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/')
    .get(protect, admin, customerController.getAll)
    .post(protect, admin, customerController.create);

router.route('/:id')
    .get(protect, admin, customerController.getById)
    .put(protect, admin, customerController.update)
    .delete(protect, admin, customerController.delete);

export default router;
