import React, { useState, useMemo } from 'react';
import { AlphabetMode, ALPHABETS, normalizeText } from '../../crypto/alphabets';
import { calculateFrequencies, calculateIndexOfCoincidence, performKasiski, crackCaesar } from '../../crypto/cryptanalysis';
import { BarChart3, Search, Sparkles, Key, Hash, HelpCircle } from 'lucide-react';

interface CryptanalysisTabProps {
  mode: AlphabetMode;
}

export const CryptanalysisTab: React.FC<CryptanalysisTabProps> = ({ mode }) => {
  const [ciphertext, setCiphertext] = useState<string>(
    'VAEOSMPEVHARVXFOVSVABXOIVXMOLXHEPXBPAOHALHRVFOMPMPYPMOEP'
  );

  const freqStats = useMemo(() => calculateFrequencies(ciphertext, mode), [ciphertext, mode]);
  const ic = useMemo(() => calculateIndexOfCoincidence(ciphertext, mode), [ciphertext, mode]);
  const kasiski = useMemo(() => performKasiski(ciphertext, mode), [ciphertext, mode]);
  const caesarCandidates = useMemo(() => crackCaesar(ciphertext, mode), [ciphertext, mode]);

  const maxFreq = useMemo(() => Math.max(...freqStats.map(f => Math.max(f.percentage, f.expectedPercentage)), 1), [freqStats]);

  return (
    <div className="flex flex-col gap-6 p-2 lg:p-4 w-full max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">Laboratorio de Criptoanálisis y Estadísticas</h2>
            <p className="text-xs text-slate-400 font-mono">
              Frecuencias, IC y Kasiski · <span className="text-cyan-400 font-mono text-[10px]">Fuente APA 7: Kasiski (1863); Friedman (1922); Ramió Aguirre (1999, pp. 38–42)</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
            <span className="text-slate-500 mr-1.5">Índice IC:</span>
            <span className="font-bold text-cyan-300">{ic.toFixed(4)}</span>
            <span className="text-[10px] text-slate-500 ml-1.5">
              ({ic > 0.06 ? 'Monoalfabético' : 'Polialfabético / Aleatorio'})
            </span>
          </div>
        </div>
      </div>

      {/* Ciphertext Input Box */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
        <label className="block text-xs font-mono text-slate-400 mb-1.5">
          Ingresa el criptograma a analizar:
        </label>
        <textarea
          value={ciphertext}
          onChange={e => setCiphertext(e.target.value)}
          rows={2}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-sm text-slate-100 focus:outline-none focus:border-cyan-500 transition"
          placeholder="Pega aquí el criptograma..."
        />
      </div>

      {/* Frequency Histogram */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            Distribución de Frecuencias vs Idioma de Referencia
          </h3>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-cyan-400 inline-block" />
              <span className="text-slate-300">Criptograma ({ciphertext.length} chars)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-slate-600 inline-block" />
              <span className="text-slate-400">Teórico ({mode === 'en26' ? 'Inglés' : 'Castellano'})</span>
            </div>
          </div>
        </div>

        {/* Histogram Bars */}
        <div className="overflow-x-auto pb-2">
          <div className="flex items-end gap-1.5 min-w-[650px] h-48 pt-4 px-2 bg-slate-950/80 border border-slate-800 rounded-xl">
            {freqStats.map(stat => {
              const obsHeight = (stat.percentage / maxFreq) * 100;
              const expHeight = (stat.expectedPercentage / maxFreq) * 100;

              return (
                <div key={`hist-${stat.char}`} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-200 px-2 py-1 rounded shadow-lg pointer-events-none z-10 whitespace-nowrap">
                    {stat.char}: {stat.percentage.toFixed(1)}% (obs: {stat.count}) · Exp: {stat.expectedPercentage}%
                  </div>

                  <div className="w-full flex items-end justify-center gap-0.5 h-36">
                    {/* Observed Bar */}
                    <div
                      style={{ height: `${Math.max(obsHeight, stat.count > 0 ? 3 : 0)}%` }}
                      className="w-2.5 rounded-t-sm bg-cyan-400 transition-all duration-300"
                    />
                    {/* Expected Reference Bar */}
                    <div
                      style={{ height: `${Math.max(expHeight, 2)}%` }}
                      className="w-1.5 rounded-t-sm bg-slate-700 transition-all duration-300"
                    />
                  </div>

                  <span className="text-[10px] font-mono font-bold text-slate-300 mt-2">{stat.char}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Automated Caesar Cracker & Kasiski Test */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Caesar Brute Force */}
        <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" />
            Criptoanálisis de César (Fuerza Bruta Clasificada por Probabilidad)
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            Evalúa todas las rotaciones posibles y las ordena según el ajuste estadístico con el idioma.
          </p>

          <div className="max-h-60 overflow-y-auto space-y-1.5 font-mono text-xs pr-1">
            {caesarCandidates.slice(0, 8).map((cand, idx) => (
              <div
                key={`crack-${cand.shift}`}
                className={`p-2.5 rounded-xl border flex items-center justify-between ${
                  idx === 0
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-sm'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-400">
                    k = {cand.shift}
                  </span>
                  <span className="truncate max-w-[240px] text-slate-200">{cand.decryptedSample}</span>
                </div>
                <span className="text-[10px] text-slate-500">Puntaje: {cand.score.toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Kasiski Repeated Substrings */}
        <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Hash className="w-4 h-4 text-sky-400" />
            Test de Kasiski (Estimación de Longitud de Clave Polialfabética)
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            Busca repeticiones exactas en el texto cifrado y factoriza sus distancias.
          </p>

          {kasiski.suggestedKeyLengths.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono text-slate-400">Longitudes de clave probables (m):</span>
                {kasiski.suggestedKeyLengths.slice(0, 4).map(s => (
                  <span
                    key={`k-len-${s.length}`}
                    className="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 font-mono text-xs font-bold border border-sky-500/40"
                  >
                    m = {s.length} ({s.score} coincidencias)
                  </span>
                ))}
              </div>

              <div className="max-h-40 overflow-y-auto space-y-1.5 font-mono text-xs pr-1">
                {kasiski.repetitions.slice(0, 5).map((rep, ri) => (
                  <div key={`rep-${ri}`} className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                    <span className="font-bold text-amber-400">"{rep.pattern}"</span>
                    <span className="text-slate-400">Distancias: {rep.distances.join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-xs font-mono text-slate-500">
              No se encontraron repeticiones de longitud ≥ 3. Criptograma muy corto o alta difusión.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
