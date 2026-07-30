import { Baby, Activity, Heart, Apple, Moon, Smile, ShieldAlert } from 'lucide-react';

export default function Features() {
  const features = [
    { icon: <Baby className="w-5 h-5 text-[#F472B6]" />, title: 'Pregnancy Care', bg: 'bg-[#FCE7F3]' },
    { icon: <Heart className="w-5 h-5 text-[#EF4444]" />, title: 'Menstrual Tracking', bg: 'bg-[#FEE2E2]' },
    { icon: <Activity className="w-5 h-5 text-[#14B8A6]" />, title: 'Fitness Monitoring', bg: 'bg-[#CCFBF1]' },
    { icon: <Apple className="w-5 h-5 text-[#84CC16]" />, title: 'Nutrition Intelligence', bg: 'bg-[#ECFCCB]' },
    { icon: <Moon className="w-5 h-5 text-[#6366F1]" />, title: 'Sleep Analysis', bg: 'bg-[#E0E7FF]' },
    { icon: <Smile className="w-5 h-5 text-[#F59E0B]" />, title: 'Mental Wellness', bg: 'bg-[#FEF3C7]' },
    { icon: <ShieldAlert className="w-5 h-5 text-[#7C3AED]" />, title: 'Disease Risk Prediction', bg: 'bg-[#F5F3FF]' },
  ];

  return (
    <section id="features" className="px-6 md:px-16 max-w-7xl mx-auto mb-32 bg-white rounded-[2.5rem] py-20 shadow-[0_8px_30px_rgb(124,58,237,0.04)] border border-[#EDE9FE]">
      
      <div className="text-center mb-16 px-4">
        <span className="text-[10px] uppercase tracking-widest text-[#7C3AED] font-bold mb-3 block">Comprehensive Care</span>
        <h2 className="font-serif text-4xl text-[#3a3135] leading-tight">
          Everything you need for <br />
          <span className="italic text-[#7C3AED]">complete wellness.</span>
        </h2>
      </div>
      
      <div className="flex flex-wrap justify-center gap-4 px-4 md:px-8">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-3 bg-white border border-[#EDE9FE] rounded-full py-3 px-5 hover:border-[#7C3AED] hover:shadow-md transition-all cursor-pointer">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${f.bg}`}>
              {f.icon}
            </div>
            <span className="text-sm font-medium text-[#4a4145]">{f.title}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
