import React, { useState, useMemo } from 'react';
import { AlphabetMode, ALPHABETS, formatInBlocks } from '../../crypto/alphabets';
import { processAffine, generateMixedAlphabet } from '../../crypto/ciphers/caesarAffine';
import { getCoprimes, gcd, modInverse } from '../../crypto/mathUtils';
import { Sliders, ShieldCheck, AlertCircle, Key, RefreshCw } from 'lucide-react';

interface CaesarWheelProps {
  mode: AlphabetMode;
}

export const CaesarWheel: React.FC<CaesarWheelProps> = ({ mode }) => {
  const [subType, setSubType] = useState<'caesar' | 'affine' | 'mixed'>('caesar');
  const [shift, setShift] = useState<number>(3);
  const [affineA, setAffineA] = useState<number>(5);
  const [affineB, setAffineB] = useState<number>(8);
  const [keyword, setKeyword] = useState<string>('ESTOY ABURRIDO');
  const [keyStartPos, setKeyStartPos] = useState<number>(3);
  const [inputText, setInputText] = useState<string>('VINI VIDI VINCI');
  const [direction, setDirection] = useState<'encrypt' | 'decrypt'>('encrypt');

  const m = ALPHABETS[mode].mod;
  const alpha = ALPHABETS[mode].chars;
  const coprimes = useMemo(() => getCoprimes(m), [m]);

  // Handle Affine calculation
  const affineResult = useMemo(() => {
    if (subType === 'caesar') {
      return processAffine(inputText, { a: 1, b: direction === 'encrypt' ? shift : -shift, mode }, 'encrypt');
    } else if (subType === 'affine') {
      return processAffine(inputText, { a: affineA, b: affineB, mode }, direction);
    } else {
      // Mixed alphabet
      const mixed = generateMixedAlphabet(keyword, keyStartPos, mode);
      const norm = inputText.toUpperCase().replace(/[^A-ZÑ]/g, '');
      let outStr = '';
      if (direction === 'encrypt') {
        for (const c of norm) {
          const idx = alpha.indexOf(c);
          if (idx !== -1) outStr += mixed[idx];
        }
      } else {
        for (const c of norm) {
          const idx = mixed.indexOf(c);
          if (idx !== -1) outStr += alpha[idx];
        }
      }
      return {
        isValid: true,
        errorMessage: null,
        inputText: norm,
        outputText: outStr,
        formattedOutput: formatInBlocks(outStr),
        steps: [],
        a: 1,
        b: 0,
        aInv: 1,
        m,
        alphabet: mixed,
      };
    }
  }, [subType, shift, affineA, affineB, keyword, keyStartPos, inputText, direction, mode, m, alpha]);

  return (
    <div className="flex flex-col gap-6 p-2 lg:p-4 w-full max-w-7xl mx-auto">
      {/* Header Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">Cifrador César y Variantes Afines</h2>
            <p className="text-xs text-slate-400 font-mono">Sustitución Monoalfabética · Módulo {m}</p>
          </div>
        </div>

        {/* Variant Tabs */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
          <button
            onClick={() => setSubType('caesar')}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg transition ${
              subType === 'caesar' ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            César Clásico (k)
          </button>
          <button
            onClick={() => setSubType('affine')}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg transition ${
              subType === 'affine' ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sustitución Afín (a·x + b)
          </button>
          <button
            onClick={() => setSubType('mixed')}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg transition ${
              subType === 'mixed' ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            César con Clave (Mixto)
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Parameters & Interactive Alphabet Ribbon */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Parameter Box */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
            <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              Parámetros de Cifra
            </h3>

            {subType === 'caesar' && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">Desplazamiento k:</span>
                  <span className="text-sm font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/30">
                    k = {shift} (mod {m})
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={m - 1}
                  value={shift}
                  onChange={e => setShift(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-600">
                  <span>0 (Sin cambio)</span>
                  <span>{Math.floor(m / 2)}</span>
                  <span>{m - 1}</span>
                </div>
              </div>
            )}

            {subType === 'affine' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Multiplicador 'a' (Coprimo con {m}):
                  </label>
                  <select
                    value={affineA}
                    onChange={e => setAffineA(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-amber-300 focus:outline-none focus:border-amber-500"
                  >
                    {coprimes.map(c => (
                      <option key={`coprime-${c}`} value={c}>
                        a = {c} (inverso a⁻¹ = {modInverse(c, m)})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Desplazamiento 'b':
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={m - 1}
                    value={affineB}
                    onChange={e => setAffineB(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-amber-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            {subType === 'mixed' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Palabra Clave:</label>
                  <input
                    type="text"
                    value={keyword}
                    onChange={e => setKeyword(e.target.value.toUpperCase())}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-amber-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Posición de inicio (p₀):</label>
                  <input
                    type="number"
                    min="0"
                    max={m - 1}
                    value={keyStartPos}
                    onChange={e => setKeyStartPos(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-amber-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Dual Alphabet Alignment Chart */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
            <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center justify-between">
              <span>Tabla de Correspondencia de Alfabetos</span>
              <span className="text-[11px] font-mono text-amber-400 font-normal">
                {subType === 'caesar'
                  ? `Ci = (Mi + ${shift}) mod ${m}`
                  : subType === 'affine'
                  ? `Ci = (${affineA}·Mi + ${affineB}) mod ${m}`
                  : `Clave: "${keyword}", p₀=${keyStartPos}`}
              </span>
            </h3>

            <div className="overflow-x-auto pb-2">
              <div className="flex flex-col gap-1 min-w-[500px]">
                {/* Cleartext Alphabet */}
                <div className="flex items-center gap-1">
                  <span className="w-14 text-[10px] font-mono text-slate-500 uppercase">Claro:</span>
                  {alpha.split('').map((c, i) => (
                    <div
                      key={`alpha-claro-${c}`}
                      className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 flex flex-col items-center justify-center font-mono text-xs text-slate-200 font-semibold flex-shrink-0"
                    >
                      <span>{c}</span>
                      <span className="text-[7px] text-slate-600 -mt-1">{i}</span>
                    </div>
                  ))}
                </div>

                {/* Ciphertext Alphabet */}
                <div className="flex items-center gap-1 mt-1">
                  <span className="w-14 text-[10px] font-mono text-amber-500 uppercase">Cifrado:</span>
                  {alpha.split('').map((c, i) => {
                    let mappedChar = '';
                    if (subType === 'caesar') {
                      mappedChar = alpha[(i + shift) % m];
                    } else if (subType === 'affine') {
                      mappedChar = alpha[(affineA * i + affineB) % m];
                    } else {
                      const mixed = generateMixedAlphabet(keyword, keyStartPos, mode);
                      mappedChar = mixed[i];
                    }

                    return (
                      <div
                        key={`alpha-cifrado-${i}`}
                        className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex flex-col items-center justify-center font-mono text-xs text-amber-300 font-bold flex-shrink-0"
                      >
                        <span>{mappedChar}</span>
                        <span className="text-[7px] text-amber-600/80 -mt-1">{alpha.indexOf(mappedChar)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Sandbox & Derivations */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-slate-200">Prueba Interactiva</h3>
              <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
                <button
                  onClick={() => setDirection('encrypt')}
                  className={`px-3 py-1 text-xs font-mono rounded-md transition ${
                    direction === 'encrypt' ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30' : 'text-slate-400'
                  }`}
                >
                  Cifrar
                </button>
                <button
                  onClick={() => setDirection('decrypt')}
                  className={`px-3 py-1 text-xs font-mono rounded-md transition ${
                    direction === 'decrypt' ? 'bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30' : 'text-slate-400'
                  }`}
                >
                  Descifrar
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                {direction === 'encrypt' ? 'Mensaje en Claro:' : 'Criptograma:'}
              </label>
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Resultado:</label>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 min-h-[44px] flex items-center justify-between">
                <span className="font-mono text-sm text-emerald-400 font-semibold tracking-wider break-all">
                  {affineResult.formattedOutput || '---'}
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                  {affineResult.outputText.length} letras
                </span>
              </div>
            </div>

            {/* Formula steps */}
            {affineResult.steps.length > 0 && (
              <div className="mt-2 pt-3 border-t border-slate-800">
                <span className="text-xs font-mono text-slate-400 block mb-2">Desarrollo formal letra a letra:</span>
                <div className="max-h-48 overflow-y-auto space-y-1 font-mono text-[11px] text-slate-300 pr-1">
                  {affineResult.steps.map((st, i) => (
                    <div key={`step-${i}`} className="p-1.5 rounded bg-slate-950/70 border border-slate-800/60">
                      {st.formulaCalculation}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
