import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import heroImg from '../assets/images/healthcare_hero_1785261756891.jpeg';
import { isValidEmail } from '../utils/validation';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigateRoleDashboard = (targetRole: string, userEmail: string, userData?: any) => {
    if (userEmail.toLowerCase().includes('admin') || targetRole === 'Administrator' || targetRole === 'Admin (Superuser)') {
      navigate('/admin');
    } else if (targetRole === 'Caregiver') {
      navigate('/caregiver-dashboard');
    } else if (targetRole === 'Doctor') {
      if (userData?.doctor?.approval_status !== 'Approved') {
        navigate('/doctor-pending');
      } else {
        navigate('/doctor-dashboard');
      }
    } else {
      navigate('/dashboard');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!isValidEmail(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

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

      navigateRoleDashboard(data.user.role, data.user.email, data.user);
    } catch (err: any) {
      setErrorMsg('Unable to reach the server. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f6] flex items-center justify-center p-6 font-sans">
      <div className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-[#EDE9FE]">
        
        {/* Left Side - Illustration */}
        <div className="md:w-1/2 relative hidden md:block">
          <img src={heroImg} alt="Health Twin" className="w-full h-full object-cover" />
        </div>

        {/* Right Side - Login Form */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white/80 backdrop-blur-xl">
          <Link to="/" className="flex items-center gap-2 mb-6 mx-auto md:mx-0">
            <h1 className="font-serif text-2xl font-bold text-[#7C3AED]">FemSphere</h1>
            <Sparkles className="w-4 h-4 text-[#14B8A6]" />
          </Link>

          <div className="mb-6">
            <h3 className="text-2xl font-bold text-[#3a3135]">Log in to your account</h3>
            <p className="text-xs text-[#7a6f75] mt-1">Enter your credentials to access your account.</p>
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
                className={`w-full px-4 py-3 rounded-xl border ${
                  email.trim() && !isValidEmail(email)
                    ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                    : 'border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100'
                } outline-none transition-all text-sm`} 
                required 
              />
              {email.trim() && !isValidEmail(email) && (
                <p className="text-xs mt-1.5 font-medium text-red-500">
                  Invalid email
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1.5">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••" 
                className={`w-full px-4 py-3 rounded-xl border ${
                  password && password.length < 6
                    ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                    : 'border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100'
                } outline-none transition-all text-sm`} 
                required 
              />
              {password && password.length < 6 && (
                <p className="text-xs mt-1.5 font-medium text-red-500">
                  Password must be at least 6 characters
                </p>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-[#EDE9FE] text-[#7C3AED] focus:ring-[#7C3AED]" />
                <span className="text-xs text-[#7a6f75]">Remember me</span>
              </label>
              <a href="#" className="text-xs font-medium text-[#7C3AED] hover:underline">Forgot password?</a>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white rounded-xl py-3.5 text-sm font-bold shadow-md shadow-purple-200 transition-colors"
            >
              {isLoading ? 'Logging In...' : 'Log In'}
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
