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
