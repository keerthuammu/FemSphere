import { ArrowRight, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImg from '../assets/images/healthcare_hero_1785261756891.jpeg';

export default function Hero() {
  return (
    <section className="px-6 md:px-16 max-w-7xl mx-auto relative pt-8 pb-20">
      
      {/* Background soft shapes */}
      <div className="absolute top-0 right-0 w-[500px] h-[600px] bg-gradient-to-bl from-[#EDE9FE] to-transparent rounded-bl-full -z-10 opacity-70 hidden md:block"></div>
      
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col items-start z-10 relative">
          <div className="flex items-center gap-2 bg-[#FCE7F3] text-[#7C3AED] px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide mb-6 uppercase">
            <Activity className="w-3 h-3" /> Personalized Health Intelligence
          </div>
          
          <h2 className="font-serif text-5xl md:text-[4.5rem] leading-[1.1] text-[#3a3135] mb-6">
            Your Lifetime <br />
            <span className="text-[#7C3AED]">AI Health</span> <br />
            Companion
          </h2>
          
          <p className="text-[#64595e] text-lg max-w-md mb-10 leading-relaxed font-light">
            From birth to healthy aging. Create your Digital Health Twin and receive personalized AI-powered health insights, disease risk prediction, and preventive healthcare guidance.
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/register" className="flex items-center gap-2 bg-[#7C3AED] hover:bg-[#6D28D9] transition-colors text-white rounded-full px-8 py-3.5 text-sm font-medium shadow-md shadow-purple-200">
              Get Started
            </Link>
            <button className="flex items-center gap-2 bg-white border border-[#EDE9FE] hover:border-[#7C3AED] hover:text-[#7C3AED] transition-colors text-[#4a4145] rounded-full px-8 py-3.5 text-sm font-medium shadow-sm">
              Learn More <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="relative">
          {/* Arch framing */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#EDE9FE] to-white rounded-t-full -z-10 scale-105 origin-bottom border border-white"></div>
          
          <div className="relative rounded-t-full rounded-b-3xl overflow-hidden w-full max-w-[450px] mx-auto z-10 aspect-[3/4] shadow-xl shadow-purple-100">
            <img src={heroImg} alt="FemSphere AI Health Companion" className="w-full h-full object-cover object-center" />
          </div>
          
          {/* Circular badge */}
          <div className="absolute bottom-10 right-0 md:-right-8 bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-[#EDE9FE] shadow-lg z-20 flex items-center gap-3 animate-pulse">
             <div className="w-10 h-10 rounded-full bg-[#14B8A6]/20 flex items-center justify-center">
               <Activity className="w-5 h-5 text-[#14B8A6]" />
             </div>
             <div>
               <p className="text-[10px] uppercase tracking-widest text-[#7a6f75] font-medium">Live Analytics</p>
               <p className="text-sm font-bold text-[#3a3135]">Twin Synced</p>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
