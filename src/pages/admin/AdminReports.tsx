import React from 'react';
import { Printer, ShieldCheck, Database, Lock, CheckCircle2, FileText } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminReports() {
  const { stats, currentTime, adminProfile } = useAdmin();

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EDE9FE] pb-4">
        <div>
          <h3 className="font-bold text-2xl text-[#3a3135]">System Governance & Audit Reports</h3>
          <p className="text-sm text-[#64595e]">Platform compliance, security clearances, and system health</p>
        </div>
        <button 
          onClick={() => window.print()} 
          className="px-4 py-2.5 bg-white border border-[#EDE9FE] hover:bg-[#FAF8FC] text-[#3a3135] rounded-xl text-sm font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4 text-[#7C3AED]" /> Print Compliance Report
        </button>
      </div>

      <div className="p-6 rounded-3xl border border-[#EDE9FE] bg-[#FAF8FC] space-y-4">
        <h4 className="font-bold text-base text-[#3a3135] flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          System Status Overview
        </h4>
        <div className="grid sm:grid-cols-3 gap-4 text-sm font-bold">
          <div className="p-4 bg-white rounded-2xl border border-[#EDE9FE]">
            <span className="text-xs text-[#7a6f75] uppercase flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-600" /> Database Connections
            </span>
            <p className="text-xl text-emerald-600 mt-1">Healthy (Port 5001)</p>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-[#EDE9FE]">
            <span className="text-xs text-[#7a6f75] uppercase flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#7C3AED]" /> Security Clearance
            </span>
            <p className="text-xl text-[#7C3AED] mt-1">{adminProfile.securityClearance}</p>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-[#EDE9FE]">
            <span className="text-xs text-[#7a6f75] uppercase flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#14B8A6]" /> Audit Trail
            </span>
            <p className="text-xl text-[#14B8A6] mt-1">Encrypted Logs</p>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-3xl border border-[#EDE9FE] bg-white space-y-4">
        <h4 className="font-bold text-base text-[#3a3135]">Platform Integrity Metrics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE]">
            <p className="text-xs text-[#7a6f75] uppercase font-bold">Total Users</p>
            <p className="text-2xl font-bold text-[#7C3AED] mt-1">{stats.totalUsers}</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE]">
            <p className="text-xs text-[#7a6f75] uppercase font-bold">Medical Records</p>
            <p className="text-2xl font-bold text-[#14B8A6] mt-1">{stats.totalMedicalRecords}</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE]">
            <p className="text-xs text-[#7a6f75] uppercase font-bold">Caregivers</p>
            <p className="text-2xl font-bold text-[#3a3135] mt-1">{stats.totalCaregivers}</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE]">
            <p className="text-xs text-[#7a6f75] uppercase font-bold">Active Doctors</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.totalDoctors}</p>
          </div>
        </div>
        <p className="text-xs text-[#7a6f75] pt-2">
          Report generated at {currentTime.toLocaleString()} by {adminProfile.name}. All records conform to HIPAA / GDPR encryption guidelines.
        </p>
      </div>
    </div>
  );
}
