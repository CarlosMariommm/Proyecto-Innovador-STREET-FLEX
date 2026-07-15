import express from 'express';
import productController from '../controllers/productController.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .post(upload.single('image'), productController.createProduct)
  .get(productController.getProducts);

router.route('/:id')
  .get(productController.getProductById)
  .put(upload.single('image'), productController.updateProduct)
  .delete(productController.deleteProduct);

router.route('/:id/reviews')
  .post(productController.addReview);

export default router;
