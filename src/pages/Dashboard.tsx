import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, Activity, Heart, Droplet, Moon, Flame, Brain, 
  Calendar, ArrowUp, AlertCircle, User, FileText, 
  Share2, LogOut, CheckCircle2, Search, Bell, Upload, Download, 
  Trash2, Plus, X, Lock, Check, Clock
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');

  // User Profile State
  const [userProfile, setUserProfile] = useState({
    name: 'Elena Rostova',
    dob: '1996-08-14',
    bloodGroup: 'A Positive (A+)',
    height: '168',
    weight: '62',
    contact: '+1 (555) 382-9102',
    email: 'elena.rostova@femsphere.health',
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Medical Records State
  const [records, setRecords] = useState([
    { id: 'REC-01', name: 'Q3_Longitudinal_Blood_Test.pdf', type: 'PDF', date: '2026-07-28', size: '2.4 MB' },
    { id: 'REC-02', name: 'Ultrasound_Scan_Pelvic.png', type: 'PNG', date: '2026-06-15', size: '4.1 MB' },
  ]);
  const [uploadFileName, setUploadFileName] = useState('');

  // Health Tracker State
  const [trackerInput, setTrackerInput] = useState({ weight: '62', water: '1.5', sleep: '7', exercise: '20' });
  const [trackerLogs, setTrackerLogs] = useState([
    { date: '2026-07-29', weight: '62 kg', water: '1.5 L', sleep: '7 hrs', exercise: '20 mins' },
    { date: '2026-07-28', weight: '62.5 kg', water: '2.0 L', sleep: '8 hrs', exercise: '30 mins' },
  ]);

  // Symptom Tracker State
  const [symptomInput, setSymptomInput] = useState({ symptom: 'Mild Fatigue', severity: 'Low', date: '2026-07-29', notes: 'Phase 3 cycle mild tiredness' });
  const [symptomLogs, setSymptomLogs] = useState([
    { id: 'SYM-01', symptom: 'Mild Fatigue', severity: 'Low', date: '2026-07-29', notes: 'Phase 3 cycle mild tiredness' },
    { id: 'SYM-02', symptom: 'Headache', severity: 'Moderate', date: '2026-07-25', notes: 'Hydration related' },
  ]);

  // Appointments State
  const [appointments, setAppointments] = useState([
    { id: 'APT-01', doctor: 'Dr. Sarah Jenkins', date: '2026-07-31', time: '10:00 AM', reason: 'Routine Health Twin Review', status: 'Scheduled' },
  ]);
  const [newAppointment, setNewAppointment] = useState({ doctor: 'Dr. Sarah Jenkins', date: '', time: '10:00 AM', reason: '' });
  const [showBookModal, setShowBookModal] = useState(false);

  // Share Report State
  const [selectedDoctorToShare, setSelectedDoctorToShare] = useState('Dr. Sarah Jenkins');
  const [isReportShared, setIsReportShared] = useState(true);

  // Rule-based AI Recommendation logic
  const waterVal = parseFloat(trackerInput.water) || 0;
  const sleepVal = parseFloat(trackerInput.sleep) || 0;
  const exerciseVal = parseFloat(trackerInput.exercise) || 0;

  const aiRecommendations = [
    ...(waterVal < 2.0 ? ['Drink more water (Target: 2.5L daily)'] : ['Hydration optimal!']),
    ...(sleepVal < 8.0 ? ['Sleep at least 8 hours for cellular recovery'] : ['Sleep schedule well balanced']),
    ...(exerciseVal < 30 ? ['Walk 30 minutes daily to maintain cardiac score'] : ['Exercise goal achieved!']),
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  // Record Upload
  const handleUploadRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName) return;
    const ext = uploadFileName.split('.').pop()?.toUpperCase() || 'PDF';
    setRecords([
      { id: `REC-0${records.length + 1}`, name: uploadFileName, type: ext, date: '2026-07-30', size: '1.8 MB' },
      ...records
    ]);
    setUploadFileName('');
  };

  const deleteRecord = (id: string) => {
    setRecords(records.filter(r => r.id !== id));
  };

  // Tracker Submission
  const handleAddTrackerLog = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackerLogs([
      { date: '2026-07-30', weight: `${trackerInput.weight} kg`, water: `${trackerInput.water} L`, sleep: `${trackerInput.sleep} hrs`, exercise: `${trackerInput.exercise} mins` },
      ...trackerLogs
    ]);
  };

  // Symptom Submission
  const handleAddSymptom = (e: React.FormEvent) => {
    e.preventDefault();
    setSymptomLogs([
      { id: `SYM-0${symptomLogs.length + 1}`, ...symptomInput },
      ...symptomLogs
    ]);
  };

  // Appointment Submission
  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppointment.date) return;
    setAppointments([
      ...appointments,
      { id: `APT-0${appointments.length + 1}`, ...newAppointment, status: 'Scheduled' }
    ]);
    setShowBookModal(false);
  };

  const cancelAppointment = (id: string) => {
    setAppointments(appointments.filter(a => a.id !== id));
  };

  // Share Report
  const handleShareReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsReportShared(true);
    alert(`Health report successfully shared with ${selectedDoctorToShare}!`);
  };

  return (
    <div className="min-h-screen bg-[#fbf9f6] flex font-sans text-[#3a3135]">
      
      {/* Sidebar - User */}
      <aside className="w-68 bg-white border-r border-[#EDE9FE] hidden lg:flex flex-col flex-shrink-0 sticky top-0 h-screen">
        <div className="p-6 border-b border-[#EDE9FE] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-[#7C3AED] tracking-tight">FemSphere</h1>
            <Sparkles className="w-4 h-4 text-[#14B8A6]" />
          </Link>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EDE9FE] text-[#7C3AED] uppercase">
            USER
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-hide">
          <p className="text-[10px] uppercase tracking-widest text-[#a89cb5] font-bold px-3 py-2 mt-2">Main</p>
          
          <button onClick={() => setActiveTab('Overview')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === 'Overview' ? 'bg-[#F5F3FF] text-[#7C3AED]' : 'text-[#7a6f75] hover:bg-[#faf9fc]'}`}>
            <Activity className="w-4 h-4 text-[#7C3AED]" /> Dashboard Overview
          </button>

          <button onClick={() => setActiveTab('My Profile')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'My Profile' ? 'bg-[#F5F3FF] text-[#7C3AED]' : 'text-[#7a6f75] hover:bg-[#faf9fc]'}`}>
            <User className="w-4 h-4" /> My Profile
          </button>

          <button onClick={() => setActiveTab('Medical Records')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'Medical Records' ? 'bg-[#F5F3FF] text-[#7C3AED]' : 'text-[#7a6f75] hover:bg-[#faf9fc]'}`}>
            <FileText className="w-4 h-4" /> Medical Records
          </button>

          <button onClick={() => setActiveTab('Health Tracker')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'Health Tracker' ? 'bg-[#F5F3FF] text-[#7C3AED]' : 'text-[#7a6f75] hover:bg-[#faf9fc]'}`}>
            <Heart className="w-4 h-4 text-[#F472B6]" /> Health Tracker
          </button>

          <button onClick={() => setActiveTab('Symptom Tracker')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'Symptom Tracker' ? 'bg-[#F5F3FF] text-[#7C3AED]' : 'text-[#7a6f75] hover:bg-[#faf9fc]'}`}>
            <AlertCircle className="w-4 h-4" /> Symptom Tracker
          </button>

          <button onClick={() => setActiveTab('Appointments')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'Appointments' ? 'bg-[#F5F3FF] text-[#7C3AED]' : 'text-[#7a6f75] hover:bg-[#faf9fc]'}`}>
            <Calendar className="w-4 h-4" /> Appointments
          </button>

          <button onClick={() => setActiveTab('AI Recommendation')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'AI Recommendation' ? 'bg-[#F5F3FF] text-[#7C3AED]' : 'text-[#7a6f75] hover:bg-[#faf9fc]'}`}>
            <Sparkles className="w-4 h-4 text-[#14B8A6]" /> AI Health Recommendation
          </button>

          <button onClick={() => setActiveTab('Health Reports')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'Health Reports' ? 'bg-[#F5F3FF] text-[#7C3AED]' : 'text-[#7a6f75] hover:bg-[#faf9fc]'}`}>
            <FileText className="w-4 h-4" /> Health Reports
          </button>

          <button onClick={() => setActiveTab('Share Report')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'Share Report' ? 'bg-[#F5F3FF] text-[#7C3AED]' : 'text-[#7a6f75] hover:bg-[#faf9fc]'}`}>
            <Share2 className="w-4 h-4 text-[#7C3AED]" /> Share Report with Doctor
          </button>
        </div>

        <div className="p-4 border-t border-[#EDE9FE]">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#EDE9FE] hover:bg-[#F5F3FF] text-[#4a4145] font-bold text-xs">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-[#EDE9FE] p-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-[#3a3135] text-lg">Welcome {userProfile.name}</h2>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={handleLogout} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">

          {/* 4 User Dashboard Displays */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Card 1: Welcome User */}
            <div className="bg-[#7C3AED] text-white p-6 rounded-3xl shadow-md flex flex-col justify-between">
              <span className="text-xs uppercase font-bold text-purple-200">Welcome User</span>
              <h3 className="text-2xl font-serif font-bold mt-2">{userProfile.name}</h3>
              <p className="text-xs text-purple-100 mt-1">Digital Twin Synced</p>
            </div>

            {/* Card 2: Health Score */}
            <div className="bg-white p-6 rounded-3xl border border-[#EDE9FE] shadow-sm flex flex-col justify-between">
              <span className="text-xs font-bold text-[#7a6f75] uppercase">Health Score</span>
              <div className="flex items-baseline gap-2 mt-2">
                <h3 className="text-4xl font-serif font-bold text-[#3a3135]">89</h3>
                <span className="text-xs text-[#7a6f75]">/ 100</span>
              </div>
              <p className="text-xs text-emerald-600 font-bold mt-1">+2% vs last week</p>
            </div>

            {/* Card 3: Today's Activity */}
            <div className="bg-white p-6 rounded-3xl border border-[#EDE9FE] shadow-sm flex flex-col justify-between">
              <span className="text-xs font-bold text-[#7a6f75] uppercase">Today's Activity</span>
              <h3 className="text-xl font-bold text-[#3a3135] mt-1">{trackerInput.exercise} mins exercise</h3>
              <p className="text-xs text-[#7a6f75]">{trackerInput.water}L water • {trackerInput.sleep}h sleep</p>
            </div>

            {/* Card 4: Upcoming Appointment */}
            <div className="bg-white p-6 rounded-3xl border border-[#EDE9FE] shadow-sm flex flex-col justify-between">
              <span className="text-xs font-bold text-[#7a6f75] uppercase">Upcoming Appointment</span>
              <h3 className="text-base font-bold text-[#3a3135] mt-1">{appointments[0]?.doctor || 'None'}</h3>
              <p className="text-xs text-[#7C3AED] font-semibold">{appointments[0]?.date || 'No upcoming appointments'}</p>
            </div>

          </div>

          {/* TAB: OVERVIEW */}
          {activeTab === 'Overview' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm">
                <h3 className="font-serif text-2xl text-[#3a3135] mb-4">Rule-Based AI Health Recommendations</h3>
                <div className="space-y-3">
                  {aiRecommendations.map((rec, idx) => (
                    <div key={idx} className="p-4 rounded-2xl border border-[#EDE9FE] bg-[#faf9fc] flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-[#14B8A6]" />
                      <p className="text-sm font-semibold text-[#3a3135]">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: MY PROFILE */}
          {activeTab === 'My Profile' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm max-w-xl mx-auto space-y-6">
              <h3 className="font-serif text-2xl text-[#3a3135]">User Profile Details</h3>
              <div className="space-y-4 text-sm">
                <div><label className="block text-xs font-bold uppercase text-[#7a6f75]">Name</label><input type="text" value={userProfile.name} onChange={(e) => setUserProfile({...userProfile, name: e.target.value})} className="w-full p-3 rounded-xl border border-[#EDE9FE]" /></div>
                <div><label className="block text-xs font-bold uppercase text-[#7a6f75]">Date of Birth (DOB)</label><input type="date" value={userProfile.dob} onChange={(e) => setUserProfile({...userProfile, dob: e.target.value})} className="w-full p-3 rounded-xl border border-[#EDE9FE]" /></div>
                <div><label className="block text-xs font-bold uppercase text-[#7a6f75]">Blood Group</label><input type="text" value={userProfile.bloodGroup} onChange={(e) => setUserProfile({...userProfile, bloodGroup: e.target.value})} className="w-full p-3 rounded-xl border border-[#EDE9FE]" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs font-bold uppercase text-[#7a6f75]">Height (cm)</label><input type="text" value={userProfile.height} onChange={(e) => setUserProfile({...userProfile, height: e.target.value})} className="w-full p-3 rounded-xl border border-[#EDE9FE]" /></div>
                  <div><label className="block text-xs font-bold uppercase text-[#7a6f75]">Weight (kg)</label><input type="text" value={userProfile.weight} onChange={(e) => setUserProfile({...userProfile, weight: e.target.value})} className="w-full p-3 rounded-xl border border-[#EDE9FE]" /></div>
                </div>
                <div><label className="block text-xs font-bold uppercase text-[#7a6f75]">Contact Number</label><input type="text" value={userProfile.contact} onChange={(e) => setUserProfile({...userProfile, contact: e.target.value})} className="w-full p-3 rounded-xl border border-[#EDE9FE]" /></div>
                
                <button onClick={() => setShowPasswordModal(true)} className="px-4 py-2 rounded-xl border border-[#EDE9FE] text-xs font-bold text-[#7C3AED]">
                  Change Password
                </button>
              </div>
            </div>
          )}

          {/* TAB: MEDICAL RECORDS */}
          {activeTab === 'Medical Records' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
              <h3 className="font-serif text-2xl text-[#3a3135]">Medical Records Vault (PDF, JPG, PNG)</h3>
              
              <form onSubmit={handleUploadRecord} className="flex gap-3">
                <input 
                  type="text" 
                  value={uploadFileName} 
                  onChange={(e) => setUploadFileName(e.target.value)} 
                  placeholder="Enter record filename (e.g. Lab_Result.pdf)..." 
                  className="flex-1 px-4 py-3 rounded-xl border border-[#EDE9FE] text-sm" 
                  required
                />
                <button type="submit" className="px-6 py-3 bg-[#7C3AED] text-white rounded-xl font-bold text-xs flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Upload Record
                </button>
              </form>

              <div className="space-y-3">
                {records.map(r => (
                  <div key={r.id} className="p-4 rounded-2xl border border-[#EDE9FE] bg-[#faf9fc] flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-[#3a3135] text-sm">{r.name}</p>
                      <p className="text-[#7a6f75]">{r.type} • Uploaded {r.date} • {r.size}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => alert(`Downloading ${r.name}...`)} className="px-3 py-1.5 bg-[#EDE9FE] text-[#7C3AED] rounded-lg font-bold flex items-center gap-1">
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                      <button onClick={() => deleteRecord(r.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: HEALTH TRACKER */}
          {activeTab === 'Health Tracker' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
              <h3 className="font-serif text-2xl text-[#3a3135]">Daily Health Tracker</h3>
              
              <form onSubmit={handleAddTrackerLog} className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[#faf9fc] rounded-2xl border border-[#EDE9FE]">
                <div><label className="block text-xs font-bold uppercase text-[#7a6f75] mb-1">Weight (kg)</label><input type="text" value={trackerInput.weight} onChange={(e) => setTrackerInput({...trackerInput, weight: e.target.value})} className="w-full p-2.5 rounded-xl border border-[#EDE9FE] text-xs" /></div>
                <div><label className="block text-xs font-bold uppercase text-[#7a6f75] mb-1">Water (Liters)</label><input type="text" value={trackerInput.water} onChange={(e) => setTrackerInput({...trackerInput, water: e.target.value})} className="w-full p-2.5 rounded-xl border border-[#EDE9FE] text-xs" /></div>
                <div><label className="block text-xs font-bold uppercase text-[#7a6f75] mb-1">Sleep (Hours)</label><input type="text" value={trackerInput.sleep} onChange={(e) => setTrackerInput({...trackerInput, sleep: e.target.value})} className="w-full p-2.5 rounded-xl border border-[#EDE9FE] text-xs" /></div>
                <div><label className="block text-xs font-bold uppercase text-[#7a6f75] mb-1">Exercise (Mins)</label><input type="text" value={trackerInput.exercise} onChange={(e) => setTrackerInput({...trackerInput, exercise: e.target.value})} className="w-full p-2.5 rounded-xl border border-[#EDE9FE] text-xs" /></div>
                <div className="col-span-2 md:col-span-4 flex justify-end">
                  <button type="submit" className="px-6 py-2.5 bg-[#7C3AED] text-white rounded-xl text-xs font-bold">Save Today's Vitals</button>
                </div>
              </form>

              <h4 className="font-bold text-[#3a3135] text-sm">Daily History Logs</h4>
              <div className="space-y-2">
                {trackerLogs.map((log, i) => (
                  <div key={i} className="p-3.5 rounded-xl border border-[#EDE9FE] flex justify-between text-xs font-medium">
                    <span className="font-bold text-[#7C3AED]">{log.date}</span>
                    <span>Weight: {log.weight}</span>
                    <span>Water: {log.water}</span>
                    <span>Sleep: {log.sleep}</span>
                    <span>Exercise: {log.exercise}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SYMPTOM TRACKER */}
          {activeTab === 'Symptom Tracker' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
              <h3 className="font-serif text-2xl text-[#3a3135]">Symptom Tracker</h3>
              
              <form onSubmit={handleAddSymptom} className="grid md:grid-cols-2 gap-4 p-4 bg-[#faf9fc] rounded-2xl border border-[#EDE9FE]">
                <div><label className="block text-xs font-bold uppercase text-[#7a6f75] mb-1">Symptom</label><input type="text" value={symptomInput.symptom} onChange={(e) => setSymptomInput({...symptomInput, symptom: e.target.value})} className="w-full p-2.5 rounded-xl border border-[#EDE9FE] text-xs" required /></div>
                <div><label className="block text-xs font-bold uppercase text-[#7a6f75] mb-1">Severity</label><select value={symptomInput.severity} onChange={(e) => setSymptomInput({...symptomInput, severity: e.target.value})} className="w-full p-2.5 rounded-xl border border-[#EDE9FE] text-xs bg-white"><option>Low</option><option>Moderate</option><option>High</option></select></div>
                <div><label className="block text-xs font-bold uppercase text-[#7a6f75] mb-1">Date</label><input type="date" value={symptomInput.date} onChange={(e) => setSymptomInput({...symptomInput, date: e.target.value})} className="w-full p-2.5 rounded-xl border border-[#EDE9FE] text-xs" /></div>
                <div><label className="block text-xs font-bold uppercase text-[#7a6f75] mb-1">Notes</label><input type="text" value={symptomInput.notes} onChange={(e) => setSymptomInput({...symptomInput, notes: e.target.value})} className="w-full p-2.5 rounded-xl border border-[#EDE9FE] text-xs" /></div>
                <div className="col-span-2 flex justify-end">
                  <button type="submit" className="px-6 py-2.5 bg-[#7C3AED] text-white rounded-xl text-xs font-bold">Log Symptom</button>
                </div>
              </form>

              <h4 className="font-bold text-[#3a3135] text-sm">Symptom History</h4>
              <div className="space-y-2">
                {symptomLogs.map(s => (
                  <div key={s.id} className="p-3.5 rounded-xl border border-[#EDE9FE] flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-[#3a3135] text-sm">{s.symptom}</span>
                      <span className="ml-2 text-[#7a6f75]">({s.notes})</span>
                    </div>
                    <div className="flex gap-3 items-center">
                      <span className="text-[#7a6f75]">{s.date}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">{s.severity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: APPOINTMENTS */}
          {activeTab === 'Appointments' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl text-[#3a3135]">Doctor Appointments</h3>
                <button onClick={() => setShowBookModal(true)} className="px-4 py-2 bg-[#7C3AED] text-white rounded-xl text-xs font-bold">Book Appointment</button>
              </div>

              <div className="space-y-3">
                {appointments.map(a => (
                  <div key={a.id} className="p-4 rounded-2xl border border-[#EDE9FE] bg-[#faf9fc] flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-[#3a3135] text-sm">{a.doctor}</p>
                      <p className="text-[#7a6f75]">{a.date} at {a.time} • Reason: {a.reason}</p>
                    </div>
                    <button onClick={() => cancelAppointment(a.id)} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg font-bold">Cancel</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: AI RECOMMENDATION */}
          {activeTab === 'AI Recommendation' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
              <h3 className="font-serif text-2xl text-[#3a3135]">AI Health Recommendations Engine</h3>
              <div className="space-y-4">
                <div className="p-5 rounded-2xl border border-[#EDE9FE] bg-[#F5F3FF]">
                  <p className="font-bold text-[#7C3AED] text-sm">Automated Rule Suggestions:</p>
                  <ul className="mt-3 space-y-2 text-xs font-medium text-[#3a3135]">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Drink more water (Min 2L/day)</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Sleep at least 8 hours nightly</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Walk 30 minutes daily for optimal cardio score</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB: HEALTH REPORTS & SHARE */}
          {(activeTab === 'Health Reports' || activeTab === 'Share Report') && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
              <h3 className="font-serif text-2xl text-[#3a3135]">Longitudinal Health Reports & Sharing</h3>
              <div className="p-5 rounded-2xl border border-[#EDE9FE] bg-[#faf9fc] space-y-4 text-xs">
                <p className="font-bold text-[#3a3135] text-sm">Full Report Contents: Profile, Health Tracker, Symptoms, Medical Records</p>
                <div className="flex gap-3">
                  <button onClick={() => alert('Generating full PDF report...')} className="px-4 py-2 bg-[#7C3AED] text-white rounded-xl font-bold">Generate PDF Report</button>
                  <button onClick={() => alert('Downloading PDF...')} className="px-4 py-2 bg-[#EDE9FE] text-[#7C3AED] rounded-xl font-bold">Download PDF</button>
                </div>
                
                <div className="pt-4 border-t border-[#EDE9FE] space-y-3">
                  <label className="block font-bold text-[#3a3135]">Select Doctor to Share Report:</label>
                  <select value={selectedDoctorToShare} onChange={(e) => setSelectedDoctorToShare(e.target.value)} className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-white">
                    <option value="Dr. Sarah Jenkins">Dr. Sarah Jenkins (Obstetrics & Gynecology)</option>
                    <option value="Dr. Priya Sharma">Dr. Priya Sharma (Maternal-Fetal Medicine)</option>
                  </select>
                  <button onClick={handleShareReport} className="px-6 py-2.5 bg-[#14B8A6] text-white rounded-xl font-bold">Share Report with Doctor</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Book Appointment Modal */}
      {showBookModal && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#EDE9FE]">
            <h3 className="font-bold text-lg text-[#3a3135] mb-4">Book Doctor Appointment</h3>
            <form onSubmit={handleBookAppointment} className="space-y-3 text-xs">
              <div><label className="block font-bold mb-1">Select Doctor</label><select value={newAppointment.doctor} onChange={(e) => setNewAppointment({...newAppointment, doctor: e.target.value})} className="w-full p-2.5 rounded-xl border"><option>Dr. Sarah Jenkins</option><option>Dr. Priya Sharma</option></select></div>
              <div><label className="block font-bold mb-1">Date</label><input type="date" value={newAppointment.date} onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})} className="w-full p-2.5 rounded-xl border" required /></div>
              <div><label className="block font-bold mb-1">Time</label><input type="text" value={newAppointment.time} onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})} className="w-full p-2.5 rounded-xl border" required /></div>
              <div><label className="block font-bold mb-1">Reason</label><input type="text" value={newAppointment.reason} onChange={(e) => setNewAppointment({...newAppointment, reason: e.target.value})} className="w-full p-2.5 rounded-xl border" required /></div>
              <div className="flex gap-2 pt-2"><button type="submit" className="flex-1 py-2.5 bg-[#7C3AED] text-white font-bold rounded-xl">Confirm Booking</button><button type="button" onClick={() => setShowBookModal(false)} className="py-2.5 px-4 border rounded-xl font-bold">Cancel</button></div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
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

    </div>
  );
}
