import express from 'express';
import {
  getPeriodSettings,
  savePeriodSetup,
  updatePeriodSettings,
  logPeriodCycle,
  updatePeriodCycle,
  deletePeriodCycle,
  getDailyLogs,
  saveDailyLog,
  deleteDailyLog,
  getPeriodInsights,
  adjustCycleDelay,
  activatePregnancy,
  deactivatePregnancy,
  getPatientCycleForDoctor
} from '../controllers/periodTrackerController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// User Period Tracking Overview & Configuration
router.get('/overview', authenticateToken, getPeriodSettings);
router.get('/settings', authenticateToken, getPeriodSettings);
router.put('/settings', authenticateToken, updatePeriodSettings);
router.post('/settings', authenticateToken, savePeriodSetup);
router.post('/setup', authenticateToken, savePeriodSetup);

// Period Cycles Logging & Corrections
router.post('/log', authenticateToken, logPeriodCycle);
router.post('/cycles', authenticateToken, logPeriodCycle);
router.put('/cycles/:id', authenticateToken, updatePeriodCycle);
router.delete('/cycles/:id', authenticateToken, deletePeriodCycle);

// Daily Menstrual Symptoms & Health Logging
router.get('/daily', authenticateToken, getDailyLogs);
router.post('/daily', authenticateToken, saveDailyLog);
router.delete('/daily/:date', authenticateToken, deleteDailyLog);

// Historical Health Insights & Analytical Trends
router.get('/insights', authenticateToken, getPeriodInsights);

// Delay & Maternity Adjustments
router.put('/adjust-delay', authenticateToken, adjustCycleDelay);
router.post('/adjust-delay', authenticateToken, adjustCycleDelay);
router.post('/pregnancy/activate', authenticateToken, activatePregnancy);
router.post('/pregnancy/deactivate', authenticateToken, deactivatePregnancy);

// Doctor Access Route (Restricted to patients with appointments)
router.get('/doctor/patient/:patientId', authenticateToken, getPatientCycleForDoctor);

export default router;

