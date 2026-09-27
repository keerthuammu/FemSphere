import React, { useState } from 'react';
import { Sparkles, Calendar, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LifeStageId, LifeStageInfo } from '../../types';

export const LIFE_STAGES: LifeStageInfo[] = [
  {
    id: 'early_childhood',
    name: 'Early Childhood',
    ageRange: '0 - 5 Years',
    description: 'Foundational developmental milestones, pediatric vaccinations, sleep architecture, and pediatric nutrition.',
    keyFocusAreas: ['Immunization schedule', 'Motor development', 'Cognitive growth', 'Pediatric sleep'],
    recommendedTracking: ['Growth percentiles', 'Vaccination milestones', 'Allergy observation'],
  },
  {
    id: 'childhood',
    name: 'Childhood',
    ageRange: '6 - 9 Years',
    description: 'Active physical growth, bone mineralization, immune resilience, and emotional socialization.',
    keyFocusAreas: ['Physical activity', 'Balanced nutrition', 'Vision & dental health', 'Hydration'],
    recommendedTracking: ['Annual pediatric vitals', 'Activity levels', 'Dental checkups'],
  },
  {
    id: 'pre_puberty',
    name: 'Pre-Puberty',
    ageRange: '10 - 12 Years',
    description: 'Pre-menarcheal hormonal preparation, rapid skeletal growth, and foundational body literacy.',
    keyFocusAreas: ['Growth spurts', 'Nutritional calcium & iron', 'Hormonal emergence awareness', 'Sleep regulation'],
    recommendedTracking: ['Basal growth markers', 'Posture & spine checks', 'Resting HR'],
  },
  {
    id: 'puberty',
    name: 'Puberty',
    ageRange: '13 - 17 Years',
    description: 'Menarche initiation, cycle regularization, emotional neuroplasticity, and metabolic support.',
    keyFocusAreas: ['First cycle logging', 'PMA symptom awareness', 'Skin & iron balance', 'Nutritional vitality'],
    recommendedTracking: ['Cycle regularity', 'Cramping & flow', 'Resting sleep quality'],
  },
  {
    id: 'reproductive_age',
    name: 'Reproductive Age',
    ageRange: '18 - 40 Years',
    description: 'Fertility awareness, ovulation tracking, metabolic vigor, cardiovascular conditioning, and family planning.',
    keyFocusAreas: ['Ovulation detection', 'Hormonal balance (PCOS/Endo checks)', 'Mental stress load', 'Nutritional biomarkers'],
    recommendedTracking: ['Basal body temperature', 'Cycle phases', 'Cardiac HRV', 'Routine Pap & blood panels'],
  },
  {
    id: 'pregnancy',
    name: 'Pregnancy',
    ageRange: 'Maternal Trimesters',
    description: 'Gestational vitals, embryonic development, maternal plasma volume, fetal kick tracking, and prenatal care.',
    keyFocusAreas: ['Fetal anatomy scans', 'Gestational blood pressure', 'Iron & DHA nutrition', 'Pelvic floor health'],
    recommendedTracking: ['Maternal weight & BP', 'Fetal movement count', 'Glucose challenge', 'OB/GYN appointments'],
  },
  {
    id: 'postpartum',
    name: 'Postpartum',
    ageRange: 'Fourth Trimester (0 - 1 Year)',
    description: 'Maternal uterine involution, lactation nutrition, pelvic rehabilitation, sleep restoration, and emotional well-being.',
    keyFocusAreas: ['Postpartum mood (PPD/PPA)', 'Pelvic rehabilitation', 'Nutrient replenishment', 'Gentle mobility'],
    recommendedTracking: ['Lactation / hydration', 'Rest restorative intervals', 'Postpartum depression screener'],
  },
  {
    id: 'perimenopause',
    name: 'Perimenopause',
    ageRange: '40 - 50 Years',
    description: 'Fluctuating estrogen & progesterone, vasomotor tracking, cardiovascular and metabolic adaptation.',
    keyFocusAreas: ['Vasomotor symptoms (hot flashes)', 'Sleep architecture', 'Bone density maintenance', 'Cardiovascular risk'],
    recommendedTracking: ['Hormone symptom logs', 'Night sweat frequency', 'Lipid & thyroid labs', 'Weight resistance training'],
  },
  {
    id: 'menopause',
    name: 'Menopause',
    ageRange: '51 - 65 Years',
    description: 'Permanent cessation of menses, bone health preservation, metabolic equilibrium, and cardiovascular vitality.',
    keyFocusAreas: ['DEXA bone density scans', 'Cardiovascular lipid profiles', 'Joint mobility', 'Sleep quality'],
    recommendedTracking: ['Bone density markers', 'Resting BP', 'Cognitive wellness', 'Annual mammograms'],
  },
  {
    id: 'older_adult',
    name: 'Older Adult',
    ageRange: '65+ Years',
    description: 'Active longevity, balance & fall prevention, cardiovascular maintenance, cognitive agility, and multi-specialty care.',
    keyFocusAreas: ['Mobility & strength balance', 'Polypharmacy management', 'Cardiovascular & cognitive health', 'Vision & hearing'],
    recommendedTracking: ['Medication adherence', 'Daily balance tests', 'Vital biometrics', 'Blood pressure monitoring'],
  },
];

export default function LifeStageTimeline() {
  const { currentLifeStage, setCurrentLifeStage, setActiveMode } = useApp();
  const [inspectedStageId, setInspectedStageId] = useState<LifeStageId>(currentLifeStage);

  const inspectedStage = LIFE_STAGES.find(s => s.id === inspectedStageId) || LIFE_STAGES[4];
  const currentIndex = LIFE_STAGES.findIndex(s => s.id === currentLifeStage);
  const inspectedIndex = LIFE_STAGES.findIndex(s => s.id === inspectedStageId);

  const handleApplyStage = (stageId: LifeStageId) => {
    setCurrentLifeStage(stageId);
    if (stageId === 'pregnancy') {
      setActiveMode('pregnancy');
    } else if (stageId === 'postpartum') {
      setActiveMode('postpartum');
    } else if (stageId === 'menopause' || stageId === 'perimenopause') {
      setActiveMode('menopause');
    } else {
      setActiveMode('standard');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-850 p-4 sm:p-5 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
            <span>Lifetime Health Journey</span>
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            FemSphere automatically adapts tracking protocols across your life journey
          </p>
        </div>
        <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-100 dark:border-purple-900">
          10 Lifetime Stages
        </span>
      </div>

      {/* Horizontal Lifetime Stage Track */}
      <div className="relative overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-purple-200 dark:scrollbar-thumb-slate-700 -mx-1 px-1">
        <div className="flex items-center min-w-[700px] relative">
          {/* Background Connecting Timeline Line */}
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-purple-100 dark:bg-slate-800 z-0"></div>

          {LIFE_STAGES.map((stage, idx) => {
            const isCurrent = stage.id === currentLifeStage;
            const isInspected = stage.id === inspectedStageId;
            const isPast = idx < currentIndex;

            return (
              <div
                key={stage.id}
                onClick={() => setInspectedStageId(stage.id)}
                className="relative z-10 flex-1 flex flex-col items-center cursor-pointer group px-1"
              >
                {/* Node Dot */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-gradient-to-tr from-purple-600 to-rose-500 text-white shadow-md shadow-purple-500/30 ring-4 ring-purple-100 dark:ring-purple-950 scale-110'
                      : isInspected
                      ? 'bg-purple-200 dark:bg-purple-900 text-purple-700 dark:text-purple-200 ring-2 ring-purple-400'
                      : isPast
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {isCurrent ? (
                    <span className="text-[11px] font-bold">You</span>
                  ) : isPast ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <span className="text-[10px] font-semibold">{idx + 1}</span>
                  )}
                </div>

                <span
                  className={`text-[10px] font-semibold mt-1.5 text-center leading-tight truncate max-w-[80px] ${
                    isCurrent
                      ? 'text-purple-600 dark:text-purple-400 font-bold'
                      : isInspected
                      ? 'text-slate-900 dark:text-white'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {stage.name}
                </span>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 truncate max-w-[70px]">
                  {stage.ageRange}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Stage Detail Card */}
      <div className="bg-purple-50/40 dark:bg-slate-800/40 rounded-xl p-3.5 border border-purple-100 dark:border-slate-800 transition-all">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {inspectedStage.name}
              </span>
              <span className="text-[10px] text-purple-700 dark:text-purple-300 font-medium bg-white dark:bg-slate-700 px-2 py-0.5 rounded-full border border-purple-100 dark:border-slate-600">
                {inspectedStage.ageRange}
              </span>
              {inspectedStage.id === currentLifeStage && (
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                  Active User Stage
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              {inspectedStage.description}
            </p>
          </div>
        </div>

        {/* Focus Areas & Recommended Tracking Chips */}
        <div className="grid sm:grid-cols-2 gap-2 my-2 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Key Focus Areas:
            </span>
            <ul className="mt-1 space-y-0.5 text-slate-600 dark:text-slate-300 text-[11px]">
              {inspectedStage.keyFocusAreas.map((f, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-purple-500"></span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Recommended Biometrics:
            </span>
            <ul className="mt-1 space-y-0.5 text-slate-600 dark:text-slate-300 text-[11px]">
              {inspectedStage.recommendedTracking.map((t, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-rose-400"></span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Set as current stage button if not current */}
        {inspectedStage.id !== currentLifeStage ? (
          <button
            onClick={() => handleApplyStage(inspectedStage.id)}
            className="w-full mt-2 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all min-h-[44px]"
          >
            <span>Activate {inspectedStage.name} Mode</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-1">
            Current active stage configures AI analysis, home dashboard cards & clinical recommendations.
          </div>
        )}
      </div>
    </div>
  );
}
