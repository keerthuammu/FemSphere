import React from 'react';
import { Plus, Printer, Trash2, MessageSquare, Pill } from 'lucide-react';
import { useDoctor } from '../../context/DoctorContext';

export default function DoctorConsultations() {
  const {
    consultations,
    setShowAddConsultationModal,
    setViewingPrescriptionModal,
    handleDeleteConsultation
  } = useDoctor();

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EDE9FE] pb-5">
        <div>
          <h3 className="font-serif text-3xl font-bold text-[#3a3135]">Clinical Notes & Digital Prescriptions</h3>
          <p className="text-xs text-[#7a6f75] mt-1">Generate official digital prescriptions with structured dosages and lifestyle advice</p>
        </div>
        <button 
          onClick={() => setShowAddConsultationModal(true)} 
          className="px-5 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Prescription Note
        </button>
      </div>

      {consultations.length === 0 ? (
        <div className="p-12 text-center bg-[#FAF8FC] rounded-2xl border border-dashed border-[#EDE9FE] space-y-3">
          <MessageSquare className="w-10 h-10 text-[#7C3AED] mx-auto opacity-50" />
          <h4 className="font-serif text-xl font-bold text-[#3a3135]">No Consultation Notes Yet</h4>
          <p className="text-xs text-[#7a6f75] max-w-sm mx-auto">Click 'Create Prescription Note' above to record patient complaints, diagnoses, and medical prescriptions.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {consultations.map(cons => (
            <div key={cons.id} className="p-6 rounded-3xl border border-[#EDE9FE] bg-[#FAF8FC] space-y-4 text-xs shadow-2xs hover:border-[#7C3AED]/30 transition-all">
              <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-3">
                <div>
                  <h4 className="font-bold text-base text-[#3a3135]">{cons.patient}</h4>
                  <p className="text-[#7a6f75]">{cons.date} at {cons.time} • Chief Complaint: <span className="text-[#3a3135] font-semibold">{cons.chiefComplaint}</span></p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setViewingPrescriptionModal(cons)} 
                    className="px-3.5 py-1.5 bg-[#14B8A6] hover:bg-[#0D9488] text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5" /> Printable Rx
                  </button>
                  <button 
                    onClick={() => handleDeleteConsultation(cons.id)} 
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                    title="Delete note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <span className="font-bold text-[#7C3AED] block mb-1">Clinical Diagnosis</span>
                  <p className="p-3 bg-white rounded-xl border border-[#EDE9FE] font-medium text-[#3a3135]">{cons.diagnosis}</p>
                </div>
                <div>
                  <span className="font-bold text-[#14B8A6] block mb-1">Dietary & Lifestyle Advice</span>
                  <p className="p-3 bg-white rounded-xl border border-[#EDE9FE] text-[#4a4145]">{cons.advice}</p>
                </div>
              </div>

              {cons.medications && cons.medications.length > 0 && (
                <div className="space-y-2">
                  <span className="font-bold text-pink-600 uppercase text-[10px] tracking-wider flex items-center gap-1">
                    <Pill className="w-3.5 h-3.5" /> Prescribed Medications (Rx)
                  </span>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {cons.medications.map((med, idx) => (
                      <div key={idx} className="p-3 bg-white rounded-xl border border-[#EDE9FE] flex items-center justify-between">
                        <div>
                          <p className="font-bold text-[#3a3135]">{med.name} ({med.dosage})</p>
                          <p className="text-[#7a6f75] text-[11px]">{med.frequency} • {med.duration}</p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-50 text-[#7C3AED] font-semibold">{med.instructions}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {cons.prescribedExercises && cons.prescribedExercises.length > 0 && (
                <div className="space-y-2">
                  <span className="font-bold text-emerald-700 uppercase text-[10px] tracking-wider flex items-center gap-1">
                    ✓ Doctor-Prescribed Exercise & Physical Therapy
                  </span>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {cons.prescribedExercises.map((ex, idx) => (
                      <div key={idx} className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-start justify-between">
                        <div>
                          <p className="font-bold text-emerald-950">{ex.name}</p>
                          <p className="text-[#7a6f75] text-[11px]">{ex.category} • {ex.duration} • {ex.frequency}</p>
                          <p className="text-[10px] text-slate-500 italic mt-0.5">{ex.instructions}</p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-semibold shrink-0">Rx Regimen</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
