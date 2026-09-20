// Cryptographic Hash Functions & Integrity Engine (S13)
// RFC 1321 (MD5), FIPS PUB 180-4 (SHA-1, SHA-256), RFC 2104 (HMAC)
// Pure TypeScript Domain - Zero DOM/React dependencies

export interface HashComparisonResult {
  algorithm: 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-512';
  digestHex: string;
  bitLength: number;
  byteLength: number;
  binaryString: string;
}

export interface AvalancheResult {
  originalText: string;
  modifiedText: string;
  diffBitIndex: number;
  originalHashHex: string;
  modifiedHashHex: string;
  originalHashBin: string;
  modifiedHashBin: string;
  flippedBitsCount: number;
  totalBits: number;
  avalanchePercentage: number;
  bitDifferences: boolean[]; // true if bit is flipped
}

// ─── Pure TypeScript MD5 Implementation (RFC 1321) ──────────────────────────

function safeAdd(x: number, y: number): number {
  const lsw = (x & 0xffff) + (y & 0xffff);
  const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xffff);
}

function bitRotateLeft(num: number, cnt: number): number {
  return (num << cnt) | (num >>> (32 - cnt));
}

function md5cmn(q: number, a: number, b: number, x: number, s: number, t: number): number {
  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
}

function md5ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
  return md5cmn((b & c) | (~b & d), a, b, x, s, t);
}

function md5gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
  return md5cmn((b & d) | (c & ~d), a, b, x, s, t);
}

function md5hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
  return md5cmn(b ^ c ^ d, a, b, x, s, t);
}

function md5ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
  return md5cmn(c ^ (b | ~d), a, b, x, s, t);
}

export function md5(str: string): string {
  const utf8 = unescape(encodeURIComponent(str));
  const n = utf8.length;
  const words: number[] = [];

  for (let i = 0; i < n; i++) {
    words[i >> 2] |= (utf8.charCodeAt(i) & 0xff) << ((i % 4) * 8);
  }
  words[n >> 2] |= 0x80 << ((n % 4) * 8);
  words[(((n + 8) >> 6) << 4) + 14] = n * 8;

  let a = 1732584193;
  let b = -271733879;
  let c = -1732584194;
  let d = 271733878;

  for (let i = 0; i < words.length; i += 16) {
    const olda = a, oldb = b, oldc = c, oldd = d;

    a = md5ff(a, b, c, d, words[i + 0] || 0, 7, -680876936);
    d = md5ff(d, a, b, c, words[i + 1] || 0, 12, -389564586);
    c = md5ff(c, d, a, b, words[i + 2] || 0, 17, 606105819);
    b = md5ff(b, c, d, a, words[i + 3] || 0, 22, -1044525330);
    a = md5ff(a, b, c, d, words[i + 4] || 0, 7, -176418897);
    d = md5ff(d, a, b, c, words[i + 5] || 0, 12, 1200080426);
    c = md5ff(c, d, a, b, words[i + 6] || 0, 17, -1473231341);
    b = md5ff(b, c, d, a, words[i + 7] || 0, 22, -45705983);
    a = md5ff(a, b, c, d, words[i + 8] || 0, 7, 1770035416);
    d = md5ff(d, a, b, c, words[i + 9] || 0, 12, -1958414417);
    c = md5ff(c, d, a, b, words[i + 10] || 0, 17, -42063);
    b = md5ff(b, c, d, a, words[i + 11] || 0, 22, -1990404162);
    a = md5ff(a, b, c, d, words[i + 12] || 0, 7, 1804603682);
    d = md5ff(d, a, b, c, words[i + 13] || 0, 12, -40341101);
    c = md5ff(c, d, a, b, words[i + 14] || 0, 17, -1502002290);
    b = md5ff(b, c, d, a, words[i + 15] || 0, 22, 1236535329);

    a = md5gg(a, b, c, d, words[i + 1] || 0, 5, -165796510);
    d = md5gg(d, a, b, c, words[i + 6] || 0, 9, -1069501632);
    c = md5gg(c, d, a, b, words[i + 11] || 0, 14, 643717713);
    b = md5gg(b, c, d, a, words[i + 0] || 0, 20, -373897302);
    a = md5gg(a, b, c, d, words[i + 5] || 0, 5, -701558691);
    d = md5gg(d, a, b, c, words[i + 10] || 0, 9, 38016083);
    c = md5gg(c, d, a, b, words[i + 15] || 0, 14, -660478335);
    b = md5gg(b, c, d, a, words[i + 4] || 0, 20, -405537848);
    a = md5gg(a, b, c, d, words[i + 9] || 0, 5, 568446438);
    d = md5gg(d, a, b, c, words[i + 14] || 0, 9, -1019803690);
    c = md5gg(c, d, a, b, words[i + 3] || 0, 14, -187363961);
    b = md5gg(b, c, d, a, words[i + 8] || 0, 20, 1163531501);
    a = md5gg(a, b, c, d, words[i + 13] || 0, 5, -1444681467);
    d = md5gg(d, a, b, c, words[i + 2] || 0, 9, -51403784);
    c = md5gg(c, d, a, b, words[i + 7] || 0, 14, 1735328473);
    b = md5gg(b, c, d, a, words[i + 12] || 0, 20, -1926607734);

    a = md5hh(a, b, c, d, words[i + 5] || 0, 4, -378558);
    d = md5hh(d, a, b, c, words[i + 8] || 0, 11, -2022574463);
    c = md5hh(c, d, a, b, words[i + 11] || 0, 16, 1839030562);
    b = md5hh(b, c, d, a, words[i + 14] || 0, 23, -35309556);
    a = md5hh(a, b, c, d, words[i + 1] || 0, 4, -1530992060);
    d = md5hh(d, a, b, c, words[i + 4] || 0, 11, 1272893353);
    c = md5hh(c, d, a, b, words[i + 7] || 0, 16, -155497632);
    b = md5hh(b, c, d, a, words[i + 10] || 0, 23, -1094730640);
    a = md5hh(a, b, c, d, words[i + 13] || 0, 4, 681279174);
    d = md5hh(d, a, b, c, words[i + 0] || 0, 11, -358537222);
    c = md5hh(c, d, a, b, words[i + 3] || 0, 16, -722521979);
    b = md5hh(b, c, d, a, words[i + 6] || 0, 23, 76029189);
    a = md5hh(a, b, c, d, words[i + 9] || 0, 4, -640364487);
    d = md5hh(d, a, b, c, words[i + 12] || 0, 11, -421815835);
    c = md5hh(c, d, a, b, words[i + 15] || 0, 16, 530742520);
    b = md5hh(b, c, d, a, words[i + 2] || 0, 23, -995338651);

    a = md5ii(a, b, c, d, words[i + 0] || 0, 6, -198630844);
    d = md5ii(d, a, b, c, words[i + 7] || 0, 10, 1126891415);
    c = md5ii(c, d, a, b, words[i + 14] || 0, 15, -1416354905);
    b = md5ii(b, c, d, a, words[i + 5] || 0, 21, -57434055);
    a = md5ii(a, b, c, d, words[i + 12] || 0, 6, 1700485571);
    d = md5ii(d, a, b, c, words[i + 3] || 0, 10, -1894986606);
    c = md5ii(c, d, a, b, words[i + 10] || 0, 15, -1051523);
    b = md5ii(b, c, d, a, words[i + 1] || 0, 21, -2054922799);
    a = md5ii(a, b, c, d, words[i + 8] || 0, 6, 1873313359);
    d = md5ii(d, a, b, c, words[i + 15] || 0, 10, -30611744);
    c = md5ii(c, d, a, b, words[i + 6] || 0, 15, -1560198380);
    b = md5ii(b, c, d, a, words[i + 13] || 0, 21, 1309151649);
    a = md5ii(a, b, c, d, words[i + 4] || 0, 6, -145523070);
    d = md5ii(d, a, b, c, words[i + 11] || 0, 10, -1120210379);
    c = md5ii(c, d, a, b, words[i + 2] || 0, 15, 718787259);
    b = md5ii(b, c, d, a, words[i + 9] || 0, 21, -343485551);

    a = safeAdd(a, olda);
    b = safeAdd(b, oldb);
    c = safeAdd(c, oldc);
    d = safeAdd(d, oldd);
  }

  const wordToHex = (w: number) => {
    let hex = '';
    for (let i = 0; i < 4; i++) {
      hex += ((w >> (i * 8)) & 0xff).toString(16).padStart(2, '0');
    }
    return hex;
  };

  return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
}

// ─── Pure TypeScript SHA-1 Implementation (FIPS PUB 180-4) ──────────────────

export function sha1(str: string): string {
  const utf8 = unescape(encodeURIComponent(str));
  const n = utf8.length;
  const words: number[] = [];

  for (let i = 0; i < n; i++) {
    words[i >> 2] |= (utf8.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
  }
  words[n >> 2] |= 0x80 << (24 - (n % 4) * 8);
  words[(((n + 8) >> 6) << 4) + 15] = n * 8;

  let h0 = 0x67452301;
  let h1 = 0xefcdab89;
  let h2 = 0x98badcfe;
  let h3 = 0x10325476;
  let h4 = 0xc3d2e1f0;

  const w: number[] = new Array(80);

  for (let i = 0; i < words.length; i += 16) {
    for (let j = 0; j < 16; j++) {
      w[j] = words[i + j] || 0;
    }
    for (let j = 16; j < 80; j++) {
      w[j] = bitRotateLeft(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
    }

    let a = h0, b = h1, c = h2, d = h3, e = h4;

    for (let j = 0; j < 80; j++) {
      let f = 0, k = 0;
      if (j < 20) {
        f = (b & c) | (~b & d);
        k = 0x5a827999;
      } else if (j < 40) {
        f = b ^ c ^ d;
        k = 0x6ed9eba1;
      } else if (j < 60) {
        f = (b & c) | (b & d) | (c & d);
        k = 0x8f1bbcdc;
      } else {
        f = b ^ c ^ d;
        k = 0xca62c1d6;
      }

      const temp = safeAdd(safeAdd(safeAdd(safeAdd(bitRotateLeft(a, 5), f), e), k), w[j]);
      e = d;
      d = c;
      c = bitRotateLeft(b, 30);
      b = a;
      a = temp;
    }

    h0 = safeAdd(h0, a);
    h1 = safeAdd(h1, b);
    h2 = safeAdd(h2, c);
    h3 = safeAdd(h3, d);
    h4 = safeAdd(h4, e);
  }

  const toHex = (v: number) => (v >>> 0).toString(16).padStart(8, '0');
  return (toHex(h0) + toHex(h1) + toHex(h2) + toHex(h3) + toHex(h4)).toLowerCase();
}

// ─── Pure TypeScript SHA-256 Implementation (FIPS PUB 180-4) ────────────────

const K256 = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
];

function rightRotate(v: number, amt: number): number {
  return (v >>> amt) | (v << (32 - amt));
}

export function sha256(str: string): string {
  const utf8 = unescape(encodeURIComponent(str));
  const n = utf8.length;
  const words: number[] = [];

  for (let i = 0; i < n; i++) {
    words[i >> 2] |= (utf8.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
  }
  words[n >> 2] |= 0x80 << (24 - (n % 4) * 8);
  words[(((n + 8) >> 6) << 4) + 15] = n * 8;

  let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a;
  let h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;

  const w: number[] = new Array(64);

  for (let i = 0; i < words.length; i += 16) {
    for (let j = 0; j < 16; j++) {
      w[j] = words[i + j] || 0;
    }
    for (let j = 16; j < 64; j++) {
      const s0 = rightRotate(w[j - 15], 7) ^ rightRotate(w[j - 15], 18) ^ (w[j - 15] >>> 3);
      const s1 = rightRotate(w[j - 2], 17) ^ rightRotate(w[j - 2], 19) ^ (w[j - 2] >>> 10);
      w[j] = safeAdd(safeAdd(safeAdd(w[j - 16], s0), w[j - 7]), s1);
    }

    let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;

    for (let j = 0; j < 64; j++) {
      const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = safeAdd(safeAdd(safeAdd(safeAdd(h, S1), ch), K256[j]), w[j]);
      const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = safeAdd(S0, maj);

      h = g;
      g = f;
      f = e;
      e = safeAdd(d, temp1);
      d = c;
      c = b;
      b = a;
      a = safeAdd(temp1, temp2);
    }

    h0 = safeAdd(h0, a);
    h1 = safeAdd(h1, b);
    h2 = safeAdd(h2, c);
    h3 = safeAdd(h3, d);
    h4 = safeAdd(h4, e);
    h5 = safeAdd(h5, f);
    h6 = safeAdd(h6, g);
    h7 = safeAdd(h7, h);
  }

  const toHex = (v: number) => (v >>> 0).toString(16).padStart(8, '0');
  return (toHex(h0) + toHex(h1) + toHex(h2) + toHex(h3) + toHex(h4) + toHex(h5) + toHex(h6) + toHex(h7)).toLowerCase();
}

/**
 * Calculates hashes in MD5, SHA-1, SHA-256 simultaneously
 */
export function calculateAllHashes(text: string): HashComparisonResult[] {
  const md5Digest = md5(text);
  const sha1Digest = sha1(text);
  const sha256Digest = sha256(text);

  const hexToBinaryString = (hex: string) => {
    let bin = '';
    for (let i = 0; i < hex.length; i++) {
      bin += parseInt(hex[i], 16).toString(2).padStart(4, '0');
    }
    return bin;
  };

  return [
    {
      algorithm: 'MD5',
      digestHex: md5Digest,
      bitLength: 128,
      byteLength: 16,
      binaryString: hexToBinaryString(md5Digest),
    },
    {
      algorithm: 'SHA-1',
      digestHex: sha1Digest,
      bitLength: 160,
      byteLength: 20,
      binaryString: hexToBinaryString(sha1Digest),
    },
    {
      algorithm: 'SHA-256',
      digestHex: sha256Digest,
      bitLength: 256,
      byteLength: 32,
      binaryString: hexToBinaryString(sha256Digest),
    },
  ];
}

/**
 * Calculates the Avalanche Effect between an original text and a modified text
 */
export function calculateAvalancheEffect(
  original: string,
  modified: string,
  algorithm: 'SHA-256' | 'SHA-1' | 'MD5' = 'SHA-256'
): AvalancheResult {
  const hashFn = algorithm === 'SHA-256' ? sha256 : algorithm === 'SHA-1' ? sha1 : md5;

  const origHash = hashFn(original);
  const modHash = hashFn(modified);

  const hexToBin = (h: string) => {
    let b = '';
    for (let i = 0; i < h.length; i++) {
      b += parseInt(h[i], 16).toString(2).padStart(4, '0');
    }
    return b;
  };

  const origBin = hexToBin(origHash);
  const modBin = hexToBin(modHash);

  let flipped = 0;
  const bitDifferences: boolean[] = [];

  for (let i = 0; i < origBin.length; i++) {
    const isDiff = origBin[i] !== modBin[i];
    bitDifferences.push(isDiff);
    if (isDiff) flipped++;
  }

  const totalBits = origBin.length;
  const percentage = (flipped / totalBits) * 100;

  return {
    originalText: original,
    modifiedText: modified,
    diffBitIndex: 0,
    originalHashHex: origHash,
    modifiedHashHex: modHash,
    originalHashBin: origBin,
    modifiedHashBin: modBin,
    flippedBitsCount: flipped,
    totalBits,
    avalanchePercentage: Number(percentage.toFixed(2)),
    bitDifferences,
  };
}

/**
 * Pure TypeScript HMAC Generator (RFC 2104) with SHA-256
 */
export function hmacSha256(key: string, message: string): string {
  const blockSize = 64; // 512 bits = 64 bytes for SHA-256
  let keyBytes: number[] = [];

  if (key.length > blockSize) {
    const kh = sha256(key);
    for (let i = 0; i < kh.length; i += 2) {
      keyBytes.push(parseInt(kh.slice(i, i + 2), 16));
    }
  } else {
    for (let i = 0; i < key.length; i++) {
      keyBytes.push(key.charCodeAt(i) & 0xff);
    }
  }

  while (keyBytes.length < blockSize) {
    keyBytes.push(0x00);
  }

  const iPad = keyBytes.map(b => b ^ 0x36);
  const oPad = keyBytes.map(b => b ^ 0x5c);

  const innerMsg = String.fromCharCode(...iPad) + message;
  const innerHashHex = sha256(innerMsg);

  let innerHashBytes: number[] = [];
  for (let i = 0; i < innerHashHex.length; i += 2) {
    innerHashBytes.push(parseInt(innerHashHex.slice(i, i + 2), 16));
  }

  const outerMsg = String.fromCharCode(...oPad) + String.fromCharCode(...innerHashBytes);
  return sha256(outerMsg);
}
