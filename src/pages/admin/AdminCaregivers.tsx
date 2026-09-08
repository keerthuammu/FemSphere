import React from 'react';
import { Search, Plus, Trash2, Users } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminCaregivers() {
  const {
    caregivers,
    searchCaregiver,
    setSearchCaregiver,
    setShowAddCaregiverModal,
    handleDeleteCaregiver
  } = useAdmin();

  const filteredCaregivers = caregivers.filter(c => 
    (c.name && c.name.toLowerCase().includes(searchCaregiver.toLowerCase())) || 
    (c.email && c.email.toLowerCase().includes(searchCaregiver.toLowerCase())) ||
    (c.relation && c.relation.toLowerCase().includes(searchCaregiver.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EDE9FE] pb-4">
        <div>
          <h3 className="font-bold text-2xl text-[#3a3135]">Manage Caregivers</h3>
          <p className="text-sm text-[#64595e]">Family members and healthcare proxies managing dependents</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#7a6f75] absolute left-3 top-3" />
            <input 
              type="text" 
              placeholder="Search caregivers..." 
              value={searchCaregiver}
              onChange={(e) => setSearchCaregiver(e.target.value)}
              className="pl-9 pr-4 py-2.5 rounded-xl border border-[#EDE9FE] text-sm focus:ring-2 focus:ring-[#7C3AED] outline-none"
            />
          </div>
          <button 
            onClick={() => setShowAddCaregiverModal(true)} 
            className="px-5 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Caregiver
          </button>
        </div>
      </div>

      {/* Caregivers Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm font-inter">
          <thead className="bg-[#FAF8FC] text-[#3a3135] uppercase text-xs font-bold border-b border-[#EDE9FE]">
            <tr>
              <th className="p-4">Caregiver ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Relationship</th>
              <th className="p-4">Dependents</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EDE9FE]">
            {filteredCaregivers.map(c => (
              <tr key={c.id} className="hover:bg-[#FAF8FC] transition-colors">
                <td className="p-4 font-bold text-[#14B8A6]">#{c.id}</td>
                <td className="p-4 font-bold text-[#3a3135]">{c.name}</td>
                <td className="p-4 text-[#64595e]">{c.email}</td>
                <td className="p-4 text-[#7a6f75]">{c.relation || 'Guardian'}</td>
                <td className="p-4 font-bold text-[#7C3AED]">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#7C3AED] border border-purple-100 text-xs">
                    <Users className="w-3.5 h-3.5" />
                    {c.dependentsCount} {c.dependentsCount === 1 ? 'Dependent' : 'Dependents'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => handleDeleteCaregiver(c.id)} 
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Caregiver"
                  >
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredCaregivers.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[#7a6f75] italic">
                  No caregivers registered yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
