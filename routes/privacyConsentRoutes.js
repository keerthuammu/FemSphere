import express from 'express';
import {
  getRelationships,
  createRelationship,
  deleteRelationship,
  getConsents,
  grantConsent,
  revokeConsent,
  getPartnerSharedHealth,
  getAuditLogs
} from '../controllers/privacyConsentController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Relationships
router.get('/relationships', authenticateToken, getRelationships);
router.post('/relationships', authenticateToken, createRelationship);
router.delete('/relationships/:id', authenticateToken, deleteRelationship);

// Consents & Permissions
router.get('/consents', authenticateToken, getConsents);
router.post('/consents', authenticateToken, grantConsent);
router.delete('/consents/:id', authenticateToken, revokeConsent);

// Shared Partner Access
router.get('/partner/shared-health', authenticateToken, getPartnerSharedHealth);

// Privacy Audit Log
router.get('/audit-logs', authenticateToken, getAuditLogs);

export default router;
