// Polybius 5x5 Square Cipher

import { formatInBlocks } from '../alphabets';

export const POLYBIUS_DEFAULT_ALPHA = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // 25 letters, I=J

export interface PolybiusStep {
  char: string;
  row: number;
  col: number;
  code: string;
}

export function processPolybius(text: string, direction: 'encrypt' | 'decrypt' = 'encrypt') {
  const clean = text.toUpperCase().replace(/J/g, 'I').replace(/Ñ/g, 'N');

  if (direction === 'encrypt') {
    const steps: PolybiusStep[] = [];
    let outStr = '';

    for (const c of clean) {
      const idx = POLYBIUS_DEFAULT_ALPHA.indexOf(c);
      if (idx === -1) continue;
      const r = Math.floor(idx / 5) + 1;
      const col = (idx % 5) + 1;
      const code = `${r}${col}`;
      outStr += code;
      steps.push({ char: c, row: r, col, code });
    }

    return {
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
      const c = POLYBIUS_DEFAULT_ALPHA[idx] || '?';
      outStr += c;
      steps.push({ char: c, row: r, col, code: `${r}${col}` });
    }

    return {
      outputText: outStr,
      formattedOutput: formatInBlocks(outStr),
      steps,
    };
  }
}
