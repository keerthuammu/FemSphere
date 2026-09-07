import express from 'express';
import { getAppointments, createAppointment, updateAppointmentStatus, deleteAppointment } from '../controllers/appointmentController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getAppointments);
router.post('/', authenticateToken, createAppointment);
router.put('/:id/status', authenticateToken, updateAppointmentStatus);
router.delete('/:id', authenticateToken, deleteAppointment);

export default router;

