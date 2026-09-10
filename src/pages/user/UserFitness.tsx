import React, { useState } from 'react';
import { 
  Stethoscope, 
  ShieldCheck, 
  Activity, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Building2, 
  RefreshCw, 
  AlertCircle, 
  ArrowRight,
  Sparkles,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

interface PrescribedExerciseItem {
  id?: string | number;
  name: string;
  category?: string;
  duration?: string;
  frequency?: string;
  instructions?: string;
  target?: string;
  setsReps?: string;
  clinicalNote?: string;
}

export default function UserFitness() {
  const navigate = useNavigate();
  const { 
    currentStageName, 
    consultationNotes, 
    fetchConsultationNotes,
    setShowBookModal 
  } = useUser();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>(() => {
    try {
      const todayKey = new Date().toISOString().slice(0, 10);
      const saved = localStorage.getItem(`femsphere_completed_rx_exercises_${todayKey}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleToggleComplete = (uniqueKey: string) => {
    setCompletedExercises((prev) => {
      const updated = { ...prev, [uniqueKey]: !prev[uniqueKey] };
      try {
        const todayKey = new Date().toISOString().slice(0, 10);
        localStorage.setItem(`femsphere_completed_rx_exercises_${todayKey}`, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchConsultationNotes();
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // Helper to parse prescribed exercises safely
  const parseExercises = (raw: any): PrescribedExerciseItem[] => {
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  // Filter ONLY consultations that contain doctor-prescribed exercises
  const prescriptionsWithExercises = (consultationNotes || []).filter((note) => {
    const exercises = parseExercises(note.prescribed_exercises);
    return exercises.length > 0;
  });

  // Calculate total number of prescribed exercises
  const totalExercisesCount = prescriptionsWithExercises.reduce((acc, note) => {
    return acc + parseExercises(note.prescribed_exercises).length;
  }, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200 font-inter max-w-5xl mx-auto pb-10">
      {/* MINIMAL CLINICAL HEADER */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-[#7C3AED] uppercase tracking-wider flex items-center gap-1 border border-purple-200">
              <Stethoscope className="w-3 h-3 text-[#7C3AED]" /> Doctor-Prescribed Regimens
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-700" /> Physician Verified
            </span>
            {currentStageName && (
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FAF5FF] text-purple-700 border border-purple-200">
                {currentStageName}
              </span>
            )}
          </div>
          
          <h2 className="font-bold text-2xl md:text-3xl text-[#3a3135] tracking-tight">
            Doctor-Prescribed Exercise & Physical Therapy
          </h2>
          <p className="text-xs text-[#7a6f75] mt-1 max-w-2xl leading-relaxed">
            Personalized clinical movement protocols and physical therapy prescribed by your attending physicians during consultations.
          </p>
        </div>

        {/* Minimal Summary & Sync */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-[#FAF8FC] px-4 py-2.5 rounded-2xl border border-[#EDE9FE] text-right">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Active Orders</span>
            <span className="text-sm font-bold text-[#7C3AED]">
              {totalExercisesCount} {totalExercisesCount === 1 ? 'Exercise' : 'Exercises'}
            </span>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-3 bg-white hover:bg-purple-50 text-[#7C3AED] rounded-2xl border border-[#EDE9FE] shadow-xs transition-colors cursor-pointer"
            title="Refresh Doctor Prescriptions"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* CORE CONTENT: ONLY PRESCRIBED EXERCISES */}
      {prescriptionsWithExercises.length === 0 ? (
        /* MINIMAL EMPTY STATE */
        <div className="bg-white rounded-3xl p-10 md:p-14 border border-[#EDE9FE] shadow-sm text-center space-y-4 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 border border-purple-100 text-[#7C3AED] mx-auto flex items-center justify-center shadow-inner">
            <Stethoscope className="w-8 h-8 text-[#7C3AED]" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#3a3135]">No Prescribed Exercises Yet</h3>
            <p className="text-xs text-[#7a6f75] mt-1.5 leading-relaxed max-w-md mx-auto">
              Your attending physician will prescribe tailored exercise protocols and physical therapy regimens during your consultation. Once prescribed, they will appear here with full guidance.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => {
                if (setShowBookModal) {
                  setShowBookModal(true);
                } else {
                  navigate('/dashboard/appointments');
                }
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              Book Doctor Consultation <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* PRESCRIBED LIST GROUPED BY DOCTOR CONSULTATION */
        <div className="space-y-6">
          {prescriptionsWithExercises.map((note) => {
            const exercises = parseExercises(note.prescribed_exercises);
            const doctorName = note.doctor_name 
              ? (note.doctor_name.startsWith('Dr.') ? note.doctor_name : `Dr. ${note.doctor_name}`)
              : (note.doctor_username ? `Dr. ${note.doctor_username}` : 'Attending Specialist');

            const prescriptionDate = note.created_at
              ? new Date(note.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })
              : 'Active Order';

            return (
              <div 
                key={note.id} 
                className="bg-white rounded-3xl border border-[#EDE9FE] shadow-sm overflow-hidden transition-all hover:border-purple-200"
              >
                {/* DOCTOR & CLINICAL HEADER */}
                <div className="p-6 border-b border-[#F3E8FF] bg-gradient-to-r from-[#FAF8FC] via-white to-[#FAF5FF] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-purple-500 text-white flex items-center justify-center font-bold text-sm shadow-md shrink-0">
                      <Stethoscope className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold text-[#7C3AED] uppercase tracking-wider">
                          Prescribed By
                        </span>
                        <span className="text-[11px] text-gray-400">•</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-400" /> {prescriptionDate}
                        </span>
                      </div>
                      <h3 className="font-bold text-base md:text-lg text-[#3a3135] leading-snug">
                        {doctorName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-[#7a6f75]">
                        {note.specialization && (
                          <span className="font-medium text-purple-800">
                            {note.specialization}
                          </span>
                        )}
                        {note.hospital_clinic && (
                          <span className="flex items-center gap-1 text-gray-500 text-[11px]">
                            <Building2 className="w-3 h-3 text-gray-400" /> {note.hospital_clinic}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Clinical Diagnosis Tag */}
                  {note.diagnosis && (
                    <div className="shrink-0 bg-white px-3.5 py-2 rounded-2xl border border-purple-200 shadow-2xs self-start md:self-auto">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        Clinical Diagnosis
                      </span>
                      <span className="text-xs font-bold text-[#3a3135]">
                        {note.diagnosis}
                      </span>
                    </div>
                  )}
                </div>

                {/* DOCTOR CLINICAL ADVICE / PRECAUTIONS NOTE (IF PRESENT) */}
                {note.advice && (
                  <div className="mx-6 mt-5 p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-start gap-2.5 text-xs text-[#4A3B42]">
                    <AlertCircle className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="font-bold text-[#7C3AED] text-[11px] uppercase tracking-wide block">
                        Doctor's Movement Guidance & Precautions
                      </span>
                      <p className="leading-relaxed text-slate-700 whitespace-pre-line">
                        {note.advice}
                      </p>
                    </div>
                  </div>
                )}

                {/* PRESCRIBED EXERCISE CARDS */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-[#7C3AED]" /> Prescribed Movement Protocols ({exercises.length})
                    </span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {exercises.map((ex, index) => {
                      const itemKey = `${note.id}-${ex.id || ex.name}-${index}`;
                      const isCompleted = !!completedExercises[itemKey];

                      return (
                        <div
                          key={itemKey}
                          className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                            isCompleted 
                              ? 'bg-emerald-50/40 border-emerald-200' 
                              : 'bg-[#FAF8FC]/50 hover:bg-[#FAF8FC] border-[#EDE9FE]'
                          }`}
                        >
                          <div className="space-y-2.5">
                            {/* Header: Name and Category */}
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="font-bold text-sm text-[#3a3135] leading-snug">
                                  {ex.name}
                                </h4>
                                {ex.category && (
                                  <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-100/70 text-[#7C3AED]">
                                    {ex.category}
                                  </span>
                                )}
                              </div>

                              {/* Toggle Completion */}
                              <button
                                type="button"
                                onClick={() => handleToggleComplete(itemKey)}
                                className={`p-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                                  isCompleted 
                                    ? 'bg-emerald-600 text-white shadow-xs' 
                                    : 'bg-white border border-[#EDE9FE] text-gray-400 hover:text-[#7C3AED] hover:border-purple-200'
                                }`}
                                title={isCompleted ? 'Completed today' : 'Mark completed today'}
                              >
                                {isCompleted ? (
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                ) : (
                                  <div className="w-3.5 h-3.5 rounded-full border border-gray-300" />
                                )}
                              </button>
                            </div>

                            {/* Protocol Specs (Duration, Frequency, Sets/Reps) */}
                            <div className="flex flex-wrap gap-1.5 text-[11px]">
                              {ex.duration && (
                                <span className="px-2.5 py-1 rounded-lg bg-white border border-[#EDE9FE] text-gray-600 font-medium flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-[#7C3AED]" /> {ex.duration}
                                </span>
                              )}
                              {ex.frequency && (
                                <span className="px-2.5 py-1 rounded-lg bg-white border border-[#EDE9FE] text-gray-600 font-medium flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-[#7C3AED]" /> {ex.frequency}
                                </span>
                              )}
                              {ex.setsReps && (
                                <span className="px-2.5 py-1 rounded-lg bg-white border border-[#EDE9FE] text-purple-700 font-bold">
                                  {ex.setsReps}
                                </span>
                              )}
                              {ex.target && (
                                <span className="px-2.5 py-1 rounded-lg bg-white border border-[#EDE9FE] text-gray-600 font-medium">
                                  Target: {ex.target}
                                </span>
                              )}
                            </div>

                            {/* Doctor's Form Instructions */}
                            {(ex.instructions || ex.clinicalNote) && (
                              <div className="pt-1">
                                <p className="text-xs text-[#52454D] bg-white p-3 rounded-xl border border-[#EDE9FE] leading-relaxed">
                                  <span className="font-bold text-[10px] text-gray-400 uppercase tracking-wider block mb-0.5">
                                    Doctor's Instructions
                                  </span>
                                  {ex.instructions || ex.clinicalNote}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Adherence Footer */}
                          <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[10px]">
                            <span className="text-gray-400">Prescription Adherence</span>
                            {isCompleted ? (
                              <span className="font-bold text-emerald-600 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Done for today
                              </span>
                            ) : (
                              <span className="text-gray-400">Scheduled for today</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
