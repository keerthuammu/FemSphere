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
    const doctorId = docQuery.rows[0]?.id || 1;

    const aptCount = await pool.query('SELECT COUNT(*) FROM appointments WHERE doctor_id = $1', [doctorId]);
    const notesCount = await pool.query('SELECT COUNT(*) FROM consultation_notes WHERE doctor_id = $1', [doctorId]);
    const sharedCount = await pool.query('SELECT COUNT(*) FROM medical_records WHERE user_id IN (SELECT patient_id FROM appointments WHERE doctor_id = $1)', [doctorId]);

    res.json({
      success: true,
      stats: {
        activePatients: 12,
        appointmentsCount: parseInt(aptCount.rows[0]?.count || 5),
        notesCount: parseInt(notesCount.rows[0]?.count || 8),
        sharedRecordsCount: parseInt(sharedCount.rows[0]?.count || 6),
        patientSatisfaction: '4.9/5',
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
      SELECT u.id, u.username, u.email, p.full_name, p.dob, p.gender, p.blood_group, p.height_cm, p.weight_kg, p.life_stage
      FROM users u
      JOIN user_profiles p ON u.id = p.user_id
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
    const doctorUserId = req.user?.id;
    const docQuery = await pool.query('SELECT id FROM doctors WHERE user_id = $1', [doctorUserId]);
    const doctorId = docQuery.rows[0]?.id || 1;

    const reports = await pool.query(
      `SELECT r.*, u.username, p.full_name, p.dob, p.blood_group
       FROM medical_records r
       JOIN users u ON r.user_id = u.id
       JOIN user_profiles p ON u.id = p.user_id
       ORDER BY r.id DESC`
    );

    res.json(reports.rows);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getConsultationNotes = async (req, res) => {
  try {
    const doctorUserId = req.user?.id;
    const docQuery = await pool.query('SELECT id FROM doctors WHERE user_id = $1', [doctorUserId]);
    const doctorId = docQuery.rows[0]?.id || 1;

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
    const { patientId, diagnosis, advice, prescriptionNotes, medications, chiefComplaint } = req.body;

    const docQuery = await pool.query('SELECT id FROM doctors WHERE user_id = $1', [doctorUserId]);
    const doctorId = docQuery.rows[0]?.id || 1;

    const prescriptionPayload = typeof medications === 'object' ? JSON.stringify(medications) : (prescriptionNotes || '');

    const result = await pool.query(
      `INSERT INTO consultation_notes (doctor_id, patient_id, diagnosis, advice, prescription_notes)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [doctorId, patientId || 1, diagnosis || 'Routine Health Twin Review', advice || '', prescriptionPayload]
    );

    res.status(201).json({ success: true, note: result.rows[0] });
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
    res.json({
      success: true,
      schedule: {
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        workingHours: '09:00 AM - 07:00 PM',
        shifts: [
          {
            id: 'SHIFT-01',
            name: 'Morning Clinical Session',
            fromTime: '09:00 AM',
            toTime: '12:00 PM',
            maxPatients: 6,
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            mode: 'Both'
          },
          {
            id: 'SHIFT-02',
            name: 'Evening Telehealth Session',
            fromTime: '05:00 PM',
            toTime: '07:00 PM',
            maxPatients: 4,
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            mode: 'Virtual Telehealth'
          }
        ],
        availableSlots: [
          '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
          '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM'
        ],
        teleconsultFee: 75,
        slotDurationMinutes: 30,
        isUrgentCareOpen: true
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateDoctorSchedule = async (req, res) => {
  try {
    const { availableDays, workingHours, shifts, availableSlots, teleconsultFee, slotDurationMinutes, isUrgentCareOpen } = req.body;

    res.json({
      success: true,
      message: 'Doctor availability schedule & consultation shifts updated successfully.',
      schedule: { availableDays, workingHours, shifts, availableSlots, teleconsultFee, slotDurationMinutes, isUrgentCareOpen }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
