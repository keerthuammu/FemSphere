import express from 'express';
import {
  getPeriodSettings,
  savePeriodSetup,
  logPeriodCycle,
  adjustCycleDelay,
  getPatientCycleForDoctor
} from '../controllers/periodTrackerController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// User Period Tracking Routes
router.get('/settings', authenticateToken, getPeriodSettings);
router.post('/setup', authenticateToken, savePeriodSetup);
router.post('/log', authenticateToken, logPeriodCycle);
router.put('/adjust-delay', authenticateToken, adjustCycleDelay);

// Doctor Access Route (Restricted to patients with appointments)
router.get('/doctor/patient/:patientId', authenticateToken, getPatientCycleForDoctor);

export default router;
