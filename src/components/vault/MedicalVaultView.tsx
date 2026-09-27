import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Camera,
  FolderOpen,
  Sparkles,
  Download,
  Share2,
  Trash2,
  CheckCircle,
  AlertCircle,
  Eye,
  X,
  Plus,
  HelpCircle,
  Building,
  Calendar
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MedicalDocument } from '../../types';

export default function MedicalVaultView() {
  const { documents, addDocument, selectedDoc, setSelectedDoc } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Upload Form State
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState<MedicalDocument['category']>('Lab Reports');
  const [facilityName, setFacilityName] = useState('Mercy Diagnostics Lab');

  const categories = [
    'All',
    'Lab Reports',
    'Prescriptions',
    'Medical Reports',
    'Vaccinations',
    'Imaging',
    'Doctor Notes',
  ];

  const filteredDocs = documents.filter(doc =>
    activeCategory === 'All' ? true : doc.category === activeCategory
  );

  const handleSimulateUpload = (method: 'camera' | 'file') => {
    setIsUploadModalOpen(false);
    setIsAiProcessing(true);

    setTimeout(() => {
      const newDocument: Omit<MedicalDocument, 'id'> = {
        title: docTitle.trim() || 'Comprehensive Thyroid & Hormone Panel',
        category: docCategory,
        date: new Date().toISOString().split('T')[0],
        facility: facilityName,
        doctorName: 'Dr. Elena Vance, MD',
        fileSize: '2.4 MB PDF',
        aiProcessed: true,
        aiSummary: 'Extracted 4 biomarkers from uploaded document. Thyroid stimulating hormone (TSH) and Free T4 are balanced within optimal reference bands.',
        extractedBiomarkers: [
          { name: 'TSH (Thyroid Stimulating)', value: '1.8', unit: 'uIU/mL', referenceRange: '0.4 - 4.0', status: 'normal' },
          { name: 'Free T4', value: '1.2', unit: 'ng/dL', referenceRange: '0.8 - 1.8', status: 'normal' },
          { name: 'Serum Ferritin', value: '42', unit: 'ng/mL', referenceRange: '20 - 200', status: 'normal' },
          { name: 'Total Cholesterol', value: '182', unit: 'mg/dL', referenceRange: '< 200', status: 'normal' },
        ],
        doctorQuestions: [
          'Are my thyroid levels consistent with early gestational progression?',
          'Should I schedule follow-up labs in 12 weeks?',
        ],
      };

      addDocument(newDocument);
      setIsAiProcessing(false);
      setIsDetailModalOpen(true);
    }, 2200);
  };

  const openDocumentDetail = (doc: MedicalDocument) => {
    setSelectedDoc(doc);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Medical Records & Health Vault
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            End-to-end encrypted clinical repository with AI biomarker extraction
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-purple-600/20 active:scale-95 transition-all min-h-[44px]"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* AI Processing Banner */}
      {isAiProcessing && (
        <div className="p-4 bg-gradient-to-r from-purple-600 to-rose-600 text-white rounded-2xl shadow-lg flex items-center gap-3 animate-pulse">
          <Sparkles className="w-6 h-6 animate-spin text-purple-200" />
          <div>
            <span className="text-xs font-bold block">
              AI Processing & Biomarker Extraction in Progress...
            </span>
            <span className="text-[11px] text-purple-100">
              Optical character recognition (OCR) and clinical entity parsing active.
            </span>
          </div>
        </div>
      )}

      {/* Categories Horizontal Scroller */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all min-h-[44px] ${
              activeCategory === cat
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-purple-100 dark:border-slate-700 hover:border-purple-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        {filteredDocs.map(doc => (
          <div
            key={doc.id}
            onClick={() => openDocumentDetail(doc)}
            className="bg-white dark:bg-slate-850 p-4 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 group"
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-300 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {doc.title}
                  </h3>
                  {doc.aiProcessed && (
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[9px] font-bold shrink-0 flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5" /> AI Extracted
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                  <span>{doc.date}</span>
                  <span>·</span>
                  <span>{doc.facility || doc.doctorName}</span>
                  <span>·</span>
                  <span>{doc.fileSize}</span>
                </div>
              </div>
            </div>

            <button
              onClick={e => {
                e.stopPropagation();
                openDocumentDetail(doc);
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-slate-800 shrink-0"
              title="View Report Details"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Upload Document Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-purple-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-purple-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Upload Medical Document
              </h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Thyroid Ultrasound Report"
                  value={docTitle}
                  onChange={e => setDocTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-purple-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Category
                </label>
                <select
                  value={docCategory}
                  onChange={e => setDocCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-purple-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                >
                  <option>Lab Reports</option>
                  <option>Prescriptions</option>
                  <option>Medical Reports</option>
                  <option>Vaccinations</option>
                  <option>Imaging</option>
                  <option>Doctor Notes</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => handleSimulateUpload('camera')}
                  className="p-3 rounded-2xl border border-purple-100 dark:border-slate-700 bg-purple-50/50 dark:bg-slate-800 flex flex-col items-center justify-center gap-1.5 hover:border-purple-400 min-h-[44px]"
                >
                  <Camera className="w-5 h-5 text-purple-600" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Take Photo</span>
                  <span className="text-[10px] text-slate-400">Camera OCR</span>
                </button>

                <button
                  onClick={() => handleSimulateUpload('file')}
                  className="p-3 rounded-2xl border border-purple-100 dark:border-slate-700 bg-purple-50/50 dark:bg-slate-800 flex flex-col items-center justify-center gap-1.5 hover:border-purple-400 min-h-[44px]"
                >
                  <FolderOpen className="w-5 h-5 text-rose-500" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Files / PDF</span>
                  <span className="text-[10px] text-slate-400">Device storage</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REPORT DETAIL MODAL (Prompt #24) */}
      {isDetailModalOpen && selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="w-full max-w-lg h-[92vh] max-h-[720px] bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-purple-100 dark:border-slate-800 flex flex-col justify-between overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-purple-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-300">
                  {selectedDoc.category}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {selectedDoc.title}
                </h3>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {selectedDoc.date}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Building className="w-3 h-3" /> {selectedDoc.facility || selectedDoc.doctorName}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto py-3 space-y-4 scrollbar-thin scrollbar-thumb-purple-200">
              {/* Summary & AI Explanation */}
              {selectedDoc.aiSummary && (
                <div className="bg-purple-50/60 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-purple-100 dark:border-slate-700 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900 dark:text-purple-200">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>AI Clinical Interpretation</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {selectedDoc.aiSummary}
                  </p>
                </div>
              )}

              {/* Extracted Biomarkers Table */}
              {selectedDoc.extractedBiomarkers && selectedDoc.extractedBiomarkers.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Extracted Biomarkers
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      Requires medical verification
                    </span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-purple-100/70 dark:border-slate-800 overflow-hidden">
                    <div className="grid grid-cols-4 p-2.5 text-[10px] font-bold text-slate-400 border-b border-slate-200 dark:border-slate-700 uppercase">
                      <span className="col-span-2">Biomarker</span>
                      <span>Result</span>
                      <span>Reference</span>
                    </div>

                    {selectedDoc.extractedBiomarkers.map((bio, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-4 p-2.5 text-xs border-b border-slate-100 dark:border-slate-800 last:border-b-0 items-center"
                      >
                        <span className="col-span-2 font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {bio.name}
                        </span>
                        <span className="font-bold text-purple-700 dark:text-purple-300 tabular-nums">
                          {bio.value} <span className="text-[10px] font-normal text-slate-400">{bio.unit}</span>
                        </span>
                        <span className="text-[11px] text-slate-500 tabular-nums">
                          {bio.referenceRange}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Questions for Your Doctor */}
              {selectedDoc.doctorQuestions && (
                <div className="bg-rose-50/60 dark:bg-rose-950/30 p-3.5 rounded-2xl border border-rose-100 dark:border-rose-900/60 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900 dark:text-rose-200">
                    <HelpCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Questions for Your Doctor:</span>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                    {selectedDoc.doctorQuestions.map((q, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-rose-500 font-bold">•</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="flex items-center justify-between gap-2 pt-3 border-t border-purple-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('Document downloaded securely as encrypted PDF.')}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 min-h-[44px]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => alert('Encrypted share link generated for doctor consultation.')}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 min-h-[44px]"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>

              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm min-h-[44px]"
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
