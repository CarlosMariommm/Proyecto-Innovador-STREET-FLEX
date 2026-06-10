import express from 'express';
import categoryController from '../controllers/category.controller.js';
import { protect, admin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/')
    .get(categoryController.getAll)
    .post(protect, admin, categoryController.create);

router.route('/:id')
    .get(categoryController.getById)
    .put(protect, admin, categoryController.update)
    .delete(protect, admin, categoryController.delete);

export default router;
