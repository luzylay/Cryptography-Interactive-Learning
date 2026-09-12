import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Clock,
  Layers,
  FileCheck2,
  HardDrive,
  KeyRound,
  Lock,
  Cpu,
  Server,
  ArrowRight,
  Info,
  Sliders,
  Award,
  Sparkles,
  RefreshCw,
  Eye,
  Check,
  XCircle,
  Copy,
  Terminal,
} from 'lucide-react';

interface Scenario {
  id: string;
  title: string;
  shortDesc: string;
  badge: string;
  badgeColor: string;
  icon: any;
  recommendation: {
    algorithm: string;
    subKey: string;
    securityBits: string;
    nistStatus: string;
    checkboxes: {
      sign: boolean;
      encrypt: boolean;
      certify: boolean;
      auth: boolean;
    };
    validity: string;
    validityReason: string;
    passphrase: {
      length: string;
      kdf: string;
      hardware: string;
    };
    symmetricCipher: string;
    hashFunction: string;
    tradeoffs: {
      generationTime: string;
      signSpeed: string;
      keySize: string;
      compatibility: string;
    };
    justification: string;
    practicalAdvice: string;
  };
}

const SCENARIOS: Scenario[] = [
  {
    id: 'academic',
    title: 'Laboratorio Académico / Práctica Universitaria',
    shortDesc: 'Prácticas de laboratorio, aprendizaje de OpenPGP y validación de firmas.',
    badge: 'Uso Educativo',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    icon: Award,
    recommendation: {
      algorithm: 'RSA 3072 bits (Clave Principal)',
      subKey: 'RSA 3072 bits (Subclave de Cifrado)',
      securityBits: '128 bits de seguridad efectiva',
      nistStatus: 'Vigente y recomendado según NIST SP 800-57 (>2030)',
      checkboxes: { sign: true, encrypt: true, certify: true, auth: false },
      validity: '1 a 2 años (ej. septiembre 2028)',
      validityReason: 'Ciclo académico estándar que previene la caducidad intempestiva durante el semestre.',
      passphrase: {
        length: '12 a 16 caracteres alfanuméricos',
        kdf: 'S2K iterado / PBKDF2 estándar de GnuPG',
        hardware: 'Almacenamiento protegido en disco local con copia de seguridad',
      },
      symmetricCipher: 'AES-128 o AES-256 (GnuPG híbrido)',
      hashFunction: 'SHA-256 (Familia SHA-2)',
      tradeoffs: {
        generationTime: '3 a 8 segundos',
        signSpeed: '~80 firmas/segundo',
        keySize: '~900 bytes (clave pública)',
        compatibility: 'Universal (100% clientes OpenPGP)',
      },
      justification:
        'RSA-3072 ofrece el equilibrio óptimo entre máxima compatibilidad con cualquier versión de GnuPG/Kleopatra y un nivel de seguridad matemática estándar de 128 bits plenamente vigente para entornos académicos.',
      practicalAdvice:
        'Asegurarse de establecer la vigencia en 2 años. Nunca dejar el certificado sin caducidad ni colocar plazos demasiado cortos (como 6 días), para evitar bloqueos durante evaluaciones.',
    },
  },
  {
    id: 'corporate',
    title: 'Correo Corporativo Diario (Empresa / Organización)',
    shortDesc: 'Intercambio cotidiano de archivos de oficina, correos y facturación electrónica.',
    badge: 'Corporativo',
    badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    icon: Server,
    recommendation: {
      algorithm: 'RSA 3072 bits o Ed25519 (Curva Edwards)',
      subKey: 'cv25519 (ECDH) o RSA 3072 bits',
      securityBits: '128 bits de seguridad efectiva',
      nistStatus: 'Estándar Vigente NIST SP 800-57 & BSI TR-02102',
      checkboxes: { sign: true, encrypt: true, certify: true, auth: false },
      validity: '1 año con política de rotación y renovación anual',
      validityReason: 'Permite auditar anualmente las identidades corporativas y revocar empleados desvinculados.',
      passphrase: {
        length: '16+ caracteres con política de complejidad empresarial',
        kdf: 'S2K iterado con salting de 64 bits',
        hardware: 'Respaldado en gestor de contraseñas corporativo o Smartcard',
      },
      symmetricCipher: 'AES-256-GCM o AES-128-GCM',
      hashFunction: 'SHA-256 / SHA-384',
      tradeoffs: {
        generationTime: '<0.1 seg (Ed25519) a 5 seg (RSA-3072)',
        signSpeed: '80 a 13,000 firmas/seg',
        keySize: '68 bytes (Ed25519) a 900 bytes (RSA)',
        compatibility: 'Universal (RSA) / Alta (Ed25519 con GnuPG 2.1+)',
      },
      justification:
        'Si todos los clientes de correo utilizan GnuPG 2.1+ (Thunderbird, Outlook GpgOL), Ed25519 reduce drásticamente el peso de los correos firmados y acelera la verificación de firmas en servidores centrales.',
      practicalAdvice:
        'Publicar las claves públicas en el servidor keys.openpgp.org corporativo con verificación estricta de correo electrónico institucional.',
    },
  },
  {
    id: 'classified',
    title: 'Información Confidencial / Secreto Comercial y Gobierno',
    shortDesc: 'Archivos clasificados, directivas de alta gerencia, propiedad intelectual y finanzas críticas.',
    badge: 'Máxima Seguridad',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    icon: ShieldAlert,
    recommendation: {
      algorithm: 'RSA 4096 bits o Curve25519 / Curve448',
      subKey: 'RSA 4096 bits o cv25519 / Curve448 (ECDH)',
      securityBits: '140 a 256 bits de seguridad efectiva',
      nistStatus: 'Conforme a FIPS 140-3 Nivel 3 y NSA CNSA 2.0',
      checkboxes: { sign: true, encrypt: true, certify: true, auth: false },
      validity: '1 año con revocación y rotación estricta',
      validityReason: 'Minimiza la ventana de explotación en caso de compromiso silencioso de la clave privada.',
      passphrase: {
        length: '>20 caracteres de alta entropía (generada aleatoriamente)',
        kdf: 'Argon2id o scrypt con memoria intensiva',
        hardware: 'Módulo de Seguridad Hardware (HSM) o Token FIPS 140-3 (YubiKey 5 / Nitrokey)',
      },
      symmetricCipher: 'AES-256-GCM o ChaCha20-Poly1305 (AEAD obligatorio)',
      hashFunction: 'SHA-512 o SHA3-512',
      tradeoffs: {
        generationTime: '8 a 30 segundos (búsqueda de primos de 4096 bits)',
        signSpeed: '~30 firmas/segundo',
        keySize: '~1200 bytes (RSA-4096)',
        compatibility: 'Universal (99.9% compatibilidad global)',
      },
      justification:
        'El estándar NSA CNSA 2.0 y NIST SP 800-57 exigen niveles de seguridad matemática de 140-256 bits para información estratégica con horizonte de protección a largo plazo (>10 años).',
      practicalAdvice:
        'La clave privada nunca debe tocar el disco duro sin cifrar; debe generarse o importarse directamente dentro de una Smartcard/Token Hardware FIPS 140-3.',
    },
  },
  {
    id: 'mass-signing',
    title: 'Firma Masiva de Documentos Legales y Contratos',
    shortDesc: 'Plataformas de firma digital por lotes, contratos notariales y miles de PDFs por minuto.',
    badge: 'Alto Rendimiento',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    icon: Zap,
    recommendation: {
      algorithm: 'Ed25519 (Curva Edwards de 256 bits)',
      subKey: 'Sin subclave de cifrado (solo clave de firma)',
      securityBits: '128 bits de seguridad efectiva (equivalente a RSA-3072)',
      nistStatus: 'Recomendado moderno (RFC 8032 / FIPS 186-5)',
      checkboxes: { sign: true, encrypt: false, certify: true, auth: false },
      validity: '2 años con certificación centralizada',
      validityReason: 'Estabilidad en la validación legal de contratos emitidos en el período.',
      passphrase: {
        length: '16+ caracteres gestionada por API / HSM',
        kdf: 'Argon2id / PKCS#11 HSM',
        hardware: 'HSM de red para firma automatizada con throughput acelerado',
      },
      symmetricCipher: 'N/A (Operación exclusiva de firma)',
      hashFunction: 'SHA-512 determinista (Ed25519 nativo)',
      tradeoffs: {
        generationTime: '< 0.05 segundos (Instantáneo)',
        signSpeed: '~13,000 firmas/segundo (Ultra rápida)',
        keySize: '~68 bytes (Firma de solo 64 bytes)',
        compatibility: 'Alta en sistemas modernos (GnuPG 2.1+, Node, Java, Go)',
      },
      justification:
        'EdDSA (Ed25519) es determinista (inmune a ataques por debilidad del generador de números aleatorios RNG) y genera firmas de tamaño diminuto (64 bytes) a más de 13,000 firmas por segundo.',
      practicalAdvice:
        'Desmarcar la casilla de cifrado si la clave se destina únicamente a sellado de tiempo y firma contractual, aislando las responsabilidades criptográficas.',
    },
  },
  {
    id: 'iot-embedded',
    title: 'Dispositivos IoT, Sensores y Móviles de Baja CPU',
    shortDesc: 'Microcontroladores (ESP32, ARM Cortex-M), telemetría segura y terminales portátiles.',
    badge: 'Bajo Consumo',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    icon: Cpu,
    recommendation: {
      algorithm: 'ECDSA (NIST P-256) o Ed25519',
      subKey: 'cv25519 / ECDH (P-256)',
      securityBits: '128 bits de seguridad efectiva',
      nistStatus: 'FIPS 186-5 & RFC 9580',
      checkboxes: { sign: true, encrypt: false, certify: false, auth: true },
      validity: '6 meses a 1 año con aprovisionamiento OTA',
      validityReason: 'Rotación periódica automatizada mediante protocolo seguro over-the-air.',
      passphrase: {
        length: 'Generada por hardware TRNG (sin intervención humana)',
        kdf: 'Derivación HKDF en chip seguro',
        hardware: 'Secure Element (ATECC608A / TPM 2.0 / ARM TrustZone)',
      },
      symmetricCipher: 'AES-128-CCM o ChaCha20-Poly1305',
      hashFunction: 'SHA-256',
      tradeoffs: {
        generationTime: 'Instantáneo (< 10 ms)',
        signSpeed: 'Consumo mínimo de miliwatts / ciclo de CPU',
        keySize: '~68 bytes (fácilmente transmitible por LoRa / BLE)',
        compatibility: 'Módulos IoT y librerías compactas (mbedTLS, wolfSSL)',
      },
      justification:
        'RSA de 3072/4096 bits requeriría un gasto energético prohibitivo en batería y almacenamiento de memoria RAM excesivo para un microcontrolador. Curvas elípticas brindan 128 bits de seguridad con claves de solo 256 bits.',
      practicalAdvice:
        'Utilizar claves efímeras y almacenar la identidad del dispositivo en el enclave seguro del procesador.',
    },
  },
  {
    id: 'ssh-remote',
    title: 'Acceso Remoto SSH y Autenticación de Servidores',
    shortDesc: 'Autenticación en clústeres Linux, servidores en la nube y repositorios Git mediante OpenPGP.',
    badge: 'Autenticación',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    icon: Terminal,
    recommendation: {
      algorithm: 'Ed25519 (OpenPGP Authentication Subkey)',
      subKey: 'cv25519 (para cifrado auxiliar si se requiere)',
      securityBits: '128 bits de seguridad efectiva',
      nistStatus: 'Estándar actual en OpenSSH 8.0+ y GnuPG',
      checkboxes: { sign: true, encrypt: false, certify: false, auth: true },
      validity: '1 a 2 años',
      validityReason: 'Facilita la gestión de llaves autorizadas en el archivo authorized_keys.',
      passphrase: {
        length: '16+ caracteres con gpg-agent y pinentry',
        kdf: 'S2K iterado con protección en memoria',
        hardware: 'YubiKey con soporte OpenPGP SmartCard applet',
      },
      symmetricCipher: 'AES-256-GCM',
      hashFunction: 'SHA-512',
      tradeoffs: {
        generationTime: 'Instantáneo',
        signSpeed: 'Ultra rápida en el handshake de conexión SSH',
        keySize: 'Muy compacta, una sola línea en ~/.ssh/authorized_keys',
        compatibility: 'Total en Linux, macOS y Windows 10/11 con OpenSSH',
      },
      justification:
        'Habilitar el checkbox "Autenticación (Auth)" en Kleopatra permite que gpg-agent actúe como ssh-agent emulado, usando una única clave criptográfica segura para correo, firmas Git y acceso SSH.',
      practicalAdvice:
        'En Kleopatra, abrir Preferencias Avanzadas y marcar explícitamente la casilla "Autenticación", la cual viene desmarcada por defecto.',
    },
  },
];

export const DecisionMatrixTab: React.FC = () => {
  const [subTab, setSubTab] = useState<'assistant' | 'benchmarks' | 'tables' | 'kleopatra-guide'>('assistant');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('academic');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const activeScenario = SCENARIOS.find(s => s.id === selectedScenarioId) || SCENARIOS[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
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
                  Matriz de Decisión Criptográfica & Kleopatra
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  NIST SP 800-57 · RFC 9580 · FIPS 186-5
                </span>
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
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUBTAB 1: Asistente Interactivo de Escenarios */}
      {subTab === 'assistant' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Scenario Selector Cards (Left Col) */}
          <div className="lg:col-span-4 flex flex-col gap-2.5">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider px-1">
              Seleccione el Escenario Operativo:
            </h3>
            <div className="flex flex-col gap-2">
              {SCENARIOS.map(sc => {
                const Icon = sc.icon;
                const isSelected = sc.id === selectedScenarioId;
                return (
                  <button
                    key={sc.id}
                    onClick={() => setSelectedScenarioId(sc.id)}
                    className={`text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 relative group ${
                      isSelected
                        ? 'bg-slate-900 border-amber-500/60 shadow-lg shadow-amber-500/5'
                        : 'bg-slate-950/60 border-slate-800/70 hover:border-slate-700 hover:bg-slate-900/40'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl flex-shrink-0 mt-0.5 ${
                        isSelected ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-sm text-slate-100 truncate">{sc.title}</span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{sc.shortDesc}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${sc.badgeColor}`}>
                          {sc.badge}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="absolute right-3 top-3.5 text-amber-400">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scenario Recommendation Details (Right Col) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {/* Header of Active Scenario */}
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider font-bold">
                    Recomendación Técnica Oficial
                  </span>
                  <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 mt-0.5">
                    {activeScenario.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono px-2.5 py-1 rounded-lg border font-semibold ${activeScenario.badgeColor}`}>
                    {activeScenario.badge}
                  </span>
                </div>
              </div>

              {/* Exact Kleopatra Configuration Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Algoritmo y Material de Clave */}
                <div className="bg-slate-950/70 border border-slate-800/80 p-3.5 rounded-xl flex flex-col gap-1.5">
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    Material de Clave (Algoritmo):
                  </span>
                  <p className="text-sm font-bold text-amber-300 font-mono">{activeScenario.recommendation.algorithm}</p>
                  <p className="text-xs text-slate-400 font-mono">Subclave: {activeScenario.recommendation.subKey}</p>
                  <div className="mt-1 pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">{activeScenario.recommendation.securityBits}</span>
                    <span className="text-emerald-400 font-semibold">NIST SP 800-57</span>
                  </div>
                </div>

                {/* Vigencia y Rotación */}
                <div className="bg-slate-950/70 border border-slate-800/80 p-3.5 rounded-xl flex flex-col gap-1.5">
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    Fecha de Caducidad ("Válido hasta"):
                  </span>
                  <p className="text-sm font-bold text-sky-300 font-mono">{activeScenario.recommendation.validity}</p>
                  <p className="text-xs text-slate-400">{activeScenario.recommendation.validityReason}</p>
                </div>
              </div>

              {/* Kleopatra Checkboxes Simulator */}
              <div className="bg-slate-950/90 border border-amber-500/30 p-4 rounded-xl">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" />
                    Casillas Exactas a Marcar en Kleopatra (Preferencias Avanzadas &gt; Uso del Certificado):
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">GUI Mapping</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { label: 'Firmado (Sign)', checked: activeScenario.recommendation.checkboxes.sign, desc: 'Autenticidad e Integridad' },
                    { label: 'Cifrado (Encrypt)', checked: activeScenario.recommendation.checkboxes.encrypt, desc: 'Confidencialidad' },
                    { label: 'Certificación (Certify)', checked: activeScenario.recommendation.checkboxes.certify, desc: 'Web of Trust' },
                    { label: 'Autenticación (Auth)', checked: activeScenario.recommendation.checkboxes.auth, desc: 'SSH / Acceso Remoto' },
                  ].map((cb, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border flex flex-col gap-1 transition-all ${
                        cb.checked
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-200 shadow-sm'
                          : 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {cb.checked ? (
                          <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-600 flex-shrink-0" />
                        )}
                        <span className="text-xs font-bold font-mono truncate">{cb.label}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 ml-6">{cb.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Passphrase & Protection */}
              <div className="bg-slate-950/70 border border-slate-800/80 p-4 rounded-xl flex flex-col gap-2">
                <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
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

              {/* Performance Tradeoffs & Justification */}
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
                    Fundamentación Técnica & Consejo Práctico:
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
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: Comparador de Rendimiento y Tiempos (Tabla H1) */}
      {subTab === 'benchmarks' && (
        <div className="flex flex-col gap-6">
          {/* Introductory Analysis Card */}
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-slate-100">
                Variables Operativas Críticas: ¿Por Qué Importan el Tiempo y el Rendimiento?
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              La elección del algoritmo no es solo una cuestión de «más bits = más seguro». En el uso real de
              Kleopatra y OpenPGP, la arquitectura algorítmica condiciona variables de experiencia de usuario,
              eficiencia de red y ancho de banda computacional:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono mt-1">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-amber-400 font-bold block mb-1">1. Generación de Claves</span>
                <span className="text-slate-400 text-[11px]">
                  RSA-4096 busca dos números primos de 2048 bits (8-30s). Ed25519 genera la clave de forma instantánea (&lt;0.1s).
                </span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-sky-400 font-bold block mb-1">2. Cifrado de Archivos</span>
                <span className="text-slate-400 text-[11px]">
                  Velocidad idéntica en todos: OpenPGP usa un esquema híbrido donde los datos se cifran con AES-256 (acelerado por hardware AES-NI).
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
          </div>

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
              <span className="text-xs font-mono bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-md border border-amber-500/30">
                Pruebas de Laboratorio UTP
              </span>
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
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px]">
                        Universal (100%)
                      </span>
                    </td>
                  </tr>

                  <tr className="bg-amber-500/5 hover:bg-amber-500/10 transition border-l-4 border-l-amber-500">
                    <td className="p-3.5 font-bold text-amber-300">
                      RSA 3072 bits
                      <span className="block text-[10px] text-emerald-400 font-normal">Recomendado Laboratorio UTP</span>
                    </td>
                    <td className="p-3.5 text-amber-300 font-semibold">3 - 8 seg</td>
                    <td className="p-3.5 text-sky-300">~80 firmas/s</td>
                    <td className="p-3.5 text-slate-300">Rápido (AES híbrido)</td>
                    <td className="p-3.5 text-purple-300">~900 bytes</td>
                    <td className="p-3.5 text-slate-300">384 bytes</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px]">
                        Universal (100%)
                      </span>
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
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px]">
                        Universal (99%)
                      </span>
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
                      <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/30 text-[10px]">
                        Alta (GnuPG 2.1+, SSH, TLS)
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Calculation Simulator: Why RSA-4096 takes time vs Ed25519 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex flex-col gap-2">
              <h4 className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1.5">
                <Info className="w-4 h-4" />
                ¿Por qué RSA-4096 escala tan pesadamente?
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Para aumentar la seguridad efectiva de 128 a 256 bits en RSA, la clave debe multiplicarse por cinco
                (de 3,072 a 15,360 bits). Esto se debe a que la <em>Criba General del Cuerpo de Números (GNFS)</em>{' '}
                factoriza enteros en tiempo sub-exponencial. El costo computacional de exponenciación modular se vuelve
                inviable operativamente para el uso diario.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex flex-col gap-2">
              <h4 className="text-xs font-mono font-bold text-sky-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                La ventaja matemática de Curvas Elípticas (Ed25519)
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                El problema del Logaritmo Discreto sobre Curvas Elípticas (ECDLP) no admite algoritmos de ataque
                sub-exponenciales conocidos. Por ende, para duplicar la seguridad solo se requiere duplicar la longitud de
                la curva (de 256 a 512 bits), manteniendo firmas y claves diminutas y tiempos de verificación instantáneos.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: Matrices Oficiales NIST & Comparativas Técnicas */}
      {subTab === 'tables' && (
        <div className="flex flex-col gap-6">
          {/* Tabla 4: NIST SP 800-57 Rev. 5 */}
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
                      <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold text-[10px] inline-flex items-center gap-1">
                        <XCircle className="w-3 h-3 text-rose-400" />
                        OBSOLETO (Inseguro)
                      </span>
                    </td>
                  </tr>

                  <tr className="bg-amber-500/5 hover:bg-amber-500/10">
                    <td className="p-3.5 font-bold text-amber-400">112 bits</td>
                    <td className="p-3.5 text-slate-300">3TDEA (Triple-DES)</td>
                    <td className="p-3.5 text-slate-300">2048 bits</td>
                    <td className="p-3.5 text-slate-300">224 bits</td>
                    <td className="p-3.5 text-slate-300">SHA-224</td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        LEGADO (Hasta 2030)
                      </span>
                    </td>
                  </tr>

                  <tr className="bg-emerald-500/5 hover:bg-emerald-500/10 border-l-4 border-l-emerald-500">
                    <td className="p-3.5 font-bold text-emerald-400">128 bits</td>
                    <td className="p-3.5 text-emerald-300 font-bold">AES-128</td>
                    <td className="p-3.5 text-emerald-300 font-bold">3072 bits</td>
                    <td className="p-3.5 text-emerald-300 font-bold">256 bits (Ed25519 / P-256)</td>
                    <td className="p-3.5 text-emerald-300 font-bold">SHA-256</td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[10px] inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        ESTÁNDAR VIGENTE (&gt;2030)
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-800/30">
                    <td className="p-3.5 font-bold text-sky-400">192 bits</td>
                    <td className="p-3.5 text-slate-300">AES-192</td>
                    <td className="p-3.5 text-slate-300">7688 bits</td>
                    <td className="p-3.5 text-slate-300">384 bits (P-384)</td>
                    <td className="p-3.5 text-slate-300">SHA-384</td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[10px]">
                        ALTA SEGURIDAD
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-800/30">
                    <td className="p-3.5 font-bold text-purple-400">256 bits</td>
                    <td className="p-3.5 text-slate-300">AES-256</td>
                    <td className="p-3.5 text-slate-300">15360 bits</td>
                    <td className="p-3.5 text-slate-300">512 / 521 bits (Ed448 / P-521)</td>
                    <td className="p-3.5 text-slate-300">SHA-512</td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px]">
                        MÁXIMA SEGURIDAD (CNSA 2.0)
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabla 1 & Tabla 2: Paradigmas y Algoritmos Asimétricos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tabla 1: Comparativa de Paradigmas */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col">
              <div className="p-4 bg-slate-900 border-b border-slate-800">
                <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-400" />
                  Tabla 1. Comparativa de Paradigmas Criptográficos
                </h4>
              </div>
              <div className="p-4 flex-1 flex flex-col gap-3 text-xs font-mono">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-200">1. Simétrica Pura (ej. AES-256)</span>
                    <span className="text-[10px] text-amber-400">Ultra Rápida</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Clave compartida única entre emisor y receptor. Excelente velocidad (AES-NI) sin límite de tamaño,
                    pero requiere un canal seguro previo para el intercambio de claves y no ofrece firma individual PKI.
                  </p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-200">2. Asimétrica Pura (ej. RSA-4096)</span>
                    <span className="text-[10px] text-rose-400">Muy Lenta</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Par de claves pública/privada. Distribución sencilla de claves públicas y soporte nativo de firmas,
                    pero matemáticamente no puede cifrar archivos mayores a su módulo (~500 bytes) y es 1,000x más lenta.
                  </p>
                </div>

                <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/30">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-amber-300">3. Esquema Híbrido OpenPGP (Recomendado)</span>
                    <span className="text-[10px] text-emerald-400 font-bold">Óptimo Universal</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Combina lo mejor de ambos: genera una clave de sesión efímera $K_s$ (AES-256) para cifrar los datos a
                    velocidad nativa, y encapsula $K_s$ con la clave pública asimétrica del destinatario junto a la firma SHA-512.
                  </p>
                </div>
              </div>
            </div>

            {/* Tabla 2: Comparativa Asimétrica */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col">
              <div className="p-4 bg-slate-900 border-b border-slate-800">
                <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-emerald-400" />
                  Tabla 2. Comparativa de Algoritmos Asimétricos
                </h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950/80 text-slate-400 text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">Algoritmo</th>
                      <th className="p-2.5">Firma / Cifra</th>
                      <th className="p-2.5">Riesgo Generador (RNG)</th>
                      <th className="p-2.5">Estado NIST</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-[11px]">
                    <tr>
                      <td className="p-2.5 font-bold text-slate-200">RSA</td>
                      <td className="p-2.5 text-emerald-400">Sí / Sí (Nativo)</td>
                      <td className="p-2.5 text-slate-300">Bajo en firma</td>
                      <td className="p-2.5 text-emerald-400 font-semibold">Vigente (≥2048 b)</td>
                    </tr>
                    <tr className="bg-rose-500/5">
                      <td className="p-2.5 font-bold text-rose-400">DSA</td>
                      <td className="p-2.5 text-slate-400">Solo Firma (NO cifra)</td>
                      <td className="p-2.5 text-rose-400 font-bold">Crítico (revela clave)</td>
                      <td className="p-2.5 text-rose-400 font-bold">RETIRADO / OBSOLETO</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-sky-300">ECDSA</td>
                      <td className="p-2.5 text-sky-400">Firma (Cifra c/ ECDH)</td>
                      <td className="p-2.5 text-amber-400">Crítico si falla RNG</td>
                      <td className="p-2.5 text-sky-300">Vigente (FIPS 186-5)</td>
                    </tr>
                    <tr className="bg-emerald-500/5">
                      <td className="p-2.5 font-bold text-emerald-300">EdDSA (Ed25519)</td>
                      <td className="p-2.5 text-emerald-400">Firma (Cifra c/ X25519)</td>
                      <td className="p-2.5 text-emerald-300 font-bold">Inmune (Determinista)</td>
                      <td className="p-2.5 text-emerald-300 font-bold">Moderno Recomendado</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-slate-950/80 border-t border-slate-800 text-[11px] font-mono text-slate-400">
                <span className="text-amber-400 font-bold">Nota técnica sobre FIPS 186-5:</span> En febrero de 2023,
                NIST retiró oficialmente la especificación para generación de claves DSA debido a sus vulnerabilidades y
                dependencia crítica de entropía aleatoria sin sesgo en cada firma.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: Mapeo de Kleopatra & 8 Variables Críticas */}
      {subTab === 'kleopatra-guide' && (
        <div className="flex flex-col gap-6">
          {/* Banner: Los 3 Pilares de la Huella Digital */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-950 border border-amber-500/30 p-5 rounded-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-slate-100">
                  La Huella Digital (Fingerprint) y sus Tres Pilares de Seguridad
                </h3>
              </div>
              <span className="text-xs font-mono bg-slate-900 text-slate-300 px-3 py-1 rounded-full border border-slate-800">
                SHA-1 / SHA-256 (40 caracteres Hex)
              </span>
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
                  clave pública cambia por completo la huella, detectando cualquier corrupción o ataque de modificación.
                </p>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-sky-500/30 flex flex-col gap-1.5">
                <span className="text-sky-400 font-bold flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4" />
                  2. Pilar Respaldado: AUTENTICIDAD
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Permite la verificación fuera de banda (<em>out-of-band</em>) mediante canal telefónico o presencial para
                  confirmar que la clave recibida pertenece genuinamente a su legítimo autor, anulando ataques Man-in-the-Middle.
                </p>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-purple-500/30 flex flex-col gap-1.5">
                <span className="text-purple-400 font-bold flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4" />
                  3. Pilar Derivado: NO REPUDIO
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Al vincularse de manera unívoca la identidad con la huella digital verificada, el titular no puede
                  desconocer legalmente ni repudiar las transacciones o documentos firmados con su clave privada.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Case Study: The 6-day vs 2-year expiration incident in the lab */}
          <div className="bg-rose-500/10 border border-rose-500/30 p-5 rounded-2xl flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <h4 className="text-sm font-bold text-rose-200">
                Auditoría de Incidencia Operativa Detectada en Laboratorio (Caso Real UTP)
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-rose-400 font-bold block mb-1">Hallazgo Detectado:</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  El certificado de Lady Luz Loayza Rodríguez se configuró con caducidad al 11/09/2026 (vigencia de solo
                  6 días desde la emisión el 05/09/2026), mientras que los demás integrantes (Harold Azaña, Abner Fonseca,
                  Galileo Rengifo) configuraron 2 años (hasta 2028).
                </p>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-emerald-400 font-bold block mb-1">Impacto & Remediación:</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Vencidos los 6 días, nadie puede cifrarle correos y sus firmas serán marcadas como inválidas por GnuPG.
                  Remediación en Kleopatra:{' '}
                  <em>Clic derecho en el certificado &gt; Cambiar fecha de caducidad</em> o reemitir con vigencia estándar
                  de 2 años.
                </p>
              </div>
            </div>
          </div>

          {/* The 8 Critical Variables of Kleopatra (Section J) */}
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
              {[
                {
                  id: 1,
                  title: '1. Certificado de Revocación',
                  where: 'Menú Certificados > Generar certificado de revocación',
                  why: 'Si la clave privada se pierde o se filtra, es IMPOSIBLE avisar a la red que la clave ya no es confiable sin un certificado de revocación. Se debe generar inmediatamente tras la clave y guardarlo en frío (USB/físico).',
                  severity: 'Crítico',
                  severityColor: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
                },
                {
                  id: 2,
                  title: '2. Copia de Seguridad (Backup) de Clave Privada',
                  where: 'Menú Archivo > Exportar clave secreta',
                  why: 'Si el disco del equipo falla y no existe respaldo, TODOS los archivos cifrados se pierden de manera irreversible. El backup debe guardarse cifrado en ubicación externa.',
                  severity: 'Crítico',
                  severityColor: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
                },
                {
                  id: 3,
                  title: '3. Clave Principal vs Subclave',
                  where: 'Doble clic en certificado > Pestaña Subclaves',
                  why: 'Kleopatra crea una clave principal (firma/certificación) y una subclave (cifrado). Si se compromete solo la subclave de cifrado, se puede revocar sin perder la identidad digital del usuario.',
                  severity: 'Estructural',
                  severityColor: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
                },
                {
                  id: 4,
                  title: '4. Nivel de Confianza (Trust Level) en Web of Trust',
                  where: 'Clic derecho > Cambiar nivel de confianza del propietario',
                  why: 'Define si GnuPG confiará en las firmas que ese tercero haga sobre otras claves. Niveles: Desconocido, Ninguno, Marginal, Completo, Absoluto.',
                  severity: 'Operativo',
                  severityColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
                },
                {
                  id: 5,
                  title: '5. Verificación de Huella antes de Certificar',
                  where: 'Botón "Certificar" de la barra de herramientas',
                  why: 'NUNCA firmar la clave de un tercero sin haber cotejado la huella de 40 dígitos por un canal seguro fuera de banda (llamada, presencial). Certificar a ciegas corrompe la red de confianza.',
                  severity: 'Crítico',
                  severityColor: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
                },
                {
                  id: 6,
                  title: '6. Servidor de Claves Seguro (Directory Services)',
                  where: 'Preferencias > Configurar Kleopatra > Directorio y servicios',
                  why: 'Usar siempre keys.openpgp.org (con verificación de email) en lugar de viejos servidores SKS pool que permitían ataques de envenenamiento de claves con miles de firmas espurias.',
                  severity: 'Seguridad de Red',
                  severityColor: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
                },
                {
                  id: 7,
                  title: '7. Algoritmo Simétrico Preferido (Carga de Datos)',
                  where: 'Preferencias > Configurar Kleopatra > Criptografía',
                  why: 'GnuPG usa por defecto AES-128 si no se especifica. Para cumplimiento con NIST SP 800-57 y FIPS 140-3 en datos críticos, se debe forzar AES-256 en las preferencias.',
                  severity: 'Cumplimiento',
                  severityColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
                },
                {
                  id: 8,
                  title: '8. Caducidad Diferenciada de Subclaves',
                  where: 'Clic derecho > Cambiar fecha de caducidad por subclave',
                  why: 'Estrategia recomendada: Clave principal con vigencia larga (5-10 años) y subclaves de cifrado rotadas anualmente. Protege la reputación sin forzar a los contactos a renovar toda la libreta.',
                  severity: 'Buenas Prácticas',
                  severityColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
                },
              ].map(item => (
                <div key={item.id} className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex flex-col gap-2">
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
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DecisionMatrixTab;
