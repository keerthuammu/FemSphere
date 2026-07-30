import { Brain, HeartPulse, Shield, LineChart, FileText, Database } from 'lucide-react';

export default function Services() {
  return (
    <section id="why" className="px-6 md:px-16 max-w-7xl mx-auto mb-32 relative z-20">
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-8">
        
        <div className="lg:col-span-4 flex flex-col justify-center">
          <span className="text-[10px] uppercase tracking-widest text-[#7C3AED] font-bold mb-4 block">Why FemSphere</span>
          <h2 className="font-serif text-4xl md:text-5xl text-[#3a3135] mb-2 leading-tight">
            Intelligent Health
          </h2>
          <h2 className="font-serif italic text-4xl md:text-5xl text-[#7C3AED] mb-6 leading-tight">
            designed for you.
          </h2>
          <div className="w-12 h-px bg-[#EDE9FE] mb-6"></div>
          <p className="text-[#64595e] text-sm leading-relaxed font-light">
            We combine advanced AI with your unique biology to create a dynamic Digital Health Twin that evolves with you through every life stage.
          </p>
        </div>
        
        <div className="lg:col-span-8 grid md:grid-cols-2 gap-4">
          
          <div className="flex gap-4 p-6 rounded-2xl bg-white border border-[#EDE9FE] shadow-[0_4px_20px_rgb(124,58,237,0.03)] hover:shadow-[0_4px_20px_rgb(124,58,237,0.08)] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#F5F3FF] flex items-center justify-center shrink-0">
              <Brain className="w-5 h-5 text-[#7C3AED]" />
            </div>
            <div>
              <h3 className="font-medium text-[#3a3135] mb-1">AI Digital Health Twin</h3>
              <p className="text-xs text-[#7a6f75] leading-relaxed">A personalized virtual model of your health, updating in real-time.</p>
            </div>
          </div>
          
          <div className="flex gap-4 p-6 rounded-2xl bg-white border border-[#EDE9FE] shadow-[0_4px_20px_rgb(20,184,166,0.03)] hover:shadow-[0_4px_20px_rgb(20,184,166,0.08)] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#CCFBF1] flex items-center justify-center shrink-0">
              <HeartPulse className="w-5 h-5 text-[#14B8A6]" />
            </div>
            <div>
              <h3 className="font-medium text-[#3a3135] mb-1">Preventive Healthcare</h3>
              <p className="text-xs text-[#7a6f75] leading-relaxed">Proactive insights that help you stay ahead of potential health issues.</p>
            </div>
          </div>
          
          <div className="flex gap-4 p-6 rounded-2xl bg-white border border-[#EDE9FE] shadow-[0_4px_20px_rgb(244,114,182,0.03)] hover:shadow-[0_4px_20px_rgb(244,114,182,0.08)] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#FCE7F3] flex items-center justify-center shrink-0">
              <LineChart className="w-5 h-5 text-[#F472B6]" />
            </div>
            <div>
              <h3 className="font-medium text-[#3a3135] mb-1">Explainable AI</h3>
              <p className="text-xs text-[#7a6f75] leading-relaxed">Transparent recommendations so you always understand the 'why'.</p>
            </div>
          </div>
          
          <div className="flex gap-4 p-6 rounded-2xl bg-white border border-[#EDE9FE] shadow-[0_4px_20px_rgb(124,58,237,0.03)] hover:shadow-[0_4px_20px_rgb(124,58,237,0.08)] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#F5F3FF] flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-[#7C3AED]" />
            </div>
            <div>
              <h3 className="font-medium text-[#3a3135] mb-1">Privacy-First Architecture</h3>
              <p className="text-xs text-[#7a6f75] leading-relaxed">Your data is encrypted, secure, and strictly controlled by you.</p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
