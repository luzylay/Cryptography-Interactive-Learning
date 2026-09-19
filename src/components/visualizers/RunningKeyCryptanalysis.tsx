import React, { useState, useMemo } from 'react';
import { AlphabetMode, ALPHABETS } from '../../crypto/alphabets';
import {
  performCribDragging,
  solveAutokeyCascade,
  autoCrackAutokey,
} from '../../crypto/runningKeyCryptanalysis';
import { useClipboard } from '../../hooks/useClipboard';
import {
  Search,
  Sparkles,
  Key,
  Layers,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Wand2,
  Copy,
  Check,
  Zap,
  Sliders,
  BookOpen,
} from 'lucide-react';

interface RunningKeyCryptanalysisProps {
  mode: AlphabetMode;
}

const PRESET_CIPHERS = [
  {
    name: 'Autoclave Español (Semilla: CLAVE)',
    text: 'CVNDOUEÑMSYAAWRGZMSL',
    crib: 'ATAQUE',
    seed: 'CLAVE',
    desc: 'Texto original: "ATACAMOS MANANA AL ALBA" con semilla "CLAVE"',
  },
  {
    name: 'Clave Continua / Running Key (Español)',
    text: 'UVSVRLOQZJMFEXGTHVBMQ',
    crib: 'SECRET',
    seed: 'LIBRO',
    desc: 'Texto cifrado con un fragmento continuo de texto real como clave',
  },
  {
    name: 'Autoclave Inglés (Seed: RED)',
    text: 'TMWRJVIHVZEWXVX',
    crib: 'ATTACK',
    seed: 'RED',
    desc: 'Plaintext: "ATTACK AT DAWN TODAY" with seed "RED"',
  },
];

const COMMON_CRIBS_ES = ['QUE', 'DE', 'LOS', 'CON', 'PARA', 'ESTE', 'SECRET', 'ATAQUE', 'MANANA', 'CLAVE'];
const COMMON_CRIBS_EN = ['THE', 'AND', 'THAT', 'WITH', 'HAVE', 'ATTACK', 'SECRET', 'SYSTEM', 'REPORT'];

export const RunningKeyCryptanalysis: React.FC<RunningKeyCryptanalysisProps> = ({ mode }) => {
  const [activeTab, setActiveTab] = useState<'crib' | 'autokey_cascade'>('crib');

  // Crib Dragging State
  const [ciphertext, setCiphertext] = useState<string>(PRESET_CIPHERS[0].text);
  const [crib, setCrib] = useState<string>(PRESET_CIPHERS[0].crib);
  const [dragIndex, setDragIndex] = useState<number>(0);

  // Autokey Cascade State
  const [autokeyCipher, setAutokeyCipher] = useState<string>(PRESET_CIPHERS[0].text);
  const [candidateSeed, setCandidateSeed] = useState<string>('CLAVE');

  const { copy, isCopied } = useClipboard();

  const m = ALPHABETS[mode].mod;
  const alpha = ALPHABETS[mode].chars;

  // Crib Dragging calculation
  const cribAnalysis = useMemo(() => {
    return performCribDragging(ciphertext, crib, mode);
  }, [ciphertext, crib, mode]);

  // Clamp dragIndex
  const safeDragIndex = Math.min(
    Math.max(0, dragIndex),
    Math.max(0, ciphertext.length - (crib.length || 1))
  );

  const currentCribResult = cribAnalysis.results[safeDragIndex] || null;

  // Autokey cascade calculation
  const cascadeResult = useMemo(() => {
    return solveAutokeyCascade(autokeyCipher, candidateSeed, mode);
  }, [autokeyCipher, candidateSeed, mode]);

  // Auto-crack suggestions
  const autoCrackedCandidates = useMemo(() => {
    return autoCrackAutokey(autokeyCipher, mode, 6);
  }, [autokeyCipher, mode]);

  const commonCribs = mode === 'en26' ? COMMON_CRIBS_EN : COMMON_CRIBS_ES;

  return (
    <div className="flex flex-col gap-6 p-2 lg:p-4 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">
              Criptoanálisis de Clave Continua y Autoclave
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Ataque de Palabra Probable (Crib Dragging) · Resolución en Cascada · Alfabeto {mode.toUpperCase()} ({m} caracteres)
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
          <button
            onClick={() => setActiveTab('crib')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono rounded-lg transition ${
              activeTab === 'crib'
                ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            1. Arrastre de Palabra Probable (Crib Dragging)
          </button>
          <button
            onClick={() => setActiveTab('autokey_cascade')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono rounded-lg transition ${
              activeTab === 'autokey_cascade'
                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            2. Reacción en Cascada (Autoclave Cracker)
          </button>
        </div>
      </div>

      {/* Preset Quick Loader */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900/40 border border-slate-800/80 p-3 rounded-xl text-xs font-mono">
        <span className="text-slate-400 flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5 text-sky-400" />
          Ejemplos guiados:
        </span>
        {PRESET_CIPHERS.map((preset, idx) => (
          <button
            key={`preset-${idx}`}
            onClick={() => {
              setCiphertext(preset.text);
              setCrib(preset.crib);
              setAutokeyCipher(preset.text);
              setCandidateSeed(preset.seed);
              setDragIndex(0);
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-purple-500/40 text-slate-300 hover:text-purple-300 transition text-[11px]"
            title={preset.desc}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* TAB 1: CRIB DRAGGING */}
      {activeTab === 'crib' && (
        <div className="flex flex-col gap-6">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Ciphertext Input */}
            <div className="md:col-span-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2.5">
              <label className="text-xs font-mono text-slate-300 font-semibold flex items-center justify-between">
                <span>Criptograma Cifrado (C):</span>
                <span className="text-[11px] text-slate-400">{ciphertext.length} caracteres</span>
              </label>
              <input
                type="text"
                value={ciphertext}
                onChange={e => {
                  setCiphertext(e.target.value.toUpperCase());
                  setDragIndex(0);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm font-mono text-amber-300 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>

            {/* Crib Input */}
            <div className="md:col-span-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2.5">
              <label className="text-xs font-mono text-slate-300 font-semibold flex items-center justify-between">
                <span>Palabra Probable (Crib):</span>
                <span className="text-[11px] text-purple-400 font-bold">{crib.length} letras</span>
              </label>
              <input
                type="text"
                value={crib}
                onChange={e => {
                  setCrib(e.target.value.toUpperCase());
                  setDragIndex(0);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm font-mono text-sky-300 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
              <div className="flex flex-wrap gap-1 mt-1">
                <span className="text-[10px] font-mono text-slate-500">Sugerencias:</span>
                {commonCribs.slice(0, 5).map(c => (
                  <button
                    key={c}
                    onClick={() => {
                      setCrib(c);
                      setDragIndex(0);
                    }}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400 hover:text-purple-300 hover:border-purple-500/40"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Visual Crib Overlay */}
          {ciphertext.length >= crib.length && crib.length > 0 && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 backdrop-blur-md">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-purple-400" />
                    Simulador Visual de Deslizamiento (Posición #{safeDragIndex + 1} de {cribAnalysis.totalPositions})
                  </h3>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                    Mueve el control deslizante o haz clic en cualquier letra para arrastrar la palabra probable sobre el texto
                  </p>
                </div>

                {currentCribResult && (
                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border flex items-center gap-1.5 ${
                      currentCribResult.verdict === 'alta'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : currentCribResult.verdict === 'media'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}
                  >
                    {currentCribResult.verdict === 'alta' ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5" />
                    )}
                    Probabilidad {currentCribResult.verdict.toUpperCase()} ({currentCribResult.score}%)
                  </span>
                )}
              </div>

              {/* Slider Controller */}
              <div className="flex items-center gap-3 px-1">
                <span className="text-xs font-mono text-slate-500">Pos 0</span>
                <input
                  type="range"
                  min={0}
                  max={Math.max(0, ciphertext.length - crib.length)}
                  value={safeDragIndex}
                  onChange={e => setDragIndex(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer h-2 bg-slate-950 rounded-lg appearance-none"
                />
                <span className="text-xs font-mono text-slate-500">
                  Pos {Math.max(0, ciphertext.length - crib.length)}
                </span>
              </div>

              {/* Multi-Layered Visual Text Alignment */}
              <div className="overflow-x-auto pb-2">
                <div className="inline-flex flex-col gap-2 min-w-full font-mono text-xs">
                  {/* Row 1: Ciphertext Characters */}
                  <div className="flex items-center gap-1">
                    <span className="w-24 text-[11px] font-bold text-amber-400 shrink-0">Criptograma (C):</span>
                    {ciphertext.split('').map((char, idx) => {
                      const isTarget = idx >= safeDragIndex && idx < safeDragIndex + crib.length;
                      return (
                        <button
                          key={`c-${idx}`}
                          onClick={() => {
                            if (idx <= ciphertext.length - crib.length) {
                              setDragIndex(idx);
                            }
                          }}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition border ${
                            isTarget
                              ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-sm ring-1 ring-amber-400/50 scale-105'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {char}
                        </button>
                      );
                    })}
                  </div>

                  {/* Row 2: Crib Overlay */}
                  <div className="flex items-center gap-1">
                    <span className="w-24 text-[11px] font-bold text-sky-400 shrink-0">Palabra (Crib):</span>
                    {ciphertext.split('').map((_, idx) => {
                      const cribOffset = idx - safeDragIndex;
                      const isCribChar = cribOffset >= 0 && cribOffset < crib.length;
                      return (
                        <div
                          key={`crib-${idx}`}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition border ${
                            isCribChar
                              ? 'bg-sky-500/20 text-sky-300 border-sky-400 shadow-md ring-1 ring-sky-400/60'
                              : 'bg-transparent text-transparent border-transparent'
                          }`}
                        >
                          {isCribChar ? crib[cribOffset] : ''}
                        </div>
                      );
                    })}
                  </div>

                  {/* Row 3: Resulting Key Complement */}
                  <div className="flex items-center gap-1 border-t border-slate-800/80 pt-2">
                    <span className="w-24 text-[11px] font-bold text-emerald-400 shrink-0">Clave Resultante:</span>
                    {ciphertext.split('').map((_, idx) => {
                      const cribOffset = idx - safeDragIndex;
                      const isResultChar = cribOffset >= 0 && cribOffset < crib.length && currentCribResult;
                      const resultChar = isResultChar ? currentCribResult.candidateKey[cribOffset] : '';

                      return (
                        <div
                          key={`res-${idx}`}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition border ${
                            isResultChar
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 shadow-md scale-105'
                              : 'bg-transparent text-transparent border-transparent'
                          }`}
                        >
                          {resultChar}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Narrative Diagnostic for Selected Position */}
              {currentCribResult && (
                <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="text-slate-300">
                      En posición #{safeDragIndex}: Si el texto original dice <strong className="text-sky-300">"{currentCribResult.crib}"</strong>, la clave continua en ese tramo tuvo que ser <strong className="text-emerald-400">"{currentCribResult.candidateKey}"</strong>.
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 italic">
                    {currentCribResult.explanation}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Ranking Table of Top Candidate Positions */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Tabla de Clasificación de Posiciones (Ranking por Probabilidad Lingüística)
            </h3>

            <div className="overflow-x-auto max-h-[320px] rounded-xl border border-slate-800">
              <table className="w-full text-xs font-mono text-left border-collapse">
                <thead className="bg-slate-950 text-slate-400 sticky top-0 z-10 border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">Posición</th>
                    <th className="p-2.5">Fragmento Cifrado (C)</th>
                    <th className="p-2.5">Palabra Probable (M)</th>
                    <th className="p-2.5">Clave Deducida (K)</th>
                    <th className="p-2.5">Puntaje</th>
                    <th className="p-2.5">Diagnóstico</th>
                    <th className="p-2.5 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {[...cribAnalysis.results]
                    .sort((a, b) => b.score - a.score)
                    .map((item, idx) => (
                      <tr
                        key={`rank-${idx}`}
                        className={`hover:bg-slate-800/40 transition ${
                          item.position === safeDragIndex ? 'bg-purple-500/10' : ''
                        }`}
                      >
                        <td className="p-2.5 font-bold text-slate-300">#{item.position}</td>
                        <td className="p-2.5 text-amber-300 font-bold">{item.cipherChunk}</td>
                        <td className="p-2.5 text-sky-300">{item.crib}</td>
                        <td className="p-2.5 text-emerald-400 font-bold tracking-wider">{item.candidateKey}</td>
                        <td className="p-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                              <div
                                className={`h-full ${
                                  item.score >= 60 ? 'bg-emerald-400' : item.score >= 35 ? 'bg-amber-400' : 'bg-rose-400'
                                }`}
                                style={{ width: `${item.score}%` }}
                              />
                            </div>
                            <span className="text-[11px] text-slate-300">{item.score}%</span>
                          </div>
                        </td>
                        <td className="p-2.5">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                              item.verdict === 'alta'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : item.verdict === 'media'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {item.verdict.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-2.5 text-center">
                          <button
                            onClick={() => setDragIndex(item.position)}
                            className="text-[10px] px-2 py-1 rounded bg-slate-950 border border-slate-800 text-purple-300 hover:bg-purple-500/20 hover:border-purple-500/40 transition"
                          >
                            Ver en simulador
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AUTOKEY CASCADE */}
      {activeTab === 'autokey_cascade' && (
        <div className="flex flex-col gap-6">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2.5">
              <label className="text-xs font-mono text-slate-300 font-semibold">
                Criptograma Autoclave a Romper:
              </label>
              <input
                type="text"
                value={autokeyCipher}
                onChange={e => setAutokeyCipher(e.target.value.toUpperCase())}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm font-mono text-amber-300 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="md:col-span-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2.5">
              <label className="text-xs font-mono text-slate-300 font-semibold flex items-center justify-between">
                <span>Semilla Inicial Probada:</span>
                <span className="text-[11px] text-emerald-400 font-bold">L = {candidateSeed.length}</span>
              </label>
              <input
                type="text"
                value={candidateSeed}
                placeholder="Ej: CLAVE, K, RED..."
                onChange={e => setCandidateSeed(e.target.value.toUpperCase())}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm font-mono text-emerald-300 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Cascade Result Banner */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-slate-100">
                  Efecto Dominó en Cascada (Retroalimentación de Texto en Claro)
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border ${
                    cascadeResult.isValidLanguage
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}
                >
                  Puntaje de Legibilidad: {cascadeResult.score}%
                </span>

                {cascadeResult.plaintext && (
                  <button
                    onClick={() => copy(cascadeResult.plaintext, 'autokey-cascade')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white"
                  >
                    {isCopied('autokey-cascade') ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    Copiar
                  </button>
                )}
              </div>
            </div>

            {/* Plaintext Result */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-1.5 font-mono text-xs">
              <span className="text-slate-400 text-[11px]">Texto Descifrado Resultante:</span>
              <span className="text-sm font-bold text-emerald-400 tracking-wider break-all">
                {cascadeResult.plaintext || <span className="text-slate-600">Ingresa datos válidos</span>}
              </span>
            </div>

            {/* Step by Step Cascade Trace */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono text-slate-400">
                Paso a Paso de la Cascada (Observa cómo cada letra descifrada alimenta la clave siguiente):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 max-h-[260px] overflow-y-auto p-1">
                {cascadeResult.steps.map((st, idx) => (
                  <div
                    key={`step-${idx}`}
                    className={`p-2.5 rounded-xl border text-xs font-mono flex flex-col gap-1 ${
                      st.source === 'semilla'
                        ? 'bg-sky-500/10 border-sky-500/30 text-sky-300'
                        : 'bg-slate-950/80 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">#{idx + 1}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800">
                        {st.source === 'semilla' ? 'Clave de Semilla' : 'Clave de Texto Anterior'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-amber-300">C: {st.cipherChar}</span>
                      <span className="text-slate-500">-</span>
                      <span className="text-sky-300">K: {st.keyChar}</span>
                      <span className="text-slate-500">=</span>
                      <span className="text-emerald-400">M: {st.plainChar}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Auto-Cracked Suggestions */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-semibold text-slate-200">
                Auto-Crackeador de Semillas de Autoclave (Barrido Inteligente)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {autoCrackedCandidates.map((cand, idx) => (
                <div
                  key={`auto-${idx}`}
                  onClick={() => setCandidateSeed(cand.seed)}
                  className="bg-slate-950 p-3 rounded-xl border border-slate-800 hover:border-purple-500/50 cursor-pointer transition flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-sky-300">Semilla: "{cand.seed}"</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        cand.score >= 60 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      Score: {cand.score}%
                    </span>
                  </div>
                  <div className="text-xs font-mono text-emerald-400 font-bold truncate">
                    {cand.plaintext || '---'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Educational Explanatory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Por qué falla Kasiski */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
            <HelpCircle className="w-4 h-4" />
            <h4>¿Por qué el Test de Kasiski no funciona aquí?</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            En un cifrador de clave continua o autoclave, <strong>la clave nunca se repite de forma periódica corta</strong>. Al no existir un periodo fijo repetido, las distancias entre secuencias no tienen un divisor común, produciendo un Índice de Coincidencia plano (IC ≈ 0.0385).
          </p>
        </div>

        {/* Card 2: El secreto del Crib Dragging */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <Key className="w-4 h-4" />
            <h4>El Principio de los Dos Textos Reales</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Dado que <strong>C_i = (M_i + K_i) mod m</strong>, si restas una palabra probable del idioma (M_crib), la clave resultante (K_cand) <strong>también debe ser texto real en el mismo idioma</strong>. Si obtienes combinaciones imposibles (como QZ o WJ), descartas esa posición al instante.
          </p>
        </div>
      </div>
    </div>
  );
};
