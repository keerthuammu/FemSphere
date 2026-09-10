import pool from '../config/db.js';
import { calculatePhaseMetrics } from './periodTrackerController.js';

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
        SELECT a.*, u.username as patient_username, p.full_name as patient_name,
               ps.last_period_start, ps.period_duration, ps.cycle_length, ps.is_configured as period_tracker_configured
        FROM appointments a
        JOIN users u ON a.patient_id = u.id
        LEFT JOIN user_profiles p ON u.id = p.user_id
        LEFT JOIN period_settings ps ON ps.user_id = u.id
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
    const rows = result.rows.map(row => {
      if (role === 'Doctor') {
        let cycle_phase = 'Not Configured';
        let cycle_day = null;
        let cycle_badge = null;
        if (row.period_tracker_configured && row.last_period_start) {
          try {
            const metrics = calculatePhaseMetrics(row.last_period_start, row.period_duration, row.cycle_length);
            cycle_phase = metrics.phaseName;
            cycle_day = metrics.cycleDay;
            cycle_badge = metrics.phaseBadge;
          } catch (e) {}
        }
        return {
          ...row,
          cycle_phase,
          cycle_day,
          cycle_badge
        };
      }
      return row;
    });

    res.json({ success: true, appointments: rows });
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
    const finalType = type || 'Virtual Telehealth';

    // Verify shift accommodation capacity
    const docQuery = await pool.query('SELECT * FROM doctors WHERE id = $1', [finalDoctorId]);
    if (docQuery.rows.length > 0) {
      const schedule = docQuery.rows[0].schedule;
      if (schedule && Array.isArray(schedule.shifts) && schedule.shifts.length > 0) {
        const parseMinutes = (tStr) => {
          if (!tStr) return 0;
          const match = String(tStr).match(/(\d+):(\d+)\s*(AM|PM)?/i);
          if (!match) return 0;
          let h = parseInt(match[1], 10);
          const m = parseInt(match[2], 10);
          const ap = match[3] ? match[3].toUpperCase() : null;
          if (ap === 'PM' && h !== 12) h += 12;
          if (ap === 'AM' && h === 12) h = 0;
          return h * 60 + m;
        };

        const aptMins = parseMinutes(finalTime);
        const matchedShift = schedule.shifts.find(s => {
          const fromM = parseMinutes(s.fromTime || s.startTime);
          const toM = parseMinutes(s.toTime || s.endTime);
          return aptMins >= fromM && aptMins <= toM;
        }) || schedule.shifts[0];

        if (matchedShift) {
          const maxCap = Number(matchedShift.maxPatients) || 5;
          const fromM = parseMinutes(matchedShift.fromTime || matchedShift.startTime);
          const toM = parseMinutes(matchedShift.toTime || matchedShift.endTime);

          const existingBookings = await pool.query(
            `SELECT appointment_time FROM appointments 
             WHERE doctor_id = $1 AND (appointment_date = $2::date OR appointment_date::text LIKE $3) AND status != 'Cancelled'`,
            [finalDoctorId, finalDate, `${finalDate}%`]
          );

          const bookedCount = existingBookings.rows.filter(a => {
            const m = parseMinutes(a.appointment_time);
            return m >= fromM && m <= toM;
          }).length;

          if (bookedCount >= maxCap) {
            const shiftName = matchedShift.name || matchedShift.type || 'Clinical Shift';
            const sFrom = matchedShift.fromTime || matchedShift.startTime;
            const sTo = matchedShift.toTime || matchedShift.endTime;
            return res.status(400).json({
              success: false,
              message: `The consultation shift "${shiftName}" (${sFrom} - ${sTo}) has reached its maximum patient accommodation limit of ${maxCap} patients on ${finalDate}. Please choose another shift window or doctor.`
            });
          }
        }
      }
    }

    const result = await pool.query(
      `INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, status, type)
       VALUES ($1, $2, $3, $4, $5, 'Scheduled', $6)
       RETURNING *`,
      [finalPatientId, finalDoctorId, finalDate, finalTime, finalReason, finalType]
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

// ==============================================================================
// APPOINTMENT-SLOT RESTRICTED VIDEO CALLING
// ==============================================================================

// In-memory active calls store: appointmentId -> call metadata
const activeCalls = new Map();

// Helper: validate whether current time is within the appointment slot window
function validateAppointmentSlot(appointmentDate, appointmentTime) {
  if (!appointmentDate) return { valid: false, reason: 'Appointment date is missing.' };
  
  const todayStr = new Date().toISOString().split('T')[0];
  const aptDateClean = typeof appointmentDate === 'string'
    ? (appointmentDate.includes('T') ? appointmentDate.split('T')[0] : appointmentDate)
    : (appointmentDate instanceof Date ? appointmentDate.toISOString().split('T')[0] : String(appointmentDate));

  if (todayStr !== aptDateClean) {
    return {
      valid: false,
      reason: `Video call can only be started on the scheduled appointment date (${aptDateClean}). Today is ${todayStr}.`
    };
  }

  // If appointmentTime is specified (e.g. "10:00 AM", "02:30 PM", "Live")
  if (!appointmentTime || appointmentTime.toLowerCase() === 'live') {
    return { valid: true };
  }

  const match = appointmentTime.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) {
    return { valid: true };
  }

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3] ? match[3].toUpperCase() : null;

  if (meridiem === 'PM' && hours < 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const slotMinutes = hours * 60 + minutes;

  // Window: 15 mins before to 60 mins after
  const startWindow = slotMinutes - 15;
  const endWindow = slotMinutes + 60;

  if (currentMinutes < startWindow) {
    const diff = startWindow - currentMinutes;
    return {
      valid: false,
      reason: `It is too early for this slot (${appointmentTime}). The call room opens 15 minutes before the scheduled time (in ~${diff} mins).`
    };
  }

  if (currentMinutes > endWindow) {
    return {
      valid: false,
      reason: `This appointment slot (${appointmentTime}) has expired.`
    };
  }

  return { valid: true };
}

// Doctor initiates a video call during appointment slot
export const startAppointmentCall = async (req, res) => {
  try {
    const doctorUserId = req.user.id;
    const { id } = req.params;

    const aptRes = await pool.query(`
      SELECT a.*, 
             d.user_id as doctor_user_id,
             d.specialization,
             d.hospital_clinic,
             u.username as patient_username,
             p.full_name as patient_name,
             du.username as doctor_username,
             dp.full_name as doctor_name
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users du ON d.user_id = du.id
      LEFT JOIN user_profiles dp ON du.id = dp.user_id
      JOIN users u ON a.patient_id = u.id
      LEFT JOIN user_profiles p ON u.id = p.user_id
      WHERE a.id = $1
    `, [id]);

    if (aptRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    const apt = aptRes.rows[0];

    // Check that caller is the doctor assigned to this appointment
    if (apt.doctor_user_id !== doctorUserId) {
      return res.status(403).json({ success: false, message: 'Unauthorized. Only the assigned physician can call this patient.' });
    }

    // Validate that current time is within the appointment slot
    const slotCheck = validateAppointmentSlot(apt.appointment_date, apt.appointment_time);
    if (!slotCheck.valid) {
      return res.status(400).json({ success: false, message: slotCheck.reason });
    }

    const callData = {
      appointmentId: parseInt(id, 10),
      doctorId: apt.doctor_id,
      doctorUserId: apt.doctor_user_id,
      doctorName: apt.doctor_name || `Dr. ${apt.doctor_username}`,
      specialization: apt.specialization || 'Gynecology & Women’s Health',
      patientId: apt.patient_id,
      patientName: apt.patient_name || apt.patient_username,
      appointmentDate: apt.appointment_date,
      appointmentTime: apt.appointment_time,
      reason: apt.reason,
      status: 'calling', // 'calling' | 'connected' | 'declined' | 'ended'
      startedAt: Date.now()
    };

    activeCalls.set(String(id), callData);

    // Notify patient
    try {
      await pool.query(`
        INSERT INTO notifications (user_id, title, message, type)
        VALUES ($1, $2, $3, 'telehealth')
      `, [
        apt.patient_id,
        'Incoming Doctor Video Call',
        `Dr. ${callData.doctorName} is calling you for your scheduled appointment (${apt.appointment_time}). Click to answer.`
      ]);
    } catch (notifErr) {
      console.error('Error inserting call notification:', notifErr);
    }

    res.json({ success: true, message: 'Calling patient...', call: callData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Patient checks for active incoming call from doctor
export const getActiveCallForUser = async (req, res) => {
  try {
    const userId = req.user.id;

    for (const [appId, call] of activeCalls.entries()) {
      if (call.patientId === userId && (call.status === 'calling' || call.status === 'connected')) {
        // Auto-expire calls older than 5 minutes if still in 'calling'
        if (call.status === 'calling' && Date.now() - call.startedAt > 300000) {
          activeCalls.delete(appId);
          continue;
        }
        return res.json({ success: true, activeCall: call });
      }
    }

    res.json({ success: true, activeCall: null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Patient answers incoming call
export const answerAppointmentCall = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const call = activeCalls.get(String(id));
    if (!call) {
      return res.status(404).json({ success: false, message: 'Call has ended or is not active.' });
    }

    if (call.patientId !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized. This call was not placed to you.' });
    }

    call.status = 'connected';
    call.connectedAt = Date.now();
    activeCalls.set(String(id), call);

    res.json({ success: true, message: 'Call connected.', call });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Patient declines incoming call
export const declineAppointmentCall = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const call = activeCalls.get(String(id));
    if (call && call.patientId === userId) {
      call.status = 'declined';
      activeCalls.set(String(id), call);
    }

    res.json({ success: true, message: 'Call declined.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Doctor or patient ends call
export const endAppointmentCall = async (req, res) => {
  try {
    const { id } = req.params;
    const call = activeCalls.get(String(id));
    if (call) {
      call.status = 'ended';
      activeCalls.delete(String(id));
    }
    res.json({ success: true, message: 'Call ended.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Check call status (for doctor polling)
export const getAppointmentCallStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const call = activeCalls.get(String(id));
    if (!call) {
      return res.json({ success: true, status: 'ended' });
    }
    res.json({ success: true, call });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

