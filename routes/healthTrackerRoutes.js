import express from 'express';
import { getHealthLogs, createHealthLog, getSymptoms, logSymptom } from '../controllers/healthTrackerController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/vitals', authenticateToken, getHealthLogs);
router.post('/vitals', authenticateToken, createHealthLog);
router.get('/symptoms', authenticateToken, getSymptoms);
router.post('/symptoms', authenticateToken, logSymptom);

export default router;
