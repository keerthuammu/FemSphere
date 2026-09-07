import express from 'express';
import { 
  getDoctors, 
  getDoctorDashboardStats, 
  getDoctorPatients, 
  getSharedPatientRecords, 
  getConsultationNotes, 
  createConsultationNote, 
  deleteConsultationNote,
  getDoctorSchedule,
  updateDoctorSchedule
} from '../controllers/doctorController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getDoctors);
router.get('/dashboard-stats', authenticateToken, getDoctorDashboardStats);
router.get('/patients', authenticateToken, getDoctorPatients);
router.get('/shared-records', authenticateToken, getSharedPatientRecords);
router.get('/consultation-notes', authenticateToken, getConsultationNotes);
router.post('/consultation-notes', authenticateToken, createConsultationNote);
router.delete('/consultation-notes/:id', authenticateToken, deleteConsultationNote);
router.get('/schedule', getDoctorSchedule);
router.put('/schedule', authenticateToken, updateDoctorSchedule);

export default router;

