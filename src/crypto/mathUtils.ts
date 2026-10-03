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

// N x N Matrix Utilities
export function getSubMatrix(M: number[][], rowToRemove: number, colToRemove: number): number[][] {
  return M.filter((_, r) => r !== rowToRemove).map(row => row.filter((_, c) => c !== colToRemove));
}

export function detNxN(M: number[][], m: number): number {
  const n = M.length;
  if (n === 1) return mod(M[0][0], m);
  if (n === 2) return det2x2(M, m);
  if (n === 3) return det3x3(M, m);
  
  let det = 0;
  for (let c = 0; c < n; c++) {
    const subMatrix = getSubMatrix(M, 0, c);
    const sign = c % 2 === 0 ? 1 : -1;
    det += sign * M[0][c] * detNxN(subMatrix, m);
  }
  return mod(det, m);
}

export function isHillMatrixValidNxN(M: number[][], m: number): boolean {
  const d = detNxN(M, m);
  return gcd(d, m) === 1;
}

export function invNxN(M: number[][], m: number): number[][] | null {
  const n = M.length;
  const d = detNxN(M, m);
  const dInv = modInverse(d, m);
  if (dInv === null) return null;

  if (n === 1) return [[dInv]];
  if (n === 2) return inv2x2(M, m);
  if (n === 3) return inv3x3(M, m);

  const adj: number[][] = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const subMatrix = getSubMatrix(M, r, c);
      const sign = (r + c) % 2 === 0 ? 1 : -1;
      const cofactorDet = detNxN(subMatrix, m);
      const val = mod(sign * cofactorDet, m);
      
      if (!adj[c]) adj[c] = [];
      adj[c][r] = mod(val * dInv, m); // Transpose directly
    }
  }
  return adj;
}

export function multiplyNxN(A: number[][], B: number[][], m: number): number[][] {
  const n = A.length;
  const p = B[0].length;
  const result: number[][] = Array.from({ length: n }, () => Array(p).fill(0));
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < p; c++) {
      let sum = 0;
      for (let k = 0; k < A[0].length; k++) {
        sum += A[r][k] * B[k][c];
      }
      result[r][c] = mod(sum, m);
    }
  }
  return result;
}

