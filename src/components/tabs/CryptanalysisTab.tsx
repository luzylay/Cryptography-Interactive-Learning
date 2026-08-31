import React, { useState, useMemo } from 'react';
import { AlphabetMode, ALPHABETS } from '../../crypto/alphabets';
import { calculateFrequencies, calculateIndexOfCoincidence, performKasiski, crackCaesar } from '../../crypto/cryptanalysis';
import { BarChart3, Search, Sparkles, Key, Hash, HelpCircle, Activity } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';

interface CryptanalysisTabProps {
  mode: AlphabetMode;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomFrequencyTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const obs = payload.find(p => p.dataKey === 'percentage')?.value || 0;
    const exp = payload.find(p => p.dataKey === 'expectedPercentage')?.value || 0;
    const count = payload[0]?.payload?.count || 0;

    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs font-mono text-slate-100">
        <p className="font-bold text-cyan-400 mb-1">Carácter: '{label}'</p>
        <p className="text-slate-300">
          Observado: <span className="font-bold text-cyan-300">{Number(obs).toFixed(2)}%</span> ({count} apariciones)
        </p>
        <p className="text-slate-400">
          Esperado: <span className="font-bold text-slate-300">{Number(exp).toFixed(2)}%</span>
        </p>
        <p className="text-[10px] text-slate-500 mt-1">
          Diferencia: {Math.abs(Number(obs) - Number(exp)).toFixed(2)}%
        </p>
      </div>
    );
  }
  return null;
};

const CustomKasiskiTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const score = payload[0]?.value || 0;
    return (
      <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-xl shadow-xl text-xs font-mono text-slate-100">
        <p className="font-bold text-sky-400">Longitud de Clave: m = {label}</p>
        <p className="text-slate-300">Coincidencias / Factores: <span className="font-bold text-amber-300">{score}</span></p>
      </div>
    );
  }
  return null;
};

export const CryptanalysisTab: React.FC<CryptanalysisTabProps> = ({ mode }) => {
  const [ciphertext, setCiphertext] = useState<string>(
    'VAEOSMPEVHARVXFOVSVABXOIVXMOLXHEPXBPAOHALHRVFOMPMPYPMOEP'
  );

  const freqStats = useMemo(() => calculateFrequencies(ciphertext, mode), [ciphertext, mode]);
  const ic = useMemo(() => calculateIndexOfCoincidence(ciphertext, mode), [ciphertext, mode]);
  const kasiski = useMemo(() => performKasiski(ciphertext, mode), [ciphertext, mode]);
  const caesarCandidates = useMemo(() => crackCaesar(ciphertext, mode), [ciphertext, mode]);

  const kasiskiChartData = useMemo(() => {
    // Collect all potential key lengths from 2 to 12
    const scoreMap: Record<number, number> = {};
    for (let k = 2; k <= 12; k++) scoreMap[k] = 0;
    for (const item of kasiski.suggestedKeyLengths) {
      if (item.length <= 12) scoreMap[item.length] = item.score;
    }
    return Object.entries(scoreMap).map(([len, score]) => ({
      length: `m=${len}`,
      score,
      rawLen: parseInt(len, 10),
    }));
  }, [kasiski]);

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

      {/* Recharts Interactive Frequency Histogram */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            Distribución de Frecuencias vs Perfil Teórico (Recharts Visualizer)
          </h3>
          <div className="text-xs font-mono text-slate-400">
            Total Caracteres: <span className="font-bold text-slate-200">{ciphertext.length}</span>
          </div>
        </div>

        {/* Chart Container */}
        <div className="w-full h-72 bg-slate-950/80 border border-slate-800/80 rounded-xl pt-4 pr-2 pb-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={freqStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="char"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                interval={0}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
                unit="%"
              />
              <Tooltip content={<CustomFrequencyTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: 10, fontSize: 12, fontFamily: 'monospace' }}
                formatter={(value) => (
                  <span className="text-slate-300">
                    {value === 'percentage'
                      ? `Observado en Criptograma (${mode})`
                      : `Teórico Esperado (${mode === 'en26' ? 'Inglés' : 'Castellano'})`}
                  </span>
                )}
              />
              <Bar
                dataKey="percentage"
                name="percentage"
                fill="#22d3ee"
                radius={[4, 4, 0, 0]}
                maxBarSize={24}
              />
              <Bar
                dataKey="expectedPercentage"
                name="expectedPercentage"
                fill="#475569"
                radius={[4, 4, 0, 0]}
                maxBarSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
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

          <div className="max-h-64 overflow-y-auto space-y-1.5 font-mono text-xs pr-1">
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
                <span className="text-[10px] text-slate-500">Ajuste: {cand.score.toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Kasiski Factorization Chart & Substrings */}
        <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Hash className="w-4 h-4 text-sky-400" />
            Test de Kasiski (Estimación Visual de Longitud de Clave)
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            Histograma de frecuencia de factores comunes en las distancias entre patrones repetidos.
          </p>

          {/* Recharts Kasiski Score Chart */}
          <div className="w-full h-36 bg-slate-950/80 border border-slate-800 rounded-xl pt-2 pr-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={kasiskiChartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="length"
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                />
                <YAxis
                  stroke="#64748b"
                  tick={{ fill: '#64748b', fontSize: 9, fontFamily: 'monospace' }}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomKasiskiTooltip />} />
                <Bar dataKey="score" fill="#38bdf8" radius={[4, 4, 0, 0]} maxBarSize={28}>
                  {kasiskiChartData.map((entry, index) => (
                    <Cell
                      key={`k-cell-${index}`}
                      fill={entry.score === Math.max(...kasiskiChartData.map(d => d.score)) && entry.score > 0 ? '#38bdf8' : '#334155'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Repeated Patterns List */}
          {kasiski.repetitions.length > 0 ? (
            <div className="max-h-28 overflow-y-auto space-y-1.5 font-mono text-xs pr-1 mt-1">
              {kasiski.repetitions.slice(0, 4).map((rep, ri) => (
                <div key={`rep-${ri}`} className="p-1.5 px-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
                  <span className="font-bold text-amber-400">"{rep.pattern}"</span>
                  <span className="text-slate-400 text-[11px]">Distancias: {rep.distances.join(', ')}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-2 text-center text-xs font-mono text-slate-500">
              No se encontraron repeticiones de longitud ≥ 3.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
