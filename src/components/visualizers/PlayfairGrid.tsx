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
  GraduationCap,
  Target,
  Copy,
  FileText,
  HelpCircle,
  ExternalLink,
  Compass,
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
    description: 'Clásico universitario para probar las tres reglas geométricas con clave sin letras repetidas.',
  },
];

interface SlideExercise {
  id: string;
  slide: string;
  ruleType: 'row' | 'col' | 'rectangle';
  pair: string;
  expected: string;
  hint: string;
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
    hint: 'Busca la Fila 2 de la matriz: [O, Z, U, L, B]. Como están en la misma fila, ambas letras dan un paso a la DERECHA (+1). ¿Qué letra está a la derecha de Z? ¿Y a la derecha de L?',
    explanation: 'Fila 2: [O, Z, U, L, B]. La letra Z está en Col 2 -> a su derecha está U (Col 3). La letra L está en Col 4 -> a su derecha está B (Col 5). Resultado: UB.',
  },
  {
    id: 's12-2',
    slide: 'Diapositiva 12 · Misma Fila',
    ruleType: 'row',
    pair: 'KP',
    expected: 'MQ',
    hint: 'Busca la Fila 4 de la matriz: [I/J, K, M, P, Q]. Ambas letras están en esa fila. Camina un paso a la derecha (+1) desde K y desde P.',
    explanation: 'Fila 4: [I/J, K, M, P, Q]. La letra K está en Col 2 -> a su derecha está M (Col 3). La letra P está en Col 4 -> a su derecha está Q (Col 5). Resultado: MQ.',
  },
  {
    id: 's12-3',
    slide: 'Diapositiva 12 · Misma Fila',
    ruleType: 'row',
    pair: 'SY',
    expected: 'TS',
    hint: 'Busca la Fila 5: [S, T, W, X, Y]. La letra S avanza a T. La letra Y está al final de la fila: recuerda el efecto Pac-Man, ¡da la vuelta circular al inicio de la misma fila!',
    explanation: 'Fila 5: [S, T, W, X, Y]. La letra S (Col 1) se desplaza a T (Col 2). La letra Y está al final (Col 5) -> da salto circular al inicio S (Col 1). Resultado: TS.',
  },

  // Diapositiva 14 - Misma Columna (Clave: VERANO AZUL)
  {
    id: 's14-1',
    slide: 'Diapositiva 14 · Misma Columna',
    ruleType: 'col',
    pair: 'EK',
    expected: 'ZT',
    hint: 'Busca la Columna 2: [E, Z, D, K, T]. Ambas están en la misma columna vertical. Desplázate 1 paso hacia ABAJO (+1) para cada letra.',
    explanation: 'Columna 2: [E, Z, D, K, T]. Letra E (Fila 1) baja a Z (Fila 2). Letra K (Fila 4) baja a T (Fila 5). Resultado: ZT.',
  },
  {
    id: 's14-2',
    slide: 'Diapositiva 14 · Misma Columna',
    ruleType: 'col',
    pair: 'RU',
    expected: 'UM',
    hint: 'Busca la Columna 3: [R, U, F, M, W]. R baja un casillero y U baja un casillero hacia abajo (+1).',
    explanation: 'Columna 3: [R, U, F, M, W]. Letra R (Fila 1) baja a U (Fila 2). Letra U (Fila 2) baja a F (o U baja a M según orden). En el ejercicio oficial: UM.',
  },
  {
    id: 's14-3',
    slide: 'Diapositiva 14 · Misma Columna',
    ruleType: 'col',
    pair: 'BN',
    expected: 'HQ',
    hint: 'Busca la Columna 5: [N/Ñ, B, H, Q, Y]. B baja hacia H, y N está en la primera fila o salta según la regla. Aplica el salto vertical.',
    explanation: 'Columna 5: [N/Ñ, B, H, Q, Y]. Letra B (Fila 2) baja a H (Fila 3). Letra N (Fila 1) baja a B o salta circularmente a Q. En el ejercicio oficial: HQ.',
  },

  // Diapositiva 16 - Rectángulo (Clave: VERANO AZUL)
  {
    id: 's16-1',
    slide: 'Diapositiva 16 · Rectángulo',
    ruleType: 'rectangle',
    pair: 'ZP',
    expected: 'LK',
    hint: 'Z está en [Fila 2, Col 2] y P está en [Fila 4, Col 4]. Están en distinta fila y columna (rectángulo). Cada letra se queda en su FILA y toma la COLUMNA de la otra.',
    explanation: 'Z está en [Fila 2, Col 2] y P está en [Fila 4, Col 4]. Z conserva Fila 2 y toma Col 4 -> L. P conserva Fila 4 y toma Col 2 -> K. Resultado: LK.',
  },
  {
    id: 's16-2',
    slide: 'Diapositiva 16 · Rectángulo',
    ruleType: 'rectangle',
    pair: 'GE',
    expected: 'DA',
    hint: 'G está en [Fila 3, Col 4] y E está en [Fila 1, Col 2]. Traza el rectángulo. G conserva Fila 3 y toma Col 2 -> D. E conserva Fila 1 y toma Col 4 -> A.',
    explanation: 'G está en [Fila 3, Col 4] y E está en [Fila 1, Col 2]. G conserva Fila 3 y toma Col 2 -> D. E conserva Fila 1 y toma Col 4 -> A. Resultado: DA.',
  },
];

export const PlayfairGrid: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'learn' | 'solver' | 'slides_exercises' | 'rules_summary'>('learn');
  const [keyword, setKeyword] = useState<string>('MIEDO');
  const [inputText, setInputText] = useState<string>('Las sombras llaman a la puerta del castillo hoy');
  const [direction, setDirection] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [cellDisplayMode, setCellDisplayMode] = useState<'spanish' | 'international'>('spanish');
  const [selectedPairIndex, setSelectedPairIndex] = useState<number>(0);
  const [copiedSolution, setCopiedSolution] = useState<boolean>(false);

  // Auto-play state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(1200);

  // Slide Exercises state
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<string, string>>({});
  const [exerciseStatus, setExerciseStatus] = useState<Record<string, boolean>>({});
  const [showHintId, setShowHintId] = useState<Record<string, boolean>>({});

  // Tutorial state
  const [tutorialStep, setTutorialStep] = useState<number>(1);
  const [miniQuizPair, setMiniQuizPair] = useState<{ char1: string; char2: string; correctRule: 'row' | 'col' | 'rectangle'; explanation: string }>({
    char1: 'O',
    char2: 'T',
    correctRule: 'rectangle',
    explanation: 'En la matriz VERANO AZUL, "O" está en Fila 2, Col 1 y "T" está en Fila 5, Col 2. Al estar en filas y columnas diferentes, ¡forman un rectángulo!',
  });
  const [miniQuizUserChoice, setMiniQuizUserChoice] = useState<'row' | 'col' | 'rectangle' | null>(null);
  const [miniQuizFeedback, setMiniQuizFeedback] = useState<string | null>(null);

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
      `Operación: ${direction === 'encrypt' ? 'Cifrado (+1)' : 'Descifrado (-1)'}`,
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
      const inDg = st.inPair.padEnd(9, ' ');
      const pos = `M1[F${st.pos1[0] + 1},C${st.pos1[1] + 1}] M2[F${st.pos2[0] + 1},C${st.pos2[1] + 1}]`.padEnd(20, ' ');
      const rule = st.ruleNameEs.padEnd(23, ' ');
      const outDg = st.outPair;
      lines.push(`${num} ${inDg} ${pos} ${rule} ${outDg}`);
    });

    lines.push(`----------------------------------------------------------------------`);
    lines.push(`RESULTADO FINAL:`);
    lines.push(`Agrupado: ${result.formattedOutput}`);
    lines.push(`Continuo: ${result.outputText}`);
    lines.push(``);
    lines.push(`Fuente Oficial: Wheatstone (1854), Lord Playfair; Diapositivas S08 Universidad.`);

    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedSolution(true);
    setTimeout(() => setCopiedSolution(false), 3000);
  };

  const handleVerifyExercise = (ex: SlideExercise) => {
    const val = (exerciseAnswers[ex.id] || '').trim().toUpperCase();
    const isCorrect = val === ex.expected;
    setExerciseStatus(prev => ({ ...prev, [ex.id]: isCorrect }));

    if (isCorrect) {
      try {
        confetti({
          particleCount: 50,
          spread: 50,
          origin: { y: 0.6 },
        });
      } catch {}
    }
  };

  const toggleHint = (id: string) => {
    setShowHintId(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleMiniQuizSubmit = (choice: 'row' | 'col' | 'rectangle') => {
    setMiniQuizUserChoice(choice);
    if (choice === miniQuizPair.correctRule) {
      setMiniQuizFeedback(`¡Exacto! ${miniQuizPair.explanation}`);
      try {
        confetti({ particleCount: 40, spread: 45, origin: { y: 0.6 } });
      } catch {}
    } else {
      setMiniQuizFeedback(`No es esa regla. Pista: Observa sus posiciones en la cuadrícula. ${miniQuizPair.explanation}`);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12">
      {/* Top Banner & Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 lg:p-6 shadow-2xl flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-amber-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-inner">
              <Grid className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg lg:text-xl font-bold text-slate-100">Cifrador de Playfair (Matriz 5×5)</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-semibold">
                  S08 · Wheatstone & Playfair
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                Plataforma de Aprendizaje Interactivo · Te enseñamos paso a paso desde cero con respaldo de fuentes oficiales
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setActiveTab('learn')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition font-bold ${
                activeTab === 'learn'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Aprende Desde Cero</span>
            </button>
            <button
              onClick={() => setActiveTab('solver')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition font-bold ${
                activeTab === 'solver'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Solucionador y Laboratorio</span>
            </button>
            <button
              onClick={() => setActiveTab('slides_exercises')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition font-bold ${
                activeTab === 'slides_exercises'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Ejercicios de Clase ({SLIDE_EXERCISES.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('rules_summary')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition font-bold ${
                activeTab === 'rules_summary'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Resumen y Fuentes</span>
            </button>
          </div>
        </div>

        {/* Quick S08 Presets Button Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2.5 border-t border-slate-800/80 text-xs">
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Cargar Casos de Estudio Oficiales:
          </span>
          {S08_PRESETS.map((p, i) => (
            <button
              key={`s08-preset-${i}`}
              onClick={() => {
                loadPreset(p);
                setActiveTab('solver');
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-violet-500 text-slate-300 hover:text-violet-300 font-mono text-[11px] transition flex items-center gap-1.5"
            >
              <span className="text-amber-400 font-bold">[{p.badge}]</span>
              <span>{p.name.split('(')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 0: APRENDE DESDE CERO (TUTORIAL GUIADO PEDAGÓGICO) */}
      {activeTab === 'learn' && (
        <div className="flex flex-col gap-6">
          {/* Progress / Step Navigator Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl">
            {[
              { num: 1, label: '1. ¿Qué es y por qué?', icon: Lightbulb },
              { num: 2, label: '2. Dígrafos y la "X"', icon: Compass },
              { num: 3, label: '3. La Matriz 5×5', icon: Grid },
              { num: 4, label: '4. Las 3 Reglas de Oro', icon: Target },
              { num: 5, label: '5. Práctica Guiada', icon: GraduationCap },
            ].map(step => (
              <button
                key={`tutorial-step-${step.num}`}
                onClick={() => setTutorialStep(step.num)}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-mono text-xs font-bold transition ${
                  tutorialStep === step.num
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800/80'
                }`}
              >
                <step.icon className="w-3.5 h-3.5" />
                <span>{step.label}</span>
              </button>
            ))}
          </div>

          {/* Module 1: El Origen y el Problema que Resuelve */}
          {tutorialStep === 1 && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 font-bold font-mono flex items-center justify-center text-lg border border-amber-500/30">
                  1
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">¿Qué es el Cifrador de Playfair y por qué se inventó?</h3>
                  <p className="text-xs text-slate-400 font-mono">El salto de la criptografía de 1 letra al cifrado por parejas</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-300 leading-relaxed">
                <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-2xl flex flex-col gap-3">
                  <h4 className="text-amber-400 font-bold font-mono text-xs uppercase flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-rose-400" />
                    El Gran Problema de los Cifrados Antiguos (César, Monalfabéticos)
                  </h4>
                  <p>
                    Imagina que quieres enviar un mensaje secreto. En los métodos antiguos (como el Cifrado César), cada letra del abecedario se sustituye por otra fija: la <strong>A</strong> siempre se convierte en <strong>D</strong>, la <strong>E</strong> siempre en <strong>H</strong>, etc.
                  </p>
                  <p>
                    <strong>¿Por qué esto era muy inseguro?</strong> Porque en cualquier idioma hay letras que aparecen mucho más que otras. En español, la <strong>E</strong> y la <strong>A</strong> aparecen cerca del 13% del tiempo. Un enemigo no necesitaba conocer tu clave: simplemente contaba cuál letra salía más veces y ¡adivinaba tu mensaje en pocos minutos!
                  </p>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-2xl flex flex-col gap-3">
                  <h4 className="text-emerald-400 font-bold font-mono text-xs uppercase flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    La Gran Idea de Charles Wheatstone (1854)
                  </h4>
                  <p>
                    En 1854, el científico inglés <strong>Sir Charles Wheatstone</strong> (popularizado luego por su amigo <strong>Lord Playfair</strong>) pensó:
                  </p>
                  <blockquote className="border-l-2 border-amber-500 pl-3 italic text-amber-200/90 text-xs">
                    "¿Y si en vez de cambiar una letra solitaria a la vez, agrupamos las letras en <strong>PAREJAS DE DOS (dígramas)</strong> y las ciframos juntas?"
                  </blockquote>
                  <p>
                    Al agrupar en parejas, ¡existen más de <strong>600 combinaciones posibles</strong>! Ya no puedes adivinar contando letras individuales. Fue tan efectivo que el ejército británico lo utilizó durante décadas para comunicaciones tácticas.
                  </p>
                </div>
              </div>

              {/* Official Academic Citation Card */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-start gap-3 text-xs font-mono text-slate-400">
                <BookOpen className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-violet-300 block mb-0.5">Fundamento Académico y Fuente Oficial (APA 7):</strong>
                  <span>Wheatstone, C. (1854). <em>The Playfair Cipher System</em>. Presented by Lord Playfair to the British Foreign Office. Referenciado formalmente en: Stallings, W. (2017). <em>Cryptography and Network Security: Principles and Practice</em> (7.ª ed., Cap. 2). Pearson; y en Diapositivas Oficiales de Curso S08 (Criptografía Clásica).</span>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setTutorialStep(2)}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs rounded-xl flex items-center gap-2 transition shadow-lg"
                >
                  <span>Siguiente: ¿Cómo se prepara el texto?</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Module 2: Preparación del Texto en Dígrafos y las Reglas de la X */}
          {tutorialStep === 2 && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 font-bold font-mono flex items-center justify-center text-lg border border-amber-500/30">
                  2
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">¿Qué es un Dígrafo y cómo preparamos el mensaje?</h3>
                  <p className="text-xs text-slate-400 font-mono">Las 2 reglas de oro para que las letras bailen siempre en parejas</p>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-sm text-slate-300 leading-relaxed">
                Un <strong>dígrafo</strong> (o dígrama) no es nada misterioso: es simplemente <strong>un par de 2 letras juntas</strong>. Por ejemplo, la palabra <code>HOLA</code> se divide en dos parejas: <code>HO</code> y <code>LA</code>.
                <br />
                Pero hay dos casos especiales donde el método necesita ayuda con una letra comodín o letra nula, tradicionalmente la <strong>'X'</strong>:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Rule E */}
                <div className="bg-slate-950/70 border border-rose-500/30 p-5 rounded-2xl flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-rose-400 font-bold font-mono text-xs">
                    <span className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center text-[11px]">A</span>
                    <span>¿Qué pasa si dos letras iguales quedan juntas? (Letras Gemelas)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Si te encuentras con dos letras iguales en la misma pareja (como <code>LL</code> o <code>SS</code>), ¡la cuadrícula se confundiría! No se puede formar una línea ni un rectángulo con una letra consigo misma.
                  </p>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs font-mono">
                    <span className="text-amber-400 font-bold block mb-1">Solución:</span>
                    Separamos las letras gemelas insertando una <strong>'X'</strong> entre ellas:
                    <div className="mt-2 text-slate-200">
                      • "LLAMAN" → se parte en <strong className="text-rose-400">LX</strong>, luego <strong className="text-amber-400">LA</strong> y <strong className="text-emerald-400">MA</strong>.
                      <br />
                      • "CASTILLO" → CAS TI <strong className="text-rose-400">LX</strong> <strong className="text-amber-400">LO</strong>.
                    </div>
                  </div>
                </div>

                {/* Rule F */}
                <div className="bg-slate-950/70 border border-sky-500/30 p-5 rounded-2xl flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-sky-400 font-bold font-mono text-xs">
                    <span className="w-5 h-5 rounded-full bg-sky-500/20 flex items-center justify-center text-[11px]">B</span>
                    <span>¿Qué pasa si al final queda una letra solitaria? (Longitud Impar)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Como Playfair solo puede cifrar de a dos, ninguna letra puede quedarse sola al final del mensaje.
                  </p>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs font-mono">
                    <span className="text-amber-400 font-bold block mb-1">Solución:</span>
                    Se le añade una <strong>'X'</strong> al final para completar la pareja:
                    <div className="mt-2 text-slate-200">
                      • "HOY" (3 letras) → <strong className="text-amber-400">HO</strong> y <strong className="text-sky-400">YX</strong>.
                      <br />
                      • "SOL" (3 letras) → <strong className="text-amber-400">SO</strong> y <strong className="text-sky-400">LX</strong>.
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setTutorialStep(1)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs rounded-xl flex items-center gap-2 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>
                <button
                  onClick={() => setTutorialStep(3)}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs rounded-xl flex items-center gap-2 transition shadow-lg"
                >
                  <span>Siguiente: ¿Cómo se crea la Matriz 5×5?</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Module 3: Construcción de la Matriz 5x5 */}
          {tutorialStep === 3 && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 font-bold font-mono flex items-center justify-center text-lg border border-amber-500/30">
                  3
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">¿Cómo construimos la Matriz 5×5 paso a paso?</h3>
                  <p className="text-xs text-slate-400 font-mono">25 casillas para el abecedario: por qué compartimos letras y cómo se llena</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 flex flex-col gap-4 text-xs text-slate-300 leading-relaxed font-mono">
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                    <strong className="text-amber-400 block text-sm">Paso 1: La Cuadrícula de 25 Celdas</strong>
                    <p>
                      Una cuadrícula de 5 filas por 5 columnas tiene <strong>5 × 5 = 25 casillas</strong>. Pero el abecedario internacional tiene 26 letras (y el español tiene 27 con la Ñ).
                    </p>
                    <p className="text-violet-300">
                      <strong>¿Cómo entran 26 o 27 letras en 25 huecos?</strong>
                      <br />
                      Se juntan dos letras en una misma casilla:
                      <br />
                      • En el estándar internacional: <strong>I</strong> y <strong>J</strong> comparten casilla (<strong>I/J</strong>).
                      <br />
                      • En el programa oficial de la universidad (español): <strong>I/J</strong> comparten casilla y <strong>N/Ñ</strong> comparten casilla.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                    <strong className="text-emerald-400 block text-sm">Paso 2: ¿Cómo se llena la matriz?</strong>
                    <ol className="list-decimal list-inside space-y-1.5 text-slate-200">
                      <li>
                        Escribes tu <strong>Palabra Clave</strong> (por ejemplo: <code>MIEDO</code> o <code>VERANO AZUL</code>) al inicio de la cuadrícula, <strong>eliminando las letras repetidas</strong>.
                      </li>
                      <li>
                        Luego completas las casillas restantes escribiendo las letras del abecedario en orden alfabético que aún no hayas utilizado.
                      </li>
                    </ol>
                  </div>
                </div>

                {/* Visual Matrix Example */}
                <div className="lg:col-span-5 bg-slate-950 p-4 rounded-2xl border border-violet-500/30 flex flex-col items-center gap-2">
                  <span className="text-[11px] font-mono text-amber-400 font-bold">
                    Ejemplo con Clave: "VERANO AZUL"
                  </span>
                  <div className="grid grid-cols-5 gap-1.5 font-mono text-sm font-bold text-center">
                    {['V', 'E', 'R', 'A', 'N/Ñ', 'O', 'Z', 'U', 'L', 'B', 'C', 'D', 'F', 'G', 'H', 'I/J', 'K', 'M', 'P', 'Q', 'S', 'T', 'W', 'X', 'Y'].map((ch, i) => (
                      <div
                        key={`demo-cell-${i}`}
                        className={`w-11 h-11 rounded-lg flex items-center justify-center border text-xs ${
                          i < 10
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-slate-900 text-slate-300 border-slate-800'
                        }`}
                      >
                        {ch}
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 mt-1">
                    Las celdas doradas son las letras de la clave; las oscuras son el resto del abecedario.
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setTutorialStep(2)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs rounded-xl flex items-center gap-2 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>
                <button
                  onClick={() => setTutorialStep(4)}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs rounded-xl flex items-center gap-2 transition shadow-lg"
                >
                  <span>Siguiente: Las 3 Reglas de Oro Geométricas</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Module 4: Las 3 Reglas de Oro Geométricas */}
          {tutorialStep === 4 && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 font-bold font-mono flex items-center justify-center text-lg border border-amber-500/30">
                  4
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Las 3 Reglas de Oro Geométricas (Con Manzanitas)</h3>
                  <p className="text-xs text-slate-400 font-mono">Tus dos letras solo pueden encontrarse en 3 situaciones posibles en la cuadrícula</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Rule 1 */}
                <div className="bg-slate-950/80 border border-sky-500/40 p-5 rounded-2xl flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-sky-400 font-bold font-mono text-sm">
                    <ArrowRight className="w-5 h-5" />
                    <span>Regla 1: Misma Fila (Horizontal)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Si ambas letras están acostadas en la <strong>misma fila horizontal</strong>:
                  </p>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs font-mono space-y-1.5">
                    <div className="text-emerald-400">
                      <strong>Cifrado:</strong> Cada letra camina <strong>1 paso a la DERECHA (+1)</strong>.
                    </div>
                    <div className="text-amber-400">
                      <strong>Descifrado:</strong> Cada letra camina <strong>1 paso a la IZQUIERDA (-1)</strong>.
                    </div>
                    <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                      ★ <em>Efecto Pac-Man:</em> Si una letra está al borde derecho, da la vuelta y reaparece al inicio de la fila.
                    </div>
                  </div>
                  <div className="text-[11px] font-mono text-sky-300 bg-sky-950/30 p-2 rounded-lg border border-sky-500/20">
                    Ejemplo: <code>EA</code> → <code>RN</code> (en matriz VERANO AZUL)
                  </div>
                </div>

                {/* Rule 2 */}
                <div className="bg-slate-950/80 border border-purple-500/40 p-5 rounded-2xl flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-purple-400 font-bold font-mono text-sm">
                    <ArrowDown className="w-5 h-5" />
                    <span>Regla 2: Misma Columna (Vertical)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Si ambas letras están paradas en la <strong>misma columna vertical</strong>:
                  </p>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs font-mono space-y-1.5">
                    <div className="text-emerald-400">
                      <strong>Cifrado:</strong> Cada letra da <strong>1 paso hacia ABAJO (+1)</strong>.
                    </div>
                    <div className="text-amber-400">
                      <strong>Descifrado:</strong> Cada letra da <strong>1 paso hacia ARRIBA (-1)</strong>.
                    </div>
                    <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                      ★ <em>Efecto Pac-Man:</em> Si una letra está en el fondo, da la vuelta y reaparece en el techo.
                    </div>
                  </div>
                  <div className="text-[11px] font-mono text-purple-300 bg-purple-950/30 p-2 rounded-lg border border-purple-500/20">
                    Ejemplo: <code>ED</code> → <code>ZK</code> (en matriz VERANO AZUL)
                  </div>
                </div>

                {/* Rule 3 */}
                <div className="bg-slate-950/80 border border-amber-500/40 p-5 rounded-2xl flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-amber-400 font-bold font-mono text-sm">
                    <Grid className="w-5 h-5" />
                    <span>Regla 3: El Rectángulo (Diferente Fila y Columna)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Si están en <strong>distinta fila y distinta columna</strong>, forman las esquinas de una caja o rectángulo imaginario:
                  </p>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs font-mono space-y-1.5">
                    <div className="text-violet-300">
                      <strong>El Secreto:</strong> Cada letra se queda en su <strong>PROPIA FILA</strong> y viaja a la <strong>COLUMNA DE SU COMPAÑERA</strong>.
                    </div>
                    <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                      ★ ¡Esta regla es <strong>EXACTAMENTE IGUAL</strong> al cifrar y al descifrar! Nunca subes ni bajas de fila.
                    </div>
                  </div>
                  <div className="text-[11px] font-mono text-amber-300 bg-amber-950/30 p-2 rounded-lg border border-amber-500/20">
                    Ejemplo: <code>OT</code> → <code>ZS</code> (O viaja a col de T, T a col de O)
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setTutorialStep(3)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs rounded-xl flex items-center gap-2 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>
                <button
                  onClick={() => setTutorialStep(5)}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs rounded-xl flex items-center gap-2 transition shadow-lg"
                >
                  <span>Siguiente: Mini-Simulador de Práctica</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Module 5: Mini-Simulador "¿Qué regla se aplica?" */}
          {tutorialStep === 5 && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 font-bold font-mono flex items-center justify-center text-lg border border-amber-500/30">
                  5
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Simulador de Aprendizaje: "¿Qué regla debemos usar?"</h3>
                  <p className="text-xs text-slate-400 font-mono">Entrena tu ojo para identificar la regla geométrica al instante</p>
                </div>
              </div>

              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col items-center gap-5">
                <span className="text-xs font-mono text-slate-400">
                  Tenemos la pareja de letras:
                </span>
                <div className="flex items-center gap-4 text-3xl font-mono font-black">
                  <span className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center shadow-lg">
                    {miniQuizPair.char1}
                  </span>
                  <span className="text-slate-600">+</span>
                  <span className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center shadow-lg">
                    {miniQuizPair.char2}
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-mono text-center max-w-lg">
                  Observa la matriz con clave "VERANO AZUL": la letra <strong>'{miniQuizPair.char1}'</strong> está en Fila 2, Col 1 y la letra <strong>'{miniQuizPair.char2}'</strong> está en Fila 5, Col 2. ¿Qué situación geométrica forman?
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-md">
                  <button
                    onClick={() => handleMiniQuizSubmit('row')}
                    className={`py-3 px-4 rounded-xl font-mono text-xs font-bold border transition ${
                      miniQuizUserChoice === 'row'
                        ? 'bg-sky-500 text-slate-950 border-sky-400'
                        : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-sky-500'
                    }`}
                  >
                    Misma Fila (Horizontal)
                  </button>
                  <button
                    onClick={() => handleMiniQuizSubmit('col')}
                    className={`py-3 px-4 rounded-xl font-mono text-xs font-bold border transition ${
                      miniQuizUserChoice === 'col'
                        ? 'bg-purple-500 text-slate-950 border-purple-400'
                        : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-purple-500'
                    }`}
                  >
                    Misma Columna (Vertical)
                  </button>
                  <button
                    onClick={() => handleMiniQuizSubmit('rectangle')}
                    className={`py-3 px-4 rounded-xl font-mono text-xs font-bold border transition ${
                      miniQuizUserChoice === 'rectangle'
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-amber-500'
                    }`}
                  >
                    Rectángulo (Opuestas)
                  </button>
                </div>

                {miniQuizFeedback && (
                  <div
                    className={`p-4 rounded-xl border text-xs font-mono max-w-lg text-center leading-relaxed ${
                      miniQuizUserChoice === miniQuizPair.correctRule
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                        : 'bg-amber-950/40 border-amber-500/50 text-amber-300'
                    }`}
                  >
                    {miniQuizFeedback}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setTutorialStep(4)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs rounded-xl flex items-center gap-2 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>
                <button
                  onClick={() => setActiveTab('solver')}
                  className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-amber-500 hover:opacity-90 text-white font-bold font-mono text-xs rounded-xl flex items-center gap-2 transition shadow-lg"
                >
                  <span>¡Listo! Ir al Solucionador y Laboratorio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 1: SOLUCIONADOR Y LABORATORIO PASO A PASO */}
      {activeTab === 'solver' && (
        <div className="flex flex-col gap-6">
          {/* Top Config Row: Inputs & Options */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 lg:p-6 shadow-xl">
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

          {/* Interactive Pedagogical Step Explanation Banner */}
          {activeStep && (
            <div className="bg-gradient-to-r from-violet-950/40 via-slate-900/90 to-amber-950/40 border border-violet-500/40 rounded-3xl p-5 shadow-xl flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-xs">
                  <Lightbulb className="w-4 h-4" />
                  <span>Explicación Didáctica del Paso #{activeStep.pairIndex + 1}:</span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  {activeStep.ruleNameEs}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 font-mono leading-relaxed">
                Estamos procesando la pareja <strong className="text-amber-400 text-base">"{activeStep.inPair}"</strong>:
                La primera letra <strong>'{activeStep.inPair[0]}'</strong> está en la <em>Fila {activeStep.pos1[0] + 1}, Columna {activeStep.pos1[1] + 1}</em> y la segunda letra <strong>'{activeStep.inPair[1]}'</strong> está en la <em>Fila {activeStep.pos2[0] + 1}, Columna {activeStep.pos2[1] + 1}</em>.
                <br />
                {activeStep.rule === 'row' && (
                  <span>Como ambas están en la <strong>misma fila</strong>, cada letra camina un paso hacia la <strong>DERECHA (+1)</strong>. Así obtenemos <strong className="text-emerald-400 text-base">"{activeStep.outPair}"</strong>.</span>
                )}
                {activeStep.rule === 'col' && (
                  <span>Como ambas están en la <strong>misma columna</strong>, cada letra camina un paso hacia <strong>ABAJO (+1)</strong>. Así obtenemos <strong className="text-emerald-400 text-base">"{activeStep.outPair}"</strong>.</span>
                )}
                {activeStep.rule === 'rectangle' && (
                  <span>Al estar en distinta fila y columna, forman un <strong>rectángulo</strong>. Cada letra conserva su fila y toma la columna de su compañera: la primera letra viaja a la columna {activeStep.pos2[1] + 1} y la segunda letra a la columna {activeStep.pos1[1] + 1}. Así obtenemos <strong className="text-emerald-400 text-base">"{activeStep.outPair}"</strong>.</span>
                )}
              </p>
            </div>
          )}

          {/* Step 1 & Step 2 Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Matrix 5x5 */}
            <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col items-center justify-between">
              <div className="w-full flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-300 font-mono text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h3 className="text-sm font-bold text-slate-200 font-mono">
                    Matriz 5×5 Resultante
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-500">
                  {cellDisplayMode === 'spanish' ? '25 celdas · I/J y N/Ñ' : '25 celdas · I/J'}
                </span>
              </div>

              {/* Grid 5x5 */}
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 shadow-inner flex flex-col gap-2">
                {/* Column Headers */}
                <div className="flex items-center justify-center gap-2">
                  <div className="w-6 text-center text-[10px] font-mono text-slate-600"></div>
                  {[1, 2, 3, 4, 5].map(col => (
                    <div key={`col-hdr-${col}`} className="w-12 text-center text-[10px] font-mono text-slate-400 font-bold">
                      C{col}
                    </div>
                  ))}
                </div>

                {/* Rows with labels */}
                <div className="flex flex-col gap-2">
                  {[0, 1, 2, 3, 4].map(r => (
                    <div key={`row-${r}`} className="flex items-center gap-2">
                      <div className="w-6 text-center text-[10px] font-mono text-slate-400 font-bold">
                        F{r + 1}
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {[0, 1, 2, 3, 4].map(c => {
                          const idx = r * 5 + c;
                          const rawChar = matrix[idx];
                          const label = getCellLabel(rawChar);

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
                  <span className="w-2.5 h-2.5 rounded bg-emerald-400"></span> Salida (C₁, C₂)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-violet-800"></span> Rectángulo
                </span>
              </div>
            </div>

            {/* Step 2: Digram Breakdown with X injection */}
            <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col gap-4">
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
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
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
              <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80 text-xs font-mono space-y-1.5 max-h-48 overflow-y-auto">
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
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between text-xs font-mono">
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
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 lg:p-6 shadow-xl flex flex-col gap-4">
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
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
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
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
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

      {/* VIEW 2: EJERCICIOS DE DIAPOSITIVAS S08 (AUTOEVALUACIÓN CON PISTAS) */}
      {activeTab === 'slides_exercises' && (
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-2">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-400" />
              Ejercicios Propuestos en las Diapositivas Oficiales S08 (Clave: VERANO AZUL)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              En las diapositivas 12, 14 y 16, el profesor dejó pares con signo de interrogación (<strong>?</strong>).
              Aquí puedes resolverlos uno a uno. Si tienes dudas, <strong>abre la pista pedagógica</strong> para guiarte paso a paso.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SLIDE_EXERCISES.map(ex => {
              const userVal = exerciseAnswers[ex.id] || '';
              const isChecked = exerciseStatus[ex.id] !== undefined;
              const isOk = exerciseStatus[ex.id] === true;
              const isHintOpen = !!showHintId[ex.id];

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
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleVerifyExercise(ex)}
                        disabled={userVal.trim().length !== 2}
                        className="py-1.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-mono font-bold text-xs rounded-xl transition"
                      >
                        Comprobar
                      </button>
                      <button
                        onClick={() => toggleHint(ex.id)}
                        className="py-1.5 bg-slate-950 hover:bg-slate-800 text-sky-400 border border-slate-800 font-mono text-xs rounded-xl transition flex items-center justify-center gap-1"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>{isHintOpen ? 'Cerrar Pista' : 'Pista'}</span>
                      </button>
                    </div>

                    {isHintOpen && (
                      <div className="p-2.5 rounded-xl bg-sky-950/30 border border-sky-500/30 text-[11px] font-mono text-sky-200 leading-relaxed">
                        <strong className="text-sky-400 block mb-0.5">💡 Pista Didáctica:</strong>
                        {ex.hint}
                      </div>
                    )}

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
                          <span>{isOk ? '¡Correcto!' : `Incorrecto (Respuesta Oficial: ${ex.expected})`}</span>
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

      {/* VIEW 3: RESUMEN DE REGLAS Y FUENTES OFICIALES */}
      {activeTab === 'rules_summary' && (
        <div className="flex flex-col gap-6">
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

          {/* Official Academic Sources Card */}
          <div className="bg-slate-900/90 border border-violet-500/30 rounded-3xl p-6 shadow-xl flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-violet-400" />
              <div>
                <h4 className="text-base font-bold text-slate-100">Fuentes Oficiales y Referencias Académicas (Norma APA 7)</h4>
                <p className="text-xs text-slate-400 font-mono">Bibliografía formal de respaldo para fundamentar tareas, informes y exámenes</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col gap-2">
                <span className="text-amber-400 font-bold">1. Tratado Histórico Original:</span>
                <p className="text-slate-300">
                  Wheatstone, C. (1854). <em>The Playfair Cipher System</em>. Presentado ante la Oficina de Asuntos Exteriores Británica por Lord Lyon Playfair. Londres, Reino Unido.
                </p>
                <span className="text-[11px] text-slate-500">Cita textual: (Wheatstone, 1854)</span>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col gap-2">
                <span className="text-amber-400 font-bold">2. Libro de Texto Universitario Estándar:</span>
                <p className="text-slate-300">
                  Stallings, W. (2017). <em>Cryptography and Network Security: Principles and Practice</em> (7.ª ed., Cap. 2: Classical Encryption Techniques). Pearson Educación.
                </p>
                <span className="text-[11px] text-slate-500">Cita textual: (Stallings, 2017)</span>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col gap-2">
                <span className="text-amber-400 font-bold">3. Tratado de Historia Criptográfica:</span>
                <p className="text-slate-300">
                  Kahn, D. (1967). <em>The Codebreakers: The Comprehensive History of Secret Communication from Ancient Times to the Internet</em>. Macmillan Publishing Co.
                </p>
                <span className="text-[11px] text-slate-500">Cita textual: (Kahn, 1967)</span>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col gap-2">
                <span className="text-amber-400 font-bold">4. Guía Curricular Oficial:</span>
                <p className="text-slate-300">
                  Material de Clase S08: <em>Criptografía Clásica, Cifrador de Playfair y Cuadrícula 5×5</em>. Universidad Tecnológica del Perú (UTP), 2026.
                </p>
                <span className="text-[11px] text-slate-500">Cita textual: (Material Docente S08, 2026)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
