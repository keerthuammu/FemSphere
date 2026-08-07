import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, Check, User, Users, Stethoscope, Shield, Heart, 
  Upload, ChevronLeft, ChevronRight, Lock, Activity, Phone, 
  Mail, MapPin, Calendar, FileText, CheckSquare, Square, FileCheck, AlertCircle
} from 'lucide-react';

export default function Register() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    // Step 1
    accountType: 'User (Female)', // 'User (Female)', 'Caregiver', 'Doctor'

    // Step 2: Personal Information
    fullName: '',
    dob: '',
    gender: '', // Female, Male, Other
    mobileNumber: '',
    email: '',
    address: '',
    pincode: '',
    country: '',
    state: '',
    city: '',
    profilePhoto: null as File | null,

    // Step 3: Account Credentials
    username: '',
    password: '',
    confirmPassword: '',

    // Step 4: Role-Specific Information (User Female)
    bloodGroup: '',
    heightCm: '',
    weightKg: '',
    maritalStatus: '',
    lifeStage: '',
    wearableDevice: '',
    emergencyContactName: '',
    emergencyContactPhone: '',

    // Caregiver & Dependent specific fields
    caregiverType: '',
    dependentName: '',
    relationship: '',
    dependentDob: '',
    dependentGender: '',
    dependentBloodGroup: '',
    dependentHeightCm: '',
    dependentWeightKg: '',
    dependentCategory: '',
    dependentMedicalNotes: '',
    // Caregiver Primary Scope (Multi-select array)
    caregiverScopes: [] as string[],

    // Doctor specific fields
    licenseNumber: '',
    specialization: '',
    hospitalClinic: '',
    yearsOfExperience: '',

    // Step 5: Privacy, Rules & Role Consent
    infoAccurate: false,
    termsAgreed: false,
    dataProcessingConsent: false,
    dataControlConsent: false,
    fullConsent: false,
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

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const validateCurrentStep = (currentStep: number): boolean => {
    setErrorMsg(null);

    // Step 1: Account Type
    if (currentStep === 1) {
      if (!formData.accountType) {
        setErrorMsg('Please select an account type to proceed.');
        return false;
      }
      return true;
    }

    // Step 2: Personal Information
    if (currentStep === 2) {
      if (!formData.fullName.trim()) {
        setErrorMsg('Please enter your Full Name.');
        return false;
      }
      if (!formData.dob.trim()) {
        setErrorMsg('Please select your Date of Birth.');
        return false;
      }
      if (!formData.gender) {
        setErrorMsg('Please select your Gender.');
        return false;
      }
      if (!formData.mobileNumber.trim()) {
        setErrorMsg('Please enter your Mobile Number.');
        return false;
      }
      if (!formData.email.trim()) {
        setErrorMsg('Please enter your Email Address.');
        return false;
      }
      if (!formData.address.trim()) {
        setErrorMsg('Please enter your Street Address.');
        return false;
      }
      if (!formData.pincode.trim()) {
        setErrorMsg('Please enter your Pincode / Zip Code.');
        return false;
      }
      if (!formData.country) {
        setErrorMsg('Please select your Country.');
        return false;
      }
      return true;
    }

    // Step 3: Account Credentials
    if (currentStep === 3) {
      if (!formData.username.trim()) {
        setErrorMsg('Please enter a Username.');
        return false;
      }
      if (!formData.password) {
        setErrorMsg('Please enter a Password.');
        return false;
      }
      if (!formData.confirmPassword) {
        setErrorMsg('Please confirm your Password.');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setErrorMsg('Password and Confirm Password do not match.');
        return false;
      }
      return true;
    }

    // Step 4: Role-Specific Information
    if (currentStep === 4) {
      if (formData.accountType === 'User (Female)') {
        if (!formData.bloodGroup) {
          setErrorMsg('Please select your Blood Group.');
          return false;
        }
        if (!formData.maritalStatus) {
          setErrorMsg('Please select your Marital Status.');
          return false;
        }
        if (!formData.lifeStage) {
          setErrorMsg('Please select your Current Life Stage.');
          return false;
        }
      } else if (formData.accountType === 'Caregiver') {
        if (!formData.caregiverType) {
          setErrorMsg('Please select Caregiver Sub-Type / Role.');
          return false;
        }
        if (!formData.dependentName.trim()) {
          setErrorMsg('Please enter Dependent / Care Recipient Full Name.');
          return false;
        }
        if (!formData.relationship) {
          setErrorMsg('Please select Relationship to Dependent.');
          return false;
        }
        if (!formData.dependentDob.trim()) {
          setErrorMsg('Please select Dependent Date of Birth.');
          return false;
        }
        if (!formData.dependentGender) {
          setErrorMsg('Please select Dependent Gender.');
          return false;
        }
        if (!formData.dependentCategory) {
          setErrorMsg('Please select Dependent Life Stage / Category.');
          return false;
        }
        if (formData.caregiverScopes.length === 0) {
          setErrorMsg('Please select at least one Caregiver Primary Scope.');
          return false;
        }
        if (!formData.emergencyContactPhone.trim()) {
          setErrorMsg('Please enter Caregiver Emergency Contact Phone.');
          return false;
        }
      } else if (formData.accountType === 'Doctor') {
        if (!formData.licenseNumber.trim()) {
          setErrorMsg('Please enter your Medical License Number.');
          return false;
        }
        if (!formData.specialization) {
          setErrorMsg('Please select your Medical Specialization.');
          return false;
        }
        if (!formData.hospitalClinic.trim()) {
          setErrorMsg('Please enter your Hospital / Clinic Affiliation.');
          return false;
        }
        if (!formData.yearsOfExperience) {
          setErrorMsg('Please enter Years of Clinical Experience.');
          return false;
        }
      }
      return true;
    }

    // Step 5: Rules & Consent
    if (currentStep === 5) {
      if (!formData.fullConsent && !(formData.infoAccurate && formData.termsAgreed && formData.dataProcessingConsent && formData.dataControlConsent)) {
        setErrorMsg('Please read and agree to the Rules & Regulations and Consent checkbox to complete registration.');
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (validateCurrentStep(step)) {
      if (step < 5) {
        setStep(prev => prev + 1);
        setErrorMsg(null);
      }
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
      setErrorMsg(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep(step)) {
      return;
    }
    if (step < 5) {
      handleNext();
    } else {
      // Redirect based on role
      if (formData.accountType === 'Caregiver') {
        navigate('/caregiver-dashboard');
      } else if (formData.accountType === 'Doctor') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  };

  const getRoleRules = () => {
    if (formData.accountType === 'Caregiver') {
      return [
        { title: "Dependent Permission & Authority", content: "Caregivers must possess legal authorization or family consent before adding dependent profiles, health records, or medication schedules." },
        { title: "Dependent Data Responsibility", content: "You are responsible for maintaining accurate growth, vital, medication, and vaccination logs for all linked care recipients." },
        { title: "Caregiver Privacy Protocols", content: "Dependent health profiles and proxy records are stored securely and encrypted under caregiver privacy standards." },
        { title: "AI Dependent Monitoring", content: "AI insights for dependent medication tracking and growth milestones are for informational guidance and do not replace pediatric or geriatric care." },
        { title: "Dependent Records & Uploads", content: "Uploaded vaccination cards, prescriptions, and lab scans for dependents must be genuine and authorized by guardians." },
        { title: "Caregiver Responsibilities", content: "Do not provide unauthorized dependent details, misrepresent care scopes, or misuse family management tools." },
        { title: "Proxy Account Security", content: "Maintain strict confidentiality of your caregiver account credentials to protect linked family and dependent health records." },
        { title: "Dependent Data Sharing", content: "As a proxy caregiver, you control whether dependent health summaries are shared with authorized family physicians or pediatricians." },
        { title: "Emergency Escalation Protocol", content: "Caregiver monitoring tools assist daily care coordination but must not replace immediate emergency medical services for dependents." },
        { title: "Caregiver Acceptance", content: "By registering as a Caregiver, you agree to comply with FemSphere Proxy Caregiver Rules, Terms & Conditions, and Privacy Policy." }
      ];
    }
    
    if (formData.accountType === 'Doctor') {
      return [
        { title: "Medical License Authenticity", content: "Doctors must provide valid, active medical license numbers and clinical credentials for administrator verification before consulting patients." },
        { title: "Clinical Record Integrity", content: "You are responsible for maintaining professional accuracy in patient consultation notes, diagnoses, and digital prescriptions." },
        { title: "Doctor-Patient Confidentiality", content: "Patient health data and shared records are strictly confidential and protected under medical privacy protocols." },
        { title: "AI Clinical Assistance", content: "AI-generated patient risk scores and summaries serve as auxiliary decision-support tools and do not override clinical judgment." },
        { title: "Read-Only Record Access", content: "Patient lab reports and health twin records are accessible strictly on a read-only basis upon explicit patient or proxy authorization." },
        { title: "Professional Responsibilities", content: "Adhere to medical ethics, provide professional healthcare advice, and avoid unverified diagnostic claims." },
        { title: "Clinical Account Security", content: "Safeguard your practitioner login credentials to prevent unauthorized access to confidential patient medical directories." },
        { title: "Authorized Teleconsultation", content: "Conduct teleconsultation reviews and patient recommendations strictly within your licensed medical specialization." },
        { title: "Emergency Redirection", content: "Instruct patients experiencing acute or life-threatening symptoms to seek immediate emergency medical care." },
        { title: "Clinical Acceptance", content: "By registering as a Doctor, you agree to comply with FemSphere Clinical Governance Rules, Practitioner Terms, and Privacy Policy." }
      ];
    }

    // Default / Myself / Female User
    return [
      { title: "Accurate Personal Vitals", content: "Provide accurate personal health details, cycle history, and vitals to receive reliable AI wellness monitoring and tracking." },
      { title: "Personal Data Responsibility", content: "You are responsible for maintaining the accuracy of your profile, daily health logs, symptoms, and health records entered into FemSphere." },
      { title: "Privacy & Confidentiality", content: "Your personal and health information is stored securely. Your data will only be shared with healthcare professionals when you explicitly grant permission." },
      { title: "AI Health Recommendations", content: "AI-generated health insights and recommendations are provided for informational and wellness purposes only. They do not replace professional medical advice, diagnosis, or treatment." },
      { title: "Medical Records", content: "You may upload medical reports, prescriptions, and laboratory records. Ensure that all uploaded documents are genuine and belong to you or your dependent." },
      { title: "User Responsibilities", content: "Do not misuse the platform or provide false, misleading, or unauthorized information." },
      { title: "Account Security", content: "Keep your login credentials confidential. You are responsible for all activities performed using your account." },
      { title: "Data Sharing", content: "You have full control over your health data and can choose whether to share your reports with registered doctors." },
      { title: "Platform Usage", content: "FemSphere is designed to support health monitoring and wellness management and should not be used as a replacement for emergency medical services." },
      { title: "Acceptance", content: "By creating an account, you agree to comply with the FemSphere Terms & Conditions and Privacy Policy." }
    ];
  };

  const getRoleConsentText = () => {
    if (formData.accountType === 'Caregiver') {
      return "I have read, understood, and agree to the FemSphere Caregiver Rules & Regulations, Terms & Conditions, Privacy Policy, and consent to the collection and processing of my dependent's care information.";
    }
    if (formData.accountType === 'Doctor') {
      return "I have read, understood, and agree to the FemSphere Clinical Governance Rules & Regulations, Terms & Conditions, Privacy Policy, and consent to professional account verification for providing healthcare consultations.";
    }
    return "I have read, understood, and agree to the FemSphere Rules & Regulations, Terms & Conditions, Privacy Policy, and consent to the collection and processing of my information for providing personalized health services.";
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
    <div className="min-h-screen bg-[#fbf9f6] flex flex-col font-inter text-[#3a3135]">
      {/* Top Nav */}
      <div className="p-4 md:px-12 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-[#EDE9FE]">
        <Link to="/" className="flex items-center gap-2">
          <h1 className="font-serif text-2xl font-bold text-[#7C3AED] tracking-tight">FemSphere</h1>
          <Sparkles className="w-4 h-4 text-[#14B8A6]" />
        </Link>
        <p className="text-sm text-[#7a6f75] font-inter">
          Already have an account? <Link to="/login" className="font-bold text-[#7C3AED] hover:underline ml-1 font-inter">Login</Link>
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center py-8 px-4 md:px-8 max-w-4xl mx-auto w-full font-inter">
        
        {/* Stepper Header */}
        <div className="w-full mb-8 font-inter">
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
                onClick={() => {
                  if (num < step) {
                    setStep(num);
                    setErrorMsg(null);
                  } else if (num > step) {
                    if (validateCurrentStep(step)) {
                      setStep(num);
                      setErrorMsg(null);
                    }
                  }
                }}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 font-inter ${
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
          <div className="flex justify-between text-[11px] uppercase tracking-wider text-[#7a6f75] font-semibold px-1 font-inter">
            {stepTitles.map((title, i) => (
              <span key={i} className={`text-center font-inter ${step === i + 1 ? 'text-[#7C3AED] font-bold' : ''}`}>
                {title}
              </span>
            ))}
          </div>
        </div>

        {/* Main Form Container */}
        <div className="w-full bg-white rounded-3xl shadow-xl shadow-purple-900/5 border border-[#EDE9FE] p-6 md:p-10 relative overflow-hidden font-inter">
          
          <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-4 mb-6">
            <div>
              <span className="text-xs font-bold text-[#7C3AED] uppercase tracking-widest bg-[#F5F3FF] px-3 py-1 rounded-full border border-[#EDE9FE] font-inter">
                Step {step} of 5
              </span>
              <h2 className="font-inter font-bold text-2xl md:text-3xl text-[#3a3135] mt-2">
                {step === 1 && "Account Type (Required)"}
                {step === 2 && "Personal Information"}
                {step === 3 && "Account Credentials"}
                {step === 4 && `Role-Specific Information (${formData.accountType === 'User (Female)' ? 'Myself' : formData.accountType})`}
                {step === 5 && "Rules, Regulations & Consent"}
              </h2>
            </div>
          </div>

          {/* Validation Error Alert Banner */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 text-xs md:text-sm font-semibold shadow-xs">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
              <div className="flex-1">{errorMsg}</div>
            </div>
          )}

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
                    <option value="">Select Gender</option>
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
                    placeholder="e.g. +1 (555) 382-9102" 
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
                    placeholder="e.g. elena.rostova@femsphere.health" 
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
                    placeholder="e.g. San Francisco" 
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
                    placeholder="e.g. California" 
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
                    <option value="">Select Country</option>
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
                    placeholder="e.g. elena_health" 
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
                    placeholder="Enter strong password" 
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
                    placeholder="Confirm password" 
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
                        <option value="">Select Blood Group</option>
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
                          placeholder="e.g. 168" 
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
                          placeholder="e.g. 62" 
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
                        <option value="">Select Marital Status</option>
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
                        <option value="">Select Life Stage</option>
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
                        <option value="">Select Wearable Device (Optional)</option>
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
                        placeholder="e.g. Marcus Rostova" 
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
                        placeholder="e.g. +1 (555) 902-4118" 
                        className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm" 
                      />
                    </div>
                  </div>
                )}

                {/* CAREGIVER ROLE SPECIFIC QUESTIONS */}
                {formData.accountType === 'Caregiver' && (
                  <div className="space-y-6">
                    <div className="bg-[#FAF8FC] p-5 rounded-2xl border border-[#EDE9FE] space-y-5">
                      <div className="flex items-center gap-2 text-[#7C3AED] pb-2 border-b border-[#EDE9FE]">
                        <Users className="w-5 h-5 flex-shrink-0" />
                        <h3 className="font-bold text-base text-[#3a3135] font-inter">
                          Caregiver & Dependent Health Profile
                        </h3>
                      </div>

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
                            <option value="">Select Caregiver Sub-Type / Role</option>
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
                            Dependent / Care Recipient Full Name
                          </label>
                          <input 
                            type="text" 
                            name="dependentName" 
                            value={formData.dependentName} 
                            onChange={handleChange}
                            placeholder="e.g. Sophia Rostova" 
                            className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm" 
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1">
                            Relationship to Dependent
                          </label>
                          <select 
                            name="relationship" 
                            value={formData.relationship} 
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm bg-white"
                          >
                            <option value="">Select Relationship</option>
                            <option value="Daughter">Daughter</option>
                            <option value="Son">Son</option>
                            <option value="Mother">Mother</option>
                            <option value="Father">Father</option>
                            <option value="Spouse / Partner">Spouse / Partner</option>
                            <option value="Sister">Sister</option>
                            <option value="Brother">Brother</option>
                            <option value="Grandparent">Grandparent</option>
                            <option value="Other Relative">Other Relative</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1">
                            Dependent Date of Birth
                          </label>
                          <input 
                            type="date" 
                            name="dependentDob" 
                            value={formData.dependentDob} 
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm bg-white" 
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1">
                            Dependent Gender
                          </label>
                          <select 
                            name="dependentGender" 
                            value={formData.dependentGender} 
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm bg-white"
                          >
                            <option value="">Select Gender</option>
                            <option value="Female">Female</option>
                            <option value="Male">Male</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1">
                            Dependent Blood Group (Optional)
                          </label>
                          <select 
                            name="dependentBloodGroup" 
                            value={formData.dependentBloodGroup} 
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm bg-white"
                          >
                            <option value="">Select Blood Group</option>
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
                              name="dependentHeightCm" 
                              value={formData.dependentHeightCm} 
                              onChange={handleChange}
                              placeholder="e.g. 110" 
                              className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm" 
                            />
                          </div>
                          <div className="w-1/2">
                            <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1">Weight (kg)</label>
                            <input 
                              type="number" 
                              name="dependentWeightKg" 
                              value={formData.dependentWeightKg} 
                              onChange={handleChange}
                              placeholder="e.g. 18" 
                              className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm" 
                            />
                          </div>
                        </div>

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
                            <option value="">Select Category / Stage</option>
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
                            placeholder="e.g. +1 (555) 902-4118" 
                            className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm" 
                            required
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-1">
                            Existing Conditions / Allergies / Notes (Optional)
                          </label>
                          <input 
                            type="text" 
                            name="dependentMedicalNotes" 
                            value={formData.dependentMedicalNotes} 
                            onChange={handleChange}
                            placeholder="e.g. Asthma, Penicillin Allergy, Diabetes, Daily Insulin" 
                            className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Caregiver Primary Scope */}
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
                        placeholder="e.g. MD-892401"
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
                        <option value="">Select Specialization</option>
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
                        placeholder="e.g. St. Jude Women's Health Center"
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
                        placeholder="e.g. 12"
                        className="w-full px-4 py-3 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm" 
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 5: Rules & Regulations, Terms of Service, Privacy Policy & Consent */}
            {step === 5 && (
              <div className="space-y-6 py-2">
                
                {/* Rules & Regulations Text Block */}
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#EDE9FE]">
                    <div className="flex items-center gap-2 text-[#7C3AED]">
                      <Shield className="w-5 h-5 flex-shrink-0" />
                      <h3 className="font-bold text-lg text-[#3a3135] font-inter">
                        Rules & Regulations
                      </h3>
                    </div>
                    <span className="text-xs font-bold text-[#7C3AED] bg-[#F5F3FF] px-3 py-1 rounded-full border border-[#EDE9FE] font-inter">
                      {formData.accountType === 'User (Female)' ? 'Myself' : formData.accountType} Policy
                    </span>
                  </div>

                  <div className="bg-[#FAF8FC] p-4 md:p-5 rounded-2xl border border-[#EDE9FE] space-y-3.5 max-h-96 overflow-y-auto scrollbar-thin font-inter">
                    {getRoleRules().map((item, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-xl border border-[#EDE9FE]/90 shadow-xs hover:border-[#7C3AED]/40 transition-all">
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#F5F3FF] text-[#7C3AED] border border-[#EDE9FE] flex-shrink-0 font-inter">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <h4 className="font-bold text-sm md:text-base text-[#3b0764] tracking-tight">
                            {item.title}
                          </h4>
                        </div>
                        <p className="text-sm text-[#374151] leading-relaxed font-normal pl-9">
                          {item.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Consent Section */}
                <div className="pt-2">
                  <h3 className="font-bold text-lg text-[#3a3135] mb-3 flex items-center gap-2 text-[#7C3AED] font-inter">
                    <FileCheck className="w-5 h-5 flex-shrink-0" />
                    Consent
                  </h3>
                  
                  {/* Primary Consent Checkbox */}
                  <label className={`flex items-start gap-3.5 p-4 md:p-4.5 rounded-2xl border-2 cursor-pointer transition-all ${
                    formData.fullConsent ? 'border-[#7C3AED] bg-[#F5F3FF] shadow-sm' : 'border-[#EDE9FE] hover:bg-gray-50'
                  }`}>
                    <input 
                      type="checkbox" 
                      name="fullConsent" 
                      checked={formData.fullConsent} 
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormData(prev => ({
                          ...prev,
                          fullConsent: checked,
                          infoAccurate: checked,
                          termsAgreed: checked,
                          dataProcessingConsent: checked,
                          dataControlConsent: checked
                        }));
                      }}
                      className="mt-0.5 rounded border-[#EDE9FE] text-[#7C3AED] focus:ring-[#7C3AED] w-5 h-5 flex-shrink-0 cursor-pointer"
                      required 
                    />
                    <span className="font-inter text-sm text-[#374151] leading-relaxed font-medium">
                      {getRoleConsentText()}
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
                  disabled={!(formData.fullConsent || (formData.infoAccurate && formData.termsAgreed && formData.dataProcessingConsent && formData.dataControlConsent))}
                  className={`flex-1 md:flex-none rounded-xl px-8 py-3.5 text-sm font-bold shadow-lg transition-all transform ${
                    (formData.fullConsent || (formData.infoAccurate && formData.termsAgreed && formData.dataProcessingConsent && formData.dataControlConsent))
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
