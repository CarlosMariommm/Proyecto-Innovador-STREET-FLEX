import express from 'express';
import aiTryOnController from '../controllers/aiTryOnController.js';

const router = express.Router();

router.route('/')
  .post(aiTryOnController.createAITryOn)
  .get(aiTryOnController.getAITryOns);

export default router;
