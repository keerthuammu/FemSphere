import React from 'react';
import { Edit3, X, Camera, Lock } from 'lucide-react';
import { useUser, calculateAge } from '../../context/UserContext';
import { isValidName, isValidPhone, isValidEmail, isPastOrToday } from '../../utils/validation';

export default function UserProfilePage() {
  const {
    userProfile,
    editProfileForm,
    setEditProfileForm,
    isEditingProfile,
    setIsEditingProfile,
    profileErrorMsg,
    handleSaveProfile,
    setShowPhotoModal,
    setTempAvatarUrl,
    setTempAvatarBg,
    setShowPasswordModal
  } = useUser();

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6 max-w-3xl mx-auto font-inter">
      <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-4">
        <div>
          <h3 className="font-bold text-xl text-[#3a3135]">My Profile Information</h3>
          <p className="text-xs text-[#7a6f75]">Manage your personal profile details and profile avatar photo</p>
        </div>
        {!isEditingProfile ? (
          <button 
            onClick={() => { setEditProfileForm({ ...userProfile }); setIsEditingProfile(true); }} 
            className="flex items-center gap-2 px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs"
          >
            <Edit3 className="w-4 h-4" /> Edit Profile
          </button>
        ) : (
          <button 
            onClick={() => setIsEditingProfile(false)} 
            className="flex items-center gap-2 px-4 py-2 border border-[#EDE9FE] text-[#7a6f75] hover:bg-gray-50 rounded-xl text-xs font-bold cursor-pointer transition-all"
          >
            <X className="w-4 h-4" /> Cancel
          </button>
        )}
      </div>

      {/* PROFILE PHOTO AVATAR HEADER CARD */}
      <div className="bg-[#FAF8FC] p-6 rounded-3xl border border-[#EDE9FE] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          {/* Photo Avatar Circle with Edit Badge */}
          <div 
            className="relative group cursor-pointer" 
            onClick={() => {
              setTempAvatarUrl(userProfile.avatarUrl);
              setTempAvatarBg(userProfile.avatarBg || '#7C3AED');
              setShowPhotoModal(true);
            }}
          >
            <div 
              className="w-24 h-24 rounded-full text-white flex items-center justify-center font-bold text-3xl shadow-md border-4 border-white overflow-hidden relative"
              style={{ backgroundColor: userProfile.avatarBg || '#7C3AED' }}
            >
              {userProfile.avatarUrl ? (
                <img src={userProfile.avatarUrl} alt={userProfile.fullName} className="w-full h-full object-cover rounded-full" />
              ) : (
                <span>{userProfile.fullName ? userProfile.fullName.charAt(0).toUpperCase() : 'U'}</span>
              )}
            </div>
            <button 
              type="button" 
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#7C3AED] text-white flex items-center justify-center shadow-lg border-2 border-white hover:bg-[#6D28D9] transition-transform group-hover:scale-110 cursor-pointer"
              title="Edit Profile Photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div>
            <h4 className="font-bold text-xl text-[#3a3135]">{userProfile.fullName || 'User'}</h4>
            <p className="text-xs text-[#7a6f75] mt-0.5">{userProfile.email} • {userProfile.phone}</p>
            <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-[#7C3AED] border border-purple-200 mt-2">
              FemSphere Verified Account
            </span>
          </div>
        </div>

        <button 
          type="button"
          onClick={() => {
            setTempAvatarUrl(userProfile.avatarUrl);
            setTempAvatarBg(userProfile.avatarBg || '#7C3AED');
            setShowPhotoModal(true);
          }}
          className="px-5 py-2.5 bg-white border border-[#EDE9FE] hover:bg-[#F5F3FF] text-[#7C3AED] rounded-2xl font-bold text-xs flex items-center gap-2 shadow-2xs transition-all cursor-pointer shrink-0"
        >
          <Camera className="w-4 h-4 text-[#7C3AED]" /> Change Profile Photo
        </button>
      </div>

      {!isEditingProfile ? (
        // View Mode
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-5 text-xs">
            <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE]">
              <span className="block font-bold text-[#7a6f75] uppercase text-[10px] mb-1">Full Name</span>
              <p className="font-bold text-[#3a3135] text-base">{userProfile.fullName || '--'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE]">
              <span className="block font-bold text-[#7a6f75] uppercase text-[10px] mb-1">Date of Birth & Age</span>
              <p className="font-bold text-[#3a3135] text-base">{userProfile.dob || '--'} ({calculateAge(userProfile.dob)} yrs)</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE]">
              <span className="block font-bold text-[#7a6f75] uppercase text-[10px] mb-1">Blood Group</span>
              <p className="font-bold text-[#3a3135] text-base">{userProfile.bloodGroup || '--'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE]">
              <span className="block font-bold text-[#7a6f75] uppercase text-[10px] mb-1">Height & Weight</span>
              <p className="font-bold text-[#3a3135] text-base">{userProfile.height ? `${userProfile.height} cm` : '--'} / {userProfile.weight ? `${userProfile.weight} kg` : '--'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE]">
              <span className="block font-bold text-[#7a6f75] uppercase text-[10px] mb-1">Phone Number</span>
              <p className="font-bold text-[#3a3135] text-base">{userProfile.phone || '--'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE]">
              <span className="block font-bold text-[#7a6f75] uppercase text-[10px] mb-1">Email Address</span>
              <p className="font-bold text-[#3a3135] text-base">{userProfile.email || '--'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE] md:col-span-2">
              <span className="block font-bold text-[#7a6f75] uppercase text-[10px] mb-1">Street Address</span>
              <p className="font-bold text-[#3a3135] text-base">{userProfile.address || '--'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE] md:col-span-2">
              <span className="block font-bold text-[#7a6f75] uppercase text-[10px] mb-1">Emergency Contact</span>
              <p className="font-bold text-[#3a3135] text-base">{userProfile.emergencyContact || '--'}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#EDE9FE] flex justify-between items-center">
            <button 
              onClick={() => setShowPasswordModal(true)} 
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#EDE9FE] text-xs font-bold text-[#7C3AED] hover:bg-[#F5F3FF] cursor-pointer transition-colors"
            >
              <Lock className="w-4 h-4" /> Change Password
            </button>
          </div>
        </div>
      ) : (
        // Edit Form Mode
        <form onSubmit={handleSaveProfile} className="space-y-4">
          {profileErrorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
              {profileErrorMsg}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#4a4145] uppercase mb-1">Full Name</label>
              <input 
                type="text" 
                value={editProfileForm.fullName} 
                onChange={(e) => setEditProfileForm({...editProfileForm, fullName: e.target.value})} 
                className={`w-full p-3 rounded-xl border ${
                  editProfileForm.fullName.trim() && !isValidName(editProfileForm.fullName)
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-[#EDE9FE]'
                }`} 
                required 
              />
              {editProfileForm.fullName.trim() && !isValidName(editProfileForm.fullName) && (
                <p className="text-xs mt-1 font-medium text-red-500">Please enter letters only (min 2 characters)</p>
              )}
            </div>

            <div>
              <label className="block font-bold text-[#4a4145] uppercase mb-1">Date of Birth</label>
              <input 
                type="date" 
                value={editProfileForm.dob} 
                onChange={(e) => setEditProfileForm({...editProfileForm, dob: e.target.value})} 
                className={`w-full p-3 rounded-xl border ${
                  editProfileForm.dob && !isPastOrToday(editProfileForm.dob)
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-[#EDE9FE]'
                }`} 
                required 
              />
              {editProfileForm.dob && !isPastOrToday(editProfileForm.dob) && (
                <p className="text-xs mt-1 font-medium text-red-500">Date of birth cannot be in the future</p>
              )}
            </div>

            <div>
              <label className="block font-bold text-[#4a4145] uppercase mb-1">Blood Group</label>
              <select 
                value={editProfileForm.bloodGroup} 
                onChange={(e) => setEditProfileForm({...editProfileForm, bloodGroup: e.target.value})} 
                className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-white font-medium"
              >
                <option value="A+">A Positive (A+)</option>
                <option value="A-">A Negative (A-)</option>
                <option value="B+">B Positive (B+)</option>
                <option value="B-">B Negative (B-)</option>
                <option value="O+">O Positive (O+)</option>
                <option value="O-">O Negative (O-)</option>
                <option value="AB+">AB Positive (AB+)</option>
                <option value="AB-">AB Negative (AB-)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-[#4a4145] uppercase mb-1">Height (cm)</label>
                <input 
                  type="number" 
                  value={editProfileForm.height} 
                  onChange={(e) => setEditProfileForm({...editProfileForm, height: e.target.value})} 
                  className="w-full p-3 rounded-xl border border-[#EDE9FE]" 
                />
              </div>
              <div>
                <label className="block font-bold text-[#4a4145] uppercase mb-1">Weight (kg)</label>
                <input 
                  type="number" 
                  value={editProfileForm.weight} 
                  onChange={(e) => setEditProfileForm({...editProfileForm, weight: e.target.value})} 
                  className="w-full p-3 rounded-xl border border-[#EDE9FE]" 
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#4a4145] uppercase mb-1">Phone Number</label>
              <input 
                type="tel" 
                value={editProfileForm.phone} 
                onChange={(e) => setEditProfileForm({...editProfileForm, phone: e.target.value})} 
                className={`w-full p-3 rounded-xl border ${
                  editProfileForm.phone.trim() && !isValidPhone(editProfileForm.phone)
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-[#EDE9FE]'
                }`} 
                required 
              />
              {editProfileForm.phone.trim() && !isValidPhone(editProfileForm.phone) && (
                <p className="text-xs mt-1 font-medium text-red-500">Invalid phone number (min 10 digits)</p>
              )}
            </div>

            <div>
              <label className="block font-bold text-[#4a4145] uppercase mb-1">Email Address</label>
              <input 
                type="email" 
                value={editProfileForm.email} 
                onChange={(e) => setEditProfileForm({...editProfileForm, email: e.target.value})} 
                className={`w-full p-3 rounded-xl border ${
                  editProfileForm.email.trim() && !isValidEmail(editProfileForm.email)
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-[#EDE9FE]'
                }`} 
                required 
              />
              {editProfileForm.email.trim() && !isValidEmail(editProfileForm.email) && (
                <p className="text-xs mt-1 font-medium text-red-500">Invalid email</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-[#4a4145] uppercase mb-1">Street Address</label>
              <input 
                type="text" 
                value={editProfileForm.address} 
                onChange={(e) => setEditProfileForm({...editProfileForm, address: e.target.value})} 
                className="w-full p-3 rounded-xl border border-[#EDE9FE]" 
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-[#4a4145] uppercase mb-1">Emergency Contact</label>
              <input 
                type="text" 
                value={editProfileForm.emergencyContact} 
                onChange={(e) => setEditProfileForm({...editProfileForm, emergencyContact: e.target.value})} 
                className="w-full p-3 rounded-xl border border-[#EDE9FE]" 
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setIsEditingProfile(false)} 
              className="px-5 py-2.5 rounded-xl border border-[#EDE9FE] font-bold text-xs hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-bold text-xs shadow-xs cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
