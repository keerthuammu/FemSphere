import express from 'express';
import {
  searchCompanions,
  sendConnectionRequest,
  getOutgoingConnections,
  getIncomingConnections,
  acceptConnectionRequest,
  rejectConnectionRequest,
  cancelConnectionRequest,
  revokeConnection,
  approveConsent,
  updatePermissions,
  getSharedData,
  getPendingCount,
  getAccessHistory,
  requestCategoryAccess
} from '../controllers/connectionController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All connection routes require an authenticated JWT
router.use(authenticateToken);

// 1. Search for companion or caregiver
router.get('/search', searchCompanions);

// 2. Send connection request
router.post('/request', sendConnectionRequest);

// 3. Outgoing requests / active connections for female user
router.get('/outgoing', getOutgoingConnections);

// 4. Incoming requests / active connections for companion/caregiver
router.get('/incoming', getIncomingConnections);

// 5. Pending count badge
router.get('/pending-count', getPendingCount);

// 6. Access History & Audit Log (dedicated route before param paths)
router.get('/access-history', getAccessHistory);

// 7. Action lifecycle on a connection
router.post('/:id/accept', acceptConnectionRequest);
router.post('/:id/reject', rejectConnectionRequest);
router.post('/:id/cancel', cancelConnectionRequest);
router.post('/:id/revoke', revokeConnection);

// 8. Explicit consent workflow (Female User)
router.post('/:id/consent', approveConsent);

// 9. Update permissions (Female User)
router.put('/:id/permissions', updatePermissions);

// 10. Companion requests category access from female user
router.post('/:id/request-category', requestCategoryAccess);

// 11. View permitted shared data (Companion / Caregiver)
router.get('/:id/shared-data', getSharedData);

export default router;
