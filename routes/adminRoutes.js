import express from 'express';
import { getSystemStats, approveDoctor, updateUserStatus } from '../controllers/adminController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', authenticateToken, authorizeRoles('Admin (Superuser)', 'Administrator'), getSystemStats);
router.put('/doctors/:id/approve', authenticateToken, authorizeRoles('Admin (Superuser)', 'Administrator'), approveDoctor);
router.put('/users/:id/status', authenticateToken, authorizeRoles('Admin (Superuser)', 'Administrator'), updateUserStatus);

export default router;
