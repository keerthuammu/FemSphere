import pool from '../config/db.js';
import fs from 'fs';
import path from 'path';

async function seedDatabase() {
  console.log('🚀 Connecting to FemSphere PostgreSQL database...');
  const client = await pool.connect();

  try {
    console.log('✅ Connected successfully!');
    await client.query('BEGIN');

    // 1. Schema Alignment
    console.log('🔧 Ensuring schema columns are up to date...');
    await client.query(`
      -- medical_records
      ALTER TABLE medical_records ADD COLUMN IF NOT EXISTS title VARCHAR(255);
      ALTER TABLE medical_records ADD COLUMN IF NOT EXISTS category VARCHAR(100);
      ALTER TABLE medical_records ADD COLUMN IF NOT EXISTS description TEXT;
      ALTER TABLE medical_records ADD COLUMN IF NOT EXISTS is_scanned BOOLEAN DEFAULT FALSE;
      ALTER TABLE medical_records ADD COLUMN IF NOT EXISTS scan_results JSONB;
      ALTER TABLE medical_records ADD COLUMN IF NOT EXISTS dependent_name VARCHAR(100);
      ALTER TABLE medical_records ADD COLUMN IF NOT EXISTS file_data TEXT;

      -- appointments
      ALTER TABLE appointments ADD COLUMN IF NOT EXISTS type VARCHAR(100) DEFAULT 'Virtual Telehealth';

      -- consultation_notes
      ALTER TABLE consultation_notes ADD COLUMN IF NOT EXISTS appointment_id INT REFERENCES appointments(id) ON DELETE SET NULL;
      ALTER TABLE consultation_notes ADD COLUMN IF NOT EXISTS prescribed_exercises TEXT;

      -- health_tracker
      ALTER TABLE health_tracker ADD COLUMN IF NOT EXISTS heart_rate INT;
      ALTER TABLE health_tracker ADD COLUMN IF NOT EXISTS blood_pressure VARCHAR(50);
      ALTER TABLE health_tracker ADD COLUMN IF NOT EXISTS steps INT;
      ALTER TABLE health_tracker ADD COLUMN IF NOT EXISTS calories_burned INT;
      ALTER TABLE health_tracker ADD COLUMN IF NOT EXISTS distance_km NUMERIC(6,2);
      ALTER TABLE health_tracker ADD COLUMN IF NOT EXISTS food_meals TEXT;
      ALTER TABLE health_tracker ADD COLUMN IF NOT EXISTS calories_intake INT;
      ALTER TABLE health_tracker ADD COLUMN IF NOT EXISTS mood VARCHAR(50);
      ALTER TABLE health_tracker ADD COLUMN IF NOT EXISTS notes TEXT;
    `);

    // Fetch primary user and doctor IDs
    const elenaRes = await client.query("SELECT id FROM users WHERE email = 'elena.rostova@femsphere.health'");
    const doctorRes = await client.query("SELECT d.id as doc_id, u.id as doc_user_id FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'dr.jenkins@femsphere.health'");
    const caregiverRes = await client.query("SELECT c.id as cg_id, u.id as cg_user_id FROM caregivers c JOIN users u ON c.user_id = u.id WHERE u.email = 'caregiver@femsphere.health'");
    const adminRes = await client.query("SELECT id FROM users WHERE email = 'admin@femsphere.health'");
    const dependentRes = await client.query("SELECT id FROM dependents WHERE full_name = 'Maya Vance'");

    if (elenaRes.rows.length === 0 || doctorRes.rows.length === 0) {
      throw new Error('Base users or doctor record missing from database. Please check users table.');
    }

    const elenaId = elenaRes.rows[0].id; // 2
    const doctorId = doctorRes.rows[0].doc_id; // 1
    const doctorUserId = doctorRes.rows[0].doc_user_id; // 4
    const caregiverUserId = caregiverRes.rows[0]?.cg_user_id || 3;
    const adminId = adminRes.rows[0]?.id || 1;
    const dependentId = dependentRes.rows[0]?.id || 1;

    console.log(`👤 Patient: Elena (id: ${elenaId}), Doctor: Dr. Jenkins (doc_id: ${doctorId}, user_id: ${doctorUserId})`);

    // 2. Appointments Seeding
    console.log('📅 Seeding appointments...');
    await client.query('DELETE FROM appointments WHERE patient_id = $1', [elenaId]);
    const appointmentsData = [
      {
        date: '2026-10-12',
        time: '10:00 AM',
        reason: 'Annual Reproductive Wellness & Hormone Consultation',
        status: 'Scheduled',
        type: 'Virtual Telehealth'
      },
      {
        date: '2026-10-16',
        time: '02:30 PM',
        reason: 'Routine Pelvic Ultrasound Review',
        status: 'Accepted',
        type: 'In-Clinic Ultrasound'
      },
      {
        date: '2026-09-28',
        time: '11:00 AM',
        reason: 'Initial Cycle Symptoms & Iron Profile Review',
        status: 'Completed',
        type: 'Virtual Telehealth'
      }
    ];

    const insertedAppointments = [];
    for (const apt of appointmentsData) {
      const res = await client.query(
        `INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, status, type)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (doctor_id, appointment_date, appointment_time)
         DO UPDATE SET reason = EXCLUDED.reason, status = EXCLUDED.status, type = EXCLUDED.type
         RETURNING id`,
        [elenaId, doctorId, apt.date, apt.time, apt.reason, apt.status, apt.type]
      );
      insertedAppointments.push(res.rows[0].id);
    }

    const pastAptId = insertedAppointments[2] || insertedAppointments[0];

    // 3. Consultation Notes Seeding
    console.log('🩺 Seeding doctor consultation notes...');
    await client.query('DELETE FROM consultation_notes WHERE patient_id = $1', [elenaId]);
    const prescribedMedications = [
      { medicine: 'Ferrous Fumarate', dosage: '200 mg', frequency: 'Once daily with food', duration: '30 days' },
      { medicine: 'Vitamin C (Ascorbic Acid)', dosage: '500 mg', frequency: 'With iron supplement to aid absorption', duration: '30 days' },
      { medicine: 'Ibuprofen', dosage: '400 mg', frequency: 'As needed for acute cramps during menses', duration: '5 days' }
    ];

    const prescribedExercises = [
      { key: 'kegel_basics', name: 'Pelvic Floor Kegels', sets: '3 sets of 10 contractions (5s hold)', frequency: 'Daily Morning & Evening' },
      { key: 'pelvic_tilts', name: 'Gentle Pelvic Tilts', sets: '2 sets of 12 reps on yoga mat', frequency: 'Daily' },
      { key: 'cat_cow', name: 'Cat-Cow Mobility Stretch', sets: '5 minutes mindful gentle flow', frequency: 'Evening before bed' }
    ];

    const noteRes = await client.query(
      `INSERT INTO consultation_notes (
        doctor_id, patient_id, appointment_id, diagnosis, advice, prescription_notes, prescribed_exercises
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [
        doctorId,
        elenaId,
        pastAptId,
        'Mild Dysmenorrhea & Borderline Serum Ferritin Depletion',
        'Patient reports mild cramping during cycle day 1-2. Vitals normal. Recommend dietary iron enhancement paired with citrus/ascorbic acid. Daily hydration target: 2.5 Liters. Regular adherence to pelvic floor conditioning program.',
        JSON.stringify(prescribedMedications),
        JSON.stringify(prescribedExercises)
      ]
    );
    const consultationId = noteRes.rows[0].id;

    // 4. Patient Physical Therapy Exercise Logs Seeding
    console.log('🧘 Seeding patient exercise logs...');
    await client.query('DELETE FROM patient_exercise_logs WHERE user_id = $1', [elenaId]);
    const exerciseDates = [
      '2026-10-04', '2026-10-05', '2026-10-06', '2026-10-07', '2026-10-08', '2026-10-09'
    ];
    for (const d of exerciseDates) {
      for (const ex of prescribedExercises) {
        await client.query(
          `INSERT INTO patient_exercise_logs (user_id, consultation_id, exercise_name, exercise_key, completed_date, completed)
           VALUES ($1, $2, $3, $4, $5::date, TRUE)
           ON CONFLICT (user_id, exercise_key, completed_date) DO UPDATE SET completed = TRUE`,
          [elenaId, consultationId, ex.name, ex.key, d]
        );
      }
    }

    // 5. Diagnostic Medical Records with OCR Biomarkers
    console.log('📑 Seeding medical records & OCR biomarkers...');
    await client.query('DELETE FROM medical_records WHERE user_id = $1', [elenaId]);

    // Create dummy files on disk if they don't exist
    const recordsDir = path.join(process.cwd(), 'uploads', 'records');
    if (!fs.existsSync(recordsDir)) {
      fs.mkdirSync(recordsDir, { recursive: true });
    }

    const records = [
      {
        fileName: 'Metabolic_Lipid_Panel_2026.pdf',
        title: 'Complete Metabolic & Lipid Chemistry Panel',
        category: 'Lab Results',
        description: 'Comprehensive metabolic chemistry and lipid biomarker diagnostic analysis.',
        scanResults: {
          doctorName: 'Dr. Sarah Jenkins, MD',
          labName: 'Metropolitan Clinical Laboratories',
          keyBiomarkers: [
            { name: 'Total Cholesterol', value: '184 mg/dL', status: 'Optimal', range: '< 200 mg/dL' },
            { name: 'HDL (Good) Cholesterol', value: '58 mg/dL', status: 'Optimal', range: '> 50 mg/dL' },
            { name: 'LDL (Bad) Cholesterol', value: '106 mg/dL', status: 'Normal', range: '< 100 mg/dL' },
            { name: 'Triglycerides', value: '120 mg/dL', status: 'Optimal', range: '< 150 mg/dL' },
            { name: 'Fasting Blood Sugar', value: '92 mg/dL', status: 'Optimal', range: '70 - 99 mg/dL' },
            { name: 'Estimated GFR', value: '104 mL/min', status: 'Optimal', range: '> 90 mL/min' }
          ],
          aiSummary: 'Metabolic panel demonstrates optimal glucose regulation, protective HDL ratio, and healthy kidney clearance metrics.',
          riskLevel: 'Optimal',
          recommendations: 'Maintain current active lifestyle with omega-3 rich Mediterranean dietary intake.'
        }
      },
      {
        fileName: 'CBC_Ferritin_Panel_2026.pdf',
        title: 'Complete Blood Count & Ferritin Panel',
        category: 'Blood Work',
        description: 'Complete hemogram assessing erythrocyte indices, immune cells, and iron stores.',
        scanResults: {
          doctorName: 'Dr. Sarah Jenkins, MD',
          labName: 'Central Hematology Diagnostics',
          keyBiomarkers: [
            { name: 'Hemoglobin', value: '13.2 g/dL', status: 'Normal', range: '12.0 - 15.5 g/dL' },
            { name: 'Hematocrit', value: '39.8 %', status: 'Normal', range: '36.0 - 46.0 %' },
            { name: 'White Blood Cell Count', value: '6.4 x10³/µL', status: 'Optimal', range: '4.5 - 11.0 x10³/µL' },
            { name: 'Platelets', value: '260 x10³/µL', status: 'Optimal', range: '150 - 450 x10³/µL' },
            { name: 'Serum Ferritin', value: '22 ng/mL', status: 'Notice', range: '15 - 150 ng/mL' },
            { name: 'Vitamin D3 (25-OH)', value: '36 ng/mL', status: 'Optimal', range: '30 - 100 ng/mL' }
          ],
          aiSummary: 'Robust cellular immune profile and normal hemoglobin. Serum ferritin is in the lower tertile (22 ng/mL), warranting proactive nutritional iron replenishment.',
          riskLevel: 'Notice',
          recommendations: 'Dietary iron enhancement initiated with physician follow-up recheck scheduled in 90 days.'
        }
      },
      {
        fileName: 'Pelvic_Ultrasound_Scan_2026.pdf',
        title: 'High-Resolution Pelvic Ultrasound',
        category: 'Imaging',
        description: 'Transabdominal and endovaginal sonogram evaluating uterine and ovarian morphology.',
        scanResults: {
          doctorName: 'Dr. Sarah Jenkins, MD',
          labName: 'Metropolitan Women’s Diagnostic Imaging',
          keyBiomarkers: [
            { name: 'Endometrial Thickness', value: '7.2 mm', status: 'Normal', range: '4.0 - 12.0 mm' },
            { name: 'Uterine Length', value: '7.6 cm', status: 'Normal', range: '6.0 - 9.0 cm' },
            { name: 'Right Ovarian Volume', value: '5.8 mL', status: 'Normal', range: '3.0 - 9.0 mL' },
            { name: 'Left Ovarian Volume', value: '6.1 mL', status: 'Normal', range: '3.0 - 9.0 mL' }
          ],
          aiSummary: 'Pelvic ultrasound demonstrates normal uterine dimensions with homogeneous myometrium. Both ovaries show healthy follicular architecture without cysts or lesions.',
          riskLevel: 'Optimal',
          recommendations: 'No structural etiology identified. Routine clinical follow-up as scheduled.'
        }
      }
    ];

    for (const rec of records) {
      const diskPath = path.join(recordsDir, rec.fileName);
      if (!fs.existsSync(diskPath)) {
        fs.writeFileSync(diskPath, `%PDF-1.4 FemSphere Simulated Medical Diagnostic Record: ${rec.title}`);
      }

      await client.query(
        `INSERT INTO medical_records (
          user_id, file_name, file_type, file_url, file_size_bytes, title, category, description, is_scanned, scan_results
        ) VALUES ($1, $2, 'PDF', $3, $4, $5, $6, $7, TRUE, $8)`,
        [
          elenaId,
          rec.fileName,
          `/uploads/records/${rec.fileName}`,
          2150000,
          rec.title,
          rec.category,
          rec.description,
          JSON.stringify(rec.scanResults)
        ]
      );
    }

    // 6. Caregiver Dependent Vaccinations & Medications (Maya Vance)
    console.log('💉 Seeding dependent vaccinations & medications...');
    await client.query('DELETE FROM vaccinations WHERE dependent_id = $1', [dependentId]);
    await client.query('DELETE FROM medications WHERE dependent_id = $1', [dependentId]);

    const vaccinations = [
      { name: 'MMR (Measles, Mumps, Rubella)', administered: '2024-06-20', nextDue: '2026-06-20' },
      { name: 'DTaP (Diphtheria, Tetanus, Pertussis)', administered: '2024-08-15', nextDue: '2026-08-15' },
      { name: 'Polio (Inactivated IPV)', administered: '2023-12-10', nextDue: null },
      { name: 'Varicella (Chickenpox)', administered: '2024-07-05', nextDue: '2026-07-05' },
      { name: 'Hepatitis A Booster', administered: '2024-02-18', nextDue: null },
      { name: 'Pediatric Seasonal Influenza 2026', administered: '2026-09-15', nextDue: '2027-09-15' }
    ];

    for (const vac of vaccinations) {
      await client.query(
        `INSERT INTO vaccinations (dependent_id, vaccine_name, administered_date, next_due_date)
         VALUES ($1, $2, $3::date, $4::date)`,
        [dependentId, vac.name, vac.administered, vac.nextDue]
      );
    }

    const medications = [
      { name: 'Pediatric Multivitamin + Vitamin D3', dosage: '1 mL (400 IU)', time: '08:00 AM Daily with breakfast' },
      { name: 'Cetirizine Syrup (Pediatric)', dosage: '2.5 mg (5 mL)', time: '07:30 PM As needed for seasonal allergies' },
      { name: 'Zinc Sulfate Pediatric Solution', dosage: '10 mg daily', time: '12:30 PM with lunch' }
    ];

    for (const med of medications) {
      await client.query(
        `INSERT INTO medications (dependent_id, medicine_name, dosage, schedule_time)
         VALUES ($1, $2, $3, $4)`,
        [dependentId, med.name, med.dosage, med.time]
      );
    }

    // 7. Daily Health Tracker & Vitals (14 Days)
    console.log('📊 Seeding daily health vitals & lifestyle tracker...');
    await client.query('DELETE FROM health_tracker WHERE user_id = $1', [elenaId]);

    const vitalsData = [
      { date: '2026-09-26', weight: 58.6, water: 2.2, sleep: 7.5, exercise: 30, hr: 72, bp: '118/76', steps: 8400, cal: 1820, dist: 5.8, food: 'Oatmeal with blueberries, quinoa salad, steamed salmon', calIn: 1880, mood: 'Balanced', notes: 'Great energy after morning stroll.' },
      { date: '2026-09-27', weight: 58.5, water: 2.4, sleep: 7.8, exercise: 35, hr: 70, bp: '116/74', steps: 9100, cal: 1910, dist: 6.3, food: 'Greek yogurt with almonds, lentil soup, roasted veggies', calIn: 1920, mood: 'Calm', notes: 'Hydration goal achieved effortlessly.' },
      { date: '2026-09-28', weight: 58.5, water: 2.5, sleep: 8.0, exercise: 40, hr: 69, bp: '118/76', steps: 9800, cal: 1980, dist: 6.9, food: 'Chia pudding, grilled chicken bowl, avocado salad', calIn: 1950, mood: 'Energetic', notes: 'Telehealth appointment with Dr. Jenkins completed.' },
      { date: '2026-09-29', weight: 58.4, water: 2.6, sleep: 7.6, exercise: 30, hr: 71, bp: '117/75', steps: 8600, cal: 1850, dist: 6.0, food: 'Spinach protein smoothie, brown rice with tofu, walnuts', calIn: 1870, mood: 'Focused', notes: 'Started prescribed iron and vitamin C.' },
      { date: '2026-09-30', weight: 58.3, water: 2.5, sleep: 7.9, exercise: 45, hr: 68, bp: '115/74', steps: 10400, cal: 2050, dist: 7.2, food: 'Scrambled eggs with spinach, quinoa bowl, citrus fruit', calIn: 1940, mood: 'Happy', notes: 'Brisk 45m outdoor walk.' },
      { date: '2026-10-01', weight: 58.4, water: 2.3, sleep: 7.4, exercise: 25, hr: 73, bp: '119/77', steps: 7900, cal: 1780, dist: 5.4, food: 'Berry smoothie bowl, vegetable wrap, herbal tea', calIn: 1850, mood: 'Calm', notes: 'Yoga and pelvic floor conditioning.' },
      { date: '2026-10-02', weight: 58.3, water: 2.5, sleep: 8.1, exercise: 35, hr: 70, bp: '116/75', steps: 9300, cal: 1920, dist: 6.5, food: 'Avocado toast with eggs, Mediterranean chickpea salad', calIn: 1900, mood: 'Refreshed', notes: 'Restful 8 hours sleep.' },
      { date: '2026-10-03', weight: 58.5, water: 2.1, sleep: 6.8, exercise: 20, hr: 75, bp: '121/78', steps: 6800, cal: 1690, dist: 4.7, food: 'Oatmeal, mixed greens salad, brown rice with beans', calIn: 1820, mood: 'Tired', notes: 'Slight midday headache, improved with water.' },
      { date: '2026-10-04', weight: 58.4, water: 2.7, sleep: 7.8, exercise: 30, hr: 71, bp: '118/76', steps: 8700, cal: 1860, dist: 6.1, food: 'Greek yogurt with chia seeds, grilled salmon and broccoli', calIn: 1890, mood: 'Balanced', notes: 'Full hydration recovery.' },
      { date: '2026-10-05', weight: 58.3, water: 2.6, sleep: 7.7, exercise: 40, hr: 69, bp: '116/74', steps: 9900, cal: 1990, dist: 6.9, food: 'Spinach egg wrap, quinoa salad with chickpeas and lemon', calIn: 1920, mood: 'Energetic', notes: 'Core and pelvic stretches completed.' },
      { date: '2026-10-06', weight: 58.6, water: 2.4, sleep: 7.3, exercise: 25, hr: 74, bp: '120/77', steps: 7600, cal: 1740, dist: 5.2, food: 'Warm oatmeal with walnuts, bone broth soup, sweet potato', calIn: 1860, mood: 'Mild Fatigue', notes: 'Day 1 luteal cramping, Chamomile tea helped.' },
      { date: '2026-10-07', weight: 58.5, water: 2.5, sleep: 7.6, exercise: 30, hr: 72, bp: '118/76', steps: 8300, cal: 1820, dist: 5.7, food: 'Citrus smoothie, turkey and avocado salad, steamed veggies', calIn: 1880, mood: 'Calm', notes: 'Back fatigue eased with pelvic tilts.' },
      { date: '2026-10-08', weight: 58.4, water: 2.8, sleep: 8.0, exercise: 35, hr: 68, bp: '115/74', steps: 9500, cal: 1940, dist: 6.6, food: 'Berry chia bowl, salmon fillet with asparagus and quinoa', calIn: 1930, mood: 'Balanced', notes: 'Feeling strong and grounded.' },
      { date: '2026-10-09', weight: 58.3, water: 2.6, sleep: 7.9, exercise: 30, hr: 70, bp: '117/75', steps: 8900, cal: 1880, dist: 6.2, food: 'High-protein breakfast bowl, lentil dal with brown rice', calIn: 1910, mood: 'Optimal', notes: 'All morning exercises and vitals tracked.' }
    ];

    for (const v of vitalsData) {
      await client.query(
        `INSERT INTO health_tracker (
          user_id, log_date, weight_kg, water_intake_liters, sleep_hours, exercise_minutes,
          heart_rate, blood_pressure, steps, calories_burned, distance_km, food_meals,
          calories_intake, mood, notes
        ) VALUES ($1, $2::date, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        ON CONFLICT (user_id, log_date) DO UPDATE SET
          weight_kg = EXCLUDED.weight_kg,
          water_intake_liters = EXCLUDED.water_intake_liters,
          sleep_hours = EXCLUDED.sleep_hours,
          exercise_minutes = EXCLUDED.exercise_minutes,
          heart_rate = EXCLUDED.heart_rate,
          blood_pressure = EXCLUDED.blood_pressure,
          steps = EXCLUDED.steps,
          calories_burned = EXCLUDED.calories_burned,
          distance_km = EXCLUDED.distance_km,
          food_meals = EXCLUDED.food_meals,
          calories_intake = EXCLUDED.calories_intake,
          mood = EXCLUDED.mood,
          notes = EXCLUDED.notes`,
        [
          elenaId, v.date, v.weight, v.water, v.sleep, v.exercise,
          v.hr, v.bp, v.steps, v.cal, v.dist, v.food,
          v.calIn, v.mood, v.notes
        ]
      );
    }

    // 8. Symptoms Seeding
    console.log('🩺 Seeding symptom logs...');
    await client.query('DELETE FROM symptoms WHERE user_id = $1', [elenaId]);
    const symptoms = [
      { name: 'Mild Pelvic Cramping', severity: 'Moderate', onset: '2026-10-06', notes: 'Cycle transition day. Relieved with warm chamomile tea and prescribed pelvic floor stretches.' },
      { name: 'Lower Back Muscle Fatigue', severity: 'Low', onset: '2026-10-07', notes: 'Following afternoon computer work. Improved promptly after 10 gentle pelvic tilts.' },
      { name: 'Mild Dehydration Headache', severity: 'Low', onset: '2026-10-03', notes: 'Temporary tension after busy morning, resolved after drinking 500 mL water.' },
      { name: 'Peak Follicular Vitality', severity: 'Low', onset: '2026-09-29', notes: 'High sustained mental focus and athletic stamina.' }
    ];

    for (const sym of symptoms) {
      await client.query(
        `INSERT INTO symptoms (user_id, symptom_name, severity, onset_date, notes)
         VALUES ($1, $2, $3, $4::date, $5)`,
        [elenaId, sym.name, sym.severity, sym.onset, sym.notes]
      );
    }

    // 9. Educational Health Articles
    console.log('📚 Seeding health articles...');
    await client.query('DELETE FROM health_articles');
    const articles = [
      {
        title: 'Optimizing Hormonal Harmony Across Your Menstrual Cycle',
        category: 'Hormonal Health',
        description: 'Understand the 4 phases of your menstrual cycle — Menstrual, Follicular, Ovulatory, and Luteal — and how aligning nutrition, exercise intensity, and sleep cycles with each phase can drastically reduce PMS symptoms, boost sustained daily energy, and improve reproductive wellness.',
        imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'The Clinical Science of Iron & Micronutrient Absorption',
        category: 'Nutrition & Vitals',
        description: 'Iron deficiency is one of the most underdiagnosed causes of chronic fatigue and brain fog in women of reproductive age. Discover key food pairings (like vitamin C with non-heme iron) and how to protect your ferritin stores throughout your life stages.',
        imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Cardiovascular Fitness & Wearable Heart Rate Variability (HRV)',
        category: 'Wearables & Tech',
        description: 'How continuous heart rate variability (HRV) and resting pulse rate telemetry track autonomic nervous system recovery, nocturnal stress, and cycle-phase cardiovascular shifts.',
        imageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Pelvic Floor Health & Physical Therapy Fundamentals',
        category: 'Physical Wellness',
        description: 'Practical clinical guide to pelvic floor biomechanics, targeted Kegel endurance training, and posture alignment routines recommended by physical therapy specialists.',
        imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80'
      }
    ];

    for (const art of articles) {
      await client.query(
        `INSERT INTO health_articles (author_admin_id, title, category, description, image_url)
         VALUES ($1, $2, $3, $4, $5)`,
        [adminId, art.title, art.category, art.description, art.imageUrl]
      );
    }

    // 10. Smartwatch Device & Health Telemetry Data
    console.log('⌚ Seeding smartwatch devices & health telemetry...');
    await client.query('DELETE FROM smartwatch_health_data WHERE user_id = $1', [elenaId]);
    await client.query('DELETE FROM smartwatch_devices WHERE user_id = $1', [elenaId]);

    const deviceRes = await client.query(
      `INSERT INTO smartwatch_devices (
        user_id, device_name, device_model, device_identifier, brand, device_type, capabilities,
        firmware_version, connection_status, battery_level, last_connected_at, last_synced_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id`,
      [
        elenaId,
        'Apple Watch Series 9',
        'A2980',
        'BLE-AW9-ELENA-01',
        'APPLE_WATCH',
        'SMARTWATCH',
        JSON.stringify({ heart_rate: true, spo2: true, hrv: true, ecg: true, sleep_tracking: true, stress: true }),
        'watchOS 10.4.1',
        'CONNECTED',
        88
      ]
    );
    const deviceId = deviceRes.rows[0].id;

    const smartwatchTelemetry = [
      { recTime: '2026-10-09 08:30:00+00', hr: 71, rhr: 62, steps: 8900, cal: 420, dist: 6200, sleep: 474, spo2: 99, hrv: 54, stress: 21, temp: 36.6, bpSys: 117, bpDia: 75, resp: 14.2 },
      { recTime: '2026-10-08 08:30:00+00', hr: 68, rhr: 61, steps: 9500, cal: 460, dist: 6600, sleep: 480, spo2: 98, hrv: 58, stress: 19, temp: 36.5, bpSys: 115, bpDia: 74, resp: 14.0 },
      { recTime: '2026-10-07 08:30:00+00', hr: 72, rhr: 63, steps: 8300, cal: 410, dist: 5700, sleep: 456, spo2: 99, hrv: 52, stress: 24, temp: 36.6, bpSys: 118, bpDia: 76, resp: 14.5 },
      { recTime: '2026-10-06 08:30:00+00', hr: 74, rhr: 64, steps: 7600, cal: 380, dist: 5200, sleep: 438, spo2: 98, hrv: 49, stress: 28, temp: 36.7, bpSys: 120, bpDia: 77, resp: 14.8 },
      { recTime: '2026-10-05 08:30:00+00', hr: 69, rhr: 61, steps: 9900, cal: 470, dist: 6900, sleep: 462, spo2: 99, hrv: 56, stress: 20, temp: 36.5, bpSys: 116, bpDia: 74, resp: 14.1 }
    ];

    for (const t of smartwatchTelemetry) {
      await client.query(
        `INSERT INTO smartwatch_health_data (
          user_id, device_id, recorded_at, heart_rate, resting_heart_rate, steps, calories,
          distance_meters, sleep_duration_minutes, spo2, hrv_rmssd, stress_score, body_temperature,
          blood_pressure_systolic, blood_pressure_diastolic, respiratory_rate, activity_type, source
        ) VALUES ($1, $2, $3::timestamptz, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, 'Daily Sync', 'Apple HealthKit BLE')`,
        [
          elenaId, deviceId, t.recTime, t.hr, t.rhr, t.steps, t.cal,
          t.dist, t.sleep, t.spo2, t.hrv, t.stress, t.temp,
          t.bpSys, t.bpDia, t.resp
        ]
      );
    }

    // 11. User Life Stages
    console.log('🌱 Seeding user life stages...');
    await client.query('DELETE FROM user_life_stages WHERE user_id IN ($1, $2)', [elenaId, caregiverUserId]);
    await client.query(
      `INSERT INTO user_life_stages (user_id, life_stage_code, is_current, manually_set, enabled_modules)
       VALUES ($1, 'REPRODUCTIVE_AGE', TRUE, TRUE, $2::jsonb)`,
      [elenaId, JSON.stringify(['General Health', 'Cycle & Periods', 'Fertility Tracker', 'Nutrition & Vitals', 'Telehealth Care', 'Personal AI Twin'])]
    );
    await client.query(
      `INSERT INTO user_life_stages (user_id, life_stage_code, is_current, manually_set, enabled_modules)
       VALUES ($1, 'REPRODUCTIVE_AGE', TRUE, TRUE, $2::jsonb)`,
      [caregiverUserId, JSON.stringify(['Partner Support', 'Family Wellness'])]
    );

    // 12. Relationships & Consents
    console.log('🤝 Seeding relationships & consent permissions...');
    await client.query('DELETE FROM permissions WHERE consent_id IN (SELECT id FROM consents WHERE owner_user_id = $1)', [elenaId]);
    await client.query('DELETE FROM consents WHERE owner_user_id = $1', [elenaId]);
    await client.query('DELETE FROM relationships WHERE owner_user_id = $1', [elenaId]);

    // Partner relationship
    await client.query(
      `INSERT INTO relationships (owner_user_id, related_user_id, relationship_type, status)
       VALUES ($1, $2, 'Partner', 'Active')`,
      [elenaId, caregiverUserId]
    );

    const partnerConsent = await client.query(
      `INSERT INTO consents (owner_user_id, related_user_id, consent_type, status)
       VALUES ($1, $2, 'PARTNER_SHARING', 'Granted') RETURNING id`,
      [elenaId, caregiverUserId]
    );

    const partnerPerms = ['Cycle', 'Appointments', 'Wearables', 'Mood'];
    for (const p of partnerPerms) {
      await client.query(
        `INSERT INTO permissions (consent_id, resource, action, allowed)
         VALUES ($1, $2, 'Read', TRUE)`,
        [partnerConsent.rows[0].id, p]
      );
    }

    // Doctor relationship
    await client.query(
      `INSERT INTO relationships (owner_user_id, related_user_id, relationship_type, status)
       VALUES ($1, $2, 'Doctor', 'Active')`,
      [elenaId, doctorUserId]
    );

    const doctorConsent = await client.query(
      `INSERT INTO consents (owner_user_id, related_user_id, consent_type, status)
       VALUES ($1, $2, 'CLINICAL_SHARE', 'Granted') RETURNING id`,
      [elenaId, doctorUserId]
    );

    const docPerms = ['MedicalRecords', 'Symptoms', 'Appointments', 'Medications'];
    for (const p of docPerms) {
      await client.query(
        `INSERT INTO permissions (consent_id, resource, action, allowed)
         VALUES ($1, $2, 'Read', TRUE)`,
        [doctorConsent.rows[0].id, p]
      );
    }

    // 13. AI Insights
    console.log('🤖 Seeding AI Health Twin insights...');
    await client.query('DELETE FROM ai_insights WHERE user_id = $1', [elenaId]);
    const insights = [
      {
        type: 'DAILY',
        title: 'Cycle Energy Optimization',
        content: 'Your resting heart rate (62 bpm) and sleep quality (7.9 hrs) are consistent. As you transition across the luteal window, maintain hydration and magnesium-rich nutrition.',
        severity: 'Normal'
      },
      {
        type: 'DOCTOR_PREP',
        title: 'Upcoming Appointment Readiness',
        content: 'Your virtual consultation with Dr. Sarah Jenkins is scheduled for Monday. All recent lab panels (CBC, Metabolic Panel, Pelvic Ultrasound) have been indexed for quick review.',
        severity: 'Informational'
      },
      {
        type: 'ATTENTION_FLAG',
        title: 'Borderline Serum Ferritin Notice',
        content: 'Your diagnostic hemogram showed serum ferritin at 22 ng/mL. Continuing prescribed iron supplementation with vitamin C will optimize oxygenation and recovery.',
        severity: 'Notice'
      }
    ];

    for (const ins of insights) {
      await client.query(
        `INSERT INTO ai_insights (user_id, insight_type, title, content, severity)
         VALUES ($1, $2, $3, $4, $5)`,
        [elenaId, ins.type, ins.title, ins.content, ins.severity]
      );
    }

    // 14. Health Events (Unified Timeline)
    console.log('🗓️ Seeding health timeline events...');
    await client.query('DELETE FROM health_events WHERE user_id = $1', [elenaId]);
    const events = [
      { type: 'Cycle', date: '2026-09-22', title: 'Menstrual Cycle Phase Commenced', meta: { duration: 5, flow: 'Moderate' }, src: 'User' },
      { type: 'MedicalRecord', date: '2026-09-28', title: 'Diagnostic Chemistry Panel Uploaded', meta: { file: 'Metabolic_Lipid_Panel_2026.pdf' }, src: 'Doctor' },
      { type: 'Appointment', date: '2026-09-28', title: 'Telehealth Consultation with Dr. Jenkins', meta: { doc: 'Dr. Sarah Jenkins, MD' }, src: 'Doctor' },
      { type: 'Symptom', date: '2026-10-06', title: 'Mild Pelvic Cramping Recorded', meta: { severity: 'Moderate' }, src: 'User' },
      { type: 'Appointment', date: '2026-10-12', title: 'Scheduled: Reproductive Wellness Review', meta: { time: '10:00 AM' }, src: 'User' }
    ];

    for (const ev of events) {
      await client.query(
        `INSERT INTO health_events (user_id, event_type, event_date, title, metadata, source)
         VALUES ($1, $2, $3::date, $4, $5::jsonb, $6)`,
        [elenaId, ev.type, ev.date, ev.title, JSON.stringify(ev.meta), ev.src]
      );
    }

    // 15. User Notifications
    console.log('🔔 Seeding notifications...');
    await client.query('DELETE FROM notifications WHERE user_id = $1', [elenaId]);
    const notifications = [
      {
        title: 'Upcoming Telehealth Consultation',
        message: 'Your appointment with Dr. Sarah Jenkins is confirmed for Monday, Oct 12 at 10:00 AM.',
        type: 'APPOINTMENT'
      },
      {
        title: 'Lab Report Verified by AI Health Twin',
        message: 'Complete Metabolic & Lipid Chemistry Panel results have been verified and summarized.',
        type: 'MEDICAL_RECORD'
      },
      {
        title: 'Daily Wellness Habit Streak',
        message: 'You have logged 6 consecutive days of physical therapy and hydration goals!',
        type: 'GOAL'
      }
    ];

    for (const n of notifications) {
      await client.query(
        `INSERT INTO notifications (user_id, title, message, type, is_read)
         VALUES ($1, $2, $3, $4, FALSE)`,
        [elenaId, n.title, n.message, n.type]
      );
    }

    // 16. Synchronize all Sequence IDs
    console.log('🔄 Synchronizing PostgreSQL sequence values for all tables...');
    const tables = [
      'users', 'user_profiles', 'caregivers', 'dependents', 'doctors',
      'life_stages', 'user_life_stages', 'health_tracker', 'symptoms',
      'medical_records', 'appointments', 'health_reports', 'consultation_notes',
      'health_articles', 'vaccinations', 'medications', 'relationships',
      'consents', 'permissions', 'health_events', 'ai_insights', 'audit_logs',
      'period_settings', 'period_cycles', 'notifications', 'smartwatch_devices',
      'smartwatch_health_data', 'partner_connections', 'partner_sharing_permissions',
      'partner_tasks', 'shared_health_goals', 'patient_exercise_logs', 'telehealth_sessions'
    ];

    for (const t of tables) {
      try {
        await client.query(`SELECT setval('${t}_id_seq', COALESCE((SELECT MAX(id) FROM ${t}), 1))`);
      } catch (seqErr) {
        // Sequence name might not follow standard naming or table empty
      }
    }

    await client.query('COMMIT');
    console.log('✨ All seed data inserted and committed successfully!');

    // 17. Verification Summary
    console.log('\n📊 SEED DATA VERIFICATION SUMMARY:');
    for (const t of tables) {
      try {
        const countRes = await client.query(`SELECT count(*) FROM ${t}`);
        console.log(`  - ${t.padEnd(28)} : ${countRes.rows[0].count} records`);
      } catch (e) {
        // ignore
      }
    }

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error executing database seed:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seedDatabase().catch((err) => {
  console.error('Seed script failed:', err);
  process.exit(1);
});
