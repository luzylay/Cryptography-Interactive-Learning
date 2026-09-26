import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  processPlayfair,
  buildPlayfairMatrix,
  splitIntoDigramsDetails,
  PlayfairStep,
} from '../../crypto/ciphers/playfair';
import { MainTabType } from '../../types';
import {
  Grid,
  ArrowRight,
  ArrowLeft,
  ArrowDown,
  RotateCcw,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  BookOpen,
  Sparkles,
  Lightbulb,
  Check,
  Target,
  Copy,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

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

interface PlayfairGridProps {
  onNavigateTab?: (tab: MainTabType) => void;
}

export const PlayfairGrid: React.FC<PlayfairGridProps> = ({ onNavigateTab }) => {
  const [keyword, setKeyword] = useState<string>('MIEDO');
  const [inputText, setInputText] = useState<string>('Las sombras llaman a la puerta del castillo hoy');
  const [direction, setDirection] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [cellDisplayMode, setCellDisplayMode] = useState<'spanish' | 'international'>('spanish');
  const [selectedPairIndex, setSelectedPairIndex] = useState<number>(0);
  const [copiedSolution, setCopiedSolution] = useState<boolean>(false);
  const [showRulesQuickRef, setShowRulesQuickRef] = useState<boolean>(false);

  // Auto-play state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(1100);

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
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg lg:text-xl font-bold text-slate-100">
                  Cifrador de Playfair (Matriz 5×5)
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-semibold">
                  Laboratorio Interactivo
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                  S08 · Wheatstone
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Simulador visual en tiempo real, resolución paso a paso y auditoría de dígrafos
              </p>
            </div>
          </div>

          {/* Quick Links to Theory & Practice Sections */}
          <div className="flex items-center gap-2">
            {onNavigateTab && (
              <>
                <button
                  onClick={() => onNavigateTab('encyclopedia')}
                  className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500 text-slate-300 hover:text-amber-300 text-xs font-mono font-semibold transition flex items-center gap-1.5 shadow-sm"
                  title="Aprender la teoría completa y fuentes oficiales en la Enciclopedia"
                >
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Ver Teoría Completa</span>
                </button>
                <button
                  onClick={() => onNavigateTab('practice')}
                  className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-violet-500 text-slate-300 hover:text-violet-300 text-xs font-mono font-semibold transition flex items-center gap-1.5 shadow-sm"
                  title="Ir a resolver ejercicios de autoevaluación"
                >
                  <Target className="w-4 h-4 text-violet-400" />
                  <span>Resolver Ejercicios</span>
                </button>
              </>
            )}
            <button
              onClick={() => setShowRulesQuickRef(prev => !prev)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono transition flex items-center gap-1"
            >
              <span>Reglas Rápidas</span>
              {showRulesQuickRef ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
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
              onClick={() => loadPreset(p)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-violet-500 text-slate-300 hover:text-violet-300 font-mono text-[11px] transition flex items-center gap-1.5"
            >
              <span className="text-amber-400 font-bold">[{p.badge}]</span>
              <span>{p.name.split('(')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Rules Reference Accordion */}
      {showRulesQuickRef && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-xl">
          <div className="p-3 bg-slate-950 rounded-xl border border-sky-500/30 text-xs font-mono">
            <span className="text-sky-400 font-bold block mb-1 flex items-center gap-1">
              <ArrowRight className="w-3.5 h-3.5" /> Misma Fila (Horizontal):
            </span>
            <span className="text-slate-300">
              Cada letra camina <strong>1 paso a la derecha (+1 mod 5)</strong>. Al borde derecho da salto circular al inicio (Pac-Man).
            </span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-purple-500/30 text-xs font-mono">
            <span className="text-purple-400 font-bold block mb-1 flex items-center gap-1">
              <ArrowDown className="w-3.5 h-3.5" /> Misma Columna (Vertical):
            </span>
            <span className="text-slate-300">
              Cada letra da <strong>1 paso hacia abajo (+1 mod 5)</strong>. Al fondo da salto circular al techo.
            </span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-amber-500/30 text-xs font-mono">
            <span className="text-amber-400 font-bold block mb-1 flex items-center gap-1">
              <Grid className="w-3.5 h-3.5" /> Rectángulo (Opuestas):
            </span>
            <span className="text-slate-300">
              Cada letra <strong>conserva su propia fila</strong> y toma la columna de su compañera (cruce horizontal).
            </span>
          </div>
        </div>
      )}

      {/* Simulator Inputs & Configuration Panel */}
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
            <span>Mensaje en Claro a Procesar (M):</span>
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
              <span>Explicación en Tiempo Real del Paso #{activeStep.pairIndex + 1}:</span>
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
                Matriz 5×5 Desarrollada
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
  );
};
