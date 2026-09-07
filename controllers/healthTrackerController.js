import pool from '../config/db.js';

export const getHealthLogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query('SELECT * FROM health_tracker WHERE user_id = $1 ORDER BY log_date DESC LIMIT 30', [userId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createHealthLog = async (req, res) => {
  try {
    const userId = req.user.id;
    const { logDate, weightKg, waterIntakeLiters, sleepHours, exerciseMinutes } = req.body;

    const result = await pool.query(
      `INSERT INTO health_tracker (user_id, log_date, weight_kg, water_intake_liters, sleep_hours, exercise_minutes)
       VALUES ($1, COALESCE($2, CURRENT_DATE), $3, $4, $5, $6) RETURNING *`,
      [userId, logDate, weightKg || 62, waterIntakeLiters || 2.0, sleepHours || 7.5, exerciseMinutes || 30]
    );

    res.status(201).json({ success: true, log: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getSymptoms = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query('SELECT * FROM symptoms WHERE user_id = $1 ORDER BY onset_date DESC', [userId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const logSymptom = async (req, res) => {
  try {
    const userId = req.user.id;
    const { symptomName, severity, onsetDate, notes } = req.body;

    const result = await pool.query(
      `INSERT INTO symptoms (user_id, symptom_name, severity, onset_date, notes)
       VALUES ($1, $2, $3, COALESCE($4, CURRENT_DATE), $5) RETURNING *`,
      [userId, symptomName, severity || 'Low', onsetDate, notes || '']
    );

    res.status(201).json({ success: true, symptom: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
