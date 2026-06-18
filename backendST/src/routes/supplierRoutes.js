import express from 'express';
import supplierController from '../controllers/supplierController.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .post(upload.single('image'), supplierController.createSupplier)
  .get(supplierController.getSuppliers);

export default router;
