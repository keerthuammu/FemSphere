import React, { useState } from 'react';
import {
  Shield,
  Users,
  Stethoscope,
  FileText,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Search,
  Trash2,
  Edit,
  Eye
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function AdminPortalView() {
  const {
    usersList,
    toggleUserStatus,
    pendingDoctors,
    verifyDoctor,
    articles,
    toggleArticlePublish,
    addArticle
  } = useApp();

  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'analytics' | 'verify' | 'users' | 'articles'>('analytics');
  const [userSearch, setUserSearch] = useState('');
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [articleTitle, setArticleTitle] = useState('');
  const [articleCategory, setArticleCategory] = useState('Maternal Health');
  const [articleSummary, setArticleSummary] = useState('');

  const filteredUsers = usersList.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (articleTitle.trim()) {
      addArticle({
        title: articleTitle,
        category: articleCategory,
        readTime: '4 min read',
        author: 'FemSphere Clinical Board',
        status: 'published',
        date: 'Today',
        summary: articleSummary || 'Clinical guidance review verified by FemSphere editorial committee.',
      });
      setArticleTitle('');
      setArticleSummary('');
      setIsArticleModalOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            FemSphere Platform Administration
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            System governance, physician credentialing & content management
          </p>
        </div>

        {/* Sub-tab pills */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveAdminSubTab('analytics')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all min-h-[44px] ${
              activeAdminSubTab === 'analytics'
                ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-xs'
                : 'text-slate-500'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveAdminSubTab('verify')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all min-h-[44px] ${
              activeAdminSubTab === 'verify'
                ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-xs'
                : 'text-slate-500'
            }`}
          >
            Verifications
          </button>
          <button
            onClick={() => setActiveAdminSubTab('users')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all min-h-[44px] ${
              activeAdminSubTab === 'users'
                ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-xs'
                : 'text-slate-500'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveAdminSubTab('articles')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all min-h-[44px] ${
              activeAdminSubTab === 'articles'
                ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-xs'
                : 'text-slate-500'
            }`}
          >
            CMS Articles
          </button>
        </div>
      </div>

      {/* 1. PLATFORM ANALYTICS (Prompt #37) */}
      {activeAdminSubTab === 'analytics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-white dark:bg-slate-850 p-3.5 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Users</span>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums mt-0.5">142,500</p>
              <span className="text-[10px] text-emerald-600 font-semibold">+12% this month</span>
            </div>
            <div className="bg-white dark:bg-slate-850 p-3.5 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Active Twins</span>
              <p className="text-xl font-extrabold text-purple-600 tabular-nums mt-0.5">98,200</p>
              <span className="text-[10px] text-purple-600 font-semibold">68% daily sync</span>
            </div>
            <div className="bg-white dark:bg-slate-850 p-3.5 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Verified Doctors</span>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums mt-0.5">1,820</p>
              <span className="text-[10px] text-emerald-600 font-semibold">Across 42 specialties</span>
            </div>
            <div className="bg-white dark:bg-slate-850 p-3.5 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Pending Review</span>
              <p className="text-xl font-extrabold text-amber-600 tabular-nums mt-0.5">14</p>
              <span className="text-[10px] text-amber-600 font-semibold">Licenses awaiting verification</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-sm space-y-2">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Platform Health & Telemetry Compliance
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              All clinical databases and end-to-end telemetry encryption tunnels (AES-256 GCM) are operating with 99.98% uptime. HIPAA audit trails are actively recorded.
            </p>
          </div>
        </div>
      )}

      {/* 2. DOCTOR VERIFICATION (Prompt #38) */}
      {activeAdminSubTab === 'verify' && (
        <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Physician Credential Verification
              </h3>
              <p className="text-[11px] text-slate-400">
                Review state medical board licenses and institutional appointments
              </p>
            </div>
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
              {pendingDoctors.filter(d => d.status === 'pending').length} Pending
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {pendingDoctors.map(doc => (
              <div
                key={doc.id}
                className="p-3.5 rounded-xl border border-purple-100/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {doc.name}
                    </h4>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        doc.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-700'
                          : doc.status === 'rejected'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {doc.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-purple-700 dark:text-purple-300 font-medium mt-0.5">
                    {doc.specialty} · License: {doc.license}
                  </p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {doc.experience}
                  </span>
                </div>

                {doc.status === 'pending' && (
                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    <button
                      onClick={() => verifyDoctor(doc.id, 'approved')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs min-h-[44px]"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => verifyDoctor(doc.id, 'rejected')}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs min-h-[44px]"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => alert(`Requested supplementary credentials from ${doc.name}.`)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold min-h-[44px]"
                    >
                      Req. Info
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. USER MANAGEMENT (Prompt #39) */}
      {activeAdminSubTab === 'users' && (
        <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Directory & Access Management
              </h3>
              <p className="text-[11px] text-slate-400">
                Inspect accounts, roles, and status authorizations
              </p>
            </div>
            <div className="relative w-44">
              <input
                type="text"
                placeholder="Search user..."
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-purple-100 dark:border-slate-700 text-xs"
              />
            </div>
          </div>

          <div className="space-y-2 pt-1">
            {filteredUsers.map(u => (
              <div
                key={u.id}
                className="p-3 rounded-xl border border-purple-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {u.name}
                    </h4>
                    <span className="text-[9px] font-bold uppercase text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
                      {u.role}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        u.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}
                    >
                      {u.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {u.email} · Member since {u.joined}
                  </p>
                </div>

                <button
                  onClick={() => toggleUserStatus(u.id)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg min-h-[44px] ${
                    u.status === 'active'
                      ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                      : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                  }`}
                >
                  {u.status === 'active' ? 'Suspend' : 'Activate'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. HEALTH ARTICLES CMS (Prompt #40) */}
      {activeAdminSubTab === 'articles' && (
        <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Clinical Health Library CMS
              </h3>
              <p className="text-[11px] text-slate-400">
                Publish, edit, and curate evidence-based articles for patients
              </p>
            </div>
            <button
              onClick={() => setIsArticleModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm min-h-[44px]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Article</span>
            </button>
          </div>

          <div className="space-y-2.5 pt-1">
            {articles.map(art => (
              <div
                key={art.id}
                className="p-3.5 rounded-xl border border-purple-100/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {art.title}
                    </h4>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        art.status === 'published'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {art.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[10px] text-purple-700 dark:text-purple-300 font-semibold mt-0.5">
                    {art.category} · {art.readTime} · By {art.author}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {art.summary}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => toggleArticlePublish(art.id)}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 min-h-[44px]"
                  >
                    {art.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Article Modal */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-purple-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-purple-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Create Clinical Article
              </h3>
              <button onClick={() => setIsArticleModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateArticle} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Article Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Iron Absorption Synergy with Vitamin C"
                  value={articleTitle}
                  onChange={e => setArticleTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-purple-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. Maternal Nutrition"
                  value={articleCategory}
                  onChange={e => setArticleCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-purple-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Summary & Core Thesis
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief clinical takeaway for app users..."
                  value={articleSummary}
                  onChange={e => setArticleSummary(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-purple-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md min-h-[44px]"
              >
                Publish to Patients Library
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
