import { Activity, Database, BrainCircuit, Target } from 'lucide-react';

export default function Stats() {
  return (
    <section className="px-6 md:px-16 max-w-7xl mx-auto -mt-8 relative z-30 mb-24">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(124,58,237,0.08)] border border-[#EDE9FE] flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4">
        
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 text-[#3a3135] mb-2">
            <Activity className="w-6 h-6 text-[#14B8A6]" />
            <span className="font-serif text-4xl">89<span className="text-xl text-[#7a6f75]">/100</span></span>
          </div>
          <span className="text-xs uppercase tracking-widest text-[#7a6f75] font-medium">Avg Health Score</span>
        </div>
        
        <div className="hidden md:block w-px h-12 bg-[#EDE9FE]"></div>
        
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 text-[#3a3135] mb-2">
            <Database className="w-6 h-6 text-[#7C3AED]" />
            <span className="font-serif text-4xl">10M+</span>
          </div>
          <span className="text-xs uppercase tracking-widest text-[#7a6f75] font-medium">Records Stored</span>
        </div>
        
        <div className="hidden md:block w-px h-12 bg-[#EDE9FE]"></div>
        
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 text-[#3a3135] mb-2">
            <BrainCircuit className="w-6 h-6 text-[#F472B6]" />
            <span className="font-serif text-4xl">5M+</span>
          </div>
          <span className="text-xs uppercase tracking-widest text-[#7a6f75] font-medium">Predictions Made</span>
        </div>
        
        <div className="hidden md:block w-px h-12 bg-[#EDE9FE]"></div>
        
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 text-[#3a3135] mb-2">
            <Target className="w-6 h-6 text-[#14B8A6]" />
            <span className="font-serif text-4xl">2M+</span>
          </div>
          <span className="text-xs uppercase tracking-widest text-[#7a6f75] font-medium">Goals Completed</span>
        </div>
        
      </div>
    </section>
  );
}
