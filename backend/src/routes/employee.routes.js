import express from 'express';
import employeeController from '../controllers/employee.controller.js';
import { protect, admin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/')
    .get(protect, admin, employeeController.getAll)
    .post(protect, admin, employeeController.create);

router.route('/:id')
    .get(protect, admin, employeeController.getById)
    .put(protect, admin, employeeController.update)
    .delete(protect, admin, employeeController.delete);

export default router;
