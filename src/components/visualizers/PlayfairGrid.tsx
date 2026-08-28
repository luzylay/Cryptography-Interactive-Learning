import React, { useState, useMemo } from 'react';
import { processPlayfair, buildPlayfairMatrix, splitIntoDigrams, PLAYFAIR_DEFAULT_ALPHA } from '../../crypto/ciphers/playfair';
import { Grid, Sparkles, Layers, ArrowRight } from 'lucide-react';

export const PlayfairGrid: React.FC = () => {
  const [keyword, setKeyword] = useState<string>('CRIPTOGRAFIA');
  const [inputText, setInputText] = useState<string>('ATAQUE AL AMANECER');
  const [direction, setDirection] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [selectedPairIndex, setSelectedPairIndex] = useState<number | null>(0);

  const matrix = useMemo(() => buildPlayfairMatrix(keyword), [keyword]);
  const result = useMemo(() => processPlayfair(inputText, keyword, direction), [inputText, keyword, direction]);

  const activeStep = selectedPairIndex !== null && result.steps[selectedPairIndex] ? result.steps[selectedPairIndex] : null;

  return (
    <div className="flex flex-col gap-6 p-2 lg:p-4 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Grid className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">Cifrador de Playfair (Matriz 5×5)</h2>
            <p className="text-xs text-slate-400 font-mono">
              Sustitución Digrámica · 25 letras (I = J, Ñ → N) · <span className="text-violet-400 font-mono text-[10px]">Fuente APA 7: Playfair (1854); Ramió Aguirre (1999, pp. 26–28)</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-mono text-slate-400">Clave Matriz:</label>
          <input
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value.toUpperCase())}
            className="bg-slate-950 border border-slate-800 text-violet-300 font-mono text-sm px-3 py-1.5 rounded-xl focus:outline-none focus:border-violet-500"
          />
        </div>
      </div>

      {/* Grid and Interactive Digram Player */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 5x5 Matrix Visualizer */}
        <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center backdrop-blur-md">
          <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2 self-start">
            <Layers className="w-4 h-4 text-violet-400" />
            Matriz Clave 5×5
          </h3>

          <div className="grid grid-cols-5 gap-2.5 p-3 bg-slate-950 border border-slate-800 rounded-2xl shadow-xl">
            {matrix.map((char, idx) => {
              const r = Math.floor(idx / 5);
              const c = idx % 5;

              let isHighlight1 = activeStep && activeStep.pos1[0] === r && activeStep.pos1[1] === c;
              let isHighlight2 = activeStep && activeStep.pos2[0] === r && activeStep.pos2[1] === c;
              let isOut1 = activeStep && activeStep.outPos1[0] === r && activeStep.outPos1[1] === c;
              let isOut2 = activeStep && activeStep.outPos2[0] === r && activeStep.outPos2[1] === c;

              return (
                <div
                  key={`pf-cell-${idx}`}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono text-lg font-bold transition-all duration-200 ${
                    isHighlight1 || isHighlight2
                      ? 'bg-amber-500 text-slate-950 scale-110 shadow-lg ring-2 ring-amber-400'
                      : isOut1 || isOut2
                      ? 'bg-violet-500 text-slate-950 scale-105 ring-2 ring-violet-400'
                      : 'bg-slate-900/80 border border-slate-800 text-slate-200'
                  }`}
                >
                  {char}
                </div>
              );
            })}
          </div>

          {activeStep && (
            <div className="mt-4 w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-300">
              <span className="text-amber-400 font-bold block mb-1">
                Regla aplicada: {activeStep.rule.toUpperCase()}
              </span>
              <span>{activeStep.description}</span>
            </div>
          )}
        </div>

        {/* Digram Breakdown and Sandbox */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Texto ({direction === 'encrypt' ? 'Claro' : 'Cifrado'}):</span>
              <div className="flex rounded-lg bg-slate-950 p-0.5 border border-slate-800">
                <button
                  onClick={() => setDirection('encrypt')}
                  className={`px-3 py-1 text-xs font-mono rounded-md ${direction === 'encrypt' ? 'bg-violet-500/20 text-violet-400 font-bold' : 'text-slate-400'}`}
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

            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-violet-500"
            />

            <div>
              <span className="text-xs font-mono text-slate-400 block mb-1">Resultado:</span>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between font-mono text-sm text-emerald-400 font-bold">
                <span>{result.formattedOutput || '---'}</span>
              </div>
            </div>
          </div>

          {/* Digram Step Navigation */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
              Paso a Paso por Digramas (Pares de Letras)
            </h4>

            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
              {result.steps.map((st, i) => (
                <button
                  key={`pf-dg-${i}`}
                  onClick={() => setSelectedPairIndex(i)}
                  className={`px-3 py-2 rounded-xl font-mono text-xs flex items-center gap-2 border transition ${
                    selectedPairIndex === i
                      ? 'bg-violet-500/20 border-violet-500 text-violet-300 font-bold shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-amber-400">{st.inPair}</span>
                  <ArrowRight className="w-3 h-3 text-slate-600" />
                  <span className="text-emerald-400">{st.outPair}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
