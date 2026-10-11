// ==============================================================================
// FEMSPHERE BIOLOGICAL LIFE STAGE & MATERNITY ENGINE
// ==============================================================================

/**
 * Calculates exact age in full years from a date of birth string or Date object.
 */
export function calculateAgeFromDob(dob) {
  if (!dob) return 25;
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return 25;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return Math.max(0, age);
}

/**
 * Dynamically maps biological life stage based on DOB, age, menarche onset, and pregnancy.
 */
export function determineBiologicalLifeStage({ dob, menarcheStarted = true, isPregnant = false }) {
  const age = calculateAgeFromDob(dob);

  // 1. Pregnancy Overlay (Cycle paused, active maternity journey)
  if (isPregnant) {
    return {
      code: 'PREGNANCY',
      name: 'Pregnancy Journey',
      description: 'Active gestational development, fetal tracking, and prenatal maternal wellness.',
      age,
      dob: dob ? (dob instanceof Date ? dob.toISOString().split('T')[0] : String(dob).split('T')[0]) : null,
      isPregnant: true,
      menarcheStarted: Boolean(menarcheStarted),
      isReproductiveStage: true,
      enabledModules: ['Maternity Hub', 'Gestational Milestones', 'Kick Counter', 'Prenatal Care', 'Vitals Tracker']
    };
  }

  // 2. Early Childhood (0 - 8 yrs)
  if (age <= 8) {
    return {
      code: 'EARLY_CHILDHOOD',
      name: 'Early Childhood',
      description: 'Pediatric wellness, milestone growth tracking, and childhood nutrition.',
      age,
      dob: dob ? (dob instanceof Date ? dob.toISOString().split('T')[0] : String(dob).split('T')[0]) : null,
      isPregnant: false,
      menarcheStarted: false,
      isReproductiveStage: false,
      enabledModules: ['Pediatric Growth', 'Immunization Log', 'Childhood Nutrition']
    };
  }

  // 3. Pre-Puberty (9 - 10 yrs)
  if (age <= 10) {
    if (menarcheStarted) {
      return {
        code: 'PUBERTY',
        name: 'Puberty & Development',
        description: 'Early adolescent somatic and reproductive hormonal development.',
        age,
        dob: dob ? (dob instanceof Date ? dob.toISOString().split('T')[0] : String(dob).split('T')[0]) : null,
        isPregnant: false,
        menarcheStarted: true,
        isReproductiveStage: true,
        enabledModules: ['Cycle & Periods', 'Body Changes', 'Emotional Wellness']
      };
    }
    return {
      code: 'PRE_PUBERTY',
      name: 'Pre-Puberty',
      description: 'Pre-pubescent hormonal baseline and growth trajectory before menarche.',
      age,
      dob: dob ? (dob instanceof Date ? dob.toISOString().split('T')[0] : String(dob).split('T')[0]) : null,
      isPregnant: false,
      menarcheStarted: false,
      isReproductiveStage: false,
      enabledModules: ['Growth Tracking', 'Nutrition & Activity', 'Puberty Education']
    };
  }

  // 4. Adolescence (11 - 17 yrs)
  if (age <= 17) {
    // If adolescent indicates menarche has not started yet (delayed menarche)
    if (menarcheStarted === false) {
      return {
        code: 'PUBERTY',
        name: 'Puberty & Development (Awaiting Menarche)',
        description: 'Pubertal development prior to first menses. Menstrual cycle tracking is paused.',
        age,
        dob: dob ? (dob instanceof Date ? dob.toISOString().split('T')[0] : String(dob).split('T')[0]) : null,
        isPregnant: false,
        menarcheStarted: false,
        isReproductiveStage: false,
        enabledModules: ['Puberty Milestones', 'Menarche Readiness', 'Emotional Wellness']
      };
    }
    return {
      code: 'MENSTRUATING_ADOLESCENT',
      name: 'Adolescent Health',
      description: 'Cycle stabilization, teenage nutritional vitality, and menstrual habituation.',
      age,
      dob: dob ? (dob instanceof Date ? dob.toISOString().split('T')[0] : String(dob).split('T')[0]) : null,
      isPregnant: false,
      menarcheStarted: true,
      isReproductiveStage: true,
      enabledModules: ['Cycle & Periods', 'Teen Nutrition', 'Skin & Hormones', 'Personal Insights']
    };
  }

  // 5. Young Adult (18 - 24 yrs)
  if (age <= 24) {
    return {
      code: 'YOUNG_ADULT',
      name: 'Young Adult',
      description: 'Peak reproductive vitality, hormonal cycle regulation, and active wellness.',
      age,
      dob: dob ? (dob instanceof Date ? dob.toISOString().split('T')[0] : String(dob).split('T')[0]) : null,
      isPregnant: false,
      menarcheStarted: true,
      isReproductiveStage: true,
      enabledModules: ['Cycle & Periods', 'Fitness & Vitals', 'Telehealth', 'Personal Insights']
    };
  }

  // 6. Reproductive Age (25 - 44 yrs)
  if (age <= 44) {
    return {
      code: 'REPRODUCTIVE_AGE',
      name: 'Reproductive Age',
      description: 'Optimal fertility, rhythmic ovulation tracking, and hormonal homeostasis.',
      age,
      dob: dob ? (dob instanceof Date ? dob.toISOString().split('T')[0] : String(dob).split('T')[0]) : null,
      isPregnant: false,
      menarcheStarted: true,
      isReproductiveStage: true,
      enabledModules: ['Cycle & Periods', 'Fertility & Ovulation', 'Telehealth', 'Medical Vault', 'Personal Insights']
    };
  }

  // 7. Perimenopause (45 - 54 yrs)
  if (age <= 54) {
    return {
      code: 'PERIMENOPAUSE',
      name: 'Perimenopause',
      description: 'Hormonal transition window, vasomotor symptom management, and cycle variability.',
      age,
      dob: dob ? (dob instanceof Date ? dob.toISOString().split('T')[0] : String(dob).split('T')[0]) : null,
      isPregnant: false,
      menarcheStarted: true,
      isReproductiveStage: true,
      enabledModules: ['Cycle & Periods', 'Vasomotor Symptoms', 'Hormone Tracking', 'Sleep & Vitality']
    };
  }

  // 8. Menopause (55 - 64 yrs)
  if (age <= 64) {
    return {
      code: 'MENOPAUSE',
      name: 'Menopause Transition',
      description: 'Post-menstrual hormonal equilibrium, cardiovascular and bone density vitality.',
      age,
      dob: dob ? (dob instanceof Date ? dob.toISOString().split('T')[0] : String(dob).split('T')[0]) : null,
      isPregnant: false,
      menarcheStarted: true,
      isReproductiveStage: false,
      enabledModules: ['Bone Density', 'Cardiovascular Health', 'Hormone Balance', 'Healthy Living']
    };
  }

  // 9. Older Adult (65+ yrs)
  return {
    code: 'OLDER_ADULT',
    name: 'Healthy Aging',
    description: 'Long-term holistic health, cognitive vitality, and longevity support.',
    age,
    dob: dob ? (dob instanceof Date ? dob.toISOString().split('T')[0] : String(dob).split('T')[0]) : null,
    isPregnant: false,
    menarcheStarted: true,
    isReproductiveStage: false,
    enabledModules: ['Longevity & Mobility', 'Preventive Screenings', 'Cognitive Vitality', 'Vitals Tracker']
  };
}

/**
 * Calculates Gestational metrics (weeks, days, trimester, EDD, baby size) from pregnancy start (LMP).
 */
export function calculateGestationalMetrics(pregnancyStartDateStr, targetDate = new Date()) {
  const dateStr = pregnancyStartDateStr instanceof Date
    ? pregnancyStartDateStr.toISOString().split('T')[0]
    : String(pregnancyStartDateStr || '').split('T')[0];
  const lmp = new Date(dateStr + 'T00:00:00');
  const today = new Date(targetDate);
  today.setHours(0, 0, 0, 0);
  lmp.setHours(0, 0, 0, 0);

  const diffMs = today.getTime() - lmp.getTime();
  const totalDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  const gestationalWeeks = Math.floor(totalDays / 7);
  const gestationalDays = totalDays % 7;

  // Estimated Due Date: LMP + 280 days (40 gestational weeks)
  const edd = new Date(lmp);
  edd.setDate(edd.getDate() + 280);
  const eddStr = edd.toISOString().split('T')[0];
  const daysRemaining = Math.max(0, 280 - totalDays);

  // Trimester breakdown
  let trimester = 1;
  let trimesterName = 'First Trimester (Weeks 1–12)';
  if (gestationalWeeks >= 28) {
    trimester = 3;
    trimesterName = 'Third Trimester (Weeks 28–40+)';
  } else if (gestationalWeeks >= 13) {
    trimester = 2;
    trimesterName = 'Second Trimester (Weeks 13–27)';
  }

  // Fetal development baby fruit/vegetable size comparisons
  const babySizes = [
    { maxWeek: 4, size: 'Poppy Seed', metric: '1 mm', icon: '🌱' },
    { maxWeek: 6, size: 'Sweet Pea', metric: '5 mm', icon: '🫛' },
    { maxWeek: 8, size: 'Raspberry', metric: '1.6 cm', icon: '🫐' },
    { maxWeek: 10, size: 'Strawberry', metric: '3.1 cm', icon: '🍓' },
    { maxWeek: 12, size: 'Plum', metric: '5.4 cm', icon: '🍑' },
    { maxWeek: 14, size: 'Lemon', metric: '8.7 cm', icon: '🍋' },
    { maxWeek: 16, size: 'Avocado', metric: '11.6 cm', icon: '🥑' },
    { maxWeek: 18, size: 'Bell Pepper', metric: '14.2 cm', icon: '🫑' },
    { maxWeek: 20, size: 'Banana', metric: '25.6 cm', icon: '🍌' },
    { maxWeek: 22, size: 'Papaya', metric: '27.8 cm', icon: '🥭' },
    { maxWeek: 24, size: 'Cantaloupe', metric: '30.0 cm', icon: '🍈' },
    { maxWeek: 26, size: 'Zucchini', metric: '35.6 cm', icon: '🥒' },
    { maxWeek: 28, size: 'Eggplant', metric: '37.6 cm', icon: '🍆' },
    { maxWeek: 30, size: 'Cabbage', metric: '39.9 cm', icon: '🥬' },
    { maxWeek: 32, size: 'Squash', metric: '42.4 cm', icon: '🎃' },
    { maxWeek: 34, size: 'Pineapple', metric: '45.0 cm', icon: '🍍' },
    { maxWeek: 36, size: 'Honeydew Melon', metric: '47.4 cm', icon: '🍈' },
    { maxWeek: 38, size: 'Winter Melon', metric: '49.8 cm', icon: '🍉' },
    { maxWeek: 42, size: 'Watermelon / Pumpkin', metric: '51.2 cm', icon: '🍉' },
  ];

  const matchedSize = babySizes.find(b => gestationalWeeks <= b.maxWeek) || babySizes[babySizes.length - 1];

  // Clinical prenatal milestone checklist
  const prenatalChecklist = [
    { id: 1, week: '8-12w', title: 'First Trimester Ultrasound & Viability Screen', completed: gestationalWeeks >= 12 },
    { id: 2, week: '10-13w', title: 'Nuchal Translucency & Cell-Free DNA Screen', completed: gestationalWeeks >= 13 },
    { id: 3, week: '18-22w', title: 'Anatomy Ultrasound & Fetal Echocardiogram', completed: gestationalWeeks >= 22 },
    { id: 4, week: '24-28w', title: 'Gestational Diabetes Glucose Screen', completed: gestationalWeeks >= 28 },
    { id: 5, week: '28-36w', title: 'Daily Fetal Movement & Kick Counting', completed: gestationalWeeks >= 28 },
    { id: 6, week: '35-37w', title: 'Group B Strep (GBS) Screening & Birth Plan', completed: gestationalWeeks >= 37 },
  ];

  return {
    isPregnant: true,
    pregnancyStartDate: dateStr,
    gestationalWeeks,
    gestationalDays,
    totalDaysPregnant: totalDays,
    edd: eddStr,
    daysRemaining,
    trimester,
    trimesterName,
    babySize: `${matchedSize.size} (~${matchedSize.metric})`,
    babyIcon: matchedSize.icon,
    prenatalChecklist,
    phaseCode: 'PREGNANCY',
    phaseName: 'Maternity Journey (Menstrual Cycle Paused)',
    phaseBadge: '🤰 Maternity Mode (Cycle Paused)',
    phaseColor: 'purple',
    phaseDescription: `You are in Week ${gestationalWeeks}, Day ${gestationalDays} (${trimesterName}). Menstrual cycle predictions are paused while your body nurtures fetal growth.`,
    hormonalState: 'Elevated hCG, Progesterone & Placental Lactogen',
    nextPeriodDateStr: 'Cycle Paused',
    fertileWindowStr: 'Maternity Active'
  };
}
