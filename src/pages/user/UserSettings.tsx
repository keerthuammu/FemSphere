import React, { useState } from 'react';
import { Lock, Sliders, Sparkles, Calendar, ArrowRight, Check, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser, calculateAge } from '../../context/UserContext';

export default function UserSettings() {
  const {
    settings,
    setSettings,
    setShowPasswordModal,
    stageName,
    currentStageCode,
    userProfile,
    fetchUserProfile,
    fetchPeriodData
  } = useUser();

  const [isUpdatingMenarche, setIsUpdatingMenarche] = useState(false);
  const [menarcheSuccessMsg, setMenarcheSuccessMsg] = useState<string | null>(null);

  const handleToggleMenarche = async (started: boolean) => {
    setIsUpdatingMenarche(true);
    setMenarcheSuccessMsg(null);
    try {
      const token = localStorage.getItem('femsphere_token');
      if (token) {
        const res = await fetch('/api/users/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            menarcheStarted: started
          })
        });
        if (res.ok) {
          await fetchUserProfile();
          await fetchPeriodData();
          setMenarcheSuccessMsg(
            started 
              ? 'First period onset recorded. Menstrual cycle tracking activated.' 
              : 'Stage calibrated: Menstrual cycle tracking paused until menarche.'
          );
          setTimeout(() => setMenarcheSuccessMsg(null), 4000);
        }
      }
    } catch (e) {
      console.error('Error updating menarche onset:', e);
    } finally {
      setIsUpdatingMenarche(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6 max-w-2xl mx-auto font-inter">
      <div className="border-b border-[#EDE9FE] pb-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-[#7C3AED]" />
          <h3 className="font-bold text-xl text-[#3a3135]">Account & Health Settings</h3>
        </div>
        <p className="text-xs text-[#7a6f75] mt-1">Configure biological parameters, communication preferences & security</p>
      </div>

      <div className="space-y-4 text-xs">
        
        {/* BIOLOGICAL LIFE STAGE & ONSET CALIBRATION */}
        <h4 className="font-bold text-sm text-[#3a3135] uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#7C3AED]" /> Biological Stage Calibration
        </h4>

        <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-200 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-[#3a3135] text-sm">{stageName || 'Reproductive Age'}</p>
              <p className="text-[#7a6f75] text-[11px]">
                Calculated dynamically from Date of Birth ({userProfile.dob || '1996-08-14'}, age {userProfile.dob ? calculateAge(userProfile.dob) : 28})
              </p>
            </div>
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-white text-[#7C3AED] border border-purple-200 shadow-2xs">
              {currentStageCode}
            </span>
          </div>

          <div className="pt-2 border-t border-purple-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-[#3a3135] block">First Period (Menarche) Onset</span>
              <span className="text-[11px] text-gray-500">
                For adolescents: toggle if periods started early or have not yet commenced.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isUpdatingMenarche}
                onClick={() => handleToggleMenarche(true)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  userProfile.menarcheStarted !== false
                    ? 'bg-[#7C3AED] text-white shadow-xs'
                    : 'bg-white text-gray-700 border border-purple-200 hover:bg-purple-50'
                }`}
              >
                {userProfile.menarcheStarted !== false && <Check className="w-3 h-3 inline mr-1" />}
                Started
              </button>

              <button
                type="button"
                disabled={isUpdatingMenarche}
                onClick={() => handleToggleMenarche(false)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  userProfile.menarcheStarted === false
                    ? 'bg-[#7C3AED] text-white shadow-xs'
                    : 'bg-white text-gray-700 border border-purple-200 hover:bg-purple-50'
                }`}
              >
                {userProfile.menarcheStarted === false && <Check className="w-3 h-3 inline mr-1" />}
                Not Yet
              </button>
            </div>
          </div>

          {menarcheSuccessMsg && (
            <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-[11px] font-semibold flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>{menarcheSuccessMsg}</span>
            </div>
          )}

          <div className="pt-1 flex justify-end">
            <Link
              to="/profile"
              className="text-[11px] font-bold text-[#7C3AED] hover:text-[#6D28D9] flex items-center gap-1"
            >
              <span>Edit Date of Birth in Profile</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* NOTIFICATIONS & REMINDERS */}
        <h4 className="font-bold text-sm text-[#3a3135] uppercase tracking-wider pt-2">Notifications & Reminders</h4>
        
        <div className="flex items-center justify-between p-4 bg-[#FAF8FC] rounded-2xl border border-[#EDE9FE]">
          <div>
            <p className="font-bold text-[#3a3135]">Email Health Alerts</p>
            <p className="text-[#7a6f75] text-[11px]">Receive daily vital reminders & AI insights via email</p>
          </div>
          <input 
            type="checkbox" 
            checked={settings.emailAlerts} 
            onChange={(e) => setSettings({...settings, emailAlerts: e.target.checked})} 
            className="w-5 h-5 accent-[#7C3AED] cursor-pointer" 
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-[#FAF8FC] rounded-2xl border border-[#EDE9FE]">
          <div>
            <p className="font-bold text-[#3a3135]">SMS / Phone Notifications</p>
            <p className="text-[#7a6f75] text-[11px]">Urgent appointment reminders via SMS</p>
          </div>
          <input 
            type="checkbox" 
            checked={settings.smsAlerts} 
            onChange={(e) => setSettings({...settings, smsAlerts: e.target.checked})} 
            className="w-5 h-5 accent-[#7C3AED] cursor-pointer" 
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-[#FAF8FC] rounded-2xl border border-[#EDE9FE]">
          <div>
            <p className="font-bold text-[#3a3135]">Daily Hydration & Vitals Reminders</p>
            <p className="text-[#7a6f75] text-[11px]">Push notifications to track daily water & sleep logs</p>
          </div>
          <input 
            type="checkbox" 
            checked={settings.healthReminders} 
            onChange={(e) => setSettings({...settings, healthReminders: e.target.checked})} 
            className="w-5 h-5 accent-[#7C3AED] cursor-pointer" 
          />
        </div>

        {/* SECURITY */}
        <h4 className="font-bold text-sm text-[#3a3135] uppercase tracking-wider pt-2">Security</h4>
        <div className="p-4 bg-[#FAF8FC] rounded-2xl border border-[#EDE9FE] flex items-center justify-between">
          <div>
            <p className="font-bold text-[#3a3135]">Account Password</p>
            <p className="text-[#7a6f75] text-[11px]">Update password regularly for HIPAA compliance</p>
          </div>
          <button 
            onClick={() => setShowPasswordModal(true)} 
            className="px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Lock className="w-3.5 h-3.5" /> Change Password
          </button>
        </div>
      </div>
    </div>
  );
}
