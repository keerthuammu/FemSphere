import pool from '../config/db.js';

export const getCaregiverProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const cg = await pool.query('SELECT * FROM caregivers WHERE user_id = $1', [userId]);

    if (cg.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Caregiver profile not found.' });
    }

    const dependents = await pool.query('SELECT * FROM dependents WHERE caregiver_id = $1 ORDER BY id ASC', [cg.rows[0].id]);

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
    const fullName = req.body.fullName || req.body.name;
    const dob = req.body.dob || '2020-01-01';
    const relationship = req.body.relationship || req.body.relation || 'Child';
    const rawBloodGroup = req.body.bloodGroup || req.body.blood_group || 'A+';
    const normalizeBloodGroup = (bg) => {
      if (!bg || typeof bg !== 'string') return 'Unknown';
      const clean = bg.trim();
      const match = clean.match(/\((A\+|A-|B\+|B-|AB\+|AB-|O\+|O-)\)/i);
      if (match) return match[1].toUpperCase();
      const direct = clean.toUpperCase();
      const valid = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'UNKNOWN'];
      if (valid.includes(direct)) {
        return direct === 'UNKNOWN' ? 'Unknown' : direct;
      }
      return 'Unknown';
    };
    const bloodGroup = normalizeBloodGroup(rawBloodGroup);
    const medicalNotes = req.body.medicalNotes || '';

    if (!fullName) {
      return res.status(400).json({ success: false, message: 'Dependent full name is required.' });
    }

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
       VALUES ($1, $2, COALESCE($3::date, '2020-01-01'::date), $4, $5, $6) RETURNING *`,
      [caregiverId, fullName, dob || '2020-01-01', relationship, bloodGroup, medicalNotes]
    );

    res.status(201).json({ success: true, dependent: dep.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
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
