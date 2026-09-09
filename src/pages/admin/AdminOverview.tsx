import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Stethoscope, UserCheck, Activity } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminOverview() {
  const { stats, doctors, approveDoctor, rejectDoctor } = useAdmin();

  const pendingDoctors = doctors.filter(d => d.status === 'Pending');

  return (
    <div className="space-y-5">
      {/* TOP 4 SUMMARY STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Users */}
        <div className="bg-[#7C3AED] text-white p-4.5 rounded-2xl shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-2 top-2 opacity-10">
            <Users className="w-20 h-20" />
          </div>
          <div>
            <span className="text-[11px] uppercase font-bold tracking-wider text-purple-200 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
              User Accounts
            </span>
            <h3 className="text-3xl font-bold mt-2">{stats.totalUsers}</h3>
            <p className="text-xs text-purple-100 mt-0.5 font-medium">Registered Myself / User Accounts</p>
          </div>
          <Link 
            to="/admin/users"
            className="mt-3 text-xs font-bold text-white hover:underline flex items-center gap-1"
          >
            Manage User Directory →
          </Link>
        </div>

        {/* Card 2: Total Caregivers */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#EDE9FE] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#7a6f75] uppercase tracking-wider">Caregivers</span>
            <div className="p-2 rounded-xl bg-[#CCFBF1] text-[#14B8A6]">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-1.5">
            <h3 className="text-3xl font-bold text-[#3a3135]">{stats.totalCaregivers}</h3>
            <p className="text-xs text-[#7a6f75] font-medium mt-0.5">Care & Proxy Accounts</p>
          </div>
          <Link 
            to="/admin/caregivers" 
            className="mt-2.5 text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1"
          >
            View Caregivers →
          </Link>
        </div>

        {/* Card 3: Total Doctors */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#EDE9FE] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#7a6f75] uppercase tracking-wider">Active Doctors</span>
            <div className="p-2 rounded-xl bg-[#FCE7F3] text-[#F472B6]">
              <Stethoscope className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-1.5">
            <h3 className="text-3xl font-bold text-[#3a3135]">{stats.totalDoctors}</h3>
            <p className="text-xs text-[#7C3AED] font-bold mt-0.5">Verified Medical Specialists</p>
          </div>
          <Link 
            to="/admin/doctors" 
            className="mt-2.5 text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1"
          >
            Manage Doctors →
          </Link>
        </div>

        {/* Card 4: Pending Doctor Approvals */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#EDE9FE] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#7a6f75] uppercase tracking-wider">Pending Approvals</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-1.5">
            <h3 className="text-3xl font-bold text-amber-600">{stats.pendingDoctorApprovals}</h3>
            <p className="text-xs text-amber-700 font-bold mt-0.5">Licenses Awaiting Verification</p>
          </div>
          <Link 
            to="/admin/doctors" 
            className="mt-2.5 text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1"
          >
            Review Registrations →
          </Link>
        </div>
      </div>

      {/* RECENT AUDIT LOGS & DOCTOR VERIFICATION PREVIEW */}
      <div className="grid md:grid-cols-2 gap-4">
        
        {/* Doctor Registrations Needing Approval */}
        <div className="bg-white rounded-2xl p-5 border border-[#EDE9FE] shadow-xs space-y-3.5">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#EDE9FE]">
            <h3 className="font-bold text-base text-[#3a3135] flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-[#7C3AED]" /> Pending Doctor Licenses
            </h3>
            <Link to="/admin/doctors" className="text-xs font-bold text-[#7C3AED] hover:underline">View All</Link>
          </div>

          <div className="space-y-2.5">
            {pendingDoctors.map((doc) => (
              <div key={doc.id} className="p-3 rounded-xl border border-[#EDE9FE] bg-[#FAF8FC] flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-[#3a3135] text-sm">{doc.name}</p>
                  <p className="text-[#64595e] mt-0.5 font-medium">{doc.spec} • License: {doc.license}</p>
                </div>
                <div className="flex gap-1.5">
                  <button 
                    onClick={() => approveDoctor(doc.id)} 
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs transition-colors cursor-pointer"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => rejectDoctor(doc.id)} 
                    className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
            {pendingDoctors.length === 0 && (
              <p className="text-xs text-[#7a6f75] italic p-3 text-center">No pending doctor approvals.</p>
            )}
          </div>
        </div>

        {/* System Activity Overview */}
        <div className="bg-white rounded-2xl p-5 border border-[#EDE9FE] shadow-xs space-y-3.5">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#EDE9FE]">
            <h3 className="font-bold text-base text-[#3a3135] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#14B8A6]" /> System Security Log
            </h3>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">All Systems Operational</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl border border-[#EDE9FE] bg-white flex items-center justify-between">
              <div>
                <p className="font-bold text-[#3a3135]">User Account Verification</p>
                <p className="text-[11px] text-[#7a6f75]">Database token authentication verified</p>
              </div>
              <span className="text-[11px] text-[#7a6f75]">Live</span>
            </div>
            <div className="p-3 rounded-xl border border-[#EDE9FE] bg-white flex items-center justify-between">
              <div>
                <p className="font-bold text-[#3a3135]">Doctor Credentials Ledger</p>
                <p className="text-[11px] text-[#7a6f75]">License verification pipeline synchronized</p>
              </div>
              <span className="text-[11px] text-[#7a6f75]">Active</span>
            </div>
            <div className="p-3 rounded-xl border border-[#EDE9FE] bg-white flex items-center justify-between">
              <div>
                <p className="font-bold text-[#3a3135]">Caregiver & Proxy Relations</p>
                <p className="text-[11px] text-[#7a6f75]">Encrypted dependent health twin links active</p>
              </div>
              <span className="text-[11px] text-[#7a6f75]">Secured</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
