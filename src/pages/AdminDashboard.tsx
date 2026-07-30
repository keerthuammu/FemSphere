import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, Sparkles, Users, UserCheck, Stethoscope, FileText, 
  BarChart2, BookOpen, AlertCircle, LogOut, CheckCircle2, User, 
  Clock, Activity, Search, Bell, Plus, Edit, Trash2, X, Lock, Check, Key
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');

  // Admin Profile State
  const [adminProfile, setAdminProfile] = useState({
    name: 'Superuser Admin',
    email: 'admin@femsphere.health',
    role: 'System Administrator',
    securityClearance: 'Level 5 (Full Access)',
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // 1. Users State & CRUD
  const [users, setUsers] = useState([
    { id: 'USR-101', name: 'Elena Rostova', email: 'elena.rostova@femsphere.health', status: 'Active', role: 'User (Female)', dateJoined: '2026-01-12' },
    { id: 'USR-102', name: 'Amara Chen', email: 'amara.chen@gmail.com', status: 'Active', role: 'User (Female)', dateJoined: '2026-02-05' },
    { id: 'USR-103', name: 'Sofia Davis', email: 'sofia.d@health.org', status: 'Inactive', role: 'User (Female)', dateJoined: '2026-03-14' },
  ]);
  const [searchUser, setSearchUser] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'User (Female)', status: 'Active' });

  // 2. Caregivers State & CRUD
  const [caregivers, setCaregivers] = useState([
    { id: 'CG-201', name: 'Marcus Vance', email: 'marcus.v@caregiver.org', relation: 'Parent', dependentsCount: 2, phone: '+1 (555) 382-9011' },
    { id: 'CG-202', name: 'Rachel Green', email: 'rachel@care.org', relation: 'Nurse', dependentsCount: 4, phone: '+1 (555) 902-8822' },
  ]);
  const [searchCaregiver, setSearchCaregiver] = useState('');
  const [showAddCaregiverModal, setShowAddCaregiverModal] = useState(false);
  const [editingCaregiver, setEditingCaregiver] = useState<any>(null);
  const [caregiverForm, setCaregiverForm] = useState({ name: '', email: '', relation: 'Parent', dependentsCount: 1, phone: '' });

  // 3. Doctors State & CRUD
  const [doctors, setDoctors] = useState([
    { id: 'DOC-301', name: 'Dr. Sarah Jenkins', email: 'dr.jenkins@femsphere.health', spec: 'Obstetrics & Gynecology', license: 'MD-892401', status: 'Active' },
    { id: 'DOC-302', name: 'Dr. Priya Sharma', email: 'priya.sharma@health.org', spec: 'Maternal-Fetal Medicine', license: 'MD-778210', status: 'Pending' },
    { id: 'DOC-303', name: 'Dr. Anita Roy', email: 'anita.roy@hospital.com', spec: 'Reproductive Endocrinology', license: 'MD-991204', status: 'Pending' },
  ]);
  const [searchDoctor, setSearchDoctor] = useState('');

  // 4. Health Articles State & CRUD
  const [articles, setArticles] = useState([
    { id: 'ART-01', title: 'Understanding Your Digital Health Twin', category: 'Wellness', desc: 'A guide to longitudinal data modeling for women health.', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400' },
    { id: 'ART-02', title: 'PCOS Prevention & Early Detection', category: 'Medical', desc: 'Clinical insights on hormonal balance and nutrition.', image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400' },
  ]);
  const [showAddArticleModal, setShowAddArticleModal] = useState(false);
  const [newArticle, setNewArticle] = useState({ title: '', category: 'Wellness', desc: '', image: '' });

  // Dashboard Overview Counters
  const totalUsersCount = users.length;
  const totalCaregiversCount = caregivers.length;
  const totalDoctorsCount = doctors.filter(d => d.status === 'Active').length;
  const pendingApprovalsCount = doctors.filter(d => d.status === 'Pending').length;

  const handleLogout = () => {
    navigate('/login');
  };

  // User Actions
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.name || !userForm.email) return;
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...userForm } : u));
      setEditingUser(null);
    } else {
      setUsers([...users, { ...userForm, id: `USR-${100 + users.length + 1}`, dateJoined: '2026-07-30' }]);
      setShowAddUserModal(false);
    }
    setUserForm({ name: '', email: '', role: 'User (Female)', status: 'Active' });
  };

  const toggleUserStatus = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
  };
  const deleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  // Caregiver Actions
  const handleSaveCaregiver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caregiverForm.name || !caregiverForm.email) return;
    if (editingCaregiver) {
      setCaregivers(caregivers.map(c => c.id === editingCaregiver.id ? { ...c, ...caregiverForm } : c));
      setEditingCaregiver(null);
    } else {
      setCaregivers([...caregivers, { ...caregiverForm, id: `CG-${200 + caregivers.length + 1}` }]);
      setShowAddCaregiverModal(false);
    }
    setCaregiverForm({ name: '', email: '', relation: 'Parent', dependentsCount: 1, phone: '' });
  };

  const deleteCaregiver = (id: string) => {
    setCaregivers(caregivers.filter(c => c.id !== id));
  };

  // Doctor Actions
  const approveDoctor = (id: string) => {
    setDoctors(doctors.map(d => d.id === id ? { ...d, status: 'Active' } : d));
  };
  const rejectDoctor = (id: string) => {
    setDoctors(doctors.filter(d => d.id !== id));
  };
  const suspendDoctor = (id: string) => {
    setDoctors(doctors.map(d => d.id === id ? { ...d, status: 'Suspended' } : d));
  };

  // Article Actions
  const handleAddArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticle.title) return;
    setArticles([...articles, { ...newArticle, id: `ART-0${articles.length + 1}` }]);
    setNewArticle({ title: '', category: 'Wellness', desc: '', image: '' });
    setShowAddArticleModal(false);
  };
  const deleteArticle = (id: string) => {
    setArticles(articles.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#f8f6fc] flex font-sans text-[#3a3135]">
      
      {/* Administrator Sidebar */}
      <aside className="w-68 bg-[#1E1535] text-white hidden lg:flex flex-col flex-shrink-0 sticky top-0 h-screen">
        <div className="p-6 border-b border-purple-900/50 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-white tracking-tight">FemSphere</h1>
            <Sparkles className="w-4 h-4 text-[#14B8A6]" />
          </Link>
          <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#7C3AED] text-white tracking-wider uppercase">
            ADMIN
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-hide">
          <p className="text-[10px] uppercase tracking-widest text-purple-300/60 font-bold px-3 py-2 mt-2">Dashboard</p>
          
          <button 
            onClick={() => setActiveTab('Overview')} 
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              activeTab === 'Overview' ? 'bg-[#7C3AED] text-white shadow-md' : 'text-purple-200 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4 text-teal-300" /> Dashboard Overview
          </button>

          <p className="text-[10px] uppercase tracking-widest text-purple-300/60 font-bold px-3 py-2 mt-4">Management</p>

          <button 
            onClick={() => setActiveTab('Manage Users')} 
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'Manage Users' ? 'bg-[#7C3AED] text-white shadow-md' : 'text-purple-200 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 text-purple-300" /> Manage Users
          </button>

          <button 
            onClick={() => setActiveTab('Manage Caregivers')} 
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'Manage Caregivers' ? 'bg-[#7C3AED] text-white shadow-md' : 'text-purple-200 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 text-teal-300" /> Manage Caregivers
          </button>

          <button 
            onClick={() => setActiveTab('Manage Doctors')} 
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'Manage Doctors' ? 'bg-[#7C3AED] text-white shadow-md' : 'text-purple-200 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Stethoscope className="w-4 h-4 text-purple-300" /> Manage Doctors
          </button>

          <button 
            onClick={() => setActiveTab('Approve Doctor Registrations')} 
            className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'Approve Doctor Registrations' ? 'bg-[#7C3AED] text-white shadow-md' : 'text-purple-200 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-3"><UserCheck className="w-4 h-4 text-amber-300" /> Approve Doctors</span>
            {pendingApprovalsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-bold">
                {pendingApprovalsCount}
              </span>
            )}
          </button>

          <p className="text-[10px] uppercase tracking-widest text-purple-300/60 font-bold px-3 py-2 mt-4">Content & System</p>

          <button 
            onClick={() => setActiveTab('Health Articles')} 
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'Health Articles' ? 'bg-[#7C3AED] text-white shadow-md' : 'text-purple-200 hover:bg-white/10 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 text-purple-300" /> Health Articles
          </button>

          <button 
            onClick={() => setActiveTab('Reports')} 
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'Reports' ? 'bg-[#7C3AED] text-white shadow-md' : 'text-purple-200 hover:bg-white/10 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 text-purple-300" /> System Reports
          </button>

          <button 
            onClick={() => setActiveTab('Profile')} 
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'Profile' ? 'bg-[#7C3AED] text-white shadow-md' : 'text-purple-200 hover:bg-white/10 hover:text-white'
            }`}
          >
            <User className="w-4 h-4 text-purple-300" /> Admin Profile
          </button>
        </div>

        <div className="p-4 border-t border-purple-900/50">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-purple-200 hover:text-white text-xs font-bold transition-all">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* Top Header */}
        <header className="bg-white border-b border-[#EDE9FE] px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] flex items-center justify-center border border-[#EDE9FE]">
              <Shield className="w-5 h-5 text-[#7C3AED]" />
            </div>
            <div>
              <h2 className="font-bold text-[#3a3135] text-lg">Administrator Control Center</h2>
              <p className="text-xs text-[#7a6f75]">FemSphere System Governance & Security Clearance</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={handleLogout} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold transition-colors">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">

          {/* 4 Administrator Dashboard Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            <div className="bg-white p-6 rounded-3xl border border-[#EDE9FE] shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#7a6f75] uppercase tracking-wider">Total Users</span>
                <div className="w-10 h-10 rounded-2xl bg-[#F5F3FF] flex items-center justify-center text-[#7C3AED]">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-[#3a3135] font-serif">{totalUsersCount}</h3>
              <p className="text-xs text-emerald-600 font-semibold mt-2">Active accounts registered</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#EDE9FE] shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#7a6f75] uppercase tracking-wider">Total Caregivers</span>
                <div className="w-10 h-10 rounded-2xl bg-[#CCFBF1] flex items-center justify-center text-[#14B8A6]">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-[#3a3135] font-serif">{totalCaregiversCount}</h3>
              <p className="text-xs text-teal-600 font-semibold mt-2">Family & professional caretakers</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#EDE9FE] shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#7a6f75] uppercase tracking-wider">Total Doctors</span>
                <div className="w-10 h-10 rounded-2xl bg-[#FCE7F3] flex items-center justify-center text-[#F472B6]">
                  <Stethoscope className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-[#3a3135] font-serif">{totalDoctorsCount}</h3>
              <p className="text-xs text-pink-600 font-semibold mt-2">Verified medical practitioners</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#EDE9FE] shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#7a6f75] uppercase tracking-wider">Pending Doctor Approvals</span>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-[#3a3135] font-serif">{pendingApprovalsCount}</h3>
              <p className="text-xs text-amber-600 font-semibold mt-2">Requires medical license review</p>
            </div>

          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'Overview' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm">
                <h3 className="font-serif text-2xl text-[#3a3135] mb-2">Platform Administration Quick Actions</h3>
                <p className="text-xs text-[#7a6f75] mb-6">Manage system access, doctor approvals, and health articles across FemSphere.</p>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <button onClick={() => setActiveTab('Manage Users')} className="p-4 rounded-2xl border border-[#EDE9FE] hover:bg-[#F5F3FF] text-left transition-colors">
                    <Users className="w-6 h-6 text-[#7C3AED] mb-2" />
                    <h4 className="font-bold text-sm text-[#3a3135]">Manage Users</h4>
                    <p className="text-xs text-[#7a6f75] mt-1">Search, activate, deactivate or edit user profiles.</p>
                  </button>

                  <button onClick={() => setActiveTab('Approve Doctor Registrations')} className="p-4 rounded-2xl border border-[#EDE9FE] hover:bg-[#F5F3FF] text-left transition-colors">
                    <UserCheck className="w-6 h-6 text-amber-500 mb-2" />
                    <h4 className="font-bold text-sm text-[#3a3135]">Approve Doctors</h4>
                    <p className="text-xs text-[#7a6f75] mt-1">{pendingApprovalsCount} doctor registration requests pending.</p>
                  </button>

                  <button onClick={() => setActiveTab('Health Articles')} className="p-4 rounded-2xl border border-[#EDE9FE] hover:bg-[#F5F3FF] text-left transition-colors">
                    <BookOpen className="w-6 h-6 text-[#14B8A6] mb-2" />
                    <h4 className="font-bold text-sm text-[#3a3135]">Manage Health Articles</h4>
                    <p className="text-xs text-[#7a6f75] mt-1">Publish and edit medical guidance articles.</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MANAGE USERS */}
          {activeTab === 'Manage Users' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-2xl text-[#3a3135]">User Directory</h3>
                  <p className="text-xs text-[#7a6f75] mt-1">View, search, edit, activate/deactivate, or delete platform users.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a89cb5]" />
                    <input 
                      type="text" 
                      value={searchUser} 
                      onChange={(e) => setSearchUser(e.target.value)}
                      placeholder="Search users..." 
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#EDE9FE] bg-[#fbf9f6] text-xs outline-none focus:border-[#7C3AED]" 
                    />
                  </div>
                  <button 
                    onClick={() => {
                      setUserForm({ name: '', email: '', role: 'User (Female)', status: 'Active' });
                      setShowAddUserModal(true);
                    }} 
                    className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#7C3AED] text-white text-xs font-bold hover:bg-[#6D28D9]"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add User
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#EDE9FE] text-[#7a6f75] uppercase font-bold">
                      <th className="py-3 px-4">User ID</th>
                      <th className="py-3 px-4">Name & Email</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDE9FE]">
                    {users.filter(u => u.name.toLowerCase().includes(searchUser.toLowerCase()) || u.email.toLowerCase().includes(searchUser.toLowerCase())).map(u => (
                      <tr key={u.id} className="hover:bg-[#F5F3FF]/40">
                        <td className="py-4 px-4 font-mono font-bold text-[#7C3AED]">{u.id}</td>
                        <td className="py-4 px-4">
                          <p className="font-bold text-[#3a3135]">{u.name}</p>
                          <p className="text-[11px] text-[#7a6f75]">{u.email}</p>
                        </td>
                        <td className="py-4 px-4 font-medium">{u.role}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            u.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right space-x-2">
                          <button 
                            onClick={() => {
                              setEditingUser(u);
                              setUserForm({ name: u.name, email: u.email, role: u.role, status: u.status });
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#EDE9FE] text-[#7C3AED] font-bold text-[11px] hover:bg-[#7C3AED] hover:text-white transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5 inline" /> Edit
                          </button>
                          <button 
                            onClick={() => toggleUserStatus(u.id)}
                            className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-[#3a3135] font-bold text-[11px]"
                          >
                            {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </button>
                          <button 
                            onClick={() => deleteUser(u.id)}
                            className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-bold text-[11px]"
                          >
                            <Trash2 className="w-3.5 h-3.5 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: MANAGE CAREGIVERS */}
          {activeTab === 'Manage Caregivers' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-2xl text-[#3a3135]">Caregiver Directory</h3>
                  <p className="text-xs text-[#7a6f75] mt-1">Manage caregiver profiles, linked dependents, and contact records.</p>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a89cb5]" />
                  <input 
                    type="text" 
                    value={searchCaregiver} 
                    onChange={(e) => setSearchCaregiver(e.target.value)}
                    placeholder="Search caregivers..." 
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#EDE9FE] bg-[#fbf9f6] text-xs outline-none focus:border-[#7C3AED]" 
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#EDE9FE] text-[#7a6f75] uppercase font-bold">
                      <th className="py-3 px-4">Caregiver ID</th>
                      <th className="py-3 px-4">Name & Email</th>
                      <th className="py-3 px-4">Relationship</th>
                      <th className="py-3 px-4">Dependents Linked</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDE9FE]">
                    {caregivers.filter(c => c.name.toLowerCase().includes(searchCaregiver.toLowerCase())).map(c => (
                      <tr key={c.id} className="hover:bg-[#F5F3FF]/40">
                        <td className="py-4 px-4 font-mono font-bold text-[#14B8A6]">{c.id}</td>
                        <td className="py-4 px-4">
                          <p className="font-bold text-[#3a3135]">{c.name}</p>
                          <p className="text-[11px] text-[#7a6f75]">{c.email}</p>
                        </td>
                        <td className="py-4 px-4 font-medium">{c.relation}</td>
                        <td className="py-4 px-4 font-bold">{c.dependentsCount} Dependents</td>
                        <td className="py-4 px-4 text-right space-x-2">
                          <button onClick={() => deleteCaregiver(c.id)} className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-bold text-[11px]">
                            <Trash2 className="w-3.5 h-3.5 inline" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: MANAGE DOCTORS & APPROVALS */}
          {(activeTab === 'Manage Doctors' || activeTab === 'Approve Doctor Registrations') && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-2xl text-[#3a3135]">Doctor Verification & Practice Directory</h3>
                  <p className="text-xs text-[#7a6f75] mt-1">Approve pending registrations, suspend or manage medical licenses.</p>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a89cb5]" />
                  <input 
                    type="text" 
                    value={searchDoctor} 
                    onChange={(e) => setSearchDoctor(e.target.value)}
                    placeholder="Search doctors..." 
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#EDE9FE] bg-[#fbf9f6] text-xs outline-none focus:border-[#7C3AED]" 
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#EDE9FE] text-[#7a6f75] uppercase font-bold">
                      <th className="py-3 px-4">Doctor Name</th>
                      <th className="py-3 px-4">Specialization</th>
                      <th className="py-3 px-4">License No.</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDE9FE]">
                    {doctors.filter(d => d.name.toLowerCase().includes(searchDoctor.toLowerCase()) || d.spec.toLowerCase().includes(searchDoctor.toLowerCase())).map(d => (
                      <tr key={d.id} className="hover:bg-[#F5F3FF]/40">
                        <td className="py-4 px-4 font-bold text-[#3a3135]">{d.name}</td>
                        <td className="py-4 px-4 text-[#7C3AED] font-medium">{d.spec}</td>
                        <td className="py-4 px-4 font-mono">{d.license}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            d.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : d.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {d.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right space-x-2">
                          {d.status === 'Pending' ? (
                            <>
                              <button onClick={() => approveDoctor(d.id)} className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700">
                                Approve
                              </button>
                              <button onClick={() => rejectDoctor(d.id)} className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 font-bold text-[11px] hover:bg-gray-200">
                                Reject
                              </button>
                            </>
                          ) : (
                            <button onClick={() => suspendDoctor(d.id)} className="px-3 py-1 rounded-lg bg-red-50 text-red-600 font-bold text-[11px] hover:bg-red-100">
                              Suspend
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: HEALTH ARTICLES */}
          {activeTab === 'Health Articles' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-2xl text-[#3a3135]">Manage Health Articles</h3>
                  <p className="text-xs text-[#7a6f75] mt-1">Add, edit, or publish medical and wellness guidance articles.</p>
                </div>
                <button 
                  onClick={() => setShowAddArticleModal(true)} 
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7C3AED] text-white text-xs font-bold hover:bg-[#6D28D9] transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Article
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {articles.map(art => (
                  <div key={art.id} className="p-4 rounded-2xl border border-[#EDE9FE] bg-[#faf9fc] flex gap-4">
                    <img src={art.image} alt={art.title} className="w-24 h-24 rounded-xl object-cover" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C3AED] bg-[#EDE9FE] px-2 py-0.5 rounded-md">
                          {art.category}
                        </span>
                        <h4 className="font-bold text-sm text-[#3a3135] mt-1">{art.title}</h4>
                        <p className="text-xs text-[#7a6f75] line-clamp-2 mt-1">{art.desc}</p>
                      </div>
                      <div className="flex justify-end gap-2 mt-2">
                        <button onClick={() => deleteArticle(art.id)} className="text-red-500 hover:text-red-700 text-xs font-bold">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SYSTEM REPORTS */}
          {activeTab === 'Reports' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
              <h3 className="font-serif text-2xl text-[#3a3135]">System Intelligence Reports</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl border border-[#EDE9FE] bg-[#faf9fc]">
                  <p className="text-xs font-bold text-[#7a6f75] uppercase">Total Registered Users</p>
                  <p className="text-2xl font-bold text-[#3a3135] mt-1">{totalUsersCount}</p>
                </div>
                <div className="p-4 rounded-2xl border border-[#EDE9FE] bg-[#faf9fc]">
                  <p className="text-xs font-bold text-[#7a6f75] uppercase">Doctor Approvals</p>
                  <p className="text-2xl font-bold text-teal-600 mt-1">{totalDoctorsCount}</p>
                </div>
                <div className="p-4 rounded-2xl border border-[#EDE9FE] bg-[#faf9fc]">
                  <p className="text-xs font-bold text-[#7a6f75] uppercase">Active Users</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">98.4%</p>
                </div>
                <div className="p-4 rounded-2xl border border-[#EDE9FE] bg-[#faf9fc]">
                  <p className="text-xs font-bold text-[#7a6f75] uppercase">Generated Reports</p>
                  <p className="text-2xl font-bold text-[#7C3AED] mt-1">4,120</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: PROFILE */}
          {activeTab === 'Profile' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6 max-w-xl mx-auto">
              <h3 className="font-serif text-2xl text-[#3a3135]">Admin Profile Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1">Name</label>
                  <input 
                    type="text" 
                    value={adminProfile.name} 
                    onChange={(e) => setAdminProfile({ ...adminProfile, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] text-sm outline-none focus:border-[#7C3AED]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1">Email</label>
                  <input 
                    type="email" 
                    value={adminProfile.email} 
                    onChange={(e) => setAdminProfile({ ...adminProfile, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] text-sm outline-none focus:border-[#7C3AED]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1">Security Clearance</label>
                  <input 
                    type="text" 
                    readOnly
                    value={adminProfile.securityClearance} 
                    className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] bg-[#F5F3FF] text-[#7C3AED] text-sm font-bold"
                  />
                </div>

                <div className="pt-4 border-t border-[#EDE9FE] flex gap-3">
                  <button 
                    onClick={() => setShowPasswordModal(true)} 
                    className="px-4 py-2.5 rounded-xl border border-[#EDE9FE] hover:bg-[#F5F3FF] text-xs font-bold text-[#7C3AED]"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

        {/* Add / Edit User Modal */}
      {(showAddUserModal || editingUser) && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#EDE9FE]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-[#3a3135]">
                {editingUser ? 'Edit User Details' : 'Add New User'}
              </h3>
              <button onClick={() => { setShowAddUserModal(false); setEditingUser(null); }}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSaveUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#4a4145] uppercase mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={userForm.name} 
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  placeholder="Elena Rostova"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EDE9FE] text-sm" 
                  required 
                />
              </div>
              <div>
                <label className="block font-bold text-[#4a4145] uppercase mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={userForm.email} 
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  placeholder="user@femsphere.health"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EDE9FE] text-sm" 
                  required 
                />
              </div>
              <div>
                <label className="block font-bold text-[#4a4145] uppercase mb-1">Role</label>
                <select 
                  value={userForm.role} 
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EDE9FE] text-sm bg-white font-medium"
                >
                  <option value="User (Female)">User (Female)</option>
                  <option value="Caregiver">Caregiver</option>
                  <option value="Doctor">Doctor</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-[#4a4145] uppercase mb-1">Status</label>
                <select 
                  value={userForm.status} 
                  onChange={(e) => setUserForm({ ...userForm, status: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EDE9FE] text-sm bg-white font-medium"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <button type="submit" className="w-full py-3 bg-[#7C3AED] text-white rounded-xl font-bold text-sm">
                {editingUser ? 'Save User Changes' : 'Create User Account'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Article Modal */}
      {showAddArticleModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-[#EDE9FE]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-[#3a3135]">Add New Health Article</h3>
              <button onClick={() => setShowAddArticleModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleAddArticle} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4a4145] uppercase mb-1">Title</label>
                <input 
                  type="text" 
                  value={newArticle.title} 
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EDE9FE] text-sm" 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#4a4145] uppercase mb-1">Category</label>
                <select 
                  value={newArticle.category} 
                  onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EDE9FE] text-sm bg-white"
                >
                  <option value="Wellness">Wellness</option>
                  <option value="Medical">Medical</option>
                  <option value="Nutrition">Nutrition</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#4a4145] uppercase mb-1">Description</label>
                <textarea 
                  value={newArticle.desc} 
                  onChange={(e) => setNewArticle({ ...newArticle, desc: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EDE9FE] text-sm" rows={3}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#4a4145] uppercase mb-1">Image URL</label>
                <input 
                  type="url" 
                  value={newArticle.image} 
                  onChange={(e) => setNewArticle({ ...newArticle, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EDE9FE] text-sm" 
                />
              </div>
              <button type="submit" className="w-full py-3 bg-[#7C3AED] text-white rounded-xl font-bold text-sm">
                Publish Article
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#EDE9FE]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-[#3a3135]">Change Admin Password</h3>
              <button onClick={() => setShowPasswordModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4a4145] uppercase mb-1">Old Password</label>
                <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-[#EDE9FE] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#4a4145] uppercase mb-1">New Password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-[#EDE9FE] text-sm" />
              </div>
              <button onClick={() => setShowPasswordModal(false)} className="w-full py-2.5 bg-[#7C3AED] text-white rounded-xl font-bold text-xs">
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
