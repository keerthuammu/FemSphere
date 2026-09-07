import express from 'express';
import { getAllLifeStages, getUserLifeStage, setUserLifeStage } from '../controllers/lifeStageController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllLifeStages);
router.get('/current', authenticateToken, getUserLifeStage);
router.put('/current', authenticateToken, setUserLifeStage);

export default router;
