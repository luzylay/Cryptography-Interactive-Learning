// Advanced Encryption Standard (AES / Rijndael-128) Engine
// Strict compliance with NIST FIPS PUB 197
// Pure TypeScript Domain - Zero DOM/React dependencies

export type AesMatrix4x4 = number[][]; // 4 rows, 4 columns of bytes (0..255)

export interface AesRoundTrace {
  round: number;
  startState: AesMatrix4x4;
  afterSubBytes?: AesMatrix4x4;
  afterShiftRows?: AesMatrix4x4;
  afterMixColumns?: AesMatrix4x4;
  afterAddRoundKey: AesMatrix4x4;
  roundKey: AesMatrix4x4;
}

export interface AesTraceResult {
  plaintextHex: string;
  keyHex: string;
  rounds: AesRoundTrace[];
  ciphertextHex: string;
  ciphertextBase64: string;
}

// ─── Rijndael S-Box and Inverse S-Box (FIPS 197) ─────────────────────────────

const S_BOX: number[] = [
  0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
  0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
  0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
  0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
  0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
  0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
  0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
  0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
  0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
  0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
  0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5e, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
  0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
  0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
  0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
  0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
  0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16
];

const INV_S_BOX: number[] = new Array(256);
for (let i = 0; i < 256; i++) {
  INV_S_BOX[S_BOX[i]] = i;
}

const RCON = [
  0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36
];

// ─── Galois Field GF(2^8) Arithmetic ────────────────────────────────────────

/**
 * Multiplication in GF(2^8) with irreducible polynomial m(x) = x^8 + x^4 + x^3 + x + 1 (0x11b)
 */
export function galoisMultiply(a: number, b: number): number {
  let p = 0;
  for (let i = 0; i < 8; i++) {
    if ((b & 1) !== 0) {
      p ^= a;
    }
    const hiBitSet = (a & 0x80) !== 0;
    a = (a << 1) & 0xff;
    if (hiBitSet) {
      a ^= 0x1b; // x^8 mod (x^8 + x^4 + x^3 + x + 1)
    }
    b >>>= 1;
  }
  return p;
}

// ─── Key Expansion (128-bit) ────────────────────────────────────────────────

export function expandKey128(keyBytes: number[]): AesMatrix4x4[] {
  const w: number[][] = [];
  for (let i = 0; i < 4; i++) {
    w.push([keyBytes[4 * i], keyBytes[4 * i + 1], keyBytes[4 * i + 2], keyBytes[4 * i + 3]]);
  }

  for (let i = 4; i < 44; i++) {
    let temp = [...w[i - 1]];
    if (i % 4 === 0) {
      // RotWord
      const rot = [temp[1], temp[2], temp[3], temp[0]];
      // SubWord
      temp = rot.map(b => S_BOX[b]);
      // Rcon XOR
      temp[0] ^= RCON[i / 4];
    }
    const newWord = [
      w[i - 4][0] ^ temp[0],
      w[i - 4][1] ^ temp[1],
      w[i - 4][2] ^ temp[2],
      w[i - 4][3] ^ temp[3],
    ];
    w.push(newWord);
  }

  // Group into 11 round keys of 4x4 matrix
  const roundKeys: AesMatrix4x4[] = [];
  for (let r = 0; r < 11; r++) {
    const matrix: AesMatrix4x4 = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    for (let c = 0; c < 4; c++) {
      const word = w[r * 4 + c];
      for (let row = 0; row < 4; row++) {
        matrix[row][c] = word[row];
      }
    }
    roundKeys.push(matrix);
  }

  return roundKeys;
}

// ─── 4 State Transformations ────────────────────────────────────────────────

export function subBytes(state: AesMatrix4x4): AesMatrix4x4 {
  return state.map(row => row.map(b => S_BOX[b]));
}

export function invSubBytes(state: AesMatrix4x4): AesMatrix4x4 {
  return state.map(row => row.map(b => INV_S_BOX[b]));
}

export function shiftRows(state: AesMatrix4x4): AesMatrix4x4 {
  return [
    [state[0][0], state[0][1], state[0][2], state[0][3]],
    [state[1][1], state[1][2], state[1][3], state[1][0]],
    [state[2][2], state[2][3], state[2][0], state[2][1]],
    [state[3][3], state[3][0], state[3][1], state[3][2]],
  ];
}

export function invShiftRows(state: AesMatrix4x4): AesMatrix4x4 {
  return [
    [state[0][0], state[0][1], state[0][2], state[0][3]],
    [state[1][3], state[1][0], state[1][1], state[1][2]],
    [state[2][2], state[2][3], state[2][0], state[2][1]],
    [state[3][1], state[3][2], state[3][3], state[3][0]],
  ];
}

export function mixColumns(state: AesMatrix4x4): AesMatrix4x4 {
  const result: AesMatrix4x4 = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let c = 0; c < 4; c++) {
    const s0 = state[0][c], s1 = state[1][c], s2 = state[2][c], s3 = state[3][c];
    result[0][c] = galoisMultiply(s0, 2) ^ galoisMultiply(s1, 3) ^ s2 ^ s3;
    result[1][c] = s0 ^ galoisMultiply(s1, 2) ^ galoisMultiply(s2, 3) ^ s3;
    result[2][c] = s0 ^ s1 ^ galoisMultiply(s2, 2) ^ galoisMultiply(s3, 3);
    result[3][c] = galoisMultiply(s0, 3) ^ s1 ^ s2 ^ galoisMultiply(s3, 2);
  }

  return result;
}

export function invMixColumns(state: AesMatrix4x4): AesMatrix4x4 {
  const result: AesMatrix4x4 = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let c = 0; c < 4; c++) {
    const s0 = state[0][c], s1 = state[1][c], s2 = state[2][c], s3 = state[3][c];
    result[0][c] = galoisMultiply(s0, 0x0e) ^ galoisMultiply(s1, 0x0b) ^ galoisMultiply(s2, 0x0d) ^ galoisMultiply(s3, 0x09);
    result[1][c] = galoisMultiply(s0, 0x09) ^ galoisMultiply(s1, 0x0e) ^ galoisMultiply(s2, 0x0b) ^ galoisMultiply(s3, 0x0d);
    result[2][c] = galoisMultiply(s0, 0x0d) ^ galoisMultiply(s1, 0x09) ^ galoisMultiply(s2, 0x0e) ^ galoisMultiply(s3, 0x0b);
    result[3][c] = galoisMultiply(s0, 0x0b) ^ galoisMultiply(s1, 0x0d) ^ galoisMultiply(s2, 0x09) ^ galoisMultiply(s3, 0x0e);
  }

  return result;
}

export function addRoundKey(state: AesMatrix4x4, roundKey: AesMatrix4x4): AesMatrix4x4 {
  return state.map((row, r) => row.map((b, c) => b ^ roundKey[r][c]));
}

// ─── Helpers: Matrix & Hex conversion ────────────────────────────────────────

export function bytesToMatrix(bytes: number[]): AesMatrix4x4 {
  const mat: AesMatrix4x4 = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 4; r++) {
      mat[r][c] = bytes[c * 4 + r] || 0;
    }
  }
  return mat;
}

export function matrixToBytes(mat: AesMatrix4x4): number[] {
  const bytes: number[] = [];
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 4; r++) {
      bytes.push(mat[r][c]);
    }
  }
  return bytes;
}

export function matrixToHex(mat: AesMatrix4x4): string {
  return matrixToBytes(mat)
    .map(b => b.toString(16).padStart(2, '0').toUpperCase())
    .join('');
}

export function hexToBytes(hexStr: string, targetLength = 16): number[] {
  const clean = hexStr.replace(/[^0-9a-fA-F]/g, '');
  const bytes: number[] = [];
  for (let i = 0; i < clean.length; i += 2) {
    bytes.push(parseInt(clean.slice(i, i + 2), 16));
  }
  while (bytes.length < targetLength) {
    bytes.push(0);
  }
  return bytes.slice(0, targetLength);
}

export function textTo16Bytes(text: string): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < 16; i++) {
    bytes.push(i < text.length ? text.charCodeAt(i) & 0xff : 0);
  }
  return bytes;
}

// ─── AES-128 Encrypt & Trace ────────────────────────────────────────────────

export function aes128EncryptBlockWithTrace(
  plaintextBytes: number[],
  keyBytes: number[]
): AesTraceResult {
  const roundKeys = expandKey128(keyBytes);
  const rounds: AesRoundTrace[] = [];

  let state = bytesToMatrix(plaintextBytes);

  // Round 0: Initial AddRoundKey
  const round0State = addRoundKey(state, roundKeys[0]);
  rounds.push({
    round: 0,
    startState: state,
    afterAddRoundKey: round0State,
    roundKey: roundKeys[0],
  });
  state = round0State;

  // Rounds 1 to 9: SubBytes, ShiftRows, MixColumns, AddRoundKey
  for (let r = 1; r <= 9; r++) {
    const start = state;
    const afterSub = subBytes(start);
    const afterShift = shiftRows(afterSub);
    const afterMix = mixColumns(afterShift);
    const afterKey = addRoundKey(afterMix, roundKeys[r]);

    rounds.push({
      round: r,
      startState: start,
      afterSubBytes: afterSub,
      afterShiftRows: afterShift,
      afterMixColumns: afterMix,
      afterAddRoundKey: afterKey,
      roundKey: roundKeys[r],
    });

    state = afterKey;
  }

  // Round 10: SubBytes, ShiftRows, AddRoundKey (NO MixColumns)
  const round10Start = state;
  const r10Sub = subBytes(round10Start);
  const r10Shift = shiftRows(r10Sub);
  const r10Key = addRoundKey(r10Shift, roundKeys[10]);

  rounds.push({
    round: 10,
    startState: round10Start,
    afterSubBytes: r10Sub,
    afterShiftRows: r10Shift,
    afterAddRoundKey: r10Key,
    roundKey: roundKeys[10],
  });

  const ciphertextHex = matrixToHex(r10Key);

  let b64 = '';
  try {
    const raw = String.fromCharCode(...matrixToBytes(r10Key));
    b64 = typeof btoa === 'function' ? btoa(raw) : Buffer.from(raw, 'binary').toString('base64');
  } catch {
    b64 = 'N/A';
  }

  return {
    plaintextHex: matrixToHex(bytesToMatrix(plaintextBytes)),
    keyHex: matrixToHex(bytesToMatrix(keyBytes)),
    rounds,
    ciphertextHex,
    ciphertextBase64: b64,
  };
}

/**
 * AES-128 Decrypt a single 16-byte block
 */
export function aes128DecryptBlock(ciphertextBytes: number[], keyBytes: number[]): number[] {
  const roundKeys = expandKey128(keyBytes);
  let state = bytesToMatrix(ciphertextBytes);

  // Round 10: InvAddRoundKey, InvShiftRows, InvSubBytes
  state = addRoundKey(state, roundKeys[10]);
  state = invShiftRows(state);
  state = invSubBytes(state);

  // Rounds 9 down to 1
  for (let r = 9; r >= 1; r--) {
    state = addRoundKey(state, roundKeys[r]);
    state = invMixColumns(state);
    state = invShiftRows(state);
    state = invSubBytes(state);
  }

  // Round 0
  state = addRoundKey(state, roundKeys[0]);
  return matrixToBytes(state);
}

// ─── Block Cipher Modes of Operation (ECB vs CBC) ───────────────────────────

export interface ModeBlockResult {
  index: number;
  inputPlaintextHex: string;
  ivHex?: string;
  xoredPlaintextHex?: string;
  ciphertextHex: string;
}

export function aesEncryptEcb(blocks: number[][], keyBytes: number[]): ModeBlockResult[] {
  return blocks.map((blk, idx) => {
    const res = aes128EncryptBlockWithTrace(blk, keyBytes);
    return {
      index: idx,
      inputPlaintextHex: res.plaintextHex,
      ciphertextHex: res.ciphertextHex,
    };
  });
}

export function aesEncryptCbc(blocks: number[][], keyBytes: number[], ivBytes: number[]): ModeBlockResult[] {
  let prevCipher = [...ivBytes];
  const results: ModeBlockResult[] = [];

  for (let i = 0; i < blocks.length; i++) {
    const blk = blocks[i];
    const xored = blk.map((b, idx) => b ^ prevCipher[idx]);
    const res = aes128EncryptBlockWithTrace(xored, keyBytes);

    results.push({
      index: i,
      inputPlaintextHex: matrixToHex(bytesToMatrix(blk)),
      ivHex: matrixToHex(bytesToMatrix(prevCipher)),
      xoredPlaintextHex: matrixToHex(bytesToMatrix(xored)),
      ciphertextHex: res.ciphertextHex,
    });

    prevCipher = hexToBytes(res.ciphertextHex, 16);
  }

  return results;
}
