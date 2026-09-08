import React from 'react';
import { Search, Stethoscope, Check, X, Ban } from 'lucide-react';
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

  const filteredDoctors = doctors.filter(d => 
    (d.name && d.name.toLowerCase().includes(searchDoctor.toLowerCase())) || 
    (d.email && d.email.toLowerCase().includes(searchDoctor.toLowerCase())) ||
    (d.spec && d.spec.toLowerCase().includes(searchDoctor.toLowerCase())) ||
    (d.license && d.license.toLowerCase().includes(searchDoctor.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EDE9FE] pb-4">
        <div>
          <h3 className="font-bold text-2xl text-[#3a3135]">Manage Doctors & Verification</h3>
          <p className="text-sm text-[#64595e]">Review medical practitioner licenses and set active privileges</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-[#7a6f75] absolute left-3 top-3" />
          <input 
            type="text" 
            placeholder="Search doctors..." 
            value={searchDoctor}
            onChange={(e) => setSearchDoctor(e.target.value)}
            className="pl-9 pr-4 py-2.5 rounded-xl border border-[#EDE9FE] text-sm focus:ring-2 focus:ring-[#7C3AED] outline-none w-full md:w-64"
          />
        </div>
      </div>

      {/* Doctors Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm font-inter">
          <thead className="bg-[#FAF8FC] text-[#3a3135] uppercase text-xs font-bold border-b border-[#EDE9FE]">
            <tr>
              <th className="p-4">Doctor ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Specialty</th>
              <th className="p-4">Medical License</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Verification Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EDE9FE]">
            {filteredDoctors.map(d => (
              <tr key={d.id} className="hover:bg-[#FAF8FC] transition-colors">
                <td className="p-4 font-bold text-[#F472B6]">#{d.id}</td>
                <td className="p-4">
                  <p className="font-bold text-[#3a3135]">{d.name}</p>
                  <p className="text-xs text-[#7a6f75]">{d.email}</p>
                </td>
                <td className="p-4 text-[#64595e]">{d.spec}</td>
                <td className="p-4 font-mono text-xs text-[#4A3B42] bg-[#FAF8FC] px-2 py-1 rounded inline-block mt-4 border border-[#EDE9FE]">
                  {d.license}
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    d.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                    d.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                    d.status === 'Suspended' ? 'bg-red-100 text-red-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {d.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  {d.status === 'Pending' ? (
                    <>
                      <button 
                        onClick={() => approveDoctor(d.id)} 
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button 
                        onClick={() => rejectDoctor(d.id)} 
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-bold text-xs transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                    </>
                  ) : d.status === 'Active' ? (
                    <button 
                      onClick={() => suspendDoctor(d.id)} 
                      className="px-3 py-1.5 border border-[#EDE9FE] text-red-600 hover:bg-red-50 rounded-lg font-bold text-xs transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <Ban className="w-3.5 h-3.5" /> Suspend
                    </button>
                  ) : (
                    <button 
                      onClick={() => approveDoctor(d.id)} 
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg font-bold text-xs transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Re-Activate
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filteredDoctors.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[#7a6f75] italic">
                  No doctors registered yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
