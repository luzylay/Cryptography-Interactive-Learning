import React, { useState, useMemo } from 'react';
import { AlphabetMode, ALPHABETS, formatInBlocks, normalizeText } from '../../crypto/alphabets';
import { processHillNxN, cryptanalysisHillNxN, deriveHillMatrixFromText } from '../../crypto/ciphers/hill';
import { modInverse } from '../../crypto/mathUtils';
import { Calculator, CheckCircle2, XCircle, ArrowRight, Layers, Unlock, Wand2 } from 'lucide-react';

interface HillMatrixToolProps {
  mode: AlphabetMode;
}

export const HillMatrixTool: React.FC<HillMatrixToolProps> = ({ mode }) => {
  const [activeTab, setActiveTab] = useState<'cipher' | 'cryptanalysis'>('cipher');
  const [matrixDim, setMatrixDim] = useState<2 | 3 | 4 | 5>(2);
  const [m2, setM2] = useState<number[][]>([
    [2, 3],
    [1, 5],
  ]);
  const [m3, setM3] = useState<number[][]>([
    [6, 24, 1],
    [13, 16, 10],
    [20, 17, 15],
  ]);
  const [m4, setM4] = useState<number[][]>([
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ]);
  const [m5, setM5] = useState<number[][]>([
    [1, 0, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 0, 1],
  ]);
  
  const [keyInputStr, setKeyInputStr] = useState<string>('');
  const [fillerChar, setFillerChar] = useState<string>('X');
  
  const [inputText, setInputText] = useState<string>('HOLA A TODOS');
  const [direction, setDirection] = useState<'encrypt' | 'decrypt'>('encrypt');

  // Cryptanalysis states
  const [cryptoPlain, setCryptoPlain] = useState<string>('DELA YOPE');
  const [cryptoCipher, setCryptoCipher] = useState<string>('JCOW ZLVB');

  const [localAlphabetType, setLocalAlphabetType] = useState<string>('global');
  const [customAlphabetStr, setCustomAlphabetStr] = useState<string>('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ');

  const alphaChars = useMemo(() => {
    if (localAlphabetType === 'global') return ALPHABETS[mode].chars;
    if (localAlphabetType === 'es27') return ALPHABETS['es27'].chars;
    if (localAlphabetType === 'en26') return ALPHABETS['en26'].chars;
    if (localAlphabetType === 'es28') return ALPHABETS['es27'].chars + ' ';
    
    const uniqueChars = Array.from(new Set(customAlphabetStr.toUpperCase().split('')));
    return uniqueChars.length > 1 ? uniqueChars.join('') : 'AB';
  }, [mode, localAlphabetType, customAlphabetStr]);

  const m = alphaChars.length;

  const result = useMemo(() => {
    let currentMatrix = m2;
    if (matrixDim === 3) currentMatrix = m3;
    else if (matrixDim === 4) currentMatrix = m4;
    else if (matrixDim === 5) currentMatrix = m5;
    return processHillNxN(inputText, currentMatrix, alphaChars, direction, fillerChar);
  }, [matrixDim, m2, m3, m4, m5, inputText, alphaChars, direction, fillerChar]);

  const handleKeyFromStr = () => {
    const derived = deriveHillMatrixFromText(keyInputStr, alphaChars, fillerChar);
    if (derived) {
      setMatrixDim(derived.dimension);
      if (derived.dimension === 2) setM2(derived.matrix);
      if (derived.dimension === 3) setM3(derived.matrix);
      if (derived.dimension === 4) setM4(derived.matrix);
      if (derived.dimension === 5) setM5(derived.matrix);
    }
  };

  const cryptanalysisResult = useMemo(() => {
    if (activeTab !== 'cryptanalysis') return null;
    return cryptanalysisHillNxN(cryptoPlain, cryptoCipher, matrixDim, alphaChars);
  }, [cryptoPlain, cryptoCipher, matrixDim, alphaChars, activeTab]);

  const updateM2 = (r: number, c: number, val: number) => {
    const next = m2.map((row, ri) => row.map((col, ci) => (ri === r && ci === c ? val : col)));
    setM2(next);
  };

  const updateM3 = (r: number, c: number, val: number) => {
    const next = m3.map((row, ri) => row.map((col, ci) => (ri === r && ci === c ? val : col)));
    setM3(next);
  };

  const updateM4 = (r: number, c: number, val: number) => {
    const next = m4.map((row, ri) => row.map((col, ci) => (ri === r && ci === c ? val : col)));
    setM4(next);
  };

  const updateM5 = (r: number, c: number, val: number) => {
    const next = m5.map((row, ri) => row.map((col, ci) => (ri === r && ci === c ? val : col)));
    setM5(next);
  };

  return (
    <div className="flex flex-col gap-6 p-2 lg:p-4 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Cifrador de Hill (Álgebra Matricial Modular)</h2>
              <p className="text-xs text-slate-400 font-mono">
                C = K · M mod {m} · Poligráfico · <span className="text-emerald-400 font-mono text-[10px]">Fuente APA 7: Hill (1929, DOI: 10.2307/2298294); Ramió Aguirre (1999, p. 28)</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap rounded-xl bg-slate-950 p-1 border border-slate-800 gap-1">
            <button
              onClick={() => setActiveTab('cipher')}
              className={`px-4 py-2 text-xs font-mono rounded-lg transition ${
                activeTab === 'cipher' ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30' : 'text-slate-400 hover:bg-slate-900'
              }`}
            >
              Cifrado/Descifrado
            </button>
            <button
              onClick={() => setActiveTab('cryptanalysis')}
              className={`px-4 py-2 text-xs font-mono rounded-lg transition flex items-center gap-2 ${
                activeTab === 'cryptanalysis' ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30' : 'text-slate-400 hover:bg-slate-900'
              }`}
            >
              <Unlock className="w-3 h-3" /> Criptoanálisis
            </button>
          </div>
        </div>

        {/* Dim selector */}
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs text-slate-400 font-mono">Dimensión (N×N):</span>
          <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 gap-1">
            {[2, 3, 4, 5].map(dim => (
              <button
                key={`dim-${dim}`}
                onClick={() => setMatrixDim(dim as 2 | 3 | 4 | 5)}
                className={`px-3 py-1 text-xs font-mono rounded-lg transition ${
                  matrixDim === dim ? 'bg-slate-800 text-white font-bold border border-slate-700' : 'text-slate-500 hover:bg-slate-900'
                }`}
              >
                {dim}×{dim}
              </button>
            ))}
          </div>
        </div>

        {/* Local Alphabet Selector */}
        <div className="flex flex-col gap-3 mt-2">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-mono">Alfabeto (n={m}):</span>
            <select
              value={localAlphabetType}
              onChange={(e) => setLocalAlphabetType(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1 text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
            >
              <option value="global">Heredar Global ({ALPHABETS[mode].name})</option>
              <option value="es27">Castellano - 27 símbolos con Ñ</option>
              <option value="en26">Latino - 26 símbolos sin Ñ</option>
              <option value="es28">Castellano + espacio - 28 símbolos</option>
              <option value="custom">Arbitrario - definido por el usuario</option>
            </select>
          </div>
          
          {localAlphabetType === 'custom' && (
            <input
              type="text"
              value={customAlphabetStr}
              onChange={(e) => setCustomAlphabetStr(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-500"
              placeholder="Ingresa tus caracteres únicos..."
            />
          )}
        </div>
      </div>

      {/* Alfabeto de Referencia */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 backdrop-blur-md overflow-x-auto">
        <h3 className="text-xs font-mono text-slate-400 mb-2">Valores Numéricos del Alfabeto (Módulo {m}):</h3>
        <div className="flex gap-1 w-max">
          {alphaChars.split('').map((char, i) => (
            <div key={char} className="flex flex-col items-center bg-slate-950 border border-slate-800 rounded-md p-1.5 min-w-[36px] hover:bg-emerald-900/30 transition-colors">
              <span className="text-emerald-400 font-bold text-sm">{char === ' ' ? '␣' : char}</span>
              <span className="text-slate-400 text-[10px] font-mono">{i}</span>
            </div>
          ))}
        </div>
      </div>

      {activeTab === 'cipher' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Matrix Inputs and Determinant Status */}
          <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col gap-5">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Matriz Clave K ({matrixDim}×{matrixDim})
            </h3>
            
            <div className="flex flex-col gap-3 p-4 bg-slate-950/50 border border-slate-800/60 rounded-2xl">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Derivar K desde frase (Ej: PELIGROSO)"
                  value={keyInputStr}
                  onChange={(e) => setKeyInputStr(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={handleKeyFromStr}
                  title="Autocompletar matriz"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white p-1.5 rounded-lg transition"
                >
                  <Wand2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-slate-500">Si K no es invertible, se ajustará automáticamente.</p>
            </div>

            <div className="flex justify-center p-4 bg-slate-950 border border-slate-800 rounded-2xl overflow-x-auto">
              {matrixDim === 2 && (
                <div className="grid grid-cols-2 gap-3 min-w-max">
                  {m2.map((row, r) =>
                    row.map((val, c) => (
                      <input
                        key={`m2-${r}-${c}`}
                        type="number"
                        value={val}
                        onChange={e => updateM2(r, c, parseInt(e.target.value, 10) || 0)}
                        className="w-16 h-14 text-center font-mono text-xl font-bold bg-slate-900 border border-slate-700 text-emerald-300 rounded-xl focus:outline-none focus:border-emerald-500"
                      />
                    ))
                  )}
                </div>
              )}
              {matrixDim === 3 && (
                <div className="grid grid-cols-3 gap-2 min-w-max">
                  {m3.map((row, r) =>
                    row.map((val, c) => (
                      <input
                        key={`m3-${r}-${c}`}
                        type="number"
                        value={val}
                        onChange={e => updateM3(r, c, parseInt(e.target.value, 10) || 0)}
                        className="w-12 h-12 text-center font-mono text-sm font-bold bg-slate-900 border border-slate-700 text-emerald-300 rounded-xl focus:outline-none focus:border-emerald-500"
                      />
                    ))
                  )}
                </div>
              )}
              {matrixDim === 4 && (
                <div className="grid grid-cols-4 gap-2 min-w-max">
                  {m4.map((row, r) =>
                    row.map((val, c) => (
                      <input
                        key={`m4-${r}-${c}`}
                        type="number"
                        value={val}
                        onChange={e => updateM4(r, c, parseInt(e.target.value, 10) || 0)}
                        className="w-10 h-10 text-center font-mono text-xs font-bold bg-slate-900 border border-slate-700 text-emerald-300 rounded-lg focus:outline-none focus:border-emerald-500"
                      />
                    ))
                  )}
                </div>
              )}
              {matrixDim === 5 && (
                <div className="grid grid-cols-5 gap-1.5 min-w-max">
                  {m5.map((row, r) =>
                    row.map((val, c) => (
                      <input
                        key={`m5-${r}-${c}`}
                        type="number"
                        value={val}
                        onChange={e => updateM5(r, c, parseInt(e.target.value, 10) || 0)}
                        className="w-8 h-8 text-center font-mono text-[10px] font-bold bg-slate-900 border border-slate-700 text-emerald-300 rounded-md focus:outline-none focus:border-emerald-500"
                      />
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Validation Status */}
            <div className={`p-4 rounded-xl border flex items-start gap-3 ${
              result.isValid ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'
            }`}>
              {result.isValid ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="text-xs font-mono">
                <span className={`font-bold block ${result.isValid ? 'text-emerald-400' : 'text-red-400'}`}>
                  {result.isValid ? 'Matriz Válida e Invertible' : 'Matriz No Invertible'}
                </span>
                <span className="text-slate-300">
                  det(K) = {result.det} (mod {m}) {result.detInv ? `· inv(${result.det}) = ${result.detInv}` : ''}
                </span>
              </div>
            </div>

            {/* Inverted Matrix Preview */}
            {result.invMatrix && (
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-300 overflow-x-auto">
                <span className="text-emerald-400 font-bold block mb-1">Matriz Inversa K⁻¹ (mod {m}):</span>
                <pre className="text-slate-200">
                  {result.invMatrix.map(row => `[ ${row.join(', ')} ]`).join('\n')}
                </pre>
              </div>
            )}
          </div>

          {/* Right Column: Sandbox and Vector Dot Product Derivations */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col gap-4 shadow-xl">
              {/* Header with Switch */}
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">
                  Mensaje a Procesar
                </span>
                <div className="flex rounded-lg bg-slate-950 p-0.5 border border-slate-800 shadow-inner">
                  <button
                    onClick={() => setDirection('encrypt')}
                    className={`px-3 py-1.5 text-xs font-mono rounded-md transition-all ${direction === 'encrypt' ? 'bg-emerald-500/20 text-emerald-400 font-bold shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    Cifrar
                  </button>
                  <button
                    onClick={() => setDirection('decrypt')}
                    className={`px-3 py-1.5 text-xs font-mono rounded-md transition-all ${direction === 'decrypt' ? 'bg-amber-500/20 text-amber-400 font-bold shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    Descifrar
                  </button>
                </div>
              </div>

              {/* Text Input Area */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <label className="text-[11px] font-mono text-slate-500 uppercase">
                    Texto en {direction === 'encrypt' ? 'Claro (M)' : 'Cifrado (C)'}:
                  </label>
                  {direction === 'encrypt' && (
                    <div className="flex items-center gap-2 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800/60">
                      <span className="text-[10px] text-slate-400 font-mono">Relleno (Pad):</span>
                      <select
                        value={fillerChar}
                        onChange={(e) => setFillerChar(e.target.value)}
                        className="bg-transparent text-[11px] text-emerald-400 font-mono font-bold focus:outline-none cursor-pointer"
                        title="Usado si la longitud no es múltiplo de la dimensión matricial"
                      >
                        {alphaChars.split('').map(c => (
                          <option key={`filler-${c}`} value={c} className="bg-slate-900">{c === ' ' ? 'Espacio (␣)' : c}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                <textarea
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  className="w-full h-24 bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 font-mono focus:outline-none focus:border-emerald-500/50 resize-none shadow-inner placeholder-slate-700 leading-relaxed"
                  placeholder={`Escribe el texto a ${direction === 'encrypt' ? 'cifrar' : 'descifrar'}...`}
                />
              </div>

              {/* Processed Text (Normalized & Padded) */}
              {inputText.trim().length > 0 && result.inputText.length > 0 && (
                <div className="flex flex-col gap-1.5 mt-1 border-l-2 border-slate-700/50 pl-3 ml-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase flex items-center justify-between">
                    <span>Vectores Normalizados ({result.inputText.length} símbolos)</span>
                    <span className="text-slate-600 hidden sm:inline">Sin caracteres inválidos</span>
                  </label>
                  <div className="w-full text-xs font-mono break-words flex flex-wrap gap-x-2 gap-y-1">
                    {formatInBlocks(result.inputText, matrixDim).split(' ').map((block, i) => (
                      <span key={`norm-${i}`} className="bg-slate-950 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800/60 tracking-widest shadow-sm">
                        {block.replace(/ /g, '␣')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Result Area */}
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-[11px] font-mono text-slate-500 uppercase">
                  Resultado {direction === 'encrypt' ? 'Cifrado (C)' : 'Descifrado (M)'}:
                </label>
                <div className={`w-full min-h-[5.5rem] border rounded-xl p-3 text-sm font-mono flex items-start justify-between break-words relative shadow-inner leading-relaxed ${
                  direction === 'encrypt' ? 'bg-emerald-950/10 border-emerald-900/30 text-emerald-300' : 'bg-amber-950/10 border-amber-900/30 text-amber-300'
                }`}>
                  <span className="font-semibold tracking-wide w-full">{result.formattedOutput || '---'}</span>
                  
                  {direction === 'encrypt' && result.inputText.length > inputText.trim().length && result.formattedOutput && (
                    <span className="absolute bottom-2 right-2 text-[10px] font-medium text-emerald-500/70 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-900/50 shadow-sm backdrop-blur-sm" title="Caracteres de relleno añadidos para completar el bloque">
                      + {result.inputText.length - result.inputText.replace(new RegExp(`${fillerChar}+$`), '').length} pad
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Step Multiplication Logs */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex-1">
              <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
                Multiplicación Vectorial Paso a Paso
              </h4>
              <div className="max-h-60 overflow-y-auto space-y-2 font-mono text-xs text-slate-300 pr-1">
                {result.steps.map((st, i) => (
                  <div key={`hill-step-${i}`} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/60 flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-amber-400 font-bold">
                      <span>Bloque #{st.blockIndex + 1}: Letras [{st.inBlock}] = Vector Entrada [{st.inVector.join(', ')}]</span>
                      <ArrowRight className="w-3 h-3 text-slate-600" />
                      <span className="text-emerald-400">Vector Salida [{st.outVector.join(', ')}] = Letras [{st.outBlock}]</span>
                    </div>
                    {st.dotProducts.map((dp, dpi) => (
                      <div key={`dp-${dpi}`} className="text-[11px] text-slate-400 pl-2 border-l border-slate-800">
                        {dp}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* CRYPTANALYSIS TAB */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col gap-5">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Unlock className="w-4 h-4 text-amber-400" />
              Ataque con Texto en Claro
            </h3>
            <p className="text-xs text-slate-400 font-mono leading-relaxed">
              En Hill, K = C · M⁻¹. Ingresa un texto en claro y su correspondiente criptograma de longitud exacta N×N ({matrixDim * matrixDim} caracteres) para encontrar K mediante operaciones matriciales (Gauss-Jordan).
            </p>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-slate-400 font-mono block mb-1">Texto en Claro (M):</label>
                <input
                  type="text"
                  value={cryptoPlain}
                  onChange={e => setCryptoPlain(e.target.value)}
                  placeholder={`Ej: ${'A'.repeat(matrixDim * matrixDim)}`}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-mono block mb-1">Criptograma (C):</label>
                <input
                  type="text"
                  value={cryptoCipher}
                  onChange={e => setCryptoCipher(e.target.value)}
                  placeholder={`Ej: ${'X'.repeat(matrixDim * matrixDim)}`}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {cryptanalysisResult && (
              <div className={`p-4 rounded-xl border flex items-start gap-3 mt-2 ${
                cryptanalysisResult.success ? 'bg-amber-500/10 border-amber-500/30' : 'bg-red-500/10 border-red-500/30'
              }`}>
                {cryptanalysisResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="text-xs font-mono">
                  <span className={`font-bold block mb-1 ${cryptanalysisResult.success ? 'text-amber-400' : 'text-red-400'}`}>
                    {cryptanalysisResult.success ? 'Clave Encontrada Exitosamente' : 'Fallo en Criptoanálisis'}
                  </span>
                  <span className="text-slate-300 break-words leading-relaxed block">
                    {cryptanalysisResult.errorMessage || 'M⁻¹ calculada correctamente. Multiplicación C · M⁻¹ completada.'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex-1">
              <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
                Procedimiento Matricial
              </h4>
              
              {cryptanalysisResult?.success && cryptanalysisResult.M && cryptanalysisResult.mInv && cryptanalysisResult.C && cryptanalysisResult.matrixK ? (
                <div className="flex flex-col gap-6 text-xs font-mono text-slate-300 overflow-x-auto">
                  
                  {/* Matrices P and C */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sky-400 font-bold block mb-2">1. Matriz M (Texto en Claro):</span>
                      <pre className="bg-slate-950 border border-slate-800 p-3 rounded-xl inline-block">
                        {cryptanalysisResult.M.map(row => `[ ${row.map(n => n.toString().padStart(2, ' ')).join(', ')} ]`).join('\n')}
                      </pre>
                    </div>
                    <div>
                      <span className="text-rose-400 font-bold block mb-2">2. Matriz C (Criptograma):</span>
                      <pre className="bg-slate-950 border border-slate-800 p-3 rounded-xl inline-block">
                        {cryptanalysisResult.C.map(row => `[ ${row.map(n => n.toString().padStart(2, ' ')).join(', ')} ]`).join('\n')}
                      </pre>
                    </div>
                  </div>

                  {/* Inverse M */}
                  <div>
                    <span className="text-emerald-400 font-bold block mb-2">3. M⁻¹ (Inversa de M mod {m}):</span>
                    <pre className="bg-slate-950 border border-slate-800 p-3 rounded-xl inline-block">
                      {cryptanalysisResult.mInv.map(row => `[ ${row.map(n => n.toString().padStart(2, ' ')).join(', ')} ]`).join('\n')}
                    </pre>
                  </div>

                  {/* Final Matrix K */}
                  <div>
                    <span className="text-amber-400 font-bold block mb-2">4. Clave K = C · M⁻¹ (mod {m}):</span>
                    <div className="flex items-center gap-3">
                      <pre className="bg-slate-950 border border-amber-500/50 text-amber-300 p-3 rounded-xl inline-block shadow-lg shadow-amber-500/10">
                        {cryptanalysisResult.matrixK.map(row => `[ ${row.map(n => n.toString().padStart(2, ' ')).join(', ')} ]`).join('\n')}
                      </pre>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="flex items-center justify-center h-40 text-slate-500 text-xs font-mono text-center">
                  Introduce datos válidos para ver la matriz resultante.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
