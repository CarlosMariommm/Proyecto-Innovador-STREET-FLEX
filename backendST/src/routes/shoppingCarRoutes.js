import express from 'express';
import shoppingCarController from '../controllers/shoppingCarController.js';

const router = express.Router();

router.route('/')
  .post(shoppingCarController.createShoppingCar)
  .get(shoppingCarController.getShoppingCars);

// Rutas específicas por cliente
router.get('/client/:clientId', shoppingCarController.getCartByClient);
router.put('/sync/:clientId', shoppingCarController.syncCart);

export default router;

