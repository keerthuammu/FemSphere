import express from 'express';
import {
  invitePartner,
  getConnections,
  acceptConnection,
  rejectConnection,
  revokeConnection,
  getSharingPermissions,
  updateSharingPermissions,
  getPartnerDashboard,
  getPartnerTasks,
  createPartnerTask,
  updatePartnerTask,
  getPartnerGoals,
  createPartnerGoal,
  updatePartnerGoal
} from '../controllers/partnerController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All partner routes require authenticated JWT
router.use(authenticateToken);

// 1. Connection Lifecycle
router.post('/invite', invitePartner);
router.get('/connections', getConnections);
router.post('/connections/:id/accept', acceptConnection);
router.post('/connections/:id/reject', rejectConnection);
router.post('/connections/:id/revoke', revokeConnection);

// 2. Sharing Permissions
router.get('/sharing', getSharingPermissions);
router.put('/sharing', updateSharingPermissions);

// 3. Partner Mode Dashboard Feed (Permission Filtered)
router.get('/dashboard', getPartnerDashboard);

// 4. Partner Tasks & Shared Goals
router.get('/tasks', getPartnerTasks);
router.post('/tasks', createPartnerTask);
router.put('/tasks/:id', updatePartnerTask);

router.get('/goals', getPartnerGoals);
router.post('/goals', createPartnerGoal);
router.put('/goals/:id', updatePartnerGoal);

export default router;
