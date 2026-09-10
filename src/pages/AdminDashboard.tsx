import React from 'react';
import { AdminProvider } from '../context/AdminContext';
import AdminLayout from './admin/AdminLayout';

/**
 * AdminDashboard
 * 
 * Note: The Admin Dashboard has been modularized into separate dedicated sub-pages:
 * - src/pages/admin/AdminOverview.tsx      -> /admin (Dashboard)
 * - src/pages/admin/AdminUsers.tsx         -> /admin/users
 * - src/pages/admin/AdminCaregivers.tsx    -> /admin/caregivers
 * - src/pages/admin/AdminDoctors.tsx       -> /admin/doctors
 * - src/pages/admin/AdminArticles.tsx      -> /admin/articles
 * - src/pages/admin/AdminProfilePage.tsx   -> /admin/profile
 * 
 * All routed under /admin/* in src/App.tsx with AdminProvider and live PostgreSQL database data
 */
export default function AdminDashboard() {
  return (
    <AdminProvider>
      <AdminLayout />
    </AdminProvider>
  );
}
