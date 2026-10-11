import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Upload, 
  FileText, 
  Calendar as CalendarIcon, 
  AlertTriangle, 
  CheckCircle2, 
  Eye, 
  Download, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Search,
  Filter,
  Stethoscope,
  Activity,
  ShieldCheck,
  Info
} from 'lucide-react';
import { useUser, MedicalRecordItem } from '../../context/UserContext';

export default function UserRecords() {
  const {
    records,
    setShowUploadModal,
    handleDeleteRecord
  } = useUser();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeDateFilter, setActiveDateFilter] = useState<string | null>(null);

  // Detail Modal for Biomarkers
  const [selectedRecordForDetail, setSelectedRecordForDetail] = useState<MedicalRecordItem | null>(null);

  // Calendar State for interactive date browsing
  const [calendarDate, setCalendarDate] = useState(new Date(2026, 9, 1)); // October 2026

  const prevMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
  };

  const monthName = calendarDate.toLocaleString('default', { month: 'long' });
  const year = calendarDate.getFullYear();
  const monthNum = String(calendarDate.getMonth() + 1).padStart(2, '0');

  // Days in selected calendar month
  const daysInMonth = new Date(year, calendarDate.getMonth() + 1, 0).getDate();
  const firstDayIndex = (new Date(year, calendarDate.getMonth(), 1).getDay() + 6) % 7; // Monday = 0

  const calendarDays = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Set of dates that have records (YYYY-MM-DD)
  const recordDatesSet = useMemo(() => {
    const set = new Set<string>();
    records.forEach(r => {
      if (r.date) set.add(r.date);
    });
    return set;
  }, [records]);

  // Categories present in user's records
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    records.forEach(r => {
      if (r.category) cats.add(r.category);
    });
    return ['All', ...Array.from(cats)];
  }, [records]);

  // Data for Category Donut / Pie Chart
  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    records.forEach(r => {
      const cat = r.category || 'Lab Results';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const palette = [
      { color: '#8B5CF6', label: 'Lab Results' },
      { color: '#FB7185', label: 'Blood Work' },
      { color: '#14B8A6', label: 'Imaging' },
      { color: '#6366F1', label: 'Prescriptions' },
      { color: '#F59E0B', label: 'Other' }
    ];

    const total = records.length;
    let accumulatedAngle = 0;

    const slices = Object.entries(counts).map(([cat, count], idx) => {
      const percentage = total > 0 ? (count / total) * 100 : 0;
      const angle = (count / total) * 360;
      const startAngle = accumulatedAngle;
      accumulatedAngle += angle;

      const matchedColor = palette[idx % palette.length].color;

      return {
        category: cat,
        count,
        percentage: Math.round(percentage),
        color: matchedColor,
        startAngle,
        angle
      };
    });

    return { total, slices };
  }, [records]);

  // Filtered Records (Strictly from user's database records)
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      // Category filter
      if (selectedCategory !== 'All' && r.category !== selectedCategory) {
        return false;
      }
      // Calendar date filter
      if (activeDateFilter && r.date !== activeDateFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = r.title.toLowerCase().includes(query);
        const matchesDesc = (r.description || '').toLowerCase().includes(query);
        const matchesCat = (r.category || '').toLowerCase().includes(query);
        const matchesDoc = (r.scanResults?.doctorName || '').toLowerCase().includes(query);
        const matchesLab = (r.scanResults?.labName || '').toLowerCase().includes(query);
        const matchesBiomarker = (r.scanResults?.keyBiomarkers || []).some((b: any) => 
          b.name.toLowerCase().includes(query)
        );
        return matchesTitle || matchesDesc || matchesCat || matchesDoc || matchesLab || matchesBiomarker;
      }
      return true;
    });
  }, [records, selectedCategory, activeDateFilter, searchQuery]);

  return (
    <div className="space-y-7 animate-in fade-in duration-200 font-sans text-[#201538]">
      
      {/* ======================================================== */}
      {/* 1. TOP HEADER BANNER */}
      {/* ======================================================== */}
      <div className="bg-white rounded-[28px] p-6 md:p-8 border border-[#F1EBF9] shadow-[0_4px_25px_rgba(124,58,237,0.025)] flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-[#F9E8EC] text-[#936DA2] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#936DA2]" /> Encrypted Medical Vault
            </span>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 uppercase tracking-wider">
              OCR Auto-Scan Active
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#201538] tracking-tight">
            Medical Reports & Vault
          </h2>
          <p className="text-xs md:text-sm text-[#8E859E] font-normal leading-relaxed max-w-xl">
            Securely store your medical reports in PDF format. Each document is scanned to extract biomarkers, track historical lab results, and provide clear clinical insights.
          </p>
        </div>

        <button 
          onClick={() => setShowUploadModal(true)} 
          className="flex items-center gap-2.5 px-6 py-3 bg-[#936DA2] hover:bg-[#835A92] text-white rounded-full font-bold text-xs shadow-sm transition-all hover:scale-[1.02] cursor-pointer shrink-0"
        >
          <Upload className="w-4 h-4" /> 
          <span>Upload Medical Report (PDF)</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 2. TOP WIDGETS ROW: CALENDAR + CLEAN PIE CHART */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        
        {/* WIDGET A: INTERACTIVE MEDICAL CALENDAR (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-[28px] p-6 md:p-7 border border-[#F1EBF9] shadow-[0_4px_25px_rgba(124,58,237,0.025)] flex flex-col justify-between">
          <div>
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h4 className="font-bold text-base md:text-lg text-[#201538] flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-[#936DA2]" />
                  <span>{monthName} {year}</span>
                </h4>
                <p className="text-xs text-[#8E859E] mt-0.5">
                  Browse reports by date or filter records
                </p>
              </div>

              <div className="flex items-center gap-2">
                {activeDateFilter && (
                  <button
                    onClick={() => setActiveDateFilter(null)}
                    className="px-3 py-1 rounded-full bg-[#F9E8EC] text-[#936DA2] hover:bg-[#F4DDE2] text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    Clear Filter
                  </button>
                )}
                <div className="flex items-center gap-1 text-[#8E859E]">
                  <button
                    onClick={prevMonth}
                    className="p-1 hover:text-[#201538] rounded-lg hover:bg-[#F9E8EC] transition-colors cursor-pointer"
                    title="Previous Month"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-1 hover:text-[#201538] rounded-lg hover:bg-[#F9E8EC] transition-colors cursor-pointer"
                    title="Next Month"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Weekdays Row */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
                <span key={d} className="text-[11px] font-semibold text-[#8E859E]">
                  {d}
                </span>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center text-xs font-medium">
              {calendarDays.map((day, idx) => {
                if (!day) {
                  return <div key={`empty-${idx}`} className="w-8 h-8" />;
                }
                const dateStr = `${year}-${monthNum}-${String(day).padStart(2, '0')}`;
                const hasRecord = recordDatesSet.has(dateStr);
                const isSelected = activeDateFilter === dateStr;

                return (
                  <button
                    key={`day-${day}`}
                    onClick={() => {
                      if (activeDateFilter === dateStr) {
                        setActiveDateFilter(null);
                      } else {
                        setActiveDateFilter(dateStr);
                      }
                    }}
                    className={`relative w-8 h-8 sm:w-9 sm:h-9 mx-auto rounded-full flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#936DA2] text-white font-bold shadow-xs scale-105'
                        : hasRecord
                        ? 'bg-[#F9E8EC] text-[#201538] font-bold hover:bg-[#F4DDE2]'
                        : 'text-[#4A4158] hover:bg-[#F9E8EC]/50 hover:text-[#201538]'
                    }`}
                    title={hasRecord ? `Report on ${dateStr}` : dateStr}
                  >
                    <span>{day}</span>
                    {hasRecord && !isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#936DA2] mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Calendar Footnote */}
          <div className="pt-4 mt-4 border-t border-[#F1EBF9] flex items-center justify-between text-[11px] text-[#8E859E]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#936DA2]" />
              <span>Dates with uploaded medical reports</span>
            </div>
            {activeDateFilter && (
              <span className="font-bold text-[#936DA2]">
                Filtering for: {activeDateFilter}
              </span>
            )}
          </div>
        </div>

        {/* WIDGET B: SMALL CLEAN PIE CHART (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-[28px] p-6 md:p-7 border border-[#F1EBF9] shadow-[0_4px_25px_rgba(124,58,237,0.025)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-base md:text-lg text-[#201538]">
                Report Categories
              </h4>
              <span className="text-xs font-semibold text-[#8E859E]">
                {categoryStats.total} {categoryStats.total === 1 ? 'Report' : 'Reports'}
              </span>
            </div>

            {/* Donut Chart SVG Display */}
            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 pt-2">
              <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {/* Empty Background Ring */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#F9E8EC"
                    strokeWidth="10"
                    fill="none"
                  />

                  {/* Render category slices */}
                  {categoryStats.total > 0 && categoryStats.slices.map((slice, i) => {
                    const circumference = 2 * Math.PI * 38;
                    const strokeDasharray = `${(slice.angle / 360) * circumference} ${circumference}`;
                    const strokeDashoffset = -((slice.startAngle / 360) * circumference);

                    return (
                      <circle
                        key={i}
                        cx="50"
                        cy="50"
                        r="38"
                        stroke={slice.color}
                        strokeWidth="10"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        fill="none"
                        className="transition-all duration-500"
                      />
                    );
                  })}
                </svg>

                {/* Center label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-extrabold text-[#201538] leading-none">
                    {categoryStats.total}
                  </span>
                  <span className="text-[10px] font-bold text-[#8E859E] uppercase tracking-wider mt-1">
                    Vault
                  </span>
                </div>
              </div>

              {/* Legends list */}
              <div className="space-y-2.5 w-full sm:w-auto">
                {categoryStats.slices.length > 0 ? (
                  categoryStats.slices.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between sm:justify-start gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-2.5 h-2.5 rounded-full shrink-0" 
                          style={{ backgroundColor: s.color }} 
                        />
                        <span className="font-semibold text-[#4A4158] truncate max-w-[120px]">
                          {s.category}
                        </span>
                      </div>
                      <span className="text-[#8E859E] font-medium text-[11px]">
                        {s.count} ({s.percentage}%)
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#8E859E] italic text-center">
                    No reports stored yet.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#F1EBF9] text-[11px] text-[#8E859E]">
            All medical records are stored strictly in your private database vault.
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 3. MINIMAL LIST CONTAINING ALL RELEVANT MEDICAL INFORMATION */}
      {/* ======================================================== */}
      <div className="bg-white rounded-[28px] p-6 md:p-8 border border-[#F1EBF9] shadow-[0_4px_25px_rgba(124,58,237,0.025)] space-y-6">
        
        {/* Controls Bar: Category Pills + Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-2 border-b border-[#F1EBF9]">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {availableCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#936DA2] text-white shadow-xs'
                    : 'bg-[#FCF4F5] text-[#8E859E] hover:text-[#201538] hover:bg-[#F9E8EC]'
                }`}
              >
                {cat === 'All' ? `All Reports (${records.length})` : cat}
              </button>
            ))}
          </div>

          {/* Search Pill */}
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="w-3.5 h-3.5 text-[#8E859E] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reports or biomarkers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-full bg-[#FCF4F5] border border-[#F1EBF9] text-xs font-medium text-[#201538] placeholder-[#8E859E] focus:outline-none focus:border-[#936DA2] transition-all"
            />
          </div>
        </div>

        {/* Minimal Records List */}
        <div className="space-y-4">
          {filteredRecords.map((record) => {
            const hasScan = Boolean(record.isScanned && record.scanResults);
            const biomarkers = record.scanResults?.keyBiomarkers || [];
            const riskLevel = record.scanResults?.riskLevel || 'Optimal';

            return (
              <div 
                key={record.id}
                className="p-5 rounded-2xl bg-[#FCF4F5] hover:bg-white border border-[#F1EBF9] hover:border-[#936DA2]/30 transition-all shadow-xs space-y-3 group"
              >
                {/* Header Row: Title, Category, Status, Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-[#F9E8EC] text-[#936DA2] flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-white text-[#936DA2] border border-[#F4DDE2] font-bold text-[10px]">
                          {record.category || 'Lab Results'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-white text-[#8E859E] border border-[#F1EBF9] font-semibold text-[10px]">
                          {record.type || 'PDF'} • {record.size || '1.8 MB'}
                        </span>
                        {hasScan && (
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1 ${
                            riskLevel === 'Attention' 
                              ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            <CheckCircle2 className="w-3 h-3" />
                            {riskLevel === 'Attention' ? 'Review Recommended' : 'Optimal Biomarkers'}
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-sm md:text-base text-[#201538] truncate group-hover:text-[#936DA2] transition-colors">
                        {record.title}
                      </h4>
                      <p className="text-[11px] text-[#8E859E]">
                        Conducted on {record.date} <span className="mx-1">•</span> {record.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => setSelectedRecordForDetail(record)}
                      className="px-4 py-2 bg-[#F9E8EC] hover:bg-[#936DA2] text-[#936DA2] hover:text-white rounded-full font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Biomarkers</span>
                    </button>

                    <button
                      onClick={() => {
                        alert(`Viewing document "${record.title}.${record.type?.toLowerCase() || 'pdf'}" from encrypted vault.`);
                      }}
                      className="p-2 rounded-full bg-white hover:bg-[#FCF4F5] text-[#6E6480] hover:text-[#201538] border border-[#F1EBF9] transition-colors cursor-pointer"
                      title="Download or View PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${record.title}" from your medical vault?`)) {
                          handleDeleteRecord(record.id);
                        }
                      }}
                      className="p-2 rounded-full bg-white hover:bg-rose-50 text-[#8E859E] hover:text-rose-600 border border-[#F1EBF9] hover:border-rose-200 transition-colors cursor-pointer"
                      title="Delete Report"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* AI / Clinical Summary Preview (Clean, non-overwhelming) */}
                {record.scanResults?.aiSummary && (
                  <div className="p-3 rounded-2xl bg-white border border-[#F1EBF9] flex items-start gap-2.5 text-xs text-[#4A4158] leading-relaxed">
                    <Sparkles className="w-4 h-4 text-[#936DA2] shrink-0 mt-0.5" />
                    <p className="flex-1 font-normal">
                      <strong className="font-semibold text-[#201538]">Clinical Summary: </strong>
                      {record.scanResults.aiSummary}
                    </p>
                  </div>
                )}

                {/* Key Biomarkers Chips Preview */}
                {biomarkers.length > 0 && (
                  <div className="flex items-center gap-2 overflow-x-auto pt-1">
                    {biomarkers.slice(0, 4).map((b: any, bIdx: number) => (
                      <span 
                        key={bIdx}
                        className="px-2.5 py-1 rounded-xl bg-white border border-[#F1EBF9] text-[11px] font-medium text-[#4A4158] whitespace-nowrap flex items-center gap-1.5"
                      >
                        <span className="font-semibold">{b.name}:</span>
                        <span className="font-bold text-[#936DA2]">{b.value}</span>
                      </span>
                    ))}
                    {biomarkers.length > 4 && (
                      <button
                        onClick={() => setSelectedRecordForDetail(record)}
                        className="text-[11px] font-bold text-[#936DA2] hover:underline whitespace-nowrap px-1"
                      >
                        +{biomarkers.length - 4} more
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Empty State when zero records match */}
          {filteredRecords.length === 0 && (
            <div className="text-center py-16 px-4 bg-[#FCF4F5] rounded-3xl border border-dashed border-[#F1EBF9] space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#F9E8EC] text-[#936DA2] flex items-center justify-center mx-auto">
                <FileText className="w-7 h-7" />
              </div>
              <div className="max-w-sm mx-auto space-y-1">
                <h5 className="font-bold text-sm text-[#201538]">
                  No medical reports found
                </h5>
                <p className="text-xs text-[#8E859E]">
                  {records.length === 0 
                    ? "Your encrypted vault is empty. Upload your clinical diagnostic reports in PDF format to view extracted biomarkers."
                    : "No reports match your current filter or search query."}
                </p>
              </div>
              {records.length === 0 && (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-5 py-2.5 bg-[#936DA2] hover:bg-[#835A92] text-white font-bold text-xs rounded-full shadow-xs transition-all cursor-pointer"
                >
                  Upload First Medical Report (PDF)
                </button>
              )}
            </div>
          )}
        </div>

      </div>

      {/* ======================================================== */}
      {/* 4. DETAIL BIOMARKER MODAL (Clean, reassuring, non-overwhelming) */}
      {/* ======================================================== */}
      {selectedRecordForDetail && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-[32px] p-6 md:p-8 max-w-2xl w-full border border-[#F1EBF9] shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#F1EBF9]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F9E8EC] text-[#936DA2] font-bold text-[10px]">
                    {selectedRecordForDetail.category || 'Lab Results'}
                  </span>
                  <span className="text-[11px] text-[#8E859E]">
                    Report Date: {selectedRecordForDetail.date}
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-extrabold text-[#201538]">
                  {selectedRecordForDetail.title}
                </h3>
                <p className="text-xs text-[#8E859E]">
                  {selectedRecordForDetail.scanResults?.doctorName || 'Clinical Specialist'} • {selectedRecordForDetail.scanResults?.labName || 'Diagnostic Laboratory'}
                </p>
              </div>

              <button
                onClick={() => setSelectedRecordForDetail(null)}
                className="p-1.5 rounded-full hover:bg-[#F9E8EC] text-[#8E859E] hover:text-[#201538] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Reassuring Clinical AI Summary */}
            {selectedRecordForDetail.scanResults?.aiSummary && (
              <div className="p-4 rounded-2xl bg-[#FCF4F5] border border-[#F1EBF9] space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#936DA2]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Clinical Assessment</span>
                </div>
                <p className="text-xs text-[#4A4158] leading-relaxed">
                  {selectedRecordForDetail.scanResults.aiSummary}
                </p>
              </div>
            )}

            {/* Biomarkers List (Simple & Non-Overwhelming) */}
            <div className="space-y-3">
              <h5 className="font-bold text-xs uppercase tracking-wider text-[#8E859E]">
                Extracted Biomarkers
              </h5>

              {selectedRecordForDetail.scanResults?.keyBiomarkers && selectedRecordForDetail.scanResults.keyBiomarkers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedRecordForDetail.scanResults.keyBiomarkers.map((b: any, bIdx: number) => (
                    <div 
                      key={bIdx}
                      className="p-3.5 rounded-2xl bg-white border border-[#F1EBF9] space-y-1 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#4A4158] truncate">{b.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          b.status === 'Optimal' 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : b.status === 'Normal' 
                            ? 'bg-purple-50 text-purple-700' 
                            : 'bg-amber-50 text-amber-700'
                        }`}>
                          {b.status || 'Normal'}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-extrabold text-[#201538]">{b.value}</span>
                        <span className="text-[10px] text-[#8E859E]">Ref: {b.range || 'Standard'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#8E859E] italic">
                  No specific numeric biomarkers extracted. Review full document for detailed physician notes.
                </p>
              )}
            </div>

            {/* Recommendations / Next Steps */}
            {selectedRecordForDetail.scanResults?.recommendations && (
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2.5 text-xs text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Clinical Next Steps: </strong>
                  {selectedRecordForDetail.scanResults.recommendations}
                </p>
              </div>
            )}

            {/* Close Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedRecordForDetail(null)}
                className="px-6 py-2.5 bg-[#936DA2] hover:bg-[#835A92] text-white text-xs font-bold rounded-full transition-all cursor-pointer"
              >
                Close Analysis
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
