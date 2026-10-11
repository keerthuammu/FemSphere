import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Shield, Check, Trash2, UserPlus, 
  AlertCircle, Clock, XCircle, CheckCircle2, RefreshCw, Lock, 
  Calendar, Activity, Droplet, FileText, ChevronRight, Eye,
  SlidersHorizontal, History, UserCheck, AlertTriangle, KeyRound
} from 'lucide-react';

interface SearchUser {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  caregiverType?: string | null;
  connectionStatus: string;
  connectionId?: number | null;
}

interface OutgoingConnection {
  id: number;
  recipientId: number;
  recipientUsername: string;
  recipientEmail: string;
  recipientName: string;
  relationship: string;
  status: string;
  rawStatus: string;
  consent_status: 'awaiting_consent' | 'consent_granted' | 'consent_revoked';
  consentGrantedAt?: string | null;
  lastConsentUpdatedAt?: string | null;
  createdAt: string;
  acceptedAt?: string | null;
  revokedAt?: string | null;
  permissions: {
    daily_activities: boolean;
    menstrual_cycle: boolean;
    symptoms_notes: boolean;
    medical_records: boolean;
    appointments: boolean;
  };
}

interface AuditEvent {
  id: number;
  eventType: string;
  resource: string;
  status: string;
  category?: string;
  categoryLabel?: string;
  previousState?: string;
  newState?: string;
  timestamp: string;
  companionId?: number;
  companionName: string;
  companionEmail?: string;
  details?: any;
  description: string;
}

export default function PartnerSharingModule() {
  const [activeTab, setActiveTab] = useState<'connections' | 'history'>('connections');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<SearchUser | null>(null);

  // Request form state
  const [relationshipType, setRelationshipType] = useState('Spouse or partner');
  const [customRelationship, setCustomRelationship] = useState('');
  const [permissions, setPermissions] = useState({
    daily_activities: false,
    menstrual_cycle: false,
    symptoms_notes: false,
    medical_records: false,
    appointments: false
  });

  // Outgoing connections state
  const [connections, setConnections] = useState<OutgoingConnection[]>([]);
  const [isLoadingConnections, setIsLoadingConnections] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Access history state
  const [accessHistory, setAccessHistory] = useState<AuditEvent[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Modals state
  const [consentModalConnection, setConsentModalConnection] = useState<OutgoingConnection | null>(null);
  const [modalPermissions, setModalPermissions] = useState({
    daily_activities: false,
    menstrual_cycle: false,
    symptoms_notes: false,
    medical_records: false,
    appointments: false
  });
  const [isSavingConsent, setIsSavingConsent] = useState(false);

  // Revoke confirmation modal
  const [revokeModalConnection, setRevokeModalConnection] = useState<OutgoingConnection | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);

  // Connection details modal
  const [detailsModalConnection, setDetailsModalConnection] = useState<OutgoingConnection | null>(null);

  const relationshipOptions = [
    'Parent',
    'Spouse or partner',
    'Sibling',
    'Other family member',
    'Friend',
    'Professional caregiver',
    'Other'
  ];

  const categoryDefinitions = [
    {
      id: 'daily_activities',
      title: 'Daily Activities & Health Tracking',
      description: 'Steps, resting heart rate, sleep duration, hydration levels, and smartwatch biometrics.',
      icon: Activity,
      color: 'text-violet-600 bg-violet-50'
    },
    {
      id: 'menstrual_cycle',
      title: 'Menstrual Cycle & Predictions',
      description: 'Cycle phase transitions, expected period dates, and estimated fertility windows.',
      icon: Droplet,
      color: 'text-rose-600 bg-rose-50'
    },
    {
      id: 'symptoms_notes',
      title: 'Daily Symptoms & Health Notes',
      description: 'Logged symptoms, cramp severity, mood tags, and personal wellness notes.',
      icon: AlertCircle,
      color: 'text-amber-600 bg-amber-50'
    },
    {
      id: 'medical_records',
      title: 'Medical Records & Uploaded Reports',
      description: 'Clinical summaries, lab reports, doctor prescriptions, and uploaded vault documents.',
      icon: FileText,
      color: 'text-indigo-600 bg-indigo-50'
    },
    {
      id: 'appointments',
      title: 'Doctor Appointments',
      description: 'Scheduled clinical visits, doctor details, appointment timings, and consultation notes.',
      icon: Calendar,
      color: 'text-emerald-600 bg-emerald-50'
    }
  ];

  useEffect(() => {
    fetchOutgoingConnections();
  }, []);

  useEffect(() => {
    if (activeTab === 'history') {
      fetchAccessHistory();
    }
  }, [activeTab]);

  const fetchOutgoingConnections = async () => {
    setIsLoadingConnections(true);
    try {
      const token = localStorage.getItem('femsphere_token');
      const res = await fetch('/api/connections/outgoing', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setConnections(data.connections || []);
      }
    } catch (err) {
      console.error('Failed to load connections:', err);
    } finally {
      setIsLoadingConnections(false);
    }
  };

  const fetchAccessHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const token = localStorage.getItem('femsphere_token');
      const res = await fetch('/api/connections/access-history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAccessHistory(data.history || []);
      }
    } catch (err) {
      console.error('Failed to load access history:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setFeedback({ type: 'error', message: 'Please enter at least 2 characters to search.' });
      return;
    }

    setIsSearching(true);
    setFeedback(null);
    try {
      const token = localStorage.getItem('femsphere_token');
      const res = await fetch(`/api/connections/search?query=${encodeURIComponent(searchQuery.trim())}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        const found = data.results || data.users || [];
        setSearchResults(found);
        if (found.length === 0) {
          setFeedback({ type: 'error', message: `No user found matching "${searchQuery}". Please check the email or username.` });
        }
      } else {
        setFeedback({ type: 'error', message: data.message || 'Search failed.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Network error searching for account.' });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendRequest = async () => {
    if (!selectedUser) {
      setFeedback({ type: 'error', message: 'Please select a companion from search results.' });
      return;
    }

    const rel = relationshipType === 'Other' ? customRelationship.trim() : relationshipType;
    if (!rel) {
      setFeedback({ type: 'error', message: 'Please specify your relationship with this person.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);
    try {
      const token = localStorage.getItem('femsphere_token');
      const res = await fetch('/api/connections/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          recipientId: selectedUser.id,
          relationshipType: rel,
          permissions
        })
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ 
          type: 'success', 
          message: `Connection request sent to ${selectedUser.fullName || selectedUser.email}! Once they accept, you will review and approve data-sharing permissions.` 
        });
        setSelectedUser(null);
        setSearchQuery('');
        setSearchResults([]);
        fetchOutgoingConnections();
      } else {
        setFeedback({ type: 'error', message: data.message || 'Failed to send request.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Network error sending connection request.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelRequest = async (id: number) => {
    try {
      const token = localStorage.getItem('femsphere_token');
      const res = await fetch(`/api/connections/${id}/cancel`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: 'Pending connection request has been cancelled.' });
        fetchOutgoingConnections();
      } else {
        setFeedback({ type: 'error', message: data.message || 'Failed to cancel request.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Error cancelling request.' });
    }
  };

  const openConsentModal = (conn: OutgoingConnection) => {
    setConsentModalConnection(conn);
    setModalPermissions({ ...conn.permissions });
  };

  const handleSaveConsentOrPermissions = async () => {
    if (!consentModalConnection) return;
    setIsSavingConsent(true);
    try {
      const token = localStorage.getItem('femsphere_token');
      // If awaiting consent, use approve consent endpoint; otherwise permissions update
      const endpoint = consentModalConnection.consent_status === 'awaiting_consent'
        ? `/api/connections/${consentModalConnection.id}/consent`
        : `/api/connections/${consentModalConnection.id}/permissions`;

      const method = consentModalConnection.consent_status === 'awaiting_consent' ? 'POST' : 'PUT';

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ permissions: modalPermissions })
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: 'Data-sharing permissions and consent updated successfully.' });
        setConsentModalConnection(null);
        fetchOutgoingConnections();
        if (activeTab === 'history') fetchAccessHistory();
      } else {
        setFeedback({ type: 'error', message: data.message || 'Failed to update consent.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Error saving consent.' });
    } finally {
      setIsSavingConsent(false);
    }
  };

  const handleRevokeConnection = async () => {
    if (!revokeModalConnection) return;
    setIsRevoking(true);
    try {
      const token = localStorage.getItem('femsphere_token');
      const res = await fetch(`/api/connections/${revokeModalConnection.id}/revoke`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ 
          type: 'success', 
          message: `Connection with ${revokeModalConnection.recipientName} has been revoked immediately. All data sharing has ceased.` 
        });
        setRevokeModalConnection(null);
        fetchOutgoingConnections();
        if (activeTab === 'history') fetchAccessHistory();
      } else {
        setFeedback({ type: 'error', message: data.message || 'Failed to revoke connection.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Error revoking connection.' });
    } finally {
      setIsRevoking(false);
    }
  };

  // Groupings for Connections tab
  const pendingRequests = connections.filter(c => c.rawStatus === 'pending' || c.status === 'Pending');
  const activeConnections = connections.filter(c => (c.rawStatus === 'accepted' || c.status === 'Active') && c.status !== 'Revoked' && c.rawStatus !== 'revoked');
  const rejectedCancelled = connections.filter(c => c.rawStatus === 'rejected' || c.status === 'Rejected' || c.rawStatus === 'cancelled' || c.status === 'Cancelled');
  const revokedHistory = connections.filter(c => c.rawStatus === 'revoked' || c.status === 'Revoked');

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#EDE4F7] via-[#FCE7F3] to-[#FAF8FC] p-6 md:p-8 rounded-3xl border border-[#F4DDE2] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-white/80 text-[#936DA2] rounded-full text-xs font-bold uppercase tracking-wider border border-[#F4DDE2]">
            Consent & Connection Governance
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#201538] mt-2">Connections & Data Sharing</h2>
          <p className="text-xs text-[#7A6F75] mt-1 max-w-xl">
            You own your FemSphere account and health records. Companions can access only the specific categories you explicitly authorize through separate, verified consent.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-[#F4DDE2] text-xs font-semibold text-[#936DA2]">
          <Shield className="w-4 h-4 text-emerald-600" /> Tamper-Proof HIPAA Audit Logging
        </div>
      </div>

      {/* Global Navigation Tabs */}
      <div className="flex gap-2 border-b border-[#F4DDE2] pb-1">
        <button
          onClick={() => setActiveTab('connections')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'connections'
              ? 'bg-[#936DA2] text-white shadow-sm'
              : 'text-[#7A6F75] hover:bg-[#FAF8FC]'
          }`}
        >
          <Users className="w-4 h-4" />
          Connections & Consent
          {pendingRequests.length > 0 && (
            <span className="px-1.5 py-0.5 bg-amber-400 text-[#201538] rounded-full text-[10px] font-black">
              {pendingRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'bg-[#936DA2] text-white shadow-sm'
              : 'text-[#7A6F75] hover:bg-[#FAF8FC]'
          }`}
        >
          <History className="w-4 h-4" />
          Access History & Audit Log
        </button>
      </div>

      {/* Global Feedback Banner */}
      {feedback && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between ${
          feedback.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <div className="flex items-center gap-2.5 text-xs font-medium">
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-xs font-bold opacity-60 hover:opacity-100 cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: CONNECTIONS & DATA SHARING */}
      {/* ========================================================================= */}
      {activeTab === 'connections' && (
        <div className="space-y-8">
          {/* Section A: Search & Connect */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#F4DDE2] shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-[#936DA2]">
              <UserPlus className="w-5 h-5" />
              <h3 className="font-serif text-2xl font-bold text-[#201538]">Search for a Companion or Caregiver</h3>
            </div>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#8E859E] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter email or username (e.g. caregiver@femsphere.health)..."
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#F4DDE2] focus:border-[#936DA2] focus:ring-2 focus:ring-purple-100 outline-none text-xs"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="px-6 py-3 bg-[#936DA2] hover:bg-[#835A92] text-white text-xs font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Search
              </button>
            </form>

            {/* Search Results */}
            {searchResults.length > 0 && !selectedUser && (
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-[#7A6F75] uppercase">Select Companion ({searchResults.length})</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      className="p-4 rounded-2xl border border-[#F4DDE2] bg-[#FAF8FC] hover:border-[#936DA2] transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#EDE4F7] text-[#936DA2] font-bold text-sm flex items-center justify-center">
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-[#201538]">{user.fullName}</h4>
                          <p className="text-xs text-[#7A6F75]">{user.email}</p>
                          <span className="inline-block px-2 py-0.5 mt-1 bg-white border border-[#F4DDE2] rounded-md text-[10px] text-[#936DA2] font-semibold">
                            Role: {user.role} {user.caregiverType ? `(${user.caregiverType})` : ''}
                          </span>
                        </div>
                      </div>

                      {user.connectionStatus === 'accepted' ? (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Connected
                        </span>
                      ) : user.connectionStatus === 'pending' ? (
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-xl flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Pending
                        </span>
                      ) : (
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="px-4 py-2 bg-[#936DA2] hover:bg-[#835A92] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                        >
                          Select
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selected User & Relationship Configuration */}
            {selectedUser && (
              <div className="p-6 rounded-2xl border border-[#F4DDE2] bg-[#FDF2F8]/40 space-y-5 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FCE7F3] text-[#EC4899] font-bold text-sm flex items-center justify-center">
                      {selectedUser.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#201538]">Sending Request To: {selectedUser.fullName}</h4>
                      <p className="text-xs text-[#7A6F75]">{selectedUser.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="text-xs text-[#936DA2] hover:underline font-bold cursor-pointer"
                  >
                    Change Recipient
                  </button>
                </div>

                {/* Stated Relationship */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#201538] uppercase">
                    Your Relationship with this Person <span className="text-rose-500">*</span>
                  </label>
                  <p className="text-[11px] text-[#7A6F75]">
                    This declared relationship will be stored and shown to the companion so they understand who is requesting access.
                  </p>
                  <select
                    value={relationshipType}
                    onChange={(e) => setRelationshipType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#F4DDE2] bg-white text-xs outline-none focus:border-[#936DA2]"
                  >
                    {relationshipOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>

                  {relationshipType === 'Other' && (
                    <input
                      type="text"
                      value={customRelationship}
                      onChange={(e) => setCustomRelationship(e.target.value)}
                      placeholder="Specify custom relationship (e.g. Doula, Cousin)..."
                      className="w-full px-4 py-2.5 mt-2 rounded-xl border border-[#F4DDE2] bg-white text-xs outline-none focus:border-[#936DA2]"
                    />
                  )}
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleSendRequest}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-[#EC4899] hover:bg-[#DB2777] text-white text-xs font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
                    Send Connection Request
                  </button>
                  <p className="text-[11px] text-[#7A6F75] mt-2">
                    Note: Health records will not be shared merely because a request is sent. Once the recipient accepts, you will review and approve data-sharing permissions explicitly.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section B: Active Companions & Caregivers */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#F4DDE2] shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#936DA2]">
                <UserCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-serif text-2xl font-bold text-[#201538]">Active Companions & Caregivers ({activeConnections.length})</h3>
              </div>
              <button 
                onClick={fetchOutgoingConnections}
                className="p-2 text-[#7A6F75] hover:text-[#936DA2] rounded-xl hover:bg-[#FAF8FC] transition-colors cursor-pointer"
                title="Refresh list"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingConnections ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {isLoadingConnections ? (
              <div className="py-12 flex flex-col items-center justify-center text-xs text-[#7A6F75] gap-3">
                <RefreshCw className="w-6 h-6 animate-spin text-[#936DA2]" />
                <span>Loading active connections...</span>
              </div>
            ) : activeConnections.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-[#F4DDE2] rounded-2xl p-6">
                <Users className="w-10 h-10 text-purple-300 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-[#201538]">No Active Companions Linked</h4>
                <p className="text-xs text-[#7A6F75] mt-1 max-w-md mx-auto">
                  When a companion accepts your connection request and you approve data-sharing consent, they will be listed here with granular category controls.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeConnections.map((conn) => {
                  const isAwaitingConsent = conn.consent_status === 'awaiting_consent';
                  const activePermKeys = Object.keys(conn.permissions || {}).filter(k => (conn.permissions as any)[k] === true);

                  return (
                    <div
                      key={conn.id}
                      className={`p-6 rounded-2xl border transition-all space-y-4 ${
                        isAwaitingConsent ? 'border-amber-200 bg-amber-50/30' : 'border-[#F4DDE2] bg-[#FAF8FC]'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-full bg-[#EDE4F7] text-[#936DA2] font-bold text-base flex items-center justify-center flex-shrink-0">
                            {conn.recipientName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-base text-[#201538]">{conn.recipientName}</h4>
                              {isAwaitingConsent ? (
                                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[11px] font-bold rounded-full border border-amber-200 flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> Awaiting Your Consent
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full border border-emerald-200 flex items-center gap-1">
                                  <Check className="w-3 h-3" /> Sharing Active
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#7A6F75] mt-0.5">{conn.recipientEmail}</p>
                            <p className="text-xs text-[#936DA2] font-semibold mt-0.5">
                              Declared Relationship: <span className="text-[#201538]">{conn.relationship}</span>
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
                          {isAwaitingConsent ? (
                            <button
                              onClick={() => openConsentModal(conn)}
                              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <KeyRound className="w-3.5 h-3.5" /> Review & Approve Consent
                            </button>
                          ) : (
                            <button
                              onClick={() => openConsentModal(conn)}
                              className="px-3.5 py-2 bg-white hover:bg-purple-50 text-[#936DA2] border border-[#F4DDE2] text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <SlidersHorizontal className="w-3.5 h-3.5" /> Manage Permissions
                            </button>
                          )}

                          <button
                            onClick={() => setDetailsModalConnection(conn)}
                            className="px-3.5 py-2 bg-white hover:bg-purple-50 text-[#7A6F75] border border-[#F4DDE2] text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" /> Details
                          </button>

                          <button
                            onClick={() => setRevokeModalConnection(conn)}
                            className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Revoke Access
                          </button>
                        </div>
                      </div>

                      {/* Accessible Categories Indicator */}
                      <div className="pt-2 border-t border-[#F4DDE2]/60">
                        {isAwaitingConsent ? (
                          <div className="text-xs text-amber-800 font-medium flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                            <span>Connection established. This companion cannot view any health data until you complete explicit consent approval.</span>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <div className="text-[11px] font-bold uppercase text-[#7A6F75]">Active Sharing Permissions:</div>
                            <div className="flex flex-wrap gap-2">
                              {categoryDefinitions.map((cat) => {
                                const isPermitted = (conn.permissions as any)?.[cat.id] === true;
                                return (
                                  <span
                                    key={cat.id}
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1 border ${
                                      isPermitted
                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                        : 'bg-gray-50 text-gray-400 border-gray-200'
                                    }`}
                                  >
                                    {isPermitted ? <Check className="w-3 h-3 text-emerald-600" /> : <Lock className="w-3 h-3 text-gray-400" />}
                                    {cat.title}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section C: Pending Outgoing Requests */}
          {pendingRequests.length > 0 && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#F4DDE2] shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-amber-700">
                <Clock className="w-5 h-5 text-amber-600" />
                <h3 className="font-serif text-2xl font-bold text-[#201538]">Pending Connection Requests ({pendingRequests.length})</h3>
              </div>
              <p className="text-xs text-[#7A6F75]">
                Awaiting acceptance by the recipient companion. Protected health information is completely inaccessible while requests are pending.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {pendingRequests.map((req) => (
                  <div key={req.id} className="p-4 rounded-2xl border border-amber-200 bg-amber-50/40 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#201538]">{req.recipientName}</h4>
                      <p className="text-xs text-[#7A6F75]">{req.recipientEmail}</p>
                      <p className="text-xs text-[#936DA2] font-semibold mt-1">
                        Declared Relationship: <span className="text-[#201538]">{req.relationship}</span>
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Sent: {new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>

                    <button
                      onClick={() => handleCancelRequest(req.id)}
                      className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Cancel Request
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section D: Connection History (Rejected / Cancelled / Revoked) */}
          {(rejectedCancelled.length > 0 || revokedHistory.length > 0) && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#F4DDE2] shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#7A6F75]">
                <History className="w-5 h-5" />
                <h3 className="font-serif text-xl font-bold text-[#201538]">Connection History</h3>
              </div>

              <div className="divide-y divide-[#F4DDE2]/60">
                {[...rejectedCancelled, ...revokedHistory].map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#201538]">{item.recipientName}</span>
                      <span className="text-gray-400 ml-2">({item.recipientEmail})</span>
                      <span className="text-gray-400 ml-2">• Stated: {item.relationship}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                        item.status === 'Revoked' ? 'bg-gray-100 text-gray-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ACCESS HISTORY & PRIVACY AUDIT LOG */}
      {/* ========================================================================= */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#F4DDE2] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-[#936DA2]">
                <Shield className="w-5 h-5 text-emerald-600" />
                <h3 className="font-serif text-2xl font-bold text-[#201538]">Access History & Privacy Audit Trail</h3>
              </div>
              <p className="text-xs text-[#7A6F75] mt-1">
                Cryptographically preserved audit log of connection requests, explicit consent approvals, permission changes, and companion access attempts.
              </p>
            </div>
            <button
              onClick={fetchAccessHistory}
              className="px-4 py-2 bg-[#FAF8FC] border border-[#F4DDE2] text-[#936DA2] text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer hover:bg-purple-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingHistory ? 'animate-spin' : ''}`} /> Refresh Trail
            </button>
          </div>

          {isLoadingHistory ? (
            <div className="py-12 flex flex-col items-center justify-center text-xs text-[#7A6F75] gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-[#936DA2]" />
              <span>Fetching audit events from backend...</span>
            </div>
          ) : accessHistory.length === 0 ? (
            <div className="py-12 text-center border-2 border-dashed border-[#F4DDE2] rounded-2xl p-6">
              <History className="w-10 h-10 text-purple-300 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-[#201538]">No Audit Events Yet</h4>
              <p className="text-xs text-[#7A6F75] mt-1">
                Connection requests, consent updates, and data access attempts will be recorded here automatically.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#F4DDE2]/60">
              {accessHistory.map((event) => {
                const dateStr = new Date(event.timestamp).toLocaleString();
                const isDenied = event.status === 'Denied' || event.eventType === 'ACCESS_DENIED';
                const isRevoked = event.status === 'Revoked' || event.eventType === 'REVOKE_CONNECTION' || event.eventType === 'CONNECTION_REVOKED';

                return (
                  <div key={event.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF8FC]/50 px-2 rounded-xl transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                          isDenied
                            ? 'bg-rose-100 text-rose-800'
                            : isRevoked
                            ? 'bg-gray-100 text-gray-800'
                            : event.eventType.includes('CONSENT')
                            ? 'bg-purple-100 text-[#936DA2]'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {event.eventType}
                        </span>
                        <span className="text-xs font-bold text-[#201538]">{event.description}</span>
                      </div>

                      <div className="text-[11px] text-[#7A6F75] flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span>Companion: <strong className="text-[#201538]">{event.companionName}</strong></span>
                        {event.categoryLabel && (
                          <span>Category: <strong className="text-[#936DA2]">{event.categoryLabel}</strong></span>
                        )}
                        {event.previousState && event.newState && (
                          <span>State: {event.previousState} &rarr; <strong className="text-[#201538]">{event.newState}</strong></span>
                        )}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-[11px] font-semibold text-[#201538]">{dateStr}</div>
                      <div className={`text-[10px] font-bold ${isDenied ? 'text-rose-600' : 'text-emerald-600'}`}>
                        Outcome: {event.status}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: EXPLICIT CONSENT & PERMISSION MANAGEMENT */}
      {/* ========================================================================= */}
      {consentModalConnection && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-[#F4DDE2] space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F4DDE2] pb-4">
              <div>
                <span className="px-2.5 py-0.5 bg-[#EDE4F7] text-[#936DA2] text-[10px] font-bold rounded-full uppercase">
                  {consentModalConnection.consent_status === 'awaiting_consent' ? 'Initial Consent Approval' : 'Manage Permissions'}
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#201538] mt-1">
                  Data-Sharing Consent for {consentModalConnection.recipientName}
                </h3>
              </div>
              <button 
                onClick={() => setConsentModalConnection(null)} 
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-1 rounded-full hover:bg-gray-100"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#7A6F75]">
              Select exactly which health categories this companion is authorized to view. Permissions are NOT granted by default. You can modify or revoke access anytime.
            </p>

            {/* Category Toggles */}
            <div className="space-y-3">
              {categoryDefinitions.map((cat) => {
                const isChecked = (modalPermissions as any)[cat.id] === true;
                const IconComponent = cat.icon;

                return (
                  <div
                    key={cat.id}
                    onClick={() => setModalPermissions({ ...modalPermissions, [cat.id]: !isChecked })}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isChecked ? 'border-[#936DA2] bg-[#FAF8FC]' : 'border-[#F4DDE2] bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl ${cat.color} flex-shrink-0 mt-0.5`}>
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-[#201538]">{cat.title}</h4>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by parent div click
                          className="w-4 h-4 rounded text-[#936DA2] focus:ring-[#936DA2] cursor-pointer"
                        />
                      </div>
                      <p className="text-[11px] text-[#7A6F75] mt-0.5">{cat.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-[#F4DDE2] flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                onClick={() => setConsentModalConnection(null)}
                className="w-full sm:w-auto px-5 py-2.5 border border-[#F4DDE2] hover:bg-gray-50 text-xs font-bold text-[#7A6F75] rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConsentOrPermissions}
                disabled={isSavingConsent}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#936DA2] hover:bg-[#835A92] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSavingConsent ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Confirm & Apply Consent
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: REVOKE CONNECTION CONFIRMATION */}
      {/* ========================================================================= */}
      {revokeModalConnection && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-rose-200 space-y-5">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="font-serif text-xl font-bold text-[#201538]">Revoke Companion Access?</h3>
              <p className="text-xs text-[#7A6F75]">
                Are you sure you want to stop sharing health data with <strong>{revokeModalConnection.recipientName}</strong>?
              </p>
              <div className="p-3 bg-rose-50 rounded-xl text-rose-800 text-[11px] text-left mt-3">
                &bull; They will immediately lose access to all your records, cycles, and logs.<br/>
                &bull; Your original records will remain safely intact in your FemSphere vault.<br/>
                &bull; This revocation will be recorded in your privacy audit trail.
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setRevokeModalConnection(null)}
                className="flex-1 py-2.5 border border-[#F4DDE2] hover:bg-gray-50 text-xs font-bold text-[#7A6F75] rounded-xl cursor-pointer"
              >
                Keep Active
              </button>
              <button
                onClick={handleRevokeConnection}
                disabled={isRevoking}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isRevoking ? <RefreshCw className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                Revoke Access
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: CONNECTION DETAILS */}
      {/* ========================================================================= */}
      {detailsModalConnection && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-[#F4DDE2] space-y-5">
            <div className="flex items-center justify-between border-b border-[#F4DDE2] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#201538]">Connection Details</h3>
              <button 
                onClick={() => setDetailsModalConnection(null)} 
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#FAF8FC] rounded-xl space-y-1">
                <div className="text-gray-400 text-[11px]">Companion Name & Email</div>
                <div className="font-bold text-[#201538] text-sm">{detailsModalConnection.recipientName}</div>
                <div className="text-[#7A6F75]">{detailsModalConnection.recipientEmail}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#FAF8FC] rounded-xl">
                  <div className="text-gray-400 text-[11px]">Declared Relationship</div>
                  <div className="font-bold text-[#936DA2] mt-0.5">{detailsModalConnection.relationship}</div>
                </div>
                <div className="p-3 bg-[#FAF8FC] rounded-xl">
                  <div className="text-gray-400 text-[11px]">Connection Status</div>
                  <div className="font-bold text-emerald-700 mt-0.5">{detailsModalConnection.status}</div>
                </div>
              </div>

              <div className="p-3 bg-[#FAF8FC] rounded-xl">
                <div className="text-gray-400 text-[11px]">Consent Status</div>
                <div className="font-bold text-[#201538] mt-0.5">
                  {detailsModalConnection.consent_status === 'consent_granted' ? 'Explicit Consent Approved' : 'Awaiting Female User Approval'}
                </div>
                {detailsModalConnection.consentGrantedAt && (
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    Consent Approved on: {new Date(detailsModalConnection.consentGrantedAt).toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setDetailsModalConnection(null)}
                className="px-5 py-2 bg-[#936DA2] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
