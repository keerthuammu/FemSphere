import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Heart, Moon, Flame, Droplet, Sparkles, Brain, Activity, ChevronRight, Eye, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function HealthTwinVisualizer() {
  const { setActiveTab, setActiveSubView, setIsAIChatOpen, vitals, cycleData, waterGlasses } = useApp();
  const [selectedNode, setSelectedNode] = useState<string>('heart');
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const nodes = [
    {
      id: 'heart',
      label: 'Heart & Vitals',
      icon: Heart,
      color: 'text-rose-500 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:border-rose-900',
      activeColor: 'bg-rose-500 text-white',
      badge: '72 BPM',
      status: 'Resting Normal',
      tabTarget: 'health',
      subView: 'vitals',
      description: 'Cardiovascular synchrony is optimal. Resting heart rate 72 bpm with high vagal heart rate variability.',
    },
    {
      id: 'cycle',
      label: 'Menstrual Cycle',
      icon: Sparkles,
      color: 'text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-950/40 dark:border-purple-900',
      activeColor: 'bg-purple-600 text-white',
      badge: `Day ${cycleData.currentDay} · ${cycleData.currentPhase}`,
      status: 'Ovulation Phase',
      tabTarget: 'health',
      subView: 'cycle',
      description: 'Luteinizing hormone surge predicted within 24h. Basal body temperature curve aligned with fertile peak.',
    },
    {
      id: 'sleep',
      label: 'Sleep Recovery',
      icon: Moon,
      color: 'text-indigo-500 bg-indigo-50 border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-900',
      activeColor: 'bg-indigo-500 text-white',
      badge: '7h 42m',
      status: '84% Quality',
      tabTarget: 'health',
      subView: 'vitals',
      description: 'REM cycles normal (1h 38m). Deep slow-wave sleep reached 1h 22m, facilitating cellular and hormone repair.',
    },
    {
      id: 'activity',
      label: 'Activity & Movement',
      icon: Flame,
      color: 'text-amber-500 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-900',
      activeColor: 'bg-amber-500 text-white',
      badge: '6,842 Steps',
      status: '68% Daily Goal',
      tabTarget: 'health',
      subView: 'fitness',
      description: '38 active minutes logged today. Low joint impact exercise suggested to match current cycle phase.',
    },
    {
      id: 'hydration',
      label: 'Hydration & Fuel',
      icon: Droplet,
      color: 'text-sky-500 bg-sky-50 border-sky-200 dark:bg-sky-950/40 dark:border-sky-900',
      activeColor: 'bg-sky-500 text-white',
      badge: `${waterGlasses} / 8 Glasses`,
      status: `${waterGlasses >= 6 ? 'On Track' : 'Drink 500ml'}`,
      tabTarget: 'health',
      subView: 'nutrition',
      description: 'Electrolyte balance supported by regular fluid intake. Target 2.4L total fluid for pregnancy/cycle hydration.',
    },
    {
      id: 'wellness',
      label: 'Mental Wellness',
      icon: Brain,
      color: 'text-emerald-500 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900',
      activeColor: 'bg-emerald-500 text-white',
      badge: 'Balanced',
      status: 'Low Stress Index',
      tabTarget: 'twin',
      subView: 'overview',
      description: 'HRV metrics indicate a calm parasympathetic state. Evening breathwork or gentle meditation recommended.',
    },
  ];

  const activeNodeData = nodes.find(n => n.id === selectedNode) || nodes[0];

  const handleOpenDetail = (tab: string, subView: string) => {
    setActiveTab(tab);
    setActiveSubView(subView);
  };

  // Three.js 3D Bio-Hologram Canvas Initialization
  useEffect(() => {
    if (viewMode !== '3d' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const width = canvas.clientWidth || 320;
    const height = canvas.clientHeight || 230;

    let animId: number;
    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, 0, 8.5);

      // 1. Holographic Bio-Particle Cloud (Humanoid contour)
      const particleCount = 1200;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      const colorPurple = new THREE.Color(0x8B5CF6);
      const colorRose = new THREE.Color(0xF43F5E);
      const colorTeal = new THREE.Color(0x14B8A6);

      for (let i = 0; i < particleCount; i++) {
        // Parametric stylized humanoid curve distribution
        const t = Math.random();
        const angle = Math.random() * Math.PI * 2;
        
        let y = (t * 5.2) - 2.6; // Body height range
        let radius = 0.55;

        // Head
        if (y > 1.8) {
          radius = 0.45 * Math.sin((y - 1.8) / 0.8 * Math.PI);
        }
        // Chest & Shoulders
        else if (y > 0.8) {
          radius = 0.95 * Math.sin((y - 0.8) / 1.0 * Math.PI);
        }
        // Waist
        else if (y > 0.0) {
          radius = 0.65;
        }
        // Pelvis / Hips
        else if (y > -0.8) {
          radius = 0.9 * Math.sin((y + 0.8) / 0.8 * Math.PI);
        }
        // Legs
        else {
          radius = 0.45 * (1 + (y + 2.6) / 1.8);
        }

        const r = radius * (0.8 + Math.random() * 0.4);
        positions[i * 3] = Math.cos(angle) * r;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = Math.sin(angle) * r * 0.7;

        // Color blend from head (purple) to heart (rose) to core (teal)
        const mixed = colorPurple.clone();
        if (y > 0.5 && y < 1.6) mixed.lerp(colorRose, 0.6);
        else if (y <= 0.5) mixed.lerp(colorTeal, 0.5);

        colors[i * 3] = mixed.r;
        colors[i * 3 + 1] = mixed.g;
        colors[i * 3 + 2] = mixed.b;
      }

      const particleGeo = new THREE.BufferGeometry();
      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const particleMat = new THREE.PointsMaterial({
        size: 0.075,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      });

      const particleCloud = new THREE.Points(particleGeo, particleMat);
      scene.add(particleCloud);

      // 2. Holographic Ring Rotators (Digital Twin Aura)
      const ringGeo = new THREE.TorusGeometry(1.6, 0.015, 16, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xA78BFA,
        transparent: true,
        opacity: 0.35,
        wireframe: true
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2.3;
      scene.add(ring);

      // 3. Glowing Heart Pulse Node
      const heartPulseGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const heartPulseMat = new THREE.MeshBasicMaterial({
        color: 0xF43F5E,
        transparent: true,
        opacity: 0.9
      });
      const heartNode = new THREE.Mesh(heartPulseGeo, heartPulseMat);
      heartNode.position.set(0, 0.95, 0.2);
      scene.add(heartNode);

      // Animation Loop
      let clock = new THREE.Clock();
      const animate = () => {
        animId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        particleCloud.rotation.y = elapsedTime * 0.45;
        ring.rotation.z = -elapsedTime * 0.3;
        ring.rotation.x = Math.PI / 2.3 + Math.sin(elapsedTime * 0.5) * 0.1;

        // Heart pulsating effect
        const scale = 1.0 + Math.sin(elapsedTime * 4.5) * 0.25;
        heartNode.scale.set(scale, scale, scale);

        renderer.render(scene, camera);
      };
      animate();

    } catch (err) {
      console.warn('Three.js initialization fallback:', err);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
      if (renderer) renderer.dispose();
    };
  }, [viewMode]);

  return (
    <div className="bg-white dark:bg-slate-850 rounded-2xl border border-purple-100/70 dark:border-slate-800 p-4 sm:p-5 shadow-sm font-inter">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
            <span>3D Digital Health Twin Visualizer</span>
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping"></span>
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Realtime physiological model powered by biometrics and cycle telemetries
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex bg-purple-50 dark:bg-slate-800 p-0.5 rounded-lg border border-purple-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('3d')}
              className={`px-2 py-1 rounded text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                viewMode === '3d' ? 'bg-[#936DA2] text-white shadow-2xs' : 'text-[#7a6f75] hover:text-[#3a3135]'
              }`}
            >
              <Eye className="w-3 h-3" /> 3D Holo
            </button>
            <button
              onClick={() => setViewMode('2d')}
              className={`px-2 py-1 rounded text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                viewMode === '2d' ? 'bg-[#936DA2] text-white shadow-2xs' : 'text-[#7a6f75] hover:text-[#3a3135]'
              }`}
            >
              <Layers className="w-3 h-3" /> 2D Map
            </button>
          </div>

          <button
            onClick={() => setIsAIChatOpen(true)}
            className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 flex items-center gap-0.5 cursor-pointer ml-1"
          >
            <span>Ask Twin</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Visualizer Canvas Area */}
      <div className="relative w-full h-60 bg-gradient-to-b from-purple-50/50 via-white to-rose-50/30 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 rounded-2xl border border-purple-100/50 dark:border-slate-800/80 flex items-center justify-center overflow-hidden my-3">
        
        {/* Mode 1: Three.js 3D Holographic Rendering */}
        {viewMode === '3d' && (
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover cursor-grab active:cursor-grabbing"
            style={{ width: '100%', height: '100%' }}
          />
        )}

        {/* Mode 2: 2D Anatomical Map Silhouette */}
        {viewMode === '2d' && (
          <div className="absolute inset-0 flex items-center justify-center opacity-70 dark:opacity-40 pointer-events-none">
            <svg className="w-36 h-48 text-purple-200 dark:text-slate-700" viewBox="0 0 200 300" fill="currentColor">
              <circle cx="100" cy="45" r="24" />
              <path d="M78 80 C78 72, 122 72, 122 80 L136 140 C140 160, 144 190, 134 250 L128 290 L110 290 L114 200 L86 200 L90 290 L72 290 L66 250 C56 190, 60 160, 64 140 Z" />
            </svg>
          </div>
        )}

        {/* Ambient Pulse Aura */}
        <div className="absolute w-48 h-48 rounded-full border border-purple-300/30 dark:border-purple-600/20 animate-ping pointer-events-none"></div>

        {/* Interactive Floating Hotspots Overlay */}
        {/* 1. Mental Wellness (Head) */}
        <button
          onClick={() => setSelectedNode('wellness')}
          aria-label="Wellness telemetry node"
          className={`absolute top-3 left-[48%] -translate-x-1/2 p-2 rounded-full transition-all shadow-md z-10 cursor-pointer ${
            selectedNode === 'wellness' ? 'bg-emerald-500 text-white scale-110 ring-4 ring-emerald-200 dark:ring-emerald-900' : 'bg-white/90 dark:bg-slate-800 text-emerald-600 hover:scale-105'
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
        </button>

        {/* 2. Heart (Chest) */}
        <button
          onClick={() => setSelectedNode('heart')}
          aria-label="Cardiovascular telemetry node"
          className={`absolute top-16 left-[48%] -translate-x-1/2 p-2.5 rounded-full transition-all shadow-md z-10 cursor-pointer ${
            selectedNode === 'heart' ? 'bg-rose-500 text-white scale-110 ring-4 ring-rose-200 dark:ring-rose-900' : 'bg-white/90 dark:bg-slate-800 text-rose-500 hover:scale-105'
          }`}
        >
          <Heart className="w-4 h-4 fill-current animate-pulse" />
        </button>

        {/* 3. Menstrual Cycle (Core) */}
        <button
          onClick={() => setSelectedNode('cycle')}
          aria-label="Menstrual cycle telemetry node"
          className={`absolute top-32 left-[48%] -translate-x-1/2 p-2.5 rounded-full transition-all shadow-md z-10 cursor-pointer ${
            selectedNode === 'cycle' ? 'bg-purple-600 text-white scale-110 ring-4 ring-purple-200 dark:ring-purple-900' : 'bg-white/90 dark:bg-slate-800 text-purple-600 hover:scale-105'
          }`}
        >
          <Sparkles className="w-4 h-4" />
        </button>

        {/* 4. Sleep (Left Orbit) */}
        <button
          onClick={() => setSelectedNode('sleep')}
          aria-label="Sleep telemetry node"
          className={`absolute top-10 left-5 p-2 rounded-xl border transition-all shadow-sm flex items-center gap-1.5 z-10 cursor-pointer ${
            selectedNode === 'sleep' ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white/90 dark:bg-slate-800 text-indigo-600 border-indigo-100 hover:scale-105'
          }`}
        >
          <Moon className="w-3.5 h-3.5" />
          <span className="text-[11px] font-bold">Sleep</span>
        </button>

        {/* 5. Hydration (Right Orbit) */}
        <button
          onClick={() => setSelectedNode('hydration')}
          aria-label="Hydration telemetry node"
          className={`absolute top-10 right-5 p-2 rounded-xl border transition-all shadow-sm flex items-center gap-1.5 z-10 cursor-pointer ${
            selectedNode === 'hydration' ? 'bg-sky-500 text-white border-sky-500 shadow-md' : 'bg-white/90 dark:bg-slate-800 text-sky-500 border-sky-100 hover:scale-105'
          }`}
        >
          <Droplet className="w-3.5 h-3.5" />
          <span className="text-[11px] font-bold">Water</span>
        </button>

        {/* 6. Activity (Bottom Orbit) */}
        <button
          onClick={() => setSelectedNode('activity')}
          aria-label="Physical activity telemetry node"
          className={`absolute bottom-4 right-6 p-2 rounded-xl border transition-all shadow-sm flex items-center gap-1.5 z-10 cursor-pointer ${
            selectedNode === 'activity' ? 'bg-amber-500 text-white border-amber-500 shadow-md' : 'bg-white/90 dark:bg-slate-800 text-amber-600 border-amber-100 hover:scale-105'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span className="text-[11px] font-bold">Steps</span>
        </button>
      </div>

      {/* Selected Node Realtime Telemetry Card */}
      <div className="bg-purple-50/50 dark:bg-slate-800/50 rounded-xl p-3.5 border border-purple-100 dark:border-slate-800 transition-all">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              {activeNodeData.label}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-white dark:bg-slate-700 font-semibold text-purple-700 dark:text-purple-300 shadow-xs border border-purple-100 dark:border-slate-600">
              {activeNodeData.badge}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
            {activeNodeData.status}
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-2.5">
          {activeNodeData.description}
        </p>

        <button
          onClick={() => handleOpenDetail(activeNodeData.tabTarget, activeNodeData.subView)}
          className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 flex items-center gap-1 cursor-pointer"
        >
          <span>Explore Detailed Trends</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
