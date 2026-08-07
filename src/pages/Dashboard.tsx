import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, Activity, Heart, Droplet, Moon, Flame, 
  Calendar, AlertCircle, User, FileText, 
  LogOut, CheckCircle2, Bell, Upload, Download, 
  Trash2, Plus, X, Lock, Check, Clock, Edit3, 
  Sliders, ShieldCheck, Mail, Phone, MapPin, Printer, Eye,
  CheckSquare, Square, Stethoscope, ChevronDown, Watch, Bluetooth, Wifi, RefreshCw, Cpu, Zap, Battery,
  Utensils, Footprints, Smile, Compass, HeartPulse, Scan, FileCheck, AlertTriangle, TrendingUp, Award, Search, Camera, Image as ImageIcon
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Live Time & Date
  const [currentTime, setCurrentTime] = useState(new Date());

  // Bluetooth Smartwatch Connectivity State
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

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 1. User Profile State (CRUD & Photo Edit)
  const [userProfile, setUserProfile] = useState({
    fullName: 'Elena Rostova',
    avatarUrl: null as string | null,
    avatarBg: '#7C3AED',
    dob: '1996-08-14',
    age: 30,
    bloodGroup: 'A Positive (A+)',
    height: '168',
    weight: '62',
    phone: '+1 (555) 382-9102',
    email: 'elena.rostova@femsphere.health',
    address: '742 Evergreen Terrace, San Francisco, CA 94107',
    emergencyContact: 'Marcus Rostova (+1 555 902-4118)',
  });

  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [tempAvatarUrl, setTempAvatarUrl] = useState<string | null>(null);
  const [tempAvatarBg, setTempAvatarBg] = useState('#7C3AED');

  const [editProfileForm, setEditProfileForm] = useState({ ...userProfile });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);

  // 2. Medical Records State (CRUD with AI Document Scanning & Monthly Summaries)
  const [selectedMonthFilter, setSelectedMonthFilter] = useState('August 2026');
  const [isScanningDoc, setIsScanningDoc] = useState(false);
  const [scanningProgress, setScanningProgress] = useState(0);
  const [scanningRecordTitle, setScanningRecordTitle] = useState('');
  const [viewingScanRecordModal, setViewingScanRecordModal] = useState<any | null>(null);

  const [records, setRecords] = useState([
    { 
      id: 'REC-101', 
      title: 'Comprehensive Blood & Hormone Panel', 
      type: 'PDF', 
      date: '2026-08-04', 
      month: 'August 2026',
      description: 'Complete blood count, lipid profile & serum hormone levels', 
      size: '2.8 MB',
      category: 'Lab Results',
      isScanned: true,
      scanResults: {
        doctorName: 'Dr. Sarah Jenkins, MD',
        labName: 'Quest Diagnostics Clinical Lab',
        keyBiomarkers: [
          { name: 'Hemoglobin', value: '13.8 g/dL', status: 'Normal', range: '12.0 - 15.5 g/dL' },
          { name: 'HbA1c (Blood Sugar)', value: '5.2%', status: 'Optimal', range: '< 5.7%' },
          { name: 'Vitamin D3 (25-OH)', value: '34 ng/mL', status: 'Optimal', range: '30 - 100 ng/mL' },
          { name: 'Estradiol (E2)', value: '145 pg/mL', status: 'Normal', range: '30 - 400 pg/mL' },
          { name: 'Thyroid TSH', value: '2.1 mIU/L', status: 'Normal', range: '0.4 - 4.0 mIU/L' }
        ],
        aiSummary: 'Metabolic & hormonal markers are balanced. Serum Vitamin D levels are restored to healthy optimal status.',
        riskLevel: 'Optimal',
        recommendations: 'Continue daily multivitamin and balanced Mediterranean diet.'
      }
    },
    { 
      id: 'REC-102', 
      title: 'Pelvic & Ovarian Ultrasound Scan', 
      type: 'PNG', 
      date: '2026-07-18', 
      month: 'July 2026',
      description: 'Pelvic imaging and uterine follicular mapping assessment', 
      size: '4.2 MB',
      category: 'Radiology',
      isScanned: true,
      scanResults: {
        doctorName: 'Dr. Amanda Vance, OB-GYN',
        labName: 'Pacific Women Imaging Center',
        keyBiomarkers: [
          { name: 'Endometrial Thickness', value: '7.8 mm', status: 'Normal', range: '4.0 - 12.0 mm' },
          { name: 'Ovarian Volume (Right)', value: '6.4 mL', status: 'Normal', range: '3.0 - 10.0 mL' },
          { name: 'Ovarian Volume (Left)', value: '5.9 mL', status: 'Normal', range: '3.0 - 10.0 mL' }
        ],
        aiSummary: 'Pelvic imaging shows normal endometrial thickness and uterine structure with clear follicular activity.',
        riskLevel: 'Optimal',
        recommendations: 'Routine annual gynecological scan scheduled.'
      }
    },
    { 
      id: 'REC-103', 
      title: 'Vitamin D3 & Micronutrient Scan', 
      type: 'PDF', 
      date: '2026-06-10', 
      month: 'June 2026',
      description: 'Serum iron, Ferritin, B12 and Vitamin D deficiency test', 
      size: '1.6 MB',
      category: 'Nutritional Panel',
      isScanned: true,
      scanResults: {
        doctorName: 'Dr. Robert Chen, MD',
        labName: 'BioReference Laboratories',
        keyBiomarkers: [
          { name: 'Vitamin D3 (25-OH)', value: '21 ng/mL', status: 'Watch', range: '30 - 100 ng/mL' },
          { name: 'Serum Ferritin', value: '28 ng/mL', status: 'Normal', range: '15 - 150 ng/mL' },
          { name: 'Vitamin B12', value: '480 pg/mL', status: 'Optimal', range: '200 - 900 pg/mL' }
        ],
        aiSummary: 'Mild Vitamin D3 deficiency identified (21 ng/mL). Iron stores and Vitamin B12 are within healthy limits.',
        riskLevel: 'Low Monitoring',
        recommendations: 'Prescribed 2,000 IU daily Vitamin D3 supplementation for 60 days.'
      }
    },
    { 
      id: 'REC-104', 
      title: 'Lipid & Fasting Glucose Screening', 
      type: 'PDF', 
      date: '2026-05-02', 
      month: 'May 2026',
      description: 'Cardiovascular lipid profile and fasting plasma blood sugar', 
      size: '1.9 MB',
      category: 'Cardiovascular',
      isScanned: true,
      scanResults: {
        doctorName: 'Dr. Sarah Jenkins, MD',
        labName: 'Quest Diagnostics',
        keyBiomarkers: [
          { name: 'Fasting Glucose', value: '88 mg/dL', status: 'Optimal', range: '70 - 99 mg/dL' },
          { name: 'Total Cholesterol', value: '172 mg/dL', status: 'Normal', range: '< 200 mg/dL' },
          { name: 'HDL Cholesterol', value: '62 mg/dL', status: 'Optimal', range: '> 50 mg/dL' },
          { name: 'Triglycerides', value: '95 mg/dL', status: 'Optimal', range: '< 150 mg/dL' }
        ],
        aiSummary: 'Cardiovascular lipids and glycemic indices demonstrate excellent heart health and insulin sensitivity.',
        riskLevel: 'Optimal',
        recommendations: 'Maintain current aerobic exercise routine.'
      }
    }
  ]);

  const [newRecord, setNewRecord] = useState({ title: '', type: 'PDF', description: '', category: 'Lab Results', fileName: '' });
  const [showUploadModal, setShowUploadModal] = useState(false);

  // 3. Health Tracker State (CRUD - Manual Food, Exercise, Steps, Symptoms & Vitals Log)
  const [trackerLogs, setTrackerLogs] = useState([
    { 
      id: 'HT-01', 
      date: '2026-08-06', 
      weight: '62', 
      water: '2.5', 
      sleep: '8.0', 
      exerciseType: 'Yoga & Morning Jog',
      exercise: '35', 
      caloriesBurned: '280',
      steps: '8420',
      distanceKm: '5.6',
      foodMeals: 'Avocado Toast & Tea (Breakfast), Quinoa Bowl (Lunch), Salmon Salad (Dinner)',
      caloriesIntake: '1850',
      bloodPressure: '118/76', 
      heartRate: '72', 
      mood: 'Energetic',
      symptomName: 'Mild Fatigue',
      symptomSeverity: 'Low',
      notes: 'Hydration goal achieved. Great energy during morning jog.' 
    },
    { 
      id: 'HT-02', 
      date: '2026-08-05', 
      weight: '62.2', 
      water: '2.0', 
      sleep: '7.5', 
      exerciseType: 'Pilates Workout',
      exercise: '25', 
      caloriesBurned: '190',
      steps: '6800',
      distanceKm: '4.2',
      foodMeals: 'Oatmeal (Breakfast), Grilled Chicken (Lunch), Veggie Soup (Dinner)',
      caloriesIntake: '1720',
      bloodPressure: '120/78', 
      heartRate: '75', 
      mood: 'Good',
      symptomName: 'Headache',
      symptomSeverity: 'Medium',
      notes: 'Evening pilates session completed.' 
    },
    { 
      id: 'HT-03', 
      date: '2026-08-04', 
      weight: '62.5', 
      water: '1.8', 
      sleep: '7.0', 
      exerciseType: 'Brisk Walk',
      exercise: '20', 
      caloriesBurned: '120',
      steps: '5100',
      distanceKm: '3.4',
      foodMeals: 'Smoothie (Breakfast), Pasta (Lunch), Fruit Bowl (Dinner)',
      caloriesIntake: '1900',
      bloodPressure: '122/80', 
      heartRate: '78', 
      mood: 'Normal',
      symptomName: 'Abdominal Cramping',
      symptomSeverity: 'High',
      notes: 'Phase 3 cycle mild tiredness.' 
    },
  ]);

  const [trackerInput, setTrackerInput] = useState({
    weight: '62',
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
  const [editingTrackerId, setEditingTrackerId] = useState<string | null>(null);

  // 4. Symptom Tracker State (CRUD)
  const [symptomLogs, setSymptomLogs] = useState([
    { id: 'SYM-101', symptomName: 'Mild Fatigue', severity: 'Low', date: '2026-08-06', description: 'Mid-afternoon drowsiness after walking' },
    { id: 'SYM-102', symptomName: 'Migraine / Headache', severity: 'Medium', date: '2026-08-03', description: 'Dehydration related pressure in temple region' },
    { id: 'SYM-103', symptomName: 'Abdominal Cramping', severity: 'High', date: '2026-07-25', description: 'Lower abdominal cramps during day 1 cycle' },
  ]);

  const [symptomInput, setSymptomInput] = useState({
    symptomName: '', severity: 'Low', date: new Date().toISOString().split('T')[0], description: ''
  });
  const [editingSymptomId, setEditingSymptomId] = useState<string | null>(null);

  // 5. Appointments State (CRUD)
  const [appointments, setAppointments] = useState([
    { id: 'APT-201', doctor: 'Dr. Sarah Jenkins (OB/GYN)', date: '2026-08-12', time: '10:30 AM', reason: 'Annual Reproductive Wellness Review', status: 'Scheduled' },
    { id: 'APT-202', doctor: 'Dr. Priya Sharma (Maternal-Fetal)', date: '2026-07-15', time: '02:00 PM', reason: 'Hormonal & Thyroid Consultation', status: 'Completed' },
  ]);

  const [newAppointment, setNewAppointment] = useState({
    doctor: 'Dr. Sarah Jenkins (OB/GYN)', date: '', time: '10:00 AM', reason: ''
  });
  const [showBookModal, setShowBookModal] = useState(false);

  // 6. Notifications State (CRUD)
  const [notifications, setNotifications] = useState([
    { id: 'NOTIF-01', title: 'Appointment Reminder', message: 'Upcoming consultation with Dr. Sarah Jenkins on Aug 12, 10:30 AM.', time: '10 mins ago', type: 'appointment', read: false },
    { id: 'NOTIF-02', title: 'Medical Record Uploaded', message: 'Q3 Comprehensive Blood Panel has been uploaded to your vault.', time: '2 hours ago', type: 'record', read: false },
    { id: 'NOTIF-03', title: 'Health Report Generated', message: 'Your August Longitudinal Health Report is ready to download.', time: '1 day ago', type: 'report', read: true },
  ]);

  // 7. Settings State
  const [settings, setSettings] = useState({
    emailAlerts: true,
    smsAlerts: true,
    healthReminders: true,
    darkTheme: false,
  });

  // 8. Health Report Preview State
  const [showReportPreview, setShowReportPreview] = useState(false);

  // Logout Handler
  const handleLogout = () => {
    navigate('/login');
  };

  // --- PROFILE UPDATE HANDLERS ---
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile({ ...editProfileForm });
    setIsEditingProfile(false);
    // Add Notification
    setNotifications(prev => [
      { id: `NOTIF-${Date.now()}`, title: 'Profile Updated', message: 'Your profile details were updated successfully.', time: 'Just now', type: 'profile', read: false },
      ...prev
    ]);
  };

  const handleSaveProfilePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile(prev => ({
      ...prev,
      avatarUrl: tempAvatarUrl,
      avatarBg: tempAvatarBg
    }));
    setShowPhotoModal(false);
    setNotifications(prev => [
      { id: `NOTIF-${Date.now()}`, title: 'Profile Photo Updated', message: 'Your profile avatar photo has been updated successfully.', time: 'Just now', type: 'system', read: false },
      ...prev
    ]);
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

  // --- MEDICAL RECORD & AI SCANNER HANDLERS ---
  const handleScanMedicalReport = (recordId: string) => {
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
        // Mark record as scanned with structured data
        const updatedRecords = records.map(r => {
          if (r.id === recordId) {
            const scannedObj = {
              ...r,
              isScanned: true,
              scanResults: r.scanResults || {
                doctorName: 'Dr. Clinical AI Analyzer',
                labName: 'FemSphere Smart OCR Engine',
                keyBiomarkers: [
                  { name: 'Hemoglobin', value: '13.4 g/dL', status: 'Normal', range: '12.0 - 15.5 g/dL' },
                  { name: 'Fasting Blood Sugar', value: '92 mg/dL', status: 'Optimal', range: '70 - 99 mg/dL' },
                  { name: 'Serum Ferritin', value: '35 ng/mL', status: 'Normal', range: '15 - 150 ng/mL' },
                  { name: 'Vitamin D3 (25-OH)', value: '32 ng/mL', status: 'Optimal', range: '30 - 100 ng/mL' }
                ],
                aiSummary: `AI Scan completed for "${r.title}". Biomarkers extracted successfully. All clinical parameters are within normal healthy ranges.`,
                riskLevel: 'Optimal' as const,
                recommendations: 'Annual routine health review recommended.'
              }
            };
            setViewingScanRecordModal(scannedObj);
            return scannedObj;
          }
          return r;
        });
        setRecords(updatedRecords);

        setNotifications(prev => [
          { id: `NOTIF-${Date.now()}`, title: 'AI Report Scan Completed', message: `Medical report "${targetRecord.title}" scanned and analyzed.`, time: 'Just now', type: 'record', read: false },
          ...prev
        ]);
      }, 400);
    }, 1800);
  };

  const handleUploadRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecord.title.trim()) return;
    const fileExt = newRecord.fileName ? newRecord.fileName.split('.').pop()?.toUpperCase() || newRecord.type : newRecord.type;
    const todayStr = new Date().toISOString().split('T')[0];
    const monthStr = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const createdRecord = {
      id: `REC-${Date.now().toString().slice(-3)}`,
      title: newRecord.title,
      type: fileExt,
      date: todayStr,
      month: monthStr,
      description: newRecord.description || 'Uploaded medical report',
      size: '2.4 MB',
      category: newRecord.category || 'Lab Results',
      isScanned: true,
      scanResults: {
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
      }
    };

    setRecords([createdRecord, ...records]);
    setNewRecord({ title: '', type: 'PDF', description: '', category: 'Lab Results', fileName: '' });
    setShowUploadModal(false);
    
    // Add Notification
    setNotifications(prev => [
      { id: `NOTIF-${Date.now()}`, title: 'Medical Report Uploaded & Scanned', message: `Report "${createdRecord.title}" parsed for ${monthStr}.`, time: 'Just now', type: 'record', read: false },
      ...prev
    ]);
  };

  const handleDeleteRecord = (id: string) => {
    setRecords(records.filter(r => r.id !== id));
  };

  // --- HEALTH TRACKER HANDLERS ---
  const handleSaveTrackerLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTrackerId) {
      setTrackerLogs(trackerLogs.map(log => log.id === editingTrackerId ? { ...log, ...trackerInput } : log));
      setEditingTrackerId(null);
    } else {
      const newLog = {
        id: `HT-${Date.now().toString().slice(-3)}`,
        date: new Date().toISOString().split('T')[0],
        ...trackerInput
      };
      setTrackerLogs([newLog, ...trackerLogs]);
    }
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
  };

  const handleEditTrackerLog = (log: typeof trackerLogs[0]) => {
    setEditingTrackerId(log.id);
    setTrackerInput({
      weight: log.weight || '62',
      water: log.water || '2.5',
      sleep: log.sleep || '8.0',
      exerciseType: log.exerciseType || 'General Exercise',
      exercise: log.exercise || '30',
      caloriesBurned: log.caloriesBurned || '200',
      steps: log.steps || '7000',
      distanceKm: log.distanceKm || '4.5',
      foodMeals: log.foodMeals || '',
      caloriesIntake: log.caloriesIntake || '1800',
      bloodPressure: log.bloodPressure || '120/78',
      heartRate: log.heartRate || '72',
      mood: log.mood || 'Good',
      symptomName: log.symptomName || '',
      symptomSeverity: log.symptomSeverity || 'Low',
      notes: log.notes || ''
    });
  };

  const handleDeleteTrackerLog = (id: string) => {
    setTrackerLogs(trackerLogs.filter(l => l.id !== id));
  };

  // --- SYMPTOM TRACKER HANDLERS ---
  const handleSaveSymptom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomInput.symptomName.trim()) return;
    if (editingSymptomId) {
      setSymptomLogs(symptomLogs.map(s => s.id === editingSymptomId ? { ...s, ...symptomInput } : s));
      setEditingSymptomId(null);
    } else {
      const newSym = {
        id: `SYM-${Date.now().toString().slice(-3)}`,
        ...symptomInput
      };
      setSymptomLogs([newSym, ...symptomLogs]);
    }
    setSymptomInput({ symptomName: '', severity: 'Low', date: new Date().toISOString().split('T')[0], description: '' });
  };

  const handleEditSymptom = (sym: typeof symptomLogs[0]) => {
    setEditingSymptomId(sym.id);
    setSymptomInput({
      symptomName: sym.symptomName,
      severity: sym.severity,
      date: sym.date,
      description: sym.description
    });
  };

  const handleDeleteSymptom = (id: string) => {
    setSymptomLogs(symptomLogs.filter(s => s.id !== id));
  };

  // --- APPOINTMENT HANDLERS ---
  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppointment.date) return;
    const booked = {
      id: `APT-${Date.now().toString().slice(-3)}`,
      ...newAppointment,
      status: 'Scheduled'
    };
    setAppointments([booked, ...appointments]);
    setShowBookModal(false);
    setNewAppointment({ doctor: 'Dr. Sarah Jenkins (OB/GYN)', date: '', time: '10:00 AM', reason: '' });
    
    // Add Notification
    setNotifications(prev => [
      { id: `NOTIF-${Date.now()}`, title: 'Appointment Booked', message: `Confirmed with ${booked.doctor} on ${booked.date}.`, time: 'Just now', type: 'appointment', read: false },
      ...prev
    ]);
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'Cancelled' } : a));
  };

  // --- NOTIFICATION HANDLERS ---
  const markNotificationRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  // --- BLUETOOTH SMARTWATCH PAIRING & SYNC HANDLERS ---
  const handleScanBluetoothDevices = async () => {
    setIsScanning(true);
    setFoundDevices([]);

    // Try Web Bluetooth API if available in browser
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
          setNotifications(prev => [
            { id: `NOTIF-${Date.now()}`, title: 'Bluetooth Smartwatch Connected', message: `Paired with ${device.name || 'Smart Watch'}. Live vitals streaming enabled.`, time: 'Just now', type: 'system', read: false },
            ...prev
          ]);
          return;
        }
      } catch (err) {
        console.log('Web Bluetooth prompt cancelled or unsupported, fallback to discovery list...', err);
      }
    }

    // Simulated Bluetooth Device Discovery List
    setTimeout(() => {
      setFoundDevices([
        { name: 'Apple Watch Series 9 (Bluetooth 5.3)', type: 'Smart Watch', rssi: -52, battery: 92 },
        { name: 'Fitbit Sense 2 (BLE)', type: 'Fitness Tracker', rssi: -64, battery: 85 },
        { name: 'Samsung Galaxy Watch 6', type: 'Smart Watch', rssi: -71, battery: 78 },
        { name: 'Garmin Venu 3 (ANT+/BLE)', type: 'Sports Watch', rssi: -79, battery: 90 },
      ]);
      setIsScanning(false);
    }, 1500);
  };

  const handlePairDevice = (deviceName: string) => {
    setConnectedDevice(deviceName);
    setBluetoothConnected(true);
    setShowBluetoothModal(false);

    // Auto-fill Health Tracker form with live smartwatch readings
    setTrackerInput(prev => ({
      ...prev,
      heartRate: smartwatchVitals.heartRate.toString(),
      steps: smartwatchVitals.steps.toString(),
      caloriesBurned: smartwatchVitals.calories.toString(),
      distanceKm: (smartwatchVitals.steps * 0.00075).toFixed(1),
      notes: prev.notes || `Live watch readings synced from ${deviceName}`
    }));

    setNotifications(prev => [
      { id: `NOTIF-${Date.now()}`, title: 'Smartwatch Paired via Bluetooth', message: `Connected to ${deviceName}. Real-time vitals synced to FemSphere.`, time: 'Just now', type: 'system', read: false },
      ...prev
    ]);
  };

  const handleDisconnectBluetooth = () => {
    setBluetoothConnected(false);
    setConnectedDevice(null);
    setNotifications(prev => [
      { id: `NOTIF-${Date.now()}`, title: 'Bluetooth Watch Disconnected', message: 'Smartwatch disconnected.', time: 'Just now', type: 'system', read: false },
      ...prev
    ]);
  };

  const handleSyncWatchVitals = () => {
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

    // Auto update Health Tracker input form with synced watch readings
    setTrackerInput(prev => ({
      ...prev,
      heartRate: updatedHR.toString(),
      steps: updatedSteps.toString(),
      caloriesBurned: updatedCalories.toString(),
      distanceKm: updatedDist,
    }));

    // Auto-update recent Vitals Log in Health Tracker
    setTrackerLogs(prev => [
      {
        id: `HT-${Date.now().toString().slice(-3)}`,
        date: new Date().toISOString().split('T')[0],
        weight: userProfile.weight,
        water: '2.8',
        sleep: '8.0',
        exerciseType: 'Smartwatch Workout',
        exercise: '45',
        caloriesBurned: updatedCalories.toString(),
        steps: updatedSteps.toString(),
        distanceKm: updatedDist,
        foodMeals: 'Balanced Nutrition (Synced)',
        caloriesIntake: '1850',
        bloodPressure: '118/76',
        heartRate: updatedHR.toString(),
        mood: 'Energetic',
        notes: `Auto-synced live via Bluetooth smartwatch (${connectedDevice || 'Smartwatch'})`
      },
      ...prev
    ]);

    setNotifications(prev => [
      { id: `NOTIF-${Date.now()}`, title: 'Watch Vitals Auto-Synced', message: `Heart rate: ${updatedHR} bpm, SpO2: ${updatedSpO2}%, Steps: ${updatedSteps}.`, time: 'Just now', type: 'system', read: false },
      ...prev
    ]);
  };

  // --- PRINT / DOWNLOAD PDF REPORT ---
  const handlePrintPDFReport = () => {
    window.print();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[#FAF7F4] flex font-inter text-[#2E2428]">
      
      {/* SIDEBAR NAVIGATION MENU */}
      <aside className="w-72 bg-[#F4E0D1] border-r border-[#E5CDBC] hidden lg:flex flex-col flex-shrink-0 sticky top-0 h-screen font-inter print:hidden">
        <div className="p-6 border-b border-[#E5CDBC] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <h1 className="font-serif text-3xl font-bold text-[#7C3AED] tracking-tight">FemSphere</h1>
            <Sparkles className="w-5 h-5 text-[#14B8A6]" />
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-hide font-inter">
          <p className="text-xs uppercase tracking-widest text-[#8C756B] font-bold px-3 py-2">System Menu</p>
          
          {/* 1. Dashboard */}
          <button 
            onClick={() => setActiveTab('Dashboard')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base transition-all ${
              activeTab === 'Dashboard' ? 'bg-white text-[#7C3AED] shadow-sm border border-[#E5CDBC]' : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'
            }`}
          >
            <Activity className="w-5 h-5 text-[#7C3AED]" /> Dashboard
          </button>

          {/* 2. Medical Records */}
          <button 
            onClick={() => setActiveTab('Medical Records')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base transition-all ${
              activeTab === 'Medical Records' ? 'bg-white text-[#7C3AED] shadow-sm border border-[#E5CDBC]' : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'
            }`}
          >
            <FileText className="w-5 h-5 text-[#7C3AED]" /> Medical Records
          </button>

          {/* 3. Health Tracker */}
          <button 
            onClick={() => setActiveTab('Health Tracker')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base transition-all ${
              activeTab === 'Health Tracker' ? 'bg-white text-[#7C3AED] shadow-sm border border-[#E5CDBC]' : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'
            }`}
          >
            <Heart className="w-5 h-5 text-[#F472B6]" /> Health Tracker
          </button>

          {/* 4. Connect Watch (Bluetooth) */}
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

          {/* 5. Appointments */}
          <button 
            onClick={() => setActiveTab('Appointments')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base transition-all ${
              activeTab === 'Appointments' ? 'bg-white text-[#7C3AED] shadow-sm border border-[#E5CDBC]' : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'
            }`}
          >
            <Calendar className="w-5 h-5 text-[#7C3AED]" /> Appointments
          </button>

          {/* 6. Health Reports */}
          <button 
            onClick={() => setActiveTab('Health Reports')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base transition-all ${
              activeTab === 'Health Reports' ? 'bg-white text-[#7C3AED] shadow-sm border border-[#E5CDBC]' : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'
            }`}
          >
            <Printer className="w-5 h-5 text-[#14B8A6]" /> Health Reports
          </button>

          {/* 7. Notifications */}
          <button 
            onClick={() => setActiveTab('Notifications')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base transition-all ${
              activeTab === 'Notifications' ? 'bg-white text-[#7C3AED] shadow-sm border border-[#E5CDBC]' : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'
            }`}
          >
            <Bell className="w-5 h-5 text-[#7C3AED]" /> Notifications
          </button>
        </div>
      </aside>

      {/* MAIN DASHBOARD CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto font-inter">
        
        {/* HEADER BAR */}
        <header className="bg-[#F4E0D1]/90 backdrop-blur-md border-b border-[#E5CDBC] p-5 md:px-8 flex items-center justify-between sticky top-0 z-20 print:hidden font-inter">
          <div>
            <h2 className="font-bold text-[#2E2428] text-xl md:text-2xl">
              Welcome, {userProfile.fullName}!
            </h2>
            <p className="text-xs md:text-sm text-[#635259] flex items-center gap-2 mt-1 font-medium">
              <Clock className="w-4 h-4 text-[#7C3AED]" />
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Profile Photo Avatar Dropdown Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)} 
                className="p-1 rounded-full border border-[#E5CDBC] bg-white/90 hover:bg-white hover:scale-105 transition-all cursor-pointer shadow-2xs focus:ring-2 focus:ring-[#7C3AED]"
                title="Profile Menu"
              >
                {/* Profile Photo Avatar Circle */}
                <div className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-base shadow-inner relative overflow-hidden shrink-0" style={{ backgroundColor: userProfile.avatarBg || '#7C3AED' }}>
                  {userProfile.avatarUrl ? (
                    <img src={userProfile.avatarUrl} alt={userProfile.fullName} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span>{userProfile.fullName ? userProfile.fullName.charAt(0) : 'E'}</span>
                  )}
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                </div>
              </button>

              {/* Popover Dropdown Menu */}
              {showProfileDropdown && (
                <>
                  {/* Backdrop to close when clicking outside */}
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setShowProfileDropdown(false)}
                  ></div>

                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#EDE9FE] shadow-xl z-40 py-2 font-inter animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* User Profile Header */}
                    <div className="px-4 py-2.5 border-b border-[#EDE9FE] bg-[#FAF8FC]">
                      <p className="text-xs font-bold text-[#3a3135] truncate">{userProfile.fullName}</p>
                      <p className="text-[10px] text-[#7a6f75] truncate">{userProfile.email}</p>
                    </div>

                    {/* My Profile Option */}
                    <button 
                      onClick={() => {
                        setActiveTab('My Profile');
                        setShowProfileDropdown(false);
                      }} 
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-[#3a3135] hover:bg-[#F5F3FF] hover:text-[#7C3AED] transition-colors"
                    >
                      <User className="w-4 h-4 text-[#7C3AED]" /> My Profile
                    </button>

                    {/* Settings Option */}
                    <button 
                      onClick={() => {
                        setActiveTab('Settings');
                        setShowProfileDropdown(false);
                      }} 
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-[#3a3135] hover:bg-[#F5F3FF] hover:text-[#7C3AED] transition-colors"
                    >
                      <Sliders className="w-4 h-4 text-[#7C3AED]" /> Settings
                    </button>

                    <div className="my-1 border-t border-[#EDE9FE]"></div>

                    {/* Logout Option */}
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

        {/* CONTAINER WORKSPACE */}
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8 font-inter">

          {/* 1. TAB: DASHBOARD OVERVIEW */}
          {activeTab === 'Dashboard' && (
            <div className="space-y-8">
              
              {/* TOP 4 SUMMARY STAT CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Card 1: User Profile Summary */}
                <div className="bg-[#7C3AED] text-white p-6 rounded-3xl shadow-md flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute right-3 top-3 opacity-10">
                    <User className="w-24 h-24" />
                  </div>
                  <div>
                    <span className="text-xs uppercase font-bold tracking-widest text-purple-200 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                      Profile Summary
                    </span>
                    <h3 className="text-2xl font-bold mt-3 truncate">{userProfile.fullName}</h3>
                    <p className="text-sm text-purple-100 mt-1 font-medium">
                      {userProfile.bloodGroup} • {userProfile.height}cm / {userProfile.weight}kg
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('My Profile')}
                    className="mt-4 text-sm font-bold text-white hover:underline flex items-center gap-1"
                  >
                    View Full Profile →
                  </button>
                </div>

                {/* Card 2: Total Uploaded Medical Records */}
                <div className="bg-white p-6 rounded-3xl border border-[#EDE9FE] shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#7a6f75] uppercase tracking-wider">Medical Records</span>
                    <div className="p-2.5 rounded-2xl bg-[#F5F3FF] text-[#7C3AED]">
                      <FileText className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <h3 className="text-4xl font-bold text-[#3a3135]">{records.length}</h3>
                    <p className="text-sm text-[#7a6f75] font-medium mt-1">Uploaded to Vault</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('Medical Records')} 
                    className="mt-3 text-sm font-bold text-[#7C3AED] hover:underline flex items-center gap-1"
                  >
                    Manage Records →
                  </button>
                </div>

                {/* Card 3: Total Appointments */}
                <div className="bg-white p-6 rounded-3xl border border-[#EDE9FE] shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#7a6f75] uppercase tracking-wider">Appointments</span>
                    <div className="p-2.5 rounded-2xl bg-[#F5F3FF] text-[#7C3AED]">
                      <Calendar className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <h3 className="text-4xl font-bold text-[#3a3135]">{appointments.length}</h3>
                    <p className="text-sm text-[#7C3AED] font-bold mt-1">
                      {appointments.filter(a => a.status === 'Scheduled').length} Scheduled
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('Appointments')} 
                    className="mt-3 text-sm font-bold text-[#7C3AED] hover:underline flex items-center gap-1"
                  >
                    View Appointments →
                  </button>
                </div>

                {/* Card 4: Latest Vitals Update */}
                <div className="bg-white p-6 rounded-3xl border border-[#EDE9FE] shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#7a6f75] uppercase tracking-wider">Latest Vitals</span>
                    <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
                      <Heart className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <h3 className="text-2xl font-bold text-[#3a3135]">
                      {trackerLogs[0]?.water || '0'}L Water • {trackerLogs[0]?.sleep || '0'}h Sleep
                    </h3>
                    <p className="text-sm text-emerald-600 font-bold mt-1">
                      BP: {trackerLogs[0]?.bloodPressure || '120/78'} • HR: {trackerLogs[0]?.heartRate || '72'} bpm
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('Health Tracker')} 
                    className="mt-3 text-sm font-bold text-[#7C3AED] hover:underline flex items-center gap-1"
                  >
                    Open Health Tracker →
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* 2. TAB: MY PROFILE */}
          {activeTab === 'My Profile' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-4">
                <div>
                  <h3 className="font-bold text-xl text-[#3a3135]">My Profile Information</h3>
                  <p className="text-xs text-[#7a6f75]">Manage your personal profile details and profile avatar photo</p>
                </div>
                {!isEditingProfile ? (
                  <button 
                    onClick={() => setIsEditingProfile(true)} 
                    className="flex items-center gap-2 px-4 py-2 bg-[#7C3AED] text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" /> Edit Profile
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsEditingProfile(false)} 
                    className="flex items-center gap-2 px-4 py-2 border border-[#EDE9FE] text-[#7a6f75] rounded-xl text-xs font-bold cursor-pointer"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                )}
              </div>

              {/* PROFILE PHOTO AVATAR HEADER CARD */}
              <div className="bg-[#FAF8FC] p-6 rounded-3xl border border-[#EDE9FE] flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                  {/* Photo Avatar Circle with Edit Badge */}
                  <div className="relative group cursor-pointer" onClick={() => {
                    setTempAvatarUrl(userProfile.avatarUrl);
                    setTempAvatarBg(userProfile.avatarBg || '#7C3AED');
                    setShowPhotoModal(true);
                  }}>
                    <div 
                      className="w-24 h-24 rounded-full text-white flex items-center justify-center font-bold text-3xl shadow-md border-4 border-white overflow-hidden relative"
                      style={{ backgroundColor: userProfile.avatarBg || '#7C3AED' }}
                    >
                      {userProfile.avatarUrl ? (
                        <img src={userProfile.avatarUrl} alt={userProfile.fullName} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <span>{userProfile.fullName ? userProfile.fullName.charAt(0) : 'E'}</span>
                      )}
                    </div>
                    {/* Camera Overlay Badge */}
                    <button 
                      type="button" 
                      className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#7C3AED] text-white flex items-center justify-center shadow-lg border-2 border-white hover:bg-[#6D28D9] transition-transform group-hover:scale-110 cursor-pointer"
                      title="Edit Profile Photo"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <h4 className="font-bold text-xl text-[#3a3135]">{userProfile.fullName}</h4>
                    <p className="text-xs text-[#7a6f75] mt-0.5">{userProfile.email} • {userProfile.phone}</p>
                    <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-[#7C3AED] border border-purple-200 mt-2">
                      FemSphere Verified Account
                    </span>
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={() => {
                    setTempAvatarUrl(userProfile.avatarUrl);
                    setTempAvatarBg(userProfile.avatarBg || '#7C3AED');
                    setShowPhotoModal(true);
                  }}
                  className="px-5 py-2.5 bg-white border border-[#EDE9FE] hover:bg-[#F5F3FF] text-[#7C3AED] rounded-2xl font-bold text-xs flex items-center gap-2 shadow-2xs transition-all cursor-pointer shrink-0"
                >
                  <Camera className="w-4 h-4 text-[#7C3AED]" /> Change Profile Photo
                </button>
              </div>

              {!isEditingProfile ? (
                // View Mode
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-5 text-xs">
                    <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE]">
                      <span className="block font-bold text-[#7a6f75] uppercase text-[10px] mb-1">Full Name</span>
                      <p className="font-bold text-[#3a3135] text-base">{userProfile.fullName}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE]">
                      <span className="block font-bold text-[#7a6f75] uppercase text-[10px] mb-1">Date of Birth & Age</span>
                      <p className="font-bold text-[#3a3135] text-base">{userProfile.dob} ({userProfile.age} yrs)</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE]">
                      <span className="block font-bold text-[#7a6f75] uppercase text-[10px] mb-1">Blood Group</span>
                      <p className="font-bold text-[#3a3135] text-base">{userProfile.bloodGroup}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE]">
                      <span className="block font-bold text-[#7a6f75] uppercase text-[10px] mb-1">Height & Weight</span>
                      <p className="font-bold text-[#3a3135] text-base">{userProfile.height} cm / {userProfile.weight} kg</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE]">
                      <span className="block font-bold text-[#7a6f75] uppercase text-[10px] mb-1">Phone Number</span>
                      <p className="font-bold text-[#3a3135] text-base">{userProfile.phone}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE]">
                      <span className="block font-bold text-[#7a6f75] uppercase text-[10px] mb-1">Email Address</span>
                      <p className="font-bold text-[#3a3135] text-base">{userProfile.email}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE] md:col-span-2">
                      <span className="block font-bold text-[#7a6f75] uppercase text-[10px] mb-1">Street Address</span>
                      <p className="font-bold text-[#3a3135] text-base">{userProfile.address}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE] md:col-span-2">
                      <span className="block font-bold text-[#7a6f75] uppercase text-[10px] mb-1">Emergency Contact</span>
                      <p className="font-bold text-[#3a3135] text-base">{userProfile.emergencyContact}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#EDE9FE] flex justify-between items-center">
                    <button 
                      onClick={() => setShowPasswordModal(true)} 
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#EDE9FE] text-xs font-bold text-[#7C3AED] hover:bg-[#F5F3FF]"
                    >
                      <Lock className="w-4 h-4" /> Change Password
                    </button>
                  </div>
                </div>
              ) : (
                // Edit Form Mode
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-[#4a4145] uppercase mb-1">Full Name</label>
                      <input 
                        type="text" 
                        value={editProfileForm.fullName} 
                        onChange={(e) => setEditProfileForm({...editProfileForm, fullName: e.target.value})} 
                        className="w-full p-3 rounded-xl border border-[#EDE9FE]" 
                        required 
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#4a4145] uppercase mb-1">Date of Birth</label>
                      <input 
                        type="date" 
                        value={editProfileForm.dob} 
                        onChange={(e) => setEditProfileForm({...editProfileForm, dob: e.target.value})} 
                        className="w-full p-3 rounded-xl border border-[#EDE9FE]" 
                        required 
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#4a4145] uppercase mb-1">Blood Group</label>
                      <select 
                        value={editProfileForm.bloodGroup} 
                        onChange={(e) => setEditProfileForm({...editProfileForm, bloodGroup: e.target.value})} 
                        className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-white"
                      >
                        <option value="A Positive (A+)">A Positive (A+)</option>
                        <option value="A Negative (A-)">A Negative (A-)</option>
                        <option value="B Positive (B+)">B Positive (B+)</option>
                        <option value="B Negative (B-)">B Negative (B-)</option>
                        <option value="O Positive (O+)">O Positive (O+)</option>
                        <option value="O Negative (O-)">O Negative (O-)</option>
                        <option value="AB Positive (AB+)">AB Positive (AB+)</option>
                        <option value="AB Negative (AB-)">AB Negative (AB-)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-bold text-[#4a4145] uppercase mb-1">Height (cm)</label>
                        <input 
                          type="number" 
                          value={editProfileForm.height} 
                          onChange={(e) => setEditProfileForm({...editProfileForm, height: e.target.value})} 
                          className="w-full p-3 rounded-xl border border-[#EDE9FE]" 
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-[#4a4145] uppercase mb-1">Weight (kg)</label>
                        <input 
                          type="number" 
                          value={editProfileForm.weight} 
                          onChange={(e) => setEditProfileForm({...editProfileForm, weight: e.target.value})} 
                          className="w-full p-3 rounded-xl border border-[#EDE9FE]" 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-[#4a4145] uppercase mb-1">Phone Number</label>
                      <input 
                        type="tel" 
                        value={editProfileForm.phone} 
                        onChange={(e) => setEditProfileForm({...editProfileForm, phone: e.target.value})} 
                        className="w-full p-3 rounded-xl border border-[#EDE9FE]" 
                        required 
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#4a4145] uppercase mb-1">Email Address</label>
                      <input 
                        type="email" 
                        value={editProfileForm.email} 
                        onChange={(e) => setEditProfileForm({...editProfileForm, email: e.target.value})} 
                        className="w-full p-3 rounded-xl border border-[#EDE9FE]" 
                        required 
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block font-bold text-[#4a4145] uppercase mb-1">Street Address</label>
                      <input 
                        type="text" 
                        value={editProfileForm.address} 
                        onChange={(e) => setEditProfileForm({...editProfileForm, address: e.target.value})} 
                        className="w-full p-3 rounded-xl border border-[#EDE9FE]" 
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block font-bold text-[#4a4145] uppercase mb-1">Emergency Contact</label>
                      <input 
                        type="text" 
                        value={editProfileForm.emergencyContact} 
                        onChange={(e) => setEditProfileForm({...editProfileForm, emergencyContact: e.target.value})} 
                        className="w-full p-3 rounded-xl border border-[#EDE9FE]" 
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-3">
                    <button 
                      type="button" 
                      onClick={() => setIsEditingProfile(false)} 
                      className="px-5 py-2.5 rounded-xl border border-[#EDE9FE] font-bold text-xs"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-6 py-2.5 bg-[#7C3AED] text-white rounded-xl font-bold text-xs"
                    >
                      Save Profile Changes
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* 3. TAB: MEDICAL RECORDS */}
          {activeTab === 'Medical Records' && (
            <div className="space-y-8 animate-in fade-in duration-200 font-inter">
              {/* TOP HEADER */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EDE9FE] text-[#7C3AED] uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#7C3AED]" /> AI Medical OCR Engine
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                      AUTO-SCAN ENABLED
                    </span>
                  </div>
                  <h3 className="font-bold text-2xl text-[#3a3135]">Medical Reports Vault & AI Scanner</h3>
                  <p className="text-xs text-[#7a6f75]">Upload lab reports to automatically scan biomakers, track monthly clinical trends, and detect abnormal flags</p>
                </div>
                <button 
                  onClick={() => setShowUploadModal(true)} 
                  className="flex items-center gap-2 px-6 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer shrink-0"
                >
                  <Upload className="w-4 h-4" /> Upload New Medical Report
                </button>
              </div>

              {/* MONTHLY OVERALL HEALTH SUMMARY CARD */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#EDE9FE] pb-4 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#F5F3FF] border border-[#EDE9FE] flex items-center justify-center text-[#7C3AED]">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-[#3a3135]">Monthly Medical Health Summary</h4>
                      <p className="text-xs text-[#7a6f75]">Aggregated diagnostic analysis & biomarker status across scanned reports</p>
                    </div>
                  </div>

                  {/* MONTH SELECTOR DROPDOWN */}
                  <div className="flex items-center gap-2 bg-[#FAF8FC] p-1.5 rounded-2xl border border-[#EDE9FE]">
                    <span className="text-xs font-bold text-[#7a6f75] px-2 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#7C3AED]" /> Month:
                    </span>
                    <select 
                      value={selectedMonthFilter} 
                      onChange={(e) => setSelectedMonthFilter(e.target.value)}
                      className="bg-white border border-[#EDE9FE] rounded-xl px-3 py-1.5 font-bold text-xs text-[#3a3135] focus:outline-hidden cursor-pointer"
                    >
                      <option value="August 2026">August 2026 (Latest)</option>
                      <option value="July 2026">July 2026</option>
                      <option value="June 2026">June 2026</option>
                      <option value="May 2026">May 2026</option>
                      <option value="All Months">All Months Aggregated</option>
                    </select>
                  </div>
                </div>

                {/* MONTHLY SUMMARY METRICS GRID */}
                {(() => {
                  const filteredRecords = selectedMonthFilter === 'All Months' 
                    ? records 
                    : records.filter(r => r.month === selectedMonthFilter || r.date.startsWith(selectedMonthFilter === 'August 2026' ? '2026-08' : selectedMonthFilter === 'July 2026' ? '2026-07' : selectedMonthFilter === 'June 2026' ? '2026-06' : '2026-05'));
                  
                  const scannedCount = filteredRecords.filter(r => r.isScanned).length;
                  const allBiomarkers = filteredRecords.flatMap(r => r.scanResults?.keyBiomarkers || []);
                  const watchCount = allBiomarkers.filter(b => b.status === 'Watch' || b.status === 'Abnormal').length;
                  const optimalCount = allBiomarkers.filter(b => b.status === 'Optimal' || b.status === 'Normal').length;

                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE]">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7a6f75] block mb-1">Scanned Reports</span>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-[#7C3AED]">{scannedCount}</span>
                            <span className="text-xs text-[#7a6f75] font-medium">in {selectedMonthFilter}</span>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE]">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7a6f75] block mb-1">Lab Biomarkers</span>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-emerald-600">{allBiomarkers.length}</span>
                            <span className="text-xs text-[#7a6f75] font-medium">Extracted</span>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE]">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7a6f75] block mb-1">Clinical Status</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {watchCount > 0 ? (
                              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center gap-1">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> {watchCount} Attention Flag
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Optimal Health
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE]">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7a6f75] block mb-1">Monthly Clinical Score</span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-[#3a3135]">{watchCount > 0 ? '88' : '96'}</span>
                            <span className="text-xs font-bold text-[#7a6f75]">/ 100</span>
                          </div>
                        </div>
                      </div>

                      {/* EXECUTIVE SYNTHESIS BOX */}
                      <div className="p-5 rounded-2xl bg-[#F5F3FF] border border-[#EDE9FE] space-y-3">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-xs uppercase tracking-wider text-[#7C3AED] flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-[#7C3AED]" /> Monthly AI Clinical Overview ({selectedMonthFilter})
                          </h5>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#7C3AED] border border-[#EDE9FE]">
                            AI Synthesized Summary
                          </span>
                        </div>

                        <p className="text-xs text-[#3a3135] leading-relaxed">
                          {selectedMonthFilter === 'August 2026' && (
                            <>In <b>August 2026</b>, 1 comprehensive blood panel was scanned. All key biomarkers including Hemoglobin (13.8 g/dL), Fasting Blood Sugar (HbA1c 5.2%), and Thyroid TSH (2.1 mIU/L) are optimal. Serum Vitamin D3 has risen to 34 ng/mL following successful supplementation.</>
                          )}
                          {selectedMonthFilter === 'July 2026' && (
                            <>In <b>July 2026</b>, pelvic imaging & follicular ultrasound was scanned. Results confirm normal endometrial thickness (7.8 mm) and normal ovarian volume without any cysts, fibroids, or structural anomalies.</>
                          )}
                          {selectedMonthFilter === 'June 2026' && (
                            <>In <b>June 2026</b>, nutritional micronutrient testing identified a mild Vitamin D3 deficiency (21 ng/mL). Serum ferritin and B12 levels remained normal. Daily Vitamin D3 2,000 IU was prescribed.</>
                          )}
                          {selectedMonthFilter === 'May 2026' && (
                            <>In <b>May 2026</b>, cardiovascular lipid screening demonstrated excellent cholesterol profiles (HDL 62 mg/dL, Triglycerides 95 mg/dL) and optimal fasting glucose (88 mg/dL).</>
                          )}
                          {selectedMonthFilter === 'All Months' && (
                            <>Across <b>All Uploaded Months</b>, 4 medical reports have been scanned. Total biomarkers tracked: {allBiomarkers.length}. Blood count, thyroid, glycemic profile, and pelvic imaging remain in healthy optimal ranges.</>
                          )}
                        </p>

                        {/* EXTRACTED BIOMARKERS TABLE */}
                        {allBiomarkers.length > 0 && (
                          <div className="pt-2">
                            <h6 className="font-bold text-xs text-[#64595e] uppercase tracking-wider mb-2">Scanned Biomarkers Table ({selectedMonthFilter})</h6>
                            <div className="overflow-x-auto rounded-xl border border-[#EDE9FE] bg-white">
                              <table className="w-full text-left text-xs">
                                <thead className="bg-[#FAF8FC] border-b border-[#EDE9FE] text-[#7a6f75] font-bold text-[11px] uppercase">
                                  <tr>
                                    <th className="p-3">Biomarker / Test</th>
                                    <th className="p-3">Scanned Value</th>
                                    <th className="p-3">Normal Reference Range</th>
                                    <th className="p-3">Status</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-[#EDE9FE] text-[#3a3135]">
                                  {allBiomarkers.map((b, idx) => (
                                    <tr key={idx} className="hover:bg-[#FAF8FC]">
                                      <td className="p-3 font-bold">{b.name}</td>
                                      <td className="p-3 font-semibold">{b.value}</td>
                                      <td className="p-3 text-[#7a6f75]">{b.range}</td>
                                      <td className="p-3">
                                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                                          b.status === 'Optimal' ? 'bg-emerald-100 text-emerald-800' : b.status === 'Normal' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
                                        }`}>
                                          {b.status}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* UPLOADED MEDICAL REPORTS LIST */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-4">
                  <h4 className="font-bold text-lg text-[#3a3135]">Scanned Reports Vault</h4>
                  <span className="text-xs text-[#7a6f75] font-medium">Total Reports: {records.length}</span>
                </div>

                <div className="space-y-4">
                  {records
                    .filter(r => selectedMonthFilter === 'All Months' || r.month === selectedMonthFilter || r.date.startsWith(selectedMonthFilter === 'August 2026' ? '2026-08' : selectedMonthFilter === 'July 2026' ? '2026-07' : selectedMonthFilter === 'June 2026' ? '2026-06' : '2026-05'))
                    .map((r) => (
                      <div key={r.id} className="p-5 rounded-2xl border border-[#EDE9FE] bg-[#FAF8FC] hover:bg-white hover:border-[#7C3AED]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs transition-all shadow-2xs">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-0.5 rounded-md bg-[#EDE9FE] text-[#7C3AED] font-bold text-[10px]">
                              {r.type}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-800 font-bold text-[10px]">
                              {r.category || 'Lab Results'}
                            </span>
                            {r.isScanned ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> AI Scanned & Parsed
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                                Ready for AI Scan
                              </span>
                            )}
                            <span className="text-[10px] text-[#7a6f75] font-bold">Month: {r.month}</span>
                          </div>

                          <h5 className="font-bold text-[#3a3135] text-base">{r.title}</h5>
                          <p className="text-[#64595e] text-xs">{r.description}</p>
                          
                          {r.scanResults && (
                            <p className="text-xs text-[#7C3AED] font-medium bg-[#F5F3FF] p-2.5 rounded-xl border border-[#EDE9FE]">
                              💡 <b>AI Summary:</b> {r.scanResults.aiSummary}
                            </p>
                          )}
                          <p className="text-[10px] text-[#7a6f75]">Uploaded on {r.date} • Size: {r.size}</p>
                        </div>

                        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                          {r.isScanned ? (
                            <button 
                              onClick={() => setViewingScanRecordModal(r)} 
                              className="px-4 py-2.5 bg-[#EDE9FE] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <Eye className="w-3.5 h-3.5" /> View Analysis
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleScanMedicalReport(r.id)} 
                              className="px-4 py-2.5 bg-[#7C3AED] text-white hover:bg-[#6D28D9] font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                            >
                              <Scan className="w-3.5 h-3.5" /> Scan Report
                            </button>
                          )}

                          <button 
                            onClick={() => alert(`Downloading report "${r.title}.${r.type.toLowerCase()}"...`)} 
                            className="p-2.5 bg-[#FAF8FC] text-[#4A3B42] border border-[#EDE9FE] rounded-xl hover:bg-gray-100 transition-colors"
                            title="Download Report"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteRecord(r.id)} 
                            className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                  {records.length === 0 && (
                    <div className="text-center py-12 border border-dashed border-[#EDE9FE] rounded-3xl text-[#7a6f75] text-xs">
                      No medical reports uploaded yet. Click "Upload New Medical Report" above to scan your first lab result.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 4. TAB: HEALTH TRACKER */}
          {activeTab === 'Health Tracker' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#EDE9FE] pb-4 gap-4">
                <div>
                  <h3 className="font-bold text-xl text-[#3a3135]">Health Tracker</h3>
                  <p className="text-xs text-[#7a6f75]">Manually log Food meals, Exercise workouts, Steps count, Water, Sleep, Vitals & Symptoms experienced</p>
                </div>
                <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-[#F5F3FF] text-[#7C3AED] border border-[#EDE9FE] flex items-center gap-1.5 shadow-2xs">
                  <Activity className="w-4 h-4 text-[#7C3AED]" /> Complete Health Logging Mode
                </span>
              </div>

              <div className="space-y-8">
                  {/* Health Input Form */}
                  <form onSubmit={handleSaveTrackerLog} className="bg-[#FAF8FC] p-6 rounded-3xl border border-[#EDE9FE] space-y-6">
                    <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-3">
                      <h4 className="font-bold text-base text-[#3a3135] flex items-center gap-2">
                        <Edit3 className="w-4 h-4 text-[#7C3AED]" />
                        {editingTrackerId ? 'Edit Health Entry' : 'Manual & Watch Health Log Entry'}
                      </h4>
                      <span className="text-xs text-[#7a6f75] font-medium">Date: {new Date().toLocaleDateString()}</span>
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
                              Auto-filled metrics: <b>{smartwatchVitals.heartRate} bpm</b> • <b>{smartwatchVitals.steps} steps</b> • <b>{smartwatchVitals.calories} kcal burned</b> ({smartwatchVitals.battery}% Battery)
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

                    {/* SECTION 1: FOOD & NUTRITION */}
                    <div className="space-y-3">
                      <h5 className="font-bold text-xs uppercase tracking-wider text-[#7C3AED] flex items-center gap-1.5">
                        <Utensils className="w-4 h-4" /> 1. Food & Calorie Intake
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div className="md:col-span-2">
                          <label className="block font-bold text-[#64595e] uppercase mb-1">Food / Meals Logged</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Oatmeal & Fruits (Breakfast), Salad (Lunch), Grilled Salmon (Dinner)" 
                            value={trackerInput.foodMeals} 
                            onChange={(e) => setTrackerInput({...trackerInput, foodMeals: e.target.value})} 
                            className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-white focus:ring-2 focus:ring-[#7C3AED] focus:outline-hidden" 
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-[#64595e] uppercase mb-1">Calorie Intake (kcal)</label>
                          <input 
                            type="number" 
                            placeholder="e.g. 1850" 
                            value={trackerInput.caloriesIntake} 
                            onChange={(e) => setTrackerInput({...trackerInput, caloriesIntake: e.target.value})} 
                            className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-white focus:ring-2 focus:ring-[#7C3AED] focus:outline-hidden" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 2: EXERCISE & FITNESS */}
                    <div className="space-y-3 pt-2">
                      <h5 className="font-bold text-xs uppercase tracking-wider text-[#14B8A6] flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-[#14B8A6]" /> 2. Exercise & Workout
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div>
                          <label className="block font-bold text-[#64595e] uppercase mb-1">Exercise Activity</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Yoga, Morning Jog, Pilates, Gym" 
                            value={trackerInput.exerciseType} 
                            onChange={(e) => setTrackerInput({...trackerInput, exerciseType: e.target.value})} 
                            className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-white focus:ring-2 focus:ring-[#7C3AED] focus:outline-hidden" 
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-[#64595e] uppercase mb-1">Duration (Minutes)</label>
                          <input 
                            type="number" 
                            placeholder="e.g. 35" 
                            value={trackerInput.exercise} 
                            onChange={(e) => setTrackerInput({...trackerInput, exercise: e.target.value})} 
                            className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-white focus:ring-2 focus:ring-[#7C3AED] focus:outline-hidden" 
                            required 
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block font-bold text-[#64595e] uppercase">Calories Burned (kcal)</label>
                            {bluetoothConnected && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Watch Synced
                              </span>
                            )}
                          </div>
                          <input 
                            type="number" 
                            placeholder="e.g. 250" 
                            value={trackerInput.caloriesBurned} 
                            onChange={(e) => setTrackerInput({...trackerInput, caloriesBurned: e.target.value})} 
                            className={`w-full p-3 rounded-xl border bg-white focus:ring-2 focus:ring-[#7C3AED] focus:outline-hidden ${bluetoothConnected ? 'border-emerald-300 bg-emerald-50/30' : 'border-[#EDE9FE]'}`} 
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 3: STEPS & DISTANCE */}
                    <div className="space-y-3 pt-2">
                      <h5 className="font-bold text-xs uppercase tracking-wider text-[#F472B6] flex items-center gap-1.5">
                        <Footprints className="w-4 h-4 text-[#F472B6]" /> 3. Daily Steps & Distance
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block font-bold text-[#64595e] uppercase">Daily Steps Count</label>
                            {bluetoothConnected && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Watch Synced
                              </span>
                            )}
                          </div>
                          <input 
                            type="number" 
                            placeholder="e.g. 8420" 
                            value={trackerInput.steps} 
                            onChange={(e) => setTrackerInput({...trackerInput, steps: e.target.value})} 
                            className={`w-full p-3 rounded-xl border bg-white focus:ring-2 focus:ring-[#7C3AED] focus:outline-hidden ${bluetoothConnected ? 'border-emerald-300 bg-emerald-50/30' : 'border-[#EDE9FE]'}`} 
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block font-bold text-[#64595e] uppercase">Distance (Km)</label>
                            {bluetoothConnected && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Watch Synced
                              </span>
                            )}
                          </div>
                          <input 
                            type="number" 
                            step="0.1" 
                            placeholder="e.g. 5.6" 
                            value={trackerInput.distanceKm} 
                            onChange={(e) => setTrackerInput({...trackerInput, distanceKm: e.target.value})} 
                            className={`w-full p-3 rounded-xl border bg-white focus:ring-2 focus:ring-[#7C3AED] focus:outline-hidden ${bluetoothConnected ? 'border-emerald-300 bg-emerald-50/30' : 'border-[#EDE9FE]'}`} 
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 4: BODY VITALS & LIFESTYLE */}
                    <div className="space-y-3 pt-2">
                      <h5 className="font-bold text-xs uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
                        <HeartPulse className="w-4 h-4 text-purple-700" /> 4. Body Vitals & Lifestyle
                      </h5>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-xs">
                        <div>
                          <label className="block font-bold text-[#64595e] uppercase mb-1">Weight (kg)</label>
                          <input 
                            type="number" 
                            step="0.1" 
                            value={trackerInput.weight} 
                            onChange={(e) => setTrackerInput({...trackerInput, weight: e.target.value})} 
                            className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-white" 
                            required 
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-[#64595e] uppercase mb-1">Water (Liters)</label>
                          <input 
                            type="number" 
                            step="0.1" 
                            value={trackerInput.water} 
                            onChange={(e) => setTrackerInput({...trackerInput, water: e.target.value})} 
                            className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-white" 
                            required 
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-[#64595e] uppercase mb-1">Sleep (Hours)</label>
                          <input 
                            type="number" 
                            step="0.5" 
                            value={trackerInput.sleep} 
                            onChange={(e) => setTrackerInput({...trackerInput, sleep: e.target.value})} 
                            className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-white" 
                            required 
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-[#64595e] uppercase mb-1">Blood Pressure</label>
                          <input 
                            type="text" 
                            placeholder="e.g. 120/78" 
                            value={trackerInput.bloodPressure} 
                            onChange={(e) => setTrackerInput({...trackerInput, bloodPressure: e.target.value})} 
                            className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-white" 
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block font-bold text-[#64595e] uppercase">Heart Rate (bpm)</label>
                            {bluetoothConnected && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                Synced
                              </span>
                            )}
                          </div>
                          <input 
                            type="number" 
                            placeholder="e.g. 72" 
                            value={trackerInput.heartRate} 
                            onChange={(e) => setTrackerInput({...trackerInput, heartRate: e.target.value})} 
                            className={`w-full p-3 rounded-xl border bg-white ${bluetoothConnected ? 'border-emerald-300 bg-emerald-50/30' : 'border-[#EDE9FE]'}`} 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
                        <div>
                          <label className="block font-bold text-[#64595e] uppercase mb-1">Mood / Energy Level</label>
                          <select 
                            value={trackerInput.mood} 
                            onChange={(e) => setTrackerInput({...trackerInput, mood: e.target.value})}
                            className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-white font-medium"
                          >
                            <option value="Energetic">✨ Energetic & Vibrant</option>
                            <option value="Good">😊 Good / Positive</option>
                            <option value="Normal">😐 Normal / Balanced</option>
                            <option value="Tired">😴 Tired / Sleepy</option>
                            <option value="Stressed">😰 Stressed / Anxious</option>
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block font-bold text-[#64595e] uppercase mb-1">Health Notes</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Completed hydration target, felt energized post morning workout..." 
                            value={trackerInput.notes} 
                            onChange={(e) => setTrackerInput({...trackerInput, notes: e.target.value})} 
                            className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-white" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 5: SYMPTOMS LOG */}
                    <div className="space-y-3 pt-2">
                      <h5 className="font-bold text-xs uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-500" /> 5. Symptoms Logged Today
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block font-bold text-[#64595e] uppercase mb-1">Symptom Experienced</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Headache, Fatigue, Abdominal Cramps, Nausea" 
                            value={trackerInput.symptomName} 
                            onChange={(e) => setTrackerInput({...trackerInput, symptomName: e.target.value})} 
                            className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-white focus:ring-2 focus:ring-[#7C3AED]" 
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-[#64595e] uppercase mb-1">Symptom Severity</label>
                          <select 
                            value={trackerInput.symptomSeverity} 
                            onChange={(e) => setTrackerInput({...trackerInput, symptomSeverity: e.target.value})}
                            className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-white font-medium"
                          >
                            <option value="Low">Low Severity</option>
                            <option value="Medium">Medium Severity</option>
                            <option value="High">High Severity</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-[#EDE9FE]">
                      {editingTrackerId && (
                        <button 
                          type="button" 
                          onClick={() => {
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
                              notes: ''
                            });
                          }}
                          className="px-5 py-3 border border-[#EDE9FE] rounded-2xl font-bold text-xs hover:bg-gray-50 cursor-pointer"
                        >
                          Cancel Edit
                        </button>
                      )}
                      <button type="submit" className="px-7 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-2xl text-xs font-bold shadow-md transition-all cursor-pointer">
                        {editingTrackerId ? 'Update Health Record' : 'Save Daily Health Record'}
                      </button>
                    </div>
                  </form>

                  {/* Health History List */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-base text-[#3a3135]">Vitals & Activity History Logs</h4>
                    {trackerLogs.map((log) => (
                      <div key={log.id} className="p-5 rounded-2xl border border-[#EDE9FE] bg-white hover:bg-[#FAF8FC] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs transition-all shadow-2xs">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="font-bold text-[#7C3AED] text-sm bg-[#F5F3FF] px-3 py-1 rounded-xl border border-[#EDE9FE]">
                              {log.date}
                            </span>
                            {log.mood && (
                              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                                Mood: {log.mood}
                              </span>
                            )}
                            {log.steps && (
                              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                                <Footprints className="w-3 h-3 text-emerald-600" /> {log.steps} steps ({log.distanceKm || '4.5'} km)
                              </span>
                            )}
                            {log.symptomName && (
                              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                                log.symptomSeverity === 'High' ? 'bg-red-100 text-red-800 border-red-200' : log.symptomSeverity === 'Medium' ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                              }`}>
                                Symptom: {log.symptomName} ({log.symptomSeverity || 'Low'} Severity)
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1 text-[#3a3135]">
                            <div>💧 Water: <b>{log.water} L</b></div>
                            <div>🌙 Sleep: <b>{log.sleep} hrs</b></div>
                            <div>🏃 Exercise: <b>{log.exercise} mins</b> ({log.exerciseType || 'Workout'})</div>
                            <div>🔥 Calories: <b>{log.caloriesBurned || '200'} kcal</b></div>
                          </div>

                          {log.foodMeals && (
                            <p className="text-xs text-[#64595e]">
                              🥗 <b>Meals:</b> {log.foodMeals} {log.caloriesIntake ? `(${log.caloriesIntake} kcal)` : ''}
                            </p>
                          )}

                          {(log.bloodPressure || log.heartRate) && (
                            <p className="text-xs text-[#7a6f75]">
                              🩺 <b>Vitals:</b> BP {log.bloodPressure || '118/76'} • Heart Rate {log.heartRate || '72'} bpm • Weight {log.weight} kg
                            </p>
                          )}

                          {log.notes && <p className="text-xs text-[#7a6f75] italic">"{log.notes}"</p>}
                        </div>

                        <div className="flex items-center gap-2 self-end md:self-center">
                          <button onClick={() => handleEditTrackerLog(log)} className="px-3.5 py-2 bg-[#EDE9FE] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white font-bold rounded-xl transition-all cursor-pointer">
                            Edit
                          </button>
                          <button onClick={() => handleDeleteTrackerLog(log.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer" title="Delete Log">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
            </div>
          )}

          {/* 6. TAB: APPOINTMENTS */}
          {activeTab === 'Appointments' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-4">
                <div>
                  <h3 className="font-bold text-xl text-[#3a3135]">Appointments Management</h3>
                  <p className="text-xs text-[#7a6f75]">Book doctor consultations and review appointment history</p>
                </div>
                <button 
                  onClick={() => setShowBookModal(true)} 
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#7C3AED] text-white rounded-xl font-bold text-xs shadow-xs"
                >
                  <Plus className="w-4 h-4" /> Book Appointment
                </button>
              </div>

              {/* Appointments List */}
              <div className="space-y-3">
                {appointments.map((a) => (
                  <div key={a.id} className="p-4.5 rounded-2xl border border-[#EDE9FE] bg-[#FAF8FC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          a.status === 'Scheduled' ? 'bg-purple-100 text-[#7C3AED]' : a.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                        }`}>
                          {a.status}
                        </span>
                        <p className="font-bold text-[#3a3135] text-sm">{a.doctor}</p>
                      </div>
                      <p className="text-[#64595e]">Reason: {a.reason}</p>
                      <p className="text-[10px] text-[#7a6f75]">Date: {a.date} at {a.time}</p>
                    </div>

                    {a.status === 'Scheduled' && (
                      <button 
                        onClick={() => handleCancelAppointment(a.id)} 
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors"
                      >
                        Cancel Appointment
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. TAB: HEALTH REPORTS */}
          {activeTab === 'Health Reports' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-4">
                <div>
                  <h3 className="font-bold text-xl text-[#3a3135]">Health Reports Generator</h3>
                  <p className="text-xs text-[#7a6f75]">Consolidate personal profile, health vitals, symptoms, medical records & appointments into a PDF report</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowReportPreview(true)} 
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#EDE9FE] text-[#7C3AED] rounded-xl text-xs font-bold"
                  >
                    <Eye className="w-4 h-4" /> View Report
                  </button>
                  <button 
                    onClick={handlePrintPDFReport} 
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#7C3AED] text-white rounded-xl text-xs font-bold"
                  >
                    <Printer className="w-4 h-4" /> Download PDF Report
                  </button>
                </div>
              </div>

              {/* REPORT PREVIEW CONTAINER */}
              <div className="bg-[#FAF8FC] p-6 rounded-3xl border border-[#EDE9FE] space-y-6 text-xs font-inter">
                <div className="flex justify-between items-center pb-4 border-b border-[#EDE9FE]">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#7C3AED]">FemSphere Health Report</h2>
                    <p className="text-xs text-[#7a6f75]">Generated on {new Date().toLocaleDateString()} for {userProfile.fullName}</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">
                    OFFICIAL REPORT
                  </span>
                </div>

                {/* 1. Personal Profile Section */}
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-[#3a3135] uppercase tracking-wider">1. Personal Profile</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3.5 bg-white rounded-xl border border-[#EDE9FE]">
                    <div><span className="text-[#7a6f75]">Name:</span> <b>{userProfile.fullName}</b></div>
                    <div><span className="text-[#7a6f75]">DOB:</span> <b>{userProfile.dob}</b></div>
                    <div><span className="text-[#7a6f75]">Blood Group:</span> <b>{userProfile.bloodGroup}</b></div>
                    <div><span className="text-[#7a6f75]">Height/Weight:</span> <b>{userProfile.height}cm / {userProfile.weight}kg</b></div>
                  </div>
                </div>

                {/* 2. Health Tracker Summary */}
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-[#3a3135] uppercase tracking-wider">2. Health Vitals Summary (Latest Entry)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3.5 bg-white rounded-xl border border-[#EDE9FE]">
                    <div><span className="text-[#7a6f75]">Water Intake:</span> <b>{trackerLogs[0]?.water || 0} L</b></div>
                    <div><span className="text-[#7a6f75]">Sleep Duration:</span> <b>{trackerLogs[0]?.sleep || 0} hrs</b></div>
                    <div><span className="text-[#7a6f75]">Exercise:</span> <b>{trackerLogs[0]?.exercise || 0} mins</b></div>
                    <div><span className="text-[#7a6f75]">Blood Pressure:</span> <b>{trackerLogs[0]?.bloodPressure || '120/78'}</b></div>
                  </div>
                </div>

                {/* 3. Symptom History */}
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-[#3a3135] uppercase tracking-wider">3. Logged Symptom History</h4>
                  <div className="space-y-2">
                    {symptomLogs.map((s) => (
                      <div key={s.id} className="p-3 bg-white rounded-xl border border-[#EDE9FE] flex justify-between">
                        <span><b>{s.symptomName}</b> ({s.description})</span>
                        <span className="font-bold text-[#7C3AED]">{s.severity} • {s.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Medical Records Summary */}
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-[#3a3135] uppercase tracking-wider">4. Medical Records Vault</h4>
                  <div className="space-y-2">
                    {records.map((r) => (
                      <div key={r.id} className="p-3 bg-white rounded-xl border border-[#EDE9FE] flex justify-between">
                        <span><b>{r.title}</b> ({r.type})</span>
                        <span className="text-[#7a6f75]">{r.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Appointment History */}
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-[#3a3135] uppercase tracking-wider">5. Appointment History</h4>
                  <div className="space-y-2">
                    {appointments.map((a) => (
                      <div key={a.id} className="p-3 bg-white rounded-xl border border-[#EDE9FE] flex justify-between">
                        <span><b>{a.doctor}</b> - {a.reason}</span>
                        <span className="font-bold text-purple-700">{a.status} ({a.date})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 8. TAB: NOTIFICATIONS */}
          {activeTab === 'Notifications' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-4">
                <div>
                  <h3 className="font-bold text-xl text-[#3a3135]">System Notifications</h3>
                  <p className="text-xs text-[#7a6f75]">Appointment reminders, medical record updates and report alerts</p>
                </div>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllNotificationsRead} 
                    className="text-xs font-bold text-[#7C3AED] hover:underline"
                  >
                    Mark All as Read
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {notifications.map((n) => (
                  <div 
                    key={n.id} 
                    className={`p-4 rounded-2xl border flex items-center justify-between gap-4 text-xs transition-all ${
                      n.read ? 'bg-white border-[#EDE9FE]' : 'bg-[#F5F3FF] border-[#7C3AED]/30 font-semibold'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-[#7C3AED]" />
                        <p className="font-bold text-[#3a3135] text-sm">{n.title}</p>
                      </div>
                      <p className="text-[#64595e]">{n.message}</p>
                      <p className="text-[10px] text-[#7a6f75]">{n.time}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {!n.read && (
                        <button 
                          onClick={() => markNotificationRead(n.id)} 
                          className="px-3 py-1.5 bg-[#EDE9FE] text-[#7C3AED] font-bold rounded-lg"
                        >
                          Mark Read
                        </button>
                      )}
                      <button 
                        onClick={() => deleteNotification(n.id)} 
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {notifications.length === 0 && (
                  <div className="text-center py-10 text-[#7a6f75] text-xs">
                    No notifications available.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 9. TAB: SETTINGS */}
          {activeTab === 'Settings' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6 max-w-2xl mx-auto">
              <div className="border-b border-[#EDE9FE] pb-4">
                <h3 className="font-bold text-xl text-[#3a3135]">Account & System Settings</h3>
                <p className="text-xs text-[#7a6f75]">Manage notifications, security credentials & preferences</p>
              </div>

              <div className="space-y-6 text-xs">
                {/* Email Notifications Toggle */}
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-[#3a3135]">Notification Preferences</h4>
                  
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE]">
                    <div>
                      <p className="font-bold text-[#3a3135]">Email Notifications</p>
                      <p className="text-[#7a6f75] text-[11px]">Receive appointment confirmations & health report alerts via email</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={settings.emailAlerts} 
                      onChange={(e) => setSettings({...settings, emailAlerts: e.target.checked})} 
                      className="w-5 h-5 text-[#7C3AED] rounded border-[#EDE9FE] focus:ring-[#7C3AED]"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE]">
                    <div>
                      <p className="font-bold text-[#3a3135]">SMS Health Reminders</p>
                      <p className="text-[#7a6f75] text-[11px]">Receive daily vital logging reminders on mobile</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={settings.smsAlerts} 
                      onChange={(e) => setSettings({...settings, smsAlerts: e.target.checked})} 
                      className="w-5 h-5 text-[#7C3AED] rounded border-[#EDE9FE] focus:ring-[#7C3AED]"
                    />
                  </div>
                </div>

                {/* Password & Credentials */}
                <div className="pt-4 border-t border-[#EDE9FE] space-y-3">
                  <h4 className="font-bold text-sm text-[#3a3135]">Security & Password</h4>
                  <button 
                    onClick={() => setShowPasswordModal(true)} 
                    className="px-5 py-2.5 rounded-xl border border-[#EDE9FE] text-xs font-bold text-[#7C3AED] hover:bg-[#F5F3FF] flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" /> Change Account Password
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* --- MODALS --- */}

      {/* 1. UPLOAD MEDICAL RECORD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#EDE9FE] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#EDE9FE]">
              <h3 className="font-bold text-base text-[#3a3135]">Upload Medical Report</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-[#7a6f75] hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadRecord} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Report Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Lipid Profile Lab Test" 
                  value={newRecord.title} 
                  onChange={(e) => setNewRecord({...newRecord, title: e.target.value})} 
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE]" 
                  required 
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Report Type</label>
                <select 
                  value={newRecord.type} 
                  onChange={(e) => setNewRecord({...newRecord, type: e.target.value})} 
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE] bg-white font-medium"
                >
                  <option value="PDF">PDF Document</option>
                  <option value="JPG">JPG Image Scan</option>
                  <option value="PNG">PNG Image Scan</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Select File (PDF, JPG, PNG)</label>
                <input 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setNewRecord({...newRecord, fileName: e.target.files?.[0]?.name || ''})}
                  className="w-full text-xs text-[#7a6f75] file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#EDE9FE] file:text-[#7C3AED]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Description</label>
                <input 
                  type="text" 
                  placeholder="e.g. Routine blood analysis from Lab Diagnostics" 
                  value={newRecord.description} 
                  onChange={(e) => setNewRecord({...newRecord, description: e.target.value})} 
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE]" 
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-2.5 bg-[#7C3AED] text-white font-bold rounded-xl">
                  Upload Record
                </button>
                <button type="button" onClick={() => setShowUploadModal(false)} className="py-2.5 px-4 border rounded-xl font-bold">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. BOOK APPOINTMENT MODAL */}
      {showBookModal && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#EDE9FE] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#EDE9FE]">
              <h3 className="font-bold text-base text-[#3a3135]">Book Doctor Appointment</h3>
              <button onClick={() => setShowBookModal(false)} className="text-[#7a6f75] hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookAppointment} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Select Doctor</label>
                <select 
                  value={newAppointment.doctor} 
                  onChange={(e) => setNewAppointment({...newAppointment, doctor: e.target.value})} 
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE] bg-white font-medium"
                >
                  <option value="Dr. Sarah Jenkins (OB/GYN)">Dr. Sarah Jenkins (Obstetrics & Gynecology)</option>
                  <option value="Dr. Priya Sharma (Maternal-Fetal)">Dr. Priya Sharma (Maternal-Fetal Specialist)</option>
                  <option value="Dr. Amanda Vance (Reproductive Endocrine)">Dr. Amanda Vance (Reproductive Specialist)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Appointment Date</label>
                <input 
                  type="date" 
                  value={newAppointment.date} 
                  onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})} 
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE]" 
                  required 
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Appointment Time</label>
                <select 
                  value={newAppointment.time} 
                  onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})} 
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE] bg-white font-medium"
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Reason for Visit</label>
                <input 
                  type="text" 
                  placeholder="e.g. Reproductive health checkup & vitals review" 
                  value={newAppointment.reason} 
                  onChange={(e) => setNewAppointment({...newAppointment, reason: e.target.value})} 
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE]" 
                  required 
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-2.5 bg-[#7C3AED] text-white font-bold rounded-xl">
                  Confirm Booking
                </button>
                <button type="button" onClick={() => setShowBookModal(false)} className="py-2.5 px-4 border rounded-xl font-bold">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#EDE9FE] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#EDE9FE]">
              <h3 className="font-bold text-base text-[#3a3135]">Change Account Password</h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-[#7a6f75] hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            {passwordMsg && (
              <div className={`p-3 rounded-xl text-xs font-bold ${passwordMsg.includes('successfully') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                {passwordMsg}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Old Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••••••" 
                  value={passwordData.oldPassword} 
                  onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})} 
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE]" 
                  required 
                />
              </div>

              <div>
                <label className="block font-bold mb-1">New Password</label>
                <input 
                  type="password" 
                  placeholder="Enter new password" 
                  value={passwordData.newPassword} 
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} 
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE]" 
                  required 
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Confirm New Password</label>
                <input 
                  type="password" 
                  placeholder="Confirm new password" 
                  value={passwordData.confirmPassword} 
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} 
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE]" 
                  required 
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-2.5 bg-[#7C3AED] text-white font-bold rounded-xl">
                  Update Password
                </button>
                <button type="button" onClick={() => setShowPasswordModal(false)} className="py-2.5 px-4 border rounded-xl font-bold">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. HEALTH REPORT FULL PREVIEW MODAL */}
      {showReportPreview && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#EDE9FE] shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#EDE9FE]">
              <h3 className="font-bold text-lg text-[#3a3135]">Generated Health Report Preview</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePrintPDFReport} 
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#7C3AED] text-white rounded-xl text-xs font-bold"
                >
                  <Printer className="w-4 h-4" /> Download / Print PDF
                </button>
                <button onClick={() => setShowReportPreview(false)} className="text-[#7a6f75] hover:text-black">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-5 text-xs">
              <div className="p-4 bg-[#FAF8FC] rounded-2xl border border-[#EDE9FE]">
                <h4 className="font-bold text-sm text-[#7C3AED] mb-2">1. Personal Profile</h4>
                <p><b>Name:</b> {userProfile.fullName} | <b>DOB:</b> {userProfile.dob} ({userProfile.age} yrs)</p>
                <p><b>Blood Group:</b> {userProfile.bloodGroup} | <b>Height/Weight:</b> {userProfile.height}cm / {userProfile.weight}kg</p>
                <p><b>Contact:</b> {userProfile.phone} | {userProfile.email}</p>
              </div>

              <div className="p-4 bg-[#FAF8FC] rounded-2xl border border-[#EDE9FE]">
                <h4 className="font-bold text-sm text-[#7C3AED] mb-2">2. Health Vitals Log</h4>
                <p><b>Latest Weight:</b> {trackerLogs[0]?.weight} kg | <b>Water:</b> {trackerLogs[0]?.water} L | <b>Sleep:</b> {trackerLogs[0]?.sleep} hrs</p>
                <p><b>Exercise:</b> {trackerLogs[0]?.exercise} mins | <b>Blood Pressure:</b> {trackerLogs[0]?.bloodPressure || '120/78'}</p>
              </div>

              <div className="p-4 bg-[#FAF8FC] rounded-2xl border border-[#EDE9FE]">
                <h4 className="font-bold text-sm text-[#7C3AED] mb-2">3. Symptom History</h4>
                {symptomLogs.map(s => (
                  <p key={s.id}>• <b>{s.symptomName}</b> ({s.severity} severity) - {s.description} [{s.date}]</p>
                ))}
              </div>

              <div className="p-4 bg-[#FAF8FC] rounded-2xl border border-[#EDE9FE]">
                <h4 className="font-bold text-sm text-[#7C3AED] mb-2">4. Medical Vault Records</h4>
                {records.map(r => (
                  <p key={r.id}>• <b>{r.title}</b> ({r.type}) - {r.description} [{r.date}]</p>
                ))}
              </div>

              <div className="p-4 bg-[#FAF8FC] rounded-2xl border border-[#EDE9FE]">
                <h4 className="font-bold text-sm text-[#7C3AED] mb-2">5. Appointments Summary</h4>
                {appointments.map(a => (
                  <p key={a.id}>• <b>{a.doctor}</b> - {a.reason} [{a.status} on {a.date} at {a.time}]</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BLUETOOTH PAIRING & SYNC MODAL */}
      {showBluetoothModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-inter animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-[#EDE9FE] space-y-6">
            <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center border border-[#EDE9FE]">
                  <Bluetooth className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-[#3a3135]">Bluetooth Smartwatch Pairing</h3>
                  <p className="text-xs text-[#7a6f75]">Connect wearable fitness trackers & Apple Watch</p>
                </div>
              </div>
              <button onClick={() => setShowBluetoothModal(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* STATUS BANNER */}
            {bluetoothConnected ? (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    <div>
                      <span className="font-bold text-base block">{connectedDevice}</span>
                      <span className="text-xs text-emerald-700 font-medium">Status: Live Streaming Connected</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-200 text-emerald-800 flex items-center gap-1">
                    <Battery className="w-3.5 h-3.5" /> {smartwatchVitals.battery}%
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-1 text-center">
                  <div className="bg-white/80 p-3 rounded-2xl border border-emerald-100 shadow-2xs">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block">Heart Rate</span>
                    <span className="text-lg font-bold text-emerald-900">{smartwatchVitals.heartRate} <span className="text-xs font-normal">bpm</span></span>
                  </div>
                  <div className="bg-white/80 p-3 rounded-2xl border border-emerald-100 shadow-2xs">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block">SpO2 Oxygen</span>
                    <span className="text-lg font-bold text-emerald-900">{smartwatchVitals.spO2}%</span>
                  </div>
                  <div className="bg-white/80 p-3 rounded-2xl border border-emerald-100 shadow-2xs">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block">Body Temp</span>
                    <span className="text-lg font-bold text-emerald-900">{smartwatchVitals.bodyTemp}°C</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button 
                    onClick={handleSyncWatchVitals} 
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" /> Sync Vitals to Health Tracker
                  </button>
                  <button 
                    onClick={handleDisconnectBluetooth} 
                    className="px-4 py-3 bg-white text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Watch className="w-6 h-6 text-[#7C3AED]" />
                    <div>
                      <p className="font-bold text-sm text-[#3a3135]">Scan Nearby Bluetooth Wearables</p>
                      <p className="text-xs text-[#7a6f75]">Enable Bluetooth on Apple Watch, Fitbit, or Garmin</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleScanBluetoothDevices} 
                    disabled={isScanning}
                    className="px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-bold text-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                    {isScanning ? 'Scanning...' : 'Scan Devices'}
                  </button>
                </div>

                {/* DISCOVERED DEVICES */}
                <div className="space-y-2">
                  <p className="text-xs uppercase font-bold tracking-wider text-[#7a6f75]">Discovered Devices ({foundDevices.length})</p>
                  
                  {isScanning ? (
                    <div className="p-8 text-center space-y-3 border border-dashed border-[#EDE9FE] rounded-2xl">
                      <div className="w-10 h-10 rounded-full border-4 border-[#7C3AED] border-t-transparent animate-spin mx-auto"></div>
                      <p className="text-xs text-[#7a6f75] font-medium">Searching for Bluetooth Low Energy (BLE 5.3) fitness trackers & smartwatches...</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {foundDevices.map((dev, idx) => (
                        <div key={idx} className="p-3.5 rounded-2xl border border-[#EDE9FE] bg-white hover:bg-[#F5F3FF] flex items-center justify-between transition-colors">
                          <div className="flex items-center gap-3">
                            <Watch className="w-5 h-5 text-[#7C3AED]" />
                            <div>
                              <p className="font-bold text-sm text-[#3a3135]">{dev.name}</p>
                              <p className="text-xs text-[#7a6f75]">{dev.type} • Signal: {dev.rssi} dBm • Battery: {dev.battery}%</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handlePairDevice(dev.name)} 
                            className="px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                          >
                            Pair & Connect
                          </button>
                        </div>
                      ))}

                      {foundDevices.length === 0 && !isScanning && (
                        <div className="p-6 text-center text-xs text-[#7a6f75] bg-[#FAF8FC] rounded-2xl border border-[#EDE9FE]">
                          Click <span className="font-bold text-[#7C3AED]">Scan Devices</span> to discover nearby Apple Watch, Fitbit, Samsung Galaxy Watch, or Garmin devices.
                        </div>
                      )}
                    </div>
                  )}
                </div>
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

      {/* 5. AI DOCUMENT SCANNING PROGRESS MODAL */}
      {isScanningDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-[#EDE9FE] shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-3xl bg-[#F5F3FF] border border-[#EDE9FE] mx-auto flex items-center justify-center text-[#7C3AED]">
              <Scan className="w-8 h-8 text-[#7C3AED] animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                AI OCR Clinical Engine
              </span>
              <h3 className="font-bold text-xl text-[#3a3135]">Scanning Medical Report</h3>
              <p className="text-xs text-[#7a6f75]">Parsing biomarker values from <b>"{scanningRecordTitle}"</b>...</p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="w-full h-3 rounded-full bg-[#FAF8FC] border border-[#EDE9FE] overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#7C3AED] to-purple-500 rounded-full transition-all duration-300"
                  style={{ width: `${scanningProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] font-bold text-[#7a6f75]">
                <span>Extracting Reference Ranges</span>
                <span>{scanningProgress}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. DETAILED SCANNED REPORT MODAL */}
      {viewingScanRecordModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-inter overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full border border-[#EDE9FE] shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#EDE9FE]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#F5F3FF] border border-[#EDE9FE] flex items-center justify-center text-[#7C3AED]">
                  <FileCheck className="w-5 h-5 text-[#7C3AED]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#3a3135]">{viewingScanRecordModal.title}</h3>
                  <p className="text-xs text-[#7a6f75]">Scanned on {viewingScanRecordModal.date} • {viewingScanRecordModal.month}</p>
                </div>
              </div>
              <button 
                onClick={() => setViewingScanRecordModal(null)}
                className="p-2 rounded-xl text-[#7a6f75] hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Clinical Overview & Doctor Info */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#FAF8FC] border border-[#EDE9FE]">
                <span className="text-[10px] font-bold text-[#7a6f75] uppercase block">Ordering Doctor</span>
                <span className="font-bold text-[#3a3135]">{viewingScanRecordModal.scanResults?.doctorName || 'Dr. Sarah Jenkins, MD'}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF8FC] border border-[#EDE9FE]">
                <span className="text-[10px] font-bold text-[#7a6f75] uppercase block">Diagnostic Lab</span>
                <span className="font-bold text-[#3a3135]">{viewingScanRecordModal.scanResults?.labName || 'Quest Diagnostics'}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF8FC] border border-[#EDE9FE] col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold text-[#7a6f75] uppercase block">Risk Level</span>
                <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px] inline-block mt-0.5">
                  {viewingScanRecordModal.scanResults?.riskLevel || 'Optimal Health'}
                </span>
              </div>
            </div>

            {/* AI Summary Banner */}
            <div className="p-4 rounded-2xl bg-[#F5F3FF] border border-[#EDE9FE] text-xs space-y-1">
              <span className="font-bold text-[#7C3AED] uppercase tracking-wider text-[10px] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" /> AI Diagnostic Summary
              </span>
              <p className="text-[#3a3135] leading-relaxed">
                {viewingScanRecordModal.scanResults?.aiSummary}
              </p>
            </div>

            {/* Biomarkers Table */}
            {viewingScanRecordModal.scanResults?.keyBiomarkers && (
              <div className="space-y-2 text-xs">
                <h5 className="font-bold text-[#3a3135]">Extracted Biomarkers & Test Results</h5>
                <div className="overflow-x-auto rounded-xl border border-[#EDE9FE]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF8FC] border-b border-[#EDE9FE] text-[#7a6f75] font-bold text-[10px] uppercase">
                      <tr>
                        <th className="p-2.5">Biomarker</th>
                        <th className="p-2.5">Value</th>
                        <th className="p-2.5">Reference Range</th>
                        <th className="p-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EDE9FE]">
                      {viewingScanRecordModal.scanResults.keyBiomarkers.map((b: any, idx: number) => (
                        <tr key={idx}>
                          <td className="p-2.5 font-bold text-[#3a3135]">{b.name}</td>
                          <td className="p-2.5 font-semibold">{b.value}</td>
                          <td className="p-2.5 text-[#7a6f75]">{b.range}</td>
                          <td className="p-2.5">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              b.status === 'Optimal' ? 'bg-emerald-100 text-emerald-800' : b.status === 'Normal' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="p-3.5 rounded-xl bg-[#FAF8FC] border border-[#EDE9FE] text-xs">
              <span className="font-bold text-[#64595e] uppercase block text-[10px] mb-1">Clinical Recommendations</span>
              <p className="text-[#3a3135]">{viewingScanRecordModal.scanResults?.recommendations}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#EDE9FE]">
              <button 
                onClick={() => setViewingScanRecordModal(null)} 
                className="px-5 py-2.5 bg-[#7C3AED] text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer"
              >
                Close Analysis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. CHANGE PROFILE PHOTO MODAL */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-[#EDE9FE] shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE]">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#7C3AED]" />
                <h3 className="font-bold text-lg text-[#3a3135]">Edit Profile Photo</h3>
              </div>
              <button onClick={() => setShowPhotoModal(false)} className="text-[#7a6f75] hover:text-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfilePhoto} className="space-y-6 text-xs">
              {/* LIVE AVATAR PREVIEW */}
              <div className="text-center space-y-3">
                <div 
                  className="w-28 h-28 rounded-full text-white mx-auto flex items-center justify-center font-bold text-4xl shadow-lg border-4 border-white overflow-hidden relative"
                  style={{ backgroundColor: tempAvatarBg }}
                >
                  {tempAvatarUrl ? (
                    <img src={tempAvatarUrl} alt="Preview" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span>{userProfile.fullName ? userProfile.fullName.charAt(0) : 'E'}</span>
                  )}
                </div>
                <p className="text-[11px] text-[#7a6f75] font-medium">Avatar Photo Preview</p>
              </div>

              {/* UPLOAD FILE */}
              <div className="space-y-2">
                <label className="block font-bold text-[#3a3135] uppercase text-[10px]">1. Upload Photo File (JPG, PNG)</label>
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFilePhotoChange}
                  className="w-full text-xs text-[#7a6f75] file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#EDE9FE] file:text-[#7C3AED] hover:file:bg-[#7C3AED] hover:file:text-white transition-colors cursor-pointer"
                />
              </div>

              {/* PRESET BG COLORS */}
              <div className="space-y-2">
                <label className="block font-bold text-[#3a3135] uppercase text-[10px]">2. Choose Theme Accent Color</label>
                <div className="flex items-center justify-center gap-3">
                  {['#7C3AED', '#14B8A6', '#EC4899', '#F59E0B', '#4F46E5', '#10B981'].map((c) => (
                    <button 
                      key={c}
                      type="button"
                      onClick={() => setTempAvatarBg(c)}
                      className={`w-8 h-8 rounded-full transition-transform cursor-pointer border-2 ${
                        tempAvatarBg === c ? 'scale-125 border-slate-900 shadow-md' : 'border-transparent hover:scale-110'
                      }`}
                      style={{ backgroundColor: c }}
                    ></button>
                  ))}
                </div>
              </div>

              {tempAvatarUrl && (
                <button 
                  type="button" 
                  onClick={() => setTempAvatarUrl(null)} 
                  className="w-full py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                >
                  Remove Uploaded Image & Revert to Initials
                </button>
              )}

              <div className="flex gap-3 pt-3 border-t border-[#EDE9FE]">
                <button 
                  type="button" 
                  onClick={() => setShowPhotoModal(false)} 
                  className="flex-1 py-3 border border-[#EDE9FE] rounded-xl font-bold text-xs hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
