// TLS / SSL Handshake Simulator & PKI X.509 Engine (S15)
// Compliance with RFC 8446 (TLS 1.3), RFC 5280 (X.509 v3), CA/B Forum Baseline Requirements
// Pure TypeScript Domain - Zero DOM/React dependencies

export type CertificateValidationType = 'DV' | 'OV' | 'EV';

export interface X509Certificate {
  id: string;
  type: 'Root_CA' | 'Intermediate_CA' | 'Leaf_Server';
  validationLevel: CertificateValidationType;
  commonName: string;
  organization: string;
  country: string;
  issuerCN: string;
  serialNumber: string;
  validFrom: string;
  validTo: string;
  publicKeyAlgorithm: string;
  keyLengthBits: number;
  signatureAlgorithm: string;
  signatureHex: string;
  subjectAltNames: string[];
  ocspUrl: string;
  crlUrl: string;
}

export interface TlsHandshakeStep {
  stepIndex: number;
  protocol: 'TLS 1.3' | 'TLS 1.2';
  direction: 'Client -> Server' | 'Server -> Client' | 'Internal Calculation';
  messageName: string;
  summary: string;
  packetDetails: {
    cipherSuites?: string[];
    selectedCipherSuite?: string;
    keyExchange?: string;
    certificatesChain?: string[];
    keysDerived?: string[];
    encryptedDataPreview?: string;
  };
  explanation: string;
}

export interface TlsSessionState {
  domain: string;
  validationType: CertificateValidationType;
  protocolVersion: 'TLS 1.3' | 'TLS 1.2';
  cipherSuite: string;
  certificateChain: X509Certificate[];
  handshakeSteps: TlsHandshakeStep[];
  sessionKeyHex: string;
  isConnected: boolean;
}

/**
 * Creates realistic educational X.509 certificate chains based on validation level
 */
export function buildCertificateChain(domain: string, validationType: CertificateValidationType): X509Certificate[] {
  const rootCA: X509Certificate = {
    id: 'root-ca',
    type: 'Root_CA',
    validationLevel: 'EV',
    commonName: 'GlobalTrust Root Certification Authority G3',
    organization: 'GlobalTrust PKI Trust Services LLC',
    country: 'US',
    issuerCN: 'GlobalTrust Root Certification Authority G3', // Self-signed
    serialNumber: '04:A2:89:11:F5:BB:90:3E',
    validFrom: '2015-01-01',
    validTo: '2040-12-31',
    publicKeyAlgorithm: 'RSA',
    keyLengthBits: 4096,
    signatureAlgorithm: 'SHA384withRSA',
    signatureHex: '9E:4B:1A:F0:88:C2:... (Autofirmado Confiable en Almacén del SO)',
    subjectAltNames: ['GlobalTrust Root CA'],
    ocspUrl: 'http://ocsp.globaltrust.org',
    crlUrl: 'http://crl.globaltrust.org/root-g3.crl',
  };

  const intermediateCA: X509Certificate = {
    id: 'intermediate-ca',
    type: 'Intermediate_CA',
    validationLevel: 'OV',
    commonName: 'GlobalTrust Server TLS CA 2024',
    organization: 'GlobalTrust Intermediate Services',
    country: 'US',
    issuerCN: 'GlobalTrust Root Certification Authority G3',
    serialNumber: '1A:88:CC:34:00:FF:12:90',
    validFrom: '2020-06-01',
    validTo: '2030-05-31',
    publicKeyAlgorithm: 'ECDSA',
    keyLengthBits: 384,
    signatureAlgorithm: 'SHA384withECDSA',
    signatureHex: '3C:F1:8A:29:44:B0:... (Firmado por Root CA)',
    subjectAltNames: ['GlobalTrust Intermediate CA'],
    ocspUrl: 'http://ocsp.globaltrust.org/intermediate',
    crlUrl: 'http://crl.globaltrust.org/intermediate-2024.crl',
  };

  let orgName = 'Domain Registrant';
  if (validationType === 'OV') orgName = 'Acme Corporation S.A.C. (Registrado en SUNARP/SEC)';
  if (validationType === 'EV') orgName = 'Acme Global Banking Technologies Inc. (Máxima Validación Legal)';

  const leafCert: X509Certificate = {
    id: 'leaf-cert',
    type: 'Leaf_Server',
    validationLevel: validationType,
    commonName: domain,
    organization: orgName,
    country: validationType === 'DV' ? 'N/A (Solo Validación de Dominio)' : 'PE',
    issuerCN: 'GlobalTrust Server TLS CA 2024',
    serialNumber: '7F:33:9A:12:E4:88:61:C0',
    validFrom: '2026-01-01',
    validTo: '2027-01-01',
    publicKeyAlgorithm: 'ECDSA (NIST P-256)',
    keyLengthBits: 256,
    signatureAlgorithm: 'SHA256withECDSA',
    signatureHex: '8A:90:EE:12:77:4B:... (Firmado por Intermediate CA)',
    subjectAltNames: [domain, `www.${domain}`, `api.${domain}`],
    ocspUrl: 'http://ocsp.globaltrust.org/check',
    crlUrl: 'http://crl.globaltrust.org/leaf-status.crl',
  };

  return [rootCA, intermediateCA, leafCert];
}

/**
 * Generates TLS 1.3 and TLS 1.2 Handshake simulation steps
 */
export function simulateTlsHandshake(
  domain: string,
  validationType: CertificateValidationType,
  protocol: 'TLS 1.3' | 'TLS 1.2' = 'TLS 1.3'
): TlsSessionState {
  const certChain = buildCertificateChain(domain, validationType);
  const cipherSuite = protocol === 'TLS 1.3' 
    ? 'TLS_AES_256_GCM_SHA384' 
    : 'TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384';

  const steps: TlsHandshakeStep[] = [];

  if (protocol === 'TLS 1.3') {
    // 1-RTT TLS 1.3 Handshake
    steps.push({
      stepIndex: 1,
      protocol: 'TLS 1.3',
      direction: 'Client -> Server',
      messageName: 'ClientHello + KeyShare (ECDH Share)',
      summary: 'El cliente propone suites criptográficas y envía su clave pública efímera ECDH de antemano.',
      packetDetails: {
        cipherSuites: ['TLS_AES_256_GCM_SHA384', 'TLS_CHACHA20_POLY1305_SHA256', 'TLS_AES_128_GCM_SHA256'],
        keyExchange: 'ECDH Share (x25519 Clave Pública Efímera del Cliente)',
      },
      explanation: 'En TLS 1.3 (RFC 8446), el cliente envía su aporte para el intercambio Diffie-Hellman en el primer paquete, reduciendo el retraso de ida y vuelta a 1 RTT (Zero Round Trip Time).',
    });

    steps.push({
      stepIndex: 2,
      protocol: 'TLS 1.3',
      direction: 'Server -> Client',
      messageName: 'ServerHello + KeyShare + EncryptedExtensions',
      summary: 'El servidor selecciona la suite AES-256-GCM y envía su parte ECDH.',
      packetDetails: {
        selectedCipherSuite: cipherSuite,
        keyExchange: 'ECDH Share (x25519 Clave Pública Efímera del Servidor)',
        certificatesChain: [certChain[2].commonName, certChain[1].commonName],
      },
      explanation: 'Ambas partes combinan sus aportes ECDH para derivar el secreto compartido `Handshake Secret`. A partir de este momento, todo el tráfico posterior del handshake viaja completamente cifrado.',
    });

    steps.push({
      stepIndex: 3,
      protocol: 'TLS 1.3',
      direction: 'Server -> Client',
      messageName: 'Certificate + CertificateVerify + Finished',
      summary: 'El servidor envía su cadena de certificados X.509 y la firma digital que prueba la posesión de la clave privada.',
      packetDetails: {
        certificatesChain: certChain.map(c => `${c.commonName} (${c.type})`),
        keysDerived: ['Client Application Traffic Secret', 'Server Application Traffic Secret', 'Master Secret'],
      },
      explanation: 'El navegador verifica la cadena criptográfica hasta la Root CA almacenada en el sistema operativo y comprueba la vigencia y no-revocación.',
    });

    steps.push({
      stepIndex: 4,
      protocol: 'TLS 1.3',
      direction: 'Client -> Server',
      messageName: 'Finished + Cifrado de Datos de Aplicación (HTTP/2 o HTTP/3)',
      summary: 'El canal seguro queda establecido y se inicia la transmisión HTTPS con AES-256-GCM.',
      packetDetails: {
        encryptedDataPreview: 'GET / HTTP/2 (Payload cifrado con AEAD AES-256-GCM)',
      },
      explanation: 'Canal seguro 100% operativo con Secreto Perfecto hacia Adelante (PFS - Perfect Forward Secrecy). Si las claves maestras del servidor se vieran comprometidas en el futuro, las sesiones pasadas no pueden descifrarse.',
    });
  } else {
    // 2-RTT TLS 1.2 Handshake
    steps.push({
      stepIndex: 1,
      protocol: 'TLS 1.2',
      direction: 'Client -> Server',
      messageName: 'ClientHello',
      summary: 'El cliente anuncia versiones compatibles (TLS 1.2) y lista de Cipher Suites soportadas.',
      packetDetails: {
        cipherSuites: ['TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384', 'TLS_RSA_WITH_AES_128_CBC_SHA'],
      },
      explanation: 'Envío de número aleatorio ClientRandom y catálogo de algoritmos soportados.',
    });

    steps.push({
      stepIndex: 2,
      protocol: 'TLS 1.2',
      direction: 'Server -> Client',
      messageName: 'ServerHello + Certificate + ServerKeyExchange + ServerHelloDone',
      summary: 'El servidor elige suite, entrega certificados y parámetros de curva elíptica firmados.',
      packetDetails: {
        selectedCipherSuite: cipherSuite,
        certificatesChain: certChain.map(c => c.commonName),
      },
      explanation: 'El servidor transmite su ServerRandom, certificado X.509 y parámetros ECDHE.',
    });

    steps.push({
      stepIndex: 3,
      protocol: 'TLS 1.2',
      direction: 'Client -> Server',
      messageName: 'ClientKeyExchange + ChangeCipherSpec + Finished',
      summary: 'El cliente envía su clave pública ECDHE y activa el cifrado simétrico.',
      packetDetails: {
        keysDerived: ['Pre-Master Secret (PMS)', 'Master Secret (48 bytes)', 'Session Keys'],
      },
      explanation: 'Se calculan las claves simétricas de sesión mediante la función PRF (Pseudo-Random Function).',
    });

    steps.push({
      stepIndex: 4,
      protocol: 'TLS 1.2',
      direction: 'Server -> Client',
      messageName: 'ChangeCipherSpec + Finished + Datos HTTPS Cifrados',
      summary: 'El servidor confirma la activación de la cifra y comienza el intercambio seguro.',
      packetDetails: {
        encryptedDataPreview: 'GET /index.html (AES-256-GCM)',
      },
      explanation: 'Conexión HTTPS completada tras 2 RTT de negociación.',
    });
  }

  return {
    domain,
    validationType,
    protocolVersion: protocol,
    cipherSuite,
    certificateChain: certChain,
    handshakeSteps: steps,
    sessionKeyHex: 'A7:9F:44:B2:81:CC:09:55:E2:31:8B:7F:40:99:2D:14',
    isConnected: true,
  };
}
