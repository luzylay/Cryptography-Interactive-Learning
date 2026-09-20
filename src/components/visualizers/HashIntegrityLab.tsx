import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { CopyButton } from '../common/CopyButton';
import {
  calculateAllHashes,
  calculateAvalancheEffect,
  hmacSha256,
} from '../../crypto/hashes';
import { Hash, Zap, ShieldAlert, Sparkles, CheckCircle2, Lock, Flame } from 'lucide-react';

export const HashIntegrityLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calculator' | 'avalanche' | 'hmac'>('calculator');

  // Calculator State
  const [inputText, setInputText] = useState('La criptografía moderna garantiza la integridad.');

  // Avalanche State
  const [origText, setOrigText] = useState('HOLA MUNDO');
  const [modText, setModText] = useState('HOLA MUNDP'); // 1-character difference
  const [avalancheAlgo, setAvalancheAlgo] = useState<'SHA-256' | 'SHA-1' | 'MD5'>('SHA-256');

  // HMAC State
  const [hmacMsg, setHmacMsg] = useState('TRANSFERIR $5000 A CUENTA #12345');
  const [hmacKey, setHmacKey] = useState('MI_LLAVE_SECRETA_BANCARIA_2026');

  const hashes = calculateAllHashes(inputText);
  const avalanche = calculateAvalancheEffect(origText, modText, avalancheAlgo);
  const calculatedHmac = hmacSha256(hmacKey, hmacMsg);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Banner */}
      <GlassCard borderGlow="amber">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="amber">Semana S13 · Resumen Criptográfico</Badge>
              <Badge variant="slate">FIPS PUB 180-4 & RFC 2104</Badge>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
              <Hash className="w-6 h-6 text-amber-400" />
              Funciones Hash, Efecto Avalancha e Integridad
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
              Calculadora multihash instantánea (MD5, SHA-1, SHA-256), medición interactiva en vivo del Efecto Avalancha (dispersión del 50% de bits) y generador de HMAC para autenticación de mensajes.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeTab === 'calculator' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Calculadora Multi-Hash
            </button>
            <button
              onClick={() => setActiveTab('avalanche')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeTab === 'avalanche' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Efecto Avalancha
            </button>
            <button
              onClick={() => setActiveTab('hmac')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeTab === 'hmac' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              HMAC Autenticado
            </button>
          </div>
        </div>
      </GlassCard>

      {/* TAB 1: MULTI-HASH CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="space-y-6">
          <GlassCard>
            <label className="text-xs font-bold text-slate-400 font-mono uppercase mb-2 block">
              Mensaje o Cadena de Entrada (Cualquier longitud)
            </label>
            <textarea
              rows={3}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Ingresa cualquier texto..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono text-sm focus:outline-none focus:border-amber-500"
            />
            <div className="mt-2 text-xs font-mono text-slate-400 flex justify-between">
              <span>Longitud: {inputText.length} caracteres ({inputText.length * 8} bits)</span>
              <span>Construcción: Merkle-Damgård con padding estándar</span>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 gap-4">
            {hashes.map(item => {
              const isSha256 = item.algorithm === 'SHA-256';
              const isMd5 = item.algorithm === 'MD5';
              const isSha1 = item.algorithm === 'SHA-1';

              return (
                <GlassCard
                  key={item.algorithm}
                  borderGlow={isSha256 ? 'emerald' : isSha1 ? 'amber' : 'rose'}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono text-sm text-slate-100">{item.algorithm}</span>
                      <Badge variant={isSha256 ? 'emerald' : isSha1 ? 'amber' : 'rose'}>
                        {item.bitLength} bits ({item.byteLength} bytes)
                      </Badge>
                      {isMd5 && <Badge variant="rose">Vulnerable a Colisiones (Wang, 2004)</Badge>}
                      {isSha1 && <Badge variant="amber">Retirado por NIST (SHAttered, 2017)</Badge>}
                      {isSha256 && <Badge variant="emerald">Estándar Actual Vigente (FIPS 180-4)</Badge>}
                    </div>
                    <CopyButton text={item.digestHex} />
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-amber-300 break-all">
                    {item.digestHex}
                  </div>

                  <div className="mt-2 text-[11px] font-mono text-slate-500 truncate">
                    Binario ({item.bitLength} bits): {item.binaryString.slice(0, 48)}...
                  </div>
                </GlassCard>
              );
            })}
          </div>

          {/* Properties Summary */}
          <GlassCard>
            <h4 className="text-xs font-bold font-mono uppercase text-slate-300 mb-3">
              Las 3 Propiedades Matemáticas Obligatorias de una Función Hash Segura
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-emerald-400 font-bold block mb-1">1. Resistencia a Preimagen (Unidireccionalidad):</span>
                <p className="text-slate-400">Dado un hash h, es computacionalmente imposible encontrar el mensaje original M tal que H(M) = h.</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-sky-400 font-bold block mb-1">2. Resistencia a 2.ª Preimagen:</span>
                <p className="text-slate-400">Dado un mensaje M₁, es inviable encontrar un segundo mensaje distinto M₂ tal que H(M₁) = H(M₂).</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-amber-400 font-bold block mb-1">3. Resistencia a Colisiones:</span>
                <p className="text-slate-400">Es inviable encontrar dos mensajes arbitrarios cualesquiera M₁ ≠ M₂ tales que H(M₁) = H(M₂). Complejidad: 2^(n/2) por la Paradoja del Cumpleaños.</p>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* TAB 2: AVALANCHE EFFECT */}
      {activeTab === 'avalanche' && (
        <div className="space-y-6">
          <GlassCard borderGlow="amber">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-100 uppercase font-mono flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                Medición en Vivo del Efecto Avalancha (Avalanche Effect)
              </h3>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                {(['SHA-256', 'SHA-1', 'MD5'] as const).map(algo => (
                  <button
                    key={algo}
                    onClick={() => setAvalancheAlgo(algo)}
                    className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                      avalancheAlgo === algo ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {algo}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Modifica un solo carácter o letra en el texto modificado. Un algoritmo de hash criptográficamente seguro debe invertir aproximadamente el <strong>50% de los bits totales</strong> en el resumen final.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 font-mono block mb-1">Texto Original (M₁)</label>
                <input
                  type="text"
                  value={origText}
                  onChange={e => setOrigText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 font-mono block mb-1">Texto Modificado (M₂)</label>
                <input
                  type="text"
                  value={modText}
                  onChange={e => setModText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono text-xs"
                />
              </div>
            </div>
          </GlassCard>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <GlassCard className="text-center font-mono">
              <div className="text-xs text-slate-400">Bits Invertidos (Hamming Distance)</div>
              <div className="text-2xl font-bold text-amber-400 mt-1">
                {avalanche.flippedBitsCount} / {avalanche.totalBits}
              </div>
            </GlassCard>

            <GlassCard className="text-center font-mono">
              <div className="text-xs text-slate-400">Porcentaje de Avalancha</div>
              <div className={`text-2xl font-bold mt-1 ${
                avalanche.avalanchePercentage >= 40 && avalanche.avalanchePercentage <= 60
                  ? 'text-emerald-400'
                  : 'text-amber-400'
              }`}>
                {avalanche.avalanchePercentage}%
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Ideal Teórico ≈ 50.0%</div>
            </GlassCard>

            <GlassCard className="text-center font-mono">
              <div className="text-xs text-slate-400">Evaluación de Difusión</div>
              <div className="text-sm font-bold text-emerald-300 mt-2 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Difusión Óptima
              </div>
            </GlassCard>
          </div>

          {/* 256-Bit Visualization Grid */}
          <GlassCard>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold font-mono uppercase text-slate-300">
                Mapa Bit a Bit del Hash ({avalanche.totalBits} Bits)
              </h4>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span> Bit Idéntico ({avalanche.totalBits - avalanche.flippedBitsCount})
                </span>
                <span className="flex items-center gap-1 text-rose-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span> Bit Invertido ({avalanche.flippedBitsCount})
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="grid grid-cols-16 sm:grid-cols-32 gap-1">
                {avalanche.bitDifferences.map((isFlipped, idx) => (
                  <div
                    key={idx}
                    title={`Bit #${idx + 1}: ${isFlipped ? 'INVERTIDO' : 'Idéntico'}`}
                    className={`h-4 sm:h-5 rounded-xs transition-all ${
                      isFlipped
                        ? 'bg-rose-500 shadow-sm shadow-rose-500/50'
                        : 'bg-emerald-600/40 border border-emerald-500/20'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800">
                <span className="text-slate-400 block mb-1">Hash M₁ (Hex):</span>
                <span className="text-slate-200 break-all">{avalanche.originalHashHex}</span>
              </div>
              <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800">
                <span className="text-slate-400 block mb-1">Hash M₂ (Hex):</span>
                <span className="text-amber-400 break-all">{avalanche.modifiedHashHex}</span>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* TAB 3: HMAC GENERATOR */}
      {activeTab === 'hmac' && (
        <div className="space-y-6">
          <GlassCard borderGlow="emerald">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="emerald">RFC 2104</Badge>
              <Badge variant="slate">Keyed-Hash Message Authentication Code</Badge>
            </div>
            <h3 className="text-sm font-bold text-slate-200 font-mono uppercase">
              Generador HMAC-SHA256 para Integridad y Autenticación
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              HMAC combina una clave secreta K con el mensaje M usando dos pasos de compresión hash con relleno interno y externo: <code className="text-amber-300 font-bold">HMAC(K, M) = H( (K ⊕ opad) || H( (K ⊕ ipad) || M ) )</code>, garantizando que solo quienes poseen la clave secreta pueden generar o validar el código.
            </p>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard>
              <label className="text-xs font-bold text-slate-400 font-mono uppercase mb-2 block">
                Mensaje a Autenticar (M)
              </label>
              <textarea
                rows={3}
                value={hmacMsg}
                onChange={e => setHmacMsg(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
            </GlassCard>

            <GlassCard>
              <label className="text-xs font-bold text-slate-400 font-mono uppercase mb-2 block">
                Clave Secreta Compartida (K)
              </label>
              <textarea
                rows={3}
                value={hmacKey}
                onChange={e => setHmacKey(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
            </GlassCard>
          </div>

          <GlassCard borderGlow="emerald">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-emerald-400 uppercase">
                Código HMAC-SHA256 Generado (256 Bits / 32 Bytes)
              </span>
              <CopyButton text={calculatedHmac} />
            </div>
            <div className="p-3.5 bg-slate-950 rounded-xl border border-emerald-500/40 font-mono text-sm font-bold text-emerald-300 break-all">
              {calculatedHmac}
            </div>
            <p className="mt-3 text-xs text-slate-400">
              🛡️ Si un atacante altera cualquier carácter del mensaje o no posee la clave exacta, el receptor obtendrá un HMAC divergente y descartará el paquete de inmediato.
            </p>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
