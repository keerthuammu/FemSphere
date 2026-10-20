import pool from '../config/db.js';
import { determineBiologicalLifeStage } from '../services/lifeStageService.js';

export const getUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.id, u.username, u.email, u.role, u.status, p.full_name, p.dob, p.gender, p.blood_group, p.address
      FROM users u
      LEFT JOIN user_profiles p ON u.id = p.user_id
      ORDER BY u.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const profile = await pool.query('SELECT * FROM user_profiles WHERE user_id = $1', [userId]);
    const user = await pool.query('SELECT id, username, email, role, status FROM users WHERE id = $1', [userId]);
    res.json({
      success: true,
      user: user.rows[0],
      profile: profile.rows[0] || {}
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      fullName, 
      name,
      email,
      phone,
      mobile,
      dob, 
      bloodGroup, 
      blood_group,
      heightCm, 
      height,
      weightKg, 
      weight,
      emergencyContactName, 
      emergencyContactPhone,
      emergencyContact,
      address,
      menarcheStarted,
      menarche_started,
      specialization,
      spec,
      hospitalClinic,
      hospital,
      caregiverType,
      relationship,
      organizationName,
      maritalStatus,
      marital_status
    } = req.body;

    const resolvedName = fullName || name;
    const resolvedDob = (dob && typeof dob === 'string' && dob.trim() !== '') ? dob.trim() : null;
    const normalizeBloodGroup = (bg) => {
      if (!bg || typeof bg !== 'string') return null;
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
    const resolvedBloodGroup = normalizeBloodGroup(bloodGroup || blood_group);
    const resolvedHeight = (heightCm || height) ? parseFloat(heightCm || height) : null;
    const resolvedWeight = (weightKg || weight) ? parseFloat(weightKg || weight) : null;
    const resolvedPhone = phone || mobile || emergencyContactPhone;
    const resolvedEmergencyName = emergencyContactName || (emergencyContact ? emergencyContact.split('(')[0].trim() : null);
    const resolvedEmergencyPhone = emergencyContactPhone || (emergencyContact && emergencyContact.includes('+') ? emergencyContact.match(/\+[\d\s-()]*/)?.[0] : null) || resolvedPhone;
    const resolvedAddress = address || null;
    const resolvedMenarche = menarcheStarted !== undefined 
      ? Boolean(menarcheStarted) 
      : (menarche_started !== undefined ? Boolean(menarche_started) : null);
    const resolvedMaritalStatus = (maritalStatus || marital_status) ? String(maritalStatus || marital_status).trim() : null;

    // 1. Update email in users table if provided
    if (email && email.trim() !== '') {
      await pool.query(
        'UPDATE users SET email = $1 WHERE id = $2',
        [email.trim(), userId]
      );
    }

    // 2. Update or insert into user_profiles table
    let profileRes = await pool.query(
      `UPDATE user_profiles
       SET full_name = COALESCE($1, full_name),
           dob = COALESCE($2, dob),
           blood_group = COALESCE($3, blood_group),
           height_cm = COALESCE($4, height_cm),
           weight_kg = COALESCE($5, weight_kg),
           emergency_contact_name = COALESCE($6, emergency_contact_name),
           emergency_contact_phone = COALESCE($7, emergency_contact_phone),
           address = COALESCE($8, address),
           menarche_started = COALESCE($10, menarche_started),
           marital_status = COALESCE($11, marital_status),
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $9 RETURNING *`,
      [
        resolvedName, 
        resolvedDob, 
        resolvedBloodGroup, 
        resolvedHeight, 
        resolvedWeight, 
        resolvedEmergencyName, 
        resolvedEmergencyPhone, 
        resolvedAddress, 
        userId,
        resolvedMenarche,
        resolvedMaritalStatus
      ]
    );

    if (profileRes.rows.length === 0) {
      profileRes = await pool.query(
        `INSERT INTO user_profiles (
          user_id, full_name, dob, blood_group, height_cm, weight_kg, emergency_contact_name, emergency_contact_phone, address, menarche_started, marital_status
        ) VALUES ($1, $2, COALESCE($3, '1995-01-01'::date), $4, $5, $6, $7, $8, $9, COALESCE($10, TRUE), COALESCE($11, 'Single')) RETURNING *`,
        [
          userId, 
          resolvedName || 'User', 
          resolvedDob, 
          resolvedBloodGroup || 'A+', 
          resolvedHeight || 165, 
          resolvedWeight || 60, 
          resolvedEmergencyName || '', 
          resolvedEmergencyPhone || '',
          resolvedAddress || '',
          resolvedMenarche,
          resolvedMaritalStatus
        ]
      );
    }

    // Check pregnancy status to determine biological life stage
    const pregCheck = await pool.query(`SELECT is_pregnant FROM period_settings WHERE user_id = $1`, [userId]);
    const isUserPregnant = Boolean(pregCheck.rows[0]?.is_pregnant);
    const activeDob = profileRes.rows[0]?.dob;
    const activeMenarche = profileRes.rows[0]?.menarche_started !== false;

    const dynamicStage = determineBiologicalLifeStage({
      dob: activeDob,
      menarcheStarted: activeMenarche,
      isPregnant: isUserPregnant
    });

    await pool.query(
      `UPDATE user_profiles SET life_stage = $1 WHERE user_id = $2`,
      [dynamicStage.name, userId]
    );

    await pool.query(
      `UPDATE user_life_stages SET is_current = FALSE WHERE user_id = $1`,
      [userId]
    );
    await pool.query(
      `INSERT INTO user_life_stages (user_id, life_stage_code, is_current, manually_set, enabled_modules)
       VALUES ($1, $2, TRUE, FALSE, $3)`,
      [userId, dynamicStage.code, JSON.stringify(dynamicStage.enabledModules || [])]
    );

    // 3. Update doctors table if doctor fields provided
    if (specialization || spec || hospitalClinic || hospital) {
      await pool.query(
        `UPDATE doctors 
         SET specialization = COALESCE($1, specialization), 
             hospital_clinic = COALESCE($2, hospital_clinic) 
         WHERE user_id = $3`,
        [specialization || spec, hospitalClinic || hospital, userId]
      );
    }

    // 4. Update caregivers table if caregiver fields provided
    if (relationship || caregiverType || organizationName) {
      await pool.query(
        `UPDATE caregivers 
         SET caregiver_type = COALESCE($1, caregiver_type), 
             organization_name = COALESCE($2, organization_name),
             emergency_phone = COALESCE($3, emergency_phone)
         WHERE user_id = $4`,
        [caregiverType || relationship, organizationName, resolvedPhone, userId]
      );
    }

    // 5. Fetch updated user record
    const updatedUser = await pool.query('SELECT id, username, email, role, status FROM users WHERE id = $1', [userId]);

    res.json({ 
      success: true, 
      message: 'Profile updated successfully in PostgreSQL database.',
      user: {
        ...updatedUser.rows[0],
        fullName: profileRes.rows[0]?.full_name || resolvedName || updatedUser.rows[0]?.username,
        profile: profileRes.rows[0]
      }
    });
  } catch (err) {
    console.error('Update Profile Controller Error:', err);
    res.status(500).json({ success: false, message: 'Database error updating profile: ' + err.message });
  }
};

// ==============================================================================
// NOTIFICATIONS CONTROLLER
// ==============================================================================

export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, message, type } = req.body;

    const result = await pool.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, title || 'System Update', message || 'New alert received.', type || 'system']
    );

    res.status(201).json({ success: true, notification: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await pool.query(
      'UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    res.json({ success: true, notification: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    await pool.query('UPDATE notifications SET is_read = TRUE WHERE user_id = $1', [userId]);
    res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    await pool.query('DELETE FROM notifications WHERE id = $1 AND user_id = $2', [id, userId]);
    res.json({ success: true, message: 'Notification deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==============================================================================
// USER CONSULTATIONS & DOCTOR PRESCRIPTION ADVICE
// ==============================================================================

export const getUserConsultationNotes = async (req, res) => {
  try {
    const patientUserId = req.user.id;
    const notes = await pool.query(
      `SELECT c.*, d.specialization, d.hospital_clinic, d.license_number,
              u.username as doctor_username, p.full_name as doctor_name
       FROM consultation_notes c
       JOIN doctors d ON c.doctor_id = d.id
       JOIN users u ON d.user_id = u.id
       LEFT JOIN user_profiles p ON u.id = p.user_id
       WHERE c.patient_id = $1
       ORDER BY c.created_at DESC`,
      [patientUserId]
    );
    res.json({ success: true, notes: notes.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==============================================================================
// PHYSICAL THERAPY & PRESCRIBED EXERCISE TRACKING
// ==============================================================================

export const getExerciseLogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const targetDate = req.query.date || new Date().toISOString().split('T')[0];

    const logs = await pool.query(
      `SELECT * FROM patient_exercise_logs WHERE user_id = $1 AND completed_date = $2::date`,
      [userId, targetDate]
    );

    const streakRes = await pool.query(
      `SELECT DISTINCT completed_date 
       FROM patient_exercise_logs 
       WHERE user_id = $1 AND completed = TRUE
       ORDER BY completed_date DESC LIMIT 30`,
      [userId]
    );

    const completedMap = {};
    logs.rows.forEach(r => {
      completedMap[r.exercise_key] = r.completed;
    });

    res.json({
      success: true,
      date: targetDate,
      completedMap,
      logs: logs.rows,
      streakDays: streakRes.rows.length
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const toggleExerciseLog = async (req, res) => {
  try {
    const userId = req.user.id;
    const { exerciseKey, exerciseName, consultationId, completed, date } = req.body;
    const targetDate = date || new Date().toISOString().split('T')[0];

    if (!exerciseKey) {
      return res.status(400).json({ success: false, message: 'exerciseKey is required.' });
    }

    const result = await pool.query(
      `INSERT INTO patient_exercise_logs (user_id, consultation_id, exercise_name, exercise_key, completed_date, completed)
       VALUES ($1, $2, $3, $4, $5::date, $6)
       ON CONFLICT (user_id, exercise_key, completed_date)
       DO UPDATE SET completed = EXCLUDED.completed
       RETURNING *`,
      [userId, consultationId || null, exerciseName || exerciseKey, exerciseKey, targetDate, completed !== undefined ? completed : true]
    );

    res.json({
      success: true,
      message: 'Exercise status updated successfully.',
      log: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


