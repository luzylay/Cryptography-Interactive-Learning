// Vigenère, Beaufort, and Autokey Polyalphabetic Ciphers

import { ALPHABETS, AlphabetMode, normalizeText, formatInBlocks } from '../alphabets';
import { mod } from '../mathUtils';

export type VigenereVariant = 'vigenere' | 'beaufort' | 'autokey';

export interface VigenereStep {
  index: number;
  plainChar: string;
  keyChar: string;
  cipherChar: string;
  plainIndex: number;
  keyIndex: number;
  cipherIndex: number;
  sumFormula: string;
}

export function processVigenere(
  text: string,
  key: string,
  mode: AlphabetMode,
  direction: 'encrypt' | 'decrypt' = 'encrypt',
  variant: VigenereVariant = 'vigenere'
) {
  const normText = normalizeText(text, mode);
  const normKey = normalizeText(key, mode);
  const alpha = ALPHABETS[mode].chars;
  const m = ALPHABETS[mode].mod;

  if (!normKey.length) {
    return {
      inputText: normText,
      outputText: normText,
      formattedOutput: formatInBlocks(normText),
      steps: [],
      extendedKey: '',
      alpha,
      m,
    };
  }

  let extendedKey = '';
  if (variant === 'autokey') {
    if (direction === 'encrypt') {
      extendedKey = (normKey + normText).slice(0, normText.length);
    } else {
      // Kept dynamically during decryption
      extendedKey = normKey;
    }
  } else {
    // Periodic repeating key
    for (let i = 0; i < normText.length; i++) {
      extendedKey += normKey[i % normKey.length];
    }
  }

  const steps: VigenereStep[] = [];
  let outStr = '';

  for (let i = 0; i < normText.length; i++) {
    const tChar = normText[i];
    const tIdx = alpha.indexOf(tChar);
    if (tIdx === -1) continue;

    const kChar = variant === 'autokey' && direction === 'decrypt' ? extendedKey[i] : extendedKey[i];
    const kIdx = alpha.indexOf(kChar);

    let resIdx = 0;
    let formula = '';
    let pChar = tChar;
    let cChar = '';

    if (variant === 'vigenere') {
      if (direction === 'encrypt') {
        resIdx = mod(tIdx + kIdx, m);
        cChar = alpha[resIdx];
        formula = `(${tIdx} + ${kIdx}) mod ${m} = ${tIdx + kIdx} ≡ ${resIdx} → '${cChar}'`;
      } else {
        resIdx = mod(tIdx - kIdx, m);
        pChar = alpha[resIdx];
        cChar = tChar;
        formula = `(${tIdx} - ${kIdx} + ${m}) mod ${m} = ${resIdx} → '${pChar}'`;
        if (variant === 'autokey') extendedKey += pChar;
      }
    } else if (variant === 'beaufort') {
      // Beaufort formula: Ci = (Ki - Mi) mod m (both enc & dec are symmetrical)
      if (direction === 'encrypt') {
        resIdx = mod(kIdx - tIdx, m);
        cChar = alpha[resIdx];
        formula = `(${kIdx} - ${tIdx} + ${m}) mod ${m} = ${resIdx} → '${cChar}'`;
      } else {
        resIdx = mod(kIdx - tIdx, m);
        pChar = alpha[resIdx];
        cChar = tChar;
        formula = `(${kIdx} - ${tIdx} + ${m}) mod ${m} = ${resIdx} → '${pChar}'`;
      }
    }

    const outChar = direction === 'encrypt' ? cChar : pChar;
    outStr += outChar;

    steps.push({
      index: i,
      plainChar: direction === 'encrypt' ? tChar : pChar,
      keyChar: kChar,
      cipherChar: direction === 'encrypt' ? cChar : tChar,
      plainIndex: direction === 'encrypt' ? tIdx : resIdx,
      keyIndex: kIdx,
      cipherIndex: direction === 'encrypt' ? resIdx : tIdx,
      sumFormula: formula,
    });
  }

  return {
    inputText: normText,
    outputText: outStr,
    formattedOutput: formatInBlocks(outStr),
    steps,
    extendedKey,
    alpha,
    m,
  };
}
