import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Zap,
  Clock,
  Layers,
  FileCheck2,
  KeyRound,
  Lock,
  Cpu,
  Server,
  Info,
  Sliders,
  Award,
  ShieldAlert,
  XCircle,
  Terminal,
} from 'lucide-react';
import { SCENARIOS, KLEOPATRA_VARIABLES, DecisionScenario } from '../../data/decisionMatrix.data';
import { Badge, GlassCard, CopyButton } from '../common';
import { useClipboard } from '../../hooks';

const ICON_MAP = {
  Award,
  Server,
  ShieldAlert,
  Zap,
  Cpu,
  Terminal,
};

export const DecisionMatrixTab: React.FC = () => {
  const [subTab, setSubTab] = useState<'assistant' | 'benchmarks' | 'tables' | 'kleopatra-guide'>('assistant');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('academic');

  const { copy, isCopied } = useClipboard();

  const activeScenario: DecisionScenario =
    SCENARIOS.find(s => s.id === selectedScenarioId) || SCENARIOS[0];

  const handleCopyParams = (scenario: DecisionScenario) => {
    const text = `ESCENARIO: ${scenario.title}\n` +
      `Algoritmo: ${scenario.recommendation.algorithm}\n` +
      `Subclave: ${scenario.recommendation.subKey}\n` +
      `Seguridad: ${scenario.recommendation.securityBits} (${scenario.recommendation.nistStatus})\n` +
      `Vigencia: ${scenario.recommendation.validity} (${scenario.recommendation.validityReason})\n` +
      `Frase de paso: ${scenario.recommendation.passphrase.length} [KDF: ${scenario.recommendation.passphrase.kdf}]\n` +
      `Resguardo: ${scenario.recommendation.passphrase.hardware}\n` +
      `Cifrado Híbrido: ${scenario.recommendation.symmetricCipher} | Hash: ${scenario.recommendation.hashFunction}\n` +
      `Justificación: ${scenario.recommendation.justification}\n` +
      `Consejo: ${scenario.recommendation.practicalAdvice}`;
    copy(text, `scenario-${scenario.id}`);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/40 border border-slate-800 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 p-0.5 shadow-lg shadow-amber-500/20 flex-shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
                <Compass className="w-6 h-6" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-slate-100 tracking-tight">
                  Matriz de Decisión Criptográfica &amp; Kleopatra
                </h2>
                <Badge variant="amber" size="sm">
                  NIST SP 800-57 · RFC 9580 · FIPS 186-5
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
                Guía técnica de ingeniería criptográfica para la selección óptima de algoritmos, longitud de claves,
                tiempos operativos, vigencia y variables críticas en la suite Kleopatra (Gpg4win).
              </p>
            </div>
          </div>

          {/* Quick Pillar Highlights */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap bg-slate-950/60 p-2 rounded-xl border border-slate-800 text-[11px] font-mono">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Integridad</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 text-sky-300">
              <KeyRound className="w-3.5 h-3.5 text-sky-400" />
              <span>Autenticidad</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 text-amber-300">
              <FileCheck2 className="w-3.5 h-3.5 text-amber-400" />
              <span>No Repudio</span>
            </div>
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto mt-5 pt-3 border-t border-slate-800/80 scrollbar-none">
          {[
            { id: 'assistant', label: '1. Asistente por Escenarios (Tabla I1)', icon: Sliders },
            { id: 'benchmarks', label: '2. Tiempos & Rendimiento (Tabla H1)', icon: Zap },
            { id: 'tables', label: '3. Matrices Oficiales NIST & Comparativas', icon: Layers },
            { id: 'kleopatra-guide', label: '4. Mapeo Kleopatra & 8 Variables Críticas', icon: Lock },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono text-xs whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold shadow-md'
                    : 'bg-slate-950/40 border-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── SUBTAB 1: Asistente por Escenarios (Tabla I1) ── */}
      {subTab === 'assistant' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Scenario Selector */}
          <div className="lg:col-span-4 flex flex-col gap-2.5">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Seleccione Escenario Operativo</span>
              <span className="text-[10px] text-amber-400 font-bold">{SCENARIOS.length} Perfiles</span>
            </span>

            {SCENARIOS.map(scenario => {
              const Icon = ICON_MAP[scenario.iconName] || Award;
              const isSelected = scenario.id === activeScenario.id;

              return (
                <div
                  key={scenario.id}
                  onClick={() => setSelectedScenarioId(scenario.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-2 ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/50 shadow-md shadow-amber-500/5 ring-1 ring-amber-500/30'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-xs font-bold ${isSelected ? 'text-amber-200' : 'text-slate-200'}`}>
                        {scenario.title}
                      </span>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${scenario.badgeColor}`}>
                      {scenario.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                    {scenario.shortDesc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Scenario Output Card */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <GlassCard className="flex flex-col gap-5 border-amber-500/30">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${activeScenario.badgeColor}`}>
                      {activeScenario.badge}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Configuración Kleopatra Recomendada
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 mt-1">{activeScenario.title}</h3>
                </div>
                <CopyButton
                  text=""
                  isCopied={isCopied(`scenario-${activeScenario.id}`)}
                  onCopy={() => handleCopyParams(activeScenario)}
                  label="Copiar Parámetros"
                />
              </div>

              {/* Algorithm Recommendation Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-1.5">
                  <span className="text-[11px] font-mono text-amber-400 font-semibold">
                    Algoritmo y Subclave Kleopatra:
                  </span>
                  <div className="text-xs font-mono text-slate-200 font-bold space-y-1">
                    <p className="text-amber-200">{activeScenario.recommendation.algorithm}</p>
                    <p className="text-sky-300 font-normal">{activeScenario.recommendation.subKey}</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 mt-auto pt-1">
                    {activeScenario.recommendation.nistStatus}
                  </span>
                </div>

                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-1.5">
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                    Vigencia y Política de Rotación:
                  </span>
                  <p className="text-xs font-mono text-emerald-200 font-bold">
                    {activeScenario.recommendation.validity}
                  </p>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {activeScenario.recommendation.validityReason}
                  </p>
                </div>
              </div>

              {/* Passphrase Policy */}
              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-2">
                <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  Política de Frase de Contraseña (Passphrase) y Resguardo:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Longitud Requerida:</span>
                    <span className="text-emerald-300 font-semibold">{activeScenario.recommendation.passphrase.length}</span>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Derivación KDF:</span>
                    <span className="text-sky-300 font-semibold">{activeScenario.recommendation.passphrase.kdf}</span>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Hardware / Resguardo:</span>
                    <span className="text-amber-300 font-semibold">{activeScenario.recommendation.passphrase.hardware}</span>
                  </div>
                </div>
              </div>

              {/* Performance Metrics & Justification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="bg-slate-950/70 border border-slate-800/80 p-3.5 rounded-xl flex flex-col gap-2">
                  <span className="text-[11px] font-mono text-purple-400 flex items-center gap-1.5 font-bold">
                    <Zap className="w-3.5 h-3.5" />
                    Métricas Operativas Estimadas:
                  </span>
                  <ul className="text-xs font-mono space-y-1.5 text-slate-300">
                    <li className="flex justify-between border-b border-slate-800/60 pb-1">
                      <span className="text-slate-400">Tiempo de Creación:</span>
                      <span className="text-amber-300 font-bold">{activeScenario.recommendation.tradeoffs.generationTime}</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-800/60 pb-1">
                      <span className="text-slate-400">Tasa de Firma:</span>
                      <span className="text-sky-300 font-bold">{activeScenario.recommendation.tradeoffs.signSpeed}</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-800/60 pb-1">
                      <span className="text-slate-400">Tamaño Clave Pública:</span>
                      <span className="text-purple-300 font-bold">{activeScenario.recommendation.tradeoffs.keySize}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-slate-400">Compatibilidad:</span>
                      <span className="text-emerald-300 font-bold">{activeScenario.recommendation.tradeoffs.compatibility}</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-950/70 border border-slate-800/80 p-3.5 rounded-xl flex flex-col gap-2">
                  <span className="text-[11px] font-mono text-amber-400 flex items-center gap-1.5 font-bold">
                    <Info className="w-3.5 h-3.5" />
                    Fundamentación Técnica &amp; Consejo Práctico:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">{activeScenario.recommendation.justification}</p>
                  <div className="mt-auto bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg text-[11px] text-amber-200 flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Atención: </span>
                      {activeScenario.recommendation.practicalAdvice}
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* ── SUBTAB 2: Comparador de Rendimiento y Tiempos (Tabla H1) ── */}
      {subTab === 'benchmarks' && (
        <div className="flex flex-col gap-6">
          <GlassCard className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-slate-100">
                Variables Operativas Críticas: ¿Por Qué Importan el Tiempo y el Rendimiento?
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              La elección del algoritmo no es solo una cuestión de &laquo;más bits = más seguro&raquo;. En el uso real de
              Kleopatra y OpenPGP, la arquitectura algorítmica condiciona variables de experiencia de usuario,
              eficiencia de red y ancho de banda computacional:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono mt-1">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-amber-400 font-bold block mb-1">1. Generación de Claves</span>
                <span className="text-slate-400 text-[11px]">
                  RSA-4096 busca dos primos de 2048 bits (8-30s). Ed25519 genera la clave de forma instantánea (&lt;0.1s).
                </span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-sky-400 font-bold block mb-1">2. Cifrado de Archivos</span>
                <span className="text-slate-400 text-[11px]">
                  Velocidad idéntica en todos: OpenPGP usa un esquema híbrido donde los datos se cifran con AES-256 (acelerado por AES-NI).
                </span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-purple-400 font-bold block mb-1">3. Firma Digital Masiva</span>
                <span className="text-slate-400 text-[11px]">
                  Ed25519 alcanza ~13,000 firmas/s vs ~30 firmas/s en RSA-4096. Determinante para servidores de facturación o contratos.
                </span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-emerald-400 font-bold block mb-1">4. Distribución de Claves</span>
                <span className="text-slate-400 text-[11px]">
                  Clave RSA-4096 exportada pesa ~1.2 KB; Ed25519 pesa solo ~68 bytes (óptimo para microcontroladores y QR).
                </span>
              </div>
            </div>
          </GlassCard>

          {/* Table H1 Benchmark */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <span>Tabla H1. Rendimiento y Tiempos Operativos Estimados en Kleopatra</span>
                </h4>
                <p className="text-[11px] text-slate-400 font-mono">
                  Valores promedio en procesadores estándar de escritorio (x64 / ARM64)
                </p>
              </div>
              <Badge variant="amber" size="sm">
                Pruebas de Laboratorio Académico
              </Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Algoritmo en Kleopatra</th>
                    <th className="p-3.5">Tiempo de Generación</th>
                    <th className="p-3.5">Velocidad de Firma</th>
                    <th className="p-3.5">Velocidad de Cifrado</th>
                    <th className="p-3.5">Tamaño Clave Exportada</th>
                    <th className="p-3.5">Tamaño Firma Digital</th>
                    <th className="p-3.5">Compatibilidad Destinatarios</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr className="hover:bg-slate-800/30 transition">
                    <td className="p-3.5 font-bold text-slate-200">
                      RSA 2048 bits
                      <span className="block text-[10px] text-amber-400/80 font-normal">Mínimo obsoleto (&gt;2030)</span>
                    </td>
                    <td className="p-3.5 text-emerald-400 font-semibold">1 - 3 seg</td>
                    <td className="p-3.5 text-sky-300">~200 firmas/s</td>
                    <td className="p-3.5 text-slate-300">Rápido (AES híbrido)</td>
                    <td className="p-3.5 text-purple-300">~600 bytes</td>
                    <td className="p-3.5 text-slate-300">256 bytes</td>
                    <td className="p-3.5">
                      <Badge variant="emerald" size="sm">Universal (100%)</Badge>
                    </td>
                  </tr>

                  <tr className="bg-amber-500/5 hover:bg-amber-500/10 transition border-l-4 border-l-amber-500">
                    <td className="p-3.5 font-bold text-amber-300">
                      RSA 3072 bits
                      <span className="block text-[10px] text-emerald-400 font-normal">Recomendado Entorno Académico</span>
                    </td>
                    <td className="p-3.5 text-amber-300 font-semibold">3 - 8 seg</td>
                    <td className="p-3.5 text-sky-300">~80 firmas/s</td>
                    <td className="p-3.5 text-slate-300">Rápido (AES híbrido)</td>
                    <td className="p-3.5 text-purple-300">~900 bytes</td>
                    <td className="p-3.5 text-slate-300">384 bytes</td>
                    <td className="p-3.5">
                      <Badge variant="emerald" size="sm">Universal (100%)</Badge>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-800/30 transition">
                    <td className="p-3.5 font-bold text-slate-200">
                      RSA 4096 bits
                      <span className="block text-[10px] text-purple-400 font-normal">Grado Secreto Comercial</span>
                    </td>
                    <td className="p-3.5 text-rose-400 font-semibold">8 - 30 seg</td>
                    <td className="p-3.5 text-sky-300">~30 firmas/s</td>
                    <td className="p-3.5 text-slate-300">Rápido (AES híbrido)</td>
                    <td className="p-3.5 text-purple-300">~1200 bytes</td>
                    <td className="p-3.5 text-slate-300">512 bytes</td>
                    <td className="p-3.5">
                      <Badge variant="emerald" size="sm">Universal (99%)</Badge>
                    </td>
                  </tr>

                  <tr className="bg-sky-500/5 hover:bg-sky-500/10 transition border-l-4 border-l-sky-500">
                    <td className="p-3.5 font-bold text-sky-300">
                      ECDSA/EdDSA ed25519 + cv25519
                      <span className="block text-[10px] text-cyan-400 font-normal">Moderno / Curvas Edwards</span>
                    </td>
                    <td className="p-3.5 text-emerald-400 font-semibold">&lt; 0.1 seg (Instantáneo)</td>
                    <td className="p-3.5 text-emerald-300 font-bold">~13,000 firmas/s</td>
                    <td className="p-3.5 text-slate-300">Rápido (AES híbrido)</td>
                    <td className="p-3.5 text-emerald-300 font-bold">~68 bytes</td>
                    <td className="p-3.5 text-emerald-300 font-bold">64 bytes</td>
                    <td className="p-3.5">
                      <Badge variant="sky" size="sm">Alta (GnuPG 2.1+, SSH, TLS)</Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── SUBTAB 3: Matrices Oficiales NIST & Comparativas Técnicas ── */}
      {subTab === 'tables' && (
        <div className="flex flex-col gap-6">
          {/* Table 4: NIST SP 800-57 Rev. 5 */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  Tabla 4. Matriz Oficial de Equivalencia de Longitudes de Clave (NIST SP 800-57 Rev. 5 / BSI TR-02102)
                </h4>
                <p className="text-[11px] text-slate-400 font-mono">
                  Medida formal de bits de seguridad efectiva (2^N operaciones requeridas para vulnerar el sistema)
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Seguridad Efectiva</th>
                    <th className="p-3.5">Cifrado Simétrico</th>
                    <th className="p-3.5">RSA / DSA</th>
                    <th className="p-3.5">Curvas Elípticas (ECC)</th>
                    <th className="p-3.5">Función Hash (Firma)</th>
                    <th className="p-3.5">Vigencia y Estado Oficial NIST</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr className="bg-rose-500/5 hover:bg-rose-500/10">
                    <td className="p-3.5 font-bold text-rose-400">80 bits</td>
                    <td className="p-3.5 text-slate-300">2TDEA, DES</td>
                    <td className="p-3.5 text-slate-400">1024 bits</td>
                    <td className="p-3.5 text-slate-400">160 bits</td>
                    <td className="p-3.5 text-slate-400">SHA-1</td>
                    <td className="p-3.5">
                      <Badge variant="rose" size="sm">
                        <XCircle className="w-3 h-3 text-rose-400" />
                        OBSOLETO (Inseguro)
                      </Badge>
                    </td>
                  </tr>

                  <tr className="bg-amber-500/5 hover:bg-amber-500/10">
                    <td className="p-3.5 font-bold text-amber-400">112 bits</td>
                    <td className="p-3.5 text-slate-300">3TDEA (Triple-DES)</td>
                    <td className="p-3.5 text-slate-300">2048 bits</td>
                    <td className="p-3.5 text-slate-300">224 bits</td>
                    <td className="p-3.5 text-slate-300">SHA-224</td>
                    <td className="p-3.5">
                      <Badge variant="amber" size="sm">
                        <Clock className="w-3 h-3 text-amber-400" />
                        LEGADO (Hasta 2030)
                      </Badge>
                    </td>
                  </tr>

                  <tr className="bg-emerald-500/5 hover:bg-emerald-500/10 border-l-4 border-l-emerald-500">
                    <td className="p-3.5 font-bold text-emerald-400">128 bits</td>
                    <td className="p-3.5 text-emerald-300 font-bold">AES-128</td>
                    <td className="p-3.5 text-emerald-300 font-bold">3072 bits</td>
                    <td className="p-3.5 text-emerald-300 font-bold">256 bits (Ed25519 / P-256)</td>
                    <td className="p-3.5 text-emerald-300 font-bold">SHA-256</td>
                    <td className="p-3.5">
                      <Badge variant="emerald" size="sm">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        ESTÁNDAR VIGENTE (&gt;2030)
                      </Badge>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-800/30">
                    <td className="p-3.5 font-bold text-sky-400">192 bits</td>
                    <td className="p-3.5 text-slate-300">AES-192</td>
                    <td className="p-3.5 text-slate-300">7688 bits</td>
                    <td className="p-3.5 text-slate-300">384 bits (P-384)</td>
                    <td className="p-3.5 text-slate-300">SHA-384</td>
                    <td className="p-3.5">
                      <Badge variant="sky" size="sm">ALTA SEGURIDAD</Badge>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-800/30">
                    <td className="p-3.5 font-bold text-purple-400">256 bits</td>
                    <td className="p-3.5 text-slate-300">AES-256</td>
                    <td className="p-3.5 text-slate-300">15360 bits</td>
                    <td className="p-3.5 text-slate-300">512 / 521 bits (Ed448 / P-521)</td>
                    <td className="p-3.5 text-slate-300">SHA-512</td>
                    <td className="p-3.5">
                      <Badge variant="purple" size="sm">MÁXIMA SEGURIDAD (CNSA 2.0)</Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── SUBTAB 4: Mapeo de Kleopatra & 8 Variables Críticas ── */}
      {subTab === 'kleopatra-guide' && (
        <div className="flex flex-col gap-6">
          {/* 3 Pillars Card */}
          <GlassCard className="border-amber-500/30 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-slate-100">
                  La Huella Digital (Fingerprint) y sus Tres Pilares de Seguridad
                </h3>
              </div>
              <Badge variant="slate" size="sm">SHA-1 / SHA-256 (40 caracteres Hex)</Badge>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              La huella digital de un certificado OpenPGP condensa el paquete binario de la clave pública y sus metadatos
              en 40 caracteres hexadecimales, garantizando los siguientes pilares de la seguridad de la información:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-emerald-500/30 flex flex-col gap-1.5">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  1. Pilar Principal: INTEGRIDAD
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Gracias a la resistencia a colisiones y al efecto avalancha del hash, la alteración de un solo bit en la
                  clave pública cambia por completo la huella, detectando cualquier ataque.
                </p>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-sky-500/30 flex flex-col gap-1.5">
                <span className="text-sky-400 font-bold flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4" />
                  2. Pilar Respaldado: AUTENTICIDAD
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Permite la verificación fuera de banda (<em>out-of-band</em>) para confirmar que la clave pertenece genuinamente a su legítimo autor.
                </p>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-purple-500/30 flex flex-col gap-1.5">
                <span className="text-purple-400 font-bold flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4" />
                  3. Pilar Derivado: NO REPUDIO
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Al vincularse unívocamente la identidad con la huella digital verificada, el titular no puede repudiar documentos firmados.
                </p>
              </div>
            </div>
          </GlassCard>

          {/* 8 Critical Variables */}
          <div>
            <div className="mb-3">
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                Las 8 Variables Críticas de Kleopatra que Impactan la Seguridad (Sección J)
              </h4>
              <p className="text-xs text-slate-400 font-mono">
                Funcionalidades avanzadas que determinan la continuidad, resiliencia y soberanía criptográfica
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {KLEOPATRA_VARIABLES.map(item => (
                <GlassCard key={item.id} hoverEffect className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="font-bold text-xs text-slate-100 font-mono">{item.title}</h5>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${item.severityColor}`}>
                      {item.severity}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-amber-300/80 bg-slate-950 p-1.5 rounded border border-slate-800">
                    <span className="text-amber-400 font-bold mr-1.5">Ruta en interfaz:</span>{item.where}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.why}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DecisionMatrixTab;
