import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Trash2, Users, User, ShieldCheck, ChevronRight } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminCaregivers() {
  const {
    caregivers,
    searchCaregiver,
    setSearchCaregiver,
    setShowAddCaregiverModal,
    handleDeleteCaregiver
  } = useAdmin();

  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'PARENTS' | 'PROXIES'>('ALL');

  const isParent = (c: any) => {
    const rel = (c.relation || '').toLowerCase();
    return rel.includes('parent') || rel.includes('mother') || rel.includes('father') || rel.includes('child');
  };

  const countParents = caregivers.filter(isParent).length;
  const countProxies = caregivers.filter(c => !isParent(c)).length;
  const totalDependents = caregivers.reduce((acc, c) => acc + (c.dependentsCount || 0), 0);

  const caregiverFilters = [
    { id: 'ALL' as const, label: 'All Caregivers', count: caregivers.length, icon: Users, iconColor: 'text-[#7C3AED]' },
    { id: 'PARENTS' as const, label: 'Parents & Family', count: countParents, icon: User, iconColor: 'text-[#14B8A6]' },
    { id: 'PROXIES' as const, label: 'Healthcare Proxies', count: countProxies, icon: ShieldCheck, iconColor: 'text-[#F472B6]' }
  ];

  const filteredCaregivers = caregivers.filter(c => {
    // Relationship category filter
    if (selectedFilter === 'PARENTS' && !isParent(c)) return false;
    if (selectedFilter === 'PROXIES' && isParent(c)) return false;

    // Search query filter
    if (!searchCaregiver.trim()) return true;
    const q = searchCaregiver.toLowerCase();
    return (
      (c.name && c.name.toLowerCase().includes(q)) || 
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.relation && c.relation.toLowerCase().includes(q))
    );
  });

  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#EDE9FE] shadow-xs space-y-4 font-inter">
      {/* TOP HEADER & SEARCH / ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#EDE9FE] pb-3.5">
        <div>
          <h3 className="font-bold text-xl text-[#3a3135]">Manage Caregivers</h3>
          <p className="text-xs text-[#64595e]">Family members and healthcare proxies managing dependents</p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#7a6f75] absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Search caregivers..." 
              value={searchCaregiver}
              onChange={(e) => setSearchCaregiver(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-[#EDE9FE] text-xs focus:ring-2 focus:ring-[#7C3AED] outline-none"
            />
          </div>
          <button 
            onClick={() => setShowAddCaregiverModal(true)} 
            className="px-3.5 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Add Caregiver
          </button>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-0.5 pb-1">
        <div className="flex flex-wrap items-center gap-2">
          {caregiverFilters.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                selectedFilter === tab.id
                  ? 'bg-[#7C3AED] text-white shadow-xs'
                  : 'bg-[#FAF8FC] text-[#64595e] border border-[#EDE9FE] hover:bg-[#F5F3FF] hover:text-[#7C3AED]'
              }`}
            >
              <tab.icon className={`w-3.5 h-3.5 ${selectedFilter === tab.id ? 'text-white' : tab.iconColor}`} />
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                selectedFilter === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-[#EDE9FE] text-[#7C3AED]'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Caregivers Table */}
      <div className="overflow-x-auto rounded-xl border border-[#EDE9FE]">
        <table className="w-full text-left text-xs font-inter">
          <thead className="bg-[#FAF8FC] text-[#3a3135] uppercase text-[11px] font-bold border-b border-[#EDE9FE]">
            <tr>
              <th className="p-3">Caregiver ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Relationship</th>
              <th className="p-3">Dependents</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EDE9FE]">
            {filteredCaregivers.map(c => (
              <tr key={c.id} className="hover:bg-[#FAF8FC] transition-colors">
                <td className="p-3 font-bold text-[#14B8A6]">#{c.id}</td>
                <td className="p-3 font-bold text-[#3a3135]">{c.name}</td>
                <td className="p-3 text-[#64595e]">{c.email}</td>
                <td className="p-3 text-[#7a6f75]">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#FAF8FC] text-[#4A3B42] border border-[#EDE9FE]">
                    {c.relation || 'Guardian'}
                  </span>
                </td>
                <td className="p-3 font-bold text-[#7C3AED]">
                  <Link
                    to={`/admin/caregivers/${String(c.id).replace(/\D/g, '')}/dependents`}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white border border-purple-200 text-[11px] font-bold transition-all cursor-pointer shadow-2xs group"
                    title="Click to view all dependents under this caregiver"
                  >
                    <Users className="w-3 h-3 group-hover:text-white transition-colors" />
                    <span>{c.dependentsCount} {c.dependentsCount === 1 ? 'Dependent' : 'Dependents'}</span>
                    <ChevronRight className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </td>
                <td className="p-3 text-right">
                  <button 
                    onClick={() => handleDeleteCaregiver(c.id)} 
                    className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer inline-flex items-center"
                    title="Delete Caregiver"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredCaregivers.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-[#7a6f75] italic">
                  No caregivers registered yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* SUMMARY BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 bg-[#FAF8FC] rounded-xl border border-[#EDE9FE] text-xs font-inter">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#3a3135]">
            Showing {filteredCaregivers.length} of {caregivers.length} caregiver{caregivers.length === 1 ? '' : 's'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#64595e]">
            Total Dependents Managed: {totalDependents}
          </span>
        </div>
      </div>
    </div>
  );
}
