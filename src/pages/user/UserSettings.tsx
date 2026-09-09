import React from 'react';
import { Lock, Sliders } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export default function UserSettings() {
  const {
    settings,
    setSettings,
    setShowPasswordModal
  } = useUser();

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6 max-w-2xl mx-auto font-inter">
      <div className="border-b border-[#EDE9FE] pb-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-[#7C3AED]" />
          <h3 className="font-bold text-xl text-[#3a3135]">Account & App Settings</h3>
        </div>
        <p className="text-xs text-[#7a6f75] mt-1">Configure communication preferences, reminders & security</p>
      </div>

      <div className="space-y-4 text-xs">
        <h4 className="font-bold text-sm text-[#3a3135] uppercase tracking-wider">Notifications & Reminders</h4>
        
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

        <h4 className="font-bold text-sm text-[#3a3135] uppercase tracking-wider pt-4">Security</h4>
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
