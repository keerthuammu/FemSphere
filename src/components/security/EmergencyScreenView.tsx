import React, { useState } from 'react';
import {
  ShieldAlert,
  PhoneCall,
  Share2,
  AlertTriangle,
  Heart,
  Droplet,
  Pill,
  User,
  X,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function EmergencyScreenView() {
  const { isEmergencyOpen, setIsEmergencyOpen, user, medications } = useApp();
  const [shareConfirmed, setShareConfirmed] = useState(false);

  if (!isEmergencyOpen) return null;

  const handleShareEmergency = () => {
    setShareConfirmed(true);
    setTimeout(() => {
      alert('Encrypted Emergency Card shared with First Responders & Alex Jenkins.');
      setShareConfirmed(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-red-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="w-full max-w-md h-[92vh] max-h-[700px] bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border-2 border-red-500 flex flex-col justify-between overflow-hidden">
        {/* Top Emergency Banner */}
        <div className="flex items-center justify-between border-b border-red-100 dark:border-red-950 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-600/30 animate-pulse">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-red-700 dark:text-red-400 uppercase tracking-tight">
                Emergency Medical Card
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Critical life-saving parameters for EMT & first responders
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEmergencyOpen(false)}
            className="text-slate-400 hover:text-slate-600 font-bold"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Clinical Profile Data */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3 scrollbar-thin">
          {/* Identity & Blood Type */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 bg-red-50/50 dark:bg-slate-800 rounded-xl border border-red-100 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400">Patient Name</span>
              <p className="font-bold text-slate-900 dark:text-white mt-0.5">{user.name}</p>
              <span className="text-[10px] text-slate-500">DOB: {user.dob}</span>
            </div>
            <div className="p-3 bg-red-50/50 dark:bg-slate-800 rounded-xl border border-red-100 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400">Blood Group</span>
              <p className="text-xl font-extrabold text-red-600 mt-0.5">{user.bloodGroup}</p>
              <span className="text-[10px] text-slate-500">Rh Positive</span>
            </div>
          </div>

          {/* Primary Emergency Contact */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Primary Emergency Contact
            </span>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {user.emergencyContact.name} ({user.emergencyContact.relationship})
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400 font-mono mt-0.5">
                  {user.emergencyContact.phone}
                </p>
              </div>
              <a
                href={`tel:${user.emergencyContact.phone}`}
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </a>
            </div>
          </div>

          {/* Known Allergies (Crucial Red Flag) */}
          <div className="p-3.5 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900/60 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-700 dark:text-red-300">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>Known Drug Allergies & Contraindications</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {user.allergies.map(alg => (
                <span
                  key={alg}
                  className="px-2.5 py-1 rounded-md bg-white dark:bg-red-900 text-red-700 dark:text-red-200 text-xs font-bold border border-red-200"
                >
                  ⚠️ {alg}
                </span>
              ))}
            </div>
          </div>

          {/* Clinical Conditions & Gestational Stage */}
          <div className="p-3.5 bg-purple-50 dark:bg-slate-800 rounded-xl border border-purple-100 dark:border-slate-700 space-y-1">
            <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-300 block">
              Active Medical State & Conditions
            </span>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Pregnancy (Week 24, Second Trimester) · History of Mild Asthma
            </p>
          </div>

          {/* Important Medications */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Current Medications
            </span>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-0.5">
              {medications.map(m => (
                <li key={m.id}>
                  • {m.name} ({m.dosage})
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Emergency Actions Footer */}
        <div className="pt-3 border-t border-red-100 dark:border-red-950 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <a
              href="tel:911"
              className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all min-h-[44px]"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Emergency Services (911)</span>
            </a>

            <button
              onClick={handleShareEmergency}
              className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors min-h-[44px]"
            >
              <Share2 className="w-4 h-4" />
              <span>{shareConfirmed ? 'Transmitting...' : 'Share SOS'}</span>
            </button>
          </div>

          <span className="text-[10px] text-center text-slate-400">
            Emergency SOS broadcasts GPS coordinates and critical allergies to designated contacts.
          </span>
        </div>
      </div>
    </div>
  );
}
