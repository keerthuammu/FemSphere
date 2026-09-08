import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'femsphere_secret_jwt_key_2026';

export const register = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const {
      accountType,
      fullName,
      dob,
      gender,
      mobileNumber,
      email,
      address,
      pincode,
      city,
      state,
      country,
      username,
      password,
      bloodGroup,
      heightCm,
      weightKg,
      maritalStatus,
      lifeStage,
      wearableDevice,
      emergencyContactName,
      emergencyContactPhone,
      caregiverType,
      dependentName,
      relationship,
      dependentDob,
      dependentGender,
      dependentBloodGroup,
      dependentCategory,
      dependentMedicalNotes,
      caregiverScopes,
      licenseNumber,
      specialization,
      hospitalClinic,
      yearsOfExperience
    } = req.body;

    if (!username || !email || !password) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, message: 'Username, email, and password are required.' });
    }

    // Check existing username or email
    const existing = await client.query(
      'SELECT id FROM users WHERE LOWER(email) = LOWER($1) OR LOWER(username) = LOWER($2)',
      [email, username]
    );

    if (existing.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, message: 'User with this email or username already exists.' });
    }

    // Normalize role name
    let role = 'Myself';
    if (accountType === 'User (Female)' || accountType === 'Myself') role = 'Myself';
    if (accountType === 'Caregiver') role = 'Caregiver';
    if (accountType === 'Doctor') role = 'Doctor';
    if (accountType === 'Administrator' || accountType === 'Admin (Superuser)') role = 'Admin (Superuser)';

    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user into users table
    const userResult = await client.query(
      `INSERT INTO users (username, email, password_hash, role, status)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, role, status, created_at`,
      [username, email, passwordHash, role, 'Active']
    );

    const newUser = userResult.rows[0];

    // Insert into user_profiles table
    const profileResult = await client.query(
      `INSERT INTO user_profiles (
        user_id, full_name, dob, gender, blood_group, height_cm, weight_kg,
        marital_status, life_stage, wearable_device, emergency_contact_name, emergency_contact_phone
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        newUser.id,
        fullName || username,
        dob || '1995-01-01',
        gender || 'Female',
        bloodGroup || 'A+',
        heightCm ? parseFloat(heightCm) : 165,
        weightKg ? parseFloat(weightKg) : 60,
        maritalStatus || 'Single',
        lifeStage || 'Reproductive Age',
        wearableDevice || 'Apple Watch',
        emergencyContactName || '',
        emergencyContactPhone || mobileNumber || ''
      ]
    );

    // Insert role specifics
    let roleDetails = {};
    if (role === 'Caregiver') {
      const cgResult = await client.query(
        `INSERT INTO caregivers (user_id, caregiver_type, organization_name, emergency_phone)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [newUser.id, caregiverType || 'Parent', 'Family Care', emergencyContactPhone || mobileNumber || '']
      );
      roleDetails.caregiver = cgResult.rows[0];

      if (dependentName) {
        const depResult = await client.query(
          `INSERT INTO dependents (caregiver_id, full_name, dob, relationship, blood_group, medical_notes)
           VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
          [
            roleDetails.caregiver.id,
            dependentName,
            dependentDob || '2020-01-01',
            relationship || 'Child',
            dependentBloodGroup || 'A+',
            dependentMedicalNotes || ''
          ]
        );
        roleDetails.dependent = depResult.rows[0];
        roleDetails.dependents = [depResult.rows[0]];
      }
    } else if (role === 'Doctor') {
      const docResult = await client.query(
        `INSERT INTO doctors (user_id, license_number, specialization, hospital_clinic, years_experience, approval_status)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [
          newUser.id,
          licenseNumber || `MD-${Date.now()}`,
          specialization || 'General Healthcare',
          hospitalClinic || 'FemSphere Clinic',
          yearsOfExperience ? parseInt(yearsOfExperience) : 5,
          'Pending'
        ]
      );
      roleDetails.doctor = docResult.rows[0];
    }

    await client.query('COMMIT');

    const token = jwt.sign(
      { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      token,
      user: {
        ...newUser,
        profile: profileResult.rows[0],
        ...roleDetails
      }
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Registration Controller Error:', err);
    res.status(500).json({ success: false, message: 'Server error during registration: ' + err.message });
  } finally {
    client.release();
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // --- Input validation ---
    if (!email || !email.toString().trim()) {
      return res.status(400).json({ success: false, message: 'Email or username is required.' });
    }
    if (!password || !password.toString().trim()) {
      return res.status(400).json({ success: false, message: 'Password is required.' });
    }

    // --- Look up registered user only ---
    const userQuery = await pool.query(
      `SELECT * FROM users WHERE LOWER(email) = LOWER($1) OR LOWER(username) = LOWER($2)`,
      [email.trim(), email.trim()]
    );

    if (userQuery.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'No account found with that email or username. Please register first.'
      });
    }

    const user = userQuery.rows[0];

    // --- Account status check ---
    if (user.status && user.status.toLowerCase() !== 'active') {
      return res.status(403).json({
        success: false,
        message: `Your account is ${user.status}. Please contact support.`
      });
    }

    // --- Strict bcrypt password validation ---
    const isMatch = await bcrypt.compare(password, user.password_hash).catch(() => false);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password. Please try again.' });
    }

    // Fetch user profile
    const profileQuery = await pool.query(`SELECT * FROM user_profiles WHERE user_id = $1`, [user.id]);
    const profile = profileQuery.rows[0] || {};

    // Fetch role specific data
    let roleDetails = {};
    if (user.role === 'Caregiver') {
      const cg = await pool.query(`SELECT * FROM caregivers WHERE user_id = $1`, [user.id]);
      if (cg.rows.length > 0) {
        roleDetails.caregiver = cg.rows[0];
        const deps = await pool.query(`SELECT * FROM dependents WHERE caregiver_id = $1`, [cg.rows[0].id]);
        roleDetails.dependents = deps.rows;
      }
    } else if (user.role === 'Doctor') {
      const doc = await pool.query(`SELECT * FROM doctors WHERE user_id = $1`, [user.id]);
      if (doc.rows.length > 0) {
        roleDetails.doctor = doc.rows[0];
      }
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: profile.full_name || user.username,
        role: user.role,
        status: user.status,
        profile,
        ...roleDetails
      }
    });
  } catch (err) {
    console.error('Login Controller Error:', err);
    res.status(500).json({ success: false, message: 'Server error during login: ' + err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const userQuery = await pool.query(`SELECT id, username, email, role, status FROM users WHERE id = $1`, [req.user.id]);
    if (userQuery.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    const user = userQuery.rows[0];
    const profileQuery = await pool.query(`SELECT * FROM user_profiles WHERE user_id = $1`, [user.id]);
    const profile = profileQuery.rows[0] || {};

    let roleDetails = {};
    if (user.role === 'Caregiver') {
      const cg = await pool.query(`SELECT * FROM caregivers WHERE user_id = $1`, [user.id]);
      if (cg.rows.length > 0) {
        roleDetails.caregiver = cg.rows[0];
        const deps = await pool.query(`SELECT * FROM dependents WHERE caregiver_id = $1`, [cg.rows[0].id]);
        roleDetails.dependents = deps.rows;
      }
    } else if (user.role === 'Doctor') {
      const doc = await pool.query(`SELECT * FROM doctors WHERE user_id = $1`, [user.id]);
      if (doc.rows.length > 0) {
        roleDetails.doctor = doc.rows[0];
      }
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: profile.full_name || user.username,
        role: user.role,
        status: user.status,
        profile,
        ...roleDetails
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
