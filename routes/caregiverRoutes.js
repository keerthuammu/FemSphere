import express from 'express';
import { getCaregiverProfile, addDependent, getVaccinations, getMedications } from '../controllers/caregiverController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', authenticateToken, getCaregiverProfile);
router.post('/dependents', authenticateToken, addDependent);
router.get('/dependents/:dependentId/vaccinations', authenticateToken, getVaccinations);
router.get('/dependents/:dependentId/medications', authenticateToken, getMedications);

export default router;
