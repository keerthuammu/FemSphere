import pool from '../config/db.js';
import dotenv from 'dotenv';
dotenv.config();

export async function generateAIHealthTwinInsights(userId) {
  try {
    // 1. Gather user profile, life stage, symptoms, vitals, & documents
    const userRes = await pool.query(
      `SELECT u.id, u.username, u.email, u.role, p.full_name, p.life_stage, p.dob, p.blood_group, p.wearable_device
       FROM users u
       LEFT JOIN user_profiles p ON p.user_id = u.id
       WHERE u.id = $1`,
      [userId]
    );

    const user = userRes.rows[0] || { username: 'User' };

    const trackerRes = await pool.query(
      `SELECT log_date, weight_kg, sleep_hours, exercise_minutes, water_intake_liters
       FROM health_tracker WHERE user_id = $1 ORDER BY log_date DESC LIMIT 14`,
      [userId]
    );

    const symptomsRes = await pool.query(
      `SELECT symptom_name, severity, onset_date, notes
       FROM symptoms WHERE user_id = $1 ORDER BY onset_date DESC LIMIT 10`,
      [userId]
    );

    const activeLifeStageRes = await pool.query(
      `SELECT uls.life_stage_code, ls.name as stage_name
       FROM user_life_stages uls
       JOIN life_stages ls ON uls.life_stage_code = ls.code
       WHERE uls.user_id = $1 AND uls.is_current = TRUE LIMIT 1`,
      [userId]
    );

    const stageName = activeLifeStageRes.rows[0]?.stage_name || user.life_stage || 'Reproductive Age';
    const recentSymptoms = symptomsRes.rows;
    const recentTracker = trackerRes.rows;

    // Pattern Analysis Rules Engine (Non-causal phrasing)
    const insights = [];

    // Daily Insight
    if (recentTracker.length > 0) {
      const latest = recentTracker[0];
      const avgSleep = recentTracker.reduce((acc, curr) => acc + parseFloat(curr.sleep_hours || 0), 0) / recentTracker.length;

      let dailyText = `Your records show that sleep duration was ${latest.sleep_hours || 7} hours, compared to your 14-day average of ${avgSleep.toFixed(1)} hours.`;
      if (parseFloat(latest.sleep_hours) < 6) {
        dailyText += ` A pattern appears where lower sleep coincides with increased daytime fatigue. Consider discussing energy management with your doctor.`;
      } else {
        dailyText += ` Consistent sleep patterns support overall wellbeing and hormonal rhythm.`;
      }

      insights.push({
        type: 'DAILY',
        title: `Daily Vitals & Sleep Analysis (${stageName})`,
        content: dailyText,
        severity: parseFloat(latest.sleep_hours) < 6 ? 'Informational' : 'Normal'
      });
    } else {
      insights.push({
        type: 'DAILY',
        title: `Daily Health Twin Setup`,
        content: `Your records show no recent daily tracker entries. Log your sleep, water intake, and symptoms to unlock AI pattern detection.`,
        severity: 'Normal'
      });
    }

    // Weekly Symptom & Life-Stage Correlation Insight
    if (recentSymptoms.length > 0) {
      const symptomList = recentSymptoms.map(s => s.symptom_name).join(', ');
      insights.push({
        type: 'WEEKLY',
        title: `Weekly Pattern Correlation (${stageName})`,
        content: `Your records show ${recentSymptoms.length} logged symptoms over recent weeks (${symptomList}). In the ${stageName} phase, these observations appear associated with phase transition shifts.`,
        severity: 'Notice'
      });
    } else {
      insights.push({
        type: 'WEEKLY',
        title: `Weekly Wellness Rhythm`,
        content: `Your records show stable health indicators over the past week with no severe symptom alerts recorded.`,
        severity: 'Normal'
      });
    }

    // Doctor Preparation Summary Insight
    const docPrepText = `Doctor Consultation Summary for ${user.full_name || user.username}:
- Active Life Stage: ${stageName}
- Recent Symptoms Logged: ${recentSymptoms.map(s => `${s.symptom_name} (${s.severity})`).join('; ') || 'None reported'}
- Average Sleep: ${recentTracker.length > 0 ? (recentTracker.reduce((a,c)=>a+parseFloat(c.sleep_hours||0),0)/recentTracker.length).toFixed(1) + ' hrs' : 'N/A'}
- Wearable Device: ${user.wearable_device || 'Apple Watch'}
- Key Questions to Ask: "How do these recorded symptom trends align with my current ${stageName} wellness goals?"`;

    insights.push({
      type: 'DOCTOR_PREP',
      title: `Doctor Appointment Preparation Export`,
      content: docPrepText,
      severity: 'Informational'
    });

    // Save insights into ai_insights table
    for (const item of insights) {
      await pool.query(
        `INSERT INTO ai_insights (user_id, insight_type, title, content, severity)
         VALUES ($1, $2, $3, $4, $5)`,
        [userId, item.type, item.title, item.content, item.severity]
      );
    }

    return insights;
  } catch (err) {
    console.error('AI Twin Generation Error:', err);
    throw err;
  }
}
