import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  ShieldCheck,
  Send,
  X,
  Pill,
  ScreenShare,
  Plus,
  CheckCircle2
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
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeSideTab, setActiveSideTab] = useState<'notes' | 'chat' | 'rx'>('notes');
  const [callSeconds, setCallSeconds] = useState(862); // 14:22 start

  const [chatMessages, setChatMessages] = useState([
    { sender: 'Dr. Elena Vance', text: 'Hello Sarah! I have your latest metabolic panel and ultrasound results on my screen.', time: '10:31 AM' },
    { sender: 'You', text: 'Good morning Dr. Vance! Excited to review the baby growth percentiles.', time: '10:32 AM' },
  ]);
  const [chatInput, setChatInput] = useState('');

  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      medication: 'Prenatal Multivitamin with Methylfolate & DHA',
      instructions: 'Sig: 1 Softgel daily with breakfast · 90 Days Refill',
      pharmacy: 'Northwest Care Pharmacy'
    }
  ]);
  const [newMed, setNewMed] = useState('');
  const [newSig, setNewSig] = useState('');

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  // Call duration counter
  useEffect(() => {
    if (!isTelehealthActive) return;
    const interval = setInterval(() => {
      setCallSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isTelehealthActive]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Safe camera stream acquisition
  useEffect(() => {
    if (!isTelehealthActive) return;

    let isMounted = true;
    async function startCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
          });
          if (isMounted) {
            localStreamRef.current = stream;
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
            }
          }
        }
      } catch (err) {
        // Fallback gracefully to avatar if permission is denied or test environment
        console.info('Camera access simulated or unavailable:', err);
      }
    }

    startCamera();

    return () => {
      isMounted = false;
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => t.stop());
        localStreamRef.current = null;
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(t => t.stop());
        screenStreamRef.current = null;
      }
    };
  }, [isTelehealthActive]);

  // Handle Mute toggle
  const toggleMute = () => {
    setIsMuted(prev => {
      const next = !prev;
      if (localStreamRef.current) {
        localStreamRef.current.getAudioTracks().forEach(track => {
          track.enabled = !next;
        });
      }
      return next;
    });
  };

  // Handle Video toggle
  const toggleVideo = () => {
    setIsVideoOff(prev => {
      const next = !prev;
      if (localStreamRef.current) {
        localStreamRef.current.getVideoTracks().forEach(track => {
          track.enabled = !next;
        });
      }
      return next;
    });
  };

  // Handle Screen Sharing
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
        screenStreamRef.current = null;
      }
      setIsScreenSharing(false);
    } else {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          const screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: true
          });
          screenStreamRef.current = screenStream;
          setIsScreenSharing(true);
          if (screenVideoRef.current) {
            screenVideoRef.current.srcObject = screenStream;
          }

          // Listener when browser's native "Stop Sharing" floating bar is clicked
          screenStream.getVideoTracks()[0].onended = () => {
            setIsScreenSharing(false);
            screenStreamRef.current = null;
          };
        } else {
          // Simulation fallback for unsupported browsers
          setIsScreenSharing(true);
        }
      } catch (err) {
        console.warn('Screen share cancelled or unsupported:', err);
      }
    }
  };

  const handleEndCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(t => t.stop());
    }
    endTelehealthSession();
  };

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
            sender: activeTelehealthDoctor?.name || 'Dr. Elena Vance',
            text: 'I noted that. Your clinical parameters look stable; we will maintain current recommendations.',
            time: 'Just now',
          },
        ]);
      }, 1000);
    }
  };

  const handleAddPrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMed.trim()) {
      setPrescriptions(prev => [
        ...prev,
        {
          id: Date.now(),
          medication: newMed.trim(),
          instructions: newSig.trim() || 'Sig: As directed by physician',
          pharmacy: 'Northwest Care Pharmacy'
        }
      ]);
      setNewMed('');
      setNewSig('');
    }
  };

  if (!isTelehealthActive || !activeTelehealthDoctor) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-4xl h-[94vh] max-h-[760px] bg-slate-900 rounded-3xl border border-purple-500/20 flex flex-col justify-between text-white shadow-2xl overflow-hidden">
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
                {isScreenSharing && (
                  <span className="text-[10px] bg-purple-900/60 text-purple-300 border border-purple-600/40 px-2 py-0.5 rounded-full">
                    Screen Shared
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                HIPAA-Compliant 256-Bit Encrypted Video Channel · Patient: {user.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 font-bold bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
              {formatTimer(callSeconds)}
            </span>
            <button
              onClick={handleEndCall}
              className="text-slate-400 hover:text-white p-1"
              aria-label="Close call"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Consultation Main Canvas */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 relative">
          {/* Main Video Screen */}
          <div className="flex-1 relative bg-slate-950 flex items-center justify-center overflow-hidden">
            {isScreenSharing ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center bg-slate-900">
                <video
                  ref={screenVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-4 left-4 bg-purple-950/80 border border-purple-500/50 px-3 py-1.5 rounded-xl text-xs text-purple-200 flex items-center gap-2">
                  <ScreenShare className="w-4 h-4 text-purple-400" />
                  <span>Sharing Screen: Biometric Chart & Labs</span>
                </div>
              </div>
            ) : (
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
              </div>
            )}

            {/* Patient Self-View Picture-in-Picture */}
            <div className="absolute top-4 right-4 w-28 h-36 bg-slate-800 rounded-2xl border-2 border-purple-500/50 shadow-xl overflow-hidden flex flex-col justify-end p-2">
              {isVideoOff ? (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900 text-[10px] text-slate-400">
                  Camera Off
                </div>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/60 to-rose-900/40 flex items-center justify-center">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                </div>
              )}
              <span className="relative z-10 text-[9px] font-bold text-white bg-black/60 px-1 rounded w-fit">
                {user.name || 'You (Patient)'}
              </span>
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
                Digital Rx ({prescriptions.length})
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
                      Doctor Clinical Findings
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
                  {prescriptions.map(rx => (
                    <div key={rx.id} className="p-3 bg-purple-950/40 border border-purple-500/40 rounded-xl space-y-1">
                      <div className="flex items-center gap-1.5 text-purple-300 font-bold">
                        <Pill className="w-4 h-4" />
                        <span>Electronic Prescription Issued</span>
                      </div>
                      <p className="text-white font-bold">{rx.medication}</p>
                      <p className="text-slate-400">{rx.instructions}</p>
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 pt-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Transmitted to {rx.pharmacy} ✓
                      </span>
                    </div>
                  ))}

                  <form onSubmit={handleAddPrescription} className="pt-2 border-t border-slate-800 space-y-2">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Issue New Clinical Prescription</span>
                    <input
                      type="text"
                      placeholder="Medication name (e.g., Metformin 500mg)"
                      value={newMed}
                      onChange={e => setNewMed(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Dosage instruction (e.g., 1 tablet twice daily)"
                      value={newSig}
                      onChange={e => setNewSig(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-xs text-white"
                    />
                    <button
                      type="submit"
                      disabled={!newMed.trim()}
                      className="w-full py-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Issue & Transmit Rx
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Call Controls Bar */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-center gap-4">
          <button
            onClick={toggleMute}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={toggleVideo}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isVideoOff ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>

          <button
            onClick={toggleScreenShare}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isScreenSharing ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/50' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title={isScreenSharing ? 'Stop Screen Sharing' : 'Share Screen'}
          >
            <ScreenShare className="w-5 h-5" />
          </button>

          <button
            onClick={handleEndCall}
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
