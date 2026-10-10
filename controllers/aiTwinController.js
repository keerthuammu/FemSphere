import pool from '../config/db.js';
import { generateAIHealthTwinInsights, chatWithHealthTwin } from '../services/aiHealthTwinService.js';

export const getAIInsights = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT * FROM ai_insights WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20`,
      [userId]
    );

    if (result.rows.length === 0) {
      // Auto generate initial insights if none exist
      const generated = await generateAIHealthTwinInsights(userId);
      return res.json({ success: true, insights: generated });
    }

    res.json({ success: true, insights: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const generateInsights = async (req, res) => {
  try {
    const userId = req.user.id;
    const insights = await generateAIHealthTwinInsights(userId);
    res.json({ success: true, insights });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const chatWithTwin = async (req, res) => {
  try {
    const userId = req.user.id;
    const { message, history } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message query is required.' });
    }

    const response = await chatWithHealthTwin(userId, message.trim(), history || []);
    res.json({
      success: true,
      reply: response.text,
      suggestedQuestions: response.suggestedQuestions
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
