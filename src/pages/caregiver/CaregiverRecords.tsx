import React, { useState } from 'react';
import { FileText, Upload, Download, Trash2, Plus, X } from 'lucide-react';
import { useCaregiver } from '../../context/CaregiverContext';

export default function CaregiverRecords() {
  const { records, addRecord, deleteRecord, dependents } = useCaregiver();
  const [showAddRecordModal, setShowAddRecordModal] = useState(false);
  const [newRecordForm, setNewRecordForm] = useState({
    dependent: dependents[0]?.name || '',
    name: '',
    category: 'Lab Diagnostics'
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecordForm.name.trim()) return;
    addRecord(newRecordForm);
    setNewRecordForm({
      dependent: dependents[0]?.name || '',
      name: '',
      category: 'Lab Diagnostics'
    });
    setShowAddRecordModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#7C3AED] mb-1">
            <FileText className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Clinical Vault</span>
          </div>
          <h3 className="font-serif text-3xl font-bold text-[#3a3135]">Dependent Medical Records</h3>
          <p className="text-xs text-[#7a6f75] mt-1">
            Vault of medical lab reports, diagnostic scans, and clinical documents for linked care profiles.
          </p>
        </div>

        <button
          onClick={() => setShowAddRecordModal(true)}
          className="px-5 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer w-fit"
        >
          <Upload className="w-4 h-4" /> Upload Document
        </button>
      </div>

      {/* Records Grid or Empty State */}
      {records.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-[#EDE9FE] shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-purple-50 text-[#7C3AED] flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <h4 className="font-serif text-xl font-bold text-[#3a3135]">No Medical Records Uploaded</h4>
          <p className="text-xs text-[#7a6f75] max-w-md mx-auto">
            Your clinical vault is currently empty. Upload lab reports, prescription scans, and pediatric growth records for your dependents.
          </p>
          <button
            onClick={() => setShowAddRecordModal(true)}
            className="px-6 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4" /> Upload Document
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {records.map((r) => (
          <div
            key={r.id}
            className="p-6 rounded-3xl border border-[#EDE9FE] bg-white hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-purple-50 text-[#7C3AED] font-bold text-[10px] uppercase border border-purple-100">
                  {r.category}
                </span>
                <span className="text-[10px] text-[#7a6f75] font-semibold">{r.size || '1.2 MB'}</span>
              </div>
              <h4 className="font-bold text-[#3a3135] text-sm line-clamp-1">{r.name}</h4>
              <p className="text-xs text-[#7a6f75]">
                Dependent: <b className="text-[#3a3135]">{r.dependent}</b>
              </p>
              <p className="text-[11px] text-[#7a6f75]">Uploaded on {r.date}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#EDE9FE]">
              <button
                onClick={() => alert(`Downloading ${r.name}...`)}
                className="text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </button>
              <button
                onClick={() => deleteRecord(r.id)}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                title="Delete Record"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Upload Modal */}
      {showAddRecordModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-[#EDE9FE] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-3">
              <h3 className="font-bold text-base text-[#3a3135]">Upload Dependent Medical Record</h3>
              <button onClick={() => setShowAddRecordModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Select Dependent</label>
                <select
                  value={newRecordForm.dependent}
                  onChange={(e) => setNewRecordForm({ ...newRecordForm, dependent: e.target.value })}
                  className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-white font-medium"
                >
                  {dependents.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name} ({d.relation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Document Title / File Name</label>
                <input
                  type="text"
                  value={newRecordForm.name}
                  onChange={(e) => setNewRecordForm({ ...newRecordForm, name: e.target.value })}
                  placeholder="e.g. Pediatric_Blood_Panel.pdf"
                  className="w-full p-3 rounded-xl border border-[#EDE9FE] text-xs font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Record Category</label>
                <select
                  value={newRecordForm.category}
                  onChange={(e) => setNewRecordForm({ ...newRecordForm, category: e.target.value })}
                  className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-white font-medium"
                >
                  <option value="Lab Diagnostics">Lab Diagnostics</option>
                  <option value="Vaccination Record">Vaccination Record</option>
                  <option value="Pediatric Report">Pediatric Report</option>
                  <option value="Prescription & Dosage">Prescription & Dosage</option>
                </select>
              </div>

              <div className="flex gap-2 pt-3 border-t border-[#EDE9FE]">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-xl cursor-pointer"
                >
                  Upload Record
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddRecordModal(false)}
                  className="py-3 px-5 border border-[#EDE9FE] rounded-xl font-bold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
