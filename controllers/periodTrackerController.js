import pool from '../config/db.js';

// ==============================================================================
// MENSTRUAL PHASE WELLNESS AFFIRMATIONS & RANDOM HEALTHY TIPS
// ==============================================================================
const MENSTRUAL_AFFIRMATIONS = [
  "Your body is performing sacred, restorative work right now. Give yourself permission to slow down and rest.",
  "Cramps and fatigue are natural signals to nurture yourself. Honor your rhythm with kindness.",
  "Deep breathing, gentle warmth, and steady hydration help soothe uterine contractions.",
  "Resting deeply today builds vibrant hormonal vitality for your upcoming follicular rise.",
  "Every cycle is a biological renewal. Be compassionate with your emotional and physical needs today."
];

const HEALTHY_MENSTRUAL_TIPS = [
  {
    title: "Warm Ginger & Chamomile Infusion",
    category: "Herbal Nutrition",
    tip: "Sip warm chamomile or fresh ginger tea. Ginger naturally inhibits inflammatory prostaglandins (PGF2α) to ease uterine muscle spasms.",
    icon: "☕"
  },
  {
    title: "Magnesium & Cacao Muscle Relaxation",
    category: "Micronutrients",
    tip: "Enjoy 1-2 squares of 70%+ dark chocolate or a handful of pumpkin seeds. Magnesium acts as a natural smooth muscle relaxant.",
    icon: "🍫"
  },
  {
    title: "Gentle Cat-Cow & Pelvic Tilt Flows",
    category: "Movement & Therapy",
    tip: "Move through 5-8 slow Cat-Cow breaths on all fours to decompress the lumbosacral plexus and relieve pelvic congestion.",
    icon: "🧘‍♀️"
  },
  {
    title: "Localized Heat & Microcirculation",
    category: "Physical Comfort",
    tip: "Apply a warm water bottle or heating pad over your lower pelvis for 15-20 minutes. Heat vasodilation calms uterine ischemia.",
    icon: "🔥"
  },
  {
    title: "Electrolyte Warm Hydration",
    category: "Hydration",
    tip: "Drink warm water with a pinch of pink salt and lemon. Staying hydrated prevents fluid retention and menstrual headaches.",
    icon: "💧"
  },
  {
    title: "Heme & Non-Heme Iron Replenishment",
    category: "Nutrition",
    tip: "Replenish iron lost during menses with lentils, spinach, or pumpkin seeds paired with vitamin C (bell peppers, oranges) for max absorption.",
    icon: "🥗"
  },
  {
    title: "Vagus Nerve Box Breathing",
    category: "Mental Wellness",
    tip: "Inhale for 4 seconds, hold 4, exhale 4, hold 4. Stimulating the parasympathetic nervous system rapidly lowers pain sensitivity.",
    icon: "🌬️"
  },
  {
    title: "Side-Sleeping with Knee Elevation",
    category: "Sleep Hygiene",
    tip: "Sleep on your side in fetal position with a pillow tucked between your knees to take tension off your abdominal wall and lower spine.",
    icon: "🛌"
  },
  {
    title: "Omega-3 Prostaglandin Balancer",
    category: "Anti-Inflammatory",
    tip: "Add crushed flaxseeds, chia seeds, or walnuts to your warm oatmeal to increase EPA/DHA and suppress cramping eicosanoids.",
    icon: "🌰"
  }
];

// ==============================================================================
// BIOLOGICAL PHASE CALCULATION ENGINE
// ==============================================================================
export function calculatePhaseMetrics(lastPeriodStartStr, periodDurationDays = 5, cycleLengthDays = 28, targetDate = new Date()) {
  const dateStr = lastPeriodStartStr instanceof Date 
    ? lastPeriodStartStr.toISOString().split('T')[0]
    : String(lastPeriodStartStr || '').split('T')[0];
  const start = new Date(dateStr + 'T00:00:00');
  const today = new Date(targetDate);
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);

  const diffMs = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const periodDuration = Number(periodDurationDays) || 5;
  const cycleLength = Number(cycleLengthDays) || 28;

  // Ovulation normally occurs ~14 days before the end of the cycle
  const ovulationDay = Math.max(periodDuration + 2, cycleLength - 14);

  // Next expected period start
  const nextPeriodDate = new Date(start);
  nextPeriodDate.setDate(nextPeriodDate.getDate() + cycleLength);

  // Fertile window (approx 5 days before ovulation + day of ovulation)
  const fertileStartDate = new Date(start);
  fertileStartDate.setDate(fertileStartDate.getDate() + (ovulationDay - 5));

  const fertileEndDate = new Date(start);
  fertileEndDate.setDate(fertileEndDate.getDate() + (ovulationDay + 1));

  const ovulationDate = new Date(start);
  ovulationDate.setDate(ovulationDate.getDate() + (ovulationDay - 1));

  // Determine biological phase
  let phaseCode = 'MENSTRUAL';
  let phaseName = 'Menstrual Phase';
  let phaseBadge = '🩸 Menstrual Phase';
  let phaseColor = 'rose';
  let cycleDay = 1;
  let isDelayed = false;
  let daysDelayed = 0;
  let phaseDescription = '';
  let hormonalState = '';

  if (diffDays < 0) {
    // Future date setup
    cycleDay = 1;
    phaseCode = 'MENSTRUAL';
    phaseName = 'Upcoming Cycle Setup';
    phaseBadge = '🩸 Setup';
    phaseDescription = 'Cycle start is scheduled for ' + lastPeriodStartStr;
    hormonalState = 'Baseline';
  } else if (diffDays >= cycleLength) {
    // Cycle is delayed / late
    isDelayed = true;
    daysDelayed = diffDays - cycleLength + 1;
    cycleDay = diffDays + 1;
    phaseCode = 'DELAYED';
    phaseName = 'Period Delayed / Late';
    phaseBadge = `⏳ +${daysDelayed} Day${daysDelayed > 1 ? 's' : ''} Delayed`;
    phaseColor = 'amber';
    phaseDescription = `Your period is currently ${daysDelayed} day${daysDelayed > 1 ? 's' : ''} past your expected ${cycleLength}-day cycle window. Track any PMS symptoms or log when bleeding commences.`;
    hormonalState = 'Extended Luteal / Delayed Ovulation';
  } else {
    // Within normal cycle length
    cycleDay = diffDays + 1;

    if (cycleDay <= periodDuration) {
      phaseCode = 'MENSTRUAL';
      phaseName = 'Menstrual Phase';
      phaseBadge = '🩸 Menstrual Phase (Active Flow)';
      phaseColor = 'rose';
      phaseDescription = 'Active uterine shedding. The body is in a natural reset state. Prioritize warm hydration, iron-rich nutrition, and restorative rest.';
      hormonalState = 'Low Estrogen & Progesterone';
    } else if (cycleDay <= ovulationDay - 2) {
      phaseCode = 'FOLLICULAR';
      phaseName = 'Follicular Phase';
      phaseBadge = '🌿 Follicular Phase';
      phaseColor = 'emerald';
      phaseDescription = 'Estrogen and FSH rise. Physical stamina, cognitive sharpness, and creativity peak. Ideal window for progressive strength training.';
      hormonalState = 'Rising Estrogen & FSH';
    } else if (cycleDay >= ovulationDay - 1 && cycleDay <= ovulationDay + 1) {
      phaseCode = 'OVULATORY';
      phaseName = 'Ovulation Phase';
      phaseBadge = '🌸 Ovulation Window';
      phaseColor = 'purple';
      phaseDescription = 'Luteinizing Hormone (LH) surge triggers mature egg release. Peak fertility, highest confidence, and elevated basal temperature.';
      hormonalState = 'Peak LH & Estrogen Surge';
    } else {
      phaseCode = 'LUTEAL';
      phaseName = 'Luteal Phase';
      phaseBadge = '🌙 Luteal Phase';
      phaseColor = 'indigo';
      phaseDescription = 'Progesterone peaks. Body temperature elevates slightly and metabolism speeds up. Support PMS balance with magnesium and restorative yoga.';
      hormonalState = 'High Progesterone & Secondary Estrogen Wave';
    }
  }

  // Calculate percentage of cycle completed
  const cycleProgressPercent = Math.min(100, Math.round((Math.min(diffDays + 1, cycleLength) / cycleLength) * 100));

  // All 4 biological phases breakdown
  const phasesOverview = [
    {
      id: 'MENSTRUAL',
      name: 'Menstrual Phase',
      days: `Days 1 – ${periodDuration}`,
      badge: '🩸 Reset & Rest',
      color: 'rose',
      hormone: 'Low Estrogen & Progesterone',
      feelings: 'Lower energy, cramping, introspective focus',
      foods: 'Iron-rich foods, bone broth, warm herbal infusions, magnesium',
      workouts: 'Gentle walking, restorative stretching, pelvic floor breathing',
      isActive: phaseCode === 'MENSTRUAL'
    },
    {
      id: 'FOLLICULAR',
      name: 'Follicular Phase',
      days: `Days ${periodDuration + 1} – ${ovulationDay - 2}`,
      badge: '🌿 Energy & Growth',
      color: 'emerald',
      hormone: 'Rising Estrogen & FSH',
      feelings: 'Surging energy, clear mental focus, social enthusiasm',
      foods: 'Cruciferous vegetables, fermented foods, lean proteins',
      workouts: 'Strength training, HIIT, running, power yoga',
      isActive: phaseCode === 'FOLLICULAR'
    },
    {
      id: 'OVULATORY',
      name: 'Ovulatory Phase',
      days: `Days ${ovulationDay - 1} – ${ovulationDay + 1}`,
      badge: '🌸 Peak Vitality',
      color: 'purple',
      hormone: 'LH Surge & Peak Estrogen',
      feelings: 'Highest energy, magnetic confidence, peak libido',
      foods: 'Anti-inflammatory berries, avocados, leafy greens, zinc',
      workouts: 'High intensity cardio, group fitness, heavy lifting',
      isActive: phaseCode === 'OVULATORY'
    },
    {
      id: 'LUTEAL',
      name: 'Luteal Phase',
      days: `Days ${ovulationDay + 2} – ${cycleLength}`,
      badge: '🌙 Calm & Restore',
      color: 'indigo',
      hormone: 'Progesterone Dominant',
      feelings: 'Slower tempo, craving comfort, heightened emotional sensitivity',
      foods: 'Complex carbohydrates, sweet potatoes, dark chocolate, pumpkin seeds',
      workouts: 'Pilates, moderate resistance, long nature walks, flow yoga',
      isActive: phaseCode === 'LUTEAL' || phaseCode === 'DELAYED'
    }
  ];

  return {
    cycleDay,
    cycleLength,
    periodDuration,
    lastPeriodStart: lastPeriodStartStr,
    phaseCode,
    phaseName,
    phaseBadge,
    phaseColor,
    phaseDescription,
    hormonalState,
    isDelayed,
    daysDelayed,
    cycleProgressPercent,
    nextPeriodDateStr: nextPeriodDate.toISOString().split('T')[0],
    ovulationDateStr: ovulationDate.toISOString().split('T')[0],
    fertileWindowStr: `${fertileStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${fertileEndDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
    phasesOverview
  };
}

// ==============================================================================
// 1. GET PERIOD SETTINGS & LIVE PHASE METRICS
// ==============================================================================
export const getPeriodSettings = async (req, res) => {
  try {
    const userId = req.user.id;

    const settingsRes = await pool.query(
      `SELECT * FROM period_settings WHERE user_id = $1`,
      [userId]
    );

    if (settingsRes.rows.length === 0 || !settingsRes.rows[0].is_configured) {
      return res.json({
        success: true,
        isConfigured: false,
        message: 'Period tracking is not yet configured for this user.'
      });
    }

    const row = settingsRes.rows[0];
    const lastStartStr = row.last_period_start.toISOString().split('T')[0];
    const metrics = calculatePhaseMetrics(lastStartStr, row.period_duration, row.cycle_length);

    // Fetch cycle history
    const historyRes = await pool.query(
      `SELECT * FROM period_cycles 
       WHERE user_id = $1 
       ORDER BY start_date DESC 
       LIMIT 12`,
      [userId]
    );

    // Pick a random mental wellness affirmation and shuffle healthy tips
    const affirmation = MENSTRUAL_AFFIRMATIONS[Math.floor(Math.random() * MENSTRUAL_AFFIRMATIONS.length)];
    const tips = [...HEALTHY_MENSTRUAL_TIPS].sort(() => 0.5 - Math.random());

    res.json({
      success: true,
      isConfigured: true,
      settings: {
        id: row.id,
        lastPeriodStart: lastStartStr,
        periodDuration: row.period_duration,
        cycleLength: row.cycle_length,
        isConfigured: row.is_configured,
        updatedAt: row.updated_at
      },
      metrics,
      cycleHistory: historyRes.rows.map(c => ({
        id: c.id,
        startDate: c.start_date.toISOString().split('T')[0],
        endDate: c.end_date ? c.end_date.toISOString().split('T')[0] : null,
        durationDays: c.duration_days,
        cycleLengthDays: c.cycle_length_days,
        status: c.status,
        varianceDays: c.variance_days,
        flowIntensity: c.flow_intensity,
        symptoms: c.symptoms || [],
        mood: c.mood,
        notes: c.notes,
        createdAt: c.created_at
      })),
      affirmation,
      tips
    });
  } catch (err) {
    console.error('Error fetching period settings:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==============================================================================
// 2. SETUP OR UPDATE PERIOD CYCLE SETTINGS
// ==============================================================================
export const savePeriodSetup = async (req, res) => {
  try {
    const userId = req.user.id;
    const { lastPeriodStart, periodDuration = 5, cycleLength = 28 } = req.body;

    if (!lastPeriodStart) {
      return res.status(400).json({ success: false, message: 'Please provide the start date of your last period.' });
    }

    const duration = Math.max(2, Math.min(15, parseInt(periodDuration, 10) || 5));
    const cycle = Math.max(20, Math.min(45, parseInt(cycleLength, 10) || 28));

    // Save or update period_settings
    const upsertRes = await pool.query(
      `INSERT INTO period_settings (user_id, last_period_start, period_duration, cycle_length, is_configured, updated_at)
       VALUES ($1, $2, $3, $4, TRUE, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id) 
       DO UPDATE SET 
         last_period_start = EXCLUDED.last_period_start,
         period_duration = EXCLUDED.period_duration,
         cycle_length = EXCLUDED.cycle_length,
         is_configured = TRUE,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, lastPeriodStart, duration, cycle]
    );

    // Compute metrics
    const metrics = calculatePhaseMetrics(lastPeriodStart, duration, cycle);

    // Initialize baseline cycle entry if none exists
    const existingCycle = await pool.query(
      `SELECT id FROM period_cycles WHERE user_id = $1 AND start_date = $2`,
      [userId, lastPeriodStart]
    );

    if (existingCycle.rows.length === 0) {
      const calculatedEnd = new Date(lastPeriodStart + 'T00:00:00');
      calculatedEnd.setDate(calculatedEnd.getDate() + (duration - 1));

      await pool.query(
        `INSERT INTO period_cycles (user_id, start_date, end_date, duration_days, cycle_length_days, status, variance_days, flow_intensity, symptoms, mood, notes)
         VALUES ($1, $2, $3, $4, $5, 'Baseline Setup', 0, 'Medium', '["Baseline Cycle"]'::jsonb, 'Calm', 'Initial setup cycle')`,
        [userId, lastPeriodStart, calculatedEnd.toISOString().split('T')[0], duration, cycle]
      );
    }

    res.status(200).json({
      success: true,
      message: 'Period cycle setup completed successfully.',
      settings: upsertRes.rows[0],
      metrics
    });
  } catch (err) {
    console.error('Error saving period setup:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==============================================================================
// 3. LOG NEW PERIOD CYCLE (DYNAMIC ADJUSTMENT FOR EARLY / ON TIME / LATE)
// ==============================================================================
export const logPeriodCycle = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      startDate, 
      endDate, 
      durationDays, 
      flowIntensity = 'Medium', 
      symptoms = [], 
      mood = 'Calm', 
      notes = '' 
    } = req.body;

    if (!startDate) {
      return res.status(400).json({ success: false, message: 'Please select a period start date.' });
    }

    // Get current settings to compare variance
    const settingsRes = await pool.query(
      `SELECT * FROM period_settings WHERE user_id = $1`,
      [userId]
    );

    let varianceDays = 0;
    let cycleStatus = 'On Time';
    let prevCycleLength = 28;
    let defaultDuration = 5;

    if (settingsRes.rows.length > 0) {
      const prev = settingsRes.rows[0];
      prevCycleLength = prev.cycle_length;
      defaultDuration = prev.period_duration;

      const prevStart = new Date(prev.last_period_start.toISOString().split('T')[0] + 'T00:00:00');
      const actualStart = new Date(startDate + 'T00:00:00');

      // Expected start date
      const expectedStart = new Date(prevStart);
      expectedStart.setDate(expectedStart.getDate() + prevCycleLength);

      const diffFromExpected = Math.round((actualStart.getTime() - expectedStart.getTime()) / (1000 * 60 * 60 * 24));
      varianceDays = diffFromExpected;

      if (diffFromExpected === 0) {
        cycleStatus = 'On Time';
      } else if (diffFromExpected < 0) {
        cycleStatus = `${Math.abs(diffFromExpected)} Days Early`;
      } else {
        cycleStatus = `${diffFromExpected} Days Delayed`;
      }
    }

    const calculatedDuration = Number(durationDays) || (endDate 
      ? Math.max(1, Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1)
      : defaultDuration);

    const finalEndDate = endDate || (() => {
      const d = new Date(startDate + 'T00:00:00');
      d.setDate(d.getDate() + (calculatedDuration - 1));
      return d.toISOString().split('T')[0];
    })();

    // Insert into period_cycles
    const insertCycleRes = await pool.query(
      `INSERT INTO period_cycles (
        user_id, start_date, end_date, duration_days, cycle_length_days, status, variance_days, flow_intensity, symptoms, mood, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        userId,
        startDate,
        finalEndDate,
        calculatedDuration,
        prevCycleLength,
        cycleStatus,
        varianceDays,
        flowIntensity,
        JSON.stringify(symptoms || []),
        mood,
        notes
      ]
    );

    // Dynamically update period_settings: sets last_period_start to the new period
    await pool.query(
      `INSERT INTO period_settings (user_id, last_period_start, period_duration, cycle_length, is_configured, updated_at)
       VALUES ($1, $2, $3, $4, TRUE, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id) 
       DO UPDATE SET 
         last_period_start = EXCLUDED.last_period_start,
         period_duration = EXCLUDED.period_duration,
         updated_at = CURRENT_TIMESTAMP`,
      [userId, startDate, calculatedDuration, prevCycleLength]
    );

    // Also sync to health_events timeline for unified patient records
    try {
      await pool.query(
        `INSERT INTO health_events (user_id, event_type, event_date, title, metadata, source)
         VALUES ($1, 'Cycle', $2, $3, $4, 'Period Tracker')`,
        [
          userId,
          startDate,
          `Period Started (${flowIntensity} Flow, ${cycleStatus})`,
          JSON.stringify({ flow: flowIntensity, duration: calculatedDuration, variance: cycleStatus, symptoms })
        ]
      );
    } catch (e) {}

    const updatedMetrics = calculatePhaseMetrics(startDate, calculatedDuration, prevCycleLength);

    res.status(201).json({
      success: true,
      message: `Period cycle logged (${cycleStatus}). Your cycle predictor has been dynamically updated.`,
      cycle: insertCycleRes.rows[0],
      metrics: updatedMetrics
    });
  } catch (err) {
    console.error('Error logging period cycle:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==============================================================================
// 4. ADJUST CYCLE DELAY / EXTEND EXPECTED DURATION
// ==============================================================================
export const adjustCycleDelay = async (req, res) => {
  try {
    const userId = req.user.id;
    const { newCycleLength, delayDays } = req.body;

    const settingsRes = await pool.query(
      `SELECT * FROM period_settings WHERE user_id = $1`,
      [userId]
    );

    if (settingsRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'No period cycle settings found to adjust.' });
    }

    const current = settingsRes.rows[0];
    const updatedCycle = Number(newCycleLength) || (current.cycle_length + (Number(delayDays) || 2));

    const updatedRes = await pool.query(
      `UPDATE period_settings 
       SET cycle_length = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE user_id = $2 
       RETURNING *`,
      [updatedCycle, userId]
    );

    const lastStartStr = current.last_period_start.toISOString().split('T')[0];
    const metrics = calculatePhaseMetrics(lastStartStr, current.period_duration, updatedCycle);

    res.json({
      success: true,
      message: `Cycle length dynamically updated to ${updatedCycle} days. Predictions recalibrated.`,
      settings: updatedRes.rows[0],
      metrics
    });
  } catch (err) {
    console.error('Error adjusting cycle delay:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==============================================================================
// 5. GET PATIENT CYCLE PROFILE FOR DOCTORS (APPOINTMENT RESTRICTED)
// ==============================================================================
export const getPatientCycleForDoctor = async (req, res) => {
  try {
    const doctorUserId = req.user.id;
    const { patientId } = req.params;

    // Verify requesting user is a doctor
    const docQuery = await pool.query(
      `SELECT id FROM doctors WHERE user_id = $1`,
      [doctorUserId]
    );

    if (docQuery.rows.length === 0) {
      return res.status(403).json({ success: false, message: 'Access denied: Doctor authorization required.' });
    }
    const doctorId = docQuery.rows[0].id;

    // Verify appointment relationship: patient must have at least one appointment with this doctor
    const aptCheck = await pool.query(
      `SELECT id FROM appointments 
       WHERE doctor_id = $1 AND patient_id = $2 
       LIMIT 1`,
      [doctorId, patientId]
    );

    if (aptCheck.rows.length === 0) {
      return res.status(403).json({ 
        success: false, 
        message: 'Patient cycle information is restricted to attending physicians with scheduled appointments.' 
      });
    }

    // Fetch patient life stage & profile
    const profileRes = await pool.query(
      `SELECT full_name, life_stage FROM user_profiles WHERE user_id = $1`,
      [patientId]
    );
    const patientStage = profileRes.rows[0]?.life_stage || 'REPRODUCTIVE_AGE';
    const patientFullName = profileRes.rows[0]?.full_name || `Patient #${patientId}`;
    const isReproductiveAge = patientStage === 'REPRODUCTIVE_AGE' || patientStage === 'YOUNG_ADULT' || patientStage === 'Reproductive Age';

    // Fetch patient cycle settings
    const settingsRes = await pool.query(
      `SELECT * FROM period_settings WHERE user_id = $1`,
      [patientId]
    );

    if (settingsRes.rows.length === 0 || !settingsRes.rows[0].is_configured) {
      return res.json({
        success: true,
        hasCycleData: false,
        patientName: patientFullName,
        lifeStage: patientStage,
        isReproductiveAge,
        message: isReproductiveAge 
          ? 'Patient has not yet configured their period tracking profile.' 
          : `Patient is currently in life stage (${patientStage}), which is clinically outside the active reproductive cycle window.`
      });
    }

    const row = settingsRes.rows[0];
    const lastStartStr = row.last_period_start.toISOString().split('T')[0];
    const metrics = calculatePhaseMetrics(lastStartStr, row.period_duration, row.cycle_length);

    // Fetch patient's cycle history
    const historyRes = await pool.query(
      `SELECT * FROM period_cycles 
       WHERE user_id = $1 
       ORDER BY start_date DESC 
       LIMIT 6`,
      [patientId]
    );

    res.json({
      success: true,
      hasCycleData: true,
      patientId,
      settings: {
        lastPeriodStart: lastStartStr,
        periodDuration: row.period_duration,
        cycleLength: row.cycle_length
      },
      metrics,
      cycleHistory: historyRes.rows.map(c => ({
        id: c.id,
        startDate: c.start_date.toISOString().split('T')[0],
        endDate: c.end_date ? c.end_date.toISOString().split('T')[0] : null,
        durationDays: c.duration_days,
        cycleLengthDays: c.cycle_length_days,
        status: c.status,
        varianceDays: c.variance_days,
        flowIntensity: c.flow_intensity,
        symptoms: c.symptoms || [],
        mood: c.mood,
        notes: c.notes
      }))
    });
  } catch (err) {
    console.error('Error fetching patient cycle for doctor:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
