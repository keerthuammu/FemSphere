import React from 'react';
import { 
  Sparkles, Upload, FileCheck, Calendar, AlertTriangle, 
  CheckCircle2, Eye, Scan, Download, Trash2 
} from 'lucide-react';
import { useUser } from '../../context/UserContext';

export default function UserRecords() {
  const {
    records,
    selectedMonthFilter,
    setSelectedMonthFilter,
    setShowUploadModal,
    handleScanMedicalReport,
    setViewingScanRecordModal,
    handleDeleteRecord
  } = useUser();

  const currentYearMonth = new Date().toISOString().slice(0, 7); // e.g. "2026-08"
  const currentMonthName = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const filteredRecords = selectedMonthFilter === 'All Months' 
    ? records 
    : records.filter(r => r.month === selectedMonthFilter || r.date.startsWith(selectedMonthFilter.slice(0, 7)));

  const scannedCount = filteredRecords.filter(r => r.isScanned).length;
  const allBiomarkers = filteredRecords.flatMap(r => r.scanResults?.keyBiomarkers || []);
  const watchCount = allBiomarkers.filter(b => b.status === 'Watch' || b.status === 'Abnormal').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200 font-inter">
      {/* TOP HEADER */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EDE9FE] text-[#7C3AED] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#7C3AED]" /> AI Medical OCR Engine
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
              AUTO-SCAN ENABLED
            </span>
          </div>
          <h3 className="font-bold text-2xl text-[#3a3135]">Medical Reports Vault & AI Scanner</h3>
          <p className="text-xs text-[#7a6f75]">Upload lab reports to automatically scan biomarkers, track monthly clinical trends, and detect abnormal flags</p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)} 
          className="flex items-center gap-2 px-6 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer shrink-0"
        >
          <Upload className="w-4 h-4" /> Upload New Medical Report
        </button>
      </div>

      {/* MONTHLY OVERALL HEALTH SUMMARY CARD */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#EDE9FE] pb-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F5F3FF] border border-[#EDE9FE] flex items-center justify-center text-[#7C3AED]">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-[#3a3135]">Monthly Medical Health Summary</h4>
              <p className="text-xs text-[#7a6f75]">Aggregated diagnostic analysis & biomarker status across scanned reports</p>
            </div>
          </div>

          {/* MONTH SELECTOR DROPDOWN */}
          <div className="flex items-center gap-2 bg-[#FAF8FC] p-1.5 rounded-2xl border border-[#EDE9FE]">
            <span className="text-xs font-bold text-[#7a6f75] px-2 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#7C3AED]" /> Filter:
            </span>
            <select 
              value={selectedMonthFilter} 
              onChange={(e) => setSelectedMonthFilter(e.target.value)}
              className="bg-white border border-[#EDE9FE] rounded-xl px-3 py-1.5 font-bold text-xs text-[#3a3135] focus:outline-hidden cursor-pointer"
            >
              <option value={currentMonthName}>{currentMonthName} (Latest)</option>
              <option value="All Months">All Months Aggregated</option>
            </select>
          </div>
        </div>

        {/* MONTHLY SUMMARY METRICS GRID */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7a6f75] block mb-1">Scanned Reports</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#7C3AED]">{scannedCount}</span>
                <span className="text-xs text-[#7a6f75] font-medium">in vault</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7a6f75] block mb-1">Lab Biomarkers</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-emerald-600">{allBiomarkers.length}</span>
                <span className="text-xs text-[#7a6f75] font-medium">Extracted</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7a6f75] block mb-1">Clinical Status</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                {watchCount > 0 ? (
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> {watchCount} Attention Flag
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Optimal Health
                  </span>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7a6f75] block mb-1">Monthly Clinical Score</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-[#3a3135]">{watchCount > 0 ? '88' : '96'}</span>
                <span className="text-xs font-bold text-[#7a6f75]">/ 100</span>
              </div>
            </div>
          </div>

          {/* EXTRACTED BIOMARKERS TABLE */}
          {allBiomarkers.length > 0 && (
            <div className="pt-2">
              <h6 className="font-bold text-xs text-[#64595e] uppercase tracking-wider mb-2">Scanned Biomarkers Table ({selectedMonthFilter})</h6>
              <div className="overflow-x-auto rounded-xl border border-[#EDE9FE] bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8FC] border-b border-[#EDE9FE] text-[#7a6f75] font-bold text-[11px] uppercase">
                    <tr>
                      <th className="p-3">Biomarker / Test</th>
                      <th className="p-3">Scanned Value</th>
                      <th className="p-3">Normal Reference Range</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDE9FE] text-[#3a3135]">
                    {allBiomarkers.map((b: any, idx: number) => (
                      <tr key={idx} className="hover:bg-[#FAF8FC]">
                        <td className="p-3 font-bold">{b.name}</td>
                        <td className="p-3 font-semibold">{b.value}</td>
                        <td className="p-3 text-[#7a6f75]">{b.range}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            b.status === 'Optimal' ? 'bg-emerald-100 text-emerald-800' : b.status === 'Normal' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* UPLOADED MEDICAL REPORTS LIST */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-4">
          <h4 className="font-bold text-lg text-[#3a3135]">Scanned Reports Vault</h4>
          <span className="text-xs text-[#7a6f75] font-medium">Total Reports: {records.length}</span>
        </div>

        <div className="space-y-4">
          {filteredRecords.map((r) => (
            <div key={r.id} className="p-5 rounded-2xl border border-[#EDE9FE] bg-[#FAF8FC] hover:bg-white hover:border-[#7C3AED]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs transition-all shadow-2xs">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#EDE9FE] text-[#7C3AED] font-bold text-[10px]">
                    {r.type}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-800 font-bold text-[10px]">
                    {r.category || 'Lab Results'}
                  </span>
                  {r.isScanned ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> AI Scanned & Parsed
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                      Ready for AI Scan
                    </span>
                  )}
                  <span className="text-[10px] text-[#7a6f75] font-bold">Month: {r.month}</span>
                </div>

                <h5 className="font-bold text-[#3a3135] text-base">{r.title}</h5>
                <p className="text-[#64595e] text-xs">{r.description}</p>
                
                {r.scanResults && (
                  <p className="text-xs text-[#7C3AED] font-medium bg-[#F5F3FF] p-2.5 rounded-xl border border-[#EDE9FE]">
                    💡 <b>AI Summary:</b> {r.scanResults.aiSummary}
                  </p>
                )}
                <p className="text-[10px] text-[#7a6f75]">Uploaded on {r.date} • Size: {r.size}</p>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                {r.isScanned ? (
                  <button 
                    onClick={() => setViewingScanRecordModal(r)} 
                    className="px-4 py-2.5 bg-[#EDE9FE] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Analysis
                  </button>
                ) : (
                  <button 
                    onClick={() => handleScanMedicalReport(r.id)} 
                    className="px-4 py-2.5 bg-[#7C3AED] text-white hover:bg-[#6D28D9] font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <Scan className="w-3.5 h-3.5" /> Scan Report
                  </button>
                )}

                <button 
                  onClick={() => alert(`Downloading report "${r.title}.${r.type.toLowerCase()}"...`)} 
                  className="p-2.5 bg-[#FAF8FC] text-[#4A3B42] border border-[#EDE9FE] rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                  title="Download Report"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteRecord(r.id)} 
                  className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                  title="Delete Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {filteredRecords.length === 0 && (
            <div className="text-center py-12 border border-dashed border-[#EDE9FE] rounded-3xl text-[#7a6f75] text-xs">
              No medical reports found. Click "Upload New Medical Report" above to scan your first lab result into your encrypted vault.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
