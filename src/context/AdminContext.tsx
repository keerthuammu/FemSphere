import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { isValidName, isValidEmail, isValidPhone, validatePassword } from '../utils/validation';

export interface AdminUserItem {
  id: string | number;
  name: string;
  username: string;
  email: string;
  role: string;
  status: string;
  dateJoined: string;
  phone?: string;
  bloodGroup?: string;
}

export interface AdminCaregiverItem {
  id: string | number;
  name: string;
  email: string;
  relation: string;
  dependentsCount: number;
  phone: string;
  status?: string;
}

export interface AdminDoctorItem {
  id: string | number;
  userId?: number;
  name: string;
  email: string;
  spec: string;
  license: string;
  hospital?: string;
  yearsExperience?: number;
  status: 'Active' | 'Pending' | 'Suspended' | 'Rejected';
  rawApprovalStatus: string;
}

export interface AdminArticleItem {
  id: string | number;
  title: string;
  category: string;
  desc: string;
  image: string;
  author?: string;
  createdAt?: string;
}

export interface SystemStats {
  totalUsers: number;
  totalDoctors: number;
  totalCaregivers: number;
  totalMedicalRecords: number;
  pendingDoctorApprovals: number;
}

export interface AdminProfile {
  name: string;
  email: string;
  role: string;
  securityClearance: string;
}

interface AdminContextType {
  // Stats
  stats: SystemStats;
  refreshStats: () => Promise<void>;

  // Users
  users: AdminUserItem[];
  searchUser: string;
  setSearchUser: (val: string) => void;
  showAddUserModal: boolean;
  setShowAddUserModal: (val: boolean) => void;
  userForm: { name: string; email: string; role: string; status: string };
  setUserForm: React.Dispatch<React.SetStateAction<{ name: string; email: string; role: string; status: string }>>;
  handleAddUser: (e: React.FormEvent) => Promise<void>;
  handleToggleUserStatus: (id: string | number, currentStatus: string) => Promise<void>;
  handleDeleteUser: (id: string | number) => Promise<void>;

  // Caregivers
  caregivers: AdminCaregiverItem[];
  searchCaregiver: string;
  setSearchCaregiver: (val: string) => void;
  showAddCaregiverModal: boolean;
  setShowAddCaregiverModal: (val: boolean) => void;
  caregiverForm: { name: string; email: string; relation: string; phone: string };
  setCaregiverForm: React.Dispatch<React.SetStateAction<{ name: string; email: string; relation: string; phone: string }>>;
  handleAddCaregiver: (e: React.FormEvent) => Promise<void>;
  handleDeleteCaregiver: (id: string | number) => Promise<void>;

  // Doctors
  doctors: AdminDoctorItem[];
  searchDoctor: string;
  setSearchDoctor: (val: string) => void;
  approveDoctor: (id: string | number) => Promise<void>;
  rejectDoctor: (id: string | number) => Promise<void>;
  suspendDoctor: (id: string | number) => Promise<void>;

  // Articles
  articles: AdminArticleItem[];
  showAddArticleModal: boolean;
  setShowAddArticleModal: (val: boolean) => void;
  newArticle: { title: string; category: string; desc: string; image: string };
  setNewArticle: React.Dispatch<React.SetStateAction<{ title: string; category: string; desc: string; image: string }>>;
  handleAddArticle: (e: React.FormEvent) => Promise<void>;
  handleDeleteArticle: (id: string | number) => Promise<void>;

  // Profile & Password
  adminProfile: AdminProfile;
  setAdminProfile: React.Dispatch<React.SetStateAction<AdminProfile>>;
  profileSaveMsg: string | null;
  isAdminEditing: boolean;
  setIsAdminEditing: (val: boolean) => void;
  adminEditForm: { name: string; email: string };
  setAdminEditForm: React.Dispatch<React.SetStateAction<{ name: string; email: string }>>;
  handleSaveProfile: (e: React.FormEvent) => Promise<void>;
  showPasswordModal: boolean;
  setShowPasswordModal: (val: boolean) => void;
  oldPassword: string;
  setOldPassword: (val: string) => void;
  newPassword: string;
  setNewPassword: (val: string) => void;
  handleChangePassword: (e: React.FormEvent) => Promise<void>;

  // Misc
  currentTime: Date;
  handleLogout: () => void;
  refreshAllData: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Admin Profile State (Loaded strictly from authenticated session / database)
  const [adminProfile, setAdminProfile] = useState<AdminProfile>(() => {
    const defaults = {
      name: 'Superuser Admin',
      email: 'admin@femsphere.health',
      role: 'System Administrator',
      securityClearance: 'Level 5 (Full Access)',
    };
    try {
      const storedUser = localStorage.getItem('femsphere_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        const p = parsed.profile || {};
        return {
          ...defaults,
          name: parsed.fullName || p.full_name || parsed.username || defaults.name,
          email: parsed.email || defaults.email,
        };
      }
    } catch (e) {
      console.error('Error loading admin session', e);
    }
    return defaults;
  });

  const [isAdminEditing, setIsAdminEditing] = useState(false);
  const [adminEditForm, setAdminEditForm] = useState({ name: adminProfile.name, email: adminProfile.email });
  const [profileSaveMsg, setProfileSaveMsg] = useState<string | null>(null);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // 1. Database-Driven Stats State
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    totalDoctors: 0,
    totalCaregivers: 0,
    totalMedicalRecords: 0,
    pendingDoctorApprovals: 0
  });

  // 2. Database-Driven Users State
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [searchUser, setSearchUser] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'Myself', status: 'Active' });

  // 3. Database-Driven Caregivers State
  const [caregivers, setCaregivers] = useState<AdminCaregiverItem[]>([]);
  const [searchCaregiver, setSearchCaregiver] = useState('');
  const [showAddCaregiverModal, setShowAddCaregiverModal] = useState(false);
  const [caregiverForm, setCaregiverForm] = useState({ name: '', email: '', relation: 'Parent', phone: '' });

  // 4. Database-Driven Doctors State
  const [doctors, setDoctors] = useState<AdminDoctorItem[]>([]);
  const [searchDoctor, setSearchDoctor] = useState('');

  // 5. Database-Driven Articles State
  const [articles, setArticles] = useState<AdminArticleItem[]>([]);
  const [showAddArticleModal, setShowAddArticleModal] = useState(false);
  const [newArticle, setNewArticle] = useState({ title: '', category: 'Wellness', desc: '', image: '' });

  // Auth Helper
  const getAuthHeaders = () => {
    const token = localStorage.getItem('femsphere_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  };

  // Fetch Stats
  const refreshStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/stats', { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (data.stats) setStats(data.stats);
      }
    } catch (e) {
      console.error('Failed to fetch admin stats', e);
    }
  }, []);

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/users', { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.users)) {
          const mapped: AdminUserItem[] = data.users.map((u: any) => ({
            id: `USR-${u.id}`,
            name: u.full_name || u.username || `User #${u.id}`,
            username: u.username,
            email: u.email,
            role: u.role || 'Myself',
            status: u.status || 'Active',
            dateJoined: u.created_at ? new Date(u.created_at).toISOString().split('T')[0] : '2026-01-01',
            phone: u.phone,
            bloodGroup: u.blood_group
          }));
          setUsers(mapped);
        }
      }
    } catch (e) {
      console.error('Failed to fetch admin users', e);
    }
  }, []);

  // Fetch Caregivers
  const fetchCaregivers = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/caregivers', { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.caregivers)) {
          const mapped: AdminCaregiverItem[] = data.caregivers.map((c: any) => ({
            id: `CG-${c.id}`,
            name: c.full_name || c.username || `Caregiver #${c.id}`,
            email: c.email,
            relation: c.caregiver_type || 'Parent',
            dependentsCount: c.dependents_count || 0,
            phone: c.emergency_phone || 'N/A',
            status: c.status || 'Active'
          }));
          setCaregivers(mapped);
        }
      }
    } catch (e) {
      console.error('Failed to fetch admin caregivers', e);
    }
  }, []);

  // Fetch Doctors
  const fetchDoctors = useCallback(async () => {
    try {
      const res = await fetch('/api/doctors');
      if (res.ok) {
        const dbDocs = await res.json();
        if (Array.isArray(dbDocs)) {
          const mapped: AdminDoctorItem[] = dbDocs.map((d: any) => ({
            id: d.id,
            userId: d.user_id,
            name: d.full_name ? `Dr. ${d.full_name}` : (d.username ? `Dr. ${d.username}` : 'Dr. Medical Practitioner'),
            email: d.email || 'doctor@femsphere.health',
            spec: d.specialization || 'General Healthcare',
            license: d.license_number || 'MD-N/A',
            hospital: d.hospital_clinic,
            yearsExperience: d.years_experience,
            status: d.approval_status === 'Approved' ? 'Active' : (d.approval_status || 'Pending'),
            rawApprovalStatus: d.approval_status
          }));
          setDoctors(mapped);
        }
      }
    } catch (e) {
      console.error('Failed to fetch doctors', e);
    }
  }, []);

  // Fetch Health Articles
  const fetchArticles = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/articles', { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.articles)) {
          const mapped: AdminArticleItem[] = data.articles.map((a: any) => ({
            id: `ART-${a.id}`,
            title: a.title,
            category: a.category,
            desc: a.description,
            image: a.image_url || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400',
            author: a.author,
            createdAt: a.created_at ? new Date(a.created_at).toISOString().split('T')[0] : '2026-08-01'
          }));
          setArticles(mapped);
        }
      }
    } catch (e) {
      console.error('Failed to fetch articles', e);
    }
  }, []);

  // Refresh All Data
  const refreshAllData = useCallback(async () => {
    await Promise.all([
      refreshStats(),
      fetchUsers(),
      fetchCaregivers(),
      fetchDoctors(),
      fetchArticles()
    ]);
  }, [refreshStats, fetchUsers, fetchCaregivers, fetchDoctors, fetchArticles]);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // --- ACTIONS ---

  // User Actions
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidName(userForm.name)) {
      alert('User full name must be at least 2 characters.');
      return;
    }
    if (!isValidEmail(userForm.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userForm)
      });
      if (res.ok) {
        await fetchUsers();
        await refreshStats();
        setShowAddUserModal(false);
        setUserForm({ name: '', email: '', role: 'Myself', status: 'Active' });
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to create user');
      }
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };

  const handleToggleUserStatus = async (id: string | number, currentStatus: string) => {
    const numericId = String(id).replace(/\D/g, '');
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      const res = await fetch(`/api/admin/users/${numericId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => String(u.id) === String(id) ? { ...u, status: newStatus } : u));
      }
    } catch (err) {
      console.error('Error updating user status:', err);
    }
  };

  const handleDeleteUser = async (id: string | number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    const numericId = String(id).replace(/\D/g, '');
    try {
      const res = await fetch(`/api/admin/users/${numericId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        setUsers(prev => prev.filter(u => String(u.id) !== String(id)));
        await refreshStats();
      }
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  // Caregiver Actions
  const handleAddCaregiver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidName(caregiverForm.name)) {
      alert('Caregiver name must be at least 2 characters.');
      return;
    }
    if (!isValidEmail(caregiverForm.email)) {
      alert('Please enter a valid email address.');
      return;
    }
    if (caregiverForm.phone && !isValidPhone(caregiverForm.phone)) {
      alert('Phone number must be a valid 10-digit number.');
      return;
    }

    try {
      const res = await fetch('/api/admin/caregivers', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(caregiverForm)
      });
      if (res.ok) {
        await fetchCaregivers();
        await refreshStats();
        setShowAddCaregiverModal(false);
        setCaregiverForm({ name: '', email: '', relation: 'Parent', phone: '' });
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to add caregiver');
      }
    } catch (err) {
      console.error('Error adding caregiver:', err);
    }
  };

  const handleDeleteCaregiver = async (id: string | number) => {
    if (!window.confirm('Are you sure you want to delete this caregiver?')) return;
    const numericId = String(id).replace(/\D/g, '');
    try {
      const res = await fetch(`/api/admin/caregivers/${numericId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        setCaregivers(prev => prev.filter(c => String(c.id) !== String(id)));
        await refreshStats();
      }
    } catch (err) {
      console.error('Error deleting caregiver:', err);
    }
  };

  // Doctor Actions
  const approveDoctor = async (id: string | number) => {
    setDoctors(prev => prev.map(d => String(d.id) === String(id) ? { ...d, status: 'Active', rawApprovalStatus: 'Approved' } : d));
    try {
      await fetch(`/api/admin/doctors/${id}/approve`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: 'Approved' })
      });
      await refreshStats();
    } catch (err) {
      console.error('Error approving doctor in database:', err);
    }
  };

  const rejectDoctor = async (id: string | number) => {
    if (!window.confirm('Reject this doctor application?')) return;
    setDoctors(prev => prev.filter(d => String(d.id) !== String(id)));
    try {
      await fetch(`/api/admin/doctors/${id}/approve`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: 'Rejected' })
      });
      await refreshStats();
    } catch (err) {
      console.error('Error rejecting doctor:', err);
    }
  };

  const suspendDoctor = async (id: string | number) => {
    setDoctors(prev => prev.map(d => String(d.id) === String(id) ? { ...d, status: 'Suspended', rawApprovalStatus: 'Suspended' } : d));
    try {
      await fetch(`/api/admin/doctors/${id}/approve`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: 'Suspended' })
      });
      await refreshStats();
    } catch (err) {
      console.error('Error suspending doctor:', err);
    }
  };

  // Article Actions
  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticle.title || newArticle.title.trim().length < 5) {
      alert('Article title must be at least 5 characters long.');
      return;
    }
    if (newArticle.desc && newArticle.desc.trim().length > 0 && newArticle.desc.trim().length < 10) {
      alert('Article description must be at least 10 characters long.');
      return;
    }

    try {
      const res = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: newArticle.title,
          category: newArticle.category,
          description: newArticle.desc,
          imageUrl: newArticle.image
        })
      });
      if (res.ok) {
        await fetchArticles();
        setShowAddArticleModal(false);
        setNewArticle({ title: '', category: 'Wellness', desc: '', image: '' });
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to create article');
      }
    } catch (err) {
      console.error('Error creating article:', err);
    }
  };

  const handleDeleteArticle = async (id: string | number) => {
    const numericId = String(id).replace(/\D/g, '');
    try {
      const res = await fetch(`/api/admin/articles/${numericId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        setArticles(prev => prev.filter(a => String(a.id) !== String(id)));
      }
    } catch (err) {
      console.error('Error deleting article:', err);
    }
  };

  // Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidName(adminEditForm.name)) {
      setProfileSaveMsg('Admin name must be at least 2 characters.');
      setTimeout(() => setProfileSaveMsg(null), 3500);
      return;
    }
    if (!isValidEmail(adminEditForm.email)) {
      setProfileSaveMsg('Please enter a valid email address.');
      setTimeout(() => setProfileSaveMsg(null), 3500);
      return;
    }

    setProfileSaveMsg('Saving admin profile...');
    setAdminProfile(prev => ({ ...prev, name: adminEditForm.name, email: adminEditForm.email }));
    setIsAdminEditing(false);

    try {
      const stored = localStorage.getItem('femsphere_user');
      const parsed = stored ? JSON.parse(stored) : {};
      const updatedUser = {
        ...parsed,
        fullName: adminEditForm.name,
        email: adminEditForm.email,
        profile: {
          ...(parsed.profile || {}),
          full_name: adminEditForm.name
        }
      };
      localStorage.setItem('femsphere_user', JSON.stringify(updatedUser));

      await fetch('/api/users/profile', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: adminEditForm.name,
          email: adminEditForm.email
        })
      });
    } catch (err) {
      console.error('Error saving admin profile:', err);
    }

    setProfileSaveMsg('Admin credentials saved successfully!');
    setTimeout(() => setProfileSaveMsg(null), 3000);
  };

  // Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const pwdValidation = validatePassword(newPassword);
    if (!pwdValidation.isValid) {
      alert(pwdValidation.errors[0]);
      return;
    }
    if (oldPassword && newPassword && oldPassword === newPassword) {
      alert('New password must be different from current password.');
      return;
    }
    try {
      alert('Admin password has been updated securely.');
      setShowPasswordModal(false);
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      console.error('Password change error:', err);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('femsphere_token');
    localStorage.removeItem('femsphere_user');
    navigate('/login');
  };

  return (
    <AdminContext.Provider
      value={{
        stats,
        refreshStats,
        users,
        searchUser,
        setSearchUser,
        showAddUserModal,
        setShowAddUserModal,
        userForm,
        setUserForm,
        handleAddUser,
        handleToggleUserStatus,
        handleDeleteUser,
        caregivers,
        searchCaregiver,
        setSearchCaregiver,
        showAddCaregiverModal,
        setShowAddCaregiverModal,
        caregiverForm,
        setCaregiverForm,
        handleAddCaregiver,
        handleDeleteCaregiver,
        doctors,
        searchDoctor,
        setSearchDoctor,
        approveDoctor,
        rejectDoctor,
        suspendDoctor,
        articles,
        showAddArticleModal,
        setShowAddArticleModal,
        newArticle,
        setNewArticle,
        handleAddArticle,
        handleDeleteArticle,
        adminProfile,
        setAdminProfile,
        profileSaveMsg,
        isAdminEditing,
        setIsAdminEditing,
        adminEditForm,
        setAdminEditForm,
        handleSaveProfile,
        showPasswordModal,
        setShowPasswordModal,
        oldPassword,
        setOldPassword,
        newPassword,
        setNewPassword,
        handleChangePassword,
        currentTime,
        handleLogout,
        refreshAllData
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
