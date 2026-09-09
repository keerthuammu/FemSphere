import React from 'react';
import { Activity, ShieldCheck, Stethoscope } from 'lucide-react';
import FitnessTracker from '../../components/FitnessTracker';
import { useUser } from '../../context/UserContext';

export default function UserFitness() {
  const { currentStageCode, currentStageName, consultationNotes } = useUser();

  return (
    <div className="space-y-6 animate-in fade-in duration-200 font-inter">
      {/* CLINICAL PAGE HEADER */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-[#7C3AED] uppercase tracking-wider flex items-center gap-1 border border-purple-200">
              <Stethoscope className="w-3 h-3 text-[#7C3AED]" /> Doctor Prescribed Clinical Protocols
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-700" /> Contraindication Filtered
            </span>
            {currentStageName && (
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FAF5FF] text-purple-700 border border-purple-200">
                Active Life Stage: {currentStageName}
              </span>
            )}
          </div>
          <h2 className="font-bold text-2xl md:text-3xl text-[#3a3135] tracking-tight">
            Doctor-Prescribed Exercise & Physical Therapy
          </h2>
          <p className="text-xs text-[#7a6f75] mt-1 max-w-2xl leading-relaxed">
            This portal is strictly dedicated to physician-prescribed exercise regimens, physical therapy protocols, and clinical movement advice customized for your medical profile.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 bg-[#FAF8FC] p-3 rounded-2xl border border-[#EDE9FE]">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center font-bold">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-500 uppercase block">Mode</span>
            <span className="text-xs font-black text-[#7C3AED]">Clinical Rx Only</span>
          </div>
        </div>
      </div>

      {/* CORE DOCTOR-PRESCRIBED FITNESS ENGINE */}
      <FitnessTracker 
        prescribedOnly={true} 
        userStage={currentStageCode} 
        consultationAdvice={consultationNotes} 
      />
    </div>
  );
}

