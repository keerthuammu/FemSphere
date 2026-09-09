import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { 
  Shield, Sparkles, Users, UserCheck, Stethoscope, FileText, 
  BookOpen, LogOut, CheckCircle2, User, Clock, Activity, 
  Plus, X, Lock, Sliders, ChevronDown
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { isValidName, isValidEmail, isValidPhone, validatePassword } from '../../utils/validation';

export default function AdminLayout() {
  const navigate = useNavigate();
  const {
    adminProfile,
    currentTime,
    handleLogout,
    stats,
    // Add User Modal
    showAddUserModal,
    setShowAddUserModal,
    userForm,
    setUserForm,
    handleAddUser,
    // Add Caregiver Modal
    showAddCaregiverModal,
    setShowAddCaregiverModal,
    caregiverForm,
    setCaregiverForm,
    handleAddCaregiver,
    // Add Article Modal
    showAddArticleModal,
    setShowAddArticleModal,
    newArticle,
    setNewArticle,
    handleAddArticle,
    // Password Modal
    showPasswordModal,
    setShowPasswordModal,
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    handleChangePassword
  } = useAdmin();

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF7F4] flex font-inter text-[#2E2428]">
      
      {/* SIDEBAR NAVIGATION MENU */}
      <aside className="w-64 bg-[#F4E0D1] border-r border-[#E5CDBC] hidden lg:flex flex-col flex-shrink-0 sticky top-0 h-screen font-inter print:hidden">
        <div className="p-5 border-b border-[#E5CDBC] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-[#7C3AED] tracking-tight">FemSphere</h1>
            <Sparkles className="w-4 h-4 text-[#14B8A6]" />
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-hide font-inter">
          <p className="text-[11px] uppercase tracking-widest text-[#8C756B] font-bold px-3 py-1.5">Governance</p>
          
          {/* 1. Overview */}
          <NavLink 
            to="/admin" 
            end
            className={({ isActive }) => `w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              isActive ? 'bg-white text-[#7C3AED] shadow-xs border border-[#E5CDBC]' : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'
            }`}
          >
            <Activity className="w-4 h-4 text-[#7C3AED]" /> Overview
          </NavLink>

          {/* 2. Manage Users */}
          <NavLink 
            to="/admin/users" 
            className={({ isActive }) => `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              isActive ? 'bg-white text-[#7C3AED] shadow-xs border border-[#E5CDBC]' : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-[#7C3AED]" /> Users
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white text-[#7C3AED] border border-[#E5CDBC]">
              {stats.totalUsers}
            </span>
          </NavLink>

          {/* 3. Manage Caregivers */}
          <NavLink 
            to="/admin/caregivers" 
            className={({ isActive }) => `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              isActive ? 'bg-white text-[#7C3AED] shadow-xs border border-[#E5CDBC]' : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-[#14B8A6]" /> Caregivers
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white text-[#7C3AED] border border-[#E5CDBC]">
              {stats.totalCaregivers}
            </span>
          </NavLink>

          {/* 4. Manage Doctors & Approvals */}
          <NavLink 
            to="/admin/doctors" 
            className={({ isActive }) => `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              isActive ? 'bg-white text-[#7C3AED] shadow-xs border border-[#E5CDBC]' : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Stethoscope className="w-4 h-4 text-[#F472B6]" /> Doctors & Approvals
            </div>
            {stats.pendingDoctorApprovals > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white">
                {stats.pendingDoctorApprovals}
              </span>
            )}
          </NavLink>

          {/* 5. Health Articles */}
          <NavLink 
            to="/admin/articles" 
            className={({ isActive }) => `w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              isActive ? 'bg-white text-[#7C3AED] shadow-xs border border-[#E5CDBC]' : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#7C3AED]" /> Health Articles
          </NavLink>

          {/* 6. System Reports */}
          <NavLink 
            to="/admin/reports" 
            className={({ isActive }) => `w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              isActive ? 'bg-white text-[#7C3AED] shadow-xs border border-[#E5CDBC]' : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'
            }`}
          >
            <FileText className="w-4 h-4 text-[#14B8A6]" /> System Reports
          </NavLink>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto font-inter">
        
        {/* HEADER BAR */}
        <header className="bg-[#F4E0D1]/90 backdrop-blur-md border-b border-[#E5CDBC] p-4 md:px-6 flex items-center justify-between sticky top-0 z-20 print:hidden font-inter">
          <div>
            <h2 className="font-bold text-[#3a3135] text-lg md:text-xl">
              Welcome, {adminProfile.name}!
            </h2>
            <p className="text-xs text-[#64595e] flex items-center gap-1.5 mt-0.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#7C3AED]" />
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
          </div>
          
          <div className="flex items-center gap-2.5">
            {/* Quick Action: Add User */}
            <button 
              onClick={() => setShowAddUserModal(true)} 
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7C3AED] text-white text-xs font-bold shadow-xs hover:bg-[#6D28D9] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add User
            </button>

            {/* Profile Photo Avatar Dropdown Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)} 
                className="p-1 rounded-full border border-[#EDE9FE] bg-[#FAF8FC] hover:bg-white hover:scale-105 transition-all cursor-pointer shadow-xs focus:ring-2 focus:ring-[#7C3AED]"
                title="Profile Menu"
              >
                {/* Profile Avatar Circle */}
                <div className="w-9 h-9 rounded-full bg-[#7C3AED] text-white flex items-center justify-center font-bold text-sm shadow-inner relative">
                  {adminProfile.name.charAt(0)}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                </div>
              </button>

              {/* Popover Menu */}
              {showProfileDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setShowProfileDropdown(false)}
                  ></div>

                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#EDE9FE] shadow-xl z-40 py-2 font-inter animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2.5 border-b border-[#EDE9FE] bg-[#FAF8FC]">
                      <p className="text-xs font-bold text-[#3a3135] truncate">{adminProfile.name}</p>
                      <p className="text-[11px] text-[#7a6f75] truncate">{adminProfile.email}</p>
                      <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#EDE9FE] text-[#7C3AED]">
                        {adminProfile.securityClearance}
                      </span>
                    </div>

                    <button 
                      onClick={() => {
                        navigate('/admin/profile');
                        setShowProfileDropdown(false);
                      }} 
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-[#3a3135] hover:bg-[#F5F3FF] hover:text-[#7C3AED] transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-[#7C3AED]" /> Admin Profile
                    </button>

                    <button 
                      onClick={() => {
                        navigate('/admin/reports');
                        setShowProfileDropdown(false);
                      }} 
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-[#3a3135] hover:bg-[#F5F3FF] hover:text-[#7C3AED] transition-colors"
                    >
                      <Sliders className="w-3.5 h-3.5 text-[#7C3AED]" /> System Governance
                    </button>

                    <div className="my-1 border-t border-[#EDE9FE]"></div>

                    <button 
                      onClick={() => {
                        setShowProfileDropdown(false);
                        handleLogout();
                      }} 
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-500" /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* CONTAINER WORKSPACE FOR SUB-ROUTES */}
        <main className="p-4 md:p-6 max-w-6xl mx-auto w-full space-y-6 font-inter">
          <Outlet />
        </main>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-[#EDE9FE]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-xl text-[#3a3135]">Add New User</h3>
              <button onClick={() => setShowAddUserModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3a3135] uppercase mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={userForm.name} 
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  placeholder="Enter full name"
                  className={`w-full px-4 py-3 rounded-xl border ${userForm.name && !isValidName(userForm.name) ? 'border-rose-400 bg-rose-50/20' : 'border-[#EDE9FE]'} text-sm`} 
                  required 
                />
                {userForm.name && !isValidName(userForm.name) && (
                  <p className="text-[11px] text-red-500 mt-1">Full name must be at least 2 characters</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-[#3a3135] uppercase mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={userForm.email} 
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  placeholder="name@domain.com"
                  className={`w-full px-4 py-3 rounded-xl border ${userForm.email && !isValidEmail(userForm.email) ? 'border-rose-400 bg-rose-50/20' : 'border-[#EDE9FE]'} text-sm`} 
                  required 
                />
                {userForm.email && !isValidEmail(userForm.email) && (
                  <p className="text-[11px] text-red-500 mt-1">Please enter a valid email address</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-[#3a3135] uppercase mb-1">Role</label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] text-sm"
                >
                  <option value="Myself">Myself (User)</option>
                  <option value="User (Female)">User (Female)</option>
                  <option value="Caregiver">Caregiver</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Administrator">Administrator</option>
                </select>
              </div>
              <button type="submit" className="w-full py-3 bg-[#7C3AED] text-white rounded-xl font-bold text-sm cursor-pointer">
                Save User
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Caregiver Modal */}
      {showAddCaregiverModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-[#EDE9FE]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-xl text-[#3a3135]">Add Caregiver</h3>
              <button onClick={() => setShowAddCaregiverModal(false)}><X className="w-5 h-5 text-gray-400 cursor-pointer" /></button>
            </div>
            <form onSubmit={handleAddCaregiver} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3a3135] uppercase mb-1">Caregiver Name</label>
                <input 
                  type="text" 
                  value={caregiverForm.name} 
                  onChange={(e) => setCaregiverForm({ ...caregiverForm, name: e.target.value })}
                  placeholder="Full name"
                  className={`w-full px-4 py-3 rounded-xl border ${caregiverForm.name && !isValidName(caregiverForm.name) ? 'border-rose-400 bg-rose-50/20' : 'border-[#EDE9FE]'} text-sm`} 
                  required 
                />
                {caregiverForm.name && !isValidName(caregiverForm.name) && (
                  <p className="text-[11px] text-red-500 mt-1">Name must be at least 2 characters</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-[#3a3135] uppercase mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={caregiverForm.email} 
                  onChange={(e) => setCaregiverForm({ ...caregiverForm, email: e.target.value })}
                  placeholder="email@care.org"
                  className={`w-full px-4 py-3 rounded-xl border ${caregiverForm.email && !isValidEmail(caregiverForm.email) ? 'border-rose-400 bg-rose-50/20' : 'border-[#EDE9FE]'} text-sm`} 
                  required 
                />
                {caregiverForm.email && !isValidEmail(caregiverForm.email) && (
                  <p className="text-[11px] text-red-500 mt-1">Please enter a valid email address</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-[#3a3135] uppercase mb-1">Relationship</label>
                <input 
                  type="text" 
                  value={caregiverForm.relation} 
                  onChange={(e) => setCaregiverForm({ ...caregiverForm, relation: e.target.value })}
                  placeholder="e.g. Parent, Guardian, Nurse"
                  className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#3a3135] uppercase mb-1">Phone</label>
                <input 
                  type="tel" 
                  value={caregiverForm.phone} 
                  onChange={(e) => setCaregiverForm({ ...caregiverForm, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className={`w-full px-4 py-3 rounded-xl border ${caregiverForm.phone && !isValidPhone(caregiverForm.phone) ? 'border-rose-400 bg-rose-50/20' : 'border-[#EDE9FE]'} text-sm`}
                />
                {caregiverForm.phone && !isValidPhone(caregiverForm.phone) && (
                  <p className="text-[11px] text-red-500 mt-1">Phone must be a valid 10-digit number</p>
                )}
              </div>
              <button type="submit" className="w-full py-3 bg-[#7C3AED] text-white rounded-xl font-bold text-sm cursor-pointer">
                Save Caregiver
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Article Modal */}
      {showAddArticleModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-[#EDE9FE]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-xl text-[#3a3135]">Publish Health Article</h3>
              <button onClick={() => setShowAddArticleModal(false)}><X className="w-5 h-5 text-gray-400 cursor-pointer" /></button>
            </div>
            <form onSubmit={handleAddArticle} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3a3135] uppercase mb-1">Article Title</label>
                <input 
                  type="text" 
                  value={newArticle.title} 
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                  placeholder="Title"
                  className={`w-full px-4 py-3 rounded-xl border ${newArticle.title && newArticle.title.trim().length < 5 ? 'border-rose-400 bg-rose-50/20' : 'border-[#EDE9FE]'} text-sm`} 
                  required 
                />
                {newArticle.title && newArticle.title.trim().length < 5 && (
                  <p className="text-[11px] text-red-500 mt-1">Title must be at least 5 characters</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-[#3a3135] uppercase mb-1">Category</label>
                <select
                  value={newArticle.category}
                  onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] text-sm"
                >
                  <option value="Wellness">Wellness</option>
                  <option value="Medical">Medical</option>
                  <option value="Nutrition">Nutrition</option>
                  <option value="Mental Health">Mental Health</option>
                  <option value="Preventative">Preventative</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#3a3135] uppercase mb-1">Description</label>
                <textarea 
                  value={newArticle.desc} 
                  onChange={(e) => setNewArticle({ ...newArticle, desc: e.target.value })}
                  placeholder="Short description"
                  className={`w-full px-4 py-3 rounded-xl border ${newArticle.desc && newArticle.desc.trim().length > 0 && newArticle.desc.trim().length < 10 ? 'border-rose-400 bg-rose-50/20' : 'border-[#EDE9FE]'} text-sm`} 
                  rows={3}
                />
                {newArticle.desc && newArticle.desc.trim().length > 0 && newArticle.desc.trim().length < 10 && (
                  <p className="text-[11px] text-red-500 mt-1">Description must be at least 10 characters</p>
                )}
              </div>
              <button type="submit" className="w-full py-3 bg-[#7C3AED] text-white rounded-xl font-bold text-sm cursor-pointer">
                Publish Article
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#EDE9FE]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-[#3a3135]">Change Password</h3>
              <button onClick={() => setShowPasswordModal(false)}><X className="w-5 h-5 text-gray-400 cursor-pointer" /></button>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3a3135] uppercase mb-1">Old Password</label>
                <input 
                  type="password" 
                  value={oldPassword} 
                  onChange={(e) => setOldPassword(e.target.value)} 
                  className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] text-sm" 
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#3a3135] uppercase mb-1">New Password</label>
                <input 
                  type="password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  className={`w-full px-4 py-3 rounded-xl border ${newPassword && (!validatePassword(newPassword).isValid || (oldPassword && oldPassword === newPassword)) ? 'border-rose-400 bg-rose-50/20' : 'border-[#EDE9FE]'} text-sm`} 
                  required
                />
                {newPassword && !validatePassword(newPassword).isValid && (
                  <p className="text-[11px] text-red-500 mt-1">{validatePassword(newPassword).errors[0]}</p>
                )}
                {oldPassword && newPassword && oldPassword === newPassword && (
                  <p className="text-[11px] text-red-500 mt-1">New password cannot match current password</p>
                )}
              </div>
              <button type="submit" className="w-full py-3 bg-[#7C3AED] text-white rounded-xl font-bold text-sm cursor-pointer">
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
