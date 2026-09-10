import express from 'express';
import { 
  getAppointments, 
  createAppointment, 
  updateAppointmentStatus, 
  deleteAppointment,
  startAppointmentCall,
  getActiveCallForUser,
  answerAppointmentCall,
  declineAppointmentCall,
  endAppointmentCall,
  getAppointmentCallStatus
} from '../controllers/appointmentController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getAppointments);
router.post('/', authenticateToken, createAppointment);
router.put('/:id/status', authenticateToken, updateAppointmentStatus);
router.delete('/:id', authenticateToken, deleteAppointment);

// Video Calling & Telehealth Routes
router.get('/active-call', authenticateToken, getActiveCallForUser);
router.post('/:id/call', authenticateToken, startAppointmentCall);
router.get('/:id/call-status', authenticateToken, getAppointmentCallStatus);
router.post('/:id/answer', authenticateToken, answerAppointmentCall);
router.post('/:id/decline', authenticateToken, declineAppointmentCall);
router.post('/:id/end-call', authenticateToken, endAppointmentCall);

export default router;


