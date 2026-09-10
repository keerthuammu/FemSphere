import React, { useState } from 'react';
import { Search, Stethoscope, Check, X, Ban, Clock } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminDoctors() {
  const {
    doctors,
    searchDoctor,
    setSearchDoctor,
    approveDoctor,
    rejectDoctor,
    suspendDoctor
  } = useAdmin();

  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'ACTIVE' | 'PENDING' | 'SUSPENDED'>('ALL');

  const countActive = doctors.filter(d => d.status === 'Active').length;
  const countPending = doctors.filter(d => d.status === 'Pending').length;
  const countSuspended = doctors.filter(d => d.status === 'Suspended' || d.status === 'Rejected').length;

  const doctorTypeFilters = [
    { id: 'ALL' as const, label: 'All Doctors', count: doctors.length, icon: Stethoscope, iconColor: 'text-[#7C3AED]' },
    { id: 'ACTIVE' as const, label: 'Active Doctors', count: countActive, icon: Check, iconColor: 'text-emerald-600' },
    { id: 'PENDING' as const, label: 'Pending Review', count: countPending, icon: Clock, iconColor: 'text-amber-600' },
    { id: 'SUSPENDED' as const, label: 'Suspended', count: countSuspended, icon: Ban, iconColor: 'text-rose-600' }
  ];

  const filteredDoctors = doctors.filter(d => {
    // Status filter
    if (selectedFilter === 'ACTIVE' && d.status !== 'Active') return false;
    if (selectedFilter === 'PENDING' && d.status !== 'Pending') return false;
    if (selectedFilter === 'SUSPENDED' && d.status !== 'Suspended' && d.status !== 'Rejected') return false;

    // Search query filter
    if (!searchDoctor.trim()) return true;
    const q = searchDoctor.toLowerCase();
    return (
      (d.name && d.name.toLowerCase().includes(q)) || 
      (d.email && d.email.toLowerCase().includes(q)) ||
      (d.spec && d.spec.toLowerCase().includes(q)) ||
      (d.license && d.license.toLowerCase().includes(q))
    );
  });

  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#EDE9FE] shadow-xs space-y-4 font-inter">
      {/* TOP HEADER & SEARCH */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#EDE9FE] pb-3.5">
        <div>
          <h3 className="font-bold text-xl text-[#3a3135]">Manage Doctors & Verification</h3>
          <p className="text-xs text-[#64595e]">Review medical practitioner licenses and set active privileges</p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#7a6f75] absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Search doctors..." 
              value={searchDoctor}
              onChange={(e) => setSearchDoctor(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-[#EDE9FE] text-xs focus:ring-2 focus:ring-[#7C3AED] outline-none"
            />
          </div>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-0.5 pb-1">
        <div className="flex flex-wrap items-center gap-2">
          {doctorTypeFilters.map((tab) => (
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

      {/* Doctors Table */}
      <div className="overflow-x-auto rounded-xl border border-[#EDE9FE]">
        <table className="w-full text-left text-xs font-inter">
          <thead className="bg-[#FAF8FC] text-[#3a3135] uppercase text-[11px] font-bold border-b border-[#EDE9FE]">
            <tr>
              <th className="p-3">Doctor ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Specialty</th>
              <th className="p-3">Medical License</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Verification Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EDE9FE]">
            {filteredDoctors.map(d => (
              <tr key={d.id} className="hover:bg-[#FAF8FC] transition-colors">
                <td className="p-3 font-bold text-[#F472B6]">#{d.id}</td>
                <td className="p-3">
                  <p className="font-bold text-[#3a3135]">{d.name}</p>
                  <p className="text-[11px] text-[#7a6f75]">{d.email}</p>
                </td>
                <td className="p-3 text-[#64595e]">{d.spec}</td>
                <td className="p-3">
                  <span className="font-mono text-[11px] text-[#4A3B42] bg-[#FAF8FC] px-2 py-0.5 rounded border border-[#EDE9FE]">
                    {d.license}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    d.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                    d.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                    d.status === 'Suspended' ? 'bg-red-100 text-red-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {d.status}
                  </span>
                </td>
                <td className="p-3 text-right space-x-1.5">
                  {d.status === 'Pending' ? (
                    <>
                      <button 
                        onClick={() => approveDoctor(d.id)} 
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button 
                        onClick={() => rejectDoctor(d.id)} 
                        className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg font-bold text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                    </>
                  ) : d.status === 'Active' ? (
                    <button 
                      onClick={() => suspendDoctor(d.id)} 
                      className="px-2.5 py-1 border border-[#EDE9FE] text-rose-600 hover:bg-rose-50 rounded-lg font-bold text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <Ban className="w-3.5 h-3.5" /> Suspend
                    </button>
                  ) : (
                    <button 
                      onClick={() => approveDoctor(d.id)} 
                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg font-bold text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Re-Activate
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filteredDoctors.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-[#7a6f75] italic">
                  No doctors found matching the criteria.
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
            Showing {filteredDoctors.length} of {doctors.length} doctor{doctors.length === 1 ? '' : 's'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {countPending > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
              {countPending} Pending Verification
            </span>
          )}
          <span className="text-[#64595e]">
            {countActive} Active License{countActive === 1 ? '' : 's'}
          </span>
        </div>
      </div>
    </div>
  );
}
