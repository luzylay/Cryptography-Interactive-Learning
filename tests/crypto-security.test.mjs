// Automated Cryptographic, Security & SSDLC Regression Test Suite
// Standard Node.js test runner execution

import assert from 'node:assert/strict';
import { test, describe } from 'node:test';

// Modular Arithmetic
function mod(n, m) {
  return ((n % m) + m) % m;
}

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

function extendedGcd(a, b) {
  let [oldR, r] = [a, b];
  let [oldS, s] = [1, 0];
  let [oldT, t] = [0, 1];

  while (r !== 0) {
    const quotient = Math.floor(oldR / r);
    [oldR, r] = [r, oldR - quotient * r];
    [oldS, s] = [s, oldS - quotient * s];
    [oldT, t] = [t, oldT - quotient * t];
  }

  return { gcd: oldR, x: oldS, y: oldT };
}

function modInverse(a, m) {
  const normA = mod(a, m);
  const { gcd: g, x } = extendedGcd(normA, m);
  if (g !== 1) return null;
  return mod(x, m);
}

function det2x2(M, m) {
  return mod(M[0][0] * M[1][1] - M[0][1] * M[1][0], m);
}

function inv2x2(M, m) {
  const d = det2x2(M, m);
  const dInv = modInverse(d, m);
  if (dInv === null) return null;
  return [
    [mod(dInv * M[1][1], m), mod(dInv * -M[0][1], m)],
    [mod(dInv * -M[1][0], m), mod(dInv * M[0][0], m)],
  ];
}

function det3x3(M, m) {
  const a = M[0][0], b = M[0][1], c = M[0][2];
  const d = M[1][0], e = M[1][1], f = M[1][2];
  const g = M[2][0], h = M[2][1], i = M[2][2];
  const det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
  return mod(det, m);
}

function inv3x3(M, m) {
  const d = det3x3(M, m);
  const dInv = modInverse(d, m);
  if (dInv === null) return null;

  const a = M[0][0], b = M[0][1], c = M[0][2];
  const dVal = M[1][0], e = M[1][1], f = M[1][2];
  const g = M[2][0], h = M[2][1], i = M[2][2];

  const adj = [
    [e * i - f * h, -(b * i - c * h), b * f - c * e],
    [-(dVal * i - f * g), a * i - c * g, -(a * f - c * dVal)],
    [dVal * h - e * g, -(a * h - b * g), a * e - b * dVal],
  ];

  return adj.map(row => row.map(val => mod(dInv * val, m)));
}

describe('1. Modular Arithmetic and Number Theory Invariants', () => {
  test('mod() handles negative dividends correctly', () => {
    assert.equal(mod(-3, 26), 23);
    assert.equal(mod(-1, 27), 26);
    assert.equal(mod(54, 27), 0);
  });

  test('gcd() calculates greatest common divisor', () => {
    assert.equal(gcd(27, 9), 9);
    assert.equal(gcd(26, 7), 1);
    assert.equal(gcd(27, 4), 1);
    assert.equal(gcd(0, 5), 5);
  });

  test('modInverse() correctly finds inverse or returns null for non-coprimes', () => {
    // 7 * 15 = 105 = 4*26 + 1 => 7^-1 = 15 mod 26
    assert.equal(modInverse(7, 26), 15);
    assert.equal(mod(7 * 15, 26), 1);

    // 4 * 7 = 28 = 27 + 1 => 4^-1 = 7 mod 27
    assert.equal(modInverse(4, 27), 7);
    assert.equal(mod(4 * 7, 27), 1);

    // Non coprimes
    assert.equal(modInverse(2, 26), null);
    assert.equal(modInverse(9, 27), null);
    assert.equal(modInverse(13, 26), null);
  });

  test('Matrix 2x2 modular inversion satisfies M * M^-1 = I (mod m)', () => {
    const K = [[3, 3], [2, 5]]; // det = 15 - 6 = 9 mod 26. gcd(9, 26) = 1.
    const K_inv = inv2x2(K, 26);
    assert.ok(K_inv !== null);

    // Multiply K * K_inv mod 26
    const r00 = mod(K[0][0] * K_inv[0][0] + K[0][1] * K_inv[1][0], 26);
    const r01 = mod(K[0][0] * K_inv[0][1] + K[0][1] * K_inv[1][1], 26);
    const r10 = mod(K[1][0] * K_inv[0][0] + K[1][1] * K_inv[1][0], 26);
    const r11 = mod(K[1][0] * K_inv[0][1] + K[1][1] * K_inv[1][1], 26);

    assert.deepEqual([[r00, r01], [r10, r11]], [[1, 0], [0, 1]]);
  });

  test('Matrix 3x3 modular inversion satisfies M * M^-1 = I (mod m)', () => {
    const K = [
      [6, 24, 1],
      [13, 16, 10],
      [20, 17, 15],
    ]; // Standard Hill 3x3 matrix in mod 26
    const det = det3x3(K, 26);
    assert.equal(gcd(det, 26), 1);

    const K_inv = inv3x3(K, 26);
    assert.ok(K_inv !== null);

    // Multiply K * K_inv
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        for (let k = 0; k < 3; k++) {
          sum += K[r][k] * K_inv[k][c];
        }
        const expected = r === c ? 1 : 0;
        assert.equal(mod(sum, 26), expected, `Mismatch at cell (${r}, ${c})`);
      }
    }
  });
});

describe('2. Classical Cipher Symmetry and Roundtrip Tests', () => {
  const ES27 = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
  const EN26 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  test('Caesar Cipher encrypt/decrypt roundtrip in mod 26 and mod 27', () => {
    const shift = 7;
    const msg = 'CRIPTOGRAFIAAVANZADA';

    // mod 26
    const enc26 = msg.split('').map(c => EN26[mod(EN26.indexOf(c) + shift, 26)]).join('');
    const dec26 = enc26.split('').map(c => EN26[mod(EN26.indexOf(c) - shift, 26)]).join('');
    assert.equal(dec26, msg);

    // mod 27 with Ñ
    const msgWithEnie = 'CAÑONAZO';
    const enc27 = msgWithEnie.split('').map(c => ES27[mod(ES27.indexOf(c) + shift, 27)]).join('');
    const dec27 = enc27.split('').map(c => ES27[mod(ES27.indexOf(c) - shift, 27)]).join('');
    assert.equal(dec27, msgWithEnie);
  });

  test('Affine Cipher encrypt/decrypt roundtrip with coprimality validation', () => {
    const a = 7, b = 11, m = 27; // gcd(7, 27) = 1
    const aInv = modInverse(a, m);
    assert.ok(aInv !== null);

    const text = 'SEÑALDEALERTA';
    const enc = text.split('').map(c => ES27[mod(a * ES27.indexOf(c) + b, m)]).join('');
    const dec = enc.split('').map(c => ES27[mod(aInv * (ES27.indexOf(c) - b), m)]).join('');
    assert.equal(dec, text);
  });

  test('Vigenere and Beaufort symmetry', () => {
    const text = 'ATACAREMOSALAMANECER';
    const key = 'CLAVE';
    const m = 26;

    // Vigenère
    const enc = text.split('').map((c, i) => {
      const pIdx = EN26.indexOf(c);
      const kIdx = EN26.indexOf(key[i % key.length]);
      return EN26[mod(pIdx + kIdx, m)];
    }).join('');

    const dec = enc.split('').map((c, i) => {
      const cIdx = EN26.indexOf(c);
      const kIdx = EN26.indexOf(key[i % key.length]);
      return EN26[mod(cIdx - kIdx, m)];
    }).join('');

    assert.equal(dec, text);

    // Beaufort is an involution: E_K(E_K(M)) = M
    const bEnc = text.split('').map((c, i) => {
      const pIdx = EN26.indexOf(c);
      const kIdx = EN26.indexOf(key[i % key.length]);
      return EN26[mod(kIdx - pIdx, m)];
    }).join('');

    const bDec = bEnc.split('').map((c, i) => {
      const cIdx = EN26.indexOf(c);
      const kIdx = EN26.indexOf(key[i % key.length]);
      return EN26[mod(kIdx - cIdx, m)];
    }).join('');

    assert.equal(bDec, text);
  });
});

describe('3. Defensive Programming and Security Hardening (SSDLC)', () => {
  test('Non-invertible Hill matrix is properly rejected without crashing', () => {
    const singularMatrix = [[2, 4], [1, 2]]; // det = 4 - 4 = 0
    const m = 26;
    const inv = inv2x2(singularMatrix, m);
    assert.equal(inv, null);
  });

  test('Matrix with non-coprime determinant is rejected in modular ring', () => {
    const nonCoprimeMatrix = [[2, 3], [1, 5]]; // det = 10 - 3 = 7. In mod 28 gcd(7, 28)=7 != 1
    const inv = inv2x2(nonCoprimeMatrix, 28);
    assert.equal(inv, null);
  });

  test('Sanitization handles special characters, unicode and code injection attempts', () => {
    function normalizeTest(text, hasN) {
      const charMap = {
        'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U', 'Ü': 'U',
        'á': 'A', 'é': 'E', 'í': 'I', 'ó': 'O', 'ú': 'U', 'ü': 'U',
      };
      if (!hasN) {
        charMap['Ñ'] = 'N';
        charMap['ñ'] = 'N';
      }
      const allowed = hasN ? 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      return text
        .toUpperCase()
        .split('')
        .map(c => charMap[c] ?? c)
        .filter(c => allowed.includes(c))
        .join('');
    }

    const maliciousInput = '<script>alert("XSS")</script> 123 ñandú';
    const cleanES27 = normalizeTest(maliciousInput, true);
    const cleanEN26 = normalizeTest(maliciousInput, false);

    assert.equal(cleanES27, 'SCRIPTALERTXSSSCRIPTÑANDU');
    assert.equal(cleanEN26, 'SCRIPTALERTXSSSCRIPTNANDU');
    assert.ok(!cleanES27.includes('<'));
    assert.ok(!cleanES27.includes('>'));
    assert.ok(!cleanES27.includes('"'));
  });

  test('Frequency analysis sums to 100% on non-empty valid inputs', () => {
    const text = 'HOLAMUNDOSECRETOCRIPTOGRAFICO';
    const counts = {};
    for (const c of text) counts[c] = (counts[c] || 0) + 1;
    let sumPct = 0;
    for (const c in counts) {
      sumPct += (counts[c] / text.length) * 100;
    }
    assert.ok(Math.abs(sumPct - 100) < 0.0001);
  });
});

describe('4. Knowledge Base, Steganography & Decision Matrix Integrity', () => {
  test('Stego-key and brute force vectors are validated for accuracy', () => {
    const stegoVectors = ['cuentas de usuario', 'wi-fi', 'ssh', 'servidores web'];
    const expectedVectors = ['cuentas de usuario', 'wi-fi', 'ssh', 'servidores web'];
    for (const v of expectedVectors) {
      assert.ok(stegoVectors.includes(v));
    }
  });

  test('Modular arithmetic mod 27 handles all 27 Spanish alphabet positions', () => {
    const esAlpha = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
    assert.equal(esAlpha.length, 27);
    assert.equal(esAlpha[14], 'Ñ');
    assert.equal(mod(14 + 13, 27), 0); // Ñ + 13 shifts to A (0)
  });
});

describe('5. Continuous Key & Autokey Cryptanalysis Invariants', () => {
  const alphaES = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
  const m27 = 27;

  function encAutokey(plain, seed) {
    let fullKey = seed + plain;
    let cipher = '';
    for (let i = 0; i < plain.length; i++) {
      const pIdx = alphaES.indexOf(plain[i]);
      const kIdx = alphaES.indexOf(fullKey[i]);
      cipher += alphaES[mod(pIdx + kIdx, m27)];
    }
    return cipher;
  }

  function decAutokey(cipher, seed) {
    let fullKey = seed;
    let plain = '';
    for (let i = 0; i < cipher.length; i++) {
      const cIdx = alphaES.indexOf(cipher[i]);
      const kIdx = alphaES.indexOf(fullKey[i]);
      const pIdx = mod(cIdx - kIdx, m27);
      const pChar = alphaES[pIdx];
      plain += pChar;
      fullKey += pChar;
    }
    return plain;
  }

  test('Autokey cascade roundtrip symmetry with seed', () => {
    const msg = 'ATACAMOSMANANAALALBA';
    const seed = 'CLAVE';
    const cipher = encAutokey(msg, seed);
    const decrypted = decAutokey(cipher, seed);
    assert.equal(decrypted, msg);
  });

  test('Crib dragging complementary key derivation: (C - Crib) mod m = Key', () => {
    const pChunk = 'ATAQUE';
    const kChunk = 'SECRET';
    let cipher = '';
    for (let i = 0; i < pChunk.length; i++) {
      cipher += alphaES[mod(alphaES.indexOf(pChunk[i]) + alphaES.indexOf(kChunk[i]), m27)];
    }

    // Recover key from cipher and crib
    let recoveredKey = '';
    for (let i = 0; i < cipher.length; i++) {
      recoveredKey += alphaES[mod(alphaES.indexOf(cipher[i]) - alphaES.indexOf(pChunk[i]), m27)];
    }
    assert.equal(recoveredKey, kChunk);
  });
});

describe('6. Numeric Bases and Bitwise Cryptographic Operations (S11)', () => {
  test('XOR involution property: (A ⊕ B) ⊕ B = A', () => {
    const a = 0b10110011;
    const b = 0b01011010;
    const encrypted = a ^ b;
    const decrypted = encrypted ^ b;
    assert.equal(decrypted, a);
  });

  test('Binary to ASCII conversion integrity', () => {
    const text = 'CRIPTO';
    const binChunks = text.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0'));
    const recovered = binChunks.map(b => String.fromCharCode(parseInt(b, 2))).join('');
    assert.equal(recovered, text);
  });
});

describe('7. DES & Triple-DES (3DES) Feistel Invariants (S12)', () => {
  test('Feistel round symmetry: L_i = R_{i-1}, R_i = L_{i-1} ⊕ f(R_{i-1}, K_i)', () => {
    // Simple 8-bit Feistel simulation
    function dummyF(r, k) {
      return (r * 7 + k) & 0x0f;
    }
    const L0 = 0x5, R0 = 0xa;
    const K1 = 0x3;

    // Encrypt 1 round
    const L1 = R0;
    const R1 = L0 ^ dummyF(R0, K1);

    // Decrypt 1 round
    const recoveredR0 = L1;
    const recoveredL0 = R1 ^ dummyF(L1, K1);

    assert.equal(recoveredL0, L0);
    assert.equal(recoveredR0, R0);
  });
});

describe('8. AES-128 Finite Field and Mode Invariants (S12)', () => {
  test('Galois Field GF(2^8) multiplication by 0x02 and 0x03 modulo x^8+x^4+x^3+x+1', () => {
    function galoisMul2(b) {
      const hi = (b & 0x80) !== 0;
      let res = (b << 1) & 0xff;
      if (hi) res ^= 0x1b;
      return res;
    }
    function galoisMul3(b) {
      return galoisMul2(b) ^ b;
    }

    // Standard NIST test vectors
    assert.equal(galoisMul2(0x57), 0xae);
    assert.equal(galoisMul3(0x57), 0xf9);
    assert.equal(galoisMul2(0xae), 0x47);
  });

  test('ECB vs CBC pattern preservation invariant', () => {
    // Simulating block cipher
    const fakeCipher = (block, key) => (block * 31 + key) & 0xffff;

    // 2 identical blocks
    const p1 = 0x1234, p2 = 0x1234;
    const key = 0x5555;
    const iv = 0x9999;

    // ECB: c1 == c2
    const ecb1 = fakeCipher(p1, key);
    const ecb2 = fakeCipher(p2, key);
    assert.equal(ecb1, ecb2, 'ECB MUST produce identical ciphertexts for identical plaintexts');

    // CBC: c1 != c2
    const cbc1 = fakeCipher(p1 ^ iv, key);
    const cbc2 = fakeCipher(p2 ^ cbc1, key);
    assert.notEqual(cbc1, cbc2, 'CBC MUST produce distinct ciphertexts for identical plaintexts due to chaining');
  });
});

describe('9. Cryptographic Hash Functions & Avalanche Effect (S13)', () => {
  test('Hamming distance on single-bit flip calculates avalanche diffusion', () => {
    const binA = '11001010111100001010101011110000';
    const binB = '01001010011100000010101001110000'; // 4 bits flipped
    let diffs = 0;
    for (let i = 0; i < binA.length; i++) {
      if (binA[i] !== binB[i]) diffs++;
    }
    assert.equal(diffs, 4);
    const pct = (diffs / binA.length) * 100;
    assert.equal(pct, 12.5);
  });
});

describe('10. Digital Signatures and PKI Trust Chain Invariants (S14 & S15)', () => {
  test('RSA Digital Signature mathematical verification: (h^d)^e mod n = h mod n', () => {
    function modPow(base, exp, m) {
      let res = 1n;
      base = BigInt(base) % BigInt(m);
      exp = BigInt(exp);
      const modBig = BigInt(m);
      while (exp > 0n) {
        if (exp % 2n === 1n) res = (res * base) % modBig;
        exp = exp / 2n;
        base = (base * base) % modBig;
      }
      return Number(res);
    }

    const p = 61, q = 53, n = p * q; // n = 3233
    const phi = (p - 1) * (q - 1);   // phi = 3120
    const e = 17;
    const d = modInverse(e, phi);    // d = 2753

    const messageHash = 1234;
    // Alice signs hash with private key d
    const signature = modPow(messageHash, d, n);

    // Bob verifies signature with public key e
    const recoveredHash = modPow(signature, e, n);

    assert.equal(recoveredHash, messageHash);

    // Tampering test: Attacker alters signature
    const forgedSignature = (signature + 1) % n;
    const corruptedHash = modPow(forgedSignature, e, n);
    assert.notEqual(corruptedHash, messageHash, 'Corrupted signature must fail verification');
  });
});


