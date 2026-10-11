import express from 'express';
import {
  getPeriodSettings,
  savePeriodSetup,
  logPeriodCycle,
  adjustCycleDelay,
  activatePregnancy,
  deactivatePregnancy,
  getPatientCycleForDoctor
} from '../controllers/periodTrackerController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// User Period Tracking Routes
router.get('/overview', authenticateToken, getPeriodSettings);
router.get('/settings', authenticateToken, getPeriodSettings);
router.post('/setup', authenticateToken, savePeriodSetup);
router.post('/log', authenticateToken, logPeriodCycle);
router.put('/adjust-delay', authenticateToken, adjustCycleDelay);
router.post('/pregnancy/activate', authenticateToken, activatePregnancy);
router.post('/pregnancy/deactivate', authenticateToken, deactivatePregnancy);

// Doctor Access Route (Restricted to patients with appointments)
router.get('/doctor/patient/:patientId', authenticateToken, getPatientCycleForDoctor);

export default router;

