import React, { useState } from 'react';
import { Sparkles, Heart, BookOpen, Smile, Droplet, Shield, Check } from 'lucide-react';

export default function PubertyGrowingModule() {
  const [cycleActivated, setCycleActivated] = useState(false);

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#EDE9FE] shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
            🌱
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#3a3135]">Growing & Changing (Puberty & Development)</h3>
            <p className="text-xs text-[#7a6f75]">Age-appropriate guidance on body changes, hygiene, nutrition, and emotional wellbeing.</p>
          </div>
        </div>

        {!cycleActivated ? (
          <button
            onClick={() => setCycleActivated(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-pink-50 border border-pink-200 text-pink-700 text-xs font-bold hover:bg-pink-100 transition-all"
          >
            <Droplet className="w-3.5 h-3.5" />
            <span>First Period? Activate Cycle Tracking</span>
          </button>
        ) : (
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Cycle Tracking Active
          </span>
        )}
      </div>

      {/* Educational Cards Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-[#FAF8FC] p-4 rounded-2xl border border-[#EDE9FE] space-y-2">
          <div className="flex items-center gap-2 text-[#7C3AED] font-bold text-xs">
            <BookOpen className="w-4 h-4" />
            <span>Body & Hormones</span>
          </div>
          <h4 className="font-bold text-sm text-[#3a3135]">Understanding Growth Spurt</h4>
          <p className="text-xs text-[#64595e]">Growth spurts, skin changes, and body development are natural milestones powered by healthy hormones.</p>
        </div>

        <div className="bg-[#FAF8FC] p-4 rounded-2xl border border-[#EDE9FE] space-y-2">
          <div className="flex items-center gap-2 text-[#14B8A6] font-bold text-xs">
            <Smile className="w-4 h-4" />
            <span>Emotional Wellbeing</span>
          </div>
          <h4 className="font-bold text-sm text-[#3a3135]">Navigating Mood Shifts</h4>
          <p className="text-xs text-[#64595e]">Hormonal changes can cause sudden shifts in energy and emotions. Deep breathing and journaling help stay grounded.</p>
        </div>

        <div className="bg-[#FAF8FC] p-4 rounded-2xl border border-[#EDE9FE] space-y-2">
          <div className="flex items-center gap-2 text-pink-600 font-bold text-xs">
            <Droplet className="w-4 h-4" />
            <span>Hygiene & Care</span>
          </div>
          <h4 className="font-bold text-sm text-[#3a3135]">Period Preparedness</h4>
          <p className="text-xs text-[#64595e]">Keeping a small emergency kit in your backpack with pads or liners helps you feel confident every day.</p>
        </div>
      </div>

      {cycleActivated && (
        <div className="bg-pink-50 p-4 rounded-2xl border border-pink-200 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-xs text-pink-800 uppercase tracking-wider">Menstrual Health Tracking Enabled</h4>
            <p className="text-xs text-pink-700 mt-0.5">Your period entries remain private to you. Parent sharing is strictly optional.</p>
          </div>
        </div>
      )}
    </div>
  );
}
