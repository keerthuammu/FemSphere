import pool from '../config/db.js';

export const getSystemStats = async (req, res) => {
  try {
    const usersCount = await pool.query('SELECT COUNT(*) FROM users');
    const doctorsCount = await pool.query('SELECT COUNT(*) FROM doctors');
    const caregiversCount = await pool.query('SELECT COUNT(*) FROM caregivers');
    const recordsCount = await pool.query('SELECT COUNT(*) FROM medical_records');
    const pendingDoctors = await pool.query("SELECT COUNT(*) FROM doctors WHERE approval_status = 'Pending'");

    res.json({
      success: true,
      stats: {
        totalUsers: parseInt(usersCount.rows[0].count),
        totalDoctors: parseInt(doctorsCount.rows[0].count),
        totalCaregivers: parseInt(caregiversCount.rows[0].count),
        totalMedicalRecords: parseInt(recordsCount.rows[0].count),
        pendingDoctorApprovals: parseInt(pendingDoctors.rows[0].count)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const approveDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Approved', 'Rejected', 'Suspended'

    const result = await pool.query(
      'UPDATE doctors SET approval_status = $1 WHERE id = $2 OR user_id = $2 RETURNING *',
      [status || 'Approved', id]
    );

    res.json({ success: true, doctor: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Active', 'Inactive', 'Suspended'

    const result = await pool.query(
      'UPDATE users SET status = $1 WHERE id = $2 RETURNING id, username, email, role, status',
      [status || 'Active', id]
    );

    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
