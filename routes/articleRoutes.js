import express from 'express';
import { getArticles, createArticle, deleteArticle } from '../controllers/articleController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getArticles);
router.post('/', authenticateToken, authorizeRoles('Admin (Superuser)'), createArticle);
router.delete('/:id', authenticateToken, authorizeRoles('Admin (Superuser)'), deleteArticle);

export default router;
