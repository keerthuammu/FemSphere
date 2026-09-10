import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Users, User, HeartHandshake, Shield, Calendar, Droplet, FileText, AlertCircle } from 'lucide-react';

interface DependentItem {
  id: number | string;
  caregiver_id: number;
  full_name: string;
  dob: string;
  relationship: string;
  blood_group?: string;
  medical_notes?: string;
  created_at: string;
}

interface CaregiverInfo {
  id: number | string;
  user_id: number;
  caregiver_type: string;
  emergency_phone: string;
  email: string;
  username: string;
  full_name?: string;
}

export default function AdminCaregiverDependents() {
  const { caregiverId } = useParams<{ caregiverId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [caregiver, setCaregiver] = useState<CaregiverInfo | null>(null);
  const [dependents, setDependents] = useState<DependentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const numericId = caregiverId ? caregiverId.replace(/\D/g, '') : '';

  useEffect(() => {
    async function fetchDependents() {
      if (!numericId) {
        setError('Invalid caregiver identifier.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('femsphere_token') || '';
        const res = await fetch(`/api/admin/caregivers/${numericId}/dependents`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || 'Failed to fetch caregiver dependents.');
        }

        const data = await res.json();
        setCaregiver(data.caregiver || null);
        setDependents(data.dependents || []);
      } catch (err: any) {
        console.error('Error fetching dependents:', err);
        setError(err.message || 'Could not load dependents.');
      } finally {
        setLoading(false);
      }
    }

    fetchDependents();
  }, [numericId]);

  const calculateAge = (dobString?: string) => {
    if (!dobString) return 'N/A';
    const dob = new Date(dobString);
    if (isNaN(dob.getTime())) return 'N/A';
    const diffMs = Date.now() - dob.getTime();
    const ageDt = new Date(diffMs);
    const age = Math.abs(ageDt.getUTCFullYear() - 1970);
    return `${age} yrs`;
  };

  const filteredDependents = dependents.filter(d => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (d.full_name && d.full_name.toLowerCase().includes(q)) ||
      (d.relationship && d.relationship.toLowerCase().includes(q)) ||
      (d.blood_group && d.blood_group.toLowerCase().includes(q)) ||
      (d.medical_notes && d.medical_notes.toLowerCase().includes(q))
    );
  });

  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#EDE9FE] shadow-xs space-y-4 font-inter">
      {/* NAVIGATION BREADCRUMB / BACK LINK */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/caregivers"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7C3AED] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Caregiver Directory
        </Link>
      </div>

      {/* TOP HEADER & SEARCH */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#EDE9FE] pb-3.5">
        <div>
          <h3 className="font-bold text-xl text-[#3a3135] flex items-center gap-2">
            <span>Dependents List</span>
            {caregiver && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-50 text-[#7C3AED] border border-purple-100 font-bold">
                Caregiver: {caregiver.full_name || caregiver.username}
              </span>
            )}
          </h3>
          <p className="text-xs text-[#64595e]">
            {caregiver ? (
              <>
                ID: <span className="font-bold text-[#14B8A6]">#{caregiver.id}</span> • Email: <span className="font-medium text-[#3a3135]">{caregiver.email}</span> • Relation: <span className="font-medium text-[#3a3135]">{caregiver.caregiver_type || 'Parent'}</span> • Emergency Contact: <span className="font-medium text-[#3a3135]">{caregiver.emergency_phone || 'N/A'}</span>
              </>
            ) : (
              'Review and manage care recipients linked to this caregiver'
            )}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#7a6f75] absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Search dependents..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-[#EDE9FE] text-xs focus:ring-2 focus:ring-[#7C3AED] outline-none"
            />
          </div>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* LOADING STATE */}
      {loading ? (
        <div className="py-12 text-center text-[#7a6f75] text-xs flex flex-col items-center justify-center gap-2">
          <div className="w-6 h-6 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
          <p>Loading dependent records...</p>
        </div>
      ) : (
        /* DEPENDENTS TABLE */
        <div className="overflow-x-auto rounded-xl border border-[#EDE9FE]">
          <table className="w-full text-left text-xs font-inter">
            <thead className="bg-[#FAF8FC] text-[#3a3135] uppercase text-[11px] font-bold border-b border-[#EDE9FE]">
              <tr>
                <th className="p-3">Dependent ID</th>
                <th className="p-3">Full Name</th>
                <th className="p-3">Relationship</th>
                <th className="p-3">Date of Birth / Age</th>
                <th className="p-3">Blood Group</th>
                <th className="p-3">Medical Notes</th>
                <th className="p-3 text-right">Date Linked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE9FE]">
              {filteredDependents.map((dep) => (
                <tr key={dep.id} className="hover:bg-[#FAF8FC] transition-colors">
                  <td className="p-3 font-bold text-[#7C3AED]">#DEP-{dep.id}</td>
                  <td className="p-3 font-bold text-[#3a3135]">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-100 text-[#7C3AED] flex items-center justify-center font-bold text-[10px]">
                        {dep.full_name?.charAt(0)?.toUpperCase() || 'D'}
                      </div>
                      <span>{dep.full_name}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#FAF8FC] text-[#4A3B42] border border-[#EDE9FE]">
                      {dep.relationship || 'Dependent'}
                    </span>
                  </td>
                  <td className="p-3 text-[#64595e]">
                    <span>{dep.dob ? new Date(dep.dob).toISOString().split('T')[0] : 'N/A'}</span>
                    <span className="ml-1.5 px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                      {calculateAge(dep.dob)}
                    </span>
                  </td>
                  <td className="p-3">
                    {dep.blood_group ? (
                      <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-100 text-[11px] font-bold inline-flex items-center gap-1">
                        <Droplet className="w-3 h-3 text-rose-500" /> {dep.blood_group}
                      </span>
                    ) : (
                      <span className="text-[#7a6f75] italic">Not recorded</span>
                    )}
                  </td>
                  <td className="p-3 text-[#64595e] max-w-xs truncate">
                    {dep.medical_notes ? dep.medical_notes : <span className="text-[#7a6f75] italic">None</span>}
                  </td>
                  <td className="p-3 text-right text-[#7a6f75]">
                    {dep.created_at ? new Date(dep.created_at).toISOString().split('T')[0] : 'N/A'}
                  </td>
                </tr>
              ))}
              {filteredDependents.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#7a6f75] italic">
                    {dependents.length === 0
                      ? 'No dependents currently registered under this caregiver.'
                      : 'No dependents match your search query.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* SUMMARY BOTTOM BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 bg-[#FAF8FC] rounded-xl border border-[#EDE9FE] text-xs font-inter">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#3a3135]">
            Total: {dependents.length} dependent{dependents.length === 1 ? '' : 's'} linked
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/admin/caregivers"
            className="text-[#7C3AED] font-bold hover:underline"
          >
            ← Return to Caregiver Management
          </Link>
        </div>
      </div>
    </div>
  );
}
