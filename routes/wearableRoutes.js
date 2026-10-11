import express from 'express';
import {
  registerDevice,
  getDevices,
  getStatus,
  syncData,
  getData,
  getLatestData,
  getHistory,
  deleteDevice,
  updateDeviceStatus
} from '../controllers/smartwatchController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Universal Wearable Endpoints (JWT Protected)
router.use(authenticateToken);

router.post('/devices', registerDevice);
router.get('/devices', getDevices);
router.patch('/devices/:id/status', updateDeviceStatus);
router.put('/devices/:id', updateDeviceStatus);
router.get('/status', getStatus);
router.post('/sync', syncData);
router.get('/data', getData);
router.get('/data/latest', getLatestData);
router.get('/data/history', getHistory);
router.delete('/devices/:id', deleteDevice);

export default router;
