import React from 'react';
import { CheckCircle2, User, Mail, Shield, Key } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminProfilePage() {
  const {
    adminProfile,
    profileSaveMsg,
    isAdminEditing,
    setIsAdminEditing,
    adminEditForm,
    setAdminEditForm,
    handleSaveProfile,
    setShowPasswordModal
  } = useAdmin();

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-4">
        <div>
          <h3 className="font-bold text-2xl text-[#3a3135]">Admin Account Details</h3>
          <p className="text-sm text-[#64595e]">Manage credentials and system access permissions</p>
        </div>
        {!isAdminEditing ? (
          <button 
            onClick={() => { 
              setAdminEditForm({ name: adminProfile.name, email: adminProfile.email }); 
              setIsAdminEditing(true); 
            }} 
            className="px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Edit Profile
          </button>
        ) : (
          <button 
            onClick={() => setIsAdminEditing(false)} 
            className="px-4 py-2 border border-[#EDE9FE] text-[#7a6f75] hover:bg-gray-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>

      {profileSaveMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {profileSaveMsg}
        </div>
      )}

      {!isAdminEditing ? (
        <div className="space-y-4 text-sm font-inter">
          <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE] flex items-start gap-3">
            <User className="w-5 h-5 text-[#7C3AED] mt-0.5" />
            <div>
              <span className="block font-bold text-[#7a6f75] uppercase text-xs mb-1">Administrator Name</span>
              <p className="font-bold text-[#3a3135] text-lg">{adminProfile.name}</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE] flex items-start gap-3">
            <Mail className="w-5 h-5 text-[#14B8A6] mt-0.5" />
            <div>
              <span className="block font-bold text-[#7a6f75] uppercase text-xs mb-1">Email Address</span>
              <p className="font-bold text-[#3a3135] text-lg">{adminProfile.email}</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE] flex items-start gap-3">
            <Shield className="w-5 h-5 text-[#F472B6] mt-0.5" />
            <div>
              <span className="block font-bold text-[#7a6f75] uppercase text-xs mb-1">Security Privilege</span>
              <p className="font-bold text-[#7C3AED] text-lg">{adminProfile.securityClearance}</p>
            </div>
          </div>
          <button 
            onClick={() => setShowPasswordModal(true)} 
            className="w-full py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Key className="w-4 h-4" /> Change Password
          </button>
        </div>
      ) : (
        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-inter">
          <div>
            <label className="block font-bold uppercase text-[#7a6f75] mb-1">Administrator Name</label>
            <input 
              type="text" 
              value={adminEditForm.name} 
              onChange={(e) => setAdminEditForm({ ...adminEditForm, name: e.target.value })} 
              className="w-full p-3 rounded-xl border border-[#EDE9FE] text-sm focus:ring-2 focus:ring-[#7C3AED] outline-none" 
              required 
            />
          </div>
          <div>
            <label className="block font-bold uppercase text-[#7a6f75] mb-1">Email Address</label>
            <input 
              type="email" 
              value={adminEditForm.email} 
              onChange={(e) => setAdminEditForm({ ...adminEditForm, email: e.target.value })} 
              className="w-full p-3 rounded-xl border border-[#EDE9FE] text-sm focus:ring-2 focus:ring-[#7C3AED] outline-none" 
              required 
            />
          </div>
          <div className="pt-2 flex items-center justify-between">
            <button 
              type="button" 
              onClick={() => setIsAdminEditing(false)} 
              className="px-4 py-2.5 rounded-xl border border-[#EDE9FE] font-bold text-[#7a6f75] hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-bold transition-all shadow-sm cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
