import React, { useState } from 'react';
import { Pill, Plus, Trash2, Clock, CheckCircle2, X } from 'lucide-react';
import { useCaregiver } from '../../context/CaregiverContext';

export default function CaregiverMedications() {
  const { medications, addMedication, deleteMedication, dependents } = useCaregiver();
  const [showAddMedModal, setShowAddMedModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [newMed, setNewMed] = useState({
    dependent: dependents[0]?.name || '',
    medicineName: '',
    dosage: '',
    time: '09:00 AM'
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!newMed.dependent) {
      setErrorMsg('Please select a dependent.');
      return;
    }
    if (!newMed.medicineName.trim() || newMed.medicineName.trim().length < 2) {
      setErrorMsg('Please enter a valid medicine name (at least 2 characters).');
      return;
    }
    if (!newMed.dosage.trim()) {
      setErrorMsg('Please enter the prescribed dosage.');
      return;
    }
    if (!newMed.time.trim()) {
      setErrorMsg('Please enter the scheduled dosage time.');
      return;
    }

    addMedication(newMed);
    setNewMed({
      dependent: dependents[0]?.name || '',
      medicineName: '',
      dosage: '',
      time: '09:00 AM'
    });
    setShowAddMedModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#F472B6] mb-1">
            <Pill className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Prescription Scheduler</span>
          </div>
          <h3 className="font-serif text-3xl font-bold text-[#3a3135]">Medication Reminders</h3>
          <p className="text-xs text-[#7a6f75] mt-1">
            Track and schedule active prescription dosages and timely reminders for each linked dependent.
          </p>
        </div>

        <button
          onClick={() => setShowAddMedModal(true)}
          className="px-5 py-3 bg-[#F472B6] hover:bg-[#E85D9E] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" /> Add Reminder
        </button>
      </div>

      {/* Medications Grid or Empty State */}
      {medications.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-[#EDE9FE] shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-pink-50 text-[#F472B6] flex items-center justify-center mx-auto">
            <Pill className="w-8 h-8" />
          </div>
          <h4 className="font-serif text-xl font-bold text-[#3a3135]">No Medication Reminders</h4>
          <p className="text-xs text-[#7a6f75] max-w-md mx-auto">
            No active prescription schedules found. Add dosage times and daily medication alerts for your dependents.
          </p>
          <button
            onClick={() => setShowAddMedModal(true)}
            className="px-6 py-2.5 bg-[#F472B6] hover:bg-[#E85D9E] text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add First Reminder
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {medications.map((m) => (
          <div
            key={m.id}
            className="p-6 rounded-3xl border border-[#EDE9FE] bg-white hover:border-[#F472B6]/40 hover:shadow-sm transition-all space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-pink-100 text-[#F472B6] flex items-center justify-center font-bold text-sm">
                  {m.dependent.charAt(0)}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#7a6f75] uppercase block">Care Recipient</span>
                  <span className="font-bold text-sm text-[#3a3135]">{m.dependent}</span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#7C3AED] font-mono font-bold text-xs border border-purple-100">
                {m.id}
              </span>
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <Pill className="w-5 h-5 text-pink-600" />
                  <h4 className="font-bold text-base text-[#3a3135]">{m.medicineName}</h4>
                  <span className="px-2.5 py-0.5 rounded-md bg-pink-50 text-pink-700 border border-pink-200 font-bold text-xs">
                    {m.dosage}
                  </span>
                </div>
                <p className="text-xs text-[#7a6f75] flex items-center gap-1.5 pt-1">
                  <Clock className="w-4 h-4 text-[#7C3AED]" /> Scheduled Time:{' '}
                  <b className="text-pink-600 font-bold text-sm">{m.time}</b>
                </p>
              </div>

              <button
                onClick={() => deleteMedication(m.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                title="Remove Reminder"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Add Medication Modal */}
      {showAddMedModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-[#EDE9FE] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-3">
              <h3 className="font-bold text-base text-[#3a3135]">Add Medication Reminder</h3>
              <button onClick={() => setShowAddMedModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Select Dependent</label>
                <select
                  value={newMed.dependent}
                  onChange={(e) => setNewMed({ ...newMed, dependent: e.target.value })}
                  className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-white font-medium"
                >
                  {dependents.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name} ({d.relation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Medicine Name</label>
                <input
                  type="text"
                  value={newMed.medicineName}
                  onChange={(e) => setNewMed({ ...newMed, medicineName: e.target.value })}
                  placeholder="e.g. Calcium Carbonate, Metformin, Multivitamin"
                  className={`w-full p-3 rounded-xl border ${
                    newMed.medicineName.trim() && newMed.medicineName.trim().length < 2
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-[#EDE9FE]'
                  } text-xs font-medium`}
                  required
                />
                {newMed.medicineName.trim() && newMed.medicineName.trim().length < 2 && (
                  <p className="text-xs mt-1 text-red-500 font-medium">Please enter at least 2 characters</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Dosage</label>
                  <input
                    type="text"
                    value={newMed.dosage}
                    onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                    placeholder="e.g. 500mg, 1 Tab"
                    className="w-full p-3 rounded-xl border border-[#EDE9FE] text-xs font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Scheduled Time</label>
                  <input
                    type="text"
                    value={newMed.time}
                    onChange={(e) => setNewMed({ ...newMed, time: e.target.value })}
                    placeholder="e.g. 09:00 AM"
                    className="w-full p-3 rounded-xl border border-[#EDE9FE] text-xs font-bold text-[#7C3AED]"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-[#EDE9FE]">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#F472B6] hover:bg-[#E85D9E] text-white font-bold rounded-xl cursor-pointer"
                >
                  Save Reminder
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddMedModal(false)}
                  className="py-3 px-5 border border-[#EDE9FE] rounded-xl font-bold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
