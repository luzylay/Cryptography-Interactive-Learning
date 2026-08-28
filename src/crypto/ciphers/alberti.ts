// Alberti Cipher Engine with rotation, alignment, and polyalphabetic stepping

import { ALPHABETS, ALBERTI_HISTORICAL, AlphabetMode, normalizeText, formatInBlocks } from '../alphabets';
import { mod } from '../mathUtils';

export interface AlbertiDiskConfig {
  mode: AlphabetMode;
  outerChars: string;
  innerChars: string;
  rotation: number; // offset in positions (0 to N-1)
}

export interface AlbertiStep {
  index: number;
  plainChar: string;
  cipherChar: string;
  outerIndex: number;
  innerIndex: number;
  rotationUsed: number;
  explanation: string;
}

export interface AlbertiResult {
  mode: 'encrypt' | 'decrypt';
  inputText: string;
  outputText: string;
  formattedOutput: string;
  steps: AlbertiStep[];
  startRotation: number;
  endRotation: number;
  outerAlphabet: string;
  innerAlphabet: string;
}

export function getDefaultAlbertiConfig(mode: AlphabetMode): AlbertiDiskConfig {
  if (mode === 'alberti24') {
    return {
      mode,
      outerChars: ALBERTI_HISTORICAL.outer,
      innerChars: ALBERTI_HISTORICAL.inner.toUpperCase(),
      rotation: 0,
    };
  }
  const chars = ALPHABETS[mode].chars;
  return {
    mode,
    outerChars: chars,
    innerChars: chars,
    rotation: 0,
  };
}

export function getAlbertiAlignmentOffset(
  outerChar: string,
  innerChar: string,
  outerChars: string,
  innerChars: string
): number {
  const oIdx = outerChars.indexOf(outerChar.toUpperCase());
  const iIdx = innerChars.indexOf(innerChar.toUpperCase());
  if (oIdx === -1 || iIdx === -1) return 0;
  return mod(oIdx - iIdx, outerChars.length);
}

/**
 * Encrypt or decrypt using the Alberti Disk.
 * @param text Plaintext or Ciphertext
 * @param config Disk configuration (alphabets, initial rotation)
 * @param mode 'encrypt' or 'decrypt'
 * @param stepPeriod How many characters before rotating the inner disk (0 = static monoalphabetic)
 * @param stepAmount How many positions to advance each period (default 1)
 */
export function processAlberti(
  text: string,
  config: AlbertiDiskConfig,
  mode: 'encrypt' | 'decrypt' = 'encrypt',
  stepPeriod: number = 0,
  stepAmount: number = 1
): AlbertiResult {
  const norm = normalizeText(text, config.mode);
  const outer = config.outerChars;
  const inner = config.innerChars;
  const N = outer.length;

  let currentRot = mod(config.rotation, N);
  const steps: AlbertiStep[] = [];
  let outStr = '';

  for (let i = 0; i < norm.length; i++) {
    const char = norm[i];

    // Check if progressive stepping should occur
    if (stepPeriod > 0 && i > 0 && i % stepPeriod === 0) {
      currentRot = mod(currentRot + stepAmount, N);
    }

    if (mode === 'encrypt') {
      const oIdx = outer.indexOf(char);
      if (oIdx === -1) continue;

      // Inner character aligned with this outer character
      // outer[pos] aligns with inner[ (pos - currentRot + N) % N ]
      const iIdx = mod(oIdx - currentRot, N);
      const cChar = inner[iIdx];
      outStr += cChar;

      steps.push({
        index: i,
        plainChar: char,
        cipherChar: cChar,
        outerIndex: oIdx,
        innerIndex: iIdx,
        rotationUsed: currentRot,
        explanation: `Pos ${i + 1}: Claro '${char}' (ext #${oIdx}) con giro k=${currentRot} → Cifrado '${cChar}' (int #${iIdx})`,
      });
    } else {
      // Decrypt: Find char in inner disk, look up matching outer disk char
      const iIdx = inner.indexOf(char);
      if (iIdx === -1) continue;

      const oIdx = mod(iIdx + currentRot, N);
      const pChar = outer[oIdx];
      outStr += pChar;

      steps.push({
        index: i,
        plainChar: pChar,
        cipherChar: char,
        outerIndex: oIdx,
        innerIndex: iIdx,
        rotationUsed: currentRot,
        explanation: `Pos ${i + 1}: Cifrado '${char}' (int #${iIdx}) con giro k=${currentRot} → Claro '${pChar}' (ext #${oIdx})`,
      });
    }
  }

  return {
    mode,
    inputText: norm,
    outputText: outStr,
    formattedOutput: formatInBlocks(outStr),
    steps,
    startRotation: config.rotation,
    endRotation: currentRot,
    outerAlphabet: outer,
    innerAlphabet: inner,
  };
}
