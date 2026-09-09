import pool from '../config/db.js';

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
      specialization,
      spec,
      hospitalClinic,
      hospital,
      caregiverType,
      relationship,
      organizationName
    } = req.body;

    const resolvedName = fullName || name;
    const resolvedDob = (dob && typeof dob === 'string' && dob.trim() !== '') ? dob.trim() : null;
    const resolvedBloodGroup = bloodGroup || blood_group;
    const resolvedHeight = (heightCm || height) ? parseFloat(heightCm || height) : null;
    const resolvedWeight = (weightKg || weight) ? parseFloat(weightKg || weight) : null;
    const resolvedPhone = phone || mobile || emergencyContactPhone;
    const resolvedEmergencyName = emergencyContactName || (emergencyContact ? emergencyContact.split('(')[0].trim() : null);
    const resolvedEmergencyPhone = emergencyContactPhone || (emergencyContact && emergencyContact.includes('+') ? emergencyContact.match(/\+[\d\s-()]*/)?.[0] : null) || resolvedPhone;
    const resolvedAddress = address || null;

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
        userId
      ]
    );

    if (profileRes.rows.length === 0) {
      profileRes = await pool.query(
        `INSERT INTO user_profiles (
          user_id, full_name, dob, blood_group, height_cm, weight_kg, emergency_contact_name, emergency_contact_phone, address
        ) VALUES ($1, $2, COALESCE($3, '1995-01-01'::date), $4, $5, $6, $7, $8, $9) RETURNING *`,
        [
          userId, 
          resolvedName || 'User', 
          resolvedDob, 
          resolvedBloodGroup || 'A+', 
          resolvedHeight || 165, 
          resolvedWeight || 60, 
          resolvedEmergencyName || '', 
          resolvedEmergencyPhone || '',
          resolvedAddress || ''
        ]
      );
    }

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


