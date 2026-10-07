import express from 'express';
import saleController from '../controllers/saleController.js';
import { protectClient } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(saleController.createSale)
  .get(saleController.getSales);

// Pedidos de un cliente específico
router.get('/client/:clientId', saleController.getSalesByClient);

// Cancelar un pedido propio (devuelve el stock)
router.put('/:id/cancel', protectClient, saleController.cancelSale);

export default router;
