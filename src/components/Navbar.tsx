import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center py-8 px-6 md:px-16 w-full max-w-7xl mx-auto z-10 relative">
      <Link to="/" className="flex items-center gap-3">
        <h1 className="font-serif text-3xl font-medium tracking-wide flex items-center gap-2 text-[#7C3AED]">
          FemSphere <Sparkles className="w-5 h-5 text-[#14B8A6]" />
        </h1>
      </Link>
      
      <div className="hidden md:flex items-center gap-8">
        <a href="#why" className="text-sm font-medium text-[#4a4145] hover:text-[#7C3AED] transition-colors">Why FemSphere</a>
        <a href="#features" className="text-sm font-medium text-[#4a4145] hover:text-[#7C3AED] transition-colors">Features</a>
        <a href="#timeline" className="text-sm font-medium text-[#4a4145] hover:text-[#7C3AED] transition-colors">Journey</a>
      </div>
      
      <div className="flex items-center gap-4">
        <Link to="/login" className="hidden md:block text-sm font-medium text-[#4a4145] hover:text-[#7C3AED] transition-colors">
          Log in
        </Link>
        <Link to="/register" className="flex items-center bg-[#7C3AED] hover:bg-[#6D28D9] transition-colors text-white rounded-full px-5 py-2.5 text-sm font-medium shadow-sm gap-2">
          Get Started
        </Link>
      </div>
    </nav>
  );
}
