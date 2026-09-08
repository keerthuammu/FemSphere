import React, { useState } from 'react';
import { Syringe, Plus, Trash2, Calendar, CheckCircle2, X } from 'lucide-react';
import { useCaregiver } from '../../context/CaregiverContext';

export default function CaregiverVaccinations() {
  const { vaccinations, addVaccination, deleteVaccination, dependents } = useCaregiver();
  const [showAddVacModal, setShowAddVacModal] = useState(false);
  const [newVac, setNewVac] = useState({
    dependent: dependents[0]?.name || '',
    vaccineName: '',
    date: new Date().toISOString().split('T')[0],
    nextDueDate: '2026-10-01'
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVac.vaccineName.trim()) return;
    addVaccination(newVac);
    setNewVac({
      dependent: dependents[0]?.name || '',
      vaccineName: '',
      date: new Date().toISOString().split('T')[0],
      nextDueDate: '2026-10-01'
    });
    setShowAddVacModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-600 mb-1">
            <Syringe className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Immunization Tracking</span>
          </div>
          <h3 className="font-serif text-3xl font-bold text-[#3a3135]">Vaccination Records</h3>
          <p className="text-xs text-[#7a6f75] mt-1">
            Keep track of booster shots, completed immunizations, and upcoming due dates for your family.
          </p>
        </div>

        <button
          onClick={() => setShowAddVacModal(true)}
          className="px-5 py-3 bg-[#14B8A6] hover:bg-[#0D9488] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" /> Add Vaccination
        </button>
      </div>

      {/* Vaccinations List or Empty State */}
      {vaccinations.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-[#EDE9FE] shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
            <Syringe className="w-8 h-8" />
          </div>
          <h4 className="font-serif text-xl font-bold text-[#3a3135]">No Vaccination Records</h4>
          <p className="text-xs text-[#7a6f75] max-w-md mx-auto">
            You haven't logged any vaccinations yet. Record immunizations and booster due dates for your family members.
          </p>
          <button
            onClick={() => setShowAddVacModal(true)}
            className="px-6 py-2.5 bg-[#14B8A6] hover:bg-[#0D9488] text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add First Vaccination
          </button>
        </div>
      ) : (
        <div className="space-y-3">
        {vaccinations.map((v) => (
          <div
            key={v.id}
            className="p-5 rounded-2xl border border-[#EDE9FE] bg-white hover:border-teal-200 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
          >
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                <Syringe className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-[#3a3135] text-base">{v.vaccineName}</h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#7C3AED] font-bold text-[10px]">
                    {v.dependent}
                  </span>
                </div>
                <p className="text-[#7a6f75] flex items-center gap-3">
                  <span>Administered: <b className="text-gray-700">{v.date}</b></span>
                  <span>•</span>
                  <span>Next Due Date: <b className="text-[#7C3AED]">{v.nextDueDate}</b></span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-end">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] flex items-center gap-1 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> Immunized
              </span>
              <button
                onClick={() => deleteVaccination(v.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                title="Remove Vaccination Record"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Add Vaccination Modal */}
      {showAddVacModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-[#EDE9FE] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-3">
              <h3 className="font-bold text-base text-[#3a3135]">Add Vaccination Record</h3>
              <button onClick={() => setShowAddVacModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Select Dependent</label>
                <select
                  value={newVac.dependent}
                  onChange={(e) => setNewVac({ ...newVac, dependent: e.target.value })}
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
                <label className="block font-bold mb-1">Vaccine Name</label>
                <input
                  type="text"
                  value={newVac.vaccineName}
                  onChange={(e) => setNewVac({ ...newVac, vaccineName: e.target.value })}
                  placeholder="e.g. MMR Booster, DTaP, HPV Dose 2"
                  className="w-full p-3 rounded-xl border border-[#EDE9FE] text-xs font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Date Administered</label>
                <input
                  type="date"
                  value={newVac.date}
                  onChange={(e) => setNewVac({ ...newVac, date: e.target.value })}
                  className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-white"
                  required
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Next Due Date</label>
                <input
                  type="date"
                  value={newVac.nextDueDate}
                  onChange={(e) => setNewVac({ ...newVac, nextDueDate: e.target.value })}
                  className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-white"
                  required
                />
              </div>

              <div className="flex gap-2 pt-3 border-t border-[#EDE9FE]">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#14B8A6] hover:bg-[#0D9488] text-white font-bold rounded-xl cursor-pointer"
                >
                  Save Vaccination
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddVacModal(false)}
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
