import React, { useState } from 'react';
import {
  Users,
  Heart,
  Calendar,
  Pill,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Watch,
  Plus,
  Bell,
  Activity,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function CaregiverPortalView() {
  const {
    dependents,
    activeDependentId,
    setActiveDependentId,
    vaccinations,
    toggleVaccinationStatus,
    setIsAIChatOpen
  } = useApp();

  const [activeCaregiverSubTab, setActiveCaregiverSubTab] = useState<'overview' | 'vaccines' | 'meds'>('overview');

  const activeDependent = dependents.find(d => d.id === activeDependentId) || dependents[0];

  const dependentVaccines = vaccinations.filter(v => v.dependentId === activeDependent.id);

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Family Caregiver Portal
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Multi-generational family oversight: child development and senior care
          </p>
        </div>

        <button
          onClick={() => setIsAIChatOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-semibold border border-purple-200 dark:border-purple-800 flex items-center gap-1 min-h-[44px]"
        >
          <span>Caregiver AI</span>
        </button>
      </div>

      {/* Dependents Quick Switcher Carousel (Prompt #29) */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
          My Dependents
        </span>

        <div className="grid grid-cols-2 gap-3">
          {dependents.map(dep => {
            const isSelected = dep.id === activeDependentId;
            return (
              <div
                key={dep.id}
                onClick={() => setActiveDependentId(dep.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                  isSelected
                    ? 'bg-purple-50/90 dark:bg-purple-950/50 border-purple-500 ring-2 ring-purple-500/20 shadow-sm'
                    : 'bg-white dark:bg-slate-850 border-purple-100/70 dark:border-slate-800 hover:border-purple-300'
                }`}
              >
                <img
                  src={dep.avatar}
                  alt={dep.name}
                  className="w-11 h-11 rounded-xl object-cover border border-purple-100 dark:border-slate-700 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {dep.name}
                    </h3>
                  </div>
                  <p className="text-[10px] text-purple-700 dark:text-purple-300 font-semibold">
                    {dep.relation} · Age {dep.age}
                  </p>
                  <span className="text-[9px] text-slate-400 block mt-0.5">
                    Sync: {dep.lastSync}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Caregiver Navigation Sub-tabs */}
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
        <button
          onClick={() => setActiveCaregiverSubTab('overview')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all min-h-[44px] ${
            activeCaregiverSubTab === 'overview'
              ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Health Profile
        </button>
        <button
          onClick={() => setActiveCaregiverSubTab('vaccines')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all min-h-[44px] ${
            activeCaregiverSubTab === 'vaccines'
              ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Immunizations
        </button>
        <button
          onClick={() => setActiveCaregiverSubTab('meds')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all min-h-[44px] ${
            activeCaregiverSubTab === 'meds'
              ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Adherence
        </button>
      </div>

      {/* 1. OVERVIEW: Dependent Profile (Prompt #30) */}
      {activeCaregiverSubTab === 'overview' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Health Twin Telemetry
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {activeDependent.name} · Wellness Score
                </h3>
              </div>
              <div className="flex items-baseline gap-1 text-right">
                <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {activeDependent.healthScore}
                </span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
            </div>

            {/* Vitals Telemetry Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-slate-800/60">
                <span className="text-[10px] text-slate-400 font-semibold block">Heart Rate</span>
                <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {activeDependent.currentVitals.hr} BPM
                </p>
                <span className="text-[9px] text-emerald-600">Resting optimal</span>
              </div>
              <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-slate-800/60">
                <span className="text-[10px] text-slate-400 font-semibold block">Temperature</span>
                <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {activeDependent.currentVitals.temp} °C
                </p>
                <span className="text-[9px] text-emerald-600">Afebrile baseline</span>
              </div>
              <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-slate-800/60">
                <span className="text-[10px] text-slate-400 font-semibold block">Blood Pressure</span>
                <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {activeDependent.currentVitals.bp}
                </p>
                <span className="text-[9px] text-purple-600">Standard for age</span>
              </div>
              <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-slate-800/60">
                <span className="text-[10px] text-slate-400 font-semibold block">Restful Sleep</span>
                <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {activeDependent.currentVitals.sleep}
                </p>
                <span className="text-[9px] text-emerald-600">Unbroken duration</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. VACCINATIONS TRACKER (Prompt #31) */}
      {activeCaregiverSubTab === 'vaccines' && (
        <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Vaccination & Immunization Schedule
              </h3>
              <p className="text-[11px] text-slate-400">
                Official CDC/AAP pediatric & adult vaccination timeline
              </p>
            </div>
            <button
              onClick={() => alert('New vaccination record added.')}
              className="text-xs font-bold text-purple-600 hover:underline min-h-[44px]"
            >
              + Add Record
            </button>
          </div>

          <div className="space-y-2.5 pt-1">
            {dependentVaccines.map(vac => (
              <div
                key={vac.id}
                className="p-3.5 rounded-xl border border-purple-100/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {vac.vaccineName}
                    </h4>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        vac.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : vac.status === 'upcoming'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {vac.status === 'completed' ? 'Completed ✓' : `Due: ${vac.dueDate}`}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Administered by: {vac.provider || 'Pediatric Care Center'}
                  </p>
                </div>

                <button
                  onClick={() => toggleVaccinationStatus(vac.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all min-h-[44px] ${
                    vac.status === 'completed'
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      : 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'
                  }`}
                >
                  {vac.status === 'completed' ? 'Mark Due' : 'Mark Given'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. CAREGIVER MEDICATIONS (Prompt #32) */}
      {activeCaregiverSubTab === 'meds' && (
        <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Daily Dependent Medication Adherence
              </h3>
              <p className="text-[11px] text-slate-400">
                Log administered doses across Morning, Afternoon, and Night
              </p>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              96% 30-Day Adherence
            </span>
          </div>

          <div className="space-y-3">
            {/* Morning */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-purple-100/70 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-purple-600">Morning (08:00 AM)</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Multivitamin Chewable / Tablet</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Administered with breakfast</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Given
              </span>
            </div>

            {/* Afternoon */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-purple-100/70 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-amber-600">Afternoon (12:30 PM)</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Pediatric Probiotic</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Digestive microbial balance</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => alert('Dose marked as taken.')}
                  className="px-2.5 py-1 rounded-lg bg-purple-600 text-white text-xs font-semibold min-h-[44px]"
                >
                  Mark Given
                </button>
              </div>
            </div>

            {/* Night */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-purple-100/70 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-indigo-600">Night (08:00 PM)</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Gentle Melatonin / Magnesium</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Restorative sleep induction</p>
              </div>
              <span className="text-xs text-slate-400 font-semibold">Scheduled tonight</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
