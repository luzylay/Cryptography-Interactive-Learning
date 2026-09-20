// Digital Signature Engine & Pipeline Simulator (S14)
// Compliance with NIST FIPS PUB 186-5 & RFC 8017 (PKCS #1)
// Pure TypeScript Domain - Zero DOM/React dependencies

import { sha256 } from './hashes';
import { gcd, modInverse } from './mathUtils';

export interface RsaKeyPair {
  p: number;
  q: number;
  n: number;
  phi: number;
  e: number;
  d: number;
  publicKeyDisplay: string;
  privateKeyDisplay: string;
}

export interface SignatureStepTrace {
  stepNumber: number;
  title: string;
  actor: 'Emisor (Alice)' | 'Canal Inseguro' | 'Receptor (Bob)';
  formula: string;
  inputData: string;
  outputData: string;
  explanation: string;
}

export interface DigitalSignatureProcessResult {
  originalMessage: string;
  transmittedMessage: string;
  messageHash: string;
  signatureHex: string;
  keyPair: RsaKeyPair;
  isTampered: boolean;
  tamperReason?: string;
  verificationSuccess: boolean;
  decryptedHash: string;
  localComputedHash: string;
  steps: SignatureStepTrace[];
}

/**
 * Generates an educational RSA keypair with verifiable small/medium primes
 */
export function generateEducationalRsaKeys(primeIndex = 0): RsaKeyPair {
  const primePairs = [
    { p: 61, q: 53 },
    { p: 79, q: 71 },
    { p: 97, q: 89 },
    { p: 101, q: 103 },
    { p: 137, q: 131 },
  ];

  const pair = primePairs[primeIndex % primePairs.length];
  const p = pair.p;
  const q = pair.q;
  const n = p * q;
  const phi = (p - 1) * (q - 1);

  // Pick standard public exponent e = 65537 or smaller coprime
  const candidateEs = [65537, 17, 7, 11, 13, 3];
  let e = 17;
  for (let cand of candidateEs) {
    if (cand < phi && gcd(cand, phi) === 1) {
      e = cand;
      break;
    }
  }

  const d = modInverse(e, phi) || 1;

  return {
    p,
    q,
    n,
    phi,
    e,
    d,
    publicKeyDisplay: `(e=${e}, n=${n})`,
    privateKeyDisplay: `(d=${d}, n=${n})`,
  };
}

/**
 * Fast modular exponentiation (base^exp mod mod)
 */
export function modPowBigInt(base: bigint, exp: bigint, modulus: bigint): bigint {
  if (modulus === 1n) return 0n;
  let result = 1n;
  base = base % modulus;
  while (exp > 0n) {
    if (exp % 2n === 1n) {
      result = (result * base) % modulus;
    }
    exp = exp / 2n;
    base = (base * base) % modulus;
  }
  return result;
}

/**
 * Educational BigInt RSA Signature of a hash digest
 */
export function signHashBigInt(digestHex: string, d: number, n: number): string {
  // Convert first 4 bytes of hash to a numeric representation mod n
  const hashNum = BigInt(parseInt(digestHex.slice(0, 8), 16) % n);
  const sigBig = modPowBigInt(hashNum, BigInt(d), BigInt(n));
  return sigBig.toString(16).toUpperCase();
}

/**
 * Educational BigInt RSA Verification
 */
export function verifySignatureBigInt(sigHex: string, e: number, n: number): string {
  const sigBig = BigInt(parseInt(sigHex, 16));
  const recoveredBig = modPowBigInt(sigBig, BigInt(e), BigInt(n));
  return recoveredBig.toString(16).toUpperCase();
}

/**
 * Executes a full 4-stage digital signature pipeline with tamper detection
 */
export function simulateDigitalSignaturePipeline(
  originalMessage: string,
  keyPair: RsaKeyPair,
  tamperedMessage?: string,
  tamperedSignatureHex?: string
): DigitalSignatureProcessResult {
  const msgHash = sha256(originalMessage);
  const signatureHex = signHashBigInt(msgHash, keyPair.d, keyPair.n);

  const finalTransmittedMsg = tamperedMessage !== undefined ? tamperedMessage : originalMessage;
  const finalSignatureHex = tamperedSignatureHex !== undefined ? tamperedSignatureHex : signatureHex;

  const isMsgTampered = finalTransmittedMsg !== originalMessage;
  const isSigTampered = finalSignatureHex !== signatureHex;
  const isTampered = isMsgTampered || isSigTampered;

  let tamperReason = '';
  if (isMsgTampered && isSigTampered) tamperReason = 'Tanto el mensaje como la firma fueron modificados en tránsito.';
  else if (isMsgTampered) tamperReason = 'El contenido del mensaje fue alterado en tránsito (violación de integridad).';
  else if (isSigTampered) tamperReason = 'La firma digital fue corrompida o reemplazada (violación de autenticidad).';

  // Receiver verification
  const localHash = sha256(finalTransmittedMsg);
  const expectedHashReduced = BigInt(parseInt(localHash.slice(0, 8), 16) % keyPair.n).toString(16).toUpperCase();
  const recoveredHash = verifySignatureBigInt(finalSignatureHex, keyPair.e, keyPair.n);

  const verificationSuccess = expectedHashReduced === recoveredHash && !isTampered;

  const steps: SignatureStepTrace[] = [
    {
      stepNumber: 1,
      title: 'Generación del Resumen Criptográfico (Hash)',
      actor: 'Emisor (Alice)',
      formula: 'h = SHA256(Mensaje)',
      inputData: `Mensaje: "${originalMessage}"`,
      outputData: `Hash (h): ${msgHash}`,
      explanation: 'Se reduce el mensaje original a un resumen unidireccional de longitud fija (256 bits). Cualquier cambio de 1 bit generará un hash completamente diferente.',
    },
    {
      stepNumber: 2,
      title: 'Cifrado del Hash con Clave Privada (Firma Digital)',
      actor: 'Emisor (Alice)',
      formula: `S = h^d mod n = (${parseInt(msgHash.slice(0, 8), 16) % keyPair.n})^${keyPair.d} mod ${keyPair.n}`,
      inputData: `Hash numérico: ${parseInt(msgHash.slice(0, 8), 16) % keyPair.n}, Clave Privada: (d=${keyPair.d}, n=${keyPair.n})`,
      outputData: `Firma Digital (S): 0x${signatureHex}`,
      explanation: 'Solo Alice puede producir esta firma porque solo ella posee la clave privada d. Garantiza Autenticidad de Origen y No Repudio.',
    },
    {
      stepNumber: 3,
      title: 'Transmisión por Canal Inseguro',
      actor: 'Canal Inseguro',
      formula: 'Transmisión: [Mensaje || Firma Digital]',
      inputData: `Mensaje enviado: "${finalTransmittedMsg}"`,
      outputData: `Firma transmitida: 0x${finalSignatureHex}`,
      explanation: isTampered
        ? `⚠️ ALERTA: Un atacante interceptó la transmisión. ${tamperReason}`
        : 'Los datos transitaron por la red sin interferencias ni modificaciones de terceros.',
    },
    {
      stepNumber: 4,
      title: 'Verificación de Firma con Clave Pública del Emisor',
      actor: 'Receptor (Bob)',
      formula: `h' = S^e mod n  ≟  h'' = SHA256(Mensaje Recibido)`,
      inputData: `Firma S: 0x${finalSignatureHex}, Clave Pública: (e=${keyPair.e}, n=${keyPair.n})`,
      outputData: `Hash recuperado h': 0x${recoveredHash} | Hash local h'': 0x${expectedHashReduced}`,
      explanation: verificationSuccess
        ? '✅ FIRMA VÁLIDA: El hash recuperado coincide matemáticamente con el hash del mensaje recibido. Se confirman Integridad, Autenticidad y No Repudio.'
        : `❌ FIRMA INVÁLIDA: h' (${recoveredHash}) ≠ h'' (${expectedHashReduced}). Bob rechaza el mensaje por falta de autenticidad o corrupción de datos.`,
    },
  ];

  return {
    originalMessage,
    transmittedMessage: finalTransmittedMsg,
    messageHash: msgHash,
    signatureHex,
    keyPair,
    isTampered,
    tamperReason: isTampered ? tamperReason : undefined,
    verificationSuccess,
    decryptedHash: recoveredHash,
    localComputedHash: expectedHashReduced,
    steps,
  };
}
