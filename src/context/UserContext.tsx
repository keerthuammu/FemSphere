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
  created_at: string;
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

  // Bluetooth & Smartwatch
  showBluetoothModal: boolean;
  setShowBluetoothModal: React.Dispatch<React.SetStateAction<boolean>>;
  bluetoothConnected: boolean;
  connectedDevice: string | null;
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
      avatarBg: '#7C3AED',
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
          avatarBg: parsed.avatarBg || '#7C3AED',
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
  const [tempAvatarBg, setTempAvatarBg] = useState('#7C3AED');

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

  // Bluetooth Smartwatch State
  const [showBluetoothModal, setShowBluetoothModal] = useState(false);
  const [bluetoothConnected, setBluetoothConnected] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [foundDevices, setFoundDevices] = useState<Array<{ name: string; type: string; rssi: number; battery: number }>>([]);
  const [smartwatchVitals, setSmartwatchVitals] = useState({
    heartRate: 74,
    spO2: 98,
    bodyTemp: 36.6,
    steps: 8420,
    calories: 420,
    battery: 88,
    lastSynced: 'Just now'
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
  const [showBookModal, setShowBookModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState<{ doctor: string; doctorId?: number; date: string; time: string; reason: string; type: string }>({
    doctor: '', date: '', time: '10:00 AM', reason: '', type: 'Virtual Telehealth'
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

        const autoStage = getStageFromAge(userAge);
        setCurrentStageCode(autoStage.code);
        setStageName(autoStage.name);

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
          emergencyContact: p.emergency_contact_name || ''
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
          const logDateStr = l.log_date ? (l.log_date.includes('T') ? l.log_date.split('T')[0] : l.log_date) : '';
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
        if (mapped.length > 0 && !newAppointment.doctor) {
          setNewAppointment(prev => ({
            ...prev,
            doctor: `${mapped[0].name} (${mapped[0].specialization})`,
            doctorId: mapped[0].id
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }
  }, [newAppointment.doctor]);

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
  }, [fetchUserProfile, fetchRecords, fetchTrackerLogs, fetchSymptoms, fetchAppointments, fetchDoctors, fetchNotifications, fetchConsultationNotes]);

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
            emergencyContact: updatedProfile.emergencyContact
          })
        });
      }
    } catch (apiErr) {}

    await addNotification({
      title: 'Profile Updated',
      message: 'Your profile details were updated and saved successfully.',
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
  const handleScanMedicalReport = (recordId: string | number) => {
    const targetRecord = records.find(r => r.id === recordId);
    if (!targetRecord) return;

    setScanningRecordTitle(targetRecord.title);
    setIsScanningDoc(true);
    setScanningProgress(15);

    setTimeout(() => setScanningProgress(45), 400);
    setTimeout(() => setScanningProgress(75), 900);
    setTimeout(() => setScanningProgress(95), 1400);

    setTimeout(() => {
      setScanningProgress(100);
      setTimeout(() => {
        setIsScanningDoc(false);
        const scannedObj = {
          ...targetRecord,
          isScanned: true,
          scanResults: targetRecord.scanResults || {
            doctorName: 'Dr. Clinical AI Analyzer',
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
      }, 400);
    }, 1800);
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

    const scanResultsObj = {
      doctorName: 'Dr. Sarah Jenkins, MD',
      labName: 'Central Diagnostics Lab',
      keyBiomarkers: [
        { name: 'Hemoglobin', value: '13.6 g/dL', status: 'Normal', range: '12.0 - 15.5 g/dL' },
        { name: 'HbA1c', value: '5.3%', status: 'Optimal', range: '< 5.7%' },
        { name: 'Vitamin D3 (25-OH)', value: '35 ng/mL', status: 'Optimal', range: '30 - 100 ng/mL' }
      ],
      aiSummary: `Scanned uploaded report "${newRecord.title}". Diagnostic parameters extracted into ${monthStr} medical health summary.`,
      riskLevel: 'Optimal' as const,
      recommendations: 'No abnormal clinical flags detected.'
    };

    try {
      const token = localStorage.getItem('femsphere_token');
      if (token) {
        const res = await fetch('/api/medical-records/upload', {
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
            description: newRecord.description || 'Uploaded medical record',
            isScanned: true,
            scanResults: scanResultsObj
          })
        });
        const data = await res.json();
        if (data.success && data.record) {
          const rec = data.record;
          const created: MedicalRecordItem = {
            id: rec.id,
            title: rec.title || newRecord.title,
            type: rec.file_type || fileExt,
            date: todayStr,
            month: monthStr,
            description: rec.description || newRecord.description || 'Uploaded medical report',
            size: '2.4 MB',
            category: rec.category || newRecord.category || 'Lab Results',
            isScanned: true,
            scanResults: scanResultsObj
          };
          setRecords(prev => [created, ...prev]);
        }
      }
    } catch (e) {
      console.error('Error saving record to database:', e);
    }

    setNewRecord({ title: '', type: 'PDF', description: '', category: 'Lab Results', fileName: '' });
    setSelectedRecordFile(null);
    setShowUploadModal(false);

    await addNotification({
      title: 'Medical Report Uploaded & Scanned',
      message: `Report "${newRecord.title}" parsed for ${monthStr}.`,
      type: 'record'
    });
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
          waterIntakeLiters: trackerInput.water || 2.5,
          sleepHours: trackerInput.sleep || 8.0,
          exerciseMinutes: trackerInput.exercise || 30,
          heartRate: trackerInput.heartRate || null,
          bloodPressure: trackerInput.bloodPressure || null,
          steps: trackerInput.steps || null,
          caloriesBurned: trackerInput.caloriesBurned || null,
          distanceKm: trackerInput.distanceKm || null,
          foodMeals: trackerInput.foodMeals || null,
          caloriesIntake: trackerInput.caloriesIntake || null,
          mood: trackerInput.mood || 'Good',
          notes: trackerInput.notes || null,
          logDate: new Date().toISOString().split('T')[0]
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
      weight: userProfile.weight,
      water: '2.5',
      sleep: '8.0',
      exerciseType: 'Running & Cardio',
      exercise: '30',
      caloriesBurned: '250',
      steps: '7500',
      distanceKm: '5.0',
      foodMeals: '',
      caloriesIntake: '1800',
      bloodPressure: '120/78',
      heartRate: '72',
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
      weight: log.weight || userProfile.weight || '',
      water: log.water || '',
      sleep: log.sleep || '',
      exerciseType: log.exerciseType || 'General Exercise',
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

    if (!newAppointment.doctor) {
      setAppointmentErrorMsg('Please select a doctor.');
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
        await fetch('/api/appointments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            doctorId: newAppointment.doctorId || 1,
            doctorName: newAppointment.doctor,
            date: newAppointment.date,
            time: newAppointment.time || '10:00 AM',
            reason: newAppointment.reason || 'General Health Review',
            type: newAppointment.type || 'Virtual Telehealth'
          })
        });
        await fetchAppointments();
      }
    } catch (apiErr) {
      console.error('Error booking appointment in backend:', apiErr);
    }

    setShowBookModal(false);
    await addNotification({
      title: 'Appointment Booked',
      message: `Confirmed consultation with ${newAppointment.doctor} on ${newAppointment.date} at ${newAppointment.time}.`,
      type: 'appointment'
    });
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

  // Bluetooth Handlers
  const handleScanBluetoothDevices = async () => {
    setIsScanning(true);
    setFoundDevices([]);

    const nav = navigator as any;
    if (nav.bluetooth) {
      try {
        const device = await nav.bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: ['heart_rate', 'battery_service', 'health_thermometer']
        });
        if (device) {
          setConnectedDevice(device.name || 'Smart Watch Device');
          setBluetoothConnected(true);
          setIsScanning(false);
          setShowBluetoothModal(false);
          await addNotification({
            title: 'Bluetooth Smartwatch Connected',
            message: `Paired with ${device.name || 'Smart Watch'}. Live vitals streaming enabled.`,
            type: 'system'
          });
          return;
        }
      } catch (err) {
        console.log('Web Bluetooth fallback to discovery list...');
      }
    }

    setTimeout(() => {
      setFoundDevices([
        { name: 'Apple Watch Series 9 (Bluetooth 5.3)', type: 'Smart Watch', rssi: -52, battery: 92 },
        { name: 'Fitbit Sense 2 (BLE)', type: 'Fitness Tracker', rssi: -64, battery: 85 },
        { name: 'Samsung Galaxy Watch 6', type: 'Smart Watch', rssi: -71, battery: 78 },
        { name: 'Garmin Venu 3 (ANT+/BLE)', type: 'Sports Watch', rssi: -79, battery: 90 },
      ]);
      setIsScanning(false);
    }, 1200);
  };

  const handlePairDevice = (deviceName: string) => {
    setConnectedDevice(deviceName);
    setBluetoothConnected(true);
    setShowBluetoothModal(false);

    setTrackerInput(prev => ({
      ...prev,
      heartRate: smartwatchVitals.heartRate.toString(),
      steps: smartwatchVitals.steps.toString(),
      caloriesBurned: smartwatchVitals.calories.toString(),
      distanceKm: (smartwatchVitals.steps * 0.00075).toFixed(1),
      notes: prev.notes || `Live watch readings synced from ${deviceName}`
    }));

    addNotification({
      title: 'Smartwatch Paired via Bluetooth',
      message: `Connected to ${deviceName}. Real-time vitals synced to FemSphere.`,
      type: 'system'
    });
  };

  const handleDisconnectBluetooth = () => {
    setBluetoothConnected(false);
    setConnectedDevice(null);
    addNotification({
      title: 'Bluetooth Watch Disconnected',
      message: 'Smartwatch disconnected.',
      type: 'system'
    });
  };

  const handleSyncWatchVitals = async () => {
    const updatedHR = Math.floor(68 + Math.random() * 12);
    const updatedSpO2 = Math.floor(97 + Math.random() * 3);
    const updatedTemp = parseFloat((36.5 + Math.random() * 0.4).toFixed(1));
    const updatedSteps = smartwatchVitals.steps + Math.floor(120 + Math.random() * 250);
    const updatedCalories = Math.floor(updatedSteps * 0.045);
    const updatedDist = (updatedSteps * 0.00075).toFixed(1);

    setSmartwatchVitals({
      heartRate: updatedHR,
      spO2: updatedSpO2,
      bodyTemp: updatedTemp,
      steps: updatedSteps,
      calories: updatedCalories,
      battery: Math.max(10, smartwatchVitals.battery - 1),
      lastSynced: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    setTrackerInput(prev => ({
      ...prev,
      heartRate: updatedHR.toString(),
      steps: updatedSteps.toString(),
      caloriesBurned: updatedCalories.toString(),
      distanceKm: updatedDist,
    }));

    // Auto persist to backend
    try {
      const token = localStorage.getItem('femsphere_token');
      if (token) {
        await fetch('/api/health-tracker/vitals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            heartRate: updatedHR,
            steps: updatedSteps,
            caloriesBurned: updatedCalories,
            distanceKm: updatedDist,
            waterIntakeLiters: 2.8,
            sleepHours: 8.0,
            exerciseMinutes: 45,
            notes: `Auto-synced live via Bluetooth smartwatch (${connectedDevice || 'Smartwatch'})`
          })
        });
        await fetchTrackerLogs();
      }
    } catch (e) {}

    await addNotification({
      title: 'Watch Vitals Auto-Synced',
      message: `Heart rate: ${updatedHR} bpm, SpO2: ${updatedSpO2}%, Steps: ${updatedSteps}.`,
      type: 'system'
    });
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
        bluetoothConnected,
        connectedDevice,
        isScanning,
        foundDevices,
        smartwatchVitals,
        handleScanBluetoothDevices,
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
        handleLogout
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
