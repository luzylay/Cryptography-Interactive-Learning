import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { CopyButton } from '../common/CopyButton';
import {
  generateEducationalRsaKeys,
  simulateDigitalSignaturePipeline,
  RsaKeyPair,
} from '../../crypto/digitalSignature';
import {
  FileSignature,
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  Radio,
  ArrowRight,
  AlertTriangle,
  RotateCw,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export const DigitalSignatureSimulator: React.FC = () => {
  const [keyPairIndex, setKeyPairIndex] = useState(0);
  const [originalMessage, setOriginalMessage] = useState('AUTORIZO PAGO DE $10,000 A PROVEEDOR');
  const [isTamperingMessage, setIsTamperingMessage] = useState(false);
  const [tamperedText, setTamperedText] = useState('AUTORIZO PAGO DE $99,000 A CUENTA ATACANTE');
  const [isTamperingSignature, setIsTamperingSignature] = useState(false);

  const currentKeyPair = generateEducationalRsaKeys(keyPairIndex);

  const pipelineResult = simulateDigitalSignaturePipeline(
    originalMessage,
    currentKeyPair,
    isTamperingMessage ? tamperedText : undefined,
    isTamperingSignature ? 'BADF143' : undefined
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <GlassCard borderGlow="purple">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="purple">Semana S14 · Autenticación Asimétrica</Badge>
              <Badge variant="slate">NIST FIPS PUB 186-5 & RFC 8017</Badge>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
              <FileSignature className="w-6 h-6 text-purple-400" />
              Simulador Integral de Firma Digital y No Repudio
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
              Experimenta el pipeline completo de 4 etapas: Resumen criptográfico $\rightarrow$ Cifrado con Clave Privada $\rightarrow$ Transmisión por Canal Inseguro con simulación de ataques $\rightarrow$ Verificación matemática con Clave Pública.
            </p>
          </div>

          <button
            onClick={() => setKeyPairIndex(prev => prev + 1)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold hover:bg-purple-500/30 transition-all"
          >
            <RotateCw className="w-4 h-4" />
            Regenerar Par de Claves RSA
          </button>
        </div>
      </GlassCard>

      {/* Key Pair Configuration Card */}
      <GlassCard borderGlow="purple">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold font-mono uppercase text-slate-300 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-purple-400" />
            Par de Claves Criptográficas de Alice (Emisor)
          </h3>
          <Badge variant="purple">RSA Académico (p={currentKeyPair.p}, q={currentKeyPair.q})</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <Unlock className="w-3.5 h-3.5" /> Clave Pública (e, n) — Compartida con Todos
              </span>
              <Badge variant="emerald">Pública</Badge>
            </div>
            <div className="text-slate-200 font-bold">e = {currentKeyPair.e}, n = {currentKeyPair.n}</div>
            <div className="text-[11px] text-slate-500">Módulo n = p × q = {currentKeyPair.p} × {currentKeyPair.q} = {currentKeyPair.n}</div>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-purple-500/40 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1 text-purple-400 font-bold">
                <Lock className="w-3.5 h-3.5" /> Clave Privada (d, n) — Secreta de Alice
              </span>
              <Badge variant="purple">Estrictamente Secreta</Badge>
            </div>
            <div className="text-purple-300 font-bold">d = {currentKeyPair.d}, n = {currentKeyPair.n}</div>
            <div className="text-[11px] text-slate-500">Inverso modular: d = e⁻¹ mod φ(n) con φ(n) = {currentKeyPair.phi}</div>
          </div>
        </div>
      </GlassCard>

      {/* Message and Attack Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <label className="text-xs font-bold text-slate-400 font-mono uppercase mb-2 block">
            Mensaje Original de Alice
          </label>
          <textarea
            rows={2}
            value={originalMessage}
            onChange={e => setOriginalMessage(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono text-xs"
          />
        </GlassCard>

        {/* Attacker Manipulation Panel */}
        <GlassCard borderGlow="rose">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold font-mono uppercase text-rose-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Laboratorio de Ataques en Tránsito (Man-in-the-Middle)
            </h3>
            <Badge variant="rose">Simular Intervención</Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs text-slate-300 font-mono flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTamperingMessage}
                  onChange={e => setIsTamperingMessage(e.target.checked)}
                  className="rounded text-rose-500 focus:ring-rose-500 bg-slate-950 border-slate-700"
                />
                Alterar contenido del Mensaje en tránsito
              </label>
            </div>

            {isTamperingMessage && (
              <input
                type="text"
                value={tamperedText}
                onChange={e => setTamperedText(e.target.value)}
                placeholder="Texto fraudulento..."
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-rose-500/50 text-rose-300 font-mono text-xs"
              />
            )}

            <div className="flex items-center justify-between pt-1 border-t border-slate-800">
              <label className="text-xs text-slate-300 font-mono flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTamperingSignature}
                  onChange={e => setIsTamperingSignature(e.target.checked)}
                  className="rounded text-rose-500 focus:ring-rose-500 bg-slate-950 border-slate-700"
                />
                Corromper o Reemplazar la Firma Digital
              </label>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* 4-Step Pipeline Visualizer */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold font-mono uppercase text-slate-300">
          Flujo de 4 Fases de Firma y Verificación Digital
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pipelineResult.steps.map(st => {
            const isFailedStep = st.stepNumber === 4 && !pipelineResult.verificationSuccess;
            const isSuccessStep = st.stepNumber === 4 && pipelineResult.verificationSuccess;

            return (
              <GlassCard
                key={st.stepNumber}
                borderGlow={isFailedStep ? 'rose' : isSuccessStep ? 'emerald' : 'purple'}
                className="flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                      Fase {st.stepNumber}
                    </span>
                    <Badge variant={st.actor.includes('Alice') ? 'purple' : st.actor.includes('Canal') ? 'rose' : 'emerald'}>
                      {st.actor}
                    </Badge>
                  </div>

                  <h4 className="text-xs font-bold text-slate-200 font-mono mb-2">{st.title}</h4>
                  <div className="text-[11px] font-mono text-purple-300 mb-2 font-bold break-all">
                    {st.formula}
                  </div>

                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-400 space-y-1 mb-2">
                    <div className="truncate">{st.inputData}</div>
                    <div className="text-amber-300 font-bold truncate">{st.outputData}</div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800">
                  {st.explanation}
                </p>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Final Verification Banner */}
      <GlassCard borderGlow={pipelineResult.verificationSuccess ? 'emerald' : 'rose'}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {pipelineResult.verificationSuccess ? (
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0">
                <XCircle className="w-6 h-6" />
              </div>
            )}
            <div>
              <h3 className={`text-base font-bold font-mono ${pipelineResult.verificationSuccess ? 'text-emerald-400' : 'text-rose-400'}`}>
                {pipelineResult.verificationSuccess
                  ? 'VEREDICTO: FIRMA DIGITAL AUTÉNTICA Y VÁLIDA'
                  : 'VEREDICTO: FRAUDE O CORRUPCIÓN DETECTADA (FIRMA RECHAZADA)'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {pipelineResult.verificationSuccess
                  ? 'Se certifican con 100% de rigor matemático la Integridad del mensaje, la Autenticidad de Alice y el No Repudio legal.'
                  : pipelineResult.tamperReason || 'Los hashes discrepan. El receptor no procesa el mensaje.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <Badge variant={pipelineResult.verificationSuccess ? 'emerald' : 'rose'}>
              h' = 0x{pipelineResult.decryptedHash} {pipelineResult.verificationSuccess ? '==' : '!='} h'' = 0x{pipelineResult.localComputedHash}
            </Badge>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
