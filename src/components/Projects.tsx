import { Watch, Smartphone, Activity } from 'lucide-react';
import wearableImg from '../assets/images/wearable_integration_1785261789910.jpg';

export default function Projects() {
  return (
    <section className="px-6 md:px-16 max-w-7xl mx-auto mb-32">
      
      <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-br from-[#F5F3FF] to-white rounded-[2.5rem] overflow-hidden border border-[#EDE9FE] shadow-[0_8px_30px_rgb(124,58,237,0.06)]">
        
        <div className="p-10 md:p-16 md:w-1/2 flex flex-col justify-center">
          <span className="text-[10px] uppercase tracking-widest text-[#7C3AED] font-bold mb-3 block">Seamless Sync</span>
          <h2 className="font-serif text-4xl text-[#3a3135] leading-tight mb-6">
            Connect your <br />
            <span className="italic text-[#7C3AED]">wearables.</span>
          </h2>
          <p className="text-[#64595e] text-sm leading-relaxed mb-8">
            FemSphere integrates flawlessly with your favorite devices to continuously update your Digital Health Twin without manual entry.
          </p>
          
          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-2 rounded-full border border-[#EDE9FE] bg-white text-xs font-medium text-[#4a4145] flex items-center gap-2 shadow-sm">
              <Watch className="w-3 h-3 text-[#7C3AED]" /> Apple Watch
            </span>
            <span className="px-4 py-2 rounded-full border border-[#EDE9FE] bg-white text-xs font-medium text-[#4a4145] flex items-center gap-2 shadow-sm">
              <Smartphone className="w-3 h-3 text-[#14B8A6]" /> Google Fit
            </span>
            <span className="px-4 py-2 rounded-full border border-[#EDE9FE] bg-white text-xs font-medium text-[#4a4145] flex items-center gap-2 shadow-sm">
              <Activity className="w-3 h-3 text-[#F472B6]" /> Fitbit
            </span>
          </div>
        </div>
        
        <div className="md:w-1/2 h-[400px] md:h-auto relative">
          <img src={wearableImg} alt="Wearable Integrations" className="w-full h-full object-cover absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#F5F3FF]/80 md:hidden"></div>
        </div>
        
      </div>
    </section>
  );
}
