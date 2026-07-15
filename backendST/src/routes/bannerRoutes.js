import express from 'express';
import bannerController from '../controllers/bannerController.js';
import upload from '../middlewares/upload.js'; // Cloudinary upload

const router = express.Router();

router.get('/', bannerController.getBanners);
router.post('/', upload.single('image'), bannerController.createBanner);
router.put('/:id', upload.single('image'), bannerController.updateBanner);
router.delete('/:id', bannerController.deleteBanner);

export default router;
