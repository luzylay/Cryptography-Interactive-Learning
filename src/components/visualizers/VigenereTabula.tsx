import React, { useState, useMemo, useEffect } from 'react';
import { AlphabetMode, ALPHABETS, formatInBlocks } from '../../crypto/alphabets';
import { processVigenere, VigenereVariant } from '../../crypto/ciphers/vigenere';
import { Grid, Key, Layers, Sparkles, Play, Pause, ChevronLeft, ChevronRight, RotateCcw, Info } from 'lucide-react';

interface VigenereTabulaProps {
  mode: AlphabetMode;
}

export const VigenereTabula: React.FC<VigenereTabulaProps> = ({ mode }) => {
  const [key, setKey] = useState<string>('CLAVE');
  const [inputText, setInputText] = useState<string>('ATACAMOS MANANA');
  const [direction, setDirection] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [variant, setVariant] = useState<VigenereVariant>('vigenere');
  const [hoveredCoords, setHoveredCoords] = useState<{ row: number; col: number } | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const m = ALPHABETS[mode].mod;
  const alpha = ALPHABETS[mode].chars;

  const result = useMemo(() => {
    return processVigenere(inputText, key, mode, direction, variant);
  }, [inputText, key, mode, direction, variant]);

  // Keep active step index in bounds
  useEffect(() => {
    if (result.steps.length === 0) {
      setActiveStepIndex(0);
      setIsPlaying(false);
    } else if (activeStepIndex >= result.steps.length) {
      setActiveStepIndex(0);
    }
  }, [result.steps.length, activeStepIndex]);

  // Autoplay animation
  useEffect(() => {
    if (!isPlaying || result.steps.length === 0) return;

    const timer = setInterval(() => {
      setActiveStepIndex(prev => (prev + 1) % result.steps.length);
    }, 1500);

    return () => clearInterval(timer);
  }, [isPlaying, result.steps.length]);

  const currentStep = result.steps[activeStepIndex] || null;

  // Active coordinates from hover or currently selected step
  const activeCoords = useMemo(() => {
    if (hoveredCoords) return hoveredCoords;
    if (!currentStep) return null;
    return {
      row: currentStep.keyIndex,
      col: direction === 'encrypt' ? currentStep.plainIndex : currentStep.cipherIndex,
    };
  }, [hoveredCoords, currentStep, direction]);

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
            <p className="text-xs text-slate-400 font-mono">
              Sustitución Polialfabética Periódica · Matriz {m}×{m} · <span className="text-sky-400 font-mono text-[10px]">Fuente APA 7: Vigenère (1586); Ramió Aguirre (1999, pp. 19–25)</span>
            </p>
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
            <span>Longitud clave (L = |K|):</span>
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

      {/* Interactive Letter Strip & Step Player */}
      {result.steps.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-slate-100">
                Reproductor de Procedimiento en Vivo
              </h3>
              <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
                Paso {activeStepIndex + 1} de {result.steps.length}
              </span>
            </div>

            {/* Stepper Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveStepIndex(prev => Math.max(0, prev - 1))}
                disabled={activeStepIndex === 0}
                className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:hover:text-slate-300 transition"
                title="Paso Anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                  isPlaying
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5" /> Pausar
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" /> Animar
                  </>
                )}
              </button>

              <button
                onClick={() => setActiveStepIndex(prev => (prev + 1) % result.steps.length)}
                className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white transition"
                title="Paso Siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setActiveStepIndex(0);
                  setIsPlaying(false);
                }}
                className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 transition"
                title="Reiniciar"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Letter Strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
            {result.steps.map((s, idx) => {
              const isActive = idx === activeStepIndex;
              return (
                <button
                  key={`strip-${idx}`}
                  onClick={() => {
                    setActiveStepIndex(idx);
                    setIsPlaying(false);
                  }}
                  className={`flex flex-col items-center justify-center min-w-[40px] px-2 py-1.5 rounded-xl text-xs font-mono transition border ${
                    isActive
                      ? 'bg-sky-500/30 text-white font-bold border-sky-400 shadow-md ring-2 ring-sky-500/50 scale-105'
                      : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className="text-[10px] text-slate-500">#{idx + 1}</span>
                  <span className="text-amber-300 font-bold">{s.plainChar}</span>
                  <span className="text-[10px] text-sky-400">+{s.keyChar}</span>
                  <span className="text-emerald-400 font-bold border-t border-slate-800 w-full text-center mt-0.5 pt-0.5">
                    {s.cipherChar}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Step Narrative Banner */}
          {currentStep && (
            <div className="bg-slate-950/80 border border-sky-500/30 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="text-slate-300">
                  {direction === 'encrypt' ? (
                    <>
                      Buscamos Columna <strong className="text-amber-300">'{currentStep.plainChar}'</strong> (Índice {currentStep.plainIndex}) con Fila de Clave <strong className="text-sky-300">'{currentStep.keyChar}'</strong> (Índice {currentStep.keyIndex}) $\implies$ Intersección en Celda <strong className="text-emerald-400">'{currentStep.cipherChar}'</strong>.
                    </>
                  ) : (
                    <>
                      En Fila de Clave <strong className="text-sky-300">'{currentStep.keyChar}'</strong> (Índice {currentStep.keyIndex}), ubicamos la Celda <strong className="text-emerald-400">'{currentStep.cipherChar}'</strong> y subimos a la Columna <strong className="text-amber-300">'{currentStep.plainChar}'</strong> (Índice {currentStep.plainIndex}).
                    </>
                  )}
                </span>
              </div>
              <div className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-sky-300 font-bold">
                {currentStep.sumFormula}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Interactive Matrix Tabula Recta with Live Crosshair */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            Matriz Tabula Recta Completa ({m} × {m})
          </h3>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-sky-300">
              <span className="w-2.5 h-2.5 rounded bg-sky-500 inline-block"></span>
              Fila: Clave (K) = {activeCoords ? alpha[activeCoords.row] : '---'}
            </span>
            <span className="flex items-center gap-1.5 text-amber-300">
              <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block"></span>
              Columna: Texto Claro (M) = {activeCoords ? alpha[activeCoords.col] : '---'}
            </span>
            <span className="flex items-center gap-1.5 text-emerald-300">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block"></span>
              Intersección (C) = {activeCoords ? alpha[(activeCoords.row + activeCoords.col) % m] : '---'}
            </span>
          </div>
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
                        activeCoords?.col === cIdx
                          ? 'bg-amber-500/30 text-amber-200 font-bold ring-1 ring-amber-400/80 shadow-md'
                          : 'text-slate-400'
                      }`}
                    >
                      {colChar}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {alpha.split('').map((rowChar, rIdx) => {
                  const isRowActive = activeCoords?.row === rIdx;
                  return (
                    <tr key={`tr-row-${rIdx}`} className="border-b border-slate-800/40">
                      <td
                        className={`p-1 text-center font-bold border-r border-slate-800 bg-slate-950 transition ${
                          isRowActive
                            ? 'bg-sky-500/30 text-sky-200 font-bold ring-1 ring-sky-400/80 shadow-md'
                            : 'text-slate-400'
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
                            onMouseEnter={() => setHoveredCoords({ row: rIdx, col: cIdx })}
                            onMouseLeave={() => setHoveredCoords(null)}
                            className={`p-1 text-center cursor-pointer transition ${
                              isHighlighted
                                ? 'bg-emerald-500 text-slate-950 font-black scale-125 shadow-xl ring-2 ring-white z-10 relative rounded-sm animate-pulse'
                                : isRowOrCol
                                ? isRowActive
                                  ? 'bg-sky-500/15 text-sky-200 font-semibold'
                                  : 'bg-amber-500/15 text-amber-200 font-semibold'
                                : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
                            }`}
                          >
                            {cellChar}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Educational Pedagogical Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Por qué contamos desde cero */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sky-400 font-semibold text-sm">
            <Key className="w-4 h-4" />
            <h4>¿Por qué se cuenta desde el Cero ($A = 0$)?</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            En la aritmética modular base <strong>$m = {m}$</strong>, los posibles residuos al dividir van exactamente desde <strong>$0$ hasta ${m - 1}$</strong>.
          </p>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-300 flex flex-col gap-1">
            <div className="text-sky-400 font-bold">Fórmula: $C_i = (M_i + K_i) \pmod {m}$</div>
            <div className="text-slate-400 text-[11px]">• $M_i$: Posición de la letra del mensaje ($0 \dots {m - 1}$)</div>
            <div className="text-slate-400 text-[11px]">• $K_i$: Posición de la letra de la clave ($0 \dots {m - 1}$)</div>
            <div className="text-slate-400 text-[11px]">• $0$: Elemento neutro aditivo ($A = 0 \implies$ no desplaza)</div>
          </div>
        </div>

        {/* Card 2: De qué depende la periodicidad */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
            <Layers className="w-4 h-4" />
            <h4>¿De qué depende la Periodicidad?</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Depende <strong>únicamente de la longitud de la clave ($L = |K|$)</strong>. Tu clave actual <code>"{key || '---'}"</code> tiene longitud <strong>$L = {key.length}$</strong>.
          </p>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-300 flex flex-col gap-2">
            <div className="text-amber-400 font-bold">Efecto de $L = {key.length}$ Césares entrelazados:</div>
            <div className="flex flex-wrap gap-1 text-[11px]">
              {Array.from({ length: Math.min(key.length || 1, 8) }).map((_, i) => (
                <span key={`chan-${i}`} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  Canal #{i + 1}: K[{i}] = <strong>{key[i] || '?'}</strong>
                </span>
              ))}
              {key.length > 8 && <span className="text-slate-500">+{key.length - 8} más...</span>}
            </div>
            <div className="text-slate-400 text-[10px] mt-1">
              * El <strong>Test de Kasiski</strong> encuentra distancias $D$ entre palabras repetidas para deducir este periodo $L$.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
