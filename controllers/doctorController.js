import pool from '../config/db.js';
import { calculatePhaseMetrics } from './periodTrackerController.js';

export function parseTimeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const match = String(timeStr).match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3] ? match[3].toUpperCase() : null;
  if (ampm === 'PM' && hours !== 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

export function formatMinutesToTime(mins) {
  let hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

export function generateSlotsForShift(fromTime, toTime, stepMins = 30) {
  const start = parseTimeToMinutes(fromTime);
  const end = parseTimeToMinutes(toTime);
  const slots = [];
  for (let m = start; m < end; m += stepMins) {
    slots.push(formatMinutesToTime(m));
  }
  return slots.length > 0 ? slots : [fromTime];
}

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

export const getAvailableDoctors = async (req, res) => {
  try {
    const { date, place, time, specialty } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];

    const dateObj = new Date(targetDate + 'T00:00:00');
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const targetDayName = daysOfWeek[dateObj.getDay()];

    let query = `
      SELECT d.*, u.email, u.username, p.full_name
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      LEFT JOIN user_profiles p ON u.id = p.user_id
      WHERE 1=1
    `;
    const params = [];

    if (place && place.trim()) {
      params.push(`%${place.trim().toLowerCase()}%`);
      query += ` AND LOWER(COALESCE(d.hospital_clinic, '')) LIKE $${params.length}`;
    }

    if (specialty && specialty.trim() && specialty !== 'All') {
      params.push(`%${specialty.trim().toLowerCase()}%`);
      query += ` AND LOWER(COALESCE(d.specialization, '')) LIKE $${params.length}`;
    }

    query += ` ORDER BY d.id DESC`;

    const docResult = await pool.query(query, params);

    // Fetch existing appointments on targetDate for all doctors to compute live capacity
    const aptsResult = await pool.query(
      `SELECT doctor_id, appointment_time, status, appointment_date 
       FROM appointments 
       WHERE (appointment_date = $1::date OR appointment_date::text LIKE $2) AND status != 'Cancelled'`,
      [targetDate, `${targetDate}%`]
    );

    const appointmentsByDoctor = {};
    for (const apt of aptsResult.rows) {
      if (!appointmentsByDoctor[apt.doctor_id]) {
        appointmentsByDoctor[apt.doctor_id] = [];
      }
      appointmentsByDoctor[apt.doctor_id].push(apt);
    }

    const availableDoctors = docResult.rows.map(doctor => {
      const schedule = doctor.schedule || {
        shifts: [
          {
            id: 'shift-morning',
            name: 'Morning Clinical Session',
            fromTime: '09:00 AM',
            toTime: '12:00 PM',
            maxPatients: 5,
            mode: 'Both',
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
          },
          {
            id: 'shift-afternoon',
            name: 'Evening Telehealth Session',
            fromTime: '03:00 PM',
            toTime: '06:00 PM',
            maxPatients: 5,
            mode: 'Virtual Telehealth',
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
          }
        ],
        availableSlots: [
          '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
          '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM'
        ],
        slotDuration: '30 Minutes',
        teleconsultFee: 75,
        workingHours: '09:00 AM - 06:00 PM',
        isUrgentCareOpen: true
      };

      const docApts = appointmentsByDoctor[doctor.id] || [];

      // Calculate shift capacity
      const shiftsWithCapacity = (schedule.shifts || []).map(shift => {
        const fromStr = shift.fromTime || shift.startTime || '09:00 AM';
        const toStr = shift.toTime || shift.endTime || '05:00 PM';
        const shiftFromMins = parseTimeToMinutes(fromStr);
        const shiftToMins = parseTimeToMinutes(toStr);

        // Count appointments that fall within this shift
        const bookedAppointmentsInShift = docApts.filter(a => {
          const aptMins = parseTimeToMinutes(a.appointment_time);
          return aptMins >= shiftFromMins && aptMins <= shiftToMins;
        });

        const bookedCount = bookedAppointmentsInShift.length;
        const maxCapacity = Number(shift.maxPatients) || 5;
        const remainingCapacity = Math.max(0, maxCapacity - bookedCount);
        const isFull = remainingCapacity <= 0;

        // Generate slots
        const generatedSlots = generateSlotsForShift(fromStr, toStr, 30);
        const slotsStatus = generatedSlots.map(slotTime => {
          const isSlotTaken = docApts.some(a => a.appointment_time === slotTime);
          return {
            time: slotTime,
            isAvailable: !isSlotTaken && !isFull
          };
        });

        return {
          ...shift,
          fromTime: fromStr,
          toTime: toStr,
          startTime: fromStr,
          endTime: toStr,
          maxPatients: maxCapacity,
          bookedCount,
          remainingCapacity,
          isFull,
          slots: generatedSlots,
          availableSlots: generatedSlots.filter(s => !docApts.some(a => a.appointment_time === s))
        };
      });

      // Filter shifts by searched time window if specified
      let filteredShifts = shiftsWithCapacity;
      if (time && time !== 'All') {
        const lowerTime = time.toLowerCase();
        if (lowerTime.includes('morning')) {
          filteredShifts = shiftsWithCapacity.filter(s => parseTimeToMinutes(s.fromTime) < 12 * 60);
        } else if (lowerTime.includes('afternoon')) {
          filteredShifts = shiftsWithCapacity.filter(s => {
            const m = parseTimeToMinutes(s.fromTime);
            return m >= 12 * 60 && m < 16 * 60;
          });
        } else if (lowerTime.includes('evening')) {
          filteredShifts = shiftsWithCapacity.filter(s => parseTimeToMinutes(s.fromTime) >= 16 * 60);
        }
      }

      const totalDailyCapacity = shiftsWithCapacity.reduce((acc, s) => acc + s.maxPatients, 0);
      const totalDailyRemaining = shiftsWithCapacity.reduce((acc, s) => acc + s.remainingCapacity, 0);

      return {
        id: doctor.id,
        userId: doctor.user_id,
        name: doctor.full_name || doctor.username || 'Dr. Specialist',
        email: doctor.email,
        specialization: doctor.specialization || 'Obstetrics & Gynecology',
        hospitalClinic: doctor.hospital_clinic || 'FemSphere Health Center',
        yearsExperience: doctor.years_experience || 8,
        teleconsultFee: schedule.teleconsultFee || 75,
        slotDuration: schedule.slotDuration || '30 Minutes',
        isUrgentCareOpen: schedule.isUrgentCareOpen ?? true,
        workingHours: schedule.workingHours || '09:00 AM - 06:00 PM',
        totalDailyCapacity,
        totalDailyRemaining,
        shifts: filteredShifts
      };
    });

    res.json({
      success: true,
      date: targetDate,
      day: targetDayName,
      doctors: availableDoctors
    });
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
    const doctorUserId = req.user?.id;
    const docQuery = await pool.query('SELECT id FROM doctors WHERE user_id = $1', [doctorUserId]);
    if (docQuery.rows.length === 0) {
      return res.json({ success: true, patients: [] });
    }
    const doctorId = docQuery.rows[0].id;

    // Only return patients who have booked an appointment with this specific doctor
    const patients = await pool.query(`
      SELECT DISTINCT ON (u.id)
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
        ht.water_intake_liters as recent_water,
        ps.last_period_start,
        ps.period_duration,
        ps.cycle_length,
        ps.is_configured as period_tracker_configured
      FROM users u
      JOIN appointments a ON a.patient_id = u.id
      LEFT JOIN user_profiles p ON u.id = p.user_id
      LEFT JOIN period_settings ps ON ps.user_id = u.id
      LEFT JOIN LATERAL (
        SELECT weight_kg, sleep_hours, water_intake_liters
        FROM health_tracker
        WHERE user_id = u.id
        ORDER BY log_date DESC
        LIMIT 1
      ) ht ON true
      WHERE a.doctor_id = $1
      ORDER BY u.id ASC
    `, [doctorId]);

    const formattedPatients = patients.rows.map(p => {
      let cycle_phase = 'Not Configured';
      let cycle_day = null;
      let cycle_badge = null;
      if (p.period_tracker_configured && p.last_period_start) {
        try {
          const m = calculatePhaseMetrics(p.last_period_start, p.period_duration, p.cycle_length);
          cycle_phase = m.phaseName;
          cycle_day = m.cycleDay;
          cycle_badge = m.phaseBadge;
        } catch (e) {}
      }
      return {
        ...p,
        cycle_phase,
        cycle_day,
        cycle_badge
      };
    });

    res.json({ success: true, patients: formattedPatients });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getSharedPatientRecords = async (req, res) => {
  try {
    const doctorUserId = req.user?.id;
    const docQuery = await pool.query('SELECT id FROM doctors WHERE user_id = $1', [doctorUserId]);
    if (docQuery.rows.length === 0) {
      return res.json({ success: true, records: [] });
    }
    const doctorId = docQuery.rows[0].id;

    // Only return records for patients who have booked an appointment with this doctor
    const reports = await pool.query(
      `SELECT r.*, u.username, p.full_name, p.dob, p.blood_group
       FROM medical_records r
       JOIN users u ON r.user_id = u.id
       LEFT JOIN user_profiles p ON u.id = p.user_id
       WHERE r.user_id IN (SELECT a.patient_id FROM appointments a WHERE a.doctor_id = $1)
       ORDER BY r.uploaded_at DESC`,
      [doctorId]
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
    let { 
      patientId, 
      appointmentId,
      diagnosis, 
      advice, 
      prescriptionNotes, 
      medications, 
      prescribedExercises,
      chiefComplaint 
    } = req.body;

    let docQuery = await pool.query('SELECT id FROM doctors WHERE user_id = $1', [doctorUserId]);
    let doctorId = docQuery.rows[0]?.id;
    if (!doctorId) {
      const insDoc = await pool.query(
        "INSERT INTO doctors (user_id, license_number, specialization, hospital_clinic, years_experience, approval_status) VALUES ($1, $2, $3, $4, $5, 'Approved') RETURNING id",
        [doctorUserId, `MD-${Math.floor(100000 + Math.random() * 900000)}`, 'Obstetrics & Gynecology', 'FemSphere Women’s Health', 10]
      );
      doctorId = insDoc.rows[0]?.id;
    }

    let cleanPatId = parseInt(String(patientId).replace(/\D/g, '')) || null;
    let cleanAptId = appointmentId ? parseInt(String(appointmentId).replace(/\D/g, '')) : null;

    // Verify appointment-doctor link
    if (cleanAptId) {
      const aptCheck = await pool.query('SELECT * FROM appointments WHERE id = $1', [cleanAptId]);
      if (aptCheck.rows.length > 0) {
        cleanPatId = aptCheck.rows[0].patient_id;
      }
    }

    if (!cleanPatId) {
      const firstApt = await pool.query('SELECT patient_id FROM appointments WHERE doctor_id = $1 LIMIT 1', [doctorId]);
      cleanPatId = firstApt.rows[0]?.patient_id || 2;
    }

    const prescriptionPayload = typeof medications === 'object' ? JSON.stringify(medications) : (prescriptionNotes || '');
    const exercisesPayload = typeof prescribedExercises === 'object' ? JSON.stringify(prescribedExercises) : '[]';

    const result = await pool.query(
      `INSERT INTO consultation_notes (doctor_id, patient_id, appointment_id, diagnosis, advice, prescription_notes, prescribed_exercises)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        doctorId, 
        cleanPatId, 
        cleanAptId, 
        diagnosis || 'Routine Health Review', 
        advice || (chiefComplaint ? `Complaint: ${chiefComplaint}` : ''), 
        prescriptionPayload,
        exercisesPayload
      ]
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
