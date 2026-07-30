import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, Check, User, Users, Stethoscope, Shield, Heart, 
  Upload, ChevronLeft, ChevronRight, Lock, Activity, Phone, 
  Mail, MapPin, Calendar, FileText, CheckSquare, Square, FileCheck
} from 'lucide-react';

export default function Register() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    // Step 1
    accountType: 'User (Female)', // 'User (Female)', 'Caregiver', 'Doctor'

    // Step 2: Personal Information
    fullName: 'Elena Rostova',
    dob: '1996-08-14',
    gender: 'Female', // Female, Male, Other
    mobileNumber: '+1 (555) 382-9102',
    email: 'elena.rostova@femsphere.health',
    address: '742 Evergreen Terrace, Suite 4B',
    pincode: '94107',
    country: 'United States',
    state: 'California',
    city: 'San Francisco',
    profilePhoto: null as File | null,

    // Step 3: Account Credentials
    username: 'elena_health',
    password: '••••••••••••',
    confirmPassword: '••••••••••••',

    // Step 4: Role-Specific Information (User Female)
    bloodGroup: 'A Positive (A+)',
    heightCm: '168',
    weightKg: '62',
    maritalStatus: 'Single',
    lifeStage: 'Reproductive Age',
    wearableDevice: 'Apple Watch',
    emergencyContactName: 'Marcus Rostova',
    emergencyContactPhone: '+1 (555) 902-4118',

    // Caregiver specific fields
    caregiverType: 'Parent',
    dependentName: 'Sophia Rostova',
    dependentCategory: 'Child / Infant',
    // Caregiver Primary Scope (Multi-select array)
    caregiverScopes: ['Medication Reminders & Vital Tracking', 'Vaccination & Appointment Scheduling'],
    relationship: 'Parent',

    // Doctor specific fields
    licenseNumber: 'MD-892401',
    specialization: 'Obstetrics & Gynecology',
    hospitalClinic: 'St. Jude Women\'s Health Center',
    yearsOfExperience: '12',

    // Step 5: Privacy, Rules & Role Consent
    infoAccurate: true,
    termsAgreed: true,
    dataProcessingConsent: true,
    dataControlConsent: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, profilePhoto: e.target.files![0] }));
    }
  };

  // Toggle multiple caregiver scope selections
  const toggleCaregiverScope = (scope: string) => {
    setFormData(prev => {
      const exists = prev.caregiverScopes.includes(scope);
      if (exists) {
        return { ...prev, caregiverScopes: prev.caregiverScopes.filter(s => s !== scope) };
      } else {
        return { ...prev, caregiverScopes: [...prev.caregiverScopes, scope] };
      }
    });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 5) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 5) {
      if (!(formData.infoAccurate && formData.termsAgreed && formData.dataProcessingConsent && formData.dataControlConsent)) {
        alert('Please confirm and accept all conditions to complete your registration.');
        return;
      }
      // Redirect based on role
      if (formData.accountType === 'Caregiver') {
        navigate('/caregiver-dashboard');
      } else if (formData.accountType === 'Doctor') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      handleNext(e);
    }
  };

  const stepTitles = [
    'Account Type',
    'Personal Info',
    'Credentials',
    'Role Details',
    'Rules & Consent'
  ];

  const caregiverScopeOptions = [
    'Medication Reminders & Vital Tracking',
    'Symptom Monitoring & Growth Tracking',
    'Vaccination & Appointment Scheduling',
    'Emergency Escalation & Alert Response',
    'Full Daily Health Care Support'
  ];

  return (
    <div className="min-h-screen bg-[#fbf9f6] flex flex-col font-sans text-[#3a3135]">
      {/* Top Nav */}
      <div className="p-4 md:px-12 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-[#EDE9FE]">
        <Link to="/" className="flex items-center gap-2">
          <h1 className="font-serif text-2xl font-bold text-[#7C3AED] tracking-tight">FemSphere</h1>
          <Sparkles className="w-4 h-4 text-[#14B8A6]" />
        </Link>
        <p className="text-sm text-[#7a6f75]">
          Already have an account? <Link to="/login" className="font-bold text-[#7C3AED] hover:underline ml-1">Login</Link>
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center py-8 px-4 md:px-8 max-w-4xl mx-auto w-full">
        
        {/* Stepper Header */}
        <div className="w-full mb-8">
          <div className="flex items-center justify-between relative mb-2">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-[#EDE9FE] -z-10 rounded-full"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#7C3AED] -z-10 rounded-full transition-all duration-500" 
              style={{ width: `${((step - 1) / 4) * 100}%` }}
            ></div>
            
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => num < step && setStep(num)}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  step === num 
                    ? 'bg-[#7C3AED] text-white ring-4 ring-[#EDE9FE] shadow-md scale-110' 
                    : step > num 
                      ? 'bg-[#7C3AED] text-white cursor-pointer' 
                      : 'bg-white text-[#a89cb5] border-2 border-[#EDE9FE]'
                }`}
              >
                {step > num ? <Check className="w-4 h-4" /> : num}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-[11px] uppercase tracking-wider text-[#7a6f75] font-semibold px-1">
            {stepTitles.map((title, i) => (
              <span key={i} className={`text-center ${step === i + 1 ? 'text-[#7C3AED] font-bold' : ''}`}>
                {title}
              </span>
            ))}
          </div>
        </div>

        {/* Main Form Container */}
        <div className="w-full bg-white rounded-3xl shadow-xl shadow-purple-900/5 border border-[#EDE9FE] p-6 md:p-10 relative overflow-hidden">
          
          <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-4 mb-6">
            <div>
              <span className="text-xs font-bold text-[#7C3AED] uppercase tracking-widest bg-[#F5F3FF] px-3 py-1 rounded-full border border-[#EDE9FE]">
                Step {step} of 5
              </span>
              <h2 className="font-serif text-2xl md:text-3xl text-[#3a3135] mt-2">
                {step === 1 && "Account Type (Required)"}
                {step === 2 && "Personal Information"}
                {step === 3 && "Account Credentials"}
                {step === 4 && `Role-Specific Information (${formData.accountType === 'User (Female)' ? 'Myself' : formData.accountType})`}
                {step === 5 && "Rules, Regulations & Consent"}
              </h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* STEP 1: Account Type */}
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-sm text-[#7a6f75] mb-2">Select the primary profile role for your FemSphere workspace access:</p>
                
                {/* Option 1: User (Female) -> Myself */}
                <div 
                  onClick={() => setFormData(prev => ({ ...prev, accountType: 'User (Female)' }))}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
                    formData.accountType === 'User (Female)' 
                      ? 'border-[#7C3AED] bg-[#F5F3FF]/70 shadow-sm ring-1 ring-[#7C3AED]' 
                      : 'border-[#EDE9FE] hover:border-[#7C3AED]/50 bg-white'
                  }`}
                >
                  <div className={`p-3 rounded-xl ${formData.accountType === 'User (Female)' ? 'bg-[#7C3AED] text-white' : 'bg-[#EDE9FE] text-[#7C3AED]'}`}>
                    <User className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-[#3a3135] text-base">Myself</h3>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EDE9FE] text-[#7C3AED]">Default</span>
                    </div>
                    <p className="text-xs text-[#64595e] mt-1 leading-relaxed">
                      Track your personal Digital Health Twin, cycles, vitals, sleep, and AI health insights for yourself.
                    </p>
                  </div>
                </div>

                {/* Option 2: Caregiver */}
                <div 
                  onClick={() => setFormData(prev => ({ ...prev, accountType: 'Caregiver' }))}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
                    formData.accountType === 'Caregiver' 
                      ? 'border-[#7C3AED] bg-[#F5F3FF]/70 shadow-sm ring-1 ring-[#7C3AED]' 
                      : 'border-[#EDE9FE] hover:border-[#7C3AED]/50 bg-white'
                  }`}
                >
                  <div className={`p-3 rounded-xl ${formData.accountType === 'Caregiver' ? 'bg-[#7C3AED] text-white' : 'bg-[#EDE9FE] text-[#7C3AED]'}`}>
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#3a3135] text-base">Caregiver</h3>
                    <p className="text-xs text-[#64595e] mt-1 leading-relaxed">
                      Support a partner, child, sister, or elder with medication & growth tracking.
                    </p>
                  </div>
                </div>

                {/* Option 3: Doctor */}
                <div 
                  onClick={() => setFormData(prev => ({ ...prev, accountType: 'Doctor' }))}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
                    formData.accountType === 'Doctor' 
                      ? 'border-[#7C3AED] bg-[#F5F3FF]/70 shadow-sm ring-1 ring-[#7C3AED]' 
                      : 'border-[#EDE9FE] hover:border-[#7C3AED]/50 bg-white'
                  }`}
                >
                  <div className={`p-3 rounded-xl ${formData.accountType === 'Doctor' ? 'bg-[#7C3AED] text-white' : 'bg-[#EDE9FE] text-[#7C3AED]'}`}>
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#3a3135] text-base">Doctor</h3>
                    <p className="text-xs text-[#64595e] mt-1 leading-relaxed">
                      Consult patients online, review AI health reports, and manage appointments.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Personal Information */}
            {step === 2 && (
              <div className="grid md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1">Full Name</label>
                  <input 
                    type="text" 
                    name="fullName" 
                    value={formData.fullName} 
                    onChange={handleChange}
                    placeholder="Elena Rostova" 
                    className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm" 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1">Date of Birth</label>
                  <input 
                    type="date" 
                    name="dob" 
                    value={formData.dob} 
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm" 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1">Gender</label>
                  <select 
                    name="gender" 
                    value={formData.gender} 
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm bg-white font-medium"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1">Mobile Number</label>
                  <input 
                    type="tel" 
                    name="mobileNumber" 
                    value={formData.mobileNumber} 
                    onChange={handleChange}
                    placeholder="+1 (555) 382-9102" 
                    className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm" 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1">Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange}
                    placeholder="elena.rostova@femsphere.health" 
                    className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm" 
                    required 
                  />
                </div>

                {/* Street Address */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1">Address</label>
                  <input 
                    type="text" 
                    name="address" 
                    value={formData.address} 
                    onChange={handleChange}
                    placeholder="Enter your street address, apartment, suite..." 
                    className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm" 
                    required
                  />
                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1">Pincode / Zip Code</label>
                  <input 
                    type="text" 
                    name="pincode" 
                    value={formData.pincode} 
                    onChange={handleChange}
                    placeholder="e.g. 94107" 
                    className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm" 
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1">City</label>
                  <input 
                    type="text" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleChange}
                    placeholder="San Francisco" 
                    className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1">State / Province</label>
                  <input 
                    type="text" 
                    name="state" 
                    value={formData.state} 
                    onChange={handleChange}
                    placeholder="California" 
                    className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1">Country</label>
                  <select 
                    name="country" 
                    value={formData.country} 
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm bg-white"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="India">India</option>
                    <option value="Germany">Germany</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1">Profile Photo (Optional)</label>
                  <div className="flex items-center gap-4 p-3 rounded-xl border border-dashed border-[#EDE9FE] bg-[#FBF9FE]">
                    <Upload className="w-5 h-5 text-[#7C3AED]" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange}
                      className="text-xs text-[#7a6f75] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#EDE9FE] file:text-[#7C3AED] hover:file:bg-[#7C3AED] hover:file:text-white cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Account Credentials */}
            {step === 3 && (
              <div className="space-y-5 max-w-md mx-auto py-2">
                <div>
                  <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1">Username</label>
                  <input 
                    type="text" 
                    name="username" 
                    value={formData.username} 
                    onChange={handleChange}
                    placeholder="elena_health" 
                    className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm" 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1">Password</label>
                  <input 
                    type="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange}
                    placeholder="••••••••••••" 
                    className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm" 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1">Confirm Password</label>
                  <input 
                    type="password" 
                    name="confirmPassword" 
                    value={formData.confirmPassword} 
                    onChange={handleChange}
                    placeholder="••••••••••••" 
                    className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm" 
                    required 
                  />
                </div>
              </div>
            )}

            {/* STEP 4: Role-Specific Information */}
            {step === 4 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between bg-[#F5F3FF] p-3 rounded-xl border border-[#EDE9FE]">
                  <span className="text-xs font-semibold text-[#7C3AED]">Custom Setup</span>
                  <span className="text-xs font-bold text-[#3a3135]">{formData.accountType} Profile</span>
                </div>

                {formData.accountType === 'User (Female)' && (
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1">Blood Group</label>
                      <select 
                        name="bloodGroup" 
                        value={formData.bloodGroup} 
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm bg-white"
                      >
                        <option value="A Positive (A+)">A Positive (A+)</option>
                        <option value="A Negative (A-)">A Negative (A-)</option>
                        <option value="B Positive (B+)">B Positive (B+)</option>
                        <option value="B Negative (B-)">B Negative (B-)</option>
                        <option value="O Positive (O+)">O Positive (O+)</option>
                        <option value="O Negative (O-)">O Negative (O-)</option>
                        <option value="AB Positive (AB+)">AB Positive (AB+)</option>
                        <option value="AB Negative (AB-)">AB Negative (AB-)</option>
                      </select>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-1/2">
                        <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1">Height (cm)</label>
                        <input 
                          type="number" 
                          name="heightCm" 
                          value={formData.heightCm} 
                          onChange={handleChange}
                          placeholder="168" 
                          className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm" 
                        />
                      </div>
                      <div className="w-1/2">
                        <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1">Weight (kg)</label>
                        <input 
                          type="number" 
                          name="weightKg" 
                          value={formData.weightKg} 
                          onChange={handleChange}
                          placeholder="62" 
                          className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm" 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1">Marital Status</label>
                      <select 
                        name="maritalStatus" 
                        value={formData.maritalStatus} 
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm bg-white"
                      >
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1">Current Life Stage</label>
                      <select 
                        name="lifeStage" 
                        value={formData.lifeStage} 
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm bg-white"
                      >
                        <option value="Reproductive Age">Reproductive Age</option>
                        <option value="Adolescence">Adolescence</option>
                        <option value="Pregnancy / Postpartum">Pregnancy / Postpartum</option>
                        <option value="Perimenopause">Perimenopause</option>
                        <option value="Menopause">Menopause</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1">Wearable Device (Optional)</label>
                      <select 
                        name="wearableDevice" 
                        value={formData.wearableDevice} 
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm bg-white"
                      >
                        <option value="Apple Watch">Apple Watch</option>
                        <option value="Fitbit">Fitbit</option>
                        <option value="Google Fit">Google Fit</option>
                        <option value="Oura Ring">Oura Ring</option>
                        <option value="Garmin">Garmin</option>
                        <option value="None">None</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1">Emergency Contact Name</label>
                      <input 
                        type="text" 
                        name="emergencyContactName" 
                        value={formData.emergencyContactName} 
                        onChange={handleChange}
                        placeholder="Marcus Rostova" 
                        className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm" 
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1">Emergency Contact Phone</label>
                      <input 
                        type="tel" 
                        name="emergencyContactPhone" 
                        value={formData.emergencyContactPhone} 
                        onChange={handleChange}
                        placeholder="+1 (555) 902-4118" 
                        className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm" 
                      />
                    </div>
                  </div>
                )}

                {/* CAREGIVER ROLE SPECIFIC QUESTIONS */}
                {formData.accountType === 'Caregiver' && (
                  <div className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1">
                          Caregiver Sub-Type / Role
                        </label>
                        <select 
                          name="caregiverType" 
                          value={formData.caregiverType} 
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm bg-white font-medium"
                        >
                          <option value="Parent">Parent</option>
                          <option value="Partner / Spouse">Partner / Spouse</option>
                          <option value="Sibling">Sibling (Sister / Brother)</option>
                          <option value="Friend">Friend</option>
                          <option value="Nurse">Nurse / Healthcare Professional</option>
                          <option value="Caretaker">Professional Caretaker / Home Health</option>
                          <option value="Relative">Relative / Elder Support</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1">
                          Dependent / Care Recipient Name
                        </label>
                        <input 
                          type="text" 
                          name="dependentName" 
                          value={formData.dependentName} 
                          onChange={handleChange}
                          placeholder="Sophia Rostova" 
                          className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm" 
                          required
                        />
                      </div>
                    </div>

                    {/* Step 4 Requirement: Caregiver Primary Scope (Multi-Selectable) */}
                    <div>
                      <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-2">
                        Caregiver Primary Scope (Select all options that apply)
                      </label>
                      <div className="space-y-2">
                        {caregiverScopeOptions.map((scope, idx) => {
                          const isSelected = formData.caregiverScopes.includes(scope);
                          return (
                            <div 
                              key={idx}
                              onClick={() => toggleCaregiverScope(scope)}
                              className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                                isSelected 
                                  ? 'border-[#7C3AED] bg-[#F5F3FF] font-bold text-[#7C3AED]' 
                                  : 'border-[#EDE9FE] bg-white hover:border-[#7C3AED]/50 text-[#3a3135]'
                              }`}
                            >
                              <span className="text-xs">{scope}</span>
                              <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                                isSelected ? 'bg-[#7C3AED] border-[#7C3AED] text-white' : 'border-[#a89cb5] bg-white'
                              }`}>
                                {isSelected && <Check className="w-3.5 h-3.5" />}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1">
                          Dependent Category / Stage
                        </label>
                        <select 
                          name="dependentCategory" 
                          value={formData.dependentCategory} 
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm bg-white"
                        >
                          <option value="Child / Infant">Child / Infant</option>
                          <option value="Adolescent">Adolescent</option>
                          <option value="Adult">Adult</option>
                          <option value="Elder / Senior">Elder / Senior</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1">
                          Caregiver Emergency Contact Phone
                        </label>
                        <input 
                          type="tel" 
                          name="emergencyContactPhone" 
                          value={formData.emergencyContactPhone} 
                          onChange={handleChange}
                          placeholder="+1 (555) 902-4118" 
                          className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm" 
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* DOCTOR ROLE SPECIFIC QUESTIONS */}
                {formData.accountType === 'Doctor' && (
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1">
                        Medical License Number
                      </label>
                      <input 
                        type="text" 
                        name="licenseNumber" 
                        value={formData.licenseNumber} 
                        onChange={handleChange}
                        placeholder="MD-892401"
                        className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm" 
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1">
                        Medical Specialization
                      </label>
                      <select 
                        name="specialization" 
                        value={formData.specialization} 
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm bg-white"
                      >
                        <option value="Obstetrics & Gynecology">Obstetrics & Gynecology</option>
                        <option value="Maternal-Fetal Medicine">Maternal-Fetal Medicine</option>
                        <option value="Reproductive Endocrinology">Reproductive Endocrinology</option>
                        <option value="Primary Care / Family Medicine">Primary Care / Family Medicine</option>
                        <option value="Pediatrics">Pediatrics</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1">
                        Hospital / Clinic Affiliation
                      </label>
                      <input 
                        type="text" 
                        name="hospitalClinic" 
                        value={formData.hospitalClinic} 
                        onChange={handleChange}
                        placeholder="St. Jude Women's Health Center"
                        className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm" 
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1">
                        Years of Clinical Experience
                      </label>
                      <input 
                        type="number" 
                        name="yearsOfExperience" 
                        value={formData.yearsOfExperience} 
                        onChange={handleChange}
                        placeholder="12"
                        className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm" 
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 5: Rules & Regulations, Terms of Service, Privacy Policy & Consent */}
            {step === 5 && (
              <div className="space-y-5 py-2">
                
                {/* Rules & Regulations, Terms of Service, and Privacy Policy Text Block */}
                <div className="bg-[#FAF8FC] p-5 rounded-2xl border border-[#EDE9FE] space-y-4 max-h-56 overflow-y-auto scrollbar-thin">
                  <div className="flex items-center gap-2 text-[#7C3AED] pb-2 border-b border-[#EDE9FE]">
                    <FileCheck className="w-5 h-5 flex-shrink-0" />
                    <h3 className="font-bold text-sm uppercase tracking-wider">
                      FemSphere Rules & Regulations, Terms of Service, & Privacy Policy ({formData.accountType === 'User (Female)' ? 'Myself' : formData.accountType})
                    </h3>
                  </div>

                  <div className="space-y-3 text-xs text-[#3a3135] leading-relaxed">
                    <div>
                      <h4 className="font-bold text-[#7C3AED] uppercase text-[11px] mb-1">1. Rules & Regulations</h4>
                      <p className="text-[#64595e]">
                        {formData.accountType === 'User (Female)' && "Please enter accurate personal health details to get reliable health tracking and AI advice."}
                        {formData.accountType === 'Caregiver' && "Caregivers must have proper permission from family or legal guardians before adding dependent health details and medication reminders."}
                        {formData.accountType === 'Doctor' && "Doctors must provide valid medical license information for approval before consulting with patients."}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-[#7C3AED] uppercase text-[11px] mb-1">2. Terms of Service</h4>
                      <p className="text-[#64595e]">
                        FemSphere offers personalized health tracking and AI suggestions. These suggestions are for health guidance and do not replace emergency medical care or direct doctor consultations.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-[#7C3AED] uppercase text-[11px] mb-1">3. Privacy & Data Protection</h4>
                      <p className="text-[#64595e]">
                        Your health data is kept safe and confidential. You have full control over your information and can decide whether to share your reports with your doctor.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4 ROLE-TAILORED CONSENT CHECKBOXES */}
                <div className="space-y-3 pt-1">
                  
                  {/* Checkbox 1: Information Accuracy */}
                  <label className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.infoAccurate ? 'border-[#7C3AED] bg-[#F5F3FF]' : 'border-[#EDE9FE] hover:bg-gray-50'
                  }`}>
                    <input 
                      type="checkbox" 
                      name="infoAccurate" 
                      checked={formData.infoAccurate} 
                      onChange={handleChange}
                      className="mt-0.5 rounded border-[#EDE9FE] text-[#7C3AED] focus:ring-[#7C3AED] w-4 h-4 flex-shrink-0"
                      required 
                    />
                    <span className="text-xs text-[#3a3135] leading-relaxed font-semibold">
                      {formData.accountType === 'User (Female)' && "I confirm that the personal health information provided during registration is accurate and complete to the best of my knowledge."}
                      {formData.accountType === 'Caregiver' && "I confirm that the caregiver details and dependent information provided during registration are accurate and complete to the best of my knowledge."}
                      {formData.accountType === 'Doctor' && "I confirm that my medical credentials, license details, and professional background provided during registration are accurate and complete to the best of my knowledge."}
                    </span>
                  </label>

                  {/* Checkbox 2: Rules, Terms & Privacy Agreement */}
                  <label className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.termsAgreed ? 'border-[#7C3AED] bg-[#F5F3FF]' : 'border-[#EDE9FE] hover:bg-gray-50'
                  }`}>
                    <input 
                      type="checkbox" 
                      name="termsAgreed" 
                      checked={formData.termsAgreed} 
                      onChange={handleChange}
                      className="mt-0.5 rounded border-[#EDE9FE] text-[#7C3AED] focus:ring-[#7C3AED] w-4 h-4 flex-shrink-0"
                      required 
                    />
                    <span className="text-xs text-[#3a3135] leading-relaxed font-semibold">
                      {formData.accountType === 'User (Female)' && "I have read, understood, and agree to the FemSphere Rules & Regulations, Terms of Service, and Privacy Policy."}
                      {formData.accountType === 'Caregiver' && "I have read, understood, and agree to the FemSphere Caregiver Rules & Regulations, Terms of Service, and Privacy Policy."}
                      {formData.accountType === 'Doctor' && "I have read, understood, and agree to the FemSphere Clinical Rules & Regulations, Terms of Service, and Privacy Policy."}
                    </span>
                  </label>

                  {/* Checkbox 3: Data Collection & AI Insights Consent */}
                  <label className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.dataProcessingConsent ? 'border-[#7C3AED] bg-[#F5F3FF]' : 'border-[#EDE9FE] hover:bg-gray-50'
                  }`}>
                    <input 
                      type="checkbox" 
                      name="dataProcessingConsent" 
                      checked={formData.dataProcessingConsent} 
                      onChange={handleChange}
                      className="mt-0.5 rounded border-[#EDE9FE] text-[#7C3AED] focus:ring-[#7C3AED] w-4 h-4 flex-shrink-0"
                      required 
                    />
                    <span className="text-xs text-[#3a3135] leading-relaxed font-semibold">
                      {formData.accountType === 'User (Female)' && "I consent to the collection, storage, and processing of my personal health information to provide personalized health monitoring, AI-generated health insights, and wellness recommendations."}
                      {formData.accountType === 'Caregiver' && "I consent to the collection, storage, and processing of my dependent's personal and health information to provide dependent growth tracking, medication reminders, and AI health monitoring."}
                      {formData.accountType === 'Doctor' && "I consent to the collection, storage, and processing of my professional account information to facilitate secure clinical review, patient consultation management, and report analysis."}
                    </span>
                  </label>

                  {/* Checkbox 4: Data Control & Doctor Sharing Awareness */}
                  <label className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.dataControlConsent ? 'border-[#7C3AED] bg-[#F5F3FF]' : 'border-[#EDE9FE] hover:bg-gray-50'
                  }`}>
                    <input 
                      type="checkbox" 
                      name="dataControlConsent" 
                      checked={formData.dataControlConsent} 
                      onChange={handleChange}
                      className="mt-0.5 rounded border-[#EDE9FE] text-[#7C3AED] focus:ring-[#7C3AED] w-4 h-4 flex-shrink-0"
                      required 
                    />
                    <span className="text-xs text-[#3a3135] leading-relaxed font-semibold">
                      {formData.accountType === 'User (Female)' && "I understand that I have full control over my personal health data and may choose whether to share my information with authorized healthcare professionals."}
                      {formData.accountType === 'Caregiver' && "I understand that dependent health data remains under caregiver/proxy control and I may choose whether to share dependent reports with authorized healthcare professionals."}
                      {formData.accountType === 'Doctor' && "I understand that patient-shared medical records remain confidential and read-only, accessible strictly upon explicit patient or proxy authorization."}
                    </span>
                  </label>

                </div>
              </div>
            )}

            {/* Stepper Controls & Action Buttons */}
            <div className="mt-8 flex items-center justify-between pt-6 border-t border-[#EDE9FE]">
              {step > 1 ? (
                <button 
                  type="button" 
                  onClick={handlePrev} 
                  className="flex items-center gap-1.5 px-5 py-3 rounded-xl border border-[#EDE9FE] hover:bg-[#F5F3FF] text-[#4a4145] font-bold text-sm transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
              ) : (
                <div></div>
              )}

              {step < 5 ? (
                <button 
                  type="submit" 
                  className="flex items-center gap-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl px-7 py-3 text-sm font-bold shadow-md shadow-purple-200 transition-colors"
                >
                  Next Step <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button 
                  type="submit" 
                  disabled={!(formData.infoAccurate && formData.termsAgreed && formData.dataProcessingConsent && formData.dataControlConsent)}
                  className={`flex-1 md:flex-none rounded-xl px-8 py-3.5 text-sm font-bold shadow-lg transition-all transform ${
                    (formData.infoAccurate && formData.termsAgreed && formData.dataProcessingConsent && formData.dataControlConsent)
                      ? 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-purple-200 hover:-translate-y-0.5' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                  }`}
                >
                  Register as {formData.accountType === 'User (Female)' ? 'Myself' : formData.accountType} & Redirect to Dashboard
                </button>
              )}
            </div>

          </form>
        </div>

        {/* Footer link */}
        <div className="mt-6 text-center text-sm text-[#7a6f75]">
          Already have an account? <Link to="/login" className="font-bold text-[#7C3AED] hover:underline">Login</Link>
        </div>

      </div>
    </div>
  );
}
