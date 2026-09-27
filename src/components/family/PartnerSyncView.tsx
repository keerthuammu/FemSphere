import React from 'react';
import {
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ShieldAlert,
  UserCheck,
  Lock,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function PartnerSyncView() {
  const { partnerSync, togglePartnerShare, revokePartnerSync } = useApp();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Privacy-First Partner Connection
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Granular privacy toggles. Your partner never receives private medical records without explicit consent.
          </p>
        </div>

        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-300">
          <HeartHandshake className="w-4 h-4" />
        </div>
      </div>

      {/* Partner Connection Status Card */}
      <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-rose-500 text-white flex items-center justify-center text-base font-bold shadow-md shadow-purple-600/20">
              AJ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {partnerSync.partnerName}
                </h3>
                {partnerSync.connected ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                    <UserCheck className="w-3 h-3" /> Connected
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[10px] font-bold">
                    Disconnected
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Connected via secure zero-knowledge partner invite token
              </p>
            </div>
          </div>

          {partnerSync.connected && (
            <button
              onClick={revokePartnerSync}
              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold border border-rose-200 dark:border-rose-900 transition-colors min-h-[44px]"
            >
              Stop Sharing
            </button>
          )}
        </div>

        {/* Security Assurance Notice */}
        <div className="bg-purple-50/60 dark:bg-slate-800/60 p-3 rounded-xl border border-purple-100 dark:border-slate-700 flex items-start gap-2 text-xs">
          <Lock className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>Private Medical Isolation:</strong> Lab documents, doctor clinical notes, STI testing, and psychological journals are strictly air-gapped and excluded from partner transmission.
          </p>
        </div>

        {/* Granular Sharing Toggles (Prompt #28) */}
        <div className="space-y-2 pt-2 border-t border-purple-100 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Selective Sharing Permissions
          </span>

          {/* 1. Cycle Phase */}
          <div className="p-3 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-purple-50 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                🌸 Menstrual Cycle Phase
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                Shares broad phase (e.g. Follicular, Ovulation, Luteal) to foster mutual empathy
              </p>
            </div>
            <button
              onClick={() => togglePartnerShare('shareCycle')}
              className="text-purple-600 dark:text-purple-400 transition-transform active:scale-95"
            >
              {partnerSync.shareCycle ? (
                <ToggleRight className="w-8 h-8 fill-purple-600 stroke-purple-600" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-slate-400" />
              )}
            </button>
          </div>

          {/* 2. Fertile Window */}
          <div className="p-3 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-purple-50 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                🌱 Fertile Window & Ovulation Day
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                Helps coordinate family planning and conception awareness
              </p>
            </div>
            <button
              onClick={() => togglePartnerShare('shareFertile')}
              className="text-purple-600 dark:text-purple-400 transition-transform active:scale-95"
            >
              {partnerSync.shareFertile ? (
                <ToggleRight className="w-8 h-8 fill-purple-600 stroke-purple-600" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-slate-400" />
              )}
            </button>
          </div>

          {/* 3. Wellness */}
          <div className="p-3 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-purple-50 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                💗 Emotional Wellness & Sleep Quality
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                Shares overall wellness score and restfulness rating
              </p>
            </div>
            <button
              onClick={() => togglePartnerShare('shareWellness')}
              className="text-purple-600 dark:text-purple-400 transition-transform active:scale-95"
            >
              {partnerSync.shareWellness ? (
                <ToggleRight className="w-8 h-8 fill-purple-600 stroke-purple-600" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-slate-400" />
              )}
            </button>
          </div>

          {/* 4. Activity */}
          <div className="p-3 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-purple-50 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                🏃 Daily Movement & Step Goals
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                Shared motivation for daily walking and active hydration
              </p>
            </div>
            <button
              onClick={() => togglePartnerShare('shareActivity')}
              className="text-purple-600 dark:text-purple-400 transition-transform active:scale-95"
            >
              {partnerSync.shareActivity ? (
                <ToggleRight className="w-8 h-8 fill-purple-600 stroke-purple-600" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-slate-400" />
              )}
            </button>
          </div>

          {/* 5. Notifications */}
          <div className="p-3 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-purple-50 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                🔔 Gentle Partner Notifications
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                Send thoughtful reminders to support with hydration or rest
              </p>
            </div>
            <button
              onClick={() => togglePartnerShare('shareNotifications')}
              className="text-purple-600 dark:text-purple-400 transition-transform active:scale-95"
            >
              {partnerSync.shareNotifications ? (
                <ToggleRight className="w-8 h-8 fill-purple-600 stroke-purple-600" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-slate-400" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
