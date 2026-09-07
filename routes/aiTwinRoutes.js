import express from 'express';
import { getAIInsights, generateInsights } from '../controllers/aiTwinController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getAIInsights);
router.post('/generate', authenticateToken, generateInsights);

export default router;
