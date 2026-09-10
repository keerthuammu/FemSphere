import React, { useState } from 'react';
import { Search, Plus, Trash2, Users, User } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminUsers() {
  const {
    users,
    searchUser,
    setSearchUser,
    setShowAddUserModal,
    handleToggleUserStatus,
    handleDeleteUser,
    refreshAllData
  } = useAdmin();

  const [selectedRole, setSelectedRole] = useState<'ALL' | 'FEMALE' | 'MALE'>('ALL');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // Exclude admin, doctor, and caregiver accounts - only list regular female and male users
  const regularUsers = users.filter(u => {
    const roleLower = (u.role || '').toLowerCase();
    if (roleLower.includes('admin')) return false;
    if (roleLower.includes('doctor')) return false;
    if (roleLower.includes('caregiver')) return false;
    return true;
  });

  const isFemale = (role?: string) => {
    const r = (role || '').toLowerCase();
    return r.includes('female') || (!r.includes('male') && r.includes('myself'));
  };

  const isMale = (role?: string) => {
    const r = (role || '').toLowerCase();
    return r.includes('male') && !r.includes('female');
  };

  const countFemale = regularUsers.filter(u => isFemale(u.role)).length;
  const countMale = regularUsers.filter(u => isMale(u.role)).length;

  const userTypeFilters = [
    { id: 'ALL' as const, label: 'All Users', count: regularUsers.length, icon: Users, iconColor: 'text-[#7C3AED]' },
    { id: 'FEMALE' as const, label: 'Female Users', count: countFemale, icon: User, iconColor: 'text-pink-500' },
    { id: 'MALE' as const, label: 'Male Users', count: countMale, icon: User, iconColor: 'text-blue-500' }
  ];

  const filteredUsers = regularUsers.filter(u => {
    // Role / Gender filter
    if (selectedRole === 'FEMALE' && !isFemale(u.role)) return false;
    if (selectedRole === 'MALE' && !isMale(u.role)) return false;

    // Search query filter
    if (!searchUser.trim()) return true;
    const q = searchUser.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(q)) || 
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.role && u.role.toLowerCase().includes(q))
    );
  });

  const handleToggleSelect = (id: string) => {
    setSelectedUserIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const allFilteredIds = filteredUsers.map(u => String(u.id));
    const allSelected = allFilteredIds.length > 0 && allFilteredIds.every(id => selectedUserIds.includes(id));
    if (allSelected) {
      setSelectedUserIds(prev => prev.filter(id => !allFilteredIds.includes(id)));
    } else {
      setSelectedUserIds(prev => Array.from(new Set([...prev, ...allFilteredIds])));
    }
  };

  const handleBulkToggleStatus = async () => {
    if (selectedUserIds.length === 0) return;
    const targets = regularUsers.filter(u => selectedUserIds.includes(String(u.id)));
    for (const u of targets) {
      await handleToggleUserStatus(u.id, u.status);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUserIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedUserIds.length} selected user(s)?`)) return;
    for (const id of selectedUserIds) {
      const numericId = String(id).replace(/\D/g, '');
      try {
        const token = localStorage.getItem('femsphere_token') || '';
        await fetch(`/api/admin/users/${numericId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        });
      } catch (err) {
        console.error('Error deleting user in bulk:', err);
      }
    }
    if (refreshAllData) {
      await refreshAllData();
    }
    setSelectedUserIds([]);
  };

  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#EDE9FE] shadow-xs space-y-4 font-inter">
      {/* TOP HEADER & SEARCH / ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#EDE9FE] pb-3.5">
        <div>
          <h3 className="font-bold text-xl text-[#3a3135]">Manage Registered Users</h3>
          <p className="text-xs text-[#64595e]">View, update, or restrict live platform regular user accounts</p>
        </div>
        <div className="flex iteFs-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#7a6f75] absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-[#EDE9FE] text-xs focus:ring-2 focus:ring-[#7C3AED] outline-none"
            />
          </div>
          <button 
            onClick={() => setShowAddUserModal(true)} 
            className="px-3.5 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Add User
          </button>
        </div>
      </div>


      {/* Users Table */}
      <div className="overflow-x-auto rounded-xl border border-[#EDE9FE]">
        <table className="w-full text-left text-xs font-inter">
          <thead className="bg-[#FAF8FC] text-[#3a3135] uppercase text-[11px] font-bold border-b border-[#EDE9FE]">
            <tr>
              <th className="p-3 w-10 text-center">
                <input 
                  type="checkbox" 
                  checked={filteredUsers.length > 0 && filteredUsers.every(u => selectedUserIds.includes(String(u.id)))}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded text-[#7C3AED] focus:ring-[#7C3AED] cursor-pointer"
                  title="Select all"
                />
              </th>
              <th className="p-3">Full Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date Joined</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EDE9FE]">
            {filteredUsers.map(u => {
              const isSelected = selectedUserIds.includes(String(u.id));
              return (
                <tr key={u.id} className={`transition-colors ${isSelected ? 'bg-purple-50/60' : 'hover:bg-[#FAF8FC]'}`}>
                  <td className="p-3 w-10 text-center">
                    <input 
                      type="checkbox" 
                      checked={isSelected}
                      onChange={() => handleToggleSelect(String(u.id))}
                      className="w-4 h-4 rounded text-[#7C3AED] focus:ring-[#7C3AED] cursor-pointer"
                    />
                  </td>
                  <td className="p-3 font-bold text-[#3a3135]">{u.name}</td>
                  <td className="p-3 text-[#64595e]">{u.email}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      u.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-3 text-[#7a6f75]">{u.dateJoined}</td>
                  <td className="p-3 text-right space-x-1.5">
                    <button 
                      onClick={() => handleToggleUserStatus(u.id, u.status)} 
                      className="px-2.5 py-1 rounded-lg border border-[#EDE9FE] text-[11px] font-bold text-[#3a3135] hover:bg-[#F5F3FF] transition-colors cursor-pointer"
                    >
                      Toggle Status
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(u.id)} 
                      className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer inline-flex items-center"
                      title="Delete User"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-[#7a6f75] italic">
                  No users found for this user type or search query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* BULK ACTIONS AT THE BOTTOM */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 bg-[#FAF8FC] rounded-xl border border-[#EDE9FE] text-xs font-inter">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#3a3135]">
            {selectedUserIds.length} user{selectedUserIds.length === 1 ? '' : 's'} selected
          </span>
          {selectedUserIds.length > 0 && (
            <button 
              onClick={() => setSelectedUserIds([])}
              className="text-[#7C3AED] font-semibold hover:underline cursor-pointer ml-1 text-xs"
            >
              Deselect All
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleBulkToggleStatus}
            disabled={selectedUserIds.length === 0}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
              selectedUserIds.length > 0
                ? 'bg-[#EDE9FE] text-[#7C3AED] hover:bg-[#DDD6FE] shadow-xs'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
            }`}
          >
            Toggle Status
          </button>
          <button
            onClick={handleBulkDelete}
            disabled={selectedUserIds.length === 0}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              selectedUserIds.length > 0
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
