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
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#F4DDE2] shadow-sm max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-[#F4DDE2] pb-4">
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
              className="w-full p-3 rounded-xl border border-[#F4DDE2] font-bold text-[#3a3135]" 
              required 
            />
          </div>

          <div>
            <label className="block font-bold uppercase text-[#7a6f75] mb-1">Email Address</label>
            <input 
              type="email" 
              value={profile.email} 
              onChange={(e) => setProfile({ ...profile, email: e.target.value })} 
              className="w-full p-3 rounded-xl border border-[#F4DDE2]" 
              required 
            />
          </div>

          <div>
            <label className="block font-bold uppercase text-[#7a6f75] mb-1">Primary Specialization</label>
            <input 
              type="text" 
              value={profile.spec} 
              onChange={(e) => setProfile({ ...profile, spec: e.target.value })} 
              className="w-full p-3 rounded-xl border border-[#F4DDE2]" 
              required 
            />
          </div>

          <div>
            <label className="block font-bold uppercase text-[#7a6f75] mb-1">Hospital / Clinic Affiliation</label>
            <input 
              type="text" 
              value={profile.hospital} 
              onChange={(e) => setProfile({ ...profile, hospital: e.target.value })} 
              className="w-full p-3 rounded-xl border border-[#F4DDE2]" 
              required 
            />
          </div>

          <div>
            <label className="block font-bold uppercase text-[#7a6f75] mb-1">Medical License Number</label>
            <input 
              type="text" 
              value={profile.license} 
              readOnly 
              className="w-full p-3 rounded-xl border border-[#F4DDE2] bg-[#F9E8EC] text-[#936DA2] font-mono font-bold" 
            />
          </div>

          <div>
            <label className="block font-bold uppercase text-[#7a6f75] mb-1">Practice Working Hours</label>
            <input 
              type="text" 
              value={profile.workingHours} 
              onChange={(e) => setProfile({ ...profile, workingHours: e.target.value })} 
              className="w-full p-3 rounded-xl border border-[#F4DDE2]" 
            />
          </div>
        </div>

        <div>
          <label className="block font-bold uppercase text-[#7a6f75] mb-1">Professional Clinical Bio</label>
          <textarea 
            value={profile.bio} 
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })} 
            rows={3}
            className="w-full p-3 rounded-xl border border-[#F4DDE2] text-xs" 
          />
        </div>

        <div className="pt-2 flex items-center justify-between">
          <button 
            type="button" 
            onClick={() => setShowPasswordModal(true)} 
            className="px-4 py-2.5 rounded-xl border border-[#F4DDE2] font-bold text-[#936DA2] hover:bg-purple-50 cursor-pointer transition-colors"
          >
            Change Password
          </button>
          <button 
            type="submit" 
            className="px-6 py-2.5 bg-[#936DA2] hover:bg-[#835A92] text-white rounded-xl font-bold transition-all shadow-sm cursor-pointer"
          >
            Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
}
