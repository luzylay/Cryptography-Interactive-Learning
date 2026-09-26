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
  Sparkles,
  Lightbulb,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface S08Preset {
  label: string;
  name: string;
  badge: string;
  key: string;
  text: string;
  description: string;
}

const S08_PRESETS: S08Preset[] = [
  {
    label: 'Caso 1: bienvenido',
    name: 'Caso 1: Longitud Par ("bienvenido a la UTP")',
    badge: '8 pares exactos',
    key: 'MIEDO',
    text: 'bienvenido a la UTP',
    description: 'Demuestra el cifrado regular de longitud par sin repetición de letras. Criptograma: KB DL XM KD OM CH GQ UN.',
  },
  {
    label: 'Caso 2: bienvenidos',
    name: 'Caso 2: Longitud Impar ("bienvenidos a la UTP")',
    badge: 'Relleno de letra X',
    key: 'MIEDO',
    text: 'bienvenidos a la UTP',
    description: 'Demuestra cómo una letra adicional al final altera la agrupación en dígramos y requiere relleno.',
  },
  {
    label: 'Caso 3: Letras Dobles',
    name: 'Caso 3: Ruptura de Gemelas ("Las sombras...")',
    badge: 'Ruptura SS/LL + Relleno YX',
    key: 'MIEDO',
    text: 'Las sombras llaman a la puerta del castillo hoy',
    description: 'Demuestra la inserción de "X" intermedia para romper letras dobles iguales (SS, LL) y el relleno final (YX).',
  },
  {
    label: 'Caso 4: VERANO AZUL',
    name: 'Caso 4: Clave "VERANO AZUL"',
    badge: '4 Reglas Geométricas',
    key: 'VERANO AZUL',
    text: 'EA LU DH ED FU AX OT YU MI EN',
    description: 'Demuestra las 4 situaciones geométricas: Misma Fila, Misma Columna, Rectángulo y Letras Compartidas.',
  },
  {
    label: 'Caso 5: CRIPTOGRAFIA',
    name: 'Caso 5: Clave "CRIPTOGRAFIA"',
    badge: 'Ejemplo Clásico',
    key: 'CRIPTOGRAFIA',
    text: 'ATAQUE AL AMANECER',
    description: 'Clásico de sustitución digrámica para probar las tres reglas geométricas.',
  },
];

interface PlayfairGridProps {
  onNavigateTab?: (tab: MainTabType) => void;
}

export const PlayfairGrid: React.FC<PlayfairGridProps> = ({ onNavigateTab }) => {
  const [keyword, setKeyword] = useState<string>('MIEDO');
  const [inputText, setInputText] = useState<string>('bienvenido a la UTP');
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

  // Extract unique key characters for matrix highlight
  const uniqueKeyChars = useMemo(() => {
    const seen = new Set<string>();
    const chars: string[] = [];
    for (const c of keyword.toUpperCase().replace(/J/g, 'I')) {
      if (/[A-Z]/.test(c) && !seen.has(c)) {
        seen.add(c);
        chars.push(c);
      }
    }
    return chars;
  }, [keyword]);

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
    <div className="flex flex-col gap-6 p-2 lg:p-4 w-full max-w-7xl mx-auto">
      {/* Header unificado del Laboratorio (consistente con Vigenère, Polibio, Alberti, Hill) */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Grid className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">Cifrador de Playfair (Matriz 5×5)</h2>
            <p className="text-xs text-slate-400 font-mono">
              Sustitución Digrámica · Matriz 5×5 con Fusión I/J ·{' '}
              <span className="text-violet-400 font-mono text-[10px]">Fuente APA 7: Wheatstone (1854); Kahn (1967)</span>
            </p>
          </div>
        </div>

        {/* Acciones y Casos de Prueba */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Selector de Presets S08 */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            <span className="text-slate-500 text-[11px] px-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Casos:
            </span>
            {S08_PRESETS.map((p, i) => {
              const isActive = keyword === p.key && inputText === p.text;
              return (
                <button
                  key={`preset-${i}`}
                  onClick={() => loadPreset(p)}
                  className={`px-2.5 py-1 rounded-lg transition text-[11px] font-mono ${
                    isActive
                      ? 'bg-violet-600/50 text-white font-bold border border-violet-400/60 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                  title={`${p.name}: ${p.description}`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setShowRulesQuickRef(prev => !prev)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono transition flex items-center gap-1"
          >
            <span>Reglas</span>
            {showRulesQuickRef ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={copyFullSolution}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-violet-500/50 text-slate-300 hover:text-violet-300 text-xs font-mono transition flex items-center gap-1.5"
            title="Copiar solución completa al portapapeles"
          >
            {copiedSolution ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-violet-400" />}
            <span>{copiedSolution ? 'Copiado' : 'Copiar Solución'}</span>
          </button>
        </div>
      </div>

      {/* Resumen desplegable de las 3 reglas geométricas */}
      {showRulesQuickRef && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <div className="p-3 bg-slate-950/80 rounded-xl border border-sky-500/30 text-xs font-mono">
            <span className="text-sky-400 font-bold block mb-1 flex items-center gap-1">
              <ArrowRight className="w-3.5 h-3.5" /> 1. Misma Fila (Horizontal):
            </span>
            <span className="text-slate-300">
              Cada letra avanza <strong>1 paso a la derecha (+1 mod 5)</strong>. Al borde derecho vuelve al inicio de la fila.
            </span>
          </div>
          <div className="p-3 bg-slate-950/80 rounded-xl border border-purple-500/30 text-xs font-mono">
            <span className="text-purple-400 font-bold block mb-1 flex items-center gap-1">
              <ArrowDown className="w-3.5 h-3.5" /> 2. Misma Columna (Vertical):
            </span>
            <span className="text-slate-300">
              Cada letra baja <strong>1 paso hacia abajo (+1 mod 5)</strong>. Al fondo vuelve a la primera fila.
            </span>
          </div>
          <div className="p-3 bg-slate-950/80 rounded-xl border border-amber-500/30 text-xs font-mono">
            <span className="text-amber-400 font-bold block mb-1 flex items-center gap-1">
              <Grid className="w-3.5 h-3.5" /> 3. Rectángulo (Opuestas):
            </span>
            <span className="text-slate-300">
              Cada letra <strong>conserva su propia fila</strong> e intercambia columnas con la otra letra.
            </span>
          </div>
        </div>
      )}

      {/* FASE 1: Parámetros del Criptograma (Entradas y Casos de Demostración) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-300 font-mono text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h3 className="text-sm font-bold text-slate-100 font-mono">
              Parámetros de Entrada (Clave y Mensaje)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Define la clave secreta y la frase a procesar
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Keyword Input */}
          <div className="lg:col-span-4 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-slate-400">Palabra Clave (K):</label>
              <span className="text-[10px] font-mono text-violet-400">
                {uniqueKeyChars.length} letras únicas
              </span>
            </div>
            <input
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value.toUpperCase())}
              placeholder="Ej. MIEDO o VERANO AZUL"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-violet-300 font-mono font-bold uppercase focus:outline-none focus:border-violet-500 tracking-wider"
            />
            {/* Unique Key letters pill */}
            <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500 overflow-x-auto pt-0.5">
              <span>Letras Clave:</span>
              {uniqueKeyChars.map((ch, idx) => (
                <span key={`k-char-${idx}`} className="px-1 bg-violet-950/60 text-violet-300 rounded border border-violet-800/40">
                  {ch}
                </span>
              ))}
            </div>
          </div>

          {/* Direction */}
          <div className="lg:col-span-4 flex flex-col gap-1.5">
            <label className="text-xs font-mono text-slate-400">Operación Criptográfica:</label>
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
            <label className="text-xs font-mono text-slate-400">Convención de Alfabeto (25 celdas):</label>
            <div className="grid grid-cols-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-mono">
              <button
                onClick={() => setCellDisplayMode('spanish')}
                className={`py-1.5 rounded-lg transition ${
                  cellDisplayMode === 'spanish'
                    ? 'bg-slate-800 text-amber-300 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Español (I/J, N/Ñ)
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
                Longitud: <strong className="text-slate-200">{inputText.replace(/[^a-zA-Z]/g, '').length} letras</strong> · Dígramos: <strong className="text-violet-400">{result.digrams.length} pares</strong>
              </span>
            </label>
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Escribe aquí cualquier palabra o frase que desees resolver..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-violet-500"
            />
          </div>

          {/* Presets Row */}
          <div className="lg:col-span-12 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Casos de Demostración:
            </span>
            {S08_PRESETS.map((p, i) => {
              const isActive = keyword === p.key && inputText === p.text;
              return (
                <button
                  key={`preset-btn-${i}`}
                  onClick={() => loadPreset(p)}
                  className={`px-2.5 py-1 rounded-lg transition text-[11px] font-mono border ${
                    isActive
                      ? 'bg-violet-600/40 text-violet-200 font-bold border-violet-500/60 shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                  title={`${p.name}: ${p.description}`}
                >
                  <span className="text-amber-400 mr-1">[{p.badge}]</span>
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* FASE 2: Estructura Criptográfica (Matriz 5x5 y Preparación de Dígramos) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda: Matriz 5x5 Desarrollada */}
        <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-300 font-mono text-xs font-bold flex items-center justify-center">
                  2A
                </span>
                <h3 className="text-sm font-bold text-slate-200 font-mono">
                  Matriz 5×5 Desarrollada
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                {cellDisplayMode === 'spanish' ? '25 celdas · I/J y N/Ñ' : '25 celdas · I/J'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono mb-3">
              La clave <strong>"{keyword}"</strong> ocupa las primeras casillas; el resto se completa con el alfabeto en orden.
            </p>

            {/* Grid 5x5 */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 shadow-inner flex flex-col gap-2 mx-auto w-fit">
              {/* Column Headers */}
              <div className="flex items-center justify-center gap-2">
                <div className="w-6 text-center text-[10px] font-mono text-slate-600"></div>
                {[1, 2, 3, 4, 5].map(col => (
                  <div key={`col-hdr-${col}`} className="w-11 sm:w-12 text-center text-[10px] font-mono text-slate-400 font-bold">
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
                        const isKeyChar = uniqueKeyChars.includes(rawChar);

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
                        } else if (isKeyChar) {
                          style = 'bg-slate-900/90 border-violet-500/30 text-slate-100 font-bold';
                        }

                        return (
                          <div
                            key={`cell-${idx}`}
                            className={`relative w-11 sm:w-12 h-11 sm:h-12 rounded-xl flex flex-col items-center justify-center font-mono text-sm font-bold border transition-all select-none ${style}`}
                          >
                            <span>{label}</span>
                            {tag ? (
                              <span className="absolute -top-1.5 -right-1.5 text-[9px] px-1 rounded-full bg-slate-950 text-white border border-slate-700 font-mono font-bold shadow">
                                {tag}
                              </span>
                            ) : isKeyChar ? (
                              <span className="absolute bottom-0.5 right-1 text-[8px] font-mono text-violet-400 font-bold opacity-70">
                                k
                              </span>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="w-full flex flex-wrap items-center justify-between text-[10px] font-mono mt-4 pt-2.5 border-t border-slate-800 text-slate-400 gap-2">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-amber-400"></span> Entrada (M₁, M₂)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-emerald-400"></span> Salida (C₁, C₂)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-violet-800"></span> Rectángulo
            </span>
            <span className="flex items-center gap-1">
              <span className="text-violet-400 font-bold">k</span> Clave
            </span>
          </div>
        </div>

        {/* Columna Derecha: Preparación de Dígramos (Reglas de la 'X') */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold flex items-center justify-center">
                2B
              </span>
              <h3 className="text-sm font-bold text-slate-200 font-mono">
                Segmentación del Texto en Dígramos (Pares)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Total: <strong className="text-slate-200">{result.digrams.length} pares</strong>
            </span>
          </div>

          {/* Explanation of Partitioning Rules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-300">
              <span className="text-amber-400 font-bold block mb-0.5">Regla 1: Ruptura de Gemelas</span>
              Si un par contiene dos letras idénticas (ej. SS, LL), se inserta <strong>'X'</strong> y la segunda letra pasa al siguiente par.
            </div>
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-300">
              <span className="text-sky-400 font-bold block mb-0.5">Regla 2: Relleno por Longitud Impar</span>
              Si al final queda una letra aislada sin pareja, se añade <strong>'X'</strong> para completar el número par.
            </div>
          </div>

          {/* Interactive Digrams Strip */}
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex flex-col gap-1.5">
            <span className="text-[10px] font-mono uppercase text-slate-400">
              Cadena de Dígramos Resultante (Haz clic en cualquier par para inspeccionarlo):
            </span>
            <div className="flex flex-wrap gap-1.5 font-mono text-sm pt-1">
              {result.digrams.map((dg, idx) => {
                const isSelected = selectedPairIndex === idx;
                const detail = digramDetails[idx];
                const isSpecial = detail && detail.reason !== 'normal';

                return (
                  <button
                    key={`dg-chip-${idx}`}
                    onClick={() => {
                      setSelectedPairIndex(idx);
                      setIsPlaying(false);
                    }}
                    className={`px-2.5 py-1 rounded-lg font-bold border transition flex items-center gap-1 ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 border-amber-300 ring-2 ring-amber-300 scale-105'
                        : isSpecial
                        ? 'bg-rose-950/40 border-rose-500/50 text-rose-300 hover:border-rose-400'
                        : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
                    }`}
                    title={detail ? detail.explanation : ''}
                  >
                    <span>{dg}</span>
                    {isSpecial && <span className="text-[9px] text-rose-400">★</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Special rules explanation audit list */}
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 text-xs font-mono space-y-1.5 flex-1 overflow-y-auto max-h-40">
            <span className="text-amber-400 font-bold block text-[11px] mb-1">
              Auditoría de Inserciones de 'X':
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
                ✓ Todas las parejas son de letras distintas y el texto tiene longitud par. No se requirió insertar 'X'.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FASE 3: Demostración Interactiva Paso a Paso (El "¿Por qué?" de cada par) */}
      {activeStep && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h3 className="text-sm font-bold text-slate-100 font-mono">
                Demostración Paso a Paso: Pareja #{activeStep.pairIndex + 1} de {result.steps.length}
              </h3>
            </div>

            {/* Step Navigation & Playback Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedPairIndex(p => Math.max(0, p - 1))}
                disabled={selectedPairIndex === 0}
                className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-800 transition"
                title="Paso Anterior"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition ${
                  isPlaying ? 'bg-amber-500 text-slate-950' : 'bg-violet-600 hover:bg-violet-500 text-white'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pausar' : 'Reproducir'}</span>
              </button>
              <button
                onClick={() => setSelectedPairIndex(p => Math.min(result.steps.length - 1, p + 1))}
                disabled={selectedPairIndex >= result.steps.length - 1}
                className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-800 transition"
                title="Paso Siguiente"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setSelectedPairIndex(0);
                  setIsPlaying(false);
                }}
                className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 transition"
                title="Reiniciar al inicio"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Real-time Pedagogical Reasoner Card */}
          <div className={`p-4 rounded-xl border flex flex-col gap-3 ${
            activeStep.rule === 'row'
              ? 'bg-sky-950/30 border-sky-500/40 text-sky-200'
              : activeStep.rule === 'col'
              ? 'bg-purple-950/30 border-purple-500/40 text-purple-200'
              : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span className="font-mono text-xs font-bold text-slate-100">
                  Transformación: <span className="text-amber-400 text-base font-black px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800">"{activeStep.inPair}"</span> ➔ <span className="text-emerald-400 text-base font-black px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800">"{activeStep.outPair}"</span>
                </span>
              </div>
              <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full font-bold border ${
                activeStep.rule === 'row'
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                  : activeStep.rule === 'col'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                {activeStep.ruleNameEs}
              </span>
            </div>

            {/* 3 Step Decomposition Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs text-slate-300">
              {/* Box 1: Position */}
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-col gap-1">
                <span className="text-slate-400 text-[11px] font-bold">1. Posición en la Matriz:</span>
                <div>
                  • <strong>'{activeStep.inPair[0]}'</strong>: Fila {activeStep.pos1[0] + 1}, Columna {activeStep.pos1[1] + 1}
                </div>
                <div>
                  • <strong>'{activeStep.inPair[1]}'</strong>: Fila {activeStep.pos2[0] + 1}, Columna {activeStep.pos2[1] + 1}
                </div>
              </div>

              {/* Box 2: Rule Diagnosis */}
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-col gap-1">
                <span className="text-slate-400 text-[11px] font-bold">2. ¿Por qué aplica esta regla?</span>
                {activeStep.rule === 'row' && (
                  <span>Ambas letras comparten la <strong>misma fila (Fila {activeStep.pos1[0] + 1})</strong>. Se aplica desplazamiento horizontal.</span>
                )}
                {activeStep.rule === 'col' && (
                  <span>Ambas letras comparten la <strong>misma columna (Columna {activeStep.pos1[1] + 1})</strong>. Se aplica desplazamiento vertical.</span>
                )}
                {activeStep.rule === 'rectangle' && (
                  <span>Están en distinta fila y columna. Forman las <strong>esquinas opuestas de un rectángulo</strong>.</span>
                )}
              </div>

              {/* Box 3: Exact Movement & Calculation */}
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-col gap-1">
                <span className="text-slate-400 text-[11px] font-bold">3. Movimiento y Salida:</span>
                {activeStep.rule === 'row' && (
                  <span>Cada letra avanza <strong>1 paso a la derecha (+1 mod 5)</strong>. Si está al borde derecho salta circularmente al inicio. Salida: <strong className="text-emerald-400">"{activeStep.outPair}"</strong>.</span>
                )}
                {activeStep.rule === 'col' && (
                  <span>Cada letra baja <strong>1 paso hacia abajo (+1 mod 5)</strong>. Si está en el fondo salta circularmente a la fila 1. Salida: <strong className="text-emerald-400">"{activeStep.outPair}"</strong>.</span>
                )}
                {activeStep.rule === 'rectangle' && (
                  <span>Cada letra <strong>conserva su fila</strong> y adopta la columna de la otra letra: {activeStep.inPair[0]} viaja a Col {activeStep.pos2[1] + 1} y {activeStep.inPair[1]} a Col {activeStep.pos1[1] + 1}. Salida: <strong className="text-emerald-400">"{activeStep.outPair}"</strong>.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FASE 4: Tabla Completa de Auditoría y Criptograma Final */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold flex items-center justify-center">
              4
            </span>
            <h3 className="text-sm font-bold text-slate-100 font-mono">
              Tabla Completa de Cifrado Dígrama por Dígrama
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Haz clic en cualquier fila para visualizarla en la matriz
          </span>
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

        {/* Final Output Banner */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
              Resultado Final ({direction === 'encrypt' ? 'Criptograma C' : 'Texto en Claro Descifrado'}):
            </span>
            <span className="font-mono text-xl font-black text-emerald-400 tracking-wider">
              {result.formattedOutput || '---'}
            </span>
            <span className="block text-xs font-mono text-slate-400 mt-1">
              Continuo: <strong className="text-slate-300">{result.outputText || '---'}</strong>
            </span>
            {result.formattedOutput === 'KB DL XM KD OM CH GQ UN' && (
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono font-bold">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Criptograma verificado: KB DL XM KD OM CH GQ UN (8 pares exactos)</span>
              </div>
            )}
          </div>

          <button
            onClick={copyFullSolution}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold font-mono text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-lg self-start md:self-auto"
          >
            {copiedSolution ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedSolution ? '¡Solución Copiada!' : 'Copiar Solución Completa'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
