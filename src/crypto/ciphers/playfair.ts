// Playfair 5x5 Matrix Cipher

import { formatInBlocks } from '../alphabets';

export const PLAYFAIR_DEFAULT_ALPHA = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // 25 letters, I=J

export interface PlayfairStep {
  pairIndex: number;
  inPair: string;
  outPair: string;
  rule: 'row' | 'col' | 'rectangle';
  pos1: [number, number];
  pos2: [number, number];
  outPos1: [number, number];
  outPos2: [number, number];
  description: string;
}

export function normalizePlayfairChar(c: string): string {
  const upper = c.toUpperCase();
  if (upper === 'J') return 'I';
  if (upper === 'Ñ') return 'N';
  return upper;
}

export function buildPlayfairMatrix(keyword: string): string[] {
  const seen = new Set<string>();
  const matrix: string[] = [];

  const add = (c: string) => {
    const n = normalizePlayfairChar(c);
    if (PLAYFAIR_DEFAULT_ALPHA.includes(n) && !seen.has(n)) {
      seen.add(n);
      matrix.push(n);
    }
  };

  for (const c of keyword) add(c);
  for (const c of PLAYFAIR_DEFAULT_ALPHA) add(c);

  return matrix;
}

export function splitIntoDigrams(text: string, filler = 'X'): string[] {
  const cleanChars = text
    .toUpperCase()
    .split('')
    .map(normalizePlayfairChar)
    .filter(c => PLAYFAIR_DEFAULT_ALPHA.includes(c));

  const digrams: string[] = [];
  let i = 0;
  while (i < cleanChars.length) {
    const c1 = cleanChars[i];
    if (i + 1 >= cleanChars.length) {
      digrams.push(c1 + filler);
      i += 1;
    } else {
      const c2 = cleanChars[i + 1];
      if (c1 === c2) {
        digrams.push(c1 + filler);
        i += 1;
      } else {
        digrams.push(c1 + c2);
        i += 2;
      }
    }
  }
  return digrams;
}

export function getMatrixPos(matrix: string[], char: string): [number, number] {
  const norm = normalizePlayfairChar(char);
  const idx = matrix.indexOf(norm);
  if (idx === -1) return [0, 0];
  return [Math.floor(idx / 5), idx % 5];
}

export function processPlayfair(
  text: string,
  key: string,
  direction: 'encrypt' | 'decrypt' = 'encrypt'
) {
  const matrix = buildPlayfairMatrix(key);
  const digrams = splitIntoDigrams(text);
  const steps: PlayfairStep[] = [];
  let outStr = '';

  for (let i = 0; i < digrams.length; i++) {
    const dg = digrams[i];
    const [r1, c1] = getMatrixPos(matrix, dg[0]);
    const [r2, c2] = getMatrixPos(matrix, dg[1]);

    let rule: 'row' | 'col' | 'rectangle';
    let out1: string, out2: string;
    let outPos1: [number, number], outPos2: [number, number];

    const shift = direction === 'encrypt' ? 1 : 4; // in mod 5, -1 is +4

    if (r1 === r2) {
      rule = 'row';
      const nc1 = (c1 + shift) % 5;
      const nc2 = (c2 + shift) % 5;
      outPos1 = [r1, nc1];
      outPos2 = [r2, nc2];
      out1 = matrix[r1 * 5 + nc1];
      out2 = matrix[r2 * 5 + nc2];
    } else if (c1 === c2) {
      rule = 'col';
      const nr1 = (r1 + shift) % 5;
      const nr2 = (r2 + shift) % 5;
      outPos1 = [nr1, c1];
      outPos2 = [nr2, c2];
      out1 = matrix[nr1 * 5 + c1];
      out2 = matrix[nr2 * 5 + c2];
    } else {
      rule = 'rectangle';
      outPos1 = [r1, c2];
      outPos2 = [r2, c1];
      out1 = matrix[r1 * 5 + c2];
      out2 = matrix[r2 * 5 + c1];
    }

    const outPair = out1 + out2;
    outStr += outPair;

    steps.push({
      pairIndex: i,
      inPair: dg,
      outPair,
      rule,
      pos1: [r1, c1],
      pos2: [r2, c2],
      outPos1,
      outPos2,
      description:
        rule === 'row'
          ? `Misma fila ${r1 + 1}: desplazar a la ${direction === 'encrypt' ? 'derecha (↻)' : 'izquierda (↺)'} → ${outPair}`
          : rule === 'col'
          ? `Misma columna ${c1 + 1}: desplazar hacia ${direction === 'encrypt' ? 'abajo (↓)' : 'arriba (↑)'} → ${outPair}`
          : `Rectángulo: esquinas opuestas [${r1 + 1},${c2 + 1}] y [${r2 + 1},${c1 + 1}] → ${outPair}`,
    });
  }

  return {
    matrix,
    digrams,
    outputText: outStr,
    formattedOutput: formatInBlocks(outStr),
    steps,
  };
}
