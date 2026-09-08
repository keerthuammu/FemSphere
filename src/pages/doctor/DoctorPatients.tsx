import React from 'react';
import { Search, Activity, Pill, Eye, FileText } from 'lucide-react';
import { useDoctor } from '../../context/DoctorContext';

export default function DoctorPatients() {
  const {
    patients,
    searchPatient,
    setSearchPatient,
    patientRiskFilter,
    setPatientRiskFilter,
    sharedRecords,
    setSelectedHealthTwin,
    setSelectedRecordToView,
    setNewConsultationForm,
    setShowAddConsultationModal
  } = useDoctor();

  const filteredPatients = patients
    .filter(p => p.name.toLowerCase().includes(searchPatient.toLowerCase()) || p.email.toLowerCase().includes(searchPatient.toLowerCase()))
    .filter(p => patientRiskFilter === 'All' || p.riskLevel === patientRiskFilter);

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6 animate-in fade-in duration-200">
      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EDE9FE] pb-5">
        <div>
          <h3 className="font-serif text-3xl font-bold text-[#3a3135]">Patient Digital Health Twins</h3>
          <p className="text-xs text-[#7a6f75] mt-1">Live longitudinal biomarkers, cycle phases, and clinical histories</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a89cb5]" />
            <input 
              type="text" 
              value={searchPatient}
              onChange={(e) => setSearchPatient(e.target.value)}
              placeholder="Search patient name..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EDE9FE] bg-[#FAF8FC] text-xs outline-none focus:border-[#7C3AED]"
            />
          </div>

          <select 
            value={patientRiskFilter} 
            onChange={(e) => setPatientRiskFilter(e.target.value)}
            className="p-2.5 rounded-xl border border-[#EDE9FE] bg-white text-xs font-bold text-[#4a4145] cursor-pointer"
          >
            <option value="All">All Risk Levels</option>
            <option value="Optimal">Optimal</option>
            <option value="Moderate Attention">Moderate Attention</option>
            <option value="High Attention">High Attention</option>
          </select>
        </div>
      </div>

      {/* Patients Grid */}
      {filteredPatients.length === 0 ? (
        <div className="p-12 text-center bg-[#FAF8FC] rounded-2xl border border-dashed border-[#EDE9FE]">
          <p className="text-xs text-[#7a6f75]">No patients found matching your search or filter.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPatients.map(p => {
            const patientReport = sharedRecords.find(r => r.patientId === p.id || r.patient === p.name);
            return (
              <div key={p.id} className="p-5 rounded-3xl border border-[#EDE9FE] bg-[#FAF8FC] flex flex-col justify-between space-y-4 hover:border-[#7C3AED] transition-all shadow-2xs">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      p.riskLevel === 'Optimal' ? 'bg-emerald-100 text-emerald-800' :
                      p.riskLevel === 'Moderate Attention' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {p.riskLevel}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#7a6f75]">{p.id}</span>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg text-[#3a3135]">{p.name}</h4>
                    <p className="text-xs text-[#7a6f75]">{p.age} yrs • Blood Group: {p.bloodGroup}</p>
                    <p className="text-xs font-medium text-[#7C3AED] mt-1">{p.lifeStage}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#EDE9FE] text-xs">
                    <div className="p-2 bg-white rounded-xl border border-[#EDE9FE]">
                      <span className="text-[10px] text-[#7a6f75] block">Cycle Phase</span>
                      <span className="font-bold text-[#3a3135] truncate block">{p.cyclePhase}</span>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-[#EDE9FE]">
                      <span className="text-[10px] text-[#7a6f75] block">Resting HR</span>
                      <span className="font-bold text-[#14B8A6]">{p.heartRate} bpm</span>
                    </div>
                  </div>

                  {/* Patient Shared Diagnostic Report Box */}
                  {patientReport && (
                    <div className="p-3 bg-white rounded-2xl border border-purple-100 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[#7C3AED] flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" /> Shared Report
                        </span>
                        <span className="text-[10px] text-[#7a6f75] font-mono">{patientReport.sharedDate}</span>
                      </div>
                      <p className="font-bold text-xs text-[#3a3135] truncate">{patientReport.fileName}</p>
                      <button 
                        type="button"
                        onClick={() => setSelectedRecordToView(patientReport)}
                        className="w-full py-1.5 bg-purple-50 hover:bg-purple-100 text-[#7C3AED] rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3 h-3" /> View AI Biomarkers
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2 border-t border-[#EDE9FE]">
                  <button 
                    onClick={() => setSelectedHealthTwin(p)} 
                    className="flex-1 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Activity className="w-3.5 h-3.5" /> View Health Twin
                  </button>
                  <button 
                    onClick={() => {
                      setNewConsultationForm(prev => ({ ...prev, patient: p.name, patientId: p.id }));
                      setShowAddConsultationModal(true);
                    }} 
                    className="p-2.5 border border-[#EDE9FE] bg-white hover:bg-purple-50 text-[#7C3AED] rounded-xl font-bold cursor-pointer"
                    title="Write Prescription"
                  >
                    <Pill className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
