import express from 'express';
import employeeController from '../controllers/employeeController.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .post(upload.single('image'), employeeController.createEmployee)
  .get(employeeController.getEmployees);

export default router;
