import { Sparkles, Mail, ArrowRight, Globe, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative mt-20 pt-16 border-t border-[#EDE9FE] bg-white">
      <div className="px-6 md:px-16 max-w-7xl mx-auto mb-16">
        
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 relative z-10">
            <h2 className="font-serif text-4xl md:text-5xl text-[#3a3135] leading-tight mb-2">
              Ready to meet your
            </h2>
            <h2 className="font-serif italic text-4xl md:text-5xl text-[#7C3AED] leading-tight mb-8">
              Digital Health Twin? <Sparkles className="inline w-6 h-6 text-[#14B8A6] -mt-6" />
            </h2>
            
            <div className="flex items-center gap-4">
               <Link to="/register" className="flex items-center justify-center gap-2 bg-[#7C3AED] hover:bg-[#6D28D9] transition-colors text-white rounded-full px-8 py-4 text-sm font-bold shadow-lg shadow-purple-200">
                  Join FemSphere Now <ArrowRight className="w-4 h-4" />
               </Link>
            </div>
          </div>
          
          <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-8">
             <div>
                <h4 className="font-bold text-[#3a3135] mb-4 text-sm">Platform</h4>
                <ul className="space-y-2 text-sm text-[#7a6f75]">
                   <li><a href="#" className="hover:text-[#7C3AED]">Features</a></li>
                   <li><a href="#" className="hover:text-[#7C3AED]">Digital Twin</a></li>
                   <li><a href="#" className="hover:text-[#7C3AED]">Integrations</a></li>
                   <li><a href="#" className="hover:text-[#7C3AED]">Pricing</a></li>
                </ul>
             </div>
             <div>
                <h4 className="font-bold text-[#3a3135] mb-4 text-sm">Company</h4>
                <ul className="space-y-2 text-sm text-[#7a6f75]">
                   <li><a href="#" className="hover:text-[#7C3AED]">About Us</a></li>
                   <li><a href="#" className="hover:text-[#7C3AED]">Careers</a></li>
                   <li><a href="#" className="hover:text-[#7C3AED]">Contact</a></li>
                   <li><a href="#" className="hover:text-[#7C3AED]">Press</a></li>
                </ul>
             </div>
             <div className="col-span-2 md:col-span-1">
                <h4 className="font-bold text-[#3a3135] mb-4 text-sm">Legal</h4>
                <ul className="space-y-2 text-sm text-[#7a6f75]">
                   <li><a href="#" className="hover:text-[#7C3AED]">Privacy Policy</a></li>
                   <li><a href="#" className="hover:text-[#7C3AED]">Terms of Service</a></li>
                   <li><a href="#" className="hover:text-[#7C3AED]">Cookie Policy</a></li>
                </ul>
             </div>
          </div>
          
        </div>
      </div>
      
      <div className="border-t border-[#EDE9FE] py-6 px-6 md:px-16 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-[#7a6f75] bg-[#fbf9f6]">
        <p>&copy; {new Date().getFullYear()} FEMSPHERE HEALTH INC. ALL RIGHTS RESERVED.</p>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
           <a href="#" className="hover:text-[#7C3AED]"><Globe className="w-4 h-4" /></a>
           <a href="#" className="hover:text-[#7C3AED]"><Heart className="w-4 h-4" /></a>
           <a href="#" className="hover:text-[#7C3AED]"><Mail className="w-4 h-4" /></a>
        </div>
      </div>
    </footer>
  );
}
