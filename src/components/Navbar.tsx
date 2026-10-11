import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center py-8 px-6 md:px-16 w-full max-w-7xl mx-auto z-10 relative">
      <Link to="/" className="flex items-center gap-3 group">
        <img
          src="/femsphere_logo.png"
          alt="FemSphere Logo"
          className="w-10 h-10 object-contain rounded-full shadow-xs transition-transform group-hover:scale-105"
        />
        <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-wide flex items-center gap-2 text-[#936DA2]">
          FemSphere
        </h1>
      </Link>
      
      <div className="hidden md:flex items-center gap-8">
        <a href="#why" className="text-base md:text-lg font-medium text-[#4a4145] hover:text-[#936DA2] transition-colors">Why FemSphere</a>
        <a href="#features" className="text-base md:text-lg font-medium text-[#4a4145] hover:text-[#936DA2] transition-colors">Features</a>
        <a href="#timeline" className="text-base md:text-lg font-medium text-[#4a4145] hover:text-[#936DA2] transition-colors">Journey</a>
      </div>
      
      <div className="flex items-center gap-3">
        <Link to="/login" className="hidden md:block text-base md:text-lg font-medium text-[#4a4145] hover:text-[#936DA2] transition-colors">
          Log in
        </Link>
        <Link to="/register" className="flex items-center bg-[#936DA2] hover:bg-[#835A92] transition-colors text-white rounded-full px-6 py-3 text-base md:text-lg font-medium shadow-sm gap-2">
          Get Started
        </Link>
      </div>
    </nav>
  );
}
