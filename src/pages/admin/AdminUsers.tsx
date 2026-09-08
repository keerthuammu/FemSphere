import React from 'react';
import { Search, Plus, Trash2 } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminUsers() {
  const {
    users,
    searchUser,
    setSearchUser,
    setShowAddUserModal,
    handleToggleUserStatus,
    handleDeleteUser
  } = useAdmin();

  const filteredUsers = users.filter(u => 
    (u.name && u.name.toLowerCase().includes(searchUser.toLowerCase())) || 
    (u.email && u.email.toLowerCase().includes(searchUser.toLowerCase())) ||
    (u.role && u.role.toLowerCase().includes(searchUser.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EDE9FE] pb-4">
        <div>
          <h3 className="font-bold text-2xl text-[#3a3135]">Manage Registered Users</h3>
          <p className="text-sm text-[#64595e]">View, update, or restrict live platform user accounts</p>
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
            className="px-5 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
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
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date Joined</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EDE9FE]">
            {filteredUsers.map(u => (
              <tr key={u.id} className="hover:bg-[#FAF8FC] transition-colors">
                <td className="p-4 font-bold text-[#7C3AED]">{u.id}</td>
                <td className="p-4 font-bold text-[#3a3135]">{u.name}</td>
                <td className="p-4 text-[#64595e]">{u.email}</td>
                <td className="p-4">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#FAF8FC] text-[#4A3B42] border border-[#EDE9FE]">
                    {u.role}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    u.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {u.status}
                  </span>
                </td>
                <td className="p-4 text-[#7a6f75]">{u.dateJoined}</td>
                <td className="p-4 text-right space-x-2">
                  <button 
                    onClick={() => handleToggleUserStatus(u.id, u.status)} 
                    className="px-3 py-1.5 rounded-lg border border-[#EDE9FE] text-xs font-bold text-[#3a3135] hover:bg-[#F5F3FF] transition-colors cursor-pointer"
                  >
                    Toggle Status
                  </button>
                  <button 
                    onClick={() => handleDeleteUser(u.id)} 
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete User"
                  >
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-[#7a6f75] italic">
                  No users match your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
