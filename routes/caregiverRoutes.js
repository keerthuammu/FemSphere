import express from 'express';
import { 
  getCaregiverProfile, 
  addDependent, 
  deleteDependent, 
  getVaccinations, 
  addVaccination, 
  deleteVaccination, 
  getMedications, 
  addMedication, 
  deleteMedication 
} from '../controllers/caregiverController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', authenticateToken, getCaregiverProfile);
router.post('/dependents', authenticateToken, addDependent);
router.delete('/dependents/:dependentId', authenticateToken, deleteDependent);

// Dependent Vaccinations
router.get('/dependents/:dependentId/vaccinations', authenticateToken, getVaccinations);
router.post('/dependents/:dependentId/vaccinations', authenticateToken, addVaccination);
router.delete('/dependents/:dependentId/vaccinations/:vacId', authenticateToken, deleteVaccination);

// Dependent Medications
router.get('/dependents/:dependentId/medications', authenticateToken, getMedications);
router.post('/dependents/:dependentId/medications', authenticateToken, addMedication);
router.delete('/dependents/:dependentId/medications/:medId', authenticateToken, deleteMedication);

export default router;
