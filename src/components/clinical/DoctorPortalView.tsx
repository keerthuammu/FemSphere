import React, { useState } from 'react';
import {
  Stethoscope,
  Users,
  Calendar,
  AlertCircle,
  Search,
  Filter,
  FileText,
  Activity,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  Pill,
  Heart,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DoctorPatient } from '../../types';

export default function DoctorPortalView() {
  const {
    patients,
    selectedPatientId,
    setSelectedPatientId,
    doctorAvailability,
    updateDoctorAvailability,
    startTelehealthSession
  } = useApp();

  const [activeDoctorView, setActiveDoctorView] = useState<'feed' | 'twin' | 'consult' | 'schedule'>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [diagnosisNote, setDiagnosisNote] = useState('');
  const [rxMedicine, setRxMedicine] = useState('');

  const currentPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.stage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Top Doctor Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Good morning, Dr. Elena Vance 🩺
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            OB/GYN & Maternal Fetal Specialist · Northwest Pavilion
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveDoctorView('feed')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all min-h-[44px] ${
              activeDoctorView === 'feed'
                ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-xs'
                : 'text-slate-500'
            }`}
          >
            Patients
          </button>
          <button
            onClick={() => setActiveDoctorView('twin')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all min-h-[44px] ${
              activeDoctorView === 'twin'
                ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-xs'
                : 'text-slate-500'
            }`}
          >
            Health Twin
          </button>
          <button
            onClick={() => setActiveDoctorView('consult')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all min-h-[44px] ${
              activeDoctorView === 'consult'
                ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-xs'
                : 'text-slate-500'
            }`}
          >
            Consultation
          </button>
          <button
            onClick={() => setActiveDoctorView('schedule')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all min-h-[44px] ${
              activeDoctorView === 'schedule'
                ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-xs'
                : 'text-slate-500'
            }`}
          >
            Schedule
          </button>
        </div>
      </div>

      {/* 1. PATIENT DIRECTORY & CLINICAL STATS (Prompt #33) */}
      {activeDoctorView === 'feed' && (
        <div className="space-y-4">
          {/* Key Metric Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-white dark:bg-slate-850 p-3.5 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Assigned Patients</span>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums mt-0.5">38</p>
              <span className="text-[10px] text-emerald-600 font-semibold">Active monitoring</span>
            </div>
            <div className="bg-white dark:bg-slate-850 p-3.5 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Today's Visits</span>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums mt-0.5">6</p>
              <span className="text-[10px] text-purple-600 font-semibold">4 Telehealth · 2 Clinic</span>
            </div>
            <div className="bg-white dark:bg-slate-850 p-3.5 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Pending Labs</span>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums mt-0.5">3</p>
              <span className="text-[10px] text-amber-600 font-semibold">Ready for review</span>
            </div>
            <div className="bg-white dark:bg-slate-850 p-3.5 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Biometric Alerts</span>
              <p className="text-xl font-extrabold text-rose-600 tabular-nums mt-0.5">1</p>
              <span className="text-[10px] text-rose-600 font-semibold">Sleep anomaly</span>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search patients by name, life stage, or condition..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-purple-100 dark:border-slate-700 bg-white dark:bg-slate-850 text-xs focus:outline-none focus:border-purple-600"
            />
          </div>

          {/* Patient Cards */}
          <div className="space-y-2.5">
            {filteredPatients.map(patient => (
              <div
                key={patient.id}
                onClick={() => {
                  setSelectedPatientId(patient.id);
                  setActiveDoctorView('twin');
                }}
                className={`bg-white dark:bg-slate-850 p-4 rounded-2xl border transition-all cursor-pointer shadow-sm hover:shadow-md ${
                  selectedPatientId === patient.id
                    ? 'border-purple-500 ring-2 ring-purple-500/20'
                    : 'border-purple-100/70 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                        {patient.name}
                      </h3>
                      <span className="text-[10px] text-purple-700 dark:text-purple-300 font-semibold bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded-full">
                        {patient.stage} · Age {patient.age}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {patient.conditionSummary}
                    </p>
                    {patient.recentAlert && (
                      <div className="mt-2 text-[10px] text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1 bg-rose-50 dark:bg-rose-950/40 p-1.5 rounded-lg">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{patient.recentAlert}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-lg font-extrabold text-slate-900 dark:text-white tabular-nums block">
                      {patient.healthScore}
                    </span>
                    <span className="text-[10px] text-slate-400">Twin Score</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-2 border-t border-purple-50 dark:border-slate-800 text-[11px] text-slate-400">
                  <span>HR: {patient.vitals.hr} BPM · BP: {patient.vitals.bp}</span>
                  <span className="text-purple-600 dark:text-purple-400 font-bold flex items-center gap-0.5">
                    Inspect Twin →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. DOCTOR PATIENT HEALTH TWIN (Prompt #34) */}
      {activeDoctorView === 'twin' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-300">
                  Synchronized Patient Digital Twin
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {currentPatient.name} · Clinical Biomarker Synthesis
                </h3>
                <p className="text-xs text-slate-500">
                  {currentPatient.stage} · Last in-clinic review: {currentPatient.lastVisit}
                </p>
              </div>

              <button
                onClick={() =>
                  startTelehealthSession({
                    name: 'Dr. Elena Vance',
                    specialty: 'Obstetrics & Gynecology (OB/GYN)',
                    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
                  })
                }
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm min-h-[44px]"
              >
                <span>Launch Video Consult</span>
              </button>
            </div>

            {/* Vitals Telemetry Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-slate-800/60">
                <span className="text-[10px] text-slate-400 font-semibold block">Heart Rate</span>
                <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {currentPatient.vitals.hr} BPM
                </p>
                <span className="text-[9px] text-emerald-600">Resting optimal</span>
              </div>
              <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-slate-800/60">
                <span className="text-[10px] text-slate-400 font-semibold block">Blood Pressure</span>
                <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {currentPatient.vitals.bp} mmHg
                </p>
                <span className="text-[9px] text-emerald-600">Normal normotensive</span>
              </div>
              <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-slate-800/60">
                <span className="text-[10px] text-slate-400 font-semibold block">SpO2 Oxygen</span>
                <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {currentPatient.vitals.spo2}%
                </p>
                <span className="text-[9px] text-emerald-600">Continuous optical</span>
              </div>
              <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-slate-800/60">
                <span className="text-[10px] text-slate-400 font-semibold block">Core Temp</span>
                <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {currentPatient.vitals.temp} °C
                </p>
                <span className="text-[9px] text-purple-600">Basal baseline</span>
              </div>
            </div>

            {/* Clinical Overview Note */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Clinical Longitudinal Summary
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentPatient.conditionSummary} Gestational biometry charts indicate normal fetal anatomical proportions. Adherence to 25mg iron bisglycinate is verified through connected pharmacy refills.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. DOCTOR CONSULTATION & RX PAD (Prompt #35) */}
      {activeDoctorView === 'consult' && (
        <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-purple-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Clinical Consultation & Electronic Rx Pad
              </h3>
              <p className="text-[11px] text-slate-400">
                Recording findings for {currentPatient.name} ({currentPatient.stage})
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
              Secure Provider Session
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Clinical Assessment & Diagnosis Note
              </label>
              <textarea
                rows={3}
                placeholder="Document patient subjective complaints, objective vitals assessment, and plan..."
                value={diagnosisNote}
                onChange={e => setDiagnosisNote(e.target.value)}
                className="w-full p-3 rounded-xl border border-purple-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Add Electronic Prescription (e-Rx)
              </label>
              <input
                type="text"
                placeholder="e.g. Iron Bisglycinate 25mg - Sig: 1 Cap Daily with Citrus Juice"
                value={rxMedicine}
                onChange={e => setRxMedicine(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-purple-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  alert('Clinical note signed and synchronized to patient Health Vault.');
                  setDiagnosisNote('');
                  setRxMedicine('');
                }}
                className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm min-h-[44px]"
              >
                Sign & Transmit Note & Rx
              </button>
              <button
                onClick={() => alert('Follow-up scheduled for 4 weeks.')}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold min-h-[44px]"
              >
                + Schedule Follow-up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. DOCTOR AVAILABILITY SCHEDULER (Prompt #36) */}
      {activeDoctorView === 'schedule' && (
        <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Weekly Practice Availability & Telehealth Hours
            </h3>
            <p className="text-[11px] text-slate-400">
              Configure working days, consultation slot duration, and booking capacities
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Working Days
              </label>
              <div className="flex gap-1.5">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => {
                  const isSelected = doctorAvailability.days.includes(day);
                  return (
                    <button
                      key={day}
                      onClick={() => {
                        const newDays = isSelected
                          ? doctorAvailability.days.filter(d => d !== day)
                          : [...doctorAvailability.days, day];
                        updateDoctorAvailability({ days: newDays });
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border min-h-[44px] ${
                        isSelected
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Start Time
                </label>
                <input
                  type="text"
                  value={doctorAvailability.startTime}
                  onChange={e => updateDoctorAvailability({ startTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-purple-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  End Time
                </label>
                <input
                  type="text"
                  value={doctorAvailability.endTime}
                  onChange={e => updateDoctorAvailability({ endTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-purple-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Slot Duration (Minutes)
                </label>
                <select
                  value={doctorAvailability.slotDuration}
                  onChange={e => updateDoctorAvailability({ slotDuration: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-purple-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                >
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={45}>45 Minutes</option>
                  <option value={60}>60 Minutes</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Max Patients / Day
                </label>
                <input
                  type="number"
                  value={doctorAvailability.maxPatients}
                  onChange={e => updateDoctorAvailability({ maxPatients: parseInt(e.target.value) || 12 })}
                  className="w-full px-3 py-2 rounded-xl border border-purple-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>
            </div>

            <button
              onClick={() => alert('Doctor clinical schedule updated successfully.')}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm min-h-[44px]"
            >
              Save Schedule Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
