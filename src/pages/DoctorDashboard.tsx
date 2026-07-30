import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Stethoscope, Sparkles, Users, FileText, Calendar, Bell, 
  CheckCircle2, Clock, User, LogOut, Search, Activity, MessageSquare, 
  Download, Printer, Plus, Trash2, Edit, X, Check
} from 'lucide-react';

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');

  // Doctor Profile
  const [profile, setProfile] = useState({
    name: 'Dr. Sarah Jenkins',
    email: 'dr.jenkins@femsphere.health',
    spec: 'Obstetrics & Gynecology',
    license: 'MD-892401',
    hospital: 'St. Jude Women\'s Health Center',
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // 1. Patient List State & Search
  const [patients, setPatients] = useState([
    { id: 'PAT-101', name: 'Elena Rostova', age: 29, lastVisit: '2026-07-28', sharedReport: 'Q3_Longitudinal_Health_Report.pdf', status: 'Shared Report Available' },
    { id: 'PAT-102', name: 'Amara Chen', age: 34, lastVisit: '2026-07-15', sharedReport: 'PCOS_Blood_Panel.pdf', status: 'Shared Report Available' },
  ]);
  const [searchPatient, setSearchPatient] = useState('');

  // 2. Shared Medical Records (Read Only & Download)
  const [sharedRecords] = useState([
    { id: 'SREC-01', patient: 'Elena Rostova', fileName: 'Q3_Longitudinal_Health_Report.pdf', sharedDate: '2026-07-29', type: 'PDF' },
    { id: 'SREC-02', patient: 'Amara Chen', fileName: 'PCOS_Blood_Panel.pdf', sharedDate: '2026-07-20', type: 'PDF' },
  ]);

  // 3. Consultation Notes State & CRUD (Patient, Diagnosis, Advice, Prescription Notes)
  const [notes, setNotes] = useState([
    { id: 'NOTE-01', patient: 'Elena Rostova', diagnosis: 'Phase 3 Cycle Mild Fatigue', advice: 'Increase hydration to 2.5L daily, light yoga', prescription: 'Iron & Vitamin D3' },
  ]);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [newNote, setNewNote] = useState({ patient: 'Elena Rostova', diagnosis: '', advice: '', prescription: '' });

  // 4. Appointments State & Actions (Accept, Reject, Mark Completed)
  const [appointments, setAppointments] = useState([
    { id: 'APT-DOC-01', patient: 'Elena Rostova', date: '2026-07-31', time: '10:00 AM', reason: 'Digital Twin Health Review', status: 'Scheduled' },
    { id: 'APT-DOC-02', patient: 'Amara Chen', date: '2026-07-31', time: '02:00 PM', reason: 'Follow-up Consultation', status: 'Scheduled' },
  ]);

  const handleLogout = () => {
    navigate('/login');
  };

  // Note Actions
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.diagnosis) return;
    setNotes([...notes, { ...newNote, id: `NOTE-0${notes.length + 1}` }]);
    setNewNote({ patient: 'Elena Rostova', diagnosis: '', advice: '', prescription: '' });
    setShowAddNoteModal(false);
  };
  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  // Appointment Actions
  const updateAppointmentStatus = (id: string, newStatus: string) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  return (
    <div className="min-h-screen bg-[#fbf9f6] flex font-sans text-[#3a3135]">
      
      {/* Sidebar - Doctor */}
      <aside className="w-68 bg-white border-r border-[#EDE9FE] hidden lg:flex flex-col flex-shrink-0 sticky top-0 h-screen">
        <div className="p-6 border-b border-[#EDE9FE] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-[#7C3AED] tracking-tight">FemSphere</h1>
            <Sparkles className="w-4 h-4 text-[#14B8A6]" />
          </Link>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FCE7F3] text-[#F472B6] uppercase">
            DOCTOR
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-hide">
          <p className="text-[10px] uppercase tracking-widest text-[#a89cb5] font-bold px-3 py-2 mt-2">Practice</p>
          
          <button onClick={() => setActiveTab('Overview')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === 'Overview' ? 'bg-[#F5F3FF] text-[#7C3AED]' : 'text-[#7a6f75] hover:bg-[#faf9fc]'}`}>
            <Stethoscope className="w-4 h-4 text-[#7C3AED]" /> Dashboard Overview
          </button>

          <button onClick={() => setActiveTab('Patient List')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'Patient List' ? 'bg-[#F5F3FF] text-[#7C3AED]' : 'text-[#7a6f75] hover:bg-[#faf9fc]'}`}>
            <Users className="w-4 h-4" /> Patient List
          </button>

          <button onClick={() => setActiveTab('Shared Medical Records')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'Shared Medical Records' ? 'bg-[#F5F3FF] text-[#7C3AED]' : 'text-[#7a6f75] hover:bg-[#faf9fc]'}`}>
            <FileText className="w-4 h-4" /> Shared Medical Records
          </button>

          <button onClick={() => setActiveTab('View Health Reports')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'View Health Reports' ? 'bg-[#F5F3FF] text-[#7C3AED]' : 'text-[#7a6f75] hover:bg-[#faf9fc]'}`}>
            <Activity className="w-4 h-4 text-[#14B8A6]" /> View Health Reports
          </button>

          <button onClick={() => setActiveTab('Consultation Notes')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'Consultation Notes' ? 'bg-[#F5F3FF] text-[#7C3AED]' : 'text-[#7a6f75] hover:bg-[#faf9fc]'}`}>
            <MessageSquare className="w-4 h-4" /> Consultation Notes
          </button>

          <button onClick={() => setActiveTab('Appointments')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'Appointments' ? 'bg-[#F5F3FF] text-[#7C3AED]' : 'text-[#7a6f75] hover:bg-[#faf9fc]'}`}>
            <Calendar className="w-4 h-4" /> Appointments
          </button>

          <p className="text-[10px] uppercase tracking-widest text-[#a89cb5] font-bold px-3 py-2 mt-4">Account</p>

          <button onClick={() => setActiveTab('Profile')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'Profile' ? 'bg-[#F5F3FF] text-[#7C3AED]' : 'text-[#7a6f75] hover:bg-[#faf9fc]'}`}>
            <User className="w-4 h-4" /> Profile
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
            <h2 className="font-bold text-[#3a3135] text-lg">{profile.name} ({profile.spec})</h2>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={handleLogout} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">

          {/* 3 Doctor Displays */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            
            <div className="bg-white p-6 rounded-3xl border border-[#EDE9FE] shadow-sm flex flex-col justify-between">
              <span className="text-xs font-bold text-[#7a6f75] uppercase">Total Patients</span>
              <h3 className="text-3xl font-serif font-bold text-[#3a3135] mt-2">{patients.length} Active</h3>
              <p className="text-xs text-purple-600 font-bold mt-1">Shared reports linked</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#EDE9FE] shadow-sm flex flex-col justify-between">
              <span className="text-xs font-bold text-[#7a6f75] uppercase">Today's Appointments</span>
              <h3 className="text-3xl font-serif font-bold text-[#3a3135] mt-2">{appointments.length}</h3>
              <p className="text-xs text-teal-600 font-bold mt-1">Next: Elena Rostova (10:00 AM)</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#EDE9FE] shadow-sm flex flex-col justify-between">
              <span className="text-xs font-bold text-[#7a6f75] uppercase">Shared Reports</span>
              <h3 className="text-3xl font-serif font-bold text-[#3a3135] mt-2">{sharedRecords.length}</h3>
              <p className="text-xs text-pink-600 font-bold mt-1">Read-only patient records</p>
            </div>

          </div>

          {/* TAB 1: PATIENT LIST */}
          {activeTab === 'Patient List' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-2xl text-[#3a3135]">Patient Directory (Shared Access)</h3>
                  <p className="text-xs text-[#7a6f75] mt-1">Patients who have explicitly shared their longitudinal reports with you.</p>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a89cb5]" />
                  <input 
                    type="text" 
                    value={searchPatient}
                    onChange={(e) => setSearchPatient(e.target.value)}
                    placeholder="Search patient name..." 
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#EDE9FE] bg-[#fbf9f6] text-xs outline-none focus:border-[#7C3AED]"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {patients.filter(p => p.name.toLowerCase().includes(searchPatient.toLowerCase())).map(p => (
                  <div key={p.id} className="p-4 rounded-2xl border border-[#EDE9FE] bg-[#faf9fc] flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-[#3a3135] text-sm">{p.name} ({p.age} yrs)</p>
                      <p className="text-[#7a6f75]">Last Visit: {p.lastVisit} • Shared File: <span className="font-mono text-[#7C3AED]">{p.sharedReport}</span></p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full">{p.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: SHARED MEDICAL RECORDS */}
          {(activeTab === 'Shared Medical Records' || activeTab === 'View Health Reports') && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl text-[#3a3135]">Shared Medical Records (Read-Only)</h3>
                <button onClick={() => window.print()} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#3a3135] rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <Printer className="w-4 h-4" /> Print Reports
                </button>
              </div>

              <div className="space-y-3">
                {sharedRecords.map(r => (
                  <div key={r.id} className="p-4 rounded-2xl border border-[#EDE9FE] bg-[#faf9fc] flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-[#3a3135] text-sm">{r.fileName} ({r.patient})</p>
                      <p className="text-[#7a6f75]">Shared Date: {r.sharedDate} • Format: {r.type} • Status: Read Only Access</p>
                    </div>
                    <button onClick={() => alert(`Downloading ${r.fileName}...`)} className="px-3.5 py-1.5 bg-[#7C3AED] text-white rounded-xl font-bold flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5" /> Download Report
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CONSULTATION NOTES */}
          {activeTab === 'Consultation Notes' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl text-[#3a3135]">Clinical Consultation Notes</h3>
                <button onClick={() => setShowAddNoteModal(true)} className="px-4 py-2 bg-[#7C3AED] text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Add Note
                </button>
              </div>

              <div className="space-y-4">
                {notes.map(n => (
                  <div key={n.id} className="p-5 rounded-2xl border border-[#EDE9FE] bg-[#faf9fc] space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-[#3a3135] text-sm">{n.patient}</h4>
                      <button onClick={() => deleteNote(n.id)} className="text-red-500 hover:text-red-700 font-bold">Delete</button>
                    </div>
                    <p className="text-[#3a3135]"><span className="font-bold text-[#7C3AED]">Diagnosis:</span> {n.diagnosis}</p>
                    <p className="text-[#3a3135]"><span className="font-bold text-[#14B8A6]">Advice:</span> {n.advice}</p>
                    <p className="text-[#3a3135]"><span className="font-bold text-pink-600">Prescription Notes:</span> {n.prescription}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: APPOINTMENTS */}
          {activeTab === 'Appointments' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
              <h3 className="font-serif text-2xl text-[#3a3135]">Manage Clinical Appointments</h3>
              
              <div className="space-y-3">
                {appointments.map(a => (
                  <div key={a.id} className="p-4 rounded-2xl border border-[#EDE9FE] bg-[#faf9fc] flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-[#3a3135] text-sm">{a.patient}</p>
                      <p className="text-[#7a6f75]">{a.date} at {a.time} • Reason: {a.reason}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => updateAppointmentStatus(a.id, 'Accepted')} className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-lg">
                        Accept
                      </button>
                      <button onClick={() => updateAppointmentStatus(a.id, 'Completed')} className="px-3 py-1.5 bg-[#7C3AED] text-white font-bold rounded-lg">
                        Mark Completed
                      </button>
                      <button onClick={() => updateAppointmentStatus(a.id, 'Rejected')} className="px-3 py-1.5 bg-red-50 text-red-600 font-bold rounded-lg">
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PROFILE */}
          {activeTab === 'Profile' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm max-w-xl mx-auto space-y-6">
              <h3 className="font-serif text-2xl text-[#3a3135]">Doctor Profile</h3>
              <div className="space-y-4 text-xs">
                <div><label className="block font-bold uppercase text-[#7a6f75] mb-1">Doctor Name</label><input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="w-full p-3 rounded-xl border border-[#EDE9FE]" /></div>
                <div><label className="block font-bold uppercase text-[#7a6f75] mb-1">Email</label><input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} className="w-full p-3 rounded-xl border border-[#EDE9FE]" /></div>
                <div><label className="block font-bold uppercase text-[#7a6f75] mb-1">Specialization</label><input type="text" value={profile.spec} onChange={(e) => setProfile({...profile, spec: e.target.value})} className="w-full p-3 rounded-xl border border-[#EDE9FE]" /></div>
                <div><label className="block font-bold uppercase text-[#7a6f75] mb-1">License No.</label><input type="text" value={profile.license} readOnly className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-[#F5F3FF] text-[#7C3AED] font-mono font-bold" /></div>
                <button onClick={() => setShowPasswordModal(true)} className="px-4 py-2 rounded-xl border border-[#EDE9FE] font-bold text-[#7C3AED]">Change Password</button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Add Consultation Note Modal */}
      {showAddNoteModal && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#EDE9FE]">
            <h3 className="font-bold text-base text-[#3a3135] mb-4">Add Consultation Note</h3>
            <form onSubmit={handleAddNote} className="space-y-3 text-xs">
              <div><label className="block font-bold mb-1">Patient</label><select value={newNote.patient} onChange={(e) => setNewNote({...newNote, patient: e.target.value})} className="w-full p-2.5 rounded-xl border bg-white"><option>Elena Rostova</option><option>Amara Chen</option></select></div>
              <div><label className="block font-bold mb-1">Diagnosis</label><input type="text" value={newNote.diagnosis} onChange={(e) => setNewNote({...newNote, diagnosis: e.target.value})} className="w-full p-2.5 rounded-xl border" required /></div>
              <div><label className="block font-bold mb-1">Advice</label><input type="text" value={newNote.advice} onChange={(e) => setNewNote({...newNote, advice: e.target.value})} className="w-full p-2.5 rounded-xl border" required /></div>
              <div><label className="block font-bold mb-1">Prescription Notes</label><input type="text" value={newNote.prescription} onChange={(e) => setNewNote({...newNote, prescription: e.target.value})} className="w-full p-2.5 rounded-xl border" required /></div>
              <div className="flex gap-2 pt-2"><button type="submit" className="flex-1 py-2.5 bg-[#7C3AED] text-white font-bold rounded-xl">Save Note</button><button type="button" onClick={() => setShowAddNoteModal(false)} className="py-2.5 px-4 border rounded-xl font-bold">Cancel</button></div>
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

    </div>
  );
}
