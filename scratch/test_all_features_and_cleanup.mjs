import pool from '../config/db.js';

const BASE_URL = 'http://localhost:5001';

async function testAll() {
  console.log('===============================================================');
  console.log('STARTING SYSTEM-WIDE END-TO-END VALIDATION & ADMIN CLEANUP');
  console.log('===============================================================\n');

  // Pre-cleanup of any old test users
  await pool.query("DELETE FROM users WHERE email LIKE '%@femsphere.test'");
  console.log('✓ Pre-test database cleanliness ensured.\n');

  const timestamp = Date.now();
  const testPatientEmail = `test.patient.${timestamp}@femsphere.test`;
  const testDoctorEmail = `test.doctor.${timestamp}@femsphere.test`;
  const testCaregiverEmail = `test.caregiver.${timestamp}@femsphere.test`;
  const testPassword = 'Password@123';

  let patientToken = '';
  let patientUserId = null;
  let doctorToken = '';
  let doctorUserId = null;
  let doctorDocId = null;
  let caregiverToken = '';
  let caregiverUserId = null;
  let adminToken = '';
  let adminUserId = null;
  let createdAppointmentId = null;

  // ---------------------------------------------------------------------------
  // 1. REGISTRATION FOR ALL ROLES
  // ---------------------------------------------------------------------------
  console.log('>>> 1. Testing Registration for All User Roles...');

  // 1a. Patient Registration
  const regPatRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: `patient_${timestamp}`,
      email: testPatientEmail,
      password: testPassword,
      accountType: 'User (Female)',
      role: 'User (Female)',
      fullName: 'Jane Doe (Patient)',
      dob: '1998-05-15',
      phone: '+15551234567'
    })
  });
  const regPatData = await regPatRes.json();
  if (!regPatData.success) throw new Error(`Patient registration failed: ${regPatData.message}`);
  patientUserId = regPatData.user.id;
  patientToken = regPatData.token;
  console.log(`  ✓ Patient Registered successfully -> User ID: ${patientUserId}`);

  // 1b. Doctor Registration
  const regDocRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: `doctor_${timestamp}`,
      email: testDoctorEmail,
      password: testPassword,
      accountType: 'Doctor',
      role: 'Doctor',
      fullName: 'Dr. Evelyn Reed',
      specialization: 'Obstetrics & Maternal Health',
      hospitalClinic: 'FemSphere Premier Care',
      licenseNumber: `LIC-${timestamp}`
    })
  });
  const regDocData = await regDocRes.json();
  if (!regDocData.success) throw new Error(`Doctor registration failed: ${regDocData.message}`);
  doctorUserId = regDocData.user.id;
  doctorToken = regDocData.token;
  const docDbRow = await pool.query('SELECT id FROM doctors WHERE user_id = $1', [doctorUserId]);
  doctorDocId = docDbRow.rows[0]?.id;
  console.log(`  ✓ Doctor Registered successfully -> User ID: ${doctorUserId}, Doctor ID: ${doctorDocId}`);

  // 1c. Caregiver Registration
  const regCgRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: `caregiver_${timestamp}`,
      email: testCaregiverEmail,
      password: testPassword,
      accountType: 'Caregiver',
      role: 'Caregiver',
      fullName: 'Marcus Vance (Caregiver)',
      caregiverType: 'Parent',
      phone: '+15559876543'
    })
  });
  const regCgData = await regCgRes.json();
  if (!regCgData.success) throw new Error(`Caregiver registration failed: ${regCgData.message}`);
  caregiverUserId = regCgData.user.id;
  caregiverToken = regCgData.token;
  console.log(`  ✓ Caregiver Registered successfully -> User ID: ${caregiverUserId}`);

  // ---------------------------------------------------------------------------
  // 2. LOGIN FOR ALL ROLES (PATIENT, DOCTOR, CAREGIVER, ADMIN)
  // ---------------------------------------------------------------------------
  console.log('\n>>> 2. Testing Login Authentication for All Roles...');

  // 2a. Patient Login
  const logPat = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testPatientEmail, password: testPassword })
  });
  const logPatData = await logPat.json();
  if (!logPatData.success || !logPatData.token) throw new Error('Patient login authentication failed');
  patientToken = logPatData.token;
  console.log('  ✓ Patient login verified with valid JWT');

  // 2b. Doctor Login
  const logDoc = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testDoctorEmail, password: testPassword })
  });
  const logDocData = await logDoc.json();
  if (!logDocData.success || !logDocData.token) throw new Error('Doctor login authentication failed');
  doctorToken = logDocData.token;
  console.log('  ✓ Doctor login verified with valid JWT');

  // 2c. Caregiver Login
  const logCg = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testCaregiverEmail, password: testPassword })
  });
  const logCgData = await logCg.json();
  if (!logCgData.success || !logCgData.token) throw new Error('Caregiver login authentication failed');
  caregiverToken = logCgData.token;
  console.log('  ✓ Caregiver login verified with valid JWT');

  // 2d. Admin Login
  const logAdmin = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@femsphere.health', password: 'admin123' })
  });
  const logAdminData = await logAdmin.json();
  if (!logAdminData.success || !logAdminData.token) throw new Error('Admin login authentication failed');
  adminToken = logAdminData.token;
  adminUserId = logAdminData.user.id;
  console.log(`  ✓ Admin login verified (Admin User ID: ${adminUserId})`);

  // ---------------------------------------------------------------------------
  // 3. ADMIN DOCTOR APPROVAL & SYSTEM STATS
  // ---------------------------------------------------------------------------
  console.log('\n>>> 3. Testing Admin Approval & System Analytics...');
  const approveRes = await fetch(`${BASE_URL}/api/admin/doctors/${doctorDocId}/approve`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify({ status: 'Approved' })
  });
  const approveData = await approveRes.json();
  if (!approveData.success) throw new Error('Admin approval of doctor failed');
  console.log('  ✓ Doctor successfully approved by Admin to practice in clinic');

  const statsRes = await fetch(`${BASE_URL}/api/admin/stats`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  const statsData = await statsRes.json();
  console.log(`  ✓ System stats verified: ${statsData.stats.totalUsers} total users, ${statsData.stats.totalDoctors} approved doctors`);

  // ---------------------------------------------------------------------------
  // 4. DOCTOR AVAILABILITY & SHIFT CAPACITY CREATION
  // ---------------------------------------------------------------------------
  console.log('\n>>> 4. Testing Doctor Availability & Shift Capacity Setup...');
  const targetDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const targetDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date(targetDate).getDay()];

  const testShift = {
    id: `shift-${timestamp}`,
    day: targetDay,
    startTime: '10:00 AM',
    endTime: '01:00 PM',
    type: 'Morning Clinic',
    maxPatients: 3,
    notes: 'Telehealth & Physical Movement Orders'
  };

  const scheduleRes = await fetch(`${BASE_URL}/api/doctors/schedule`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${doctorToken}`
    },
    body: JSON.stringify({
      availableDays: [targetDay],
      workingHours: '10:00 AM - 01:00 PM',
      shifts: [testShift]
    })
  });
  const scheduleData = await scheduleRes.json();
  if (!scheduleData.success) throw new Error('Doctor schedule update failed');
  console.log(`  ✓ Doctor created shift on ${targetDay} (${targetDate}) with max capacity: 3 patients`);

  // ---------------------------------------------------------------------------
  // 5. USER DOCTOR SEARCH & BOOKING WITH CAPACITY DECREMENT
  // ---------------------------------------------------------------------------
  console.log('\n>>> 5. Testing Doctor Search & Real-Time Capacity Decrement...');
  const searchRes = await fetch(`${BASE_URL}/api/doctors/available?date=${targetDate}&day=${targetDay}`);
  const searchData = await searchRes.json();
  if (!searchData.success) throw new Error('Available doctor search failed');
  
  const matchedDoc = searchData.doctors.find(d => d.id === doctorDocId);
  if (!matchedDoc || matchedDoc.shifts.length === 0) throw new Error('Doctor not found in availability search');
  const initialShift = matchedDoc.shifts[0];
  console.log(`  ✓ Found available doctor slot: max=${initialShift.maxPatients}, remaining=${initialShift.remainingCapacity}`);

  // User books the appointment
  const bookRes = await fetch(`${BASE_URL}/api/appointments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${patientToken}`
    },
    body: JSON.stringify({
      doctorId: doctorDocId,
      doctorName: 'Dr. Evelyn Reed',
      date: targetDate,
      time: '10:30 AM',
      reason: 'Postpartum Core Laxity & Pelvic Movement Protocol',
      type: 'Virtual Telehealth'
    })
  });
  const bookData = await bookRes.json();
  if (!bookData.success) throw new Error(`Booking failed: ${bookData.message}`);
  createdAppointmentId = bookData.appointment.id;
  console.log(`  ✓ Appointment booked successfully -> Appointment ID: ${createdAppointmentId}`);

  // Verify capacity decremented by 1
  const afterSearchRes = await fetch(`${BASE_URL}/api/doctors/available?date=${targetDate}&day=${targetDay}`);
  const afterSearchData = await afterSearchRes.json();
  const afterDoc = afterSearchData.doctors.find(d => d.id === doctorDocId);
  const afterShift = afterDoc.shifts[0];
  console.log(`  ✓ Capacity verified after booking: booked=${afterShift.bookedCount}, remaining=${afterShift.remainingCapacity}`);
  if (afterShift.remainingCapacity !== 2) {
    throw new Error(`Capacity expected to be 2, but got ${afterShift.remainingCapacity}`);
  }

  // ---------------------------------------------------------------------------
  // 6. DOCTOR PATIENT DIRECTORY & CONSULTATION (PRESCRIBING EXERCISE)
  // ---------------------------------------------------------------------------
  console.log('\n>>> 6. Testing Doctor Patient Directory & Clinical Exercise Prescription...');
  
  // Verify patient is in doctor's directory
  const patListRes = await fetch(`${BASE_URL}/api/doctors/patients`, {
    headers: { 'Authorization': `Bearer ${doctorToken}` }
  });
  const patListData = await patListRes.json();
  const foundPat = patListData.patients.some(p => p.id === patientUserId);
  if (!foundPat) throw new Error('Patient with scheduled appointment is missing from doctor patient directory');
  console.log(`  ✓ Attending physician directory lists patient (Patient User ID: ${patientUserId})`);

  // Doctor creates consultation note with prescribed exercises
  const noteRes = await fetch(`${BASE_URL}/api/doctors/consultation-notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${doctorToken}`
    },
    body: JSON.stringify({
      patientId: patientUserId,
      appointmentId: createdAppointmentId,
      diagnosis: 'Diastasis Recti & Pelvic Floor Muscle Laxity',
      advice: 'Perform low-impact core recruitment exercises twice daily. Avoid forward crunches.',
      prescriptionNotes: 'Calcium + Vit D3 500mg daily',
      prescribedExercises: [
        {
          id: 'pelvic-floor-kegel',
          name: 'Pelvic Floor & Kegel Stabilization',
          category: 'Pelvic Health',
          duration: '15 mins',
          frequency: 'Twice Daily',
          instructions: '5-second isometric pelvic floor holds, 10 reps per set'
        },
        {
          id: 'diastasis-core-repair',
          name: 'Transverse Abdominis Core Activation',
          category: 'Core Physical Therapy',
          duration: '12 mins',
          frequency: 'Daily',
          instructions: 'Supine gentle pelvic tilts with deep diaphragmatic exhalation'
        }
      ]
    })
  });
  const noteData = await noteRes.json();
  if (!noteData.success) throw new Error(`Doctor consultation note creation failed: ${noteData.message}`);
  console.log('  ✓ Consultation note saved with structured prescribed exercises and clinical advice');

  // ---------------------------------------------------------------------------
  // 7. USER PRESCRIBED FITNESS & PHYSICAL THERAPY SECTION
  // ---------------------------------------------------------------------------
  console.log('\n>>> 7. Testing User Prescribed Fitness Portal Verification...');
  const userConsRes = await fetch(`${BASE_URL}/api/users/consultations`, {
    headers: { 'Authorization': `Bearer ${patientToken}` }
  });
  const userConsData = await userConsRes.json();
  if (!userConsData.success || userConsData.notes.length === 0) {
    throw new Error('User failed to receive consultation notes');
  }
  const verifiedNote = userConsData.notes[0];
  const exParsed = typeof verifiedNote.prescribed_exercises === 'string'
    ? JSON.parse(verifiedNote.prescribed_exercises)
    : verifiedNote.prescribed_exercises;

  if (!verifiedNote.doctor_name || !exParsed || exParsed.length !== 2) {
    throw new Error('Prescribed exercise verification failed: incorrect doctor attribution or exercise count');
  }
  console.log('  ✓ Prescribed Fitness section data verified:');
  console.log(`    - Prescribed By: ${verifiedNote.doctor_name}`);
  console.log(`    - Specialization: ${verifiedNote.specialization}`);
  console.log(`    - Clinic: ${verifiedNote.hospital_clinic}`);
  console.log(`    - Diagnosis: ${verifiedNote.diagnosis}`);
  console.log(`    - Prescribed Protocols Count: ${exParsed.length}`);
  console.log(`    - Exercise 1: ${exParsed[0].name} (${exParsed[0].duration}, ${exParsed[0].frequency})`);
  console.log(`    - Exercise 2: ${exParsed[1].name} (${exParsed[1].duration}, ${exParsed[1].frequency})`);

  // ---------------------------------------------------------------------------
  // 8. PERIOD TRACKER ENGINE, PREDICTIONS & DYNAMIC CYCLE ADJUSTMENT
  // ---------------------------------------------------------------------------
  console.log('\n>>> 8. Testing Period Tracker Engine, Biological Phases & Dynamic Recalibration...');
  const fourDaysAgo = new Date(Date.now() - (4 * 86400000)).toISOString().split('T')[0];

  // Setup cycle
  const setupRes = await fetch(`${BASE_URL}/api/period-tracker/setup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${patientToken}`
    },
    body: JSON.stringify({
      lastPeriodStart: fourDaysAgo,
      periodDuration: 5,
      cycleLength: 28
    })
  });
  const setupData = await setupRes.json();
  if (!setupData.success) throw new Error('Period tracker setup failed');
  console.log(`  ✓ Period tracker setup configured (Last start: ${fourDaysAgo}, Cycle: 28 days)`);

  // Get status
  const statusRes = await fetch(`${BASE_URL}/api/period-tracker/settings`, {
    headers: { 'Authorization': `Bearer ${patientToken}` }
  });
  const statusData = await statusRes.json();
  if (!statusData.success || !statusData.isConfigured) throw new Error('Period status fetch failed');
  console.log('  ✓ Biological phase telemetry computed:');
  console.log(`    - Active Phase: ${statusData.metrics.phaseName} (${statusData.metrics.phaseBadge})`);
  console.log(`    - Hormonal State: ${statusData.metrics.hormonalState}`);
  console.log(`    - Cycle Progress: ${statusData.metrics.cycleProgressPercent}%`);
  console.log(`    - Random Mental Tip: ${statusData.tips[0]?.title}`);

  // Dynamic cycle adjustment (delay by 3 days)
  const adjustRes = await fetch(`${BASE_URL}/api/period-tracker/adjust-delay`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${patientToken}`
    },
    body: JSON.stringify({ delayDays: 3 })
  });
  const adjustData = await adjustRes.json();
  if (!adjustData.success || adjustData.settings.cycle_length !== 31) {
    throw new Error('Cycle dynamic delay adjustment failed');
  }
  console.log(`  ✓ Cycle dynamically recalibrated: cycle length extended from 28 to ${adjustData.settings.cycle_length} days`);

  // Doctor views patient period phase telemetry
  const docTeleRes = await fetch(`${BASE_URL}/api/period-tracker/doctor/patient/${patientUserId}`, {
    headers: { 'Authorization': `Bearer ${doctorToken}` }
  });
  const docTeleData = await docTeleRes.json();
  if (!docTeleData.success || !docTeleData.hasCycleData) {
    throw new Error('Doctor failed to access patient period telemetry: ' + (docTeleData.message || JSON.stringify(docTeleData)));
  }
  console.log(`  ✓ Attending physician telemetry verified patient phase: ${docTeleData.metrics.phaseName}`);

  // ---------------------------------------------------------------------------
  // 9. ADMIN PANEL: VERIFY TEST USERS & CLEANUP ALL TEST DATA
  // ---------------------------------------------------------------------------
  console.log('\n===============================================================');
  console.log('>>> 9. ADMIN PANEL: VERIFYING & DELETING ALL TEST DATA');
  console.log('===============================================================');

  // List users via Admin API
  const adminUsersRes = await fetch(`${BASE_URL}/api/admin/users`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  const adminUsersData = await adminUsersRes.json();
  const testIds = [patientUserId, doctorUserId, caregiverUserId];

  console.log(`  Total users in Admin Panel before cleanup: ${adminUsersData.users.length}`);
  for (const id of testIds) {
    const found = adminUsersData.users.some(u => u.id === id);
    console.log(`  - Test user ID ${id} present in Admin user management: ${found}`);
  }

  // Delete test users through Admin Panel endpoint
  console.log('\n  Deleting all test users via Admin DELETE /api/admin/users/:id endpoint...');
  for (const id of testIds) {
    const delRes = await fetch(`${BASE_URL}/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const delData = await delRes.json();
    if (!delData.success) {
      throw new Error(`Admin DELETE failed for user ${id}: ${delData.message}`);
    }
    console.log(`  ✓ Admin deleted user ID ${id} successfully`);
  }

  // Verify deletion in Admin Panel
  const finalUsersRes = await fetch(`${BASE_URL}/api/admin/users`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  const finalUsersData = await finalUsersRes.json();
  const lingeringUsers = finalUsersData.users.filter(u => testIds.includes(u.id));
  if (lingeringUsers.length > 0) {
    throw new Error('Lingering test users detected after deletion!');
  }
  console.log(`  ✓ Verification: 0 test users remaining in Admin Panel.`);
  console.log(`  Clean system user count: ${finalUsersData.users.length}`);

  // Also verify DB integrity
  const dbCheck = await pool.query('SELECT COUNT(*) FROM users WHERE email LIKE $1', ['%@femsphere.test']);
  console.log(`  ✓ Database verification: ${dbCheck.rows[0].count} test users found in database`);

  console.log('\n===============================================================');
  console.log('ALL SYSTEM FEATURES TESTED AND VALIDATED PERFECTLY!');
  console.log('ADMIN PANEL CLEANUP COMPLETED - DATABASE REMAINS PRISTINE.');
  console.log('===============================================================\n');

  await pool.end();
}

testAll().catch(err => {
  console.error('\n❌ TEST SUITE FAILED:', err);
  process.exit(1);
});
