import React, { useState, useEffect, useRef } from 'react';
import { Wind, Play, Square, Volume2, VolumeX, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';

interface BreathExercise {
  name: string;
  traditionalName: string;
  tagline: string;
  benefits: string;
  pattern: {
    inhale: number;
    hold1: number;
    exhale: number;
    hold2: number;
  };
  purpose: string;
}

const EXERCISES: BreathExercise[] = [
  {
    name: "Channel Purification",
    traditionalName: "Nadi Shodhana (Anulom Vilom)",
    tagline: "Balances hemispheres & eliminates travel fatigue.",
    benefits: "Instantly lowers blood pressure and re-centers highly distracted business minds.",
    pattern: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
    purpose: "Jetlag & Deep Rebalancing"
  },
  {
    name: "Equal Box Breathing",
    traditionalName: "Sama Vritti",
    tagline: "High-focus state triggered in under 3 minutes.",
    benefits: "Standard protocol used by elite executives and soldiers to arrest panic and restore executive focus.",
    pattern: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
    purpose: "Anxiety & Clear Cognitive Focus"
  },
  {
    name: "Himalayan Awake Respiration",
    traditionalName: "Bhastrika (The Bellows)",
    tagline: "Deep physical oxygenation & altitude wellness.",
    benefits: "Hyper-oxygenates the blood cells and generates physical warmth. Ideal for high-altitude resort arrivals.",
    pattern: { inhale: 2, hold1: 0, exhale: 2, hold2: 0 },
    purpose: "Vitality, Warmth & Low Oxygen Acclimatization"
  },
  {
    name: "Himalayan Sleeping Vibrations",
    traditionalName: "Pranava Bhramari",
    tagline: "Immediate vagus nerve stimulation for rest.",
    benefits: "Triggers intense parasympathetic dominance via humming vibrations, inducing heavy melatonin releases.",
    pattern: { inhale: 4, hold1: 4, exhale: 8, hold2: 0 },
    purpose: "Sleep Induction & Complete Rest"
  }
];

export default function BreathingSimulator() {
  const [activeExIdx, setActiveExIdx] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [timeLeft, setTimeLeft] = useState(4);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [audioError, setAudioError] = useState(false);

  const activeExercise = EXERCISES[activeExIdx];

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const biquadFilterRef = useRef<BiquadFilterNode | null>(null);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Lazy initialize Audio for Web Audio API inside a gesture
  const initAudio = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
        
        // Setup BiquadFilter for warm low pass sound
        const filter = audioCtxRef.current.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(220, audioCtxRef.current.currentTime);
        filter.Q.setValueAtTime(5, audioCtxRef.current.currentTime);
        biquadFilterRef.current = filter;

        const gain = audioCtxRef.current.createGain();
        gain.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
        gainNodeRef.current = gain;

        filter.connect(gain);
        gain.connect(audioCtxRef.current.destination);
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      setAudioError(false);
    } catch (e) {
      console.warn("Web Audio Context not supported or blocked in current iframe:", e);
      setAudioError(true);
    }
  };

  const startOscillator = () => {
    if (!audioCtxRef.current || !biquadFilterRef.current || !soundEnabled) return;
    try {
      stopOscillator();
      const osc = audioCtxRef.current.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, audioCtxRef.current.currentTime); // Deep therapeutic A2 note
      osc.connect(biquadFilterRef.current);
      osc.start();
      oscillatorRef.current = osc;
    } catch (error) {
      console.error(error);
    }
  };

  const stopOscillator = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch (err) {}
      oscillatorRef.current = null;
    }
  };

  // Turn sound on/off
  const toggleSound = () => {
    if (!soundEnabled) {
      initAudio();
      setSoundEnabled(true);
    } else {
      setSoundEnabled(false);
      stopOscillator();
    }
  };

  // Adjust synthesizer gain based on breathing phase
  useEffect(() => {
    if (!soundEnabled || !gainNodeRef.current || !audioCtxRef.current) return;
    const now = audioCtxRef.current.currentTime;
    
    // Smooth sound ramp corresponding to respiratory expansion
    if (isRunning) {
      if (phase === 'inhale') {
        // Expand and pitches swell slightly
        if (oscillatorRef.current) {
          oscillatorRef.current.frequency.exponentialRampToValueAtTime(146.83, now + 1.5); // Tune to calm D3
        }
        gainNodeRef.current.gain.linearRampToValueAtTime(0.18, now + 0.8);
      } else if (phase === 'exhale') {
        // Soft releasing sweep
        if (oscillatorRef.current) {
          oscillatorRef.current.frequency.exponentialRampToValueAtTime(110.00, now + 1.5); // Back to solid A2
        }
        gainNodeRef.current.gain.linearRampToValueAtTime(0.12, now + 0.6);
      } else {
        // Holds are complete silences or very soft static drone
        gainNodeRef.current.gain.linearRampToValueAtTime(0.04, now + 0.6);
      }
    } else {
      gainNodeRef.current.gain.linearRampToValueAtTime(0, now + 0.4);
    }
  }, [phase, isRunning, soundEnabled]);

  // Main breathing controller loop
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(activeExercise.pattern.inhale);
      setPhase('inhale');
      stopOscillator();
      return;
    }

    if (soundEnabled) {
      startOscillator();
    }

    const runLoop = () => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Trigger phase shift
          setPhase((currentPhase) => {
            const pattern = activeExercise.pattern;
            let nextPhase: typeof phase = 'inhale';
            let nextDuration = 4;

            if (currentPhase === 'inhale') {
              if (pattern.hold1 > 0) {
                nextPhase = 'hold1';
                nextDuration = pattern.hold1;
              } else {
                nextPhase = 'exhale';
                nextDuration = pattern.exhale;
              }
            } else if (currentPhase === 'hold1') {
              nextPhase = 'exhale';
              nextDuration = pattern.exhale;
            } else if (currentPhase === 'exhale') {
              if (pattern.hold2 > 0) {
                nextPhase = 'hold2';
                nextDuration = pattern.hold2;
              } else {
                nextPhase = 'inhale';
                nextDuration = pattern.inhale;
              }
            } else if (currentPhase === 'hold2') {
              nextPhase = 'inhale';
              nextDuration = pattern.inhale;
            }

            setTimeLeft(nextDuration);
            return nextPhase;
          });
          return 0; // Temporary, setTimeLeft will be immediately overwritten inside next cycle
        }
        return prev - 1;
      });
    };

    animationTimerRef.current = setInterval(runLoop, 1000);

    return () => {
      if (animationTimerRef.current) clearInterval(animationTimerRef.current);
    };
  }, [isRunning, activeExIdx, soundEnabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopOscillator();
      if (animationTimerRef.current) clearInterval(animationTimerRef.current);
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const handleStartStop = () => {
    if (!isRunning) {
      initAudio();
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  };

  // Map phase names to beautiful, non-technical labels
  const getPhaseLabel = (p: typeof phase) => {
    switch (p) {
      case 'inhale': return 'INHALE LIFE FORCE';
      case 'hold1': return 'SUSTAIN ENERGY';
      case 'exhale': return 'RELEASE COMPLETELY';
      case 'hold2': return 'ABSOLUTE STILLNESS';
    }
  };

  const getPhaseColor = (p: typeof phase) => {
    switch (p) {
      case 'inhale': return 'text-gold-500 bg-gold-50/10 border-gold-400/30';
      case 'hold1': return 'text-emerald-500 bg-emerald-50/10 border-emerald-400/30';
      case 'exhale': return 'text-sky-500 bg-sky-50/10 border-sky-400/30';
      case 'hold2': return 'text-purple-500 bg-purple-50/10 border-purple-400/30';
    }
  };

  return (
    <div className="bg-charcoal-900 border border-white/5 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl" id="guest-sensory-simulator">
      {/* Absolute Decorative Glow */}
      <div className="absolute -right-24 -top-24 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-24 -bottom-24 w-80 h-80 bg-sage-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-center">
        
        {/* Left Interactive panel: Exercise Select */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between self-stretch">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-gold-500/10 text-gold-500 text-xs font-mono tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-gold-500/10">
                <Sparkles className="w-3 h-3" /> GUEST INTERFACE PROTOTYPE
              </span>
              <span className="text-white/40 text-xs font-mono">IN-ROOM ENGINE</span>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-serif text-white tracking-wide mb-2 leading-snug">
              In-Room Digital Breath Coach
            </h3>
            <p className="text-white/70 text-sm mb-6 leading-relaxed">
              Show your staff and General Managers how seamlessly our brand integrates. This interactive, sensory breathing coach delivers physical and cognitive restorativeness directly over in-room tablets or smart TVs with zero expensive facility setup.
            </p>

            <div className="space-y-3 mb-6">
              {EXERCISES.map((ex, idx) => (
                <button
                  key={ex.name}
                  id={`exercise-selector-${idx}`}
                  onClick={() => {
                    setActiveExIdx(idx);
                    setIsRunning(false);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3.5 relative overflow-hidden ${
                    activeExIdx === idx
                      ? 'border-gold-500/30 bg-gold-500/10 shadow-lg shadow-gold-500/5'
                      : 'border-white/5 hover:border-white/10 bg-white/2 hover:bg-white/5'
                  }`}
                >
                  {activeExIdx === idx && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold-500" />
                  )}
                  <div className={`p-2 rounded-lg ${activeExIdx === idx ? 'bg-gold-500/20 text-gold-500' : 'bg-white/5 text-white/50'}`}>
                    <Wind className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-semibold text-white">{ex.name}</span>
                      <span className="text-[10px] font-mono text-white/40">{ex.purpose}</span>
                    </div>
                    <span className="block text-xs text-white/40 font-serif italic mt-0.5">{ex.traditionalName}</span>
                    <span className="block text-xs text-white/60 mt-1 leading-normal">{ex.tagline}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
            <span className="text-[10px] font-mono text-gold-500 tracking-widest block uppercase font-medium mb-1">Physiological ROI Strategy</span>
            <p className="text-xs text-white/70 leading-relaxed">
              <strong className="text-white">Active Biofeedback:</strong> {activeExercise.benefits} Highly rated by luxury leisure travelers wanting transformational sleep instead of generic massage tables.
            </p>
          </div>
        </div>

        {/* Right Panel: The Living breathing circle */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-black/15 border border-white/5 rounded-2xl py-12 px-6 relative self-stretch">
          
          {/* Ambient visual background pulse ring */}
          <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center rounded-full">
            
            {/* The animating background wave */}
            <div 
              className={`absolute border border-gold-500/15 rounded-full transition-all duration-1000 ${
                isRunning 
                  ? phase === 'inhale' 
                    ? 'w-full h-full bg-gold-500/10' 
                    : phase === 'exhale' 
                      ? 'w-[75%] h-[75%] bg-sage-500/10' 
                      : 'w-[90%] h-[90%] bg-white/5'
                  : 'w-[65%] h-[65%] bg-white/2 border-white/10'
              }`}
            />

            {/* Inner primary Core Circle */}
            <div 
              className={`w-44 h-44 md:w-52 md:h-52 rounded-full border border-gold-500/30 bg-charcoal-900 shadow-2xl flex flex-col items-center justify-center text-center relative z-15 transition-all duration-1000 ${
                isRunning
                  ? phase === 'inhale'
                    ? 'scale-110 shadow-gold-500/10 bg-gold-950/20'
                    : phase === 'exhale'
                      ? 'scale-90 shadow-sage-500/10 bg-sage-950/20'
                      : 'scale-100'
                  : 'scale-100'
              }`}
            >
              <div className="px-4">
                <span className={`text-[10px] font-mono tracking-widest px-2.5 py-1 rounded-full border mb-3 inline-block transition-all ${getPhaseColor(phase)}`}>
                  {isRunning ? getPhaseLabel(phase) : "TAP PLAY TO TEST"}
                </span>
                
                <div className="my-2 h-12 flex items-center justify-center">
                  {isRunning ? (
                    <span className="text-4xl md:text-5xl font-serif text-white font-medium">
                      {timeLeft}
                    </span>
                  ) : (
                    <Wind className="w-10 h-10 text-gold-500 animate-pulse" />
                  )}
                </div>

                <div className="text-[10px] font-mono tracking-widest text-white/50 uppercase mt-2">
                  {isRunning ? "Seconds Left" : activeExercise.purpose}
                </div>
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center items-center relative z-20 w-full max-w-sm">
            <button
              id="breathing-trigger-btn"
              onClick={handleStartStop}
              className={`flex-1 py-3 px-6 rounded-full flex items-center justify-center gap-2 text-sm font-semibold tracking-wider transition-all shadow-xl ${
                isRunning
                  ? 'bg-red-500 hover:bg-red-600 text-white hover:shadow-red-500/10'
                  : 'bg-gold-500 hover:bg-gold-600 text-charcoal-950 hover:shadow-gold-500/20'
              }`}
            >
              {isRunning ? (
                <>
                  <Square className="w-4 h-4 fill-white text-white" /> PAUSE PROTOCOL
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-charcoal-950 text-charcoal-950" /> INITIATE BREATH
                </>
              )}
            </button>

            <button
              id="breath-audio-toggle"
              onClick={toggleSound}
              className={`p-3 rounded-full border transition-all ${
                soundEnabled
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : 'border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white'
              }`}
              title="Simulate In-Room Soundscape Synthesizer"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>

          <p className="text-[11px] text-white/40 text-center font-mono mt-4 leading-normal">
            {soundEnabled 
              ? "Synthesizer active: Playing 110Hz Solfeggio bio-harmonic carrier wave."
              : "Soundscape muted. Tap speaker icon to activate immersive audio simulation."}
          </p>

          {audioError && (
            <div className="mt-3 flex items-center gap-1.5 text-orange-400 text-[10px] font-mono">
              <ShieldAlert className="w-3.5 h-3.5" /> Web Audio is sandboxed. Please open app in a new tab if audio fails.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
