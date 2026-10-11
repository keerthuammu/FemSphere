import pool from '../config/db.js';

export const getCaregiverProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const cg = await pool.query('SELECT * FROM caregivers WHERE user_id = $1', [userId]);

    if (cg.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Caregiver profile not found.' });
    }

    const dependents = await pool.query('SELECT * FROM dependents WHERE caregiver_id = $1 ORDER BY id ASC', [cg.rows[0].id]);

    // Fetch active connected female users via consent-based connections
    const connectedUsers = await pool.query(`
      SELECT pc.id as connection_id, pc.relationship_type, pc.created_at, pc.accepted_at,
             u.id as user_id, u.username, u.email,
             up.full_name, up.dob, up.blood_group, up.life_stage
      FROM partner_connections pc
      JOIN users u ON u.id = pc.patient_user_id
      LEFT JOIN user_profiles up ON up.user_id = u.id
      WHERE pc.partner_user_id = $1 AND pc.status = 'accepted'
      ORDER BY pc.accepted_at DESC;
    `, [userId]);

    res.json({
      success: true,
      caregiver: cg.rows[0],
      dependents: dependents.rows,
      connected_users: connectedUsers.rows
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const addDependent = async (req, res) => {
  // Prohibit caregivers creating female user profiles
  return res.status(403).json({
    success: false,
    message: 'Caregivers cannot create female user profiles. Female users must register their own FemSphere account and send a connection request.'
  });
};

export const deleteDependent = async (req, res) => {
  try {
    const dependentId = req.params.dependentId;
    await pool.query('DELETE FROM dependents WHERE id = $1', [dependentId]);
    res.json({ success: true, message: 'Dependent deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getVaccinations = async (req, res) => {
  try {
    const dependentId = req.params.dependentId;
    const result = await pool.query('SELECT * FROM vaccinations WHERE dependent_id = $1 ORDER BY administered_date DESC', [dependentId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const addVaccination = async (req, res) => {
  try {
    const dependentId = req.params.dependentId;
    const { vaccineName, name, vaccine, administeredDate, date, nextDueDate, nextDue, dueDate } = req.body;
    const vName = vaccineName || name || vaccine;
    const vDate = administeredDate || date || new Date().toISOString().split('T')[0];
    const vNextDue = nextDueDate || nextDue || dueDate || null;

    if (!vName) {
      return res.status(400).json({ success: false, message: 'Vaccine name is required.' });
    }

    const result = await pool.query(
      `INSERT INTO vaccinations (dependent_id, vaccine_name, administered_date, next_due_date)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [dependentId, vName, vDate, vNextDue]
    );

    res.status(201).json({ success: true, message: 'Vaccination recorded successfully.', vaccination: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteVaccination = async (req, res) => {
  try {
    const { dependentId, vacId } = req.params;
    await pool.query('DELETE FROM vaccinations WHERE id = $1 AND dependent_id = $2', [vacId, dependentId]);
    res.json({ success: true, message: 'Vaccination record deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMedications = async (req, res) => {
  try {
    const dependentId = req.params.dependentId;
    const result = await pool.query('SELECT * FROM medications WHERE dependent_id = $1 ORDER BY id DESC', [dependentId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const addMedication = async (req, res) => {
  try {
    const dependentId = req.params.dependentId;
    const { medicineName, name, medicine, dosage, scheduleTime, time, frequency } = req.body;
    const mName = medicineName || name || medicine;
    const mDosage = dosage || '1 tablet';
    const mTime = scheduleTime || time || frequency || '08:00 AM Daily';

    if (!mName) {
      return res.status(400).json({ success: false, message: 'Medicine name is required.' });
    }

    const result = await pool.query(
      `INSERT INTO medications (dependent_id, medicine_name, dosage, schedule_time)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [dependentId, mName, mDosage, mTime]
    );

    res.status(201).json({ success: true, message: 'Medication added successfully.', medication: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteMedication = async (req, res) => {
  try {
    const { dependentId, medId } = req.params;
    await pool.query('DELETE FROM medications WHERE id = $1 AND dependent_id = $2', [medId, dependentId]);
    res.json({ success: true, message: 'Medication removed.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
