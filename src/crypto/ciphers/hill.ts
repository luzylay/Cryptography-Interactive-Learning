// Hill 2x2 and 3x3 Matrix Cipher (mod m)

import { ALPHABETS, AlphabetMode, normalizeText, formatInBlocks } from '../alphabets';
import { mod, gcd, det2x2, inv2x2, det3x3, inv3x3, isHillMatrixValid2x2, isHillMatrixValid3x3, modInverse, detNxN, invNxN, isHillMatrixValidNxN } from '../mathUtils';

export interface HillVectorStep {
  blockIndex: number;
  inBlock: string;
  inVector: number[];
  outVector: number[];
  outBlock: string;
  dotProducts: string[];
}

export function processHill2x2(
  text: string,
  keyMatrix: number[][],
  mode: AlphabetMode,
  direction: 'encrypt' | 'decrypt' = 'encrypt',
  filler = 'X'
) {
  const norm = normalizeText(text, mode);
  const alpha = ALPHABETS[mode].chars;
  const m = ALPHABETS[mode].mod;

  const isValid = isHillMatrixValid2x2(keyMatrix, m);
  const det = det2x2(keyMatrix, m);
  const detInv = modInverse(det, m);
  const invMatrix = inv2x2(keyMatrix, m);

  if (!isValid || !invMatrix || detInv === null) {
    return {
      isValid: false,
      errorMessage: `La matriz no es invertible en mod ${m}. det(K) = ${det} no es coprimo con ${m}.`,
      inputText: norm,
      outputText: '',
      formattedOutput: '',
      steps: [],
      effectiveMatrix: keyMatrix,
      det,
      detInv,
      invMatrix: null,
      m,
      alpha,
    };
  }

  const effectiveMatrix = direction === 'encrypt' ? keyMatrix : invMatrix;

  // Pad to even length
  const padded = norm.length % 2 !== 0 ? norm + filler : norm;
  const steps: HillVectorStep[] = [];
  let outStr = '';

  for (let i = 0; i < padded.length; i += 2) {
    const c1 = padded[i], c2 = padded[i + 1];
    const v1 = alpha.indexOf(c1), v2 = alpha.indexOf(c2);

    const r1 = mod(effectiveMatrix[0][0] * v1 + effectiveMatrix[0][1] * v2, m);
    const r2 = mod(effectiveMatrix[1][0] * v1 + effectiveMatrix[1][1] * v2, m);

    const out1 = alpha[r1], out2 = alpha[r2];
    outStr += out1 + out2;

    steps.push({
      blockIndex: i / 2,
      inBlock: c1 + c2,
      inVector: [v1, v2],
      outVector: [r1, r2],
      outBlock: out1 + out2,
      dotProducts: [
        `C₁ = (${effectiveMatrix[0][0]}·${v1} + ${effectiveMatrix[0][1]}·${v2}) = ${effectiveMatrix[0][0] * v1 + effectiveMatrix[0][1] * v2} ≡ ${r1} (mod ${m}) → '${out1}'`,
        `C₂ = (${effectiveMatrix[1][0]}·${v1} + ${effectiveMatrix[1][1]}·${v2}) = ${effectiveMatrix[1][0] * v1 + effectiveMatrix[1][1] * v2} ≡ ${r2} (mod ${m}) → '${out2}'`,
      ],
    });
  }

  return {
    isValid: true,
    errorMessage: null,
    inputText: padded,
    outputText: outStr,
    formattedOutput: formatInBlocks(outStr),
    steps,
    effectiveMatrix,
    det,
    detInv,
    invMatrix,
    m,
    alpha,
  };
}

export function processHill3x3(
  text: string,
  keyMatrix: number[][],
  mode: AlphabetMode,
  direction: 'encrypt' | 'decrypt' = 'encrypt',
  filler = 'X'
) {
  const norm = normalizeText(text, mode);
  const alpha = ALPHABETS[mode].chars;
  const m = ALPHABETS[mode].mod;

  const isValid = isHillMatrixValid3x3(keyMatrix, m);
  const det = det3x3(keyMatrix, m);
  const detInv = modInverse(det, m);
  const invMatrix = inv3x3(keyMatrix, m);

  if (!isValid || !invMatrix || detInv === null) {
    return {
      isValid: false,
      errorMessage: `La matriz 3x3 no es invertible en mod ${m}. det(K) = ${det} no es coprimo con ${m}.`,
      inputText: norm,
      outputText: '',
      formattedOutput: '',
      steps: [],
      effectiveMatrix: keyMatrix,
      det,
      detInv,
      invMatrix: null,
      m,
      alpha,
    };
  }

  const effectiveMatrix = direction === 'encrypt' ? keyMatrix : invMatrix;

  // Pad to multiple of 3
  let padded = norm;
  while (padded.length % 3 !== 0) padded += filler;

  const steps: HillVectorStep[] = [];
  let outStr = '';

  for (let i = 0; i < padded.length; i += 3) {
    const c1 = padded[i], c2 = padded[i + 1], c3 = padded[i + 2];
    const v1 = alpha.indexOf(c1), v2 = alpha.indexOf(c2), v3 = alpha.indexOf(c3);

    const r1 = mod(effectiveMatrix[0][0] * v1 + effectiveMatrix[0][1] * v2 + effectiveMatrix[0][2] * v3, m);
    const r2 = mod(effectiveMatrix[1][0] * v1 + effectiveMatrix[1][1] * v2 + effectiveMatrix[1][2] * v3, m);
    const r3 = mod(effectiveMatrix[2][0] * v1 + effectiveMatrix[2][1] * v2 + effectiveMatrix[2][2] * v3, m);

    const out1 = alpha[r1], out2 = alpha[r2], out3 = alpha[r3];
    outStr += out1 + out2 + out3;

    steps.push({
      blockIndex: i / 3,
      inBlock: c1 + c2 + c3,
      inVector: [v1, v2, v3],
      outVector: [r1, r2, r3],
      outBlock: out1 + out2 + out3,
      dotProducts: [
        `C₁ = (${effectiveMatrix[0][0]}·${v1} + ${effectiveMatrix[0][1]}·${v2} + ${effectiveMatrix[0][2]}·${v3}) ≡ ${r1} (mod ${m}) → '${out1}'`,
        `C₂ = (${effectiveMatrix[1][0]}·${v1} + ${effectiveMatrix[1][1]}·${v2} + ${effectiveMatrix[1][2]}·${v3}) ≡ ${r2} (mod ${m}) → '${out2}'`,
        `C₃ = (${effectiveMatrix[2][0]}·${v1} + ${effectiveMatrix[2][1]}·${v2} + ${effectiveMatrix[2][2]}·${v3}) ≡ ${r3} (mod ${m}) → '${out3}'`,
      ],
    });
  }

  return {
    isValid: true,
    errorMessage: null,
    inputText: padded,
    outputText: outStr,
    formattedOutput: formatInBlocks(outStr),
    steps,
    effectiveMatrix,
    det,
    detInv,
    invMatrix,
    m,
    alpha,
  };
}

export function deriveHillMatrixFromText(
  keyInput: string,
  mode: AlphabetMode,
  paddingSymbol: string
) {
  const alpha = ALPHABETS[mode].chars;
  const m = ALPHABETS[mode].mod;
  
  const cleanChars = normalizeText(keyInput, mode).split('');
  if (cleanChars.length === 0) return null;
  
  const dimension = Math.max(2, Math.ceil(Math.sqrt(cleanChars.length)));
  if (dimension > 5) return null; // Limitar a 5x5 por la UI
  
  const requiredLength = dimension * dimension;
  const paddedChars = [...cleanChars, ...Array(requiredLength - cleanChars.length).fill(paddingSymbol)];
  
  let matrix = Array.from({ length: dimension }, (_, r) =>
    Array.from({ length: dimension }, (_, c) =>
      alpha.indexOf(paddedChars[r * dimension + c])
    )
  );

  let det = detNxN(matrix, m);
  if (gcd(det, m) === 1) {
    return { dimension: dimension as 2 | 3 | 4 | 5, matrix, adjusted: false };
  }

  // Ajuste automático como en la calculadora original
  const baseMatrix = matrix.map(row => [...row]);
  for (let offset = 1; offset < m; offset++) {
    const candidate = baseMatrix.map((row, r) =>
      row.map((val, c) => r === c ? mod(val + offset, m) : val)
    );
    if (gcd(detNxN(candidate, m), m) === 1) {
      return { dimension: dimension as 2 | 3 | 4 | 5, matrix: candidate, adjusted: true };
    }
  }

  // Si aún falla, forzamos matriz triangular (backup)
  matrix = baseMatrix.map((row, r) =>
    row.map((val, c) => {
      if (c < r) return 0;
      if (c === r) {
        let nxt = val;
        while (gcd(nxt, m) !== 1) nxt = mod(nxt + 1, m);
        return nxt;
      }
      return val;
    })
  );
  
  return { dimension: dimension as 2 | 3 | 4 | 5, matrix, adjusted: true };
}

export function processHillNxN(
  text: string,
  keyMatrix: number[][],
  mode: AlphabetMode,
  direction: 'encrypt' | 'decrypt' = 'encrypt',
  filler = 'X'
) {
  const norm = normalizeText(text, mode);
  const alpha = ALPHABETS[mode].chars;
  const m = ALPHABETS[mode].mod;
  const n = keyMatrix.length;

  const isValid = isHillMatrixValidNxN(keyMatrix, m);
  const det = detNxN(keyMatrix, m);
  const detInv = modInverse(det, m);
  const invMatrix = invNxN(keyMatrix, m);

  if (!isValid || !invMatrix || detInv === null) {
    return {
      isValid: false,
      errorMessage: `La matriz ${n}x${n} no es invertible en mod ${m}. det(K) = ${det} no es coprimo con ${m}.`,
      inputText: norm,
      outputText: '',
      formattedOutput: '',
      steps: [],
      effectiveMatrix: keyMatrix,
      det,
      detInv,
      invMatrix: null,
      m,
      alpha,
    };
  }

  const effectiveMatrix = direction === 'encrypt' ? keyMatrix : invMatrix;

  // Pad to multiple of n using the selected filler
  let padded = norm;
  while (padded.length % n !== 0) padded += filler;

  const steps: HillVectorStep[] = [];
  let outStr = '';

  const subscripts = ['₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉', '₁₀'];

  for (let i = 0; i < padded.length; i += n) {
    const inBlockChars = padded.slice(i, i + n).split('');
    const inVector = inBlockChars.map(c => alpha.indexOf(c));
    const outVector: number[] = [];
    const outBlockChars: string[] = [];
    const dotProducts: string[] = [];

    for (let r = 0; r < n; r++) {
      let sum = 0;
      let dotStrParts = [];
      for (let c = 0; c < n; c++) {
        sum += effectiveMatrix[r][c] * inVector[c];
        dotStrParts.push(`${effectiveMatrix[r][c]}·${inVector[c]}`);
      }
      const val = mod(sum, m);
      outVector.push(val);
      outBlockChars.push(alpha[val]);
      const sub = subscripts[r] || (r + 1).toString();
      dotProducts.push(`C${sub} = (${dotStrParts.join(' + ')}) = ${sum} ≡ ${val} (mod ${m}) → '${alpha[val]}'`);
    }

    const outBlock = outBlockChars.join('');
    outStr += outBlock;

    steps.push({
      blockIndex: i / n,
      inBlock: inBlockChars.join(''),
      inVector,
      outVector,
      outBlock,
      dotProducts,
    });
  }

  return {
    isValid: true,
    errorMessage: null,
    inputText: padded,
    outputText: outStr,
    formattedOutput: formatInBlocks(outStr),
    steps,
    effectiveMatrix,
    det,
    detInv,
    invMatrix,
    m,
    alpha,
  };
}

export function cryptanalysisHillNxN(
  plaintext: string,
  ciphertext: string,
  n: number,
  mode: AlphabetMode
) {
  const normP = normalizeText(plaintext, mode);
  const normC = normalizeText(ciphertext, mode);
  const alpha = ALPHABETS[mode].chars;
  const m = ALPHABETS[mode].mod;

  if (normP.length < n * n || normC.length < n * n) {
    return {
      success: false,
      errorMessage: `Se requieren al menos ${n * n} caracteres para encontrar la clave de ${n}x${n}.`,
      matrixK: null,
    };
  }

  // Form matrices M and C. Vectors are columns.
  const M: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  const C: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

  let charIdx = 0;
  for (let col = 0; col < n; col++) {
    for (let row = 0; row < n; row++) {
      M[row][col] = alpha.indexOf(normP[charIdx]);
      C[row][col] = alpha.indexOf(normC[charIdx]);
      charIdx++;
    }
  }

  const detM = detNxN(M, m);
  const mInv = invNxN(M, m);

  if (!mInv) {
    return {
      success: false,
      errorMessage: `La matriz de texto en claro M no es invertible (det = ${detM}). Intenta con otro texto.`,
      matrixK: null,
    };
  }

  // K = C * M^-1
  const resultK = Array.from({ length: n }, () => Array(n).fill(0));
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        sum += C[r][k] * mInv[k][c];
      }
      resultK[r][c] = mod(sum, m);
    }
  }

  return {
    success: true,
    errorMessage: null,
    matrixK: resultK,
    M,
    C,
    mInv,
  };
}
