// Numeric Bases and Bitwise Cryptographic Operations (S11)
// Pure TypeScript Domain - Zero DOM/React dependencies

export interface BaseConversionResult {
  text: string;
  binary: string;
  hex: string;
  octal: string;
  decimal: string;
  base64: string;
  asciiCodes: number[];
  bitCount: number;
  byteCount: number;
}

export interface BitwiseStep {
  operation: 'XOR' | 'AND' | 'OR' | 'NOT' | 'SHL' | 'SHR';
  operandA: string;
  operandB?: string;
  result: string;
  hexResult: string;
  explanation: string;
}

/**
 * Converts input text or hexadecimal into all standard numeric bases
 */
export function convertTextToBases(input: string): BaseConversionResult {
  if (!input) {
    return {
      text: '',
      binary: '',
      hex: '',
      octal: '',
      decimal: '',
      base64: '',
      asciiCodes: [],
      bitCount: 0,
      byteCount: 0,
    };
  }

  const asciiCodes: number[] = [];
  const binBytes: string[] = [];
  const hexBytes: string[] = [];
  const octBytes: string[] = [];
  const decBytes: string[] = [];

  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i) & 0xff; // 8-bit standard
    asciiCodes.push(code);
    binBytes.push(code.toString(2).padStart(8, '0'));
    hexBytes.push(code.toString(16).toUpperCase().padStart(2, '0'));
    octBytes.push(code.toString(8).padStart(3, '0'));
    decBytes.push(code.toString(10));
  }

  // Base64 encoding
  let base64 = '';
  try {
    if (typeof btoa === 'function') {
      base64 = btoa(unescape(encodeURIComponent(input)));
    } else {
      base64 = Buffer.from(input, 'utf-8').toString('base64');
    }
  } catch {
    base64 = 'N/A';
  }

  return {
    text: input,
    binary: binBytes.join(' '),
    hex: hexBytes.join(' '),
    octal: octBytes.join(' '),
    decimal: decBytes.join(' '),
    base64,
    asciiCodes,
    bitCount: asciiCodes.length * 8,
    byteCount: asciiCodes.length,
  };
}

/**
 * Converts a binary string (e.g., "01001000 01101111") back to text
 */
export function convertBinaryToText(binStr: string): string {
  const clean = binStr.replace(/[^01]/g, '');
  let result = '';
  for (let i = 0; i < clean.length; i += 8) {
    const chunk = clean.substring(i, i + 8);
    if (chunk.length === 8) {
      result += String.fromCharCode(parseInt(chunk, 2));
    }
  }
  return result;
}

/**
 * Converts a hexadecimal string (e.g., "48 65 6C 6C 6F") back to text
 */
export function convertHexToText(hexStr: string): string {
  const clean = hexStr.replace(/[^0-9a-fA-F]/g, '');
  let result = '';
  for (let i = 0; i < clean.length; i += 2) {
    const chunk = clean.substring(i, i + 2);
    if (chunk.length === 2) {
      result += String.fromCharCode(parseInt(chunk, 16));
    }
  }
  return result;
}

/**
 * Performs educational bitwise operations on two 8-bit / 32-bit values
 */
export function performBitwiseOp(
  valA: number,
  valB: number,
  op: 'XOR' | 'AND' | 'OR' | 'NOT' | 'SHL' | 'SHR',
  bitLength: 8 | 16 | 32 = 8
): BitwiseStep {
  const mask = bitLength === 8 ? 0xff : bitLength === 16 ? 0xffff : 0xffffffff;
  const a = valA & mask;
  const b = valB & mask;
  let res = 0;
  let explanation = '';

  const toBin = (v: number) => (v >>> 0).toString(2).padStart(bitLength, '0');
  const toHex = (v: number) => (v >>> 0).toString(16).toUpperCase().padStart(bitLength / 4, '0');

  switch (op) {
    case 'XOR':
      res = (a ^ b) & mask;
      explanation = `XOR bit a bit: Retorna 1 solo si los bits son distintos (1⊕0=1, 0⊕1=1, 1⊕1=0, 0⊕0=0). Propiedad clave: A ⊕ B ⊕ B = A (involución fundamental en Vernam, DES y AES).`;
      break;
    case 'AND':
      res = (a & b) & mask;
      explanation = `AND bit a bit: Retorna 1 solo si ambos bits son 1 (máscaras de selección de bits).`;
      break;
    case 'OR':
      res = (a | b) & mask;
      explanation = `OR bit a bit: Retorna 1 si al menos uno de los bits es 1.`;
      break;
    case 'NOT':
      res = (~a) & mask;
      explanation = `NOT (Complemento a 1): Invierte todos los bits (0→1, 1→0).`;
      break;
    case 'SHL':
      res = ((a << (b % bitLength))) & mask;
      explanation = `Desplazamiento a la izquierda (${b % bitLength} bits): Multiplica por 2^k en mod 2^${bitLength}.`;
      break;
    case 'SHR':
      res = (a >>> (b % bitLength)) & mask;
      explanation = `Desplazamiento lógico a la derecha (${b % bitLength} bits): División entera entre 2^k.`;
      break;
  }

  return {
    operation: op,
    operandA: toBin(a),
    operandB: op !== 'NOT' ? toBin(b) : undefined,
    result: toBin(res),
    hexResult: toHex(res),
    explanation,
  };
}

/**
 * Continuous XOR Encryption / Decryption (One-Time Pad / Stream Cipher model)
 */
export function xorEncryptDecrypt(text: string, key: string): { resultText: string; hex: string; binary: string } {
  if (!text || !key) return { resultText: text, hex: '', binary: '' };

  let hexArr: string[] = [];
  let binArr: string[] = [];
  let outChars: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const textByte = text.charCodeAt(i) & 0xff;
    const keyByte = key.charCodeAt(i % key.length) & 0xff;
    const xorByte = textByte ^ keyByte;

    hexArr.push(xorByte.toString(16).toUpperCase().padStart(2, '0'));
    binArr.push(xorByte.toString(2).padStart(8, '0'));
    outChars.push(String.fromCharCode(xorByte));
  }

  return {
    resultText: outChars.join(''),
    hex: hexArr.join(' '),
    binary: binArr.join(' '),
  };
}
