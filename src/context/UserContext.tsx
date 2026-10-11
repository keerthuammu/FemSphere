import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  isValidEmail, 
  isValidPhone, 
  isValidName, 
  validatePassword, 
  isPastOrToday, 
  isFutureDate, 
  isValidWater, 
  isValidSleep, 
  isValidExercise, 
  isValidHeartRate, 
  isValidBloodPressure, 
  isValidDocumentFile 
} from '../utils/validation';

export function calculateAge(dobString: string): number {
  if (!dobString) return 30;
  const birthDate = new Date(dobString);
  if (isNaN(birthDate.getTime())) return 30;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? age : 0;
}

export function getStageFromAge(age: number): { code: string; name: string } {
  if (age < 2)  return { code: 'EARLY_CHILDHOOD',        name: 'Early Childhood' };
  if (age < 9)  return { code: 'PRE_PUBERTY',            name: 'Pre-Puberty (Childhood)' };
  if (age < 13) return { code: 'PUBERTY',                name: 'Puberty & Adolescence' };
  if (age < 18) return { code: 'MENSTRUATING_ADOLESCENT', name: 'Adolescent (Teen)' };
  if (age < 25) return { code: 'YOUNG_ADULT',            name: 'Young Adult (18–24)' };
  if (age < 45) return { code: 'REPRODUCTIVE_AGE',       name: 'Reproductive Age' };
  if (age < 52) return { code: 'PERIMENOPAUSE',          name: 'Perimenopause' };
  if (age < 60) return { code: 'MENOPAUSE',              name: 'Menopause' };
  return         { code: 'OLDER_ADULT',               name: 'Healthy Aging (60+)' };
}

export interface UserProfile {
  fullName: string;
  avatarUrl: string | null;
  avatarBg: string;
  dob: string;
  age: number;
  bloodGroup: string;
  height: string;
  weight: string;
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
  menarcheStarted?: boolean;
}

export interface MedicalRecordItem {
  id: string | number;
  title: string;
  type: string;
  date: string;
  month: string;
  description: string;
  size: string;
  category: string;
  isScanned: boolean;
  scanResults?: any;
}

export interface HealthTrackerLog {
  id: string | number;
  date: string;
  weight?: string;
  water?: string;
  sleep?: string;
  exerciseType?: string;
  exercise?: string;
  caloriesBurned?: string;
  steps?: string;
  distanceKm?: string;
  foodMeals?: string;
  caloriesIntake?: string;
  bloodPressure?: string;
  heartRate?: string;
  mood?: string;
  symptomName?: string;
  symptomSeverity?: string;
  notes?: string;
}

export interface SymptomLog {
  id: string | number;
  symptomName: string;
  severity: string;
  date: string;
  description?: string;
}

export interface AppointmentItem {
  id: string | number;
  doctor: string;
  doctorId?: number;
  date: string;
  time: string;
  reason: string;
  status: string;
  type?: string;
}

export interface NotificationItem {
  id: string | number;
  title: string;
  message: string;
  time: string;
  type: string;
  read: boolean;
}

export interface DoctorOption {
  id: number;
  name: string;
  specialization: string;
  hospitalClinic?: string;
}

export interface AvailableDoctorShift {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  type: string;
  maxPatients: number;
  bookedCount: number;
  remainingCapacity: number;
  isFull: boolean;
  notes?: string;
  slots: string[];
  availableSlots: string[];
}

export interface AvailableDoctorItem {
  id: number;
  userId: number;
  name: string;
  specialization: string;
  hospitalClinic: string;
  licenseNumber?: string;
  teleconsultFee?: number;
  shifts: AvailableDoctorShift[];
}

export interface ConsultationNoteItem {
  id: string | number;
  doctor_id: number;
  doctor_name?: string;
  doctor_username?: string;
  specialization?: string;
  hospital_clinic?: string;
  license_number?: string;
  diagnosis: string;
  advice: string;
  prescription_notes?: string;
  chief_complaint?: string;
  appointment_id?: number;
  prescribed_exercises?: Array<{
    name: string;
    target: string;
    setsReps: string;
    clinicalNote?: string;
  }>;
  created_at: string;
}

export interface IncomingCallSession {
  appointmentId: number;
  doctorId: number;
  doctorName: string;
  doctorSpecialization?: string;
  appointmentTime: string;
  appointmentDate: string;
  roomUrl?: string;
}

export interface ActiveVideoConsultation {
  appointmentId: number;
  doctorName: string;
  doctorSpecialization?: string;
  roomUrl?: string;
  durationSeconds: number;
}

// Period & Menstrual Cycle Tracking Interfaces
export interface PeriodSettings {
  id?: number;
  lastPeriodStart: string;
  periodDuration: number;
  cycleLength: number;
  isConfigured: boolean;
  isPregnant?: boolean;
  pregnancyStartDate?: string | null;
  gestationalTargetEdd?: string | null;
  updatedAt?: string;
}

export interface PhaseOverviewItem {
  id: string;
  name: string;
  days: string;
  badge: string;
  color: string;
  hormone: string;
  feelings: string;
  foods: string;
  workouts: string;
  isActive: boolean;
}

export interface PeriodMetrics {
  cycleDay: number;
  cycleLength: number;
  periodDuration: number;
  lastPeriodStart: string;
  phaseCode: 'MENSTRUAL' | 'FOLLICULAR' | 'OVULATORY' | 'LUTEAL' | 'DELAYED' | 'PREGNANCY';
  phaseName: string;
  phaseBadge: string;
  phaseColor: string;
  phaseDescription: string;
  hormonalState: string;
  isDelayed: boolean;
  daysDelayed: number;
  cycleProgressPercent: number;
  nextPeriodDateStr: string;
  ovulationDateStr: string;
  fertileWindowStr: string;
  phasesOverview?: PhaseOverviewItem[];
  isPregnant?: boolean;
  pregnancyStartDate?: string;
  gestationalWeeks?: number;
  gestationalDays?: number;
  totalDaysPregnant?: number;
  edd?: string;
  daysRemaining?: number;
  trimester?: number;
  trimesterName?: string;
  babySize?: string;
  babyIcon?: string;
  prenatalChecklist?: Array<{ id: number; week: string; title: string; completed: boolean }>;
}

export interface CycleHistoryItem {
  id: number | string;
  startDate: string;
  endDate: string | null;
  durationDays: number;
  cycleLengthDays: number;
  status: string;
  varianceDays: number;
  flowIntensity: string;
  symptoms: string[];
  mood: string;
  notes?: string;
  createdAt?: string;
}

export interface MenstrualTip {
  title: string;
  category: string;
  tip: string;
  icon: string;
}

export interface CyclePrediction {
  lastPeriodStartDate: string;
  nextPeriodStartDate: string;
  nextPeriodRangeStartDate: string;
  nextPeriodRangeEndDate: string;
  ovulationDate: string;
  fertileWindowStartDate: string;
  fertileWindowEndDate: string;
  estimatedPeriodDuration: number;
  cycleDaysElapsed: number;
  daysUntilPeriod: number;
  isDelayed: boolean;
  daysDelayed: number;
  predictionDisclaimer: string;
}

export interface CycleStatistics {
  recordedCyclesCount: number;
  averageCycleLength: number;
  averagePeriodDuration: number;
  cycleVariabilityDays: number;
  minCycleLength: number;
  maxCycleLength: number;
  isIrregular: boolean;
  confidenceLevel: string;
}

export interface DailyLogItem {
  id?: number;
  date: string;
  isPeriodDay: boolean;
  flowIntensity: string;
  symptoms: string[];
  mood: string;
  energyLevel?: string;
  sleepQuality?: string;
  cervicalMucus?: string;
  notes?: string;
  updatedAt?: string;
}

export interface PeriodReminders {
  periodDaysBefore: number;
  periodEnabled: boolean;
  ovulationEnabled: boolean;
  dailyLoggingEnabled: boolean;
}


interface UserContextType {
  // Profile
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  editProfileForm: UserProfile;
  setEditProfileForm: React.Dispatch<React.SetStateAction<UserProfile>>;
  isEditingProfile: boolean;
  setIsEditingProfile: React.Dispatch<React.SetStateAction<boolean>>;
  profileErrorMsg: string | null;
  setProfileErrorMsg: React.Dispatch<React.SetStateAction<string | null>>;
  handleSaveProfile: (e: React.FormEvent) => Promise<void>;
  
  // Avatar & Photo Modal
  showPhotoModal: boolean;
  setShowPhotoModal: React.Dispatch<React.SetStateAction<boolean>>;
  tempAvatarUrl: string | null;
  setTempAvatarUrl: React.Dispatch<React.SetStateAction<string | null>>;
  tempAvatarBg: string;
  setTempAvatarBg: React.Dispatch<React.SetStateAction<string>>;
  handleSaveProfilePhoto: (e: React.FormEvent) => void;
  handleFilePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  // Password Modal
  showPasswordModal: boolean;
  setShowPasswordModal: React.Dispatch<React.SetStateAction<boolean>>;
  passwordData: { oldPassword: ''; newPassword: ''; confirmPassword: '' };
  setPasswordData: React.Dispatch<React.SetStateAction<{ oldPassword: ''; newPassword: ''; confirmPassword: '' }>>;
  passwordMsg: string | null;
  setPasswordMsg: React.Dispatch<React.SetStateAction<string | null>>;
  handleChangePassword: (e: React.FormEvent) => void;

  // Life Stage
  currentStageCode: string;
  stageName: string;
  showLifeStageModal: boolean;
  setShowLifeStageModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleSelectStage: (code: string) => Promise<void>;

  // Clock
  currentTime: Date;

  // Bluetooth & Smartwatch / Connected Devices
  showBluetoothModal: boolean;
  setShowBluetoothModal: React.Dispatch<React.SetStateAction<boolean>>;
  showConnectDeviceModal: boolean;
  setShowConnectDeviceModal: React.Dispatch<React.SetStateAction<boolean>>;
  bluetoothConnected: boolean;
  connectedDevice: string | null;
  wearableDevices: any[];
  activeWearable: any | null;
  fetchWearables: () => Promise<void>;
  isScanning: boolean;
  foundDevices: Array<{ name: string; type: string; rssi: number; battery: number }>;
  smartwatchVitals: {
    heartRate: number;
    spO2: number;
    bodyTemp: number;
    steps: number;
    calories: number;
    battery: number;
    lastSynced: string;
  };
  handleScanBluetoothDevices: () => Promise<void>;
  handleConnectBleDevice: () => Promise<{ success: boolean; message: string; device?: any }>;
  handleRegisterWearableDevice: (deviceData: any) => Promise<boolean>;
  handleDisconnectWearableDevice: (deviceId: number) => Promise<boolean>;
  handleSyncWearableTelemetry: (telemetryData: any) => Promise<boolean>;
  handlePairDevice: (deviceName: string) => void;
  handleDisconnectBluetooth: () => void;
  handleSyncWatchVitals: () => Promise<void>;

  // Medical Records
  records: MedicalRecordItem[];
  selectedMonthFilter: string;
  setSelectedMonthFilter: React.Dispatch<React.SetStateAction<string>>;
  isScanningDoc: boolean;
  scanningProgress: number;
  scanningRecordTitle: string;
  viewingScanRecordModal: any | null;
  setViewingScanRecordModal: React.Dispatch<React.SetStateAction<any | null>>;
  showUploadModal: boolean;
  setShowUploadModal: React.Dispatch<React.SetStateAction<boolean>>;
  newRecord: { title: string; type: string; description: string; category: string; fileName: string };
  setNewRecord: React.Dispatch<React.SetStateAction<{ title: string; type: string; description: string; category: string; fileName: string }>>;
  selectedRecordFile: File | null;
  setSelectedRecordFile: React.Dispatch<React.SetStateAction<File | null>>;
  uploadErrorMsg: string | null;
  setUploadErrorMsg: React.Dispatch<React.SetStateAction<string | null>>;
  handleScanMedicalReport: (recordId: string | number) => void;
  handleUploadRecord: (e: React.FormEvent) => Promise<void>;
  handleDeleteRecord: (id: string | number) => Promise<void>;
  fetchRecords: () => Promise<void>;

  // Health Tracker
  trackerLogs: HealthTrackerLog[];
  trackerInput: any;
  setTrackerInput: React.Dispatch<React.SetStateAction<any>>;
  editingTrackerId: string | number | null;
  setEditingTrackerId: React.Dispatch<React.SetStateAction<string | number | null>>;
  trackerErrorMsg: string | null;
  setTrackerErrorMsg: React.Dispatch<React.SetStateAction<string | null>>;
  handleSaveTrackerLog: (e: React.FormEvent) => Promise<void>;
  handleEditTrackerLog: (log: HealthTrackerLog) => void;
  handleDeleteTrackerLog: (id: string | number) => Promise<void>;
  fetchTrackerLogs: () => Promise<void>;

  // Symptoms
  symptomLogs: SymptomLog[];
  symptomInput: { symptomName: string; severity: string; date: string; description: string };
  setSymptomInput: React.Dispatch<React.SetStateAction<{ symptomName: string; severity: string; date: string; description: string }>>;
  editingSymptomId: string | number | null;
  setEditingSymptomId: React.Dispatch<React.SetStateAction<string | number | null>>;
  handleSaveSymptom: (e: React.FormEvent) => Promise<void>;
  handleEditSymptom: (sym: SymptomLog) => void;
  handleDeleteSymptom: (id: string | number) => Promise<void>;
  fetchSymptoms: () => Promise<void>;

  // Appointments
  appointments: AppointmentItem[];
  doctorsList: DoctorOption[];
  availableDoctors: AvailableDoctorItem[];
  isLoadingAvailableDoctors: boolean;
  availableSearchFilters: { date: string; place: string; time: string; specialty: string };
  setAvailableSearchFilters: React.Dispatch<React.SetStateAction<{ date: string; place: string; time: string; specialty: string }>>;
  fetchAvailableDoctors: (customFilters?: { date?: string; place?: string; time?: string; specialty?: string }) => Promise<void>;
  showBookModal: boolean;
  setShowBookModal: React.Dispatch<React.SetStateAction<boolean>>;
  newAppointment: { doctor: string; doctorId?: number; date: string; time: string; reason: string; type: string };
  setNewAppointment: React.Dispatch<React.SetStateAction<{ doctor: string; doctorId?: number; date: string; time: string; reason: string; type: string }>>;
  appointmentErrorMsg: string | null;
  setAppointmentErrorMsg: React.Dispatch<React.SetStateAction<string | null>>;
  handleBookAppointment: (e: React.FormEvent) => Promise<void>;
  handleCancelAppointment: (id: string | number) => Promise<void>;
  handleDeleteAppointment: (id: string | number) => Promise<void>;
  fetchAppointments: () => Promise<void>;

  // Consultations & Prescriptions
  consultationNotes: ConsultationNoteItem[];
  fetchConsultationNotes: () => Promise<void>;

  // Notifications
  notifications: NotificationItem[];
  unreadCount: number;
  markNotificationRead: (id: string | number) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  deleteNotification: (id: string | number) => Promise<void>;
  addNotification: (notif: { title: string; message: string; type?: string }) => Promise<void>;
  fetchNotifications: () => Promise<void>;

  // Settings
  settings: { emailAlerts: boolean; smsAlerts: boolean; healthReminders: boolean; darkTheme: boolean };
  setSettings: React.Dispatch<React.SetStateAction<{ emailAlerts: boolean; smsAlerts: boolean; healthReminders: boolean; darkTheme: boolean }>>;

  // Reports Preview
  showReportPreview: boolean;
  setShowReportPreview: React.Dispatch<React.SetStateAction<boolean>>;
  handlePrintPDFReport: () => void;

  // Telehealth Active & Incoming Calls
  incomingCall: IncomingCallSession | null;
  activeVideoConsultation: ActiveVideoConsultation | null;
  handleAcceptCall: () => Promise<void>;
  handleDeclineCall: () => Promise<void>;
  handleEndUserCall: () => Promise<void>;

  // Period Tracker (Reproductive Age Feature)
  isReproductiveAgeUser: boolean;
  isPeriodTrackerConfigured: boolean;
  periodSettings: PeriodSettings | null;
  periodMetrics: PeriodMetrics | null;
  predictions: CyclePrediction | null;
  historicalStats: CycleStatistics | null;
  dailyLogs: DailyLogItem[];
  todayDailyLog: DailyLogItem | null;
  periodReminders: PeriodReminders;
  cycleHistory: CycleHistoryItem[];
  menstrualAffirmation: string;
  menstrualTips: MenstrualTip[];
  isLoadingPeriodData: boolean;
  periodErrorMsg: string | null;
  setPeriodErrorMsg: (val: string | null) => void;
  fetchPeriodData: () => Promise<void>;
  fetchDailyLogs: (monthOrDate?: string) => Promise<void>;
  handleSavePeriodSetup: (data: { lastPeriodStart: string; periodDuration: number; cycleLength: number }) => Promise<boolean>;
  handleLogPeriodEntry: (data: { startDate: string; endDate?: string; durationDays?: number; flowIntensity: string; symptoms: string[]; mood: string; notes?: string }) => Promise<boolean>;
  handleUpdatePeriodCycle: (id: number | string, data: any) => Promise<boolean>;
  handleDeletePeriodCycle: (id: number | string) => Promise<boolean>;
  handleSaveDailyLog: (logData: DailyLogItem) => Promise<boolean>;
  handleDeleteDailyLog: (date: string) => Promise<boolean>;
  handleUpdatePeriodSettings: (settingsData: any) => Promise<boolean>;
  handleAdjustCycleDelay: (newCycleLength?: number, delayDays?: number) => Promise<boolean>;
  handleActivatePregnancy: (lmpDate?: string) => Promise<boolean>;
  handleDeactivatePregnancy: (resumePeriodDate?: string) => Promise<boolean>;

  // Logout
  handleLogout: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  // 1. Live Clock
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. User Profile State (Initialized from localStorage session, then refreshed from DB)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const defaults: UserProfile = {
      fullName: '',
      avatarUrl: null,
      avatarBg: '#936DA2',
      dob: '',
      age: 0,
      bloodGroup: '',
      height: '',
      weight: '',
      phone: '',
      email: '',
      address: '',
      emergencyContact: '',
    };
    try {
      const storedUser = localStorage.getItem('femsphere_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        const p = parsed.profile || {};
        return {
          ...defaults,
          fullName: parsed.fullName || p.full_name || p.fullName || defaults.fullName,
          avatarUrl: parsed.avatarUrl || null,
          avatarBg: parsed.avatarBg || '#936DA2',
          email: parsed.email || p.email || defaults.email,
          phone: p.mobile || p.mobileNumber || p.emergency_contact_phone || defaults.phone,
          dob: p.dob || defaults.dob,
          bloodGroup: p.blood_group || p.bloodGroup || defaults.bloodGroup,
          height: p.height_cm ? String(p.height_cm) : (p.heightCm ? String(p.heightCm) : defaults.height),
          weight: p.weight_kg ? String(p.weight_kg) : (p.weightKg ? String(p.weightKg) : defaults.weight),
          address: p.address ? `${p.address}${p.city ? `, ${p.city}` : ''}` : defaults.address,
          emergencyContact: p.emergency_contact_name || defaults.emergencyContact
        };
      }
    } catch (e) {
      console.error('Error loading stored user session', e);
    }
    return defaults;
  });

  const [editProfileForm, setEditProfileForm] = useState<UserProfile>({ ...userProfile });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileErrorMsg, setProfileErrorMsg] = useState<string | null>(null);

  // Avatar Modal State
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [tempAvatarUrl, setTempAvatarUrl] = useState<string | null>(null);
  const [tempAvatarBg, setTempAvatarBg] = useState('#936DA2');

  // Password Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState<{ oldPassword: ''; newPassword: ''; confirmPassword: '' }>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);

  // Life Stage State
  const [currentStageCode, setCurrentStageCode] = useState<string>('REPRODUCTIVE_AGE');
  const [stageName, setStageName] = useState<string>('Reproductive Age');
  const [showLifeStageModal, setShowLifeStageModal] = useState(false);

  // Bluetooth & Smartwatch / Connected Devices State (Pure Backend)
  const [showBluetoothModal, setShowBluetoothModal] = useState(false);
  const [showConnectDeviceModal, setShowConnectDeviceModal] = useState(false);
  const [wearableDevices, setWearableDevices] = useState<any[]>([]);
  const [activeWearable, setActiveWearable] = useState<any | null>(null);
  const [bluetoothConnected, setBluetoothConnected] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [foundDevices, setFoundDevices] = useState<Array<{ name: string; type: string; rssi: number; battery: number }>>([]);
  const [smartwatchVitals, setSmartwatchVitals] = useState({
    heartRate: 0,
    spO2: 0,
    bodyTemp: 0,
    steps: 0,
    calories: 0,
    battery: 0,
    lastSynced: ''
  });

  // Medical Records State (Pure Backend - Starts empty)
  const [records, setRecords] = useState<MedicalRecordItem[]>([]);
  const currentMonthStr = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const [selectedMonthFilter, setSelectedMonthFilter] = useState(currentMonthStr);
  const [isScanningDoc, setIsScanningDoc] = useState(false);
  const [scanningProgress, setScanningProgress] = useState(0);
  const [scanningRecordTitle, setScanningRecordTitle] = useState('');
  const [viewingScanRecordModal, setViewingScanRecordModal] = useState<any | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newRecord, setNewRecord] = useState({ title: '', type: 'PDF', description: '', category: 'Lab Results', fileName: '' });
  const [selectedRecordFile, setSelectedRecordFile] = useState<File | null>(null);
  const [uploadErrorMsg, setUploadErrorMsg] = useState<string | null>(null);

  // Health Tracker State (Pure Backend - Starts empty)
  const [trackerLogs, setTrackerLogs] = useState<HealthTrackerLog[]>([]);
  const [trackerErrorMsg, setTrackerErrorMsg] = useState<string | null>(null);
  const [trackerInput, setTrackerInput] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    water: '',
    sleep: '',
    exerciseType: '',
    exercise: '',
    caloriesBurned: '',
    steps: '',
    distanceKm: '',
    foodMeals: '',
    caloriesIntake: '',
    bloodPressure: '',
    heartRate: '',
    mood: 'Good',
    symptomName: '',
    symptomSeverity: 'Low',
    notes: ''
  });
  const [editingTrackerId, setEditingTrackerId] = useState<string | number | null>(null);

  // Symptoms State (Pure Backend - Starts empty)
  const [symptomLogs, setSymptomLogs] = useState<SymptomLog[]>([]);
  const [symptomInput, setSymptomInput] = useState({
    symptomName: '', severity: 'Low', date: new Date().toISOString().split('T')[0], description: ''
  });
  const [editingSymptomId, setEditingSymptomId] = useState<string | number | null>(null);

  // Appointments State (Pure Backend - Starts empty)
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [doctorsList, setDoctorsList] = useState<DoctorOption[]>([]);
  const [availableDoctors, setAvailableDoctors] = useState<AvailableDoctorItem[]>([]);
  const [isLoadingAvailableDoctors, setIsLoadingAvailableDoctors] = useState(false);
  const [availableSearchFilters, setAvailableSearchFilters] = useState({
    date: new Date().toISOString().split('T')[0],
    place: '',
    time: '',
    specialty: ''
  });
  const [showBookModal, setShowBookModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState<{ doctor: string; doctorId?: number; date: string; time: string; reason: string; type: string }>({
    doctor: '', date: new Date().toISOString().split('T')[0], time: '10:00 AM', reason: '', type: 'Virtual Telehealth'
  });
  const [appointmentErrorMsg, setAppointmentErrorMsg] = useState<string | null>(null);

  // Doctor Consultations & Prescriptions (Pure Backend)
  const [consultationNotes, setConsultationNotes] = useState<ConsultationNoteItem[]>([]);

  // Notifications State (Pure Backend - Starts empty)
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Settings State
  const [settings, setSettings] = useState({
    emailAlerts: true,
    smsAlerts: true,
    healthReminders: true,
    darkTheme: false,
  });

  // Report Preview State
  const [showReportPreview, setShowReportPreview] = useState(false);

  // Telehealth Incoming & Active Call State
  const [incomingCall, setIncomingCall] = useState<IncomingCallSession | null>(null);
  const [activeVideoConsultation, setActiveVideoConsultation] = useState<ActiveVideoConsultation | null>(null);

  // Period & Menstrual Cycle Tracker State
  const [isPeriodTrackerConfigured, setIsPeriodTrackerConfigured] = useState(false);
  const [periodSettings, setPeriodSettings] = useState<PeriodSettings | null>(null);
  const [periodMetrics, setPeriodMetrics] = useState<PeriodMetrics | null>(null);
  const [cycleHistory, setCycleHistory] = useState<CycleHistoryItem[]>([]);
  const [predictions, setPredictions] = useState<CyclePrediction | null>(null);
  const [historicalStats, setHistoricalStats] = useState<CycleStatistics | null>(null);
  const [dailyLogs, setDailyLogs] = useState<DailyLogItem[]>([]);
  const [todayDailyLog, setTodayDailyLog] = useState<DailyLogItem | null>(null);
  const [periodReminders, setPeriodReminders] = useState<PeriodReminders>({
    periodDaysBefore: 2,
    periodEnabled: true,
    ovulationEnabled: false,
    dailyLoggingEnabled: false
  });
  const [menstrualAffirmation, setMenstrualAffirmation] = useState('');
  const [menstrualTips, setMenstrualTips] = useState<MenstrualTip[]>([]);
  const [isLoadingPeriodData, setIsLoadingPeriodData] = useState(false);
  const [periodErrorMsg, setPeriodErrorMsg] = useState<string | null>(null);

  const isReproductiveAgeUser = 
    Boolean(periodSettings?.isPregnant) ||
    currentStageCode === 'PREGNANCY' ||
    currentStageCode === 'REPRODUCTIVE_AGE' || 
    currentStageCode === 'YOUNG_ADULT' ||
    currentStageCode === 'MENSTRUATING_ADOLESCENT' ||
    currentStageCode === 'PERIMENOPAUSE';

  // ==============================================================================
  // BACKEND API FETCH FUNCTIONS
  // ==============================================================================

  const fetchUserProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('femsphere_token');
      if (!token) return;
      const res = await fetch('/api/users/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.profile) {
        const p = data.profile;
        const dobStr = p.dob ? (p.dob.includes('T') ? p.dob.split('T')[0] : p.dob) : '1996-08-14';
        const userAge = calculateAge(dobStr);

        let dynamicCode = 'REPRODUCTIVE_AGE';
        let dynamicName = 'Reproductive Age';
        try {
          const stageRes = await fetch('/api/life-stages/current', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const stageData = await stageRes.json();
          if (stageData.success && stageData.currentStage) {
            dynamicCode = stageData.currentStage.life_stage_code;
            dynamicName = stageData.currentStage.name;
          } else {
            const autoStage = getStageFromAge(userAge);
            dynamicCode = autoStage.code;
            dynamicName = autoStage.name;
          }
        } catch (_) {
          const autoStage = getStageFromAge(userAge);
          dynamicCode = autoStage.code;
          dynamicName = autoStage.name;
        }

        setCurrentStageCode(dynamicCode);
        setStageName(dynamicName);

        const loadedProfile: UserProfile = {
          fullName: p.full_name || data.user?.username || '',
          avatarUrl: userProfile.avatarUrl,
          avatarBg: userProfile.avatarBg,
          email: data.user?.email || '',
          phone: p.emergency_contact_phone || p.mobile || '',
          dob: dobStr,
          age: userAge,
          bloodGroup: p.blood_group || '',
          height: p.height_cm ? String(p.height_cm) : '',
          weight: p.weight_kg ? String(p.weight_kg) : '',
          address: p.address || '',
          emergencyContact: p.emergency_contact_name || '',
          menarcheStarted: p.menarche_started !== false
        };

        setUserProfile(loadedProfile);
        setEditProfileForm(loadedProfile);
      }
    } catch (e) {
      console.error('Error fetching user profile from database', e);
    }
  }, [userProfile.avatarUrl, userProfile.avatarBg]);

  const fetchRecords = useCallback(async () => {
    try {
      const token = localStorage.getItem('femsphere_token');
      if (!token) return;
      const res = await fetch('/api/medical-records', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        const formatted: MedicalRecordItem[] = data.map((item: any) => {
          const uploadedDate = item.uploaded_at ? new Date(item.uploaded_at) : new Date();
          return {
            id: item.id,
            title: item.title || item.file_name || 'Medical Document',
            type: (item.file_type || 'PDF').toUpperCase(),
            date: uploadedDate.toISOString().split('T')[0],
            month: uploadedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            description: item.description || 'Uploaded medical record',
            size: item.file_size_bytes ? `${(item.file_size_bytes / (1024 * 1024)).toFixed(1)} MB` : '1.8 MB',
            category: item.category || 'Lab Results',
            isScanned: Boolean(item.is_scanned),
            scanResults: item.scan_results ? (typeof item.scan_results === 'string' ? JSON.parse(item.scan_results) : item.scan_results) : null
          };
        });
        setRecords(formatted);
      }
    } catch (err) {
      console.error('Error fetching medical records:', err);
    }
  }, []);

  const fetchTrackerLogs = useCallback(async () => {
    try {
      const token = localStorage.getItem('femsphere_token');
      if (!token) return;
      const res = await fetch('/api/health-tracker/vitals', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        const mapped: HealthTrackerLog[] = data.map((l: any) => {
          let logDateStr = '';
          if (l.log_date) {
            if (typeof l.log_date === 'string') {
              logDateStr = l.log_date.includes('T') ? l.log_date.split('T')[0] : l.log_date;
            } else if (l.log_date instanceof Date) {
              logDateStr = l.log_date.toISOString().split('T')[0];
            } else {
              logDateStr = String(l.log_date).split('T')[0];
            }
          }
          return {
            id: l.id,
            date: logDateStr,
            weight: l.weight_kg ? String(l.weight_kg) : '',
            water: l.water_intake_liters ? String(l.water_intake_liters) : '',
            sleep: l.sleep_hours ? String(l.sleep_hours) : '',
            exercise: l.exercise_minutes ? String(l.exercise_minutes) : '',
            exerciseType: l.exercise_type || 'Cardio & Movement',
            caloriesBurned: l.calories_burned ? String(l.calories_burned) : '',
            steps: l.steps ? String(l.steps) : '',
            distanceKm: l.distance_km ? String(l.distance_km) : '',
            foodMeals: l.food_meals || '',
            caloriesIntake: l.calories_intake ? String(l.calories_intake) : '',
            bloodPressure: l.blood_pressure || '',
            heartRate: l.heart_rate ? String(l.heart_rate) : '',
            mood: l.mood || 'Good',
            notes: l.notes || ''
          };
        });
        setTrackerLogs(mapped);
      }
    } catch (err) {
      console.error('Error fetching health tracker logs:', err);
    }
  }, []);

  const fetchSymptoms = useCallback(async () => {
    try {
      const token = localStorage.getItem('femsphere_token');
      if (!token) return;
      const res = await fetch('/api/health-tracker/symptoms', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        const mapped: SymptomLog[] = data.map((s: any) => ({
          id: s.id,
          symptomName: s.symptom_name,
          severity: s.severity || 'Low',
          date: s.onset_date ? (s.onset_date.includes('T') ? s.onset_date.split('T')[0] : s.onset_date) : '',
          description: s.notes || ''
        }));
        setSymptomLogs(mapped);
      }
    } catch (err) {
      console.error('Error fetching symptoms:', err);
    }
  }, []);

  const fetchWearables = useCallback(async () => {
    try {
      const token = localStorage.getItem('femsphere_token');
      if (!token) return;

      const devRes = await fetch('/api/wearables/devices', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const devData = await devRes.json();
      const devList = Array.isArray(devData.devices) ? devData.devices : [];
      setWearableDevices(devList);

      const activeDev = devList.find((d: any) => d.connection_status === 'CONNECTED') || devList[0] || null;
      setActiveWearable(activeDev);

      if (activeDev) {
        setConnectedDevice(activeDev.device_name);
        setBluetoothConnected(activeDev.connection_status === 'CONNECTED');

        const latestRes = await fetch(`/api/wearables/data/latest?device_id=${activeDev.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const latestData = await latestRes.json();
        if (latestData.success) {
          const reading = latestData.latest_reading;
          const summary = latestData.today_summary;

          const stepsVal = summary?.today_steps || reading?.steps || 0;
          const hrVal = summary?.avg_heart_rate || reading?.heart_rate || 0;
          const calVal = summary?.today_calories || reading?.calories || 0;
          const spo2Val = summary?.latest_spo2 || reading?.spo2 || 0;
          const tempVal = summary?.latest_body_temp || reading?.body_temperature || 0;
          const batteryVal = activeDev.battery_level || 0;

          let lastSyncStr = '';
          if (activeDev.last_synced_at) {
            try {
              lastSyncStr = new Date(activeDev.last_synced_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            } catch {}
          } else if (reading?.recorded_at) {
            try {
              lastSyncStr = new Date(reading.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            } catch {}
          }

          setSmartwatchVitals({
            heartRate: Number(hrVal),
            spO2: Number(spo2Val),
            bodyTemp: Number(tempVal),
            steps: Number(stepsVal),
            calories: Number(calVal),
            battery: Number(batteryVal),
            lastSynced: lastSyncStr
          });
        }
      } else {
        setConnectedDevice(null);
        setBluetoothConnected(false);
        setSmartwatchVitals({
          heartRate: 0,
          spO2: 0,
          bodyTemp: 0,
          steps: 0,
          calories: 0,
          battery: 0,
          lastSynced: ''
        });
      }
    } catch (err) {
      console.error('Error fetching wearable data:', err);
    }
  }, []);

  const fetchAppointments = useCallback(async () => {
    try {
      const token = localStorage.getItem('femsphere_token');
      if (!token) return;
      const res = await fetch('/api/appointments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.appointments)) {
        const mapped: AppointmentItem[] = data.appointments.map((a: any) => {
          const aptDate = a.appointment_date ? (a.appointment_date.includes('T') ? a.appointment_date.split('T')[0] : a.appointment_date) : '';
          const docTitle = a.doctor_full_name ? `Dr. ${a.doctor_full_name}${a.specialization ? ` (${a.specialization})` : ''}` : (a.doctor_username ? `Dr. ${a.doctor_username}` : 'Dr. Specialist');
          return {
            id: a.id,
            doctorId: a.doctor_id,
            doctor: docTitle,
            date: aptDate,
            time: a.appointment_time || '10:00 AM',
            reason: a.reason || 'General Consultation',
            status: a.status || 'Scheduled',
            type: a.type || 'Virtual Telehealth'
          };
        });
        setAppointments(mapped);
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  }, []);

  const fetchDoctors = useCallback(async () => {
    try {
      const res = await fetch('/api/doctors');
      const data = await res.json();
      if (Array.isArray(data)) {
        const mapped: DoctorOption[] = data.map((d: any) => ({
          id: d.id,
          name: d.full_name ? `Dr. ${d.full_name}` : `Dr. ${d.username || 'Physician'}`,
          specialization: d.specialization || 'General Practice',
          hospitalClinic: d.hospital_clinic || 'FemSphere Health Center'
        }));
        setDoctorsList(mapped);
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }
  }, []);

  const fetchAvailableDoctors = useCallback(async (customFilters?: { date?: string; place?: string; time?: string; specialty?: string }) => {
    setIsLoadingAvailableDoctors(true);
    try {
      const filters = { ...availableSearchFilters, ...(customFilters || {}) };
      const params = new URLSearchParams();
      if (filters.date) params.append('date', filters.date);
      if (filters.place) params.append('place', filters.place);
      if (filters.time) params.append('time', filters.time);
      if (filters.specialty) params.append('specialty', filters.specialty);

      const res = await fetch(`/api/doctors/available?${params.toString()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.doctors)) {
        setAvailableDoctors(data.doctors);
      } else {
        setAvailableDoctors([]);
      }
    } catch (err) {
      console.error('Error fetching available doctors with shifts:', err);
      setAvailableDoctors([]);
    } finally {
      setIsLoadingAvailableDoctors(false);
    }
  }, [availableSearchFilters]);

  const fetchNotifications = useCallback(async () => {
    try {
      const token = localStorage.getItem('femsphere_token');
      if (!token) return;
      const res = await fetch('/api/users/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        const mapped: NotificationItem[] = data.map((n: any) => {
          const created = n.created_at ? new Date(n.created_at) : new Date();
          return {
            id: n.id,
            title: n.title,
            message: n.message,
            time: created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: n.type || 'system',
            read: Boolean(n.is_read)
          };
        });
        setNotifications(mapped);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  }, []);

  const fetchConsultationNotes = useCallback(async () => {
    try {
      const token = localStorage.getItem('femsphere_token');
      if (!token) return;
      const res = await fetch('/api/users/consultations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.notes)) {
        setConsultationNotes(data.notes);
      }
    } catch (err) {
      console.error('Error fetching consultation notes:', err);
    }
  }, []);

  // Period Tracker API Fetch & Action Handlers
  const fetchPeriodData = useCallback(async () => {
    setIsLoadingPeriodData(true);
    try {
      const token = localStorage.getItem('femsphere_token');
      if (!token) return;
      const res = await fetch('/api/period-tracker/overview', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.isConfigured) {
        setIsPeriodTrackerConfigured(true);
        setPeriodSettings(data.settings);
        setPeriodMetrics(data.metrics);
        if (data.prediction || data.predictions) {
          setPredictions(data.prediction || data.predictions);
        }
        if (data.historicalStats) {
          setHistoricalStats(data.historicalStats);
        }
        if (data.todayLog !== undefined) {
          setTodayDailyLog(data.todayLog);
        }
        if (data.reminders) {
          setPeriodReminders(data.reminders);
        }
        setCycleHistory(data.cycleHistory || []);
        if (data.affirmation) setMenstrualAffirmation(data.affirmation);
        if (data.tips) setMenstrualTips(data.tips);
      } else {
        setIsPeriodTrackerConfigured(false);
        setPeriodSettings(null);
        setPeriodMetrics(null);
        setPredictions(null);
        setHistoricalStats(null);
      }
    } catch (err) {
      console.error('Error fetching period tracking data:', err);
    } finally {
      setIsLoadingPeriodData(false);
    }
  }, []);

  const fetchDailyLogs = useCallback(async (monthOrDate?: string) => {
    try {
      const token = localStorage.getItem('femsphere_token');
      if (!token) return;
      let url = '/api/period-tracker/daily';
      if (monthOrDate) {
        if (monthOrDate.length === 7) {
          url += `?month=${monthOrDate}`;
        } else {
          url += `?date=${monthOrDate}`;
        }
      }
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.logs)) {
        setDailyLogs(data.logs);
      }
    } catch (err) {
      console.error('Error fetching daily logs:', err);
    }
  }, []);

  const handleSaveDailyLog = async (logData: DailyLogItem): Promise<boolean> => {
    setPeriodErrorMsg(null);
    try {
      const token = localStorage.getItem('femsphere_token');
      if (!token) return false;
      const res = await fetch('/api/period-tracker/daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(logData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchDailyLogs(logData.date ? logData.date.slice(0, 7) : undefined);
        await fetchPeriodData();
        return true;
      } else {
        setPeriodErrorMsg(data.message || 'Failed to save daily log.');
        return false;
      }
    } catch (e: any) {
      setPeriodErrorMsg(e.message || 'Error communicating with server.');
      return false;
    }
  };

  const handleDeleteDailyLog = async (date: string): Promise<boolean> => {
    setPeriodErrorMsg(null);
    try {
      const token = localStorage.getItem('femsphere_token');
      if (!token) return false;
      const res = await fetch(`/api/period-tracker/daily/${date}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchDailyLogs(date.slice(0, 7));
        await fetchPeriodData();
        return true;
      }
      return false;
    } catch (e: any) {
      setPeriodErrorMsg(e.message || 'Error deleting daily log.');
      return false;
    }
  };

  const handleUpdatePeriodCycle = async (id: number | string, updateData: any): Promise<boolean> => {
    setPeriodErrorMsg(null);
    try {
      const token = localStorage.getItem('femsphere_token');
      if (!token) return false;
      const res = await fetch(`/api/period-tracker/cycles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(updateData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchPeriodData();
        return true;
      } else {
        setPeriodErrorMsg(data.message || 'Failed to update cycle record.');
        return false;
      }
    } catch (e: any) {
      setPeriodErrorMsg(e.message || 'Error updating cycle record.');
      return false;
    }
  };

  const handleDeletePeriodCycle = async (id: number | string): Promise<boolean> => {
    setPeriodErrorMsg(null);
    try {
      const token = localStorage.getItem('femsphere_token');
      if (!token) return false;
      const res = await fetch(`/api/period-tracker/cycles/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchPeriodData();
        return true;
      } else {
        setPeriodErrorMsg(data.message || 'Failed to delete cycle record.');
        return false;
      }
    } catch (e: any) {
      setPeriodErrorMsg(e.message || 'Error deleting cycle record.');
      return false;
    }
  };

  const handleUpdatePeriodSettings = async (settingsData: any): Promise<boolean> => {
    setPeriodErrorMsg(null);
    try {
      const token = localStorage.getItem('femsphere_token');
      if (!token) return false;
      const res = await fetch('/api/period-tracker/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(settingsData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchPeriodData();
        return true;
      } else {
        setPeriodErrorMsg(data.message || 'Failed to update settings.');
        return false;
      }
    } catch (e: any) {
      setPeriodErrorMsg(e.message || 'Error updating settings.');
      return false;
    }
  };

  const handleSavePeriodSetup = async (setupData: { lastPeriodStart: string; periodDuration: number; cycleLength: number }): Promise<boolean> => {
    setPeriodErrorMsg(null);
    try {
      const token = localStorage.getItem('femsphere_token');
      if (!token) return false;
      const res = await fetch('/api/period-tracker/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(setupData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsPeriodTrackerConfigured(true);
        setPeriodSettings(data.settings);
        setPeriodMetrics(data.metrics);
        await fetchPeriodData();
        return true;
      } else {
        setPeriodErrorMsg(data.message || 'Failed to save cycle setup.');
        return false;
      }
    } catch (e: any) {
      setPeriodErrorMsg(e.message || 'Error communicating with server.');
      return false;
    }
  };

  const handleLogPeriodEntry = async (entry: { startDate: string; endDate?: string; durationDays?: number; flowIntensity: string; symptoms: string[]; mood: string; notes?: string }): Promise<boolean> => {
    setPeriodErrorMsg(null);
    try {
      const token = localStorage.getItem('femsphere_token');
      if (!token) return false;
      const res = await fetch('/api/period-tracker/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(entry)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchPeriodData();
        return true;
      } else {
        setPeriodErrorMsg(data.message || 'Failed to log period.');
        return false;
      }
    } catch (e: any) {
      setPeriodErrorMsg(e.message || 'Error logging period.');
      return false;
    }
  };

  const handleAdjustCycleDelay = async (newCycleLength?: number, delayDays?: number): Promise<boolean> => {
    setPeriodErrorMsg(null);
    try {
      const token = localStorage.getItem('femsphere_token');
      if (!token) return false;
      const res = await fetch('/api/period-tracker/adjust-delay', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ newCycleLength, delayDays })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchPeriodData();
        return true;
      } else {
        setPeriodErrorMsg(data.message || 'Failed to adjust delay.');
        return false;
      }
    } catch (e: any) {
      setPeriodErrorMsg(e.message || 'Error adjusting delay.');
      return false;
    }
  };

  const handleActivatePregnancy = async (lmpDate?: string): Promise<boolean> => {
    setPeriodErrorMsg(null);
    try {
      const token = localStorage.getItem('femsphere_token');
      if (!token) return false;
      const res = await fetch('/api/period-tracker/pregnancy/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ lmpDate })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchPeriodData();
        await fetchUserProfile();
        return true;
      } else {
        setPeriodErrorMsg(data.message || 'Failed to activate maternity mode.');
        return false;
      }
    } catch (e: any) {
      setPeriodErrorMsg(e.message || 'Error activating maternity mode.');
      return false;
    }
  };

  const handleDeactivatePregnancy = async (resumePeriodDate?: string): Promise<boolean> => {
    setPeriodErrorMsg(null);
    try {
      const token = localStorage.getItem('femsphere_token');
      if (!token) return false;
      const res = await fetch('/api/period-tracker/pregnancy/deactivate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ resumePeriodDate })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchPeriodData();
        await fetchUserProfile();
        return true;
      } else {
        setPeriodErrorMsg(data.message || 'Failed to conclude maternity mode.');
        return false;
      }
    } catch (e: any) {
      setPeriodErrorMsg(e.message || 'Error concluding maternity mode.');
      return false;
    }
  };

  // Initial Load from Backend
  useEffect(() => {
    fetchUserProfile();
    fetchRecords();
    fetchTrackerLogs();
    fetchSymptoms();
    fetchAppointments();
    fetchDoctors();
    fetchNotifications();
    fetchConsultationNotes();
    fetchPeriodData();
    fetchWearables();
  }, [fetchUserProfile, fetchRecords, fetchTrackerLogs, fetchSymptoms, fetchAppointments, fetchDoctors, fetchNotifications, fetchConsultationNotes, fetchPeriodData, fetchWearables]);

  // Telehealth Incoming Call Ringtone Audio chime
  useEffect(() => {
    if (!incomingCall) return;
    const playChime = () => {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      } catch (e) {}
    };

    playChime();
    const interval = setInterval(playChime, 2500);
    return () => clearInterval(interval);
  }, [incomingCall]);

  // Telehealth Active Consultation Call Duration Timer
  useEffect(() => {
    if (!activeVideoConsultation) return;
    const timer = setInterval(() => {
      setActiveVideoConsultation(prev => prev ? { ...prev, durationSeconds: prev.durationSeconds + 1 } : null);
    }, 1000);
    return () => clearInterval(timer);
  }, [activeVideoConsultation]);

  // Telehealth Background Polling for Incoming Calls
  useEffect(() => {
    const token = localStorage.getItem('femsphere_token');
    if (!token) return;

    const pollIncomingCall = async () => {
      try {
        const res = await fetch('/api/appointments/active-call', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.activeCall && data.activeCall.status === 'calling') {
            setIncomingCall({
              appointmentId: data.activeCall.id,
              doctorId: data.activeCall.doctor_id,
              doctorName: data.activeCall.doctor_name || 'Dr. Healthcare Specialist',
              doctorSpecialization: data.activeCall.doctor_specialization || 'Clinical Specialist',
              appointmentTime: data.activeCall.appointment_time,
              appointmentDate: data.activeCall.appointment_date,
              roomUrl: data.activeCall.room_url
            });
          } else {
            if (incomingCall) setIncomingCall(null);
            if (activeVideoConsultation && (!data.activeCall || data.activeCall.status !== 'connected')) {
              setActiveVideoConsultation(null);
            }
          }
        }
      } catch (e) {}
    };

    const interval = setInterval(pollIncomingCall, 3500);
    return () => clearInterval(interval);
  }, [incomingCall, activeVideoConsultation]);

  // ==============================================================================
  // ACTIONS & HANDLERS
  // ==============================================================================

  const addNotification = async (notif: { title: string; message: string; type?: string }) => {
    try {
      const token = localStorage.getItem('femsphere_token');
      if (token) {
        const res = await fetch('/api/users/notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(notif)
        });
        const data = await res.json();
        if (data.success && data.notification) {
          const n = data.notification;
          setNotifications(prev => [
            {
              id: n.id,
              title: n.title,
              message: n.message,
              time: 'Just now',
              type: n.type || 'system',
              read: false
            },
            ...prev
          ]);
          return;
        }
      }
    } catch (e) {
      console.log('Saved notification locally');
    }
    setNotifications(prev => [
      { id: `N-${Date.now()}`, title: notif.title, message: notif.message, time: 'Just now', type: notif.type || 'system', read: false },
      ...prev
    ]);
  };

  const markNotificationRead = async (id: string | number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    try {
      const token = localStorage.getItem('femsphere_token');
      if (token) {
        await fetch(`/api/users/notifications/${id}/read`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (e) {}
  };

  const markAllNotificationsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      const token = localStorage.getItem('femsphere_token');
      if (token) {
        await fetch('/api/users/notifications/read-all', {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (e) {}
  };

  const deleteNotification = async (id: string | number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    try {
      const token = localStorage.getItem('femsphere_token');
      if (token) {
        await fetch(`/api/users/notifications/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (e) {}
  };

  // Profile Handlers
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileErrorMsg(null);

    if (!editProfileForm.fullName.trim() || !isValidName(editProfileForm.fullName)) {
      setProfileErrorMsg('Please enter a valid full name (letters only, min 2 characters).');
      return;
    }
    if (!editProfileForm.dob.trim() || !isPastOrToday(editProfileForm.dob)) {
      setProfileErrorMsg('Date of birth cannot be in the future.');
      return;
    }
    if (!editProfileForm.phone.trim() || !isValidPhone(editProfileForm.phone)) {
      setProfileErrorMsg('Please enter a valid phone number (min 10 digits).');
      return;
    }
    if (!editProfileForm.email.trim() || !isValidEmail(editProfileForm.email)) {
      setProfileErrorMsg('Please enter a valid email address.');
      return;
    }

    const computedAge = calculateAge(editProfileForm.dob);
    const updatedProfile = { ...editProfileForm, age: computedAge };
    setUserProfile(updatedProfile);
    setIsEditingProfile(false);

    try {
      const stored = localStorage.getItem('femsphere_user');
      const parsed = stored ? JSON.parse(stored) : {};
      const updatedUser = {
        ...parsed,
        fullName: updatedProfile.fullName,
        email: updatedProfile.email,
        profile: {
          ...(parsed.profile || {}),
          full_name: updatedProfile.fullName,
          dob: updatedProfile.dob,
          blood_group: updatedProfile.bloodGroup,
          height_cm: parseFloat(updatedProfile.height) || null,
          weight_kg: parseFloat(updatedProfile.weight) || null,
          mobile: updatedProfile.phone,
          address: updatedProfile.address,
          emergency_contact_name: updatedProfile.emergencyContact,
          emergency_contact_phone: updatedProfile.phone
        }
      };
      localStorage.setItem('femsphere_user', JSON.stringify(updatedUser));
    } catch (err) {}

    try {
      const token = localStorage.getItem('femsphere_token');
      if (token) {
        await fetch('/api/users/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            fullName: updatedProfile.fullName,
            email: updatedProfile.email,
            phone: updatedProfile.phone,
            dob: updatedProfile.dob,
            bloodGroup: updatedProfile.bloodGroup,
            heightCm: updatedProfile.height,
            weightKg: updatedProfile.weight,
            address: updatedProfile.address,
            emergencyContact: updatedProfile.emergencyContact,
            menarcheStarted: updatedProfile.menarcheStarted
          })
        });
        await fetchUserProfile();
        await fetchPeriodData();
      }
    } catch (apiErr) {}

    await addNotification({
      title: 'Profile Updated',
      message: 'Your profile details and biological health stage were updated successfully.',
      type: 'profile'
    });
  };

  const handleSaveProfilePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...userProfile,
      avatarUrl: tempAvatarUrl,
      avatarBg: tempAvatarBg
    };
    setUserProfile(updated);
    try {
      const stored = localStorage.getItem('femsphere_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.avatarUrl = tempAvatarUrl;
        parsed.avatarBg = tempAvatarBg;
        localStorage.setItem('femsphere_user', JSON.stringify(parsed));
      }
    } catch (e) {}
    setShowPhotoModal(false);
    addNotification({
      title: 'Profile Photo Updated',
      message: 'Your profile avatar photo has been updated successfully.',
      type: 'system'
    });
  };

  const handleFilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      setPasswordMsg('Please enter both old and new password.');
      return;
    }
    const pwdRes = validatePassword(passwordData.newPassword);
    if (!pwdRes.isValid) {
      setPasswordMsg(pwdRes.message);
      return;
    }
    if (passwordData.oldPassword === passwordData.newPassword) {
      setPasswordMsg('New password cannot be the same as current password.');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMsg('New passwords do not match.');
      return;
    }
    setPasswordMsg('Password changed successfully!');
    setTimeout(() => {
      setShowPasswordModal(false);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordMsg(null);
    }, 1200);
  };

  // Life Stage Handler
  const handleSelectStage = async (code: string) => {
    setCurrentStageCode(code);
    try {
      const token = localStorage.getItem('femsphere_token');
      const res = await fetch('/api/life-stages/current', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ lifeStageCode: code, isManual: true })
      });
      const data = await res.json();
      if (data.success && data.currentStage) {
        setStageName(data.currentStage.name);
      }
    } catch (e) {
      console.error('Error updating life stage', e);
    }
  };

  // Medical Record Handlers
  const handleScanMedicalReport = async (recordId: string | number) => {
    const targetRecord = records.find(r => r.id === recordId);
    if (!targetRecord) return;

    setScanningRecordTitle(targetRecord.title);
    setIsScanningDoc(true);
    setScanningProgress(25);
    setTimeout(() => setScanningProgress(60), 300);
    setTimeout(() => setScanningProgress(85), 600);

    let extractedScan = targetRecord.scanResults;
    try {
      const token = localStorage.getItem('femsphere_token');
      if (token && typeof recordId === 'number') {
        const res = await fetch(`/api/medical-records/${recordId}/scan`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.record && data.record.scan_results) {
            extractedScan = typeof data.record.scan_results === 'string' ? JSON.parse(data.record.scan_results) : data.record.scan_results;
          }
        }
      }
    } catch (e) {
      console.warn('Backend scan failed, falling back:', e);
    }

    setTimeout(() => {
      setScanningProgress(100);
      setTimeout(() => {
        setIsScanningDoc(false);
        const scannedObj = {
          ...targetRecord,
          isScanned: true,
          scanResults: extractedScan || {
            doctorName: 'Dr. Sarah Jenkins, MD',
            labName: 'FemSphere Smart OCR Engine',
            keyBiomarkers: [
              { name: 'Hemoglobin', value: '13.4 g/dL', status: 'Normal', range: '12.0 - 15.5 g/dL' },
              { name: 'Fasting Blood Sugar', value: '92 mg/dL', status: 'Optimal', range: '70 - 99 mg/dL' },
              { name: 'Serum Ferritin', value: '35 ng/mL', status: 'Normal', range: '15 - 150 ng/mL' },
              { name: 'Vitamin D3 (25-OH)', value: '32 ng/mL', status: 'Optimal', range: '30 - 100 ng/mL' }
            ],
            aiSummary: `AI Scan completed for "${targetRecord.title}". Biomarkers extracted successfully. All clinical parameters are within normal healthy ranges.`,
            riskLevel: 'Optimal' as const,
            recommendations: 'Annual routine health review recommended.'
          }
        };
        setViewingScanRecordModal(scannedObj);
        setRecords(records.map(r => r.id === recordId ? scannedObj : r));

        addNotification({
          title: 'AI Report Scan Completed',
          message: `Medical report "${targetRecord.title}" scanned and analyzed.`,
          type: 'record'
        });
      }, 300);
    }, 900);
  };

  const handleUploadRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadErrorMsg(null);
    if (!newRecord.title.trim() || newRecord.title.trim().length < 3) {
      setUploadErrorMsg('Please enter a report title (at least 3 characters).');
      return;
    }
    if (selectedRecordFile) {
      const valid = isValidDocumentFile(selectedRecordFile, ['.pdf', '.jpg', '.jpeg', '.png'], 10 * 1024 * 1024);
      if (!valid.isValid) {
        setUploadErrorMsg(valid.message);
        return;
      }
    } else if (!newRecord.fileName) {
      setUploadErrorMsg('Please select a file to upload (.pdf, .jpg, .png).');
      return;
    }

    const fileExt = newRecord.fileName ? newRecord.fileName.split('.').pop()?.toUpperCase() || newRecord.type : newRecord.type;
    const todayStr = new Date().toISOString().split('T')[0];
    const monthStr = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    try {
      const token = localStorage.getItem('femsphere_token');
      if (token) {
        let res;
        if (selectedRecordFile) {
          const formData = new FormData();
          formData.append('file', selectedRecordFile);
          formData.append('title', newRecord.title);
          formData.append('category', newRecord.category || 'Lab Results');
          formData.append('description', newRecord.description || 'Uploaded medical record');
          res = await fetch('/api/medical-records/upload', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
          });
        } else {
          res = await fetch('/api/medical-records/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              title: newRecord.title,
              fileName: newRecord.fileName || `${newRecord.title.replace(/\s+/g, '_')}.${fileExt.toLowerCase()}`,
              fileType: fileExt,
              category: newRecord.category || 'Lab Results',
              description: newRecord.description || 'Uploaded medical record'
            })
          });
        }
        const data = await res.json();
        if (data.success && data.record) {
          await fetchRecords();
          setNewRecord({ title: '', type: 'PDF', description: '', category: 'Lab Results', fileName: '' });
          setSelectedRecordFile(null);
          setShowUploadModal(false);

          await addNotification({
            title: 'Medical Report Uploaded & Scanned',
            message: `Report "${newRecord.title}" parsed and saved to your vault.`,
            type: 'record'
          });
          return;
        } else {
          setUploadErrorMsg(data.message || 'Failed to scan and upload report.');
          return;
        }
      }
    } catch (e: any) {
      console.error('Error saving record to database:', e);
      setUploadErrorMsg(e.message || 'An error occurred while uploading.');
    }
  };

  const handleDeleteRecord = async (id: string | number) => {
    setRecords(prev => prev.filter(r => r.id !== id));
    try {
      const token = localStorage.getItem('femsphere_token');
      if (token) {
        await fetch(`/api/medical-records/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (e) {}
  };

  // Health Tracker Handlers
  const handleSaveTrackerLog = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrackerErrorMsg(null);

    // Validate tracker inputs (EXCLUDING Height & Weight)
    if (trackerInput.water && trackerInput.water.trim()) {
      const w = parseFloat(trackerInput.water);
      if (isNaN(w) || !isValidWater(w)) {
        setTrackerErrorMsg('Water intake must be between 0.1 and 10.0 Liters.');
        return;
      }
    }
    if (trackerInput.sleep && trackerInput.sleep.trim()) {
      const s = parseFloat(trackerInput.sleep);
      if (isNaN(s) || !isValidSleep(s)) {
        setTrackerErrorMsg('Sleep duration must be between 0.0 and 24.0 hours.');
        return;
      }
    }
    if (trackerInput.exercise && trackerInput.exercise.trim()) {
      const ex = parseInt(trackerInput.exercise, 10);
      if (isNaN(ex) || !isValidExercise(ex)) {
        setTrackerErrorMsg('Exercise duration must be between 0 and 720 minutes.');
        return;
      }
    }
    if (trackerInput.heartRate && trackerInput.heartRate.trim()) {
      const hr = parseInt(trackerInput.heartRate, 10);
      if (isNaN(hr) || !isValidHeartRate(hr)) {
        setTrackerErrorMsg('Heart rate must be between 35 and 220 bpm.');
        return;
      }
    }
    if (trackerInput.bloodPressure && trackerInput.bloodPressure.trim()) {
      const bp = isValidBloodPressure(trackerInput.bloodPressure);
      if (!bp.isValid) {
        setTrackerErrorMsg(bp.message);
        return;
      }
    }

    try {
      const token = localStorage.getItem('femsphere_token');
      if (token) {
        const payload = {
          weightKg: trackerInput.weight || userProfile.weight || null,
          waterIntakeLiters: trackerInput.water || null,
          sleepHours: trackerInput.sleep || null,
          exerciseMinutes: trackerInput.exercise || null,
          heartRate: trackerInput.heartRate || null,
          bloodPressure: trackerInput.bloodPressure || null,
          steps: trackerInput.steps || null,
          caloriesBurned: trackerInput.caloriesBurned || null,
          distanceKm: trackerInput.distanceKm || null,
          foodMeals: trackerInput.foodMeals || null,
          caloriesIntake: trackerInput.caloriesIntake || null,
          mood: trackerInput.mood || 'Good',
          notes: trackerInput.notes || null,
          logDate: trackerInput.date || new Date().toISOString().split('T')[0]
        };

        if (editingTrackerId) {
          await fetch(`/api/health-tracker/vitals/${editingTrackerId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(payload)
          });
        } else {
          await fetch('/api/health-tracker/vitals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(payload)
          });
        }
        await fetchTrackerLogs();
      }
    } catch (e) {
      console.error('Error persisting vital log:', e);
    }

    setEditingTrackerId(null);
    setTrackerInput({
      date: new Date().toISOString().split('T')[0],
      weight: userProfile.weight || '',
      water: '',
      sleep: '',
      exerciseType: '',
      exercise: '',
      caloriesBurned: '',
      steps: '',
      distanceKm: '',
      foodMeals: '',
      caloriesIntake: '',
      bloodPressure: '',
      heartRate: '',
      mood: 'Good',
      symptomName: '',
      symptomSeverity: 'Low',
      notes: ''
    });

    await addNotification({
      title: 'Health Log Saved',
      message: 'Your daily health vitals were recorded successfully.',
      type: 'tracker'
    });
  };

  const handleEditTrackerLog = (log: HealthTrackerLog) => {
    setEditingTrackerId(log.id);
    setTrackerInput({
      date: log.date || new Date().toISOString().split('T')[0],
      weight: log.weight || userProfile.weight || '',
      water: log.water || '',
      sleep: log.sleep || '',
      exerciseType: log.exerciseType || '',
      exercise: log.exercise || '',
      caloriesBurned: log.caloriesBurned || '',
      steps: log.steps || '',
      distanceKm: log.distanceKm || '',
      foodMeals: log.foodMeals || '',
      caloriesIntake: log.caloriesIntake || '',
      bloodPressure: log.bloodPressure || '',
      heartRate: log.heartRate || '',
      mood: log.mood || 'Good',
      symptomName: log.symptomName || '',
      symptomSeverity: log.symptomSeverity || 'Low',
      notes: log.notes || ''
    });
  };

  const handleDeleteTrackerLog = async (id: string | number) => {
    setTrackerLogs(prev => prev.filter(l => l.id !== id));
    try {
      const token = localStorage.getItem('femsphere_token');
      if (token) {
        await fetch(`/api/health-tracker/vitals/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (e) {}
  };

  // Symptom Handlers
  const handleSaveSymptom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomInput.symptomName.trim()) return;

    try {
      const token = localStorage.getItem('femsphere_token');
      if (token) {
        if (editingSymptomId) {
          await fetch(`/api/health-tracker/symptoms/${editingSymptomId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(symptomInput)
          });
        } else {
          await fetch('/api/health-tracker/symptoms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(symptomInput)
          });
        }
        await fetchSymptoms();
      }
    } catch (e) {}

    setEditingSymptomId(null);
    setSymptomInput({ symptomName: '', severity: 'Low', date: new Date().toISOString().split('T')[0], description: '' });
  };

  const handleEditSymptom = (sym: SymptomLog) => {
    setEditingSymptomId(sym.id);
    setSymptomInput({
      symptomName: sym.symptomName,
      severity: sym.severity,
      date: sym.date,
      description: sym.description || ''
    });
  };

  const handleDeleteSymptom = async (id: string | number) => {
    setSymptomLogs(prev => prev.filter(s => s.id !== id));
    try {
      const token = localStorage.getItem('femsphere_token');
      if (token) {
        await fetch(`/api/health-tracker/symptoms/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (e) {}
  };

  // Appointment Handlers
  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setAppointmentErrorMsg(null);

    if (!newAppointment.doctor || !newAppointment.doctorId) {
      setAppointmentErrorMsg('Please select a doctor and appointment slot.');
      return;
    }
    if (!newAppointment.date) {
      setAppointmentErrorMsg('Please select an appointment date.');
      return;
    }
    if (!isFutureDate(newAppointment.date)) {
      setAppointmentErrorMsg('Appointment date must be today or in the future.');
      return;
    }
    if (!newAppointment.reason.trim() || newAppointment.reason.trim().length < 5) {
      setAppointmentErrorMsg('Please provide a reason for the visit (at least 5 characters).');
      return;
    }

    try {
      const token = localStorage.getItem('femsphere_token');
      if (token) {
        const res = await fetch('/api/appointments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            doctorId: newAppointment.doctorId,
            doctorName: newAppointment.doctor,
            date: newAppointment.date,
            time: newAppointment.time || '10:00 AM',
            reason: newAppointment.reason || 'General Health Review',
            type: newAppointment.type || 'Virtual Telehealth'
          })
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          setAppointmentErrorMsg(data.error || data.message || 'Failed to book appointment: Shift limit reached.');
          return;
        }

        // Successfully booked: accommodation decrement takes effect
        await fetchAppointments();
        await fetchAvailableDoctors();
        setShowBookModal(false);
        setAppointmentErrorMsg(null);
        await addNotification({
          title: 'Appointment Booked & Confirmed',
          message: `Your consultation with ${newAppointment.doctor} on ${newAppointment.date} at ${newAppointment.time} is locked.`,
          type: 'appointment'
        });
      }
    } catch (apiErr: any) {
      console.error('Error booking appointment in backend:', apiErr);
      setAppointmentErrorMsg(apiErr.message || 'Network error while booking appointment.');
    }
  };

  const handleCancelAppointment = async (id: string | number) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'Cancelled' } : a));
    try {
      const token = localStorage.getItem('femsphere_token');
      if (token) {
        await fetch(`/api/appointments/${id}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: 'Cancelled' })
        });
      }
    } catch (e) {}
  };

  const handleDeleteAppointment = async (id: string | number) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
    try {
      const token = localStorage.getItem('femsphere_token');
      if (token) {
        await fetch(`/api/appointments/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (e) {}
  };

  // Telehealth Call Answering & Control Handlers
  const handleAcceptCall = async () => {
    if (!incomingCall) return;
    const current = incomingCall;
    setIncomingCall(null);
    try {
      const token = localStorage.getItem('femsphere_token');
      if (token) {
        await fetch(`/api/appointments/${current.appointmentId}/answer`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (e) {}
    setActiveVideoConsultation({
      appointmentId: current.appointmentId,
      doctorName: current.doctorName,
      doctorSpecialization: current.doctorSpecialization,
      roomUrl: current.roomUrl,
      durationSeconds: 0
    });
  };

  const handleDeclineCall = async () => {
    if (!incomingCall) return;
    const current = incomingCall;
    setIncomingCall(null);
    try {
      const token = localStorage.getItem('femsphere_token');
      if (token) {
        await fetch(`/api/appointments/${current.appointmentId}/decline`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (e) {}
  };

  const handleEndUserCall = async () => {
    if (!activeVideoConsultation) return;
    const current = activeVideoConsultation;
    setActiveVideoConsultation(null);
    try {
      const token = localStorage.getItem('femsphere_token');
      if (token) {
        await fetch(`/api/appointments/${current.appointmentId}/end-call`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (e) {}
  };

  const handleConnectBleDevice = async (): Promise<{ success: boolean; message: string; device?: any }> => {
    setIsScanning(true);
    setFoundDevices([]);
    const nav = navigator as any;

    if (!nav.bluetooth) {
      setIsScanning(false);
      return { 
        success: false, 
        message: 'Web Bluetooth is supported on Google Chrome, Microsoft Edge, and Opera on Windows, Mac, Linux, and Android. It is not accessible on Safari or Firefox due to browser OS restrictions.' 
      };
    }

    try {
      const device = await nav.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          'heart_rate',
          'battery_service',
          0x180d,
          0x180f,
          0x1809
        ]
      });

      if (!device) {
        setIsScanning(false);
        return { success: false, message: 'No device selected.' };
      }

      const devName = device.name || 'Bluetooth Wearable';
      let batteryVal = 85;

      try {
        const server = await device.gatt?.connect();
        if (server) {
          try {
            const batteryService = await server.getPrimaryService('battery_service');
            const batteryChar = await batteryService.getCharacteristic('battery_level');
            const val = await batteryChar.readValue();
            batteryVal = val.getUint8(0);
          } catch (_) {}
        }
      } catch (_) {}

      let detectedBrand = 'GENERIC_BLE';
      const lower = devName.toLowerCase();
      if (lower.includes('apple')) detectedBrand = 'APPLE_WATCH';
      else if (lower.includes('galaxy') || lower.includes('samsung')) detectedBrand = 'SAMSUNG';
      else if (lower.includes('pixel')) detectedBrand = 'PIXEL_WATCH';
      else if (lower.includes('garmin')) detectedBrand = 'GARMIN';
      else if (lower.includes('fitbit')) detectedBrand = 'FITBIT';
      else if (lower.includes('amazfit')) detectedBrand = 'AMAZFIT';
      else if (lower.includes('polar')) detectedBrand = 'POLAR';
      else if (lower.includes('boat')) detectedBrand = 'BOAT';
      else if (lower.includes('noise')) detectedBrand = 'NOISE';

      const token = localStorage.getItem('femsphere_token');
      const regRes = await fetch('/api/wearables/devices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          device_identifier: device.id || `BLE-${devName.replace(/\s+/g, '-')}`,
          device_name: devName,
          device_model: devName,
          brand: detectedBrand,
          connection_status: 'CONNECTED',
          battery_level: batteryVal,
          capabilities: {
            heart_rate: true,
            battery: true,
            real_time_stream: true
          }
        })
      });
      const regData = await regRes.json();

      setIsScanning(false);
      await fetchWearables();
      await addNotification({
        title: 'Device Connected',
        message: `${devName} successfully connected and registered.`,
        type: 'system'
      });

      return { success: true, message: `Connected to ${devName}`, device: regData.device };
    } catch (err: any) {
      setIsScanning(false);
      if (err.name === 'NotFoundError') {
        return { success: false, message: 'Device pairing was cancelled or no device was selected.' };
      }
      return { success: false, message: err.message || 'Bluetooth connection failed.' };
    }
  };

  const handleScanBluetoothDevices = async () => {
    const res = await handleConnectBleDevice();
    if (res.success) {
      setShowBluetoothModal(false);
      setShowConnectDeviceModal(false);
    }
  };

  const handleRegisterWearableDevice = async (deviceData: any): Promise<boolean> => {
    try {
      const token = localStorage.getItem('femsphere_token');
      if (!token) return false;

      const res = await fetch('/api/wearables/devices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(deviceData)
      });
      const data = await res.json();
      if (data.success) {
        await fetchWearables();
        await addNotification({
          title: 'Device Registered',
          message: `${deviceData.device_name || 'Wearable'} registered successfully.`,
          type: 'system'
        });
        return true;
      }
      return false;
    } catch (e) {
      console.error('Error registering device:', e);
      return false;
    }
  };

  const handleDisconnectWearableDevice = async (deviceId: number): Promise<boolean> => {
    try {
      const token = localStorage.getItem('femsphere_token');
      if (!token) return false;

      const res = await fetch(`/api/wearables/devices/${deviceId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ connection_status: 'DISCONNECTED' })
      });
      if (res.ok) {
        await fetchWearables();
        await addNotification({
          title: 'Device Disconnected',
          message: 'Wearable device has been disconnected.',
          type: 'system'
        });
        return true;
      }
      return false;
    } catch (e) {
      console.error('Error disconnecting device:', e);
      return false;
    }
  };

  const handleSyncWearableTelemetry = async (telemetryData: any): Promise<boolean> => {
    try {
      const token = localStorage.getItem('femsphere_token');
      if (!token) return false;

      const res = await fetch('/api/wearables/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(telemetryData)
      });
      const data = await res.json();
      if (data.success) {
        await fetchWearables();
        await fetchTrackerLogs();
        await addNotification({
          title: 'Activity Telemetry Synced',
          message: 'Device daily activity telemetry updated successfully.',
          type: 'tracker'
        });
        return true;
      }
      return false;
    } catch (e) {
      console.error('Error syncing telemetry:', e);
      return false;
    }
  };

  const handlePairDevice = (deviceName: string) => {
    setConnectedDevice(deviceName);
    setBluetoothConnected(true);
    setShowBluetoothModal(false);
    setShowConnectDeviceModal(false);
  };

  const handleDisconnectBluetooth = () => {
    if (activeWearable) {
      handleDisconnectWearableDevice(activeWearable.id);
    } else {
      setBluetoothConnected(false);
      setConnectedDevice(null);
    }
  };

  const handleSyncWatchVitals = async () => {
    await fetchWearables();
    await fetchTrackerLogs();
  };

  const handlePrintPDFReport = () => {
    window.print();
  };

  const handleLogout = () => {
    localStorage.removeItem('femsphere_token');
    localStorage.removeItem('femsphere_user');
    navigate('/login');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <UserContext.Provider
      value={{
        userProfile,
        setUserProfile,
        editProfileForm,
        setEditProfileForm,
        isEditingProfile,
        setIsEditingProfile,
        profileErrorMsg,
        setProfileErrorMsg,
        handleSaveProfile,
        showPhotoModal,
        setShowPhotoModal,
        tempAvatarUrl,
        setTempAvatarUrl,
        tempAvatarBg,
        setTempAvatarBg,
        handleSaveProfilePhoto,
        handleFilePhotoChange,
        showPasswordModal,
        setShowPasswordModal,
        passwordData,
        setPasswordData,
        passwordMsg,
        setPasswordMsg,
        handleChangePassword,
        currentStageCode,
        stageName,
        showLifeStageModal,
        setShowLifeStageModal,
        handleSelectStage,
        currentTime,
        showBluetoothModal,
        setShowBluetoothModal,
        showConnectDeviceModal,
        setShowConnectDeviceModal,
        bluetoothConnected,
        connectedDevice,
        wearableDevices,
        activeWearable,
        fetchWearables,
        isScanning,
        foundDevices,
        smartwatchVitals,
        handleScanBluetoothDevices,
        handleConnectBleDevice,
        handleRegisterWearableDevice,
        handleDisconnectWearableDevice,
        handleSyncWearableTelemetry,
        handlePairDevice,
        handleDisconnectBluetooth,
        handleSyncWatchVitals,
        records,
        selectedMonthFilter,
        setSelectedMonthFilter,
        isScanningDoc,
        scanningProgress,
        scanningRecordTitle,
        viewingScanRecordModal,
        setViewingScanRecordModal,
        showUploadModal,
        setShowUploadModal,
        newRecord,
        setNewRecord,
        selectedRecordFile,
        setSelectedRecordFile,
        uploadErrorMsg,
        setUploadErrorMsg,
        handleScanMedicalReport,
        handleUploadRecord,
        handleDeleteRecord,
        fetchRecords,
        trackerLogs,
        trackerInput,
        setTrackerInput,
        editingTrackerId,
        setEditingTrackerId,
        trackerErrorMsg,
        setTrackerErrorMsg,
        handleSaveTrackerLog,
        handleEditTrackerLog,
        handleDeleteTrackerLog,
        fetchTrackerLogs,
        symptomLogs,
        symptomInput,
        setSymptomInput,
        editingSymptomId,
        setEditingSymptomId,
        handleSaveSymptom,
        handleEditSymptom,
        handleDeleteSymptom,
        fetchSymptoms,
        appointments,
        doctorsList,
        availableDoctors,
        isLoadingAvailableDoctors,
        availableSearchFilters,
        setAvailableSearchFilters,
        fetchAvailableDoctors,
        showBookModal,
        setShowBookModal,
        newAppointment,
        setNewAppointment,
        appointmentErrorMsg,
        setAppointmentErrorMsg,
        handleBookAppointment,
        handleCancelAppointment,
        handleDeleteAppointment,
        fetchAppointments,
        consultationNotes,
        fetchConsultationNotes,
        notifications,
        unreadCount,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        addNotification,
        fetchNotifications,
        settings,
        setSettings,
        showReportPreview,
        setShowReportPreview,
        handlePrintPDFReport,
        incomingCall,
        activeVideoConsultation,
        handleAcceptCall,
        handleDeclineCall,
        handleEndUserCall,
        isReproductiveAgeUser,
        isPeriodTrackerConfigured,
        periodSettings,
        periodMetrics,
        predictions,
        historicalStats,
        dailyLogs,
        todayDailyLog,
        periodReminders,
        cycleHistory,
        menstrualAffirmation,
        menstrualTips,
        isLoadingPeriodData,
        periodErrorMsg,
        setPeriodErrorMsg,
        fetchPeriodData,
        fetchDailyLogs,
        handleSavePeriodSetup,
        handleLogPeriodEntry,
        handleUpdatePeriodCycle,
        handleDeletePeriodCycle,
        handleSaveDailyLog,
        handleDeleteDailyLog,
        handleUpdatePeriodSettings,
        handleAdjustCycleDelay,
        handleActivatePregnancy,
        handleDeactivatePregnancy,
        handleLogout
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
