import express from 'express';
import productController from '../controllers/product.controller.js';
import { protect, admin } from '../middlewares/auth.middleware.js';
import { upload } from '../utils/cloudinary.js';

const router = express.Router();

router.route('/')
    .get(productController.getAll)
    .post(protect, admin, upload.single('image'), productController.create);

router.route('/:id')
    .get(productController.getById)
    .put(protect, admin, upload.single('image'), productController.update)
    .delete(protect, admin, productController.delete);

export default router;
