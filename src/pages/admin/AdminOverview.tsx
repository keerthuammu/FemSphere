import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Stethoscope, UserCheck, Activity } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminOverview() {
  const { stats, doctors, approveDoctor, rejectDoctor } = useAdmin();

  const pendingDoctors = doctors.filter(d => d.status === 'Pending');

  return (
    <div className="space-y-8">
      {/* TOP 4 SUMMARY STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Users */}
        <div className="bg-[#7C3AED] text-white p-6 rounded-3xl shadow-md flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-3 top-3 opacity-10">
            <Users className="w-24 h-24" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-purple-200 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              User Accounts
            </span>
            <h3 className="text-4xl font-bold mt-3">{stats.totalUsers}</h3>
            <p className="text-sm text-purple-100 mt-1 font-medium">Registered Myself / User Accounts</p>
          </div>
          <Link 
            to="/admin/users"
            className="mt-4 text-sm font-bold text-white hover:underline flex items-center gap-1"
          >
            Manage User Directory →
          </Link>
        </div>

        {/* Card 2: Total Caregivers */}
        <div className="bg-white p-6 rounded-3xl border border-[#EDE9FE] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#7a6f75] uppercase tracking-wider">Caregivers</span>
            <div className="p-2.5 rounded-2xl bg-[#CCFBF1] text-[#14B8A6]">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-4xl font-bold text-[#3a3135]">{stats.totalCaregivers}</h3>
            <p className="text-sm text-[#7a6f75] font-medium mt-1">Care & Proxy Accounts</p>
          </div>
          <Link 
            to="/admin/caregivers" 
            className="mt-3 text-sm font-bold text-[#7C3AED] hover:underline flex items-center gap-1"
          >
            View Caregivers →
          </Link>
        </div>

        {/* Card 3: Total Doctors */}
        <div className="bg-white p-6 rounded-3xl border border-[#EDE9FE] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#7a6f75] uppercase tracking-wider">Active Doctors</span>
            <div className="p-2.5 rounded-2xl bg-[#FCE7F3] text-[#F472B6]">
              <Stethoscope className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-4xl font-bold text-[#3a3135]">{stats.totalDoctors}</h3>
            <p className="text-sm text-[#7C3AED] font-bold mt-1">Verified Medical Specialists</p>
          </div>
          <Link 
            to="/admin/doctors" 
            className="mt-3 text-sm font-bold text-[#7C3AED] hover:underline flex items-center gap-1"
          >
            Manage Doctors →
          </Link>
        </div>

        {/* Card 4: Pending Doctor Approvals */}
        <div className="bg-white p-6 rounded-3xl border border-[#EDE9FE] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#7a6f75] uppercase tracking-wider">Pending Approvals</span>
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-4xl font-bold text-amber-600">{stats.pendingDoctorApprovals}</h3>
            <p className="text-sm text-amber-700 font-bold mt-1">Licenses Awaiting Verification</p>
          </div>
          <Link 
            to="/admin/doctors" 
            className="mt-3 text-sm font-bold text-[#7C3AED] hover:underline flex items-center gap-1"
          >
            Review Registrations →
          </Link>
        </div>
      </div>

      {/* RECENT AUDIT LOGS & DOCTOR VERIFICATION PREVIEW */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Doctor Registrations Needing Approval */}
        <div className="bg-white rounded-3xl p-6 border border-[#EDE9FE] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE]">
            <h3 className="font-bold text-lg text-[#3a3135] flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-[#7C3AED]" /> Pending Doctor Licenses
            </h3>
            <Link to="/admin/doctors" className="text-sm font-bold text-[#7C3AED] hover:underline">View All</Link>
          </div>

          <div className="space-y-3">
            {pendingDoctors.map((doc) => (
              <div key={doc.id} className="p-4 rounded-2xl border border-[#EDE9FE] bg-[#FAF8FC] flex items-center justify-between text-sm">
                <div>
                  <p className="font-bold text-[#3a3135] text-base">{doc.name}</p>
                  <p className="text-[#64595e] mt-0.5 font-medium">{doc.spec} • License: {doc.license}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => approveDoctor(doc.id)} 
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => rejectDoctor(doc.id)} 
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
            {pendingDoctors.length === 0 && (
              <p className="text-sm text-[#7a6f75] italic p-4 text-center">No pending doctor approvals.</p>
            )}
          </div>
        </div>

        {/* System Activity Overview */}
        <div className="bg-white rounded-3xl p-6 border border-[#EDE9FE] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE]">
            <h3 className="font-bold text-lg text-[#3a3135] flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#14B8A6]" /> System Security Log
            </h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">All Systems Operational</span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="p-3.5 rounded-2xl border border-[#EDE9FE] bg-white flex items-center justify-between">
              <div>
                <p className="font-bold text-[#3a3135]">User Account Verification</p>
                <p className="text-xs text-[#7a6f75]">Database token authentication verified</p>
              </div>
              <span className="text-xs text-[#7a6f75]">Live</span>
            </div>
            <div className="p-3.5 rounded-2xl border border-[#EDE9FE] bg-white flex items-center justify-between">
              <div>
                <p className="font-bold text-[#3a3135]">Doctor Credentials Ledger</p>
                <p className="text-xs text-[#7a6f75]">License verification pipeline synchronized</p>
              </div>
              <span className="text-xs text-[#7a6f75]">Active</span>
            </div>
            <div className="p-3.5 rounded-2xl border border-[#EDE9FE] bg-white flex items-center justify-between">
              <div>
                <p className="font-bold text-[#3a3135]">Caregiver & Proxy Relations</p>
                <p className="text-xs text-[#7a6f75]">Encrypted dependent health twin links active</p>
              </div>
              <span className="text-xs text-[#7a6f75]">Secured</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
