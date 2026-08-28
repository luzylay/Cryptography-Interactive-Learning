import React, { useState, useMemo } from 'react';
import { AlphabetMode } from '../../crypto/alphabets';
import { processColumnarTransposition, processScytale } from '../../crypto/ciphers/transposition';
import { Columns, Cylinder, Sparkles, ArrowDown } from 'lucide-react';

interface ScytaleColumnarProps {
  mode: AlphabetMode;
}

export const ScytaleColumnar: React.FC<ScytaleColumnarProps> = ({ mode }) => {
  const [subType, setSubType] = useState<'columnar' | 'scytale'>('columnar');
  const [keyword, setKeyword] = useState<string>('ORDEN');
  const [diameter, setDiameter] = useState<number>(4);
  const [inputText, setInputText] = useState<string>('AL GRITO DE VIVA ZAPATA');
  const [direction, setDirection] = useState<'encrypt' | 'decrypt'>('encrypt');

  const columnarRes = useMemo(() => {
    return processColumnarTransposition(inputText, keyword, mode, direction);
  }, [inputText, keyword, mode, direction]);

  const scytaleRes = useMemo(() => {
    return processScytale(inputText, diameter, mode, direction);
  }, [inputText, diameter, mode, direction]);

  return (
    <div className="flex flex-col gap-6 p-2 lg:p-4 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            {subType === 'columnar' ? <Columns className="w-5 h-5" /> : <Cylinder className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">Cifradores por Transposición</h2>
            <p className="text-xs text-slate-400 font-mono">Reordenamiento geométrico sin sustitución de caracteres</p>
          </div>
        </div>

        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
          <button
            onClick={() => setSubType('columnar')}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg transition ${
              subType === 'columnar' ? 'bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30' : 'text-slate-400'
            }`}
          >
            Transposición por Columnas
          </button>
          <button
            onClick={() => setSubType('scytale')}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg transition ${
              subType === 'scytale' ? 'bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30' : 'text-slate-400'
            }`}
          >
            Escítala Espartana (Bastón)
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visualizer Panel */}
        <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col gap-4">
          {subType === 'columnar' ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-200">Rejilla de Columnas</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">Clave:</span>
                  <input
                    type="text"
                    value={keyword}
                    onChange={e => setKeyword(e.target.value.toUpperCase())}
                    className="bg-slate-950 border border-slate-800 text-rose-300 font-mono text-xs px-2.5 py-1 rounded-lg focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Column Grid UI */}
              <div className="overflow-x-auto p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <table className="border-collapse font-mono text-xs w-full text-center">
                  <thead>
                    <tr className="border-b border-slate-800 text-rose-400">
                      {columnarRes.gridInfo.keyword.split('').map((kChar, ki) => (
                        <th key={`k-${ki}`} className="p-2 font-bold bg-slate-900/80">
                          {kChar}
                        </th>
                      ))}
                    </tr>
                    <tr className="border-b border-slate-800 text-amber-400 text-[11px]">
                      {columnarRes.gridInfo.colOrder.map((ord, oi) => (
                        <th key={`ord-${oi}`} className="p-1 bg-amber-500/10">
                          #{ord}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {columnarRes.gridInfo.grid.map((row, ri) => (
                      <tr key={`r-${ri}`} className="border-b border-slate-800/40">
                        {row.map((cell, ci) => (
                          <td key={`c-${ri}-${ci}`} className="p-2 text-slate-200 hover:bg-rose-500/10">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-3 text-xs font-mono text-slate-400">
                Orden de lectura de columnas: {columnarRes.gridInfo.colIndicesSorted.map(i => keyword[i]).join(' → ')}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-200">Bastón Cilíndrico de Escítala</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">Diámetro (cols):</span>
                  <input
                    type="number"
                    min="2"
                    max="10"
                    value={diameter}
                    onChange={e => setDiameter(parseInt(e.target.value, 10) || 2)}
                    className="w-14 bg-slate-950 border border-slate-800 text-rose-300 font-mono text-xs px-2 py-1 rounded-lg focus:outline-none focus:border-rose-500 text-center"
                  />
                </div>
              </div>

              {/* Scytale Cylinder Rendering */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col items-center gap-2">
                <div className="w-full bg-amber-950/30 border border-amber-800/40 rounded-xl p-3 flex flex-col gap-1.5 font-mono text-xs text-amber-200">
                  <span className="text-[10px] text-amber-500 uppercase tracking-widest">
                    Cinta enrollada longitudinalmente:
                  </span>
                  <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${scytaleRes.numCols}, minmax(0, 1fr))` }}>
                    {scytaleRes.padded.split('').map((c, i) => (
                      <div
                        key={`scyt-${i}`}
                        className="p-2 rounded bg-amber-500/15 border border-amber-500/30 text-center font-bold text-amber-300"
                      >
                        {c}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sandbox and Result */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Texto ({direction === 'encrypt' ? 'Claro' : 'Cifrado'}):</span>
              <div className="flex rounded-lg bg-slate-950 p-0.5 border border-slate-800">
                <button
                  onClick={() => setDirection('encrypt')}
                  className={`px-3 py-1 text-xs font-mono rounded-md ${direction === 'encrypt' ? 'bg-rose-500/20 text-rose-400 font-bold' : 'text-slate-400'}`}
                >
                  Cifrar
                </button>
                <button
                  onClick={() => setDirection('decrypt')}
                  className={`px-3 py-1 text-xs font-mono rounded-md ${direction === 'decrypt' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-400'}`}
                >
                  Descifrar
                </button>
              </div>
            </div>

            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              rows={2}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-rose-500"
            />

            <div>
              <span className="text-xs font-mono text-slate-400 block mb-1">Resultado:</span>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between font-mono text-sm text-emerald-400 font-bold">
                <span>
                  {subType === 'columnar' ? columnarRes.formattedOutput : scytaleRes.formattedOutput}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
