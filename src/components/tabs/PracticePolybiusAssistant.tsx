import React, { useState } from 'react';
import { POLYBIUS_DEFAULT_ALPHA } from '../../crypto/ciphers/polybius';
import { Grid3X3, Flame, HelpCircle } from 'lucide-react';

export const PracticePolybiusAssistant: React.FC = () => {
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number; char: string } | null>(null);
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number; char: string } | null>({
    r: 1,
    c: 1,
    char: 'A',
  });
  const [quickLookupChar, setQuickLookupChar] = useState<string>('');

  const active = hoveredCell || selectedCell;

  const handleCharClick = (r: number, c: number, char: string) => {
    setSelectedCell({ r, c, char });
  };

  const handleQuickLookup = (input: string) => {
    setQuickLookupChar(input);
    const clean = input.toUpperCase().replace(/J/g, 'I').replace(/Ñ/g, 'N').trim();
    if (clean.length > 0) {
      const targetChar = clean[clean.length - 1];
      const idx = POLYBIUS_DEFAULT_ALPHA.indexOf(targetChar);
      if (idx !== -1) {
        const r = Math.floor(idx / 5) + 1;
        const c = (idx % 5) + 1;
        setSelectedCell({ r, c, char: targetChar });
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-3">
      {/* Header with Quick Lookup */}
      <div className="w-full flex items-center justify-between gap-2 bg-slate-950/80 p-2 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <Grid3X3 className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-mono font-bold text-amber-300">Tabla 5×5 (I = J)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <label className="text-[10px] font-mono text-slate-400">Buscar:</label>
          <input
            type="text"
            maxLength={1}
            value={quickLookupChar}
            onChange={e => handleQuickLookup(e.target.value)}
            placeholder="A"
            className="w-8 h-7 bg-slate-900 border border-slate-700 text-center font-mono font-bold text-amber-300 text-xs rounded-lg focus:outline-none focus:border-amber-500 uppercase"
          />
        </div>
      </div>

      {/* 5x5 Matrix Display */}
      <div className="w-full max-w-[340px] bg-slate-950/90 border border-slate-800 rounded-2xl p-3 shadow-xl">
        <div className="grid grid-cols-6 gap-1.5 text-center font-mono select-none">
          {/* Top-left empty corner */}
          <div className="w-10 h-10 flex items-center justify-center text-[10px] text-slate-600 font-bold">
            F\C
          </div>

          {/* Column Headers 1..5 */}
          {[1, 2, 3, 4, 5].map(col => {
            const isColActive = active && active.c === col;
            return (
              <div
                key={`p-col-${col}`}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-colors ${
                  isColActive
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/50 shadow-sm'
                    : 'text-slate-400 bg-slate-900/50 border border-slate-800/60'
                }`}
              >
                {col}
              </div>
            );
          })}

          {/* 5 Rows */}
          {[1, 2, 3, 4, 5].map(row => {
            const isRowActive = active && active.r === row;
            return (
              <React.Fragment key={`p-row-${row}`}>
                {/* Row Header */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-colors ${
                    isRowActive
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50 shadow-sm'
                      : 'text-slate-400 bg-slate-900/50 border border-slate-800/60'
                  }`}
                >
                  {row}
                </div>

                {/* 5 Cells in this row */}
                {[1, 2, 3, 4, 5].map(col => {
                  const idx = (row - 1) * 5 + (col - 1);
                  const char = POLYBIUS_DEFAULT_ALPHA[idx];
                  const isCellSelected = active && active.r === row && active.c === col;
                  const isColActive = active && active.c === col;

                  return (
                    <button
                      key={`p-cell-${row}-${col}`}
                      onMouseEnter={() => setHoveredCell({ r: row, c: col, char })}
                      onMouseLeave={() => setHoveredCell(null)}
                      onClick={() => handleCharClick(row, col, char)}
                      className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center font-mono font-bold transition-all ${
                        isCellSelected
                          ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 scale-105 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400'
                          : isRowActive || isColActive
                          ? 'bg-slate-900 text-slate-200 border border-slate-700'
                          : 'bg-slate-900/60 border border-slate-800/80 text-slate-300 hover:border-amber-500/40 hover:text-amber-300'
                      }`}
                    >
                      <span className="text-xs">{char === 'I' ? 'I/J' : char}</span>
                    </button>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Active Inspector Readout Pill */}
      {active && (
        <div className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-1 text-xs font-mono">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Letra seleccionada:</span>
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 font-bold rounded border border-amber-500/40">
              {active.char === 'I' ? 'I (o J)' : active.char}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-800">
            <span className="text-slate-400">
              Fila: <strong className="text-amber-400">{active.r}</strong>, Col: <strong className="text-sky-400">{active.c}</strong>
            </span>
            <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              Código: {active.r}{active.c}
            </span>
          </div>
        </div>
      )}

      {/* Historical Torch Reference Tip */}
      <div className="w-full bg-amber-500/5 border border-amber-500/20 rounded-xl p-2.5 text-[10px] font-mono text-amber-300/80 flex items-start gap-2">
        <Flame className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
        <span>
          En el telégrafo óptico de Polibio (s. II a.C.), las antorchas de la mano izquierda indicaban la fila (1–5) y las de la derecha la columna (1–5).
        </span>
      </div>
    </div>
  );
};
