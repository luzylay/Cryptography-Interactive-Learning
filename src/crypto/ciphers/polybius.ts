// Polybius 5x5 Square Cipher
import { formatInBlocks } from '../alphabets';

export const POLYBIUS_DEFAULT_ALPHA = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // 25 letters, I=J

export interface PolybiusStep {
  char: string;
  row: number;
  col: number;
  code: string;
  explanation: string;
}

export function buildPolybiusSquare(keyword: string = ''): string[] {
  const cleanKey = keyword
    .toUpperCase()
    .replace(/J/g, 'I')
    .replace(/Ñ/g, 'N')
    .replace(/[^A-Z]/g, '');

  const seen = new Set<string>();
  const square: string[] = [];

  for (const c of cleanKey) {
    if (!seen.has(c) && POLYBIUS_DEFAULT_ALPHA.includes(c)) {
      seen.add(c);
      square.push(c);
    }
  }

  for (const c of POLYBIUS_DEFAULT_ALPHA) {
    if (!seen.has(c)) {
      seen.add(c);
      square.push(c);
    }
  }

  return square;
}

export function processPolybius(
  text: string,
  direction: 'encrypt' | 'decrypt' = 'encrypt',
  keyword: string = ''
) {
  const square = buildPolybiusSquare(keyword);
  const clean = text.toUpperCase().replace(/J/g, 'I').replace(/Ñ/g, 'N');

  if (direction === 'encrypt') {
    const steps: PolybiusStep[] = [];
    let outStr = '';

    for (const c of clean) {
      const idx = square.indexOf(c);
      if (idx === -1) continue;
      const r = Math.floor(idx / 5) + 1;
      const col = (idx % 5) + 1;
      const code = `${r}${col}`;
      outStr += code;
      steps.push({
        char: c,
        row: r,
        col,
        code,
        explanation: `Letra '${c}' → Fila ${r}, Columna ${col} ⇒ Código '${code}'`,
      });
    }

    return {
      square,
      outputText: outStr,
      formattedOutput: formatInBlocks(outStr, 2),
      steps,
    };
  } else {
    // Decrypt digits pair by pair
    const digits = text.replace(/[^1-5]/g, '');
    let outStr = '';
    const steps: PolybiusStep[] = [];

    for (let i = 0; i + 1 < digits.length; i += 2) {
      const r = parseInt(digits[i], 10);
      const col = parseInt(digits[i + 1], 10);
      const idx = (r - 1) * 5 + (col - 1);
      const c = square[idx] || '?';
      outStr += c;
      steps.push({
        char: c,
        row: r,
        col,
        code: `${r}${col}`,
        explanation: `Código '${r}${col}' → Fila ${r}, Columna ${col} ⇒ Letra '${c}'`,
      });
    }

    return {
      square,
      outputText: outStr,
      formattedOutput: formatInBlocks(outStr),
      steps,
    };
  }
}
