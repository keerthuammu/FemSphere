import React from 'react';
import { Eye, Printer } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export default function UserReports() {
  const {
    userProfile,
    trackerLogs,
    symptomLogs,
    records,
    appointments,
    setShowReportPreview,
    handlePrintPDFReport
  } = useUser();

  const latestVital = trackerLogs[0];

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6 font-inter">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#EDE9FE] pb-4 gap-4">
        <div>
          <h3 className="font-bold text-xl text-[#3a3135]">Health Reports Generator</h3>
          <p className="text-xs text-[#7a6f75]">Consolidate personal profile, health vitals, symptoms, medical records & appointments into a PDF report</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowReportPreview(true)} 
            className="flex items-center gap-2 px-4 py-2.5 bg-[#EDE9FE] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4" /> View Full Report
          </button>
          <button 
            onClick={handlePrintPDFReport} 
            className="flex items-center gap-2 px-5 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4" /> Download PDF Report
          </button>
        </div>
      </div>

      {/* REPORT PREVIEW CONTAINER */}
      <div className="bg-[#FAF8FC] p-6 rounded-3xl border border-[#EDE9FE] space-y-6 text-xs font-inter">
        <div className="flex justify-between items-center pb-4 border-b border-[#EDE9FE]">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#7C3AED]">FemSphere Health Report</h2>
            <p className="text-xs text-[#7a6f75]">Generated on {new Date().toLocaleDateString()} for {userProfile.fullName || 'Patient'}</p>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">
            OFFICIAL REPORT
          </span>
        </div>

        {/* 1. Personal Profile Section */}
        <div className="space-y-2">
          <h4 className="font-bold text-sm text-[#3a3135] uppercase tracking-wider">1. Personal Profile</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3.5 bg-white rounded-xl border border-[#EDE9FE]">
            <div><span className="text-[#7a6f75]">Name:</span> <b>{userProfile.fullName || '--'}</b></div>
            <div><span className="text-[#7a6f75]">DOB:</span> <b>{userProfile.dob || '--'} ({userProfile.age} yrs)</b></div>
            <div><span className="text-[#7a6f75]">Blood Group:</span> <b>{userProfile.bloodGroup || '--'}</b></div>
            <div><span className="text-[#7a6f75]">Height/Weight:</span> <b>{userProfile.height || '--'}cm / {userProfile.weight || '--'}kg</b></div>
          </div>
        </div>

        {/* 2. Health Tracker Summary */}
        <div className="space-y-2">
          <h4 className="font-bold text-sm text-[#3a3135] uppercase tracking-wider">2. Health Vitals Summary (Latest Entry)</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3.5 bg-white rounded-xl border border-[#EDE9FE]">
            <div><span className="text-[#7a6f75]">Water Intake:</span> <b>{latestVital?.water || 0} L</b></div>
            <div><span className="text-[#7a6f75]">Sleep Duration:</span> <b>{latestVital?.sleep || 0} hrs</b></div>
            <div><span className="text-[#7a6f75]">Exercise:</span> <b>{latestVital?.exercise || 0} mins</b></div>
            <div><span className="text-[#7a6f75]">Blood Pressure:</span> <b>{latestVital?.bloodPressure || '120/78'}</b></div>
          </div>
        </div>

        {/* 3. Symptom History */}
        <div className="space-y-2">
          <h4 className="font-bold text-sm text-[#3a3135] uppercase tracking-wider">3. Logged Symptom History</h4>
          <div className="space-y-2">
            {symptomLogs.map((s) => (
              <div key={s.id} className="p-3 bg-white rounded-xl border border-[#EDE9FE] flex justify-between">
                <span><b>{s.symptomName}</b> ({s.description || 'Logged observation'})</span>
                <span className="font-bold text-[#7C3AED]">{s.severity} • {s.date}</span>
              </div>
            ))}
            {symptomLogs.length === 0 && (
              <p className="text-[#7a6f75] italic p-3 bg-white rounded-xl border border-[#EDE9FE]">No recent symptoms logged.</p>
            )}
          </div>
        </div>

        {/* 4. Medical Records Summary */}
        <div className="space-y-2">
          <h4 className="font-bold text-sm text-[#3a3135] uppercase tracking-wider">4. Medical Records Vault</h4>
          <div className="space-y-2">
            {records.map((r) => (
              <div key={r.id} className="p-3 bg-white rounded-xl border border-[#EDE9FE] flex justify-between">
                <span><b>{r.title}</b> ({r.type})</span>
                <span className="text-[#7a6f75]">{r.date}</span>
              </div>
            ))}
            {records.length === 0 && (
              <p className="text-[#7a6f75] italic p-3 bg-white rounded-xl border border-[#EDE9FE]">No medical documents uploaded.</p>
            )}
          </div>
        </div>

        {/* 5. Appointment History */}
        <div className="space-y-2">
          <h4 className="font-bold text-sm text-[#3a3135] uppercase tracking-wider">5. Appointment History</h4>
          <div className="space-y-2">
            {appointments.map((a) => (
              <div key={a.id} className="p-3 bg-white rounded-xl border border-[#EDE9FE] flex justify-between">
                <span><b>{a.doctor}</b> - {a.reason}</span>
                <span className="font-bold text-purple-700">{a.status} ({a.date})</span>
              </div>
            ))}
            {appointments.length === 0 && (
              <p className="text-[#7a6f75] italic p-3 bg-white rounded-xl border border-[#EDE9FE]">No appointment records available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
