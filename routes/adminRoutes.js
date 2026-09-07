import express from 'express';
import { getSystemStats, approveDoctor, updateUserStatus } from '../controllers/adminController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', authenticateToken, authorizeRoles('Admin (Superuser)'), getSystemStats);
router.put('/doctors/:id/approve', authenticateToken, authorizeRoles('Admin (Superuser)'), approveDoctor);
router.put('/users/:id/status', authenticateToken, authorizeRoles('Admin (Superuser)'), updateUserStatus);

export default router;
