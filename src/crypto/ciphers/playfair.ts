// Playfair 5x5 Matrix Cipher - Didactic & Academic Implementation
// Aligned with university curriculum (S08 - Charles Wheatstone & Lord Playfair)
import { formatInBlocks } from '../alphabets';

export const PLAYFAIR_DEFAULT_ALPHA = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // 25 celdas: I/J unificadas, N/Ñ unificadas en español

export interface DigramDetail {
  pair: string;
  char1: string;
  char2: string;
  reason: 'normal' | 'double_letter_split' | 'odd_padding';
  explanation: string;
}

export interface PlayfairStep {
  pairIndex: number;
  inPair: string;
  outPair: string;
  rule: 'row' | 'col' | 'rectangle';
  ruleNameEs: string;
  pos1: [number, number]; // [row 0..4, col 0..4]
  pos2: [number, number];
  outPos1: [number, number];
  outPos2: [number, number];
  description: string;
  explanation: string;
  formula: string;
  digramInfo?: DigramDetail;
}

export function normalizePlayfairChar(c: string): string {
  const upper = c.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
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

export function splitIntoDigramsDetails(text: string, filler = 'X'): DigramDetail[] {
  const cleanChars = text
    .split('')
    .map(normalizePlayfairChar)
    .filter(c => PLAYFAIR_DEFAULT_ALPHA.includes(c));

  const digrams: DigramDetail[] = [];
  let i = 0;
  while (i < cleanChars.length) {
    const c1 = cleanChars[i];
    if (i + 1 >= cleanChars.length) {
      const f = c1 === filler ? 'Z' : filler;
      digrams.push({
        pair: c1 + f,
        char1: c1,
        char2: f,
        reason: 'odd_padding',
        explanation: `Carácter final aislado '${c1}': se añade letra nula '${f}' para completar el número par.`
      });
      i += 1;
    } else {
      const c2 = cleanChars[i + 1];
      if (c1 === c2) {
        const f = c1 === filler ? 'Z' : filler;
        digrams.push({
          pair: c1 + f,
          char1: c1,
          char2: f,
          reason: 'double_letter_split',
          explanation: `Letras gemelas consecutivas '${c1}${c2}': se rompe la repetición insertando '${f}'. La segunda '${c2}' pasa al siguiente par.`
        });
        i += 1;
      } else {
        digrams.push({
          pair: c1 + c2,
          char1: c1,
          char2: c2,
          reason: 'normal',
          explanation: `Par estándar: '${c1}' y '${c2}'.`
        });
        i += 2;
      }
    }
  }
  return digrams;
}

export function splitCiphertextDigrams(text: string): DigramDetail[] {
  const cleanChars = text
    .split('')
    .map(normalizePlayfairChar)
    .filter(c => PLAYFAIR_DEFAULT_ALPHA.includes(c));

  const digrams: DigramDetail[] = [];
  for (let i = 0; i < cleanChars.length; i += 2) {
    const c1 = cleanChars[i];
    const c2 = i + 1 < cleanChars.length ? cleanChars[i + 1] : 'X';
    digrams.push({
      pair: c1 + c2,
      char1: c1,
      char2: c2,
      reason: 'normal',
      explanation: `Par #${Math.floor(i / 2) + 1} de criptograma a descifrar: '${c1}${c2}'.`,
    });
  }
  return digrams;
}

export function splitIntoDigrams(text: string, filler = 'X'): string[] {
  return splitIntoDigramsDetails(text, filler).map(d => d.pair);
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
  direction: 'encrypt' | 'decrypt' = 'encrypt',
  filler = 'X'
) {
  const matrix = buildPlayfairMatrix(key);
  const digramDetails =
    direction === 'decrypt'
      ? splitCiphertextDigrams(text)
      : splitIntoDigramsDetails(text, filler);
  const digrams = digramDetails.map(d => d.pair);
  const steps: PlayfairStep[] = [];
  let outStr = '';

  for (let i = 0; i < digrams.length; i++) {
    const dg = digrams[i];
    const [r1, c1] = getMatrixPos(matrix, dg[0]);
    const [r2, c2] = getMatrixPos(matrix, dg[1]);

    let rule: 'row' | 'col' | 'rectangle';
    let ruleNameEs: string;
    let out1: string, out2: string;
    let outPos1: [number, number], outPos2: [number, number];
    let formula = '';
    let explanation = '';

    const shift = direction === 'encrypt' ? 1 : 4; // mod 5: -1 es equivalente a +4

    if (r1 === r2) {
      // Regla A: MISMA FILA
      rule = 'row';
      ruleNameEs = 'Regla A: Misma Fila';
      const nc1 = (c1 + shift) % 5;
      const nc2 = (c2 + shift) % 5;
      outPos1 = [r1, nc1];
      outPos2 = [r2, nc2];
      out1 = matrix[r1 * 5 + nc1];
      out2 = matrix[r2 * 5 + nc2];

      if (direction === 'encrypt') {
        formula = `Col' = (Col + 1) mod 5  =>  C1[${r1+1}, ${nc1+1}] = ${out1}, C2[${r2+1}, ${nc2+1}] = ${out2}`;
        explanation = `Misma Fila ${r1 + 1}: Desplazamiento a la derecha (+1 mod 5). ${dg[0]}[F${r1+1}, C${c1+1}] → ${out1} y ${dg[1]}[F${r2+1}, C${c2+1}] → ${out2}.`;
      } else {
        formula = `Col' = (Col - 1 + 5) mod 5  =>  C1[${r1+1}, ${nc1+1}] = ${out1}, C2[${r2+1}, ${nc2+1}] = ${out2}`;
        explanation = `Misma Fila ${r1 + 1}: Desplazamiento a la izquierda (-1 mod 5). ${dg[0]} → ${out1} y ${dg[1]} → ${out2}.`;
      }
    } else if (c1 === c2) {
      // Regla B: MISMA COLUMNA
      rule = 'col';
      ruleNameEs = 'Regla B: Misma Columna';
      const nr1 = (r1 + shift) % 5;
      const nr2 = (r2 + shift) % 5;
      outPos1 = [nr1, c1];
      outPos2 = [nr2, c2];
      out1 = matrix[nr1 * 5 + c1];
      out2 = matrix[nr2 * 5 + c2];

      if (direction === 'encrypt') {
        formula = `Fila' = (Fila + 1) mod 5  =>  C1[${nr1+1}, ${c1+1}] = ${out1}, C2[${nr2+1}, ${c2+1}] = ${out2}`;
        explanation = `Misma Columna ${c1 + 1}: Desplazamiento hacia abajo (+1 mod 5). ${dg[0]}[F${r1+1}, C${c1+1}] → ${out1} y ${dg[1]}[F${r2+1}, C${c2+1}] → ${out2}.`;
      } else {
        formula = `Fila' = (Fila - 1 + 5) mod 5  =>  C1[${nr1+1}, ${c1+1}] = ${out1}, C2[${nr2+1}, ${c2+1}] = ${out2}`;
        explanation = `Misma Columna ${c1 + 1}: Desplazamiento hacia arriba (-1 mod 5). ${dg[0]} → ${out1} y ${dg[1]} → ${out2}.`;
      }
    } else {
      // Regla C: RECTÁNGULO
      rule = 'rectangle';
      ruleNameEs = 'Regla C: Rectángulo (Esquinas Opuestas)';
      outPos1 = [r1, c2];
      outPos2 = [r2, c1];
      out1 = matrix[r1 * 5 + c2];
      out2 = matrix[r2 * 5 + c1];

      formula = `M1[F${r1+1}, C${c1+1}] & M2[F${r2+1}, C${c2+1}]  =>  C1[F${r1+1}, C${c2+1}] = ${out1}, C2[F${r2+1}, C${c1+1}] = ${out2}`;
      explanation = `Distinta fila y columna: Vértices opuestos. Cada letra conserva su fila y toma la columna de la otra: ${dg[0]}[F${r1+1}, C${c1+1}] → ${out1} y ${dg[1]}[F${r2+1}, C${c2+1}] → ${out2}.`;
    }

    const outPair = out1 + out2;
    outStr += outPair;

    steps.push({
      pairIndex: i,
      inPair: dg,
      outPair,
      rule,
      ruleNameEs,
      pos1: [r1, c1],
      pos2: [r2, c2],
      outPos1,
      outPos2,
      description:
        rule === 'row'
          ? `Misma fila ${r1 + 1}: ${direction === 'encrypt' ? 'derecha (→)' : 'izquierda (←)'} → ${outPair}`
          : rule === 'col'
          ? `Misma columna ${c1 + 1}: ${direction === 'encrypt' ? 'abajo (↓)' : 'arriba (↑)'} → ${outPair}`
          : `Rectángulo: Fila propia con columna opuesta → ${outPair}`,
      explanation,
      formula,
      digramInfo: digramDetails[i],
    });
  }

  return {
    matrix,
    digrams,
    digramDetails,
    outputText: outStr,
    formattedOutput: formatInBlocks(outStr),
    steps,
  };
}
