import pool from '../config/db.js';

// Get all relationships for logged in user
export const getRelationships = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT r.*, u.username as related_username, u.email as related_email, u.role as related_role
       FROM relationships r
       JOIN users u ON (r.related_user_id = u.id OR r.owner_user_id = u.id)
       WHERE (r.owner_user_id = $1 OR r.related_user_id = $1) AND u.id != $1`,
      [userId]
    );
    res.json({ success: true, relationships: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create a relationship (e.g. Partner, Parent, Caregiver)
export const createRelationship = async (req, res) => {
  try {
    const userId = req.user.id;
    const { relatedEmail, relationshipType } = req.body;

    if (!relatedEmail || !relationshipType) {
      return res.status(400).json({ success: false, message: 'relatedEmail and relationshipType are required.' });
    }

    // Find target user
    const targetUser = await pool.query(
      `SELECT id, username, email FROM users WHERE LOWER(email) = LOWER($1) OR LOWER(username) = LOWER($2)`,
      [relatedEmail, relatedEmail]
    );

    let targetId;
    if (targetUser.rows.length === 0) {
      // Auto create mock partner/caregiver account if demoing
      const targetUsername = relatedEmail.split('@')[0];
      const newTarget = await pool.query(
        `INSERT INTO users (username, email, password_hash, role, status)
         VALUES ($1, $2, 'demo_hash_2026', 'Caregiver', 'Active') RETURNING id`,
        [targetUsername, relatedEmail]
      );
      targetId = newTarget.rows[0].id;
    } else {
      targetId = targetUser.rows[0].id;
    }

    if (targetId === userId) {
      return res.status(400).json({ success: false, message: 'Cannot add yourself as a related user.' });
    }

    const relResult = await pool.query(
      `INSERT INTO relationships (owner_user_id, related_user_id, relationship_type, status)
       VALUES ($1, $2, $3, 'Active') RETURNING *`,
      [userId, targetId, relationshipType]
    );

    res.status(201).json({ success: true, relationship: relResult.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Remove/Revoke a relationship
export const deleteRelationship = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await pool.query(
      `DELETE FROM relationships WHERE id = $1 AND (owner_user_id = $2 OR related_user_id = $2)`,
      [id, userId]
    );

    res.json({ success: true, message: 'Relationship removed successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get consents granted by user or granted to user
export const getConsents = async (req, res) => {
  try {
    const userId = req.user.id;
    const consentsRes = await pool.query(
      `SELECT c.*, u.username as related_username, u.email as related_email
       FROM consents c
       JOIN users u ON c.related_user_id = u.id
       WHERE c.owner_user_id = $1`,
      [userId]
    );

    // Fetch permissions for each consent
    const consentsWithPermissions = await Promise.all(
      consentsRes.rows.map(async (consent) => {
        const perms = await pool.query(`SELECT * FROM permissions WHERE consent_id = $1`, [consent.id]);
        return { ...consent, permissions: perms.rows };
      })
    );

    res.json({ success: true, consents: consentsWithPermissions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Grant or update consent with granular permissions
export const grantConsent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { relatedUserId, consentType, permissions } = req.body;

    if (!relatedUserId || !consentType) {
      return res.status(400).json({ success: false, message: 'relatedUserId and consentType are required.' });
    }

    // Insert consent
    const consentRes = await pool.query(
      `INSERT INTO consents (owner_user_id, related_user_id, consent_type, status)
       VALUES ($1, $2, $3, 'Granted') RETURNING *`,
      [userId, relatedUserId, consentType]
    );

    const consentId = consentRes.rows[0].id;

    // Default permissions list
    const defaultResources = ['Wellbeing', 'Appointments', 'PregnancyUpdates'];
    const selectedResources = Array.isArray(permissions) ? permissions : defaultResources;

    for (const resource of selectedResources) {
      await pool.query(
        `INSERT INTO permissions (consent_id, resource, action, allowed)
         VALUES ($1, $2, 'Read', TRUE)`,
        [consentId, resource]
      );
    }

    // Log audit event
    await pool.query(
      `INSERT INTO audit_logs (user_id, accessor_id, resource, action, status)
       VALUES ($1, $2, 'Consent', 'GRANT_CONSENT', 'Success')`,
      [userId, relatedUserId]
    );

    res.status(201).json({ success: true, consent: consentRes.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Revoke consent instantly
export const revokeConsent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const consentQuery = await pool.query(`SELECT * FROM consents WHERE id = $1 AND owner_user_id = $2`, [id, userId]);
    if (consentQuery.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Consent record not found.' });
    }

    await pool.query(
      `UPDATE consents SET status = 'Revoked', revoked_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [id]
    );

    // Delete permissions
    await pool.query(`DELETE FROM permissions WHERE consent_id = $1`, [id]);

    // Log audit event
    await pool.query(
      `INSERT INTO audit_logs (user_id, accessor_id, resource, action, status)
       VALUES ($1, $2, 'Consent', 'REVOKE_CONSENT', 'Success')`,
      [userId, consentQuery.rows[0].related_user_id]
    );

    res.json({ success: true, message: 'Consent revoked successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET shared health data for partner mode
export const getPartnerSharedHealth = async (req, res) => {
  try {
    const partnerId = req.user.id;

    // Check if any user has granted consent to this partner
    const activeConsent = await pool.query(
      `SELECT c.*, u.username as owner_username, u.email as owner_email, p.full_name
       FROM consents c
       JOIN users u ON c.owner_user_id = u.id
       LEFT JOIN user_profiles p ON p.user_id = u.id
       WHERE c.related_user_id = $1 AND c.status = 'Granted'
       LIMIT 1`,
      [partnerId]
    );

    if (activeConsent.rows.length === 0) {
      return res.json({
        success: true,
        hasAccess: false,
        message: 'No active shared health consent granted by partner.'
      });
    }

    const consent = activeConsent.rows[0];
    const ownerId = consent.owner_user_id;

    // Fetch allowed resources
    const permsRes = await pool.query(
      `SELECT resource FROM permissions WHERE consent_id = $1 AND allowed = TRUE`,
      [consent.id]
    );
    const allowedResources = permsRes.rows.map(p => p.resource);

    // Fetch shared data based on permissions
    let sharedData = {
      partnerName: consent.full_name || consent.owner_username,
      partnerEmail: consent.owner_email,
      grantedAt: consent.granted_at,
      allowedResources
    };

    if (allowedResources.includes('Wellbeing') || allowedResources.includes('Symptoms')) {
      const trackerRes = await pool.query(
        `SELECT * FROM health_tracker WHERE user_id = $1 ORDER BY log_date DESC LIMIT 5`,
        [ownerId]
      );
      sharedData.recentVitals = trackerRes.rows;
    }

    if (allowedResources.includes('Appointments')) {
      const aptRes = await pool.query(
        `SELECT * FROM appointments WHERE patient_id = $1 ORDER BY appointment_date ASC LIMIT 3`,
        [ownerId]
      );
      sharedData.upcomingAppointments = aptRes.rows;
    }

    // Log audit log
    await pool.query(
      `INSERT INTO audit_logs (user_id, accessor_id, resource, action, status)
       VALUES ($1, $2, 'SharedHealth', 'READ_PARTNER_DATA', 'Success')`,
      [ownerId, partnerId]
    );

    res.json({
      success: true,
      hasAccess: true,
      sharedData
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET audit logs for logged in user
export const getAuditLogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT a.*, u.username as accessor_username, u.email as accessor_email
       FROM audit_logs a
       LEFT JOIN users u ON a.accessor_id = u.id
       WHERE a.user_id = $1 OR a.accessor_id = $1
       ORDER BY a.accessed_at DESC LIMIT 30`,
      [userId]
    );
    res.json({ success: true, auditLogs: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
