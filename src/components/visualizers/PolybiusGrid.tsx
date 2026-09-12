import React, { useState, useMemo } from 'react';
import { processPolybius, buildPolybiusSquare, POLYBIUS_DEFAULT_ALPHA } from '../../crypto/ciphers/polybius';
import { Grid3X3, Flame, Key, Sparkles, Copy, Check, ArrowRight, BookOpen, ShieldCheck } from 'lucide-react';

export const PolybiusGrid: React.FC = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [inputText, setInputText] = useState<string>('POLIBIO');
  const [direction, setDirection] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [useCustomKey, setUseCustomKey] = useState<boolean>(false);

  const square = useMemo(() => {
    return buildPolybiusSquare(useCustomKey ? keyword : '');
  }, [useCustomKey, keyword]);

  const result = useMemo(() => {
    return processPolybius(inputText, direction, useCustomKey ? keyword : '');
  }, [inputText, direction, useCustomKey, keyword]);

  const activeStep = selectedStepIndex !== null && result.steps[selectedStepIndex] ? result.steps[selectedStepIndex] : null;

  const handleCopy = () => {
    navigator.clipboard.writeText(result.formattedOutput || result.outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 p-2 lg:p-4 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Grid3X3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">Tabla de Cifrar de Polibio (Cuadrícula 5×5)</h2>
            <p className="text-xs text-slate-400 font-mono">
              Cifrado Fraccionario · Telégrafo Óptico con Antorchas · <span className="text-amber-400/90 text-[10px]">Fuente APA 7: Polibio (c. 150 a.C./1981, Hist. X, 45-47); Kahn (1967)</span>
            </p>
          </div>
        </div>

        {/* Custom Key Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setUseCustomKey(prev => !prev)}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs transition border flex items-center gap-1.5 ${
              useCustomKey
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>{useCustomKey ? 'Clave Personalizada: ACTIVA' : 'Usar Alfabeto Estándar'}</span>
          </button>

          {useCustomKey && (
            <input
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value.toUpperCase())}
              placeholder="PALABRA CLAVE"
              className="bg-slate-950 border border-slate-800 text-amber-300 font-mono text-xs px-3 py-1.5 rounded-xl focus:outline-none focus:border-amber-500 max-w-[140px]"
            />
          )}
        </div>
      </div>

      {/* Grid and Interactive Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 5x5 Square Visualizer */}
        <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-between backdrop-blur-md">
          <div className="w-full flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Grid3X3 className="w-4 h-4 text-amber-400" />
              Matriz Cuadrada 5×5 (I = J, 25 letras)
            </h3>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              Coordenadas: [Fila, Columna]
            </span>
          </div>

          {/* The 5x5 Table Component */}
          <div className="w-full max-w-[380px] bg-slate-950 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-2xl">
            <div className="grid grid-cols-6 gap-2 text-center font-mono select-none">
              {/* Top-left corner */}
              <div className="h-10 sm:h-12 flex items-center justify-center text-slate-600 font-bold text-xs bg-slate-900/40 rounded-xl">
                F\C
              </div>

              {/* Column Indices 1..5 */}
              {[1, 2, 3, 4, 5].map(col => {
                const isColActive = activeStep && activeStep.col === col;
                return (
                  <div
                    key={`v-col-${col}`}
                    className={`h-10 sm:h-12 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${
                      isColActive
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/50 shadow-md ring-1 ring-sky-400/40'
                        : 'text-slate-400 bg-slate-900/50 border border-slate-800/60'
                    }`}
                  >
                    Col {col}
                  </div>
                );
              })}

              {/* 5 Rows */}
              {[1, 2, 3, 4, 5].map(row => {
                const isRowActive = activeStep && activeStep.row === row;
                return (
                  <React.Fragment key={`v-row-${row}`}>
                    {/* Row Header */}
                    <div
                      className={`h-10 sm:h-12 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${
                        isRowActive
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50 shadow-md ring-1 ring-amber-400/40'
                          : 'text-slate-400 bg-slate-900/50 border border-slate-800/60'
                      }`}
                    >
                      Fila {row}
                    </div>

                    {/* 5 Cells */}
                    {[1, 2, 3, 4, 5].map(col => {
                      const idx = (row - 1) * 5 + (col - 1);
                      const char = square[idx];
                      const isCellActive = activeStep && activeStep.row === row && activeStep.col === col;
                      const isColActive = activeStep && activeStep.col === col;

                      return (
                        <button
                          key={`v-cell-${row}-${col}`}
                          onClick={() => {
                            if (direction === 'encrypt') {
                              setInputText(prev => prev + char);
                            } else {
                              setInputText(prev => prev + `${row}${col}`);
                            }
                          }}
                          className={`h-10 sm:h-12 rounded-xl flex flex-col items-center justify-center font-mono font-bold transition-all ${
                            isCellActive
                              ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 scale-105 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400'
                              : isRowActive || isColActive
                              ? 'bg-slate-900 text-amber-200 border border-slate-700/80'
                              : 'bg-slate-900/60 border border-slate-800/80 text-slate-200 hover:border-amber-500/40 hover:text-amber-300'
                          }`}
                          title={`Click para añadir '${char}' (${row}${col})`}
                        >
                          <span className="text-sm sm:text-base leading-none">
                            {char === 'I' ? 'I/J' : char}
                          </span>
                          <span className={`text-[8px] sm:text-[9px] font-normal leading-none mt-1 ${isCellActive ? 'text-slate-950' : 'text-slate-500'}`}>
                            {row}{col}
                          </span>
                        </button>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Optical Torch Visualization (Historical Greek Telegraph) */}
          <div className="mt-5 w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-amber-400 font-bold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
                Simulación del Telégrafo de Antorchas de Polibio:
              </span>
              <span className="text-[10px] text-slate-400">
                {activeStep ? `Letra '${activeStep.char}'` : 'Selecciona un carácter'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
              {/* Left Torches (Row count) */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 flex flex-col items-center">
                <span className="text-[10px] font-mono text-amber-400 font-bold mb-1.5">
                  Estación Izquierda (Fila: {activeStep ? activeStep.row : 0})
                </span>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map(t => {
                    const isLit = activeStep && t <= activeStep.row;
                    return (
                      <div
                        key={`torch-left-${t}`}
                        className={`w-5 h-7 rounded flex flex-col items-center justify-center transition-all ${
                          isLit
                            ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/50 scale-105 ring-1 ring-amber-300'
                            : 'bg-slate-950 border border-slate-800 text-slate-700'
                        }`}
                      >
                        <Flame className={`w-3 h-3 ${isLit ? 'text-orange-950 animate-bounce' : 'text-slate-700'}`} />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Torches (Col count) */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 flex flex-col items-center">
                <span className="text-[10px] font-mono text-sky-400 font-bold mb-1.5">
                  Estación Derecha (Columna: {activeStep ? activeStep.col : 0})
                </span>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map(t => {
                    const isLit = activeStep && t <= activeStep.col;
                    return (
                      <div
                        key={`torch-right-${t}`}
                        className={`w-5 h-7 rounded flex flex-col items-center justify-center transition-all ${
                          isLit
                            ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/50 scale-105 ring-1 ring-sky-300'
                            : 'bg-slate-950 border border-slate-800 text-slate-700'
                        }`}
                      >
                        <Flame className={`w-3 h-3 ${isLit ? 'text-sky-950 animate-bounce' : 'text-slate-700'}`} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sandbox & Step Navigator */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {/* Input & Output Box */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-mono text-slate-400 font-bold">
                {direction === 'encrypt' ? 'Texto en Claro (Letras):' : 'Criptograma Numérico (Pares 1–5):'}
              </span>
              <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
                <button
                  onClick={() => {
                    setDirection('encrypt');
                    setInputText('POLIBIO');
                  }}
                  className={`px-3 py-1 text-xs font-mono rounded-md transition ${
                    direction === 'encrypt' ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30' : 'text-slate-400'
                  }`}
                >
                  Cifrar Letras
                </button>
                <button
                  onClick={() => {
                    setDirection('decrypt');
                    setInputText('35 34 31 24 12 24 34');
                  }}
                  className={`px-3 py-1 text-xs font-mono rounded-md transition ${
                    direction === 'decrypt' ? 'bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30' : 'text-slate-400'
                  }`}
                >
                  Descifrar Dígitos
                </button>
              </div>
            </div>

            <textarea
              value={inputText}
              onChange={e => {
                setInputText(e.target.value);
                setSelectedStepIndex(0);
              }}
              rows={2}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-sm text-slate-100 focus:outline-none focus:border-amber-500 uppercase tracking-wide"
              placeholder={direction === 'encrypt' ? 'Escribe el texto a cifrar...' : 'Ej: 35 34 31 24 12 24 34'}
            />

            {/* Output Result */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-mono text-slate-400 font-bold">Resultado:</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[11px] font-mono text-amber-400 hover:text-amber-300 transition"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 min-h-[52px] flex items-center justify-between">
                <span className="font-mono text-base text-emerald-400 font-bold tracking-wider break-all">
                  {result.formattedOutput || '---'}
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase px-2 py-1 rounded bg-slate-900 border border-slate-800 flex-shrink-0 ml-2">
                  {direction === 'encrypt' ? `${result.steps.length * 2} dígitos` : `${result.outputText.length} letras`}
                </span>
              </div>
            </div>
          </div>

          {/* Step-by-Step Interactive Character Navigation */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col gap-3">
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Desglose Paso a Paso por Carácter</span>
              <span className="text-amber-400 text-[10px]">Click en cualquier paso para inspeccionar</span>
            </h4>

            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
              {result.steps.map((st, i) => (
                <button
                  key={`poly-st-${i}`}
                  onClick={() => setSelectedStepIndex(i)}
                  className={`px-3 py-2 rounded-xl font-mono text-xs flex items-center gap-2 border transition ${
                    selectedStepIndex === i
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-md ring-1 ring-amber-400/50'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-slate-200 font-bold">{st.char}</span>
                  <ArrowRight className="w-3 h-3 text-slate-600" />
                  <span className="text-emerald-400 font-bold">[{st.row},{st.col}] → {st.code}</span>
                </button>
              ))}
            </div>

            {activeStep && (
              <div className="mt-2 bg-slate-950/90 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-300">
                <span className="text-amber-400 font-bold block mb-1">
                  Explicación del carácter seleccionado:
                </span>
                <span>{activeStep.explanation}</span>
              </div>
            )}
          </div>

          {/* Academic & Historical Note */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 backdrop-blur-md text-xs font-mono text-slate-400 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-200 font-bold">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Importancia Histórica del Cifrado de Polibio</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Diseñado por el historiador griego Polibio hacia el 150 a.C., este método es considerado el primer sistema de <strong className="text-slate-200">cifrado fraccionario</strong> y la primera <strong className="text-slate-200">conversión de caracteres a señales numéricas discretas</strong>, sentando las bases conceptuales para el telégrafo óptico, el código Baudot y el estándar ASCII contemporáneo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
