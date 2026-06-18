import express from 'express';
import shoppingCarController from '../controllers/shoppingCarController.js';

const router = express.Router();

router.route('/')
  .post(shoppingCarController.createShoppingCar)
  .get(shoppingCarController.getShoppingCars);

export default router;
