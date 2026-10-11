import React, { useState, useEffect } from 'react';
import { 
  Users, CheckCircle2, XCircle, Clock, Shield, Activity, 
  Droplet, Calendar, FileText, ChevronRight, AlertCircle, RefreshCw, Eye,
  Lock, Send, HeartPulse, Stethoscope, FileCheck, Info
} from 'lucide-react';
import { useCaregiver } from '../../context/CaregiverContext';

interface IncomingRequest {
  id: number;
  senderId: number;
  senderUsername: string;
  senderEmail: string;
  senderName: string;
  relationship: string;
  status: 'pending' | 'accepted' | 'rejected' | 'revoked';
  consent_status?: 'awaiting_consent' | 'consent_granted' | 'consent_revoked';
  createdAt: string;
  permissions: {
    daily_activities: boolean;
    menstrual_cycle: boolean;
    symptoms_notes: boolean;
    medical_records: boolean;
    appointments: boolean;
  };
}

interface SharedDataView {
  connectionId: number;
  patient: {
    id: number;
    name: string;
    email: string;
    bloodGroup?: string;
    lifeStage?: string;
    relationship: string;
  };
  permissions: {
    daily_activities: boolean;
    menstrual_cycle: boolean;
    symptoms_notes: boolean;
    medical_records: boolean;
    appointments: boolean;
  };
  data: {
    daily_activities?: {
      steps: number;
      sleep_hours: string;
      water_liters: number;
      heart_rate: number;
      recentLogs: any[];
    } | null;
    menstrual_cycle?: {
      cyclePhase: string;
      cycleDay: number;
      nextExpectedPeriod: string;
      fertileWindow?: string | null;
    } | null;
    symptoms_notes?: any[] | null;
    medical_records?: any[] | null;
    appointments?: any[] | null;
  };
}

export default function CaregiverDependents() {
  const { dependents } = useCaregiver(); // Preserves existing stored dependents in read-only mode

  const [pendingRequests, setPendingRequests] = useState<IncomingRequest[]>([]);
  const [activeConnections, setActiveConnections] = useState<IncomingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [requestingCatId, setRequestingCatId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Modal / drawer to inspect shared data
  const [viewingSharedData, setViewingSharedData] = useState<SharedDataView | null>(null);
  const [isLoadingSharedData, setIsLoadingSharedData] = useState(false);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('femsphere_token');
      const res = await fetch('/api/connections/incoming', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPendingRequests(data.pendingRequests || []);
        setActiveConnections(data.activeConnections || []);
      }
    } catch (err) {
      console.error('Error fetching incoming connections:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRequest = async (id: number) => {
    setProcessingId(id);
    setFeedback(null);
    try {
      const token = localStorage.getItem('femsphere_token');
      const res = await fetch(`/api/connections/${id}/accept`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ 
          type: 'success', 
          message: 'Connection established! Note: In accordance with FemSphere data privacy policy, the user will now review and grant explicit data-sharing consent before health records appear.' 
        });
        fetchConnections();
      } else {
        setFeedback({ type: 'error', message: data.message || 'Failed to accept connection.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Network error accepting request.' });
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectRequest = async (id: number) => {
    setProcessingId(id);
    setFeedback(null);
    try {
      const token = localStorage.getItem('femsphere_token');
      const res = await fetch(`/api/connections/${id}/reject`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'info', message: 'Connection request declined.' });
        fetchConnections();
      } else {
        setFeedback({ type: 'error', message: data.message || 'Failed to decline request.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Network error declining request.' });
    } finally {
      setProcessingId(null);
    }
  };

  const handleViewSharedData = async (conn: IncomingRequest) => {
    if (conn.consent_status === 'awaiting_consent') {
      setFeedback({
        type: 'info',
        message: `${conn.senderName} has not yet approved data-sharing permissions for this connection. Once they review and approve categories, health information will be accessible.`
      });
      return;
    }
    if (conn.consent_status === 'consent_revoked') {
      setFeedback({
        type: 'error',
        message: `Data sharing access has been revoked by ${conn.senderName}.`
      });
      return;
    }

    setIsLoadingSharedData(true);
    try {
      const token = localStorage.getItem('femsphere_token');
      const res = await fetch(`/api/connections/${conn.id}/shared-data`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.sharedHealth) {
        setViewingSharedData(data.sharedHealth);
      } else {
        setFeedback({ type: 'error', message: data.message || 'Unable to load shared data.' });
      }
    } catch (err) {
      console.error('Error viewing shared data:', err);
      setFeedback({ type: 'error', message: 'Failed to retrieve shared health records.' });
    } finally {
      setIsLoadingSharedData(false);
    }
  };

  const handleRequestCategory = async (connectionId: number, category: string, label: string) => {
    const key = `${connectionId}-${category}`;
    setRequestingCatId(key);
    try {
      const token = localStorage.getItem('femsphere_token');
      const res = await fetch(`/api/connections/${connectionId}/request-category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ category })
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({
          type: 'success',
          message: `Request for "${label}" sent. The care recipient has been notified to review and approve access.`
        });
      } else {
        setFeedback({ type: 'error', message: data.message || 'Failed to request category access.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Network error submitting category access request.' });
    } finally {
      setRequestingCatId(null);
    }
  };

  const categories = [
    { key: 'daily_activities', label: 'Daily Activities & Vitals', icon: Activity },
    { key: 'menstrual_cycle', label: 'Cycle & Ovulation Info', icon: Droplet },
    { key: 'symptoms_notes', label: 'Daily Symptoms & Notes', icon: HeartPulse },
    { key: 'medical_records', label: 'Medical Records & Reports', icon: FileText },
    { key: 'appointments', label: 'Doctor Appointments', icon: Calendar }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#F4DDE2] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#936DA2] mb-1">
            <Users className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Care Recipient Network</span>
          </div>
          <h3 className="font-serif text-3xl font-bold text-[#3a3135]">Connected Care Recipients</h3>
          <p className="text-xs text-[#7a6f75] mt-1">
            Female users own their accounts and manage explicit consent permissions. Review incoming connection requests and monitor explicitly authorized health telemetry below.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-2xl border border-purple-100 text-xs font-semibold text-[#936DA2]">
          <Shield className="w-4 h-4 text-emerald-600" /> Explicit Consent Protected
        </div>
      </div>

      {/* Global Feedback Banner */}
      {feedback && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
          feedback.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : feedback.type === 'info'
            ? 'bg-blue-50 border-blue-200 text-blue-800'
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <div className="flex items-center gap-2.5 text-xs font-medium">
            {feedback.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
            {feedback.type === 'info' && <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />}
            {feedback.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-xs font-bold opacity-60 hover:opacity-100 cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* 1. INCOMING CONNECTION REQUESTS (Prompt Section 4) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#F4DDE2] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#936DA2]">
            <Clock className="w-5 h-5 text-amber-500" />
            <h4 className="font-serif text-2xl font-bold text-[#3a3135]">Incoming Connection Requests</h4>
          </div>
          <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
            {pendingRequests.length} Pending
          </span>
        </div>
        <p className="text-xs text-[#7a6f75]">
          Female users requesting to link with your caregiver account. Accepting establishes the connection only; the female user will then review and explicitly grant data-sharing consent before health records become visible.
        </p>

        {pendingRequests.length === 0 ? (
          <div className="p-8 text-center bg-[#FAF8FC] rounded-2xl border border-dashed border-[#F4DDE2] space-y-1">
            <CheckCircle2 className="w-7 h-7 text-[#936DA2] mx-auto opacity-70" />
            <p className="text-xs font-bold text-[#3a3135]">No Pending Requests</p>
            <p className="text-xs text-[#7a6f75]">You are up to date. When a female user sends a connection request, it will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="p-5 rounded-2xl border border-amber-200 bg-amber-50/20 hover:border-amber-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 font-bold text-base flex items-center justify-center flex-shrink-0">
                    {req.senderName.charAt(0).toUpperCase()}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h5 className="font-bold text-base text-[#3a3135]">{req.senderName}</h5>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-md">
                        Awaiting Response
                      </span>
                    </div>
                    <p className="text-xs text-[#7a6f75]">
                      {req.senderEmail} • Stated Relationship: <span className="font-bold text-[#936DA2]">{req.relationship}</span>
                    </p>
                    <div className="text-[11px] text-[#8E859E] flex items-center gap-2 pt-1">
                      <Shield className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                      <span>Acceptance links accounts only; data categories require explicit user consent after acceptance.</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end md:self-auto">
                  <button
                    disabled={processingId === req.id}
                    onClick={() => handleRejectRequest(req.id)}
                    className="px-4 py-2 border border-rose-300 bg-white hover:bg-rose-50 text-rose-700 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Decline
                  </button>
                  <button
                    disabled={processingId === req.id}
                    onClick={() => handleAcceptRequest(req.id)}
                    className="px-5 py-2 bg-[#936DA2] hover:bg-[#835A92] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {processingId === req.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    Accept Connection
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. ACTIVE CONNECTED FEMALE PROFILES (Prompt Sections 5 & 8) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#F4DDE2] shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
            <h4 className="font-serif text-2xl font-bold text-[#3a3135]">Active Connected Care Recipients</h4>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
            {activeConnections.length} Active
          </span>
        </div>

        {activeConnections.length === 0 ? (
          <div className="p-8 text-center bg-[#FAF8FC] rounded-2xl border border-dashed border-[#F4DDE2] space-y-2">
            <Users className="w-8 h-8 text-[#936DA2] mx-auto opacity-70" />
            <p className="text-xs font-bold text-[#3a3135]">No Active Connections Yet</p>
            <p className="text-xs text-[#7a6f75] max-w-md mx-auto">
              Once you accept a connection request and the user approves data-sharing consent, their profile and permitted telemetry will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {activeConnections.map((conn) => {
              const isAwaitingConsent = conn.consent_status === 'awaiting_consent';
              const isRevoked = conn.consent_status === 'consent_revoked';
              const isConsentGranted = conn.consent_status === 'consent_granted';

              return (
                <div
                  key={conn.id}
                  className="p-6 rounded-3xl border border-[#F4DDE2] bg-[#FAF8FC] space-y-4 hover:border-[#936DA2] transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#936DA2] font-bold text-lg flex items-center justify-center">
                          {conn.senderName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h5 className="font-bold text-base text-[#3a3135]">{conn.senderName}</h5>
                          <p className="text-xs text-[#7a6f75]">{conn.senderEmail}</p>
                        </div>
                      </div>

                      {/* Consent Status Badge */}
                      {isAwaitingConsent && (
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-bold rounded-md flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600" /> Awaiting User Consent
                        </span>
                      )}
                      {isConsentGranted && (
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold rounded-md flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Consent Active
                        </span>
                      )}
                      {isRevoked && (
                        <span className="px-2.5 py-1 bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-bold rounded-md flex items-center gap-1">
                          <XCircle className="w-3 h-3 text-rose-600" /> Consent Revoked
                        </span>
                      )}
                    </div>

                    <div className="p-3 rounded-2xl bg-white border border-[#F4DDE2] space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-[#7a6f75]">Relationship:</span>
                        <span className="font-bold text-[#936DA2]">{conn.relationship}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#7a6f75]">Connected Since:</span>
                        <span className="font-medium text-[#3a3135]">
                          {conn.createdAt ? new Date(conn.createdAt).toLocaleDateString() : 'Active'}
                        </span>
                      </div>
                    </div>

                    {/* Notice for awaiting consent */}
                    {isAwaitingConsent && (
                      <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span>
                          The care recipient has connected with you but has not yet approved data-sharing permissions. Protected records will appear here as soon as they authorize consent.
                        </span>
                      </div>
                    )}

                    {/* Category Visibility & Granular Permission Badges */}
                    <div className="space-y-2 pt-1">
                      <span className="text-[10px] font-bold text-[#7a6f75] uppercase tracking-wider block">
                        Category Access Visibility
                      </span>
                      <div className="space-y-1.5">
                        {categories.map((cat) => {
                          const isPermitted = conn.permissions && (conn.permissions as any)[cat.key] === true && isConsentGranted;
                          const CatIcon = cat.icon;
                          const reqKey = `${conn.id}-${cat.key}`;
                          const isRequestingThis = requestingCatId === reqKey;

                          return (
                            <div 
                              key={cat.key}
                              className={`p-2 rounded-xl border flex items-center justify-between text-xs transition-all ${
                                isPermitted 
                                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900' 
                                  : 'bg-white border-gray-200 text-gray-500'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <CatIcon className={`w-3.5 h-3.5 ${isPermitted ? 'text-emerald-600' : 'text-gray-400'}`} />
                                <span className={isPermitted ? 'font-semibold' : 'text-gray-600'}>{cat.label}</span>
                              </div>

                              <div>
                                {isPermitted ? (
                                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Authorized
                                  </span>
                                ) : (
                                  <button
                                    disabled={isRequestingThis || isRevoked}
                                    onClick={() => handleRequestCategory(conn.id, cat.key, cat.label)}
                                    className="px-2.5 py-1 rounded-lg border border-purple-200 bg-purple-50 hover:bg-purple-100 text-[#936DA2] text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all disabled:opacity-50"
                                    title="Request permission from care recipient"
                                  >
                                    {isRequestingThis ? (
                                      <RefreshCw className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <Send className="w-3 h-3" />
                                    )}
                                    Request Access
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      disabled={isAwaitingConsent || isRevoked || isLoadingSharedData}
                      onClick={() => handleViewSharedData(conn)}
                      className="w-full py-2.5 px-4 bg-[#936DA2] hover:bg-[#835A92] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Eye className="w-4 h-4" /> 
                      {isAwaitingConsent 
                        ? 'Awaiting Patient Consent' 
                        : isRevoked 
                        ? 'Access Revoked' 
                        : 'View Authorized Health Telemetry'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. STORED LEGACY PROFILES (Preserved Read-Only) */}
      {dependents.length > 0 && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#F4DDE2] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-serif text-xl font-bold text-[#3a3135]">Existing Family Profiles (Preserved)</h4>
              <p className="text-xs text-[#7a6f75] mt-0.5">
                Previously linked dependent records are preserved in read-only mode. New connections are managed through consent requests.
              </p>
            </div>
            <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">
              {dependents.length} Preserved
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
            {dependents.map((dep) => (
              <div key={dep.id} className="p-4 rounded-2xl border border-[#F4DDE2] bg-[#FAF8FC] space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#936DA2] font-bold text-xs flex items-center justify-center">
                    {dep.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-[#3a3135]">{dep.name}</h5>
                    <span className="text-[10px] text-[#936DA2] font-semibold">{dep.relation}</span>
                  </div>
                </div>
                <div className="text-[11px] text-[#7a6f75] pt-1 border-t border-[#F4DDE2]/60 flex justify-between">
                  <span>DOB: {dep.dob}</span>
                  <span>Blood: {dep.bloodGroup}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SHARED DATA MODAL (Prompt Section 5) */}
      {viewingSharedData && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-[#F4DDE2] shadow-xl p-6 md:p-8 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-[#F4DDE2] pb-4">
              <div>
                <span className="text-[10px] font-bold text-[#936DA2] uppercase tracking-wider">
                  Permitted Telemetry Feed (Read-Only)
                </span>
                <h4 className="font-serif text-2xl font-bold text-[#3a3135]">
                  {viewingSharedData.patient.name}'s Health Overview
                </h4>
                <p className="text-xs text-[#7a6f75]">
                  Relationship: {viewingSharedData.patient.relationship} • {viewingSharedData.patient.email}
                </p>
              </div>
              <button
                onClick={() => setViewingSharedData(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Read-only Security Notice */}
            <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 text-xs text-[#936DA2] flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>
                Protected Health Information: This data is shared read-only under active patient consent. Caregivers cannot edit or alter records.
              </span>
            </div>

            {/* 1. Daily Vitals (if permitted) */}
            {viewingSharedData.permissions.daily_activities && viewingSharedData.data.daily_activities ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-emerald-700">
                  <Activity className="w-4 h-4" />
                  <h5 className="font-bold text-sm">Today's Vitals & Activity</h5>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                    <span className="text-[10px] uppercase font-bold text-emerald-800">Steps</span>
                    <div className="text-lg font-bold text-[#3a3135]">{viewingSharedData.data.daily_activities.steps.toLocaleString()}</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-purple-50/50 border border-purple-100">
                    <span className="text-[10px] uppercase font-bold text-purple-800">Sleep</span>
                    <div className="text-lg font-bold text-[#3a3135]">{viewingSharedData.data.daily_activities.sleep_hours}h</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-blue-50/50 border border-blue-100">
                    <span className="text-[10px] uppercase font-bold text-blue-800">Water</span>
                    <div className="text-lg font-bold text-[#3a3135]">{viewingSharedData.data.daily_activities.water_liters} L</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-rose-50/50 border border-rose-100">
                    <span className="text-[10px] uppercase font-bold text-rose-800">Heart Rate</span>
                    <div className="text-lg font-bold text-[#3a3135]">{viewingSharedData.data.daily_activities.heart_rate} bpm</div>
                  </div>
                </div>
              </div>
            ) : !viewingSharedData.permissions.daily_activities && (
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-500 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gray-400" />
                  <span>Daily activities sharing is not authorized by the care recipient.</span>
                </div>
                <button
                  onClick={() => handleRequestCategory(viewingSharedData.connectionId, 'daily_activities', 'Daily Activities')}
                  className="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-[#936DA2] rounded-lg border border-purple-200 text-[10px] font-bold cursor-pointer"
                >
                  Request Access
                </button>
              </div>
            )}

            {/* 2. Menstrual Cycle (if permitted) */}
            {viewingSharedData.permissions.menstrual_cycle && viewingSharedData.data.menstrual_cycle ? (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-rose-700">
                  <Droplet className="w-4 h-4" />
                  <h5 className="font-bold text-sm">Menstrual Cycle Overview</h5>
                </div>
                <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-100 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#7a6f75]">Current Phase:</span>
                    <span className="font-bold text-rose-700">{viewingSharedData.data.menstrual_cycle.cyclePhase} (Day {viewingSharedData.data.menstrual_cycle.cycleDay})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7a6f75]">Next Expected Period:</span>
                    <span className="font-medium text-[#3a3135]">{viewingSharedData.data.menstrual_cycle.nextExpectedPeriod}</span>
                  </div>
                  {viewingSharedData.data.menstrual_cycle.fertileWindow && (
                    <div className="flex justify-between">
                      <span className="text-[#7a6f75]">Fertile Window:</span>
                      <span className="font-medium text-[#3a3135]">{viewingSharedData.data.menstrual_cycle.fertileWindow}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : !viewingSharedData.permissions.menstrual_cycle && (
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-500 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gray-400" />
                  <span>Cycle & ovulation sharing is not authorized by the care recipient.</span>
                </div>
                <button
                  onClick={() => handleRequestCategory(viewingSharedData.connectionId, 'menstrual_cycle', 'Cycle Information')}
                  className="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-[#936DA2] rounded-lg border border-purple-200 text-[10px] font-bold cursor-pointer"
                >
                  Request Access
                </button>
              </div>
            )}

            {/* 3. Symptoms & Daily Health Notes (if permitted) */}
            {viewingSharedData.permissions.symptoms_notes && viewingSharedData.data.symptoms_notes ? (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-pink-700">
                  <HeartPulse className="w-4 h-4" />
                  <h5 className="font-bold text-sm">Symptoms & Health Notes</h5>
                </div>
                {viewingSharedData.data.symptoms_notes.length > 0 ? (
                  <div className="space-y-2">
                    {viewingSharedData.data.symptoms_notes.map((sym: any) => (
                      <div key={sym.id} className="p-3 rounded-xl bg-pink-50/40 border border-pink-100 flex justify-between items-start text-xs">
                        <div className="space-y-0.5">
                          <div className="font-bold text-[#3a3135]">{sym.symptom_name}</div>
                          {sym.notes && <div className="text-[11px] text-[#7a6f75] italic">"{sym.notes}"</div>}
                          <div className="text-[10px] text-gray-400">Recorded: {new Date(sym.onset_date || sym.created_at).toLocaleDateString()}</div>
                        </div>
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          sym.severity === 'Severe' 
                            ? 'bg-rose-100 text-rose-800' 
                            : sym.severity === 'Moderate'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {sym.severity || 'Mild'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#7a6f75]">No symptom notes recorded recently.</p>
                )}
              </div>
            ) : !viewingSharedData.permissions.symptoms_notes && (
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-500 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gray-400" />
                  <span>Daily symptoms and health notes sharing is not authorized.</span>
                </div>
                <button
                  onClick={() => handleRequestCategory(viewingSharedData.connectionId, 'symptoms_notes', 'Symptoms & Notes')}
                  className="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-[#936DA2] rounded-lg border border-purple-200 text-[10px] font-bold cursor-pointer"
                >
                  Request Access
                </button>
              </div>
            )}

            {/* 4. Upcoming Appointments (if permitted) */}
            {viewingSharedData.permissions.appointments && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-purple-700">
                  <Calendar className="w-4 h-4" />
                  <h5 className="font-bold text-sm">Appointments</h5>
                </div>
                {viewingSharedData.data.appointments && viewingSharedData.data.appointments.length > 0 ? (
                  <div className="space-y-2">
                    {viewingSharedData.data.appointments.map((apt: any) => (
                      <div key={apt.id} className="p-3 rounded-xl bg-purple-50/30 border border-purple-100 flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold text-[#3a3135]">{apt.doctor_name || 'Clinical Consultation'}</div>
                          <div className="text-[11px] text-[#7a6f75]">{apt.appointment_date} at {apt.appointment_time || apt.time_slot}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 font-bold text-[10px]">
                          {apt.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#7a6f75]">No upcoming consultations scheduled.</p>
                )}
              </div>
            )}
            {!viewingSharedData.permissions.appointments && (
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-500 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gray-400" />
                  <span>Doctor appointments sharing is not authorized.</span>
                </div>
                <button
                  onClick={() => handleRequestCategory(viewingSharedData.connectionId, 'appointments', 'Doctor Appointments')}
                  className="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-[#936DA2] rounded-lg border border-purple-200 text-[10px] font-bold cursor-pointer"
                >
                  Request Access
                </button>
              </div>
            )}

            {/* 5. Medical Records (if permitted) */}
            {viewingSharedData.permissions.medical_records && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-amber-700">
                  <FileText className="w-4 h-4" />
                  <h5 className="font-bold text-sm">Medical Records & Lab Reports</h5>
                </div>
                {viewingSharedData.data.medical_records && viewingSharedData.data.medical_records.length > 0 ? (
                  <div className="space-y-2">
                    {viewingSharedData.data.medical_records.map((rec: any) => (
                      <div key={rec.id} className="p-3 rounded-xl bg-amber-50/30 border border-amber-100 flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold text-[#3a3135]">{rec.title}</div>
                          <div className="text-[11px] text-[#7a6f75]">{rec.category || 'Clinical Record'} • {rec.uploaded_at ? new Date(rec.uploaded_at).toLocaleDateString() : 'Uploaded'}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                          Verified
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#7a6f75]">No clinical documents uploaded.</p>
                )}
              </div>
            )}
            {!viewingSharedData.permissions.medical_records && (
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-500 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gray-400" />
                  <span>Medical reports and lab results sharing is not authorized.</span>
                </div>
                <button
                  onClick={() => handleRequestCategory(viewingSharedData.connectionId, 'medical_records', 'Medical Records')}
                  className="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-[#936DA2] rounded-lg border border-purple-200 text-[10px] font-bold cursor-pointer"
                >
                  Request Access
                </button>
              </div>
            )}

            <div className="pt-4 border-t border-[#F4DDE2] flex justify-end">
              <button
                onClick={() => setViewingSharedData(null)}
                className="px-6 py-2 bg-[#936DA2] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-[#835A92]"
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
