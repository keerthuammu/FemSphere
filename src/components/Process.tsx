export default function Process() {
  const steps = [
    { num: '01', title: 'Childhood', desc: 'Establishing baselines and healthy habits early on.' },
    { num: '02', title: 'Adolescence', desc: 'Navigating hormonal changes and menstrual health.' },
    { num: '03', title: 'Reproductive', desc: 'Fertility tracking and proactive wellness.' },
    { num: '04', title: 'Pregnancy', desc: 'Comprehensive monitoring for mother and child.' },
    { num: '05', title: 'Menopause', desc: 'Managing symptoms and lifestyle adaptations.' },
    { num: '06', title: 'Healthy Aging', desc: 'Long-term cognitive and physical health support.' },
  ];

  return (
    <section id="timeline" className="px-6 md:px-16 max-w-7xl mx-auto mb-32 py-16">
      
      <div className="text-center mb-16">
        <span className="text-[10px] uppercase tracking-widest text-[#14B8A6] font-bold mb-3 block">Your Timeline</span>
        <h2 className="font-serif text-4xl text-[#3a3135] leading-tight">
          A partner through <br />
          <span className="italic text-[#14B8A6]">every life stage.</span>
        </h2>
      </div>
      
      <div className="relative">
        {/* Desktop Line */}
        <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-[#EDE9FE] via-[#7C3AED] to-[#CCFBF1] z-0"></div>
        
        <div className="grid lg:grid-cols-6 gap-6 relative z-10">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border-2 border-[#7C3AED] text-[#7C3AED] font-bold mb-4 shadow-md lg:mx-0 mx-auto">
                {step.num}
              </div>
              <h4 className="text-sm font-bold text-[#3a3135] mb-2">{step.title}</h4>
              <p className="text-xs text-[#7a6f75] leading-relaxed max-w-[150px]">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
