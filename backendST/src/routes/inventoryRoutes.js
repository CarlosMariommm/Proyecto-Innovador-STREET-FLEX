import express from 'express';
import inventoryController from '../controllers/inventoryController.js';

const router = express.Router();

router.route('/')
  .post(inventoryController.createInventory)
  .get(inventoryController.getInventories);

export default router;
