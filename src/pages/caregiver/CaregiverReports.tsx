import React, { useState } from 'react';
import { FileText, Printer, FileCheck, CheckCircle2 } from 'lucide-react';
import { useCaregiver } from '../../context/CaregiverContext';

export default function CaregiverReports() {
  const { dependents, vaccinations, medications, records } = useCaregiver();
  const [selectedReportDep, setSelectedReportDep] = useState(dependents[0]?.name || '');

  // Keep selectedReportDep in sync if dependents load asynchronously
  React.useEffect(() => {
    if (!selectedReportDep && dependents.length > 0) {
      setSelectedReportDep(dependents[0].name);
    }
  }, [dependents, selectedReportDep]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200 font-inter">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#7C3AED] mb-1">
            <FileText className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Longitudinal Analytics</span>
          </div>
          <h3 className="font-serif text-3xl font-bold text-[#3a3135]">Dependent Health Reports</h3>
          <p className="text-xs text-[#7a6f75] mt-1">
            Aggregate clinical trends, vaccination milestones, and longitudinal adherence for doctor visits.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-5 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer w-fit"
        >
          <Printer className="w-4 h-4" /> Print / Export PDF
        </button>
      </div>

      {dependents.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-[#EDE9FE] shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-purple-50 text-[#7C3AED] flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <h4 className="font-serif text-xl font-bold text-[#3a3135]">No Linked Dependents</h4>
          <p className="text-xs text-[#7a6f75] max-w-md mx-auto">
            To generate and review longitudinal health reports, please first add a dependent under Manage Dependents.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EDE9FE]">
            <div>
              <span className="text-xs font-bold text-[#7a6f75] uppercase">Select Dependent Profile</span>
              <select
                value={selectedReportDep}
                onChange={(e) => setSelectedReportDep(e.target.value)}
                className="mt-1 block w-full sm:w-64 p-2.5 rounded-xl border border-[#EDE9FE] bg-white font-bold text-sm text-[#3a3135]"
              >
                {dependents.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name} ({d.relation})
                  </option>
                ))}
              </select>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200 w-fit">
              Longitudinal Health Report: Q3 2026
            </span>
          </div>

          {/* Report Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-5 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE]">
              <span className="text-[10px] font-bold text-[#7a6f75] uppercase block mb-1">Vaccinations Tracked</span>
              <p className="font-bold text-[#3a3135] text-xl">
                {vaccinations.filter((v) => v.dependent === selectedReportDep).length} Completed
              </p>
              <span className="text-[11px] text-teal-600 font-medium">Recorded booster immunizations</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE]">
              <span className="text-[10px] font-bold text-[#7a6f75] uppercase block mb-1">Active Prescriptions</span>
              <p className="font-bold text-[#3a3135] text-xl">
                {medications.filter((m) => m.dependent === selectedReportDep).length} Daily
              </p>
              <span className="text-[11px] text-pink-600 font-medium">Scheduled reminders</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE]">
              <span className="text-[10px] font-bold text-[#7a6f75] uppercase block mb-1">Medical Vault Docs</span>
              <p className="font-bold text-[#3a3135] text-xl">
                {records.filter((r) => r.dependent === selectedReportDep).length} Scanned
              </p>
              <span className="text-[11px] text-purple-600 font-medium">Clinical panels & charts</span>
            </div>
          </div>

          {/* Clinical Care Notes */}
          <div className="space-y-3 pt-2">
            <h5 className="font-bold text-xs text-[#3a3135] uppercase tracking-wider">Clinical Care Notes & Next Steps</h5>
            <div className="p-5 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE] text-xs text-[#4a4145] leading-relaxed space-y-2">
              <p>
                {selectedReportDep ? (
                  <>Care recipient health profile for <b>{selectedReportDep}</b>.</>
                ) : (
                  'Select a dependent profile above to review.'
                )}
              </p>
              <p className="text-[#7a6f75]">
                {vaccinations.filter((v) => v.dependent === selectedReportDep).length > 0 ||
                medications.filter((m) => m.dependent === selectedReportDep).length > 0 ||
                records.filter((r) => r.dependent === selectedReportDep).length > 0
                  ? 'Clinical indicators demonstrate consistent monitoring. Continue tracking daily vitals and scheduled doses.'
                  : 'No clinical documents, daily medications, or vaccinations logged yet for this dependent. Records and schedules added in the dashboard will automatically reflect here.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
