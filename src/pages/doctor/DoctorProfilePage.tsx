import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useDoctor } from '../../context/DoctorContext';

export default function DoctorProfilePage() {
  const {
    profile,
    setProfile,
    profileSaveMsg,
    handleSaveDoctorProfile,
    setShowPasswordModal
  } = useDoctor();

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-[#EDE9FE] pb-4">
        <h3 className="font-serif text-3xl font-bold text-[#3a3135]">Doctor Credentials & Practice Profile</h3>
        <p className="text-xs text-[#7a6f75] mt-1">Manage clinical license information, consultation fees, and working hours</p>
      </div>

      {profileSaveMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {profileSaveMsg}
        </div>
      )}

      <form onSubmit={handleSaveDoctorProfile} className="space-y-4 text-xs">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold uppercase text-[#7a6f75] mb-1">Full Practitioner Name</label>
            <input 
              type="text" 
              value={profile.name} 
              onChange={(e) => setProfile({ ...profile, name: e.target.value })} 
              className="w-full p-3 rounded-xl border border-[#EDE9FE] font-bold text-[#3a3135]" 
              required 
            />
          </div>

          <div>
            <label className="block font-bold uppercase text-[#7a6f75] mb-1">Email Address</label>
            <input 
              type="email" 
              value={profile.email} 
              onChange={(e) => setProfile({ ...profile, email: e.target.value })} 
              className="w-full p-3 rounded-xl border border-[#EDE9FE]" 
              required 
            />
          </div>

          <div>
            <label className="block font-bold uppercase text-[#7a6f75] mb-1">Primary Specialization</label>
            <input 
              type="text" 
              value={profile.spec} 
              onChange={(e) => setProfile({ ...profile, spec: e.target.value })} 
              className="w-full p-3 rounded-xl border border-[#EDE9FE]" 
              required 
            />
          </div>

          <div>
            <label className="block font-bold uppercase text-[#7a6f75] mb-1">Hospital / Clinic Affiliation</label>
            <input 
              type="text" 
              value={profile.hospital} 
              onChange={(e) => setProfile({ ...profile, hospital: e.target.value })} 
              className="w-full p-3 rounded-xl border border-[#EDE9FE]" 
              required 
            />
          </div>

          <div>
            <label className="block font-bold uppercase text-[#7a6f75] mb-1">Medical License Number</label>
            <input 
              type="text" 
              value={profile.license} 
              readOnly 
              className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-[#F5F3FF] text-[#7C3AED] font-mono font-bold" 
            />
          </div>

          <div>
            <label className="block font-bold uppercase text-[#7a6f75] mb-1">Practice Working Hours</label>
            <input 
              type="text" 
              value={profile.workingHours} 
              onChange={(e) => setProfile({ ...profile, workingHours: e.target.value })} 
              className="w-full p-3 rounded-xl border border-[#EDE9FE]" 
            />
          </div>
        </div>

        <div>
          <label className="block font-bold uppercase text-[#7a6f75] mb-1">Professional Clinical Bio</label>
          <textarea 
            value={profile.bio} 
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })} 
            rows={3}
            className="w-full p-3 rounded-xl border border-[#EDE9FE] text-xs" 
          />
        </div>

        <div className="pt-2 flex items-center justify-between">
          <button 
            type="button" 
            onClick={() => setShowPasswordModal(true)} 
            className="px-4 py-2.5 rounded-xl border border-[#EDE9FE] font-bold text-[#7C3AED] hover:bg-purple-50 cursor-pointer transition-colors"
          >
            Change Password
          </button>
          <button 
            type="submit" 
            className="px-6 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-bold transition-all shadow-sm cursor-pointer"
          >
            Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
}
