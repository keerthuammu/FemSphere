import express from 'express';
import { 
  getHealthLogs, 
  createHealthLog, 
  updateHealthLog,
  deleteHealthLog,
  getSymptoms, 
  logSymptom,
  updateSymptom,
  deleteSymptom
} from '../controllers/healthTrackerController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/vitals', authenticateToken, getHealthLogs);
router.post('/vitals', authenticateToken, createHealthLog);
router.put('/vitals/:id', authenticateToken, updateHealthLog);
router.delete('/vitals/:id', authenticateToken, deleteHealthLog);

router.get('/symptoms', authenticateToken, getSymptoms);
router.post('/symptoms', authenticateToken, logSymptom);
router.put('/symptoms/:id', authenticateToken, updateSymptom);
router.delete('/symptoms/:id', authenticateToken, deleteSymptom);

export default router;
