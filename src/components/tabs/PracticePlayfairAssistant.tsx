import React, { useState } from 'react';
import { buildPlayfairMatrix } from '../../crypto/ciphers/playfair';
import { LayoutGrid, Compass, ArrowRight, ArrowDown } from 'lucide-react';

interface PracticePlayfairAssistantProps {
  currentKey?: string;
}

export const PracticePlayfairAssistant: React.FC<PracticePlayfairAssistantProps> = ({ currentKey = 'VERANO AZUL' }) => {
  const [keyword, setKeyword] = useState<string>(currentKey || 'VERANO AZUL');
  const [selectedChar, setSelectedChar] = useState<string | null>(null);

  const matrix = buildPlayfairMatrix(keyword);

  return (
    <div className="w-full flex flex-col items-center gap-3">
      {/* Header with Key input */}
      <div className="w-full flex items-center justify-between gap-2 bg-slate-950/80 p-2 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-violet-400" />
          <span className="text-xs font-mono font-bold text-violet-300">Matriz Playfair 5×5</span>
        </div>
        <div className="flex items-center gap-1.5">
          <label className="text-[10px] font-mono text-slate-400">Clave:</label>
          <input
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value.toUpperCase())}
            placeholder="Clave"
            className="w-24 h-7 bg-slate-900 border border-slate-700 text-center font-mono font-bold text-violet-300 text-xs rounded-lg focus:outline-none focus:border-violet-500 uppercase px-1"
          />
        </div>
      </div>

      {/* 5x5 Matrix Display */}
      <div className="w-full max-w-[340px] bg-slate-950/90 border border-slate-800 rounded-2xl p-3 shadow-xl">
        <div className="grid grid-cols-6 gap-1 text-center font-mono select-none">
          {/* Top-left empty corner */}
          <div className="w-9 h-9 flex items-center justify-center text-[10px] text-slate-600 font-bold">
            F\C
          </div>

          {/* Column Headers 1..5 */}
          {[1, 2, 3, 4, 5].map(col => (
            <div
              key={`pf-col-${col}`}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-slate-400 bg-slate-900/40"
            >
              C{col}
            </div>
          ))}

          {/* Rows 1..5 */}
          {[0, 1, 2, 3, 4].map(r => (
            <React.Fragment key={`pf-row-wrap-${r}`}>
              {/* Row Header */}
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-slate-400 bg-slate-900/40">
                F{r + 1}
              </div>

              {/* 5 cells */}
              {[0, 1, 2, 3, 4].map(c => {
                const idx = r * 5 + c;
                const char = matrix[idx];
                const displayLabel = char === 'I' ? 'I/J' : char === 'N' ? 'N/Ñ' : char;
                const isSelected = selectedChar === char;

                return (
                  <button
                    key={`pf-cell-${r}-${c}`}
                    onClick={() => setSelectedChar(char)}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs transition border ${
                      isSelected
                        ? 'bg-violet-600 text-white border-violet-400 shadow-md ring-1 ring-violet-300'
                        : 'bg-slate-900/80 border-slate-800/80 text-slate-200 hover:border-slate-600'
                    }`}
                  >
                    {displayLabel}
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Rules Mini Reminder */}
      <div className="w-full bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
        <div className="flex items-center gap-1.5 text-sky-400">
          <ArrowRight className="w-3 h-3" />
          <span>Misma Fila: Derecha (+1 mod 5)</span>
        </div>
        <div className="flex items-center gap-1.5 text-purple-400">
          <ArrowDown className="w-3 h-3" />
          <span>Misma Columna: Abajo (+1 mod 5)</span>
        </div>
        <div className="flex items-center gap-1.5 text-amber-400">
          <Compass className="w-3 h-3" />
          <span>Rectángulo: Misma fila, cruza columnas</span>
        </div>
      </div>
    </div>
  );
};
