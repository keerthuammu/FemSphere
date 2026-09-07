import pool from '../config/db.js';

export const getCaregiverProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const cg = await pool.query('SELECT * FROM caregivers WHERE user_id = $1', [userId]);

    if (cg.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Caregiver profile not found.' });
    }

    const dependents = await pool.query('SELECT * FROM dependents WHERE caregiver_id = $1', [cg.rows[0].id]);

    res.json({
      success: true,
      caregiver: cg.rows[0],
      dependents: dependents.rows
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const addDependent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, dob, relationship, bloodGroup, medicalNotes } = req.body;

    let cg = await pool.query('SELECT id FROM caregivers WHERE user_id = $1', [userId]);
    let caregiverId;

    if (cg.rows.length === 0) {
      const newCg = await pool.query(
        'INSERT INTO caregivers (user_id, caregiver_type, emergency_phone) VALUES ($1, $2, $3) RETURNING id',
        [userId, 'Parent', '+1 (555) 000-0000']
      );
      caregiverId = newCg.rows[0].id;
    } else {
      caregiverId = cg.rows[0].id;
    }

    const dep = await pool.query(
      `INSERT INTO dependents (caregiver_id, full_name, dob, relationship, blood_group, medical_notes)
       VALUES ($1, $2, COALESCE($3, '2020-01-01'), $4, $5, $6) RETURNING *`,
      [caregiverId, fullName, dob, relationship || 'Child', bloodGroup || 'A+', medicalNotes || '']
    );

    res.status(201).json({ success: true, dependent: dep.rows[0] });
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

export const getMedications = async (req, res) => {
  try {
    const dependentId = req.params.dependentId;
    const result = await pool.query('SELECT * FROM medications WHERE dependent_id = $1 ORDER BY id DESC', [dependentId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
