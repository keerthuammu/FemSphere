import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Stethoscope,
  Users,
  Smartphone,
  Check,
  X,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function PrivacyCenterView() {
  const { isPrivacyOpen, setIsPrivacyOpen } = useApp();

  const [permissions, setPermissions] = useState({
    doctor: {
      vitals: true,
      reports: true,
      appointments: true,
      privateNotes: false,
    },
    caregiver: {
      vitals: true,
      medications: true,
      appointments: true,
      cycleDetails: false,
    },
    partner: {
      cyclePhase: true,
      wellnessScore: true,
      activitySteps: true,
      labReports: false,
    },
  });

  if (!isPrivacyOpen) return null;

  const togglePerm = (category: 'doctor' | 'caregiver' | 'partner', key: string) => {
    setPermissions(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !(prev[category] as any)[key],
      },
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="w-full max-w-lg h-[92vh] max-h-[720px] bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-purple-100 dark:border-slate-800 flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Privacy Center: Your Data, Your Control
              </h3>
              <p className="text-[11px] text-purple-700 dark:text-purple-300 font-medium">
                Zero-knowledge encryption & role-based access matrix
              </p>
            </div>
          </div>

          <button onClick={() => setIsPrivacyOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">
            ✕
          </button>
        </div>

        {/* Permissions Matrix */}
        <div className="flex-1 overflow-y-auto py-3 space-y-4 scrollbar-thin scrollbar-thumb-purple-200">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            FemSphere does not sell health data. You maintain cryptographic ownership of every biomarker, menstrual log, and clinical consultation.
          </p>

          {/* 1. Doctor Access */}
          <div className="p-3.5 rounded-2xl border border-purple-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-purple-600" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Physician Access (Dr. Elena Vance)
                </h4>
              </div>
              <span className="text-[10px] text-purple-600 font-semibold">Active Care Team</span>
            </div>

            <div className="space-y-1.5 text-xs">
              {[
                { key: 'reports', label: 'Lab Reports & Ultrasound Imaging' },
                { key: 'vitals', label: 'Continuous Wearable Vitals' },
                { key: 'appointments', label: 'Consultation & Visit History' },
                { key: 'privateNotes', label: 'Private Reflections & Personal Journal' },
              ].map(item => {
                const isAllowed = (permissions.doctor as any)[item.key];
                return (
                  <div key={item.key} className="flex items-center justify-between py-1 border-b border-purple-50 dark:border-slate-800 last:border-b-0">
                    <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
                    <button
                      onClick={() => togglePerm('doctor', item.key)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 ${
                        isAllowed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {isAllowed ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>{isAllowed ? 'Allowed' : 'Revoked'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Partner Access */}
          <div className="p-3.5 rounded-2xl border border-purple-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-rose-500" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Partner Sync Access (Alex Jenkins)
                </h4>
              </div>
              <span className="text-[10px] text-rose-500 font-semibold">Connected</span>
            </div>

            <div className="space-y-1.5 text-xs">
              {[
                { key: 'cyclePhase', label: 'Menstrual Cycle Phase' },
                { key: 'wellnessScore', label: 'Daily Wellness & Restfulness' },
                { key: 'activitySteps', label: 'Step Count & Movement' },
                { key: 'labReports', label: 'Diagnostic Lab Documents' },
              ].map(item => {
                const isAllowed = (permissions.partner as any)[item.key];
                return (
                  <div key={item.key} className="flex items-center justify-between py-1 border-b border-purple-50 dark:border-slate-800 last:border-b-0">
                    <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
                    <button
                      onClick={() => togglePerm('partner', item.key)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 ${
                        isAllowed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {isAllowed ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>{isAllowed ? 'Allowed' : 'Revoked'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-purple-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[10px] text-slate-400">
            Audit Hash: SHA-256 Verified
          </span>
          <button
            onClick={() => {
              alert('Privacy policy permissions saved.');
              setIsPrivacyOpen(false);
            }}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm min-h-[44px]"
          >
            Save Privacy Policy
          </button>
        </div>
      </div>
    </div>
  );
}
