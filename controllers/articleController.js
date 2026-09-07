import pool from '../config/db.js';

export const getArticles = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM health_articles ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createArticle = async (req, res) => {
  try {
    const adminId = req.user?.id || 1;
    const { title, category, description, imageUrl } = req.body;

    const result = await pool.query(
      `INSERT INTO health_articles (author_admin_id, title, category, description, image_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [adminId, title, category || 'Wellness', description, imageUrl || '']
    );

    res.status(201).json({ success: true, article: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM health_articles WHERE id = $1', [id]);
    res.json({ success: true, message: 'Article deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
