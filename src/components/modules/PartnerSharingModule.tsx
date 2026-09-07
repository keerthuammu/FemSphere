import React, { useState, useEffect } from 'react';
import { Heart, Lock, Unlock, Shield, Check, Trash2, UserPlus, AlertCircle } from 'lucide-react';

export default function PartnerSharingModule() {
  const [partnerEmail, setPartnerEmail] = useState('');
  const [partnerData, setPartnerData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeConsentId, setActiveConsentId] = useState<number | null>(null);

  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    Wellbeing: true,
    CycleStatus: true,
    Appointments: true,
    PregnancyUpdates: false,
    PrivateJournal: false, // Locked by default
    MedicalDocuments: false // Locked by default
  });

  useEffect(() => {
    fetchConsents();
  }, []);

  const fetchConsents = async () => {
    try {
      const token = localStorage.getItem('femsphere_token');
      const res = await fetch('/api/privacy/consents', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.consents.length > 0) {
        const partnerConsent = data.consents.find((c: any) => c.status === 'Granted');
        if (partnerConsent) {
          setPartnerData(partnerConsent);
          setActiveConsentId(partnerConsent.id);
        }
      }
    } catch (e) {
      console.error('Error fetching consents', e);
    }
  };

  const togglePermission = (key: string) => {
    if (key === 'PrivateJournal') return; // Cannot unlock private journal
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleGrantAccess = async () => {
    if (!partnerEmail) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem('femsphere_token');
      // Create relationship first
      await fetch('/api/privacy/relationships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ relatedEmail: partnerEmail, relationshipType: 'Partner' })
      });

      // Grant consent
      const selectedPerms = Object.keys(permissions).filter(k => permissions[k]);
      const res = await fetch('/api/privacy/consents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          relatedUserId: 3, // Target partner ID
          consentType: 'PARTNER_SHARING',
          permissions: selectedPerms
        })
      });

      const data = await res.json();
      if (data.success) {
        setPartnerData(data.consent);
        setActiveConsentId(data.consent.id);
      }
    } catch (e) {
      console.error('Error granting access', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeAccess = async () => {
    if (!activeConsentId) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem('femsphere_token');
      await fetch(`/api/privacy/consents/${activeConsentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setPartnerData(null);
      setActiveConsentId(null);
    } catch (e) {
      console.error('Error revoking consent', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#EDE9FE] shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
            ❤️
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#3a3135]">Partner Mode (Granular Health Sharing)</h3>
            <p className="text-xs text-[#7a6f75]">You own your health data. Choose exactly what your partner can view with instant revocation.</p>
          </div>
        </div>

        {partnerData && (
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Partner Access Granted
          </span>
        )}
      </div>

      {!partnerData ? (
        <div className="bg-[#FAF8FC] p-5 rounded-2xl border border-[#EDE9FE] space-y-4">
          <h4 className="font-bold text-xs text-[#7C3AED] uppercase tracking-wider">Grant Partner Access</h4>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1.5">Partner Email / Username</label>
              <input
                type="text"
                value={partnerEmail}
                onChange={(e) => setPartnerEmail(e.target.value)}
                placeholder="partner@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] outline-none text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1.5">Configure Shared Resources</label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(permissions).map((key) => {
                  const allowed = permissions[key];
                  const isLocked = key === 'PrivateJournal' || key === 'MedicalDocuments';
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => togglePermission(key)}
                      disabled={isLocked}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-all ${
                        isLocked
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                          : allowed
                          ? 'bg-[#7C3AED] text-white border-[#7C3AED]'
                          : 'bg-white text-gray-600 border-[#EDE9FE]'
                      }`}
                    >
                      {isLocked ? <Lock className="w-3 h-3" /> : allowed ? <Unlock className="w-3 h-3" /> : null}
                      <span>{key}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <button
            onClick={handleGrantAccess}
            disabled={isLoading || !partnerEmail}
            className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Grant Consented Partner Access</span>
          </button>
        </div>
      ) : (
        <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-xs text-rose-800 uppercase tracking-wider">Active Consented Partner</h4>
              <p className="text-xs text-[#3a3135] font-semibold mt-0.5">{partnerData.related_email || 'partner@femsphere.health'}</p>
            </div>

            <button
              onClick={handleRevokeAccess}
              disabled={isLoading}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Revoke Partner Access Immediately</span>
            </button>
          </div>

          <div className="p-3 bg-white rounded-xl border border-rose-200 text-xs text-[#64595e] flex items-center justify-between">
            <span className="font-bold text-[#3a3135]">Private Journal & Full EHR Documents:</span>
            <span className="text-rose-600 font-bold flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> Always Private & Locked
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
