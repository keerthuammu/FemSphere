import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, Sparkles, Heart, Bell, Calendar, FileText, 
  CheckCircle2, AlertCircle, Syringe, Clock, User, LogOut, Search, Plus, Trash2, Edit, Upload, Download, X, ChevronDown, Printer, FileCheck, Stethoscope,
  Droplet, Moon, Flame, Footprints, Activity, Utensils, Smile, Watch, Bluetooth, Wifi, RefreshCw, Cpu, Zap, Battery
} from 'lucide-react';

export default function CaregiverDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Caregiver Profile
  const [profile, setProfile] = useState({
    name: 'Marcus Vance',
    email: 'marcus.v@caregiver.org',
    relationship: 'Parent / Primary Caregiver',
    contact: '+1 (555) 382-9011',
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Bluetooth Smartwatch Connectivity State (For Dependents)
  const [showBluetoothModal, setShowBluetoothModal] = useState(false);
  const [bluetoothConnected, setBluetoothConnected] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [foundDevices, setFoundDevices] = useState<Array<{ name: string; type: string; rssi: number; battery: number }>>([]);
  const [smartwatchVitals, setSmartwatchVitals] = useState({
    heartRate: 78,
    spO2: 98,
    bodyTemp: 36.6,
    steps: 6420,
    calories: 310,
    battery: 92,
    lastSynced: 'Just now'
  });

  // 1. Manage Dependents State & CRUD (Name, DOB, Relationship, Blood Group)
  const [dependents, setDependents] = useState([
    { id: 'DEP-01', name: 'Sophia Rostova', dob: '2020-04-10', relation: 'Child (Daughter)', bloodGroup: 'A Positive (A+)' },
    { id: 'DEP-02', name: 'Maria Rostova', dob: '1958-09-18', relation: 'Elder Parent (Mother)', bloodGroup: 'O Positive (O+)' },
  ]);
  const [showAddDepModal, setShowAddDepModal] = useState(false);
  const [newDep, setNewDep] = useState({ name: '', dob: '2020-01-01', relation: 'Child (Daughter)', bloodGroup: 'A Positive (A+)' });

  // 2. Medical Records State & CRUD
  const [records, setRecords] = useState([
    { id: 'REC-CG-01', name: 'Sophia_Vaccination_Certificate.pdf', dependent: 'Sophia Rostova', category: 'Vaccination Record', date: '2026-06-10', size: '1.2 MB' },
    { id: 'REC-CG-02', name: 'Maria_Blood_Panel_Q2.pdf', dependent: 'Maria Rostova', category: 'Lab Diagnostics', date: '2026-05-18', size: '2.4 MB' },
    { id: 'REC-CG-03', name: 'Sophia_Pediatric_Growth_Chart.pdf', dependent: 'Sophia Rostova', category: 'Pediatric Report', date: '2026-04-12', size: '980 KB' }
  ]);
  const [showAddRecordModal, setShowAddRecordModal] = useState(false);
  const [newRecordForm, setNewRecordForm] = useState({ dependent: 'Sophia Rostova', name: '', category: 'Lab Diagnostics' });

  // 3. Vaccination Records State & CRUD (Vaccine Name, Date, Next Due Date)
  const [vaccinations, setVaccinations] = useState([
    { id: 'VAC-01', dependent: 'Sophia Rostova', vaccineName: 'MMR Booster', date: '2026-02-10', nextDueDate: '2026-08-15' },
    { id: 'VAC-02', dependent: 'Sophia Rostova', vaccineName: 'DTaP Dose 4', date: '2025-11-20', nextDueDate: '2026-09-01' },
  ]);
  const [showAddVacModal, setShowAddVacModal] = useState(false);
  const [newVac, setNewVac] = useState({ dependent: 'Sophia Rostova', vaccineName: '', date: '2026-07-30', nextDueDate: '2026-09-01' });

  // 4. Medication Reminders State & CRUD (Medicine Name, Dosage, Time)
  const [medications, setMedications] = useState([
    { id: 'MED-01', dependent: 'Maria Rostova', medicineName: 'Calcium Carbonate', dosage: '500mg', time: '09:00 AM' },
    { id: 'MED-02', dependent: 'Maria Rostova', medicineName: 'BP Regulator', dosage: '10mg', time: '08:00 PM' },
  ]);
  const [showAddMedModal, setShowAddMedModal] = useState(false);
  const [newMed, setNewMed] = useState({ dependent: 'Maria Rostova', medicineName: '', dosage: '', time: '09:00 AM' });

  // 5. Appointments State & CRUD
  const [appointments, setAppointments] = useState([
    { id: 'APT-CG-01', dependent: 'Sophia Rostova', doctor: 'Dr. Sarah Jenkins (Pediatrics)', date: '2026-08-15', time: '11:30 AM', reason: 'Annual Booster Checkup', status: 'Scheduled' },
    { id: 'APT-CG-02', dependent: 'Maria Rostova', doctor: 'Dr. Alan Vance (Geriatrics)', date: '2026-08-20', time: '02:00 PM', reason: 'Hypertension Review', status: 'Scheduled' },
    { id: 'APT-CG-03', dependent: 'Sophia Rostova', doctor: 'Dr. Emily Watson (Dermatology)', date: '2026-06-10', time: '10:00 AM', reason: 'Skin Allergy Followup', status: 'Completed' }
  ]);
  const [showAddAptModal, setShowAddAptModal] = useState(false);
  const [newAptForm, setNewAptForm] = useState({ dependent: 'Sophia Rostova', doctor: 'Dr. Sarah Jenkins (Pediatrics)', date: '2026-08-25', time: '10:00 AM', reason: '' });

  // 6. Health Reports Selected Dependent
  const [selectedReportDep, setSelectedReportDep] = useState('Sophia Rostova');

  // 7. Caregiver Dependent Health & Symptom Tracker State
  const [dependentTrackerLogs, setDependentTrackerLogs] = useState([
    {
      id: 'LOG-DEP-01',
      dependent: 'Sophia Rostova',
      date: '2026-08-06',
      weight: '16.5',
      water: '1.2',
      sleep: '9.5',
      exercise: '45',
      steps: '6200',
      bloodPressure: '105/70',
      heartRate: '88',
      foodLogged: 'Oatmeal with berries, Grilled Chicken Rice, Milk',
      symptoms: ['Mild Fever', 'Pediatric Rash'],
      symptomSeverity: 'Mild',
      notes: 'Child felt slightly warm in evening after booster vaccine.'
    },
    {
      id: 'LOG-DEP-02',
      dependent: 'Maria Rostova',
      date: '2026-08-05',
      weight: '64.0',
      water: '2.0',
      sleep: '7.5',
      exercise: '25',
      steps: '4100',
      bloodPressure: '128/82',
      heartRate: '72',
      foodLogged: 'Vegetable Soup, Whole Wheat Toast, Herbal Tea',
      symptoms: ['Joint Pain'],
      symptomSeverity: 'Moderate',
      notes: 'Reported mild knee stiffness during morning walk.'
    }
  ]);

  const [trackerInput, setTrackerInput] = useState({
    dependent: 'Sophia Rostova',
    date: new Date().toISOString().split('T')[0],
    weight: '16.5',
    water: '1.5',
    sleep: '9.0',
    exercise: '30',
    steps: '5000',
    bloodPressure: '110/72',
    heartRate: '82',
    foodLogged: '',
    symptoms: [] as string[],
    symptomSeverity: 'Mild',
    notes: ''
  });

  const [trackerSuccessMsg, setTrackerSuccessMsg] = useState(false);

  const availableSymptomsList = [
    'Fever', 'Fatigue', 'Cough', 'Headache', 'Mild Nausea', 
    'Joint Pain', 'Pediatric Rash', 'Loss of Appetite', 'Chills', 'Dizziness'
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  // Dependents Actions
  const handleAddDependent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDep.name) return;
    setDependents([...dependents, { ...newDep, id: `DEP-0${dependents.length + 1}` }]);
    setNewDep({ name: '', dob: '2020-01-01', relation: 'Parent', bloodGroup: 'A Positive (A+)' });
    setShowAddDepModal(false);
  };
  const deleteDependent = (id: string) => {
    setDependents(dependents.filter(d => d.id !== id));
  };

  // Vaccination Actions
  const handleAddVaccination = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVac.vaccineName) return;
    setVaccinations([...vaccinations, { ...newVac, id: `VAC-0${vaccinations.length + 1}` }]);
    setNewVac({ dependent: 'Sophia Rostova', vaccineName: '', date: '2026-07-30', nextDueDate: '2026-09-01' });
    setShowAddVacModal(false);
  };
  const deleteVaccination = (id: string) => {
    setVaccinations(vaccinations.filter(v => v.id !== id));
  };

  // Medication Actions
  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMed.medicineName) return;
    setMedications([...medications, { ...newMed, id: `MED-0${medications.length + 1}` }]);
    setNewMed({ dependent: 'Maria Rostova', medicineName: '', dosage: '', time: '09:00 AM' });
    setShowAddMedModal(false);
  };
  const deleteMedication = (id: string) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  // Medical Records Actions
  const handleUploadRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecordForm.name) return;
    const added = {
      id: `REC-CG-0${records.length + 1}`,
      name: newRecordForm.name.endsWith('.pdf') ? newRecordForm.name : `${newRecordForm.name}.pdf`,
      dependent: newRecordForm.dependent,
      category: newRecordForm.category,
      date: new Date().toISOString().split('T')[0],
      size: '1.5 MB'
    };
    setRecords([added, ...records]);
    setNewRecordForm({ dependent: 'Sophia Rostova', name: '', category: 'Lab Diagnostics' });
    setShowAddRecordModal(false);
  };
  const deleteRecord = (id: string) => {
    setRecords(records.filter(r => r.id !== id));
  };

  // Appointment Actions
  const handleBookApt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAptForm.date) return;
    const booked = {
      id: `APT-CG-0${appointments.length + 1}`,
      dependent: newAptForm.dependent,
      doctor: newAptForm.doctor,
      date: newAptForm.date,
      time: newAptForm.time,
      reason: newAptForm.reason || 'Routine Health Consultation',
      status: 'Scheduled'
    };
    setAppointments([booked, ...appointments]);
    setNewAptForm({ dependent: 'Sophia Rostova', doctor: 'Dr. Sarah Jenkins (Pediatrics)', date: '2026-08-25', time: '10:00 AM', reason: '' });
    setShowAddAptModal(false);
  };

  const cancelApt = (id: string) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'Cancelled' } : a));
  };

  // Bluetooth Handlers for Caregiver & Dependents
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
          setConnectedDevice(device.name || "Dependent's Smart Watch");
          setBluetoothConnected(true);
          setIsScanning(false);
          setShowBluetoothModal(false);
          return;
        }
      } catch (err) {
        console.log('Web Bluetooth prompt cancelled or fallback...', err);
      }
    }

    setTimeout(() => {
      setFoundDevices([
        { name: "Sophia's Apple Watch SE (BLE 5.3)", type: 'Kids Fitness Watch', rssi: -48, battery: 94 },
        { name: "Maria's Fitbit Sense 2", type: 'Elder Health Tracker', rssi: -62, battery: 88 },
        { name: "Garmin Venu 3 (ANT+/BLE)", type: 'Sports Watch', rssi: -74, battery: 91 },
      ]);
      setIsScanning(false);
    }, 1200);
  };

  const handlePairDevice = (deviceName: string) => {
    setConnectedDevice(deviceName);
    setBluetoothConnected(true);
    setShowBluetoothModal(false);

    // Auto fill dependent tracker form with live smartwatch readings
    setTrackerInput(prev => ({
      ...prev,
      heartRate: smartwatchVitals.heartRate.toString(),
      steps: smartwatchVitals.steps.toString(),
      exercise: '40',
      notes: prev.notes || `Live smartwatch vitals synced from ${deviceName}`
    }));
  };

  const handleDisconnectBluetooth = () => {
    setBluetoothConnected(false);
    setConnectedDevice(null);
  };

  const handleSyncWatchVitals = () => {
    const updatedHR = Math.floor(72 + Math.random() * 12);
    const updatedSteps = smartwatchVitals.steps + Math.floor(150 + Math.random() * 200);

    setSmartwatchVitals(prev => ({
      ...prev,
      heartRate: updatedHR,
      steps: updatedSteps,
      calories: Math.floor(updatedSteps * 0.045),
      lastSynced: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));

    setTrackerInput(prev => ({
      ...prev,
      heartRate: updatedHR.toString(),
      steps: updatedSteps.toString(),
    }));
  };

  // Health & Symptom Tracker Actions
  const handleSaveDependentHealthLog = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog = {
      id: `LOG-DEP-${Date.now()}`,
      ...trackerInput
    };
    setDependentTrackerLogs([newLog, ...dependentTrackerLogs]);
    setTrackerSuccessMsg(true);
    setTimeout(() => setTrackerSuccessMsg(false), 3000);
  };

  const toggleSymptom = (sym: string) => {
    setTrackerInput(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(sym)
        ? prev.symptoms.filter(s => s !== sym)
        : [...prev.symptoms, sym]
    }));
  };

  const deleteDependentTrackerLog = (id: string) => {
    setDependentTrackerLogs(dependentTrackerLogs.filter(l => l.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#fbf9f6] flex font-sans text-[#3a3135]">
      
      {/* Sidebar - Caregiver */}
      <aside className="w-72 bg-[#F4E0D1] border-r border-[#E5CDBC] hidden lg:flex flex-col flex-shrink-0 sticky top-0 h-screen font-inter">
        <div className="p-6 border-b border-[#E5CDBC] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <h1 className="font-serif text-3xl font-bold text-[#7C3AED] tracking-tight">FemSphere</h1>
            <Sparkles className="w-5 h-5 text-[#14B8A6]" />
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-hide font-inter">
          <p className="text-xs uppercase tracking-widest text-[#8C756B] font-bold px-3 py-2">Features</p>
          
          <button onClick={() => setActiveTab('Overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base transition-all ${activeTab === 'Overview' ? 'bg-white text-[#7C3AED] shadow-sm border border-[#E5CDBC]' : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'}`}>
            <Users className="w-5 h-5 text-[#7C3AED]" /> Dashboard Overview
          </button>

          <button onClick={() => setActiveTab('Manage Dependents')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base transition-all ${activeTab === 'Manage Dependents' ? 'bg-white text-[#7C3AED] shadow-sm border border-[#E5CDBC]' : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'}`}>
            <Users className="w-5 h-5" /> Manage Dependents
          </button>

          <button onClick={() => setActiveTab('Medical Records')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base transition-all ${activeTab === 'Medical Records' ? 'bg-white text-[#7C3AED] shadow-sm border border-[#E5CDBC]' : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'}`}>
            <FileText className="w-5 h-5" /> Medical Records
          </button>

          <button onClick={() => setActiveTab('Vaccination')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base transition-all ${activeTab === 'Vaccination' ? 'bg-white text-[#7C3AED] shadow-sm border border-[#E5CDBC]' : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'}`}>
            <Syringe className="w-5 h-5 text-[#14B8A6]" /> Vaccination Records
          </button>

          <button onClick={() => setActiveTab('Medication Reminder')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base transition-all ${activeTab === 'Medication Reminder' ? 'bg-white text-[#7C3AED] shadow-sm border border-[#E5CDBC]' : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'}`}>
            <Bell className="w-5 h-5 text-[#F472B6]" /> Medication Reminder
          </button>

          <button onClick={() => setActiveTab('Appointments')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base transition-all ${activeTab === 'Appointments' ? 'bg-white text-[#7C3AED] shadow-sm border border-[#E5CDBC]' : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'}`}>
            <Calendar className="w-5 h-5" /> Appointments
          </button>

          <button onClick={() => setActiveTab('Health Tracker')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base transition-all ${activeTab === 'Health Tracker' ? 'bg-white text-[#7C3AED] shadow-sm border border-[#E5CDBC]' : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'}`}>
            <Heart className="w-5 h-5 text-[#F472B6]" /> Health Tracker
          </button>

          {/* Connect Watch (Bluetooth) */}
          <button 
            onClick={() => {
              setShowBluetoothModal(true);
              if (!bluetoothConnected && foundDevices.length === 0) {
                handleScanBluetoothDevices();
              }
            }} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base transition-all ${
              bluetoothConnected 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs' 
                : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'
            }`}
          >
            <Watch className={`w-5 h-5 ${bluetoothConnected ? 'text-emerald-600' : 'text-[#7C3AED]'}`} /> Connect Watch
          </button>

          <button onClick={() => setActiveTab('Health Reports')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base transition-all ${activeTab === 'Health Reports' ? 'bg-white text-[#7C3AED] shadow-sm border border-[#E5CDBC]' : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'}`}>
            <FileText className="w-5 h-5" /> Health Reports
          </button>

        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto font-inter bg-[#FAF7F4]">
        
        {/* Header */}
        <header className="bg-[#F4E0D1]/90 backdrop-blur-md border-b border-[#E5CDBC] p-5 md:px-8 flex items-center justify-between sticky top-0 z-20 font-inter">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-[#3a3135] text-lg">Caregiver Workspace ({profile.name})</h2>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Profile Photo Avatar Dropdown Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)} 
                className="p-1 rounded-full border border-[#EDE9FE] bg-[#FAF8FC] hover:bg-white hover:scale-105 transition-all cursor-pointer shadow-xs focus:ring-2 focus:ring-[#7C3AED]"
                title="Profile Menu"
              >
                {/* Profile Photo Avatar Circle */}
                <div className="w-10 h-10 rounded-full bg-[#7C3AED] text-white flex items-center justify-center font-bold text-base shadow-inner relative">
                  {profile.name ? profile.name.charAt(0) : 'M'}
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                </div>
              </button>

              {/* Popover Dropdown Menu */}
              {showProfileDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setShowProfileDropdown(false)}
                  ></div>

                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#EDE9FE] shadow-xl z-40 py-2 font-inter animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2.5 border-b border-[#EDE9FE] bg-[#FAF8FC]">
                      <p className="text-xs font-bold text-[#3a3135] truncate">{profile.name}</p>
                      <p className="text-[10px] text-[#7a6f75] truncate">{profile.email}</p>
                    </div>

                    <button 
                      onClick={() => {
                        setActiveTab('My Profile');
                        setShowProfileDropdown(false);
                      }} 
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-[#3a3135] hover:bg-[#F5F3FF] hover:text-[#7C3AED] transition-colors"
                    >
                      <User className="w-4 h-4 text-[#7C3AED]" /> My Profile
                    </button>

                    <div className="my-1 border-t border-[#EDE9FE]"></div>

                    <button 
                      onClick={() => {
                        setShowProfileDropdown(false);
                        handleLogout();
                      }} 
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-red-500" /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">

          {/* 3 Caregiver Displays */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            
            <div className="bg-white p-6 rounded-3xl border border-[#EDE9FE] shadow-sm flex flex-col justify-between">
              <span className="text-xs font-bold text-[#7a6f75] uppercase">Total Dependents</span>
              <h3 className="text-3xl font-serif font-bold text-[#3a3135] mt-2">{dependents.length}</h3>
              <p className="text-xs text-teal-600 font-bold mt-1">Care profiles linked</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#EDE9FE] shadow-sm flex flex-col justify-between">
              <span className="text-xs font-bold text-[#7a6f75] uppercase">Upcoming Vaccinations</span>
              <h3 className="text-3xl font-serif font-bold text-[#3a3135] mt-2">{vaccinations.length}</h3>
              <p className="text-xs text-purple-600 font-bold mt-1">Pending booster doses</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#EDE9FE] shadow-sm flex flex-col justify-between">
              <span className="text-xs font-bold text-[#7a6f75] uppercase">Medication Reminders</span>
              <h3 className="text-3xl font-serif font-bold text-[#3a3135] mt-2">{medications.length} Active</h3>
              <p className="text-xs text-pink-600 font-bold mt-1">Next: 09:00 AM (Calcium)</p>
            </div>

          </div>

          {/* TAB 1: MANAGE DEPENDENTS */}
          {activeTab === 'Manage Dependents' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-2xl text-[#3a3135]">Manage Dependents</h3>
                  <p className="text-xs text-[#7a6f75] mt-1">Add, edit, or remove linked care profiles.</p>
                </div>
                <button onClick={() => setShowAddDepModal(true)} className="px-4 py-2 bg-[#7C3AED] text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Add Dependent
                </button>
              </div>

              <div className="space-y-3">
                {dependents.map(d => (
                  <div key={d.id} className="p-4 rounded-2xl border border-[#EDE9FE] bg-[#faf9fc] flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-[#3a3135] text-sm">{d.name}</p>
                      <p className="text-[#7a6f75]">DOB: {d.dob} • Relationship: {d.relation} • Blood Group: {d.bloodGroup}</p>
                    </div>
                    <button onClick={() => deleteDependent(d.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: VACCINATION RECORDS */}
          {activeTab === 'Vaccination' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl text-[#3a3135]">Vaccination Records</h3>
                <button onClick={() => setShowAddVacModal(true)} className="px-4 py-2 bg-[#14B8A6] text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Add Vaccination
                </button>
              </div>

              <div className="space-y-3">
                {vaccinations.map(v => (
                  <div key={v.id} className="p-4 rounded-2xl border border-[#EDE9FE] bg-[#faf9fc] flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-[#3a3135] text-sm">{v.vaccineName} ({v.dependent})</p>
                      <p className="text-[#7a6f75]">Administered: {v.date} • Next Due Date: <span className="font-bold text-[#7C3AED]">{v.nextDueDate}</span></p>
                    </div>
                    <button onClick={() => deleteVaccination(v.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MEDICATION REMINDERS */}
          {activeTab === 'Medication Reminder' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl text-[#3a3135]">Medication Reminders</h3>
                <button onClick={() => setShowAddMedModal(true)} className="px-4 py-2 bg-[#F472B6] text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Add Medicine
                </button>
              </div>

              <div className="space-y-3">
                {medications.map(m => (
                  <div key={m.id} className="p-4 rounded-2xl border border-[#EDE9FE] bg-[#faf9fc] flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-[#3a3135] text-sm">{m.medicineName} - {m.dosage} ({m.dependent})</p>
                      <p className="text-[#7a6f75]">Scheduled Time: <span className="font-bold text-pink-600">{m.time}</span></p>
                    </div>
                    <button onClick={() => deleteMedication(m.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: MEDICAL RECORDS */}
          {activeTab === 'Medical Records' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-2xl text-[#3a3135]">Dependent Medical Records</h3>
                  <p className="text-xs text-[#7a6f75] mt-1">Vault of medical lab reports, diagnostic scans, and clinical documents for linked care profiles.</p>
                </div>
                <button 
                  onClick={() => setShowAddRecordModal(true)} 
                  className="px-4 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Upload className="w-4 h-4" /> Upload Document
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {records.map(r => (
                  <div key={r.id} className="p-5 rounded-2xl border border-[#EDE9FE] bg-[#FAF8FC] hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-[#7C3AED] font-bold text-[10px] uppercase">
                          {r.category}
                        </span>
                        <span className="text-[10px] text-[#7a6f75] font-semibold">{r.size || '1.2 MB'}</span>
                      </div>
                      <h4 className="font-bold text-[#3a3135] text-sm line-clamp-1">{r.name}</h4>
                      <p className="text-xs text-[#7a6f75]">Dependent: <b className="text-[#3a3135]">{r.dependent}</b></p>
                      <p className="text-[11px] text-[#7a6f75]">Uploaded on {r.date}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#EDE9FE]">
                      <button 
                        onClick={() => alert(`Downloading ${r.name}...`)}
                        className="text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                      <button 
                        onClick={() => deleteRecord(r.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: APPOINTMENTS */}
          {activeTab === 'Appointments' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-2xl text-[#3a3135]">Caregiver Appointments</h3>
                  <p className="text-xs text-[#7a6f75] mt-1">Book and track doctor consultations for your dependents.</p>
                </div>
                <button 
                  onClick={() => setShowAddAptModal(true)} 
                  className="px-4 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" /> Book Appointment
                </button>
              </div>

              <div className="space-y-4">
                {appointments.map(apt => (
                  <div key={apt.id} className="p-5 rounded-2xl border border-[#EDE9FE] bg-[#FAF8FC] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#7C3AED] flex items-center justify-center font-bold shrink-0">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-[#3a3135] text-base">{apt.doctor}</h4>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            apt.status === 'Scheduled' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                          }`}>
                            {apt.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#7a6f75]">For Dependent: <b className="text-[#3a3135]">{apt.dependent}</b> • Reason: {apt.reason}</p>
                        <p className="text-xs font-bold text-[#7C3AED]">📅 {apt.date} at {apt.time}</p>
                      </div>
                    </div>

                    {apt.status === 'Scheduled' && (
                      <button 
                        onClick={() => cancelApt(apt.id)}
                        className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition-colors cursor-pointer self-start md:self-auto"
                      >
                        Cancel Appointment
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: HEALTH & SYMPTOM TRACKER */}
          {activeTab === 'Health Tracker' && (
            <div className="space-y-8">
              
              {/* SUCCESS TOAST ALERT */}
              {trackerSuccessMsg && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  Health & Symptom entry saved successfully for {trackerInput.dependent}!
                </div>
              )}

              {/* LOG ENTRY FORM CARD */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EDE9FE] pb-4">
                  <div>
                    <h3 className="font-serif text-2xl text-[#3a3135]">Dependent Health Tracker</h3>
                    <p className="text-xs text-[#7a6f75] mt-1">Manual & Watch Health Log Entry for care recipients.</p>
                  </div>

                  {/* Dependent Selector & Connect Watch Trigger */}
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowBluetoothModal(true);
                        if (!bluetoothConnected && foundDevices.length === 0) handleScanBluetoothDevices();
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        bluetoothConnected 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                          : 'bg-[#F5F3FF] text-[#7C3AED] border border-[#EDE9FE] hover:bg-purple-100'
                      }`}
                    >
                      <Watch className={`w-3.5 h-3.5 ${bluetoothConnected ? 'text-emerald-600 animate-pulse' : 'text-[#7C3AED]'}`} />
                      {bluetoothConnected ? `Watch Connected (${connectedDevice})` : 'Connect Watch'}
                    </button>

                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-[#7a6f75] uppercase">Dependent:</label>
                      <select 
                        value={trackerInput.dependent}
                        onChange={(e) => setTrackerInput({ ...trackerInput, dependent: e.target.value })}
                        className="p-2.5 rounded-xl border border-[#EDE9FE] bg-white font-bold text-xs text-[#3a3135] cursor-pointer"
                      >
                        {dependents.map(d => (
                          <option key={d.id} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* LIVE WATCH CONNECTED BANNER */}
                {bluetoothConnected && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-inter">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center border border-emerald-200 text-emerald-700 shrink-0">
                        <Watch className="w-5 h-5 text-emerald-600 animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs uppercase tracking-wider text-emerald-800">
                            Smartwatch Active: {connectedDevice}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                            LIVE READINGS SYNCED
                          </span>
                        </div>
                        <p className="text-xs text-emerald-700 font-medium mt-0.5">
                          Auto-filled metrics for {trackerInput.dependent}: <b>{smartwatchVitals.heartRate} bpm HR</b> • <b>{smartwatchVitals.steps} steps</b> • <b>{smartwatchVitals.calories} kcal</b> ({smartwatchVitals.battery}% Battery)
                        </p>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={handleSyncWatchVitals} 
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer shrink-0"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Re-sync Watch
                    </button>
                  </div>
                )}

                <form onSubmit={handleSaveDependentHealthLog} className="space-y-6">
                  
                  {/* 1. Core Health Vitals */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-xs text-[#3a3135] uppercase tracking-wider flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#7C3AED]" /> 1. Daily Health Vitals
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs">
                      <div className="p-3.5 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE] space-y-1">
                        <label className="block font-bold text-[#7a6f75] text-[10px] uppercase">Date</label>
                        <input 
                          type="date" 
                          value={trackerInput.date} 
                          onChange={(e) => setTrackerInput({ ...trackerInput, date: e.target.value })} 
                          className="w-full font-bold text-[#3a3135] bg-transparent focus:outline-none"
                          required 
                        />
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE] space-y-1">
                        <label className="block font-bold text-[#7a6f75] text-[10px] uppercase">Weight (kg)</label>
                        <input 
                          type="text" 
                          value={trackerInput.weight} 
                          onChange={(e) => setTrackerInput({ ...trackerInput, weight: e.target.value })} 
                          className="w-full font-bold text-[#3a3135] bg-transparent focus:outline-none" 
                          placeholder="e.g. 16.5"
                        />
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE] space-y-1">
                        <label className="block font-bold text-[#7a6f75] text-[10px] uppercase">Water Intake (L)</label>
                        <input 
                          type="text" 
                          value={trackerInput.water} 
                          onChange={(e) => setTrackerInput({ ...trackerInput, water: e.target.value })} 
                          className="w-full font-bold text-[#3a3135] bg-transparent focus:outline-none" 
                          placeholder="e.g. 1.5"
                        />
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE] space-y-1">
                        <label className="block font-bold text-[#7a6f75] text-[10px] uppercase">Sleep Hours (hrs)</label>
                        <input 
                          type="text" 
                          value={trackerInput.sleep} 
                          onChange={(e) => setTrackerInput({ ...trackerInput, sleep: e.target.value })} 
                          className="w-full font-bold text-[#3a3135] bg-transparent focus:outline-none" 
                          placeholder="e.g. 9.0"
                        />
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE] space-y-1">
                        <label className="block font-bold text-[#7a6f75] text-[10px] uppercase">Activity / Play (mins)</label>
                        <input 
                          type="text" 
                          value={trackerInput.exercise} 
                          onChange={(e) => setTrackerInput({ ...trackerInput, exercise: e.target.value })} 
                          className="w-full font-bold text-[#3a3135] bg-transparent focus:outline-none" 
                          placeholder="e.g. 30"
                        />
                      </div>

                      <div className={`p-3.5 rounded-2xl border space-y-1 ${bluetoothConnected ? 'bg-emerald-50/70 border-emerald-200' : 'bg-[#FAF8FC] border-[#EDE9FE]'}`}>
                        <div className="flex items-center justify-between">
                          <label className="block font-bold text-[#7a6f75] text-[10px] uppercase">Steps Count</label>
                          {bluetoothConnected && <span className="text-[9px] font-bold text-emerald-800 bg-emerald-200 px-1.5 py-0.5 rounded-md">Watch Synced</span>}
                        </div>
                        <input 
                          type="text" 
                          value={trackerInput.steps} 
                          onChange={(e) => setTrackerInput({ ...trackerInput, steps: e.target.value })} 
                          className="w-full font-bold text-[#3a3135] bg-transparent focus:outline-none" 
                          placeholder="e.g. 5000"
                        />
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE] space-y-1">
                        <label className="block font-bold text-[#7a6f75] text-[10px] uppercase">Blood Pressure (mmHg)</label>
                        <input 
                          type="text" 
                          value={trackerInput.bloodPressure} 
                          onChange={(e) => setTrackerInput({ ...trackerInput, bloodPressure: e.target.value })} 
                          className="w-full font-bold text-[#3a3135] bg-transparent focus:outline-none" 
                          placeholder="e.g. 110/72"
                        />
                      </div>

                      <div className={`p-3.5 rounded-2xl border space-y-1 ${bluetoothConnected ? 'bg-emerald-50/70 border-emerald-200' : 'bg-[#FAF8FC] border-[#EDE9FE]'}`}>
                        <div className="flex items-center justify-between">
                          <label className="block font-bold text-[#7a6f75] text-[10px] uppercase">Heart Rate (bpm)</label>
                          {bluetoothConnected && <span className="text-[9px] font-bold text-emerald-800 bg-emerald-200 px-1.5 py-0.5 rounded-md">Watch Synced</span>}
                        </div>
                        <input 
                          type="text" 
                          value={trackerInput.heartRate} 
                          onChange={(e) => setTrackerInput({ ...trackerInput, heartRate: e.target.value })} 
                          className="w-full font-bold text-[#3a3135] bg-transparent focus:outline-none" 
                          placeholder="e.g. 82"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Food & Nutrition Logging */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-xs text-[#3a3135] uppercase tracking-wider flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-[#14B8A6]" /> 2. Meals & Food Logged Today
                    </h4>
                    <input 
                      type="text" 
                      value={trackerInput.foodLogged} 
                      onChange={(e) => setTrackerInput({ ...trackerInput, foodLogged: e.target.value })} 
                      placeholder="e.g. Breakfast: Oatmeal & Fruit • Lunch: Rice & Lentils • Snacks: Apple slices"
                      className="w-full p-3.5 rounded-2xl border border-[#EDE9FE] bg-[#FAF8FC] text-xs font-medium focus:outline-none"
                    />
                  </div>

                  {/* 3. Symptoms & Severity Picker */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-xs text-[#3a3135] uppercase tracking-wider flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-[#F472B6]" /> 3. Observed Symptoms & Severity
                    </h4>

                    {/* Chips */}
                    <div className="flex flex-wrap gap-2">
                      {availableSymptomsList.map((sym) => {
                        const selected = trackerInput.symptoms.includes(sym);
                        return (
                          <button 
                            key={sym}
                            type="button"
                            onClick={() => toggleSymptom(sym)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                              selected 
                                ? 'bg-[#7C3AED] text-white border-[#7C3AED] shadow-xs' 
                                : 'bg-[#FAF8FC] text-[#4a4145] border-[#EDE9FE] hover:bg-purple-50'
                            }`}
                          >
                            {selected ? `✓ ${sym}` : `+ ${sym}`}
                          </button>
                        );
                      })}
                    </div>

                    {/* Severity Picker */}
                    <div className="flex items-center gap-4 text-xs pt-2">
                      <span className="font-bold text-[#7a6f75] uppercase text-[10px]">Symptom Severity:</span>
                      {['Mild', 'Moderate', 'Severe'].map((sev) => (
                        <label key={sev} className="flex items-center gap-1.5 cursor-pointer font-bold text-[#3a3135]">
                          <input 
                            type="radio" 
                            name="symptomSeverity" 
                            value={sev} 
                            checked={trackerInput.symptomSeverity === sev}
                            onChange={(e) => setTrackerInput({ ...trackerInput, symptomSeverity: e.target.value })}
                            className="accent-[#7C3AED]"
                          />
                          <span className={sev === 'Severe' ? 'text-red-600' : sev === 'Moderate' ? 'text-amber-600' : 'text-emerald-700'}>
                            {sev}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 4. Notes & Observations */}
                  <div className="space-y-2">
                    <label className="block font-bold text-xs text-[#3a3135] uppercase tracking-wider">4. Caregiver Notes & Observations</label>
                    <textarea 
                      value={trackerInput.notes}
                      onChange={(e) => setTrackerInput({ ...trackerInput, notes: e.target.value })}
                      placeholder="Add any specific observations (e.g. slept peacefully, complained of slight headache in afternoon)..."
                      rows={2}
                      className="w-full p-3.5 rounded-2xl border border-[#EDE9FE] bg-[#FAF8FC] text-xs font-medium focus:outline-none"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-2">
                    <button 
                      type="submit" 
                      className="px-6 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-2xl text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Heart className="w-4 h-4" /> Save Health & Symptom Log
                    </button>
                  </div>
                </form>
              </div>

              {/* LOGGED HEALTH HISTORY TABLE FOR DEPENDENTS */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-4">
                  <h3 className="font-serif text-xl text-[#3a3135]">Logged Health History for Dependents</h3>
                  <span className="text-xs font-bold text-[#7C3AED] bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                    {dependentTrackerLogs.length} Total Logs
                  </span>
                </div>

                <div className="space-y-4">
                  {dependentTrackerLogs.map((log) => (
                    <div key={log.id} className="p-5 rounded-2xl border border-[#EDE9FE] bg-[#FAF8FC] space-y-3 text-xs">
                      <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-[#3a3135]">{log.dependent}</span>
                          <span className="text-xs text-[#7a6f75]">({log.date})</span>
                        </div>
                        <button 
                          onClick={() => deleteDependentTrackerLog(log.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[#4a4145]">
                        <div><b>Weight:</b> {log.weight} kg</div>
                        <div><b>Water:</b> {log.water} L</div>
                        <div><b>Sleep:</b> {log.sleep} hrs</div>
                        <div><b>BP / HR:</b> {log.bloodPressure} ({log.heartRate} bpm)</div>
                      </div>

                      {log.foodLogged && (
                        <p className="text-[#64595e]"><b>Meals Logged:</b> {log.foodLogged}</p>
                      )}

                      {log.symptoms && log.symptoms.length > 0 && (
                        <div className="flex items-center gap-2">
                          <b className="text-[#3a3135]">Observed Symptoms:</b>
                          <div className="flex gap-1.5 flex-wrap">
                            {log.symptoms.map((s, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-800 font-bold text-[10px]">
                                {s}
                              </span>
                            ))}
                          </div>
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                            Severity: {log.symptomSeverity}
                          </span>
                        </div>
                      )}

                      {log.notes && (
                        <p className="text-[#7a6f75] italic">"{log.notes}"</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 6: HEALTH REPORTS */}
          {activeTab === 'Health Reports' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EDE9FE]">
                <div>
                  <h3 className="font-serif text-2xl text-[#3a3135]">Dependent Health Summaries & Reports</h3>
                  <p className="text-xs text-[#7a6f75] mt-1">Generate comprehensive PDF health progress reports for care recipients.</p>
                </div>

                <div className="flex items-center gap-3">
                  <select 
                    value={selectedReportDep} 
                    onChange={(e) => setSelectedReportDep(e.target.value)}
                    className="p-2.5 rounded-xl border border-[#EDE9FE] bg-white text-xs font-bold text-[#3a3135] cursor-pointer"
                  >
                    {dependents.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>

                  <button 
                    onClick={() => alert(`Generating PDF Health Report for ${selectedReportDep}...`)}
                    className="px-4 py-2.5 bg-[#14B8A6] hover:bg-[#0D9488] text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Printer className="w-4 h-4" /> Download PDF Report
                  </button>
                </div>
              </div>

              {/* REPORT DISPLAY CARD FOR SELECTED DEPENDENT */}
              <div className="p-6 rounded-3xl bg-[#FAF8FC] border border-[#EDE9FE] space-y-6">
                <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-100 text-[#14B8A6] flex items-center justify-center font-bold">
                      <FileCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-[#3a3135]">{selectedReportDep}</h4>
                      <p className="text-xs text-[#7a6f75]">Primary Caregiver: {profile.name} • Status: Active Monitoring</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase">
                    Compliant Care Profile
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-white border border-[#EDE9FE]">
                    <span className="text-[10px] font-bold text-[#7a6f75] uppercase block mb-1">Vaccinations Tracked</span>
                    <p className="font-bold text-[#3a3135] text-base">{vaccinations.filter(v => v.dependent === selectedReportDep).length} Completed / Up-to-date</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-[#EDE9FE]">
                    <span className="text-[10px] font-bold text-[#7a6f75] uppercase block mb-1">Active Medications</span>
                    <p className="font-bold text-[#3a3135] text-base">{medications.filter(m => m.dependent === selectedReportDep).length} Daily Reminders</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-[#EDE9FE]">
                    <span className="text-[10px] font-bold text-[#7a6f75] uppercase block mb-1">Medical Vault Docs</span>
                    <p className="font-bold text-[#3a3135] text-base">{records.filter(r => r.dependent === selectedReportDep).length} Scanned Files</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h5 className="font-bold text-xs text-[#3a3135] uppercase tracking-wider">Clinical Care Notes & Next Steps</h5>
                  <div className="p-4 rounded-2xl bg-white border border-[#EDE9FE] text-xs text-[#4a4145] leading-relaxed">
                    Patient care profile is compliant with scheduled immunizations and daily medication routines. Regular pediatric/geriatric wellness reviews are scheduled for Q3 2026.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: PROFILE */}
          {activeTab === 'My Profile' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm max-w-xl mx-auto space-y-6">
              <h3 className="font-serif text-2xl text-[#3a3135]">Caregiver Profile</h3>
              <div className="space-y-4 text-xs">
                <div><label className="block font-bold uppercase text-[#7a6f75] mb-1">Name</label><input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="w-full p-3 rounded-xl border border-[#EDE9FE]" /></div>
                <div><label className="block font-bold uppercase text-[#7a6f75] mb-1">Email</label><input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} className="w-full p-3 rounded-xl border border-[#EDE9FE]" /></div>
                <div><label className="block font-bold uppercase text-[#7a6f75] mb-1">Relationship</label><input type="text" value={profile.relationship} onChange={(e) => setProfile({...profile, relationship: e.target.value})} className="w-full p-3 rounded-xl border border-[#EDE9FE]" /></div>
                <button onClick={() => setShowPasswordModal(true)} className="px-4 py-2 rounded-xl border border-[#EDE9FE] font-bold text-[#7C3AED]">Change Password</button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Add Dependent Modal */}
      {showAddDepModal && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#EDE9FE]">
            <h3 className="font-bold text-base text-[#3a3135] mb-4">Add Dependent</h3>
            <form onSubmit={handleAddDependent} className="space-y-3 text-xs">
              <div><label className="block font-bold mb-1">Name</label><input type="text" value={newDep.name} onChange={(e) => setNewDep({...newDep, name: e.target.value})} className="w-full p-2.5 rounded-xl border" required /></div>
              <div><label className="block font-bold mb-1">DOB</label><input type="date" value={newDep.dob} onChange={(e) => setNewDep({...newDep, dob: e.target.value})} className="w-full p-2.5 rounded-xl border" required /></div>
              <div><label className="block font-bold mb-1">Relationship</label><select value={newDep.relation} onChange={(e) => setNewDep({...newDep, relation: e.target.value})} className="w-full p-2.5 rounded-xl border bg-white"><option>Child (Daughter)</option><option>Child (Son)</option><option>Elder Parent (Mother)</option><option>Elder Parent (Father)</option><option>Partner</option><option>Caretaker</option></select></div>
              <div><label className="block font-bold mb-1">Blood Group</label><input type="text" value={newDep.bloodGroup} onChange={(e) => setNewDep({...newDep, bloodGroup: e.target.value})} className="w-full p-2.5 rounded-xl border" required /></div>
              <div className="flex gap-2 pt-2"><button type="submit" className="flex-1 py-2.5 bg-[#7C3AED] text-white font-bold rounded-xl">Add Dependent</button><button type="button" onClick={() => setShowAddDepModal(false)} className="py-2.5 px-4 border rounded-xl font-bold">Cancel</button></div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Medical Record Modal */}
      {showAddRecordModal && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#EDE9FE] space-y-4">
            <h3 className="font-bold text-base text-[#3a3135]">Upload Dependent Medical Record</h3>
            <form onSubmit={handleUploadRecord} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Select Dependent</label>
                <select 
                  value={newRecordForm.dependent} 
                  onChange={(e) => setNewRecordForm({...newRecordForm, dependent: e.target.value})}
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE] bg-white font-medium"
                >
                  {dependents.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold mb-1">Document Title / File Name</label>
                <input 
                  type="text" 
                  value={newRecordForm.name} 
                  onChange={(e) => setNewRecordForm({...newRecordForm, name: e.target.value})}
                  placeholder="e.g. Pediatric_Blood_Panel.pdf"
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE]" 
                  required 
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Record Category</label>
                <select 
                  value={newRecordForm.category} 
                  onChange={(e) => setNewRecordForm({...newRecordForm, category: e.target.value})}
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE] bg-white font-medium"
                >
                  <option value="Lab Diagnostics">Lab Diagnostics</option>
                  <option value="Vaccination Record">Vaccination Record</option>
                  <option value="Pediatric Report">Pediatric Report</option>
                  <option value="Prescription & Dosage">Prescription & Dosage</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-2.5 bg-[#7C3AED] text-white font-bold rounded-xl cursor-pointer">
                  Upload Record
                </button>
                <button type="button" onClick={() => setShowAddRecordModal(false)} className="py-2.5 px-4 border rounded-xl font-bold cursor-pointer">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Book Appointment Modal */}
      {showAddAptModal && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#EDE9FE] space-y-4">
            <h3 className="font-bold text-base text-[#3a3135]">Book Doctor Consultation</h3>
            <form onSubmit={handleBookApt} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Select Dependent</label>
                <select 
                  value={newAptForm.dependent} 
                  onChange={(e) => setNewAptForm({...newAptForm, dependent: e.target.value})}
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE] bg-white font-medium"
                >
                  {dependents.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold mb-1">Selecting Doctor / Specialist</label>
                <select 
                  value={newAptForm.doctor} 
                  onChange={(e) => setNewAptForm({...newAptForm, doctor: e.target.value})}
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE] bg-white font-medium"
                >
                  <option value="Dr. Sarah Jenkins (Pediatrics)">Dr. Sarah Jenkins (Pediatrics)</option>
                  <option value="Dr. Alan Vance (Geriatrics)">Dr. Alan Vance (Geriatrics)</option>
                  <option value="Dr. Emily Watson (Dermatology)">Dr. Emily Watson (Dermatology)</option>
                  <option value="Dr. Robert Chen (General Physician)">Dr. Robert Chen (General Physician)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">Date</label>
                  <input 
                    type="date" 
                    value={newAptForm.date} 
                    onChange={(e) => setNewAptForm({...newAptForm, date: e.target.value})}
                    className="w-full p-2.5 rounded-xl border border-[#EDE9FE]" 
                    required 
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Time</label>
                  <input 
                    type="text" 
                    value={newAptForm.time} 
                    onChange={(e) => setNewAptForm({...newAptForm, time: e.target.value})}
                    placeholder="10:00 AM"
                    className="w-full p-2.5 rounded-xl border border-[#EDE9FE]" 
                    required 
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold mb-1">Reason for Visit</label>
                <input 
                  type="text" 
                  value={newAptForm.reason} 
                  onChange={(e) => setNewAptForm({...newAptForm, reason: e.target.value})}
                  placeholder="e.g. Vaccine booster, routine checkup"
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE]" 
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-2.5 bg-[#7C3AED] text-white font-bold rounded-xl cursor-pointer">
                  Confirm Booking
                </button>
                <button type="button" onClick={() => setShowAddAptModal(false)} className="py-2.5 px-4 border rounded-xl font-bold cursor-pointer">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Vaccination Modal */}
      {showAddVacModal && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#EDE9FE]">
            <h3 className="font-bold text-base text-[#3a3135] mb-4">Add Vaccination Record</h3>
            <form onSubmit={handleAddVaccination} className="space-y-3 text-xs">
              <div><label className="block font-bold mb-1">Vaccine Name</label><input type="text" value={newVac.vaccineName} onChange={(e) => setNewVac({...newVac, vaccineName: e.target.value})} className="w-full p-2.5 rounded-xl border" required /></div>
              <div><label className="block font-bold mb-1">Date</label><input type="date" value={newVac.date} onChange={(e) => setNewVac({...newVac, date: e.target.value})} className="w-full p-2.5 rounded-xl border" required /></div>
              <div><label className="block font-bold mb-1">Next Due Date</label><input type="date" value={newVac.nextDueDate} onChange={(e) => setNewVac({...newVac, nextDueDate: e.target.value})} className="w-full p-2.5 rounded-xl border" required /></div>
              <div className="flex gap-2 pt-2"><button type="submit" className="flex-1 py-2.5 bg-[#14B8A6] text-white font-bold rounded-xl">Save Vaccination</button><button type="button" onClick={() => setShowAddVacModal(false)} className="py-2.5 px-4 border rounded-xl font-bold">Cancel</button></div>
            </form>
          </div>
        </div>
      )}

      {/* Add Medicine Modal */}
      {showAddMedModal && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#EDE9FE]">
            <h3 className="font-bold text-base text-[#3a3135] mb-4">Add Medication Reminder</h3>
            <form onSubmit={handleAddMedication} className="space-y-3 text-xs">
              <div><label className="block font-bold mb-1">Medicine Name</label><input type="text" value={newMed.medicineName} onChange={(e) => setNewMed({...newMed, medicineName: e.target.value})} className="w-full p-2.5 rounded-xl border" required /></div>
              <div><label className="block font-bold mb-1">Dosage</label><input type="text" value={newMed.dosage} onChange={(e) => setNewMed({...newMed, dosage: e.target.value})} placeholder="e.g. 500mg" className="w-full p-2.5 rounded-xl border" required /></div>
              <div><label className="block font-bold mb-1">Time</label><input type="text" value={newMed.time} onChange={(e) => setNewMed({...newMed, time: e.target.value})} placeholder="e.g. 09:00 AM" className="w-full p-2.5 rounded-xl border" required /></div>
              <div className="flex gap-2 pt-2"><button type="submit" className="flex-1 py-2.5 bg-[#F472B6] text-white font-bold rounded-xl">Save Reminder</button><button type="button" onClick={() => setShowAddMedModal(false)} className="py-2.5 px-4 border rounded-xl font-bold">Cancel</button></div>
            </form>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#EDE9FE]">
            <h3 className="font-bold text-base text-[#3a3135] mb-3">Change Password</h3>
            <div className="space-y-3 text-xs">
              <div><label className="block font-bold mb-1">Old Password</label><input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full p-2 rounded-xl border" /></div>
              <div><label className="block font-bold mb-1">New Password</label><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-2 rounded-xl border" /></div>
              <button onClick={() => setShowPasswordModal(false)} className="w-full py-2.5 bg-[#7C3AED] text-white rounded-xl font-bold">Update Password</button>
            </div>
          </div>
        </div>
      )}

      {/* BLUETOOTH SMARTWATCH PAIRING MODAL FOR CAREGIVER */}
      {showBluetoothModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full border border-[#EDE9FE] shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#EDE9FE]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <Watch className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#3a3135]">Connect Smartwatch (BLE 5.3)</h3>
                  <p className="text-xs text-[#7a6f75]">Pair dependent's fitness watch for live vitals streaming</p>
                </div>
              </div>
              <button 
                onClick={() => setShowBluetoothModal(false)}
                className="p-2 rounded-xl text-[#7a6f75] hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* STATUS BANNER */}
            {bluetoothConnected ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Paired with {connectedDevice}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 uppercase">
                    ACTIVE STREAM
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-white/80 border border-emerald-100">
                    <span className="text-[10px] text-gray-500 block">Heart Rate</span>
                    <span className="font-bold text-emerald-700">{smartwatchVitals.heartRate} bpm</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/80 border border-emerald-100">
                    <span className="text-[10px] text-gray-500 block">Steps</span>
                    <span className="font-bold text-emerald-700">{smartwatchVitals.steps}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/80 border border-emerald-100">
                    <span className="text-[10px] text-gray-500 block">SpO2 / Temp</span>
                    <span className="font-bold text-emerald-700">{smartwatchVitals.spO2}% / {smartwatchVitals.bodyTemp}°C</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <button 
                    onClick={handleSyncWatchVitals} 
                    className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Re-sync Live Vitals
                  </button>
                  <button 
                    onClick={handleDisconnectBluetooth} 
                    className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                  >
                    Disconnect Watch
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#7a6f75] uppercase">Nearby Bluetooth Devices</span>
                  <button 
                    onClick={handleScanBluetoothDevices}
                    disabled={isScanning}
                    className="text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                    {isScanning ? 'Scanning...' : 'Scan Devices'}
                  </button>
                </div>

                {isScanning ? (
                  <div className="p-8 text-center space-y-3 bg-[#FAF8FC] rounded-2xl border border-dashed border-[#EDE9FE]">
                    <Bluetooth className="w-8 h-8 text-[#7C3AED] mx-auto animate-pulse" />
                    <p className="text-xs font-bold text-[#3a3135]">Searching for nearby Bluetooth Smartwatches...</p>
                    <p className="text-[11px] text-[#7a6f75]">Ensure Bluetooth is enabled on dependent's device</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {foundDevices.map((dev, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl border border-[#EDE9FE] bg-[#FAF8FC] flex items-center justify-between hover:bg-[#F5F3FF] transition-all">
                        <div className="flex items-center gap-3">
                          <Watch className="w-5 h-5 text-[#7C3AED]" />
                          <div>
                            <p className="font-bold text-xs text-[#3a3135]">{dev.name}</p>
                            <p className="text-[10px] text-[#7a6f75]">{dev.type} • Signal: {dev.rssi} dBm • Battery: {dev.battery}%</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handlePairDevice(dev.name)}
                          className="px-3.5 py-1.5 bg-[#7C3AED] text-white rounded-xl text-xs font-bold shadow-2xs hover:bg-[#6D28D9] cursor-pointer"
                        >
                          Pair
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="pt-2 border-t border-[#EDE9FE] flex items-center justify-between text-xs text-[#7a6f75]">
              <span className="flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-emerald-500" /> Web Bluetooth API • Encrypted Stream
              </span>
              <button onClick={() => setShowBluetoothModal(false)} className="font-bold text-[#7C3AED] hover:underline cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
