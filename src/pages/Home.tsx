import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Services from '../components/Services';
import Features from '../components/Features';
import Projects from '../components/Projects';
import Process from '../components/Process';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fbf9f6] text-[#4a4145] font-sans overflow-x-hidden selection:bg-[#EDE9FE] selection:text-[#7C3AED]">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Services />
        <Features />
        <Projects />
        <Process />
      </main>
      <Footer />
    </div>
  );
}
