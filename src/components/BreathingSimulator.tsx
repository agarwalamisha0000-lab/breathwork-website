import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Volume2, VolumeX, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';

interface BreathingSimulatorProps {
  onBookCall: () => void;
}

export default function BreathingSimulator({ onBookCall }: BreathingSimulatorProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [timeLeft, setTimeLeft] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const osc3Ref = useRef<OscillatorNode | null>(null);
  const osc4Ref = useRef<OscillatorNode | null>(null);
  const lfoRef = useRef<OscillatorNode | null>(null);
  const mainGainRef = useRef<GainNode | null>(null);
  const lfoGainRef = useRef<GainNode | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize premium Tibetan Singing Bowl synthesizer
  const initSynth = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();

        // Master gain for smooth, click-free volume transitions
        const masterGain = audioCtxRef.current.createGain();
        masterGain.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
        mainGainRef.current = masterGain;

        // Biquad filter to model warm metallic friction of physical bronze singing bowls
        const filter = audioCtxRef.current.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, audioCtxRef.current.currentTime); // Lower cutoff for deeper, warmer, and more calming acoustic resonance
        filter.Q.setValueAtTime(1.5, audioCtxRef.current.currentTime);

        masterGain.connect(filter);
        filter.connect(audioCtxRef.current.destination);
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      setAudioError(false);
    } catch (e) {
      console.warn("Web Audio API is sandboxed inside this frame:", e);
      setAudioError(true);
    }
  };

  const startTone = () => {
    if (!audioCtxRef.current || !mainGainRef.current || !soundEnabled) return;
    
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    // Avoid double triggering to prevent overlapping sound waves
    if (osc1Ref.current) {
      mainGainRef.current.gain.cancelScheduledValues(now);
      mainGainRef.current.gain.linearRampToValueAtTime(0.35, now + 1.2);
      return;
    }

    try {
      // Warm, ultra-calming consonant harmonics based on pure ratios (1:2:3:4 octave-fifth series)
      const f0 = 110.00; // Grounding fundamental (A2) - deeply soothing and relaxing

      // Fundamental deep resonance
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(f0, now);
      osc1Ref.current = osc1;

      // First overtone (Perfect Octave 2.0x) - warm, spacious resonance
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(f0 * 2.0, now);
      osc2Ref.current = osc2;

      // Second overtone (Perfect Fifth 3.0x) - beautiful, serene, non-piercing chime
      const osc3 = ctx.createOscillator();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(f0 * 3.0, now);
      osc3Ref.current = osc3;

      // Third overtone - gentle background breeze
      const osc4 = ctx.createOscillator();
      osc4.type = 'sine';
      osc4.frequency.setValueAtTime(f0 * 4.0, now);
      osc4Ref.current = osc4;

      // Ultra-slow LFO to mimic the physical wobble of the rotating wood striker
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.08, now); // Slow, 12.5-second wave cycle for deep calming
      lfoRef.current = lfo;

      // Pitch LFO modulator (extremely subtle, soft organic movement)
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.04, now);
      lfoGainRef.current = lfoGain;

      lfo.connect(lfoGain);
      lfoGain.connect(osc1.frequency);
      lfoGain.connect(osc2.frequency);

      // Volume mixers - prioritizing the deep base fundamental for immense warmth
      const gain1 = ctx.createGain(); gain1.gain.setValueAtTime(0.75, now);
      const gain2 = ctx.createGain(); gain2.gain.setValueAtTime(0.12, now);
      const gain3 = ctx.createGain(); gain3.gain.setValueAtTime(0.04, now);
      const gain4 = ctx.createGain(); gain4.gain.setValueAtTime(0.01, now);

      // Connect LFO as volume modulator (tremolo) on overtones to synthesize physical friction spin
      const lfoVolumeGain = ctx.createGain();
      lfoVolumeGain.gain.setValueAtTime(0.02, now);
      lfo.connect(lfoVolumeGain);
      lfoVolumeGain.connect(gain2.gain);
      lfoVolumeGain.connect(gain3.gain);

      osc1.connect(gain1);
      osc2.connect(gain2);
      osc3.connect(gain3);
      osc4.connect(gain4);

      // Route all voices through the master node
      gain1.connect(mainGainRef.current);
      gain2.connect(mainGainRef.current);
      gain3.connect(mainGainRef.current);
      gain4.connect(mainGainRef.current);

      osc1.start(now);
      osc2.start(now);
      osc3.start(now);
      osc4.start(now);
      lfo.start(now);

      mainGainRef.current.gain.cancelScheduledValues(now);
      mainGainRef.current.gain.setValueAtTime(0.0001, now);
      mainGainRef.current.gain.linearRampToValueAtTime(0.30, now + 1.5);
    } catch (e) {
      console.error("Failed to start Singing Bowl synthesis:", e);
    }
  };

  const stopTone = () => {
    if (mainGainRef.current && audioCtxRef.current) {
      try {
        const now = audioCtxRef.current.currentTime;
        mainGainRef.current.gain.cancelScheduledValues(now);
        mainGainRef.current.gain.linearRampToValueAtTime(0.0001, now + 0.8);
      } catch (err) {}
    }

    const o1 = osc1Ref.current;
    const o2 = osc2Ref.current;
    const o3 = osc3Ref.current;
    const o4 = osc4Ref.current;
    const lf = lfoRef.current;

    osc1Ref.current = null;
    osc2Ref.current = null;
    osc3Ref.current = null;
    osc4Ref.current = null;
    lfoRef.current = null;

    setTimeout(() => {
      // Only stop nodes if they weren't re-instantiated in the meantime
      if (!osc1Ref.current) {
        try { o1?.stop(); o1?.disconnect(); } catch (e) {}
        try { o2?.stop(); o2?.disconnect(); } catch (e) {}
        try { o3?.stop(); o3?.disconnect(); } catch (e) {}
        try { o4?.stop(); o4?.disconnect(); } catch (e) {}
        try { lf?.stop(); lf?.disconnect(); } catch (e) {}
      }
    }, 1000);
  };

  // Synchronize audio frequencies and filter properties dynamically with Box Breathing phases
  useEffect(() => {
    if (!soundEnabled || !isRunning) {
      stopTone();
      return;
    }

    startTone();

    if (!audioCtxRef.current || !mainGainRef.current) return;

    try {
      const now = audioCtxRef.current.currentTime;
      mainGainRef.current.gain.cancelScheduledValues(now);

      // Capture current gain value to seamlessly start ramp without sudden pops
      const currentGain = mainGainRef.current.gain.value || 0.25;
      mainGainRef.current.gain.setValueAtTime(currentGain, now);

      if (phase === 'inhale') {
        // Inhale: Sound opens up, pitches elevate, volume swells majestically
        if (osc1Ref.current) {
          osc1Ref.current.frequency.cancelScheduledValues(now);
          osc1Ref.current.frequency.exponentialRampToValueAtTime(114.00, now + 3.5);
        }
        if (osc2Ref.current) {
          osc2Ref.current.frequency.cancelScheduledValues(now);
          osc2Ref.current.frequency.exponentialRampToValueAtTime(114.00 * 2.0, now + 3.5);
        }
        mainGainRef.current.gain.linearRampToValueAtTime(0.32, now + 3.0);
      } else if (phase === 'hold1') {
        // Hold 1 (fullness): Deeply resonant, stable, shimmering chime sustain
        if (osc1Ref.current) {
          osc1Ref.current.frequency.cancelScheduledValues(now);
          osc1Ref.current.frequency.exponentialRampToValueAtTime(110.00, now + 2.0);
        }
        if (osc2Ref.current) {
          osc2Ref.current.frequency.cancelScheduledValues(now);
          osc2Ref.current.frequency.exponentialRampToValueAtTime(110.00 * 2.0, now + 2.0);
        }
        mainGainRef.current.gain.linearRampToValueAtTime(0.24, now + 2.0);
      } else if (phase === 'exhale') {
        // Exhale: Release of breath, frequency drops, sound gets deeper and warmer
        if (osc1Ref.current) {
          osc1Ref.current.frequency.cancelScheduledValues(now);
          osc1Ref.current.frequency.exponentialRampToValueAtTime(106.00, now + 3.5);
        }
        if (osc2Ref.current) {
          osc2Ref.current.frequency.cancelScheduledValues(now);
          osc2Ref.current.frequency.exponentialRampToValueAtTime(106.00 * 2.0, now + 3.5);
        }
        mainGainRef.current.gain.linearRampToValueAtTime(0.15, now + 3.5);
      } else if (phase === 'hold2') {
        // Hold 2 (emptiness): Deep baseline carrier, ultimate silence and stillness
        if (osc1Ref.current) {
          osc1Ref.current.frequency.cancelScheduledValues(now);
          osc1Ref.current.frequency.exponentialRampToValueAtTime(102.00, now + 3.0);
        }
        if (osc2Ref.current) {
          osc2Ref.current.frequency.cancelScheduledValues(now);
          osc2Ref.current.frequency.exponentialRampToValueAtTime(102.00 * 2.0, now + 3.0);
        }
        mainGainRef.current.gain.linearRampToValueAtTime(0.10, now + 3.0);
      }
    } catch (e) {
      console.warn("Failed to update frequencies synchronously:", e);
    }
  }, [phase, isRunning, soundEnabled]);

  // Unified single-interval timer managing both numerical countdown & transition state-machine
  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Transition to next phase of Sama Vritti Pranayama
          setPhase((current) => {
            const getNextPhase = (p: 'inhale' | 'hold1' | 'exhale' | 'hold2') => {
              if (p === 'inhale') return 'hold1';
              if (p === 'hold1') return 'exhale';
              if (p === 'exhale') return 'hold2';
              return 'inhale';
            };
            const next = getNextPhase(current);
            if (current === 'hold2') {
              setCycleCount((c) => {
                const nextCycle = c + 1;
                if (nextCycle >= 4) {
                  setIsRunning(false);
                  setIsFinished(true);
                  if (timerRef.current) clearInterval(timerRef.current);
                  return 0;
                }
                return nextCycle;
              });
            }
            return next;
          });
          return 4; // Reset countdown for the next 4-second hold
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleStartStop = () => {
    initSynth();
    setIsFinished(false);
    if (!isRunning) {
      setTimeLeft(4);
      setPhase('inhale');
      setCycleCount(0);
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  };

  const handleToggleSound = () => {
    if (!soundEnabled) {
      initSynth();
      setSoundEnabled(true);
    } else {
      setSoundEnabled(false);
    }
  };

  // Clear synthesizers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopTone();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'inhale': return 'Breathe in fully through the nose. Feel your belly expand.';
      case 'hold1': return 'Suspend the breath gently. Quiet your mind.';
      case 'exhale': return 'Sigh out slowly through the mouth. Let go of all resistance.';
      case 'hold2': return 'Linger in the empty space. Welcome absolute stillness.';
    }
  };

  const getMarkerStyle = () => {
    if (!isRunning) {
      return { left: '20px', top: '20px', opacity: 0 };
    }
    const progress = (4 - timeLeft) / 4; // 0, 0.25, 0.50, 0.75
    switch (phase) {
      case 'inhale':
        return {
          left: `calc(20px + ${progress} * (100% - 40px))`,
          top: '20px',
          opacity: 1,
          transform: 'translate(-50%, -50%)'
        };
      case 'hold1':
        return {
          left: `calc(100% - 20px)`,
          top: `calc(20px + ${progress} * (100% - 40px))`,
          opacity: 1,
          transform: 'translate(-50%, -50%)'
        };
      case 'exhale':
        return {
          left: `calc(100% - 20px - ${progress} * (100% - 40px))`,
          top: `calc(100% - 20px)`,
          opacity: 1,
          transform: 'translate(-50%, -50%)'
        };
      case 'hold2':
        return {
          left: '20px',
          top: `calc(100% - 20px - ${progress} * (100% - 40px))`,
          opacity: 1,
          transform: 'translate(-50%, -50%)'
        };
    }
  };

  return (
    <div className="relative border border-primary-purple/20 bg-card-dark/60 rounded-3xl p-6 md:p-10 glow-purple overflow-hidden flex flex-col items-center max-w-4xl mx-auto" id="box-breathing-simulator">
      {/* Mystical purple glow orbs */}
      <div className="absolute -left-20 -top-20 w-80 h-80 bg-primary-purple/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-mid-purple/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="text-center w-full z-10 max-w-xl mb-8">
        <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-2 tracking-tight">
          Equal Breathing
        </h3>
        <p className="text-gray-400 text-sm md:text-base">
          Our nervous system is a musical instrument, and breath is the keys.
        </p>
      </div>

      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8 z-10">
        
        {/* Left Side: Dynamic Instruction Prompts */}
        <div className="w-full md:w-1/2 flex flex-col justify-center space-y-6">
          {isFinished ? (
            <div className="bg-[#050309]/80 border border-emerald-500/30 rounded-2xl p-6 space-y-4">
              <span className="text-emerald-400 text-xs font-mono tracking-[0.2em] block uppercase">EXERCISE REALISED</span>
              <p className="text-xl md:text-2xl font-display text-white font-semibold leading-relaxed">
                Well done. This is the power of one breath. Imagine what a practice could do.
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Pranayama balances your heart rate variability (HRV) and instantly calms the amygdala. Amisha delivers bespoke programs for luxury residencies and elite corporate workspaces.
              </p>
              <button 
                id="cta-end-booking"
                onClick={onBookCall}
                className="w-full py-4 px-6 bg-gradient-to-r from-mid-purple to-primary-purple hover:from-primary-purple hover:to-mid-purple text-white font-semibold rounded-xl text-sm tracking-wider uppercase transition-all glow-purple hover:scale-[1.02] cursor-pointer"
              >
                Book a Session with Amisha →
              </button>
            </div>
          ) : (
            <div className="space-y-4 min-h-[140px] flex flex-col justify-center">
              <div className="flex justify-between items-center text-xs font-mono text-gray-500 pb-2 border-b border-white/5">
                <span>CYCLE {Math.min(cycleCount + 1, 4)} OF 4</span>
                <span className="text-bright-purple uppercase tracking-widest">{isRunning ? phase.replace('hold1', 'HOLD').replace('hold2', 'REST HOLD').toUpperCase() : "READY"}</span>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-2xl md:text-3xl font-display font-medium text-white min-h-[40px]">
                  {isRunning ? getPhaseInstruction() : "Prepare Your Alignment"}
                </h4>
                <p className="text-gray-400 text-xs italic">
                  Keep your spine floating straight, rest your hands on your lap, and soften your eyes.
                </p>
              </div>

              {/* Progress bars */}
              <div className="grid grid-cols-4 gap-2.5 pt-4">
                {(['inhale', 'hold1', 'exhale', 'hold2'] as const).map((p) => (
                  <div key={p} className="h-1.5 bg-gray-800 rounded-full overflow-hidden relative">
                    {isRunning && phase === p && (
                      <div 
                        className="absolute left-0 top-0 bottom-0 bg-bright-purple transition-all duration-1000 ease-linear"
                        style={{ width: `${(5 - timeLeft) * 25}%` }}
                      />
                    )}
                    {isRunning && (
                      p === 'inhale' && phase !== 'inhale' ||
                      p === 'hold1' && (phase === 'exhale' || phase === 'hold2') ||
                      p === 'exhale' && phase === 'hold2'
                    ) && (
                      <div className="absolute inset-0 bg-primary-purple/40" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sound Controls Panel */}
          <div className="flex items-center gap-3 bg-[#0A0A0A] border border-white/5 p-4 rounded-xl w-full">
            <button
              id="soundscape-breathing-btn"
              onClick={handleToggleSound}
              className={`p-2.5 rounded-lg border transition-all ${
                soundEnabled 
                  ? 'bg-primary-purple/20 border-primary-purple/40 text-bright-purple' 
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <div className="text-xs">
              <span className="text-white block font-medium">Ancient Sonic Drone</span>
              <span className="text-gray-500 block">
                {soundEnabled 
                  ? "Playing layered meditative carrier frequencies (136.1Hz OM tuning + rich harmonic overtones) to support clarity on all speakers."
                  : "Tibetan carrier wave muted. Tap speaker to activate organic synthesis."}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: The Vedic Square Box Breathing Track */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 bg-[#050309]/50 border border-white/5 rounded-3xl aspect-square relative min-h-[320px] overflow-hidden">
          
          {/* Box Breathing Square Track Outline */}
          <div className="absolute inset-5 border border-white/10 rounded-2xl z-0 pointer-events-none">
            {/* Active Side Glow overlays */}
            <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl transition-all duration-300 ${phase === 'inhale' && isRunning ? 'bg-gradient-to-r from-bright-purple via-amber-400 to-bright-purple shadow-[0_0_12px_rgba(168,85,247,0.8)] opacity-100' : 'bg-transparent opacity-0'}`} />
            <div className={`absolute top-0 bottom-0 right-0 w-1 rounded-r-2xl transition-all duration-300 ${phase === 'hold1' && isRunning ? 'bg-gradient-to-b from-bright-purple via-amber-400 to-bright-purple shadow-[0_0_12px_rgba(168,85,247,0.8)] opacity-100' : 'bg-transparent opacity-0'}`} />
            <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl transition-all duration-300 ${phase === 'exhale' && isRunning ? 'bg-gradient-to-r from-bright-purple via-amber-400 to-bright-purple shadow-[0_0_12px_rgba(168,85,247,0.8)] opacity-100' : 'bg-transparent opacity-0'}`} />
            <div className={`absolute top-0 bottom-0 left-0 w-1 rounded-l-2xl transition-all duration-300 ${phase === 'hold2' && isRunning ? 'bg-gradient-to-b from-bright-purple via-amber-400 to-bright-purple shadow-[0_0_12px_rgba(168,85,247,0.8)] opacity-100' : 'bg-transparent opacity-0'}`} />
            
            {/* Edge labels to represent Box steps clearly */}
            <span className={`absolute top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-mono tracking-widest uppercase transition-all whitespace-nowrap ${phase === 'inhale' && isRunning ? 'text-amber-400 font-bold scale-105' : 'text-gray-500'}`}>1. Inhale (4s)</span>
            <span className={`absolute bottom-2.5 left-1/2 -translate-x-1/2 text-[9px] font-mono tracking-widest uppercase transition-all whitespace-nowrap ${phase === 'exhale' && isRunning ? 'text-amber-400 font-bold scale-105' : 'text-gray-500'}`}>2. Exhale (4s)</span>
          </div>

          {/* Glowing Golden Breathing Marker */}
          {isRunning && (
            <div 
              className="absolute w-4.5 h-4.5 rounded-full bg-amber-400 shadow-[0_0_16px_#fbbf24] border border-white/60 transition-all duration-1000 ease-linear z-30 pointer-events-none"
              style={getMarkerStyle()}
            />
          )}

          {/* Core Breathing Node */}
          <div 
            className={`w-40 h-40 md:w-48 md:h-48 rounded-full border border-white/10 bg-[#0E0B16] flex flex-col items-center justify-center text-center relative z-10 transition-all duration-[4000ms] ease-in-out shadow-2xl ${
              isRunning
                ? phase === 'inhale'
                  ? 'scale-110 border-bright-purple/50 shadow-primary-purple/20'
                  : phase === 'hold1'
                    ? 'scale-110 shadow-mid-purple/35 border-primary-purple/80'
                    : phase === 'exhale'
                      ? 'scale-90 border-white/5 shadow-none'
                      : 'scale-90 shadow-mid-purple/10 border-primary-purple/30'
                : 'scale-100'
            }`}
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 mb-1">
              {isRunning ? phase.replace('hold1', 'HOLD').replace('hold2', 'REST HOLD').toUpperCase() : "INHALE LIFE FORCE"}
            </span>

            <div className="my-1.5 h-12 flex items-center justify-center">
              {isRunning ? (
                <span className="text-4xl md:text-5xl font-display font-medium text-white neon-text-purple tracking-tighter">
                  {timeLeft}
                </span>
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary-purple/20 flex items-center justify-center border border-primary-purple/30 text-bright-purple hover:scale-105 transition-all">
                  <Play className="w-4 h-4 fill-bright-purple text-bright-purple ml-0.5" />
                </div>
              )}
            </div>

            <span className="text-[8px] font-mono uppercase tracking-[0.15em] text-gray-500 mt-1">
              Seconds Left
            </span>
          </div>

          {/* Start Button Overlay */}
          <div className="absolute bottom-10 flex justify-center z-20">
            <button
              id="box-breathing-control-btn"
              onClick={handleStartStop}
              className={`py-2.5 px-6 rounded-full font-display font-bold text-[10px] tracking-widest uppercase transition-all glow-purple hover:scale-[1.05] active:scale-[0.98] flex items-center gap-2 cursor-pointer ${
                isRunning 
                  ? 'bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-100' 
                  : 'bg-gradient-to-r from-mid-purple to-primary-purple hover:from-primary-purple hover:to-mid-purple text-white shadow-lg border border-primary-purple/30'
              }`}
            >
              {isRunning ? (
                <>
                  <Square className="w-3 h-3 fill-red-100 text-red-100" /> Abort Breathing
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-white text-white" /> ▶ Start Box Breathing
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {audioError && (
        <div className="mt-6 flex items-center gap-2 text-amber-400 text-xs bg-amber-950/20 px-4 py-2.5 rounded-lg border border-amber-500/20 w-full z-10">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p className="font-mono text-[10px] leading-relaxed">
            Your browser sandbox might limit web audio synthesis. If you do not hear anything soundscape upon pressing Start, try opening this page in a new standalone tab.
          </p>
        </div>
      )}
    </div>
  );
}
