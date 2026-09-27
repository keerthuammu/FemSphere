import React, { useState } from 'react';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  Calendar,
  Phone,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  X,
  KeyRound
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LifeStageId } from '../../types';

export default function AuthModal() {
  const {
    isAuthOpen,
    setIsAuthOpen,
    authMode,
    setAuthMode,
    setUser,
    user
  } = useApp();

  // Registration step (1 to 7)
  const [regStep, setRegStep] = useState(1);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('Sarah Jenkins');
  const [dob, setDob] = useState('1998-05-14');
  const [lifeStage, setLifeStage] = useState<LifeStageId>('reproductive_age');
  const [contactName, setContactName] = useState('Alex Jenkins');
  const [contactPhone, setContactPhone] = useState('+1 (555) 234-5678');
  const [otpCode, setOtpCode] = useState(['4', '8', '2', '9']);

  if (!isAuthOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Logged in securely to FemSphere Health Twin.');
    setIsAuthOpen(false);
  };

  const handleRegNext = () => {
    if (regStep < 7) {
      setRegStep(prev => prev + 1);
    } else {
      // Completed Step 7
      setUser(prev => ({
        ...prev,
        name: fullName || 'Sarah Jenkins',
        email: email || 'sarah.jenkins@example.com',
        dob: dob || '1998-05-14',
        currentLifeStage: lifeStage,
        emergencyContact: {
          name: contactName,
          relationship: 'Partner',
          phone: contactPhone,
        },
      }));
      alert('Welcome to FemSphere! Your Digital Health Twin is initialized.');
      setIsAuthOpen(false);
      setRegStep(1);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Phone & Email verified successfully.');
    setAuthMode('login');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="w-full max-w-md h-[92vh] max-h-[720px] bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-purple-100 dark:border-slate-800 flex flex-col justify-between overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {authMode === 'login' && 'Sign In to FemSphere'}
                {authMode === 'register' && `Create Account · Step ${regStep} of 7`}
                {authMode === 'forgot' && 'Reset Password'}
                {authMode === 'otp' && 'Verify Security Code'}
              </h3>
              <p className="text-[10px] text-slate-400">
                End-to-end encrypted medical identity
              </p>
            </div>
          </div>

          <button onClick={() => setIsAuthOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">
            ✕
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 scrollbar-thin">
          {/* 1. LOGIN */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="sarah.jenkins@example.com"
                    defaultValue="sarah.jenkins@example.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-purple-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    defaultValue="••••••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-purple-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500">Remember on this device</span>
                <button
                  type="button"
                  onClick={() => setAuthMode('forgot')}
                  className="text-purple-600 font-semibold hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all min-h-[44px]"
              >
                Sign In & Open Health Twin
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500">Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setRegStep(1);
                  }}
                  className="text-xs text-purple-600 font-bold hover:underline"
                >
                  Create Twin Account
                </button>
              </div>
            </form>
          )}

          {/* 2. MULTI-STEP REGISTRATION (Steps 1 to 7) */}
          {authMode === 'register' && (
            <div className="space-y-4">
              {/* Progress bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-purple-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(regStep / 7) * 100}%` }}
                ></div>
              </div>

              {/* Step 1: Basic Info */}
              {regStep === 1 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Step 1: Account Information
                  </h4>
                  <div>
                    <label className="text-xs text-slate-600 dark:text-slate-300 block mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full px-3 py-2 rounded-xl border border-purple-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 dark:text-slate-300 block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="sarah.jenkins@example.com"
                      className="w-full px-3 py-2 rounded-xl border border-purple-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 dark:text-slate-300 block mb-1">Password</label>
                    <input
                      type="password"
                      defaultValue="Secret123!"
                      className="w-full px-3 py-2 rounded-xl border border-purple-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Date of Birth */}
              {regStep === 2 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Step 2: Date of Birth
                  </h4>
                  <p className="text-xs text-slate-500">
                    Used strictly to calibrate age-appropriate hormonal baseline models.
                  </p>
                  <div>
                    <label className="text-xs text-slate-600 dark:text-slate-300 block mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={dob}
                      onChange={e => setDob(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-purple-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Life Stage */}
              {regStep === 3 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Step 3: Select Your Life Stage
                  </h4>
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {[
                      { id: 'puberty', label: 'Puberty (13 - 17)' },
                      { id: 'reproductive_age', label: 'Reproductive Age (18 - 40)' },
                      { id: 'pregnancy', label: 'Pregnancy Mode' },
                      { id: 'postpartum', label: 'Postpartum (Fourth Trimester)' },
                      { id: 'perimenopause', label: 'Perimenopause (40 - 50)' },
                      { id: 'menopause', label: 'Menopause (51 - 65)' },
                      { id: 'older_adult', label: 'Older Adult (65+)' },
                    ].map(st => (
                      <button
                        type="button"
                        key={st.id}
                        onClick={() => setLifeStage(st.id as any)}
                        className={`w-full p-2.5 rounded-xl border text-xs font-semibold text-left transition-all min-h-[44px] ${
                          lifeStage === st.id
                            ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Health Preferences */}
              {regStep === 4 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Step 4: Health & Tracking Preferences
                  </h4>
                  <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span>Sync Menstrual Cycle Predictions</span>
                      <span className="text-purple-600 font-bold">Enabled</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Proactive Sleep Architecture Alerts</span>
                      <span className="text-purple-600 font-bold">Enabled</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Electrolyte & Hydration Reminders</span>
                      <span className="text-purple-600 font-bold">Enabled</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Emergency Contact */}
              {regStep === 5 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Step 5: Emergency Contact
                  </h4>
                  <div>
                    <label className="text-xs text-slate-600 dark:text-slate-300 block mb-1">Contact Name</label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={e => setContactName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-purple-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 dark:text-slate-300 block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={e => setContactPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-purple-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Step 6: Permissions */}
              {regStep === 6 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Step 6: Permissions & Privacy Consent
                  </h4>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2 text-xs">
                    <p className="text-slate-600 dark:text-slate-300">
                      FemSphere uses localized zero-knowledge models. You grant consent for HIPAA-compliant biometric aggregation and opt-in AI summarization.
                    </p>
                    <span className="text-emerald-600 font-bold block">✓ Privacy terms accepted</span>
                  </div>
                </div>
              )}

              {/* Step 7: Complete Profile */}
              {regStep === 7 && (
                <div className="space-y-3 text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    Ready to Launch Your Health Twin!
                  </h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Your baseline physiological parameters and security keys have been initialized.
                  </p>
                </div>
              )}

              {/* Navigation buttons for multi-step */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-purple-100 dark:border-slate-800">
                {regStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setRegStep(prev => prev - 1)}
                    className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold flex items-center gap-1 text-slate-600 dark:text-slate-300 min-h-[44px]"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleRegNext}
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 min-h-[44px]"
                >
                  <span>{regStep === 7 ? 'Complete Setup' : 'Continue'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-xs text-purple-600 font-semibold hover:underline"
                >
                  Already have an account? Sign In
                </button>
              </div>
            </div>
          )}

          {/* 3. FORGOT PASSWORD */}
          {authMode === 'forgot' && (
            <div className="space-y-3.5">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Enter your verified email or phone number to receive a secure one-time passcode (OTP).
              </p>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Email Address / Phone
                </label>
                <input
                  type="text"
                  defaultValue="sarah.jenkins@example.com"
                  className="w-full px-3 py-2.5 rounded-xl border border-purple-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <button
                type="button"
                onClick={() => setAuthMode('otp')}
                className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs min-h-[44px]"
              >
                Send Verification Code
              </button>

              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="w-full text-xs text-slate-500 font-semibold hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          )}

          {/* 4. OTP VERIFICATION */}
          {authMode === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-center">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Enter the 4-digit security code transmitted to your phone ending in ••78.
              </p>

              <div className="flex justify-center gap-2">
                {otpCode.map((digit, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    defaultValue={digit}
                    className="w-12 h-12 text-center text-lg font-bold rounded-xl border border-purple-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                ))}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md min-h-[44px]"
              >
                Verify & Reset Access
              </button>

              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="w-full text-xs text-slate-500 font-semibold hover:underline"
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
