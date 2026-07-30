import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

// In-Memory Database Store for 14 Tables
const db = {
  // 1. Users
  users: [
    { id: 1, username: 'admin', email: 'admin@femsphere.health', role: 'Admin (Superuser)', status: 'Active' },
    { id: 2, username: 'elena_health', email: 'elena.rostova@femsphere.health', role: 'User (Female)', status: 'Active' },
    { id: 3, username: 'marcus_cg', email: 'caregiver@femsphere.health', role: 'Caregiver', status: 'Active' },
    { id: 4, username: 'dr_jenkins', email: 'dr.jenkins@femsphere.health', role: 'Doctor', status: 'Active' },
  ],
  // 2. User Profiles
  user_profiles: [
    { id: 1, userId: 2, fullName: 'Elena Rostova', dob: '1996-08-14', gender: 'Female', bloodGroup: 'A+', heightCm: 168, weightKg: 62, contact: '+1 (555) 382-9102' }
  ],
  // 3. Caregivers
  caregivers: [
    { id: 1, userId: 3, caregiverType: 'Parent', emergencyPhone: '+1 (555) 382-9011' }
  ],
  // 4. Dependents
  dependents: [
    { id: 1, caregiverId: 1, fullName: 'Sophia Rostova', dob: '2020-04-10', relationship: 'Parent', bloodGroup: 'A+' },
    { id: 2, caregiverId: 1, fullName: 'Maria Rostova', dob: '1958-09-18', relationship: 'Elder Parent', bloodGroup: 'O+' }
  ],
  // 5. Doctors
  doctors: [
    { id: 1, userId: 4, doctorName: 'Dr. Sarah Jenkins', licenseNumber: 'MD-892401', specialization: 'Obstetrics & Gynecology', approvalStatus: 'Approved' },
    { id: 2, userId: 5, doctorName: 'Dr. Priya Sharma', licenseNumber: 'MD-778210', specialization: 'Maternal-Fetal Medicine', approvalStatus: 'Pending' }
  ],
  // 6. Medical Records
  medical_records: [
    { id: 1, userId: 2, fileName: 'Q3_Longitudinal_Blood_Test.pdf', fileType: 'PDF', fileUrl: '/uploads/records/Q3_Blood_Test.pdf' }
  ],
  // 7. Health Tracker
  health_tracker: [
    { id: 1, userId: 2, logDate: '2026-07-29', weightKg: 62, waterIntakeLiters: 1.5, sleepHours: 7, exerciseMinutes: 20 }
  ],
  // 8. Symptoms
  symptoms: [
    { id: 1, userId: 2, symptomName: 'Mild Fatigue', severity: 'Low', onsetDate: '2026-07-29', notes: 'Phase 3 cycle' }
  ],
  // 9. Appointments
  appointments: [
    { id: 1, patientId: 2, doctorId: 1, date: '2026-07-31', time: '10:00 AM', reason: 'Health Twin Review', status: 'Scheduled' }
  ],
  // 10. Health Reports
  health_reports: [
    { id: 1, userId: 2, title: 'Q3 Longitudinal Health Report', aiRiskScore: 89, isShared: true, sharedWithDoctorId: 1 }
  ],
  // 11. Consultation Notes
  consultation_notes: [
    { id: 1, doctorId: 1, patientId: 2, diagnosis: 'Phase 3 Cycle Mild Fatigue', advice: 'Hydration 2.5L daily', prescriptionNotes: 'Iron & Vitamin D3' }
  ],
  // 12. Health Articles
  health_articles: [
    { id: 1, title: 'Understanding Your Digital Health Twin', category: 'Wellness', description: 'Guide to longitudinal data modeling.' }
  ],
  // 13. Vaccinations
  vaccinations: [
    { id: 1, dependentId: 1, vaccineName: 'MMR Booster', date: '2026-02-10', nextDueDate: '2026-08-15' }
  ],
  // 14. Medications
  medications: [
    { id: 1, dependentId: 2, medicineName: 'Calcium Carbonate', dosage: '500mg', scheduleTime: '09:00 AM' }
  ]
};

// ==========================================
// REST API ENDPOINTS FOR ALL 14 TABLES
// ==========================================

// Auth Routes
app.post('/api/auth/register', (req, res) => {
  const { username, email, password, role } = req.body;
  const newUser = { id: db.users.length + 1, username, email, role, status: 'Active' };
  db.users.push(newUser);
  res.status(201).json({ success: true, user: newUser });
});

app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() || u.username.toLowerCase() === email.toLowerCase());
  if (user) {
    res.json({ success: true, token: 'femsphere_jwt_2026', user });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// 1. Users API
app.get('/api/users', (req, res) => res.json(db.users));
app.put('/api/users/:id', (req, res) => {
  const u = db.users.find(x => x.id === parseInt(req.params.id));
  if (u) Object.assign(u, req.body);
  res.json({ success: true, user: u });
});
app.delete('/api/users/:id', (req, res) => {
  db.users = db.users.filter(x => x.id !== parseInt(req.params.id));
  res.json({ success: true });
});

// 2. User Profiles API
app.get('/api/user-profiles/:userId', (req, res) => res.json(db.user_profiles.find(p => p.userId === parseInt(req.params.userId)) || {}));

// 3. Caregivers API
app.get('/api/caregivers', (req, res) => res.json(db.caregivers));

// 4. Dependents API
app.get('/api/dependents', (req, res) => res.json(db.dependents));
app.post('/api/dependents', (req, res) => {
  const newDep = { id: db.dependents.length + 1, ...req.body };
  db.dependents.push(newDep);
  res.status(201).json(newDep);
});

// 5. Doctors API & Approval
app.get('/api/doctors', (req, res) => res.json(db.doctors));
app.put('/api/doctors/:id/approve', (req, res) => {
  const doc = db.doctors.find(d => d.id === parseInt(req.params.id));
  if (doc) doc.approvalStatus = 'Approved';
  res.json({ success: true, doctor: doc });
});

// 6. Medical Records API
app.get('/api/medical-records', (req, res) => res.json(db.medical_records));
app.post('/api/medical-records', (req, res) => {
  const newRec = { id: db.medical_records.length + 1, ...req.body };
  db.medical_records.push(newRec);
  res.status(201).json(newRec);
});

// 7. Health Tracker API
app.get('/api/health-tracker', (req, res) => res.json(db.health_tracker));
app.post('/api/health-tracker', (req, res) => {
  const newTrack = { id: db.health_tracker.length + 1, ...req.body };
  db.health_tracker.push(newTrack);
  res.status(201).json(newTrack);
});

// 8. Symptoms API
app.get('/api/symptoms', (req, res) => res.json(db.symptoms));
app.post('/api/symptoms', (req, res) => {
  const newSym = { id: db.symptoms.length + 1, ...req.body };
  db.symptoms.push(newSym);
  res.status(201).json(newSym);
});

// 9. Appointments API
app.get('/api/appointments', (req, res) => res.json(db.appointments));
app.post('/api/appointments', (req, res) => {
  const newApt = { id: db.appointments.length + 1, status: 'Scheduled', ...req.body };
  db.appointments.push(newApt);
  res.status(201).json(newApt);
});

// 10. Health Reports API
app.get('/api/health-reports', (req, res) => res.json(db.health_reports));

// 11. Consultation Notes API
app.get('/api/consultation-notes', (req, res) => res.json(db.consultation_notes));
app.post('/api/consultation-notes', (req, res) => {
  const newNote = { id: db.consultation_notes.length + 1, ...req.body };
  db.consultation_notes.push(newNote);
  res.status(201).json(newNote);
});

// 12. Health Articles API
app.get('/api/health-articles', (req, res) => res.json(db.health_articles));
app.post('/api/health-articles', (req, res) => {
  const newArt = { id: db.health_articles.length + 1, ...req.body };
  db.health_articles.push(newArt);
  res.status(201).json(newArt);
});

// 13. Vaccinations API
app.get('/api/vaccinations', (req, res) => res.json(db.vaccinations));
app.post('/api/vaccinations', (req, res) => {
  const newVac = { id: db.vaccinations.length + 1, ...req.body };
  db.vaccinations.push(newVac);
  res.status(201).json(newVac);
});

// 14. Medications API
app.get('/api/medications', (req, res) => res.json(db.medications));
app.post('/api/medications', (req, res) => {
  const newMed = { id: db.medications.length + 1, ...req.body };
  db.medications.push(newMed);
  res.status(201).json(newMed);
});

app.listen(PORT, () => {
  console.log(`FemSphere Backend Server running on http://localhost:${PORT}`);
});
