import React from 'react';
import { Moon, Zap, Activity, Trees, Eye } from 'lucide-react';
import { PillarState, PILLAR_LABELS } from '../types';

interface PillarsProps {
  pillars: PillarState;
  onToggle: (key: keyof Omit<PillarState, 'lastUpdated'>) => void;
}

export const Pillars: React.FC<PillarsProps> = ({ pillars, onToggle }) => {
  const items = [
    { key: 'sueno', icon: Moon, label: PILLAR_LABELS.sueno },
    { key: 'energia', icon: Zap, label: PILLAR_LABELS.energia },
    { key: 'movimiento', icon: Activity, label: PILLAR_LABELS.movimiento },
    { key: 'naturaleza', icon: Trees, label: PILLAR_LABELS.naturaleza },
    { key: 'vision', icon: Eye, label: PILLAR_LABELS.vision },
  ] as const;

  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      <h3 className="text-sm font-semibold text-sand-800 tracking-wider uppercase mb-4 text-center">
        Los 5 Pilares Diarios
      </h3>
      <div className="flex flex-wrap justify-center gap-4">
        {items.map(({ key, icon: Icon, label }) => {
          const isActive = pillars[key];
          return (
            <button
              key={key}
              onClick={() => onToggle(key)}
              className={`
                group flex flex-col items-center justify-center p-3 w-20 h-20 rounded-2xl transition-all duration-300
                ${isActive 
                  ? 'bg-sage-600 text-white shadow-md transform scale-105' 
                  : 'bg-white text-sand-800 border border-sand-200 hover:border-sage-300 hover:bg-sage-50'}
              `}
              aria-label={`Marcar ${label} como completado`}
              aria-pressed={isActive}
            >
              <Icon className={`w-6 h-6 mb-2 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="text-[10px] font-medium tracking-wide">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};