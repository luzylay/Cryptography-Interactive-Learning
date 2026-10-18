import React, { useState, useMemo } from 'react';
import { AlphabetMode } from '../../crypto/alphabets';
import {
  processGroupTransposition,
  processSeriesTransposition,
  processColumnarTransposition,
  processRowTransposition,
  processScytale,
  SeriesOrderType,
} from '../../crypto/ciphers/transposition';
import {
  Columns,
  Rows,
  Layers,
  Cylinder,
  Shuffle,
  Sparkles,
  ArrowUpDown,
  BookOpen,
  Info,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { CopyButton } from '../common/CopyButton';

interface ScytaleColumnarProps {
  mode: AlphabetMode;
}

type TranspositionType = 'groups' | 'series' | 'columnar' | 'row' | 'scytale';

export const ScytaleColumnar: React.FC<ScytaleColumnarProps> = ({ mode }) => {
  const [subType, setSubType] = useState<TranspositionType>('series');
  const [direction, setDirection] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [inputText, setInputText] = useState<string>('ERRAR ES HUMANO, PERDONAR DIVINO');
  const [padChar, setPadChar] = useState<string>('X');

  // Groups params
  const [groupKey, setGroupKey] = useState<string>('24531');

  // Series params
  const [oneIsPrime, setOneIsPrime] = useState<boolean>(false); // Default: Criterio del profesor (1 es impar)
  const [seriesOrder, setSeriesOrder] = useState<SeriesOrderType>('primos-pares-impares');

  // Columnar params
  const [keyword, setKeyword] = useState<string>('RELOJ');

  // Row params
  const [numRows, setNumRows] = useState<number>(3);

  // Scytale params
  const [diameter, setDiameter] = useState<number>(4);

  // Computations
  const groupRes = useMemo(() => {
    return processGroupTransposition(inputText, groupKey, mode, direction, padChar);
  }, [inputText, groupKey, mode, direction, padChar]);

  const seriesRes = useMemo(() => {
    return processSeriesTransposition(inputText, oneIsPrime, mode, direction, padChar, seriesOrder);
  }, [inputText, oneIsPrime, mode, direction, padChar, seriesOrder]);

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
      case 'groups':
        return groupRes;
      case 'series':
        return seriesRes;
      case 'columnar':
        return columnarRes;
      case 'row':
        return rowRes;
      case 'scytale':
        return scytaleRes;
    }
  }, [subType, groupRes, seriesRes, columnarRes, rowRes, scytaleRes]);

  // Preset loaders for specific academic / exam exercises
  const loadGroupPreset = (type: 'ramio' | 'mermelada') => {
    setSubType('groups');
    setDirection('encrypt');
    if (type === 'ramio') {
      setInputText('MANOS ARRIBA, ESTO ES UN ATRACO');
      setGroupKey('24531');
    } else {
      setInputText('MERMELADA DE FRESA');
      setGroupKey('24531');
    }
  };

  const loadSeriesPreset = (type: 'ramio' | 'pc2' | 'diapo15' | 'diapo16') => {
    setSubType('series');
    setDirection('encrypt');
    if (type === 'ramio') {
      setInputText('ERRAR ES HUMANO, PERDONAR DIVINO');
      setSeriesOrder('primos-pares-impares');
      setOneIsPrime(true);
    } else if (type === 'pc2') {
      setInputText('ERRAR ES HUMANO PERDONAR ES DIVINO');
      setSeriesOrder('pares-primos-impares');
      setOneIsPrime(false);
    } else if (type === 'diapo15') {
      setInputText('AUTOMATIZAR ES BUENO');
      setSeriesOrder('primos-pares-impares');
      setOneIsPrime(true);
    } else if (type === 'diapo16') {
      setInputText('AUN NECESITAMOS DINERO');
      setSeriesOrder('primos-pares-impares');
      setOneIsPrime(true);
    }
  };

  const loadColumnarPreset = (type: 'reloj' | 'pc2_col6' | 'pc2_puedo' | 'frase' | 'cneam') => {
    setSubType('columnar');
    if (type === 'reloj') {
      setInputText('EL PATIO DE MI CASA ES PARTICULAR, CUANDO LLUEVE SE MOJA COMO LOS DEMAS');
      setKeyword('RELOJ');
      setDirection('encrypt');
    } else if (type === 'pc2_col6') {
      setInputText('AHORA A RESOLVER LOS EJERCICIOS');
      setKeyword('6');
      setDirection('encrypt');
    } else if (type === 'pc2_puedo') {
      setInputText('EL DINERO NO COMPRA LA VIDA');
      setKeyword('32415');
      setDirection('encrypt');
    } else if (type === 'frase') {
      setInputText('LA CARIDAD TRAE LA PESTE');
      setKeyword('25431');
      setDirection('encrypt');
    } else if (type === 'cneam') {
      setInputText('CNEAM SAANY IXMNO CNXIT HAOX');
      setKeyword('4');
      setDirection('decrypt');
    }
  };

  const loadRowPreset = (type: 'prisionero' | 'mapdd' | 'soqna' | 'aprende') => {
    setSubType('row');
    if (type === 'prisionero') {
      setInputText('EL PRISIONERO SE ENTREGARA EN EL LUGAR YA INDICADO');
      setNumRows(3);
      setDirection('encrypt');
    } else if (type === 'mapdd') {
      setInputText('MAPDD ITOOE RURNX');
      setNumRows(3);
      setDirection('decrypt');
    } else if (type === 'soqna') {
      setInputText('SOQNA OSUAS LEEDE');
      setNumRows(3);
      setDirection('decrypt');
    } else if (type === 'aprende') {
      setInputText('APRENDE A VIVIR Y SABRAS MORIR BIEN');
      setNumRows(4);
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
            {subType === 'groups' && <Shuffle className="w-5 h-5" />}
            {subType === 'series' && <Layers className="w-5 h-5" />}
            {subType === 'columnar' && <Columns className="w-5 h-5" />}
            {subType === 'row' && <Rows className="w-5 h-5" />}
            {subType === 'scytale' && <Cylinder className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-100">Cifradores por Transposición Clásica</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 font-mono">
                Calculadora Didáctica Completa
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-1 mt-0.5">
              <span>Difusión de Shannon sin alteración de frecuencias monográmicas</span>
              <span>·</span>
              <span className="text-rose-400 font-mono text-[11px]">Ramió Aguirre (1999, pp. 88–96)</span>
            </p>
          </div>
        </div>

        {/* Subtype Selector Tabs */}
        <div className="flex flex-wrap rounded-xl bg-slate-950 p-1 border border-slate-800 gap-1">
          <button
            onClick={() => setSubType('groups')}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 ${
              subType === 'groups'
                ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" />
            Por Grupos (Π_M)
          </button>
          <button
            onClick={() => setSubType('series')}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 ${
              subType === 'series'
                ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Series (MS1, MS2, MS3)
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
          {/* TAB 0: TRANSPOSICIÓN POR GRUPOS (Π_M)                          */}
          {/* ============================================================== */}
          {subType === 'groups' && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Shuffle className="w-4 h-4 text-emerald-400" />
                    Transposición Periódica por Grupos (Π_M)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Permutación en bloques discretos de tamaño p = {groupRes.groupInfo.blockSize}.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => loadGroupPreset('ramio')}
                    className="px-2.5 py-1 text-[11px] font-mono bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg transition"
                  >
                    Ej. 1.57 (MANOS ARRIBA)
                  </button>
                  <button
                    onClick={() => loadGroupPreset('mermelada')}
                    className="px-2.5 py-1 text-[11px] font-mono bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-lg transition"
                  >
                    Diapo 10 (MERMELADA)
                  </button>
                </div>
              </div>

              {/* Input Permutación */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-mono text-slate-300 font-bold">
                    Permutación Periódica Π_M:
                  </span>
                  <input
                    type="text"
                    value={groupKey}
                    onChange={e => setGroupKey(e.target.value)}
                    placeholder="Ej. 24531 o 2 4 5 3 1"
                    className="bg-slate-950 border border-slate-800 text-emerald-300 font-mono text-sm px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500 font-bold"
                  />
                  <span className="text-[10px] text-slate-500 font-mono">
                    Vector de permutación 1..p (longitud = período p).
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
                      Rellena bloques incompletos ({groupRes.groupInfo.numBlocks} bloques de {groupRes.groupInfo.blockSize})
                    </span>
                  </div>
                </div>
              </div>

              {/* Visualización de Bloques Permutados */}
              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-mono text-slate-300 font-bold">
                  Desglose Bloque a Bloque ({groupRes.groupInfo.blocks.length} bloques):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto p-1">
                  {groupRes.groupInfo.blocks.map(block => (
                    <div
                      key={`blk-${block.blockIndex}`}
                      className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex flex-col gap-2 font-mono text-xs"
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800/80 pb-1">
                        <span className="font-bold text-emerald-400">Bloque #{block.blockIndex + 1}</span>
                        <span className="text-slate-500">Π = [{groupRes.groupInfo.permutation.join('')}]</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] text-slate-500">Entrada</span>
                          <span className="text-sm font-bold text-slate-200 tracking-wider">
                            {block.inBlock}
                          </span>
                        </div>
                        <span className="text-emerald-400 font-bold">→</span>
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] text-slate-500">Salida</span>
                          <span className="text-sm font-bold text-emerald-300 tracking-wider">
                            {block.outBlock}
                          </span>
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400 bg-slate-900/60 p-1.5 rounded border border-slate-800/60">
                        {block.mappings.map((m, mi) => (
                          <span key={`map-${mi}`} className="inline-block mr-2">
                            m<sub>{m.fromPos}</sub>({m.char})→c<sub>{m.toPos}</sub>
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

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
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => loadSeriesPreset('ramio')}
                    className="px-2 py-1 text-[11px] font-mono bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg transition"
                  >
                    Ej. 1.58 Ramió
                  </button>
                  <button
                    onClick={() => loadSeriesPreset('pc2')}
                    className="px-2 py-1 text-[11px] font-mono bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg transition"
                  >
                    Examen PC2 (Ej. 01)
                  </button>
                  <button
                    onClick={() => loadSeriesPreset('diapo15')}
                    className="px-2 py-1 text-[11px] font-mono bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-lg transition"
                  >
                    Diapo 15
                  </button>
                  <button
                    onClick={() => loadSeriesPreset('diapo16')}
                    className="px-2 py-1 text-[11px] font-mono bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg transition"
                  >
                    Diapo 16
                  </button>
                </div>
              </div>

              {/* ORDEN DE SERIES Y TOGGLE DEL 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Configuración de Orden */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col gap-2">
                  <span className="text-xs font-bold text-slate-200">Orden de las Series:</span>
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => setSeriesOrder('primos-pares-impares')}
                      className={`px-3 py-1.5 text-xs font-mono rounded-lg text-left transition ${
                        seriesOrder === 'primos-pares-impares'
                          ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40'
                          : 'text-slate-400 hover:bg-slate-900 border border-transparent'
                      }`}
                    >
                      1. Primos → 2. Pares → 3. Impares (Ramió / Diapo 11)
                    </button>
                    <button
                      onClick={() => setSeriesOrder('pares-primos-impares')}
                      className={`px-3 py-1.5 text-xs font-mono rounded-lg text-left transition ${
                        seriesOrder === 'pares-primos-impares'
                          ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                          : 'text-slate-400 hover:bg-slate-900 border border-transparent'
                      }`}
                    >
                      1. Pares → 2. Primos → 3. Impares (Examen PC2)
                    </button>
                  </div>
                </div>

                {/* Tratamiento del 1 */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">Tratamiento del número 1:</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-mono">
                      Posición m₁
                    </span>
                  </div>
                  <div className="flex rounded-lg bg-slate-900 p-0.5 border border-slate-800">
                    <button
                      onClick={() => setOneIsPrime(false)}
                      className={`flex-1 py-1 text-xs font-mono rounded-md transition-all ${
                        !oneIsPrime
                          ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      1 es Impar (Profesor)
                    </button>
                    <button
                      onClick={() => setOneIsPrime(true)}
                      className={`flex-1 py-1 text-xs font-mono rounded-md transition-all ${
                        oneIsPrime
                          ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      1 es Primo (Ramió)
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {oneIsPrime
                      ? 'Ramió Aguirre (p. 90) incluye m₁ en la serie de números primos (MS1).'
                      : 'El estándar moderno clasifica m₁ en los números impares (MS3).'}
                  </p>
                </div>
              </div>

              {/* 3 SERIES CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* MS1 */}
                <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-800/40 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-300 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                      MS1: {seriesRes.seriesInfo.ms1Name}
                    </span>
                    <span className="text-[10px] font-mono text-purple-400">
                      {seriesRes.seriesInfo.ms1Indices.length} elems
                    </span>
                  </div>
                  <div className="text-xs font-mono text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-purple-900/40 break-all max-h-20 overflow-y-auto">
                    {seriesRes.seriesInfo.ms1Indices.map(i => `m${i}`).join(', ') || 'Ninguno'}
                  </div>
                  <div className="text-xs font-mono font-bold text-purple-300 bg-purple-900/20 px-2 py-1 rounded border border-purple-700/30">
                    &quot;{seriesRes.seriesInfo.ms1Chars || '-'}&quot;
                  </div>
                </div>

                {/* MS2 */}
                <div className="p-3 rounded-xl bg-sky-950/20 border border-sky-800/40 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-300 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                      MS2: {seriesRes.seriesInfo.ms2Name}
                    </span>
                    <span className="text-[10px] font-mono text-sky-400">
                      {seriesRes.seriesInfo.ms2Indices.length} elems
                    </span>
                  </div>
                  <div className="text-xs font-mono text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-sky-900/40 break-all max-h-20 overflow-y-auto">
                    {seriesRes.seriesInfo.ms2Indices.map(i => `m${i}`).join(', ') || 'Ninguno'}
                  </div>
                  <div className="text-xs font-mono font-bold text-sky-300 bg-sky-900/20 px-2 py-1 rounded border border-sky-700/30">
                    &quot;{seriesRes.seriesInfo.ms2Chars || '-'}&quot;
                  </div>
                </div>

                {/* MS3 */}
                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                      MS3: {seriesRes.seriesInfo.ms3Name}
                    </span>
                    <span className="text-[10px] font-mono text-amber-400">
                      {seriesRes.seriesInfo.ms3Indices.length} elems
                    </span>
                  </div>
                  <div className="text-xs font-mono text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-amber-900/40 break-all max-h-20 overflow-y-auto">
                    {seriesRes.seriesInfo.ms3Indices.map(i => `m${i}`).join(', ') || 'Ninguno'}
                  </div>
                  <div className="text-xs font-mono font-bold text-amber-300 bg-amber-900/20 px-2 py-1 rounded border border-amber-700/30">
                    &quot;{seriesRes.seriesInfo.ms3Chars || '-'}&quot;
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
                    Transposición por Columnas Simple y con Clave
                  </h3>
                  <p className="text-xs text-slate-400">
                    Reordenamiento en rejilla con clave alfabética, permutación numérica o número de columnas.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => loadColumnarPreset('reloj')}
                    className="px-2 py-1 text-[11px] font-mono bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg transition"
                  >
                    Ej. 1.63 (RELOJ)
                  </button>
                  <button
                    onClick={() => loadColumnarPreset('pc2_col6')}
                    className="px-2 py-1 text-[11px] font-mono bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg transition"
                  >
                    Examen PC2 (NC=6)
                  </button>
                  <button
                    onClick={() => loadColumnarPreset('pc2_puedo')}
                    className="px-2 py-1 text-[11px] font-mono bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-lg transition"
                  >
                    Examen PC2 (PUEDO / 32415)
                  </button>
                  <button
                    onClick={() => loadColumnarPreset('frase')}
                    className="px-2 py-1 text-[11px] font-mono bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg transition"
                  >
                    Diapo 39 (FRASE / 25431)
                  </button>
                  <button
                    onClick={() => loadColumnarPreset('cneam')}
                    className="px-2 py-1 text-[11px] font-mono bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg transition"
                  >
                    Descifrar (Diapo 35)
                  </button>
                </div>
              </div>

              {/* Advertencia Académica Crítica sobre la lectura por columnas */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-200/90 leading-relaxed font-sans">
                  <strong>Regla Académica Fundamental:</strong> En el cifrado por columnas (tanto simple como con clave/permutación), tras escribir el texto horizontalmente por filas y permutar las columnas, el criptograma <strong>SIEMPRE se lee de arriba hacia abajo columna por columna</strong>.
                  <span className="block mt-1 text-[11px] text-amber-300/80">
                    💡 <em>Nota sobre PC2:</em> En el Ejercicio 03, permutar las columnas y leer horizontalmente por filas es el error más recurrente; el método oficial exige lectura columnar vertical.
                  </span>
                </div>
              </div>

              {/* Clave y Configuración */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-mono text-slate-300 font-bold">
                    Clave de Columna (Palabra, Permutación o Número):
                  </span>
                  <input
                    type="text"
                    value={keyword}
                    onChange={e => setKeyword(e.target.value.toUpperCase())}
                    placeholder="Ej. RELOJ, 32415 o 6"
                    className="bg-slate-950 border border-slate-800 text-rose-300 font-mono text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-rose-500 font-bold"
                  />
                  <span className="text-[10px] text-slate-500 font-mono">
                    Acepta palabras (RELOJ), permutaciones (32415) o número simple (6).
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
                      Celdas de relleno ({columnarRes.gridInfo.numRows} filas × {columnarRes.gridInfo.numCols} columnas = {columnarRes.gridInfo.numRows * columnarRes.gridInfo.numCols} celdas)
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
                    <Rows className="w-4 h-4 text-sky-400" />
                    Transposición por Filas (Escritura Vertical, Lectura Horizontal)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Se escribe verticalmente en NF niveles y se lee horizontalmente fila a fila.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => loadRowPreset('prisionero')}
                    className="px-2 py-1 text-[11px] font-mono bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-lg transition"
                  >
                    Ej. 1.64 (NF=3)
                  </button>
                  <button
                    onClick={() => loadRowPreset('mapdd')}
                    className="px-2 py-1 text-[11px] font-mono bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg transition"
                  >
                    Descifrar 1.65 (MAPDD)
                  </button>
                  <button
                    onClick={() => loadRowPreset('soqna')}
                    className="px-2 py-1 text-[11px] font-mono bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg transition"
                  >
                    Diapo 48 (SOQNA)
                  </button>
                  <button
                    onClick={() => loadRowPreset('aprende')}
                    className="px-2 py-1 text-[11px] font-mono bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg transition"
                  >
                    Diapo 43 (NF=4)
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-400">Clave Número de Filas (NF):</span>
                <input
                  type="number"
                  min="2"
                  max="15"
                  value={numRows}
                  onChange={e => setNumRows(parseInt(e.target.value, 10) || 3)}
                  className="w-16 bg-slate-950 border border-slate-800 text-sky-300 font-mono text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-sky-500 text-center font-bold"
                />
                <span className="text-xs font-mono text-slate-500">
                  Columnas resultantes: NC = {rowRes.gridInfo.numCols}
                </span>
              </div>

              {/* Matriz de Filas */}
              <div className="overflow-x-auto p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <table className="border-collapse font-mono text-xs w-full text-center">
                  <thead>
                    <tr className="border-b border-slate-800 text-sky-400">
                      <th className="p-1.5 text-slate-500">Fila</th>
                      {Array.from({ length: rowRes.gridInfo.numCols }, (_, c) => (
                        <th key={`hdr-c-${c}`} className="p-1.5 bg-slate-900/60">
                          C{c + 1}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rowRes.gridInfo.grid.map((row, ri) => (
                      <tr key={`row-${ri}`} className="border-b border-slate-800/40">
                        <td className="p-1.5 font-bold text-sky-400 bg-slate-900/40">F{ri + 1}</td>
                        {row.map((cell, ci) => {
                          const isPad = cell === padChar && direction === 'encrypt';
                          return (
                            <td
                              key={`rc-${ri}-${ci}`}
                              className={`p-1.5 transition ${
                                isPad
                                  ? 'text-amber-400 bg-amber-500/10 font-bold'
                                  : 'text-slate-200 hover:bg-sky-500/10'
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
                  onClick={() => {
                    setInputText('AL GRITO DE VIVA ZAPATA');
                    setDiameter(4);
                    setDirection('encrypt');
                  }}
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
              {subType === 'groups' && groupRes.groupInfo.steps.map((st, i) => <div key={`st-${i}`}>• {st}</div>)}
              {subType === 'series' && seriesRes.seriesInfo.steps.map((st, i) => <div key={`st-${i}`}>• {st}</div>)}
              {subType === 'columnar' && (
                <>
                  <div>• Longitud del texto: {inputText.length} caracteres</div>
                  <div>• Clave de columnas: &quot;{keyword}&quot; ({columnarRes.gridInfo.numCols} columnas, {columnarRes.gridInfo.numRows} filas)</div>
                  <div>• Comodín de relleno: &quot;{padChar}&quot;</div>
                  <div>• Orden de columnas: {columnarRes.gridInfo.colIndicesSorted.map(i => `#${columnarRes.gridInfo.colOrder[i]}`).join(', ')}</div>
                  <div>• Lectura: De arriba hacia abajo (vertical) por columna</div>
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
                Intercambiar Cifra / Claro
              </button>
            </div>

            {/* Output Display */}
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  Resultado {direction === 'encrypt' ? 'Cifrado (C)' : 'en Claro (M)'}:
                </span>
                <CopyButton text={currentResult.outputText} label="Copiar Texto" />
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
                <div className="text-base font-bold font-mono text-rose-300 break-all select-all">
                  {currentResult.outputText || <span className="text-slate-600 font-normal italic">Sin salida</span>}
                </div>
                {currentResult.formattedOutput && (
                  <div className="text-xs font-mono text-slate-400 pt-1 border-t border-slate-900 flex items-center justify-between">
                    <span>En bloques de 5:</span>
                    <span className="text-amber-400 font-semibold">{currentResult.formattedOutput}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
