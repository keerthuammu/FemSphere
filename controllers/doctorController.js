import pool from '../config/db.js';

export const getDoctors = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.*, u.email, u.username, p.full_name
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      LEFT JOIN user_profiles p ON u.id = p.user_id
      ORDER BY d.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getDoctorDashboardStats = async (req, res) => {
  try {
    const doctorUserId = req.user?.id;
    const docQuery = await pool.query('SELECT id FROM doctors WHERE user_id = $1', [doctorUserId]);
    const doctorId = docQuery.rows[0]?.id;

    if (!doctorId) {
      return res.json({
        success: true,
        stats: {
          activePatients: 0,
          appointmentsCount: 0,
          notesCount: 0,
          sharedRecordsCount: 0,
          patientSatisfaction: '5.0/5',
          consultationHours: '09:00 AM - 05:00 PM'
        }
      });
    }

    const aptCount = await pool.query('SELECT COUNT(*) FROM appointments WHERE doctor_id = $1', [doctorId]);
    const notesCount = await pool.query('SELECT COUNT(*) FROM consultation_notes WHERE doctor_id = $1', [doctorId]);
    const sharedCount = await pool.query('SELECT COUNT(*) FROM medical_records');
    const patCount = await pool.query("SELECT COUNT(*) FROM users WHERE role IN ('Myself', 'User (Female)')");

    res.json({
      success: true,
      stats: {
        activePatients: parseInt(patCount.rows[0]?.count || 0),
        appointmentsCount: parseInt(aptCount.rows[0]?.count || 0),
        notesCount: parseInt(notesCount.rows[0]?.count || 0),
        sharedRecordsCount: parseInt(sharedCount.rows[0]?.count || 0),
        patientSatisfaction: '5.0/5',
        consultationHours: '09:00 AM - 05:00 PM'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getDoctorPatients = async (req, res) => {
  try {
    const patients = await pool.query(`
      SELECT 
        u.id, 
        u.username, 
        u.email, 
        p.full_name, 
        p.dob, 
        p.gender, 
        p.blood_group, 
        p.height_cm, 
        p.weight_kg, 
        p.life_stage,
        p.wearable_device,
        p.emergency_contact_phone,
        p.address,
        ht.weight_kg as recent_weight,
        ht.sleep_hours as recent_sleep,
        ht.water_intake_liters as recent_water
      FROM users u
      LEFT JOIN user_profiles p ON u.id = p.user_id
      LEFT JOIN LATERAL (
        SELECT weight_kg, sleep_hours, water_intake_liters
        FROM health_tracker
        WHERE user_id = u.id
        ORDER BY log_date DESC
        LIMIT 1
      ) ht ON true
      WHERE u.role IN ('Myself', 'User (Female)')
      ORDER BY u.id ASC
    `);
    res.json({ success: true, patients: patients.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getSharedPatientRecords = async (req, res) => {
  try {
    const reports = await pool.query(
      `SELECT r.*, u.username, p.full_name, p.dob, p.blood_group
       FROM medical_records r
       JOIN users u ON r.user_id = u.id
       LEFT JOIN user_profiles p ON u.id = p.user_id
       ORDER BY r.uploaded_at DESC`
    );

    res.json({ success: true, records: reports.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getConsultationNotes = async (req, res) => {
  try {
    const doctorUserId = req.user?.id;
    const docQuery = await pool.query('SELECT id FROM doctors WHERE user_id = $1', [doctorUserId]);
    if (docQuery.rows.length === 0) {
      return res.json({ success: true, notes: [] });
    }
    const doctorId = docQuery.rows[0].id;

    const notes = await pool.query(
      `SELECT c.*, u.username, p.full_name as patient_name
       FROM consultation_notes c
       LEFT JOIN users u ON c.patient_id = u.id
       LEFT JOIN user_profiles p ON u.id = p.user_id
       WHERE c.doctor_id = $1
       ORDER BY c.created_at DESC`,
      [doctorId]
    );

    res.json({ success: true, notes: notes.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createConsultationNote = async (req, res) => {
  try {
    const doctorUserId = req.user?.id;
    let { patientId, diagnosis, advice, prescriptionNotes, medications, chiefComplaint } = req.body;

    let docQuery = await pool.query('SELECT id FROM doctors WHERE user_id = $1', [doctorUserId]);
    let doctorId = docQuery.rows[0]?.id;
    if (!doctorId) {
      const insDoc = await pool.query(
        "INSERT INTO doctors (user_id, license_number, specialization, hospital_clinic, years_experience, approval_status) VALUES ($1, $2, $3, $4, $5, 'Approved') RETURNING id",
        [doctorUserId, `MD-${Math.floor(100000 + Math.random() * 900000)}`, 'Obstetrics & Gynecology', 'FemSphere Women’s Health', 10]
      );
      doctorId = insDoc.rows[0]?.id;
    }

    let cleanPatId = parseInt(String(patientId).replace(/\D/g, '')) || 2;
    const patCheck = await pool.query('SELECT id FROM users WHERE id = $1', [cleanPatId]);
    if (patCheck.rows.length === 0) {
      const firstPat = await pool.query("SELECT id FROM users WHERE role IN ('Myself', 'User (Female)') LIMIT 1");
      cleanPatId = firstPat.rows[0]?.id || 2;
    }

    const prescriptionPayload = typeof medications === 'object' ? JSON.stringify(medications) : (prescriptionNotes || '');

    const result = await pool.query(
      `INSERT INTO consultation_notes (doctor_id, patient_id, diagnosis, advice, prescription_notes)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [doctorId, cleanPatId, diagnosis || 'Routine Health Review', advice || (chiefComplaint ? `Complaint: ${chiefComplaint}` : ''), prescriptionPayload]
    );

    const joined = await pool.query(
      `SELECT c.*, u.username, p.full_name as patient_name
       FROM consultation_notes c
       LEFT JOIN users u ON c.patient_id = u.id
       LEFT JOIN user_profiles p ON u.id = p.user_id
       WHERE c.id = $1`,
      [result.rows[0].id]
    );

    res.status(201).json({ success: true, note: joined.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteConsultationNote = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM consultation_notes WHERE id = $1', [id]);
    res.json({ success: true, message: 'Consultation note deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getDoctorSchedule = async (req, res) => {
  try {
    const doctorUserId = req.user?.id;
    let schedule = null;

    if (doctorUserId) {
      const doc = await pool.query('SELECT schedule FROM doctors WHERE user_id = $1', [doctorUserId]);
      if (doc.rows.length > 0 && doc.rows[0].schedule) {
        schedule = doc.rows[0].schedule;
      }
    }

    if (!schedule) {
      schedule = {
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        workingHours: '09:00 AM - 05:00 PM',
        shifts: [
          {
            id: 'SHIFT-01',
            name: 'Morning Clinical Session',
            fromTime: '09:00 AM',
            toTime: '12:00 PM',
            maxPatients: 6,
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            mode: 'Both'
          }
        ],
        availableSlots: [
          '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'
        ],
        teleconsultFee: 50,
        slotDurationMinutes: 30,
        isUrgentCareOpen: true
      };
    }

    res.json({
      success: true,
      schedule
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateDoctorSchedule = async (req, res) => {
  try {
    const doctorUserId = req.user?.id;
    const schedulePayload = req.body;

    if (doctorUserId) {
      await pool.query(
        'UPDATE doctors SET schedule = $1 WHERE user_id = $2',
        [JSON.stringify(schedulePayload), doctorUserId]
      );
    }

    res.json({
      success: true,
      message: 'Doctor availability schedule updated successfully.',
      schedule: schedulePayload
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
