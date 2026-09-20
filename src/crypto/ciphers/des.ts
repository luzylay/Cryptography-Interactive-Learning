// Data Encryption Standard (DES) & Triple-DES (3DES / TDEA) Engine
// Strict compliance with FIPS PUB 46-3 / ANSI X9.52
// Pure TypeScript Domain - Zero DOM/React dependencies

export interface DesRoundTrace {
  round: number;
  leftIn: string;   // 32-bit hex
  rightIn: string;  // 32-bit hex
  subKey: string;   // 48-bit hex
  expandedRight: string; // 48-bit hex
  xorSubkey: string;     // 48-bit hex
  sboxOutput: string;    // 32-bit hex
  pboxOutput: string;    // 32-bit hex
  leftOut: string;  // 32-bit hex
  rightOut: string; // 32-bit hex
}

export interface DesTraceResult {
  plaintextHex: string;
  afterIPHex: string;
  rounds: DesRoundTrace[];
  preOutputHex: string;
  ciphertextHex: string;
  cipherTextBase64: string;
}

// ─── Standard DES Permutation Tables (FIPS 46-3) ─────────────────────────────

const IP_TABLE = [
  58, 50, 42, 34, 26, 18, 10, 2,
  60, 52, 44, 36, 28, 20, 12, 4,
  62, 54, 46, 38, 30, 22, 14, 6,
  64, 56, 48, 40, 32, 24, 16, 8,
  57, 49, 41, 33, 25, 17, 9, 1,
  59, 51, 43, 35, 27, 19, 11, 3,
  61, 53, 45, 37, 29, 21, 13, 5,
  63, 55, 47, 39, 31, 23, 15, 7
];

const FP_TABLE = [
  40, 8, 48, 16, 56, 24, 64, 32,
  39, 7, 47, 15, 55, 23, 63, 31,
  38, 6, 46, 14, 54, 22, 62, 30,
  37, 5, 45, 13, 53, 21, 61, 29,
  36, 4, 44, 12, 52, 20, 60, 28,
  35, 3, 43, 11, 51, 19, 59, 27,
  34, 2, 42, 10, 50, 18, 58, 26,
  33, 1, 41, 9, 49, 17, 57, 25
];

const E_TABLE = [
  32, 1, 2, 3, 4, 5,
  4, 5, 6, 7, 8, 9,
  8, 9, 10, 11, 12, 13,
  12, 13, 14, 15, 16, 17,
  16, 17, 18, 19, 20, 21,
  20, 21, 22, 23, 24, 25,
  24, 25, 26, 27, 28, 29,
  28, 29, 30, 31, 32, 1
];

const P_TABLE = [
  16, 7, 20, 21, 29, 12, 28, 17,
  1, 15, 23, 26, 5, 18, 31, 10,
  2, 8, 24, 14, 32, 27, 3, 9,
  19, 13, 30, 6, 22, 11, 4, 25
];

const PC1_TABLE = [
  57, 49, 41, 33, 25, 17, 9,
  1, 58, 50, 42, 34, 26, 18,
  10, 2, 59, 51, 43, 35, 27,
  19, 11, 3, 60, 52, 44, 36,
  63, 55, 47, 39, 31, 23, 15,
  7, 62, 54, 46, 38, 30, 22,
  14, 6, 61, 53, 45, 37, 29,
  21, 13, 5, 28, 20, 12, 4
];

const PC2_TABLE = [
  14, 17, 11, 24, 1, 5, 3, 28,
  15, 6, 21, 10, 23, 19, 12, 4,
  26, 8, 16, 7, 27, 20, 13, 2,
  41, 52, 31, 37, 47, 55, 30, 40,
  51, 45, 33, 48, 44, 49, 39, 56,
  34, 53, 46, 42, 50, 36, 29, 32
];

const SHIFTS = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

const S_BOXES: number[][][] = [
  // S1
  [
    [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
    [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
    [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
    [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13]
  ],
  // S2
  [
    [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
    [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
    [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
    [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9]
  ],
  // S3
  [
    [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
    [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
    [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
    [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12]
  ],
  // S4
  [
    [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
    [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
    [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
    [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14]
  ],
  // S5
  [
    [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
    [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
    [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
    [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3]
  ],
  // S6
  [
    [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
    [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
    [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
    [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13]
  ],
  // S7
  [
    [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
    [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
    [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
    [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12]
  ],
  // S8
  [
    [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
    [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
    [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
    [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11]
  ]
];

// Helper bit permute
function permute(bits: string, table: number[]): string {
  let res = '';
  for (let pos of table) {
    res += bits[pos - 1];
  }
  return res;
}

// Convert string to 64-bit binary
function textTo64BitBin(str: string): string {
  let bin = '';
  for (let i = 0; i < 8; i++) {
    const code = i < str.length ? str.charCodeAt(i) & 0xff : 0;
    bin += code.toString(2).padStart(8, '0');
  }
  return bin;
}

function hexToBin(hex: string, length = 64): string {
  const clean = hex.replace(/[^0-9a-fA-F]/g, '');
  let bin = '';
  for (let i = 0; i < clean.length; i++) {
    bin += parseInt(clean[i], 16).toString(2).padStart(4, '0');
  }
  return bin.padEnd(length, '0').slice(0, length);
}

function binToHex(bin: string): string {
  let hex = '';
  for (let i = 0; i < bin.length; i += 4) {
    const chunk = bin.slice(i, i + 4);
    hex += parseInt(chunk, 2).toString(16).toUpperCase();
  }
  return hex;
}

function xorBits(a: string, b: string): string {
  let res = '';
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    res += a[i] === b[i] ? '0' : '1';
  }
  return res;
}

/**
 * Generates 16 subkeys of 48 bits each from a 64-bit key (FIPS 46-3)
 */
export function generateDesSubkeys(key64Bin: string): string[] {
  // PC-1: 64 bits -> 56 bits
  const key56 = permute(key64Bin, PC1_TABLE);
  let c = key56.slice(0, 28);
  let d = key56.slice(28, 56);
  const subkeys: string[] = [];

  for (let r = 0; r < 16; r++) {
    const shift = SHIFTS[r];
    c = c.slice(shift) + c.slice(0, shift);
    d = d.slice(shift) + d.slice(0, shift);
    const cd = c + d;
    // PC-2: 56 bits -> 48 bits
    subkeys.push(permute(cd, PC2_TABLE));
  }

  return subkeys;
}

/**
 * Feistel round function f(R, K)
 */
function feistelF(right32: string, subkey48: string): { expanded: string; xored: string; sboxOut: string; pboxOut: string } {
  // 1. Expansion E (32 -> 48)
  const expanded = permute(right32, E_TABLE);
  // 2. XOR with subkey
  const xored = xorBits(expanded, subkey48);

  // 3. 8 S-Boxes (6 bits in -> 4 bits out)
  let sboxOut = '';
  for (let i = 0; i < 8; i++) {
    const block = xored.slice(i * 6, (i + 1) * 6);
    const row = parseInt(block[0] + block[5], 2);
    const col = parseInt(block.slice(1, 5), 2);
    const val = S_BOXES[i][row][col];
    sboxOut += val.toString(2).padStart(4, '0');
  }

  // 4. Permutation P (32 -> 32)
  const pboxOut = permute(sboxOut, P_TABLE);

  return { expanded, xored, sboxOut, pboxOut };
}

/**
 * Encrypts a single 64-bit block using DES with full educational trace
 */
export function desEncryptBlockWithTrace(block64Bin: string, key64Bin: string): DesTraceResult {
  const subkeys = generateDesSubkeys(key64Bin);
  const ipBits = permute(block64Bin, IP_TABLE);

  let left = ipBits.slice(0, 32);
  let right = ipBits.slice(32, 64);
  const rounds: DesRoundTrace[] = [];

  for (let r = 0; r < 16; r++) {
    const k = subkeys[r];
    const { expanded, xored, sboxOut, pboxOut } = feistelF(right, k);
    const nextLeft = right;
    const nextRight = xorBits(left, pboxOut);

    rounds.push({
      round: r + 1,
      leftIn: binToHex(left),
      rightIn: binToHex(right),
      subKey: binToHex(k),
      expandedRight: binToHex(expanded),
      xorSubkey: binToHex(xored),
      sboxOutput: binToHex(sboxOut),
      pboxOutput: binToHex(pboxOut),
      leftOut: binToHex(nextLeft),
      rightOut: binToHex(nextRight),
    });

    left = nextLeft;
    right = nextRight;
  }

  // Pre-output (R16 || L16) inverted
  const preOutput = right + left;
  const ciphertextBin = permute(preOutput, FP_TABLE);
  const ciphertextHex = binToHex(ciphertextBin);

  return {
    plaintextHex: binToHex(block64Bin),
    afterIPHex: binToHex(ipBits),
    rounds,
    preOutputHex: binToHex(preOutput),
    ciphertextHex,
    cipherTextBase64: hexToBase64(ciphertextHex),
  };
}

/**
 * Decrypts a single 64-bit block using DES (reversing subkeys)
 */
export function desDecryptBlock(block64Bin: string, key64Bin: string): string {
  const subkeys = generateDesSubkeys(key64Bin).reverse();
  const ipBits = permute(block64Bin, IP_TABLE);

  let left = ipBits.slice(0, 32);
  let right = ipBits.slice(32, 64);

  for (let r = 0; r < 16; r++) {
    const k = subkeys[r];
    const { pboxOut } = feistelF(right, k);
    const nextLeft = right;
    const nextRight = xorBits(left, pboxOut);
    left = nextLeft;
    right = nextRight;
  }

  const preOutput = right + left;
  const decryptedBin = permute(preOutput, FP_TABLE);
  return binToHex(decryptedBin);
}

/**
 * Triple DES (3DES / TDEA) - EDE mode: C = E_k3(D_k2(E_k1(P)))
 */
export function tripleDesEncrypt(
  block64Bin: string,
  key1Bin: string,
  key2Bin: string,
  key3Bin: string = key1Bin
): string {
  // Step 1: Encrypt with Key 1
  const step1Hex = desEncryptBlockWithTrace(block64Bin, key1Bin).ciphertextHex;
  // Step 2: Decrypt with Key 2
  const step2Hex = desDecryptBlock(hexToBin(step1Hex), key2Bin);
  // Step 3: Encrypt with Key 3
  const step3Hex = desEncryptBlockWithTrace(hexToBin(step2Hex), key3Bin).ciphertextHex;
  return step3Hex;
}

/**
 * Triple DES Decrypt - D_k1(E_k2(D_k3(C)))
 */
export function tripleDesDecrypt(
  ciphertextHex: string,
  key1Bin: string,
  key2Bin: string,
  key3Bin: string = key1Bin
): string {
  // Step 1: Decrypt with Key 3
  const step1Hex = desDecryptBlock(hexToBin(ciphertextHex), key3Bin);
  // Step 2: Encrypt with Key 2
  const step2Hex = desEncryptBlockWithTrace(hexToBin(step1Hex), key2Bin).ciphertextHex;
  // Step 3: Decrypt with Key 1
  const step3Hex = desDecryptBlock(hexToBin(step2Hex), key1Bin);
  return step3Hex;
}

function hexToBase64(hex: string): string {
  let bytes: number[] = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.substr(i, 2), 16));
  }
  const binStr = String.fromCharCode(...bytes);
  try {
    return typeof btoa === 'function' ? btoa(binStr) : Buffer.from(binStr, 'binary').toString('base64');
  } catch {
    return '';
  }
}

export { textTo64BitBin, hexToBin, binToHex };
