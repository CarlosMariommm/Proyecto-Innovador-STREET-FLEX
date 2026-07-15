import express from 'express';
import upload from '../middlewares/uploadMiddleware.js';
import aiTryOnController from '../controllers/aiTryOnController.js';

const router = express.Router();

// AI Generation endpoint - accepts human photo as file upload + garment URL in body
router.post('/generate', upload.single('human_image'), aiTryOnController.generateTryOn);

// Existing CRUD
router.route('/')
  .post(aiTryOnController.createAITryOn)
  .get(aiTryOnController.getAITryOns);

export default router;
