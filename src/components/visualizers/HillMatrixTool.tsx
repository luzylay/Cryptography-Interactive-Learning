import React, { useState, useMemo } from 'react';
import { AlphabetMode, ALPHABETS, formatInBlocks } from '../../crypto/alphabets';
import { processHillNxN } from '../../crypto/ciphers/hill';
import { modInverse } from '../../crypto/mathUtils';
import { Calculator, CheckCircle2, XCircle, ArrowRight, Layers } from 'lucide-react';

interface HillMatrixToolProps {
  mode: AlphabetMode;
}

export const HillMatrixTool: React.FC<HillMatrixToolProps> = ({ mode }) => {
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
  const [inputText, setInputText] = useState<string>('HOLA A TODOS');
  const [direction, setDirection] = useState<'encrypt' | 'decrypt'>('encrypt');

  const m = ALPHABETS[mode].mod;

  const result = useMemo(() => {
    let currentMatrix = m2;
    if (matrixDim === 3) currentMatrix = m3;
    else if (matrixDim === 4) currentMatrix = m4;
    else if (matrixDim === 5) currentMatrix = m5;
    return processHillNxN(inputText, currentMatrix, mode, direction);
  }, [matrixDim, m2, m3, m4, m5, inputText, mode, direction]);

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
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
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
          {[2, 3, 4, 5].map(dim => (
            <button
              key={`dim-${dim}`}
              onClick={() => setMatrixDim(dim as 2 | 3 | 4 | 5)}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition ${
                matrixDim === dim ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30' : 'text-slate-400 hover:bg-slate-900'
              }`}
            >
              {dim}×{dim}
            </button>
          ))}
        </div>
      </div>

      {/* Alfabeto de Referencia */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 backdrop-blur-md overflow-x-auto">
        <h3 className="text-xs font-mono text-slate-400 mb-2">Valores Numéricos del Alfabeto (Módulo {m}):</h3>
        <div className="flex gap-1 w-max">
          {ALPHABETS[mode].chars.split('').map((char, i) => (
            <div key={char} className="flex flex-col items-center bg-slate-950 border border-slate-800 rounded-md p-1.5 min-w-[36px] hover:bg-emerald-900/30 transition-colors">
              <span className="text-emerald-400 font-bold text-sm">{char}</span>
              <span className="text-slate-400 text-[10px] font-mono">{i}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Matrix Inputs and Determinant Status */}
        <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col gap-5">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            Matriz Clave K ({matrixDim}×{matrixDim})
          </h3>

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
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-300">
              <span className="text-emerald-400 font-bold block mb-1">Matriz Inversa K⁻¹ (mod {m}):</span>
              <pre className="text-slate-200">
                {result.invMatrix.map(row => `[ ${row.join(', ')} ]`).join('\n')}
              </pre>
            </div>
          )}
        </div>

        {/* Right Column: Sandbox and Vector Dot Product Derivations */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Texto ({direction === 'encrypt' ? 'Claro' : 'Cifrado'}):</span>
              <div className="flex rounded-lg bg-slate-950 p-0.5 border border-slate-800">
                <button
                  onClick={() => setDirection('encrypt')}
                  className={`px-3 py-1 text-xs font-mono rounded-md ${direction === 'encrypt' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-slate-400'}`}
                >
                  Cifrar
                </button>
                <button
                  onClick={() => setDirection('decrypt')}
                  className={`px-3 py-1 text-xs font-mono rounded-md ${direction === 'decrypt' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-400'}`}
                >
                  Descifrar
                </button>
              </div>
            </div>

            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
            />

            <div>
              <span className="text-xs font-mono text-slate-400 block mb-1">Resultado:</span>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between font-mono text-sm text-emerald-400 font-bold">
                <span>{result.formattedOutput || '---'}</span>
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
    </div>
  );
};
