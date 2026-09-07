import pool from '../config/db.js';

// Get all reference life stages
export const getAllLifeStages = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM life_stages ORDER BY id ASC');
    res.json({ success: true, lifeStages: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get user's current life stage
export const getUserLifeStage = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentStageQuery = await pool.query(
      `SELECT uls.*, ls.name, ls.description, ls.min_age, ls.max_age
       FROM user_life_stages uls
       JOIN life_stages ls ON uls.life_stage_code = ls.code
       WHERE uls.user_id = $1 AND uls.is_current = TRUE
       LIMIT 1`,
      [userId]
    );

    if (currentStageQuery.rows.length > 0) {
      return res.json({ success: true, currentStage: currentStageQuery.rows[0] });
    }

    // Auto-suggest stage based on user DOB or profile if available
    const userProfileQuery = await pool.query(
      `SELECT dob, life_stage FROM user_profiles WHERE user_id = $1`,
      [userId]
    );

    let suggestedCode = 'REPRODUCTIVE_AGE';
    if (userProfileQuery.rows.length > 0 && userProfileQuery.rows[0].dob) {
      const dob = new Date(userProfileQuery.rows[0].dob);
      const age = new Date().getFullYear() - dob.getFullYear();

      if (age <= 5) suggestedCode = 'EARLY_CHILDHOOD';
      else if (age <= 10) suggestedCode = 'PRE_PUBERTY';
      else if (age <= 13) suggestedCode = 'PUBERTY';
      else if (age <= 17) suggestedCode = 'MENSTRUATING_ADOLESCENT';
      else if (age <= 24) suggestedCode = 'YOUNG_ADULT';
      else if (age <= 39) suggestedCode = 'REPRODUCTIVE_AGE';
      else if (age <= 54) suggestedCode = 'PERIMENOPAUSE';
      else if (age <= 64) suggestedCode = 'MENOPAUSE';
      else suggestedCode = 'OLDER_ADULT';
    }

    const lsRef = await pool.query(`SELECT * FROM life_stages WHERE code = $1`, [suggestedCode]);
    res.json({
      success: true,
      currentStage: {
        user_id: userId,
        life_stage_code: suggestedCode,
        is_current: true,
        manually_set: false,
        name: lsRef.rows[0]?.name || 'Reproductive Age',
        description: lsRef.rows[0]?.description || '',
        enabled_modules: ['General Health', 'Cycle & Periods', 'Personal Insights']
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Set or update user's active life stage
export const setUserLifeStage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { lifeStageCode, enabledModules, isManual } = req.body;

    if (!lifeStageCode) {
      return res.status(400).json({ success: false, message: 'lifeStageCode is required.' });
    }

    // Verify stage exists
    const lsCheck = await pool.query(`SELECT code FROM life_stages WHERE code = $1`, [lifeStageCode]);
    if (lsCheck.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid lifeStageCode.' });
    }

    // Mark previous active stage as not current
    await pool.query(`UPDATE user_life_stages SET is_current = FALSE WHERE user_id = $1`, [userId]);

    // Insert new active stage
    const insertRes = await pool.query(
      `INSERT INTO user_life_stages (user_id, life_stage_code, is_current, manually_set, enabled_modules)
       VALUES ($1, $2, TRUE, $3, $4)
       RETURNING *`,
      [userId, lifeStageCode, isManual !== false, JSON.stringify(enabledModules || [])]
    );

    // Update user_profiles life_stage string as well
    const lsInfo = await pool.query(`SELECT name FROM life_stages WHERE code = $1`, [lifeStageCode]);
    if (lsInfo.rows.length > 0) {
      await pool.query(`UPDATE user_profiles SET life_stage = $1 WHERE user_id = $2`, [lsInfo.rows[0].name, userId]);
    }

    res.json({
      success: true,
      message: 'Life stage updated successfully.',
      currentStage: {
        ...insertRes.rows[0],
        name: lsInfo.rows[0]?.name
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
