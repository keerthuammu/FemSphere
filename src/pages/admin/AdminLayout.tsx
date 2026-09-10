import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { 
  Shield, Sparkles, Users, UserCheck, Stethoscope, FileText, 
  BookOpen, LogOut, CheckCircle2, User, Clock, Activity, 
  Plus, X, Lock, Sliders, ChevronDown, LayoutDashboard
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
    // Add Health Article Modal
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
    <div className="min-h-screen bg-[#FAF7F4] flex font-sans text-[#2E2428]">
      {/* --- SIDEBAR --- Identical to DoctorLayout */}
      <aside className="w-64 bg-[#F2EBE5] border-r border-[#E5CDBC] p-6 flex flex-col justify-between hidden md:flex shrink-0 print:hidden">
        <div className="space-y-8">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#7C3AED] text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-[#2E2428] block leading-none">FemSphere</span>
              <span className="text-[10px] uppercase font-bold text-[#7C3AED] tracking-widest block mt-0.5">Admin Portal</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {/* 1. Dashboard */}
            <NavLink 
              to="/admin" 
              end
              className={({ isActive }) => `w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all ${
                isActive ? 'bg-white text-[#7C3AED] shadow-xs border border-[#E5CDBC]' : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span className="truncate">Dashboard</span>
            </NavLink>

            {/* 2. Manage Users */}
            <NavLink 
              to="/admin/users" 
              className={({ isActive }) => `w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all ${
                isActive ? 'bg-white text-[#7C3AED] shadow-xs border border-[#E5CDBC]' : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Users className="w-4 h-4 shrink-0" />
                <span className="truncate">Users</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#7C3AED] border border-[#E5CDBC]">
                {stats.totalUsers}
              </span>
            </NavLink>

            {/* 3. Manage Caregivers */}
            <NavLink 
              to="/admin/caregivers" 
              className={({ isActive }) => `w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all ${
                isActive ? 'bg-white text-[#7C3AED] shadow-xs border border-[#E5CDBC]' : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Users className="w-4 h-4 shrink-0" />
                <span className="truncate">Caregivers</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#7C3AED] border border-[#E5CDBC]">
                {stats.totalCaregivers}
              </span>
            </NavLink>

            {/* 4. Manage Doctors & Approvals */}
            <NavLink 
              to="/admin/doctors" 
              className={({ isActive }) => `w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all ${
                isActive ? 'bg-white text-[#7C3AED] shadow-xs border border-[#E5CDBC]' : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Stethoscope className="w-4 h-4 shrink-0" />
                <span className="truncate">Doctors & Approvals</span>
              </div>
              {stats.pendingDoctorApprovals > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500 text-white">
                  {stats.pendingDoctorApprovals}
                </span>
              )}
            </NavLink>

            {/* 5. Health Articles */}
            <NavLink 
              to="/admin/articles" 
              className={({ isActive }) => `w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all ${
                isActive ? 'bg-white text-[#7C3AED] shadow-xs border border-[#E5CDBC]' : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span className="truncate">Health Articles</span>
            </NavLink>
          </nav>
        </div>

        {/* Admin Identity & Logout Footer */}
        <div className="pt-6 border-t border-[#E5CDBC] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center font-bold text-sm shrink-0">
              {adminProfile.name ? adminProfile.name.charAt(0) : 'A'}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-bold text-xs text-[#2E2428] truncate">{adminProfile.name}</h4>
              <p className="text-[10px] text-[#7A6A72] truncate">{adminProfile.securityClearance || 'Superuser'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/admin/profile"
              className="flex-1 flex items-center justify-center py-2 px-3 bg-white/60 hover:bg-white border border-[#E5CDBC] rounded-xl text-xs font-bold text-[#4A3B42] hover:text-[#2E2428] transition-all cursor-pointer shadow-2xs"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-white/60 hover:bg-white border border-[#E5CDBC] rounded-xl text-xs font-bold text-rose-700 transition-all cursor-pointer shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5" /> Log Out
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-[#E5CDBC] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 shadow-2xs">
              <Shield className="w-3.5 h-3.5 text-emerald-600" /> Superuser Active
            </span>
            <span className="text-xs text-[#7A6A72] hidden sm:inline">•</span>
            <span className="text-xs text-[#7A6A72] font-semibold hidden sm:inline">
              Welcome back, <strong className="text-[#2E2428]">{adminProfile.name}</strong>
            </span>
          </div>

          {/* Quick Actions & Live Time */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 bg-[#FAF7F4] px-3.5 py-1.5 rounded-xl border border-[#E5CDBC] text-xs font-mono font-bold text-[#7A6A72]">
              <Clock className="w-3.5 h-3.5 text-[#7C3AED]" />
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <button
              onClick={() => setShowAddArticleModal(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold border border-[#E5CDBC] bg-white text-[#4A3B42] hover:bg-white/80 flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#7C3AED]" />
              Publish Article
            </button>
          </div>
        </header>

        {/* Mobile Navigation Strip */}
        <div className="md:hidden flex overflow-x-auto gap-2 p-3 bg-[#F2EBE5] border-b border-[#E5CDBC]">
          {[
            { label: 'Dashboard', to: '/admin', end: true },
            { label: 'Users', to: '/admin/users' },
            { label: 'Caregivers', to: '/admin/caregivers' },
            { label: 'Doctors', to: '/admin/doctors' },
            { label: 'Articles', to: '/admin/articles' },
            { label: 'Profile', to: '/admin/profile' }
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white text-[#7C3AED] shadow-xs border border-[#E5CDBC]'
                    : 'text-[#4A3B42] hover:bg-white/40'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* CONTAINER WORKSPACE FOR SUB-ROUTES */}
        <main className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
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
                  <option value="User (Female)">User (Female)</option>
                  <option value="User (Male)">User (Male)</option>
                  <option value="Myself">Myself (User)</option>
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
