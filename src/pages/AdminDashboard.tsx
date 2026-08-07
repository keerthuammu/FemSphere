import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, Sparkles, Users, UserCheck, Stethoscope, FileText, 
  BookOpen, AlertCircle, LogOut, CheckCircle2, User, 
  Clock, Activity, Search, Bell, Plus, Edit, Trash2, X, Lock, Check, Key, Sliders, ChevronDown, Printer
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Live Time & Date
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  // Counters
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
    <div className="min-h-screen bg-[#FAF7F4] flex font-inter text-[#2E2428]">
      
      {/* SIDEBAR NAVIGATION MENU */}
      <aside className="w-72 bg-[#F4E0D1] border-r border-[#E5CDBC] hidden lg:flex flex-col flex-shrink-0 sticky top-0 h-screen font-inter print:hidden">
        <div className="p-6 border-b border-[#E5CDBC] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <h1 className="font-serif text-3xl font-bold text-[#7C3AED] tracking-tight">FemSphere</h1>
            <Sparkles className="w-5 h-5 text-[#14B8A6]" />
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-hide font-inter">
          <p className="text-xs uppercase tracking-widest text-[#8C756B] font-bold px-3 py-2">Governance</p>
          
          {/* 1. Overview */}
          <button 
            onClick={() => setActiveTab('Overview')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base transition-all ${
              activeTab === 'Overview' ? 'bg-white text-[#7C3AED] shadow-sm border border-[#E5CDBC]' : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'
            }`}
          >
            <Activity className="w-5 h-5 text-[#7C3AED]" /> Overview
          </button>

          {/* 2. Manage Users */}
          <button 
            onClick={() => setActiveTab('Manage Users')} 
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-base transition-all ${
              activeTab === 'Manage Users' ? 'bg-white text-[#7C3AED] shadow-sm border border-[#E5CDBC]' : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-[#7C3AED]" /> Users
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white text-[#7C3AED] border border-[#E5CDBC]">
              {totalUsersCount}
            </span>
          </button>

          {/* 3. Manage Caregivers */}
          <button 
            onClick={() => setActiveTab('Manage Caregivers')} 
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-base transition-all ${
              activeTab === 'Manage Caregivers' ? 'bg-white text-[#7C3AED] shadow-sm border border-[#E5CDBC]' : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-[#14B8A6]" /> Caregivers
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white text-[#7C3AED] border border-[#E5CDBC]">
              {totalCaregiversCount}
            </span>
          </button>

          {/* 4. Manage Doctors & Approvals */}
          <button 
            onClick={() => setActiveTab('Manage Doctors')} 
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-base transition-all ${
              activeTab === 'Manage Doctors' ? 'bg-white text-[#7C3AED] shadow-sm border border-[#E5CDBC]' : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Stethoscope className="w-5 h-5 text-[#F472B6]" /> Doctors & Approvals
            </div>
            {pendingApprovalsCount > 0 && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-white">
                {pendingApprovalsCount}
              </span>
            )}
          </button>

          {/* 5. Health Articles */}
          <button 
            onClick={() => setActiveTab('Health Articles')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base transition-all ${
              activeTab === 'Health Articles' ? 'bg-white text-[#7C3AED] shadow-sm border border-[#E5CDBC]' : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'
            }`}
          >
            <BookOpen className="w-5 h-5 text-[#7C3AED]" /> Health Articles
          </button>

          {/* 6. System Reports */}
          <button 
            onClick={() => setActiveTab('Reports')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base transition-all ${
              activeTab === 'Reports' ? 'bg-white text-[#7C3AED] shadow-sm border border-[#E5CDBC]' : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'
            }`}
          >
            <FileText className="w-5 h-5 text-[#14B8A6]" /> System Reports
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto font-inter">
        
        {/* HEADER BAR */}
        <header className="bg-[#F4E0D1]/90 backdrop-blur-md border-b border-[#E5CDBC] p-5 md:px-8 flex items-center justify-between sticky top-0 z-20 print:hidden font-inter">
          <div>
            <h2 className="font-bold text-[#3a3135] text-xl md:text-2xl">
              Welcome, {adminProfile.name}!
            </h2>
            <p className="text-xs md:text-sm text-[#64595e] flex items-center gap-2 mt-1 font-medium">
              <Clock className="w-4 h-4 text-[#7C3AED]" />
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Quick Action: Add User */}
            <button 
              onClick={() => setShowAddUserModal(true)} 
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#7C3AED] text-white text-sm font-bold shadow-xs hover:bg-[#6D28D9] transition-colors"
            >
              <Plus className="w-4 h-4" /> Add User
            </button>

            {/* Profile Photo Avatar Dropdown Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)} 
                className="p-1 rounded-full border border-[#EDE9FE] bg-[#FAF8FC] hover:bg-white hover:scale-105 transition-all cursor-pointer shadow-xs focus:ring-2 focus:ring-[#7C3AED]"
                title="Profile Menu"
              >
                {/* Profile Avatar Circle */}
                <div className="w-10 h-10 rounded-full bg-[#7C3AED] text-white flex items-center justify-center font-bold text-base shadow-inner relative">
                  {adminProfile.name.charAt(0)}
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                </div>
              </button>

              {/* Popover Menu */}
              {showProfileDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setShowProfileDropdown(false)}
                  ></div>

                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl border border-[#EDE9FE] shadow-xl z-40 py-2 font-inter animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-[#EDE9FE] bg-[#FAF8FC]">
                      <p className="text-sm font-bold text-[#3a3135] truncate">{adminProfile.name}</p>
                      <p className="text-xs text-[#7a6f75] truncate">{adminProfile.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#EDE9FE] text-[#7C3AED]">
                        {adminProfile.securityClearance}
                      </span>
                    </div>

                    <button 
                      onClick={() => {
                        setActiveTab('Profile');
                        setShowProfileDropdown(false);
                      }} 
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-[#3a3135] hover:bg-[#F5F3FF] hover:text-[#7C3AED] transition-colors"
                    >
                      <User className="w-4 h-4 text-[#7C3AED]" /> Admin Profile
                    </button>

                    <button 
                      onClick={() => {
                        setActiveTab('Reports');
                        setShowProfileDropdown(false);
                      }} 
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-[#3a3135] hover:bg-[#F5F3FF] hover:text-[#7C3AED] transition-colors"
                    >
                      <Sliders className="w-4 h-4 text-[#7C3AED]" /> System Governance
                    </button>

                    <div className="my-1 border-t border-[#EDE9FE]"></div>

                    <button 
                      onClick={() => {
                        setShowProfileDropdown(false);
                        handleLogout();
                      }} 
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-red-500" /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* CONTAINER WORKSPACE */}
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8 font-inter">

          {/* 1. TAB: OVERVIEW */}
          {activeTab === 'Overview' && (
            <div className="space-y-8">
              
              {/* TOP 4 SUMMARY STAT CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Card 1: Total Users */}
                <div className="bg-[#7C3AED] text-white p-6 rounded-3xl shadow-md flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute right-3 top-3 opacity-10">
                    <Users className="w-24 h-24" />
                  </div>
                  <div>
                    <span className="text-xs uppercase font-bold tracking-widest text-purple-200 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                      User Accounts
                    </span>
                    <h3 className="text-4xl font-bold mt-3">{totalUsersCount}</h3>
                    <p className="text-sm text-purple-100 mt-1 font-medium">Registered Female Users</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('Manage Users')}
                    className="mt-4 text-sm font-bold text-white hover:underline flex items-center gap-1"
                  >
                    Manage User Directory →
                  </button>
                </div>

                {/* Card 2: Total Caregivers */}
                <div className="bg-white p-6 rounded-3xl border border-[#EDE9FE] shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#7a6f75] uppercase tracking-wider">Caregivers</span>
                    <div className="p-2.5 rounded-2xl bg-[#CCFBF1] text-[#14B8A6]">
                      <Users className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <h3 className="text-4xl font-bold text-[#3a3135]">{totalCaregiversCount}</h3>
                    <p className="text-sm text-[#7a6f75] font-medium mt-1">Care & Proxy Accounts</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('Manage Caregivers')} 
                    className="mt-3 text-sm font-bold text-[#7C3AED] hover:underline flex items-center gap-1"
                  >
                    View Caregivers →
                  </button>
                </div>

                {/* Card 3: Total Doctors */}
                <div className="bg-white p-6 rounded-3xl border border-[#EDE9FE] shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#7a6f75] uppercase tracking-wider">Active Doctors</span>
                    <div className="p-2.5 rounded-2xl bg-[#FCE7F3] text-[#F472B6]">
                      <Stethoscope className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <h3 className="text-4xl font-bold text-[#3a3135]">{totalDoctorsCount}</h3>
                    <p className="text-sm text-[#7C3AED] font-bold mt-1">Verified Medical Specialists</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('Manage Doctors')} 
                    className="mt-3 text-sm font-bold text-[#7C3AED] hover:underline flex items-center gap-1"
                  >
                    Manage Doctors →
                  </button>
                </div>

                {/* Card 4: Pending Doctor Approvals */}
                <div className="bg-white p-6 rounded-3xl border border-[#EDE9FE] shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#7a6f75] uppercase tracking-wider">Pending Approvals</span>
                    <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600">
                      <UserCheck className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <h3 className="text-4xl font-bold text-amber-600">{pendingApprovalsCount}</h3>
                    <p className="text-sm text-amber-700 font-bold mt-1">Licenses Awaiting Verification</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('Manage Doctors')} 
                    className="mt-3 text-sm font-bold text-[#7C3AED] hover:underline flex items-center gap-1"
                  >
                    Review Registrations →
                  </button>
                </div>
              </div>

              {/* RECENT AUDIT LOGS & DOCTOR VERIFICATION PREVIEW */}
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Doctor Registrations Needing Approval */}
                <div className="bg-white rounded-3xl p-6 border border-[#EDE9FE] shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE]">
                    <h3 className="font-bold text-lg text-[#3a3135] flex items-center gap-2">
                      <Stethoscope className="w-5 h-5 text-[#7C3AED]" /> Pending Doctor Licenses
                    </h3>
                    <button onClick={() => setActiveTab('Manage Doctors')} className="text-sm font-bold text-[#7C3AED] hover:underline">View All</button>
                  </div>

                  <div className="space-y-3">
                    {doctors.filter(d => d.status === 'Pending').map((doc) => (
                      <div key={doc.id} className="p-4 rounded-2xl border border-[#EDE9FE] bg-[#FAF8FC] flex items-center justify-between text-sm">
                        <div>
                          <p className="font-bold text-[#3a3135] text-base">{doc.name}</p>
                          <p className="text-[#64595e] mt-0.5 font-medium">{doc.spec} • License: {doc.license}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => approveDoctor(doc.id)} className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl font-bold text-xs">
                            Approve
                          </button>
                          <button onClick={() => rejectDoctor(doc.id)} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-xl font-bold text-xs">
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                    {doctors.filter(d => d.status === 'Pending').length === 0 && (
                      <p className="text-sm text-[#7a6f75] italic p-4 text-center">No pending doctor approvals.</p>
                    )}
                  </div>
                </div>

                {/* System Activity Overview */}
                <div className="bg-white rounded-3xl p-6 border border-[#EDE9FE] shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE]">
                    <h3 className="font-bold text-lg text-[#3a3135] flex items-center gap-2">
                      <Activity className="w-5 h-5 text-[#14B8A6]" /> System Security Log
                    </h3>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">All Systems Operational</span>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="p-3.5 rounded-2xl border border-[#EDE9FE] bg-white flex items-center justify-between">
                      <div>
                        <p className="font-bold text-[#3a3135]">User Account Verification</p>
                        <p className="text-xs text-[#7a6f75]">Elena Rostova authenticated via 2FA</p>
                      </div>
                      <span className="text-xs text-[#7a6f75]">10 mins ago</span>
                    </div>
                    <div className="p-3.5 rounded-2xl border border-[#EDE9FE] bg-white flex items-center justify-between">
                      <div>
                        <p className="font-bold text-[#3a3135]">Doctor Credentials Verified</p>
                        <p className="text-xs text-[#7a6f75]">Dr. Sarah Jenkins license MD-892401 checked</p>
                      </div>
                      <span className="text-xs text-[#7a6f75]">1 hour ago</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* 2. TAB: MANAGE USERS */}
          {activeTab === 'Manage Users' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EDE9FE] pb-4">
                <div>
                  <h3 className="font-bold text-2xl text-[#3a3135]">Manage Registered Users</h3>
                  <p className="text-sm text-[#64595e]">View, update, or restrict female user accounts</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#7a6f75] absolute left-3 top-3" />
                    <input 
                      type="text" 
                      placeholder="Search users..." 
                      value={searchUser}
                      onChange={(e) => setSearchUser(e.target.value)}
                      className="pl-9 pr-4 py-2.5 rounded-xl border border-[#EDE9FE] text-sm focus:ring-2 focus:ring-[#7C3AED] outline-none"
                    />
                  </div>
                  <button 
                    onClick={() => setShowAddUserModal(true)} 
                    className="px-5 py-2.5 bg-[#7C3AED] text-white rounded-xl text-sm font-bold flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add User
                  </button>
                </div>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm font-inter">
                  <thead className="bg-[#FAF8FC] text-[#3a3135] uppercase text-xs font-bold border-b border-[#EDE9FE]">
                    <tr>
                      <th className="p-4">User ID</th>
                      <th className="p-4">Full Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Date Joined</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDE9FE]">
                    {users.filter(u => u.name.toLowerCase().includes(searchUser.toLowerCase()) || u.email.toLowerCase().includes(searchUser.toLowerCase())).map(u => (
                      <tr key={u.id} className="hover:bg-[#FAF8FC] transition-colors">
                        <td className="p-4 font-bold text-[#7C3AED]">{u.id}</td>
                        <td className="p-4 font-bold text-[#3a3135]">{u.name}</td>
                        <td className="p-4 text-[#64595e]">{u.email}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            u.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                          }`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="p-4 text-[#7a6f75]">{u.dateJoined}</td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => toggleUserStatus(u.id)} className="px-3 py-1.5 rounded-lg border border-[#EDE9FE] text-xs font-bold text-[#3a3135] hover:bg-[#F5F3FF]">
                            Toggle Status
                          </button>
                          <button onClick={() => deleteUser(u.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. TAB: MANAGE CAREGIVERS */}
          {activeTab === 'Manage Caregivers' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EDE9FE] pb-4">
                <div>
                  <h3 className="font-bold text-2xl text-[#3a3135]">Manage Caregivers</h3>
                  <p className="text-sm text-[#64595e]">Family members and healthcare proxies managing dependents</p>
                </div>
                <button 
                  onClick={() => setShowAddCaregiverModal(true)} 
                  className="px-5 py-2.5 bg-[#7C3AED] text-white rounded-xl text-sm font-bold flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Caregiver
                </button>
              </div>

              {/* Caregivers Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm font-inter">
                  <thead className="bg-[#FAF8FC] text-[#3a3135] uppercase text-xs font-bold border-b border-[#EDE9FE]">
                    <tr>
                      <th className="p-4">Caregiver ID</th>
                      <th className="p-4">Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Relationship</th>
                      <th className="p-4">Dependents</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDE9FE]">
                    {caregivers.map(c => (
                      <tr key={c.id} className="hover:bg-[#FAF8FC] transition-colors">
                        <td className="p-4 font-bold text-[#14B8A6]">{c.id}</td>
                        <td className="p-4 font-bold text-[#3a3135]">{c.name}</td>
                        <td className="p-4 text-[#64595e]">{c.email}</td>
                        <td className="p-4 text-[#7a6f75]">{c.relation}</td>
                        <td className="p-4 font-bold text-[#7C3AED]">{c.dependentsCount} Dependents</td>
                        <td className="p-4 text-right">
                          <button onClick={() => deleteCaregiver(c.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. TAB: MANAGE DOCTORS */}
          {activeTab === 'Manage Doctors' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
              <div>
                <h3 className="font-bold text-2xl text-[#3a3135]">Manage Doctors & Verification</h3>
                <p className="text-sm text-[#64595e]">Review medical practitioner licenses and set active privileges</p>
              </div>

              {/* Doctors Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm font-inter">
                  <thead className="bg-[#FAF8FC] text-[#3a3135] uppercase text-xs font-bold border-b border-[#EDE9FE]">
                    <tr>
                      <th className="p-4">Doctor ID</th>
                      <th className="p-4">Name</th>
                      <th className="p-4">Specialty</th>
                      <th className="p-4">Medical License</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Verification Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDE9FE]">
                    {doctors.map(d => (
                      <tr key={d.id} className="hover:bg-[#FAF8FC] transition-colors">
                        <td className="p-4 font-bold text-[#F472B6]">{d.id}</td>
                        <td className="p-4 font-bold text-[#3a3135]">{d.name}</td>
                        <td className="p-4 text-[#64595e]">{d.spec}</td>
                        <td className="p-4 font-mono text-xs">{d.license}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            d.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                            d.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                          }`}>
                            {d.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {d.status === 'Pending' ? (
                            <>
                              <button onClick={() => approveDoctor(d.id)} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold text-xs">
                                Approve
                              </button>
                              <button onClick={() => rejectDoctor(d.id)} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg font-bold text-xs">
                                Reject
                              </button>
                            </>
                          ) : (
                            <button onClick={() => suspendDoctor(d.id)} className="px-3 py-1.5 border border-[#EDE9FE] text-red-600 rounded-lg font-bold text-xs hover:bg-red-50">
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

          {/* 5. TAB: HEALTH ARTICLES */}
          {activeTab === 'Health Articles' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-4">
                <div>
                  <h3 className="font-bold text-2xl text-[#3a3135]">Manage Health Content</h3>
                  <p className="text-sm text-[#64595e]">Publish evidence-based health articles for FemSphere users</p>
                </div>
                <button 
                  onClick={() => setShowAddArticleModal(true)} 
                  className="px-5 py-2.5 bg-[#7C3AED] text-white rounded-xl text-sm font-bold flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Article
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {articles.map(art => (
                  <div key={art.id} className="p-5 rounded-3xl border border-[#EDE9FE] bg-[#FAF8FC] space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 text-[#7C3AED] uppercase">
                        {art.category}
                      </span>
                      <h4 className="text-lg font-bold text-[#3a3135]">{art.title}</h4>
                      <p className="text-sm text-[#64595e] leading-relaxed">{art.desc}</p>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-[#EDE9FE]">
                      <span className="text-xs font-bold text-[#7a6f75]">{art.id}</span>
                      <button onClick={() => deleteArticle(art.id)} className="text-xs font-bold text-red-600 hover:underline">
                        Remove Article
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. TAB: REPORTS & GOVERNANCE */}
          {activeTab === 'Reports' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
              <div>
                <h3 className="font-bold text-2xl text-[#3a3135]">System Governance & Audit Reports</h3>
                <p className="text-sm text-[#64595e]">Platform compliance and access logs</p>
              </div>

              <div className="p-6 rounded-3xl border border-[#EDE9FE] bg-[#FAF8FC] space-y-4">
                <h4 className="font-bold text-base text-[#3a3135]">System Status Overview</h4>
                <div className="grid sm:grid-cols-3 gap-4 text-sm font-bold">
                  <div className="p-4 bg-white rounded-2xl border border-[#EDE9FE]">
                    <span className="text-xs text-[#7a6f75] uppercase">Database Connections</span>
                    <p className="text-xl text-emerald-600 mt-1">Healthy (Port 5001)</p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-[#EDE9FE]">
                    <span className="text-xs text-[#7a6f75] uppercase">Security Clearance</span>
                    <p className="text-xl text-[#7C3AED] mt-1">Level 5 Superuser</p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-[#EDE9FE]">
                    <span className="text-xs text-[#7a6f75] uppercase">Audit Trail</span>
                    <p className="text-xl text-[#14B8A6] mt-1">Encrypted Logs</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 7. TAB: ADMIN PROFILE */}
          {activeTab === 'Profile' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6 max-w-3xl mx-auto">
              <div className="border-b border-[#EDE9FE] pb-4">
                <h3 className="font-bold text-2xl text-[#3a3135]">Admin Account Details</h3>
                <p className="text-sm text-[#64595e]">Manage credentials and system access permissions</p>
              </div>

              <div className="space-y-4 text-sm font-inter">
                <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE]">
                  <span className="block font-bold text-[#7a6f75] uppercase text-xs mb-1">Administrator Name</span>
                  <p className="font-bold text-[#3a3135] text-lg">{adminProfile.name}</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE]">
                  <span className="block font-bold text-[#7a6f75] uppercase text-xs mb-1">Email Address</span>
                  <p className="font-bold text-[#3a3135] text-lg">{adminProfile.email}</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE]">
                  <span className="block font-bold text-[#7a6f75] uppercase text-xs mb-1">Security Privilege</span>
                  <p className="font-bold text-[#7C3AED] text-lg">{adminProfile.securityClearance}</p>
                </div>
                <button 
                  onClick={() => setShowPasswordModal(true)} 
                  className="w-full py-3 bg-[#7C3AED] text-white rounded-2xl font-bold text-sm"
                >
                  Change Password
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-[#EDE9FE]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-xl text-[#3a3135]">Add New User</h3>
              <button onClick={() => setShowAddUserModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3a3135] uppercase mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={userForm.name} 
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  placeholder="Enter full name"
                  className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] text-sm" required 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#3a3135] uppercase mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={userForm.email} 
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  placeholder="name@domain.com"
                  className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] text-sm" required 
                />
              </div>
              <button type="submit" className="w-full py-3 bg-[#7C3AED] text-white rounded-xl font-bold text-sm">
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
              <button onClick={() => setShowAddCaregiverModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSaveCaregiver} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3a3135] uppercase mb-1">Caregiver Name</label>
                <input 
                  type="text" 
                  value={caregiverForm.name} 
                  onChange={(e) => setCaregiverForm({ ...caregiverForm, name: e.target.value })}
                  placeholder="Full name"
                  className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] text-sm" required 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#3a3135] uppercase mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={caregiverForm.email} 
                  onChange={(e) => setCaregiverForm({ ...caregiverForm, email: e.target.value })}
                  placeholder="email@care.org"
                  className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] text-sm" required 
                />
              </div>
              <button type="submit" className="w-full py-3 bg-[#7C3AED] text-white rounded-xl font-bold text-sm">
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
              <button onClick={() => setShowAddArticleModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleAddArticle} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3a3135] uppercase mb-1">Article Title</label>
                <input 
                  type="text" 
                  value={newArticle.title} 
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                  placeholder="Title"
                  className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] text-sm" required 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#3a3135] uppercase mb-1">Description</label>
                <textarea 
                  value={newArticle.desc} 
                  onChange={(e) => setNewArticle({ ...newArticle, desc: e.target.value })}
                  placeholder="Short description"
                  className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] text-sm" rows={3}
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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#EDE9FE]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-[#3a3135]">Change Password</h3>
              <button onClick={() => setShowPasswordModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3a3135] uppercase mb-1">Old Password</label>
                <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#3a3135] uppercase mb-1">New Password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] text-sm" />
              </div>
              <button onClick={() => setShowPasswordModal(false)} className="w-full py-3 bg-[#7C3AED] text-white rounded-xl font-bold text-sm">
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
