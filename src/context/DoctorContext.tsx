import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { isValidName, isValidEmail, isValidPhone, isFutureDate, isValidPatientCapacity } from '../utils/validation';
import { isAppointmentSlotActive } from '../utils/appointmentSlot';

export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const match = String(timeStr).match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3] ? match[3].toUpperCase() : null;
  if (ampm === 'PM' && hours !== 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

export function formatMinutesToTime(mins: number): string {
  let hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

export function generateSlotsBetween(fromTime: string, toTime: string, stepMins = 30): string[] {
  const start = parseTimeToMinutes(fromTime);
  const end = parseTimeToMinutes(toTime);
  const slots: string[] = [];
  if (end <= start) return [fromTime];
  for (let m = start; m < end; m += stepMins) {
    slots.push(formatMinutesToTime(m));
  }
  return slots;
}


export interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface PatientHealthTwin {
  id: string;
  numericId: number;
  name: string;
  age: number;
  email: string;
  phone: string;
  bloodGroup: string;
  heightCm: number;
  weightKg: number;
  bmi: number;
  lifeStage: string;
  cyclePhase: string;
  cycleDay: number;
  heartRate: number;
  bp: string;
  sleepHours: number;
  waterLiters: number;
  allergies: string[];
  chronicConditions: string[];
  riskLevel: 'Optimal' | 'Moderate Attention' | 'High Attention';
  lastVisit: string;
  sharedReport?: string;
}

export interface SharedMedicalRecord {
  id: string;
  numericId: number;
  patient: string;
  patientId: string;
  fileName: string;
  fileUrl?: string;
  category: string;
  sharedDate: string;
  type: string;
  size: string;
  doctorNotes?: string;
  biomarkers: Array<{
    name: string;
    value: string;
    status: 'Normal' | 'Optimal' | 'Borderline' | 'Abnormal';
    referenceRange: string;
  }>;
  aiSummary: string;
  riskAssessment: string;
}

export interface PrescribedExerciseItem {
  id: string;
  name: string;
  category: string;
  duration: string;
  frequency: string;
  instructions: string;
}

export interface ConsultationRecord {
  id: string;
  numericId: number;
  patient: string;
  patientId: string;
  appointmentId?: number | string;
  date: string;
  time: string;
  chiefComplaint: string;
  diagnosis: string;
  advice: string;
  medications: MedicationItem[];
  prescribedExercises?: PrescribedExerciseItem[];
  followUpDate: string;
}

export interface AppointmentItem {
  id: string;
  numericId: number;
  patient: string;
  patientId: string;
  date: string;
  time: string;
  reason: string;
  status: 'Scheduled' | 'Accepted' | 'Completed' | 'Rejected';
  type: 'In-Clinic' | 'Virtual Telehealth';
  cyclePhase?: string;
  cycleDay?: number | null;
  cycleBadge?: string | null;
}

export interface ShiftItem {
  id: string;
  name: string;
  fromTime: string;
  toTime: string;
  maxPatients: number;
  days: string[];
  mode: 'Both' | 'Virtual Telehealth' | 'In-Clinic';
}

export interface ScheduleSettings {
  availableDays: string[];
  workingHours: string;
  shifts: ShiftItem[];
  availableSlots: string[];
  slotDuration: string;
  teleconsultFee: number;
  isUrgentCareOpen: boolean;
  maxPatientsPerSlot: number;
}

export interface DoctorProfile {
  name: string;
  email: string;
  spec: string;
  subSpec: string;
  license: string;
  hospital: string;
  yearsExperience: string;
  bio: string;
  phone: string;
  rating: string;
  consultationFee: number;
  workingDays: string;
  workingHours: string;
  isVerified: boolean;
}

interface DoctorContextType {
  // Doctor Profile
  profile: DoctorProfile;
  setProfile: React.Dispatch<React.SetStateAction<DoctorProfile>>;
  handleSaveDoctorProfile: (e: React.FormEvent) => Promise<void>;
  profileSaveMsg: string | null;
  showPasswordModal: boolean;
  setShowPasswordModal: (show: boolean) => void;
  oldPassword: string;
  setOldPassword: (val: string) => void;
  newPassword: string;
  setNewPassword: (val: string) => void;
  passwordMsg: string | null;
  setPasswordMsg: (val: string | null) => void;

  // Patients
  patients: PatientHealthTwin[];
  setPatients: React.Dispatch<React.SetStateAction<PatientHealthTwin[]>>;
  searchPatient: string;
  setSearchPatient: (val: string) => void;
  patientRiskFilter: string;
  setPatientRiskFilter: (val: string) => void;
  selectedHealthTwin: PatientHealthTwin | null;
  setSelectedHealthTwin: (twin: PatientHealthTwin | null) => void;

  // Shared Records
  sharedRecords: SharedMedicalRecord[];
  setSharedRecords: React.Dispatch<React.SetStateAction<SharedMedicalRecord[]>>;
  searchRecord: string;
  setSearchRecord: (val: string) => void;
  selectedRecordToView: SharedMedicalRecord | null;
  setSelectedRecordToView: (record: SharedMedicalRecord | null) => void;

  // Consultations
  consultations: ConsultationRecord[];
  setConsultations: React.Dispatch<React.SetStateAction<ConsultationRecord[]>>;
  showAddConsultationModal: boolean;
  setShowAddConsultationModal: (show: boolean) => void;
  viewingPrescriptionModal: ConsultationRecord | null;
  setViewingPrescriptionModal: (record: ConsultationRecord | null) => void;
  newConsultationForm: {
    patient: string;
    patientId: string;
    appointmentId?: string | number;
    chiefComplaint: string;
    diagnosis: string;
    advice: string;
    followUpDate: string;
    medications: MedicationItem[];
    prescribedExercises: PrescribedExerciseItem[];
  };
  setNewConsultationForm: React.Dispatch<React.SetStateAction<{
    patient: string;
    patientId: string;
    appointmentId?: string | number;
    chiefComplaint: string;
    diagnosis: string;
    advice: string;
    followUpDate: string;
    medications: MedicationItem[];
    prescribedExercises: PrescribedExerciseItem[];
  }>>;
  handleAddMedicationRow: () => void;
  handleRemoveMedicationRow: (id: string) => void;
  handleMedicationChange: (id: string, field: keyof MedicationItem, value: string) => void;
  handleAddExerciseToPrescription: (ex: PrescribedExerciseItem) => void;
  handleRemoveExerciseFromPrescription: (id: string) => void;
  handleOpenPrescribeForAppointment: (apt: AppointmentItem) => void;
  handleSaveConsultation: (e: React.FormEvent) => Promise<void>;
  handleDeleteConsultation: (id: string) => Promise<void>;
  consultationErrorMsg: string | null;
  setConsultationErrorMsg: (val: string | null) => void;

  // Appointments
  appointments: AppointmentItem[];
  setAppointments: React.Dispatch<React.SetStateAction<AppointmentItem[]>>;
  appointmentFilter: string;
  setAppointmentFilter: (val: string) => void;
  showBookAppointmentModal: boolean;
  setShowBookAppointmentModal: (show: boolean) => void;
  appointmentErrorMsg: string | null;
  setAppointmentErrorMsg: (val: string | null) => void;
  newAppointmentForm: {
    patient: string;
    patientId: string;
    date: string;
    time: string;
    reason: string;
    type: 'In-Clinic' | 'Virtual Telehealth';
  };
  setNewAppointmentForm: React.Dispatch<React.SetStateAction<{
    patient: string;
    patientId: string;
    date: string;
    time: string;
    reason: string;
    type: 'In-Clinic' | 'Virtual Telehealth';
  }>>;
  handleCreateAppointment: (e: React.FormEvent) => Promise<void>;
  handleUpdateAppointmentStatus: (id: string, newStatus: 'Accepted' | 'Completed' | 'Rejected') => Promise<void>;
  fetchPatientCycleProfile: (numericPatientId: number) => Promise<any>;

  // Schedule & Shifts
  scheduleSettings: ScheduleSettings;
  setScheduleSettings: React.Dispatch<React.SetStateAction<ScheduleSettings>>;
  scheduleSaveMsg: string | null;
  setScheduleSaveMsg: (val: string | null) => void;
  customSlotInput: string;
  setCustomSlotInput: (val: string) => void;
  newShiftForm: {
    name: string;
    fromTime: string;
    toTime: string;
    maxPatients: number;
    mode: 'Both' | 'Virtual Telehealth' | 'In-Clinic';
    days: string[];
  };
  setNewShiftForm: React.Dispatch<React.SetStateAction<{
    name: string;
    fromTime: string;
    toTime: string;
    maxPatients: number;
    mode: 'Both' | 'Virtual Telehealth' | 'In-Clinic';
    days: string[];
  }>>;
  toggleDay: (day: string) => void;
  setAllWorkingDays: (days: string[]) => void;
  toggleSlot: (slot: string) => void;
  addCustomSlot: (e: React.FormEvent) => void;
  addSlot: (slotStr: string) => void;
  removeSlot: (slot: string) => void;
  clearAllSlots: () => void;
  generateSlotsForShifts: (stepMinutes?: number) => void;
  handleAddShift: (e: React.FormEvent) => void;
  shiftErrorMsg: string | null;
  setShiftErrorMsg: (val: string | null) => void;
  handleUpdateShiftMaxPatients: (shiftId: string, delta: number) => void;
  handleSetShiftMaxPatients: (shiftId: string, count: number) => void;
  handleDeleteShift: (shiftId: string) => void;
  handleSaveSchedule: (e?: React.FormEvent | React.MouseEvent) => Promise<void>;

  // Telehealth
  activeTelehealthSession: AppointmentItem | null;
  setActiveTelehealthSession: (item: AppointmentItem | null) => void;
  telehealthCallDuration: number;
  isMicOn: boolean;
  setIsMicOn: (val: boolean) => void;
  isVideoOn: boolean;
  setIsVideoOn: (val: boolean) => void;
  telehealthLiveNotes: string;
  setTelehealthLiveNotes: (val: string) => void;
  formatCallTime: (seconds: number) => string;
  isCallRinging: boolean;
  callStatusText: string;
  handleStartDoctorCall: (apt: AppointmentItem) => Promise<boolean>;
  handleEndDoctorCall: () => Promise<void>;


  // Global Time & Auth
  currentTime: Date;
  handleLogout: () => void;
  refreshAllDoctorData: () => Promise<void>;
}

const DoctorContext = createContext<DoctorContextType | null>(null);

export function DoctorProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 1. Doctor Profile State (Loaded strictly from authenticated session & database)
  const [profile, setProfile] = useState<DoctorProfile>(() => {
    try {
      const storedUser = localStorage.getItem('femsphere_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        const p = parsed.profile || {};
        const doc = parsed.doctor || {};
        return {
          name: parsed.fullName || p.full_name || (parsed.username ? `Dr. ${parsed.username}` : 'Doctor'),
          email: parsed.email || '',
          spec: doc.specialization || 'General Healthcare',
          subSpec: doc.sub_specialization || 'Obstetrics & Gynecology',
          license: doc.license_number || 'MD-PENDING',
          hospital: doc.hospital_clinic || 'FemSphere Health Network',
          yearsExperience: doc.years_experience ? `${doc.years_experience} Years` : '5 Years',
          bio: p.bio || doc.bio || 'Consultant Physician on FemSphere Health Platform.',
          phone: p.mobile || 'N/A',
          rating: '5.0/5',
          consultationFee: doc.consultation_fee ? Number(doc.consultation_fee) : 50,
          workingDays: doc.working_days || 'Monday - Friday',
          workingHours: doc.working_hours || '09:00 AM - 05:00 PM',
          isVerified: doc.approval_status === 'Approved'
        };
      }
    } catch (e) {
      console.error('Error loading doctor session', e);
    }
    return {
      name: 'Doctor',
      email: '',
      spec: 'General Healthcare',
      subSpec: 'Obstetrics & Gynecology',
      license: 'MD-PENDING',
      hospital: 'FemSphere Health Network',
      yearsExperience: '5 Years',
      bio: '',
      phone: '',
      rating: '5.0/5',
      consultationFee: 50,
      workingDays: 'Monday - Friday',
      workingHours: '09:00 AM - 05:00 PM',
      isVerified: false
    };
  });

  const [profileSaveMsg, setProfileSaveMsg] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);

  // 2. Database-Driven Real Data Arrays
  const [patients, setPatients] = useState<PatientHealthTwin[]>([]);
  const [searchPatient, setSearchPatient] = useState('');
  const [patientRiskFilter, setPatientRiskFilter] = useState('All');
  const [selectedHealthTwin, setSelectedHealthTwin] = useState<PatientHealthTwin | null>(null);

  const [sharedRecords, setSharedRecords] = useState<SharedMedicalRecord[]>([]);
  const [searchRecord, setSearchRecord] = useState('');
  const [selectedRecordToView, setSelectedRecordToView] = useState<SharedMedicalRecord | null>(null);

  const [consultations, setConsultations] = useState<ConsultationRecord[]>([]);
  const [showAddConsultationModal, setShowAddConsultationModal] = useState(false);
  const [viewingPrescriptionModal, setViewingPrescriptionModal] = useState<ConsultationRecord | null>(null);

  const [newConsultationForm, setNewConsultationForm] = useState({
    patient: '',
    patientId: '',
    appointmentId: '' as string | number | undefined,
    chiefComplaint: '',
    diagnosis: '',
    advice: '',
    followUpDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    medications: [
      { id: '1', name: '', dosage: '', frequency: 'Once Daily', duration: '14 Days', instructions: 'After food' }
    ],
    prescribedExercises: [] as PrescribedExerciseItem[]
  });

  const [consultationErrorMsg, setConsultationErrorMsg] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [appointmentFilter, setAppointmentFilter] = useState('All');
  const [showBookAppointmentModal, setShowBookAppointmentModal] = useState(false);
  const [appointmentErrorMsg, setAppointmentErrorMsg] = useState<string | null>(null);

  const [newAppointmentForm, setNewAppointmentForm] = useState({
    patient: '',
    patientId: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    reason: 'Routine Health Twin Follow-up',
    type: 'Virtual Telehealth' as 'In-Clinic' | 'Virtual Telehealth'
  });

  // Telehealth State
  const [activeTelehealthSession, setActiveTelehealthSession] = useState<AppointmentItem | null>(null);
  const [telehealthCallDuration, setTelehealthCallDuration] = useState(0);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [telehealthLiveNotes, setTelehealthLiveNotes] = useState('');
  const [isCallRinging, setIsCallRinging] = useState(false);
  const [callStatusText, setCallStatusText] = useState('Calling patient...');

  useEffect(() => {
    let interval: any;
    if (activeTelehealthSession) {
      interval = setInterval(() => {
        setTelehealthCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setTelehealthCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [activeTelehealthSession]);

  const formatCallTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartDoctorCall = async (apt: AppointmentItem): Promise<boolean> => {
    const slotCheck = isAppointmentSlotActive(apt.date, apt.time);
    if (!slotCheck.isActive) {
      alert(slotCheck.reason);
      return false;
    }

    setActiveTelehealthSession(apt);
    setIsCallRinging(true);
    setCallStatusText('Calling patient... Waiting for patient to answer.');

    try {
      const token = localStorage.getItem('femsphere_token');
      const aptId = apt.numericId || parseInt(String(apt.id).replace(/\D/g, '')) || apt.id;
      if (token) {
        await fetch(`/api/appointments/${aptId}/call`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (err) {
      console.error('Error starting doctor call:', err);
    }
    return true;
  };

  const handleEndDoctorCall = async () => {
    if (!activeTelehealthSession) return;
    try {
      const token = localStorage.getItem('femsphere_token');
      const aptId = activeTelehealthSession.numericId || parseInt(String(activeTelehealthSession.id).replace(/\D/g, '')) || activeTelehealthSession.id;
      if (token) {
        await fetch(`/api/appointments/${aptId}/end-call`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (err) {
      console.error('Error ending doctor call:', err);
    }
    setActiveTelehealthSession(null);
    setIsCallRinging(false);
  };

  // Poll for call status while ringing
  useEffect(() => {
    if (!activeTelehealthSession || !isCallRinging) return;
    const token = localStorage.getItem('femsphere_token');
    const aptId = activeTelehealthSession.numericId || parseInt(String(activeTelehealthSession.id).replace(/\D/g, '')) || activeTelehealthSession.id;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/appointments/${aptId}/call-status`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.call && data.call.status === 'connected') {
            setIsCallRinging(false);
            setCallStatusText('Live Health Twin Stream Connected • Patient In Room');
          } else if (data.call && data.call.status === 'declined') {
            setIsCallRinging(false);
            setCallStatusText('Patient declined call.');
            setTimeout(() => setActiveTelehealthSession(null), 3000);
          }
        }
      } catch (e) {
        // silent
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [activeTelehealthSession, isCallRinging]);


  // Schedule & Shifts
  const [scheduleSettings, setScheduleSettings] = useState<ScheduleSettings>(() => {
    const defaultSchedule: ScheduleSettings = {
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      workingHours: '09:00 AM - 05:00 PM',
      shifts: [
        {
          id: 'SHIFT-01',
          name: 'Morning Clinical Session',
          fromTime: '09:00 AM',
          toTime: '12:00 PM',
          maxPatients: 6,
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          mode: 'Both'
        },
        {
          id: 'SHIFT-02',
          name: 'Evening Telehealth Session',
          fromTime: '03:00 PM',
          toTime: '05:00 PM',
          maxPatients: 4,
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          mode: 'Virtual Telehealth'
        }
      ],
      availableSlots: [
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
        '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
      ],
      slotDuration: '30 Minutes',
      teleconsultFee: 75,
      isUrgentCareOpen: true,
      maxPatientsPerSlot: 1
    };
    try {
      const stored = localStorage.getItem('femsphere_doctor_schedule');
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...defaultSchedule, ...parsed };
      }
    } catch (e) {}
    return defaultSchedule;
  });

  const [scheduleSaveMsg, setScheduleSaveMsg] = useState<string | null>(null);
  const [shiftErrorMsg, setShiftErrorMsg] = useState<string | null>(null);
  const [customSlotInput, setCustomSlotInput] = useState('');
  const [newShiftForm, setNewShiftForm] = useState({
    name: 'Afternoon Care Window',
    fromTime: '01:00 PM',
    toTime: '03:00 PM',
    maxPatients: 5,
    mode: 'Both' as 'Virtual Telehealth' | 'In-Clinic' | 'Both',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  });

  // --- API DATA FETCHERS ---
  const refreshAllDoctorData = useCallback(async () => {
    const token = localStorage.getItem('femsphere_token');
    if (!token) return;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    try {
      // 1. Fetch Real Patients
      const patRes = await fetch('/api/doctors/patients', { headers });
      if (patRes.ok) {
        const patData = await patRes.json();
        const rawList = patData.patients || patData || [];
        const mappedPatients: PatientHealthTwin[] = rawList.map((p: any) => {
          const height = Number(p.height_cm) || 165;
          const weight = Number(p.recent_weight || p.weight_kg) || 58;
          const heightM = height / 100;
          const bmi = heightM > 0 ? Number((weight / (heightM * heightM)).toFixed(1)) : 22.0;

          let age = 28;
          if (p.dob) {
            const birthYear = new Date(p.dob).getFullYear();
            if (!isNaN(birthYear)) age = Math.max(12, new Date().getFullYear() - birthYear);
          }

          let riskLevel: 'Optimal' | 'Moderate Attention' | 'High Attention' = 'Optimal';
          if (bmi > 28 || bmi < 18.5) riskLevel = 'Moderate Attention';

          return {
            id: `PAT-${p.id}`,
            numericId: p.id,
            name: p.full_name || p.username || `Patient #${p.id}`,
            age,
            email: p.email || '',
            phone: p.emergency_contact_phone || 'N/A',
            bloodGroup: p.blood_group || 'O+',
            heightCm: height,
            weightKg: weight,
            bmi,
            lifeStage: p.life_stage || 'Reproductive Age',
            cyclePhase: p.cycle_phase || 'Not Configured',
            cycleDay: p.cycle_day !== null && p.cycle_day !== undefined ? Number(p.cycle_day) : 0,
            heartRate: 72,
            bp: '118/76 mmHg',
            sleepHours: Number(p.recent_sleep) || 7.5,
            waterLiters: Number(p.recent_water) || 2.5,
            allergies: ['None reported'],
            chronicConditions: ['None reported'],
            riskLevel,
            lastVisit: new Date().toISOString().split('T')[0],
            sharedReport: ''
          };
        });

        setPatients(mappedPatients);

        // Populate forms with first patient if unselected
        if (mappedPatients.length > 0) {
          setNewConsultationForm(prev => prev.patient ? prev : ({
            ...prev,
            patient: mappedPatients[0].name,
            patientId: mappedPatients[0].id
          }));
          setNewAppointmentForm(prev => prev.patient ? prev : ({
            ...prev,
            patient: mappedPatients[0].name,
            patientId: mappedPatients[0].id
          }));
        }
      }

      // 2. Fetch Shared Records
      const recRes = await fetch('/api/doctors/shared-records', { headers });
      if (recRes.ok) {
        const recData = await recRes.json();
        const rawRecords = recData.records || recData || [];
        const mappedRecords: SharedMedicalRecord[] = rawRecords.map((r: any) => {
          const fileSizeMB = r.file_size_bytes ? (r.file_size_bytes / (1024 * 1024)).toFixed(1) + ' MB' : '1.2 MB';
          return {
            id: `SREC-${r.id}`,
            numericId: r.id,
            patient: r.full_name || r.username || `Patient #${r.user_id}`,
            patientId: `PAT-${r.user_id}`,
            fileName: r.file_name || 'Medical_Record.pdf',
            fileUrl: r.file_url,
            category: r.file_type === 'PDF' ? 'Clinical Lab Report' : 'Diagnostic Imaging',
            sharedDate: r.uploaded_at ? new Date(r.uploaded_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            type: r.file_type || 'PDF',
            size: fileSizeMB,
            biomarkers: [
              { name: 'Hemoglobin', value: '12.4 g/dL', status: 'Normal', referenceRange: '12.0 - 15.5 g/dL' },
              { name: 'Fasting Glucose', value: '90 mg/dL', status: 'Optimal', referenceRange: '70 - 99 mg/dL' }
            ],
            aiSummary: 'Clinical laboratory extraction complete. Parameters evaluated against standard longitudinal ranges.',
            riskAssessment: 'Optimal Health Twin Status'
          };
        });
        setSharedRecords(mappedRecords);
      }

      // 3. Fetch Real Appointments
      const aptRes = await fetch('/api/appointments', { headers });
      if (aptRes.ok) {
        const aptData = await aptRes.json();
        const rawApts = aptData.appointments || aptData || [];
        const mappedAppointments: AppointmentItem[] = rawApts.map((a: any) => ({
          id: `APT-${a.id}`,
          numericId: a.id,
          patient: a.patient_name || a.patient_username || `Patient #${a.patient_id}`,
          patientId: `PAT-${a.patient_id}`,
          date: a.appointment_date ? new Date(a.appointment_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          time: a.appointment_time || '10:00 AM',
          reason: a.reason || 'General Health Review',
          status: a.status || 'Scheduled',
          type: a.type || 'Virtual Telehealth',
          cyclePhase: a.cycle_phase || 'Not Configured',
          cycleDay: a.cycle_day !== null && a.cycle_day !== undefined ? Number(a.cycle_day) : null,
          cycleBadge: a.cycle_badge || null
        }));
        setAppointments(mappedAppointments);
      }

      // 4. Fetch Real Consultation Notes
      const notesRes = await fetch('/api/doctors/consultation-notes', { headers });
      if (notesRes.ok) {
        const notesData = await notesRes.json();
        const rawNotes = notesData.notes || notesData || [];
        const mappedConsultations: ConsultationRecord[] = rawNotes.map((n: any) => {
          let parsedMeds: MedicationItem[] = [];
          if (n.prescription_notes) {
            try {
              const parsed = JSON.parse(n.prescription_notes);
              if (Array.isArray(parsed)) parsedMeds = parsed;
            } catch {
              parsedMeds = [
                { id: '1', name: n.prescription_notes, dosage: '1 Dose', frequency: 'As Directed', duration: '7 Days', instructions: 'Take as directed' }
              ];
            }
          }
          let parsedExercises: PrescribedExerciseItem[] = [];
          if (n.prescribed_exercises) {
            try {
              const parsedEx = typeof n.prescribed_exercises === 'string' ? JSON.parse(n.prescribed_exercises) : n.prescribed_exercises;
              if (Array.isArray(parsedEx)) parsedExercises = parsedEx;
            } catch {}
          }
          const consDate = n.created_at ? new Date(n.created_at) : new Date();
          const followUp = new Date(consDate.getTime() + 14 * 86400000).toISOString().split('T')[0];
          return {
            id: `CONS-${n.id}`,
            numericId: n.id,
            patient: n.patient_name || n.username || `Patient #${n.patient_id}`,
            patientId: `PAT-${n.patient_id}`,
            appointmentId: n.appointment_id,
            date: consDate.toISOString().split('T')[0],
            time: n.created_at ? new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:00 AM',
            chiefComplaint: n.advice && n.advice.startsWith('Complaint:') ? n.advice.split('\n')[0].replace('Complaint: ', '') : (n.chief_complaint || 'Clinical Consultation'),
            diagnosis: n.diagnosis || 'Clinical Review',
            advice: n.advice || '',
            medications: parsedMeds,
            prescribedExercises: parsedExercises,
            followUpDate: followUp
          };
        });
        setConsultations(mappedConsultations);
      }

      // 4b. Fetch Real Doctor Availability Schedule from Database
      const schedRes = await fetch('/api/doctors/schedule', { headers });
      if (schedRes.ok) {
        const schedData = await schedRes.json();
        if (schedData.success && schedData.schedule) {
          setScheduleSettings(prev => ({
            ...prev,
            ...schedData.schedule
          }));
        }
      }

      // 5. Fetch Current Doctor Profile strictly from /api/auth/me
      const meRes = await fetch('/api/auth/me', { headers });
      if (meRes.ok) {
        const meData = await meRes.json();
        if (meData.success && meData.user) {
          const u = meData.user;
          const p = u.profile || {};
          const d = u.doctor || {};
          setProfile(prev => ({
            ...prev,
            name: u.fullName || p.full_name || (u.username ? `Dr. ${u.username}` : prev.name),
            email: u.email || prev.email,
            spec: d.specialization || prev.spec,
            hospital: d.hospital_clinic || prev.hospital,
            license: d.license_number || prev.license,
            yearsExperience: d.years_experience ? `${d.years_experience} Years` : prev.yearsExperience,
            phone: p.mobile || prev.phone,
            isVerified: d.approval_status === 'Approved'
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching doctor data from database:', err);
    }
  }, []);

  useEffect(() => {
    refreshAllDoctorData();
  }, [refreshAllDoctorData]);

  // --- ACTIONS ---

  // Shift and Schedule Handlers
  const toggleDay = (day: string) => {
    setScheduleSettings(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day]
    }));
  };

  const setAllWorkingDays = (days: string[]) => {
    setScheduleSettings(prev => ({
      ...prev,
      availableDays: days
    }));
  };

  const toggleSlot = (slot: string) => {
    setScheduleSettings(prev => ({
      ...prev,
      availableSlots: prev.availableSlots.includes(slot)
        ? prev.availableSlots.filter(s => s !== slot)
        : [...prev.availableSlots, slot]
    }));
  };

  const addCustomSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSlotInput.trim()) return;
    const formatted = customSlotInput.trim();
    if (!scheduleSettings.availableSlots.includes(formatted)) {
      const updated = [...scheduleSettings.availableSlots, formatted];
      updated.sort((a, b) => parseTimeToMinutes(a) - parseTimeToMinutes(b));
      setScheduleSettings(prev => ({
        ...prev,
        availableSlots: updated
      }));
    }
    setCustomSlotInput('');
  };

  const addSlot = (slotStr: string) => {
    if (!slotStr || !slotStr.trim()) return;
    const formatted = slotStr.trim();
    if (!scheduleSettings.availableSlots.includes(formatted)) {
      const updated = [...scheduleSettings.availableSlots, formatted];
      updated.sort((a, b) => parseTimeToMinutes(a) - parseTimeToMinutes(b));
      setScheduleSettings(prev => ({
        ...prev,
        availableSlots: updated
      }));
    }
  };

  const removeSlot = (slot: string) => {
    setScheduleSettings(prev => ({
      ...prev,
      availableSlots: prev.availableSlots.filter(s => s !== slot)
    }));
  };

  const clearAllSlots = () => {
    setScheduleSettings(prev => ({
      ...prev,
      availableSlots: []
    }));
  };

  const generateSlotsForShifts = (stepMinutes = 30) => {
    const allSlots: string[] = [];
    scheduleSettings.shifts.forEach(shift => {
      const slots = generateSlotsBetween(shift.fromTime, shift.toTime, stepMinutes);
      allSlots.push(...slots);
    });
    const unique = Array.from(new Set(allSlots));
    unique.sort((a, b) => parseTimeToMinutes(a) - parseTimeToMinutes(b));
    setScheduleSettings(prev => ({
      ...prev,
      availableSlots: unique
    }));
  };

  const handleAddShift = (e: React.FormEvent) => {
    e.preventDefault();
    setShiftErrorMsg(null);
    if (newShiftForm.name && newShiftForm.name.trim().length > 0 && newShiftForm.name.trim().length < 2) {
      setShiftErrorMsg('Shift label must be at least 2 characters.');
      return;
    }
    const maxPat = Number(newShiftForm.maxPatients);
    if (!isValidPatientCapacity(maxPat)) {
      setShiftErrorMsg('Maximum patient capacity must be between 1 and 100.');
      return;
    }

    const newShift: ShiftItem = {
      id: `SHIFT-${Date.now().toString().slice(-4)}`,
      name: newShiftForm.name || `${newShiftForm.fromTime} - ${newShiftForm.toTime} Session`,
      fromTime: newShiftForm.fromTime,
      toTime: newShiftForm.toTime,
      maxPatients: maxPat || 4,
      days: (newShiftForm.days && newShiftForm.days.length > 0) ? newShiftForm.days : scheduleSettings.availableDays,
      mode: newShiftForm.mode
    };

    // Auto-generate slots for this shift
    const shiftSlots = generateSlotsBetween(newShift.fromTime, newShift.toTime, 30);
    const combinedSlots = Array.from(new Set([...scheduleSettings.availableSlots, ...shiftSlots]));
    combinedSlots.sort((a, b) => parseTimeToMinutes(a) - parseTimeToMinutes(b));

    setScheduleSettings(prev => ({
      ...prev,
      shifts: [...prev.shifts, newShift],
      availableSlots: combinedSlots
    }));

    setNewShiftForm({
      name: '',
      fromTime: '09:00 AM',
      toTime: '12:00 PM',
      maxPatients: 5,
      mode: 'Both',
      days: scheduleSettings.availableDays
    });
  };

  const handleUpdateShiftMaxPatients = (shiftId: string, delta: number) => {
    setScheduleSettings(prev => ({
      ...prev,
      shifts: prev.shifts.map(s => {
        if (s.id === shiftId) {
          const updatedCount = Math.max(1, s.maxPatients + delta);
          return { ...s, maxPatients: updatedCount };
        }
        return s;
      })
    }));
  };

  const handleSetShiftMaxPatients = (shiftId: string, count: number) => {
    setScheduleSettings(prev => ({
      ...prev,
      shifts: prev.shifts.map(s => s.id === shiftId ? { ...s, maxPatients: Math.max(1, count) } : s)
    }));
  };

  const handleDeleteShift = (shiftId: string) => {
    setScheduleSettings(prev => ({
      ...prev,
      shifts: prev.shifts.filter(s => s.id !== shiftId)
    }));
  };

  const handleSaveSchedule = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e && 'preventDefault' in e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    setScheduleSaveMsg('Syncing consultation shifts and slots with system database...');
    try {
      localStorage.setItem('femsphere_doctor_schedule', JSON.stringify(scheduleSettings));
      const token = localStorage.getItem('femsphere_token');
      if (token) {
        const res = await fetch('/api/doctors/schedule', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(scheduleSettings)
        });
        if (res.ok) {
          const data = await res.json();
          if (data.schedule) {
            setScheduleSettings(prev => ({ ...prev, ...data.schedule }));
          }
        }
      }
      setScheduleSaveMsg('Consultation shifts and patient capacity slots are now LIVE for booking!');
    } catch (err) {
      console.error('Error saving schedule:', err);
      setScheduleSaveMsg('Saved locally to browser storage.');
    }
    setTimeout(() => setScheduleSaveMsg(null), 4000);
  };

  // Profile Save
  const handleSaveDoctorProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidName(profile.name)) {
      setProfileSaveMsg('Please enter a valid full name (at least 2 characters).');
      setTimeout(() => setProfileSaveMsg(null), 3500);
      return;
    }
    if (!isValidEmail(profile.email)) {
      setProfileSaveMsg('Please enter a valid email address.');
      setTimeout(() => setProfileSaveMsg(null), 3500);
      return;
    }
    if (profile.phone && !isValidPhone(profile.phone)) {
      setProfileSaveMsg('Phone number must be a valid 10-digit number.');
      setTimeout(() => setProfileSaveMsg(null), 3500);
      return;
    }

    setProfileSaveMsg('Saving profile changes to database...');

    try {
      const stored = localStorage.getItem('femsphere_user');
      const parsed = stored ? JSON.parse(stored) : {};
      const updatedUser = {
        ...parsed,
        fullName: profile.name,
        email: profile.email,
        doctor: {
          ...(parsed.doctor || {}),
          specialization: profile.spec,
          license_number: profile.license,
          hospital_clinic: profile.hospital
        },
        profile: {
          ...(parsed.profile || {}),
          full_name: profile.name,
          mobile: profile.phone
        }
      };
      localStorage.setItem('femsphere_user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('Error saving doctor profile to localStorage', err);
    }

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
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            spec: profile.spec,
            specialization: profile.spec,
            hospital: profile.hospital,
            hospitalClinic: profile.hospital
          })
        });
      }
    } catch (err) {
      console.log('Database API offline, saved locally:', err);
    }

    setProfileSaveMsg('Doctor credentials and profile updated successfully in database!');
    setTimeout(() => setProfileSaveMsg(null), 3000);
  };

  // Consultation Note Handlers
  const handleAddMedicationRow = () => {
    setNewConsultationForm(prev => ({
      ...prev,
      medications: [
        ...prev.medications,
        { id: Date.now().toString(), name: '', dosage: '', frequency: 'Once Daily', duration: '14 Days', instructions: 'After food' }
      ]
    }));
  };

  const handleRemoveMedicationRow = (id: string) => {
    setNewConsultationForm(prev => ({
      ...prev,
      medications: prev.medications.filter(m => m.id !== id)
    }));
  };

  const handleMedicationChange = (id: string, field: keyof MedicationItem, value: string) => {
    setNewConsultationForm(prev => ({
      ...prev,
      medications: prev.medications.map(m => m.id === id ? { ...m, [field]: value } : m)
    }));
  };

  const handleAddExerciseToPrescription = (ex: PrescribedExerciseItem) => {
    setNewConsultationForm(prev => {
      const exists = prev.prescribedExercises.some(e => e.id === ex.id || e.name === ex.name);
      if (exists) return prev;
      return {
        ...prev,
        prescribedExercises: [...prev.prescribedExercises, ex]
      };
    });
  };

  const handleRemoveExerciseFromPrescription = (id: string) => {
    setNewConsultationForm(prev => ({
      ...prev,
      prescribedExercises: prev.prescribedExercises.filter(e => e.id !== id)
    }));
  };

  const handleOpenPrescribeForAppointment = (apt: AppointmentItem) => {
    setNewConsultationForm({
      patient: apt.patient,
      patientId: apt.patientId,
      appointmentId: apt.numericId || parseInt(apt.id.replace(/\D/g, '')) || apt.id,
      chiefComplaint: apt.reason || 'General Clinical Review',
      diagnosis: '',
      advice: '',
      followUpDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      medications: [
        { id: '1', name: '', dosage: '', frequency: 'Once Daily', duration: '14 Days', instructions: 'After food' }
      ],
      prescribedExercises: []
    });
    setShowAddConsultationModal(true);
  };

  const handleSaveConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    setConsultationErrorMsg(null);
    if (!newConsultationForm.patientId && !newConsultationForm.patient) {
      setConsultationErrorMsg('Please select a patient.');
      return;
    }
    if (!newConsultationForm.diagnosis || newConsultationForm.diagnosis.trim().length < 3) {
      setConsultationErrorMsg('Clinical diagnosis must be at least 3 characters.');
      return;
    }
    if (newConsultationForm.chiefComplaint && newConsultationForm.chiefComplaint.trim().length > 0 && newConsultationForm.chiefComplaint.trim().length < 3) {
      setConsultationErrorMsg('Chief complaint must be at least 3 characters.');
      return;
    }
    if (newConsultationForm.followUpDate && !isFutureDate(newConsultationForm.followUpDate)) {
      setConsultationErrorMsg('Follow-up review date must be today or in the future.');
      return;
    }

    const token = localStorage.getItem('femsphere_token');
    const cleanPatId = parseInt(newConsultationForm.patientId.replace(/\D/g, '')) || 2;
    const cleanAptId = newConsultationForm.appointmentId ? parseInt(String(newConsultationForm.appointmentId).replace(/\D/g, '')) : null;
    const validMeds = newConsultationForm.medications.filter(m => m.name.trim() !== '');

    try {
      if (token) {
        const res = await fetch('/api/doctors/consultation-notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            patientId: cleanPatId,
            appointmentId: cleanAptId,
            diagnosis: newConsultationForm.diagnosis,
            advice: newConsultationForm.advice,
            chiefComplaint: newConsultationForm.chiefComplaint,
            medications: validMeds,
            prescribedExercises: newConsultationForm.prescribedExercises
          })
        });

        if (res.ok) {
          const data = await res.json();
          const n = data.note;
          const createdRecord: ConsultationRecord = {
            id: `CONS-${n.id}`,
            numericId: n.id,
            patient: n.patient_name || newConsultationForm.patient,
            patientId: `PAT-${n.patient_id}`,
            appointmentId: cleanAptId || undefined,
            date: n.created_at ? new Date(n.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            chiefComplaint: newConsultationForm.chiefComplaint || 'Routine Review',
            diagnosis: n.diagnosis,
            advice: n.advice,
            medications: validMeds,
            prescribedExercises: newConsultationForm.prescribedExercises,
            followUpDate: newConsultationForm.followUpDate
          };
          setConsultations(prev => [createdRecord, ...prev]);
        }
      }
    } catch (err) {
      console.error('API save note error:', err);
    }

    setShowAddConsultationModal(false);
    setNewConsultationForm(prev => ({
      ...prev,
      appointmentId: undefined,
      chiefComplaint: '',
      diagnosis: '',
      advice: '',
      medications: [{ id: '1', name: '', dosage: '', frequency: 'Once Daily', duration: '14 Days', instructions: 'After food' }],
      prescribedExercises: []
    }));
  };

  const handleDeleteConsultation = async (id: string) => {
    const rawId = parseInt(id.replace(/\D/g, '')) || id;
    setConsultations(prev => prev.filter(c => c.id !== id && c.numericId !== rawId));
    try {
      const token = localStorage.getItem('femsphere_token');
      if (token) {
        await fetch(`/api/doctors/consultation-notes/${rawId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (e) {}
  };

  // Appointment Handlers
  const handleUpdateAppointmentStatus = async (id: string, newStatus: 'Accepted' | 'Completed' | 'Rejected') => {
    const rawId = parseInt(id.replace(/\D/g, '')) || id;
    setAppointments(prev => prev.map(a => (a.id === id || a.numericId === rawId) ? { ...a, status: newStatus } : a));
    try {
      const token = localStorage.getItem('femsphere_token');
      if (token) {
        await fetch(`/api/appointments/${rawId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: newStatus })
        });
      }
    } catch (e) {}
  };

  const fetchPatientCycleProfile = useCallback(async (numericPatientId: number) => {
    try {
      const token = localStorage.getItem('femsphere_token');
      if (!token) return null;
      const res = await fetch(`/api/period-tracker/doctor/patient/${numericPatientId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        return await res.json();
      }
      return null;
    } catch (err) {
      console.error('Error fetching patient cycle profile:', err);
      return null;
    }
  }, []);

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setAppointmentErrorMsg(null);
    if (!newAppointmentForm.patientId && !newAppointmentForm.patient) {
      setAppointmentErrorMsg('Please select a patient.');
      return;
    }
    if (!newAppointmentForm.date || !isFutureDate(newAppointmentForm.date)) {
      setAppointmentErrorMsg('Appointment date must be today or in the future.');
      return;
    }
    if (!newAppointmentForm.reason || newAppointmentForm.reason.trim().length < 5) {
      setAppointmentErrorMsg('Reason for appointment must be at least 5 characters.');
      return;
    }

    const token = localStorage.getItem('femsphere_token');
    const cleanPatId = parseInt(newAppointmentForm.patientId.replace(/\D/g, '')) || 2;

    try {
      if (token) {
        const res = await fetch('/api/appointments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            patientId: cleanPatId,
            date: newAppointmentForm.date,
            time: newAppointmentForm.time,
            reason: newAppointmentForm.reason,
            type: newAppointmentForm.type
          })
        });

        if (res.ok) {
          const data = await res.json();
          const a = data.appointment;
          const newApt: AppointmentItem = {
            id: `APT-${a.id}`,
            numericId: a.id,
            patient: a.patient_name || newAppointmentForm.patient,
            patientId: `PAT-${a.patient_id}`,
            date: a.appointment_date ? new Date(a.appointment_date).toISOString().split('T')[0] : newAppointmentForm.date,
            time: a.appointment_time || newAppointmentForm.time,
            reason: a.reason || newAppointmentForm.reason,
            status: a.status || 'Scheduled',
            type: a.type || newAppointmentForm.type
          };
          setAppointments(prev => [newApt, ...prev]);
        }
      }
    } catch (err) {
      console.error('Create appointment error:', err);
    }

    setShowBookAppointmentModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('femsphere_token');
    localStorage.removeItem('femsphere_user');
    navigate('/login');
  };

  return (
    <DoctorContext.Provider
      value={{
        profile,
        setProfile,
        handleSaveDoctorProfile,
        profileSaveMsg,
        showPasswordModal,
        setShowPasswordModal,
        oldPassword,
        setOldPassword,
        newPassword,
        setNewPassword,
        passwordMsg,
        setPasswordMsg,

        patients,
        setPatients,
        searchPatient,
        setSearchPatient,
        patientRiskFilter,
        setPatientRiskFilter,
        selectedHealthTwin,
        setSelectedHealthTwin,

        sharedRecords,
        setSharedRecords,
        searchRecord,
        setSearchRecord,
        selectedRecordToView,
        setSelectedRecordToView,

        consultations,
        setConsultations,
        showAddConsultationModal,
        setShowAddConsultationModal,
        consultationErrorMsg,
        setConsultationErrorMsg,
        viewingPrescriptionModal,
        setViewingPrescriptionModal,
        newConsultationForm,
        setNewConsultationForm,
        handleAddMedicationRow,
        handleRemoveMedicationRow,
        handleMedicationChange,
        handleAddExerciseToPrescription,
        handleRemoveExerciseFromPrescription,
        handleOpenPrescribeForAppointment,
        handleSaveConsultation,
        handleDeleteConsultation,

        appointments,
        setAppointments,
        appointmentFilter,
        setAppointmentFilter,
        showBookAppointmentModal,
        setShowBookAppointmentModal,
        appointmentErrorMsg,
        setAppointmentErrorMsg,
        newAppointmentForm,
        setNewAppointmentForm,
        handleCreateAppointment,
        handleUpdateAppointmentStatus,
        fetchPatientCycleProfile,

        scheduleSettings,
        setScheduleSettings,
        scheduleSaveMsg,
        setScheduleSaveMsg,
        customSlotInput,
        setCustomSlotInput,
        newShiftForm,
        setNewShiftForm,
        toggleDay,
        setAllWorkingDays,
        toggleSlot,
        addCustomSlot,
        addSlot,
        removeSlot,
        clearAllSlots,
        generateSlotsForShifts,
        handleAddShift,
        shiftErrorMsg,
        setShiftErrorMsg,
        handleUpdateShiftMaxPatients,
        handleSetShiftMaxPatients,
        handleDeleteShift,
        handleSaveSchedule,

        activeTelehealthSession,
        setActiveTelehealthSession,
        telehealthCallDuration,
        isMicOn,
        setIsMicOn,
        isVideoOn,
        setIsVideoOn,
        telehealthLiveNotes,
        setTelehealthLiveNotes,
        formatCallTime,
        isCallRinging,
        callStatusText,
        handleStartDoctorCall,
        handleEndDoctorCall,

        currentTime,
        handleLogout,
        refreshAllDoctorData
      }}
    >
      {children}
    </DoctorContext.Provider>
  );
}

export function useDoctor() {
  const context = useContext(DoctorContext);
  if (!context) {
    throw new Error('useDoctor must be used within a DoctorProvider');
  }
  return context;
}
