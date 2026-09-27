import express from 'express';
import {
  registerDevice,
  getDevices,
  getStatus,
  syncData,
  getData,
  getLatestData,
  getHistory,
  deleteDevice
} from '../controllers/smartwatchController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require valid JWT authentication & enforce user ownership
router.use(authenticateToken);

// Devices
router.post('/devices', registerDevice);
router.get('/devices', getDevices);
router.delete('/devices/:id', deleteDevice);

// Status
router.get('/status', getStatus);

// Data Ingestion & Retrieval
router.post('/sync', syncData);
router.get('/data', getData);
router.get('/data/latest', getLatestData);
router.get('/data/history', getHistory);

export default router;
