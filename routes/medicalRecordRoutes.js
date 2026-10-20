import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { 
  getMedicalRecords, 
  uploadMedicalRecord, 
  scanMedicalRecord, 
  deleteMedicalRecord 
} from '../controllers/medicalRecordController.js';
import { authenticateToken } from '../middleware/auth.js';

import os from 'os';

const uploadDir = process.env.VERCEL
  ? path.join(os.tmpdir(), 'records')
  : path.join(process.cwd(), 'uploads', 'records');

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  // Suppress EROFS errors in serverless environments
  console.warn('Notice: upload directory creation deferred:', err.message);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname) || '.pdf';
    cb(null, 'report-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB
});

const router = express.Router();

router.get('/', authenticateToken, getMedicalRecords);
router.post('/', authenticateToken, upload.single('file'), uploadMedicalRecord);
router.post('/upload', authenticateToken, upload.single('file'), uploadMedicalRecord);
router.post('/:id/scan', authenticateToken, scanMedicalRecord);
router.delete('/:id', authenticateToken, deleteMedicalRecord);

export default router;
