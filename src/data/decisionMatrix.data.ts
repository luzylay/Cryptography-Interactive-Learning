// Decoupled Decision Matrix & Cryptographic Engineering Data

export interface ScenarioTradeoffs {
  generationTime: string;
  signSpeed: string;
  keySize: string;
  compatibility: string;
}

export interface ScenarioPassphrase {
  length: string;
  kdf: string;
  hardware: string;
}

export interface ScenarioRecommendation {
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
  passphrase: ScenarioPassphrase;
  symmetricCipher: string;
  hashFunction: string;
  tradeoffs: ScenarioTradeoffs;
  justification: string;
  practicalAdvice: string;
}

export interface DecisionScenario {
  id: string;
  title: string;
  shortDesc: string;
  badge: string;
  badgeColor: string;
  iconName: 'Award' | 'Server' | 'ShieldAlert' | 'Zap' | 'Cpu' | 'Terminal';
  recommendation: ScenarioRecommendation;
}

export interface KleopatraCriticalVariable {
  id: number;
  title: string;
  where: string;
  why: string;
  severity: string;
  severityColor: string;
}

export const SCENARIOS: DecisionScenario[] = [
  {
    id: 'academic',
    title: 'Laboratorio Académico / Práctica Universitaria',
    shortDesc: 'Prácticas de laboratorio, aprendizaje de OpenPGP y validación de firmas.',
    badge: 'Uso Educativo',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    iconName: 'Award',
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
    iconName: 'Server',
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
    iconName: 'ShieldAlert',
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
    iconName: 'Zap',
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
    iconName: 'Cpu',
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
    iconName: 'Terminal',
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

export const KLEOPATRA_VARIABLES: KleopatraCriticalVariable[] = [
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
];
