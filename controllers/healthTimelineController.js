import pool from '../config/db.js';

export const getHealthTimeline = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category } = req.query; // 'All', 'Symptoms', 'Cycle', 'Mood', 'Lifestyle', 'Medication', 'MedicalRecord', 'Appointment', 'AIInsight'

    // 1. Fetch from health_events table
    let eventQuery = `SELECT * FROM health_events WHERE user_id = $1`;
    let queryParams = [userId];

    if (category && category !== 'All') {
      eventQuery += ` AND event_type = $2`;
      queryParams.push(category);
    }
    eventQuery += ` ORDER BY event_date DESC LIMIT 50`;

    const eventsResult = await pool.query(eventQuery, queryParams);
    let timeline = eventsResult.rows;

    // If timeline has few events, aggregate dynamically from core tables
    if (timeline.length === 0) {
      // Aggregate symptoms
      const symptoms = await pool.query(`SELECT id, symptom_name as title, onset_date as event_date, severity, notes FROM symptoms WHERE user_id = $1`, [userId]);
      symptoms.rows.forEach(s => {
        timeline.push({
          id: `sym-${s.id}`,
          user_id: userId,
          event_type: 'Symptom',
          event_date: s.onset_date,
          title: `Logged Symptom: ${s.title}`,
          metadata: { severity: s.severity, notes: s.notes },
          source: 'Symptom Tracker'
        });
      });

      // Aggregate health tracker daily logs
      const tracker = await pool.query(`SELECT id, log_date as event_date, weight_kg, sleep_hours, exercise_minutes, water_intake_liters FROM health_tracker WHERE user_id = $1`, [userId]);
      tracker.rows.forEach(t => {
        timeline.push({
          id: `ht-${t.id}`,
          user_id: userId,
          event_type: 'Lifestyle',
          event_date: t.event_date,
          title: `Daily Vitals & Lifestyle Logged`,
          metadata: { weightKg: t.weight_kg, sleepHours: t.sleep_hours, exerciseMins: t.exercise_minutes },
          source: 'Health Tracker'
        });
      });

      // Aggregate medical records
      const records = await pool.query(`SELECT id, file_name as title, uploaded_at as event_date, file_type FROM medical_records WHERE user_id = $1`, [userId]);
      records.rows.forEach(r => {
        timeline.push({
          id: `rec-${r.id}`,
          user_id: userId,
          event_type: 'MedicalRecord',
          event_date: r.event_date ? new Date(r.event_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          title: `Document Uploaded: ${r.title}`,
          metadata: { fileType: r.file_type },
          source: 'Medical Vault'
        });
      });

      // Aggregate appointments
      const appointments = await pool.query(`SELECT id, reason as title, appointment_date as event_date, status FROM appointments WHERE patient_id = $1`, [userId]);
      appointments.rows.forEach(a => {
        timeline.push({
          id: `apt-${a.id}`,
          user_id: userId,
          event_type: 'Appointment',
          event_date: a.event_date,
          title: `Doctor Appointment: ${a.title}`,
          metadata: { status: a.status },
          source: 'Clinical Scheduling'
        });
      });

      // Sort combined array descending by date
      timeline.sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime());
    }

    res.json({ success: true, timeline });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createHealthEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventType, eventDate, title, metadata, source } = req.body;

    if (!eventType || !title) {
      return res.status(400).json({ success: false, message: 'eventType and title are required.' });
    }

    const result = await pool.query(
      `INSERT INTO health_events (user_id, event_type, event_date, title, metadata, source)
       VALUES ($1, $2, COALESCE($3, CURRENT_DATE), $4, $5, $6)
       RETURNING *`,
      [userId, eventType, eventDate || new Date().toISOString().split('T')[0], title, JSON.stringify(metadata || {}), source || 'User']
    );

    res.status(201).json({ success: true, healthEvent: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
