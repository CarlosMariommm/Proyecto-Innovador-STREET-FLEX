import express from 'express';
import moduleController from '../controllers/moduleController.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .post(upload.single('image'), moduleController.createModule)
  .get(moduleController.getModules);

router.route('/:id')
  .put(moduleController.updateModule)
  .delete(moduleController.deleteModule);

export default router;
