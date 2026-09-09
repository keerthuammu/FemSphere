import express from 'express';
import { 
  getUsers, 
  getUserProfile, 
  updateUserProfile,
  getUserNotifications,
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUserConsultationNotes
} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getUsers);
router.get('/profile/:userId?', authenticateToken, getUserProfile);
router.put('/profile', authenticateToken, updateUserProfile);

// User Consultations & Prescriptions
router.get('/consultations', authenticateToken, getUserConsultationNotes);

// User Notifications
router.get('/notifications', authenticateToken, getUserNotifications);
router.post('/notifications', authenticateToken, createNotification);
router.put('/notifications/:id/read', authenticateToken, markNotificationAsRead);
router.put('/notifications/read-all', authenticateToken, markAllNotificationsAsRead);
router.delete('/notifications/:id', authenticateToken, deleteNotification);

export default router;
