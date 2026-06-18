import express from 'express';
import eventController from '../controllers/eventController.js';

const router = express.Router();

router.route('/')
  .post(eventController.createEvent)
  .get(eventController.getEvents);

export default router;
