import React, { useState, useMemo } from 'react';
import { AlphabetMode } from '../../crypto/alphabets';
import {
  processSeriesTransposition,
  processColumnarTransposition,
  processRowTransposition,
  processScytale,
} from '../../crypto/ciphers/transposition';
import {
  Columns,
  Rows,
  Layers,
  Cylinder,
  Sparkles,
  ArrowUpDown,
  BookOpen,
  Info,
  HelpCircle,
} from 'lucide-react';
import { CopyButton } from '../common/CopyButton';

interface ScytaleColumnarProps {
  mode: AlphabetMode;
}

type TranspositionType = 'series' | 'columnar' | 'row' | 'scytale';

export const ScytaleColumnar: React.FC<ScytaleColumnarProps> = ({ mode }) => {
  const [subType, setSubType] = useState<TranspositionType>('series');
  const [direction, setDirection] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [inputText, setInputText] = useState<string>('ERRAR ES HUMANO, PERDONAR DIVINO');
  const [padChar, setPadChar] = useState<string>('X');

  // Series params
  const [oneIsPrime, setOneIsPrime] = useState<boolean>(false); // Default: Criterio del profesor (1 es impar)

  // Columnar params
  const [keyword, setKeyword] = useState<string>('RELOJ');

  // Row params
  const [numRows, setNumRows] = useState<number>(3);

  // Scytale params
  const [diameter, setDiameter] = useState<number>(4);

  // Computations
  const seriesRes = useMemo(() => {
    return processSeriesTransposition(inputText, oneIsPrime, mode, direction, padChar);
  }, [inputText, oneIsPrime, mode, direction, padChar]);

  const columnarRes = useMemo(() => {
    return processColumnarTransposition(inputText, keyword, mode, direction, padChar);
  }, [inputText, keyword, mode, direction, padChar]);

  const rowRes = useMemo(() => {
    return processRowTransposition(inputText, numRows, mode, direction, padChar);
  }, [inputText, numRows, mode, direction, padChar]);

  const scytaleRes = useMemo(() => {
    return processScytale(inputText, diameter, mode, direction, padChar);
  }, [inputText, diameter, mode, direction, padChar]);

  // Current active result
  const currentResult = useMemo(() => {
    switch (subType) {
      case 'series':
        return seriesRes;
      case 'columnar':
        return columnarRes;
      case 'row':
        return rowRes;
      case 'scytale':
        return scytaleRes;
    }
  }, [subType, seriesRes, columnarRes, rowRes, scytaleRes]);

  // Preset loader
  const loadPreset = (preset: TranspositionType) => {
    setSubType(preset);
    if (preset === 'series') {
      setInputText('ERRAR ES HUMANO, PERDONAR DIVINO');
      setDirection('encrypt');
    } else if (preset === 'columnar') {
      setInputText('EL PATIO DE MI CASA ES PARTICULAR');
      setKeyword('RELOJ');
      setDirection('encrypt');
    } else if (preset === 'row') {
      setInputText('EL PRISIONERO SE ENTREGARA EN EL LUGAR YA INDICADO');
      setNumRows(3);
      setDirection('encrypt');
    } else if (preset === 'scytale') {
      setInputText('AL GRITO DE VIVA ZAPATA');
      setDiameter(4);
      setDirection('encrypt');
    }
  };

  // Swap output to input
  const handleSwap = () => {
    if (currentResult.outputText) {
      setInputText(currentResult.outputText);
      setDirection(d => (d === 'encrypt' ? 'decrypt' : 'encrypt'));
    }
  };

  return (
    <div className="flex flex-col gap-6 p-2 lg:p-4 w-full max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/20 to-indigo-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
            {subType === 'series' && <Layers className="w-5 h-5" />}
            {subType === 'columnar' && <Columns className="w-5 h-5" />}
            {subType === 'row' && <Rows className="w-5 h-5" />}
            {subType === 'scytale' && <Cylinder className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-100">Cifradores por Transposición</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 font-mono">
                Calculadora Interactiva
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-1 mt-0.5">
              <span>Reordenamiento geométrico sin sustitución</span>
              <span>·</span>
              <span className="text-rose-400 font-mono text-[11px]">Fuente APA 7: Ramió Aguirre (1999, pp. 88–96); Kahn (1996)</span>
            </p>
          </div>
        </div>

        {/* Subtype Selector Tabs */}
        <div className="flex flex-wrap rounded-xl bg-slate-950 p-1 border border-slate-800 gap-1">
          <button
            onClick={() => setSubType('series')}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 ${
              subType === 'series'
                ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Series (m1, m2, m3)
          </button>
          <button
            onClick={() => setSubType('columnar')}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 ${
              subType === 'columnar'
                ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            Por Columnas
          </button>
          <button
            onClick={() => setSubType('row')}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 ${
              subType === 'row'
                ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Rows className="w-3.5 h-3.5" />
            Por Filas
          </button>
          <button
            onClick={() => setSubType('scytale')}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 ${
              subType === 'scytale'
                ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cylinder className="w-3.5 h-3.5" />
            Escítala
          </button>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Visualizer / Setup Panel */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col gap-5">
          {/* ============================================================== */}
          {/* TAB 1: TRANSPOSICIÓN POR SERIES (m1, m2, m3)                   */}
          {/* ============================================================== */}
          {subType === 'series' && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    Transposición por Series (MS1, MS2, MS3)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Descomposición en subseries según la naturaleza matemática de la posición.
                  </p>
                </div>
                <button
                  onClick={() => loadPreset('series')}
                  className="px-2.5 py-1 text-[11px] font-mono bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg transition"
                >
                  Cargar Ejemplo 1.58
                </button>
              </div>

              {/* TOGGLE DEL NÚMERO 1: PRIMO VS IMPAR */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-purple-500/30 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200">Tratamiento del número 1:</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-mono">
                      Posición m₁
                    </span>
                  </div>
                  <div className="flex rounded-lg bg-slate-900 p-0.5 border border-slate-800">
                    <button
                      onClick={() => setOneIsPrime(false)}
                      className={`px-3 py-1 text-xs font-mono rounded-md transition-all ${
                        !oneIsPrime
                          ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                      title="Definición moderna: 1 no es primo, se clasifica en impares (MS3)"
                    >
                      1 es Impar (Profesor)
                    </button>
                    <button
                      onClick={() => setOneIsPrime(true)}
                      className={`px-3 py-1 text-xs font-mono rounded-md transition-all ${
                        oneIsPrime
                          ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                      title="Libro clásico: Ramió Aguirre (1999) clasifica 1 en serie de primos (MS1)"
                    >
                      1 es Primo (Ramió Aguirre)
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-start gap-1.5 font-sans leading-relaxed">
                  <Info className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0" />
                  <span>
                    {!oneIsPrime ? (
                      <>
                        <strong className="text-amber-300">Criterio del Profesor (Estándar Moderno):</strong> El número 1 solo tiene 1 divisor, por lo que <em>no es primo</em>. Pasa a formar parte de los números impares en la serie <span className="text-amber-400 font-mono font-bold">MS3</span> (m₁, m₉, m₁₅...).
                      </>
                    ) : (
                      <>
                        <strong className="text-purple-300">Criterio Ramió Aguirre (1999, p. 90):</strong> El autor incluye el 1 en la relación de primos en la serie <span className="text-purple-400 font-mono font-bold">MS1</span> (m₁, m₂, m₃, m₅, m₇...).
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* 3 SERIES CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* MS1: PRIMOS */}
                <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-800/40 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-300 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                      Serie MS1
                    </span>
                    <span className="text-[10px] font-mono text-purple-400">
                      {seriesRes.seriesInfo.ms1Indices.length} elems
                    </span>
                  </div>
                  <span className="text-[10px] text-purple-200/70 font-mono">
                    Números Primos {oneIsPrime ? '(incluye 1)' : '(inicia en 2)'}
                  </span>
                  <div className="text-xs font-mono text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-purple-900/40 break-all max-h-20 overflow-y-auto">
                    {seriesRes.seriesInfo.ms1Indices.map(i => `m${i}`).join(', ') || 'Ninguno'}
                  </div>
                  <div className="text-xs font-mono font-bold text-purple-300 bg-purple-900/20 px-2 py-1 rounded border border-purple-700/30">
                    Caracteres: &quot;{seriesRes.seriesInfo.ms1Chars || '-'}&quot;
                  </div>
                </div>

                {/* MS2: PARES */}
                <div className="p-3 rounded-xl bg-sky-950/20 border border-sky-800/40 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-300 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                      Serie MS2
                    </span>
                    <span className="text-[10px] font-mono text-sky-400">
                      {seriesRes.seriesInfo.ms2Indices.length} elems
                    </span>
                  </div>
                  <span className="text-[10px] text-sky-200/70 font-mono">
                    Números Pares (4, 6, 8, 10...)
                  </span>
                  <div className="text-xs font-mono text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-sky-900/40 break-all max-h-20 overflow-y-auto">
                    {seriesRes.seriesInfo.ms2Indices.map(i => `m${i}`).join(', ') || 'Ninguno'}
                  </div>
                  <div className="text-xs font-mono font-bold text-sky-300 bg-sky-900/20 px-2 py-1 rounded border border-sky-700/30">
                    Caracteres: &quot;{seriesRes.seriesInfo.ms2Chars || '-'}&quot;
                  </div>
                </div>

                {/* MS3: IMPARES */}
                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                      Serie MS3
                    </span>
                    <span className="text-[10px] font-mono text-amber-400">
                      {seriesRes.seriesInfo.ms3Indices.length} elems
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-200/70 font-mono">
                    Impares Restantes {!oneIsPrime ? '(incluye 1)' : '(9, 15, 21...)'}
                  </span>
                  <div className="text-xs font-mono text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-amber-900/40 break-all max-h-20 overflow-y-auto">
                    {seriesRes.seriesInfo.ms3Indices.map(i => `m${i}`).join(', ') || 'Ninguno'}
                  </div>
                  <div className="text-xs font-mono font-bold text-amber-300 bg-amber-900/20 px-2 py-1 rounded border border-amber-700/30">
                    Caracteres: &quot;{seriesRes.seriesInfo.ms3Chars || '-'}&quot;
                  </div>
                </div>
              </div>

              {/* POSITIONAL MAPPING GRID */}
              <div>
                <span className="text-xs font-mono text-slate-400 block mb-2">
                  Mapa Posicional de Caracteres ({seriesRes.seriesInfo.paddedText.length} letras):
                </span>
                <div className="flex flex-wrap gap-1.5 p-3 bg-slate-950 border border-slate-800 rounded-xl max-h-48 overflow-y-auto">
                  {seriesRes.seriesInfo.paddedText.split('').map((char, idx) => {
                    const pos = idx + 1;
                    const isMs1 = seriesRes.seriesInfo.ms1Indices.includes(pos);
                    const isMs2 = seriesRes.seriesInfo.ms2Indices.includes(pos);
                    const isMs3 = seriesRes.seriesInfo.ms3Indices.includes(pos);

                    let badgeColor = 'bg-slate-800 text-slate-300 border-slate-700';
                    let seriesLabel = 'm';
                    if (isMs1) {
                      badgeColor = 'bg-purple-500/20 text-purple-300 border-purple-500/40';
                      seriesLabel = 'MS1';
                    } else if (isMs2) {
                      badgeColor = 'bg-sky-500/20 text-sky-300 border-sky-500/40';
                      seriesLabel = 'MS2';
                    } else if (isMs3) {
                      badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
                      seriesLabel = 'MS3';
                    }

                    return (
                      <div
                        key={`pos-${idx}`}
                        className={`flex flex-col items-center px-2 py-1 rounded-lg border font-mono text-xs ${badgeColor}`}
                        title={`Posición m${pos} (${seriesLabel}): '${char}'`}
                      >
                        <span className="text-[10px] opacity-70">m{pos}</span>
                        <span className="font-bold text-sm">{char}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: TRANSPOSICIÓN POR COLUMNAS                              */}
          {/* ============================================================== */}
          {subType === 'columnar' && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Columns className="w-4 h-4 text-rose-400" />
                    Transposición por Columnas
                  </h3>
                  <p className="text-xs text-slate-400">
                    Reordenamiento en rejilla matricial con clave alfabética o conteo de columnas.
                  </p>
                </div>
                <button
                  onClick={() => loadPreset('columnar')}
                  className="px-2.5 py-1 text-[11px] font-mono bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg transition"
                >
                  Cargar Ejemplo 1.63
                </button>
              </div>

              {/* Clave y Configuración */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-mono text-slate-400">Clave de Columna (Palabra o Número):</span>
                  <input
                    type="text"
                    value={keyword}
                    onChange={e => setKeyword(e.target.value.toUpperCase())}
                    placeholder="Ej. RELOJ o 5"
                    className="bg-slate-950 border border-slate-800 text-rose-300 font-mono text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-rose-500"
                  />
                  <span className="text-[10px] text-slate-500">
                    Ingresa una palabra (ej. RELOJ) o el número de columnas (ej. 5).
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-mono text-slate-400">Comodín de Relleno (Padding):</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={1}
                      value={padChar}
                      onChange={e => setPadChar(e.target.value.toUpperCase() || 'X')}
                      className="w-16 bg-slate-950 border border-slate-800 text-amber-300 font-mono text-xs px-3 py-2 rounded-xl text-center focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-[11px] text-slate-400 font-mono">
                      Carácter nulo para completar la matriz ({columnarRes.gridInfo.numRows} × {columnarRes.gridInfo.numCols} = {columnarRes.gridInfo.numRows * columnarRes.gridInfo.numCols} celdas)
                    </span>
                  </div>
                </div>
              </div>

              {/* Rejilla Matricial */}
              <div className="overflow-x-auto p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <table className="border-collapse font-mono text-xs w-full text-center">
                  <thead>
                    <tr className="border-b border-slate-800 text-rose-400">
                      {columnarRes.gridInfo.keyword.split(columnarRes.gridInfo.isNumericKey ? ' ' : '').map((kChar, ki) => (
                        <th key={`k-${ki}`} className="p-2 font-bold bg-slate-900/80">
                          {columnarRes.gridInfo.isNumericKey ? `Col ${kChar}` : kChar}
                        </th>
                      ))}
                    </tr>
                    <tr className="border-b border-slate-800 text-amber-400 text-[11px]">
                      {columnarRes.gridInfo.colOrder.map((ord, oi) => (
                        <th key={`ord-${oi}`} className="p-1 bg-amber-500/10">
                          #{ord}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {columnarRes.gridInfo.grid.map((row, ri) => (
                      <tr key={`r-${ri}`} className="border-b border-slate-800/40">
                        {row.map((cell, ci) => {
                          const isPad = cell === padChar && direction === 'encrypt';
                          return (
                            <td
                              key={`c-${ri}-${ci}`}
                              className={`p-2 transition ${
                                isPad
                                  ? 'text-amber-400 bg-amber-500/10 font-bold'
                                  : 'text-slate-200 hover:bg-rose-500/10'
                              }`}
                              title={isPad ? 'Carácter comodín de relleno' : `Fila ${ri + 1}, Columna ${ci + 1}`}
                            >
                              {cell}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <span>
                  Orden de lectura de columnas:{' '}
                  <strong className="text-rose-400">
                    {columnarRes.gridInfo.colIndicesSorted.map(i => `#${columnarRes.gridInfo.colOrder[i]}`).join(' → ')}
                  </strong>
                </span>
                <span>
                  Dimensiones: {columnarRes.gridInfo.numRows} filas × {columnarRes.gridInfo.numCols} columnas
                </span>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: TRANSPOSICIÓN POR FILAS                                 */}
          {/* ============================================================== */}
          {subType === 'row' && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Rows className="w-4 h-4 text-emerald-400" />
                    Transposición por Filas (NF Niveles)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Escritura vertical en NF filas y lectura horizontal (Ramió Aguirre p. 95, Ej. 1.64 y 1.65).
                  </p>
                </div>
                <button
                  onClick={() => loadPreset('row')}
                  className="px-2.5 py-1 text-[11px] font-mono bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg transition"
                >
                  Cargar Ejemplo 1.64
                </button>
              </div>

              {/* Clave NF y Comodín */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-mono text-slate-400">Clave Número de Filas (NF):</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={2}
                      max={20}
                      value={numRows}
                      onChange={e => setNumRows(parseInt(e.target.value, 10) || 2)}
                      className="w-20 bg-slate-950 border border-slate-800 text-emerald-300 font-mono text-xs px-3 py-2 rounded-xl text-center focus:outline-none focus:border-emerald-500 font-bold"
                    />
                    <span className="text-[11px] text-slate-500">
                      {rowRes.gridInfo.numRows} niveles verticales
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-mono text-slate-400">Comodín de Relleno:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={1}
                      value={padChar}
                      onChange={e => setPadChar(e.target.value.toUpperCase() || 'X')}
                      className="w-16 bg-slate-950 border border-slate-800 text-amber-300 font-mono text-xs px-3 py-2 rounded-xl text-center focus:outline-none focus:border-amber-500 font-bold"
                    />
                    <span className="text-[11px] text-slate-400 font-mono">
                      Carácter de relleno para completar {rowRes.gridInfo.numRows} × {rowRes.gridInfo.numCols} celdas
                    </span>
                  </div>
                </div>
              </div>

              {/* Rejilla de Filas */}
              <div className="overflow-x-auto p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <table className="border-collapse font-mono text-xs w-full text-center">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                      <th className="p-2 bg-slate-900 text-emerald-400 font-bold">Fila</th>
                      {Array.from({ length: rowRes.gridInfo.numCols }).map((_, ci) => (
                        <th key={`head-c-${ci}`} className="p-1 text-slate-500">
                          C{ci + 1}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rowRes.gridInfo.grid.map((row, ri) => (
                      <tr key={`r-row-${ri}`} className="border-b border-slate-800/40">
                        <td className="p-2 font-bold bg-slate-900/60 text-emerald-300 border-r border-slate-800">
                          Fila {ri + 1}
                        </td>
                        {row.map((cell, ci) => {
                          const isPad = cell === padChar && direction === 'encrypt';
                          return (
                            <td
                              key={`cell-${ri}-${ci}`}
                              className={`p-2 transition ${
                                isPad
                                  ? 'text-amber-400 bg-amber-500/10 font-bold'
                                  : 'text-slate-200 hover:bg-emerald-500/10'
                              }`}
                            >
                              {cell}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Guía didáctica de dirección */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 font-mono flex flex-col gap-1">
                {direction === 'encrypt' ? (
                  <>
                    <span className="text-emerald-400 font-bold">Modo Cifrado:</span>
                    <span>1. El texto se escribe en vertical (de arriba hacia abajo en cada columna).</span>
                    <span>2. El criptograma se obtiene leyendo en horizontal fila por fila (Fila 1, Fila 2, ...).</span>
                  </>
                ) : (
                  <>
                    <span className="text-amber-400 font-bold">Modo Descifrado:</span>
                    <span>1. El criptograma se escribe en horizontal fila por fila en {rowRes.gridInfo.numCols} columnas.</span>
                    <span>2. El texto original se recupera leyendo verticalmente de arriba hacia abajo por columnas.</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 4: ESCÍTALA ESPARTANA                                      */}
          {/* ============================================================== */}
          {subType === 'scytale' && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Cylinder className="w-4 h-4 text-amber-400" />
                    Escítala Espartana (Bastón Cilíndrico)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Cinta de pergamino enrollada en un bastón de madera de diámetro d.
                  </p>
                </div>
                <button
                  onClick={() => loadPreset('scytale')}
                  className="px-2.5 py-1 text-[11px] font-mono bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg transition"
                >
                  Cargar Ejemplo
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-400">Diámetro (Número de caras / Columnas):</span>
                <input
                  type="number"
                  min="2"
                  max="12"
                  value={diameter}
                  onChange={e => setDiameter(parseInt(e.target.value, 10) || 2)}
                  className="w-16 bg-slate-950 border border-slate-800 text-amber-300 font-mono text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-amber-500 text-center font-bold"
                />
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col gap-3">
                <span className="text-[10px] text-amber-400 uppercase tracking-widest font-mono">
                  Cinta helicoidal enrollada en el bastón ({scytaleRes.numRows} vueltas × {scytaleRes.numCols} caras):
                </span>
                <div
                  className="grid gap-1.5 font-mono text-xs"
                  style={{ gridTemplateColumns: `repeat(${scytaleRes.numCols}, minmax(0, 1fr))` }}
                >
                  {scytaleRes.padded.split('').map((c, i) => (
                    <div
                      key={`scyt-${i}`}
                      className="p-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-center font-bold text-amber-300"
                    >
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Pasos Detallados */}
          <div className="mt-2 border-t border-slate-800/80 pt-3">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5 mb-2">
              <BookOpen className="w-3.5 h-3.5 text-rose-400" />
              Pasos del Procedimiento Criptográfico:
            </span>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col gap-1 font-mono text-[11px] text-slate-300">
              {subType === 'series' && seriesRes.seriesInfo.steps.map((st, i) => <div key={`st-${i}`}>• {st}</div>)}
              {subType === 'columnar' && (
                <>
                  <div>• Longitud del texto: {inputText.length} caracteres</div>
                  <div>• Clave de columnas: &quot;{keyword}&quot; ({columnarRes.gridInfo.numCols} columnas, {columnarRes.gridInfo.numRows} filas)</div>
                  <div>• Comodín de relleno: &quot;{padChar}&quot;</div>
                  <div>• Modo {direction === 'encrypt' ? 'Cifrado' : 'Descifrado'}: Reconstrucción matricial exacta</div>
                </>
              )}
              {subType === 'row' && rowRes.gridInfo.steps.map((st, i) => <div key={`st-${i}`}>• {st}</div>)}
              {subType === 'scytale' && (
                <>
                  <div>• Diámetro de la escítala: {scytaleRes.diameter} columnas</div>
                  <div>• Filas / Vueltas de la cinta: {scytaleRes.numRows}</div>
                  <div>• Texto con relleno: &quot;{scytaleRes.padded}&quot;</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Sandbox & Output Panel */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col gap-4">
            {/* Direction & Comodín Selector */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Comodín:</span>
                <input
                  type="text"
                  maxLength={1}
                  value={padChar}
                  onChange={e => setPadChar(e.target.value.toUpperCase() || 'X')}
                  className="w-10 bg-slate-950 border border-slate-800 text-amber-300 font-mono text-xs px-2 py-1 rounded-lg text-center font-bold focus:outline-none focus:border-amber-500"
                  title="Carácter comodín de relleno para completar bloques o matrices (Padding / Null)"
                />
              </div>
              <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
                <button
                  onClick={() => setDirection('encrypt')}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
                    direction === 'encrypt'
                      ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Cifrar
                </button>
                <button
                  onClick={() => setDirection('decrypt')}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
                    direction === 'decrypt'
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Descifrar
                </button>
              </div>
            </div>

            {/* Input Textarea */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  Texto {direction === 'encrypt' ? 'en Claro (M)' : 'Cifrado (C)'}:
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {inputText.replace(/\s+/g, '').length} caracteres limpios
                </span>
              </div>
              <textarea
                value={inputText}
                onChange={e => setInputText(e.target.value.toUpperCase())}
                rows={3}
                placeholder="Escribe el mensaje aquí..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 font-mono focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>

            {/* Swap Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSwap}
                disabled={!currentResult.outputText}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl transition disabled:opacity-40"
                title="Copiar resultado a entrada e invertir dirección"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-rose-400" />
                Intercambiar Entrada ⇄ Salida
              </button>
            </div>

            {/* Result Display */}
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  Resultado ({direction === 'encrypt' ? 'Criptograma C' : 'Texto Claro M'}):
                </span>
                <CopyButton text={currentResult.outputText} label="Copiar" />
              </div>

              {/* Formatted Blocks */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col gap-1 font-mono">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                  Bloques militares de 5 letras:
                </span>
                <div className="text-sm font-bold text-emerald-400 tracking-wider break-all">
                  {currentResult.formattedOutput || '—'}
                </div>
              </div>

              {/* Continuous Stream */}
              <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex flex-col gap-1 font-mono">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                  Flujo continuo sin espacios:
                </span>
                <div className="text-xs font-bold text-slate-200 tracking-normal break-all">
                  {currentResult.outputText || '—'}
                </div>
              </div>
            </div>

            {/* Quick Summary Box */}
            <div className="p-3 bg-slate-950/40 border border-slate-800/60 rounded-xl flex flex-col gap-1 text-[11px] text-slate-400 font-mono">
              <div className="flex justify-between">
                <span>Algoritmo activo:</span>
                <strong className="text-slate-200 capitalize">{subType}</strong>
              </div>
              <div className="flex justify-between">
                <span>Longitud resultante:</span>
                <strong className="text-slate-200">{currentResult.outputText.length} caracteres</strong>
              </div>
              {subType === 'series' && (
                <div className="flex justify-between">
                  <span>Convención número 1:</span>
                  <strong className={oneIsPrime ? 'text-purple-300' : 'text-amber-300'}>
                    {oneIsPrime ? 'Primo (Ramió)' : 'Impar (Profesor)'}
                  </strong>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
