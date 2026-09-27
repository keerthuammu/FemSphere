import React, { useState } from 'react';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  MessageSquare,
  FileText,
  Sparkles,
  ShieldCheck,
  Send,
  X,
  Pill,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function TelehealthView() {
  const {
    isTelehealthActive,
    endTelehealthSession,
    activeTelehealthDoctor,
    user
  } = useApp();

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [activeSideTab, setActiveSideTab] = useState<'notes' | 'chat' | 'rx'>('notes');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Dr. Elena Vance', text: 'Hello Sarah! I have your latest metabolic panel and ultrasound results on my screen.', time: '10:31 AM' },
    { sender: 'You', text: 'Good morning Dr. Vance! Excited to review the baby growth percentiles.', time: '10:32 AM' },
  ]);
  const [chatInput, setChatInput] = useState('');

  if (!isTelehealthActive || !activeTelehealthDoctor) return null;

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      setChatMessages(prev => [
        ...prev,
        { sender: 'You', text: chatInput, time: 'Just now' },
      ]);
      setChatInput('');
      setTimeout(() => {
        setChatMessages(prev => [
          ...prev,
          {
            sender: activeTelehealthDoctor.name,
            text: 'I noted that. Your ferritin levels look stable; we will maintain current 25mg iron.',
            time: 'Just now',
          },
        ]);
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-4xl h-[94vh] max-h-[760px] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-purple-500/20 flex flex-col justify-between text-white">
        {/* Top Clinical Header */}
        <div className="p-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-white">
                  {activeTelehealthDoctor.name}
                </h3>
                <span className="text-[10px] text-purple-400 font-medium">
                  {activeTelehealthDoctor.specialty}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                HIPAA-Compliant 256-Bit Encrypted Video Channel · Patient: {user.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 font-bold bg-slate-900 px-2 py-1 rounded-md border border-slate-800">
              14:22
            </span>
            <button
              onClick={endTelehealthSession}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Consultation Main Canvas */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 relative">
          {/* Main Video Screen */}
          <div className="flex-1 relative bg-slate-950 flex items-center justify-center overflow-hidden">
            {/* Simulated Doctor Video Stream */}
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=80"
                alt="Doctor stream"
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>

              {/* Doctor label in call */}
              <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs flex items-center gap-2">
                <span className="font-bold text-white">{activeTelehealthDoctor.name}</span>
                <span className="text-[10px] text-emerald-400">Audio 100%</span>
              </div>

              {/* Patient Self-View Picture-in-Picture */}
              <div className="absolute top-4 right-4 w-28 h-36 bg-slate-800 rounded-2xl border-2 border-purple-500/50 shadow-xl overflow-hidden flex flex-col justify-end p-2">
                {isVideoOff ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900 text-[10px] text-slate-400">
                    Camera Off
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/60 to-rose-900/40 flex items-center justify-center">
                    <span className="text-xl font-serif text-white">Sarah</span>
                  </div>
                )}
                <span className="relative z-10 text-[9px] font-bold text-white bg-black/60 px-1 rounded w-fit">
                  You (Patient)
                </span>
              </div>
            </div>
          </div>

          {/* Right Clinical Drawer (Clinical Notes, Live Chat, Digital Rx) */}
          <div className="w-full md:w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-64 md:h-auto">
            {/* Sub-tabs */}
            <div className="flex items-center border-b border-slate-800 text-xs">
              <button
                onClick={() => setActiveSideTab('notes')}
                className={`flex-1 py-2 font-semibold text-center transition-colors min-h-[44px] ${
                  activeSideTab === 'notes' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-slate-400'
                }`}
              >
                Clinical Note
              </button>
              <button
                onClick={() => setActiveSideTab('chat')}
                className={`flex-1 py-2 font-semibold text-center transition-colors min-h-[44px] ${
                  activeSideTab === 'chat' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-slate-400'
                }`}
              >
                Chat ({chatMessages.length})
              </button>
              <button
                onClick={() => setActiveSideTab('rx')}
                className={`flex-1 py-2 font-semibold text-center transition-colors min-h-[44px] ${
                  activeSideTab === 'rx' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-slate-400'
                }`}
              >
                Digital Rx
              </button>
            </div>

            {/* Content of selected side tab */}
            <div className="flex-1 p-3 overflow-y-auto text-xs space-y-2.5">
              {activeSideTab === 'notes' && (
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                    <span className="text-[10px] text-purple-400 uppercase font-bold">
                      Real-time Twin Telemetry Shared
                    </span>
                    <p className="text-slate-300 mt-1">
                      Resting HR: 72 BPM · Blood Pressure: 118/76 · SpO2: 98% · Gestational Week: 24
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">
                      Doctor Findings
                    </span>
                    <p className="text-slate-300 mt-1">
                      Fetal growth is concordant. Iron bisglycinate protocol maintained. Schedule 26-week gestational glucose screen.
                    </p>
                  </div>
                </div>
              )}

              {activeSideTab === 'chat' && (
                <div className="flex flex-col h-full justify-between">
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {chatMessages.map((m, i) => (
                      <div key={i} className="bg-slate-800 p-2 rounded-xl">
                        <span className="text-[10px] font-bold text-purple-300">{m.sender}</span>
                        <p className="text-slate-200 mt-0.5">{m.text}</p>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleSendChat} className="flex gap-1 mt-2">
                    <input
                      type="text"
                      placeholder="Type doctor note..."
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2 text-xs"
                    />
                    <button type="submit" className="p-2 bg-purple-600 rounded-lg text-white">
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              )}

              {activeSideTab === 'rx' && (
                <div className="space-y-2">
                  <div className="p-3 bg-purple-950/40 border border-purple-500/40 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 text-purple-300 font-bold">
                      <Pill className="w-4 h-4" />
                      <span>Electronic Prescription Issued</span>
                    </div>
                    <p className="text-white font-bold">Prenatal Multivitamin with Methylfolate & DHA</p>
                    <p className="text-slate-400">Sig: 1 Softgel daily with breakfast · 90 Days Refill</p>
                    <span className="text-[10px] text-emerald-400 font-bold block pt-1">
                      Transmitted to Northwest Care Pharmacy ✓
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Call Controls Bar */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-center gap-4">
          <button
            onClick={() => setIsMuted(prev => !prev)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setIsVideoOff(prev => !prev)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isVideoOff ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>

          <button
            onClick={endTelehealthSession}
            className="px-6 h-12 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-900/30 transition-all min-h-[44px]"
          >
            <PhoneOff className="w-4 h-4" />
            <span>End Consultation</span>
          </button>
        </div>
      </div>
    </div>
  );
}
