import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { AlphabetMode, ALPHABETS, ALBERTI_HISTORICAL, normalizeText, formatInBlocks } from '../../crypto/alphabets';
import { generateExercise, ExerciseItem, ExerciseCipherType } from '../../crypto/exercises';
import { getAlbertiAlignmentOffset } from '../../crypto/ciphers/alberti';
import {
  GraduationCap,
  Sparkles,
  Trophy,
  Flame,
  HelpCircle,
  Eye,
  CheckCircle2,
  XCircle,
  RotateCcw,
  RotateCw,
  Compass,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';

interface PracticeQuizTabProps {
  mode: AlphabetMode;
}

/**
 * Dedicated Compact Disk Assistant for Practice & Quizzes
 * Focused purely on visual alignment, quick rotation, and character lookup without redundant sandboxes.
 */
const PracticeDiskAssistant: React.FC<{ mode: AlphabetMode }> = ({ mode }) => {
  const [rotation, setRotation] = useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStartAngle, setDragStartAngle] = useState<number>(0);
  const [dragStartRot, setDragStartRot] = useState<number>(0);
  const [alignOuter, setAlignOuter] = useState<string>('A');
  const [alignInner, setAlignInner] = useState<string>('A');

  const svgRef = useRef<SVGSVGElement | null>(null);

  const outerChars = useMemo(() => {
    return mode === 'alberti24' ? ALBERTI_HISTORICAL.outer : ALPHABETS[mode].chars;
  }, [mode]);

  const innerChars = useMemo(() => {
    return mode === 'alberti24' ? ALBERTI_HISTORICAL.inner.toUpperCase() : ALPHABETS[mode].chars;
  }, [mode]);

  const N = outerChars.length;
  const anglePerChar = 360 / N;

  const rotateStep = (delta: number) => {
    setRotation(prev => (prev + delta + N * 100) % N);
  };

  const handleAlign = (oChar: string, iChar: string) => {
    setAlignOuter(oChar);
    setAlignInner(iChar);
    const offset = getAlbertiAlignmentOffset(oChar, iChar, outerChars, innerChars);
    setRotation(offset);
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

    setIsDragging(true);
    setDragStartAngle(angle);
    setDragStartRot(rotation);
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const currentAngle = (Math.atan2(dy, dx) * 180) / Math.PI;

    const angleDiff = currentAngle - dragStartAngle;
    const stepDiff = Math.round(angleDiff / anglePerChar);
    const newRot = (dragStartRot - stepDiff + N * 100) % N;
    setRotation(newRot);
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as Element).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  const center = 250;
  const outerDiskRadius = 220;
  const outerTextRadius = 195;
  const innerDiskRadius = 160;
  const innerTextRadius = 135;
  const centerHubRadius = 60;

  const activeIndex = hoveredIndex !== null ? hoveredIndex : selectedIndex;
  const activeInnerIndex = activeIndex !== null ? (activeIndex - rotation + N * 100) % N : null;

  return (
    <div className="w-full flex flex-col items-center gap-3">
      {/* Quick Rotation Buttons Bar */}
      <div className="w-full flex items-center justify-between gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
        <div className="flex items-center gap-1">
          <button
            onClick={() => rotateStep(-5)}
            className="px-2 py-1 text-xs font-mono rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition"
            title="Girar 5 atrás"
          >
            -5
          </button>
          <button
            onClick={() => rotateStep(-1)}
            className="p-1.5 text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition"
            title="Girar 1 atrás"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-lg text-center">
          <span className="text-[9px] text-amber-500 block uppercase font-mono leading-none">Desfase</span>
          <span className="text-sm font-mono font-bold text-amber-300">k = {rotation}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => rotateStep(1)}
            className="p-1.5 text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition"
            title="Girar 1 adelante"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => rotateStep(5)}
            className="px-2 py-1 text-xs font-mono rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition"
            title="Girar 5 adelante"
          >
            +5
          </button>
        </div>
      </div>

      {/* SVG Interactive Wheel */}
      <div className="relative w-full max-w-[320px] sm:max-w-[380px] aspect-square flex items-center justify-center select-none touch-none">
        <svg
          ref={svgRef}
          viewBox="0 0 500 500"
          className="w-full h-full cursor-grab active:cursor-grabbing drop-shadow-xl transition-transform"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <defs>
            <radialGradient id="quizOuterGrad" cx="50%" cy="50%" r="50%">
              <stop offset="60%" stopColor="#0f172a" />
              <stop offset="90%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#334155" />
            </radialGradient>
            <radialGradient id="quizInnerGrad" cx="50%" cy="50%" r="50%">
              <stop offset="40%" stopColor="#090d16" />
              <stop offset="85%" stopColor="#131e36" />
              <stop offset="100%" stopColor="#1e293b" />
            </radialGradient>
            <radialGradient id="quizHubGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#b45309" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>
          </defs>

          {/* Background Outer Ring */}
          <circle cx={center} cy={center} r={outerDiskRadius} fill="url(#quizOuterGrad)" stroke="#334155" strokeWidth="3" />
          <circle cx={center} cy={center} r={outerDiskRadius - 4} fill="none" stroke="#475569" strokeDasharray="3 4" strokeWidth="1" />

          {/* Outer Ring Characters */}
          {outerChars.split('').map((char, i) => {
            const angleDeg = i * anglePerChar - 90;
            const angleRad = (angleDeg * Math.PI) / 180;
            const xText = center + outerTextRadius * Math.cos(angleRad);
            const yText = center + outerTextRadius * Math.sin(angleRad);
            const isHighlighted = activeIndex === i;

            return (
              <g
                key={`q-outer-${char}-${i}`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setSelectedIndex(i)}
              >
                {isHighlighted && (
                  <circle cx={xText} cy={yText} r="14" fill="#f59e0b" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="1.5" />
                )}
                <text
                  x={xText}
                  y={yText}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isHighlighted ? '#fbbf24' : '#e2e8f0'}
                  fontSize={N > 26 ? '12' : '14'}
                  fontWeight={isHighlighted ? 'bold' : '600'}
                  fontFamily="'JetBrains Mono', monospace"
                >
                  {char}
                </text>
              </g>
            );
          })}

          {/* Rotating Inner Disk */}
          <g
            transform={`rotate(${rotation * anglePerChar} ${center} ${center})`}
            style={{ transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          >
            <circle cx={center} cy={center} r={innerDiskRadius} fill="url(#quizInnerGrad)" stroke="#0ea5e9" strokeWidth="2.5" strokeOpacity="0.6" />
            <circle cx={center} cy={center} r={innerDiskRadius - 3} fill="none" stroke="#38bdf8" strokeDasharray="2 3" strokeWidth="0.8" strokeOpacity="0.5" />

            {innerChars.split('').map((char, i) => {
              const angleDeg = i * anglePerChar - 90;
              const angleRad = (angleDeg * Math.PI) / 180;
              const xText = center + innerTextRadius * Math.cos(angleRad);
              const yText = center + innerTextRadius * Math.sin(angleRad);
              const isInnerHighlighted = activeInnerIndex === i;

              return (
                <g key={`q-inner-${char}-${i}`}>
                  {isInnerHighlighted && (
                    <circle cx={xText} cy={yText} r="13" fill="#38bdf8" fillOpacity="0.3" stroke="#38bdf8" strokeWidth="1.5" />
                  )}
                  <text
                    x={xText}
                    y={yText}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isInnerHighlighted ? '#38bdf8' : '#94a3b8'}
                    fontSize={N > 26 ? '11' : '13'}
                    fontWeight={isInnerHighlighted ? 'bold' : '500'}
                    fontFamily="'JetBrains Mono', monospace"
                  >
                    {char}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Alignment Ray */}
          {activeIndex !== null && activeInnerIndex !== null && (
            <g>
              {(() => {
                const angleDeg = activeIndex * anglePerChar - 90;
                const angleRad = (angleDeg * Math.PI) / 180;
                const xOuter = center + outerTextRadius * Math.cos(angleRad);
                const yOuter = center + outerTextRadius * Math.sin(angleRad);
                const xInner = center + innerTextRadius * Math.cos(angleRad);
                const yInner = center + innerTextRadius * Math.sin(angleRad);
                return (
                  <>
                    <line x1={xOuter} y1={yOuter} x2={xInner} y2={yInner} stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 2" />
                    <circle cx={xOuter} cy={yOuter} r="3.5" fill="#f59e0b" />
                    <circle cx={xInner} cy={yInner} r="3.5" fill="#38bdf8" />
                  </>
                );
              })()}
            </g>
          )}

          {/* Center Hub */}
          <circle cx={center} cy={center} r={centerHubRadius} fill="url(#quizHubGrad)" stroke="#f59e0b" strokeWidth="1.5" />
          <circle cx={center} cy={center} r={centerHubRadius - 12} fill="#090d16" stroke="#475569" strokeWidth="1" />
          <text x={center} y={center - 6} textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="bold" fontFamily="'JetBrains Mono', monospace">
            ALBERTI
          </text>
          <text x={center} y={center + 8} textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="'JetBrains Mono', monospace">
            k = {rotation}
          </text>
        </svg>
      </div>

      {/* Live Readout Pill */}
      {activeIndex !== null && activeInnerIndex !== null && (
        <div className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Exterior:</span>
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 font-bold rounded border border-amber-500/40">
              {outerChars[activeIndex]}
            </span>
            <span className="text-slate-600 font-bold">⟷</span>
            <span className="text-slate-400">Interior:</span>
            <span className="px-2 py-0.5 bg-sky-500/20 text-sky-300 font-bold rounded border border-sky-500/40">
              {innerChars[activeInnerIndex]}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 hidden sm:inline">k = {rotation}</span>
        </div>
      )}

      {/* Alignment Preset Dropdowns */}
      <div className="w-full flex items-center justify-between gap-2 pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400">
        <span className="flex-shrink-0">Alinear:</span>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <select
            value={alignOuter}
            onChange={e => handleAlign(e.target.value, alignInner)}
            className="bg-slate-950 text-slate-200 border border-slate-700 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-amber-500"
          >
            {outerChars.split('').map(c => (
              <option key={`q-opt-out-${c}`} value={c}>
                Ext: {c}
              </option>
            ))}
          </select>
          <span className="text-slate-500">con</span>
          <select
            value={alignInner}
            onChange={e => handleAlign(alignOuter, e.target.value)}
            className="bg-slate-950 text-slate-200 border border-slate-700 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-sky-500"
          >
            {innerChars.split('').map(c => (
              <option key={`q-opt-in-${c}`} value={c}>
                Int: {c}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export const PracticeQuizTab: React.FC<PracticeQuizTabProps> = ({ mode }) => {
  const [selectedCipher, setSelectedCipher] = useState<ExerciseCipherType | 'random'>('alberti');
  const [currentExercise, setCurrentExercise] = useState<ExerciseItem | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [showDiskAssistant, setShowDiskAssistant] = useState<boolean>(true);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);

  const newQuestion = useCallback(() => {
    const cipherPool: ExerciseCipherType[] = [
      'alberti',
      'cesar',
      'afin',
      'vigenere',
      'beaufort',
      'playfair',
      'hill',
      'transposicion',
      'escitala',
      'frecuencia',
    ];
    const type = selectedCipher === 'random' ? cipherPool[Math.floor(Math.random() * cipherPool.length)] : selectedCipher;
    const ex = generateExercise(type, mode);
    setCurrentExercise(ex);
    setUserAnswer('');
    setStatus('idle');
    setShowHint(false);
    setShowSolution(false);
  }, [selectedCipher, mode]);

  useEffect(() => {
    newQuestion();
  }, [selectedCipher, mode, newQuestion]);

  const checkAnswer = () => {
    if (!currentExercise || !userAnswer.trim()) return;
    setAttempts(a => a + 1);

    const cleanUser = currentExercise.mode === 'find_key' ? userAnswer.trim() : normalizeText(userAnswer, mode);
    const cleanExpected =
      currentExercise.mode === 'find_key'
        ? currentExercise.expectedAnswer.trim()
        : normalizeText(currentExercise.expectedAnswer, mode);

    if (cleanUser === cleanExpected) {
      setStatus('correct');
      setScore(s => s + 100 + streak * 20);
      setStreak(st => st + 1);
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {}
    } else {
      setStatus('incorrect');
      setStreak(0);
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-1 sm:p-2 lg:p-4 w-full max-w-7xl mx-auto pb-10">
      {/* Top Banner with Stats & Cipher Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-3 sm:p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-100">Estudio de Ejercicios y Evaluación</h2>
            <p className="text-[11px] sm:text-xs text-slate-400 font-mono">Entrena con retroalimentación inmediata y resolución paso a paso</p>
          </div>
        </div>

        {/* Stats Pills & Assistant Toggle */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-slate-950 border border-slate-800">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-mono font-bold text-amber-300">{score} pts</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-slate-950 border border-slate-800">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-xs font-mono font-bold text-orange-300">{streak} racha</span>
            </div>
          </div>
          <button
            onClick={() => setShowDiskAssistant(prev => !prev)}
            className={`flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-mono transition ${
              showDiskAssistant
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{showDiskAssistant ? 'Ocultar Disco' : 'Mostrar Disco'}</span>
          </button>
        </div>
      </div>

      {/* Cipher Selector Tabs (Responsive Carousel) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'alberti', label: 'Disco Alberti' },
          { id: 'cesar', label: 'César' },
          { id: 'afin', label: 'Afín' },
          { id: 'vigenere', label: 'Vigenère' },
          { id: 'beaufort', label: 'Beaufort' },
          { id: 'playfair', label: 'Playfair' },
          { id: 'hill', label: 'Hill' },
          { id: 'transposicion', label: 'Transposición' },
          { id: 'escitala', label: 'Escítala' },
          { id: 'frecuencia', label: 'Criptoanálisis' },
          { id: 'random', label: '★ Modo Aleatorio' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedCipher(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs whitespace-nowrap transition border flex-shrink-0 ${
              selectedCipher === tab.id
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Practice Area Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
        {/* Left: Question Card */}
        <div className={showDiskAssistant ? 'lg:col-span-7 flex flex-col gap-4' : 'lg:col-span-12 flex flex-col gap-4'}>
          {currentExercise && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6 backdrop-blur-md flex flex-col gap-4 sm:gap-5">
              {/* Question Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 gap-2">
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 truncate">
                  {currentExercise.title}
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono text-slate-500 uppercase flex-shrink-0">
                  {currentExercise.mode === 'encrypt' ? '▣ CIFRAR' : currentExercise.mode === 'decrypt' ? '▢ DESCIFRAR' : '🔍 DEDUCIR CLAVE'}
                </span>
              </div>

              {/* Question Body */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 sm:p-4">
                <p className="font-mono text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {currentExercise.question}
                </p>
              </div>

              {/* User Answer Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] sm:text-xs font-mono text-slate-400">
                  Tu Respuesta {currentExercise.mode !== 'find_key' ? '(sin espacios ni acentos)': ''}:
                </label>
                <textarea
                  value={userAnswer}
                  onChange={e => {
                    setUserAnswer(e.target.value);
                    setStatus('idle');
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) checkAnswer();
                  }}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition"
                  placeholder="Escribe tu resultado aquí..."
                />
              </div>

              {/* Responsive Action Buttons */}
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
                <button
                  onClick={checkAnswer}
                  disabled={!userAnswer.trim()}
                  className="col-span-2 sm:col-auto px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-mono text-xs font-bold hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-lg shadow-amber-500/10"
                >
                  Comprobar Respuesta
                </button>
                <button
                  onClick={newQuestion}
                  className="px-3 py-2 rounded-xl bg-slate-800 text-slate-200 font-mono text-xs hover:bg-slate-700 transition"
                >
                  Siguiente
                </button>
                <button
                  onClick={() => setShowHint(h => !h)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-sky-400 font-mono text-xs transition"
                >
                  <HelpCircle className="w-3.5 h-3.5 inline mr-1" />
                  {showHint ? 'Ocultar Pista' : 'Pista'}
                </button>
                <button
                  onClick={() => setShowSolution(s => !s)}
                  className="col-span-2 sm:col-auto px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-violet-400 font-mono text-xs transition"
                >
                  <Eye className="w-3.5 h-3.5 inline mr-1" />
                  {showSolution ? 'Ocultar Solución' : 'Ver Solución'}
                </button>
              </div>

              {/* Feedback Banner */}
              {status !== 'idle' && (
                <div
                  className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                    status === 'correct' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'
                  }`}
                >
                  {status === 'correct' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className={`font-mono text-xs sm:text-sm font-bold block ${status === 'correct' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {status === 'correct' ? '¡Excelente! Respuesta 100% Correcta' : 'Respuesta Incorrecta'}
                    </span>
                    {status === 'incorrect' && (
                      <p className="text-[11px] text-slate-300 font-mono mt-0.5">
                        Revisa tus rotaciones o cálculos modulares. Puedes abrir la pista o solución paso a paso.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Hint Box */}
              {showHint && (
                <div className="bg-sky-950/30 border border-sky-500/30 rounded-xl p-3.5 text-xs font-mono text-sky-200">
                  <span className="font-bold text-sky-400 block mb-1">Pista Orientativa:</span>
                  {currentExercise.hint}
                </div>
              )}

              {/* Detailed Solution Box */}
              {showSolution && (
                <div className="bg-violet-950/30 border border-violet-500/30 rounded-xl p-3.5 text-xs font-mono text-violet-200 flex flex-col gap-2">
                  <span className="font-bold text-violet-400 block">Demostración Paso a Paso:</span>
                  <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
                    {currentExercise.detailedSteps.map((st, i) => (
                      <div key={`sol-step-${i}`} className="p-1.5 rounded bg-slate-950/70 border border-slate-800/80 text-[11px]">
                        {st}
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-violet-500/20 flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-400">Respuesta Oficial:</span>
                    <span className="text-emerald-400 font-mono break-all">{currentExercise.expectedAnswer}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Embedded Dedicated Wheel Assistant */}
        {showDiskAssistant && (
          <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 sm:p-4 backdrop-blur-md flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                Asistente de Rueda
              </span>
              <span className="text-[10px] font-mono text-slate-500">Arrastra o usa botones</span>
            </div>
            <PracticeDiskAssistant mode={mode} />
          </div>
        )}
      </div>
    </div>
  );
};
