import React, { useState, useMemo, useEffect } from 'react';
import { AlphabetMode, ALPHABETS } from '../../crypto/alphabets';
import { processVigenere, VigenereVariant } from '../../crypto/ciphers/vigenere';
import { useClipboard } from '../../hooks/useClipboard';
import {
  Grid,
  Key,
  Layers,
  Sparkles,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Info,
  Copy,
  Check,
  ArrowRightLeft,
  HelpCircle,
} from 'lucide-react';

interface VigenereTabulaProps {
  mode: AlphabetMode;
}

const PERIOD_COLORS = [
  'border-sky-500/60 bg-sky-500/10 text-sky-300',
  'border-purple-500/60 bg-purple-500/10 text-purple-300',
  'border-emerald-500/60 bg-emerald-500/10 text-emerald-300',
  'border-amber-500/60 bg-amber-500/10 text-amber-300',
  'border-rose-500/60 bg-rose-500/10 text-rose-300',
  'border-cyan-500/60 bg-cyan-500/10 text-cyan-300',
  'border-indigo-500/60 bg-indigo-500/10 text-indigo-300',
  'border-lime-500/60 bg-lime-500/10 text-lime-300',
];

export const VigenereTabula: React.FC<VigenereTabulaProps> = ({ mode }) => {
  const [key, setKey] = useState<string>('CLAVE');
  const [inputText, setInputText] = useState<string>('ATACAMOS MANANA');
  const [direction, setDirection] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [variant, setVariant] = useState<VigenereVariant>('vigenere');
  const [hoveredCoords, setHoveredCoords] = useState<{ row: number; col: number } | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(1200); // ms per step

  const { copy, isCopied } = useClipboard();

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
    }, playSpeed);

    return () => clearInterval(timer);
  }, [isPlaying, result.steps.length, playSpeed]);

  const currentStep = result.steps[activeStepIndex] || null;

  // Active coordinates in the Tabula Recta:
  // - Vigenère / Autokey: Row = keyIndex (K), Col = plainIndex (M) -> Cell = cipherIndex (C)
  // - Beaufort: (M + C) mod m = K. Row = cipherIndex (C), Col = plainIndex (M) -> Cell = keyIndex (K)
  const activeCoords = useMemo(() => {
    if (hoveredCoords) return hoveredCoords;
    if (!currentStep) return null;

    if (variant === 'beaufort') {
      return {
        row: currentStep.cipherIndex,
        col: currentStep.plainIndex,
      };
    }

    return {
      row: currentStep.keyIndex,
      col: currentStep.plainIndex,
    };
  }, [hoveredCoords, currentStep, variant]);

  const handleSwapDirection = () => {
    if (result.outputText) {
      setInputText(result.outputText);
      setDirection(prev => (prev === 'encrypt' ? 'decrypt' : 'encrypt'));
      setActiveStepIndex(0);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-2 lg:p-4 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Grid className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">Tabula Recta de Vigenère, Beaufort y Autoclave</h2>
            <p className="text-xs text-slate-400 font-mono">
              Sustitución Polialfabética Periódica · Alfabeto {mode.toUpperCase()} ({m} caracteres) ·{' '}
              <span className="text-sky-400 font-mono text-[10px]">Fuente APA 7: Vigenère (1586); Kasiski (1863)</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap rounded-xl bg-slate-950 p-1 border border-slate-800 gap-1">
          <button
            onClick={() => {
              setVariant('vigenere');
              setActiveStepIndex(0);
            }}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg transition ${
              variant === 'vigenere'
                ? 'bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Vigenère Clásico
          </button>
          <button
            onClick={() => {
              setVariant('beaufort');
              setActiveStepIndex(0);
            }}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg transition ${
              variant === 'beaufort'
                ? 'bg-purple-500/20 text-purple-400 font-bold border border-purple-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cifrador Beaufort
          </button>
          <button
            onClick={() => {
              setVariant('autokey');
              setActiveStepIndex(0);
            }}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg transition ${
              variant === 'autokey'
                ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Autoclave
          </button>
        </div>
      </div>

      {/* Top Controls Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Key Input */}
        <div className="md:col-span-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-sky-400" />
                Palabra Clave (K):
              </label>
              <span className="text-[11px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                L = {key.length} {key.length === 1 ? 'letra' : 'letras'}
              </span>
            </div>
            <input
              type="text"
              value={key}
              placeholder="Ej: CLAVE, CIPHER, SECRETO..."
              onChange={e => setKey(e.target.value.toUpperCase())}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm font-mono text-sky-300 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
            />
          </div>

          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 flex flex-col gap-1 text-[11px] font-mono">
            <div className="flex items-center justify-between text-slate-400">
              <span>Periodicidad:</span>
              <span className="font-bold text-slate-200">
                {variant === 'autokey' ? 'No periódica (Autoclave)' : `Periodo fijo L = ${key.length || 0}`}
              </span>
            </div>
            {result.extendedKey && (
              <div className="flex items-center justify-between text-slate-400 truncate">
                <span className="shrink-0">Clave extendida:</span>
                <span className="text-sky-300 font-bold truncate ml-2" title={result.extendedKey}>
                  {result.extendedKey.slice(0, 16)}
                  {result.extendedKey.length > 16 ? '…' : ''}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Text Input and Output */}
        <div className="md:col-span-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-300 font-semibold">
              Texto ({direction === 'encrypt' ? 'Claro Original' : 'Criptograma Cifrado'}):
            </span>
            <div className="flex items-center gap-1.5">
              <div className="flex rounded-lg bg-slate-950 p-0.5 border border-slate-800">
                <button
                  onClick={() => {
                    setDirection('encrypt');
                    setActiveStepIndex(0);
                  }}
                  className={`px-3 py-1 text-xs font-mono rounded-md transition ${
                    direction === 'encrypt'
                      ? 'bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Cifrar
                </button>
                <button
                  onClick={() => {
                    setDirection('decrypt');
                    setActiveStepIndex(0);
                  }}
                  className={`px-3 py-1 text-xs font-mono rounded-md transition ${
                    direction === 'decrypt'
                      ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Descifrar
                </button>
              </div>

              {result.outputText && (
                <button
                  onClick={handleSwapDirection}
                  className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-sky-400 hover:border-sky-500/40 transition"
                  title="Invertir: usar resultado como entrada"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <input
            type="text"
            value={inputText}
            placeholder="Escribe el texto a procesar..."
            onChange={e => setInputText(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
          />

          {/* Output Display */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 px-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="text-xs font-mono text-slate-400 shrink-0">Resultado:</span>
              <span className="font-mono text-sm font-bold text-emerald-400 tracking-wider truncate">
                {result.formattedOutput || <span className="text-slate-600 font-normal">Sin entrada</span>}
              </span>
            </div>

            {result.outputText && (
              <button
                onClick={() => copy(result.outputText, 'vigenere-output')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-mono transition shrink-0"
              >
                {isCopied('vigenere-output') ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Letter Strip & Step Player */}
      {result.steps.length > 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-slate-100">
                Trazabilidad y Reproductor Paso a Paso
              </h3>
              <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800">
                Paso {activeStepIndex + 1} de {result.steps.length}
              </span>
            </div>

            {/* Stepper Controls & Speed */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Play Speed Toggle */}
              <div className="flex items-center rounded-lg bg-slate-950 p-0.5 border border-slate-800 text-[11px] font-mono">
                <button
                  onClick={() => setPlaySpeed(1800)}
                  className={`px-2 py-0.5 rounded ${playSpeed === 1800 ? 'bg-slate-800 text-sky-400 font-bold' : 'text-slate-400'}`}
                >
                  0.5x
                </button>
                <button
                  onClick={() => setPlaySpeed(1200)}
                  className={`px-2 py-0.5 rounded ${playSpeed === 1200 ? 'bg-slate-800 text-sky-400 font-bold' : 'text-slate-400'}`}
                >
                  1x
                </button>
                <button
                  onClick={() => setPlaySpeed(600)}
                  className={`px-2 py-0.5 rounded ${playSpeed === 600 ? 'bg-slate-800 text-sky-400 font-bold' : 'text-slate-400'}`}
                >
                  2x
                </button>
              </div>

              <div className="flex items-center gap-1">
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
                  title="Reiniciar al inicio"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Timeline Slider */}
          <div className="flex items-center gap-3 px-1">
            <span className="text-[10px] font-mono text-slate-500">1</span>
            <input
              type="range"
              min={0}
              max={Math.max(0, result.steps.length - 1)}
              value={activeStepIndex}
              onChange={e => {
                setActiveStepIndex(Number(e.target.value));
                setIsPlaying(false);
              }}
              className="w-full accent-sky-500 cursor-pointer h-1.5 bg-slate-950 rounded-lg appearance-none"
            />
            <span className="text-[10px] font-mono text-slate-500">{result.steps.length}</span>
          </div>

          {/* Interactive Letter Strip with Period Color Coding */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1 scrollbar-thin">
            {result.steps.map((s, idx) => {
              const isActive = idx === activeStepIndex;
              const periodChannel = key.length > 0 ? idx % key.length : 0;
              const colorClass = PERIOD_COLORS[periodChannel % PERIOD_COLORS.length];

              return (
                <button
                  key={`strip-${idx}`}
                  onClick={() => {
                    setActiveStepIndex(idx);
                    setIsPlaying(false);
                  }}
                  className={`flex flex-col items-center justify-center min-w-[44px] px-2 py-1.5 rounded-xl text-xs font-mono transition border ${
                    isActive
                      ? 'bg-sky-500/30 text-white font-bold border-sky-400 shadow-lg ring-2 ring-sky-500/60 scale-105 z-10'
                      : `${colorClass} hover:brightness-125`
                  }`}
                >
                  <span className="text-[9px] text-slate-400">#{idx + 1}</span>
                  <span className="font-bold text-slate-100">{s.plainChar}</span>
                  <span className="text-[10px] text-sky-400 font-semibold">+{s.keyChar}</span>
                  <span className="text-emerald-400 font-bold border-t border-slate-800/80 w-full text-center mt-0.5 pt-0.5">
                    {s.cipherChar}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Step Narrative Banner */}
          {currentStep && (
            <div className="bg-slate-950/90 border border-sky-500/30 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono shadow-inner">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shrink-0">
                  <Info className="w-4 h-4" />
                </div>
                <div className="text-slate-300 leading-relaxed">
                  {variant === 'beaufort' ? (
                    <>
                      <strong>Cifrador Beaufort:</strong> En Columna <strong className="text-amber-300">'{currentStep.plainChar}'</strong> (Índice {currentStep.plainIndex}) bajamos hasta la Clave <strong className="text-sky-300">'{currentStep.keyChar}'</strong> y leemos la Fila <strong className="text-emerald-400">'{currentStep.cipherChar}'</strong> (Índice {currentStep.cipherIndex}).
                    </>
                  ) : direction === 'encrypt' ? (
                    <>
                      <strong>Cifrado Vigenère:</strong> Cruzamos Columna de Mensaje <strong className="text-amber-300">'{currentStep.plainChar}'</strong> (Índice {currentStep.plainIndex}) con Fila de Clave <strong className="text-sky-300">'{currentStep.keyChar}'</strong> (Índice {currentStep.keyIndex}) $\implies$ Intersección en Celda <strong className="text-emerald-400">'{currentStep.cipherChar}'</strong>.
                    </>
                  ) : (
                    <>
                      <strong>Descifrado Vigenère:</strong> En Fila de Clave <strong className="text-sky-300">'{currentStep.keyChar}'</strong> (Índice {currentStep.keyIndex}) localizamos la Celda <strong className="text-emerald-400">'{currentStep.cipherChar}'</strong> y subimos a la Columna <strong className="text-amber-300">'{currentStep.plainChar}'</strong> (Índice {currentStep.plainIndex}).
                    </>
                  )}
                </div>
              </div>

              <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-sky-300 font-bold text-xs shadow-sm">
                {currentStep.sumFormula}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 text-center text-slate-400 text-xs font-mono">
          Escribe una palabra clave y un texto en los campos superiores para activar la trazabilidad en vivo.
        </div>
      )}

      {/* Interactive Matrix Tabula Recta with Live Crosshair */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-semibold text-slate-200">
              Matriz Tabula Recta Dinámica ({m} × {m})
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
              <span className="w-2 h-2 rounded-full bg-sky-400 inline-block"></span>
              Fila: {variant === 'beaufort' ? 'Cifrado (C)' : 'Clave (K)'} ={' '}
              <strong>{activeCoords ? alpha[activeCoords.row] : '---'}</strong>
            </span>
            <span className="flex items-center gap-1.5 text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
              Columna: Texto Claro (M) ={' '}
              <strong>{activeCoords ? alpha[activeCoords.col] : '---'}</strong>
            </span>
            <span className="flex items-center gap-1.5 text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
              Intersección: {variant === 'beaufort' ? 'Clave (K)' : 'Cifrado (C)'} ={' '}
              <strong>{activeCoords ? alpha[(activeCoords.row + activeCoords.col) % m] : '---'}</strong>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto pb-2 max-h-[440px] rounded-xl border border-slate-800/80">
          <table className="border-collapse text-[10px] font-mono w-full min-w-[650px]">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 sticky top-0 z-20 shadow">
                <th className="p-2 text-slate-400 bg-slate-900 border-r border-slate-800 font-bold text-center">
                  {variant === 'beaufort' ? 'C \\ M' : 'K \\ M'}
                </th>
                {alpha.split('').map((colChar, cIdx) => {
                  const isColActive = activeCoords?.col === cIdx;
                  return (
                    <th
                      key={`th-col-${cIdx}`}
                      className={`p-1.5 text-center min-w-[24px] transition ${
                        isColActive
                          ? 'bg-amber-500/30 text-amber-200 font-bold ring-1 ring-amber-400 shadow-md'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {colChar}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {alpha.split('').map((rowChar, rIdx) => {
                const isRowActive = activeCoords?.row === rIdx;
                return (
                  <tr key={`tr-row-${rIdx}`} className="border-b border-slate-800/40">
                    <td
                      className={`p-1.5 text-center font-bold border-r border-slate-800 bg-slate-950 sticky left-0 z-10 transition ${
                        isRowActive
                          ? 'bg-sky-500/30 text-sky-200 font-bold ring-1 ring-sky-400 shadow-md'
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
                          className={`p-1 text-center cursor-pointer transition select-none ${
                            isHighlighted
                              ? 'bg-emerald-500 text-slate-950 font-black scale-125 shadow-xl ring-2 ring-white z-10 relative rounded-sm animate-pulse'
                              : isRowOrCol
                              ? isRowActive
                                ? 'bg-sky-500/15 text-sky-200 font-semibold'
                                : 'bg-amber-500/15 text-amber-200 font-semibold'
                              : 'text-slate-500 hover:bg-slate-800/80 hover:text-slate-200'
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

      {/* Educational Pedagogical Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Por qué contamos desde cero */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sky-400 font-semibold text-sm">
            <Key className="w-4 h-4" />
            <h4>¿Por qué se indexa desde el Cero (A = 0)?</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            En la aritmética modular base <strong>m = {m}</strong>, los residuos de cualquier división forman el conjunto <strong>Z_{m} = {'{'}0, 1, 2, ..., {m - 1}{'}'}</strong>.
          </p>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-300 flex flex-col gap-1.5">
            <div className="text-sky-400 font-bold">
              Fórmula {variant === 'beaufort' ? 'Beaufort' : 'Vigenère'}:{' '}
              {variant === 'beaufort' ? 'C_i = (K_i - M_i) mod m' : 'C_i = (M_i + K_i) mod m'}
            </div>
            <div className="text-slate-400 text-[11px]">• M_i: Posición del texto en claro (0 ... {m - 1})</div>
            <div className="text-slate-400 text-[11px]">• K_i: Posición de la letra de clave (0 ... {m - 1})</div>
            <div className="text-slate-400 text-[11px]">• A = 0: Elemento neutro aditivo (M_i + 0 ≡ M_i)</div>
          </div>
        </div>

        {/* Card 2: De qué depende la periodicidad */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
            <Layers className="w-4 h-4" />
            <h4>¿De qué depende la Periodicidad?</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Depende <strong>únicamente de la longitud de la clave (L = |K|)</strong>. Tu clave actual <code>"{key || '---'}"</code> tiene longitud <strong>L = {key.length}</strong>.
          </p>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-300 flex flex-col gap-2">
            <div className="text-amber-400 font-bold">Efecto de L = {key.length} Césares entrelazados:</div>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              {Array.from({ length: Math.min(key.length || 1, 8) }).map((_, i) => {
                const colorClass = PERIOD_COLORS[i % PERIOD_COLORS.length];
                return (
                  <span
                    key={`chan-${i}`}
                    className={`px-2 py-0.5 rounded-lg border font-mono ${colorClass}`}
                  >
                    Canal #{i + 1}: K[{i}] = <strong>{key[i] || '?'}</strong>
                  </span>
                );
              })}
              {key.length > 8 && <span className="text-slate-500 text-xs">+{key.length - 8} canales más...</span>}
            </div>
            <div className="text-slate-400 text-[10px] mt-1 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                El <strong>Test de Kasiski</strong> halla el MCD de distancias repetidas para deducir este periodo L.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
