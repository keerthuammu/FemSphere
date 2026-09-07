import React from 'react';
import { Heart, Smile, Activity, Moon, Droplet, Check } from 'lucide-react';

export default function PostpartumDashboardModule() {
  return (
    <div className="bg-white rounded-3xl p-6 border border-[#EDE9FE] shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg">
            🍼
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#3a3135]">Postpartum Recovery Portal (Fourth Trimester)</h3>
            <p className="text-xs text-[#7a6f75]">Physical healing, postpartum mood tracking, lactation logs, and partner support tasks.</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-[#FAF8FC] p-4 rounded-2xl border border-[#EDE9FE] space-y-2">
          <span className="text-[11px] font-bold text-[#7C3AED] uppercase tracking-wider">Physical Recovery</span>
          <h4 className="font-bold text-sm text-[#3a3135]">Pelvic Floor & Healing</h4>
          <p className="text-xs text-[#64595e]">Pain level logged as 2/10 (Mild). 6-week pelvic health review scheduled.</p>
        </div>

        <div className="bg-[#FAF8FC] p-4 rounded-2xl border border-[#EDE9FE] space-y-2">
          <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Postpartum Mood & Wellness</span>
          <h4 className="font-bold text-sm text-[#3a3135]">Edinburgh Scale Check</h4>
          <p className="text-xs text-[#64595e]">Logged feeling supported by partner. EPDS score remains in healthy range.</p>
        </div>

        <div className="bg-[#FAF8FC] p-4 rounded-2xl border border-[#EDE9FE] space-y-2">
          <span className="text-[11px] font-bold text-[#14B8A6] uppercase tracking-wider">Lactation & Newborn Care</span>
          <h4 className="font-bold text-sm text-[#3a3135]">Feeding & Hydration</h4>
          <p className="text-xs text-[#64595e]">2.8L Water intake logged today. Breastfeeding sessions spaced 3 hours apart.</p>
        </div>
      </div>
    </div>
  );
}
