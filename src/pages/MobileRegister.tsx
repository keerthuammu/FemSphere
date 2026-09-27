import React, { useState } from 'react';
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Check,
  Shield,
  ShieldCheck,
  Heart,
  Calendar,
  User,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Activity,
  CheckCircle2,
  Watch,
  Brain,
  AlertCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import MobileFrame from '../components/common/MobileFrame';
import { useApp } from '../context/AppContext';
import { LifeStageId } from '../types';

export default function Register() {
  const navigate = useNavigate();
  const { setUser, isDark, toggleTheme } = useApp();

  const [step, setStep] = useState(1);
  const totalSteps = 7;

  // Form states
  // Step 1: Basic Info
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Step 2: Date of Birth & Life Stage
  const [dob, setDob] = useState('1998-05-14');
  const [lifeStage, setLifeStage] = useState<LifeStageId>('reproductive_age');

  // Step 3: Health Twin Baseline
  const [heightCm, setHeightCm] = useState(168);
  const [weightKg, setWeightKg] = useState(62);
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [primaryFocus, setPrimaryFocus] = useState('Hormonal & Circadian Balance');

  // Step 4: Health Preferences
  const [preferences, setPreferences] = useState({
    cycle: true,
    sleep: true,
    vitals: true,
    nutrition: true,
    pregnancy: false,
    caregiverSync: true,
  });

  // Step 5: Emergency Contact
  const [contactName, setContactName] = useState('Alex Jenkins');
  const [contactRelationship, setContactRelationship] = useState('Partner');
  const [contactPhone, setContactPhone] = useState('+1 (555) 234-5678');
  const [sosConsent, setSosConsent] = useState(true);

  // Step 6: Permissions
  const [permissions, setPermissions] = useState({
    wearableSync: true,
    aiAnalysis: true,
    biometrics: true,
    encryptedStorage: true,
  });

  // Step 7: OTP
  const [otpDigits, setOtpDigits] = useState(['4', '8', '2', '9', '1', '6']);
  const [resendTimer, setResendTimer] = useState(45);
  const [isInitializingTwin, setIsInitializingTwin] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const lifeStages: { id: LifeStageId; title: string; age: string; icon: string; desc: string }[] = [
    { id: 'childhood', title: 'Childhood & Pre-Puberty', age: '0–12 yrs', icon: '🌱', desc: 'Growth milestones, pediatric vitals & vaccinations' },
    { id: 'puberty', title: 'Adolescence & Puberty', age: '13–18 yrs', icon: '🌸', desc: 'Menarche tracking, hormonal changes & emotional wellness' },
    { id: 'reproductive_age', title: 'Reproductive Age', age: '19–42 yrs', icon: '🌷', desc: 'Cycle health, fertility, biomarkers & preventive care' },
    { id: 'perimenopause', title: 'Perimenopause', age: '43–50 yrs', icon: '🍁', desc: 'Estrogen fluctuations, vasomotor monitoring & sleep support' },
    { id: 'menopause', title: 'Menopause & Healthy Aging', age: '51+ yrs', icon: '🍂', desc: 'Bone density, cardiovascular health & postmenopausal vitality' },
  ];

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(prev => prev + 1);
    } else {
      handleCompleteRegistration();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    } else {
      navigate('/login');
    }
  };

  const handleAutofillDemo = () => {
    setFullName('Sarah Jenkins');
    setEmail('sarah.jenkins@example.com');
    setPhone('+1 (555) 349-8821');
    setPassword('FemSphere2026!');
    setDob('1998-05-14');
    setLifeStage('reproductive_age');
    setHeightCm(168);
    setWeightKg(62);
    setBloodGroup('O+');
    setContactName('Alex Jenkins');
    setContactRelationship('Partner');
    setContactPhone('+1 (555) 234-5678');
  };

  const handleCompleteRegistration = () => {
    setIsInitializingTwin(true);
    setTimeout(() => {
      setIsInitializingTwin(false);
      // Save created profile into global AppContext
      setUser(prev => ({
        ...prev,
        name: fullName || 'Sarah Jenkins',
        email: email || 'sarah.jenkins@example.com',
        dob: dob,
        currentLifeStage: lifeStage,
        heightCm: heightCm,
        weightKg: weightKg,
        bloodGroup: bloodGroup,
        emergencyContact: {
          name: contactName,
          relationship: contactRelationship,
          phone: contactPhone,
        },
      }));
      setIsSuccessModalOpen(true);
    }, 1200);
  };

  const progressPct = Math.round((step / totalSteps) * 100);

  return (
    <MobileFrame>
      <div className="min-h-full flex flex-col justify-between bg-[#FCFAFE] dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-4 sm:p-6 transition-colors">
        
        {/* Top Mobile Bar with Back, Title & Step Indicator */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-purple-100/60 dark:border-slate-800/80">
            <button
              onClick={handlePrev}
              aria-label="Previous step"
              className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-purple-100/80 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-xs hover:bg-purple-50 dark:hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="text-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-purple-600 dark:text-purple-400 block">
                Step {step} of {totalSteps}
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {step === 1 && 'Basic Information'}
                {step === 2 && 'Date of Birth & Stage'}
                {step === 3 && 'Health Baseline'}
                {step === 4 && 'Health Preferences'}
                {step === 5 && 'Emergency Contact'}
                {step === 6 && 'Permissions & Privacy'}
                {step === 7 && 'Security Verification'}
              </span>
            </div>

            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-purple-100/80 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-xs hover:bg-purple-50 dark:hover:bg-slate-700 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 w-full bg-purple-100/60 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-600 to-rose-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            ></div>
          </div>

          {/* Quick Demo Fill Helper on Step 1 */}
          {step === 1 && (
            <div className="mt-3 flex items-center justify-between bg-purple-50 dark:bg-purple-950/40 p-2 rounded-xl border border-purple-100 dark:border-purple-900/40 text-[11px]">
              <span className="text-slate-500 dark:text-slate-400">Testing register flow?</span>
              <button
                type="button"
                onClick={handleAutofillDemo}
                className="font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" /> Auto-fill Demo Data
              </button>
            </div>
          )}

          {/* STEP 1: BASIC INFORMATION */}
          {step === 1 && (
            <div className="mt-4 space-y-3.5">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Let's start with the basics
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Your identity is protected under clinical zero-knowledge encryption.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Full Legal Name
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-purple-500 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    required
                    className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-purple-100 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full px-3 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-purple-100 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Mobile Number
                </label>
                <div className="relative flex items-center">
                  <Phone className="w-4 h-4 text-purple-500 absolute left-3.5 pointer-events-none" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    required
                    className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-purple-100 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Create Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-purple-500 absolute left-3.5 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-purple-100 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {password && (
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <div className="h-1 flex-1 rounded-full bg-emerald-500"></div>
                    <div className="h-1 flex-1 rounded-full bg-emerald-500"></div>
                    <div className="h-1 flex-1 rounded-full bg-emerald-500"></div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Strong Medical Grade</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: DATE OF BIRTH & LIFETIME STAGE */}
          {step === 2 && (
            <div className="mt-4 space-y-3.5">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Your Life Stage Journey
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  FemSphere adapts its AI health model to your exact stage of life.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Date of Birth
                </label>
                <div className="relative flex items-center">
                  <Calendar className="w-4 h-4 text-purple-500 absolute left-3.5 pointer-events-none" />
                  <input
                    type="date"
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    required
                    className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-purple-100 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Your Current Life Stage
                </label>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {lifeStages.map(stage => {
                    const isSelected = lifeStage === stage.id;
                    return (
                      <div
                        key={stage.id}
                        onClick={() => setLifeStage(stage.id)}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-500 dark:border-purple-400 shadow-xs'
                            : 'bg-white dark:bg-slate-800 border-purple-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl">{stage.icon}</span>
                            <div>
                              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span>{stage.title}</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 font-semibold">
                                  {stage.age}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                                {stage.desc}
                              </p>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'bg-purple-600 border-purple-600 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: HEALTH TWIN BASELINE */}
          {step === 3 && (
            <div className="mt-4 space-y-3.5">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Baseline Biometrics
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Used by your AI Health Twin to calibrate metabolic and cardiovascular telemetry.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-purple-100 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Height</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <input
                      type="number"
                      value={heightCm}
                      onChange={e => setHeightCm(Number(e.target.value))}
                      className="text-lg font-bold text-purple-600 dark:text-purple-400 bg-transparent w-16 focus:outline-none"
                    />
                    <span className="text-xs text-slate-500">cm</span>
                  </div>
                  <input
                    type="range"
                    min="120"
                    max="210"
                    value={heightCm}
                    onChange={e => setHeightCm(Number(e.target.value))}
                    className="w-full accent-purple-600 mt-2"
                  />
                </div>

                <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-purple-100 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Weight</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <input
                      type="number"
                      value={weightKg}
                      onChange={e => setWeightKg(Number(e.target.value))}
                      className="text-lg font-bold text-purple-600 dark:text-purple-400 bg-transparent w-16 focus:outline-none"
                    />
                    <span className="text-xs text-slate-500">kg</span>
                  </div>
                  <input
                    type="range"
                    min="35"
                    max="140"
                    value={weightKg}
                    onChange={e => setWeightKg(Number(e.target.value))}
                    className="w-full accent-purple-600 mt-2"
                  />
                </div>
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Blood Group
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setBloodGroup(bg)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-colors min-h-[40px] ${
                        bloodGroup === bg
                          ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                          : 'bg-white dark:bg-slate-800 border-purple-100 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Focus */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Primary Health Goal
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Hormonal & Circadian Balance',
                    'Cycle & Fertility Awareness',
                    'Cardiovascular & Endurance',
                    'Sleep Architecture & Stress',
                    'Perimenopause Vitality',
                  ].map(focus => (
                    <button
                      key={focus}
                      type="button"
                      onClick={() => setPrimaryFocus(focus)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        primaryFocus === focus
                          ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800 shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-purple-100 dark:border-slate-700'
                      }`}
                    >
                      {focus}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: HEALTH PREFERENCES */}
          {step === 4 && (
            <div className="mt-4 space-y-3.5">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Health Preferences
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select which health modules your Digital Health Twin should track.
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  { key: 'cycle', label: '🌸 Menstrual & Ovulation Cycle Tracking', desc: 'Symptom logging, fertile window & cycle forecasts' },
                  { key: 'vitals', label: '🩺 Continuous Vitals & BLE Telemetry', desc: 'Heart rate, SpO2, sleep staging and temperature sync' },
                  { key: 'sleep', label: '🌙 Circadian Rhythm & Sleep Score', desc: 'REM, deep sleep and morning readiness analysis' },
                  { key: 'nutrition', label: '🥗 Hydration & Nutrition Logging', desc: 'Water intake, micronutrient balance and meal timing' },
                  { key: 'pregnancy', label: '👶 Pregnancy & Trimester Mode', desc: 'Gestational week tracking, fetal growth and maternal vitals' },
                  { key: 'caregiverSync', label: '💗 Family & Partner Collaboration', desc: 'Secure privacy-controlled insights for loved ones' },
                ].map(pref => {
                  const isChecked = (preferences as any)[pref.key];
                  return (
                    <label
                      key={pref.key}
                      className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-purple-100 dark:border-slate-700 flex items-start gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={e => setPreferences(prev => ({ ...prev, [pref.key]: e.target.checked }))}
                        className="mt-1 w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-purple-200"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">
                          {pref.label}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                          {pref.desc}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: EMERGENCY CONTACT & SOS */}
          {step === 5 && (
            <div className="mt-4 space-y-3.5">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Emergency Medical Contact
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  In case of critical alerts or SOS triggers, FemSphere can notify your primary emergency contact.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Contact Full Name
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  placeholder="e.g. Alex Jenkins"
                  className="w-full px-3 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-purple-100 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Relationship
                </label>
                <select
                  value={contactRelationship}
                  onChange={e => setContactRelationship(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-purple-100 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                >
                  <option>Partner / Spouse</option>
                  <option>Parent / Guardian</option>
                  <option>Sibling</option>
                  <option>Primary Physician</option>
                  <option>Other Trusted Contact</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Emergency Phone Number
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={e => setContactPhone(e.target.value)}
                  placeholder="+1 (555) 234-5678"
                  className="w-full px-3 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-purple-100 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                />
              </div>

              <label className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sosConsent}
                  onChange={e => setSosConsent(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-rose-300"
                />
                <span className="text-xs text-rose-800 dark:text-rose-200 font-medium leading-relaxed">
                  Allow one-tap SOS alerts with GPS coordinates and blood group dispatch in critical situations.
                </span>
              </label>
            </div>
          )}

          {/* STEP 6: PERMISSIONS & PRIVACY */}
          {step === 6 && (
            <div className="mt-4 space-y-3.5">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Permissions & Privacy
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  You maintain 100% data sovereignty. Revoke or change anytime in Privacy Center.
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  { key: 'wearableSync', title: 'Apple Health / BLE Wearable Access', desc: 'Sync sleep, vitals, and steps from connected devices.' },
                  { key: 'aiAnalysis', title: 'FemSphere AI Predictive Analytics', desc: 'Generate risk alerts, circadian trends, and twin forecasts.' },
                  { key: 'biometrics', title: 'Face ID & Biometric Screen Lock', desc: 'Require biometric unlock every time app is opened.' },
                  { key: 'encryptedStorage', title: 'Zero-Knowledge Vault Encryption', desc: 'Hardware-level encryption for uploaded lab reports and notes.' },
                ].map(p => {
                  const isChecked = (permissions as any)[p.key];
                  return (
                    <div
                      key={p.key}
                      onClick={() => setPermissions(prev => ({ ...prev, [p.key]: !isChecked }))}
                      className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-purple-100 dark:border-slate-700 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
                    >
                      <div className="pr-3">
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">
                          {p.title}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                          {p.desc}
                        </span>
                      </div>
                      <div className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 shrink-0 ${isChecked ? 'bg-purple-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
                        <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${isChecked ? 'translate-x-5' : 'translate-x-0'}`}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 7: SECURITY VERIFICATION (OTP) */}
          {step === 7 && (
            <div className="mt-4 space-y-3.5">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Security Code Verification
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  We've sent a 6-digit confirmation code to{' '}
                  <span className="font-semibold text-purple-600 dark:text-purple-400">{phone || '+1 (555) 349-8821'}</span>.
                </p>
              </div>

              {/* 6 Digit Inputs */}
              <div className="flex justify-between gap-1.5 my-4">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={e => {
                      const newArr = [...otpDigits];
                      newArr[idx] = e.target.value;
                      setOtpDigits(newArr);
                    }}
                    className="w-11 h-13 rounded-2xl bg-white dark:bg-slate-800 border-2 border-purple-200 dark:border-slate-700 text-center text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-600 shadow-xs"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Resend code in {resendTimer}s</span>
                <button
                  type="button"
                  onClick={() => setOtpDigits(['4', '8', '2', '9', '1', '6'])}
                  className="font-bold text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Auto-fill Test Code
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900 text-xs text-purple-800 dark:text-purple-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Verification activates your encrypted Lifetime AI Health Twin model.</span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Nav Controls */}
        <div className="pt-4 border-t border-purple-100/60 dark:border-slate-800 mt-4 space-y-2.5">
          <div className="flex items-center gap-2.5">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="py-3 px-4 rounded-2xl bg-white dark:bg-slate-800 border border-purple-100 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors min-h-[48px]"
              >
                Back
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              disabled={isInitializingTwin}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 min-h-[48px]"
            >
              {isInitializingTwin ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Synthesizing Health Twin...</span>
                </div>
              ) : step === totalSteps ? (
                <>
                  <span>Verify & Initialize Twin</span>
                  <Sparkles className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Continue to Step {step + 1}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {step === 1 && (
            <div className="text-center text-xs text-slate-600 dark:text-slate-400 pt-1">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-purple-600 dark:text-purple-400 hover:underline">
                Log In
              </Link>
            </div>
          )}
        </div>

        {/* Completion Success Dialog */}
        {isSuccessModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-purple-100 dark:border-slate-800 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 via-rose-500 to-purple-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-purple-500/30 animate-pulse">
                <Sparkles className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Twin Synthesized!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Welcome to FemSphere, <span className="font-bold text-purple-600">{fullName || 'Sarah'}</span>! Your Lifetime AI Health Twin model has been created.
                </p>
              </div>

              <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-100 dark:border-slate-800 text-left text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Life Stage:</span>
                  <span className="font-bold text-purple-600">Reproductive Age</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Baseline Health Score:</span>
                  <span className="font-bold text-emerald-600">87 / 100</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Sensors Synced:</span>
                  <span className="font-bold text-slate-800 dark:text-white">Amazfit + Wearable BLE</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  navigate('/app');
                }}
                className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 min-h-[48px]"
              >
                Launch My Health Twin Dashboard 🌸
              </button>
            </div>
          </div>
        )}

      </div>
    </MobileFrame>
  );
}
