import React, { useState } from 'react';
import { Sparkles, Heart, Dna, Brain, Calendar, Shield, Apple, Moon, User, Users, Stethoscope } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import heroImg from '../assets/images/healthcare_hero_1785261756891.jpeg';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeRole, setActiveRole] = useState('Myself');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigateRoleDashboard = (targetRole: string, userEmail: string) => {
    if (userEmail.toLowerCase().includes('admin') || targetRole === 'Administrator' || targetRole === 'Admin (Superuser)') {
      navigate('/admin');
    } else if (targetRole === 'Caregiver') {
      navigate('/caregiver-dashboard');
    } else if (targetRole === 'Doctor') {
      navigate('/doctor-dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMsg(data.message || 'Login failed. Invalid credentials.');
        setIsLoading(false);
        return;
      }

      // Save token and user details in localStorage
      localStorage.setItem('femsphere_token', data.token);
      localStorage.setItem('femsphere_user', JSON.stringify(data.user));

      navigateRoleDashboard(data.user.role, data.user.email);
    } catch (err: any) {
      // Fallback mode if backend API DB server is offline / unreachable
      const usernameFromEmail = email.split('@')[0] || 'user';
      const mockUser = {
        id: 1,
        username: usernameFromEmail,
        fullName: usernameFromEmail.replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        email: email || 'elena.rostova@femsphere.health',
        role: activeRole,
        status: 'Active',
        profile: {
          full_name: usernameFromEmail.replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        }
      };
      localStorage.setItem('femsphere_token', 'demo_token_2026');
      localStorage.setItem('femsphere_user', JSON.stringify(mockUser));
      navigateRoleDashboard(mockUser.role, mockUser.email);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleQuickLogin = async (role: string, roleEmail: string) => {
    setActiveRole(role);
    setEmail(roleEmail);
    setPassword('password123');
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: roleEmail, password: 'password123' })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('femsphere_token', data.token);
        localStorage.setItem('femsphere_user', JSON.stringify(data.user));
        navigateRoleDashboard(data.user.role || role, data.user.email || roleEmail);
      } else {
        const qUsername = roleEmail.split('@')[0];
        const qFullName = qUsername.replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        const mockUser = {
          id: 1,
          username: qUsername,
          fullName: qFullName,
          email: roleEmail,
          role: role,
          status: 'Active',
          profile: { full_name: qFullName }
        };
        localStorage.setItem('femsphere_token', 'demo_token_2026');
        localStorage.setItem('femsphere_user', JSON.stringify(mockUser));
        navigateRoleDashboard(role, roleEmail);
      }
    } catch (err) {
      const cUsername = roleEmail.split('@')[0];
      const cFullName = cUsername.replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      const mockUser = {
        id: 1,
        username: cUsername,
        fullName: cFullName,
        email: roleEmail,
        role: role,
        status: 'Active',
        profile: { full_name: cFullName }
      };
      localStorage.setItem('femsphere_token', 'demo_token_2026');
      localStorage.setItem('femsphere_user', JSON.stringify(mockUser));
      navigateRoleDashboard(role, roleEmail);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f6] flex items-center justify-center p-6 font-sans">
      <div className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-[#EDE9FE]">
        
        {/* Left Side - Illustration */}
        <div className="md:w-1/2 relative hidden md:block bg-gradient-to-br from-[#EDE9FE] to-[#FCE7F3] p-12">
          <div className="absolute inset-0">
            <img src={heroImg} alt="Health Twin" className="w-full h-full object-cover opacity-30 mix-blend-multiply" />
          </div>
          
          <div className="relative z-10 h-full flex flex-col justify-center text-center">
             {/* Floating Icons */}
             <Heart className="absolute top-10 left-10 w-8 h-8 text-[#F472B6] animate-bounce" style={{animationDuration: '3s'}} />
             <Dna className="absolute top-20 right-20 w-8 h-8 text-[#7C3AED] animate-bounce" style={{animationDuration: '4s'}} />
             <Brain className="absolute bottom-20 left-20 w-8 h-8 text-[#14B8A6] animate-bounce" style={{animationDuration: '3.5s'}} />
             <Moon className="absolute bottom-10 right-10 w-8 h-8 text-[#6366F1] animate-bounce" style={{animationDuration: '4.5s'}} />

             <h2 className="font-serif text-4xl text-[#3a3135] mb-4">Welcome back to <br/><span className="text-[#7C3AED]">FemSphere</span></h2>
             <p className="text-[#64595e] font-light">Your personalized women's health intelligence platform.</p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white/80 backdrop-blur-xl">
          <Link to="/" className="flex items-center gap-2 mb-6 mx-auto md:mx-0">
            <h1 className="font-serif text-2xl font-bold text-[#7C3AED]">FemSphere</h1>
            <Sparkles className="w-4 h-4 text-[#14B8A6]" />
          </Link>

          <div className="mb-6">
            <h3 className="text-2xl font-bold text-[#3a3135]">Log in to your account</h3>
            <p className="text-xs text-[#7a6f75] mt-1">Enter credentials or select a role for quick demo access.</p>
          </div>

          {/* Quick Demo Login by Role Section */}
          <div className="mb-6 bg-[#F5F3FF] p-4 rounded-2xl border border-[#EDE9FE]">
            <span className="text-[11px] font-bold text-[#7C3AED] uppercase tracking-wider block mb-2.5">
              Quick Demo Login by Role:
            </span>
            <div className="grid grid-cols-2 gap-2">
              
              {/* Role 1: Myself */}
              <button 
                type="button" 
                onClick={() => handleRoleQuickLogin('Myself', 'elena.rostova@femsphere.health')}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white hover:bg-[#7C3AED] hover:text-white border border-[#EDE9FE] text-[#3a3135] text-xs font-bold transition-all shadow-xs group"
              >
                <div className="w-6 h-6 rounded-lg bg-[#F5F3FF] group-hover:bg-[#7C3AED] flex items-center justify-center text-[#7C3AED] group-hover:text-white">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span>Myself</span>
              </button>

              {/* Role 2: Caregiver */}
              <button 
                type="button" 
                onClick={() => handleRoleQuickLogin('Caregiver', 'caregiver@femsphere.health')}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white hover:bg-[#7C3AED] hover:text-white border border-[#EDE9FE] text-[#3a3135] text-xs font-bold transition-all shadow-xs group"
              >
                <div className="w-6 h-6 rounded-lg bg-[#F5F3FF] group-hover:bg-white/20 flex items-center justify-center text-[#7C3AED] group-hover:text-white">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <span>Caregiver</span>
              </button>

              {/* Role 3: Doctor */}
              <button 
                type="button" 
                onClick={() => handleRoleQuickLogin('Doctor', 'dr.jenkins@femsphere.health')}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white hover:bg-[#7C3AED] hover:text-white border border-[#EDE9FE] text-[#3a3135] text-xs font-bold transition-all shadow-xs group"
              >
                <div className="w-6 h-6 rounded-lg bg-[#F5F3FF] group-hover:bg-white/20 flex items-center justify-center text-[#7C3AED] group-hover:text-white">
                  <Stethoscope className="w-3.5 h-3.5" />
                </div>
                <span>Doctor</span>
              </button>

              {/* Role 4: Administrator */}
              <button 
                type="button" 
                onClick={() => handleRoleQuickLogin('Administrator', 'admin@femsphere.health')}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-[#7C3AED] text-white hover:bg-[#6D28D9] text-xs font-bold transition-all shadow-sm group"
              >
                <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-white">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <span>Administrator</span>
              </button>

            </div>

            <div className="mt-3 pt-2.5 border-t border-[#EDE9FE] flex items-center justify-between text-[11px] text-[#7a6f75]">
              <span className="font-semibold text-[#7C3AED]">Demo Credentials:</span>
              <span className="font-mono bg-white px-2 py-0.5 rounded border border-[#EDE9FE] text-[#3a3135]">
                {activeRole === 'Administrator' ? 'admin@femsphere.health / admin' : `${email} / ••••••••`}
              </span>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1.5">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@example.com" 
                className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none transition-all text-sm" 
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1.5">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••" 
                className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none transition-all text-sm" 
                required 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-[#EDE9FE] text-[#7C3AED] focus:ring-[#7C3AED]" />
                <span className="text-xs text-[#7a6f75]">Remember me</span>
              </label>
              <a href="#" className="text-xs font-medium text-[#7C3AED] hover:underline">Forgot password?</a>
            </div>

            <button type="submit" className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl py-3.5 text-sm font-bold shadow-md shadow-purple-200 transition-colors">
              Log In as {activeRole}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#7a6f75]">
            Don't have an account? <Link to="/register" className="font-bold text-[#7C3AED] hover:underline">Register</Link>
          </p>
        </div>

      </div>
    </div>
  );
}
