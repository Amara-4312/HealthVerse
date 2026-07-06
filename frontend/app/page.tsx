'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sendChatMessage, ChatResponse, CollaborationStep } from '../lib/api';

// ─── Types ──────────────────────────────────────────────────────────────────

type View = 'welcome' | 'explore' | 'loading' | 'insights';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  agentsConsulted?: string[];
  logs?: CollaborationStep[];
}

const CONSTELLATIONS = [
  { name: 'Cardiovascular', icon: 'monitor_heart',  query: 'What happens to the heart when running?' },
  { name: 'Cognitive',      icon: 'psychology',     query: 'Tell me about cognitive focus and mental fatigue' },
  { name: 'Respiratory',    icon: 'air',            query: 'How does oxygen intake affect energy levels?' },
  { name: 'Recovery',       icon: 'battery_charging_full', query: 'Why is sleep hygiene essential for recovery?' },
  { name: 'Nutrition',      icon: 'nutrition',      query: 'How do macronutrients affect general metabolism?' },
  { name: 'Movement',       icon: 'directions_run', query: 'Suggest a healthy physical active habit workflow' },
];

const LOADING_STEPS = [
  { icon: '✨', text: 'Mapping your Health Universe...' },
  { icon: '🧠', text: 'Exploring relevant Health Constellations...' },
  { icon: '🤖', text: 'Consulting specialist agents...' },
  { icon: '🫀', text: 'Building personalized insights...' },
  { icon: '🌌', text: 'Journey complete.' },
];

// ─── Particle component ──────────────────────────────────────────────────────
function NovaParticles() {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const create = () => {
      const p = document.createElement('div');
      const size = Math.random() * 4 + 2;
      p.style.cssText = `
        position:absolute;width:${size}px;height:${size}px;
        background:#00f0ff;border-radius:50%;pointer-events:none;
        left:${Math.random() * 100}%;top:${Math.random() * 100}%;
        animation:float-particle ${Math.random() * 3 + 3}s linear forwards;
        opacity:${Math.random()};
      `;
      container.appendChild(p);
      setTimeout(() => p.remove(), 6000);
    };
    const id = setInterval(create, 450);
    return () => clearInterval(id);
  }, []);
  return <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden" />;
}

// ─── Welcome Screen ──────────────────────────────────────────────────────────
function WelcomeScreen({ onContinue }: { onContinue: () => void }) {
  const returning = false; // Removed fake randomized returning state
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!orbRef.current) return;
      const x = (window.innerWidth / 2 - e.pageX) / 55;
      const y = (window.innerHeight / 2 - e.pageY) / 55;
      orbRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center overflow-hidden">
      {/* Atmospheric glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-[#00f0ff]/8 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-[#7000ff]/8 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 flex flex-col items-center gap-16 max-w-[600px] w-full">
        {/* Nova Orb */}
        <div className="relative group">
          <NovaParticles />
          <div
            ref={orbRef}
            className="w-44 h-44 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-[#00f0ff] via-[#00dbe9] to-[#006970] animate-orb flex items-center justify-center relative z-20 overflow-hidden"
            style={{ boxShadow: '0 0 80px 20px rgba(0,240,255,0.20), inset 0 0 40px rgba(0,240,255,0.35)' }}
          >
            <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4xNSkiLz48L3N2Zz4=')]" />
            <span className="material-symbols-outlined text-[72px] text-[#00363a] select-none animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          </div>
          {/* Aura rings */}
          <div className="absolute inset-[-18px] border border-[#00f0ff]/20 rounded-full animate-spin-ring pointer-events-none" />
          <div className="absolute inset-[-36px] border border-[#00f0ff]/10 rounded-full animate-spin-ring-r pointer-events-none" />
        </div>

        {/* Text */}
        <div className="space-y-4 px-4">
          <h1 className="text-[32px] md:text-[48px] font-bold leading-tight tracking-tight text-[#dbfcff] text-glow-cyan" style={{ fontFamily: 'var(--font-manrope)' }}>
            Welcome to HealthVerse.
          </h1>
          <p className="text-[18px] text-[#b9cacb] max-w-[480px] mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-inter)' }}>
            Every health journey is a universe waiting to be explored.
          </p>
        </div>

        {/* CTA */}
        <div className="w-full flex flex-col items-center gap-4">
          <button
            id="welcome-continue-btn"
            onClick={onContinue}
            className="btn-ghost w-full md:w-auto md:min-w-[280px] py-4 px-12 rounded-full font-semibold text-[18px] flex items-center justify-center gap-2 group"
            style={{ fontFamily: 'var(--font-manrope)' }}
          >
            Continue
            <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
          </button>
          <p className="text-[12px] text-[#849495] tracking-widest uppercase" style={{ fontFamily: 'var(--font-jetbrains)' }}>
            Synchronizing Bio-Data...
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-4 left-0 w-full flex justify-center z-10 pointer-events-none">
        <div className="flex items-center gap-3 text-[#3b494b]">
          <span className="w-8 h-px bg-[#3b494b]" />
          <span className="text-[11px] tracking-widest uppercase" style={{ fontFamily: 'var(--font-jetbrains)' }}>Encrypted Quantum Link</span>
          <span className="w-8 h-px bg-[#3b494b]" />
        </div>
      </footer>
    </div>
  );
}

// ─── Nova Loading Screen ─────────────────────────────────────────────────────
function NovaLoadingScreen({ onComplete, isLoading }: { onComplete: () => void; isLoading: boolean }) {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const loadingFinishedRef = useRef(false);

  useEffect(() => {
    const delays = [750, 1800, 3000, 4200, 5200];
    const timers = delays.map((d, i) =>
      setTimeout(() => {
        setVisibleSteps(prev => [...prev, i]);
        setActiveStep(i);
        if (i === delays.length - 1) {
          loadingFinishedRef.current = true;
        }
      }, d)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  // Monitor isLoading and loadingFinishedRef to trigger onComplete
  useEffect(() => {
    if (!isLoading && loadingFinishedRef.current) {
      const timer = setTimeout(onComplete, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, onComplete]);

  // Handle case where API finishes early: accelerate step transitions
  useEffect(() => {
    if (!isLoading && !loadingFinishedRef.current) {
      setVisibleSteps([0, 1, 2, 3, 4]);
      setActiveStep(4);
      loadingFinishedRef.current = true;
      const timer = setTimeout(onComplete, 600);
      return () => clearTimeout(timer);
    }
  }, [isLoading, onComplete]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(0,105,112,0.15) 0%, #101415 100%)' }}>
      {/* Header */}
      <header className="h-16 px-6 flex items-center justify-between border-b border-white/10 glass-elevated">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-[#00f0ff]/30">
            <div className="w-full h-full bg-gradient-to-br from-[#00f0ff] to-[#006970] flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px] text-[#00363a]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
            </div>
          </div>
          <div>
            <span className="text-[18px] font-semibold text-[#00f0ff] tracking-tight" style={{ fontFamily: 'var(--font-manrope)' }}>Nova AI</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#00f0ff] rounded-full animate-pulse" style={{ boxShadow: '0 0 8px #00f0ff' }} />
              <span className="text-[10px] text-[#00dbe9] uppercase tracking-widest" style={{ fontFamily: 'var(--font-jetbrains)' }}>Constructing Response</span>
            </div>
          </div>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 transition-colors text-[#b9cacb]">
          <span className="material-symbols-outlined">sensors</span>
        </button>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-[560px] flex flex-col items-center text-center gap-12">
          {/* Orbiting visualizer */}
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* Center core */}
            <div className="w-20 h-20 rounded-full glass-elevated flex items-center justify-center z-10 animate-glow-pulse">
              <span className="material-symbols-outlined text-[#00f0ff] text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            </div>
            {/* Orbiting agents */}
            {[
              { color: '#00f0ff', delay: '0s', duration: '5s', icon: 'psychology' },
              { color: '#7000ff', delay: '-2s', duration: '8s', icon: 'monitor_heart' },
              { color: '#7df4ff', delay: '-4.5s', duration: '11s', icon: 'biotech' },
            ].map((a, i) => (
              <div key={i} className="absolute inset-0 flex items-center justify-center" style={{ animation: `orbit ${a.duration} linear infinite`, animationDelay: a.delay }}>
                <div className="w-10 h-10 rounded-full glass flex items-center justify-center" style={{ border: `1px solid ${a.color}30` }}>
                  <span className="material-symbols-outlined text-[16px]" style={{ color: a.color }}>{a.icon}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Step sequence */}
          <div className="w-full space-y-3">
            {LOADING_STEPS.map((step, i) => (
              <div
                key={i}
                className={`step-reveal flex items-center justify-center gap-3 py-2.5 px-6 rounded-full mx-auto w-fit transition-all duration-300 ${visibleSteps.includes(i) ? 'visible' : ''} ${activeStep === i ? 'bg-[#00f0ff]/10 border border-[#00f0ff]/25 shadow-[0_0_20px_rgba(0,240,255,0.12)]' : 'bg-white/5 border border-white/5'} ${i === LOADING_STEPS.length - 1 ? 'bg-[#00f0ff]/10 border-[#00f0ff]/30' : ''}`}
              >
                <span className="text-xl">{step.icon}</span>
                <span
                  className={`text-[16px] ${i === LOADING_STEPS.length - 1 ? 'text-[#00f0ff] font-semibold' : 'text-[#b9cacb]'}`}
                  style={{ fontFamily: 'var(--font-inter)' }}
                >{step.text}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Disabled input bar */}
      <div className="border-t border-white/10 glass-elevated px-6 py-4">
        <div className="max-w-[800px] mx-auto glass rounded-2xl p-2 pl-4 flex items-center opacity-50 pointer-events-none">
          <div className="flex-1 py-2">
            <div className="h-3 w-32 bg-white/10 rounded-full animate-pulse mb-1.5" />
            <div className="h-2 w-48 bg-white/5 rounded-full animate-pulse" />
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#00f0ff]/15 flex items-center justify-center text-[#00f0ff]/40">
            <span className="material-symbols-outlined">send</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Digital Health Universe (Explore) Screen ────────────────────────────────
interface ExploreScreenProps {
  onAskNova: (query: string) => void;
  messages: Message[];
  inputText: string;
  setInputText: (v: string) => void;
  isLoading: boolean;
  collabSteps: string[];
  activeConstellation: string | null;
  setActiveConstellation: (v: string | null) => void;
  handleSend: (e: React.FormEvent) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  activeTab: string;
  setActiveTab: (v: string) => void;
}

function ExploreScreen({
  onAskNova,
  messages,
  inputText,
  setInputText,
  isLoading,
  collabSteps,
  activeConstellation,
  setActiveConstellation,
  handleSend,
  messagesEndRef,
  activeTab,
  setActiveTab,
}: ExploreScreenProps) {
  const [hoveredOrgan, setHoveredOrgan] = useState<string | null>(null);

  const handleConstellationClick = (name: string, query: string) => {
    setActiveConstellation(name);
    onAskNova(query);
  };

  return (
    <div className="flex flex-col min-h-screen pb-[80px]">
      {/* Top AppBar */}
      <header className="fixed top-0 w-full z-50 h-16 glass-elevated border-b border-white/10">
        <div className="flex justify-between items-center px-6 h-full max-w-[1200px] mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-[#00f0ff]/25 bg-[#1d2022] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#00f0ff] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
            </div>
            <span className="text-[18px] font-semibold text-[#00f0ff] tracking-tight" style={{ fontFamily: 'var(--font-manrope)' }}>HealthVerse</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] text-emerald-400 hidden sm:block" style={{ fontFamily: 'var(--font-jetbrains)' }}>AGENT CORE ONLINE</span>
            </div>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 transition-colors text-[#00f0ff]">
              <span className="material-symbols-outlined">sensors</span>
            </button>
          </div>
        </div>
      </header>

      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-[#00f0ff]/4 rounded-full blur-[120px] animate-ambient" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-[#7000ff]/4 rounded-full blur-[120px] animate-ambient" style={{ animationDelay: '2s' }} />
      </div>

      <main className="relative z-10 max-w-[1200px] mx-auto px-6 pt-20 pb-8 flex-1 flex flex-col gap-6">
        {/* Tab strip for mobile switching between Universe and Chat */}
        <div className="flex gap-1 bg-[#1d2022] rounded-2xl p-1 self-start">
          {['Universe', 'Nova Chat'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 ${activeTab === tab ? 'bg-[#00f0ff]/15 text-[#00f0ff] border border-[#00f0ff]/25' : 'text-[#849495] hover:text-[#b9cacb]'}`}
              style={{ fontFamily: 'var(--font-manrope)' }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-6 flex-1">

          {/* LEFT: Universe / Health Constellations */}
          <section className={`${activeTab === 'Nova Chat' ? 'hidden md:flex' : 'flex'} flex-col gap-6 md:w-[380px] flex-shrink-0`}>
            {/* Interactive body diagram */}
            <div className="glass rounded-3xl p-6">
              <h2 className="font-semibold text-[#e0e3e5] mb-1 flex items-center gap-2" style={{ fontFamily: 'var(--font-manrope)', fontSize: 18 }}>
                <span className="material-symbols-outlined text-[#00f0ff] text-[20px]">biotech</span>
                Digital Health Universe
              </h2>
              <p className="text-[13px] text-[#849495] mb-6" style={{ fontFamily: 'var(--font-inter)' }}>
                Select an organ or constellation to explore with Nova.
              </p>
              {/* SVG Body */}
              <div className="flex justify-center">
                <svg viewBox="0 0 200 400" className="w-full max-w-[220px] h-auto" xmlns="http://www.w3.org/2000/svg">
                  {/* Silhouette */}
                  <path d="M100,20 C80,20 65,35 65,55 C65,70 75,85 100,90 C125,85 135,70 135,55 C135,35 120,20 100,20 M65,95 C40,110 30,150 30,220 L30,350 C30,370 45,385 60,385 L85,385 L85,250 L115,250 L115,385 L140,385 C155,385 170,370 170,350 L170,220 C170,150 160,110 135,95 Z" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="2" />
                  {/* Brain */}
                  <path
                    className={`organ-path ${hoveredOrgan === 'brain' || activeConstellation === 'Cognitive' ? 'active' : ''}`}
                    d="M100,25 C85,25 73,36 73,50 C73,64 85,75 100,75 C115,75 127,64 127,50 C127,36 115,25 100,25"
                    data-organ="brain"
                    onMouseEnter={() => setHoveredOrgan('brain')}
                    onMouseLeave={() => setHoveredOrgan(null)}
                    onClick={() => handleConstellationClick('Cognitive', CONSTELLATIONS[1].query)}
                  />
                  <text textAnchor="middle" x="100" y="52" fill="rgba(176,200,200,0.5)" fontSize="7" fontFamily="JetBrains Mono" pointerEvents="none">BRAIN</text>
                  {/* Lungs */}
                  <path
                    className={`organ-path ${hoveredOrgan === 'lungs' || activeConstellation === 'Respiratory' ? 'active' : ''}`}
                    d="M75,105 C60,105 55,120 55,145 C55,170 65,180 85,180 L95,180 L95,115 L85,115 C80,115 75,110 75,105 M125,105 C140,105 145,120 145,145 C145,170 135,180 115,180 L105,180 L105,115 L115,115 C120,115 125,110 125,105"
                    data-organ="lungs"
                    onMouseEnter={() => setHoveredOrgan('lungs')}
                    onMouseLeave={() => setHoveredOrgan(null)}
                    onClick={() => handleConstellationClick('Respiratory', CONSTELLATIONS[2].query)}
                  />
                  <text textAnchor="middle" x="100" y="148" fill="rgba(176,200,200,0.5)" fontSize="7" fontFamily="JetBrains Mono" pointerEvents="none">LUNGS</text>
                  {/* Heart */}
                  <path
                    className={`organ-path ${hoveredOrgan === 'heart' || activeConstellation === 'Cardiovascular' ? 'active' : ''}`}
                    d="M100,120 C95,120 90,125 90,135 C90,145 95,155 100,160 C105,155 110,145 110,135 C110,125 105,120 100,120"
                    data-organ="heart"
                    onMouseEnter={() => setHoveredOrgan('heart')}
                    onMouseLeave={() => setHoveredOrgan(null)}
                    onClick={() => handleConstellationClick('Cardiovascular', CONSTELLATIONS[0].query)}
                  />
                  <text textAnchor="middle" x="100" y="138" fill="#00f0ff" fontSize="6" fontFamily="JetBrains Mono" pointerEvents="none">HEART</text>
                </svg>
              </div>
            </div>

            {/* Health Constellations grid */}
            <div className="glass rounded-3xl p-6">
              <h2 className="text-[11px] text-[#849495] mb-5 tracking-widest uppercase" style={{ fontFamily: 'var(--font-jetbrains)' }}>
                Health Constellations
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {CONSTELLATIONS.map(c => (
                  <button
                    key={c.name}
                    onClick={() => handleConstellationClick(c.name, c.query)}
                    className={`glass rounded-2xl p-4 flex flex-col items-center text-center gap-2 group cursor-pointer transition-all duration-200 ${activeConstellation === c.name ? 'border-[#00f0ff]/40 bg-[#00f0ff]/8 glow-cyan' : ''}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${activeConstellation === c.name ? 'bg-[#00f0ff]/20' : 'bg-[#00f0ff]/8'}`}>
                      <span className={`material-symbols-outlined text-[18px] ${activeConstellation === c.name ? 'text-[#00f0ff]' : 'text-[#00dbe9]'}`}>{c.icon}</span>
                    </div>
                    <span className="text-[13px] font-medium text-[#e0e3e5]" style={{ fontFamily: 'var(--font-manrope)' }}>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* RIGHT: Nova Chat */}
          <section className={`${activeTab === 'Universe' ? 'hidden md:flex' : 'flex'} flex-1 flex-col glass rounded-3xl overflow-hidden`}>
            {/* Chat header */}
            <div className="p-5 border-b border-white/8 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-[#1d2022] border border-[#00f0ff]/25 flex items-center justify-center text-lg">🤖</div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#101415]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#e0e3e5] text-[14px]" style={{ fontFamily: 'var(--font-manrope)' }}>Nova</h3>
                  <p className="text-[11px] text-[#849495]" style={{ fontFamily: 'var(--font-jetbrains)' }}>Orchestrator Agent</p>
                </div>
              </div>
              {/* Agent tags */}
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="text-[10px] text-[#849495] uppercase mr-1" style={{ fontFamily: 'var(--font-jetbrains)' }}>Agents:</span>
                {['Nova', 'Guardian', 'Insight', 'Pulse', 'Vita'].map(agent => {
                  const active = messages[messages.length - 1]?.agentsConsulted?.includes(agent);
                  return (
                    <span key={agent} className={`text-[9px] px-2 py-0.5 rounded-full border transition-all duration-300 ${active ? 'bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/30 font-semibold' : 'text-[#849495] border-[#3b494b]'}`} style={{ fontFamily: 'var(--font-jetbrains)' }}>
                      {agent}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-[300px]">
              {messages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed ${msg.sender === 'user'
                    ? 'bg-[#00f0ff]/12 border border-[#00f0ff]/20 text-[#e0e3e5] rounded-tr-none'
                    : 'bg-[#1d2022] border border-white/8 text-[#e0e3e5] rounded-tl-none'}`}
                  >
                    <p className="whitespace-pre-line" style={{ fontFamily: 'var(--font-inter)' }}>{msg.text}</p>
                    {msg.logs && msg.logs.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/8">
                        <details className="cursor-pointer group">
                          <summary className="text-[10px] text-[#849495] select-none group-hover:text-[#e0e3e5] transition-colors" style={{ fontFamily: 'var(--font-jetbrains)' }}>
                            View Multi-Agent Coordination Steps
                          </summary>
                          <div className="mt-2 space-y-1 pl-2 border-l border-[#00f0ff]/20 text-[11px] text-[#849495]">
                            {msg.logs.map((log, idx) => (
                              <div key={idx} className="flex items-center justify-between py-0.5">
                                <span className="font-semibold text-[#b9cacb]" style={{ fontFamily: 'var(--font-jetbrains)' }}>[{log.agent}]</span>
                                <span className="flex-1 mx-2 overflow-hidden text-ellipsis whitespace-nowrap">{log.action}</span>
                                <span className="text-[#00f0ff] font-mono text-[9px] uppercase">{log.status}</span>
                              </div>
                            ))}
                          </div>
                        </details>
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-[#3b494b] mt-1 px-1" style={{ fontFamily: 'var(--font-jetbrains)' }}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}

              {/* Collaborative loading */}
              {isLoading && (
                <div className="flex flex-col items-start">
                  <div className="bg-[#1d2022] border border-[#00f0ff]/15 text-[#e0e3e5] rounded-2xl rounded-tl-none px-4 py-3 text-[14px] w-full max-w-[85%] space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f0ff] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00f0ff]" />
                      </span>
                      <span className="text-[12px] font-semibold text-[#b9cacb] animate-pulse" style={{ fontFamily: 'var(--font-manrope)' }}>Orchestrating agents...</span>
                    </div>
                    <div className="space-y-1.5 pl-2 border-l border-[#00f0ff]/20 text-[11px]">
                      {collabSteps.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[#00f0ff]/80 font-medium" style={{ fontFamily: 'var(--font-jetbrains)' }}>
                          <span>✓</span><span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-white/8 flex gap-2 flex-shrink-0">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Ask Nova about your health..."
                className="flex-1 bg-[#1d2022] border border-[#3b494b] focus:border-[#00f0ff] rounded-xl px-4 py-3 text-[14px] text-[#e0e3e5] focus:outline-none focus:ring-1 focus:ring-[#00f0ff]/40 transition-all placeholder-[#849495]"
                disabled={isLoading}
                style={{ fontFamily: 'var(--font-inter)' }}
              />
              <button
                type="submit"
                id="send-btn"
                disabled={isLoading || !inputText.trim()}
                className="btn-primary rounded-xl px-5 py-3 font-semibold text-[14px] flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none"
                style={{ fontFamily: 'var(--font-manrope)' }}
              >
                <span>Ask</span>
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              </button>
            </form>
          </section>
        </div>
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 w-full z-50 h-[72px] glass-elevated border-t border-white/10">
        <div className="flex justify-around items-center h-full px-4 max-w-[1200px] mx-auto">
          {[
            { label: 'Explore', icon: 'auto_awesome', tab: 'Universe' },
            { label: 'Vitals', icon: 'monitor_heart', tab: 'Universe' },
            { label: 'Nova', icon: 'chat_bubble', tab: 'Nova Chat' },
            { label: 'Archive', icon: 'folder_special', tab: 'Universe' },
          ].map(item => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.tab)}
              className={`flex flex-col items-center justify-center px-3 py-1 gap-1 transition-all duration-200 ${activeTab === item.tab && item.label !== 'Archive' && item.label !== 'Vitals' ? 'nav-active' : 'text-[#849495] hover:text-[#b9cacb]'}`}
            >
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: item.tab === 'Nova Chat' && activeTab === 'Nova Chat' ? "'FILL' 1" : "'FILL' 0" }}>{item.icon}</span>
              <span className="text-[10px]" style={{ fontFamily: 'var(--font-jetbrains)' }}>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Safety disclaimer */}
      <div className="fixed bottom-[72px] left-0 w-full z-40 px-4 pointer-events-none">
        <div className="max-w-[800px] mx-auto" />
      </div>
    </div>
  );
}

// ─── Health Summary Insights Screen ─────────────────────────────────────────
interface InsightsScreenProps {
  onContinue: () => void;
  lastResponse: ChatResponse | null;
}

function InsightsScreen({ onContinue, lastResponse }: InsightsScreenProps) {
  // Generate tags based on activated agents and tools
  const exploredTags = [];
  if (lastResponse) {
    lastResponse.activated_agents.forEach(agent => {
      if (agent === 'Guardian') exploredTags.push('Safety Scan');
      if (agent === 'Insight') exploredTags.push('Physiology');
      if (agent === 'Pulse') exploredTags.push('Risk Analysis');
      if (agent === 'Vita') exploredTags.push('Lifestyle Coaching');
    });
    lastResponse.mcp_calls.forEach(call => {
      exploredTags.push(`Live Sync: ${call.query}`);
    });
  }
  if (exploredTags.length === 0) {
    exploredTags.push('General Wellness', 'Systems Health');
  }

  // Generate recommendations based on active agents
  const suggestions = [];
  if (lastResponse) {
    const agents = lastResponse.activated_agents;
    if (agents.includes('Vita')) {
      suggestions.push({
        icon: 'self_improvement',
        title: 'Habit Progression',
        desc: 'Implement the incremental lifestyle adjustments and coaching routines detailed by Vita.',
        color: '#d2d8f8'
      });
    }
    if (agents.includes('Pulse')) {
      suggestions.push({
        icon: 'monitor_heart',
        title: 'Vitals Baselining',
        desc: 'Review Pulse\'s preventative markers and consider tracking heart metrics during routines.',
        color: '#00f0ff'
      });
    }
    if (agents.includes('Insight')) {
      suggestions.push({
        icon: 'menu_book',
        title: 'Anatomy & Physiology',
        desc: 'Explore Insight\'s explanation of how your body\'s homeostatic drive balances physical loads.',
        color: '#7df4ff'
      });
    }
  }
  if (suggestions.length === 0) {
    suggestions.push(
      { icon: 'self_improvement', title: 'Daily Habitation', desc: 'Try pausing for three deep breaths when daily stress levels rise.', color: '#d2d8f8' },
      { icon: 'water_drop', title: 'Hydration Balance', desc: 'Drink a glass of water before physical exercises to optimize cellular flow.', color: '#00f0ff' }
    );
  }

  // Set up critical notification depending on safety or risk
  let alertStyle = "bg-[#00f0ff]/5 border border-[#00f0ff]/15";
  let alertTitleColor = "text-[#7df4ff]";
  let alertTextColor = "text-[#b9cacb]";
  let alertIconColor = "text-[#00f0ff]";
  let alertIcon = "info";
  let alertTitle = "Daily Guidance Info";
  let alertDesc = "Consistent sleep cycles and balanced post-activity nutrition form the foundation of cardiovascular resilience.";
  let alertButtonText = "Log Vitals";
  let alertButtonIcon = "edit_note";
  let alertButtonClass = "bg-[#00f0ff]/20 text-[#00f0ff] hover:bg-[#00f0ff]/30";
  let isAlertBreathe = false;

  if (lastResponse) {
    const replyLower = lastResponse.reply.toLowerCase();
    const isEmergency = replyLower.includes("emergency") || replyLower.includes("911") || replyLower.includes("urgent");
    if (isEmergency) {
      alertStyle = "bg-[#93000a]/15 border border-[#ffb4ab]/20";
      alertTitleColor = "text-[#ffdad6]";
      alertTextColor = "text-[#ffdad6]/80";
      alertIconColor = "text-[#ffb4ab]";
      alertIcon = "warning";
      alertTitle = "Critical Warning";
      alertDesc = "The safety supervisor identified elevated risk factors. Please seek professional medical support immediately.";
      alertButtonText = "Seek Emergency Help";
      alertButtonIcon = "call";
      alertButtonClass = "bg-[#93000a]/60 text-[#ffdad6] hover:bg-[#93000a]/80";
      isAlertBreathe = true;
    } else if (lastResponse.activated_agents.includes('Pulse')) {
      alertStyle = "bg-[#00f0ff]/8 border border-[#00f0ff]/25";
      alertTitle = "Biometric Alert";
      alertDesc = "Risk trends are influenced by hydration, sleep and heart recoverability. Check Pulse's warnings about cardiac strain.";
      alertButtonText = "Track Bio-Status";
      alertButtonIcon = "monitor_heart";
      alertButtonClass = "bg-[#00f0ff]/25 text-[#dbfcff] hover:bg-[#00f0ff]/35";
    }
  }

  return (
    <div className="min-h-screen pb-[120px] pt-[80px]">
      {/* Top bar */}
      <header className="fixed top-0 w-full z-50 h-16 glass-elevated border-b border-white/10">
        <div className="flex justify-between items-center px-6 h-full max-w-[1200px] mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-[#00f0ff]/35 flex items-center justify-center bg-[#1d2022]">
              <span className="material-symbols-outlined text-[#00f0ff] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
            </div>
            <span className="text-[18px] font-semibold text-[#00f0ff] tracking-tight" style={{ fontFamily: 'var(--font-manrope)' }}>HealthVerse</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#7df4ff] cursor-pointer hover:bg-white/5 p-2 rounded-full transition-colors">sensors</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 relative overflow-hidden">
        {/* Ambient blobs */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-[#00f0ff]/4 rounded-full blur-[120px] animate-ambient" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-[#7000ff]/4 rounded-full blur-[120px] animate-ambient" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10">
          {/* Hero header */}
          <section className="mt-8 mb-16 flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0">
              <div className="absolute inset-0 bg-[#00f0ff] blur-3xl opacity-15 animate-pulse rounded-full" />
              <div className="w-full h-full rounded-full border-2 border-[#00f0ff]/35 p-1">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#1d2022] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#00f0ff] text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                </div>
              </div>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-[32px] md:text-[48px] font-bold leading-tight tracking-tight text-[#e0e3e5] mb-3" style={{ fontFamily: 'var(--font-manrope)' }}>
                Analysis Complete.
              </h1>
              <p className="text-[#b9cacb] max-w-xl text-[16px] leading-relaxed" style={{ fontFamily: 'var(--font-inter)' }}>
                Nova has synthesized the analysis of your physiological systems. Here is your customized health breakdown.
              </p>
            </div>
          </section>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* What we explored */}
            <div className="md:col-span-4 glass rounded-3xl p-7 flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#00f0ff]">hub</span>
                <h2 className="font-semibold text-[#e0e3e5] text-[18px]" style={{ fontFamily: 'var(--font-manrope)' }}>What We Explored</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {exploredTags.map(tag => (
                  <span key={tag} className="px-3 py-1.5 bg-[#00f0ff]/8 border border-[#00f0ff]/18 rounded-full text-[11px] text-[#00f0ff]" style={{ fontFamily: 'var(--font-jetbrains)' }}>{tag}</span>
                ))}
              </div>
              <div className="mt-auto pt-4 border-t border-white/5">
                <p className="text-[10px] text-[#849495] uppercase tracking-widest" style={{ fontFamily: 'var(--font-jetbrains)' }}>Metadata Context</p>
                <div className="flex items-center gap-2 mt-2 text-[#b9cacb]">
                  <span className="material-symbols-outlined text-[16px]">history</span>
                  <span className="text-[14px]">Active Collaboration Nodes</span>
                </div>
              </div>
            </div>

            {/* Core Insights */}
            <div className="md:col-span-8 glass rounded-3xl p-7 glow-cyan flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-7">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#00f0ff]">insights</span>
                    <h2 className="font-semibold text-[#e0e3e5] text-[18px]" style={{ fontFamily: 'var(--font-manrope)' }}>Core Insights</h2>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
                    <span className="text-[11px] text-[#7df4ff]" style={{ fontFamily: 'var(--font-jetbrains)' }}>
                      {lastResponse && lastResponse.mcp_calls.length > 0 ? 'Live Data Sync' : 'Offline Model Engine'}
                    </span>
                  </div>
                </div>
                <div className="text-[#b9cacb] text-[14px] leading-relaxed whitespace-pre-line overflow-y-auto max-h-[220px] pr-2" style={{ fontFamily: 'var(--font-inter)' }}>
                  {lastResponse?.reply || "No insights have been loaded. Please try sending a message first."}
                </div>
              </div>
              
              {/* Live data row */}
              <div className="mt-6 flex items-center gap-4 p-4 bg-[#191c1e]/50 rounded-2xl border border-white/5">
                <div className="flex -space-x-2">
                  {lastResponse && lastResponse.mcp_calls.length > 0 ? (
                    lastResponse.mcp_calls.map((call, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-[#00f0ff]/12 border border-[#101415] flex items-center justify-center" title={`${call.tool}: ${call.query}`}>
                        <span className="material-symbols-outlined text-[14px] text-[#00f0ff]">
                          {call.tool === 'web_search' ? 'search' : 'menu_book'}
                        </span>
                      </div>
                    ))
                  ) : (
                    ['monitor_heart', 'blood_pressure'].map(icon => (
                      <div key={icon} className="w-8 h-8 rounded-full bg-[#00f0ff]/12 border border-[#101415] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[14px] text-[#00f0ff]">{icon}</span>
                      </div>
                    ))
                  )}
                </div>
                <p className="text-[13px] text-[#b9cacb]" style={{ fontFamily: 'var(--font-inter)' }}>
                  {lastResponse && lastResponse.mcp_calls.length > 0 
                    ? `Retrieved live summaries utilizing ${lastResponse.mcp_calls.length} dynamic MCP tool calls.`
                    : 'Generated using HealthVerse offline multi-agent knowledge systems.'}
                </p>
              </div>
            </div>

            {/* Wellness Suggestions */}
            <div className="md:col-span-7 glass rounded-3xl p-7">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-[#00f0ff]">auto_awesome</span>
                <h2 className="font-semibold text-[#e0e3e5] text-[18px]" style={{ fontFamily: 'var(--font-manrope)' }}>Wellness Suggestions</h2>
              </div>
              <div className="space-y-3">
                {suggestions.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 hover:bg-white/4 rounded-2xl transition-colors cursor-pointer group">
                    <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-[#00f0ff]/8 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined" style={{ color: item.color }}>{item.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#e0e3e5] mb-1 text-[14px]" style={{ fontFamily: 'var(--font-manrope)' }}>{item.title}</h4>
                      <p className="text-[#b9cacb] text-[13px]" style={{ fontFamily: 'var(--font-inter)' }}>{item.desc}</p>
                    </div>
                    <span className="material-symbols-outlined text-[#849495] group-hover:text-[#00f0ff] transition-colors">chevron_right</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Critical Alert */}
            <div className={`md:col-span-5 rounded-3xl p-7 flex flex-col justify-between ${alertStyle} ${isAlertBreathe ? 'animate-breathe' : ''}`}>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`material-symbols-outlined ${alertIconColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>{alertIcon}</span>
                  <h2 className={`font-semibold text-[18px] ${alertTitleColor}`} style={{ fontFamily: 'var(--font-manrope)' }}>{alertTitle}</h2>
                </div>
                <p className={`${alertTextColor} mb-6 text-[14px] leading-relaxed`} style={{ fontFamily: 'var(--font-inter)' }}>
                  {alertDesc}
                </p>
              </div>
              <button className={`w-full py-4 rounded-2xl font-semibold transition-colors flex items-center justify-center gap-2 ${alertButtonClass}`} style={{ fontFamily: 'var(--font-manrope)' }}>
                <span className="material-symbols-outlined">{alertButtonIcon}</span>
                {alertButtonText}
              </button>
            </div>
          </div>


          {/* CTA */}
          <div className="mt-16 flex flex-col items-center gap-5">
            <button
              onClick={onContinue}
              className="btn-primary group relative px-10 py-5 rounded-full font-bold text-[16px] flex items-center gap-3"
              style={{ fontFamily: 'var(--font-manrope)' }}
            >
              Continue Exploring
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
            </button>
            <p className="text-[#849495] text-[11px] uppercase tracking-widest" style={{ fontFamily: 'var(--font-jetbrains)' }}>Swipe up for deep dive data</p>
          </div>
        </div>
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 w-full z-50 h-[72px] glass-elevated border-t border-white/10">
        <div className="flex justify-around items-center h-full px-4 max-w-[1200px] mx-auto">
          {[
            { label: 'Explore', icon: 'auto_awesome' },
            { label: 'Vitals', icon: 'monitor_heart' },
            { label: 'Nova', icon: 'chat_bubble' },
            { label: 'Archive', icon: 'folder_special' },
          ].map(item => (
            <button
              key={item.label}
              onClick={item.label === 'Explore' || item.label === 'Nova' ? onContinue : undefined}
              className={`flex flex-col items-center justify-center px-3 py-1 gap-1 transition-all duration-200 ${item.label === 'Vitals' ? 'nav-active' : 'text-[#849495] hover:text-[#b9cacb]'}`}
            >
              <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
              <span className="text-[10px]" style={{ fontFamily: 'var(--font-jetbrains)' }}>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

// ─── Root Component ───────────────────────────────────────────────────────────
export default function Home() {
  const [view, setView] = useState<View>('welcome');
  const [activeTab, setActiveTab] = useState('Universe');
  const [userId] = useState(() => `user_${Math.random().toString(36).substring(2, 9)}`);
  const [lastResponse, setLastResponse] = useState<ChatResponse | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Welcome to HealthVerse! I'm Nova, your AI health companion. Select a health constellation on the left, tap an organ on the body diagram, or type your wellness question below.",
      timestamp: new Date(),
      agentsConsulted: ['Nova'],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeConstellation, setActiveConstellation] = useState<string | null>(null);
  const [collabSteps, setCollabSteps] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, collabSteps]);

  const handleSend = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userText = inputText.trim();
    setInputText('');

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setView('loading');
    setCollabSteps([]);

    // Keyword-based constellation auto-select
    if (/heart|cardio|pulse|run|bp|beat/.test(userText.toLowerCase())) setActiveConstellation('Cardiovascular');
    else if (/sleep|recover|rest|stress/.test(userText.toLowerCase())) setActiveConstellation('Recovery');
    else if (/brain|think|memory|focus|cognitive/.test(userText.toLowerCase())) setActiveConstellation('Cognitive');
    else if (/breath|lung|respir|oxygen/.test(userText.toLowerCase())) setActiveConstellation('Respiratory');
    else if (/eat|diet|food|nutri/.test(userText.toLowerCase())) setActiveConstellation('Nutrition');
    else if (/move|train|muscl|fit/.test(userText.toLowerCase())) setActiveConstellation('Movement');

    const steps = [
      'Mapping your Health Universe...',
      'Exploring relevant Health Constellations...',
      'Consulting specialist agents (Guardian, Insight)...',
      'Synthesizing personalized insights...',
      'Journey complete.',
    ];

    let stepIdx = 0;
    const stepInterval = setInterval(() => {
      if (stepIdx < steps.length) {
        setCollabSteps(prev => [...prev, steps[stepIdx]]);
        stepIdx++;
      } else {
        clearInterval(stepInterval);
      }
    }, 800);

    try {
      const result: ChatResponse = await sendChatMessage(userId, userText);
      clearInterval(stepInterval);
      setCollabSteps(steps);

      setTimeout(() => {
        setLastResponse(result);
        setMessages(prev => [...prev, {
          id: Math.random().toString(),
          sender: 'assistant',
          text: result.reply,
          timestamp: new Date(),
          agentsConsulted: result.activated_agents,
          logs: result.collaboration_logs,
        }]);
        setIsLoading(false);
        setCollabSteps([]);
        setView('insights');
      }, 700);

    } catch (err: unknown) {
      clearInterval(stepInterval);
      setIsLoading(false);
      setCollabSteps([]);
      const errMsg = err instanceof Error ? err.message : 'Unknown error';
      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        sender: 'assistant',
        text: `Error: Unable to connect to Nova's Core. Make sure the backend is running at http://localhost:8000. Detail: ${errMsg}`,
        timestamp: new Date(),
      }]);
      setView('explore');
    }
  }, [inputText, isLoading, userId]);

  const handleAskNova = useCallback((query: string) => {
    setInputText(query);
    setActiveTab('Nova Chat');
  }, []);

  // Inject Material Symbols font
  useEffect(() => {
    if (document.querySelector('link[data-msf]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.setAttribute('data-msf', '1');
    link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200';
    document.head.appendChild(link);
  }, []);

  return (
    <>
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          font-family: 'Material Symbols Outlined';
        }
      `}</style>

      {view === 'welcome' && (
        <WelcomeScreen onContinue={() => setView('explore')} />
      )}

      {view === 'loading' && (
        <NovaLoadingScreen onComplete={() => setView('insights')} isLoading={isLoading} />
      )}

      {view === 'explore' && (
        <ExploreScreen
          onAskNova={handleAskNova}
          messages={messages}
          inputText={inputText}
          setInputText={setInputText}
          isLoading={isLoading}
          collabSteps={collabSteps}
          activeConstellation={activeConstellation}
          setActiveConstellation={setActiveConstellation}
          handleSend={handleSend}
          messagesEndRef={messagesEndRef}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}

      {view === 'insights' && (
        <InsightsScreen onContinue={() => setView('explore')} lastResponse={lastResponse} />
      )}
    </>
  );
}
