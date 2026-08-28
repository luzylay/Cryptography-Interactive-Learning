import React, { useState, useMemo } from 'react';
import { AlphabetMode, ALPHABETS, formatInBlocks } from '../../crypto/alphabets';
import { processHill2x2, processHill3x3 } from '../../crypto/ciphers/hill';
import { det2x2, inv2x2, isHillMatrixValid2x2, modInverse } from '../../crypto/mathUtils';
import { Calculator, CheckCircle2, XCircle, ArrowRight, Layers } from 'lucide-react';

interface HillMatrixToolProps {
  mode: AlphabetMode;
}

export const HillMatrixTool: React.FC<HillMatrixToolProps> = ({ mode }) => {
  const [matrixDim, setMatrixDim] = useState<2 | 3>(2);
  const [m2, setM2] = useState<number[][]>([
    [2, 3],
    [1, 5],
  ]);
  const [m3, setM3] = useState<number[][]>([
    [6, 24, 1],
    [13, 16, 10],
    [20, 17, 15],
  ]);
  const [inputText, setInputText] = useState<string>('HOLA A TODOS');
  const [direction, setDirection] = useState<'encrypt' | 'decrypt'>('encrypt');

  const m = ALPHABETS[mode].mod;

  const result = useMemo(() => {
    if (matrixDim === 2) {
      return processHill2x2(inputText, m2, mode, direction);
    } else {
      return processHill3x3(inputText, m3, mode, direction);
    }
  }, [matrixDim, m2, m3, inputText, mode, direction]);

  const updateM2 = (r: number, c: number, val: number) => {
    const next = m2.map((row, ri) => row.map((col, ci) => (ri === r && ci === c ? val : col)));
    setM2(next);
  };

  const updateM3 = (r: number, c: number, val: number) => {
    const next = m3.map((row, ri) => row.map((col, ci) => (ri === r && ci === c ? val : col)));
    setM3(next);
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
            <p className="text-xs text-slate-400 font-mono">C = K · M mod {m} · Criptosistema Poligráfico</p>
          </div>
        </div>

        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
          <button
            onClick={() => setMatrixDim(2)}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg transition ${
              matrixDim === 2 ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30' : 'text-slate-400'
            }`}
          >
            Matriz 2×2
          </button>
          <button
            onClick={() => setMatrixDim(3)}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg transition ${
              matrixDim === 3 ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30' : 'text-slate-400'
            }`}
          >
            Matriz 3×3
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Matrix Inputs and Determinant Status */}
        <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col gap-5">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            Matriz Clave K ({matrixDim}×{matrixDim})
          </h3>

          <div className="flex justify-center p-4 bg-slate-950 border border-slate-800 rounded-2xl">
            {matrixDim === 2 ? (
              <div className="grid grid-cols-2 gap-3">
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
            ) : (
              <div className="grid grid-cols-3 gap-2">
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
                    <span>Bloque #{st.blockIndex + 1}: [{st.inBlock}] = [{st.inVector.join(', ')}]</span>
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                    <span className="text-emerald-400">[{st.outBlock}]</span>
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
