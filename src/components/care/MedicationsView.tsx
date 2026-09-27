import React, { useState } from 'react';
import {
  Pill,
  Clock,
  CheckCircle2,
  XCircle,
  BellRing,
  AlertTriangle,
  Plus,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function MedicationsView() {
  const { medications, toggleMedicationStatus } = useApp();
  const [isAddMedOpen, setIsAddMedOpen] = useState(false);

  const timelineSlots = ['08:00 AM', '12:00 PM', '08:00 PM'];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Medications & Supplement Regimen
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Adherence timeline synced with gastrointestinal absorption windows
          </p>
        </div>

        <button
          onClick={() => setIsAddMedOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1 shadow-sm min-h-[44px]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Rx</span>
        </button>
      </div>

      {/* Daily Timeline (8 AM, 12 PM, 8 PM) */}
      <div className="bg-white dark:bg-slate-850 p-4 sm:p-5 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-purple-100 dark:border-slate-800 pb-2">
          <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Today's Adherence Schedule
          </span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            Morning doses verified ✓
          </span>
        </div>

        <div className="space-y-4">
          {timelineSlots.map(timeSlot => {
            // Find meds scheduled for this slot
            const slotMeds = medications.filter(m => m.scheduledTimes.includes(timeSlot));

            return (
              <div key={timeSlot} className="relative pl-6 border-l-2 border-purple-200 dark:border-slate-700 space-y-2">
                {/* Timeline node */}
                <div className="absolute -left-2 top-0.5 w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center ring-4 ring-purple-100 dark:ring-purple-950">
                  <Clock className="w-2.5 h-2.5" />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
                    {timeSlot}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {slotMeds.length} scheduled
                  </span>
                </div>

                {slotMeds.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No medications scheduled for {timeSlot}</p>
                ) : (
                  slotMeds.map(med => {
                    const status = med.statusToday[timeSlot] || 'pending';

                    return (
                      <div
                        key={med.id}
                        className="p-3 rounded-xl border border-purple-100/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-300 shrink-0 mt-0.5">
                            <Pill className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                {med.name}
                              </h4>
                              <span className="text-[10px] text-slate-500 font-semibold">
                                {med.dosage}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {med.frequency} · {med.remainingTablets} tablets remaining
                            </p>
                          </div>
                        </div>

                        {/* Actions: Taken, Skip, Snooze */}
                        <div className="flex items-center gap-1.5 self-end sm:self-center">
                          <button
                            onClick={() => toggleMedicationStatus(med.id, timeSlot, 'taken')}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all min-h-[44px] ${
                              status === 'taken'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{status === 'taken' ? 'Taken ✓' : 'Taken'}</span>
                          </button>

                          <button
                            onClick={() => toggleMedicationStatus(med.id, timeSlot, 'snoozed')}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all min-h-[44px] ${
                              status === 'snoozed'
                                ? 'bg-amber-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-amber-50 hover:text-amber-700'
                            }`}
                          >
                            <BellRing className="w-3.5 h-3.5" />
                            <span>Snooze</span>
                          </button>

                          <button
                            onClick={() => toggleMedicationStatus(med.id, timeSlot, 'skipped')}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all min-h-[44px] ${
                              status === 'skipped'
                                ? 'bg-rose-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-700'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Skip</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Refill Alerts */}
      <div className="bg-amber-50/60 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-200 dark:border-amber-900/60 flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-900 dark:text-amber-200">
              Refill Alert: Iron Bisglycinate (8 tablets left)
            </span>
            <p className="text-slate-600 dark:text-slate-300 mt-0.5">
              Stock has fallen below the 10-day safety buffer. Auto-refill request can be transmitted to your connected pharmacy.
            </p>
          </div>
        </div>

        <button
          onClick={() => alert('Refill prescription order sent to Northwest Pharmacy.')}
          className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shrink-0 min-h-[44px]"
        >
          Request Refill
        </button>
      </div>

      {/* Add Rx Modal */}
      {isAddMedOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-purple-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-purple-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Add New Medication or Supplement
              </h3>
              <button onClick={() => setIsAddMedOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Medication Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Magnesium Glycinate"
                  className="w-full px-3 py-2 rounded-xl border border-purple-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Dosage & Timing
                </label>
                <input
                  type="text"
                  placeholder="e.g. 200mg at 08:00 PM"
                  className="w-full px-3 py-2 rounded-xl border border-purple-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <button
                onClick={() => {
                  alert('Medication added to schedule.');
                  setIsAddMedOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md min-h-[44px]"
              >
                Save Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
