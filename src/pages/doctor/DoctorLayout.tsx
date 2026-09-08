import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { 
  Stethoscope, Sparkles, Users, FileText, Calendar, Bell, 
  CheckCircle2, Clock, User, LogOut, Search, Activity, MessageSquare, 
  Download, Printer, Plus, Trash2, Edit, X, Check, Eye, Video, 
  VideoOff, Mic, MicOff, PhoneOff, Shield, ShieldCheck, Heart, 
  AlertTriangle, Droplet, Moon, Award, ChevronRight, Pill, 
  FileCheck, Sliders, Settings, DollarSign, RefreshCw, Send, CheckSquare
} from 'lucide-react';
import { useDoctor } from '../../context/DoctorContext';

export default function DoctorLayout() {
  const {
    profile,
    currentTime,
    handleLogout,
    // Modals & State
    selectedHealthTwin,
    setSelectedHealthTwin,
    sharedRecords,
    selectedRecordToView,
    setSelectedRecordToView,
    showAddConsultationModal,
    setShowAddConsultationModal,
    viewingPrescriptionModal,
    setViewingPrescriptionModal,
    newConsultationForm,
    setNewConsultationForm,
    patients,
    handleAddMedicationRow,
    handleRemoveMedicationRow,
    handleMedicationChange,
    handleSaveConsultation,
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
    showBookAppointmentModal,
    setShowBookAppointmentModal,
    newAppointmentForm,
    setNewAppointmentForm,
    handleCreateAppointment,
    showPasswordModal,
    setShowPasswordModal,
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    passwordMsg,
    setPasswordMsg
  } = useDoctor();

  const navItems = [
    { label: 'Overview', to: '/doctor-dashboard', end: true, icon: Stethoscope },
    { label: 'Patient Directory', to: '/doctor-dashboard/patients', icon: Users },
    { label: 'Shared Medical Records', to: '/doctor-dashboard/records', icon: FileText },
    { label: 'Consultation Notes', to: '/doctor-dashboard/consultations', icon: MessageSquare },
    { label: 'Appointments', to: '/doctor-dashboard/appointments', icon: Calendar },
    { label: 'Availability', to: '/doctor-dashboard/availability', icon: Sliders },
    { label: 'Profile', to: '/doctor-dashboard/profile', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F4] flex font-sans text-[#2E2428]">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-[#F2EBE5] border-r border-[#E5CDBC] p-6 flex flex-col justify-between hidden md:flex shrink-0">
        <div className="space-y-8">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#7C3AED] text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-[#2E2428] block leading-none">FemSphere</span>
              <span className="text-[10px] uppercase font-bold text-[#7C3AED] tracking-widest block mt-0.5">Clinical Portal</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all ${
                      isActive
                        ? 'bg-white text-[#7C3AED] shadow-xs border border-[#E5CDBC]'
                        : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Doctor Identity & Logout */}
        <div className="pt-6 border-t border-[#E5CDBC] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center font-bold text-sm shrink-0">
              {profile.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-bold text-xs text-[#2E2428] truncate">{profile.name}</h4>
              <p className="text-[10px] text-[#7A6A72] truncate">{profile.spec}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white/60 hover:bg-white border border-[#E5CDBC] rounded-xl text-xs font-bold text-rose-700 transition-all cursor-pointer shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5" /> Log Out
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-[#E5CDBC] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5" /> MD Verified Active
            </span>
            <span className="text-xs text-[#7A6A72] hidden sm:inline">•</span>
            <span className="text-xs text-[#7A6A72] font-semibold hidden sm:inline">
              Welcome back, <strong className="text-[#2E2428]">{profile.name}</strong>
            </span>
          </div>

          {/* Quick Actions & Live Time */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 bg-[#FAF7F4] px-3.5 py-1.5 rounded-xl border border-[#E5CDBC] text-xs font-mono font-bold text-[#7A6A72]">
              <Clock className="w-3.5 h-3.5 text-[#7C3AED]" />
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>

            <button
              onClick={() => setShowAddConsultationModal(true)}
              className="px-3.5 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> New Note
            </button>

            <button
              onClick={() => {
                if (patients.length === 0) {
                  alert('No registered patients found in database yet. Telehealth rooms activate when connected patients exist.');
                  return;
                }
                const targetPatient = patients[0];
                setActiveTelehealthSession({
                  id: `LIVE-${Date.now().toString().slice(-4)}`,
                  numericId: targetPatient.numericId,
                  patient: targetPatient.name,
                  patientId: targetPatient.id,
                  date: new Date().toISOString().split('T')[0],
                  time: 'Live',
                  reason: 'Immediate Telehealth Consultation Room',
                  status: 'Accepted',
                  type: 'Virtual Telehealth'
                });
              }}
              className="px-3.5 py-2 bg-[#14B8A6] hover:bg-[#0D9488] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Video className="w-3.5 h-3.5" /> Launch Telehealth
            </button>

            <Link
              to="/doctor-dashboard/profile"
              className="p-2 rounded-xl border border-[#E5CDBC] bg-white text-[#7C3AED] hover:bg-purple-50 transition-colors"
              title="Doctor Settings"
            >
              <Settings className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* Mobile Navigation Strip */}
        <div className="md:hidden flex overflow-x-auto gap-2 p-3 bg-[#F2EBE5] border-b border-[#E5CDBC]">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap ${
                  isActive ? 'bg-white text-[#7C3AED] shadow-2xs' : 'text-[#4A3B42]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Dynamic Page Content */}
        <main className="p-6 md:p-8 flex-1 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* ========================================================================= */}
      {/* --- GLOBAL MODALS --- */}
      {/* ========================================================================= */}

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
              <button onClick={() => setSelectedHealthTwin(null)} className="p-1 rounded-lg hover:bg-gray-100 cursor-pointer">
                <X className="w-5 h-5 text-gray-500" />
              </button>
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
              <button onClick={() => setSelectedRecordToView(null)} className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
                <X className="w-5 h-5 text-gray-500" />
              </button>
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
              <button onClick={() => setShowAddConsultationModal(false)} className="cursor-pointer">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSaveConsultation} className="space-y-4 text-xs">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#4a4145] uppercase mb-1">Select Patient</label>
                  <select 
                    value={newConsultationForm.patient}
                    onChange={(e) => {
                      const sel = patients.find(p => p.name === e.target.value);
                      setNewConsultationForm({ ...newConsultationForm, patient: e.target.value, patientId: sel ? sel.id : (patients[0]?.id || '') });
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
                    className="text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Drug Row
                  </button>
                </div>

                {newConsultationForm.medications.map((med) => (
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
                        <button type="button" onClick={() => handleRemoveMedicationRow(med.id)} className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#EDE9FE]">
                <button type="submit" className="flex-1 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-bold shadow-md cursor-pointer">
                  Save & Issue Digital Prescription
                </button>
                <button type="button" onClick={() => setShowAddConsultationModal(false)} className="px-5 py-3 border border-[#EDE9FE] rounded-xl font-bold text-[#7a6f75] cursor-pointer">
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
                className="flex-1 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print Official Prescription
              </button>
              <button 
                onClick={() => setViewingPrescriptionModal(null)} 
                className="px-6 py-3 border border-[#EDE9FE] rounded-xl text-xs font-bold text-[#7a6f75] cursor-pointer"
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
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
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
                  <span className="text-[10px] text-slate-300 block mt-1">You ({profile.name})</span>
                </div>
              </div>

              {/* Controls Floating Bar */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-800/80 backdrop-blur-md px-4 py-2.5 rounded-full border border-slate-700">
                <button 
                  onClick={() => setIsMicOn(!isMicOn)} 
                  className={`p-2.5 rounded-full cursor-pointer ${isMicOn ? 'bg-slate-700 text-white' : 'bg-rose-600 text-white'}`}
                  title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
                >
                  {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => setIsVideoOn(!isVideoOn)} 
                  className={`p-2.5 rounded-full cursor-pointer ${isVideoOn ? 'bg-slate-700 text-white' : 'bg-rose-600 text-white'}`}
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
                  className="w-full py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
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
              <button onClick={() => setShowBookAppointmentModal(false)} className="cursor-pointer">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#4a4145] uppercase mb-1">Select Patient</label>
                <select 
                  value={newAppointmentForm.patient}
                  onChange={(e) => {
                    const sel = patients.find(p => p.name === e.target.value);
                    setNewAppointmentForm({ ...newAppointmentForm, patient: e.target.value, patientId: sel ? sel.id : (patients[0]?.id || '') });
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
                <button type="submit" className="flex-1 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-bold cursor-pointer">
                  Confirm Schedule
                </button>
                <button type="button" onClick={() => setShowBookAppointmentModal(false)} className="px-4 py-3 border border-[#EDE9FE] rounded-xl font-bold text-[#7a6f75] cursor-pointer">
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
              <button onClick={() => setShowPasswordModal(false)} className="cursor-pointer">
                <X className="w-5 h-5 text-gray-500" />
              </button>
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
              <button type="submit" className="w-full py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-bold cursor-pointer">
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
