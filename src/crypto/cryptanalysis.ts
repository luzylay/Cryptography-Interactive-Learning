// Cryptanalysis tools: Frequency Analysis, Index of Coincidence, Kasiski Test, Caesar Cracker

import { ALPHABETS, AlphabetMode, FREQ_SPANISH, FREQ_ENGLISH, normalizeText } from './alphabets';
import { mod, gcd } from './mathUtils';

export interface FrequencyStat {
  char: string;
  count: number;
  percentage: number;
  expectedPercentage: number;
}

export function calculateFrequencies(text: string, mode: AlphabetMode): FrequencyStat[] {
  const norm = normalizeText(text, mode);
  const alpha = ALPHABETS[mode].chars;
  const total = norm.length;
  const counts: Record<string, number> = {};

  for (const c of alpha) counts[c] = 0;
  for (const c of norm) counts[c] = (counts[c] || 0) + 1;

  const expectedTable = mode === 'en26' ? FREQ_ENGLISH : FREQ_SPANISH;

  return alpha.split('').map(char => {
    const count = counts[char] || 0;
    const percentage = total > 0 ? (count / total) * 100 : 0;
    const expectedPercentage = expectedTable[char] || 0;
    return {
      char,
      count,
      percentage,
      expectedPercentage,
    };
  });
}

/**
 * Calculates Index of Coincidence (IC)
 * IC = sum( f_i * (f_i - 1) ) / ( N * (N - 1) )
 */
export function calculateIndexOfCoincidence(text: string, mode: AlphabetMode): number {
  const norm = normalizeText(text, mode);
  const N = norm.length;
  if (N <= 1) return 0;

  const counts: Record<string, number> = {};
  for (const c of norm) counts[c] = (counts[c] || 0) + 1;

  let sum = 0;
  for (const c in counts) {
    const f = counts[c];
    sum += f * (f - 1);
  }

  return sum / (N * (N - 1));
}

export interface KasiskiRepetition {
  pattern: string;
  positions: number[];
  distances: number[];
}

export function performKasiski(text: string, mode: AlphabetMode, minLen = 3, maxLen = 5): {
  repetitions: KasiskiRepetition[];
  suggestedKeyLengths: { length: number; score: number }[];
} {
  const norm = normalizeText(text, mode);
  const patterns: Record<string, number[]> = {};

  for (let len = minLen; len <= maxLen; len++) {
    for (let i = 0; i <= norm.length - len; i++) {
      const sub = norm.slice(i, i + len);
      if (!patterns[sub]) patterns[sub] = [];
      patterns[sub].push(i);
    }
  }

  const repetitions: KasiskiRepetition[] = [];
  const distanceCounts: Record<number, number> = {};

  for (const pattern in patterns) {
    const pos = patterns[pattern];
    if (pos.length >= 2) {
      const distances: number[] = [];
      for (let j = 0; j < pos.length - 1; j++) {
        const d = pos[j + 1] - pos[j];
        distances.push(d);

        // Factorize distances (2..16)
        for (let k = 2; k <= 16; k++) {
          if (d % k === 0) {
            distanceCounts[k] = (distanceCounts[k] || 0) + 1;
          }
        }
      }
      repetitions.push({ pattern, positions: pos, distances });
    }
  }

  const suggestedKeyLengths = Object.entries(distanceCounts)
    .map(([lenStr, score]) => ({ length: parseInt(lenStr, 10), score }))
    .sort((a, b) => b.score - a.score);

  return {
    repetitions: repetitions.sort((a, b) => b.pattern.length - a.pattern.length),
    suggestedKeyLengths,
  };
}

export interface CaesarCrackCandidate {
  shift: number;
  decryptedSample: string;
  score: number; // chi-squared or dot product score (higher is better fit)
}

export function crackCaesar(ciphertext: string, mode: AlphabetMode): CaesarCrackCandidate[] {
  const norm = normalizeText(ciphertext, mode);
  const alpha = ALPHABETS[mode].chars;
  const m = ALPHABETS[mode].mod;
  const expectedTable = mode === 'en26' ? FREQ_ENGLISH : FREQ_SPANISH;

  const candidates: CaesarCrackCandidate[] = [];

  for (let k = 0; k < m; k++) {
    let dec = '';
    const counts: Record<string, number> = {};
    for (const c of alpha) counts[c] = 0;

    for (const c of norm) {
      const idx = alpha.indexOf(c);
      if (idx !== -1) {
        const pIdx = mod(idx - k, m);
        const pChar = alpha[pIdx];
        dec += pChar;
        counts[pChar] = (counts[pChar] || 0) + 1;
      }
    }

    // Compute dot product of observed frequencies with expected frequencies
    let score = 0;
    const total = norm.length || 1;
    for (const c of alpha) {
      const obsPct = (counts[c] / total) * 100;
      const expPct = expectedTable[c] || 0;
      score += obsPct * expPct;
    }

    candidates.push({
      shift: k,
      decryptedSample: dec.slice(0, 60),
      score,
    });
  }

  return candidates.sort((a, b) => b.score - a.score);
}
