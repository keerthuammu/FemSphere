import React from 'react';
import { Flame, Moon, Heart, Sparkles, Activity } from 'lucide-react';

export default function MidlifeMenopauseModule() {
  return (
    <div className="bg-white rounded-3xl p-6 border border-[#EDE9FE] shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-lg">
            🔥
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#3a3135]">Midlife Health (Perimenopause & Menopause)</h3>
            <p className="text-xs text-[#7a6f75]">Vasomotor symptom tracking (hot flashes), sleep disturbance, mood shifts, and bone density care.</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-[#FAF8FC] p-4 rounded-2xl border border-[#EDE9FE] space-y-2">
          <div className="flex items-center gap-1.5 text-orange-600 font-bold text-xs">
            <Flame className="w-4 h-4" />
            <span>Hot Flash Tracker</span>
          </div>
          <h4 className="font-bold text-sm text-[#3a3135]">2 Episodes Logged Today</h4>
          <p className="text-xs text-[#64595e]">Mild intensity during early afternoon. Cooling remedies logged.</p>
        </div>

        <div className="bg-[#FAF8FC] p-4 rounded-2xl border border-[#EDE9FE] space-y-2">
          <div className="flex items-center gap-1.5 text-[#7C3AED] font-bold text-xs">
            <Moon className="w-4 h-4" />
            <span>Sleep Architecture</span>
          </div>
          <h4 className="font-bold text-sm text-[#3a3135]">6.5 Hours (Restless)</h4>
          <p className="text-xs text-[#64595e]">Night sweats noted at 03:00 AM. Magnesium supplement logged.</p>
        </div>

        <div className="bg-[#FAF8FC] p-4 rounded-2xl border border-[#EDE9FE] space-y-2">
          <div className="flex items-center gap-1.5 text-[#14B8A6] font-bold text-xs">
            <Heart className="w-4 h-4" />
            <span>Bone & Cardiovascular Wellness</span>
          </div>
          <h4 className="font-bold text-sm text-[#3a3135]">Calcium & Vitamin D3</h4>
          <p className="text-xs text-[#64595e]">1200mg Calcium + 2000 IU Vitamin D3 daily adherence logged.</p>
        </div>
      </div>
    </div>
  );
}
