import React from 'react';
import { Calendar, Heart, Activity, Sparkles, Shield } from 'lucide-react';

export default function ReproductivePlanningModule() {
  return (
    <div className="bg-white rounded-3xl p-6 border border-[#EDE9FE] shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            🌸
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#3a3135]">Reproductive Planning & Fertility Intelligence</h3>
            <p className="text-xs text-[#7a6f75]">Ovulation window estimation, BBT/cervical mucus tracking, and lifestyle optimization.</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-[#FAF8FC] p-4 rounded-2xl border border-[#EDE9FE] space-y-2">
          <span className="text-[11px] font-bold text-[#7C3AED] uppercase tracking-wider">Estimated Fertile Window</span>
          <h4 className="font-bold text-base text-[#3a3135]">Aug 28 – Sep 02</h4>
          <p className="text-xs text-[#64595e]">Based on your 28-day cycle average. Ovulation estimated for Aug 30.</p>
        </div>

        <div className="bg-[#FAF8FC] p-4 rounded-2xl border border-[#EDE9FE] space-y-2">
          <span className="text-[11px] font-bold text-[#14B8A6] uppercase tracking-wider">Basal Body Temp (BBT)</span>
          <h4 className="font-bold text-base text-[#3a3135]">36.6 °C (Baseline)</h4>
          <p className="text-xs text-[#64595e]">Slight temperature elevation expected following LH surge.</p>
        </div>

        <div className="bg-[#FAF8FC] p-4 rounded-2xl border border-[#EDE9FE] space-y-2">
          <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Pre-Conception Care</span>
          <h4 className="font-bold text-base text-[#3a3135]">Folic Acid & Hydration</h4>
          <p className="text-xs text-[#64595e]">400 mcg Daily Folic Acid intake logged for 14 consecutive days.</p>
        </div>
      </div>

      <div className="p-3 bg-[#F5F3FF] rounded-2xl border border-[#EDE9FE] flex items-center gap-2 text-xs text-[#7C3AED]">
        <Shield className="w-4 h-4 text-[#7C3AED] flex-shrink-0" />
        <span>Estimates are observational and should not be used as a primary method of contraception.</span>
      </div>
    </div>
  );
}
