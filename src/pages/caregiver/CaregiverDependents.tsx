import React, { useState } from 'react';
import { Users, Plus, Trash2, Heart, Calendar, Droplet, User, AlertCircle } from 'lucide-react';
import { useCaregiver } from '../../context/CaregiverContext';
import { isValidName, isPastOrToday, calculateAge } from '../../utils/validation';

export default function CaregiverDependents() {
  const { dependents, addDependent, deleteDependent, isAddingDep } = useCaregiver();
  const [showAddDepModal, setShowAddDepModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [newDep, setNewDep] = useState({
    name: '',
    dob: '2020-01-01',
    relation: 'Child (Daughter)',
    bloodGroup: 'A Positive (A+)'
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!newDep.name.trim() || !isValidName(newDep.name)) {
      setErrorMsg('Please enter a valid dependent name (letters only, min 2 characters).');
      return;
    }
    if (!newDep.dob || !isPastOrToday(newDep.dob)) {
      setErrorMsg('Date of birth cannot be in the future.');
      return;
    }

    const age = calculateAge(newDep.dob);
    if (newDep.relation.startsWith('Child') && age >= 18) {
      setErrorMsg(`Dependent is ${age} years old. Please select an adult relationship or adjust date of birth.`);
      return;
    }
    if ((newDep.relation === 'Grandparent' || newDep.relation === 'Elder Relative') && age < 50) {
      setErrorMsg(`Dependent is ${age} years old. Please select an appropriate relationship or adjust date of birth.`);
      return;
    }

    const success = await addDependent(newDep);
    if (success) {
      setNewDep({
        name: '',
        dob: '2020-01-01',
        relation: 'Child (Daughter)',
        bloodGroup: 'A Positive (A+)'
      });
      setShowAddDepModal(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#7C3AED] mb-1">
            <Users className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Family & Care Registry</span>
          </div>
          <h3 className="font-serif text-3xl font-bold text-[#3a3135]">Manage Dependents</h3>
          <p className="text-xs text-[#7a6f75] mt-1">
            Add, review, and maintain linked family members and care profiles stored in PostgreSQL.
          </p>
        </div>

        <button
          onClick={() => setShowAddDepModal(true)}
          className="px-5 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" /> Add Dependent
        </button>
      </div>

      {/* Dependents Grid */}
      {dependents.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-[#EDE9FE] shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-purple-50 text-[#7C3AED] flex items-center justify-center mx-auto">
            <Users className="w-8 h-8" />
          </div>
          <h4 className="font-serif text-xl font-bold text-[#3a3135]">No Dependents Linked</h4>
          <p className="text-xs text-[#7a6f75] max-w-md mx-auto">
            You currently have no care recipients or dependents linked to your caregiver account in the database.
          </p>
          <button
            onClick={() => setShowAddDepModal(true)}
            className="px-6 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add First Dependent
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {dependents.map((dep) => (
            <div
              key={dep.id}
              className="p-6 rounded-3xl border border-[#EDE9FE] bg-white hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#7C3AED] flex items-center justify-center font-bold text-lg">
                    {dep.name.charAt(0)}
                  </div>
                  <button
                    onClick={() => deleteDependent(dep.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    title="Remove Dependent"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h4 className="font-bold text-lg text-[#3a3135]">{dep.name}</h4>
                  <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-purple-50 text-[#7C3AED] font-bold text-xs border border-purple-100">
                    {dep.relation}
                  </span>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#EDE9FE] text-xs">
                  <div className="flex items-center justify-between text-[#7a6f75]">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#7C3AED]" /> Date of Birth:
                    </span>
                    <span className="font-bold text-[#3a3135]">{dep.dob}</span>
                  </div>

                  <div className="flex items-center justify-between text-[#7a6f75]">
                    <span className="flex items-center gap-1.5">
                      <Droplet className="w-3.5 h-3.5 text-pink-500" /> Blood Group:
                    </span>
                    <span className="font-bold text-[#3a3135]">{dep.bloodGroup}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#EDE9FE] flex items-center justify-between text-[11px] text-[#7a6f75]">
                <span className="font-mono text-gray-400">ID: {dep.id}</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  Active Care Profile
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Dependent Modal */}
      {showAddDepModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 font-inter">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-[#EDE9FE] shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#3a3135]">Add Dependent</h3>
                  <p className="text-xs text-[#7a6f75]">Save new care profile to PostgreSQL database</p>
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#3a3135] uppercase text-[10px] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newDep.name}
                  onChange={(e) => setNewDep({ ...newDep, name: e.target.value })}
                  placeholder="e.g. Sophia Rostova"
                  className={`w-full p-3 rounded-xl border ${
                    newDep.name.trim() && !isValidName(newDep.name)
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-[#EDE9FE] focus:border-[#7C3AED]'
                  } outline-none text-sm font-medium`}
                  required
                />
                {newDep.name.trim() && !isValidName(newDep.name) && (
                  <p className="text-xs mt-1 text-red-500 font-medium">Please enter letters only (min 2 characters)</p>
                )}
              </div>

              <div>
                <label className="block font-bold text-[#3a3135] uppercase text-[10px] mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={newDep.dob}
                  onChange={(e) => setNewDep({ ...newDep, dob: e.target.value })}
                  className={`w-full p-3 rounded-xl border ${
                    newDep.dob && !isPastOrToday(newDep.dob)
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-[#EDE9FE] focus:border-[#7C3AED]'
                  } bg-white outline-none text-sm`}
                  required
                />
                {newDep.dob && !isPastOrToday(newDep.dob) && (
                  <p className="text-xs mt-1 text-red-500 font-medium">Date of birth cannot be in the future</p>
                )}
              </div>

              <div>
                <label className="block font-bold text-[#3a3135] uppercase text-[10px] mb-1">
                  Relationship to Dependent
                </label>
                <select
                  value={newDep.relation}
                  onChange={(e) => setNewDep({ ...newDep, relation: e.target.value })}
                  className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-white outline-none focus:border-[#7C3AED] text-sm font-medium"
                >
                  <option value="Child (Daughter)">Child (Daughter)</option>
                  <option value="Child (Son)">Child (Son)</option>
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Spouse / Partner">Spouse / Partner</option>
                  <option value="Sister">Sister</option>
                  <option value="Brother">Brother</option>
                  <option value="Grandparent">Grandparent</option>
                  <option value="Elder Relative">Elder Relative</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#3a3135] uppercase text-[10px] mb-1">
                  Blood Group
                </label>
                <select
                  value={newDep.bloodGroup}
                  onChange={(e) => setNewDep({ ...newDep, bloodGroup: e.target.value })}
                  className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-white outline-none focus:border-[#7C3AED] text-sm font-medium"
                >
                  <option value="A Positive (A+)">A Positive (A+)</option>
                  <option value="A Negative (A-)">A Negative (A-)</option>
                  <option value="B Positive (B+)">B Positive (B+)</option>
                  <option value="B Negative (B-)">B Negative (B-)</option>
                  <option value="O Positive (O+)">O Positive (O+)</option>
                  <option value="O Negative (O-)">O Negative (O-)</option>
                  <option value="AB Positive (AB+)">AB Positive (AB+)</option>
                  <option value="AB Negative (AB-)">AB Negative (AB-)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-3 border-t border-[#EDE9FE]">
                <button
                  type="button"
                  disabled={isAddingDep}
                  onClick={() => setShowAddDepModal(false)}
                  className="flex-1 py-3 border border-[#EDE9FE] rounded-xl font-bold text-xs hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingDep}
                  className="flex-1 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {isAddingDep ? 'Saving to Database...' : 'Save Dependent'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
