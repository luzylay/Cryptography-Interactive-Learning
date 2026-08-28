import React, { useState, useRef, useEffect, useMemo } from 'react';
import { AlphabetMode, ALPHABETS, ALBERTI_HISTORICAL, formatInBlocks } from '../../crypto/alphabets';
import { processAlberti, getAlbertiAlignmentOffset } from '../../crypto/ciphers/alberti';
import { RotateCw, RotateCcw, Play, Pause, FastForward, Sliders, Info, Sparkles } from 'lucide-react';

interface AlbertiDiskProps {
  mode: AlphabetMode;
  onModeChange?: (newMode: AlphabetMode) => void;
}

export const AlbertiDisk: React.FC<AlbertiDiskProps> = ({ mode, onModeChange }) => {
  const [rotation, setRotation] = useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  const [inputText, setInputText] = useState<string>('EL DISCO DE ALBERTI');
  const [cipherDirection, setCipherDirection] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [stepPeriod, setStepPeriod] = useState<number>(0); // 0 = static, >0 = polyalphabetic
  const [stepAmount, setStepAmount] = useState<number>(1);
  const [alignOuter, setAlignOuter] = useState<string>('A');
  const [alignInner, setAlignInner] = useState<string>('A');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStartAngle, setDragStartAngle] = useState<number>(0);
  const [dragStartRot, setDragStartRot] = useState<number>(0);

  const svgRef = useRef<SVGSVGElement | null>(null);

  const outerChars = useMemo(() => {
    return mode === 'alberti24' ? ALBERTI_HISTORICAL.outer : ALPHABETS[mode].chars;
  }, [mode]);

  const innerChars = useMemo(() => {
    return mode === 'alberti24' ? ALBERTI_HISTORICAL.inner.toUpperCase() : ALPHABETS[mode].chars;
  }, [mode]);

  const N = outerChars.length;
  const anglePerChar = 360 / N;

  // Handle alignment preset
  const handleAlign = (oChar: string, iChar: string) => {
    setAlignOuter(oChar);
    setAlignInner(iChar);
    const offset = getAlbertiAlignmentOffset(oChar, iChar, outerChars, innerChars);
    setRotation(offset);
  };

  // Step rotation
  const rotateStep = (delta: number) => {
    setRotation(prev => (prev + delta + N * 100) % N);
  };

  // Mouse / Touch drag logic for rotating inner disk
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

  // Run encryption/decryption
  const cipherResult = useMemo(() => {
    return processAlberti(
      inputText,
      { mode, outerChars, innerChars, rotation },
      cipherDirection,
      stepPeriod,
      stepAmount
    );
  }, [inputText, mode, outerChars, innerChars, rotation, cipherDirection, stepPeriod, stepAmount]);

  // Radii for SVG elements
  const center = 250;
  const outerDiskRadius = 220;
  const outerTextRadius = 195;
  const innerDiskRadius = 160;
  const innerTextRadius = 135;
  const centerHubRadius = 60;

  // Active highlighted index
  const activeIndex = hoveredIndex !== null ? hoveredIndex : selectedIndex;
  const activeInnerIndex = activeIndex !== null ? (activeIndex - rotation + N * 100) % N : null;

  return (
    <div className="flex flex-col xl:flex-row gap-6 p-2 lg:p-4 w-full max-w-7xl mx-auto">
      {/* ── LEFT: INTERACTIVE SVG DISK & CONTROLS ── */}
      <div className="flex-1 flex flex-col items-center bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 lg:p-6 backdrop-blur-md shadow-2xl">
        {/* Controls Bar */}
        <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <RotateCw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                Disco Cifrador de Alberti
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  {ALPHABETS[mode].shortName}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Arrastra o usa los botones para girar el disco interior concéntrico · <span className="text-amber-400/90 font-mono text-[10px]">Fuente APA 7: Ramió Aguirre (1999, p. 7); Alberti (1466/1568)</span>
              </p>
            </div>
          </div>

          {/* Quick Step Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => rotateStep(-5)}
              className="px-2.5 py-1 text-xs font-mono rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition"
              title="Girar 5 posiciones atrás"
            >
              -5
            </button>
            <button
              onClick={() => rotateStep(-1)}
              className="p-1.5 text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition"
              title="Girar 1 posición atrás"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-lg text-center min-w-[70px]">
              <span className="text-[10px] text-amber-500 block uppercase font-mono leading-tight">Desfase</span>
              <span className="text-sm font-mono font-bold text-amber-300">k = {rotation}</span>
            </div>
            <button
              onClick={() => rotateStep(1)}
              className="p-1.5 text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition"
              title="Girar 1 posición adelante"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => rotateStep(5)}
              className="px-2.5 py-1 text-xs font-mono rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition"
              title="Girar 5 posiciones adelante"
            >
              +5
            </button>
          </div>
        </div>

        {/* ── THE INTERACTIVE SVG WHEEL ── */}
        <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center select-none">
          <svg
            ref={svgRef}
            viewBox="0 0 500 500"
            className="w-full h-full cursor-grab active:cursor-grabbing drop-shadow-2xl transition-transform"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            <defs>
              {/* Gradients */}
              <radialGradient id="outerGradient" cx="50%" cy="50%" r="50%">
                <stop offset="60%" stopColor="#0f172a" />
                <stop offset="90%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#334155" />
              </radialGradient>
              <radialGradient id="innerGradient" cx="50%" cy="50%" r="50%">
                <stop offset="40%" stopColor="#090d16" />
                <stop offset="85%" stopColor="#131e36" />
                <stop offset="100%" stopColor="#1e293b" />
              </radialGradient>
              <radialGradient id="hubGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#b45309" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0f172a" />
              </radialGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Outer Ring */}
            <circle cx={center} cy={center} r={outerDiskRadius} fill="url(#outerGradient)" stroke="#334155" strokeWidth="3" />
            <circle cx={center} cy={center} r={outerDiskRadius - 4} fill="none" stroke="#475569" strokeDasharray="3 4" strokeWidth="1" />

            {/* Outer Ring Tick Marks & Characters (Static Outer Disk) */}
            {outerChars.split('').map((char, i) => {
              const angleDeg = i * anglePerChar - 90;
              const angleRad = (angleDeg * Math.PI) / 180;
              const xText = center + outerTextRadius * Math.cos(angleRad);
              const yText = center + outerTextRadius * Math.sin(angleRad);

              const xTick1 = center + (outerDiskRadius - 2) * Math.cos(angleRad);
              const yTick1 = center + (outerDiskRadius - 2) * Math.sin(angleRad);
              const xTick2 = center + (outerDiskRadius - 10) * Math.cos(angleRad);
              const yTick2 = center + (outerDiskRadius - 10) * Math.sin(angleRad);

              const isHighlighted = activeIndex === i;

              return (
                <g
                  key={`outer-${char}-${i}`}
                  className="cursor-pointer transition-all duration-150"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => setSelectedIndex(i)}
                >
                  <line x1={xTick1} y1={yTick1} x2={xTick2} y2={yTick2} stroke={isHighlighted ? '#f59e0b' : '#475569'} strokeWidth={isHighlighted ? '2' : '1'} />
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

            {/* ── ROTATING INNER DISK ── */}
            <g
              transform={`rotate(${rotation * anglePerChar} ${center} ${center})`}
              style={{ transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            >
              {/* Inner Circle Body */}
              <circle cx={center} cy={center} r={innerDiskRadius} fill="url(#innerGradient)" stroke="#0ea5e9" strokeWidth="2.5" strokeOpacity="0.6" />
              <circle cx={center} cy={center} r={innerDiskRadius - 3} fill="none" stroke="#38bdf8" strokeDasharray="2 3" strokeWidth="0.8" strokeOpacity="0.5" />

              {/* Inner Disk Characters */}
              {innerChars.split('').map((char, i) => {
                const angleDeg = i * anglePerChar - 90;
                const angleRad = (angleDeg * Math.PI) / 180;
                const xText = center + innerTextRadius * Math.cos(angleRad);
                const yText = center + innerTextRadius * Math.sin(angleRad);

                const isInnerHighlighted = activeInnerIndex === i;

                return (
                  <g key={`inner-${char}-${i}`}>
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

            {/* Alignment Laser Beam / Ray when hovering */}
            {activeIndex !== null && activeInnerIndex !== null && (
              <g filter="url(#glow)">
                {(() => {
                  const angleDeg = activeIndex * anglePerChar - 90;
                  const angleRad = (angleDeg * Math.PI) / 180;
                  const xOuter = center + outerTextRadius * Math.cos(angleRad);
                  const yOuter = center + outerTextRadius * Math.sin(angleRad);
                  const xInner = center + innerTextRadius * Math.cos(angleRad);
                  const yInner = center + innerTextRadius * Math.sin(angleRad);

                  return (
                    <>
                      <line x1={xOuter} y1={yOuter} x2={xInner} y2={yInner} stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="3 2" />
                      <circle cx={xOuter} cy={yOuter} r="4" fill="#f59e0b" />
                      <circle cx={xInner} cy={yInner} r="4" fill="#38bdf8" />
                    </>
                  );
                })()}
              </g>
            )}

            {/* Center Hub */}
            <circle cx={center} cy={center} r={centerHubRadius} fill="url(#hubGradient)" stroke="#f59e0b" strokeWidth="1.5" />
            <circle cx={center} cy={center} r={centerHubRadius - 12} fill="#090d16" stroke="#475569" strokeWidth="1" />
            <text
              x={center}
              y={center - 8}
              textAnchor="middle"
              fill="#fbbf24"
              fontSize="10"
              fontWeight="bold"
              fontFamily="'JetBrains Mono', monospace"
              letterSpacing="1"
            >
              ALBERTI
            </text>
            <text
              x={center}
              y={center + 10}
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="9"
              fontFamily="'JetBrains Mono', monospace"
            >
              k = {rotation}
            </text>
          </svg>
        </div>

        {/* Live Alignment Readout Card */}
        {activeIndex !== null && activeInnerIndex !== null && (
          <div className="mt-4 w-full bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">Disco Exterior:</span>
                <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 font-mono font-bold text-base rounded-lg border border-amber-500/40">
                  {outerChars[activeIndex]}
                </span>
              </div>
              <span className="text-slate-600 font-bold">⟷</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">Disco Interior:</span>
                <span className="px-2.5 py-1 bg-sky-500/20 text-sky-300 font-mono font-bold text-base rounded-lg border border-sky-500/40">
                  {innerChars[activeInnerIndex]}
                </span>
              </div>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              Posición: #{activeIndex} ↔ #{(activeInnerIndex + N) % N} (desfase: {rotation})
            </div>
          </div>
        )}

        {/* Alignment Preset Selectors */}
        <div className="mt-4 w-full flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono text-[11px]">Alinear:</span>
            <select
              value={alignOuter}
              onChange={e => handleAlign(e.target.value, alignInner)}
              className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2 py-1 font-mono text-xs focus:outline-none focus:border-amber-500"
            >
              {outerChars.split('').map(c => (
                <option key={`opt-out-${c}`} value={c}>
                  Ext: {c}
                </option>
              ))}
            </select>
            <span className="text-slate-500">con</span>
            <select
              value={alignInner}
              onChange={e => handleAlign(alignOuter, e.target.value)}
              className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2 py-1 font-mono text-xs focus:outline-none focus:border-sky-500"
            >
              {innerChars.split('').map(c => (
                <option key={`opt-in-${c}`} value={c}>
                  Int: {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-slate-400">Giro cada:</span>
            <select
              value={stepPeriod}
              onChange={e => setStepPeriod(parseInt(e.target.value, 10))}
              className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2 py-1 font-mono text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="0">0 (Estático)</option>
              <option value="1">1 letra</option>
              <option value="3">3 letras</option>
              <option value="4">4 letras</option>
              <option value="5">5 letras</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── RIGHT: EXPERIMENTATION SANDBOX & STEP DERIVATIONS ── */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Sandbox Card */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Laboratorio en Vivo: Cifrar / Descifrar
            </h3>
            <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
              <button
                onClick={() => setCipherDirection('encrypt')}
                className={`px-3 py-1 text-xs font-mono rounded-md transition ${
                  cipherDirection === 'encrypt'
                    ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Cifrar
              </button>
              <button
                onClick={() => setCipherDirection('decrypt')}
                className={`px-3 py-1 text-xs font-mono rounded-md transition ${
                  cipherDirection === 'decrypt'
                    ? 'bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Descifrar
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                {cipherDirection === 'encrypt' ? 'Texto en Claro:' : 'Texto Cifrado (Criptograma):'}
              </label>
              <textarea
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-amber-500/60 transition"
                placeholder="Escribe tu texto..."
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Resultado:</label>
              <div className="bg-slate-950 border border-slate-800/90 rounded-xl p-3 min-h-[44px] flex items-center justify-between">
                <span className="font-mono text-sm text-emerald-400 font-semibold tracking-wider break-all">
                  {cipherResult.formattedOutput || '(Ingresa un texto válido)'}
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                  {cipherResult.outputText.length} caracteres
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Step-by-Step Derivation Table */}
        <div className="flex-1 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md flex flex-col min-h-[300px]">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Info className="w-4 h-4 text-sky-400" />
              Desglose de Operaciones Paso a Paso
            </h3>
            <span className="text-[11px] font-mono text-slate-500">
              {cipherResult.steps.length} pasos calculados
            </span>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[320px] pr-1 space-y-1.5 font-mono text-xs">
            {cipherResult.steps.length > 0 ? (
              cipherResult.steps.map((step, idx) => (
                <div
                  key={`step-${idx}`}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 hover:border-amber-500/40 hover:bg-slate-900 transition"
                  onMouseEnter={() => setHoveredIndex(step.outerIndex)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] text-slate-500 w-5">#{step.index + 1}</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 font-bold border border-amber-500/30">
                      {step.plainChar}
                    </span>
                    <span className="text-slate-600">→</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/30">
                      {step.cipherChar}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 text-right">
                    Ext #{step.outerIndex} ⟷ Int #{step.innerIndex} (giro k={step.rotationUsed})
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-600 text-xs">
                Escribe un mensaje para ver el recorrido circular y matemático de cada letra
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
