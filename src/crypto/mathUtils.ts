// Mathematical and modular arithmetic utilities for classical cryptography

export function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

export function extendedGcd(a: number, b: number): { gcd: number; x: number; y: number } {
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

export function modInverse(a: number, m: number): number | null {
  const normA = mod(a, m);
  const { gcd: g, x } = extendedGcd(normA, m);
  if (g !== 1) return null;
  return mod(x, m);
}

export function getCoprimes(m: number): number[] {
  const list: number[] = [];
  for (let i = 1; i < m; i++) {
    if (gcd(i, m) === 1) list.push(i);
  }
  return list;
}

// 2x2 Matrix Utilities (mod m)
export function det2x2(M: number[][], m: number): number {
  return mod(M[0][0] * M[1][1] - M[0][1] * M[1][0], m);
}

export function isHillMatrixValid2x2(M: number[][], m: number): boolean {
  const d = det2x2(M, m);
  return gcd(d, m) === 1;
}

export function inv2x2(M: number[][], m: number): number[][] | null {
  const d = det2x2(M, m);
  const dInv = modInverse(d, m);
  if (dInv === null) return null;

  return [
    [mod(dInv * M[1][1], m), mod(dInv * -M[0][1], m)],
    [mod(dInv * -M[1][0], m), mod(dInv * M[0][0], m)],
  ];
}

// 3x3 Matrix Utilities (mod m)
export function det3x3(M: number[][], m: number): number {
  const a = M[0][0], b = M[0][1], c = M[0][2];
  const d = M[1][0], e = M[1][1], f = M[1][2];
  const g = M[2][0], h = M[2][1], i = M[2][2];

  const det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
  return mod(det, m);
}

export function isHillMatrixValid3x3(M: number[][], m: number): boolean {
  const d = det3x3(M, m);
  return gcd(d, m) === 1;
}

export function inv3x3(M: number[][], m: number): number[][] | null {
  const d = det3x3(M, m);
  const dInv = modInverse(d, m);
  if (dInv === null) return null;

  const a = M[0][0], b = M[0][1], c = M[0][2];
  const dVal = M[1][0], e = M[1][1], f = M[1][2];
  const g = M[2][0], h = M[2][1], i = M[2][2];

  // Matriz adjunta = Transpuesta de la matriz de cofactores
  const adj = [
    [e * i - f * h, -(b * i - c * h), b * f - c * e],
    [-(dVal * i - f * g), a * i - c * g, -(a * f - c * dVal)],
    [dVal * h - e * g, -(a * h - b * g), a * e - b * dVal],
  ];

  return adj.map(row => row.map(val => mod(dInv * val, m)));
}

