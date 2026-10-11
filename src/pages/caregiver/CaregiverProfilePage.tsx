import React, { useState } from 'react';
import { User, CheckCircle2, Lock, X } from 'lucide-react';
import { useCaregiver } from '../../context/CaregiverContext';

export default function CaregiverProfilePage() {
  const { profile, setProfile, saveProfile, profileSaveMsg } = useCaregiver();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    setPasswordMsg('Password successfully updated!');
    setTimeout(() => {
      setPasswordMsg(null);
      setShowPasswordModal(false);
      setOldPassword('');
      setNewPassword('');
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto animate-in fade-in duration-200 font-inter">
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#F4DDE2] shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#F4DDE2]">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#936DA2] flex items-center justify-center font-bold">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-2xl text-[#3a3135]">Caregiver Profile</h3>
            <p className="text-xs text-[#7a6f75]">Update personal credentials, role, and emergency contact details</p>
          </div>
        </div>

        {profileSaveMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {profileSaveMsg}
          </div>
        )}

        <form onSubmit={saveProfile} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold uppercase text-[#7a6f75] mb-1">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full p-3 rounded-xl border border-[#F4DDE2] text-sm font-medium"
              required
            />
          </div>

          <div>
            <label className="block font-bold uppercase text-[#7a6f75] mb-1">Email Address</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full p-3 rounded-xl border border-[#F4DDE2] text-sm font-medium"
              required
            />
          </div>

          <div>
            <label className="block font-bold uppercase text-[#7a6f75] mb-1">Relationship / Caregiver Role</label>
            <input
              type="text"
              value={profile.relationship}
              onChange={(e) => setProfile({ ...profile, relationship: e.target.value })}
              className="w-full p-3 rounded-xl border border-[#F4DDE2] text-sm font-medium"
              required
            />
          </div>

          <div>
            <label className="block font-bold uppercase text-[#7a6f75] mb-1">Emergency Contact Phone</label>
            <input
              type="text"
              value={profile.contact}
              onChange={(e) => setProfile({ ...profile, contact: e.target.value })}
              className="w-full p-3 rounded-xl border border-[#F4DDE2] text-sm font-medium"
            />
          </div>

          <div className="pt-3 border-t border-[#F4DDE2] flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="px-4 py-2.5 rounded-xl border border-[#F4DDE2] font-bold text-[#936DA2] hover:bg-purple-50 transition-colors cursor-pointer"
            >
              Change Password
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#936DA2] hover:bg-[#835A92] text-white rounded-xl font-bold transition-all shadow-sm cursor-pointer"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full border border-[#F4DDE2] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#F4DDE2] pb-3">
              <h3 className="font-bold text-base text-[#3a3135] flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#936DA2]" /> Change Password
              </h3>
              <button onClick={() => setShowPasswordModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {passwordMsg && (
              <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl">{passwordMsg}</div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Current Password</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#F4DDE2]"
                  required
                />
              </div>
              <div>
                <label className="block font-bold mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#F4DDE2]"
                  required
                />
              </div>
              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#936DA2] text-white rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="py-2.5 px-4 border border-[#F4DDE2] rounded-xl font-bold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
