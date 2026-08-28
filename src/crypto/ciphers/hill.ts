// Hill 2x2 and 3x3 Matrix Cipher (mod m)

import { ALPHABETS, AlphabetMode, normalizeText, formatInBlocks } from '../alphabets';
import { mod, det2x2, inv2x2, det3x3, inv3x3, isHillMatrixValid2x2, isHillMatrixValid3x3, modInverse } from '../mathUtils';

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
