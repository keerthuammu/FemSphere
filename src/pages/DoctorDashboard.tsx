import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Stethoscope, Sparkles, Users, FileText, Calendar, Bell, 
  CheckCircle2, Clock, User, LogOut, Search, Activity, MessageSquare, 
  Download, Printer, Plus, Trash2, Edit, X, Check, Eye, Video, 
  VideoOff, Mic, MicOff, PhoneOff, Shield, ShieldCheck, Heart, 
  AlertTriangle, Droplet, Moon, Award, ChevronRight, Pill, 
  FileCheck, Sliders, Settings, DollarSign, RefreshCw, Send, CheckSquare
} from 'lucide-react';

interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface PatientHealthTwin {
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

interface SharedMedicalRecord {
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

interface ConsultationRecord {
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

interface AppointmentItem {
  id: string;
  patient: string;
  patientId: string;
  date: string;
  time: string;
  reason: string;
  status: 'Scheduled' | 'Accepted' | 'Completed' | 'Rejected';
  type: 'In-Clinic' | 'Virtual Telehealth';
}

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 1. Doctor Profile State (Loaded from localStorage / API)
  const [profile, setProfile] = useState(() => {
    const defaults = {
      name: 'Dr. Sarah Jenkins, MD',
      email: 'dr.jenkins@femsphere.health',
      spec: 'Obstetrics & Gynecology',
      subSpec: 'Reproductive Endocrinology & Maternal Health',
      license: 'MD-892401-CA',
      hospital: 'St. Jude Women\'s Health Center',
      yearsExperience: '12 Years',
      bio: 'Board-certified Obstetrician & Gynecologist specializing in women\'s longitudinal digital health twins, PCOS management, and fertility optimization.',
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
          hospital: doc.hospital_clinic || defaults.hospital,
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

  // 5. Appointments State & Management
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

  // --- HANDLERS ---

  const handleLogout = () => {
    localStorage.removeItem('femsphere_token');
    localStorage.removeItem('femsphere_user');
    navigate('/login');
  };

  // Save Doctor Profile
  const handleSaveDoctorProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaveMsg('Saving profile changes...');

    // 1. Update localStorage
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

    // 2. Persist to backend database
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

  // Medication Row Handlers in Consultation Form
  const handleAddMedicationRow = () => {
    setNewConsultationForm({
      ...newConsultationForm,
      medications: [
        ...newConsultationForm.medications,
        { id: Date.now().toString(), name: '', dosage: '', frequency: 'Once Daily', duration: '14 Days', instructions: 'After food' }
      ]
    });
  };

  const handleRemoveMedicationRow = (id: string) => {
    setNewConsultationForm({
      ...newConsultationForm,
      medications: newConsultationForm.medications.filter(m => m.id !== id)
    });
  };

  const handleMedicationChange = (id: string, field: keyof MedicationItem, value: string) => {
    setNewConsultationForm({
      ...newConsultationForm,
      medications: newConsultationForm.medications.map(m => m.id === id ? { ...m, [field]: value } : m)
    });
  };

  // Save Consultation Note & Prescription
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

    setConsultations([newRecord, ...consultations]);
    setShowAddConsultationModal(false);

    // API save
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
    setConsultations(consultations.filter(c => c.id !== id));
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

  // Appointment Status Updates
  const handleUpdateAppointmentStatus = async (id: string, newStatus: 'Accepted' | 'Completed' | 'Rejected') => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: newStatus } : a));
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

  // 9. Doctor Availability & Consultation Slots Management
  const [scheduleSettings, setScheduleSettings] = useState(() => {
    const defaultSchedule = {
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

  // Shift / Time Window Handlers
  const handleAddShift = (e: React.FormEvent) => {
    e.preventDefault();
    const newShift = {
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

  // Book Follow-up Appointment
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

  return (
    <div className="min-h-screen bg-[#FAF7F4] flex font-sans text-[#2E2428]">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-[#F4E0D1] border-r border-[#E5CDBC] hidden lg:flex flex-col flex-shrink-0 sticky top-0 h-screen font-inter print:hidden">
        <div className="p-6 border-b border-[#E5CDBC] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <h1 className="font-serif text-3xl font-bold text-[#7C3AED] tracking-tight">FemSphere</h1>
            <Sparkles className="w-5 h-5 text-[#14B8A6]" />
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-hide">
          <p className="text-xs uppercase tracking-widest text-[#8C756B] font-bold px-3 py-2">Clinical Practice</p>
          
          <button 
            onClick={() => setActiveTab('Overview')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base transition-all ${
              activeTab === 'Overview' ? 'bg-white text-[#7C3AED] shadow-sm border border-[#E5CDBC]' : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'
            }`}
          >
            <Stethoscope className="w-5 h-5 text-[#7C3AED]" /> Practice Overview
          </button>

          <button 
            onClick={() => setActiveTab('Patient Directory')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base transition-all ${
              activeTab === 'Patient Directory' ? 'bg-white text-[#7C3AED] shadow-sm border border-[#E5CDBC]' : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'
            }`}
          >
            <Users className="w-5 h-5 text-[#7C3AED]" /> Patient Health Twins
          </button>

          <button 
            onClick={() => setActiveTab('Shared Medical Records')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base transition-all ${
              activeTab === 'Shared Medical Records' ? 'bg-white text-[#7C3AED] shadow-sm border border-[#E5CDBC]' : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'
            }`}
          >
            <FileCheck className="w-5 h-5 text-[#14B8A6]" /> Shared Records & AI
          </button>

          <button 
            onClick={() => setActiveTab('Consultation Notes')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base transition-all ${
              activeTab === 'Consultation Notes' ? 'bg-white text-[#7C3AED] shadow-sm border border-[#E5CDBC]' : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'
            }`}
          >
            <Pill className="w-5 h-5 text-[#F472B6]" /> Prescriptions & Notes
          </button>

          <button 
            onClick={() => setActiveTab('Appointments')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base transition-all ${
              activeTab === 'Appointments' ? 'bg-white text-[#7C3AED] shadow-sm border border-[#E5CDBC]' : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'
            }`}
          >
            <Calendar className="w-5 h-5 text-[#7C3AED]" /> Appointment Hub
          </button>

          <button 
            onClick={() => setActiveTab('Availability')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base transition-all ${
              activeTab === 'Availability' ? 'bg-white text-[#7C3AED] shadow-sm border border-[#E5CDBC]' : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'
            }`}
          >
            <Clock className="w-5 h-5 text-[#14B8A6]" /> Availability & Slots
          </button>

          <p className="text-xs uppercase tracking-widest text-[#8C756B] font-bold px-3 py-2 mt-4">Settings</p>

          <button 
            onClick={() => setActiveTab('Profile')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base transition-all ${
              activeTab === 'Profile' ? 'bg-white text-[#7C3AED] shadow-sm border border-[#E5CDBC]' : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'
            }`}
          >
            <User className="w-5 h-5 text-[#7C3AED]" /> Doctor Credentials
          </button>
        </div>

        <div className="p-4 border-t border-[#E5CDBC]">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/70 hover:bg-white text-[#4A3B42] hover:text-red-600 font-bold text-sm border border-[#E5CDBC] transition-all"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto font-inter">
        
        {/* HEADER */}
        <header className="bg-[#F4E0D1]/90 backdrop-blur-md border-b border-[#E5CDBC] p-5 md:px-8 flex items-center justify-between sticky top-0 z-20 print:hidden font-inter">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-[#2E2428] text-xl md:text-2xl">
                {profile.name}
              </h2>
              {profile.isVerified && (
                <span className="flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified MD
                </span>
              )}
            </div>
            <p className="text-xs md:text-sm text-[#635259] flex items-center gap-2 mt-1">
              <Clock className="w-4 h-4 text-[#7C3AED]" />
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 transition-colors border border-rose-200"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </header>

        {/* MAIN BODY CONTAINER */}
        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">

          {/* TAB: OVERVIEW */}
          {activeTab === 'Overview' && (
            <div className="space-y-8">
              
              {/* Practice Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-6 rounded-3xl border border-[#EDE9FE] shadow-sm flex flex-col justify-between hover:border-[#7C3AED] transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#7a6f75] uppercase tracking-wider">Active Patients</span>
                    <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-[#7C3AED]">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-[#3a3135] mt-3">{patients.length}</h3>
                  <p className="text-xs text-purple-600 font-bold mt-1">Health twins connected</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-[#EDE9FE] shadow-sm flex flex-col justify-between hover:border-[#14B8A6] transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#7a6f75] uppercase tracking-wider">Today's Appointments</span>
                    <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center text-[#14B8A6]">
                      <Calendar className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-[#3a3135] mt-3">
                    {appointments.filter(a => a.date === '2026-08-19').length}
                  </h3>
                  <p className="text-xs text-teal-600 font-bold mt-1">Next: Elena Rostova (10:00 AM)</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-[#EDE9FE] shadow-sm flex flex-col justify-between hover:border-pink-400 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#7a6f75] uppercase tracking-wider">Shared Lab Reports</span>
                    <div className="w-8 h-8 rounded-xl bg-pink-50 flex items-center justify-center text-[#F472B6]">
                      <FileText className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-[#3a3135] mt-3">{sharedRecords.length}</h3>
                  <p className="text-xs text-pink-600 font-bold mt-1">AI biomarkers extracted</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-[#EDE9FE] shadow-sm flex flex-col justify-between hover:border-emerald-400 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#7a6f75] uppercase tracking-wider">Satisfaction Rating</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <Award className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-[#3a3135] mt-3">4.9 / 5.0</h3>
                  <p className="text-xs text-emerald-600 font-bold mt-1">Top rated clinical care</p>
                </div>
              </div>

            </div>
          )}

          {/* TAB: PATIENT DIRECTORY & HEALTH TWINS */}
          {activeTab === 'Patient Directory' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EDE9FE] pb-5">
                <div>
                  <h3 className="font-bold text-2xl text-[#3a3135]">Patient Digital Health Twins</h3>
                  <p className="text-xs text-[#7a6f75] mt-1">Live longitudinal biomarkers, cycle phases, and clinical histories</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="relative w-64">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a89cb5]" />
                    <input 
                      type="text" 
                      value={searchPatient}
                      onChange={(e) => setSearchPatient(e.target.value)}
                      placeholder="Search patient name..." 
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EDE9FE] bg-[#FAF8FC] text-xs outline-none focus:border-[#7C3AED]"
                    />
                  </div>

                  <select 
                    value={patientRiskFilter} 
                    onChange={(e) => setPatientRiskFilter(e.target.value)}
                    className="p-2.5 rounded-xl border border-[#EDE9FE] bg-white text-xs font-bold text-[#4a4145]"
                  >
                    <option value="All">All Risk Levels</option>
                    <option value="Optimal">Optimal</option>
                    <option value="Moderate Attention">Moderate Attention</option>
                    <option value="High Attention">High Attention</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {patients
                  .filter(p => p.name.toLowerCase().includes(searchPatient.toLowerCase()))
                  .filter(p => patientRiskFilter === 'All' || p.riskLevel === patientRiskFilter)
                  .map(p => {
                    const patientReport = sharedRecords.find(r => r.patientId === p.id || r.patient === p.name);
                    return (
                      <div key={p.id} className="p-5 rounded-3xl border border-[#EDE9FE] bg-[#FAF8FC] flex flex-col justify-between space-y-4 hover:border-[#7C3AED] transition-all">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              p.riskLevel === 'Optimal' ? 'bg-emerald-100 text-emerald-800' :
                              p.riskLevel === 'Moderate Attention' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {p.riskLevel}
                            </span>
                            <span className="text-xs font-mono font-bold text-[#7a6f75]">{p.id}</span>
                          </div>

                          <div>
                            <h4 className="font-bold text-lg text-[#3a3135]">{p.name}</h4>
                            <p className="text-xs text-[#7a6f75]">{p.age} yrs • Blood Group: {p.bloodGroup}</p>
                            <p className="text-xs font-medium text-[#7C3AED] mt-1">{p.lifeStage}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#EDE9FE] text-xs">
                            <div className="p-2 bg-white rounded-xl border border-[#EDE9FE]">
                              <span className="text-[10px] text-[#7a6f75] block">Cycle Phase</span>
                              <span className="font-bold text-[#3a3135] truncate block">{p.cyclePhase}</span>
                            </div>
                            <div className="p-2 bg-white rounded-xl border border-[#EDE9FE]">
                              <span className="text-[10px] text-[#7a6f75] block">Resting HR</span>
                              <span className="font-bold text-[#14B8A6]">{p.heartRate} bpm</span>
                            </div>
                          </div>

                          {/* Patient Shared Diagnostic Report Box */}
                          {patientReport && (
                            <div className="p-3 bg-white rounded-2xl border border-purple-100 space-y-1.5">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-bold text-[#7C3AED] flex items-center gap-1">
                                  <FileText className="w-3.5 h-3.5" /> Shared Report
                                </span>
                                <span className="text-[10px] text-[#7a6f75] font-mono">{patientReport.sharedDate}</span>
                              </div>
                              <p className="font-bold text-xs text-[#3a3135] truncate">{patientReport.fileName}</p>
                              <button 
                                type="button"
                                onClick={() => setSelectedRecordToView(patientReport)}
                                className="w-full py-1.5 bg-purple-50 hover:bg-purple-100 text-[#7C3AED] rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                              >
                                <Eye className="w-3 h-3" /> View AI Biomarkers
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-[#EDE9FE]">
                          <button 
                            onClick={() => setSelectedHealthTwin(p)} 
                            className="flex-1 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                          >
                            <Activity className="w-3.5 h-3.5" /> View Health Twin
                          </button>
                          <button 
                            onClick={() => {
                              setNewConsultationForm(prev => ({ ...prev, patient: p.name, patientId: p.id }));
                              setShowAddConsultationModal(true);
                            }} 
                            className="p-2.5 border border-[#EDE9FE] bg-white hover:bg-purple-50 text-[#7C3AED] rounded-xl font-bold"
                            title="Write Prescription"
                          >
                            <Pill className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* TAB: SHARED MEDICAL RECORDS */}
          {activeTab === 'Shared Medical Records' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EDE9FE] pb-5">
                <div>
                  <h3 className="font-bold text-2xl text-[#3a3135]">Shared Medical Records & AI Scans</h3>
                  <p className="text-xs text-[#7a6f75]">Patient-shared diagnostic reports with automated AI biomarker extraction</p>
                </div>
                
                <div className="relative w-64">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a89cb5]" />
                  <input 
                    type="text" 
                    value={searchRecord}
                    onChange={(e) => setSearchRecord(e.target.value)}
                    placeholder="Search patient name or report..." 
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EDE9FE] bg-[#FAF8FC] text-xs outline-none focus:border-[#7C3AED]"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {sharedRecords
                  .filter(r => r.fileName.toLowerCase().includes(searchRecord.toLowerCase()) || r.patient.toLowerCase().includes(searchRecord.toLowerCase()))
                  .map(rec => (
                    <div key={rec.id} className="p-6 rounded-3xl border border-[#EDE9FE] bg-[#FAF8FC] hover:border-[#7C3AED]/40 hover:bg-white transition-all space-y-4 shadow-2xs">
                      
                      {/* Top Header: Patient Identity Banner & File Badges */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EDE9FE] pb-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#F472B6] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                            {rec.patient.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-base text-[#3a3135]">{rec.patient}</h4>
                              <span className="px-2 py-0.5 rounded-md bg-purple-100 text-[#7C3AED] font-mono font-bold text-[10px]">
                                {rec.patientId}
                              </span>
                            </div>
                            <p className="text-xs text-[#7a6f75]">Patient Digital Health Twin Active</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-purple-100 text-[#7C3AED] font-bold text-xs">
                            {rec.category}
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-gray-100 text-[#7a6f75] font-semibold text-[11px]">
                            {rec.type} • {rec.size}
                          </span>
                          <span className="text-xs font-medium text-[#7a6f75]">
                            Uploaded: {rec.sharedDate}
                          </span>
                        </div>
                      </div>

                      {/* Middle: Report File Name & AI Analysis Preview */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <FileCheck className="w-5 h-5 text-[#14B8A6]" />
                            <h5 className="font-bold text-sm text-[#3a3135]">{rec.fileName}</h5>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 text-xs">
                            <span className="font-bold text-[#7C3AED] flex items-center gap-1.5 text-[11px] uppercase tracking-wider mb-1">
                              <Sparkles className="w-3.5 h-3.5 text-[#14B8A6]" /> AI Diagnostic Summary for {rec.patient}
                            </span>
                            <p className="text-[#3a3135] leading-relaxed">{rec.aiSummary}</p>
                          </div>

                          {/* Quick Biomarker Highlights */}
                          <div className="flex flex-wrap gap-2 pt-1">
                            {rec.biomarkers.slice(0, 3).map((bm, bIdx) => (
                              <span key={bIdx} className="px-2.5 py-1 rounded-lg bg-white border border-[#EDE9FE] text-[11px] font-medium text-[#3a3135]">
                                <b>{bm.name}:</b> <span className="text-[#7C3AED] font-bold">{bm.value}</span> ({bm.status})
                              </span>
                            ))}
                            {rec.biomarkers.length > 3 && (
                              <span className="px-2 py-1 rounded-lg bg-gray-100 text-[10px] font-bold text-[#7a6f75]">
                                +{rec.biomarkers.length - 3} more parameters
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-row md:flex-col gap-2 shrink-0 self-end md:self-center">
                          <button 
                            onClick={() => setSelectedRecordToView(rec)} 
                            className="px-5 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer text-xs"
                          >
                            <Eye className="w-4 h-4" /> View AI Biomarkers
                          </button>
                          <button 
                            onClick={() => {
                              const pat = patients.find(p => p.id === rec.patientId);
                              if (pat) setSelectedHealthTwin(pat);
                            }}
                            className="px-4 py-2 border border-[#EDE9FE] bg-white text-[#3a3135] hover:bg-purple-50 hover:text-[#7C3AED] rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs"
                          >
                            <Activity className="w-3.5 h-3.5" /> Patient Twin
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB: PRESCRIPTIONS & CONSULTATION NOTES */}
          {activeTab === 'Consultation Notes' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EDE9FE] pb-5">
                <div>
                  <h3 className="font-bold text-2xl text-[#3a3135]">Clinical Notes & Digital Prescriptions</h3>
                  <p className="text-xs text-[#7a6f75]">Generate official digital prescriptions with structured dosages and lifestyle advice</p>
                </div>
                <button 
                  onClick={() => setShowAddConsultationModal(true)} 
                  className="px-5 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Create Prescription Note
                </button>
              </div>

              <div className="space-y-4">
                {consultations.map(cons => (
                  <div key={cons.id} className="p-6 rounded-3xl border border-[#EDE9FE] bg-[#FAF8FC] space-y-4 text-xs">
                    <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-3">
                      <div>
                        <h4 className="font-bold text-base text-[#3a3135]">{cons.patient}</h4>
                        <p className="text-[#7a6f75]">{cons.date} at {cons.time} • Chief Complaint: <span className="text-[#3a3135] font-semibold">{cons.chiefComplaint}</span></p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setViewingPrescriptionModal(cons)} 
                          className="px-3.5 py-1.5 bg-[#14B8A6] hover:bg-[#0D9488] text-white rounded-xl font-bold flex items-center gap-1.5"
                        >
                          <Printer className="w-3.5 h-3.5" /> Printable Rx
                        </button>
                        <button 
                          onClick={() => handleDeleteConsultation(cons.id)} 
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                          title="Delete note"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <span className="font-bold text-[#7C3AED] block mb-1">Clinical Diagnosis</span>
                        <p className="p-3 bg-white rounded-xl border border-[#EDE9FE] font-medium text-[#3a3135]">{cons.diagnosis}</p>
                      </div>
                      <div>
                        <span className="font-bold text-[#14B8A6] block mb-1">Dietary & Lifestyle Advice</span>
                        <p className="p-3 bg-white rounded-xl border border-[#EDE9FE] text-[#4a4145]">{cons.advice}</p>
                      </div>
                    </div>

                    {cons.medications && cons.medications.length > 0 && (
                      <div className="space-y-2">
                        <span className="font-bold text-pink-600 uppercase text-[10px] tracking-wider block">Prescribed Medications (Rx)</span>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {cons.medications.map((med, idx) => (
                            <div key={idx} className="p-3 bg-white rounded-xl border border-[#EDE9FE] flex items-center justify-between">
                              <div>
                                <p className="font-bold text-[#3a3135]">{med.name} ({med.dosage})</p>
                                <p className="text-[#7a6f75] text-[11px]">{med.frequency} • {med.duration}</p>
                              </div>
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-50 text-[#7C3AED] font-semibold">{med.instructions}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: APPOINTMENT MANAGEMENT HUB */}
          {activeTab === 'Appointments' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EDE9FE] pb-5">
                <div>
                  <h3 className="font-bold text-2xl text-[#3a3135]">Clinical Appointment Hub</h3>
                  <p className="text-xs text-[#7a6f75]">Manage consultation slots, in-clinic visits, and telehealth calls</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <select 
                    value={appointmentFilter} 
                    onChange={(e) => setAppointmentFilter(e.target.value)}
                    className="p-2.5 rounded-xl border border-[#EDE9FE] bg-white text-xs font-bold text-[#4a4145]"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  <button 
                    onClick={() => setShowBookAppointmentModal(true)} 
                    className="px-4 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Book Appointment
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {appointments
                  .filter(a => appointmentFilter === 'All' || a.status === appointmentFilter)
                  .map(apt => (
                    <div key={apt.id} className="p-4 rounded-2xl border border-[#EDE9FE] bg-[#FAF8FC] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3.5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                          apt.type === 'Virtual Telehealth' ? 'bg-purple-100 text-[#7C3AED]' : 'bg-teal-100 text-[#14B8A6]'
                        }`}>
                          {apt.type === 'Virtual Telehealth' ? <Video className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-bold text-[#3a3135] text-sm">{apt.patient}</p>
                          <p className="text-[#7a6f75]">{apt.date} at {apt.time} • <span className="font-medium text-[#7C3AED]">{apt.type}</span> • {apt.reason}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full font-bold text-[11px] ${
                          apt.status === 'Accepted' || apt.status === 'Scheduled' ? 'bg-emerald-100 text-emerald-800' :
                          apt.status === 'Completed' ? 'bg-purple-100 text-[#7C3AED]' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {apt.status}
                        </span>

                        {apt.type === 'Virtual Telehealth' && (
                          <button 
                            onClick={() => setActiveTelehealthSession(apt)} 
                            className="px-3.5 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-xl flex items-center gap-1.5"
                          >
                            <Video className="w-3.5 h-3.5" /> Teleconsult
                          </button>
                        )}

                        {apt.status !== 'Completed' && (
                          <button 
                            onClick={() => handleUpdateAppointmentStatus(apt.id, 'Completed')} 
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                          >
                            Mark Completed
                          </button>
                        )}

                        {apt.status === 'Scheduled' && (
                          <button 
                            onClick={() => handleUpdateAppointmentStatus(apt.id, 'Rejected')} 
                            className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold rounded-xl"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB: DOCTOR CREDENTIALS & PRACTICE SETTINGS */}
          {activeTab === 'Profile' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm max-w-2xl mx-auto space-y-6">
              <div className="border-b border-[#EDE9FE] pb-4">
                <h3 className="font-bold text-2xl text-[#3a3135]">Doctor Credentials & Practice Profile</h3>
                <p className="text-xs text-[#7a6f75]">Manage clinical license information, consultation fees, and working hours</p>
              </div>

              {profileSaveMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> {profileSaveMsg}
                </div>
              )}

              <form onSubmit={handleSaveDoctorProfile} className="space-y-4 text-xs">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold uppercase text-[#7a6f75] mb-1">Full Practitioner Name</label>
                    <input 
                      type="text" 
                      value={profile.name} 
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })} 
                      className="w-full p-3 rounded-xl border border-[#EDE9FE]" 
                      required 
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-[#7a6f75] mb-1">Email Address</label>
                    <input 
                      type="email" 
                      value={profile.email} 
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })} 
                      className="w-full p-3 rounded-xl border border-[#EDE9FE]" 
                      required 
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-[#7a6f75] mb-1">Primary Specialization</label>
                    <input 
                      type="text" 
                      value={profile.spec} 
                      onChange={(e) => setProfile({ ...profile, spec: e.target.value })} 
                      className="w-full p-3 rounded-xl border border-[#EDE9FE]" 
                      required 
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-[#7a6f75] mb-1">Hospital / Clinic Affiliation</label>
                    <input 
                      type="text" 
                      value={profile.hospital} 
                      onChange={(e) => setProfile({ ...profile, hospital: e.target.value })} 
                      className="w-full p-3 rounded-xl border border-[#EDE9FE]" 
                      required 
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-[#7a6f75] mb-1">Medical License Number</label>
                    <input 
                      type="text" 
                      value={profile.license} 
                      readOnly 
                      className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-[#F5F3FF] text-[#7C3AED] font-mono font-bold" 
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-[#7a6f75] mb-1">Practice Working Hours</label>
                    <input 
                      type="text" 
                      value={profile.workingHours} 
                      onChange={(e) => setProfile({ ...profile, workingHours: e.target.value })} 
                      className="w-full p-3 rounded-xl border border-[#EDE9FE]" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase text-[#7a6f75] mb-1">Professional Clinical Bio</label>
                  <textarea 
                    value={profile.bio} 
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })} 
                    rows={3}
                    className="w-full p-3 rounded-xl border border-[#EDE9FE]" 
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button 
                    type="button" 
                    onClick={() => setShowPasswordModal(true)} 
                    className="px-4 py-2.5 rounded-xl border border-[#EDE9FE] font-bold text-[#7C3AED] hover:bg-purple-50"
                  >
                    Change Password
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-bold transition-all shadow-sm"
                  >
                    Save Profile Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 7. TAB: DOCTOR AVAILABILITY & CONSULTATION SLOTS */}
          {activeTab === 'Availability' && (
            <div className="space-y-8">
              
              {/* Header & Status Banner */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Dynamic Capacity Engine
                    </span>
                    <span className="px-3 py-1 rounded-full bg-purple-100 text-[#7C3AED] text-xs font-bold">
                      {scheduleSettings.shifts.length} Active Shifts • {scheduleSettings.shifts.reduce((acc, s) => acc + s.maxPatients, 0)} Total Daily Capacity
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl text-[#3a3135] mt-2">Consultation Shifts & Patient Capacity Limits</h3>
                  <p className="text-xs text-[#7a6f75] mt-1">Configure consultation time ranges (e.g., 9 to 12 or 5 to 7) and set the maximum patient quota allowed per window.</p>
                </div>

                <button 
                  onClick={handleSaveSchedule}
                  className="px-6 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <CheckSquare className="w-4 h-4" /> Save & Publish Schedule
                </button>
              </div>

              {scheduleSaveMsg && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  {scheduleSaveMsg}
                </div>
              )}

              {/* 1. Consultation Time Shifts & Patient Capacity Quota Engine */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EDE9FE] pb-4">
                  <div>
                    <h4 className="font-bold text-base text-[#3a3135]">1. Consultation Shifts & Max Patient Limits</h4>
                    <p className="text-xs text-[#7a6f75]">Set your time ranges (From - To) and adjust the maximum patient capacity. Booking closes automatically when limit is reached.</p>
                  </div>
                </div>

                {/* Active Shifts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {scheduleSettings.shifts.map(shift => (
                    <div 
                      key={shift.id}
                      className="p-5 rounded-2xl border border-[#EDE9FE] bg-[#FAF8FC] hover:border-[#7C3AED]/30 transition-all space-y-4 shadow-2xs"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-[#7C3AED]">
                            {shift.mode}
                          </span>
                          <h5 className="font-bold text-base text-[#3a3135] mt-1">{shift.name}</h5>
                          <p className="text-xs font-bold text-[#7C3AED] flex items-center gap-1.5 mt-0.5">
                            <Clock className="w-3.5 h-3.5" /> {shift.fromTime} ➔ {shift.toTime}
                          </p>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => handleDeleteShift(shift.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                          title="Delete shift"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Patient Capacity Stepper */}
                      <div className="p-3 bg-white rounded-xl border border-[#EDE9FE] flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-[#7a6f75] uppercase block">Max Patient Quota</span>
                          <span className="text-xs font-semibold text-[#3a3135]">Allowed bookings per day</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button 
                            type="button"
                            onClick={() => handleUpdateShiftMaxPatients(shift.id, -1)}
                            className="w-8 h-8 rounded-lg bg-[#FAF8FC] hover:bg-purple-100 text-[#7C3AED] font-bold flex items-center justify-center border border-[#EDE9FE] cursor-pointer"
                          >
                            -
                          </button>
                          <input 
                            type="number"
                            value={shift.maxPatients}
                            onChange={(e) => handleSetShiftMaxPatients(shift.id, Number(e.target.value))}
                            min={1}
                            className="w-14 text-center font-bold text-sm text-[#7C3AED] py-1 border border-[#EDE9FE] rounded-lg"
                          />
                          <button 
                            type="button"
                            onClick={() => handleUpdateShiftMaxPatients(shift.id, 1)}
                            className="w-8 h-8 rounded-lg bg-[#FAF8FC] hover:bg-purple-100 text-[#7C3AED] font-bold flex items-center justify-center border border-[#EDE9FE] cursor-pointer"
                          >
                            +
                          </button>
                          <span className="text-xs font-bold text-[#7a6f75]">Patients</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add New Shift Window Form */}
                <div className="p-5 rounded-2xl bg-white border border-dashed border-[#7C3AED]/40 space-y-4">
                  <h5 className="font-bold text-sm text-[#3a3135] flex items-center gap-2">
                    <Plus className="w-4 h-4 text-[#7C3AED]" /> Add New Consultation Shift / Time Range
                  </h5>

                  <form onSubmit={handleAddShift} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-[#7a6f75] uppercase text-[10px] mb-1">Shift Name</label>
                      <input 
                        type="text" 
                        value={newShiftForm.name} 
                        onChange={(e) => setNewShiftForm({ ...newShiftForm, name: e.target.value })}
                        placeholder="e.g., Evening Session"
                        className="w-full p-2.5 rounded-xl border border-[#EDE9FE] font-medium text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#7a6f75] uppercase text-[10px] mb-1">From Time</label>
                      <select 
                        value={newShiftForm.fromTime} 
                        onChange={(e) => setNewShiftForm({ ...newShiftForm, fromTime: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-[#EDE9FE] font-bold text-xs bg-white"
                      >
                        <option value="08:00 AM">08:00 AM</option>
                        <option value="09:00 AM">09:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="01:00 PM">01:00 PM</option>
                        <option value="02:00 PM">02:00 PM</option>
                        <option value="03:00 PM">03:00 PM</option>
                        <option value="04:00 PM">04:00 PM</option>
                        <option value="05:00 PM">05:00 PM</option>
                        <option value="06:00 PM">06:00 PM</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-[#7a6f75] uppercase text-[10px] mb-1">To Time</label>
                      <select 
                        value={newShiftForm.toTime} 
                        onChange={(e) => setNewShiftForm({ ...newShiftForm, toTime: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-[#EDE9FE] font-bold text-xs bg-white"
                      >
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="12:00 PM">12:00 PM</option>
                        <option value="01:00 PM">01:00 PM</option>
                        <option value="02:00 PM">02:00 PM</option>
                        <option value="04:00 PM">04:00 PM</option>
                        <option value="05:00 PM">05:00 PM</option>
                        <option value="06:00 PM">06:00 PM</option>
                        <option value="07:00 PM">07:00 PM</option>
                        <option value="08:00 PM">08:00 PM</option>
                        <option value="09:00 PM">09:00 PM</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-[#7a6f75] uppercase text-[10px] mb-1">Max Patients Allowed</label>
                      <input 
                        type="number" 
                        value={newShiftForm.maxPatients} 
                        onChange={(e) => setNewShiftForm({ ...newShiftForm, maxPatients: Number(e.target.value) })}
                        min={1}
                        className="w-full p-2.5 rounded-xl border border-[#EDE9FE] font-bold text-xs"
                      />
                    </div>

                    <div className="flex items-end">
                      <button 
                        type="submit" 
                        className="w-full py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer"
                      >
                        + Add Shift Window
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* 2. Working Days Selector */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-3">
                  <div>
                    <h4 className="font-bold text-base text-[#3a3135]">2. Available Consultation Days</h4>
                    <p className="text-xs text-[#7a6f75]">Select the days of the week your consultation shifts are active</p>
                  </div>
                  <span className="text-xs font-bold text-[#7C3AED]">{scheduleSettings.availableDays.length} Days Selected</span>
                </div>

                <div className="flex flex-wrap gap-2.5 pt-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                    const isSelected = scheduleSettings.availableDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                          isSelected 
                            ? 'bg-[#7C3AED] text-white border-[#7C3AED] shadow-sm' 
                            : 'bg-[#FAF8FC] text-[#7a6f75] border-[#EDE9FE] hover:bg-white hover:text-[#3a3135]'
                        }`}
                      >
                        {isSelected ? <Check className="w-4 h-4 text-white" /> : <div className="w-4 h-4 rounded-full border border-gray-300" />}
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Practice Timing & Teleconsultation Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-3xl p-6 border border-[#EDE9FE] shadow-sm space-y-3">
                  <label className="block font-bold uppercase text-[10px] text-[#7a6f75]">Overall Working Hours Window</label>
                  <input 
                    type="text" 
                    value={scheduleSettings.workingHours} 
                    onChange={(e) => setScheduleSettings({ ...scheduleSettings, workingHours: e.target.value })}
                    className="w-full p-3 rounded-xl border border-[#EDE9FE] text-xs font-bold text-[#3a3135]"
                    placeholder="e.g., 09:00 AM - 07:00 PM"
                  />
                  <p className="text-[11px] text-[#7a6f75]">Clinic and online practice envelope</p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-[#EDE9FE] shadow-sm space-y-3">
                  <label className="block font-bold uppercase text-[10px] text-[#7a6f75]">Consultation Slot Duration</label>
                  <select 
                    value={scheduleSettings.slotDuration} 
                    onChange={(e) => setScheduleSettings({ ...scheduleSettings, slotDuration: e.target.value })}
                    className="w-full p-3 rounded-xl border border-[#EDE9FE] text-xs font-bold text-[#3a3135] bg-white"
                  >
                    <option value="15 Minutes">15 Minutes / Session</option>
                    <option value="30 Minutes">30 Minutes / Session (Recommended)</option>
                    <option value="45 Minutes">45 Minutes / Session</option>
                    <option value="60 Minutes">60 Minutes / Session</option>
                  </select>
                  <p className="text-[11px] text-[#7a6f75]">Length allocated for each health twin review</p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-[#EDE9FE] shadow-sm space-y-3">
                  <label className="block font-bold uppercase text-[10px] text-[#7a6f75]">Telehealth Consultation Fee ($)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-[#7a6f75] font-bold text-xs">$</span>
                    <input 
                      type="number" 
                      value={scheduleSettings.teleconsultFee} 
                      onChange={(e) => setScheduleSettings({ ...scheduleSettings, teleconsultFee: Number(e.target.value) })}
                      className="w-full pl-8 p-3 rounded-xl border border-[#EDE9FE] text-xs font-bold text-[#3a3135]"
                    />
                  </div>
                  <p className="text-[11px] text-[#7a6f75]">Per-session rate for virtual consultations</p>
                </div>
              </div>

              {/* 4. Emergency / Urgent Telehealth Walk-ins */}
              <div className="p-5 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-[#3a3135]">Emergency / Urgent Telehealth Walk-ins</h5>
                    <p className="text-xs text-[#7a6f75]">Allow patients with critical biomarker alerts to request priority immediate slots</p>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={scheduleSettings.isUrgentCareOpen}
                  onChange={(e) => setScheduleSettings({ ...scheduleSettings, isUrgentCareOpen: e.target.checked })}
                  className="w-5 h-5 text-[#7C3AED] rounded-md cursor-pointer accent-[#7C3AED]"
                />
              </div>

            </div>
          )}

        </div>

      </div>

      {/* --- MODAL: PATIENT DIGITAL HEALTH TWIN VIEWER --- */}
      {selectedHealthTwin && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 border border-[#EDE9FE] shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#F472B6] text-white flex items-center justify-center font-bold text-lg">
                  {selectedHealthTwin.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-[#3a3135]">{selectedHealthTwin.name}</h3>
                  <p className="text-xs text-[#7a6f75]">{selectedHealthTwin.age} yrs • {selectedHealthTwin.bloodGroup} • {selectedHealthTwin.lifeStage}</p>
                </div>
              </div>
              <button onClick={() => setSelectedHealthTwin(null)} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
            </div>

            {/* Vitals Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 bg-[#FAF8FC] rounded-2xl border border-[#EDE9FE]">
                <span className="text-[10px] font-bold text-[#7a6f75] uppercase block">Heart Rate</span>
                <span className="text-lg font-bold text-[#7C3AED] mt-1 block">{selectedHealthTwin.heartRate} bpm</span>
              </div>
              <div className="p-3.5 bg-[#FAF8FC] rounded-2xl border border-[#EDE9FE]">
                <span className="text-[10px] font-bold text-[#7a6f75] uppercase block">Blood Pressure</span>
                <span className="text-lg font-bold text-[#14B8A6] mt-1 block">{selectedHealthTwin.bp}</span>
              </div>
              <div className="p-3.5 bg-[#FAF8FC] rounded-2xl border border-[#EDE9FE]">
                <span className="text-[10px] font-bold text-[#7a6f75] uppercase block">Cycle Phase</span>
                <span className="text-sm font-bold text-[#F472B6] mt-1 block truncate">{selectedHealthTwin.cyclePhase}</span>
              </div>
              <div className="p-3.5 bg-[#FAF8FC] rounded-2xl border border-[#EDE9FE]">
                <span className="text-[10px] font-bold text-[#7a6f75] uppercase block">BMI / Weight</span>
                <span className="text-lg font-bold text-[#3a3135] mt-1 block">{selectedHealthTwin.bmi} ({selectedHealthTwin.weightKg}kg)</span>
              </div>
            </div>

            {/* Clinical Profile Info */}
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE] space-y-1">
                <span className="font-bold text-[#7a6f75] uppercase text-[10px]">Known Allergies</span>
                <p className="font-semibold text-rose-700">{selectedHealthTwin.allergies.join(', ')}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE] space-y-1">
                <span className="font-bold text-[#7a6f75] uppercase text-[10px]">Chronic Conditions & Health Twin Notes</span>
                <p className="text-[#3a3135]">{selectedHealthTwin.chronicConditions.join(' • ')}</p>
              </div>

              {/* Shared Diagnostic Report for this Patient */}
              {(() => {
                const twinReport = sharedRecords.find(r => r.patientId === selectedHealthTwin.id || r.patient === selectedHealthTwin.name);
                if (!twinReport) return null;
                return (
                  <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#7C3AED] uppercase text-[10px] flex items-center gap-1.5">
                        <FileCheck className="w-4 h-4 text-[#14B8A6]" /> Patient Shared Diagnostic Report
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-purple-100 text-[#7C3AED] font-bold text-[10px]">
                        {twinReport.category}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h5 className="font-bold text-sm text-[#3a3135]">{twinReport.fileName}</h5>
                        <p className="text-[11px] text-[#7a6f75]">Uploaded {twinReport.sharedDate} • {twinReport.size}</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => {
                          setSelectedRecordToView(twinReport);
                        }}
                        className="px-3.5 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> View AI Biomarkers
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 pt-4 border-t border-[#EDE9FE]">
              <button 
                onClick={() => {
                  setSelectedHealthTwin(null);
                  setNewConsultationForm(prev => ({ ...prev, patient: selectedHealthTwin.name, patientId: selectedHealthTwin.id }));
                  setShowAddConsultationModal(true);
                }} 
                className="flex-1 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Create Prescription Note
              </button>
              <button 
                onClick={() => setSelectedHealthTwin(null)} 
                className="px-5 py-3 border border-[#EDE9FE] rounded-xl text-xs font-bold text-[#7a6f75] hover:bg-gray-50 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: AI BIOMARKER & LAB REVIEWER --- */}
      {selectedRecordToView && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 border border-[#EDE9FE] shadow-2xl space-y-6">
            
            {/* Header: Patient Name & Report File */}
            <div className="flex items-start justify-between border-b border-[#EDE9FE] pb-4 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-[#7C3AED] font-bold text-[10px]">
                    {selectedRecordToView.category}
                  </span>
                  <span className="text-xs text-[#7a6f75]">Uploaded {selectedRecordToView.sharedDate}</span>
                </div>
                <h3 className="font-bold text-xl text-[#3a3135] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#7C3AED]" /> {selectedRecordToView.fileName}
                </h3>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-[#7a6f75]">Patient:</span>
                  <span className="font-bold text-[#7C3AED] bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                    {selectedRecordToView.patient} ({selectedRecordToView.patientId})
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedRecordToView(null)} className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"><X className="w-5 h-5 text-gray-500" /></button>
            </div>

            {/* AI Summary Banner */}
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-xs space-y-1.5">
              <span className="font-bold text-[#7C3AED] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#14B8A6]" /> AI Clinical Analysis Summary
              </span>
              <p className="text-[#3a3135] leading-relaxed">{selectedRecordToView.aiSummary}</p>
            </div>

            {/* Biomarker Table */}
            <div className="space-y-2">
              <span className="font-bold text-xs text-[#3a3135] uppercase tracking-wider">Extracted Lab Parameters</span>
              <div className="overflow-x-auto border border-[#EDE9FE] rounded-2xl">
                <table className="w-full text-left text-xs font-inter">
                  <thead className="bg-[#FAF8FC] border-b border-[#EDE9FE] text-[#7a6f75] uppercase text-[10px] font-bold">
                    <tr>
                      <th className="p-3">Biomarker</th>
                      <th className="p-3">Result Value</th>
                      <th className="p-3">Clinical Status</th>
                      <th className="p-3">Standard Reference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDE9FE]">
                    {selectedRecordToView.biomarkers.map((bm, idx) => (
                      <tr key={idx} className="hover:bg-[#FAF8FC]">
                        <td className="p-3 font-bold text-[#3a3135]">{bm.name}</td>
                        <td className="p-3 font-mono font-bold text-[#7C3AED]">{bm.value}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            bm.status === 'Optimal' || bm.status === 'Normal' ? 'bg-emerald-100 text-emerald-800' :
                            bm.status === 'Borderline' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {bm.status}
                          </span>
                        </td>
                        <td className="p-3 text-[#7a6f75] font-mono text-[11px]">{bm.referenceRange}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-[#EDE9FE]">
              <button 
                onClick={() => alert(`Downloading official PDF copy of ${selectedRecordToView.fileName}...`)} 
                className="flex-1 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download Medical Report
              </button>
              <button 
                onClick={() => setSelectedRecordToView(null)} 
                className="px-5 py-3 border border-[#EDE9FE] rounded-xl text-xs font-bold text-[#7a6f75] hover:bg-gray-50 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: CREATE CONSULTATION NOTE & DIGITAL PRESCRIPTION --- */}
      {showAddConsultationModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 border border-[#EDE9FE] shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-4">
              <div>
                <h3 className="font-bold text-xl text-[#3a3135]">New Consultation & Prescription</h3>
                <p className="text-xs text-[#7a6f75]">Generate clinical notes and multi-medication digital prescription</p>
              </div>
              <button onClick={() => setShowAddConsultationModal(false)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>

            <form onSubmit={handleSaveConsultation} className="space-y-4 text-xs">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#4a4145] uppercase mb-1">Select Patient</label>
                  <select 
                    value={newConsultationForm.patient}
                    onChange={(e) => {
                      const sel = patients.find(p => p.name === e.target.value);
                      setNewConsultationForm({ ...newConsultationForm, patient: e.target.value, patientId: sel ? sel.id : 'PAT-101' });
                    }}
                    className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-white font-bold text-[#3a3135]"
                  >
                    {patients.map(p => (
                      <option key={p.id} value={p.name}>{p.name} ({p.id})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#4a4145] uppercase mb-1">Follow-up Review Date</label>
                  <input 
                    type="date" 
                    value={newConsultationForm.followUpDate} 
                    onChange={(e) => setNewConsultationForm({ ...newConsultationForm, followUpDate: e.target.value })} 
                    className="w-full p-3 rounded-xl border border-[#EDE9FE]" 
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#4a4145] uppercase mb-1">Chief Complaint & Symptoms</label>
                <input 
                  type="text" 
                  value={newConsultationForm.chiefComplaint} 
                  onChange={(e) => setNewConsultationForm({ ...newConsultationForm, chiefComplaint: e.target.value })} 
                  placeholder="e.g., Fatigue during luteal phase, cramps"
                  className="w-full p-3 rounded-xl border border-[#EDE9FE]" 
                  required 
                />
              </div>

              <div>
                <label className="block font-bold text-[#4a4145] uppercase mb-1">Clinical Diagnosis & Findings</label>
                <input 
                  type="text" 
                  value={newConsultationForm.diagnosis} 
                  onChange={(e) => setNewConsultationForm({ ...newConsultationForm, diagnosis: e.target.value })} 
                  placeholder="e.g., Phase 3 Luteal Dysphoria with Microcytic Anemia"
                  className="w-full p-3 rounded-xl border border-[#EDE9FE]" 
                  required 
                />
              </div>

              <div>
                <label className="block font-bold text-[#4a4145] uppercase mb-1">Lifestyle & Dietary Guidance</label>
                <textarea 
                  value={newConsultationForm.advice} 
                  onChange={(e) => setNewConsultationForm({ ...newConsultationForm, advice: e.target.value })} 
                  placeholder="e.g., 2.5L daily hydration, restorative yoga, iron-rich meals"
                  rows={2}
                  className="w-full p-3 rounded-xl border border-[#EDE9FE]" 
                />
              </div>

              {/* Dynamic Medication Rows */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#7C3AED] uppercase tracking-wider text-[11px]">Medications (Rx)</span>
                  <button 
                    type="button" 
                    onClick={handleAddMedicationRow} 
                    className="text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Drug Row
                  </button>
                </div>

                {newConsultationForm.medications.map((med, idx) => (
                  <div key={med.id} className="p-3 bg-[#FAF8FC] rounded-2xl border border-[#EDE9FE] grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-4">
                      <input 
                        type="text" 
                        value={med.name} 
                        onChange={(e) => handleMedicationChange(med.id, 'name', e.target.value)} 
                        placeholder="Medicine Name (e.g. Iron)"
                        className="w-full p-2 bg-white rounded-lg border border-[#EDE9FE] text-xs" 
                        required 
                      />
                    </div>
                    <div className="col-span-2">
                      <input 
                        type="text" 
                        value={med.dosage} 
                        onChange={(e) => handleMedicationChange(med.id, 'dosage', e.target.value)} 
                        placeholder="Dosage (e.g. 500mg)"
                        className="w-full p-2 bg-white rounded-lg border border-[#EDE9FE] text-xs" 
                        required 
                      />
                    </div>
                    <div className="col-span-3">
                      <select 
                        value={med.frequency} 
                        onChange={(e) => handleMedicationChange(med.id, 'frequency', e.target.value)} 
                        className="w-full p-2 bg-white rounded-lg border border-[#EDE9FE] text-xs"
                      >
                        <option value="Once Daily">Once Daily</option>
                        <option value="Twice Daily">Twice Daily</option>
                        <option value="Thrice Daily">Thrice Daily</option>
                        <option value="Once at Night">Once at Night</option>
                        <option value="As Needed">As Needed (SOS)</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <input 
                        type="text" 
                        value={med.duration} 
                        onChange={(e) => handleMedicationChange(med.id, 'duration', e.target.value)} 
                        placeholder="14 Days"
                        className="w-full p-2 bg-white rounded-lg border border-[#EDE9FE] text-xs" 
                      />
                    </div>
                    <div className="col-span-1 flex justify-end">
                      {newConsultationForm.medications.length > 1 && (
                        <button type="button" onClick={() => handleRemoveMedicationRow(med.id)} className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#EDE9FE]">
                <button type="submit" className="flex-1 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-bold shadow-md">
                  Save & Issue Digital Prescription
                </button>
                <button type="button" onClick={() => setShowAddConsultationModal(false)} className="px-5 py-3 border border-[#EDE9FE] rounded-xl font-bold text-[#7a6f75]">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: PRINTABLE OFFICIAL DIGITAL PRESCRIPTION --- */}
      {viewingPrescriptionModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 border border-[#EDE9FE] shadow-2xl space-y-6">
            
            {/* Prescription Header */}
            <div className="border-b-2 border-[#7C3AED] pb-4 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#7C3AED]">FemSphere Clinical Health</h2>
                <p className="text-xs text-[#7a6f75]">Digital Health Twin Care & Gynecology Practice</p>
              </div>
              <div className="text-right text-xs">
                <p className="font-bold text-[#3a3135]">{profile.name}</p>
                <p className="text-[#7a6f75]">{profile.spec}</p>
                <p className="font-mono text-[#7C3AED]">{profile.license}</p>
              </div>
            </div>

            {/* Patient & Date Meta */}
            <div className="bg-[#FAF8FC] p-4 rounded-2xl border border-[#EDE9FE] grid grid-cols-2 text-xs">
              <div>
                <p><span className="font-bold text-[#7a6f75]">Patient:</span> <span className="font-bold text-[#3a3135]">{viewingPrescriptionModal.patient}</span></p>
                <p><span className="font-bold text-[#7a6f75]">Chief Complaint:</span> {viewingPrescriptionModal.chiefComplaint}</p>
              </div>
              <div className="text-right">
                <p><span className="font-bold text-[#7a6f75]">Date:</span> {viewingPrescriptionModal.date}</p>
                <p><span className="font-bold text-[#7a6f75]">Rx No:</span> <span className="font-mono">{viewingPrescriptionModal.id}</span></p>
              </div>
            </div>

            {/* Diagnosis */}
            <div className="text-xs space-y-1">
              <span className="font-bold text-[#7C3AED] uppercase tracking-wider text-[10px]">Clinical Diagnosis</span>
              <p className="font-bold text-sm text-[#3a3135]">{viewingPrescriptionModal.diagnosis}</p>
            </div>

            {/* Rx Medication Table */}
            <div className="space-y-2">
              <span className="font-serif font-bold text-lg text-[#7C3AED] block">Rx (Medication Schedule)</span>
              <div className="border border-[#EDE9FE] rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs font-inter">
                  <thead className="bg-[#FAF8FC] border-b border-[#EDE9FE] text-[#7a6f75] uppercase text-[10px] font-bold">
                    <tr>
                      <th className="p-3">Medication</th>
                      <th className="p-3">Dosage</th>
                      <th className="p-3">Frequency</th>
                      <th className="p-3">Duration</th>
                      <th className="p-3">Instructions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDE9FE]">
                    {viewingPrescriptionModal.medications.map((med, idx) => (
                      <tr key={idx}>
                        <td className="p-3 font-bold text-[#3a3135]">{med.name}</td>
                        <td className="p-3 font-mono">{med.dosage}</td>
                        <td className="p-3">{med.frequency}</td>
                        <td className="p-3">{med.duration}</td>
                        <td className="p-3 font-medium text-[#7C3AED]">{med.instructions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Advice */}
            <div className="p-4 bg-[#FAF8FC] rounded-2xl border border-[#EDE9FE] text-xs space-y-1">
              <span className="font-bold text-[#14B8A6] uppercase text-[10px]">Lifestyle & Dietary Guidance</span>
              <p className="text-[#3a3135]">{viewingPrescriptionModal.advice}</p>
              <p className="pt-2 text-[#7a6f75]"><span className="font-bold">Next Follow-up Review:</span> {viewingPrescriptionModal.followUpDate}</p>
            </div>

            {/* Doctor Signature Seal */}
            <div className="flex items-center justify-between pt-4 border-t border-[#EDE9FE] text-xs">
              <div className="text-[#7a6f75]">
                <p>Digitally signed & authenticated via FemSphere Health Twin Protocol</p>
              </div>
              <div className="text-right">
                <div className="font-serif italic text-base text-[#7C3AED] font-bold">{profile.name}</div>
                <p className="text-[10px] text-[#7a6f75]">Authorized Medical Practitioner</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => window.print()} 
                className="flex-1 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print Official Prescription
              </button>
              <button 
                onClick={() => setViewingPrescriptionModal(null)} 
                className="px-6 py-3 border border-[#EDE9FE] rounded-xl text-xs font-bold text-[#7a6f75]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: VIRTUAL TELEHEALTH CONSULTATION ROOM --- */}
      {activeTelehealthSession && (
        <div className="fixed inset-0 bg-slate-950 flex flex-col z-50 font-inter text-white">
          
          {/* Top Bar */}
          <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <h3 className="font-bold text-sm">Telehealth Consultation: {activeTelehealthSession.patient}</h3>
                <p className="text-xs text-slate-400">Duration: {formatCallTime(telehealthCallDuration)} • Encrypted Peer-to-Peer Stream</p>
              </div>
            </div>
            
            <button 
              onClick={() => setActiveTelehealthSession(null)} 
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <PhoneOff className="w-4 h-4" /> End Call
            </button>
          </div>

          {/* Main Video & Live Notepad Split */}
          <div className="flex-1 grid md:grid-cols-3 gap-4 p-4 overflow-hidden">
            
            {/* Video Feeds (2/3 col) */}
            <div className="md:col-span-2 relative bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 flex items-center justify-center">
              {/* Patient Video Simulation */}
              <div className="text-center space-y-3">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl font-bold mx-auto">
                  {activeTelehealthSession.patient.charAt(0)}
                </div>
                <h4 className="font-bold text-lg">{activeTelehealthSession.patient}</h4>
                <p className="text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1">
                  <Activity className="w-3.5 h-3.5" /> Live Health Twin Stream Connected
                </p>
              </div>

              {/* Doctor Mini Camera View (Bottom Right) */}
              <div className="absolute bottom-4 right-4 w-40 h-28 bg-slate-800 rounded-2xl border-2 border-purple-500 overflow-hidden flex items-center justify-center shadow-lg">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold mx-auto">
                    Dr
                  </div>
                  <span className="text-[10px] text-slate-300 block mt-1">You (Dr. Jenkins)</span>
                </div>
              </div>

              {/* Controls Floating Bar */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-800/80 backdrop-blur-md px-4 py-2.5 rounded-full border border-slate-700">
                <button 
                  onClick={() => setIsMicOn(!isMicOn)} 
                  className={`p-2.5 rounded-full ${isMicOn ? 'bg-slate-700 text-white' : 'bg-rose-600 text-white'}`}
                  title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
                >
                  {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => setIsVideoOn(!isVideoOn)} 
                  className={`p-2.5 rounded-full ${isVideoOn ? 'bg-slate-700 text-white' : 'bg-rose-600 text-white'}`}
                  title={isVideoOn ? 'Stop Camera' : 'Start Camera'}
                >
                  {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Live Clinical Notepad (1/3 col) */}
            <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 flex flex-col justify-between space-y-4">
              <div className="space-y-3 flex-1 flex flex-col">
                <h4 className="font-bold text-sm text-purple-400 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Live Clinical Observation Notes
                </h4>
                <textarea 
                  value={telehealthLiveNotes}
                  onChange={(e) => setTelehealthLiveNotes(e.target.value)}
                  placeholder="Record patient symptoms, clinical observations, and diagnosis during the live teleconsultation session..."
                  className="flex-1 w-full p-3 bg-slate-800 border border-slate-700 rounded-2xl text-xs text-white placeholder-slate-500 outline-none resize-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-2">
                <button 
                  onClick={() => {
                    if (telehealthLiveNotes.trim()) {
                      setNewConsultationForm(prev => ({
                        ...prev,
                        patient: activeTelehealthSession.patient,
                        patientId: activeTelehealthSession.patientId,
                        chiefComplaint: activeTelehealthSession.reason,
                        diagnosis: telehealthLiveNotes.slice(0, 80),
                        advice: telehealthLiveNotes
                      }));
                      setActiveTelehealthSession(null);
                      setShowAddConsultationModal(true);
                    } else {
                      alert('Please enter clinical notes before generating prescription.');
                    }
                  }} 
                  className="w-full py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Save & Issue Prescription (Rx)
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* --- MODAL: BOOK APPOINTMENT --- */}
      {showBookAppointmentModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 border border-[#EDE9FE] shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-3">
              <h3 className="font-bold text-lg text-[#3a3135]">Schedule Patient Appointment</h3>
              <button onClick={() => setShowBookAppointmentModal(false)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#4a4145] uppercase mb-1">Select Patient</label>
                <select 
                  value={newAppointmentForm.patient}
                  onChange={(e) => {
                    const sel = patients.find(p => p.name === e.target.value);
                    setNewAppointmentForm({ ...newAppointmentForm, patient: e.target.value, patientId: sel ? sel.id : 'PAT-101' });
                  }}
                  className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-white font-bold"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.name}>{p.name} ({p.id})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#4a4145] uppercase mb-1">Date</label>
                  <input 
                    type="date" 
                    value={newAppointmentForm.date} 
                    onChange={(e) => setNewAppointmentForm({ ...newAppointmentForm, date: e.target.value })} 
                    className="w-full p-3 rounded-xl border border-[#EDE9FE]" 
                    required 
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#4a4145] uppercase mb-1">Time Slot</label>
                  <select 
                    value={newAppointmentForm.time} 
                    onChange={(e) => setNewAppointmentForm({ ...newAppointmentForm, time: e.target.value })} 
                    className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-white font-bold"
                  >
                    <option value="09:30 AM">09:30 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:30 PM">03:30 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#4a4145] uppercase mb-1">Consultation Mode</label>
                <select 
                  value={newAppointmentForm.type} 
                  onChange={(e) => setNewAppointmentForm({ ...newAppointmentForm, type: e.target.value as any })} 
                  className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-white font-bold text-[#7C3AED]"
                >
                  <option value="Virtual Telehealth">Virtual Telehealth (Video Call)</option>
                  <option value="In-Clinic">In-Clinic Consultation</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#4a4145] uppercase mb-1">Reason for Visit</label>
                <input 
                  type="text" 
                  value={newAppointmentForm.reason} 
                  onChange={(e) => setNewAppointmentForm({ ...newAppointmentForm, reason: e.target.value })} 
                  placeholder="e.g. Hormonal Review Follow-up"
                  className="w-full p-3 rounded-xl border border-[#EDE9FE]" 
                  required 
                />
              </div>

              <div className="flex gap-2 pt-3 border-t border-[#EDE9FE]">
                <button type="submit" className="flex-1 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-bold">
                  Confirm Schedule
                </button>
                <button type="button" onClick={() => setShowBookAppointmentModal(false)} className="px-4 py-3 border border-[#EDE9FE] rounded-xl font-bold text-[#7a6f75]">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: CHANGE PASSWORD --- */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-[#EDE9FE] shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#3a3135]">Update Security Password</h3>
              <button onClick={() => setShowPasswordModal(false)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>

            {passwordMsg && (
              <div className="p-2.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl">
                {passwordMsg}
              </div>
            )}

            <form onSubmit={(e) => {
              e.preventDefault();
              setPasswordMsg('Password changed successfully.');
              setTimeout(() => {
                setShowPasswordModal(false);
                setPasswordMsg(null);
                setOldPassword('');
                setNewPassword('');
              }, 1500);
            }} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#4a4145] uppercase mb-1">Current Password</label>
                <input 
                  type="password" 
                  value={oldPassword} 
                  onChange={(e) => setOldPassword(e.target.value)} 
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE]" 
                  required 
                />
              </div>
              <div>
                <label className="block font-bold text-[#4a4145] uppercase mb-1">New Password</label>
                <input 
                  type="password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE]" 
                  required 
                />
              </div>
              <button type="submit" className="w-full py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-bold">
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
