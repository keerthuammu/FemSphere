import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, Sparkles, Heart, Bell, Calendar, FileText, 
  CheckCircle2, AlertCircle, Syringe, Clock, User, LogOut, Search, Plus, Trash2, Edit, Upload, Download, X
} from 'lucide-react';

export default function CaregiverDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');

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

  // 1. Manage Dependents State & CRUD (Name, DOB, Relationship, Blood Group)
  const [dependents, setDependents] = useState([
    { id: 'DEP-01', name: 'Sophia Rostova', dob: '2020-04-10', relation: 'Parent', bloodGroup: 'A Positive (A+)' },
    { id: 'DEP-02', name: 'Maria Rostova', dob: '1958-09-18', relation: 'Elder Parent', bloodGroup: 'O Positive (O+)' },
  ]);
  const [showAddDepModal, setShowAddDepModal] = useState(false);
  const [newDep, setNewDep] = useState({ name: '', dob: '2020-01-01', relation: 'Parent', bloodGroup: 'A Positive (A+)' });

  // 2. Medical Records State & CRUD
  const [records, setRecords] = useState([
    { id: 'REC-CG-01', name: 'Sophia_Vaccination_Certificate.pdf', dependent: 'Sophia Rostova', date: '2026-06-10' },
  ]);
  const [newRecordName, setNewRecordName] = useState('');

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
    { id: 'APT-CG-01', dependent: 'Sophia Rostova', doctor: 'Dr. Sarah Jenkins', date: '2026-08-02', time: '11:30 AM' },
  ]);

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

  return (
    <div className="min-h-screen bg-[#fbf9f6] flex font-sans text-[#3a3135]">
      
      {/* Sidebar - Caregiver */}
      <aside className="w-68 bg-white border-r border-[#EDE9FE] hidden lg:flex flex-col flex-shrink-0 sticky top-0 h-screen">
        <div className="p-6 border-b border-[#EDE9FE] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-[#7C3AED] tracking-tight">FemSphere</h1>
            <Sparkles className="w-4 h-4 text-[#14B8A6]" />
          </Link>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#14B8A6]/20 text-[#14B8A6] uppercase">
            CAREGIVER
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-hide">
          <p className="text-[10px] uppercase tracking-widest text-[#a89cb5] font-bold px-3 py-2 mt-2">Features</p>
          
          <button onClick={() => setActiveTab('Overview')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === 'Overview' ? 'bg-[#F5F3FF] text-[#7C3AED]' : 'text-[#7a6f75] hover:bg-[#faf9fc]'}`}>
            <Users className="w-4 h-4 text-[#7C3AED]" /> Dashboard Overview
          </button>

          <button onClick={() => setActiveTab('Manage Dependents')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'Manage Dependents' ? 'bg-[#F5F3FF] text-[#7C3AED]' : 'text-[#7a6f75] hover:bg-[#faf9fc]'}`}>
            <Users className="w-4 h-4" /> Manage Dependents
          </button>

          <button onClick={() => setActiveTab('Medical Records')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'Medical Records' ? 'bg-[#F5F3FF] text-[#7C3AED]' : 'text-[#7a6f75] hover:bg-[#faf9fc]'}`}>
            <FileText className="w-4 h-4" /> Medical Records
          </button>

          <button onClick={() => setActiveTab('Vaccination')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'Vaccination' ? 'bg-[#F5F3FF] text-[#7C3AED]' : 'text-[#7a6f75] hover:bg-[#faf9fc]'}`}>
            <Syringe className="w-4 h-4 text-[#14B8A6]" /> Vaccination Records
          </button>

          <button onClick={() => setActiveTab('Medication Reminder')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'Medication Reminder' ? 'bg-[#F5F3FF] text-[#7C3AED]' : 'text-[#7a6f75] hover:bg-[#faf9fc]'}`}>
            <Bell className="w-4 h-4 text-[#F472B6]" /> Medication Reminder
          </button>

          <button onClick={() => setActiveTab('Appointments')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'Appointments' ? 'bg-[#F5F3FF] text-[#7C3AED]' : 'text-[#7a6f75] hover:bg-[#faf9fc]'}`}>
            <Calendar className="w-4 h-4" /> Appointments
          </button>

          <button onClick={() => setActiveTab('Health Reports')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'Health Reports' ? 'bg-[#F5F3FF] text-[#7C3AED]' : 'text-[#7a6f75] hover:bg-[#faf9fc]'}`}>
            <FileText className="w-4 h-4" /> Health Reports
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
            <h2 className="font-bold text-[#3a3135] text-lg">Caregiver Workspace ({profile.name})</h2>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={handleLogout} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
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

          {/* TAB 4: PROFILE */}
          {activeTab === 'Profile' && (
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
              <div><label className="block font-bold mb-1">Relationship</label><select value={newDep.relation} onChange={(e) => setNewDep({...newDep, relation: e.target.value})} className="w-full p-2.5 rounded-xl border bg-white"><option>Parent</option><option>Partner</option><option>Sibling</option><option>Friend</option><option>Nurse</option><option>Caretaker</option></select></div>
              <div><label className="block font-bold mb-1">Blood Group</label><input type="text" value={newDep.bloodGroup} onChange={(e) => setNewDep({...newDep, bloodGroup: e.target.value})} className="w-full p-2.5 rounded-xl border" required /></div>
              <div className="flex gap-2 pt-2"><button type="submit" className="flex-1 py-2.5 bg-[#7C3AED] text-white font-bold rounded-xl">Add Dependent</button><button type="button" onClick={() => setShowAddDepModal(false)} className="py-2.5 px-4 border rounded-xl font-bold">Cancel</button></div>
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

    </div>
  );
}
