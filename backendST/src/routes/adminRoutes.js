import express from 'express';
import adminController from '../controllers/adminController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(adminController.createAdmin)
  .get(adminController.getAdmins);

router.post('/login', adminController.loginAdmin);
router.post('/logout', adminController.logoutAdmin);

router.route('/profile')
  .get(protect, adminController.getAdminProfile);

export default router;
