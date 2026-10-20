import React, { useState } from 'react';
import { Sparkles, Info, ShieldCheck, ChevronDown, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

interface Props {
  currentStageCode: string;
  stageName: string;
  onSelectStage?: (code: string) => void;
}

export default function LifeStageSelector({ currentStageCode, stageName }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { userProfile } = useUser();
  const isMarried = userProfile?.maritalStatus === 'Married' || userProfile?.maritalStatus === 'Partnered';

  const isPregnancy = currentStageCode === 'PREGNANCY';

  return (
    <div className="relative font-inter">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all shadow-xs cursor-pointer ${
          isPregnancy
            ? 'bg-purple-100 border-purple-300 text-purple-900 hover:bg-purple-200'
            : 'bg-[#F9E8EC] border-[#F4DDE2] hover:border-[#936DA2] text-[#936DA2]'
        }`}
        title="View Biological Stage Information"
      >
        <span className="text-sm">{isPregnancy ? '🤰' : '🌱'}</span>
        <span>{stageName || 'Reproductive Age'}</span>
        <span className="text-[10px] bg-white/80 px-1.5 py-0.5 rounded-full border border-purple-200 font-extrabold text-[#936DA2]">
          Dynamic
        </span>
        <ChevronDown className="w-3.5 h-3.5 opacity-70" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-2xl border border-[#F4DDE2] p-4 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3">
          <div className="flex items-center justify-between border-b border-[#F4DDE2] pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-purple-100 text-[#936DA2] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#3a3135]">Biological Health Twin</h4>
                <p className="text-[10px] text-gray-500">Clinical stage derived from DOB</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 text-xs font-bold p-1"
            >
              ✕
            </button>
          </div>

          <div className="p-3 bg-[#FCF4F5] rounded-2xl border border-[#F4DDE2] space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-gray-500 font-semibold">Active Stage</span>
              <span className="font-bold text-[#936DA2]">{stageName || 'Reproductive Age'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-gray-500 font-semibold">Stage Engine</span>
              <span className="font-semibold text-emerald-700 text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                ✓ Automated Clinical Rules
              </span>
            </div>
          </div>

          <div className="space-y-2 text-[11px] text-gray-600 leading-relaxed">
            <p className="flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#936DA2] shrink-0 mt-0.5" />
              <span>
                Your life stage dynamically calculates from your <b>Date of Birth</b>, onset of <b>menarche</b>, and active <b>pregnancy state</b>.
              </span>
            </p>
          </div>

          <div className="border-t border-[#F4DDE2] pt-2.5 flex flex-col gap-2">
            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="text-center py-2 px-3 bg-[#FCF4F5] hover:bg-purple-50 text-[#936DA2] font-bold text-xs rounded-xl border border-[#F4DDE2] transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Calibrate DOB / Menarche in Settings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {isMarried && (
              <Link
                to="/tracker"
                onClick={() => setIsOpen(false)}
                className="text-center py-2 px-3 bg-[#936DA2] hover:bg-[#835A92] text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Manage Maternity in Period Tracker</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
