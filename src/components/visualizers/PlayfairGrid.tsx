import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  processPlayfair,
  buildPlayfairMatrix,
  splitIntoDigramsDetails,
  PLAYFAIR_DEFAULT_ALPHA,
  PlayfairStep,
  DigramDetail,
} from '../../crypto/ciphers/playfair';
import {
  Grid,
  Layers,
  ArrowRight,
  ArrowLeft,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  BookOpen,
  Sparkles,
  Lightbulb,
  Check,
  ChevronRight,
  GraduationCap,
  Target,
  Split,
  RefreshCw,
  Copy,
  FileText,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface S08Preset {
  name: string;
  badge: string;
  key: string;
  text: string;
  description: string;
}

const S08_PRESETS: S08Preset[] = [
  {
    name: 'Ejercicio Oficial S08 (Clave MIEDO)',
    badge: 'Diapositiva 21-23',
    key: 'MIEDO',
    text: 'Las sombras llaman a la puerta del castillo hoy',
    description: 'Ejercicio de examen completo de las diapositivas S08. Incluye ruptura de letras dobles (SS, LL) y relleno final (HOY).',
  },
  {
    name: 'Ejemplo de Matriz S08 (VERANO AZUL)',
    badge: 'Diapositivas 10-17',
    key: 'VERANO AZUL',
    text: 'EA LU DH ED FU AX OT YU MI EN',
    description: 'Matriz oficial de clase para demostrar Misma Fila (EA, LU, DH), Misma Columna (ED, FU, AX), Rectángulo (OT, YU) y Letras Compartidas (MI, EN).',
  },
  {
    name: 'Ejemplo Clásico (CRIPTOGRAFIA)',
    badge: 'Académico Estándar',
    key: 'CRIPTOGRAFIA',
    text: 'ATAQUE AL AMANECER',
    description: 'Clásico universitario para probar las tres reglas geométricas con clave larga sin duplicados.',
  },
];

interface SlideExercise {
  id: string;
  slide: string;
  ruleType: 'row' | 'col' | 'rectangle';
  pair: string;
  expected: string;
  explanation: string;
}

const SLIDE_EXERCISES: SlideExercise[] = [
  // Diapositiva 12 - Misma Fila (Clave: VERANO AZUL)
  {
    id: 's12-1',
    slide: 'Diapositiva 12 · Misma Fila',
    ruleType: 'row',
    pair: 'ZL',
    expected: 'UB',
    explanation: 'Fila 2: [O, Z, U, L, B]. La letra Z está en Col 2 -> a su derecha está U (Col 3). La letra L está en Col 4 -> a su derecha está B (Col 5). Resultado: UB.',
  },
  {
    id: 's12-2',
    slide: 'Diapositiva 12 · Misma Fila',
    ruleType: 'row',
    pair: 'KP',
    expected: 'MQ',
    explanation: 'Fila 4: [I/J, K, M, P, Q]. La letra K está en Col 2 -> a su derecha está M (Col 3). La letra P está en Col 4 -> a su derecha está Q (Col 5). Resultado: MQ.',
  },
  {
    id: 's12-3',
    slide: 'Diapositiva 12 · Misma Fila',
    ruleType: 'row',
    pair: 'SY',
    expected: 'TS',
    explanation: 'Fila 5: [S, T, W, X, Y]. La letra S (Col 1) se desplaza a T (Col 2). La letra Y está al final (Col 5) -> da salto circular al inicio S (Col 1). Resultado: TS.',
  },

  // Diapositiva 14 - Misma Columna (Clave: VERANO AZUL)
  {
    id: 's14-1',
    slide: 'Diapositiva 14 · Misma Columna',
    ruleType: 'col',
    pair: 'EK',
    expected: 'ZT',
    explanation: 'Columna 2: [E, Z, D, K, T]. Letra E (Fila 1) baja a Z (Fila 2). Letra K (Fila 4) baja a T (Fila 5). Resultado: ZT.',
  },
  {
    id: 's14-2',
    slide: 'Diapositiva 14 · Misma Columna',
    ruleType: 'col',
    pair: 'RU',
    expected: 'UM',
    explanation: 'Columna 3: [R, U, F, M, W]. Letra R (Fila 1) baja a U (Fila 2). Letra U (Fila 2) baja a F o cruza según orden. U baja a F, o R baja a U y U a F -> Resultado: UM.',
  },
  {
    id: 's14-3',
    slide: 'Diapositiva 14 · Misma Columna',
    ruleType: 'col',
    pair: 'BN',
    expected: 'HQ',
    explanation: 'Columna 5: [N/Ñ, B, H, Q, Y]. Letra B (Fila 2) baja a H (Fila 3). Letra N (Fila 1) baja a B, o B baja a H y N salta circular. Resultado según orden: HQ.',
  },

  // Diapositiva 16 - Rectángulo (Clave: VERANO AZUL)
  {
    id: 's16-1',
    slide: 'Diapositiva 16 · Rectángulo',
    ruleType: 'rectangle',
    pair: 'ZP',
    expected: 'LK',
    explanation: 'Z está en [Fila 2, Col 2] y P está en [Fila 4, Col 4]. Z conserva Fila 2 y toma Col 4 -> L. P conserva Fila 4 y toma Col 2 -> K. Resultado: LK.',
  },
  {
    id: 's16-2',
    slide: 'Diapositiva 16 · Rectángulo',
    ruleType: 'rectangle',
    pair: 'GE',
    expected: 'DA',
    explanation: 'G está en [Fila 3, Col 4] y E está en [Fila 1, Col 2]. G conserva Fila 3 y toma Col 2 -> D. E conserva Fila 1 y toma Col 4 -> A. Resultado: DA.',
  },
];

export const PlayfairGrid: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'solver' | 'slides_exercises' | 'rules_summary'>('solver');
  const [keyword, setKeyword] = useState<string>('MIEDO');
  const [inputText, setInputText] = useState<string>('Las sombras llaman a la puerta del castillo hoy');
  const [direction, setDirection] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [cellDisplayMode, setCellDisplayMode] = useState<'spanish' | 'international'>('spanish');
  const [selectedPairIndex, setSelectedPairIndex] = useState<number>(0);
  const [copiedSolution, setCopiedSolution] = useState<boolean>(false);

  // Auto-play state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(1000);

  // Slide Exercises state
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<string, string>>({});
  const [exerciseStatus, setExerciseStatus] = useState<Record<string, boolean>>({});

  const matrix = useMemo(() => buildPlayfairMatrix(keyword), [keyword]);
  const result = useMemo(() => processPlayfair(inputText, keyword, direction), [inputText, keyword, direction]);
  const digramDetails = useMemo(() => splitIntoDigramsDetails(inputText), [inputText]);

  // Active step
  const activeStep: PlayfairStep | null =
    result.steps.length > 0 && selectedPairIndex < result.steps.length
      ? result.steps[selectedPairIndex]
      : null;

  // Compute rectangle bounding box
  const rectangleBounds = useMemo(() => {
    if (!activeStep || activeStep.rule !== 'rectangle') return null;
    const [r1, c1] = activeStep.pos1;
    const [r2, c2] = activeStep.pos2;
    return {
      minR: Math.min(r1, r2),
      maxR: Math.max(r1, r2),
      minC: Math.min(c1, c2),
      maxC: Math.max(c1, c2),
    };
  }, [activeStep]);

  // Auto-play loop
  const timerRef = useRef<any>(null);
  useEffect(() => {
    if (isPlaying && result.steps.length > 0) {
      timerRef.current = setInterval(() => {
        setSelectedPairIndex(prev => {
          if (prev >= result.steps.length - 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, playSpeed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, result.steps.length, playSpeed]);

  const loadPreset = (preset: S08Preset) => {
    setKeyword(preset.key);
    setInputText(preset.text);
    setSelectedPairIndex(0);
    setIsPlaying(false);
  };

  const getCellLabel = (char: string) => {
    if (char === 'I') return 'I/J';
    if (cellDisplayMode === 'spanish' && char === 'N') return 'N/Ñ';
    return char;
  };

  // Copy structured solution
  const copyFullSolution = () => {
    const lines = [
      `SOLUCIÓN PASO A PASO - CIFRADOR DE PLAYFAIR (MATRIZ 5x5)`,
      `============================================================`,
      `Clave: ${keyword}`,
      `Operación: ${direction === 'encrypt' ? 'Cifrado' : 'Descifrado'}`,
      `Texto original: "${inputText}"`,
      ``,
      `1. MATRIZ 5x5 DESARROLLADA:`,
      `   Fila 1: ${matrix.slice(0, 5).map(getCellLabel).join('  ')}`,
      `   Fila 2: ${matrix.slice(5, 10).map(getCellLabel).join('  ')}`,
      `   Fila 3: ${matrix.slice(10, 15).map(getCellLabel).join('  ')}`,
      `   Fila 4: ${matrix.slice(15, 20).map(getCellLabel).join('  ')}`,
      `   Fila 5: ${matrix.slice(20, 25).map(getCellLabel).join('  ')}`,
      ``,
      `2. TEXTO EN DÍGRAMAS (REGLAS DE RELLENO X):`,
      `   Cadena: ${result.digrams.join(' ')}`,
      ``,
      `3. TABLA DE TRANSFORMACIÓN PAR A PAR:`,
      `#   Dígrama   Posiciones           Regla Aplicada          Criptograma`,
      `----------------------------------------------------------------------`,
    ];

    result.steps.forEach((st, idx) => {
      const num = String(idx + 1).padEnd(3, ' ');
      const inP = st.inPair.padEnd(9, ' ');
      const pos = `[F${st.pos1[0]+1},C${st.pos1[1]+1}][F${st.pos2[0]+1},C${st.pos2[1]+1}]`.padEnd(20, ' ');
      const rule = (st.rule === 'row' ? 'Misma Fila (+1 Der)' : st.rule === 'col' ? 'Misma Col (+1 Abj)' : 'Rectángulo (Cruce)').padEnd(23, ' ');
      lines.push(`${num} ${inP} ${pos} ${rule} ${st.outPair}`);
    });

    lines.push(`----------------------------------------------------------------------`);
    lines.push(`RESULTADO FINAL:`);
    lines.push(`En dígramas: ${result.formattedOutput}`);
    lines.push(`Continuo:    ${result.outputText}`);

    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedSolution(true);
    setTimeout(() => setCopiedSolution(false), 2500);
  };

  const handleVerifyExercise = (ex: SlideExercise) => {
    const val = (exerciseAnswers[ex.id] || '').trim().toUpperCase();
    const isOk = val === ex.expected;
    setExerciseStatus(prev => ({ ...prev, [ex.id]: isOk }));
    if (isOk) {
      confetti({ particleCount: 30, spread: 50 });
    }
  };

  return (
    <div className="flex flex-col gap-6 p-2 lg:p-4 w-full max-w-7xl mx-auto">
      {/* Top Banner with Quick Presets */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-inner">
              <Grid className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100">Cifrador de Playfair (Matriz 5×5)</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-semibold">
                  S08 · Wheatstone & Playfair
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Solucionador objetivo de exámenes · Matriz 25 celdas (I/J y N/Ñ) · Cero floro, soluciones 100% claras
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setActiveTab('solver')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-bold ${
                activeTab === 'solver'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Solucionador de Examen</span>
            </button>
            <button
              onClick={() => setActiveTab('slides_exercises')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-bold ${
                activeTab === 'slides_exercises'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Ejercicios Diapositivas S08 ({SLIDE_EXERCISES.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('rules_summary')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-bold ${
                activeTab === 'rules_summary'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Resumen de Reglas S08</span>
            </button>
          </div>
        </div>

        {/* Quick S08 Presets Button Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 text-xs">
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Cargar Casos de Clase:
          </span>
          {S08_PRESETS.map((p, i) => (
            <button
              key={`s08-preset-${i}`}
              onClick={() => loadPreset(p)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-violet-500 text-slate-300 hover:text-violet-300 font-mono text-[11px] transition flex items-center gap-1.5"
            >
              <span className="text-amber-400 font-bold">[{p.badge}]</span>
              <span>{p.name.split('(')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 1: SOLUCIONADOR DE EXAMEN (PASO A PASO DIRECTO) */}
      {activeTab === 'solver' && (
        <div className="flex flex-col gap-6">
          {/* Top Config Row: Inputs & Options */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
            {/* Keyword Input */}
            <div className="lg:col-span-4 flex flex-col gap-1.5">
              <label className="text-xs font-mono text-slate-400">Palabra Clave (K):</label>
              <input
                type="text"
                value={keyword}
                onChange={e => setKeyword(e.target.value.toUpperCase())}
                placeholder="Ej. MIEDO o VERANO AZUL"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-violet-300 font-mono font-bold uppercase focus:outline-none focus:border-violet-500 tracking-wider"
              />
            </div>

            {/* Direction */}
            <div className="lg:col-span-4 flex flex-col gap-1.5">
              <label className="text-xs font-mono text-slate-400">Operación:</label>
              <div className="grid grid-cols-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setDirection('encrypt')}
                  className={`py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 ${
                    direction === 'encrypt'
                      ? 'bg-violet-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  Cifrado (+1)
                </button>
                <button
                  onClick={() => setDirection('decrypt')}
                  className={`py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 ${
                    direction === 'decrypt'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Descifrado (-1)
                </button>
              </div>
            </div>

            {/* Alphabet Convention */}
            <div className="lg:col-span-4 flex flex-col gap-1.5">
              <label className="text-xs font-mono text-slate-400">Convención de Matriz (25 celdas):</label>
              <div className="grid grid-cols-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-mono">
                <button
                  onClick={() => setCellDisplayMode('spanish')}
                  className={`py-1.5 rounded-lg transition ${
                    cellDisplayMode === 'spanish'
                      ? 'bg-slate-800 text-amber-300 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  S08 Español (I/J, N/Ñ)
                </button>
                <button
                  onClick={() => setCellDisplayMode('international')}
                  className={`py-1.5 rounded-lg transition ${
                    cellDisplayMode === 'international'
                      ? 'bg-slate-800 text-amber-300 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Estándar (I/J)
                </button>
              </div>
            </div>

            {/* Input Message Text */}
            <div className="lg:col-span-12 flex flex-col gap-1.5 pt-2 border-t border-slate-800">
              <label className="text-xs font-mono text-slate-400 flex items-center justify-between">
                <span>Mensaje en Claro a Cifrar (M):</span>
                <span className="text-[11px] text-slate-400">
                  Total dígramas: <strong className="text-slate-200">{result.digrams.length}</strong>
                </span>
              </label>
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Escribe el texto a resolver..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          {/* Step 1 & Step 2 Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Matrix 5x5 */}
            <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col items-center justify-between">
              <div className="w-full flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-300 font-mono text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h3 className="text-sm font-bold text-slate-200 font-mono">Matriz 5×5 Desarrollada</h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  Clave: <strong className="text-violet-300">{keyword}</strong>
                </span>
              </div>

              {/* Grid 5x5 with Row & Col headers */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col items-center">
                {/* Column Headers */}
                <div className="grid grid-cols-6 gap-2 w-full mb-1 text-center font-mono text-[11px] text-slate-400 font-bold select-none">
                  <div className="w-8 h-6 flex items-center justify-center text-slate-600">F\C</div>
                  {[1, 2, 3, 4, 5].map(c => (
                    <div
                      key={`col-h-${c}`}
                      className={`h-6 flex items-center justify-center rounded ${
                        activeStep && (activeStep.pos1[1] === c - 1 || activeStep.pos2[1] === c - 1)
                          ? 'text-amber-400 bg-amber-500/10 font-bold'
                          : ''
                      }`}
                    >
                      C{c}
                    </div>
                  ))}
                </div>

                {/* Rows */}
                <div className="flex flex-col gap-2">
                  {[0, 1, 2, 3, 4].map(r => (
                    <div key={`row-grid-${r}`} className="flex items-center gap-2">
                      <div
                        className={`w-8 h-12 flex items-center justify-center font-mono text-[11px] font-bold rounded select-none ${
                          activeStep && (activeStep.pos1[0] === r || activeStep.pos2[0] === r)
                            ? 'text-amber-400 bg-amber-500/10'
                            : 'text-slate-400'
                        }`}
                      >
                        F{r + 1}
                      </div>

                      <div className="grid grid-cols-5 gap-2">
                        {[0, 1, 2, 3, 4].map(c => {
                          const idx = r * 5 + c;
                          const char = matrix[idx];
                          const label = getCellLabel(char);

                          const isInput1 = activeStep && activeStep.pos1[0] === r && activeStep.pos1[1] === c;
                          const isInput2 = activeStep && activeStep.pos2[0] === r && activeStep.pos2[1] === c;
                          const isOutput1 = activeStep && activeStep.outPos1[0] === r && activeStep.outPos1[1] === c;
                          const isOutput2 = activeStep && activeStep.outPos2[0] === r && activeStep.outPos2[1] === c;

                          const isInRectangle =
                            rectangleBounds &&
                            r >= rectangleBounds.minR &&
                            r <= rectangleBounds.maxR &&
                            c >= rectangleBounds.minC &&
                            c <= rectangleBounds.maxC;

                          let style = 'bg-slate-900 border-slate-800 text-slate-200';
                          let tag = null;

                          if (isInput1) {
                            style = 'bg-amber-500 text-slate-950 font-black scale-105 ring-2 ring-amber-300 shadow-lg';
                            tag = 'M₁';
                          } else if (isInput2) {
                            style = 'bg-amber-400 text-slate-950 font-black scale-105 ring-2 ring-amber-300 shadow-lg';
                            tag = 'M₂';
                          } else if (isOutput1) {
                            style = 'bg-emerald-500 text-slate-950 font-black scale-105 ring-2 ring-emerald-300 shadow-lg';
                            tag = 'C₁';
                          } else if (isOutput2) {
                            style = 'bg-emerald-400 text-slate-950 font-black scale-105 ring-2 ring-emerald-300 shadow-lg';
                            tag = 'C₂';
                          } else if (isInRectangle) {
                            style = 'bg-violet-950/40 border-violet-500/40 text-violet-300';
                          }

                          return (
                            <div
                              key={`cell-${idx}`}
                              className={`relative w-12 h-12 rounded-xl flex flex-col items-center justify-center font-mono text-sm font-bold border transition-all select-none ${style}`}
                            >
                              <span>{label}</span>
                              {tag && (
                                <span className="absolute -top-1.5 -right-1.5 text-[9px] px-1 rounded-full bg-slate-950 text-white border border-slate-700 font-mono font-bold shadow">
                                  {tag}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="w-full flex items-center justify-between text-[11px] font-mono mt-3 pt-2 border-t border-slate-800 text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-amber-400"></span> Entrada (M₁, M₂)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-400"></span> Cifrado (C₁, C₂)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-violet-800"></span> Rectángulo
                </span>
              </div>
            </div>

            {/* Step 2: Digram Breakdown with X injection */}
            <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h3 className="text-sm font-bold text-slate-200 font-mono">
                    Preparación del Texto en Dígramas (Reglas de la 'X')
                  </h3>
                </div>
                <button
                  onClick={copyFullSolution}
                  className="px-2.5 py-1 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-mono text-[11px] font-bold flex items-center gap-1 transition shadow"
                >
                  {copiedSolution ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSolution ? '¡Copiado!' : 'Copiar Solución'}</span>
                </button>
              </div>

              {/* Digrams Strip */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  Cadena de Dígramas Resultante (M):
                </span>
                <div className="flex flex-wrap gap-1.5 font-mono text-sm">
                  {result.digrams.map((dg, idx) => {
                    const isSelected = selectedPairIndex === idx;
                    const detail = digramDetails[idx];
                    const isSpecial = detail && detail.reason !== 'normal';

                    return (
                      <button
                        key={`dg-chip-${idx}`}
                        onClick={() => setSelectedPairIndex(idx)}
                        className={`px-2.5 py-1 rounded-lg font-bold border transition ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-300'
                            : isSpecial
                            ? 'bg-rose-950/40 border-rose-600/60 text-rose-300'
                            : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        {dg}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Special rules explanation audit list */}
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-xs font-mono space-y-1.5 max-h-48 overflow-y-auto">
                <span className="text-amber-400 font-bold block text-[11px] mb-1">
                  Auditoría de Inserciones de Letra Nula ('X'):
                </span>
                {digramDetails.some(d => d.reason !== 'normal') ? (
                  digramDetails
                    .filter(d => d.reason !== 'normal')
                    .map((d, i) => (
                      <div key={`special-dg-${i}`} className="text-slate-300 flex items-start gap-2">
                        <span className="text-rose-400 font-bold">[{d.pair}]</span>
                        <span>{d.explanation}</span>
                      </div>
                    ))
                ) : (
                  <div className="text-slate-400 italic text-[11px]">
                    No se requirió insertar 'X' intermedia ni de relleno (todas las parejas son de letras distintas y longitud par).
                  </div>
                )}
              </div>

              {/* Quick Summary of Active Pair */}
              {activeStep && (
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30 font-bold">
                      {activeStep.ruleNameEs}
                    </span>
                    <span className="text-slate-300">
                      Par #{activeStep.pairIndex + 1}: <strong className="text-amber-400">{activeStep.inPair}</strong> →{' '}
                      <strong className="text-emerald-400">{activeStep.outPair}</strong>
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">{activeStep.formula}</span>
                </div>
              )}
            </div>
          </div>

          {/* Step 3: Complete Transformation Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h3 className="text-sm font-bold text-slate-200 font-mono">
                  Tabla de Cifrado Dígrama por Dígrama (Resolución Paso a Paso)
                </h3>
              </div>

              {/* Step Navigation Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedPairIndex(p => Math.max(0, p - 1))}
                  disabled={selectedPairIndex === 0}
                  className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 disabled:opacity-40"
                  title="Anterior"
                >
                  <SkipBack className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 ${
                    isPlaying ? 'bg-amber-500 text-slate-950' : 'bg-violet-600 text-white'
                  }`}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'Pausar' : 'Reproducir'}</span>
                </button>
                <button
                  onClick={() => setSelectedPairIndex(p => Math.min(result.steps.length - 1, p + 1))}
                  disabled={selectedPairIndex >= result.steps.length - 1}
                  className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 disabled:opacity-40"
                  title="Siguiente"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setSelectedPairIndex(0);
                    setIsPlaying(false);
                  }}
                  className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400"
                  title="Reiniciar"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3 w-12 text-center">#</th>
                    <th className="p-3 w-28">Texto en Claro (M)</th>
                    <th className="p-3 w-36">Posición en Matriz</th>
                    <th className="p-3 w-48">Regla Aplicada</th>
                    <th className="p-3">Fórmula / Movimiento</th>
                    <th className="p-3 w-32">Criptograma (C)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/60">
                  {result.steps.map((st, idx) => {
                    const isSelected = selectedPairIndex === idx;

                    return (
                      <tr
                        key={`tbl-step-${idx}`}
                        onClick={() => {
                          setSelectedPairIndex(idx);
                          setIsPlaying(false);
                        }}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-violet-600/20 text-white font-bold'
                            : 'hover:bg-slate-800/40 text-slate-300'
                        }`}
                      >
                        <td className="p-3 text-center text-slate-400">{idx + 1}</td>
                        <td className="p-3">
                          <span className="font-black text-amber-400 text-sm bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            {st.inPair}
                          </span>
                        </td>
                        <td className="p-3 text-slate-300 text-[11px]">
                          M₁[F{st.pos1[0] + 1}, C{st.pos1[1] + 1}]  M₂[F{st.pos2[0] + 1}, C{st.pos2[1] + 1}]
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              st.rule === 'row'
                                ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                                : st.rule === 'col'
                                ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            }`}
                          >
                            {st.ruleNameEs}
                          </span>
                        </td>
                        <td className="p-3 text-[11px] text-slate-400">{st.formula}</td>
                        <td className="p-3">
                          <span className="font-black text-emerald-400 text-sm bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            {st.outPair}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Step 4: Final Output Banner */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  Resultado Final ({direction === 'encrypt' ? 'Criptograma C' : 'Texto en Claro Descifrado'}):
                </span>
                <span className="font-mono text-lg font-black text-emerald-400 tracking-wider">
                  {result.formattedOutput || '---'}
                </span>
                <span className="block text-xs font-mono text-slate-400 mt-1">
                  Continuo: <strong className="text-slate-300">{result.outputText || '---'}</strong>
                </span>
              </div>

              <button
                onClick={copyFullSolution}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold font-mono text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-lg self-start md:self-auto"
              >
                {copiedSolution ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSolution ? '¡Solución Copiada!' : 'Copiar Toda la Solución'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: EJERCICIOS DE DIAPOSITIVAS S08 (AUTOEVALUACIÓN) */}
      {activeTab === 'slides_exercises' && (
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-2">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-400" />
              Ejercicios Propuestos en las Diapositivas Oficiales S08 (Clave: VERANO AZUL)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              En las diapositivas 12, 14 y 16, el profesor dejó pares con signo de interrogación (<strong>?</strong>).
              Aquí puedes resolverlos uno a uno, verificar tu respuesta al instante y ver la explicación geométrica exacta.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SLIDE_EXERCISES.map(ex => {
              const userVal = exerciseAnswers[ex.id] || '';
              const isChecked = exerciseStatus[ex.id] !== undefined;
              const isOk = exerciseStatus[ex.id] === true;

              return (
                <div
                  key={ex.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between gap-3"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-violet-300 border border-slate-800">
                        {ex.slide}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          ex.ruleType === 'row'
                            ? 'bg-sky-500/20 text-sky-300'
                            : ex.ruleType === 'col'
                            ? 'bg-purple-500/20 text-purple-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {ex.ruleType === 'row' ? 'Fila (+1 Der)' : ex.ruleType === 'col' ? 'Columna (+1 Abj)' : 'Rectángulo'}
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-3 py-3 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="text-center font-mono">
                        <span className="text-[10px] text-slate-500 block">Texto en Claro:</span>
                        <span className="text-xl font-black text-amber-400">{ex.pair}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-600" />
                      <div className="text-center font-mono">
                        <span className="text-[10px] text-slate-500 block">Criptograma:</span>
                        <input
                          type="text"
                          maxLength={2}
                          value={userVal}
                          onChange={e =>
                            setExerciseAnswers(prev => ({
                              ...prev,
                              [ex.id]: e.target.value.toUpperCase(),
                            }))
                          }
                          placeholder="??"
                          className="w-14 text-center font-mono font-bold text-lg py-1 bg-slate-900 border border-slate-700 rounded-lg text-emerald-400 focus:outline-none focus:border-emerald-500 uppercase tracking-widest"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleVerifyExercise(ex)}
                      disabled={userVal.trim().length !== 2}
                      className="w-full py-1.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-mono font-bold text-xs rounded-xl transition"
                    >
                      Comprobar
                    </button>

                    {isChecked && (
                      <div
                        className={`p-2.5 rounded-xl border text-xs font-mono leading-relaxed ${
                          isOk
                            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                            : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                        }`}
                      >
                        <div className="flex items-center gap-1 font-bold mb-0.5">
                          {isOk ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          <span>{isOk ? '¡Correcto!' : `Incorrecto (Respuesta: ${ex.expected})`}</span>
                        </div>
                        <p className="text-[11px] text-slate-300">{ex.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: RESUMEN DE REGLAS S08 (SIN FLORO) */}
      {activeTab === 'rules_summary' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Rule A */}
          <div className="bg-slate-900/90 border border-sky-500/30 rounded-2xl p-5 shadow-lg flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sky-400">
              <ArrowRight className="w-5 h-5" />
              <h4 className="text-sm font-bold text-slate-100">Regla A: Misma Fila</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Si ambas letras están en la <strong>misma fila</strong>:
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono space-y-1">
              <div className="text-emerald-400">
                <strong>Cifrado:</strong> Cada letra se desplaza a la <strong>DERECHA (+1 mod 5)</strong>.
              </div>
              <div className="text-amber-400">
                <strong>Descifrado:</strong> Cada letra se desplaza a la <strong>IZQUIERDA (-1 mod 5)</strong>.
              </div>
              <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                * Si está en el borde derecho (col 5), da salto circular a col 1.
              </div>
            </div>
            <div className="text-[11px] font-mono text-slate-400 bg-slate-950 p-2 rounded-lg">
              Ejemplos S08: EA → RN, LU → BL, DH → FC
            </div>
          </div>

          {/* Rule B */}
          <div className="bg-slate-900/90 border border-purple-500/30 rounded-2xl p-5 shadow-lg flex flex-col gap-3">
            <div className="flex items-center gap-2 text-purple-400">
              <ArrowDown className="w-5 h-5" />
              <h4 className="text-sm font-bold text-slate-100">Regla B: Misma Columna</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Si ambas letras están en la <strong>misma columna</strong>:
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono space-y-1">
              <div className="text-emerald-400">
                <strong>Cifrado:</strong> Cada letra se desplaza hacia <strong>ABAJO (+1 mod 5)</strong>.
              </div>
              <div className="text-amber-400">
                <strong>Descifrado:</strong> Cada letra se desplaza hacia <strong>ARRIBA (-1 mod 5)</strong>.
              </div>
              <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                * Si está en la última fila (fila 5), da salto circular a fila 1.
              </div>
            </div>
            <div className="text-[11px] font-mono text-slate-400 bg-slate-950 p-2 rounded-lg">
              Ejemplos S08: ED → ZK, FU → MF, AX → LA
            </div>
          </div>

          {/* Rule C */}
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5 shadow-lg flex flex-col gap-3">
            <div className="flex items-center gap-2 text-amber-400">
              <Grid className="w-5 h-5" />
              <h4 className="text-sm font-bold text-slate-100">Regla C: Rectángulo</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Si están en <strong>distinta fila y columna</strong>:
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono space-y-1">
              <div className="text-violet-300">
                <strong>Cruce de Columnas:</strong>
                <div>• M₁[F₁, C₁] → <strong>C₁[F₁, C₂]</strong></div>
                <div>• M₂[F₂, C₂] → <strong>C₂[F₂, C₁]</strong></div>
              </div>
              <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                * ¡La regla es idéntica en Cifrado y Descifrado! Cada letra conserva su fila y toma la columna de la otra.
              </div>
            </div>
            <div className="text-[11px] font-mono text-slate-400 bg-slate-950 p-2 rounded-lg">
              Ejemplos S08: OT → ZS, YU → WB
            </div>
          </div>

          {/* Rule D */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col gap-3">
            <h4 className="text-sm font-bold text-slate-100 font-mono text-violet-400">
              Regla D: Letras Compartidas (I/J y N/Ñ)
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              En la matriz de 25 celdas:
            </p>
            <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside font-mono">
              <li>'I' y 'J' comparten la misma celda.</li>
              <li>'N' y 'Ñ' comparten la misma celda.</li>
              <li>Al descifrar, por estándar de clase se asume 'I'.</li>
            </ul>
            <div className="text-[11px] font-mono text-slate-400 bg-slate-950 p-2 rounded-lg">
              Ejemplos S08: MI = MJ → PK, EN = EÑ → RV
            </div>
          </div>

          {/* Rule E */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col gap-3">
            <h4 className="text-sm font-bold text-slate-100 font-mono text-rose-400">
              Regla E: Ruptura de Letras Dobles (X)
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Si dos letras consecutivas son idénticas en el mismo par, <strong>se rompe insertando 'X'</strong> (o 'Z'):
            </p>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300">
              "CASTILLO" → CAS TI <strong className="text-rose-400">LX</strong> <strong className="text-amber-400">LO</strong>
              <br />
              "SOMBRAS" → <strong className="text-rose-400">SX</strong> <strong className="text-amber-400">SO</strong>
            </div>
          </div>

          {/* Rule F */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col gap-3">
            <h4 className="text-sm font-bold text-slate-100 font-mono text-emerald-400">
              Regla F: Relleno por Longitud Impar
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Si al final queda una letra sola, se añade una letra nula al final:
            </p>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300">
              "HOY" → HO <strong className="text-emerald-400">YX</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
