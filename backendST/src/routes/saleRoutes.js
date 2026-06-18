import express from 'express';
import saleController from '../controllers/saleController.js';

const router = express.Router();

router.route('/')
  .post(saleController.createSale)
  .get(saleController.getSales);

export default router;
