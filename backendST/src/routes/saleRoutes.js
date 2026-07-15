import express from 'express';
import saleController from '../controllers/saleController.js';

const router = express.Router();

router.route('/')
  .post(saleController.createSale)
  .get(saleController.getSales);

// Pedidos de un cliente específico
router.get('/client/:clientId', saleController.getSalesByClient);

export default router;

