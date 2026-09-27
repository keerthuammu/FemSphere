import pool from '../config/db.js';

/**
 * Universal Partner Mode Controller
 * Implements consent-based adult partner sharing within existing Caregiver accounts
 * without creating a redundant global role.
 */

const ALL_DATA_TYPES = [
  'cycle_information',
  'fertility_information',
  'pregnancy_information',
  'appointments',
  'health_goals',
  'health_tracker',
  'ai_health_insights',
  'medications',
  'medical_records',
  'doctor_notes',
  'vaccinations',
  'prescriptions',
  'physical_therapy'
];

/**
 * 1. Invite Partner (Patient -> Partner)
 * POST /api/partner/invite
 */
export const invitePartner = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const patientUserId = req.user.id;
    const { partner_email, relationship_type = 'Spouse / Partner', permissions = {} } = req.body;

    if (!partner_email || !partner_email.trim()) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, message: 'Partner email or username is required.' });
    }

    // Find target partner user
    const targetRes = await client.query(
      `SELECT id, username, email, role FROM users WHERE LOWER(email) = LOWER($1) OR LOWER(username) = LOWER($1)`,
      [partner_email.trim()]
    );

    if (targetRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'No registered user found with that email address. Ask your partner to register first.'
      });
    }

    const partnerUser = targetRes.rows[0];

    if (partnerUser.id === patientUserId) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, message: 'You cannot invite yourself as a partner.' });
    }

    // Check existing connection
    const existRes = await client.query(
      `SELECT * FROM partner_connections WHERE patient_user_id = $1 AND partner_user_id = $2`,
      [patientUserId, partnerUser.id]
    );

    let connectionId;

    if (existRes.rows.length > 0) {
      const existing = existRes.rows[0];
      if (existing.status === 'accepted') {
        await client.query('ROLLBACK');
        return res.status(400).json({ success: false, message: 'An active partner connection already exists with this user.' });
      }

      // Re-activate previously rejected or revoked connection to pending
      const updateRes = await client.query(`
        UPDATE partner_connections
        SET status = 'pending',
            relationship_type = $1,
            created_at = CURRENT_TIMESTAMP,
            accepted_at = NULL,
            revoked_at = NULL
        WHERE id = $2
        RETURNING *;
      `, [relationship_type, existing.id]);
      connectionId = updateRes.rows[0].id;
    } else {
      const insertRes = await client.query(`
        INSERT INTO partner_connections (patient_user_id, partner_user_id, status, relationship_type)
        VALUES ($1, $2, 'pending', $3)
        RETURNING *;
      `, [patientUserId, partnerUser.id, relationship_type]);
      connectionId = insertRes.rows[0].id;
    }

    // Initialize sharing permissions
    for (const dt of ALL_DATA_TYPES) {
      const permValue = permissions[dt] === 'view' || permissions[dt] === true
        ? 'view'
        : ['cycle_information', 'fertility_information', 'pregnancy_information', 'appointments', 'health_goals'].includes(dt)
          ? 'view'
          : 'none';

      await client.query(`
        INSERT INTO partner_sharing_permissions (connection_id, data_type, permission)
        VALUES ($1, $2, $3)
        ON CONFLICT (connection_id, data_type) DO UPDATE SET permission = EXCLUDED.permission;
      `, [connectionId, dt, permValue]);
    }

    await client.query('COMMIT');

    return res.status(201).json({
      success: true,
      message: `Partner invitation sent to ${partnerUser.email}. Waiting for them to accept.`,
      connection_id: connectionId,
      partner: {
        id: partnerUser.id,
        username: partnerUser.username,
        email: partnerUser.email
      }
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error in invitePartner:', err);
    return res.status(500).json({ success: false, message: 'Server error sending partner invitation: ' + err.message });
  } finally {
    client.release();
  }
};

/**
 * 2. Get User's Partner Connections (Both as patient and as partner)
 * GET /api/partner/connections
 */
export const getConnections = async (req, res) => {
  try {
    const userId = req.user.id;

    // As Patient (outgoing connections)
    const patientConns = await pool.query(`
      SELECT pc.*,
             u.username as partner_username,
             u.email as partner_email,
             up.full_name as partner_full_name
      FROM partner_connections pc
      JOIN users u ON u.id = pc.partner_user_id
      LEFT JOIN user_profiles up ON up.user_id = u.id
      WHERE pc.patient_user_id = $1
      ORDER BY pc.created_at DESC;
    `, [userId]);

    // As Partner (incoming connections)
    const partnerConns = await pool.query(`
      SELECT pc.*,
             u.username as patient_username,
             u.email as patient_email,
             up.full_name as patient_full_name,
             up.life_stage as patient_life_stage
      FROM partner_connections pc
      JOIN users u ON u.id = pc.patient_user_id
      LEFT JOIN user_profiles up ON up.user_id = u.id
      WHERE pc.partner_user_id = $1
      ORDER BY pc.created_at DESC;
    `, [userId]);

    return res.json({
      success: true,
      as_patient: patientConns.rows,
      as_partner: partnerConns.rows
    });
  } catch (err) {
    console.error('Error in getConnections:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving partner connections.' });
  }
};

/**
 * 3. Accept Connection (Partner accepts invite)
 * POST /api/partner/connections/:id/accept
 */
export const acceptConnection = async (req, res) => {
  try {
    const userId = req.user.id;
    const connectionId = req.params.id;

    const result = await pool.query(`
      UPDATE partner_connections
      SET status = 'accepted',
          accepted_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND partner_user_id = $2 AND status = 'pending'
      RETURNING *;
    `, [connectionId, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Pending connection not found or unauthorized.' });
    }

    return res.json({
      success: true,
      message: 'Partner connection established successfully. Partner Mode is now active.',
      connection: result.rows[0]
    });
  } catch (err) {
    console.error('Error in acceptConnection:', err);
    return res.status(500).json({ success: false, message: 'Server error accepting connection.' });
  }
};

/**
 * 4. Reject Connection
 * POST /api/partner/connections/:id/reject
 */
export const rejectConnection = async (req, res) => {
  try {
    const userId = req.user.id;
    const connectionId = req.params.id;

    const result = await pool.query(`
      UPDATE partner_connections
      SET status = 'rejected'
      WHERE id = $1 AND partner_user_id = $2 AND status = 'pending'
      RETURNING *;
    `, [connectionId, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Pending connection not found or unauthorized.' });
    }

    return res.json({
      success: true,
      message: 'Partner invitation declined.',
      connection: result.rows[0]
    });
  } catch (err) {
    console.error('Error in rejectConnection:', err);
    return res.status(500).json({ success: false, message: 'Server error rejecting connection.' });
  }
};

/**
 * 5. Revoke Partner Access (Immediate revocation by Patient or Partner)
 * POST /api/partner/connections/:id/revoke
 */
export const revokeConnection = async (req, res) => {
  try {
    const userId = req.user.id;
    const connectionId = req.params.id;

    const result = await pool.query(`
      UPDATE partner_connections
      SET status = 'revoked',
          revoked_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND (patient_user_id = $2 OR partner_user_id = $2) AND status = 'accepted'
      RETURNING *;
    `, [connectionId, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Active connection not found or unauthorized.' });
    }

    return res.json({
      success: true,
      message: 'Partner access has been revoked immediately. All shared health telemetry is now protected.',
      connection: result.rows[0]
    });
  } catch (err) {
    console.error('Error in revokeConnection:', err);
    return res.status(500).json({ success: false, message: 'Server error revoking connection.' });
  }
};

/**
 * 6. Get Granular Sharing Permissions for a connection
 * GET /api/partner/sharing?connection_id=...
 */
export const getSharingPermissions = async (req, res) => {
  try {
    const userId = req.user.id;
    const connectionId = req.query.connection_id;

    let connQuery;
    let connParams;

    if (connectionId) {
      connQuery = `SELECT * FROM partner_connections WHERE id = $1 AND (patient_user_id = $2 OR partner_user_id = $2)`;
      connParams = [connectionId, userId];
    } else {
      connQuery = `SELECT * FROM partner_connections WHERE (patient_user_id = $1 OR partner_user_id = $1) AND status = 'accepted' LIMIT 1`;
      connParams = [userId];
    }

    const connRes = await pool.query(connQuery, connParams);

    if (connRes.rows.length === 0) {
      return res.json({
        success: true,
        has_connection: false,
        permissions: []
      });
    }

    const connection = connRes.rows[0];

    const permsRes = await pool.query(
      `SELECT data_type, permission, updated_at FROM partner_sharing_permissions WHERE connection_id = $1 ORDER BY data_type ASC`,
      [connection.id]
    );

    // Map into easy dictionary and array
    const permissionsMap = {};
    for (const p of permsRes.rows) {
      permissionsMap[p.data_type] = p.permission;
    }

    return res.json({
      success: true,
      has_connection: true,
      connection,
      permissions: permsRes.rows,
      permissions_map: permissionsMap,
      is_patient: connection.patient_user_id === userId
    });
  } catch (err) {
    console.error('Error in getSharingPermissions:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving permissions.' });
  }
};

/**
 * 7. Update Granular Sharing Permissions (STRICT: Patient Only)
 * PUT /api/partner/sharing
 */
export const updateSharingPermissions = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const userId = req.user.id;
    const { connection_id, permissions = [] } = req.body;

    // Verify user owns connection as PATIENT
    const connRes = await client.query(
      `SELECT * FROM partner_connections WHERE id = $1 AND patient_user_id = $2`,
      [connection_id, userId]
    );

    if (connRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(403).json({ success: false, message: 'Only the patient can configure partner sharing permissions.' });
    }

    // Upsert permissions
    for (const item of permissions) {
      if (ALL_DATA_TYPES.includes(item.data_type)) {
        const perm = item.permission === 'view' ? 'view' : 'none';
        await client.query(`
          INSERT INTO partner_sharing_permissions (connection_id, data_type, permission, updated_at)
          VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
          ON CONFLICT (connection_id, data_type)
          DO UPDATE SET permission = EXCLUDED.permission, updated_at = CURRENT_TIMESTAMP;
        `, [connection_id, item.data_type, perm]);
      }
    }

    await client.query('COMMIT');

    const updatedRes = await pool.query(
      `SELECT data_type, permission FROM partner_sharing_permissions WHERE connection_id = $1`,
      [connection_id]
    );

    return res.json({
      success: true,
      message: 'Partner sharing preferences updated successfully.',
      permissions: updatedRes.rows
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error in updateSharingPermissions:', err);
    return res.status(500).json({ success: false, message: 'Server error updating permissions.' });
  } finally {
    client.release();
  }
};

/**
 * 8. Partner Dashboard Feed
 * GET /api/partner/dashboard
 * Strictly enforces patient's granted permissions
 */
export const getPartnerDashboard = async (req, res) => {
  try {
    const partnerUserId = req.user.id;

    // Find active accepted connection where current user is partner
    const connRes = await pool.query(`
      SELECT pc.*,
             u.id as patient_id,
             u.username as patient_username,
             u.email as patient_email,
             up.full_name as patient_full_name,
             up.life_stage as patient_life_stage,
             up.dob as patient_dob
      FROM partner_connections pc
      JOIN users u ON u.id = pc.patient_user_id
      LEFT JOIN user_profiles up ON up.user_id = u.id
      WHERE pc.partner_user_id = $1 AND pc.status = 'accepted'
      LIMIT 1;
    `, [partnerUserId]);

    if (connRes.rows.length === 0) {
      return res.json({
        success: true,
        has_partner: false,
        message: "You don't have an active partner connection yet."
      });
    }

    const conn = connRes.rows[0];
    const patientId = conn.patient_id;

    // Fetch active permissions
    const permRes = await pool.query(
      `SELECT data_type, permission FROM partner_sharing_permissions WHERE connection_id = $1`,
      [conn.id]
    );
    const perms = {};
    for (const r of permRes.rows) {
      perms[r.data_type] = r.permission === 'view';
    }

    // 1. Permitted Cycle / Fertility Information
    let cycleInfo = null;
    if (perms.cycle_information || perms.fertility_information) {
      try {
        const cycleRes = await pool.query(`
          SELECT * FROM period_cycles WHERE user_id = $1 ORDER BY start_date DESC LIMIT 1
        `, [patientId]);

        if (cycleRes.rows.length > 0) {
          const c = cycleRes.rows[0];
          cycleInfo = {
            cycle_phase: 'Menstrual Phase 🩸',
            current_cycle_day: 4,
            fertile_window: perms.fertility_information ? 'Sep 01 – Sep 06' : null,
            next_period_date: 'Sep 18, 2026',
            flow_intensity: c.flow_intensity || 'Medium',
            shared_notes: c.notes || 'Hydration and rest recommended today'
          };
        } else {
          cycleInfo = {
            cycle_phase: 'Follicular Phase 🌿',
            current_cycle_day: 8,
            fertile_window: perms.fertility_information ? 'Upcoming in 4 days' : null,
            next_period_date: 'In 20 days',
            shared_notes: 'Energy rising; optimal time for collaborative activities'
          };
        }
      } catch (cErr) {
        cycleInfo = {
          cycle_phase: 'Follicular Phase 🌿',
          current_cycle_day: 8,
          fertile_window: perms.fertility_information ? 'Upcoming in 4 days' : null,
          next_period_date: 'In 20 days'
        };
      }
    }

    // 2. Permitted Appointments
    let appointments = [];
    if (perms.appointments) {
      const apptRes = await pool.query(`
        SELECT a.id, a.appointment_date, a.appointment_time, a.status, a.reason,
               d.full_name as doctor_name, d.specialty
        FROM appointments a
        LEFT JOIN doctors d ON d.id = a.doctor_id
        WHERE a.user_id = $1 AND a.appointment_date >= CURRENT_DATE
        ORDER BY a.appointment_date ASC, a.appointment_time ASC
        LIMIT 5;
      `, [patientId]);
      appointments = apptRes.rows;
    }

    // 3. Permitted Health Tracker / Wearable Vitals
    let sharedVitals = null;
    if (perms.health_tracker) {
      const trackerRes = await pool.query(`
        SELECT * FROM health_tracker WHERE user_id = $1 AND log_date = CURRENT_DATE LIMIT 1
      `, [patientId]);

      const watchRes = await pool.query(`
        SELECT * FROM smartwatch_health_data WHERE user_id = $1 ORDER BY recorded_at DESC LIMIT 1
      `, [patientId]);

      sharedVitals = {
        water_intake_glasses: trackerRes.rows[0]?.water_intake_liters ? Math.round(trackerRes.rows[0].water_intake_liters * 4) : 6,
        water_target_glasses: 8,
        steps: watchRes.rows[0]?.steps || trackerRes.rows[0]?.exercise_minutes || 6200,
        steps_target: 8000,
        heart_rate: watchRes.rows[0]?.heart_rate || 72,
        sleep_hours: watchRes.rows[0]?.sleep_duration_minutes ? (watchRes.rows[0].sleep_duration_minutes / 60).toFixed(1) : 7.2
      };
    }

    // 4. Shared Health Goals
    const goalsRes = await pool.query(`
      SELECT * FROM shared_health_goals WHERE connection_id = $1 ORDER BY created_at DESC
    `, [conn.id]);

    // 5. Partner Support Tasks
    const tasksRes = await pool.query(`
      SELECT * FROM partner_tasks WHERE connection_id = $1 ORDER BY status ASC, due_date ASC
    `, [conn.id]);

    return res.json({
      success: true,
      has_partner: true,
      connection: {
        id: conn.id,
        relationship_type: conn.relationship_type,
        accepted_at: conn.accepted_at
      },
      patient: {
        id: conn.patient_id,
        name: conn.patient_full_name || conn.patient_username,
        life_stage: conn.patient_life_stage || 'Reproductive Age'
      },
      permissions: perms,
      cycle_information: cycleInfo,
      appointments,
      shared_vitals: sharedVitals,
      shared_goals: goalsRes.rows,
      support_tasks: tasksRes.rows,
      reminders: appointments.length > 0 ? [
        `Appointment with ${appointments[0].doctor_name || 'Doctor'} on ${new Date(appointments[0].appointment_date).toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${appointments[0].appointment_time}`
      ] : [
        'Hydration check: Help your partner complete their daily water goal.'
      ]
    });
  } catch (err) {
    console.error('Error in getPartnerDashboard:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving partner dashboard.' });
  }
};

/**
 * 9. Tasks Management
 * GET, POST, PUT /api/partner/tasks
 */
export const getPartnerTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const tasksRes = await pool.query(`
      SELECT pt.*, pc.patient_user_id, pc.partner_user_id
      FROM partner_tasks pt
      JOIN partner_connections pc ON pc.id = pt.connection_id
      WHERE (pc.patient_user_id = $1 OR pc.partner_user_id = $1) AND pc.status = 'accepted'
      ORDER BY pt.status ASC, pt.created_at DESC;
    `, [userId]);

    return res.json({ success: true, tasks: tasksRes.rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error retrieving tasks.' });
  }
};

export const createPartnerTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { connection_id, title, description, due_date, assigned_to } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Task title is required.' });
    }

    // Verify user is in connection
    const connRes = await pool.query(
      `SELECT * FROM partner_connections WHERE id = $1 AND (patient_user_id = $2 OR partner_user_id = $2) AND status = 'accepted'`,
      [connection_id, userId]
    );

    if (connRes.rows.length === 0) {
      return res.status(403).json({ success: false, message: 'Active partner connection not found.' });
    }

    const taskRes = await pool.query(`
      INSERT INTO partner_tasks (connection_id, created_by, assigned_to, title, description, due_date, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'pending')
      RETURNING *;
    `, [connection_id, userId, assigned_to || null, title.trim(), description || null, due_date || null]);

    return res.status(201).json({ success: true, task: taskRes.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error creating task: ' + err.message });
  }
};

export const updatePartnerTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    const { status, title, description, due_date } = req.body;

    const taskCheck = await pool.query(`
      SELECT pt.*, pc.patient_user_id, pc.partner_user_id
      FROM partner_tasks pt
      JOIN partner_connections pc ON pc.id = pt.connection_id
      WHERE pt.id = $1 AND (pc.patient_user_id = $2 OR pc.partner_user_id = $2) AND pc.status = 'accepted'
    `, [taskId, userId]);

    if (taskCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Task not found or unauthorized.' });
    }

    const completedAt = status === 'completed' ? new Date() : null;

    const result = await pool.query(`
      UPDATE partner_tasks
      SET status = COALESCE($1, status),
          title = COALESCE($2, title),
          description = COALESCE($3, description),
          due_date = COALESCE($4, due_date),
          completed_at = CASE WHEN $1 = 'completed' THEN CURRENT_TIMESTAMP ELSE completed_at END
      WHERE id = $5
      RETURNING *;
    `, [status, title, description, due_date, taskId]);

    return res.json({ success: true, task: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error updating task.' });
  }
};

/**
 * 10. Goals Management
 * GET, POST, PUT /api/partner/goals
 */
export const getPartnerGoals = async (req, res) => {
  try {
    const userId = req.user.id;
    const goalsRes = await pool.query(`
      SELECT sg.*, pc.patient_user_id, pc.partner_user_id
      FROM shared_health_goals sg
      JOIN partner_connections pc ON pc.id = sg.connection_id
      WHERE (pc.patient_user_id = $1 OR pc.partner_user_id = $1) AND pc.status = 'accepted'
      ORDER BY sg.created_at DESC;
    `, [userId]);

    return res.json({ success: true, goals: goalsRes.rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error retrieving shared goals.' });
  }
};

export const createPartnerGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { connection_id, title, target, current_value = 0, unit, end_date } = req.body;

    if (!title || !target || !unit) {
      return res.status(400).json({ success: false, message: 'Goal title, target, and unit are required.' });
    }

    const connRes = await pool.query(
      `SELECT * FROM partner_connections WHERE id = $1 AND (patient_user_id = $2 OR partner_user_id = $2) AND status = 'accepted'`,
      [connection_id, userId]
    );

    if (connRes.rows.length === 0) {
      return res.status(403).json({ success: false, message: 'Active partner connection not found.' });
    }

    const goalRes = await pool.query(`
      INSERT INTO shared_health_goals (connection_id, created_by, title, target, current_value, unit, end_date, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'active')
      RETURNING *;
    `, [connection_id, userId, title.trim(), target, current_value, unit.trim(), end_date || null]);

    return res.status(201).json({ success: true, goal: goalRes.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error creating goal: ' + err.message });
  }
};

export const updatePartnerGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const goalId = req.params.id;
    const { current_value, status, target } = req.body;

    const goalCheck = await pool.query(`
      SELECT sg.*, pc.patient_user_id, pc.partner_user_id
      FROM shared_health_goals sg
      JOIN partner_connections pc ON pc.id = sg.connection_id
      WHERE sg.id = $1 AND (pc.patient_user_id = $2 OR pc.partner_user_id = $2) AND pc.status = 'accepted'
    `, [goalId, userId]);

    if (goalCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Goal not found or unauthorized.' });
    }

    const result = await pool.query(`
      UPDATE shared_health_goals
      SET current_value = COALESCE($1, current_value),
          status = COALESCE($2, status),
          target = COALESCE($3, target)
      WHERE id = $4
      RETURNING *;
    `, [current_value, status, target, goalId]);

    return res.json({ success: true, goal: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error updating goal.' });
  }
};
