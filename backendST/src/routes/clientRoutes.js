import express from 'express';
import clientController from '../controllers/clientController.js';
import { protect, protectClient } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Registrar (publico) y listar (solo administradores: la lista trae correos y
// telefonos de todos los clientes, no puede estar abierta en una API publica).
router.route('/')
  .post(clientController.createClient)
  .get(protect, clientController.getClients);

router.post('/login', clientController.loginClient);
router.post('/logout', clientController.logoutClient);

// Verificación de correo y recuperación de contraseña. Cada una tiene su
// version por enlace (la web) y por codigo de 6 digitos (la app movil).
router.get('/verify/:token', clientController.verifyEmail);
router.post('/verify-code', clientController.verifyCode);
router.post('/resend-code', clientController.resendVerificationCode);
router.post('/forgot-password', clientController.forgotPassword);
router.post('/reset-password-code', clientController.resetPasswordWithCode);
router.post('/reset-password/:token', clientController.resetPassword);

router.route('/profile')
  .get(protectClient, clientController.getClientProfile)
  .put(protectClient, clientController.updateClientProfile);

router.route('/favorites')
  .get(protectClient, clientController.getFavorites)
  .post(protectClient, clientController.addFavorite);

router.route('/favorites/:productId')
  .delete(protectClient, clientController.removeFavorite);

// /:id MUST be last — otherwise it captures /profile, /favorites, /login, etc.
// Activar/desactivar y borrar clientes es cosa del panel de administracion.
router.route('/:id')
  .put(protect, clientController.updateClient)
  .delete(protect, clientController.deleteClient);

export default router;
