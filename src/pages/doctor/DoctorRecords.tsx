import React from 'react';
import { Search, Eye, Activity, FileCheck, Sparkles } from 'lucide-react';
import { useDoctor } from '../../context/DoctorContext';

export default function DoctorRecords() {
  const {
    sharedRecords,
    searchRecord,
    setSearchRecord,
    setSelectedRecordToView,
    patients,
    setSelectedHealthTwin
  } = useDoctor();

  const filteredRecords = sharedRecords.filter(
    r => r.fileName.toLowerCase().includes(searchRecord.toLowerCase()) || r.patient.toLowerCase().includes(searchRecord.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EDE9FE] pb-5">
        <div>
          <h3 className="font-serif text-3xl font-bold text-[#3a3135]">Shared Medical Records & AI Scans</h3>
          <p className="text-xs text-[#7a6f75]">Patient-shared diagnostic reports with automated AI biomarker extraction</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a89cb5]" />
          <input 
            type="text" 
            value={searchRecord}
            onChange={(e) => setSearchRecord(e.target.value)}
            placeholder="Search patient name or report..." 
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EDE9FE] bg-[#FAF8FC] text-xs outline-none focus:border-[#7C3AED]"
          />
        </div>
      </div>

      {filteredRecords.length === 0 ? (
        <div className="p-12 text-center bg-[#FAF8FC] rounded-2xl border border-dashed border-[#EDE9FE]">
          <p className="text-xs text-[#7a6f75]">No shared records match your search criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecords.map(rec => (
            <div key={rec.id} className="p-6 rounded-3xl border border-[#EDE9FE] bg-[#FAF8FC] hover:border-[#7C3AED]/40 hover:bg-white transition-all space-y-4 shadow-2xs">
              
              {/* Top Header: Patient Identity Banner & File Badges */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EDE9FE] pb-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#F472B6] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    {rec.patient.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-[#3a3135]">{rec.patient}</h4>
                      <span className="px-2 py-0.5 rounded-md bg-purple-100 text-[#7C3AED] font-mono font-bold text-[10px]">
                        {rec.patientId}
                      </span>
                    </div>
                    <p className="text-xs text-[#7a6f75]">Patient Digital Health Twin Active</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-purple-100 text-[#7C3AED] font-bold text-xs">
                    {rec.category}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-gray-100 text-[#7a6f75] font-semibold text-[11px]">
                    {rec.type} • {rec.size}
                  </span>
                  <span className="text-xs font-medium text-[#7a6f75]">
                    Uploaded: {rec.sharedDate}
                  </span>
                </div>
              </div>

              {/* Middle: Report File Name & AI Analysis Preview */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-[#14B8A6]" />
                    <h5 className="font-bold text-sm text-[#3a3135]">{rec.fileName}</h5>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 text-xs">
                    <span className="font-bold text-[#7C3AED] flex items-center gap-1.5 text-[11px] uppercase tracking-wider mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#14B8A6]" /> AI Diagnostic Summary for {rec.patient}
                    </span>
                    <p className="text-[#3a3135] leading-relaxed">{rec.aiSummary}</p>
                  </div>

                  {/* Quick Biomarker Highlights */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {rec.biomarkers.slice(0, 3).map((bm, bIdx) => (
                      <span key={bIdx} className="px-2.5 py-1 rounded-lg bg-white border border-[#EDE9FE] text-[11px] font-medium text-[#3a3135]">
                        <b>{bm.name}:</b> <span className="text-[#7C3AED] font-bold">{bm.value}</span> ({bm.status})
                      </span>
                    ))}
                    {rec.biomarkers.length > 3 && (
                      <span className="px-2 py-1 rounded-lg bg-gray-100 text-[10px] font-bold text-[#7a6f75]">
                        +{rec.biomarkers.length - 3} more parameters
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-row md:flex-col gap-2 shrink-0 self-end md:self-center">
                  <button 
                    onClick={() => setSelectedRecordToView(rec)} 
                    className="px-5 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer text-xs"
                  >
                    <Eye className="w-4 h-4" /> View AI Biomarkers
                  </button>
                  <button 
                    onClick={() => {
                      const pat = patients.find(p => p.id === rec.patientId || p.name === rec.patient);
                      if (pat) setSelectedHealthTwin(pat);
                    }}
                    className="px-4 py-2 border border-[#EDE9FE] bg-white text-[#3a3135] hover:bg-purple-50 hover:text-[#7C3AED] rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs"
                  >
                    <Activity className="w-3.5 h-3.5" /> Patient Twin
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
