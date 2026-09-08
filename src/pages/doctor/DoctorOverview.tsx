import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Calendar, FileText, Award, Activity, Video, 
  ArrowRight, Clock, Plus, ShieldCheck, FileCheck, Stethoscope
} from 'lucide-react';
import { useDoctor } from '../../context/DoctorContext';

export default function DoctorOverview() {
  const {
    patients,
    appointments,
    sharedRecords,
    profile,
    setSelectedHealthTwin,
    setActiveTelehealthSession,
    setShowAddConsultationModal
  } = useDoctor();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.date === todayStr || a.status === 'Scheduled');
  const highRiskPatients = patients.filter(p => p.riskLevel === 'High Attention' || p.riskLevel === 'Moderate Attention');

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#EDE9FE] via-[#FCE7F3] to-[#FAF8FC] p-6 md:p-8 rounded-3xl border border-[#EDE9FE] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-white/80 text-[#7C3AED] rounded-full text-xs font-bold uppercase tracking-wider border border-[#EDE9FE]">
            Clinical Practice Command Center
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#3a3135] mt-2">Doctor Overview & Vitals Hub</h2>
          <p className="text-xs text-[#7a6f75] mt-1 max-w-xl">
            Monitor real-time patient health twins, evaluate AI biomarker extractions, manage consultation shifts, and conduct encrypted telehealth visits.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setShowAddConsultationModal(true)}
            className="px-4 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Issue Prescription
          </button>
          <Link
            to="/doctor-dashboard/availability"
            className="px-4 py-2.5 bg-white text-[#7C3AED] hover:bg-purple-50 text-xs font-bold rounded-xl border border-[#EDE9FE] shadow-2xs flex items-center gap-2 transition-all"
          >
            Manage Shifts
          </Link>
        </div>
      </div>

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
            {todayAppointments.length}
          </h3>
          <p className="text-xs text-teal-600 font-bold mt-1">
            {todayAppointments[0] ? `Next: ${todayAppointments[0].patient} (${todayAppointments[0].time})` : 'No appointments scheduled'}
          </p>
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
          <h3 className="text-3xl font-serif font-bold text-[#3a3135] mt-3">{profile.rating || '5.0 / 5.0'}</h3>
          <p className="text-xs text-emerald-600 font-bold mt-1">Top rated clinical care</p>
        </div>
      </div>

      {/* 2 Columns: Today's Clinical Queue & High Attention Health Twins */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments Queue */}
        <div className="bg-white rounded-3xl p-6 border border-[#EDE9FE] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-[#3a3135]">Today's Clinical Roster</h3>
            <Link to="/doctor-dashboard/appointments" className="text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {todayAppointments.length === 0 ? (
            <div className="p-8 text-center bg-[#FAF8FC] rounded-2xl border border-dashed border-[#EDE9FE]">
              <p className="text-xs text-[#7a6f75]">No appointments scheduled for today.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayAppointments.slice(0, 3).map((apt) => (
                <div key={apt.id} className="p-4 rounded-2xl border border-[#EDE9FE] bg-[#FAF8FC] flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#3a3135]">{apt.patient}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-[#7C3AED]">
                        {apt.type}
                      </span>
                    </div>
                    <p className="text-[#7a6f75]">{apt.reason}</p>
                    <p className="text-[11px] font-mono text-[#7C3AED] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {apt.date} • {apt.time}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {apt.type === 'Virtual Telehealth' && (
                      <button
                        onClick={() => setActiveTelehealthSession(apt)}
                        className="px-3 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5" /> Launch
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Priority Patients */}
        <div className="bg-white rounded-3xl p-6 border border-[#EDE9FE] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-[#3a3135]">Patients Requiring Attention</h3>
            <Link to="/doctor-dashboard/patients" className="text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1">
              Patient Directory <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {highRiskPatients.length === 0 ? (
            <div className="p-8 text-center bg-[#FAF8FC] rounded-2xl border border-dashed border-[#EDE9FE]">
              <p className="text-xs text-emerald-700 font-semibold">All connected patient health twins are within optimal parameters.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {highRiskPatients.map((p) => (
                <div key={p.id} className="p-4 rounded-2xl border border-[#EDE9FE] bg-[#FAF8FC] flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-[#3a3135]">{p.name}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.riskLevel === 'High Attention' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {p.riskLevel}
                      </span>
                    </div>
                    <p className="text-[#7a6f75]">{p.lifeStage} • BP: {p.bp}</p>
                    <p className="text-[11px] text-purple-600 font-medium">Cycle: {p.cyclePhase}</p>
                  </div>

                  <button
                    onClick={() => setSelectedHealthTwin(p)}
                    className="px-3 py-1.5 bg-white border border-[#EDE9FE] hover:bg-purple-50 text-[#7C3AED] font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                  >
                    <Activity className="w-3.5 h-3.5" /> Twin
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
