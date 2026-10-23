import pool from '../config/db.js';
import { calculateGestationalMetrics, determineBiologicalLifeStage } from '../services/lifeStageService.js';

export function formatLocalDate(d) {
  if (!d) return '';
  if (typeof d === 'string') return d.split('T')[0];
  if (d instanceof Date) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return String(d).split('T')[0];
}

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
    // Cycle is delayed / lack of period detected
    isDelayed = true;
    daysDelayed = diffDays - cycleLength + 1;
    cycleDay = diffDays + 1;
    phaseCode = 'DELAYED';
    phaseName = 'Lack of Period / Menstrual Delay';
    phaseBadge = `⏳ +${daysDelayed} Day${daysDelayed > 1 ? 's' : ''} Period Delay`;
    phaseColor = 'amber';
    phaseDescription = `A lack of period has been detected based on your system timeline (+${daysDelayed} day${daysDelayed > 1 ? 's' : ''} past expected menses). Cycle delays are commonly caused by hormonal rhythm shifts, acute stress, physical fatigue, travel, or nutritional changes. Keep tracking your menstrual symptoms and record your period as soon as bleeding occurs.`;
    hormonalState = 'Extended Luteal / Menstrual Delay';
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
// HISTORICAL CYCLE STATISTICS & PREDICTIONS ENGINE
// ==============================================================================
export function calculateCycleStatistics(cycles = [], baselineCycleLength = 28, baselinePeriodDuration = 5) {
  if (!cycles || cycles.length === 0) {
    return {
      recordedCyclesCount: 0,
      averageCycleLength: baselineCycleLength,
      averagePeriodDuration: baselinePeriodDuration,
      cycleVariabilityDays: 0,
      minCycleLength: baselineCycleLength,
      maxCycleLength: baselineCycleLength,
      isIrregular: false,
      confidenceLevel: 'Baseline Estimate'
    };
  }

  // Calculate duration average
  const durations = cycles.map(c => Number(c.duration_days) || 5).filter(d => d > 0 && d <= 15);
  const avgDuration = durations.length > 0 
    ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) 
    : baselinePeriodDuration;

  // Calculate inter-cycle intervals from chronological cycles
  const normalIntervals = [];
  const lackOfPeriodIntervals = [];

  for (let i = 1; i < cycles.length; i++) {
    const prevDate = new Date(cycles[i - 1].start_date);
    const currDate = new Date(cycles[i].start_date);
    const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Normal biological menstrual cycle is 21 to 35 days (up to 38 days maximum)
    if (diffDays >= 20 && diffDays <= 38) {
      normalIntervals.push(diffDays);
    } else if (diffDays > 38) {
      // Gaps > 38 days represent Lack of Period (missed cycle / oligomenorrhea), NOT normal cadence
      lackOfPeriodIntervals.push(diffDays);
    }
  }

  const hasLackOfPeriod = lackOfPeriodIntervals.length > 0;
  const latestLackDays = hasLackOfPeriod ? Math.max(...lackOfPeriodIntervals) : null;

  // If normal intervals exist, average them. If not, use the baseline cycle length (e.g. 28 days)
  const avgCycle = normalIntervals.length > 0
    ? Math.round(normalIntervals.reduce((a, b) => a + b, 0) / normalIntervals.length)
    : Math.min(35, Math.max(21, Number(baselineCycleLength) || 28));

  const allIntervals = [...normalIntervals, ...lackOfPeriodIntervals];
  const minCycle = allIntervals.length > 0 ? Math.min(...allIntervals) : avgCycle;
  const maxCycle = allIntervals.length > 0 ? Math.max(...allIntervals) : avgCycle;
  const variability = normalIntervals.length > 1
    ? Math.max(...normalIntervals) - Math.min(...normalIntervals)
    : (hasLackOfPeriod ? 14 : 0);

  const isIrregular = hasLackOfPeriod || variability > 7;

  let confidenceLevel = 'Baseline Estimate';
  if (normalIntervals.length >= 3 && variability <= 3) {
    confidenceLevel = 'High (Consistent Pattern)';
  } else if (normalIntervals.length >= 2 && variability <= 5) {
    confidenceLevel = 'Moderate Confidence';
  } else if (isIrregular) {
    confidenceLevel = 'Baseline (28d)';
  } else {
    confidenceLevel = 'Learning Pattern';
  }

  return {
    recordedCyclesCount: cycles.length,
    averageCycleLength: avgCycle,
    averagePeriodDuration: avgDuration,
    cycleVariabilityDays: variability,
    minCycleLength: minCycle,
    maxCycleLength: maxCycle,
    isIrregular,
    hasLackOfPeriod,
    lackOfPeriodDays: latestLackDays,
    lackOfPeriodCount: lackOfPeriodIntervals.length,
    confidenceLevel
  };
}

export function calculatePredictions(lastPeriodStartStr, avgCycleLength, avgPeriodDuration, variability = 0, targetDate = new Date()) {
  const dateStr = String(lastPeriodStartStr).split('T')[0];
  const start = new Date(dateStr + 'T00:00:00');
  const today = new Date(targetDate);
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);

  const cycleDaysElapsed = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  // Next expected period
  const nextPeriodStart = new Date(start);
  nextPeriodStart.setDate(nextPeriodStart.getDate() + avgCycleLength);

  // Next period range based on variability
  const rangeMargin = Math.max(1, Math.min(5, Math.round(variability / 2)));
  const nextPeriodRangeStart = new Date(nextPeriodStart);
  nextPeriodRangeStart.setDate(nextPeriodRangeStart.getDate() - rangeMargin);

  const nextPeriodRangeEnd = new Date(nextPeriodStart);
  nextPeriodRangeEnd.setDate(nextPeriodRangeEnd.getDate() + rangeMargin);

  // Ovulation: typically 14 days prior to next expected period in luteal phase
  const ovulationDate = new Date(nextPeriodStart);
  ovulationDate.setDate(ovulationDate.getDate() - 14);

  // Fertile window: 5 days before ovulation + ovulation day
  const fertileStart = new Date(ovulationDate);
  fertileStart.setDate(fertileStart.getDate() - 5);

  const fertileEnd = new Date(ovulationDate);
  fertileEnd.setDate(fertileEnd.getDate() + 1);

  const daysUntilPeriod = Math.round((nextPeriodStart.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isDelayed = daysUntilPeriod < 0;
  const daysDelayed = isDelayed ? Math.abs(daysUntilPeriod) : 0;

  return {
    lastPeriodStartDate: start.toISOString().split('T')[0],
    nextPeriodStartDate: nextPeriodStart.toISOString().split('T')[0],
    nextPeriodRangeStartDate: nextPeriodRangeStart.toISOString().split('T')[0],
    nextPeriodRangeEndDate: nextPeriodRangeEnd.toISOString().split('T')[0],
    predictionRangeStart: nextPeriodRangeStart.toISOString().split('T')[0],
    predictionRangeEnd: nextPeriodRangeEnd.toISOString().split('T')[0],
    ovulationDate: ovulationDate.toISOString().split('T')[0],
    estimatedOvulationDate: ovulationDate.toISOString().split('T')[0],
    fertileWindowStartDate: fertileStart.toISOString().split('T')[0],
    fertileWindowEndDate: fertileEnd.toISOString().split('T')[0],
    estimatedPeriodDuration: avgPeriodDuration,
    cycleDaysElapsed: cycleDaysElapsed + 1,
    daysUntilPeriod: isDelayed ? 0 : daysUntilPeriod,
    isDelayed,
    daysDelayed,
    predictionDisclaimer: "Predictions are estimates based on your recorded history. Ovulation and cycle timing vary biologically and should not be used as contraception or guaranteed fertility confirmation."
  };
}

// ==============================================================================
// SEQUENTIAL CYCLE CHAIN RECALIBRATOR (FIRST CYCLE = 0 VARIANCE, SUBSEQUENT COMPARE WITH PREVIOUS)
// ==============================================================================
export async function recalculateAndSyncUserCycles(userId, effectiveCycleLength = 28) {
  try {
    const res = await pool.query(
      `SELECT * FROM period_cycles WHERE user_id = $1 ORDER BY start_date ASC`,
      [userId]
    );
    if (res.rows.length === 0) return [];

    const updatedCycles = [];
    for (let i = 0; i < res.rows.length; i++) {
      const c = res.rows[i];
      let status = 'On Time';
      let variance = 0;
      let gap = effectiveCycleLength;

      if (i === 0) {
        // First cycle entered: status starts from 0 variance, On Time baseline
        status = 'On Time';
        variance = 0;
        gap = effectiveCycleLength;
      } else {
        // Subsequent cycles compare directly with the immediately preceding cycle
        const prev = res.rows[i - 1];
        const prevStart = new Date(prev.start_date.toISOString().split('T')[0] + 'T00:00:00');
        const currStart = new Date(c.start_date.toISOString().split('T')[0] + 'T00:00:00');
        const actualGap = Math.round((currStart.getTime() - prevStart.getTime()) / (1000 * 60 * 60 * 24));
        gap = actualGap;
        const diff = actualGap - effectiveCycleLength;
        variance = diff;
        if (diff === 0) {
          status = 'On Time';
        } else if (diff < 0) {
          status = `${Math.abs(diff)} Days Early`;
        } else {
          status = `${diff} Days Delayed`;
        }
      }

      if (c.status !== status || c.variance_days !== variance || c.cycle_length_days !== gap) {
        await pool.query(
          `UPDATE period_cycles SET status = $1, variance_days = $2, cycle_length_days = $3 WHERE id = $4`,
          [status, variance, gap, c.id]
        ).catch(() => {});
      }

      updatedCycles.push({
        ...c,
        status,
        variance_days: variance,
        cycle_length_days: gap
      });
    }

    return updatedCycles;
  } catch (err) {
    console.error('Error recalculating cycle chain:', err);
    return [];
  }
}

// ==============================================================================
// 1. GET PERIOD SETTINGS & LIVE PHASE METRICS
// ==============================================================================
export const getPeriodSettings = async (req, res) => {
  try {
    const userId = req.user.id;

    let settingsRes = await pool.query(
      `SELECT * FROM period_settings WHERE user_id = $1`,
      [userId]
    );

    if (settingsRes.rows.length === 0 || !settingsRes.rows[0].is_configured) {
      // Auto-heal from period_cycles if user previously recorded a period
      const cycleCheck = await pool.query(
        `SELECT * FROM period_cycles WHERE user_id = $1 ORDER BY start_date DESC LIMIT 1`,
        [userId]
      );
      if (cycleCheck.rows.length > 0) {
        const c = cycleCheck.rows[0];
        const lastStart = formatLocalDate(c.start_date);
        const duration = c.duration_days || 5;
        const cycleLen = c.cycle_length_days || 28;
        await pool.query(
          `INSERT INTO period_settings (user_id, last_period_start, period_duration, cycle_length, is_configured, updated_at)
           VALUES ($1, $2, $3, $4, TRUE, CURRENT_TIMESTAMP)
           ON CONFLICT (user_id) DO UPDATE SET
             last_period_start = EXCLUDED.last_period_start,
             period_duration = EXCLUDED.period_duration,
             cycle_length = EXCLUDED.cycle_length,
             is_configured = TRUE,
             updated_at = CURRENT_TIMESTAMP`,
          [userId, lastStart, duration, cycleLen]
        );
        settingsRes = await pool.query(
          `SELECT * FROM period_settings WHERE user_id = $1`,
          [userId]
        );
      } else {
        return res.json({
          success: true,
          isConfigured: false,
          message: 'Period tracking is not yet configured for this user.'
        });
      }
    }

    const row = settingsRes.rows[0];
    const isPregnant = Boolean(row.is_pregnant);
    const lastStartStr = formatLocalDate(row.last_period_start);
    const pregnancyStartStr = row.pregnancy_start_date ? formatLocalDate(row.pregnancy_start_date) : lastStartStr;
    const eddStr = row.gestational_target_edd ? formatLocalDate(row.gestational_target_edd) : null;

    // Fetch all user cycles for actual historical statistics
    const allCyclesRes = await pool.query(
      `SELECT * FROM period_cycles WHERE user_id = $1 ORDER BY start_date ASC`,
      [userId]
    );

    const historicalStats = calculateCycleStatistics(
      allCyclesRes.rows, 
      row.cycle_length || 28, 
      row.period_duration || 5
    );

    const effectiveCycleLength = historicalStats.averageCycleLength || row.cycle_length || 28;
    const effectivePeriodDuration = historicalStats.averagePeriodDuration || row.period_duration || 5;

    let metrics;
    if (isPregnant) {
      metrics = calculateGestationalMetrics(pregnancyStartStr);
    } else {
      metrics = calculatePhaseMetrics(lastStartStr, effectivePeriodDuration, effectiveCycleLength);
      metrics.hasLackOfPeriod = Boolean(historicalStats.hasLackOfPeriod || metrics.isDelayed);
      metrics.lackOfPeriodDays = historicalStats.lackOfPeriodDays || metrics.daysDelayed || null;
      if (historicalStats.hasLackOfPeriod) {
        metrics.lackOfPeriodNote = `A previous interval of ${historicalStats.lackOfPeriodDays} days represents a lack of period / missed cycle. Baseline rhythm preserved.`;
      }
    }

    const predictions = calculatePredictions(
      lastStartStr,
      effectiveCycleLength,
      effectivePeriodDuration,
      historicalStats.cycleVariabilityDays
    );

    // Recalculate and synchronize chained cycle statuses and gaps sequentially
    const syncedCycles = await recalculateAndSyncUserCycles(userId, effectiveCycleLength);
    const displayCycles = [...syncedCycles].reverse().slice(0, 24);

    // Fetch today's daily symptom log if logged
    const todayLogRes = await pool.query(
      `SELECT * FROM period_daily_logs WHERE user_id = $1 AND log_date = CURRENT_DATE LIMIT 1`,
      [userId]
    );

    const todayLog = todayLogRes.rows.length > 0 ? {
      id: todayLogRes.rows[0].id,
      date: todayLogRes.rows[0].log_date.toISOString().split('T')[0],
      isPeriodDay: todayLogRes.rows[0].is_period_day,
      flowIntensity: todayLogRes.rows[0].flow_intensity,
      symptoms: todayLogRes.rows[0].symptoms || [],
      mood: todayLogRes.rows[0].mood,
      energyLevel: todayLogRes.rows[0].energy_level,
      sleepQuality: todayLogRes.rows[0].sleep_quality,
      cervicalMucus: todayLogRes.rows[0].cervical_mucus,
      notes: todayLogRes.rows[0].notes
    } : null;

    // Fetch user marital status to dynamically determine maternity mode availability
    const profileRes = await pool.query(
      `SELECT marital_status FROM user_profiles WHERE user_id = $1`,
      [userId]
    );
    const maritalStatus = profileRes.rows[0]?.marital_status || 'Single';

    // Pick a random mental wellness affirmation and shuffle healthy tips
    const affirmation = MENSTRUAL_AFFIRMATIONS[Math.floor(Math.random() * MENSTRUAL_AFFIRMATIONS.length)];
    const tips = [...HEALTHY_MENSTRUAL_TIPS].sort(() => 0.5 - Math.random());

    res.json({
      success: true,
      isConfigured: true,
      configured: true,
      isPregnant,
      maritalStatus,
      settings: {
        id: row.id,
        lastPeriodStart: lastStartStr,
        periodDuration: row.period_duration,
        cycleLength: row.cycle_length,
        isConfigured: row.is_configured,
        isPregnant,
        pregnancyStartDate: isPregnant ? pregnancyStartStr : null,
        gestationalTargetEdd: isPregnant ? (eddStr || metrics.edd) : null,
        reminderPeriodDaysBefore: row.reminder_period_days_before ?? 2,
        reminderPeriodEnabled: row.reminder_period_enabled ?? true,
        reminderOvulationEnabled: row.reminder_ovulation_enabled ?? false,
        reminderDailyLoggingEnabled: row.reminder_daily_logging_enabled ?? false,
        updatedAt: row.updated_at
      },
      reminders: {
        periodDaysBefore: row.reminder_period_days_before ?? 2,
        periodEnabled: row.reminder_period_enabled ?? true,
        ovulationEnabled: row.reminder_ovulation_enabled ?? false,
        dailyLoggingEnabled: row.reminder_daily_logging_enabled ?? false
      },
      metrics,
      prediction: predictions,
      predictions,
      historicalStats,
      todayLog,
      cycleHistory: displayCycles.map(c => ({
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

export const getPeriodOverview = getPeriodSettings;

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

    // Get current settings to determine baseline cycle length
    const settingsRes = await pool.query(
      `SELECT * FROM period_settings WHERE user_id = $1`,
      [userId]
    );

    let prevCycleLength = 28;
    let defaultDuration = 5;

    if (settingsRes.rows.length > 0) {
      const prev = settingsRes.rows[0];
      prevCycleLength = prev.cycle_length || 28;
      defaultDuration = prev.period_duration || 5;
    }

    // Check existing cycles before this new cycle start date
    const actualStart = new Date(startDate + 'T00:00:00');
    const priorCyclesRes = await pool.query(
      `SELECT * FROM period_cycles WHERE user_id = $1 AND start_date < $2 ORDER BY start_date DESC LIMIT 1`,
      [userId, startDate]
    );

    let varianceDays = 0;
    let cycleStatus = 'On Time';
    let recordedCycleGap = prevCycleLength;

    if (priorCyclesRes.rows.length === 0) {
      // First cycle entered: status starts from 0 variance, On Time baseline
      varianceDays = 0;
      cycleStatus = 'On Time';
      recordedCycleGap = prevCycleLength;
    } else {
      // Compare directly with the immediately preceding cycle
      const prevCycle = priorCyclesRes.rows[0];
      const prevStart = new Date(prevCycle.start_date.toISOString().split('T')[0] + 'T00:00:00');
      const actualGap = Math.round((actualStart.getTime() - prevStart.getTime()) / (1000 * 60 * 60 * 24));
      
      const expectedGap = prevCycleLength;
      const diffFromExpected = actualGap - expectedGap;
      varianceDays = diffFromExpected;

      if (diffFromExpected === 0) {
        cycleStatus = 'On Time';
      } else if (diffFromExpected < 0) {
        cycleStatus = `${Math.abs(diffFromExpected)} Days Early`;
      } else {
        cycleStatus = `${diffFromExpected} Days Delayed`;
      }
      recordedCycleGap = actualGap;
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
        recordedCycleGap,
        cycleStatus,
        varianceDays,
        flowIntensity,
        JSON.stringify(symptoms || []),
        mood,
        notes
      ]
    );

    // Recalibrate full cycle sequence
    await recalculateAndSyncUserCycles(userId, prevCycleLength);

    // Dynamically update period_settings: sets last_period_start to the new period
    await pool.query(
      `INSERT INTO period_settings (user_id, last_period_start, period_duration, cycle_length, is_configured, updated_at)
       VALUES ($1, $2, $3, $4, TRUE, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id) 
       DO UPDATE SET 
         last_period_start = EXCLUDED.last_period_start,
         period_duration = EXCLUDED.period_duration,
         is_configured = TRUE,
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
// 5. UPDATE PERIOD SETTINGS & REMINDER PREFERENCES
// ==============================================================================
export const updatePeriodSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      cycleLength,
      periodDuration,
      reminderPeriodDaysBefore,
      reminderPeriodEnabled,
      reminderOvulationEnabled,
      reminderDailyLoggingEnabled
    } = req.body;

    const duration = periodDuration ? Math.max(2, Math.min(15, parseInt(periodDuration, 10))) : undefined;
    const cycle = cycleLength ? Math.max(20, Math.min(45, parseInt(cycleLength, 10))) : undefined;

    const daysBefore = reminderPeriodDaysBefore !== undefined ? reminderPeriodDaysBefore : (req.body.periodDaysBefore !== undefined ? req.body.periodDaysBefore : undefined);
    const periodEn = reminderPeriodEnabled !== undefined ? reminderPeriodEnabled : (req.body.periodEnabled !== undefined ? req.body.periodEnabled : undefined);
    const ovEn = reminderOvulationEnabled !== undefined ? reminderOvulationEnabled : (req.body.ovulationEnabled !== undefined ? req.body.ovulationEnabled : undefined);
    const dailyEn = reminderDailyLoggingEnabled !== undefined ? reminderDailyLoggingEnabled : (req.body.dailyLoggingEnabled !== undefined ? req.body.dailyLoggingEnabled : undefined);

    const updateRes = await pool.query(
      `UPDATE period_settings
       SET cycle_length = COALESCE($1, cycle_length),
           period_duration = COALESCE($2, period_duration),
           reminder_period_days_before = COALESCE($3, reminder_period_days_before),
           reminder_period_enabled = COALESCE($4, reminder_period_enabled),
           reminder_ovulation_enabled = COALESCE($5, reminder_ovulation_enabled),
           reminder_daily_logging_enabled = COALESCE($6, reminder_daily_logging_enabled),
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $7
       RETURNING *`,
      [cycle, duration, daysBefore, periodEn, ovEn, dailyEn, userId]
    );

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Period settings not found.' });
    }

    res.json({
      success: true,
      message: 'Period tracking settings & reminder preferences updated successfully.',
      settings: updateRes.rows[0]
    });
  } catch (err) {
    console.error('Error updating period settings:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==============================================================================
// 6. UPDATE / CORRECT EXISTING PERIOD CYCLE
// ==============================================================================
export const updatePeriodCycle = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const {
      startDate,
      endDate,
      durationDays,
      flowIntensity,
      symptoms,
      mood,
      notes
    } = req.body;

    if (!startDate) {
      return res.status(400).json({ success: false, message: 'Start date is required.' });
    }

    const dur = durationDays ? Number(durationDays) : (endDate ? Math.max(1, Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000) + 1) : 5);
    const calculatedEnd = endDate || (() => {
      const d = new Date(startDate + 'T00:00:00');
      d.setDate(d.getDate() + (dur - 1));
      return d.toISOString().split('T')[0];
    })();

    const updateRes = await pool.query(
      `UPDATE period_cycles
       SET start_date = $1,
           end_date = $2,
           duration_days = $3,
           flow_intensity = COALESCE($4, flow_intensity),
           symptoms = COALESCE($5, symptoms),
           mood = COALESCE($6, mood),
           notes = COALESCE($7, notes)
       WHERE id = $8 AND user_id = $9
       RETURNING *`,
      [
        startDate,
        calculatedEnd,
        dur,
        flowIntensity,
        symptoms ? JSON.stringify(symptoms) : null,
        mood,
        notes,
        id,
        userId
      ]
    );

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Cycle record not found or access denied.' });
    }

    // Sync period_settings last_period_start to the latest cycle
    const latestCycleRes = await pool.query(
      `SELECT start_date, duration_days FROM period_cycles WHERE user_id = $1 ORDER BY start_date DESC LIMIT 1`,
      [userId]
    );
    if (latestCycleRes.rows.length > 0) {
      await pool.query(
        `UPDATE period_settings
         SET last_period_start = $1,
             period_duration = $2,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $3`,
        [latestCycleRes.rows[0].start_date, latestCycleRes.rows[0].duration_days, userId]
      );
    }

    // Recalculate and synchronize all cycles after update
    await recalculateAndSyncUserCycles(userId);

    res.json({
      success: true,
      message: 'Period cycle record updated successfully.',
      cycle: updateRes.rows[0]
    });
  } catch (err) {
    console.error('Error updating period cycle:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==============================================================================
// 7. DELETE A PERIOD CYCLE RECORD
// ==============================================================================
export const deletePeriodCycle = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleteRes = await pool.query(
      `DELETE FROM period_cycles WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, userId]
    );

    if (deleteRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Cycle record not found or access denied.' });
    }

    // If other cycles remain, recalibrate last_period_start
    const latestCycleRes = await pool.query(
      `SELECT start_date, duration_days FROM period_cycles WHERE user_id = $1 ORDER BY start_date DESC LIMIT 1`,
      [userId]
    );
    if (latestCycleRes.rows.length > 0) {
      await pool.query(
        `UPDATE period_settings
         SET last_period_start = $1,
             period_duration = $2,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $3`,
        [latestCycleRes.rows[0].start_date, latestCycleRes.rows[0].duration_days, userId]
      );
    }

    // Recalibrate and synchronize remaining cycles
    await recalculateAndSyncUserCycles(userId);

    res.json({
      success: true,
      message: 'Period cycle record deleted successfully.',
      deletedId: id
    });
  } catch (err) {
    console.error('Error deleting period cycle:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==============================================================================
// 8. GET DAILY HEALTH & SYMPTOM LOGS
// ==============================================================================
export const getDailyLogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, date, start, end } = req.query;

    let query = `SELECT * FROM period_daily_logs WHERE user_id = $1`;
    const params = [userId];

    if (date) {
      query += ` AND log_date = $2`;
      params.push(date);
    } else if (month) {
      query += ` AND TO_CHAR(log_date, 'YYYY-MM') = $2`;
      params.push(month);
    } else if (start && end) {
      query += ` AND log_date >= $2 AND log_date <= $3`;
      params.push(start, end);
    }

    query += ` ORDER BY log_date ASC`;

    const result = await pool.query(query, params);

    res.json({
      success: true,
      count: result.rows.length,
      logs: result.rows.map(r => ({
        id: r.id,
        date: formatLocalDate(r.log_date),
        isPeriodDay: r.is_period_day,
        flowIntensity: r.flow_intensity,
        symptoms: r.symptoms || [],
        mood: r.mood,
        energyLevel: r.energy_level,
        sleepQuality: r.sleep_quality,
        cervicalMucus: r.cervical_mucus,
        notes: r.notes,
        updatedAt: r.updated_at
      }))
    });
  } catch (err) {
    console.error('Error fetching daily logs:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==============================================================================
// 9. LOG / UPDATE DAILY HEALTH & MENSTRUAL SYMPTOMS
// ==============================================================================
export const saveDailyLog = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      date,
      isPeriodDay = false,
      flowIntensity = 'None',
      symptoms = [],
      mood = 'Calm',
      energyLevel = 'Normal',
      sleepQuality = 'Good',
      cervicalMucus = 'None',
      notes = ''
    } = req.body;

    if (!date) {
      return res.status(400).json({ success: false, message: 'Log date is required.' });
    }

    const isPeriod = Boolean(isPeriodDay || (flowIntensity && flowIntensity !== 'None'));

    const upsertRes = await pool.query(
      `INSERT INTO period_daily_logs (
         user_id, log_date, is_period_day, flow_intensity, symptoms, mood, energy_level, sleep_quality, cervical_mucus, notes, updated_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, log_date)
       DO UPDATE SET
         is_period_day = EXCLUDED.is_period_day,
         flow_intensity = EXCLUDED.flow_intensity,
         symptoms = EXCLUDED.symptoms,
         mood = EXCLUDED.mood,
         energy_level = EXCLUDED.energy_level,
         sleep_quality = EXCLUDED.sleep_quality,
         cervical_mucus = EXCLUDED.cervical_mucus,
         notes = EXCLUDED.notes,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [
        userId,
        date,
        isPeriod,
        flowIntensity,
        JSON.stringify(symptoms || []),
        mood,
        energyLevel,
        sleepQuality,
        cervicalMucus,
        notes
      ]
    );

    res.status(200).json({
      success: true,
      message: 'Daily health & symptom entry saved.',
      log: {
        id: upsertRes.rows[0].id,
        date: formatLocalDate(upsertRes.rows[0].log_date),
        isPeriodDay: upsertRes.rows[0].is_period_day,
        flowIntensity: upsertRes.rows[0].flow_intensity,
        symptoms: upsertRes.rows[0].symptoms || [],
        mood: upsertRes.rows[0].mood,
        energyLevel: upsertRes.rows[0].energy_level,
        sleepQuality: upsertRes.rows[0].sleep_quality,
        cervicalMucus: upsertRes.rows[0].cervical_mucus,
        notes: upsertRes.rows[0].notes,
        updatedAt: upsertRes.rows[0].updated_at
      }
    });
  } catch (err) {
    console.error('Error saving daily log:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==============================================================================
// 10. DELETE DAILY HEALTH & SYMPTOM LOG
// ==============================================================================
export const deleteDailyLog = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date } = req.params;

    const deleteRes = await pool.query(
      `DELETE FROM period_daily_logs WHERE user_id = $1 AND log_date = $2 RETURNING *`,
      [userId, date]
    );

    if (deleteRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Daily log not found for date.' });
    }

    res.json({ success: true, message: 'Daily log deleted successfully.' });
  } catch (err) {
    console.error('Error deleting daily log:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==============================================================================
// 11. GET PERIOD INSIGHTS & HISTORICAL TRENDS
// ==============================================================================
export const getPeriodInsights = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Get cycles in chronological order
    const cyclesRes = await pool.query(
      `SELECT * FROM period_cycles WHERE user_id = $1 ORDER BY start_date ASC`,
      [userId]
    );

    // 2. Get baseline settings
    const settingsRes = await pool.query(
      `SELECT * FROM period_settings WHERE user_id = $1`,
      [userId]
    );
    const baselineCycle = settingsRes.rows[0]?.cycle_length || 28;
    const baselineDuration = settingsRes.rows[0]?.period_duration || 5;

    const stats = calculateCycleStatistics(cyclesRes.rows, baselineCycle, baselineDuration);

    // 3. Trends over time
    const cycleLengthTrends = [];
    for (let i = 1; i < cyclesRes.rows.length; i++) {
      const prev = new Date(cyclesRes.rows[i - 1].start_date);
      const curr = new Date(cyclesRes.rows[i].start_date);
      const diff = Math.round((curr.getTime() - prev.getTime()) / 86400000);
      cycleLengthTrends.push({
        cycleNumber: i,
        startDate: curr.toISOString().split('T')[0],
        lengthDays: diff
      });
    }

    const durationTrends = cyclesRes.rows.map((c, idx) => ({
      cycleNumber: idx + 1,
      startDate: c.start_date.toISOString().split('T')[0],
      durationDays: c.duration_days
    }));

    // 4. Symptom frequencies from cycles and daily logs
    const dailyLogsRes = await pool.query(
      `SELECT symptoms, mood, flow_intensity FROM period_daily_logs WHERE user_id = $1`,
      [userId]
    );

    const symptomCounts = {};
    const moodCounts = {};
    const flowCounts = {};

    const processSymptoms = (symList) => {
      if (Array.isArray(symList)) {
        symList.forEach(s => {
          if (s && typeof s === 'string') {
            symptomCounts[s] = (symptomCounts[s] || 0) + 1;
          }
        });
      }
    };

    cyclesRes.rows.forEach(c => {
      processSymptoms(c.symptoms);
      if (c.mood) moodCounts[c.mood] = (moodCounts[c.mood] || 0) + 1;
      if (c.flow_intensity) flowCounts[c.flow_intensity] = (flowCounts[c.flow_intensity] || 0) + 1;
    });

    dailyLogsRes.rows.forEach(d => {
      processSymptoms(d.symptoms);
      if (d.mood) moodCounts[d.mood] = (moodCounts[d.mood] || 0) + 1;
      if (d.flow_intensity && d.flow_intensity !== 'None') flowCounts[d.flow_intensity] = (flowCounts[d.flow_intensity] || 0) + 1;
    });

    const topSymptoms = Object.entries(symptomCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const topMoods = Object.entries(moodCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    res.json({
      success: true,
      stats,
      trends: {
        cycleLengths: cycleLengthTrends,
        periodDurations: durationTrends,
        topSymptoms,
        topMoods,
        flowDistribution: flowCounts
      }
    });
  } catch (err) {
    console.error('Error fetching period insights:', err);
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

// ==============================================================================
// 6. ACTIVATE MATERNITY / PREGNANCY MODE (PAUSES MENSTRUAL CYCLE)
// ==============================================================================
export const activatePregnancy = async (req, res) => {
  try {
    const userId = req.user.id;
    const { lmpDate } = req.body;

    // Verify female user's marital status allows Maternity Mode
    const profileRes = await pool.query(
      `SELECT marital_status FROM user_profiles WHERE user_id = $1`,
      [userId]
    );
    const userMarital = profileRes.rows[0]?.marital_status || 'Single';
    if (userMarital !== 'Married' && userMarital !== 'Partnered') {
      return res.status(403).json({
        success: false,
        message: 'Maternity Mode is only accessible based on marital status (Married/Partnered). Please update your marital status in your profile if this has changed.'
      });
    }

    const settingsRes = await pool.query(
      `SELECT * FROM period_settings WHERE user_id = $1`,
      [userId]
    );

    let effectiveLmp = lmpDate;
    if (!effectiveLmp) {
      if (settingsRes.rows.length > 0 && settingsRes.rows[0].last_period_start) {
        effectiveLmp = settingsRes.rows[0].last_period_start.toISOString().split('T')[0];
      } else {
        effectiveLmp = new Date().toISOString().split('T')[0];
      }
    }

    const lmp = new Date(effectiveLmp + 'T00:00:00');
    const edd = new Date(lmp);
    edd.setDate(edd.getDate() + 280);
    const eddStr = edd.toISOString().split('T')[0];

    // Upsert into period_settings
    const upsertRes = await pool.query(
      `INSERT INTO period_settings (
         user_id, last_period_start, period_duration, cycle_length, is_configured, 
         is_pregnant, pregnancy_start_date, gestational_target_edd, updated_at
       )
       VALUES ($1, $2, 5, 28, TRUE, TRUE, $2, $3, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id)
       DO UPDATE SET 
         is_pregnant = TRUE,
         pregnancy_start_date = EXCLUDED.pregnancy_start_date,
         gestational_target_edd = EXCLUDED.gestational_target_edd,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, effectiveLmp, eddStr]
    );

    // Synchronize active life stage to Pregnancy Journey
    await pool.query(
      `UPDATE user_profiles SET life_stage = 'Pregnancy Journey', updated_at = CURRENT_TIMESTAMP WHERE user_id = $1`,
      [userId]
    );

    // Sync to user_life_stages
    await pool.query(
      `UPDATE user_life_stages SET is_current = FALSE WHERE user_id = $1`,
      [userId]
    );
    await pool.query(
      `INSERT INTO user_life_stages (user_id, life_stage_code, is_current, manually_set, enabled_modules)
       VALUES ($1, 'PREGNANCY', TRUE, FALSE, '["Maternity Hub", "Gestational Milestones", "Kick Counter", "Prenatal Care"]')`,
      [userId]
    );

    // Log to health_events
    try {
      await pool.query(
        `INSERT INTO health_events (user_id, event_type, event_date, title, metadata, source)
         VALUES ($1, 'Pregnancy', $2, 'Entered Maternity Mode', $3, 'Period Tracker')`,
        [
          userId,
          effectiveLmp,
          JSON.stringify({ lmpDate: effectiveLmp, edd: eddStr, note: 'Period tracker cycle paused for pregnancy' })
        ]
      );
    } catch (e) {}

    const maternityMetrics = calculateGestationalMetrics(effectiveLmp);

    res.status(200).json({
      success: true,
      message: 'Maternity mode activated. Menstrual cycle tracker paused.',
      isPregnant: true,
      settings: upsertRes.rows[0],
      metrics: maternityMetrics
    });
  } catch (err) {
    console.error('Error activating pregnancy mode:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==============================================================================
// 7. DEACTIVATE MATERNITY / RESUME MENSTRUAL CYCLE
// ==============================================================================
export const deactivatePregnancy = async (req, res) => {
  try {
    const userId = req.user.id;
    const { resumePeriodDate } = req.body;

    const settingsRes = await pool.query(
      `SELECT * FROM period_settings WHERE user_id = $1`,
      [userId]
    );

    if (settingsRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'No period tracking profile found.' });
    }

    const current = settingsRes.rows[0];
    const effectiveStart = resumePeriodDate || (current.last_period_start ? current.last_period_start.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);

    const updateRes = await pool.query(
      `UPDATE period_settings
       SET is_pregnant = FALSE,
           pregnancy_start_date = NULL,
           gestational_target_edd = NULL,
           last_period_start = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $2
       RETURNING *`,
      [effectiveStart, userId]
    );

    // Recalibrate normal menstrual metrics
    const metrics = calculatePhaseMetrics(
      effectiveStart, 
      updateRes.rows[0].period_duration || 5, 
      updateRes.rows[0].cycle_length || 28
    );

    // Recalculate dynamic life stage from DOB
    const profileRes = await pool.query(
      `SELECT dob, menarche_started FROM user_profiles WHERE user_id = $1`,
      [userId]
    );
    if (profileRes.rows.length > 0) {
      const p = profileRes.rows[0];
      const normalStage = determineBiologicalLifeStage({
        dob: p.dob,
        menarcheStarted: p.menarche_started !== false,
        isPregnant: false
      });
      await pool.query(
        `UPDATE user_profiles SET life_stage = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2`,
        [normalStage.name, userId]
      );
      await pool.query(
        `UPDATE user_life_stages SET is_current = FALSE WHERE user_id = $1`,
        [userId]
      );
      await pool.query(
        `INSERT INTO user_life_stages (user_id, life_stage_code, is_current, manually_set, enabled_modules)
         VALUES ($1, $2, TRUE, FALSE, $3)`,
        [userId, normalStage.code, JSON.stringify(normalStage.enabledModules || [])]
      );
    }

    // Log to health_events
    try {
      await pool.query(
        `INSERT INTO health_events (user_id, event_type, event_date, title, metadata, source)
         VALUES ($1, 'Cycle', $2, 'Concluded Maternity Mode (Cycle Resumed)', $3, 'Period Tracker')`,
        [
          userId,
          effectiveStart,
          JSON.stringify({ resumeDate: effectiveStart, note: 'Resumed standard menstrual cycle tracking' })
        ]
      );
    } catch (e) {}

    res.status(200).json({
      success: true,
      message: 'Maternity mode concluded. Menstrual cycle tracker resumed.',
      isPregnant: false,
      settings: updateRes.rows[0],
      metrics
    });
  } catch (err) {
    console.error('Error deactivating pregnancy mode:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

