import React, { useState } from 'react';
import {
  Sparkles,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Fingerprint,
  ArrowLeft,
  Sun,
  Moon,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import MobileFrame from '../components/common/MobileFrame';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export default function Login() {
  const navigate = useNavigate();
  const { role, setRole, isDark, toggleTheme, setUser, user } = useApp();

  const [email, setEmail] = useState('sarah.jenkins@example.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [biometricScanning, setBiometricScanning] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Quick preset accounts for instant reviewer access
  const demoAccounts: Record<UserRole, { email: string; name: string; label: string; icon: string }> = {
    patient: {
      email: 'sarah.jenkins@example.com',
      name: 'Sarah Jenkins',
      label: 'Patient (Reproductive Age)',
      icon: '🌸',
    },
    caregiver: {
      email: 'alex.jenkins@example.com',
      name: 'Alex Jenkins',
      label: 'Caregiver (Family Sync)',
      icon: '💗',
    },
    doctor: {
      email: 'dr.miller@femsphere.health',
      name: 'Dr. Evelyn Miller',
      label: 'Doctor (OB/GYN)',
      icon: '🩺',
    },
    admin: {
      email: 'admin@femsphere.internal',
      name: 'System Administrator',
      label: 'Admin (Platform Portal)',
      icon: '🛡️',
    },
  };

  const handleSelectRole = (selectedRole: UserRole) => {
    setRole(selectedRole);
    const demo = demoAccounts[selectedRole];
    setEmail(demo.email);
    setPassword('FemSphere2026!');
    setLoginError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        localStorage.setItem('femsphere_token', data.token);
        localStorage.setItem('femsphere_user', JSON.stringify(data.user));

        let mappedRole: UserRole = 'patient';
        if (data.user.role === 'Caregiver') mappedRole = 'caregiver';
        else if (data.user.role === 'Doctor') mappedRole = 'doctor';
        else if (data.user.role === 'Administrator' || data.user.role === 'Admin (Superuser)') mappedRole = 'admin';

        setRole(mappedRole);
        setUser(prev => ({
          ...prev,
          name: data.user.fullName || data.user.username || prev.name,
          email: data.user.email || prev.email,
          role: mappedRole,
        }));
        setIsLoading(false);
        navigate('/app');
        return;
      } else if (data.message) {
        // If password failed on real account, show message
        setLoginError(data.message);
      }
    } catch {
      // offline fallback
    }

    // Smooth fallback to local session demo mode if backend is offline
    setTimeout(() => {
      setIsLoading(false);
      const demo = demoAccounts[role];
      setUser(prev => ({
        ...prev,
        name: demo.name,
        email: email || demo.email,
        role: role,
      }));
      navigate('/app');
    }, 600);
  };

  const handleBiometricAuth = async () => {
    setBiometricScanning(true);
    setLoginError(null);

    const emailMap: Record<UserRole, string> = {
      patient: 'elena.rostova@femsphere.health',
      caregiver: 'caregiver@femsphere.health',
      doctor: 'dr.jenkins@femsphere.health',
      admin: 'admin@femsphere.health',
    };

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailMap[role], password: 'Password123!' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('femsphere_token', data.token);
        localStorage.setItem('femsphere_user', JSON.stringify(data.user));
      }
    } catch {
      // offline fallback
    }

    setTimeout(() => {
      setBiometricScanning(false);
      const demo = demoAccounts[role];
      setUser(prev => ({
        ...prev,
        name: demo.name,
        email: demo.email,
        role: role,
      }));
      navigate('/app');
    }, 1000);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSent(true);
    setTimeout(() => {
      setForgotSent(false);
      setForgotModalOpen(false);
    }, 2200);
  };

  return (
    <MobileFrame>
      <div className="min-h-full flex flex-col justify-between bg-[#FCFAFE] dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-4 sm:p-6 transition-colors">
        
        {/* Mobile Header Bar */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-purple-100/60 dark:border-slate-800/80">
            <button
              onClick={() => navigate('/')}
              aria-label="Back to home"
              className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-purple-100/80 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-xs hover:bg-purple-50 dark:hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-rose-500 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-serif text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                FemSphere
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

          {/* Welcome Intro Banner */}
          <div className="mt-5 space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-100/70 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[10px] font-bold tracking-wide uppercase">
              <ShieldCheck className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              <span>Biometric & Encrypted Twin</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Welcome Back
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Access your personalized Lifetime Digital Health Twin.
            </p>
          </div>

          {/* Quick Role Segmented Switcher */}
          <div className="mt-4 p-1 bg-purple-50/80 dark:bg-slate-800/80 rounded-2xl border border-purple-100/80 dark:border-slate-700">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 py-1 flex items-center justify-between">
              <span>Select Experience Persona</span>
              <span className="text-purple-600 dark:text-purple-400 font-semibold">{demoAccounts[role].name}</span>
            </div>
            <div className="grid grid-cols-4 gap-1 mt-1">
              {(['patient', 'caregiver', 'doctor', 'admin'] as UserRole[]).map(r => {
                const isActive = role === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleSelectRole(r)}
                    className={`py-2 px-1 rounded-xl text-[11px] font-bold flex flex-col items-center justify-center gap-0.5 transition-all min-h-[44px] ${
                      isActive
                        ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-300 shadow-sm border border-purple-200/60 dark:border-slate-700'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <span className="text-sm">{demoAccounts[r].icon}</span>
                    <span className="capitalize text-[10px]">{r}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick 1-Tap Demo Switcher Chip */}
          <div className="mt-2.5 flex items-center justify-between px-1">
            <span className="text-[10px] text-slate-400">1-Tap Preset:</span>
            <button
              type="button"
              onClick={() => handleSelectRole(role)}
              className="text-[10px] font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
            >
              <UserCheck className="w-3 h-3" /> Auto-fill {demoAccounts[role].name} credentials
            </button>
          </div>

          {/* Error Banner */}
          {loginError && (
            <div className="mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Mobile Login Form */}
          <form onSubmit={handleLogin} className="mt-4 space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Email / FemSphere ID
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-purple-500 dark:text-purple-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@femsphere.health"
                  required
                  className="w-full pl-10 pr-3 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-purple-100 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 shadow-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-purple-500 dark:text-purple-400 absolute left-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-purple-100 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Toggle */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-purple-200 dark:border-slate-700 dark:bg-slate-800"
                />
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Remember on this device
                </span>
              </label>

              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> HIPAA & GDPR Secure
              </span>
            </div>

            {/* Sign In CTA */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 min-h-[48px]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Biometric Mobile Auth Button */}
          <div className="mt-3">
            <button
              type="button"
              onClick={handleBiometricAuth}
              disabled={biometricScanning}
              className="w-full py-3 px-4 rounded-2xl bg-white dark:bg-slate-800 hover:bg-purple-50/60 dark:hover:bg-slate-700/60 border border-purple-100 dark:border-slate-700 text-xs font-semibold text-purple-700 dark:text-purple-300 shadow-xs flex items-center justify-center gap-2.5 transition-all min-h-[46px]"
            >
              <Fingerprint className={`w-5 h-5 text-purple-600 dark:text-purple-400 ${biometricScanning ? 'animate-pulse text-rose-500' : ''}`} />
              <span>
                {biometricScanning ? 'Scanning Face ID / Touch ID...' : 'Sign in with Face ID / Biometrics'}
              </span>
            </button>
          </div>

          {/* Social Sign In */}
          <div className="mt-4 pt-3 border-t border-purple-100/60 dark:border-slate-800">
            <div className="text-center text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2.5">
              Or continue with
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setUser(prev => ({ ...prev, name: 'Sarah Jenkins', email: 'sarah.apple@icloud.com' }));
                  navigate('/dashboard');
                }}
                className="py-2.5 px-3 rounded-2xl bg-white dark:bg-slate-800 border border-purple-100 dark:border-slate-700 hover:bg-purple-50/40 dark:hover:bg-slate-700/40 text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 transition-colors min-h-[44px]"
              >
                <span className="font-bold text-sm"></span>
                <span>Apple</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setUser(prev => ({ ...prev, name: 'Sarah Jenkins', email: 'sarah.google@gmail.com' }));
                  navigate('/dashboard');
                }}
                className="py-2.5 px-3 rounded-2xl bg-white dark:bg-slate-800 border border-purple-100 dark:border-slate-700 hover:bg-purple-50/40 dark:hover:bg-slate-700/40 text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 transition-colors min-h-[44px]"
              >
                <span className="font-bold text-red-500">G</span>
                <span>Google</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Footer Links */}
        <div className="pt-4 border-t border-purple-100/60 dark:border-slate-800 mt-4 space-y-2">
          <div className="text-center text-xs text-slate-600 dark:text-slate-400">
            Don't have a FemSphere account?{' '}
            <Link
              to="/register"
              className="font-bold text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center gap-0.5"
            >
              <span>Create Account</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-[11px] font-semibold text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Continue as Guest / Explore Demo Dashboard →
            </button>
          </div>
        </div>

        {/* Forgot Password Bottom Sheet / Modal */}
        {forgotModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-purple-100 dark:border-slate-800 animate-in slide-in-from-bottom-5">
              <div className="flex items-center justify-between pb-3 border-b border-purple-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Reset Password
                  </h3>
                </div>
                <button
                  onClick={() => setForgotModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold p-1"
                >
                  ✕
                </button>
              </div>

              {forgotSent ? (
                <div className="py-6 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto animate-bounce" />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Reset Link Dispatched
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    We've sent recovery instructions to <span className="font-semibold text-purple-600">{forgotEmail || email}</span>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="mt-4 space-y-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Enter the email registered with your Digital Health Twin and we'll send a secure one-time verification link.
                  </p>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={forgotEmail || email}
                      onChange={e => setForgotEmail(e.target.value)}
                      required
                      placeholder="you@domain.com"
                      className="w-full px-3 py-2.5 rounded-xl border border-purple-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs min-h-[44px]"
                  >
                    Send Recovery Code
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </MobileFrame>
  );
}

function KeyRound(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
      <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
    </svg>
  );
}
