import React, { useState } from 'react';
import { AlphabetMode } from '../../crypto/alphabets';
import { AlbertiDisk } from '../visualizers/AlbertiDisk';
import { CaesarWheel } from '../visualizers/CaesarWheel';
import { VigenereTabula } from '../visualizers/VigenereTabula';
import { PlayfairGrid } from '../visualizers/PlayfairGrid';
import { HillMatrixTool } from '../visualizers/HillMatrixTool';
import { ScytaleColumnar } from '../visualizers/ScytaleColumnar';
import { RotateCw, Sliders, Grid, LayoutGrid, Calculator, Columns } from 'lucide-react';

interface InteractiveLabTabProps {
  mode: AlphabetMode;
  onModeChange: (newMode: AlphabetMode) => void;
}

export const InteractiveLabTab: React.FC<InteractiveLabTabProps> = ({ mode, onModeChange }) => {
  const [activeCipher, setActiveCipher] = useState<
    'alberti' | 'cesar' | 'vigenere' | 'playfair' | 'hill' | 'transposicion'
  >('alberti');

  const navItems = [
    { id: 'alberti', label: 'Disco de Alberti', icon: RotateCw, color: 'text-amber-400', badge: 'Polialfabético' },
    { id: 'cesar', label: 'César y Afín', icon: Sliders, color: 'text-sky-400', badge: 'Monoalfabético' },
    { id: 'vigenere', label: 'Tabula Vigenère', icon: Grid, color: 'text-cyan-400', badge: 'Polialfabético' },
    { id: 'playfair', label: 'Playfair 5×5', icon: LayoutGrid, color: 'text-violet-400', badge: 'Digrámico' },
    { id: 'hill', label: 'Cifrador de Hill', icon: Calculator, color: 'text-emerald-400', badge: 'Matricial' },
    { id: 'transposicion', label: 'Transposición', icon: Columns, color: 'text-rose-400', badge: 'Geométrico' },
  ];

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      {/* Sub-Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-7xl mx-auto w-full px-2 lg:px-4">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeCipher === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveCipher(item.id as any)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-mono text-xs whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-slate-900 border-amber-500/50 text-slate-100 shadow-lg shadow-amber-500/5'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className={`w-4 h-4 ${item.color}`} />
              <span className="font-semibold">{item.label}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-normal">
                {item.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Visualizer Render */}
      <div className="w-full">
        {activeCipher === 'alberti' && <AlbertiDisk mode={mode} onModeChange={onModeChange} />}
        {activeCipher === 'cesar' && <CaesarWheel mode={mode} />}
        {activeCipher === 'vigenere' && <VigenereTabula mode={mode} />}
        {activeCipher === 'playfair' && <PlayfairGrid />}
        {activeCipher === 'hill' && <HillMatrixTool mode={mode} />}
        {activeCipher === 'transposicion' && <ScytaleColumnar mode={mode} />}
      </div>
    </div>
  );
};
