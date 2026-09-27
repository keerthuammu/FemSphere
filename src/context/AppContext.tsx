import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  LifeStageId,
  UserProfile,
  VitalMetric,
  MenstrualCycleData,
  WearableDevice,
  MedicationItem,
  MedicalDocument,
  AppointmentItem,
  DependentItem,
  VaccinationItem,
  DoctorPatient,
  AppNotification,
  HealthArticle
} from '../types';

interface AppContextType {
  // Theme & Layout
  isDark: boolean;
  toggleTheme: () => void;
  isPhoneFrame: boolean;
  togglePhoneFrame: () => void;

  // Active Role & Navigation
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeSubView: string;
  setActiveSubView: (view: string) => void;

  // User Profile & Modes
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  activeMode: 'standard' | 'pregnancy' | 'postpartum' | 'menopause';
  setActiveMode: (mode: 'standard' | 'pregnancy' | 'postpartum' | 'menopause') => void;
  currentLifeStage: LifeStageId;
  setCurrentLifeStage: (stage: LifeStageId) => void;

  // Vitals & Cycle
  vitals: VitalMetric[];
  updateVital: (id: string, value: string | number) => void;
  cycleData: MenstrualCycleData;
  logSymptom: (symptom: string) => void;
  waterGlasses: number;
  addWaterGlass: () => void;

  // Wearables
  wearables: WearableDevice[];
  activeWearableId: string;
  setActiveWearableId: (id: string) => void;
  toggleWearableConnection: (id: string) => void;
  syncWearable: (id: string) => void;
  isScanningWearables: boolean;
  startWearableScan: () => void;

  // Medications
  medications: MedicationItem[];
  toggleMedicationStatus: (medId: string, time: string, status: 'taken' | 'skipped' | 'snoozed') => void;

  // Medical Vault & Documents
  documents: MedicalDocument[];
  addDocument: (doc: Omit<MedicalDocument, 'id'>) => void;
  selectedDoc: MedicalDocument | null;
  setSelectedDoc: (doc: MedicalDocument | null) => void;

  // Appointments & Telehealth
  appointments: AppointmentItem[];
  bookAppointment: (apt: Omit<AppointmentItem, 'id'>) => void;
  isTelehealthActive: boolean;
  setIsTelehealthActive: (active: boolean) => void;
  activeTelehealthDoctor: { name: string; specialty: string; avatar: string } | null;
  startTelehealthSession: (doc: { name: string; specialty: string; avatar: string }) => void;
  endTelehealthSession: () => void;

  // Dependents (Caregiver)
  dependents: DependentItem[];
  activeDependentId: string;
  setActiveDependentId: (id: string) => void;
  vaccinations: VaccinationItem[];
  toggleVaccinationStatus: (id: string) => void;

  // Doctor State
  patients: DoctorPatient[];
  selectedPatientId: string;
  setSelectedPatientId: (id: string) => void;
  doctorAvailability: {
    days: string[];
    startTime: string;
    endTime: string;
    slotDuration: number;
    maxPatients: number;
  };
  updateDoctorAvailability: (avail: Partial<AppContextType['doctorAvailability']>) => void;

  // Admin State
  usersList: { id: string; name: string; email: string; role: UserRole; status: 'active' | 'suspended'; joined: string }[];
  toggleUserStatus: (id: string) => void;
  pendingDoctors: { id: string; name: string; license: string; specialty: string; experience: string; status: 'pending' | 'approved' | 'rejected' }[];
  verifyDoctor: (id: string, action: 'approved' | 'rejected') => void;
  articles: HealthArticle[];
  toggleArticlePublish: (id: string) => void;
  addArticle: (art: Omit<HealthArticle, 'id'>) => void;

  // Partner Sync
  partnerSync: {
    partnerName: string;
    connected: boolean;
    shareCycle: boolean;
    shareFertile: boolean;
    shareWellness: boolean;
    shareActivity: boolean;
    shareNotifications: boolean;
  };
  togglePartnerShare: (key: 'shareCycle' | 'shareFertile' | 'shareWellness' | 'shareActivity' | 'shareNotifications') => void;
  revokePartnerSync: () => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Modals
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  authMode: 'login' | 'register' | 'forgot' | 'otp';
  setAuthMode: (mode: 'login' | 'register' | 'forgot' | 'otp') => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isAIChatOpen: boolean;
  setIsAIChatOpen: (open: boolean) => void;
  isWorkoutOpen: boolean;
  setIsWorkoutOpen: (open: boolean) => void;
  isEmergencyOpen: boolean;
  setIsEmergencyOpen: (open: boolean) => void;
  isPrivacyOpen: boolean;
  setIsPrivacyOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
}

const initialUser: UserProfile = {
  id: 'usr_sarah',
  name: 'Sarah Jenkins',
  email: 'sarah.jenkins@example.com',
  role: 'patient',
  dob: '1998-05-14',
  currentLifeStage: 'reproductive_age',
  heightCm: 168,
  weightKg: 62,
  bloodGroup: 'O+',
  allergies: ['Penicillin', 'Sulfa drugs'],
  conditions: ['Mild Asthma', 'History of Iron Deficiency'],
  emergencyContact: {
    name: 'Alex Jenkins',
    relationship: 'Partner',
    phone: '+1 (555) 234-5678',
  },
  activeMode: 'standard',
  pregnancyWeek: 24,
};

const initialVitals: VitalMetric[] = [
  { id: 'hr', label: 'Heart Rate', value: 72, unit: 'BPM', status: 'optimal', change: '-2 bpm vs yesterday', lastUpdated: '10m ago', source: 'wearable' },
  { id: 'bp', label: 'Blood Pressure', value: '118/76', unit: 'mmHg', status: 'normal', change: 'Normal resting', lastUpdated: '3h ago', source: 'manual' },
  { id: 'spo2', label: 'Blood Oxygen (SpO2)', value: 98, unit: '%', status: 'optimal', change: 'Consistent', lastUpdated: '10m ago', source: 'wearable' },
  { id: 'sleep', label: 'Sleep Duration', value: '7h 42m', unit: '', status: 'normal', change: '+35m deep sleep', lastUpdated: 'Today', source: 'wearable' },
  { id: 'steps', label: 'Daily Steps', value: 6842, unit: 'steps', status: 'optimal', change: '68% of 10,000 goal', lastUpdated: 'Live', source: 'wearable' },
  { id: 'cal', label: 'Active Calories', value: 1480, unit: 'kcal', status: 'normal', change: 'Target 1,800', lastUpdated: 'Live', source: 'wearable' },
  { id: 'temp', label: 'Body Temp', value: 36.6, unit: '°C', status: 'normal', change: 'Basal baseline', lastUpdated: 'Morning', source: 'wearable' },
  { id: 'resp', label: 'Respiratory Rate', value: 14, unit: 'br/min', status: 'optimal', change: 'Resting regular', lastUpdated: '10m ago', source: 'wearable' },
];

const initialCycle: MenstrualCycleData = {
  currentDay: 14,
  cycleLength: 28,
  periodLength: 5,
  currentPhase: 'Ovulation',
  nextPeriodDays: 14,
  fertileWindow: { startDay: 11, endDay: 16 },
  ovulationDay: 14,
  recentSymptoms: ['Mild Cramping', 'High Energy', 'Clear Skin'],
};

const initialWearables: WearableDevice[] = [
  {
    id: 'dev_1',
    brand: 'Amazfit',
    model: 'Bip U Pro',
    connected: true,
    batteryPct: 84,
    lastSynced: '2 minutes ago',
    signalStrength: 92,
    supportedMetrics: ['Heart Rate', 'SpO2', 'Steps', 'Sleep', 'Stress'],
  },
  {
    id: 'dev_2',
    brand: 'Apple Watch',
    model: 'Series 9 (GPS)',
    connected: false,
    batteryPct: 65,
    lastSynced: 'Yesterday',
    signalStrength: 85,
    supportedMetrics: ['ECG', 'Heart Rate', 'SpO2', 'Cycle Temp', 'Sleep'],
  },
  {
    id: 'dev_3',
    brand: 'Garmin',
    model: 'Venu 3S',
    connected: false,
    batteryPct: 90,
    lastSynced: '3 days ago',
    signalStrength: 78,
    supportedMetrics: ['Body Battery', 'HRV', 'Sleep Coach', 'Steps'],
  },
  {
    id: 'dev_4',
    brand: 'Generic BLE',
    model: 'Polar H10 Chest Strap',
    connected: false,
    batteryPct: 100,
    lastSynced: 'Not paired',
    signalStrength: 65,
    supportedMetrics: ['Live Precision HR', 'RR Intervals'],
  },
];

const initialMeds: MedicationItem[] = [
  {
    id: 'med_1',
    name: 'Prenatal Multivitamin + DHA',
    dosage: '1 softgel',
    frequency: 'Once daily with food',
    scheduledTimes: ['08:00 AM'],
    remainingTablets: 24,
    refillThreshold: 10,
    statusToday: { '08:00 AM': 'taken' },
  },
  {
    id: 'med_2',
    name: 'Iron Bisglycinate',
    dosage: '25 mg',
    frequency: 'Once daily with Vitamin C',
    scheduledTimes: ['12:00 PM'],
    remainingTablets: 8,
    refillThreshold: 10,
    statusToday: { '12:00 PM': 'pending' },
  },
  {
    id: 'med_3',
    name: 'Calcium & Vitamin D3',
    dosage: '500 mg / 1000 IU',
    frequency: 'Twice daily',
    scheduledTimes: ['08:00 AM', '08:00 PM'],
    remainingTablets: 42,
    refillThreshold: 14,
    statusToday: { '08:00 AM': 'taken', '08:00 PM': 'pending' },
  },
];

const initialDocs: MedicalDocument[] = [
  {
    id: 'doc_1',
    title: 'Comprehensive Metabolic & Lipid Panel',
    category: 'Lab Reports',
    date: '2026-06-18',
    doctorName: 'Dr. Elena Vance, MD',
    facility: 'Mercy Women’s Health Diagnostics',
    fileSize: '1.8 MB PDF',
    aiProcessed: true,
    aiSummary: 'All vital parameters within target ranges. Fasting glucose and lipid profile show robust cardiovascular health. Hemoglobin levels improved from last quarter.',
    extractedBiomarkers: [
      { name: 'Hemoglobin', value: '13.4', unit: 'g/dL', referenceRange: '12.0 - 15.5', status: 'normal' },
      { name: 'Fasting Glucose', value: '92', unit: 'mg/dL', referenceRange: '70 - 99', status: 'normal' },
      { name: 'Total Cholesterol', value: '174', unit: 'mg/dL', referenceRange: '< 200', status: 'normal' },
      { name: 'Ferritin (Iron store)', value: '38', unit: 'ng/mL', referenceRange: '20 - 200', status: 'normal' },
      { name: 'Thyroid (TSH)', value: '2.1', unit: 'uIU/mL', referenceRange: '0.4 - 4.0', status: 'normal' },
    ],
    doctorQuestions: [
      'Should I continue the current iron bisglycinate dose given the ferritin result?',
      'Are there additional second-trimester screening panels required next month?',
    ],
  },
  {
    id: 'doc_2',
    title: 'Second Trimester Anatomy Ultrasound',
    category: 'Imaging',
    date: '2026-05-12',
    doctorName: 'Dr. Sophia Chen, MD',
    facility: 'St. Jude Maternal Fetal Imaging',
    fileSize: '4.2 MB PDF',
    aiProcessed: true,
    aiSummary: 'Fetal growth is concordant with gestational age (54th percentile). Normal amniotic fluid volume and anterior placenta position.',
    extractedBiomarkers: [
      { name: 'Gestational Age', value: '20w 3d', unit: 'weeks', referenceRange: '20w ± 1w', status: 'normal' },
      { name: 'Estimated Fetal Wt', value: '340', unit: 'grams', referenceRange: '300 - 380', status: 'normal' },
      { name: 'Fetal Heart Rate', value: '144', unit: 'BPM', referenceRange: '120 - 160', status: 'normal' },
    ],
  },
  {
    id: 'doc_3',
    title: 'Routine OB/GYN Consultation Clinical Note',
    category: 'Doctor Notes',
    date: '2026-04-04',
    doctorName: 'Dr. Elena Vance, MD',
    facility: 'Northwest Care Pavilion',
    fileSize: '820 KB PDF',
    aiProcessed: true,
    aiSummary: 'Patient reports mild morning nausea resolving in second trimester. Recommended daily pelvic floor mobility and continuous hydration.',
  },
];

const initialAppointments: AppointmentItem[] = [
  {
    id: 'apt_1',
    doctorName: 'Dr. Elena Vance',
    specialty: 'Obstetrics & Gynecology (OB/GYN)',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    date: 'Tomorrow, Jul 30',
    time: '10:30 AM',
    status: 'upcoming',
    type: 'video',
    hospital: 'Mercy Telehealth Suite',
    notes: '24-Week Routine Maternal & Fetal Checkup',
  },
  {
    id: 'apt_2',
    doctorName: 'Dr. Marcus Reed',
    specialty: 'Clinical Endocrinologist & Women’s Hormones',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    date: 'Aug 14, 2026',
    time: '02:00 PM',
    status: 'upcoming',
    type: 'in_person',
    hospital: 'Summit Specialty Center, Suite 402',
    notes: 'Thyroid profile & nutritional hormone synthesis review',
  },
  {
    id: 'apt_3',
    doctorName: 'Dr. Sophia Chen',
    specialty: 'Maternal-Fetal Sonologist',
    avatar: 'https://images.unsplash.com/photo-1594824813568-18544e3e3b7b?w=150&auto=format&fit=crop&q=80',
    date: 'Jun 12, 2026',
    time: '11:15 AM',
    status: 'completed',
    type: 'in_person',
    hospital: 'St. Jude Maternal Fetal Imaging',
    notes: 'Completed anatomical scan — all markers normal',
  },
];

const initialDependents: DependentItem[] = [
  {
    id: 'dep_1',
    name: 'Maya Jenkins',
    relation: 'Daughter',
    age: 6,
    avatar: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=150&auto=format&fit=crop&q=80',
    healthScore: 94,
    lastSync: '15m ago',
    status: 'Good',
    currentVitals: { hr: 84, temp: 36.8, bp: '98/64', sleep: '9h 15m' },
    vaccinesDue: 1,
    medicationsCount: 1,
  },
  {
    id: 'dep_2',
    name: 'Eleanor Vance Jenkins',
    relation: 'Mother',
    age: 72,
    avatar: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=150&auto=format&fit=crop&q=80',
    healthScore: 82,
    lastSync: '1h ago',
    status: 'Stable',
    currentVitals: { hr: 68, temp: 36.5, bp: '124/80', sleep: '6h 50m' },
    vaccinesDue: 0,
    medicationsCount: 3,
  },
];

const initialVaccines: VaccinationItem[] = [
  { id: 'vac_1', dependentId: 'dep_1', vaccineName: 'DTaP & IPV Booster (Year 6)', dueDate: '2026-08-15', status: 'upcoming', provider: 'Pediatric Care Center' },
  { id: 'vac_2', dependentId: 'dep_1', vaccineName: 'MMR Dose 2', dueDate: '2025-05-10', completedDate: '2025-05-12', status: 'completed', provider: 'Mercy Pediatrics' },
  { id: 'vac_3', dependentId: 'dep_1', vaccineName: 'Annual Influenza 2025/2026', dueDate: '2025-10-01', completedDate: '2025-10-03', status: 'completed', provider: 'School Clinic' },
  { id: 'vac_4', dependentId: 'dep_2', vaccineName: 'Shingrix (Shingles) Dose 2', dueDate: '2026-02-10', completedDate: '2026-02-14', status: 'completed', provider: 'Northwest Pharmacy' },
  { id: 'vac_5', dependentId: 'dep_2', vaccineName: 'Pneumococcal (Pneumovax 23)', dueDate: '2026-09-01', status: 'upcoming', provider: 'Senior Wellness Clinic' },
];

const initialPatients: DoctorPatient[] = [
  {
    id: 'pat_1',
    name: 'Sarah Jenkins',
    age: 28,
    gender: 'Female',
    stage: 'Pregnancy (Week 24)',
    lastVisit: '2026-06-18',
    conditionSummary: 'Normal 2nd trimester progression. Ferritin stabilized with chelated iron.',
    healthScore: 89,
    vitals: { hr: 72, bp: '118/76', spo2: 98, temp: 36.6 },
  },
  {
    id: 'pat_2',
    name: 'Chloe Morrison',
    age: 34,
    gender: 'Female',
    stage: 'Reproductive Age',
    lastVisit: '2026-07-10',
    conditionSummary: 'PCOS management. Cycle regularizing over past 90 days on inositol protocol.',
    healthScore: 84,
    vitals: { hr: 76, bp: '122/80', spo2: 99, temp: 36.7 },
  },
  {
    id: 'pat_3',
    name: 'Margaret Davis',
    age: 51,
    gender: 'Female',
    stage: 'Perimenopause',
    lastVisit: '2026-07-22',
    conditionSummary: 'Vasomotor symptoms (hot flashes), sleep disruption. Monitoring bone density & lipid markers.',
    healthScore: 78,
    vitals: { hr: 80, bp: '128/84', spo2: 97, temp: 36.8 },
    recentAlert: 'Restless sleep duration < 5h for 3 consecutive nights',
  },
];

const initialNotifications: AppNotification[] = [
  { id: 'not_1', category: 'Health', title: 'Daily Health Twin Synced', message: 'Sleep metrics & morning resting heart rate updated from Amazfit Bip U Pro.', timestamp: '15m ago', read: false },
  { id: 'not_2', category: 'Medication', title: 'Afternoon Dose Due', message: 'Time for Iron Bisglycinate (25mg) with water or citrus juice.', timestamp: '1h ago', read: false },
  { id: 'not_3', category: 'Appointment', title: 'Consultation Tomorrow', message: 'Video appointment with Dr. Elena Vance scheduled at 10:30 AM.', timestamp: '3h ago', read: true },
  { id: 'not_4', category: 'Cycle', title: 'Ovulation Window Active', message: 'Basal temperature and biomarker predictions indicate peak fertility window.', timestamp: '5h ago', read: true },
  { id: 'not_5', category: 'Caregiver', title: 'Maya’s School Checkup', message: 'Pediatric booster vaccine reminder: DTaP due in 20 days.', timestamp: 'Yesterday', read: true },
];

const initialArticles: HealthArticle[] = [
  {
    id: 'art_1',
    title: 'Nourishing the Second Trimester: Essential Micronutrients & Energy Balance',
    category: 'Maternal Nutrition',
    readTime: '5 min read',
    author: 'Dr. Elena Vance, MD',
    status: 'published',
    date: 'Jul 24, 2026',
    summary: 'Evidence-based insights into choline, omega-3 DHA, and bioavailable iron during peak fetal neurological development.',
  },
  {
    id: 'art_2',
    title: 'Understanding Circadian Heart Rate Variability (HRV) for Stress Resilience',
    category: 'Digital Biomarkers',
    readTime: '7 min read',
    author: 'FemSphere Research Lab',
    status: 'published',
    date: 'Jul 18, 2026',
    summary: 'How wearable optical sensors detect subtle shifts in the autonomic nervous system before physical fatigue manifests.',
  },
  {
    id: 'art_3',
    title: 'Hormonal Transitions: Navigating Perimenopause with Confidence',
    category: 'Life Stage Health',
    readTime: '6 min read',
    author: 'Dr. Marcus Reed, MD',
    status: 'draft',
    date: 'Jul 28, 2026',
    summary: 'A proactive medical guide to symptom tracking, restorative sleep hygiene, and bone preservation strategies.',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme & Frame state
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);

  // Role & Navigation
  const [role, setRole] = useState<UserRole>('patient');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeSubView, setActiveSubView] = useState<string>('overview');

  // User Profile & Modes
  const [user, setUser] = useState<UserProfile>(initialUser);
  const [activeMode, setActiveMode] = useState<'standard' | 'pregnancy' | 'postpartum' | 'menopause'>('standard');
  const [currentLifeStage, setCurrentLifeStage] = useState<LifeStageId>('reproductive_age');

  // Vitals & Cycle
  const [vitals, setVitals] = useState<VitalMetric[]>(initialVitals);
  const [cycleData, setCycleData] = useState<MenstrualCycleData>(initialCycle);
  const [waterGlasses, setWaterGlasses] = useState<number>(5);

  // Wearables
  const [wearables, setWearables] = useState<WearableDevice[]>(initialWearables);
  const [activeWearableId, setActiveWearableId] = useState<string>('dev_1');
  const [isScanningWearables, setIsScanningWearables] = useState<boolean>(false);

  // Medications
  const [medications, setMedications] = useState<MedicationItem[]>(initialMeds);

  // Documents
  const [documents, setDocuments] = useState<MedicalDocument[]>(initialDocs);
  const [selectedDoc, setSelectedDoc] = useState<MedicalDocument | null>(initialDocs[0]);

  // Appointments & Telehealth
  const [appointments, setAppointments] = useState<AppointmentItem[]>(initialAppointments);
  const [isTelehealthActive, setIsTelehealthActive] = useState<boolean>(false);
  const [activeTelehealthDoctor, setActiveTelehealthDoctor] = useState<{ name: string; specialty: string; avatar: string } | null>(null);

  // Caregiver
  const [dependents, setDependents] = useState<DependentItem[]>(initialDependents);
  const [activeDependentId, setActiveDependentId] = useState<string>('dep_1');
  const [vaccinations, setVaccinations] = useState<VaccinationItem[]>(initialVaccines);

  // Doctor
  const [patients, setPatients] = useState<DoctorPatient[]>(initialPatients);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('pat_1');
  const [doctorAvailability, setDoctorAvailability] = useState({
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    startTime: '08:30 AM',
    endTime: '04:30 PM',
    slotDuration: 30,
    maxPatients: 14,
  });

  // Admin
  const [usersList, setUsersList] = useState([
    { id: 'u1', name: 'Sarah Jenkins', email: 'sarah.jenkins@example.com', role: 'patient' as UserRole, status: 'active' as const, joined: '2024-03-12' },
    { id: 'u2', name: 'Dr. Elena Vance', email: 'elena.vance@mercyhealth.org', role: 'doctor' as UserRole, status: 'active' as const, joined: '2023-11-04' },
    { id: 'u3', name: 'Alex Jenkins', email: 'alex.jenkins@family.net', role: 'caregiver' as UserRole, status: 'active' as const, joined: '2024-05-19' },
    { id: 'u4', name: 'Chloe Morrison', email: 'chloe.m@domain.com', role: 'patient' as UserRole, status: 'active' as const, joined: '2025-01-08' },
    { id: 'u5', name: 'Dr. Marcus Reed', email: 'm.reed@endocrinology.org', role: 'doctor' as UserRole, status: 'active' as const, joined: '2024-08-14' },
  ]);

  const [pendingDoctors, setPendingDoctors] = useState([
    { id: 'pd_1', name: 'Dr. Jessica Martinez', license: 'MD-928410-CA', specialty: 'Reproductive Endocrinology', experience: '12 Years (Stanford Health)', status: 'pending' as const },
    { id: 'pd_2', name: 'Dr. David Kim', license: 'MD-741932-NY', specialty: 'Perinatal & Maternal Care', experience: '8 Years (Mount Sinai)', status: 'pending' as const },
    { id: 'pd_3', name: 'Dr. Olivia Thorne', license: 'MD-558291-TX', specialty: 'Geriatric & Menopause Wellness', experience: '15 Years (Methodist)', status: 'pending' as const },
  ]);

  const [articles, setArticles] = useState<HealthArticle[]>(initialArticles);

  // Partner Sync
  const [partnerSync, setPartnerSync] = useState({
    partnerName: 'Alex Jenkins',
    connected: true,
    shareCycle: true,
    shareFertile: true,
    shareWellness: true,
    shareActivity: true,
    shareNotifications: false,
  });

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot' | 'otp'>('login');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isWorkoutOpen, setIsWorkoutOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Apply dark class to html document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Synchronize authenticated user and fetch live backend data
  useEffect(() => {
    const token = localStorage.getItem('femsphere_token');
    const storedUserStr = localStorage.getItem('femsphere_user');
    if (storedUserStr) {
      try {
        const u = JSON.parse(storedUserStr);
        let mappedRole: UserRole = 'patient';
        if (u.role === 'Caregiver') mappedRole = 'caregiver';
        else if (u.role === 'Doctor') mappedRole = 'doctor';
        else if (u.role === 'Administrator' || u.role === 'Admin (Superuser)') mappedRole = 'admin';

        setRole(mappedRole);
        setUser(prev => ({
          ...prev,
          id: String(u.id || prev.id),
          name: u.fullName || u.username || prev.name,
          email: u.email || prev.email,
          role: mappedRole,
          bloodGroup: u.profile?.blood_group || prev.bloodGroup,
          heightCm: Number(u.profile?.height_cm) || prev.heightCm,
          weightKg: Number(u.profile?.weight_kg) || prev.weightKg,
        }));
      } catch {
        // ignore parse error
      }
    }

    if (token) {
      // 1. Fetch user vitals & health tracker data
      fetch('/api/health-tracker/vitals', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => (r.ok ? r.json() : null))
        .then(data => {
          if (data && Array.isArray(data.logs) && data.logs.length > 0) {
            const latest = data.logs[0];
            setVitals(prev =>
              prev.map(v => {
                if (v.id === 'hr' && latest.heart_rate) return { ...v, value: latest.heart_rate, lastUpdated: 'Just now' };
                if (v.id === 'bp' && latest.blood_pressure) return { ...v, value: latest.blood_pressure, lastUpdated: 'Today' };
                if (v.id === 'spo2' && latest.spo2) return { ...v, value: latest.spo2, lastUpdated: 'Live' };
                if (v.id === 'steps' && latest.steps) return { ...v, value: latest.steps, lastUpdated: 'Live' };
                if (v.id === 'cal' && latest.calories_burned) return { ...v, value: latest.calories_burned, lastUpdated: 'Live' };
                if (v.id === 'sleep' && latest.sleep_hours) return { ...v, value: `${latest.sleep_hours}h`, lastUpdated: 'Today' };
                return v;
              })
            );
            if (latest.water_intake_ml) {
              setWaterGlasses(Math.min(12, Math.round(latest.water_intake_ml / 250)));
            }
          }
        })
        .catch(() => {});

      // 2. Fetch appointments
      fetch('/api/appointments', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => (r.ok ? r.json() : null))
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setAppointments(
              data.map((a: any) => ({
                id: String(a.id),
                doctorName: a.doctor_name || (a.doctor?.user?.full_name ? `Dr. ${a.doctor.user.full_name}` : 'Dr. Elena Vance'),
                specialty: a.doctor?.specialization || 'Clinical Specialist',
                avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
                date: a.appointment_date || 'Upcoming',
                time: a.slot_start_time || '10:00 AM',
                status: (a.status === 'Completed' ? 'completed' : a.status === 'Cancelled' ? 'cancelled' : 'upcoming') as any,
                type: (a.consultation_type === 'In-Person' ? 'in_person' : 'video') as any,
                hospital: a.clinic_name || 'FemSphere Telehealth',
                notes: a.reason || 'General Health Review',
              }))
            );
          }
        })
        .catch(() => {});

      // 3. Fetch medical records
      fetch('/api/medical-records', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => (r.ok ? r.json() : null))
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setDocuments(
              data.map((d: any) => ({
                id: String(d.id),
                title: d.title || d.original_filename || 'Diagnostic Record',
                category: d.category || 'Lab Reports',
                date: d.created_at ? new Date(d.created_at).toISOString().split('T')[0] : '2026-06-18',
                doctorName: d.doctor_name || 'Dr. Elena Vance, MD',
                facility: d.facility || 'FemSphere Health Diagnostics',
                fileSize: d.file_size ? `${(d.file_size / (1024 * 1024)).toFixed(1)} MB PDF` : '1.5 MB PDF',
                aiProcessed: true,
                aiSummary: d.ocr_summary || d.description || 'Clinical diagnostics processed via AI OCR biomarker extraction.',
                extractedBiomarkers: d.extracted_biomarkers || undefined,
              }))
            );
          }
        })
        .catch(() => {});
    }
  }, []);

  const toggleTheme = () => setIsDark(prev => !prev);
  const togglePhoneFrame = () => setIsPhoneFrame(prev => !prev);

  const updateVital = (id: string, value: string | number) => {
    setVitals(prev =>
      prev.map(v => (v.id === id ? { ...v, value, lastUpdated: 'Just now' } : v))
    );
    const token = localStorage.getItem('femsphere_token');
    if (token) {
      const payload: any = { log_date: new Date().toISOString().split('T')[0] };
      if (id === 'hr') payload.heart_rate = Number(value) || 72;
      if (id === 'bp') payload.blood_pressure = String(value);
      if (id === 'spo2') payload.spo2 = Number(value) || 98;
      if (id === 'steps') payload.steps = Number(value) || 0;
      fetch('/api/health-tracker/vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      }).catch(() => {});
    }
  };

  const logSymptom = (symptom: string) => {
    setCycleData(prev => {
      const exists = prev.recentSymptoms.includes(symptom);
      return {
        ...prev,
        recentSymptoms: exists
          ? prev.recentSymptoms.filter(s => s !== symptom)
          : [...prev.recentSymptoms, symptom],
      };
    });
    const token = localStorage.getItem('femsphere_token');
    if (token) {
      fetch('/api/health-tracker/symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ symptom_name: symptom, severity: 'mild', log_date: new Date().toISOString().split('T')[0] }),
      }).catch(() => {});
    }
  };

  const addWaterGlass = () => {
    setWaterGlasses(prev => {
      const next = prev >= 12 ? 0 : prev + 1;
      const token = localStorage.getItem('femsphere_token');
      if (token) {
        fetch('/api/health-tracker/vitals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ water_intake_ml: next * 250, log_date: new Date().toISOString().split('T')[0] }),
        }).catch(() => {});
      }
      return next;
    });
  };

  const toggleWearableConnection = (id: string) => {
    setWearables(prev =>
      prev.map(w => (w.id === id ? { ...w, connected: !w.connected, lastSynced: 'Just now' } : w))
    );
  };

  const syncWearable = (id: string) => {
    setWearables(prev =>
      prev.map(w => (w.id === id ? { ...w, lastSynced: 'Just now', batteryPct: Math.max(10, w.batteryPct - 1) } : w))
    );
    // add notification
    setNotifications(prev => [
      {
        id: `not_${Date.now()}`,
        category: 'Wearable',
        title: 'Wearable Telemetry Synced',
        message: 'Optical sensors transferred high-resolution biometrics to Digital Health Twin.',
        timestamp: 'Just now',
        read: false,
      },
      ...prev,
    ]);
  };

  const startWearableScan = () => {
    setIsScanningWearables(true);
    setTimeout(() => {
      setIsScanningWearables(false);
    }, 2800);
  };

  const toggleMedicationStatus = (medId: string, time: string, status: 'taken' | 'skipped' | 'snoozed') => {
    setMedications(prev =>
      prev.map(m => {
        if (m.id === medId) {
          const newStatus = { ...m.statusToday, [time]: status };
          const remaining = status === 'taken' ? Math.max(0, m.remainingTablets - 1) : m.remainingTablets;
          return { ...m, statusToday: newStatus, remainingTablets: remaining };
        }
        return m;
      })
    );
  };

  const addDocument = (doc: Omit<MedicalDocument, 'id'>) => {
    const newDoc: MedicalDocument = {
      ...doc,
      id: `doc_${Date.now()}`,
    };
    setDocuments(prev => [newDoc, ...prev]);
    setSelectedDoc(newDoc);
  };

  const bookAppointment = (apt: Omit<AppointmentItem, 'id'>) => {
    const newApt: AppointmentItem = {
      ...apt,
      id: `apt_${Date.now()}`,
    };
    setAppointments(prev => [newApt, ...prev]);
  };

  const startTelehealthSession = (doc: { name: string; specialty: string; avatar: string }) => {
    setActiveTelehealthDoctor(doc);
    setIsTelehealthActive(true);
  };

  const endTelehealthSession = () => {
    setIsTelehealthActive(false);
    setActiveTelehealthDoctor(null);
  };

  const toggleVaccinationStatus = (id: string) => {
    setVaccinations(prev =>
      prev.map(v =>
        v.id === id
          ? {
              ...v,
              status: v.status === 'completed' ? 'upcoming' : 'completed',
              completedDate: v.status === 'completed' ? undefined : new Date().toISOString().split('T')[0],
            }
          : v
      )
    );
  };

  const updateDoctorAvailability = (avail: Partial<AppContextType['doctorAvailability']>) => {
    setDoctorAvailability(prev => ({ ...prev, ...avail }));
  };

  const toggleUserStatus = (id: string) => {
    setUsersList(prev =>
      prev.map(u => (u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u))
    );
  };

  const verifyDoctor = (id: string, action: 'approved' | 'rejected') => {
    setPendingDoctors(prev =>
      prev.map(d => (d.id === id ? { ...d, status: action } : d))
    );
  };

  const toggleArticlePublish = (id: string) => {
    setArticles(prev =>
      prev.map(a => (a.id === id ? { ...a, status: a.status === 'published' ? 'draft' : 'published' } : a))
    );
  };

  const addArticle = (art: Omit<HealthArticle, 'id'>) => {
    const newArt: HealthArticle = { ...art, id: `art_${Date.now()}` };
    setArticles(prev => [newArt, ...prev]);
  };

  const togglePartnerShare = (key: 'shareCycle' | 'shareFertile' | 'shareWellness' | 'shareActivity' | 'shareNotifications') => {
    setPartnerSync(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const revokePartnerSync = () => {
    setPartnerSync(prev => ({
      ...prev,
      connected: false,
      shareCycle: false,
      shareFertile: false,
      shareWellness: false,
      shareActivity: false,
      shareNotifications: false,
    }));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <AppContext.Provider
      value={{
        isDark,
        toggleTheme,
        isPhoneFrame,
        togglePhoneFrame,
        role,
        setRole,
        activeTab,
        setActiveTab,
        activeSubView,
        setActiveSubView,
        user,
        setUser,
        activeMode,
        setActiveMode,
        currentLifeStage,
        setCurrentLifeStage,
        vitals,
        updateVital,
        cycleData,
        logSymptom,
        waterGlasses,
        addWaterGlass,
        wearables,
        activeWearableId,
        setActiveWearableId,
        toggleWearableConnection,
        syncWearable,
        isScanningWearables,
        startWearableScan,
        medications,
        toggleMedicationStatus,
        documents,
        addDocument,
        selectedDoc,
        setSelectedDoc,
        appointments,
        bookAppointment,
        isTelehealthActive,
        setIsTelehealthActive,
        activeTelehealthDoctor,
        startTelehealthSession,
        endTelehealthSession,
        dependents,
        activeDependentId,
        setActiveDependentId,
        vaccinations,
        toggleVaccinationStatus,
        patients,
        selectedPatientId,
        setSelectedPatientId,
        doctorAvailability,
        updateDoctorAvailability,
        usersList,
        toggleUserStatus,
        pendingDoctors,
        verifyDoctor,
        articles,
        toggleArticlePublish,
        addArticle,
        partnerSync,
        togglePartnerShare,
        revokePartnerSync,
        notifications,
        markNotificationRead,
        clearAllNotifications,
        isAuthOpen,
        setIsAuthOpen,
        authMode,
        setAuthMode,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isAIChatOpen,
        setIsAIChatOpen,
        isWorkoutOpen,
        setIsWorkoutOpen,
        isEmergencyOpen,
        setIsEmergencyOpen,
        isPrivacyOpen,
        setIsPrivacyOpen,
        isSearchOpen,
        setIsSearchOpen,
        isNotificationOpen,
        setIsNotificationOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
