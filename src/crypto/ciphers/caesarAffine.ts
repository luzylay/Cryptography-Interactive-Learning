// Caesar, Affine and Keyword-Mixed Caesar Ciphers

import { ALPHABETS, AlphabetMode, normalizeText, formatInBlocks } from '../alphabets';
import { mod, modInverse, gcd } from '../mathUtils';

export interface AffineConfig {
  a: number; // Multiplicative key (must be coprime with m)
  b: number; // Additive shift key
  mode: AlphabetMode;
}

export interface CaesarAffineStep {
  index: number;
  plainChar: string;
  cipherChar: string;
  plainIndex: number;
  cipherIndex: number;
  formulaCalculation: string;
}

export function processCaesar(
  text: string,
  shift: number,
  mode: AlphabetMode,
  direction: 'encrypt' | 'decrypt' = 'encrypt'
) {
  return processAffine(
    text,
    { a: 1, b: direction === 'encrypt' ? shift : -shift, mode },
    'encrypt'
  );
}

export function processAffine(
  text: string,
  config: AffineConfig,
  direction: 'encrypt' | 'decrypt' = 'encrypt'
) {
  const norm = normalizeText(text, config.mode);
  const alpha = ALPHABETS[config.mode].chars;
  const m = ALPHABETS[config.mode].mod;

  const a = mod(config.a, m);
  const b = mod(config.b, m);
  const aInv = modInverse(a, m);

  const isCoprime = gcd(a, m) === 1;
  const steps: CaesarAffineStep[] = [];
  let outStr = '';

  if (!isCoprime || aInv === null) {
    return {
      isValid: false,
      errorMessage: `El coeficiente 'a' = ${a} no es coprimo con m = ${m} (mcd(${a}, ${m}) = ${gcd(a, m)} ≠ 1). No tiene inverso modular.`,
      inputText: norm,
      outputText: '',
      formattedOutput: '',
      steps: [],
      a,
      b,
      aInv: null,
      m,
      alphabet: alpha,
    };
  }

  for (let i = 0; i < norm.length; i++) {
    const char = norm[i];
    const idx = alpha.indexOf(char);
    if (idx === -1) continue;

    let resIdx: number;
    let formulaStr: string;

    if (direction === 'encrypt') {
      resIdx = mod(a * idx + b, m);
      const outChar = alpha[resIdx];
      formulaStr = `${char}(${idx}) → (${a} · ${idx} + ${b}) = ${a * idx + b} ≡ ${resIdx} (mod ${m}) → '${outChar}'`;
      steps.push({
        index: i,
        plainChar: char,
        cipherChar: outChar,
        plainIndex: idx,
        cipherIndex: resIdx,
        formulaCalculation: formulaStr,
      });
      outStr += outChar;
    } else {
      resIdx = mod(aInv * (idx - b), m);
      const outChar = alpha[resIdx];
      formulaStr = `${char}(${idx}) → ${aInv} · (${idx} - ${b}) = ${aInv * (idx - b)} ≡ ${resIdx} (mod ${m}) → '${outChar}'`;
      steps.push({
        index: i,
        plainChar: outChar,
        cipherChar: char,
        plainIndex: resIdx,
        cipherIndex: idx,
        formulaCalculation: formulaStr,
      });
      outStr += outChar;
    }
  }

  return {
    isValid: true,
    errorMessage: null,
    inputText: norm,
    outputText: outStr,
    formattedOutput: formatInBlocks(outStr),
    steps,
    a,
    b,
    aInv,
    m,
    alphabet: alpha,
  };
}

export function generateMixedAlphabet(keyword: string, startPos: number, mode: AlphabetMode): string {
  const normKey = normalizeText(keyword, mode);
  const alpha = ALPHABETS[mode].chars;
  const m = ALPHABETS[mode].mod;

  const seen = new Set<string>();
  const keyChars: string[] = [];
  for (const c of normKey) {
    if (!seen.has(c)) {
      seen.add(c);
      keyChars.push(c);
    }
  }

  const restChars = alpha.split('').filter(c => !seen.has(c));
  const fullMixed = [...keyChars, ...restChars];

  // Shift to startPos
  const offset = mod(startPos, m);
  const result: string[] = new Array(m);
  for (let i = 0; i < m; i++) {
    result[(i + offset) % m] = fullMixed[i];
  }

  return result.join('');
}
