import express from 'express';
import clientController from '../controllers/clientController.js';
import { protectClient } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(clientController.createClient)
  .get(clientController.getClients);

router.post('/login', clientController.loginClient);
router.post('/logout', clientController.logoutClient);

// Nuevas rutas para verificación y recuperación
router.get('/verify/:token', clientController.verifyEmail);
router.post('/forgot-password', clientController.forgotPassword);
router.post('/reset-password/:token', clientController.resetPassword);

router.route('/profile')
  .get(protectClient, clientController.getClientProfile);

router.route('/favorites')
  .get(protectClient, clientController.getFavorites)
  .post(protectClient, clientController.addFavorite);

router.route('/favorites/:productId')
  .delete(protectClient, clientController.removeFavorite);

// /:id MUST be last — otherwise it captures /profile, /favorites, /login, etc.
router.route('/:id')
  .put(clientController.updateClient)
  .delete(clientController.deleteClient);

export default router;
