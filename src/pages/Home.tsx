import React from 'react';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Services from '../components/Services';
import Features from '../components/Features';
import Projects from '../components/Projects';
import Process from '../components/Process';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#4a4145] font-sans overflow-x-hidden selection:bg-[#F4DDE2] selection:text-[#936DA2]">
      <main>
        <Hero />
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Stats />
          <Services />
          <Features />
          <Projects />
          <Process />
        </div>
      </main>
      <Footer />
    </div>
  );
}
