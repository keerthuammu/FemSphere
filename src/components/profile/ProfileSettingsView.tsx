import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Heart,
  Shield,
  Watch,
  Bell,
  HeartHandshake,
  Users,
  Lock,
  Moon,
  Sun,
  Globe,
  HelpCircle,
  Info,
  ChevronRight,
  LogOut,
  Fingerprint,
  Smartphone,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ProfileSettingsView() {
  const navigate = useNavigate();
  const {
    user,
    setUser,
    isDark,
    toggleTheme,
    setIsPrivacyOpen,
    setIsEmergencyOpen,
    setIsAuthOpen,
    setAuthMode,
    setIsOnboardingOpen,
    setActiveTab,
    setActiveSubView
  } = useApp();

  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [activeSection, setActiveSection] = useState<'menu' | 'health_profile'>('menu');

  // Editable health profile state
  const [height, setHeight] = useState(user.heightCm);
  const [weight, setWeight] = useState(user.weightKg);
  const [bloodGroup, setBloodGroup] = useState(user.bloodGroup);

  const handleSaveHealthProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      heightCm: Number(height),
      weightKg: Number(weight),
      bloodGroup,
    }));
    alert('Health Profile parameters updated successfully.');
    setActiveSection('menu');
  };

  return (
    <div className="space-y-4">
      {/* Top Profile Card */}
      <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-sm flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-rose-500 to-purple-400 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-purple-600/20 shrink-0">
          {user.name.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white truncate">
              {user.name}
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-bold shrink-0">
              Verified Twin
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {user.email}
          </p>
          <div className="flex items-center gap-2 text-[10px] text-purple-700 dark:text-purple-300 font-semibold mt-1">
            <span>Reproductive Stage (Week 24)</span>
            <span>·</span>
            <span>Blood Group: {user.bloodGroup}</span>
          </div>
        </div>
      </div>

      {activeSection === 'menu' ? (
        <div className="space-y-3">
          {/* Section: Clinical & Health Profile */}
          <div className="bg-white dark:bg-slate-850 rounded-2xl border border-purple-100/70 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-3 bg-purple-50/40 dark:bg-slate-800/40 border-b border-purple-50 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Health & Physiological Profile
            </div>

            <button
              onClick={() => setActiveSection('health_profile')}
              className="w-full p-3.5 flex items-center justify-between hover:bg-purple-50/50 dark:hover:bg-slate-800 transition-colors border-b border-purple-50 dark:border-slate-800/70 min-h-[44px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-500">
                  <Heart className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Biometric Health Profile
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Height, weight, allergies & existing conditions
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => {
                setActiveTab('care');
                setActiveSubView('vault');
              }}
              className="w-full p-3.5 flex items-center justify-between hover:bg-purple-50/50 dark:hover:bg-slate-800 transition-colors border-b border-purple-50 dark:border-slate-800/70 min-h-[44px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Medical Vault & Lab Reports
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Encrypted diagnostic documents & imaging
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => setIsEmergencyOpen(true)}
              className="w-full p-3.5 flex items-center justify-between hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-colors min-h-[44px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/60 flex items-center justify-center text-red-500">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-red-600 dark:text-red-400 block">
                    Emergency Medical Card & SOS
                  </span>
                  <span className="text-[10px] text-slate-400">
                    First-responder allergies & contact details
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Section: Privacy, Family & Connected Ecosystem */}
          <div className="bg-white dark:bg-slate-850 rounded-2xl border border-purple-100/70 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-3 bg-purple-50/40 dark:bg-slate-800/40 border-b border-purple-50 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Privacy, Family & Wearables
            </div>

            <button
              onClick={() => setIsPrivacyOpen(true)}
              className="w-full p-3.5 flex items-center justify-between hover:bg-purple-50/50 dark:hover:bg-slate-800 transition-colors border-b border-purple-50 dark:border-slate-800/70 min-h-[44px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Privacy Center & Role Permissions
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Your Data, Your Control · Doctor & partner matrix
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => {
                setActiveTab('care');
                setActiveSubView('partner');
              }}
              className="w-full p-3.5 flex items-center justify-between hover:bg-purple-50/50 dark:hover:bg-slate-800 transition-colors border-b border-purple-50 dark:border-slate-800/70 min-h-[44px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950 flex items-center justify-center text-rose-500">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Partner Sync Settings
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Selective menstrual & wellness sharing
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => {
                setActiveTab('health');
                setActiveSubView('wearables');
              }}
              className="w-full p-3.5 flex items-center justify-between hover:bg-purple-50/50 dark:hover:bg-slate-800 transition-colors min-h-[44px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                  <Watch className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Connected BLE Devices
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Amazfit Bip U Pro · Bluetooth sync
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Section: Security & System Settings */}
          <div className="bg-white dark:bg-slate-850 rounded-2xl border border-purple-100/70 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-3 bg-purple-50/40 dark:bg-slate-800/40 border-b border-purple-50 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Security & Appearance
            </div>

            <div className="p-3.5 flex items-center justify-between border-b border-purple-50 dark:border-slate-800/70">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600">
                  <Fingerprint className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Biometric Authentication (Touch / Face ID)
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Require biometric sensor on app resume
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={biometricEnabled}
                onChange={() => setBiometricEnabled(prev => !prev)}
                className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
              />
            </div>

            <div className="p-3.5 flex items-center justify-between border-b border-purple-50 dark:border-slate-800/70">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600">
                  {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Dark Appearance Mode
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {isDark ? 'Dark theme active' : 'Light theme active'}
                  </span>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 min-h-[44px]"
              >
                {isDark ? 'Switch Light' : 'Switch Dark'}
              </button>
            </div>

            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="w-full p-3.5 flex items-center justify-between hover:bg-purple-50/50 dark:hover:bg-slate-800 transition-colors border-b border-purple-50 dark:border-slate-800/70 min-h-[44px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-500">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Replay App Onboarding Flow
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Review digital health twin architecture
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => {
                navigate('/login');
              }}
              className="w-full p-3.5 flex items-center justify-between text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors min-h-[44px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-500">
                  <LogOut className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold block">Sign Out</span>
                  <span className="text-[10px] text-slate-400">Lock encrypted vault session</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      ) : (
        /* EDITABLE HEALTH PROFILE SUBVIEW (Prompt #7) */
        <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-purple-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Health Profile & Biometric Setup
            </h3>
            <button
              onClick={() => setActiveSection('menu')}
              className="text-xs font-bold text-purple-600 hover:underline"
            >
              Back to Settings
            </button>
          </div>

          <form onSubmit={handleSaveHealthProfile} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={e => setHeight(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-purple-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={e => setWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-purple-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Blood Group
              </label>
              <select
                value={bloodGroup}
                onChange={e => setBloodGroup(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-purple-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
              >
                <option>O+</option>
                <option>O-</option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>AB+</option>
                <option>AB-</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Known Drug Allergies
              </label>
              <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-purple-100 dark:border-slate-700">
                {user.allergies.map((a, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-red-100 text-red-700 font-bold text-[10px]">
                    {a}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Clinical Diagnoses / Conditions
              </label>
              <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-purple-100 dark:border-slate-700">
                {user.conditions.map((c, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 font-bold text-[10px]">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm min-h-[44px]"
            >
              Save Health Profile
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
