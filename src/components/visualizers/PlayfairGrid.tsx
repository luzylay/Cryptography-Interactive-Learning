import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  processPlayfair,
  buildPlayfairMatrix,
  getMatrixPos,
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
  HelpCircle,
  Check,
  ChevronRight,
  GraduationCap,
  Target,
  Split,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PresetExample {
  title: string;
  keyword: string;
  text: string;
  notes: string;
  category: string;
}

const PRESET_EXAMPLES: PresetExample[] = [
  {
    title: 'Clásico Universitario: Ataque',
    keyword: 'CRIPTOGRAFIA',
    text: 'ATAQUE AL AMANECER',
    notes: 'Matriz con clave larga sin letras repetidas. Demuestra las 3 reglas (Fila, Columna y Rectángulo).',
    category: 'Básico',
  },
  {
    title: 'Caso Crítico: Letras Dobles (LL)',
    keyword: 'MONARQUIA',
    text: 'CABALLO BLANCO',
    notes: 'La palabra CABALLO contiene "LL" en el mismo par. La regla exige separar con "X" generando [LX] y luego [LO].',
    category: 'Letras Dobles',
  },
  {
    title: 'Caso Crítico: Longitud Impar',
    keyword: 'UNIVERSIDAD',
    text: 'FIN DE CICLO',
    notes: 'Longitud impar de letras. Al final queda una letra solitaria que se completa añadiendo la letra de relleno "X".',
    category: 'Relleno Final',
  },
  {
    title: 'Wheatstone Histórico (1854)',
    keyword: 'PLAYFAIR',
    text: 'SECRET MESSAGE HIDDEN',
    notes: 'Ejemplo histórico con la clave del creador. Muestra múltiples cruces rectangulares y saltos circulares.',
    category: 'Histórico',
  },
];

export const PlayfairGrid: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'lab' | 'rules' | 'exercises' | 'digrams'>('lab');
  const [keyword, setKeyword] = useState<string>('CRIPTOGRAFIA');
  const [inputText, setInputText] = useState<string>('ATAQUE AL AMANECER');
  const [direction, setDirection] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [selectedPairIndex, setSelectedPairIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(1200);

  // Exercise Quiz State
  const [quizKey, setQuizKey] = useState<string>('CRIPTOGRAFIA');
  const [quizPair, setQuizPair] = useState<string>('AT');
  const [quizSelectedRule, setQuizSelectedRule] = useState<'row' | 'col' | 'rectangle' | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<string>('');
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizFeedback, setQuizFeedback] = useState<{ isCorrect: boolean; message: string; step?: PlayfairStep } | null>(null);

  const matrix = useMemo(() => buildPlayfairMatrix(keyword), [keyword]);
  const result = useMemo(() => processPlayfair(inputText, keyword, direction), [inputText, keyword, direction]);
  const digramDetails = useMemo(() => splitIntoDigramsDetails(inputText), [inputText]);

  // Ensure active step index is in range
  useEffect(() => {
    if (selectedPairIndex >= result.steps.length) {
      setSelectedPairIndex(Math.max(0, result.steps.length - 1));
    }
  }, [result.steps.length, selectedPairIndex]);

  // Autoplay loop
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

  const activeStep: PlayfairStep | null =
    result.steps.length > 0 && selectedPairIndex < result.steps.length
      ? result.steps[selectedPairIndex]
      : null;

  // Compute rectangle bounding box if active step is rectangle
  const rectangleBounds = useMemo(() => {
    if (!activeStep || activeStep.rule !== 'rectangle') return null;
    const [r1, c1] = activeStep.pos1;
    const [r2, c2] = activeStep.pos2;
    const minR = Math.min(r1, r2);
    const maxR = Math.max(r1, r2);
    const minC = Math.min(c1, c2);
    const maxC = Math.max(c1, c2);
    return { minR, maxR, minC, maxC };
  }, [activeStep]);

  // Load a preset
  const handleLoadPreset = (preset: PresetExample) => {
    setKeyword(preset.keyword);
    setInputText(preset.text);
    setSelectedPairIndex(0);
    setIsPlaying(false);
  };

  // Generate a new random quiz question
  const generateNewQuizQuestion = () => {
    const qMatrix = buildPlayfairMatrix(quizKey);
    // pick 2 distinct random letters from the matrix
    const idx1 = Math.floor(Math.random() * 25);
    let idx2 = Math.floor(Math.random() * 25);
    while (idx2 === idx1) {
      idx2 = Math.floor(Math.random() * 25);
    }
    const pair = qMatrix[idx1] + qMatrix[idx2];
    setQuizPair(pair);
    setQuizSelectedRule(null);
    setQuizAnswer('');
    setQuizSubmitted(false);
    setQuizFeedback(null);
  };

  // Initialize quiz question on first load
  useEffect(() => {
    generateNewQuizQuestion();
  }, [quizKey]);

  // Check quiz answer
  const handleCheckQuiz = () => {
    if (!quizSelectedRule || quizAnswer.trim().length !== 2) return;
    const cleanAnswer = quizAnswer.trim().toUpperCase().replace(/J/g, 'I');
    const qResult = processPlayfair(quizPair, quizKey, 'encrypt');
    const step = qResult.steps[0];

    const isRuleCorrect = quizSelectedRule === step.rule;
    const isLettersCorrect = cleanAnswer === step.outPair;
    const isSuccess = isRuleCorrect && isLettersCorrect;

    setQuizSubmitted(true);
    setQuizScore(prev => ({
      correct: prev.correct + (isSuccess ? 1 : 0),
      total: prev.total + 1,
    }));

    if (isSuccess) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      setQuizFeedback({
        isCorrect: true,
        message: `¡Excelente trabajo! Identificaste correctamente la ${step.ruleNameEs} y el par cifrado "${step.outPair}".`,
        step,
      });
    } else {
      let errorReason = '';
      if (!isRuleCorrect && !isLettersCorrect) {
        errorReason = `La regla correcta es "${step.ruleNameEs}" y el dígrama cifrado es "${step.outPair}".`;
      } else if (!isRuleCorrect) {
        errorReason = `Acertaste las letras (${step.outPair}), pero la regla aplicada es "${step.ruleNameEs}".`;
      } else {
        errorReason = `Identificaste la regla bien (${step.ruleNameEs}), pero el resultado correcto es "${step.outPair}". Recuerda el orden de filas y columnas.`;
      }
      setQuizFeedback({
        isCorrect: false,
        message: errorReason,
        step,
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 p-2 lg:p-4 w-full max-w-7xl mx-auto">
      {/* Header with Title and Presets */}
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
                  Sustitución Digrámica
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                25 letras (I = J unificadas, Ñ → N) · Creado por Charles Wheatstone (1854) · Popularizado por Lord Playfair
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setActiveTab('lab')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                activeTab === 'lab'
                  ? 'bg-violet-600 text-white font-bold shadow-md shadow-violet-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Laboratorio</span>
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                activeTab === 'rules'
                  ? 'bg-violet-600 text-white font-bold shadow-md shadow-violet-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Guía de Reglas</span>
            </button>
            <button
              onClick={() => setActiveTab('exercises')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                activeTab === 'exercises'
                  ? 'bg-violet-600 text-white font-bold shadow-md shadow-violet-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Entrenador Exámenes</span>
            </button>
            <button
              onClick={() => setActiveTab('digrams')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                activeTab === 'digrams'
                  ? 'bg-violet-600 text-white font-bold shadow-md shadow-violet-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              <span>Paso 1: Dígramas ({digramDetails.length})</span>
            </button>
          </div>
        </div>

        {/* Quick Presets Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-800/80 text-xs">
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Ejemplos de Examen:
          </span>
          {PRESET_EXAMPLES.map((preset, idx) => (
            <button
              key={`preset-${idx}`}
              onClick={() => handleLoadPreset(preset)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-violet-500/50 text-slate-300 hover:text-violet-300 font-mono text-[11px] whitespace-nowrap transition flex items-center gap-1.5"
            >
              <span className="text-amber-400">[{preset.category}]</span>
              <span>{preset.title.split(':')[1] || preset.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 1: LABORATORIO INTERACTIVO */}
      {activeTab === 'lab' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: 5x5 Matrix Visualizer with Coordinates */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col items-center justify-between shadow-xl">
            <div className="w-full flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-violet-400" />
                <h3 className="text-sm font-bold text-slate-200 font-mono">Matriz Clave 5×5</h3>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                Clave: <strong className="text-violet-300">{keyword}</strong>
              </span>
            </div>

            {/* Matrix with Row & Column Labels */}
            <div className="relative p-3 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col items-center">
              {/* Column Indices (1..5) */}
              <div className="grid grid-cols-6 gap-2 w-full mb-1 text-center font-mono text-[11px] text-slate-400 font-semibold select-none">
                <div className="w-8 h-6 flex items-center justify-center text-slate-600">F\C</div>
                {[1, 2, 3, 4, 5].map(col => (
                  <div
                    key={`header-col-${col}`}
                    className={`h-6 flex items-center justify-center rounded ${
                      activeStep &&
                      ((activeStep.pos1[1] === col - 1) || (activeStep.pos2[1] === col - 1))
                        ? 'text-amber-400 bg-amber-500/10 font-bold'
                        : ''
                    }`}
                  >
                    C{col}
                  </div>
                ))}
              </div>

              {/* Rows with Row Index (1..5) */}
              <div className="flex flex-col gap-2">
                {[0, 1, 2, 3, 4].map(r => (
                  <div key={`row-${r}`} className="flex items-center gap-2">
                    {/* Row Header */}
                    <div
                      className={`w-8 h-12 flex items-center justify-center font-mono text-[11px] rounded select-none ${
                        activeStep &&
                        ((activeStep.pos1[0] === r) || (activeStep.pos2[0] === r))
                          ? 'text-amber-400 bg-amber-500/10 font-bold'
                          : 'text-slate-400'
                      }`}
                    >
                      F{r + 1}
                    </div>

                    {/* Row Cells */}
                    <div className="grid grid-cols-5 gap-2">
                      {[0, 1, 2, 3, 4].map(c => {
                        const idx = r * 5 + c;
                        const char = matrix[idx];

                        const isInput1 = activeStep && activeStep.pos1[0] === r && activeStep.pos1[1] === c;
                        const isInput2 = activeStep && activeStep.pos2[0] === r && activeStep.pos2[1] === c;
                        const isOutput1 = activeStep && activeStep.outPos1[0] === r && activeStep.outPos1[1] === c;
                        const isOutput2 = activeStep && activeStep.outPos2[0] === r && activeStep.outPos2[1] === c;

                        // Check if cell is in the bounding box of the rectangle
                        const isInRectangle =
                          rectangleBounds &&
                          r >= rectangleBounds.minR &&
                          r <= rectangleBounds.maxR &&
                          c >= rectangleBounds.minC &&
                          c <= rectangleBounds.maxC;

                        // Check if in same row or column as active
                        const isInActiveRow =
                          activeStep && activeStep.rule === 'row' && activeStep.pos1[0] === r;
                        const isInActiveCol =
                          activeStep && activeStep.rule === 'col' && activeStep.pos1[1] === c;

                        let cellStyle = 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700';
                        let badge = null;

                        if (isInput1) {
                          cellStyle = 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/40 scale-105 ring-2 ring-amber-300';
                          badge = 'P₁';
                        } else if (isInput2) {
                          cellStyle = 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-400/40 scale-105 ring-2 ring-amber-300';
                          badge = 'P₂';
                        } else if (isOutput1) {
                          cellStyle = 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/40 scale-105 ring-2 ring-emerald-300';
                          badge = 'C₁';
                        } else if (isOutput2) {
                          cellStyle = 'bg-emerald-400 text-slate-950 font-black shadow-lg shadow-emerald-400/40 scale-105 ring-2 ring-emerald-300';
                          badge = 'C₂';
                        } else if (isInRectangle) {
                          cellStyle = 'bg-violet-950/40 border-violet-500/40 text-violet-300 shadow-inner';
                        } else if (isInActiveRow) {
                          cellStyle = 'bg-sky-950/40 border-sky-500/40 text-sky-200';
                        } else if (isInActiveCol) {
                          cellStyle = 'bg-purple-950/40 border-purple-500/40 text-purple-200';
                        }

                        return (
                          <div
                            key={`pf-cell-${idx}`}
                            className={`relative w-12 h-12 rounded-xl flex flex-col items-center justify-center font-mono text-base font-bold transition-all duration-300 border select-none ${cellStyle}`}
                          >
                            <span>{char}</span>
                            {badge && (
                              <span className="absolute -top-1.5 -right-1.5 text-[9px] px-1 py-0.2 rounded-full bg-slate-950 text-white font-mono font-bold border border-slate-700 shadow">
                                {badge}
                              </span>
                            )}
                            <span className="text-[8px] font-mono text-slate-400 opacity-60">
                              {char === 'I' ? 'I/J' : ''}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Matrix Legend */}
            <div className="w-full flex items-center justify-between text-[11px] font-mono mt-4 pt-3 border-t border-slate-800 text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-amber-400 inline-block"></span>
                <span>Entrada (P₁, P₂)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-emerald-400 inline-block"></span>
                <span>Salida (C₁, C₂)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-violet-900 border border-violet-500/50 inline-block"></span>
                <span>Área Rectángulo</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Step-by-Step Breakdown and Controls */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Input & Direction Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Keyword input */}
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">
                    Palabra Clave (sin duplicados en matriz):
                  </label>
                  <input
                    type="text"
                    value={keyword}
                    onChange={e => setKeyword(e.target.value.toUpperCase())}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-violet-300 font-mono font-bold focus:outline-none focus:border-violet-500 uppercase tracking-wider"
                    placeholder="EJ: CRIPTOGRAFIA"
                  />
                </div>

                {/* Direction Switch */}
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">
                    Operación Criptográfica:
                  </label>
                  <div className="grid grid-cols-2 rounded-xl bg-slate-950 p-1 border border-slate-800">
                    <button
                      onClick={() => setDirection('encrypt')}
                      className={`py-1.5 text-xs font-mono rounded-lg transition font-bold flex items-center justify-center gap-1.5 ${
                        direction === 'encrypt'
                          ? 'bg-violet-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      Cifrar (+1)
                    </button>
                    <button
                      onClick={() => setDirection('decrypt')}
                      className={`py-1.5 text-xs font-mono rounded-lg transition font-bold flex items-center justify-center gap-1.5 ${
                        direction === 'decrypt'
                          ? 'bg-amber-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Descifrar (-1)
                    </button>
                  </div>
                </div>
              </div>

              {/* Input text */}
              <div>
                <label className="text-xs font-mono text-slate-400 flex items-center justify-between mb-1">
                  <span>Texto en Claro a procesar:</span>
                  <span className="text-[11px] text-slate-400">
                    {inputText.length} caracteres ({result.digrams.length} dígramas)
                  </span>
                </label>
                <input
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value.toUpperCase())}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-violet-500 uppercase tracking-wide"
                  placeholder="Escribe el texto a cifrar..."
                />
              </div>

              {/* Output Banner */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">
                    Resultado Final ({direction === 'encrypt' ? 'Criptograma Cifrado' : 'Texto Descifrado'}):
                  </span>
                  <span className="font-mono text-base font-black text-emerald-400 tracking-wider">
                    {result.formattedOutput || '---'}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 self-start sm:self-auto">
                  Total Dígramas: <strong className="text-slate-200">{result.digrams.length}</strong>
                </div>
              </div>
            </div>

            {/* Stepper Navigation & Autoplay Bar */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedPairIndex(prev => Math.max(0, prev - 1))}
                    disabled={selectedPairIndex === 0}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:hover:text-slate-300"
                    title="Dígrama anterior"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition ${
                      isPlaying
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                        : 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                    }`}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isPlaying ? 'Pausar' : 'Paso a Paso'}</span>
                  </button>

                  <button
                    onClick={() =>
                      setSelectedPairIndex(prev => Math.min(result.steps.length - 1, prev + 1))
                    }
                    disabled={selectedPairIndex >= result.steps.length - 1}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:hover:text-slate-300"
                    title="Dígrama siguiente"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      setSelectedPairIndex(0);
                      setIsPlaying(false);
                    }}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200"
                    title="Reiniciar al inicio"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Speed selector */}
                <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <span>Velocidad:</span>
                  <button
                    onClick={() => setPlaySpeed(2000)}
                    className={`px-2 py-0.5 rounded ${playSpeed === 2000 ? 'bg-slate-800 text-amber-300 font-bold' : ''}`}
                  >
                    0.5x
                  </button>
                  <button
                    onClick={() => setPlaySpeed(1200)}
                    className={`px-2 py-0.5 rounded ${playSpeed === 1200 ? 'bg-slate-800 text-amber-300 font-bold' : ''}`}
                  >
                    1x
                  </button>
                  <button
                    onClick={() => setPlaySpeed(600)}
                    className={`px-2 py-0.5 rounded ${playSpeed === 600 ? 'bg-slate-800 text-amber-300 font-bold' : ''}`}
                  >
                    2x
                  </button>
                </div>

                <div className="text-xs font-mono text-slate-400">
                  Paso <strong className="text-violet-400">{selectedPairIndex + 1}</strong> de{' '}
                  <strong className="text-slate-300">{result.steps.length}</strong>
                </div>
              </div>

              {/* Digram Selection Chips Strip */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {result.steps.map((st, i) => {
                  const isCurrent = selectedPairIndex === i;
                  return (
                    <button
                      key={`pf-chip-${i}`}
                      onClick={() => {
                        setSelectedPairIndex(i);
                        setIsPlaying(false);
                      }}
                      className={`px-3 py-2 rounded-xl font-mono text-xs flex items-center gap-2 border transition flex-shrink-0 ${
                        isCurrent
                          ? 'bg-violet-600/30 border-violet-500 text-white font-bold shadow-lg ring-1 ring-violet-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-amber-400 font-bold">{st.inPair}</span>
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                      <span className="text-emerald-400 font-bold">{st.outPair}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Step Detailed Didactic Explanation Card */}
            {activeStep ? (
              <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col gap-3 backdrop-blur-md">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-mono font-bold px-3 py-1 rounded-lg border ${
                        activeStep.rule === 'row'
                          ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                          : activeStep.rule === 'col'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      {activeStep.ruleNameEs}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Dígrama #{activeStep.pairIndex + 1}
                    </span>
                  </div>

                  {activeStep.digramInfo && activeStep.digramInfo.reason !== 'normal' && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold">
                      ¡Regla especial de relleno aplicada!
                    </span>
                  )}
                </div>

                {/* In/Out Pair Comparison with Coordinates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-mono text-lg font-black text-amber-300">
                      {activeStep.inPair}
                    </div>
                    <div className="text-xs font-mono text-slate-300">
                      <span className="text-slate-400 block text-[10px]">Entrada (Texto en Claro):</span>
                      <span>
                        P₁: <strong className="text-amber-400">{activeStep.inPair[0]}</strong> [F{activeStep.pos1[0] + 1}, C{activeStep.pos1[1] + 1}]
                      </span>
                      <br />
                      <span>
                        P₂: <strong className="text-amber-400">{activeStep.inPair[1]}</strong> [F{activeStep.pos2[0] + 1}, C{activeStep.pos2[1] + 1}]
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-mono text-lg font-black text-emerald-300">
                      {activeStep.outPair}
                    </div>
                    <div className="text-xs font-mono text-slate-300">
                      <span className="text-slate-400 block text-[10px]">Salida (Cifrado):</span>
                      <span>
                        C₁: <strong className="text-emerald-400">{activeStep.outPair[0]}</strong> [F{activeStep.outPos1[0] + 1}, C{activeStep.outPos1[1] + 1}]
                      </span>
                      <br />
                      <span>
                        C₂: <strong className="text-emerald-400">{activeStep.outPair[1]}</strong> [F{activeStep.outPos2[0] + 1}, C{activeStep.outPos2[1] + 1}]
                      </span>
                    </div>
                  </div>
                </div>

                {/* Explanation text */}
                <div className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 leading-relaxed font-sans">
                  <p className="mb-2">
                    <strong className="text-violet-300 font-mono">Explicación didáctica: </strong>
                    {activeStep.explanation}
                  </p>
                  <p className="text-[11px] font-mono text-slate-400 bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-amber-400 font-bold">Fórmula matemática: </span>
                    {activeStep.formula}
                  </p>
                </div>

                {/* Special case note if filler was inserted */}
                {activeStep.digramInfo && activeStep.digramInfo.reason !== 'normal' && (
                  <div className="text-xs text-rose-300 bg-rose-950/30 border border-rose-800/60 p-2.5 rounded-xl flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                    <span>{activeStep.digramInfo.explanation}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-center text-slate-400 font-mono text-xs">
                Introduce un texto para ver el desglose paso a paso.
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: GUÍA DIDÁCTICA DE REGLAS (TEORÍA Y FÓRMULAS) */}
      {activeTab === 'rules' && (
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-100 mb-2 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-violet-400" />
              Manual Maestro de Reglas de Cifrado Playfair
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              El cifrador de Playfair es el primer cifrador por <strong>sustitución digrámica</strong> (bloques de 2 letras).
              A diferencia del Cifrado César o Vigenère donde cada letra se cifra aislada, aquí cada par de letras se sustituye según su posición geométrica en una matriz 5×5.
              Esto destruye la frecuencia de letras individuales y dificulta enormemente el criptoanálisis.
            </p>
          </div>

          {/* Step 0 and Step 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Step 0: Matrix Construction */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-violet-400">
                <span className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-300 font-mono font-bold flex items-center justify-center text-xs">
                  0
                </span>
                <h4 className="text-sm font-bold text-slate-200">Construcción de la Matriz 5×5</h4>
              </div>
              <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  <strong>25 letras:</strong> Como el alfabeto latino estándar tiene 26 letras y una matriz 5×5 contiene 25 celdas, <strong>la letra 'I' y la 'J' se unifican</strong> en la misma casilla (o se reemplaza toda 'J' por 'I'). En español, la 'Ñ' se sustituye por 'N'.
                </li>
                <li>
                  <strong>Clave sin duplicados:</strong> Se escribe la palabra clave eliminando cualquier letra repetida (ej. "CRIPTOGRAFIA" → "CRIPTOGAF").
                </li>
                <li>
                  <strong>Relleno ordenado:</strong> Las casillas vacías restantes se rellenan con las demás letras del abecedario (A-Z excepto J) en estricto orden alfabético.
                </li>
              </ul>
            </div>

            {/* Step 1: Digram Preparation */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-amber-400">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold flex items-center justify-center text-xs">
                  1
                </span>
                <h4 className="text-sm font-bold text-slate-200">Preparación del Texto en Dígramas</h4>
              </div>
              <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  <strong>Agrupar de 2 en 2:</strong> El texto plano se limpia (sin espacios ni puntuación) y se divide en pares de letras contiguas.
                </li>
                <li>
                  <strong>Letras dobles en el mismo par:</strong> Si un par contiene dos letras idénticas (ej. "LL", "EE", "SS"), <strong>se inserta una letra nula 'X'</strong> entre ellas. La segunda letra se desplaza para iniciar el siguiente par (ej. "BALLOON" → "BA", "LX", "LO", "ON").
                </li>
                <li>
                  <strong>Longitud impar al final:</strong> Si al final queda una sola letra aislada, se completa el par añadiendo la letra de relleno <strong>'X'</strong> (o 'Z' si la letra era 'X').
                </li>
              </ul>
            </div>
          </div>

          {/* The 3 Core Geometric Rules Detailed Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Rule 1: Row */}
            <div className="bg-slate-900/90 border border-sky-500/30 rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-2xl pointer-events-none"></div>
              <div className="flex items-center gap-2 text-sky-400">
                <ArrowRight className="w-5 h-5" />
                <h4 className="text-sm font-bold text-slate-100">Regla 1: Misma Fila</h4>
              </div>
              <span className="text-[11px] font-mono text-sky-300 bg-sky-950/60 px-2.5 py-1 rounded-lg border border-sky-800/60 self-start">
                Fila₁ = Fila₂
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Cuando las dos letras están situadas en la <strong>misma fila horizontal</strong> de la matriz:
              </p>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono space-y-1.5">
                <div className="text-emerald-400">
                  <strong>Cifrado (+1 DERECHA):</strong> Cada letra se sustituye por la que está inmediatamente a su derecha.
                  <div className="text-[10px] text-slate-400 mt-0.5">Col_nueva = (Col + 1) mod 5</div>
                </div>
                <div className="text-amber-400 pt-1 border-t border-slate-800">
                  <strong>Descifrado (-1 IZQUIERDA):</strong> Cada letra se desplaza hacia la izquierda.
                  <div className="text-[10px] text-slate-400 mt-0.5">Col_nueva = (Col - 1 + 5) mod 5</div>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 italic">
                * Salto circular: Si está en el borde derecho (col 5) y cifra, salta al inicio de la misma fila (col 1).
              </p>
            </div>

            {/* Rule 2: Column */}
            <div className="bg-slate-900/90 border border-purple-500/30 rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none"></div>
              <div className="flex items-center gap-2 text-purple-400">
                <ArrowDown className="w-5 h-5" />
                <h4 className="text-sm font-bold text-slate-100">Regla 2: Misma Columna</h4>
              </div>
              <span className="text-[11px] font-mono text-purple-300 bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-800/60 self-start">
                Col₁ = Col₂
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Cuando las dos letras están situadas en la <strong>misma columna vertical</strong> de la matriz:
              </p>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono space-y-1.5">
                <div className="text-emerald-400">
                  <strong>Cifrado (+1 ABAJO):</strong> Cada letra se sustituye por la que está inmediatamente abajo.
                  <div className="text-[10px] text-slate-400 mt-0.5">Fila_nueva = (Fila + 1) mod 5</div>
                </div>
                <div className="text-amber-400 pt-1 border-t border-slate-800">
                  <strong>Descifrado (-1 ARRIBA):</strong> Cada letra se desplaza hacia arriba.
                  <div className="text-[10px] text-slate-400 mt-0.5">Fila_nueva = (Fila - 1 + 5) mod 5</div>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 italic">
                * Salto circular: Si está en la última fila (fila 5) y cifra, salta a la cima de la columna (fila 1).
              </p>
            </div>

            {/* Rule 3: Rectangle */}
            <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
              <div className="flex items-center gap-2 text-amber-400">
                <Grid className="w-5 h-5" />
                <h4 className="text-sm font-bold text-slate-100">Regla 3: Rectángulo</h4>
              </div>
              <span className="text-[11px] font-mono text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-800/60 self-start">
                Fila₁ ≠ Fila₂  y  Col₁ ≠ Col₂
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Cuando las letras están en <strong>distinta fila y distinta columna</strong>, forman los vértices opuestos de un rectángulo:
              </p>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono space-y-1.5">
                <div className="text-violet-300">
                  <strong>Cruce de Columnas en su Fila:</strong>
                  <div className="text-[11px] text-slate-300 mt-1">
                    • P₁[F₁, C₁] → <strong>C₁[F₁, C₂]</strong>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    • P₂[F₂, C₂] → <strong>C₂[F₂, C₁]</strong>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-amber-400 font-bold bg-amber-950/40 p-2 rounded-lg border border-amber-800/40">
                ¡Clave Nemotécnica!: Cada letra conserva su PROPIA FILA y toma la columna de la otra letra. Tanto al cifrar como al descifrar, la regla del rectángulo es idéntica.
              </p>
            </div>
          </div>

          {/* Golden Rules for Solving Exam Exercises */}
          <div className="bg-slate-900/90 border border-amber-500/40 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
            <div className="flex items-center gap-2 text-amber-400">
              <Lightbulb className="w-5 h-5" />
              <h4 className="text-sm font-bold text-slate-100">
                Los 5 Errores Críticos que Bajan Puntos en Exámenes (Checklist de Seguridad)
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-rose-400 font-bold block flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" /> 1. Olvidar separar letras dobles dentro del mismo par
                </span>
                <p className="text-slate-300 leading-relaxed">
                  En "BALLOON", 'LL' queda en el mismo par. DEBES insertar una 'X' entre ambas: [LX], y la segunda 'L' pasa al siguiente par con la 'O' ([LO]).
                  Si no insertas la 'X', todo el resto de dígramas del examen estará desfasado y el resultado será 0.
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-rose-400 font-bold block flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" /> 2. Invertir el orden de las letras en el Rectángulo
                </span>
                <p className="text-slate-300 leading-relaxed">
                  El dígrama resultante [C₁C₂] debe mantener el orden de filas: la primera letra resultante C₁ SIEMPRE proviene de la fila de P₁. Si inviertes C₂C₁, el dígrama estará al revés.
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-rose-400 font-bold block flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" /> 3. Confundir la 'I' y la 'J'
                </span>
                <p className="text-slate-300 leading-relaxed">
                  En la matriz de 5×5, la casilla es compartida "I/J" o se sustituye 'J' por 'I'. Si tu texto tiene una 'J' (ej. "JURADO"), debes buscar y cifrar usando la posición de la 'I'.
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-rose-400 font-bold block flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" /> 4. Olvidar el salto circular (Wrap-around)
                </span>
                <p className="text-slate-300 leading-relaxed">
                  En la misma fila, la letra de la columna 5 salta a la columna 1 al cifrar. En la misma columna, la letra de la fila 5 salta a la fila 1. ¡No salgas de la matriz!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: ENTRENADOR DE EXÁMENES (EJERCICIOS GUIADOS Y QUIZ) */}
      {activeTab === 'exercises' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Interactive Quiz Challenge */}
          <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-slate-100">Quiz de Entrenamiento Playfair</h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-400">Puntaje:</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  {quizScore.correct} / {quizScore.total}
                </span>
              </div>
            </div>

            {/* Quiz Setup */}
            <div className="flex items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Clave actual:</span>
                <input
                  type="text"
                  value={quizKey}
                  onChange={e => setQuizKey(e.target.value.toUpperCase())}
                  className="bg-slate-900 border border-slate-700 px-2 py-1 rounded text-violet-300 font-bold uppercase w-28 text-center"
                />
              </div>
              <button
                onClick={generateNewQuizQuestion}
                className="flex items-center gap-1 px-3 py-1 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition font-bold"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Nuevo Dígrama
              </button>
            </div>

            {/* Quiz Question Box */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
              <span className="text-xs font-mono text-slate-400">Desafío: Cifra el siguiente dígrama:</span>
              <div className="flex items-center justify-center gap-4 py-2">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center font-mono text-2xl font-black text-amber-300 shadow-lg shadow-amber-500/20">
                  {quizPair}
                </div>
                <div className="text-xs font-mono text-slate-400">
                  P₁ = <strong className="text-amber-400">{quizPair[0]}</strong>, P₂ ={' '}
                  <strong className="text-amber-400">{quizPair[1]}</strong>
                </div>
              </div>

              {/* Step 1 Question: Identify Rule */}
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
                <label className="text-xs font-mono text-slate-300 font-bold">
                  1. ¿Qué regla geométrica aplica a este par en la matriz?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setQuizSelectedRule('row')}
                    className={`py-2 px-2 rounded-xl text-xs font-mono border transition ${
                      quizSelectedRule === 'row'
                        ? 'bg-sky-500/30 border-sky-400 text-sky-200 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    Misma Fila
                  </button>
                  <button
                    onClick={() => setQuizSelectedRule('col')}
                    className={`py-2 px-2 rounded-xl text-xs font-mono border transition ${
                      quizSelectedRule === 'col'
                        ? 'bg-purple-500/30 border-purple-400 text-purple-200 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    Misma Columna
                  </button>
                  <button
                    onClick={() => setQuizSelectedRule('rectangle')}
                    className={`py-2 px-2 rounded-xl text-xs font-mono border transition ${
                      quizSelectedRule === 'rectangle'
                        ? 'bg-amber-500/30 border-amber-400 text-amber-200 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    Rectángulo
                  </button>
                </div>
              </div>

              {/* Step 2 Question: Answer Pair */}
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
                <label className="text-xs font-mono text-slate-300 font-bold">
                  2. Escribe el dígrama cifrado resultante [C₁C₂]:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={2}
                    value={quizAnswer}
                    onChange={e => setQuizAnswer(e.target.value.toUpperCase())}
                    placeholder="Ej: XQ"
                    className="w-24 text-center font-mono font-bold text-lg py-2 bg-slate-900 border border-slate-700 rounded-xl text-emerald-400 focus:outline-none focus:border-emerald-500 uppercase tracking-widest"
                  />
                  <button
                    onClick={handleCheckQuiz}
                    disabled={!quizSelectedRule || quizAnswer.trim().length !== 2}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-slate-950 font-bold font-mono text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-lg"
                  >
                    <Check className="w-4 h-4" />
                    Validar Respuesta
                  </button>
                </div>
              </div>

              {/* Feedback Message */}
              {quizFeedback && (
                <div
                  className={`p-3 rounded-xl border text-xs font-mono leading-relaxed mt-2 ${
                    quizFeedback.isCorrect
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    {quizFeedback.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    )}
                    <span>{quizFeedback.isCorrect ? '¡Correcto!' : 'Respuesta Incorrecta'}</span>
                  </div>
                  <p>{quizFeedback.message}</p>
                  {quizFeedback.step && (
                    <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-300">
                      <strong>Detalle: </strong> {quizFeedback.step.explanation}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Matrix mini reference for quiz */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col items-center">
              <span className="text-[11px] font-mono text-slate-400 mb-2">
                Matriz de Apoyo (Clave: {quizKey})
              </span>
              <div className="grid grid-cols-5 gap-1.5 font-mono text-xs">
                {buildPlayfairMatrix(quizKey).map((c, i) => {
                  const isPair1 = c === quizPair[0];
                  const isPair2 = c === quizPair[1];
                  return (
                    <div
                      key={`quiz-m-${i}`}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                        isPair1 || isPair2
                          ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 scale-105'
                          : 'bg-slate-900 text-slate-300 border border-slate-800'
                      }`}
                    >
                      {c}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: 3 Complete Academic Solved Exercises */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center gap-2 text-violet-400 mb-3">
                <GraduationCap className="w-5 h-5" />
                <h3 className="text-sm font-bold text-slate-100">
                  3 Ejercicios Resueltos Paso a Paso de Exámenes Pasados
                </h3>
              </div>

              {/* Accordion / List of Exercises */}
              <div className="space-y-4">
                {/* Exercise 1 */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-amber-400">
                      Ejercicio 1: Cifrado con Clave "MONARQUIA"
                    </span>
                    <span className="text-[10px] font-mono bg-slate-900 px-2 py-0.5 rounded text-slate-400">
                      Básico
                    </span>
                  </div>
                  <p className="text-slate-300 mb-2 font-mono">
                    <strong>Texto:</strong> "ATAQUE" → Dígramas: [AT], [AQ], [UE]
                  </p>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono space-y-1 text-slate-300">
                    <div>1. [AT]: Forman Rectángulo → Sustituye por <strong>[CR]</strong></div>
                    <div>2. [AQ]: Misma Fila 1 → Desplaza derecha (+1) → <strong>[RM]</strong></div>
                    <div>3. [UE]: Misma Columna 4 → Desplaza abajo (+1) → <strong>[BE]</strong></div>
                    <div className="text-emerald-400 font-bold pt-1 border-t border-slate-800">
                      Resultado Final: CR RM BE
                    </div>
                  </div>
                </div>

                {/* Exercise 2 */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-amber-400">
                      Ejercicio 2: Caso de Letras Dobles (LL)
                    </span>
                    <span className="text-[10px] font-mono bg-rose-950/50 text-rose-300 border border-rose-800/50 px-2 py-0.5 rounded">
                      ¡Pregunta Típica!
                    </span>
                  </div>
                  <p className="text-slate-300 mb-1 font-mono">
                    <strong>Texto:</strong> "CABALLO" con clave "CRIPTOGRAFIA"
                  </p>
                  <p className="text-slate-400 text-[11px] mb-2">
                    ¡Trampa del examen! No se puede hacer [CA], [BA], [LL], [O]. Como 'LL' son gemelas en el mismo par, se inserta 'X'.
                  </p>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono space-y-1 text-slate-300">
                    <div>• Dígramas preparados: [CA], [BA], [LX], [LO] (número par exacto).</div>
                    <div>1. [CA]: Rectángulo → [TB]</div>
                    <div>2. [BA]: Rectángulo → [TB]</div>
                    <div>3. [LX]: Rectángulo → [QS]</div>
                    <div>4. [LO]: Misma Columna 5 → [TV]</div>
                    <div className="text-emerald-400 font-bold pt-1 border-t border-slate-800">
                      Resultado Final: TB TB QS TV
                    </div>
                  </div>
                </div>

                {/* Exercise 3 */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-amber-400">
                      Ejercicio 3: Descifrado Inverso
                    </span>
                    <span className="text-[10px] font-mono bg-slate-900 px-2 py-0.5 rounded text-slate-400">
                      Inverso (-1)
                    </span>
                  </div>
                  <p className="text-slate-300 mb-2 font-mono">
                    <strong>Criptograma:</strong> "RM BE" con clave "MONARQUIA"
                  </p>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono space-y-1 text-slate-300">
                    <div>1. [RM]: Misma Fila 1 → Desplaza a la IZQUIERDA (-1) → <strong>[AQ]</strong></div>
                    <div>2. [BE]: Misma Columna 4 → Desplaza hacia ARRIBA (-1) → <strong>[UE]</strong></div>
                    <div className="text-emerald-400 font-bold pt-1 border-t border-slate-800">
                      Texto en Claro Recuperado: "AQUE"
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: DESGLOSE DETALLADO DE DÍGRAMAS (PASO 1) */}
      {activeTab === 'digrams' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
          <div className="flex items-center gap-2 text-violet-400">
            <Split className="w-5 h-5" />
            <h3 className="text-sm font-bold text-slate-100">
              Desglose Exhaustivo de la Formación de Dígramas (Regla del Paso 1)
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            El 70% de las fallas en exámenes de Playfair ocurren antes de tocar la matriz: en la preparación del texto.
            Esta tabla analiza cómo tu texto actual <strong>"{inputText}"</strong> fue normalizado y dividido en pares según las reglas oficiales.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border border-slate-800 rounded-xl overflow-hidden">
              <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3"># Par</th>
                  <th className="p-3">Dígrama Generado</th>
                  <th className="p-3">Letra 1</th>
                  <th className="p-3">Letra 2</th>
                  <th className="p-3">Tipo de Caso</th>
                  <th className="p-3">Regla Aplicada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/60">
                {digramDetails.map((dg, idx) => (
                  <tr key={`dg-table-${idx}`} className="hover:bg-slate-800/40">
                    <td className="p-3 text-slate-400">#{idx + 1}</td>
                    <td className="p-3">
                      <span className="font-bold text-amber-400 text-sm bg-slate-950 px-2 py-1 rounded border border-slate-800">
                        {dg.pair}
                      </span>
                    </td>
                    <td className="p-3 text-slate-200">{dg.char1}</td>
                    <td className="p-3 text-slate-200">{dg.char2}</td>
                    <td className="p-3">
                      {dg.reason === 'normal' && (
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                          Estándar
                        </span>
                      )}
                      {dg.reason === 'double_letter_split' && (
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                          Letra Doble (Inserta X)
                        </span>
                      )}
                      {dg.reason === 'odd_padding' && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                          Relleno Impar (+X)
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-slate-300 text-[11px]">{dg.explanation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
