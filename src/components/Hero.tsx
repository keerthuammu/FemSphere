import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bookmark, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpRight,
  Shield,
  Activity,
  Heart
} from 'lucide-react';

// Bespoke SVG Social Icons matching reference UI
function VkIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.07 2H8.93C4.24 2 2 4.24 2 8.93v6.14C2 19.76 4.24 22 8.93 22h6.14c4.69 0 6.93-2.24 6.93-6.93V8.93C22 4.24 19.76 2 15.07 2zm3.32 12.92h-1.63c-.62 0-.81-.49-1.92-1.6-1-.96-1.44-1.08-1.69-1.08-.35 0-.45.1-.45.58v1.44c0 .39-.12.66-1.18.66-1.75 0-3.69-1.06-5.06-3.04-2.07-2.94-2.63-5.15-2.63-5.6 0-.25.1-.48.58-.48h1.63c.43 0 .6.2.77.67.84 2.45 2.25 4.6 2.83 4.6.22 0 .32-.1.32-.66v-2.5c-.07-1.19-.7-1.29-.7-1.71 0-.2.17-.4.44-.4h2.56c.36 0 .49.19.49.62v3.38c0 .36.16.49.27.49.22 0 .4-.13.82-.55 1.27-1.43 2.18-3.64 2.18-3.64.12-.26.33-.49.77-.49h1.63c.49 0 .6.25.49.6-.21.96-2.24 3.84-2.24 3.84-.19.32-.27.46 0 .82.19.26.83.81 1.25 1.3 1.05 1.18 1.48 1.87 1.65 2.13.19.26.1.51-.27.51z"/>
    </svg>
  );
}

function InstagramIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

function TelegramIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l-.313 4.693c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z"/>
    </svg>
  );
}

// Images from repository
import heroWomanLotus from '../assets/images/healthcare_hero_1785261756891.jpeg';
import heroPortraitSweater from '../assets/images/hero_portrait_1785234031037.jpg';
import lavenderDeskPill from '../assets/images/footer_desk_1785234005964.jpg';

// Bespoke Eyed 'O' Component matching the reference UI
function EyedO() {
  return (
    <span className="relative inline-flex items-center justify-center align-middle mx-[1px] w-[0.8em] h-[0.8em]">
      <svg viewBox="0 0 100 100" className="w-full h-full text-stone-900" fill="none">
        {/* Outer stylized O ellipse */}
        <ellipse cx="50" cy="50" rx="44" ry="46" stroke="currentColor" strokeWidth="11" />
        {/* Hand-drawn almond eye curve */}
        <path
          d="M 22 50 Q 50 28 78 50 Q 50 72 22 50 Z"
          stroke="currentColor"
          strokeWidth="6.5"
          strokeLinejoin="round"
        />
        {/* Iris & pupil */}
        <circle cx="50" cy="50" r="10.5" fill="currentColor" />
        <circle cx="53.5" cy="46.5" r="3.2" fill="#FFFFFF" />
      </svg>
    </span>
  );
}



// 9-Piece Organic Pebble Continuous Mosaic Component
interface OrganicMosaicProps {
  imageSrc: string;
}

function OrganicMosaic({ imageSrc }: OrganicMosaicProps) {
  // Tile geometry configuration matching the reference mosaic:
  // Container: 420px wide by 400px tall
  // Gaps: 10px between tiles
  // Col 1: width 110, x = 0
  // Col 2: width 180, x = 120
  // Col 3: width 110, x = 310
  // Row 1: height 110, y = 0
  // Row 2: height 160, y = 120
  // Row 3: height 110, y = 290
  const tiles = [
    // Row 1
    {
      id: 't1-1',
      x: 0,
      y: 0,
      w: 110,
      h: 110,
      borderRadius: '52px 18px 36px 18px', // Top-left pebble
      delay: '0ms'
    },
    {
      id: 't1-2',
      x: 120,
      y: 0,
      w: 180,
      h: 110,
      borderRadius: '80px 80px 18px 18px', // Tall arch dome
      delay: '40ms'
    },
    {
      id: 't1-3',
      x: 310,
      y: 0,
      w: 110,
      h: 110,
      borderRadius: '18px 52px 18px 36px', // Top-right pebble
      delay: '80ms'
    },
    // Row 2
    {
      id: 't2-1',
      x: 0,
      y: 120,
      w: 110,
      h: 160,
      borderRadius: '54px 18px 18px 54px', // Elongated left pill
      delay: '60ms'
    },
    {
      id: 't2-2',
      x: 120,
      y: 120,
      w: 180,
      h: 160,
      borderRadius: '28px', // Center face frame square
      delay: '20ms'
    },
    {
      id: 't2-3',
      x: 310,
      y: 120,
      w: 110,
      h: 160,
      borderRadius: '18px 54px 54px 18px', // Elongated right pill
      delay: '100ms'
    },
    // Row 3
    {
      id: 't3-1',
      x: 0,
      y: 290,
      w: 110,
      h: 110,
      borderRadius: '20px 18px 18px 52px', // Bottom-left pebble
      delay: '120ms'
    },
    {
      id: 't3-2',
      x: 120,
      y: 290,
      w: 180,
      h: 110,
      borderRadius: '18px 18px 52px 52px', // Bottom lotus capsule
      delay: '140ms'
    },
    {
      id: 't3-3',
      x: 310,
      y: 290,
      w: 110,
      h: 110,
      borderRadius: '18px 20px 52px 18px', // Bottom-right pebble
      delay: '160ms'
    }
  ];

  return (
    <div className="relative w-[320px] h-[305px] sm:w-[380px] sm:h-[362px] md:w-[420px] md:h-[400px] mx-auto select-none group">
      {/* Soft lavender background aura glow */}
      <div className="absolute -inset-6 bg-gradient-to-tr from-purple-200/30 via-rose-100/20 to-purple-300/30 rounded-full blur-2xl -z-10 opacity-70 pointer-events-none"></div>

      {/* 9 Mosaic Tiles */}
      {tiles.map((tile) => (
        <div
          key={tile.id}
          className="absolute overflow-hidden bg-purple-50 transition-all duration-500 hover:scale-[1.025] hover:shadow-lg hover:shadow-purple-900/10"
          style={{
            left: `${(tile.x / 420) * 100}%`,
            top: `${(tile.y / 400) * 100}%`,
            width: `${(tile.w / 420) * 100}%`,
            height: `${(tile.h / 400) * 100}%`,
            borderRadius: tile.borderRadius,
            boxShadow: '0 6px 18px -4px rgba(124, 58, 237, 0.08)'
          }}
        >
          {/* Continuous un-interrupted underlying photo */}
          <img
            src={imageSrc}
            alt="FemSphere Woman Wellness"
            className="absolute max-w-none object-cover pointer-events-none transition-transform duration-700 group-hover:scale-[1.01]"
            style={{
              width: '100%',
              height: '100%',
              minWidth: '420px',
              minHeight: '400px',
              left: `${(-tile.x / tile.w) * 100}%`,
              top: `${(-tile.y / tile.h) * 100}%`,
              transformOrigin: 'center center'
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default function Hero() {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);

  // Available hero portrait options
  const heroImages = [
    heroWomanLotus,       // Active hero image with lotus flower
    heroPortraitSweater   // Portrait woman in cream sweater with lavender
  ];

  const currentHeroImage = heroImages[activeSlide % heroImages.length];

  const handlePrevSlide = () => {
    setActiveSlide(prev => (prev === 0 ? heroImages.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setActiveSlide(prev => prev + 1);
  };

  return (
    <section className="w-full bg-white transition-colors">
      {/* Full-width clean modern container without boxed border frame */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 md:px-14 lg:px-16 pt-6 sm:pt-8 pb-14 sm:pb-20 relative overflow-hidden">
        
        {/* Subtle Ambient Lavender Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-purple-100/30 via-purple-50/15 to-transparent rounded-full blur-3xl pointer-events-none -z-0"></div>
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-gradient-to-tr from-purple-100/20 via-rose-50/15 to-transparent rounded-full blur-3xl pointer-events-none -z-0"></div>

        {/* ========================================================================= */}
        {/* 1. TOP HEADER / NAVIGATION */}
        {/* ========================================================================= */}
        <header className="relative z-20 flex items-center justify-between pb-6 sm:pb-8 border-b border-stone-100/80">
          {/* Left Brand Logo */}
          <Link to="/" className="flex items-center gap-1.5 group">
            <span className="font-extrabold text-2xl tracking-tight text-stone-900 group-hover:text-[#936DA2] transition-colors">
              femsphere<span className="text-[#936DA2] font-black">:</span>me
            </span>
          </Link>

          {/* Center: "Let's connect" + Social icons in black pills */}
          <div className="hidden md:flex items-center gap-3">
            <span className="text-xs font-medium text-stone-600 tracking-tight">Let's connect</span>
            <div className="flex items-center gap-1.5">
              <a
                href="https://vk.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Community"
                className="w-6 h-6 rounded-full bg-stone-900 hover:bg-[#936DA2] text-white flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-xs"
              >
                <VkIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-6 h-6 rounded-full bg-stone-900 hover:bg-[#936DA2] text-white flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-xs"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noreferrer"
                aria-label="Telegram"
                className="w-6 h-6 rounded-full bg-stone-900 hover:bg-[#936DA2] text-white flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-xs"
              >
                <TelegramIcon className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right: Search, Bookmark, + Login, User Avatar */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => {
                const el = document.getElementById('features');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              aria-label="Search wellness modules"
              className="w-8 h-8 rounded-full flex items-center justify-center text-stone-600 hover:text-stone-950 hover:bg-stone-100 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/login')}
              aria-label="Saved Vault Records"
              className="w-8 h-8 rounded-full flex items-center justify-center text-stone-600 hover:text-stone-950 hover:bg-stone-100 transition-colors"
            >
              <Bookmark className="w-4 h-4" />
            </button>
            
            <Link
              to="/login"
              className="flex items-center gap-1 text-xs font-bold text-stone-900 hover:text-[#936DA2] transition-colors py-1.5 px-2 rounded-lg hover:bg-purple-50"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Login</span>
            </Link>

            {/* Profile Avatar Thumbnail with Lavender ring */}
            <Link
              to="/dashboard"
              className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-purple-200 hover:border-[#936DA2] transition-colors shrink-0 shadow-xs"
              title="FemSphere Portal"
            >
              <img
                src={heroPortraitSweater}
                alt="Profile Avatar"
                className="w-full h-full object-cover object-center"
              />
            </Link>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* 2. MAIN HERO BODY (3-Column Layout with Center Mosaic) */}
        {/* ========================================================================= */}
        <div className="relative z-10 pt-8 sm:pt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-start">
          
          {/* ----------------------------------------------------------------------- */}
          {/* LEFT COLUMN: Navigation list, Tagline, Slider, Thumbnails, Blurb */}
          {/* ----------------------------------------------------------------------- */}
          <div className="lg:col-span-3 flex flex-col justify-between h-full space-y-8">
            {/* 2-Column Links Menu */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs tracking-tight">
              <div className="space-y-2">
                <Link to="/" className="block font-bold text-stone-950 hover:text-[#936DA2] transition-colors">
                  Home
                </Link>
                <a href="#services" className="block font-medium text-stone-500 hover:text-stone-900 transition-colors">
                  Services
                </a>
                <a href="#features" className="block font-medium text-stone-500 hover:text-stone-900 transition-colors">
                  Products
                </a>
              </div>
              <div className="space-y-2">
                <a href="#contact" className="block font-medium text-stone-500 hover:text-stone-900 transition-colors">
                  Contacts
                </a>
                <a href="#testimonials" className="block font-medium text-stone-500 hover:text-stone-900 transition-colors">
                  Testimonials
                </a>
                <a href="#about" className="block font-medium text-stone-500 hover:text-stone-900 transition-colors">
                  About Us
                </a>
              </div>
            </div>

            {/* Brand statement / Tagline */}
            <div className="space-y-1">
              <h3 className="font-extrabold text-base md:text-lg text-stone-900 leading-tight">
                femsphere<span className="text-[#936DA2]">:</span>me -
              </h3>
              <p className="text-sm md:text-base font-medium text-stone-800 leading-snug">
                a companion for <br />
                female wellness
              </p>
            </div>

            {/* Slider Navigation Arrows */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handlePrevSlide}
                aria-label="Previous portrait"
                className="w-9 h-9 rounded-full border border-stone-300 hover:border-[#936DA2] text-stone-700 hover:text-[#936DA2] hover:bg-purple-50 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
              </button>
              <button
                type="button"
                onClick={handleNextSlide}
                aria-label="Next portrait"
                className="w-9 h-9 rounded-full border border-stone-300 hover:border-[#936DA2] text-stone-700 hover:text-[#936DA2] hover:bg-purple-50 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <ChevronRight className="w-4 h-4 stroke-[2.2]" />
              </button>
            </div>

            {/* Preview Cards / Thumbnails */}
            <div className="flex items-center gap-3 pt-1">
              {/* Card 1: Peeking edge preview */}
              <div className="w-14 sm:w-16 h-28 sm:h-32 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/60 shadow-xs shrink-0 relative">
                <img
                  src={heroWomanLotus}
                  alt="Wellness Telemetry"
                  className="w-full h-full object-cover object-left opacity-90 hover:opacity-100 transition-opacity"
                />
              </div>

              {/* Card 2: Full preview of alternate portrait */}
              <div 
                onClick={handleNextSlide}
                className="w-24 sm:w-28 h-28 sm:h-32 rounded-2xl overflow-hidden bg-purple-50 border border-purple-100 shadow-sm shrink-0 cursor-pointer relative group hover:border-[#936DA2] transition-colors"
                title="Click to toggle center hero"
              >
                <img
                  src={heroPortraitSweater}
                  alt="Portrait Preview"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5">
                  <span className="text-[9px] text-white font-semibold">Switch ↺</span>
                </div>
              </div>
            </div>

            {/* Explanatory description blurb */}
            <p className="text-xs text-stone-500 max-w-[210px] leading-relaxed font-normal pt-1">
              We offer a wide range of personalized AI services and hormonal biomarker insights to cater to your specific female health needs.
            </p>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* CENTER COLUMN: Bold Headline, Eyed 'O', Pill Capsule, Sticker, Mosaic */}
          {/* ----------------------------------------------------------------------- */}
          <div className="lg:col-span-6 flex flex-col items-center text-center relative">
            
            {/* MAIN HEADLINE WITH BESPOKE TYPOGRAPHY */}
            <div className="mb-6 sm:mb-8 relative">
              <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] tracking-tight text-stone-900 leading-[1.08] uppercase select-none">
                Y<EyedO />UR LIFETIME
                <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mt-1">
                  <span>WELL-BEING</span>
                  
                  {/* Inline Capsule / Pill with peaceful photo */}
                  <div className="inline-block align-middle w-20 sm:w-24 md:w-28 h-8 sm:h-9 md:h-10 rounded-full overflow-hidden border border-purple-200 shadow-xs relative shrink-0">
                    <img
                      src={lavenderDeskPill}
                      alt="Calm Aesthetic"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                </div>
              </h1>

              {/* Tilted Sticker Box: "femsphere" */}
              <div className="flex justify-end pr-6 sm:pr-12 -mt-1 sm:-mt-2">
                <span className="inline-block transform -rotate-3 bg-purple-50/90 text-stone-900 border border-stone-800 rounded px-2.5 py-0.5 text-[10px] sm:text-xs font-mono font-bold tracking-tight shadow-xs hover:rotate-0 transition-transform cursor-default">
                  femsphere:me
                </span>
              </div>
            </div>

            {/* THE SIGNATURE CENTERPIECE (9-Tile Organic Mosaic) */}
            <div className="relative my-2 sm:my-4">
              <OrganicMosaic imageSrc={currentHeroImage} />
            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* RIGHT COLUMN: Floating Therapy Card, CTA Blurb & "Learn More ↗" Button */}
          {/* ----------------------------------------------------------------------- */}
          <div className="lg:col-span-3 flex flex-col justify-between h-full space-y-8 lg:items-end">
            
            {/* Floating Service Card ("Individual Care / AI Health Twin") */}
            <div className="bg-stone-50/70 hover:bg-white rounded-[26px] p-5 border border-stone-100 shadow-xs hover:shadow-md w-full max-w-[270px] space-y-3 transition-all duration-300">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold tracking-tight text-stone-900 uppercase">
                  Individual Care
                </h4>
                <div className="w-5 h-5 rounded-full bg-purple-100/70 text-[#936DA2] flex items-center justify-center text-[10px]">
                  ✦
                </div>
              </div>

              <p className="text-[11px] text-stone-500 leading-relaxed font-normal">
                Collaborate with our continuous AI Health Twin for personalized biomarkers and cycle guidance tailored to your biology.
              </p>

              {/* Photo inside the floating card */}
              <div className="w-full h-24 rounded-2xl overflow-hidden bg-purple-50 relative border border-stone-100 shadow-2xs">
                <img
                  src={heroPortraitSweater}
                  alt="Individual Therapy Guidance"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs rounded-full px-2 py-0.5 text-[9px] font-bold text-[#936DA2] shadow-2xs">
                  Live
                </div>
              </div>
            </div>

            {/* Bottom-Right Call to Action: "The first lesson is free" + "Learn More ↗" */}
            <div className="space-y-3 pt-6 lg:text-right w-full max-w-[270px]">
              <p className="text-sm font-semibold text-stone-900 tracking-tight">
                The first consultation is free
              </p>
              
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full border border-stone-900 text-xs font-bold text-stone-900 hover:bg-stone-900 hover:text-white transition-all shadow-sm active:scale-95 group"
              >
                <span>Learn More</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
