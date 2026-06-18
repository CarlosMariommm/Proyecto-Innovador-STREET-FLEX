import express from 'express';
import productController from '../controllers/productController.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .post(upload.single('image'), productController.createProduct)
  .get(productController.getProducts);

router.route('/:id')
  .get(productController.getProductById);

export default router;
