export type UserRole = 'patient' | 'caregiver' | 'doctor' | 'admin';

export type LifeStageId =
  | 'early_childhood'
  | 'childhood'
  | 'pre_puberty'
  | 'puberty'
  | 'reproductive_age'
  | 'pregnancy'
  | 'postpartum'
  | 'perimenopause'
  | 'menopause'
  | 'older_adult';

export interface LifeStageInfo {
  id: LifeStageId;
  name: string;
  ageRange: string;
  description: string;
  keyFocusAreas: string[];
  recommendedTracking: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  dob: string;
  currentLifeStage: LifeStageId;
  heightCm: number;
  weightKg: number;
  bloodGroup: string;
  allergies: string[];
  conditions: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  activeMode?: 'standard' | 'pregnancy' | 'postpartum' | 'menopause';
  pregnancyWeek?: number;
}

export interface VitalMetric {
  id: string;
  label: string;
  value: string | number;
  unit: string;
  status: 'normal' | 'optimal' | 'warning' | 'alert';
  change?: string;
  lastUpdated: string;
  source: 'wearable' | 'manual' | 'lab';
}

export interface MenstrualCycleData {
  currentDay: number;
  cycleLength: number;
  periodLength: number;
  currentPhase: 'Menstrual' | 'Follicular' | 'Ovulation' | 'Luteal';
  nextPeriodDays: number;
  fertileWindow: { startDay: number; endDay: number };
  ovulationDay: number;
  recentSymptoms: string[];
}

export interface WearableDevice {
  id: string;
  brand: 'Amazfit' | 'Apple Watch' | 'Fitbit' | 'Garmin' | 'Samsung' | 'Google Pixel' | 'Generic BLE';
  model: string;
  connected: boolean;
  batteryPct: number;
  lastSynced: string;
  signalStrength: number; // 0-100
  supportedMetrics: string[];
}

export interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  scheduledTimes: string[]; // e.g., ["08:00 AM", "08:00 PM"]
  remainingTablets: number;
  refillThreshold: number;
  statusToday: { [time: string]: 'taken' | 'skipped' | 'snoozed' | 'pending' };
}

export interface MedicalDocument {
  id: string;
  title: string;
  category: 'Lab Reports' | 'Prescriptions' | 'Medical Reports' | 'Vaccinations' | 'Imaging' | 'Doctor Notes';
  date: string;
  doctorName?: string;
  facility?: string;
  fileSize: string;
  aiProcessed: boolean;
  extractedBiomarkers?: {
    name: string;
    value: string;
    unit: string;
    referenceRange: string;
    status: 'normal' | 'high' | 'low';
  }[];
  aiSummary?: string;
  doctorQuestions?: string[];
}

export interface AppointmentItem {
  id: string;
  doctorName: string;
  specialty: string;
  avatar: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  type: 'video' | 'in_person';
  hospital?: string;
  notes?: string;
}

export interface DependentItem {
  id: string;
  name: string;
  relation: string;
  age: number;
  avatar: string;
  healthScore: number;
  lastSync: string;
  status: 'Good' | 'Needs Attention' | 'Stable';
  currentVitals: {
    hr: number;
    temp: number;
    bp: string;
    sleep: string;
  };
  vaccinesDue: number;
  medicationsCount: number;
}

export interface VaccinationItem {
  id: string;
  dependentId: string;
  vaccineName: string;
  dueDate: string;
  completedDate?: string;
  status: 'completed' | 'upcoming' | 'overdue';
  provider?: string;
}

export interface DoctorPatient {
  id: string;
  name: string;
  age: number;
  gender: string;
  stage: string;
  lastVisit: string;
  conditionSummary: string;
  healthScore: number;
  vitals: {
    hr: number;
    bp: string;
    spo2: number;
    temp: number;
  };
  recentAlert?: string;
}

export interface AppNotification {
  id: string;
  category: 'Health' | 'Medication' | 'Appointment' | 'Wearable' | 'Cycle' | 'Caregiver' | 'Doctor' | 'System';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  urgent?: boolean;
}

export interface HealthArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  author: string;
  status: 'published' | 'draft';
  date: string;
  summary: string;
}
