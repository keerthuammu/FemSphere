import pool from '../config/db.js';

export const getMedicalRecords = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query('SELECT * FROM medical_records WHERE user_id = $1 ORDER BY uploaded_at DESC', [userId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const uploadMedicalRecord = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fileName, fileType, fileUrl, fileSize } = req.body;

    const result = await pool.query(
      `INSERT INTO medical_records (user_id, file_name, file_type, file_url, file_size_bytes)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        userId,
        fileName || 'Lab_Result_Document.pdf',
        fileType || 'PDF',
        fileUrl || '/uploads/records/Lab_Result.pdf',
        fileSize ? parseInt(fileSize) : 102400
      ]
    );

    res.status(201).json({ success: true, record: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteMedicalRecord = async (req, res) => {
  try {
    const recordId = req.params.id;
    const userId = req.user.id;

    await pool.query('DELETE FROM medical_records WHERE id = $1 AND user_id = $2', [recordId, userId]);
    res.json({ success: true, message: 'Medical record deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
