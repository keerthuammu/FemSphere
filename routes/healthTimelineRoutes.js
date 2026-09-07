import express from 'express';
import { getHealthTimeline, createHealthEvent } from '../controllers/healthTimelineController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getHealthTimeline);
router.post('/', authenticateToken, createHealthEvent);

export default router;
