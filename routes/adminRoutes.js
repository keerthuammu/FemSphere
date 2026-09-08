import express from 'express';
import { 
  getSystemStats, 
  approveDoctor, 
  getAdminUsers,
  createAdminUser,
  deleteAdminUser,
  updateUserStatus,
  getAdminCaregivers,
  createAdminCaregiver,
  deleteAdminCaregiver,
  getHealthArticles,
  createHealthArticle,
  deleteHealthArticle
} from '../controllers/adminController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Admin protection for all admin endpoints
const adminAuth = [authenticateToken, authorizeRoles('Admin (Superuser)', 'Administrator')];

// Stats
router.get('/stats', ...adminAuth, getSystemStats);

// Doctors
router.put('/doctors/:id/approve', ...adminAuth, approveDoctor);

// Users
router.get('/users', ...adminAuth, getAdminUsers);
router.post('/users', ...adminAuth, createAdminUser);
router.delete('/users/:id', ...adminAuth, deleteAdminUser);
router.put('/users/:id/status', ...adminAuth, updateUserStatus);

// Caregivers
router.get('/caregivers', ...adminAuth, getAdminCaregivers);
router.post('/caregivers', ...adminAuth, createAdminCaregiver);
router.delete('/caregivers/:id', ...adminAuth, deleteAdminCaregiver);

// Health Articles
router.get('/articles', ...adminAuth, getHealthArticles);
router.post('/articles', ...adminAuth, createHealthArticle);
router.delete('/articles/:id', ...adminAuth, deleteHealthArticle);

export default router;
