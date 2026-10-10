import express from 'express';
import { getAIInsights, generateInsights, chatWithTwin } from '../controllers/aiTwinController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getAIInsights);
router.post('/generate', authenticateToken, generateInsights);
router.post('/chat', authenticateToken, chatWithTwin);

export default router;
