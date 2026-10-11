import pool from '../config/db.js';
import { determineBiologicalLifeStage, calculateAgeFromDob } from '../services/lifeStageService.js';

// Get all reference life stages
export const getAllLifeStages = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM life_stages ORDER BY id ASC');
    res.json({ success: true, lifeStages: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get user's dynamic biological life stage (derived from DOB, age, menarche onset, and pregnancy)
export const getUserLifeStage = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user profile (dob, menarche_started)
    const profileRes = await pool.query(
      `SELECT dob, menarche_started, full_name, life_stage FROM user_profiles WHERE user_id = $1`,
      [userId]
    );

    // Fetch period settings (pregnancy state)
    const settingsRes = await pool.query(
      `SELECT is_pregnant, pregnancy_start_date FROM period_settings WHERE user_id = $1`,
      [userId]
    );

    const profile = profileRes.rows[0] || {};
    const periodSettings = settingsRes.rows[0] || {};

    const isPregnant = Boolean(periodSettings.is_pregnant);
    const menarcheStarted = profile.menarche_started !== false;
    const dob = profile.dob || '1998-05-15';

    // Determine biological life stage dynamically
    const stage = determineBiologicalLifeStage({
      dob,
      menarcheStarted,
      isPregnant
    });

    // Synchronize user_profiles table if stage name differs
    if (profile.life_stage !== stage.name) {
      await pool.query(
        `UPDATE user_profiles SET life_stage = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2`,
        [stage.name, userId]
      );
    }

    // Synchronize user_life_stages active record
    await pool.query(
      `UPDATE user_life_stages SET is_current = FALSE WHERE user_id = $1`,
      [userId]
    );
    await pool.query(
      `INSERT INTO user_life_stages (user_id, life_stage_code, is_current, manually_set, enabled_modules)
       VALUES ($1, $2, TRUE, FALSE, $3)`,
      [userId, stage.code, JSON.stringify(stage.enabledModules || [])]
    );

    res.json({
      success: true,
      currentStage: {
        user_id: userId,
        life_stage_code: stage.code,
        name: stage.name,
        description: stage.description,
        age: stage.age,
        dob: stage.dob,
        menarche_started: stage.menarcheStarted,
        is_pregnant: stage.isPregnant,
        is_current: true,
        manually_set: false,
        enabled_modules: stage.enabledModules
      }
    });
  } catch (err) {
    console.error('Error fetching dynamic life stage:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Set or fine-tune user's biological life stage factors (e.g., DOB or menarche onset)
export const setUserLifeStage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { dob, menarcheStarted, lifeStageCode } = req.body;

    // Fetch existing profile
    const profileRes = await pool.query(
      `SELECT dob, menarche_started FROM user_profiles WHERE user_id = $1`,
      [userId]
    );

    const effectiveDob = dob || profileRes.rows[0]?.dob || '1998-05-15';
    let effectiveMenarche = menarcheStarted !== undefined 
      ? Boolean(menarcheStarted) 
      : (profileRes.rows[0]?.menarche_started !== false);

    // If an explicit lifeStageCode was sent (e.g. from legacy UI or adolescent toggle)
    if (lifeStageCode === 'PUBERTY') {
      // User indicates puberty stage (menarche may not have started yet if young)
      effectiveMenarche = false;
    } else if (lifeStageCode === 'MENSTRUATING_ADOLESCENT') {
      effectiveMenarche = true;
    }

    // Check pregnancy state
    const settingsRes = await pool.query(
      `SELECT is_pregnant FROM period_settings WHERE user_id = $1`,
      [userId]
    );
    const isPregnant = Boolean(settingsRes.rows[0]?.is_pregnant);

    // Update user profile with calibrated biological factors
    await pool.query(
      `UPDATE user_profiles 
       SET dob = COALESCE($1, dob), 
           menarche_started = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $3`,
      [dob || null, effectiveMenarche, userId]
    );

    // Calculate dynamic stage
    const stage = determineBiologicalLifeStage({
      dob: effectiveDob,
      menarcheStarted: effectiveMenarche,
      isPregnant
    });

    await pool.query(
      `UPDATE user_profiles SET life_stage = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2`,
      [stage.name, userId]
    );

    await pool.query(
      `UPDATE user_life_stages SET is_current = FALSE WHERE user_id = $1`,
      [userId]
    );
    const insertRes = await pool.query(
      `INSERT INTO user_life_stages (user_id, life_stage_code, is_current, manually_set, enabled_modules)
       VALUES ($1, $2, TRUE, TRUE, $3)
       RETURNING *`,
      [userId, stage.code, JSON.stringify(stage.enabledModules || [])]
    );

    res.json({
      success: true,
      message: `Biological profile updated: Life stage set to ${stage.name}.`,
      currentStage: {
        ...insertRes.rows[0],
        name: stage.name,
        description: stage.description,
        age: stage.age,
        dob: stage.dob,
        menarche_started: stage.menarcheStarted,
        is_pregnant: stage.isPregnant,
        enabled_modules: stage.enabledModules
      }
    });
  } catch (err) {
    console.error('Error updating biological life stage:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
