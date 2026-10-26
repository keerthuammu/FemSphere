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
    const effectiveType = accountType || req.body.role;
    let role = 'User (Female)';
    if (effectiveType === 'User (Female)' || effectiveType === 'Myself') role = 'User (Female)';
    if (effectiveType === 'Caregiver') role = 'Caregiver';
    if (effectiveType === 'Doctor') role = 'Doctor';
    if (effectiveType === 'Administrator' || effectiveType === 'Admin (Superuser)') role = 'Admin (Superuser)';

    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user into users table
    const userResult = await client.query(
      `INSERT INTO users (username, email, password_hash, role, status)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, role, status, created_at`,
      [username, email, passwordHash, role, 'Active']
    );

    const newUser = userResult.rows[0];

    // Helper to normalize blood group (e.g., 'A Positive (A+)' -> 'A+')
    const normalizeBloodGroup = (bg) => {
      if (!bg || typeof bg !== 'string') return 'Unknown';
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

    const finalBloodGroup = normalizeBloodGroup(bloodGroup);

    // Helper to normalize gender ('Female', 'Male', 'Non-Binary', 'Other')
    const normalizeGender = (g) => {
      if (!g || typeof g !== 'string') return 'Female';
      const clean = g.trim().toLowerCase();
      if (clean === 'male' || clean === 'm') return 'Male';
      if (clean === 'female' || clean === 'f') return 'Female';
      if (clean === 'non-binary' || clean === 'nonbinary' || clean === 'nb') return 'Non-Binary';
      if (clean === 'other') return 'Other';
      const capitalized = g.trim().charAt(0).toUpperCase() + g.trim().slice(1).toLowerCase();
      const valid = ['Female', 'Male', 'Non-Binary', 'Other'];
      return valid.includes(capitalized) ? capitalized : 'Female';
    };

    const finalGender = normalizeGender(gender);

    // Compute automatic life stage from DOB if not explicitly specified
    let finalLifeStage = lifeStage;
    if (!finalLifeStage || finalLifeStage.trim() === '') {
      if (dob) {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        if (age < 12) finalLifeStage = 'Childhood';
        else if (age <= 18) finalLifeStage = 'Adolescence';
        else if (age <= 42) finalLifeStage = 'Reproductive Age';
        else if (age <= 50) finalLifeStage = 'Perimenopause';
        else finalLifeStage = 'Menopause';
      } else {
        finalLifeStage = 'Reproductive Age';
      }
    }

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
        finalGender,
        finalBloodGroup,
        heightCm ? parseFloat(heightCm) : 165,
        weightKg ? parseFloat(weightKg) : 60,
        maritalStatus || 'Single',
        finalLifeStage,
        wearableDevice || 'None',
        emergencyContactName || '',
        emergencyContactPhone || mobileNumber || ''
      ]
    );

    // Insert role specifics
    let roleDetails = {};
    if (role === 'Caregiver') {
      // Enforce Caregiver age >= 16
      if (dob) {
        const birthDate = new Date(dob);
        const today = new Date();
        let caregiverAge = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          caregiverAge--;
        }
        if (caregiverAge < 16) {
          await client.query('ROLLBACK');
          return res.status(400).json({ success: false, message: 'Caregiver must be at least 16 years of age.' });
        }
      }

      // Calculate caregiver_type from relationship if not explicitly passed
      let finalCaregiverType = caregiverType;
      if (!finalCaregiverType || finalCaregiverType.trim() === '') {
        const rel = (relationship || '').toLowerCase().trim();
        if (rel.includes('daughter') || rel.includes('son') || rel.includes('child')) {
          finalCaregiverType = 'Parent';
        } else if (rel.includes('spouse') || rel.includes('partner') || rel.includes('husband') || rel.includes('wife')) {
          finalCaregiverType = 'Partner / Spouse';
        } else if (rel.includes('sister') || rel.includes('brother') || rel.includes('sibling')) {
          finalCaregiverType = 'Sibling';
        } else if (rel.includes('mother') || rel.includes('father') || rel.includes('grandparent') || rel.includes('relative') || rel.includes('elder')) {
          finalCaregiverType = 'Relative';
        } else {
          finalCaregiverType = 'Relative';
        }
      }

      const cgResult = await client.query(
        `INSERT INTO caregivers (user_id, caregiver_type, organization_name, emergency_phone)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [newUser.id, finalCaregiverType, 'Family Care', emergencyContactPhone || mobileNumber || '']
      );
      roleDetails.caregiver = cgResult.rows[0];
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

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Valid email address is required.' });
    }

    const userRes = await pool.query(
      'SELECT id, username, email FROM users WHERE LOWER(email) = LOWER($1)',
      [email.trim()]
    );

    if (userRes.rows.length === 0) {
      // Obfuscated response to prevent email harvesting
      return res.json({
        success: true,
        message: 'If an account exists with that email address, a password reset authorization has been generated.'
      });
    }

    const user = userRes.rows[0];
    const resetToken = jwt.sign(
      { id: user.id, email: user.email, type: 'pwd_reset' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      message: 'Password reset token generated successfully. Valid for 60 minutes.',
      resetToken,
      instructions: 'Submit this resetToken and newPassword to POST /api/auth/reset-password.'
    });
  } catch (err) {
    console.error('Forgot Password Error:', err);
    res.status(500).json({ success: false, message: 'Server error during forgot-password: ' + err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: 'Reset token and newPassword are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtErr) {
      return res.status(400).json({ success: false, message: 'Invalid or expired password reset token: ' + jwtErr.message });
    }

    if (decoded.type !== 'pwd_reset') {
      return res.status(400).json({ success: false, message: 'Invalid token type for password reset.' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    const updateRes = await pool.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING id, username, email',
      [passwordHash, decoded.id]
    );

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({
      success: true,
      message: 'Password has been successfully updated. You may now log in with your new credentials.'
    });
  } catch (err) {
    console.error('Reset Password Error:', err);
    res.status(500).json({ success: false, message: 'Server error during reset-password: ' + err.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const currentToken = authHeader && authHeader.split(' ')[1];
    if (!currentToken) {
      return res.status(401).json({ success: false, message: 'Authorization token required.' });
    }

    const decoded = jwt.verify(currentToken, JWT_SECRET);
    const userRes = await pool.query('SELECT id, username, email, role, status FROM users WHERE id = $1', [decoded.id]);
    if (userRes.rows.length === 0 || (userRes.rows[0].status && userRes.rows[0].status.toLowerCase() !== 'active')) {
      return res.status(403).json({ success: false, message: 'User account is invalid or suspended.' });
    }

    const user = userRes.rows[0];
    const newToken = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ success: true, token: newToken, user });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Token refresh failed: ' + err.message });
  }
};
