import React, { useState, useMemo } from 'react';
import { AlphabetMode, ALPHABETS, formatInBlocks } from '../../crypto/alphabets';
import { processVigenere, VigenereVariant } from '../../crypto/ciphers/vigenere';
import { Grid, Key, Layers, Sparkles } from 'lucide-react';

interface VigenereTabulaProps {
  mode: AlphabetMode;
}

export const VigenereTabula: React.FC<VigenereTabulaProps> = ({ mode }) => {
  const [key, setKey] = useState<string>('CLAVE');
  const [inputText, setInputText] = useState<string>('ATACAMOS MANANA');
  const [direction, setDirection] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [variant, setVariant] = useState<VigenereVariant>('vigenere');
  const [activeCoords, setActiveCoords] = useState<{ row: number; col: number } | null>(null);

  const m = ALPHABETS[mode].mod;
  const alpha = ALPHABETS[mode].chars;

  const result = useMemo(() => {
    return processVigenere(inputText, key, mode, direction, variant);
  }, [inputText, key, mode, direction, variant]);

  return (
    <div className="flex flex-col gap-6 p-2 lg:p-4 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Grid className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">Tabula Recta de Vigenère y Beaufort</h2>
            <p className="text-xs text-slate-400 font-mono">Sustitución Polialfabética Periódica · Matriz {m}×{m}</p>
          </div>
        </div>

        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
          <button
            onClick={() => setVariant('vigenere')}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg transition ${
              variant === 'vigenere' ? 'bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Vigenère Clásico
          </button>
          <button
            onClick={() => setVariant('beaufort')}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg transition ${
              variant === 'beaufort' ? 'bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cifrador Beaufort
          </button>
          <button
            onClick={() => setVariant('autokey')}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg transition ${
              variant === 'autokey' ? 'bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Autoclave
          </button>
        </div>
      </div>

      {/* Top Controls Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Palabra Clave (K):</label>
            <input
              type="text"
              value={key}
              onChange={e => setKey(e.target.value.toUpperCase())}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-sky-300 focus:outline-none focus:border-sky-500"
            />
          </div>
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Longitud clave (m):</span>
            <span className="font-bold text-sky-400">{key.length} caracteres</span>
          </div>
        </div>

        <div className="md:col-span-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Texto ({direction === 'encrypt' ? 'Claro' : 'Cifrado'}):</span>
            <div className="flex rounded-lg bg-slate-950 p-0.5 border border-slate-800">
              <button
                onClick={() => setDirection('encrypt')}
                className={`px-2.5 py-0.5 text-xs font-mono rounded transition ${
                  direction === 'encrypt' ? 'bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30' : 'text-slate-400'
                }`}
              >
                Cifrar
              </button>
              <button
                onClick={() => setDirection('decrypt')}
                className={`px-2.5 py-0.5 text-xs font-mono rounded transition ${
                  direction === 'decrypt' ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30' : 'text-slate-400'
                }`}
              >
                Descifrar
              </button>
            </div>
          </div>
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-sky-500"
          />
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500">Resultado:</span>
            <span className="font-mono text-sm font-bold text-emerald-400 tracking-wider">
              {result.formattedOutput || '---'}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Matrix Tabula Recta */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            Matriz Tabula Recta Completa ({m} × {m})
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            Fila = Clave (K) · Columna = Texto Claro (M) · Celda = Cifrado (C)
          </span>
        </div>

        <div className="overflow-x-auto pb-2 max-h-[420px]">
          <div className="inline-block border border-slate-800 rounded-xl overflow-hidden">
            <table className="border-collapse text-[10px] font-mono">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800">
                  <th className="p-1.5 text-slate-600 bg-slate-900 border-r border-slate-800 font-bold">K\M</th>
                  {alpha.split('').map((colChar, cIdx) => (
                    <th
                      key={`th-col-${cIdx}`}
                      className={`p-1 text-center min-w-[22px] transition ${
                        activeCoords?.col === cIdx ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {colChar}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {alpha.split('').map((rowChar, rIdx) => (
                  <tr key={`tr-row-${rIdx}`} className="border-b border-slate-800/40">
                    <td
                      className={`p-1 text-center font-bold border-r border-slate-800 bg-slate-950 transition ${
                        activeCoords?.row === rIdx ? 'bg-sky-500/20 text-sky-300' : 'text-slate-400'
                      }`}
                    >
                      {rowChar}
                    </td>
                    {alpha.split('').map((_, cIdx) => {
                      const cellChar = alpha[(rIdx + cIdx) % m];
                      const isHighlighted = activeCoords?.row === rIdx && activeCoords?.col === cIdx;
                      const isRowOrCol = activeCoords?.row === rIdx || activeCoords?.col === cIdx;

                      return (
                        <td
                          key={`cell-${rIdx}-${cIdx}`}
                          onMouseEnter={() => setActiveCoords({ row: rIdx, col: cIdx })}
                          onMouseLeave={() => setActiveCoords(null)}
                          className={`p-1 text-center cursor-pointer transition ${
                            isHighlighted
                              ? 'bg-emerald-500 text-slate-950 font-bold scale-110 shadow-lg'
                              : isRowOrCol
                              ? 'bg-slate-800/60 text-slate-200'
                              : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
                          }`}
                        >
                          {cellChar}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
