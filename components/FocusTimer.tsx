import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';

type TimerMode = 'focus' | 'break';
type CycleLength = 'standard' | 'training';

const BREAK_PROMPTS = [
  "Busca luz natural, sal a la ventana.",
  "Muévete un poco, estira la espalda.",
  "Descansa la vista mirando al horizonte.",
  "Bebe un vaso de agua con calma.",
  "Respira profundamente tres veces."
];

export const FocusTimer: React.FC = () => {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [cycleType, setCycleType] = useState<CycleLength>('standard');
  const [timeLeft, setTimeLeft] = useState(50 * 60);
  const [isActive, setIsActive] = useState(false);
  const [breakPrompt, setBreakPrompt] = useState(BREAK_PROMPTS[0]);

  // Use refs for audio to avoid re-creating on renders
  const audioContextRef = useRef<AudioContext | null>(null);

  const getDuration = (m: TimerMode, type: CycleLength) => {
    if (type === 'training') {
      return m === 'focus' ? 10 * 60 : 2 * 60; // 10m focus / 2m break
    }
    return m === 'focus' ? 50 * 60 : 17 * 60; // 50m focus / 17m break
  };

  const playSound = useCallback((frequency = 440, type: OscillatorType = 'sine', duration = 0.5) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }, []);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft(getDuration(mode, cycleType));
  }, [mode, cycleType]);

  const toggleTimer = () => setIsActive(!isActive);

  const switchMode = () => {
    const nextMode = mode === 'focus' ? 'break' : 'focus';
    setMode(nextMode);
    setTimeLeft(getDuration(nextMode, cycleType));
    setIsActive(false);
    if (nextMode === 'break') {
      setBreakPrompt(BREAK_PROMPTS[Math.floor(Math.random() * BREAK_PROMPTS.length)]);
    }
  };

  useEffect(() => {
    let interval: number | null = null;
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      playSound(523.25, 'triangle', 1); // C5 notification
      if (mode === 'focus') {
        // Auto-switch not usually recommended in calm tech, but alerting user is necessary
        setTimeout(() => playSound(659.25, 'triangle', 1), 400); // E5
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode, playSound]);

  // Reset when cycle type changes
  useEffect(() => {
    resetTimer();
  }, [cycleType, resetTimer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = 1 - (timeLeft / getDuration(mode, cycleType));

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-sand-200 max-w-md mx-auto relative overflow-hidden">
        {/* Progress Background Overlay */}
        <div 
            className={`absolute bottom-0 left-0 h-1 transition-all duration-1000 ease-linear ${mode === 'focus' ? 'bg-sage-500' : 'bg-amber-400'}`} 
            style={{ width: `${progress * 100}%` }}
        />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-serif font-medium text-sand-900 flex items-center gap-2">
          {mode === 'focus' ? <Brain className="w-5 h-5 text-sage-600" /> : <Coffee className="w-5 h-5 text-amber-600" />}
          {mode === 'focus' ? 'Ciclo de Enfoque' : 'Descanso Regenerativo'}
        </h2>
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => setCycleType('standard')}
            className={`px-3 py-1 rounded-full transition-colors ${cycleType === 'standard' ? 'bg-sand-200 text-sand-900 font-medium' : 'text-sand-500 hover:bg-sand-100'}`}
          >
            50/17
          </button>
          <button
            onClick={() => setCycleType('training')}
            className={`px-3 py-1 rounded-full transition-colors ${cycleType === 'training' ? 'bg-sand-200 text-sand-900 font-medium' : 'text-sand-500 hover:bg-sand-100'}`}
          >
            Entreno
          </button>
        </div>
      </div>

      <div className="text-center py-4">
        <div className={`text-6xl font-variant-numeric tabular-nums tracking-tight font-light mb-2 ${mode === 'focus' ? 'text-sage-800' : 'text-amber-700'}`}>
          {formatTime(timeLeft)}
        </div>
        {mode === 'break' && (
          <p className="text-sage-600 text-sm italic animate-pulse">
            "{breakPrompt}"
          </p>
        )}
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={toggleTimer}
          className={`
            w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-sm
            ${isActive 
                ? 'bg-sand-100 text-sand-800 hover:bg-sand-200' 
                : 'bg-sage-600 text-white hover:bg-sage-700 hover:scale-105'
            }
          `}
          title={isActive ? "Pausar" : "Iniciar"}
        >
          {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
        </button>

        <button
          onClick={resetTimer}
          className="w-14 h-14 rounded-full flex items-center justify-center bg-white border border-sand-200 text-sand-600 hover:border-sand-300 hover:text-sand-800 transition-colors"
          title="Reiniciar"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        
        {/* Only show skip if timer is stopped or finished */}
        <button
            onClick={switchMode}
            className="px-4 h-14 rounded-full bg-transparent text-xs uppercase tracking-wider font-semibold text-sand-500 hover:text-sand-800 transition-colors"
        >
            {mode === 'focus' ? 'Ir a Descanso' : 'Ir a Foco'}
        </button>
      </div>
    </div>
  );
};