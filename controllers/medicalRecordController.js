import pool from '../config/db.js';

export const getMedicalRecords = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT * FROM medical_records WHERE user_id = $1 ORDER BY uploaded_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const uploadMedicalRecord = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, fileName, fileType, fileUrl, fileSize, category, description, isScanned, scanResults } = req.body;

    const resolvedTitle = title || fileName || 'Medical Report';
    const resolvedFileName = fileName || `${resolvedTitle.replace(/\s+/g, '_')}.pdf`;
    const resolvedFileType = (fileType || resolvedFileName.split('.').pop() || 'PDF').toUpperCase();
    const resolvedUrl = fileUrl || `/uploads/records/${resolvedFileName}`;
    const resolvedSize = fileSize ? parseInt(fileSize, 10) : 2400000;

    const result = await pool.query(
      `INSERT INTO medical_records (
        user_id, file_name, file_type, file_url, file_size_bytes, title, category, description, is_scanned, scan_results
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        userId,
        resolvedFileName,
        resolvedFileType,
        resolvedUrl,
        resolvedSize,
        resolvedTitle,
        category || 'Lab Results',
        description || 'Uploaded medical record',
        isScanned !== undefined ? isScanned : false,
        scanResults ? JSON.stringify(scanResults) : null
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
