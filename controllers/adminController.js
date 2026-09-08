import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

// 1. System Statistics
export const getSystemStats = async (req, res) => {
  try {
    const usersCount = await pool.query('SELECT COUNT(*) FROM users');
    const doctorsCount = await pool.query("SELECT COUNT(*) FROM doctors WHERE approval_status = 'Approved'");
    const caregiversCount = await pool.query('SELECT COUNT(*) FROM caregivers');
    const recordsCount = await pool.query('SELECT COUNT(*) FROM medical_records');
    const pendingDoctors = await pool.query("SELECT COUNT(*) FROM doctors WHERE approval_status = 'Pending'");

    res.json({
      success: true,
      stats: {
        totalUsers: parseInt(usersCount.rows[0].count),
        totalDoctors: parseInt(doctorsCount.rows[0].count),
        totalCaregivers: parseInt(caregiversCount.rows[0].count),
        totalMedicalRecords: parseInt(recordsCount.rows[0].count),
        pendingDoctorApprovals: parseInt(pendingDoctors.rows[0].count)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. Doctor Management & Approval
export const approveDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Approved', 'Rejected', 'Suspended'

    const result = await pool.query(
      'UPDATE doctors SET approval_status = $1 WHERE id = $2 OR user_id = $2 RETURNING *',
      [status || 'Approved', id]
    );

    res.json({ success: true, doctor: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 3. User Management
export const getAdminUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id, 
        u.username, 
        u.email, 
        u.role, 
        u.status, 
        u.created_at,
        p.full_name,
        p.dob,
        p.blood_group,
        p.height_cm,
        p.weight_kg,
        p.emergency_contact_phone as phone
      FROM users u
      LEFT JOIN user_profiles p ON u.id = p.user_id
      ORDER BY u.id DESC
    `);
    res.json({ success: true, users: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createAdminUser = async (req, res) => {
  const client = await pool.connect();
  try {
    const { name, username, email, password, role, status } = req.body;

    await client.query('BEGIN');

    // Check unique email/username
    const existing = await client.query('SELECT id FROM users WHERE email = $1 OR username = $2', [email, username || email.split('@')[0]]);
    if (existing.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, message: 'A user with that email or username already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password || 'password123', salt);
    const userRole = role || 'Myself';
    const userStatus = status || 'Active';
    const finalUsername = username || email.split('@')[0];

    const userRes = await client.query(
      `INSERT INTO users (username, email, password_hash, role, status)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, role, status, created_at`,
      [finalUsername, email, passwordHash, userRole, userStatus]
    );
    const newUser = userRes.rows[0];

    await client.query(
      `INSERT INTO user_profiles (user_id, full_name) VALUES ($1, $2)`,
      [newUser.id, name || finalUsername]
    );

    // If Caregiver, create caregiver record
    if (userRole === 'Caregiver') {
      await client.query(
        `INSERT INTO caregivers (user_id, caregiver_type, emergency_phone) VALUES ($1, $2, $3)`,
        [newUser.id, 'Parent', '+1 (555) 000-0000']
      );
    } else if (userRole === 'Doctor') {
      await client.query(
        `INSERT INTO doctors (user_id, license_number, specialization, hospital_clinic, approval_status)
         VALUES ($1, $2, $3, $4, $5)`,
        [newUser.id, `MD-${Date.now()}`, 'General Medicine', 'FemSphere Clinic', 'Approved']
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      user: {
        ...newUser,
        full_name: name || finalUsername
      }
    });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ success: false, message: err.message });
  } finally {
    client.release();
  }
};

export const deleteAdminUser = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ success: true, message: 'User deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Active', 'Inactive', 'Suspended'

    const result = await pool.query(
      'UPDATE users SET status = $1 WHERE id = $2 RETURNING id, username, email, role, status',
      [status || 'Active', id]
    );

    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 4. Caregiver Management
export const getAdminCaregivers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.id, 
        c.user_id,
        c.caregiver_type,
        c.organization_name,
        c.emergency_phone,
        c.created_at,
        u.email,
        u.username,
        u.status,
        p.full_name,
        COUNT(d.id)::int as dependents_count
      FROM caregivers c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN user_profiles p ON u.id = p.user_id
      LEFT JOIN dependents d ON d.caregiver_id = c.id
      GROUP BY c.id, c.user_id, c.caregiver_type, c.organization_name, c.emergency_phone, c.created_at, u.email, u.username, u.status, p.full_name
      ORDER BY c.id DESC
    `);
    res.json({ success: true, caregivers: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createAdminCaregiver = async (req, res) => {
  const client = await pool.connect();
  try {
    const { name, email, relation, phone } = req.body;
    await client.query('BEGIN');

    // Create user if doesn't exist
    let userRes = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    let userId;

    if (userRes.rows.length === 0) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('password123', salt);
      const username = email.split('@')[0] + Math.floor(Math.random() * 1000);
      const insUser = await client.query(
        `INSERT INTO users (username, email, password_hash, role, status)
         VALUES ($1, $2, $3, 'Caregiver', 'Active') RETURNING id`,
        [username, email, hash]
      );
      userId = insUser.rows[0].id;
      await client.query(
        `INSERT INTO user_profiles (user_id, full_name, emergency_contact_phone) VALUES ($1, $2, $3)`,
        [userId, name, phone]
      );
    } else {
      userId = userRes.rows[0].id;
    }

    const insCg = await client.query(
      `INSERT INTO caregivers (user_id, caregiver_type, emergency_phone)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id) DO UPDATE SET caregiver_type = EXCLUDED.caregiver_type, emergency_phone = EXCLUDED.emergency_phone
       RETURNING *`,
      [userId, relation || 'Parent', phone || '+1 (555) 000-0000']
    );

    await client.query('COMMIT');
    res.status(201).json({ success: true, caregiver: insCg.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ success: false, message: err.message });
  } finally {
    client.release();
  }
};

export const deleteAdminCaregiver = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM caregivers WHERE id = $1', [id]);
    res.json({ success: true, message: 'Caregiver deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 5. Health Articles Management
export const getHealthArticles = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM health_articles ORDER BY id DESC');
    res.json({ success: true, articles: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createHealthArticle = async (req, res) => {
  try {
    const { title, category, description, imageUrl, author } = req.body;
    const result = await pool.query(
      `INSERT INTO health_articles (title, category, description, image_url, author)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        title, 
        category || 'Wellness', 
        description || '', 
        imageUrl || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400',
        author || 'FemSphere Medical Board'
      ]
    );
    res.status(201).json({ success: true, article: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteHealthArticle = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM health_articles WHERE id = $1', [id]);
    res.json({ success: true, message: 'Article deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
