import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { CopyButton } from '../common/CopyButton';
import {
  simulateTlsHandshake,
  buildCertificateChain,
  CertificateValidationType,
  X509Certificate,
} from '../../crypto/tlsHandshake';
import {
  Globe,
  Shield,
  Award,
  Lock,
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Layers,
  FileCheck,
  Server,
  Laptop,
  Terminal,
} from 'lucide-react';

export const TlsPkiExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'certificates' | 'handshake'>('certificates');

  // PKI State
  const [domain, setDomain] = useState('banco-seguro.com.pe');
  const [validationType, setValidationType] = useState<CertificateValidationType>('EV');
  const [selectedCertIndex, setSelectedCertIndex] = useState<number>(2); // Leaf by default

  // Handshake State
  const [tlsVersion, setTlsVersion] = useState<'TLS 1.3' | 'TLS 1.2'>('TLS 1.3');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(1);

  const session = simulateTlsHandshake(domain, validationType, tlsVersion);
  const selectedCert = session.certificateChain[selectedCertIndex] || session.certificateChain[2];
  const activeHandshakeStep = session.handshakeSteps[activeStepIndex - 1] || session.handshakeSteps[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Banner */}
      <GlassCard borderGlow="sky">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="sky">Semana S15 · Infraestructura de Clave Pública & HTTPS</Badge>
              <Badge variant="slate">RFC 8446 (TLS 1.3) & RFC 5280 (X.509)</Badge>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
              <Globe className="w-6 h-6 text-sky-400" />
              Certificados Digitales, PKI y Handshake SSL/TLS
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
              Explora la jerarquía de confianza PKI (CA Raíz $\rightarrow$ CA Intermedia $\rightarrow$ Certificado Final), la comparativa de validaciones DV, OV, EV y la simulación paso a paso del protocolo TLS 1.3.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('certificates')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeTab === 'certificates' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Jerarquía PKI X.509
            </button>
            <button
              onClick={() => setActiveTab('handshake')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeTab === 'handshake' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Simulador Handshake TLS
            </button>
          </div>
        </div>
      </GlassCard>

      {/* TAB 1: JERARQUÍA PKI X.509 */}
      {activeTab === 'certificates' && (
        <div className="space-y-6">
          {/* Validation Level Selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GlassCard
              hoverEffect
              borderGlow={validationType === 'DV' ? 'sky' : 'none'}
              className="cursor-pointer"
            >
              <div onClick={() => setValidationType('DV')} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold font-mono text-sm text-slate-100">DV (Domain Validation)</span>
                  <Badge variant="sky">Nivel Básico</Badge>
                </div>
                <p className="text-xs text-slate-400">
                  Valida únicamente el control técnico del nombre de dominio (registro DNS o archivo HTTP). Emisión automatizada en minutos.
                </p>
                <div className="text-[11px] font-mono text-slate-500">Uso: Blogs, sitios personales, APIs públicas.</div>
              </div>
            </GlassCard>

            <GlassCard
              hoverEffect
              borderGlow={validationType === 'OV' ? 'emerald' : 'none'}
              className="cursor-pointer"
            >
              <div onClick={() => setValidationType('OV')} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold font-mono text-sm text-slate-100">OV (Organization Validation)</span>
                  <Badge variant="emerald">Nivel Corporativo</Badge>
                </div>
                <p className="text-xs text-slate-400">
                  Verifica la existencia jurídica de la empresa, personería legal y ubicación física registrada ante la CA.
                </p>
                <div className="text-[11px] font-mono text-slate-500">Uso: Empresas medianas, intranets, portales B2B.</div>
              </div>
            </GlassCard>

            <GlassCard
              hoverEffect
              borderGlow={validationType === 'EV' ? 'amber' : 'none'}
              className="cursor-pointer"
            >
              <div onClick={() => setValidationType('EV')} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold font-mono text-sm text-slate-100">EV (Extended Validation)</span>
                  <Badge variant="amber">Máxima Confianza</Badge>
                </div>
                <p className="text-xs text-slate-400">
                  Auditoría exhaustiva de identidad legal, facultades de los directivos y antecedentes corporativos según CA/Browser Forum.
                </p>
                <div className="text-[11px] font-mono text-slate-500">Uso: Bancos, pasarelas de pago, entidades financieras.</div>
              </div>
            </GlassCard>
          </div>

          {/* Browser Address Bar Mockup */}
          <GlassCard borderGlow="sky">
            <div className="flex items-center gap-3 bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              </div>

              <div className="flex-1 flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-mono">
                <Lock className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="text-emerald-400 font-bold">https://</span>
                <input
                  type="text"
                  value={domain}
                  onChange={e => setDomain(e.target.value)}
                  className="bg-transparent text-slate-200 outline-none w-full"
                />
                <Badge variant={validationType === 'EV' ? 'amber' : validationType === 'OV' ? 'emerald' : 'sky'}>
                  {validationType}
                </Badge>
              </div>
            </div>
          </GlassCard>

          {/* Chain of Trust & Inspector Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Chain of Trust Visual Nodes */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-xs font-bold font-mono uppercase text-slate-300">
                Cadena Jerárquica de Confianza (Chain of Trust)
              </h3>

              {session.certificateChain.map((cert, idx) => {
                const isSelected = selectedCertIndex === idx;
                const isRoot = cert.type === 'Root_CA';
                const isIntermediate = cert.type === 'Intermediate_CA';

                return (
                  <div key={cert.id} className="relative">
                    <button
                      onClick={() => setSelectedCertIndex(idx)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-slate-900 border-sky-500/60 shadow-lg shadow-sky-500/10'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                          {isRoot ? '1. CA Raíz Confiable' : isIntermediate ? '2. CA Intermedia Emisora' : '3. Certificado de Servidor (Hoja)'}
                        </span>
                        <Badge variant={isRoot ? 'purple' : isIntermediate ? 'sky' : 'emerald'}>
                          {cert.publicKeyAlgorithm}
                        </Badge>
                      </div>
                      <div className="text-xs font-bold text-slate-100 truncate">{cert.commonName}</div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">{cert.organization}</div>
                    </button>

                    {idx < session.certificateChain.length - 1 && (
                      <div className="flex justify-center my-1">
                        <ArrowDown className="w-4 h-4 text-slate-600" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right: Detailed Certificate Inspector */}
            <div className="lg:col-span-7">
              <GlassCard borderGlow="sky">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-sky-400" />
                    <h3 className="text-sm font-bold text-slate-100 font-mono uppercase">
                      Inspector de Campos X.509 v3 (RFC 5280)
                    </h3>
                  </div>
                  <Badge variant="sky">{selectedCert.type}</Badge>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="grid grid-cols-3 p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-500">Sujeto (CN):</span>
                    <span className="col-span-2 text-slate-200 font-bold">{selectedCert.commonName}</span>
                  </div>

                  <div className="grid grid-cols-3 p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-500">Organización (O):</span>
                    <span className="col-span-2 text-amber-300">{selectedCert.organization}</span>
                  </div>

                  <div className="grid grid-cols-3 p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-500">Emisor (Issuer):</span>
                    <span className="col-span-2 text-slate-300">{selectedCert.issuerCN}</span>
                  </div>

                  <div className="grid grid-cols-3 p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-500">Número de Serie:</span>
                    <span className="col-span-2 text-slate-300">{selectedCert.serialNumber}</span>
                  </div>

                  <div className="grid grid-cols-3 p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-500">Vigencia:</span>
                    <span className="col-span-2 text-emerald-300">{selectedCert.validFrom} al {selectedCert.validTo}</span>
                  </div>

                  <div className="grid grid-cols-3 p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-500">Clave Pública:</span>
                    <span className="col-span-2 text-sky-300 font-bold">{selectedCert.publicKeyAlgorithm} ({selectedCert.keyLengthBits} bits)</span>
                  </div>

                  <div className="grid grid-cols-3 p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-500">Algoritmo de Firma:</span>
                    <span className="col-span-2 text-purple-300">{selectedCert.signatureAlgorithm}</span>
                  </div>

                  <div className="grid grid-cols-3 p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-500">SAN (Alt Names):</span>
                    <span className="col-span-2 text-slate-300">{selectedCert.subjectAltNames.join(', ')}</span>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SIMULADOR HANDSHAKE TLS */}
      {activeTab === 'handshake' && (
        <div className="space-y-6">
          {/* Handshake Config */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div>
              <span className="text-xs font-mono text-slate-400 block">Protocolo de Negociación:</span>
              <div className="flex items-center gap-2 mt-1">
                {(['TLS 1.3', 'TLS 1.2'] as const).map(ver => (
                  <button
                    key={ver}
                    onClick={() => {
                      setTlsVersion(ver);
                      setActiveStepIndex(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      tlsVersion === ver ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {ver} {ver === 'TLS 1.3' ? '(1 RTT - Cifrado desde Ronda 2)' : '(2 RTT Clásico)'}
                  </button>
                ))}
              </div>
            </div>

            <div className="font-mono text-xs text-right">
              <span className="text-slate-500 block">Suite Negociada:</span>
              <span className="text-emerald-400 font-bold">{session.cipherSuite}</span>
            </div>
          </div>

          {/* Step Selector Pills */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {session.handshakeSteps.map(step => (
              <button
                key={step.stepIndex}
                onClick={() => setActiveStepIndex(step.stepIndex)}
                className={`p-3 rounded-xl border font-mono text-left transition-all ${
                  activeStepIndex === step.stepIndex
                    ? 'bg-slate-900 border-sky-500 text-slate-100 shadow-md shadow-sky-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span>Paso {step.stepIndex}</span>
                  <Badge variant="sky">{step.direction.split(' ')[0]}</Badge>
                </div>
                <div className="text-xs font-bold truncate">{step.messageName.split(' ')[0]}</div>
              </button>
            ))}
          </div>

          {/* Active Step Detailed Diagram */}
          <GlassCard borderGlow="sky">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs font-mono">
                  {activeHandshakeStep.stepIndex}
                </span>
                <h3 className="text-sm font-bold text-slate-100 font-mono">
                  {activeHandshakeStep.messageName}
                </h3>
              </div>
              <Badge variant="emerald">{activeHandshakeStep.direction}</Badge>
            </div>

            <p className="text-xs text-slate-300 mb-4 font-mono">
              {activeHandshakeStep.summary}
            </p>

            {/* Packet Payload Breakdown */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
              <span className="text-slate-500 font-bold block uppercase">Carga Útil del Paquete (Payload):</span>
              {activeHandshakeStep.packetDetails.cipherSuites && (
                <div>
                  <span className="text-slate-400">Cipher Suites Propuestas: </span>
                  <span className="text-sky-300">{activeHandshakeStep.packetDetails.cipherSuites.join(', ')}</span>
                </div>
              )}
              {activeHandshakeStep.packetDetails.keyExchange && (
                <div>
                  <span className="text-slate-400">Intercambio de Claves: </span>
                  <span className="text-amber-300">{activeHandshakeStep.packetDetails.keyExchange}</span>
                </div>
              )}
              {activeHandshakeStep.packetDetails.certificatesChain && (
                <div>
                  <span className="text-slate-400">Cadena de Certificados: </span>
                  <span className="text-emerald-300">{activeHandshakeStep.packetDetails.certificatesChain.join(' → ')}</span>
                </div>
              )}
              {activeHandshakeStep.packetDetails.keysDerived && (
                <div>
                  <span className="text-slate-400">Secretos Derivados: </span>
                  <span className="text-purple-300">{activeHandshakeStep.packetDetails.keysDerived.join(', ')}</span>
                </div>
              )}
              {activeHandshakeStep.packetDetails.encryptedDataPreview && (
                <div>
                  <span className="text-slate-400">Datos Cifrados: </span>
                  <span className="text-emerald-400 font-bold">{activeHandshakeStep.packetDetails.encryptedDataPreview}</span>
                </div>
              )}
            </div>

            <p className="mt-4 text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              💡 <span className="font-semibold text-slate-200">Explicación Técnica:</span> {activeHandshakeStep.explanation}
            </p>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
