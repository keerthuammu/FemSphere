import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Stethoscope, 
  UserCheck, 
  Activity, 
  Printer, 
  ShieldCheck, 
  Database, 
  Lock, 
  FileText, 
  FolderHeart,
  Sparkles
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminOverview() {
  const { stats, doctors, approveDoctor, rejectDoctor, adminProfile, currentTime } = useAdmin();

  const pendingDoctors = doctors.filter(d => d.status === 'Pending');

  return (
    <div className="space-y-5 font-inter">
      {/* DASHBOARD HEADER & QUICK PRINT COMPLIANCE REPORT */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4.5 md:p-5 rounded-2xl border border-[#EDE9FE] shadow-xs">
        <div>
          <h2 className="font-bold text-xl text-[#3a3135] flex items-center gap-2">
            <span>Admin Dashboard</span>
            <span className="text-[11px] font-bold text-[#7C3AED] bg-[#EDE9FE] px-2.5 py-0.5 rounded-full">
              System Control
            </span>
          </h2>
          <p className="text-xs text-[#64595e] mt-0.5">
            Platform governance, clinical telemetry, and live system health metrics
          </p>
        </div>
        <button 
          onClick={() => window.print()} 
          className="px-3.5 py-2 bg-white border border-[#EDE9FE] hover:bg-[#FAF8FC] text-[#3a3135] rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          title="Print official governance and compliance report"
        >
          <Printer className="w-3.5 h-3.5 text-[#7C3AED]" /> Print Compliance Report
        </button>
      </div>

      {/* TOP 5 SUMMARY STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Total Users */}
        <div className="bg-[#7C3AED] text-white p-4 rounded-2xl shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-2 top-2 opacity-10">
            <Users className="w-16 h-16" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-purple-200 bg-white/10 px-2 py-0.5 rounded-full border border-white/20">
              Users
            </span>
            <h3 className="text-2xl font-bold mt-1.5">{stats.totalUsers}</h3>
            <p className="text-[11px] text-purple-100 font-medium">Regular Accounts</p>
          </div>
          <Link 
            to="/admin/users"
            className="mt-2 text-[11px] font-bold text-white hover:underline flex items-center gap-1"
          >
            Manage Users →
          </Link>
        </div>

        {/* Card 2: Total Caregivers */}
        <div className="bg-white p-4 rounded-2xl border border-[#EDE9FE] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#7a6f75] uppercase tracking-wider">Caregivers</span>
            <div className="p-1.5 rounded-lg bg-[#CCFBF1] text-[#14B8A6]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-1">
            <h3 className="text-2xl font-bold text-[#3a3135]">{stats.totalCaregivers}</h3>
            <p className="text-[11px] text-[#7a6f75] font-medium">Proxy Accounts</p>
          </div>
          <Link 
            to="/admin/caregivers" 
            className="mt-2 text-[11px] font-bold text-[#7C3AED] hover:underline flex items-center gap-1"
          >
            View Caregivers →
          </Link>
        </div>

        {/* Card 3: Total Doctors */}
        <div className="bg-white p-4 rounded-2xl border border-[#EDE9FE] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#7a6f75] uppercase tracking-wider">Active Doctors</span>
            <div className="p-1.5 rounded-lg bg-[#FCE7F3] text-[#F472B6]">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-1">
            <h3 className="text-2xl font-bold text-[#3a3135]">{stats.totalDoctors}</h3>
            <p className="text-[11px] text-[#7C3AED] font-bold">Verified Practitioners</p>
          </div>
          <Link 
            to="/admin/doctors" 
            className="mt-2 text-[11px] font-bold text-[#7C3AED] hover:underline flex items-center gap-1"
          >
            Manage Doctors →
          </Link>
        </div>

        {/* Card 4: Pending Approvals */}
        <div className="bg-white p-4 rounded-2xl border border-[#EDE9FE] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#7a6f75] uppercase tracking-wider">Pending Approvals</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-1">
            <h3 className="text-2xl font-bold text-amber-600">{stats.pendingDoctorApprovals}</h3>
            <p className="text-[11px] text-amber-700 font-bold">Awaiting Review</p>
          </div>
          <Link 
            to="/admin/doctors" 
            className="mt-2 text-[11px] font-bold text-[#7C3AED] hover:underline flex items-center gap-1"
          >
            Review Licenses →
          </Link>
        </div>

        {/* Card 5: Medical Records Vault (Integrated from Reports) */}
        <div className="bg-white p-4 rounded-2xl border border-[#EDE9FE] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#7a6f75] uppercase tracking-wider">Medical Vault</span>
            <div className="p-1.5 rounded-lg bg-purple-50 text-[#7C3AED]">
              <FolderHeart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-1">
            <h3 className="text-2xl font-bold text-[#7C3AED]">{stats.totalMedicalRecords}</h3>
            <p className="text-[11px] text-[#7a6f75] font-medium">Encrypted Clinical Records</p>
          </div>
          <span className="mt-2 text-[10px] font-bold text-emerald-600 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> HIPAA Compliant
          </span>
        </div>
      </div>

      {/* SYSTEM GOVERNANCE & AUDIT OVERVIEW (Integrated from System Reports) */}
      <div className="bg-white rounded-2xl p-5 border border-[#EDE9FE] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EDE9FE]">
          <h3 className="font-bold text-base text-[#3a3135] flex items-center gap-2">
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
            <span>System Governance & Platform Status</span>
          </h3>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
            All Systems Operational • HIPAA / GDPR Compliant
          </span>
        </div>

        <div className="grid sm:grid-cols-3 gap-3.5 text-xs font-medium">
          {/* Database Connections */}
          <div className="p-3.5 bg-[#FAF8FC] rounded-xl border border-[#EDE9FE]">
            <span className="text-[10px] text-[#7a6f75] uppercase font-bold flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-600" /> Database Connections
            </span>
            <p className="text-sm font-bold text-emerald-600 mt-1">Healthy (PostgreSQL Port 5001)</p>
            <p className="text-[11px] text-[#7a6f75] mt-0.5">Database: femsphere_db (Live Pool)</p>
          </div>

          {/* Security Clearance */}
          <div className="p-3.5 bg-[#FAF8FC] rounded-xl border border-[#EDE9FE]">
            <span className="text-[10px] text-[#7a6f75] uppercase font-bold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#7C3AED]" /> Security Clearance
            </span>
            <p className="text-sm font-bold text-[#7C3AED] mt-1">{adminProfile.securityClearance}</p>
            <p className="text-[11px] text-[#7a6f75] mt-0.5">Role: {adminProfile.role}</p>
          </div>

          {/* Audit Trail & Compliance */}
          <div className="p-3.5 bg-[#FAF8FC] rounded-xl border border-[#EDE9FE]">
            <span className="text-[10px] text-[#7a6f75] uppercase font-bold flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#14B8A6]" /> Audit Trail & Encryption
            </span>
            <p className="text-sm font-bold text-[#14B8A6] mt-1">Active (Encrypted Logs)</p>
            <p className="text-[11px] text-[#7a6f75] mt-0.5">AES-256 at Rest & TLS in Transit</p>
          </div>
        </div>

        <p className="text-[11px] text-[#7a6f75] pt-1">
          Governance snapshot synchronized at {currentTime.toLocaleString()} by {adminProfile.name}. All user and clinical data adhere strictly to healthcare privacy standards.
        </p>
      </div>

      {/* OPERATIONS ROW: DOCTOR VERIFICATION & SECURITY LOGS */}
      <div className="grid md:grid-cols-2 gap-4">
        
        {/* Doctor Registrations Needing Approval */}
        <div className="bg-white rounded-2xl p-5 border border-[#EDE9FE] shadow-xs space-y-3.5">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#EDE9FE]">
            <h3 className="font-bold text-sm text-[#3a3135] flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-[#7C3AED]" /> Pending Doctor Licenses
            </h3>
            <Link to="/admin/doctors" className="text-xs font-bold text-[#7C3AED] hover:underline">View All →</Link>
          </div>

          <div className="space-y-2.5">
            {pendingDoctors.map((doc) => (
              <div key={doc.id} className="p-3 rounded-xl border border-[#EDE9FE] bg-[#FAF8FC] flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-[#3a3135] text-xs">{doc.name}</p>
                  <p className="text-[#64595e] mt-0.5 text-[11px] font-medium">{doc.spec} • License: <span className="font-mono">{doc.license}</span></p>
                </div>
                <div className="flex gap-1.5">
                  <button 
                    onClick={() => approveDoctor(doc.id)} 
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] transition-colors cursor-pointer shadow-xs"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => rejectDoctor(doc.id)} 
                    className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
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
            <h3 className="font-bold text-sm text-[#3a3135] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#14B8A6]" /> System Security & Audit Logs
            </h3>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl border border-[#EDE9FE] bg-white flex items-center justify-between">
              <div>
                <p className="font-bold text-[#3a3135]">User Account Verification</p>
                <p className="text-[11px] text-[#7a6f75]">Database token authentication verified</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Live</span>
            </div>
            <div className="p-2.5 rounded-xl border border-[#EDE9FE] bg-white flex items-center justify-between">
              <div>
                <p className="font-bold text-[#3a3135]">Doctor Credentials Ledger</p>
                <p className="text-[11px] text-[#7a6f75]">License verification pipeline synchronized</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Active</span>
            </div>
            <div className="p-2.5 rounded-xl border border-[#EDE9FE] bg-white flex items-center justify-between">
              <div>
                <p className="font-bold text-[#3a3135]">Caregiver & Proxy Relations</p>
                <p className="text-[11px] text-[#7a6f75]">Encrypted dependent health twin links active</p>
              </div>
              <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">Secured</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
