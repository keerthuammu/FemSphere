import pool from '../config/db.js';

export const getAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let query;
    let params;

    if (role === 'Doctor') {
      const doc = await pool.query('SELECT id FROM doctors WHERE user_id = $1', [userId]);
      if (doc.rows.length === 0) {
        return res.json({ success: true, appointments: [] });
      }
      const doctorId = doc.rows[0].id;
      query = `
        SELECT a.*, u.username as patient_username, p.full_name as patient_name
        FROM appointments a
        JOIN users u ON a.patient_id = u.id
        LEFT JOIN user_profiles p ON u.id = p.user_id
        WHERE a.doctor_id = $1
        ORDER BY a.appointment_date DESC`;
      params = [doctorId];
    } else {
      query = `
        SELECT a.*, d.specialization, d.hospital_clinic, u.username as doctor_username, p.full_name as doctor_full_name
        FROM appointments a
        LEFT JOIN doctors d ON a.doctor_id = d.id
        LEFT JOIN users u ON d.user_id = u.id
        LEFT JOIN user_profiles p ON u.id = p.user_id
        WHERE a.patient_id = $1
        ORDER BY a.appointment_date DESC`;
      params = [userId];
    }

    const result = await pool.query(query, params);
    res.json({ success: true, appointments: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    const { 
      doctorId, 
      patientId, 
      appointmentDate, 
      date, 
      appointmentTime, 
      time, 
      reason, 
      doctorName, 
      patientName, 
      type 
    } = req.body;

    let finalPatientId;
    let finalDoctorId;

    if (role === 'Doctor') {
      const doc = await pool.query('SELECT id FROM doctors WHERE user_id = $1', [userId]);
      if (doc.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Doctor profile not found in database.' });
      }
      finalDoctorId = doc.rows[0].id;
      finalPatientId = parseInt(String(patientId).replace(/\D/g, ''));
    } else {
      finalPatientId = userId;
      finalDoctorId = parseInt(String(doctorId).replace(/\D/g, '')) || 1;
    }

    const finalDate = appointmentDate || date || new Date().toISOString().split('T')[0];
    const finalTime = appointmentTime || time || '10:00 AM';
    const finalReason = reason || 'Regular Health Twin Consultation';

    const result = await pool.query(
      `INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, status)
       VALUES ($1, $2, $3, $4, $5, 'Scheduled')
       ON CONFLICT (doctor_id, appointment_date, appointment_time)
       DO UPDATE SET reason = EXCLUDED.reason, status = 'Scheduled'
       RETURNING *`,
      [finalPatientId, finalDoctorId, finalDate, finalTime, finalReason]
    );

    const joined = await pool.query(`
      SELECT a.*, u.username as patient_username, p.full_name as patient_name
      FROM appointments a
      JOIN users u ON a.patient_id = u.id
      LEFT JOIN user_profiles p ON u.id = p.user_id
      WHERE a.id = $1
    `, [result.rows[0].id]);

    res.status(201).json({ 
      success: true, 
      message: 'Appointment scheduled successfully.',
      appointment: {
        ...joined.rows[0],
        type: type || 'Virtual Telehealth'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      'UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *',
      [status || 'Accepted', id]
    );

    res.json({ success: true, message: `Appointment status updated to ${status}.`, appointment: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM appointments WHERE id = $1', [id]);
    res.json({ success: true, message: 'Appointment deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
