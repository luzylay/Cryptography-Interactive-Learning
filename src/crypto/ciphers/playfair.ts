// Playfair 5x5 Matrix Cipher - Didactic & Robust Implementation
import { formatInBlocks } from '../alphabets';

export const PLAYFAIR_DEFAULT_ALPHA = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // 25 letras: I = J unificadas

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
        explanation: `Última letra aislada '${c1}': se añade relleno nulo '${f}' para completar el dígrama.`
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
          explanation: `Letras gemelas consecutivas '${c1}${c2}': se separan insertando '${f}'. La segunda '${c2}' pasa al siguiente par.`
        });
        i += 1;
      } else {
        digrams.push({
          pair: c1 + c2,
          char1: c1,
          char2: c2,
          reason: 'normal',
          explanation: `Par estándar de letras distintas: '${c1}' y '${c2}'.`
        });
        i += 2;
      }
    }
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
  direction: 'encrypt' | 'decrypt' = 'encrypt'
) {
  const matrix = buildPlayfairMatrix(key);
  const digramDetails = splitIntoDigramsDetails(text);
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
      // MISMA FILA
      rule = 'row';
      ruleNameEs = 'Misma Fila (Desplazamiento Horizontal)';
      const nc1 = (c1 + shift) % 5;
      const nc2 = (c2 + shift) % 5;
      outPos1 = [r1, nc1];
      outPos2 = [r2, nc2];
      out1 = matrix[r1 * 5 + nc1];
      out2 = matrix[r2 * 5 + nc2];

      if (direction === 'encrypt') {
        formula = `c1' = (col1 + 1) mod 5 = (${c1 + 1} + 1) mod 5 = ${nc1 + 1}, c2' = (col2 + 1) mod 5 = (${c2 + 1} + 1) mod 5 = ${nc2 + 1}`;
        explanation = `Ambas letras comparten la Fila ${r1 + 1}. Regla: desplazar 1 posición a la DERECHA (con ciclo circular mod 5). ${dg[0]}[F${r1+1}, C${c1+1}] → ${out1}[F${r1+1}, C${nc1+1}] y ${dg[1]}[F${r2+1}, C${c2+1}] → ${out2}[F${r2+1}, C${nc2+1}].`;
      } else {
        formula = `c1' = (col1 - 1 + 5) mod 5 = ${nc1 + 1}, c2' = (col2 - 1 + 5) mod 5 = ${nc2 + 1}`;
        explanation = `Ambas letras comparten la Fila ${r1 + 1}. Regla inversa: desplazar 1 posición a la IZQUIERDA (con ciclo circular mod 5). ${dg[0]} → ${out1} y ${dg[1]} → ${out2}.`;
      }
    } else if (c1 === c2) {
      // MISMA COLUMNA
      rule = 'col';
      ruleNameEs = 'Misma Columna (Desplazamiento Vertical)';
      const nr1 = (r1 + shift) % 5;
      const nr2 = (r2 + shift) % 5;
      outPos1 = [nr1, c1];
      outPos2 = [nr2, c2];
      out1 = matrix[nr1 * 5 + c1];
      out2 = matrix[nr2 * 5 + c2];

      if (direction === 'encrypt') {
        formula = `r1' = (fila1 + 1) mod 5 = (${r1 + 1} + 1) mod 5 = ${nr1 + 1}, r2' = (fila2 + 1) mod 5 = (${r2 + 1} + 1) mod 5 = ${nr2 + 1}`;
        explanation = `Ambas letras comparten la Columna ${c1 + 1}. Regla: desplazar 1 posición hacia ABAJO (con ciclo circular mod 5). ${dg[0]}[F${r1+1}, C${c1+1}] → ${out1}[F${nr1+1}, C${c1+1}] y ${dg[1]}[F${r2+1}, C${c2+1}] → ${out2}[F${nr2+1}, C${c2+1}].`;
      } else {
        formula = `r1' = (fila1 - 1 + 5) mod 5 = ${nr1 + 1}, r2' = (fila2 - 1 + 5) mod 5 = ${nr2 + 1}`;
        explanation = `Ambas letras comparten la Columna ${c1 + 1}. Regla inversa: desplazar 1 posición hacia ARRIBA (con ciclo circular mod 5). ${dg[0]} → ${out1} y ${dg[1]} → ${out2}.`;
      }
    } else {
      // RECTÁNGULO
      rule = 'rectangle';
      ruleNameEs = 'Regla del Rectángulo (Esquinas Opuestas)';
      outPos1 = [r1, c2];
      outPos2 = [r2, c1];
      out1 = matrix[r1 * 5 + c2];
      out2 = matrix[r2 * 5 + c1];

      formula = `P1[F${r1+1}, C${c1+1}] → C1[F${r1+1}, C${c2+1}]=${out1}  |  P2[F${r2+1}, C${c2+1}] → C2[F${r2+1}, C${c1+1}]=${out2}`;
      explanation = `Las letras ocupan esquinas opuestas de un rectángulo de Filas ${Math.min(r1,r2)+1}..${Math.max(r1,r2)+1} y Cols ${Math.min(c1,c2)+1}..${Math.max(c1,c2)+1}. Regla: Cada letra conserva su PROPIA FILA pero adopta la COLUMNA de la otra letra. ¡El orden de las filas no cambia!`;
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
          ? `Misma fila ${r1 + 1}: desplazar a la ${direction === 'encrypt' ? 'derecha (→)' : 'izquierda (←)'} → ${outPair}`
          : rule === 'col'
          ? `Misma columna ${c1 + 1}: desplazar hacia ${direction === 'encrypt' ? 'abajo (↓)' : 'arriba (↑)'} → ${outPair}`
          : `Rectángulo: esquinas opuestas [F${r1 + 1}, C${c2 + 1}] y [F${r2 + 1}, C${c1 + 1}] → ${outPair}`,
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
