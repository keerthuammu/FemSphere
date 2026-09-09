import pool from '../config/db.js';

export const getHealthLogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT * FROM health_tracker WHERE user_id = $1 ORDER BY log_date DESC LIMIT 60',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createHealthLog = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      logDate,
      weightKg,
      weight,
      waterIntakeLiters,
      water,
      sleepHours,
      sleep,
      exerciseMinutes,
      exercise,
      heartRate,
      heart_rate,
      bloodPressure,
      blood_pressure,
      steps,
      caloriesBurned,
      calories_burned,
      distanceKm,
      distance_km,
      foodMeals,
      food_meals,
      caloriesIntake,
      calories_intake,
      mood,
      notes
    } = req.body;

    const finalWeight = weightKg || weight ? parseFloat(weightKg || weight) : null;
    const finalWater = waterIntakeLiters || water ? parseFloat(waterIntakeLiters || water) : 2.0;
    const finalSleep = sleepHours || sleep ? parseFloat(sleepHours || sleep) : 7.5;
    const finalExercise = exerciseMinutes || exercise ? parseInt(exerciseMinutes || exercise, 10) : 30;
    const finalHeartRate = heartRate || heart_rate ? parseInt(heartRate || heart_rate, 10) : null;
    const finalBP = bloodPressure || blood_pressure || null;
    const finalSteps = steps ? parseInt(steps, 10) : null;
    const finalCaloriesBurned = caloriesBurned || calories_burned ? parseInt(caloriesBurned || calories_burned, 10) : null;
    const finalDistance = distanceKm || distance_km ? parseFloat(distanceKm || distance_km) : null;
    const finalFood = foodMeals || food_meals || null;
    const finalCaloriesIntake = caloriesIntake || calories_intake ? parseInt(caloriesIntake || calories_intake, 10) : null;
    const finalMood = mood || 'Good';
    const finalNotes = notes || null;
    const finalDate = logDate || new Date().toISOString().split('T')[0];

    const result = await pool.query(
      `INSERT INTO health_tracker (
        user_id, log_date, weight_kg, water_intake_liters, sleep_hours, exercise_minutes,
        heart_rate, blood_pressure, steps, calories_burned, distance_km, food_meals,
        calories_intake, mood, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      ON CONFLICT (user_id, log_date)
      DO UPDATE SET
        weight_kg = COALESCE(EXCLUDED.weight_kg, health_tracker.weight_kg),
        water_intake_liters = COALESCE(EXCLUDED.water_intake_liters, health_tracker.water_intake_liters),
        sleep_hours = COALESCE(EXCLUDED.sleep_hours, health_tracker.sleep_hours),
        exercise_minutes = COALESCE(EXCLUDED.exercise_minutes, health_tracker.exercise_minutes),
        heart_rate = COALESCE(EXCLUDED.heart_rate, health_tracker.heart_rate),
        blood_pressure = COALESCE(EXCLUDED.blood_pressure, health_tracker.blood_pressure),
        steps = COALESCE(EXCLUDED.steps, health_tracker.steps),
        calories_burned = COALESCE(EXCLUDED.calories_burned, health_tracker.calories_burned),
        distance_km = COALESCE(EXCLUDED.distance_km, health_tracker.distance_km),
        food_meals = COALESCE(EXCLUDED.food_meals, health_tracker.food_meals),
        calories_intake = COALESCE(EXCLUDED.calories_intake, health_tracker.calories_intake),
        mood = COALESCE(EXCLUDED.mood, health_tracker.mood),
        notes = COALESCE(EXCLUDED.notes, health_tracker.notes)
      RETURNING *`,
      [
        userId, finalDate, finalWeight, finalWater, finalSleep, finalExercise,
        finalHeartRate, finalBP, finalSteps, finalCaloriesBurned, finalDistance,
        finalFood, finalCaloriesIntake, finalMood, finalNotes
      ]
    );

    res.status(201).json({ success: true, log: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateHealthLog = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const {
      weightKg, weight, waterIntakeLiters, water, sleepHours, sleep,
      exerciseMinutes, exercise, heartRate, heart_rate, bloodPressure, blood_pressure,
      steps, caloriesBurned, calories_burned, distanceKm, distance_km, foodMeals, food_meals,
      caloriesIntake, calories_intake, mood, notes
    } = req.body;

    const result = await pool.query(
      `UPDATE health_tracker
       SET weight_kg = COALESCE($1, weight_kg),
           water_intake_liters = COALESCE($2, water_intake_liters),
           sleep_hours = COALESCE($3, sleep_hours),
           exercise_minutes = COALESCE($4, exercise_minutes),
           heart_rate = COALESCE($5, heart_rate),
           blood_pressure = COALESCE($6, blood_pressure),
           steps = COALESCE($7, steps),
           calories_burned = COALESCE($8, calories_burned),
           distance_km = COALESCE($9, distance_km),
           food_meals = COALESCE($10, food_meals),
           calories_intake = COALESCE($11, calories_intake),
           mood = COALESCE($12, mood),
           notes = COALESCE($13, notes)
       WHERE id = $14 AND user_id = $15
       RETURNING *`,
      [
        weightKg || weight ? parseFloat(weightKg || weight) : null,
        waterIntakeLiters || water ? parseFloat(waterIntakeLiters || water) : null,
        sleepHours || sleep ? parseFloat(sleepHours || sleep) : null,
        exerciseMinutes || exercise ? parseInt(exerciseMinutes || exercise, 10) : null,
        heartRate || heart_rate ? parseInt(heartRate || heart_rate, 10) : null,
        bloodPressure || blood_pressure || null,
        steps ? parseInt(steps, 10) : null,
        caloriesBurned || calories_burned ? parseInt(caloriesBurned || calories_burned, 10) : null,
        distanceKm || distance_km ? parseFloat(distanceKm || distance_km) : null,
        foodMeals || food_meals || null,
        caloriesIntake || calories_intake ? parseInt(caloriesIntake || calories_intake, 10) : null,
        mood || null,
        notes || null,
        id,
        userId
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Log not found.' });
    }

    res.json({ success: true, log: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteHealthLog = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    await pool.query('DELETE FROM health_tracker WHERE id = $1 AND user_id = $2', [id, userId]);
    res.json({ success: true, message: 'Health log deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getSymptoms = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT * FROM symptoms WHERE user_id = $1 ORDER BY onset_date DESC, id DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const logSymptom = async (req, res) => {
  try {
    const userId = req.user.id;
    const { symptomName, severity, onsetDate, date, notes, description } = req.body;

    const result = await pool.query(
      `INSERT INTO symptoms (user_id, symptom_name, severity, onset_date, notes)
       VALUES ($1, $2, $3, COALESCE($4, CURRENT_DATE), $5) RETURNING *`,
      [userId, symptomName, severity || 'Low', onsetDate || date, notes || description || '']
    );

    res.status(201).json({ success: true, symptom: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateSymptom = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { symptomName, severity, onsetDate, date, notes, description } = req.body;

    const result = await pool.query(
      `UPDATE symptoms
       SET symptom_name = COALESCE($1, symptom_name),
           severity = COALESCE($2, severity),
           onset_date = COALESCE($3, onset_date),
           notes = COALESCE($4, notes)
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [symptomName || null, severity || null, onsetDate || date || null, notes || description || null, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Symptom not found.' });
    }

    res.json({ success: true, symptom: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteSymptom = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    await pool.query('DELETE FROM symptoms WHERE id = $1 AND user_id = $2', [id, userId]);
    res.json({ success: true, message: 'Symptom deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
