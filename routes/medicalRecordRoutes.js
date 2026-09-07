import express from 'express';
import { getMedicalRecords, uploadMedicalRecord, deleteMedicalRecord } from '../controllers/medicalRecordController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getMedicalRecords);
router.post('/upload', authenticateToken, uploadMedicalRecord);
router.delete('/:id', authenticateToken, deleteMedicalRecord);

export default router;
