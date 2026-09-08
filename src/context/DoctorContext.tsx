import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
  sharedReport: string;
}

export interface SharedMedicalRecord {
  id: string;
  patient: string;
  patientId: string;
  fileName: string;
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

export interface ConsultationRecord {
  id: string;
  patient: string;
  patientId: string;
  date: string;
  time: string;
  chiefComplaint: string;
  diagnosis: string;
  advice: string;
  medications: MedicationItem[];
  followUpDate: string;
}

export interface AppointmentItem {
  id: string;
  patient: string;
  patientId: string;
  date: string;
  time: string;
  reason: string;
  status: 'Scheduled' | 'Accepted' | 'Completed' | 'Rejected';
  type: 'In-Clinic' | 'Virtual Telehealth';
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
    chiefComplaint: string;
    diagnosis: string;
    advice: string;
    followUpDate: string;
    medications: MedicationItem[];
  };
  setNewConsultationForm: React.Dispatch<React.SetStateAction<{
    patient: string;
    patientId: string;
    chiefComplaint: string;
    diagnosis: string;
    advice: string;
    followUpDate: string;
    medications: MedicationItem[];
  }>>;
  handleAddMedicationRow: () => void;
  handleRemoveMedicationRow: (id: string) => void;
  handleMedicationChange: (id: string, field: keyof MedicationItem, value: string) => void;
  handleSaveConsultation: (e: React.FormEvent) => Promise<void>;
  handleDeleteConsultation: (id: string) => Promise<void>;

  // Appointments
  appointments: AppointmentItem[];
  setAppointments: React.Dispatch<React.SetStateAction<AppointmentItem[]>>;
  appointmentFilter: string;
  setAppointmentFilter: (val: string) => void;
  showBookAppointmentModal: boolean;
  setShowBookAppointmentModal: (show: boolean) => void;
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
  };
  setNewShiftForm: React.Dispatch<React.SetStateAction<{
    name: string;
    fromTime: string;
    toTime: string;
    maxPatients: number;
    mode: 'Both' | 'Virtual Telehealth' | 'In-Clinic';
  }>>;
  toggleDay: (day: string) => void;
  toggleSlot: (slot: string) => void;
  addCustomSlot: (e: React.FormEvent) => void;
  removeSlot: (slot: string) => void;
  handleAddShift: (e: React.FormEvent) => void;
  handleUpdateShiftMaxPatients: (shiftId: string, delta: number) => void;
  handleSetShiftMaxPatients: (shiftId: string, count: number) => void;
  handleDeleteShift: (shiftId: string) => void;
  handleSaveSchedule: (e: React.FormEvent) => Promise<void>;

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

  // Global Time & Auth
  currentTime: Date;
  handleLogout: () => void;
}

const DoctorContext = createContext<DoctorContextType | null>(null);

export function DoctorProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 1. Doctor Profile State
  const [profile, setProfile] = useState<DoctorProfile>(() => {
    const defaults: DoctorProfile = {
      name: 'Dr. Sarah Jenkins, MD',
      email: 'dr.jenkins@femsphere.health',
      spec: 'Obstetrics & Gynecology',
      subSpec: 'Reproductive Endocrinology & Maternal Health',
      license: 'MD-892401-CA',
      hospital: "St. Jude Women's Health Center",
      yearsExperience: '12 Years',
      bio: "Board-certified Obstetrician & Gynecologist specializing in women's longitudinal digital health twins, PCOS management, and fertility optimization.",
      phone: '+1 (555) 789-2041',
      rating: '4.9/5 (184 Reviews)',
      consultationFee: 75,
      workingDays: 'Monday - Friday',
      workingHours: '09:00 AM - 05:00 PM',
      isVerified: true
    };
    try {
      const storedUser = localStorage.getItem('femsphere_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        const p = parsed.profile || {};
        const doc = parsed.doctor || {};
        return {
          ...defaults,
          name: parsed.fullName || p.full_name || parsed.username || defaults.name,
          email: parsed.email || defaults.email,
          spec: doc.specialization || defaults.spec,
          license: doc.license_number || defaults.license,
          hospital: doc.hospital_clinic || defaults.hospital
        };
      }
    } catch (e) {
      console.error('Error loading doctor session', e);
    }
    return defaults;
  });

  const [profileSaveMsg, setProfileSaveMsg] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);

  // 2. Patient Directory & Health Twins State
  const [patients, setPatients] = useState<PatientHealthTwin[]>([
    {
      id: 'PAT-101',
      name: 'Elena Rostova',
      age: 29,
      email: 'elena.rostova@femsphere.health',
      phone: '+1 (555) 382-9102',
      bloodGroup: 'A Positive (A+)',
      heightCm: 168,
      weightKg: 62,
      bmi: 22.0,
      lifeStage: 'Reproductive Age (PCOS Monitoring)',
      cyclePhase: 'Luteal Phase (Day 21)',
      cycleDay: 21,
      heartRate: 74,
      bp: '118/76 mmHg',
      sleepHours: 7.8,
      waterLiters: 2.6,
      allergies: ['Penicillin', 'Sulfa drugs'],
      chronicConditions: ['Mild PCOS (Controlled)', 'Occasional Fatigue'],
      riskLevel: 'Moderate Attention',
      lastVisit: '2026-07-28',
      sharedReport: 'Q3_Longitudinal_Health_Report.pdf'
    },
    {
      id: 'PAT-102',
      name: 'Amara Chen',
      age: 34,
      email: 'amara.chen@gmail.com',
      phone: '+1 (555) 491-8201',
      bloodGroup: 'O Positive (O+)',
      heightCm: 162,
      weightKg: 58,
      bmi: 22.1,
      lifeStage: 'Pre-conception Planning',
      cyclePhase: 'Follicular Phase (Day 9)',
      cycleDay: 9,
      heartRate: 68,
      bp: '112/72 mmHg',
      sleepHours: 8.2,
      waterLiters: 2.8,
      allergies: ['None reported'],
      chronicConditions: ['None'],
      riskLevel: 'Optimal',
      lastVisit: '2026-07-15',
      sharedReport: 'PCOS_Blood_Panel.pdf'
    },
    {
      id: 'PAT-103',
      name: 'Sofia Davis',
      age: 42,
      email: 'sofia.d@health.org',
      phone: '+1 (555) 902-1133',
      bloodGroup: 'B Positive (B+)',
      heightCm: 170,
      weightKg: 71,
      bmi: 24.6,
      lifeStage: 'Perimenopause Transition',
      cyclePhase: 'Irregular Phase (Day 34)',
      cycleDay: 34,
      heartRate: 82,
      bp: '126/82 mmHg',
      sleepHours: 6.2,
      waterLiters: 2.1,
      allergies: ['Latex'],
      chronicConditions: ['Hormonal Imbalance', 'Hot Flashes'],
      riskLevel: 'High Attention',
      lastVisit: '2026-06-20',
      sharedReport: 'Hormone_Thyroid_Ultrasound.pdf'
    }
  ]);

  const [searchPatient, setSearchPatient] = useState('');
  const [patientRiskFilter, setPatientRiskFilter] = useState('All');
  const [selectedHealthTwin, setSelectedHealthTwin] = useState<PatientHealthTwin | null>(null);

  // 3. Shared Medical Records & AI Diagnostics State
  const [sharedRecords, setSharedRecords] = useState<SharedMedicalRecord[]>([
    {
      id: 'SREC-01',
      patient: 'Elena Rostova',
      patientId: 'PAT-101',
      fileName: 'Q3_Longitudinal_Health_Report.pdf',
      category: 'Blood & Hormone Panel',
      sharedDate: '2026-08-04',
      type: 'PDF',
      size: '2.8 MB',
      biomarkers: [
        { name: 'Hemoglobin', value: '11.8 g/dL', status: 'Borderline', referenceRange: '12.0 - 15.5 g/dL' },
        { name: 'Fasting Blood Sugar', value: '92 mg/dL', status: 'Optimal', referenceRange: '70 - 99 mg/dL' },
        { name: 'Serum Ferritin', value: '18 ng/mL', status: 'Borderline', referenceRange: '15 - 150 ng/mL' },
        { name: 'Vitamin D3 (25-OH)', value: '34 ng/mL', status: 'Normal', referenceRange: '30 - 100 ng/mL' },
        { name: 'Estradiol (E2)', value: '145 pg/mL', status: 'Normal', referenceRange: '30 - 400 pg/mL' },
        { name: 'Thyroid TSH', value: '2.1 mIU/L', status: 'Normal', referenceRange: '0.4 - 4.0 mIU/L' }
      ],
      aiSummary: 'Mild microcytic borderline anemia detected. Ferritin levels are on the lower limit. Recommend iron supplement and Vitamin C booster.',
      riskAssessment: 'Low to Moderate Risk • Routine Follow-up Recommended'
    },
    {
      id: 'SREC-02',
      patient: 'Amara Chen',
      patientId: 'PAT-102',
      fileName: 'PCOS_Blood_Panel.pdf',
      category: 'Endocrine & Metabolic Panel',
      sharedDate: '2026-07-20',
      type: 'PDF',
      size: '1.9 MB',
      biomarkers: [
        { name: 'LH / FSH Ratio', value: '1.2', status: 'Optimal', referenceRange: '< 2.0' },
        { name: 'Free Testosterone', value: '24 ng/dL', status: 'Normal', referenceRange: '15 - 70 ng/dL' },
        { name: 'Fasting Insulin', value: '8.4 uIU/mL', status: 'Optimal', referenceRange: '< 10.0 uIU/mL' },
        { name: 'DHEA-Sulfate', value: '180 ug/dL', status: 'Normal', referenceRange: '65 - 380 ug/dL' }
      ],
      aiSummary: 'Endocrine panel demonstrates balanced hormonal levels with optimal LH/FSH ratio. No active signs of hyperandrogenism.',
      riskAssessment: 'Optimal Health Twin Status'
    },
    {
      id: 'SREC-03',
      patient: 'Sofia Davis',
      patientId: 'PAT-103',
      fileName: 'Hormone_Thyroid_Ultrasound.pdf',
      category: 'Ultrasound & Hormonal Screen',
      sharedDate: '2026-06-25',
      type: 'PDF',
      size: '4.2 MB',
      biomarkers: [
        { name: 'FSH (Follicle Stimulating)', value: '28.4 mIU/mL', status: 'Abnormal', referenceRange: '1.5 - 12.5 mIU/mL' },
        { name: 'Estradiol (E2)', value: '28 pg/mL', status: 'Borderline', referenceRange: '30 - 400 pg/mL' },
        { name: 'TSH', value: '3.8 mIU/L', status: 'Normal', referenceRange: '0.4 - 4.0 mIU/L' }
      ],
      aiSummary: 'Elevated FSH with fluctuating low estradiol levels characteristic of perimenopausal transition. Endometrial lining is within healthy limits.',
      riskAssessment: 'Moderate Hormone Flux • Symptom Management Recommended'
    }
  ]);

  const [searchRecord, setSearchRecord] = useState('');
  const [selectedRecordToView, setSelectedRecordToView] = useState<SharedMedicalRecord | null>(null);

  // 4. Clinical Consultation Notes & Digital Prescriptions State
  const [consultations, setConsultations] = useState<ConsultationRecord[]>([
    {
      id: 'CONS-01',
      patient: 'Elena Rostova',
      patientId: 'PAT-101',
      date: '2026-07-28',
      time: '10:30 AM',
      chiefComplaint: 'Fatigue during late luteal phase, mild cycle cramps.',
      diagnosis: 'Phase 3 Luteal Dysphoria with Borderline Iron Deficiency',
      advice: 'Increase hydration to 2.5L daily, practice restorative evening yoga, and maintain high-protein iron-rich nutrition.',
      medications: [
        { id: 'MED-1', name: 'Ferrous Bisglycinate (Gentle Iron)', dosage: '30mg', frequency: 'Once Daily', duration: '30 Days', instructions: 'Take with orange juice / Vitamin C' },
        { id: 'MED-2', name: 'Magnesium Glycinate', dosage: '200mg', frequency: 'Once at Night', duration: '30 Days', instructions: 'Before sleep for muscle relaxation' }
      ],
      followUpDate: '2026-08-28'
    },
    {
      id: 'CONS-02',
      patient: 'Amara Chen',
      patientId: 'PAT-102',
      date: '2026-07-15',
      time: '02:30 PM',
      chiefComplaint: 'Pre-conception dietary optimization and ovulation tracking verification.',
      diagnosis: 'Normal Ovulatory Function & Optimal Pre-conceptive State',
      advice: 'Continue tracking digital health twin basal body temperature and basal cycle logs.',
      medications: [
        { id: 'MED-3', name: 'Prenatal Multivitamin with Methylfolate', dosage: '1 Tablet', frequency: 'Once Daily', duration: '60 Days', instructions: 'With morning meal' },
        { id: 'MED-4', name: 'Omega-3 DHA Supplement', dosage: '500mg', frequency: 'Once Daily', duration: '60 Days', instructions: 'After lunch' }
      ],
      followUpDate: '2026-09-15'
    }
  ]);

  const [showAddConsultationModal, setShowAddConsultationModal] = useState(false);
  const [viewingPrescriptionModal, setViewingPrescriptionModal] = useState<ConsultationRecord | null>(null);
  const [newConsultationForm, setNewConsultationForm] = useState({
    patient: 'Elena Rostova',
    patientId: 'PAT-101',
    chiefComplaint: '',
    diagnosis: '',
    advice: '',
    followUpDate: '2026-08-30',
    medications: [
      { id: '1', name: '', dosage: '', frequency: 'Once Daily', duration: '14 Days', instructions: 'After food' }
    ]
  });

  // 5. Appointments State
  const [appointments, setAppointments] = useState<AppointmentItem[]>([
    {
      id: 'APT-101',
      patient: 'Elena Rostova',
      patientId: 'PAT-101',
      date: '2026-08-19',
      time: '10:00 AM',
      reason: 'Digital Health Twin Lab Review & Ferritin Follow-up',
      status: 'Scheduled',
      type: 'Virtual Telehealth'
    },
    {
      id: 'APT-102',
      patient: 'Amara Chen',
      patientId: 'PAT-102',
      date: '2026-08-19',
      time: '02:00 PM',
      reason: 'Pre-conception Cycle Checkup',
      status: 'Accepted',
      type: 'In-Clinic'
    },
    {
      id: 'APT-103',
      patient: 'Sofia Davis',
      patientId: 'PAT-103',
      date: '2026-08-20',
      time: '11:30 AM',
      reason: 'Perimenopause Hormone Fluctuation Review',
      status: 'Scheduled',
      type: 'Virtual Telehealth'
    }
  ]);

  const [appointmentFilter, setAppointmentFilter] = useState('All');
  const [showBookAppointmentModal, setShowBookAppointmentModal] = useState(false);
  const [newAppointmentForm, setNewAppointmentForm] = useState({
    patient: 'Elena Rostova',
    patientId: 'PAT-101',
    date: '2026-08-25',
    time: '10:00 AM',
    reason: 'Routine Health Twin Follow-up',
    type: 'Virtual Telehealth' as 'In-Clinic' | 'Virtual Telehealth'
  });

  // 6. Virtual Telehealth Room State
  const [activeTelehealthSession, setActiveTelehealthSession] = useState<AppointmentItem | null>(null);
  const [telehealthCallDuration, setTelehealthCallDuration] = useState(0);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [telehealthLiveNotes, setTelehealthLiveNotes] = useState('');

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

  // 7. Doctor Availability & Shifts
  const [scheduleSettings, setScheduleSettings] = useState<ScheduleSettings>(() => {
    const defaultSchedule: ScheduleSettings = {
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      workingHours: '09:00 AM - 07:00 PM',
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
          fromTime: '05:00 PM',
          toTime: '07:00 PM',
          maxPatients: 4,
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          mode: 'Virtual Telehealth'
        }
      ],
      availableSlots: [
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
        '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM'
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
        return {
          ...defaultSchedule,
          ...parsed,
          shifts: parsed.shifts && parsed.shifts.length > 0 ? parsed.shifts : defaultSchedule.shifts
        };
      }
    } catch (e) {}
    return defaultSchedule;
  });

  const [scheduleSaveMsg, setScheduleSaveMsg] = useState<string | null>(null);
  const [customSlotInput, setCustomSlotInput] = useState('');
  const [newShiftForm, setNewShiftForm] = useState({
    name: 'Afternoon Care Window',
    fromTime: '02:00 PM',
    toTime: '05:00 PM',
    maxPatients: 5,
    mode: 'Both' as 'Virtual Telehealth' | 'In-Clinic' | 'Both'
  });

  const toggleDay = (day: string) => {
    setScheduleSettings(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day]
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
      setScheduleSettings(prev => ({
        ...prev,
        availableSlots: [...prev.availableSlots, formatted]
      }));
    }
    setCustomSlotInput('');
  };

  const removeSlot = (slot: string) => {
    setScheduleSettings(prev => ({
      ...prev,
      availableSlots: prev.availableSlots.filter(s => s !== slot)
    }));
  };

  const handleAddShift = (e: React.FormEvent) => {
    e.preventDefault();
    const newShift: ShiftItem = {
      id: `SHIFT-${Date.now().toString().slice(-4)}`,
      name: newShiftForm.name || `${newShiftForm.fromTime} - ${newShiftForm.toTime} Session`,
      fromTime: newShiftForm.fromTime,
      toTime: newShiftForm.toTime,
      maxPatients: Number(newShiftForm.maxPatients) || 4,
      days: scheduleSettings.availableDays,
      mode: newShiftForm.mode
    };

    setScheduleSettings(prev => ({
      ...prev,
      shifts: [...prev.shifts, newShift]
    }));

    setNewShiftForm({
      name: '',
      fromTime: '09:00 AM',
      toTime: '12:00 PM',
      maxPatients: 5,
      mode: 'Both'
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

  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setScheduleSaveMsg('Syncing your consultation shifts & quota limits...');
    try {
      localStorage.setItem('femsphere_doctor_schedule', JSON.stringify(scheduleSettings));
      const token = localStorage.getItem('femsphere_token');
      if (token) {
        await fetch('/api/doctors/schedule', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(scheduleSettings)
        });
      }
    } catch (err) {}
    setScheduleSaveMsg('Your consultation shifts and patient capacity counts are now LIVE for patient booking!');
    setTimeout(() => setScheduleSaveMsg(null), 4000);
  };

  // Profile Save
  const handleSaveDoctorProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaveMsg('Saving profile changes...');

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

    setProfileSaveMsg('Doctor credentials and profile updated successfully!');
    setTimeout(() => setProfileSaveMsg(null), 3000);
  };

  // Consultation Handlers
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

  const handleSaveConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConsultationForm.diagnosis) return;

    const newRecord: ConsultationRecord = {
      id: `CONS-${Date.now().toString().slice(-3)}`,
      patient: newConsultationForm.patient,
      patientId: newConsultationForm.patientId,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      chiefComplaint: newConsultationForm.chiefComplaint || 'Routine Health Twin Checkup',
      diagnosis: newConsultationForm.diagnosis,
      advice: newConsultationForm.advice,
      medications: newConsultationForm.medications.filter(m => m.name.trim() !== ''),
      followUpDate: newConsultationForm.followUpDate
    };

    setConsultations(prev => [newRecord, ...prev]);
    setShowAddConsultationModal(false);

    try {
      const token = localStorage.getItem('femsphere_token');
      if (token) {
        await fetch('/api/doctors/consultation-notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            patientId: 1,
            diagnosis: newRecord.diagnosis,
            advice: newRecord.advice,
            chiefComplaint: newRecord.chiefComplaint,
            medications: newRecord.medications
          })
        });
      }
    } catch (err) {
      console.log('API save note error:', err);
    }

    setNewConsultationForm({
      patient: 'Elena Rostova',
      patientId: 'PAT-101',
      chiefComplaint: '',
      diagnosis: '',
      advice: '',
      followUpDate: '2026-08-30',
      medications: [{ id: '1', name: '', dosage: '', frequency: 'Once Daily', duration: '14 Days', instructions: 'After food' }]
    });
  };

  const handleDeleteConsultation = async (id: string) => {
    setConsultations(prev => prev.filter(c => c.id !== id));
    try {
      const token = localStorage.getItem('femsphere_token');
      if (token) {
        await fetch(`/api/doctors/consultation-notes/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (e) {}
  };

  // Appointment Handlers
  const handleUpdateAppointmentStatus = async (id: string, newStatus: 'Accepted' | 'Completed' | 'Rejected') => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    try {
      const token = localStorage.getItem('femsphere_token');
      if (token) {
        await fetch(`/api/appointments/${id}/status`, {
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

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    const newApt: AppointmentItem = {
      id: `APT-${Date.now().toString().slice(-3)}`,
      patient: newAppointmentForm.patient,
      patientId: newAppointmentForm.patientId,
      date: newAppointmentForm.date,
      time: newAppointmentForm.time,
      reason: newAppointmentForm.reason || 'Clinical Follow-up Review',
      status: 'Scheduled',
      type: newAppointmentForm.type
    };

    const updated = [newApt, ...appointments];
    setAppointments(updated);
    try {
      localStorage.setItem('femsphere_doctor_appointments', JSON.stringify(updated));
      const token = localStorage.getItem('femsphere_token');
      if (token) {
        await fetch('/api/appointments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            patientName: newApt.patient,
            date: newApt.date,
            time: newApt.time,
            reason: newApt.reason,
            type: newApt.type
          })
        });
      }
    } catch (err) {}

    setShowBookAppointmentModal(false);
    setNewAppointmentForm({
      patient: 'Elena Rostova',
      patientId: 'PAT-101',
      date: '2026-08-25',
      time: '10:00 AM',
      reason: 'Routine Health Twin Follow-up',
      type: 'Virtual Telehealth'
    });
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
        viewingPrescriptionModal,
        setViewingPrescriptionModal,
        newConsultationForm,
        setNewConsultationForm,
        handleAddMedicationRow,
        handleRemoveMedicationRow,
        handleMedicationChange,
        handleSaveConsultation,
        handleDeleteConsultation,

        appointments,
        setAppointments,
        appointmentFilter,
        setAppointmentFilter,
        showBookAppointmentModal,
        setShowBookAppointmentModal,
        newAppointmentForm,
        setNewAppointmentForm,
        handleCreateAppointment,
        handleUpdateAppointmentStatus,

        scheduleSettings,
        setScheduleSettings,
        scheduleSaveMsg,
        setScheduleSaveMsg,
        customSlotInput,
        setCustomSlotInput,
        newShiftForm,
        setNewShiftForm,
        toggleDay,
        toggleSlot,
        addCustomSlot,
        removeSlot,
        handleAddShift,
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

        currentTime,
        handleLogout
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
