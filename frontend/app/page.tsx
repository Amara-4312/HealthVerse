'use client';

import React, { useState, useEffect, useRef } from 'react';
import { sendChatMessage, ChatResponse, CollaborationStep } from '../lib/api';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  agentsConsulted?: string[];
  logs?: CollaborationStep[];
}

export default function Home() {
  const [userId] = useState(() => `user_${Math.random().toString(36).substring(2, 9)}`);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Welcome back to HealthVerse! I'm Nova, your health companion. Today we are ready to explore your Health Universe. Select a constellation on the left to investigate, or type your wellness questions below.",
      timestamp: new Date(),
      agentsConsulted: ['Nova'],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeConstellation, setActiveConstellation] = useState<string | null>(null);
  
  // Real-time animation steps for multi-agent collaboration
  const [collabSteps, setCollabSteps] = useState<string[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, collabSteps]);

  // Handle preset constellation exploration click
  const handleConstellationClick = (name: string, description: string, queryPreset: string) => {
    setActiveConstellation(name);
    setInputText(queryPreset);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userText = inputText.trim();
    setInputText('');

    // Add user message
    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Auto-select constellation based on keywords for the visual highlight
    if (userText.toLowerCase().match(/(heart|cardio|pulse|run|bp|beat)/)) {
      setActiveConstellation('Cardiovascular');
    } else if (userText.toLowerCase().match(/(sleep|recover|rest|stress)/)) {
      setActiveConstellation('Recovery');
    } else if (userText.toLowerCase().match(/(brain|think|memory|focus|cognitive)/)) {
      setActiveConstellation('Cognitive');
    } else if (userText.toLowerCase().match(/(breath|lung|respir|oxygen)/)) {
      setActiveConstellation('Respiratory');
    } else if (userText.toLowerCase().match(/(eat|diet|food|nutri)/)) {
      setActiveConstellation('Nutrition');
    } else if (userText.toLowerCase().match(/(move|train|muscl|fit)/)) {
      setActiveConstellation('Movement');
    }

    // Set up step-by-step collaborative loader animation
    const steps = [
      'Mapping your Health Universe...',
      'Exploring relevant Health Constellations...',
      'Consulting specialist agents (Guardian, Insight)...',
      'Synthesizing personalized insights...',
      'Journey complete.'
    ];
    setCollabSteps([]);
    setCurrentStepIndex(0);

    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prevIndex) => {
        if (prevIndex < steps.length - 1) {
          setCollabSteps((prevSteps) => [...prevSteps, steps[prevIndex]]);
          return prevIndex + 1;
        } else {
          clearInterval(stepInterval);
          return prevIndex;
        }
      });
    }, 800);

    try {
      const result: ChatResponse = await sendChatMessage(userId, userText);
      
      // Stop the timer and fill in all steps
      clearInterval(stepInterval);
      setCollabSteps(steps);
      setCurrentStepIndex(steps.length);

      // Add a slight delay for smooth transition
      setTimeout(() => {
        const assistantMsg: Message = {
          id: Math.random().toString(),
          sender: 'assistant',
          text: result.response,
          timestamp: new Date(),
          agentsConsulted: result.agents_consulted,
          logs: result.collaboration_logs,
        };

        setMessages((prev) => [...prev, assistantMsg]);
        setIsLoading(false);
        setCollabSteps([]);
        setCurrentStepIndex(-1);
      }, 600);

    } catch (err: any) {
      clearInterval(stepInterval);
      setCollabSteps([]);
      setCurrentStepIndex(-1);
      setIsLoading(false);

      const errorMsg: Message = {
        id: Math.random().toString(),
        sender: 'assistant',
        text: `Error: Unable to connect to Nova's Core. Make sure the backend is running at http://localhost:8000. Detail: ${err.message}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  const constellations = [
    { name: 'Cognitive', icon: '🧠', color: 'cyan', query: 'Tell me about cognitive focus and mental fatigue' },
    { name: 'Cardiovascular', icon: '🫀', color: 'cyan', query: 'What happens to the heart when running?' },
    { name: 'Respiratory', icon: '🫁', color: 'cyan', query: 'How does oxygen intake affect energy levels?' },
    { name: 'Recovery', icon: '💤', color: 'cyan', query: 'Why is sleep hygiene essential for recovery?' },
    { name: 'Nutrition', icon: '🥗', color: 'cyan', query: 'How do macronutrients affect general metabolism?' },
    { name: 'Movement', icon: '🏃‍♂️', color: 'cyan', query: 'Suggest a healthy physical active habit workflow' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#060913] text-[#f8fafc]">
      {/* Header */}
      <header className="border-b border-[rgba(34,211,238,0.15)] bg-slate-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#22d3ee] to-[#06b6d4] flex items-center justify-center text-xl font-bold text-[#060913] shadow-[0_0_15px_rgba(34,211,238,0.4)]">
            H
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-wide text-glow text-white">Health<span className="text-[#22d3ee]">Verse</span></h1>
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Multi-Agent AI Companion</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-medium text-emerald-400">Agent Core Online</span>
        </div>
      </header>

      {/* Main Body Layout */}
      <main className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 md:p-6 gap-6 overflow-hidden">
        
        {/* Left Side: Universe Constellation Interactive Map */}
        <section className="flex-1 flex flex-col glass-panel rounded-2xl p-6 relative overflow-hidden min-h-[350px] md:min-h-0 md:max-w-md">
          {/* Subtle Ambient Glow Backgrounds */}
          <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-cyan-glow opacity-30 filter blur-3xl"></div>
          <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-cyan-glow opacity-25 filter blur-3xl"></div>

          <h2 className="text-lg font-medium text-white tracking-wide mb-2 flex items-center gap-2">
            <span>🌌</span> Digital Health Universe
          </h2>
          <p className="text-xs text-zinc-400 mb-6">
            Tap a Constellation to direct the focus of your companion. When a question relates to a body system, that region glows.
          </p>

          {/* Graphical/Interactive Universe Layout */}
          <div className="flex-1 flex items-center justify-center relative min-h-[250px]">
            {/* Background stars effect */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-cyan-glow)_0%,_transparent_75%)] opacity-35"></div>

            {/* Glowing Center Core */}
            <div className="relative w-28 h-28 rounded-full bg-slate-900 border-2 border-[rgba(34,211,238,0.3)] flex items-center justify-center z-10 shadow-[0_0_30px_rgba(34,211,238,0.15)]">
              <div className="absolute inset-2 rounded-full border border-dashed border-[rgba(34,211,238,0.25)] animate-spin" style={{ animationDuration: '20s' }}></div>
              <div className="text-center">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Companion</span>
                <span className="text-sm font-semibold text-white tracking-wider">NOVA CORE</span>
              </div>
            </div>

            {/* Orbit paths */}
            <div className="absolute w-[200px] h-[200px] rounded-full border border-dashed border-cyan-800/10"></div>
            <div className="absolute w-[280px] h-[280px] rounded-full border border-cyan-800/5"></div>

            {/* Floating Constellation Nodes */}
            {constellations.map((c, i) => {
              const angles = [0, 60, 120, 180, 240, 300];
              const angle = angles[i];
              const radius = 100; // px
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;

              const isActive = activeConstellation === c.name;

              return (
                <button
                  key={c.name}
                  onClick={() => handleConstellationClick(c.name, `Exploring the ${c.name} constellation`, c.query)}
                  style={{ transform: `translate(${x}px, ${y}px)` }}
                  className={`absolute z-20 h-12 w-12 rounded-full flex flex-col items-center justify-center transition-all duration-500 cursor-pointer group ${
                    isActive
                      ? 'bg-[#22d3ee] text-[#060913] scale-110 shadow-[0_0_20px_#22d3ee]'
                      : 'bg-slate-950 border border-[rgba(34,211,238,0.25)] hover:border-[#22d3ee] hover:scale-105 hover:shadow-[0_0_12px_rgba(34,211,238,0.4)] text-zinc-300'
                  }`}
                >
                  <span className="text-lg">{c.icon}</span>
                  <span className={`absolute -bottom-6 text-[9px] font-medium tracking-wide whitespace-nowrap px-1.5 py-0.5 rounded transition-all duration-300 ${
                    isActive ? 'text-[#22d3ee] font-semibold bg-slate-950/70' : 'text-zinc-500 group-hover:text-zinc-300'
                  }`}>
                    {c.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 border-t border-[rgba(34,211,238,0.1)] pt-4">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-2">Active Orbiting Context</span>
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${activeConstellation ? 'bg-[#22d3ee] animate-pulse' : 'bg-zinc-600'}`}></span>
              <span className="text-xs font-semibold text-slate-300">
                {activeConstellation ? `${activeConstellation} Constellation Locked` : 'No visual filter active. Interactive mode.'}
              </span>
            </div>
          </div>
        </section>

        {/* Right Side: Chat Console */}
        <section className="flex-[2] flex flex-col glass-panel rounded-2xl p-4 md:p-6 overflow-hidden relative">
          {/* Active companion status bar */}
          <div className="flex items-center justify-between border-b border-[rgba(34,211,238,0.1)] pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-slate-900 border border-[rgba(34,211,238,0.3)] flex items-center justify-center text-lg">
                  🤖
                </div>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-[#060913]"></span>
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Nova</h3>
                <p className="text-xs text-zinc-400">Orchestrator Agent</p>
              </div>
            </div>
            
            {/* Show agents active in last message */}
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-[10px] text-zinc-500 uppercase mr-1">Active Agents:</span>
              <div className="flex gap-1">
                {['Nova', 'Guardian', 'Insight', 'Pulse', 'Vita'].map((agentName) => {
                  const isConsulted = messages[messages.length - 1]?.agentsConsulted?.includes(agentName) || false;
                  return (
                    <span
                      key={agentName}
                      className={`text-[9px] px-2 py-0.5 rounded-full border transition-all duration-300 ${
                        isConsulted
                          ? 'bg-cyan-950/40 text-[#22d3ee] border-[#22d3ee]/30 font-semibold'
                          : 'bg-transparent text-zinc-600 border-zinc-800'
                      }`}
                    >
                      {agentName}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 min-h-[300px] max-h-[500px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-[#22d3ee]/20 to-[#06b6d4]/10 text-white border border-[rgba(34,211,238,0.25)] rounded-tr-none'
                      : 'bg-slate-900/80 border border-slate-800 text-slate-100 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Multi-Agent logs list */}
                  {msg.logs && msg.logs.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-800">
                      <details className="cursor-pointer group">
                        <summary className="text-[10px] text-zinc-400 select-none group-hover:text-white transition-colors duration-200">
                          View Multi-Agent Coordination Steps
                        </summary>
                        <div className="mt-2 space-y-1.5 pl-2 border-l border-cyan-800/40 text-[11px] text-zinc-400">
                          {msg.logs.map((log, idx) => (
                            <div key={idx} className="flex items-center justify-between py-0.5">
                              <span className="font-semibold text-slate-300">[{log.agent}]</span>
                              <span className="flex-1 mx-2 overflow-hidden text-ellipsis whitespace-nowrap text-zinc-500">
                                {log.action}
                              </span>
                              <span className="text-[#22d3ee] font-mono text-[9px] uppercase">{log.status}</span>
                            </div>
                          ))}
                        </div>
                      </details>
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-zinc-600 mt-1 px-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}

            {/* Stepper Collaborative Loader */}
            {isLoading && (
              <div className="flex flex-col items-start">
                <div className="bg-slate-900/80 border border-cyan-800/20 text-slate-100 rounded-2xl rounded-tl-none px-4 py-3 text-sm w-full max-w-[85%] space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#22d3ee]"></span>
                    </span>
                    <span className="text-xs font-semibold text-slate-300 animate-pulse">Orchestrating agents...</span>
                  </div>
                  
                  <div className="space-y-1.5 pl-2 border-l border-cyan-900 text-[11px] text-zinc-400">
                    {collabSteps.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[#22d3ee]/80 font-medium">
                        <span>✓</span>
                        <span>{step}</span>
                      </div>
                    ))}
                    {currentStepIndex >= 0 && currentStepIndex < 5 && (
                      <div className="flex items-center gap-1.5 text-zinc-500 animate-pulse">
                        <span>●</span>
                        <span>Mapping {['Nova Core', 'Constellations', 'Specialist Inputs', 'Personalized insights'][currentStepIndex] || 'processing'}...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form Input Area */}
          <form onSubmit={handleSend} className="mt-4 pt-4 border-t border-[rgba(34,211,238,0.1)] flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Nova about your heart, sleep patterns, lifestyle habits..."
              className="flex-1 bg-slate-950 border border-[rgba(34,211,238,0.2)] focus:border-[#22d3ee] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#22d3ee] transition-all placeholder-zinc-600"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="bg-gradient-to-r from-[#22d3ee] to-[#06b6d4] hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed text-[#060913] font-semibold text-sm px-5 py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] flex items-center justify-center gap-1.5"
            >
              <span>Send</span>
              <span>✦</span>
            </button>
          </form>
        </section>
      </main>

      {/* Safety Disclaimer Footer */}
      <footer className="mt-auto border-t border-[rgba(34,211,238,0.1)] bg-slate-950/50 py-4 px-6 text-center z-10">
        <p className="text-[10px] text-zinc-500 max-w-2xl mx-auto leading-relaxed">
          🚨 HealthVerse Safety Redirection: This platform does not diagnose, prescribe, or replace professional healthcare. 
          If you are experiencing a medical emergency, chest pain, or respiratory distress, please consult a physician or contact emergency services immediately.
        </p>
      </footer>
    </div>
  );
}
