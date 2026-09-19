// Cryptanalysis of Continuous Key (Running Key) & Autokey Ciphers
// Methods: Probable-Word (Crib Dragging), Cascade Feedforward Analysis, Linguistic Plausibility Scoring

import { ALPHABETS, AlphabetMode, FREQ_SPANISH, FREQ_ENGLISH, normalizeText } from './alphabets';
import { mod } from './mathUtils';

// Common high-frequency digraphs in Spanish and English
const COMMON_DIGRAPHS_ES = new Set([
  'DE', 'EN', 'ER', 'ES', 'EL', 'LA', 'OS', 'AR', 'ON', 'AS', 'RA', 'RE', 'TA', 'OR', 'NT',
  'AL', 'AN', 'CO', 'TE', 'IN', 'SE', 'DO', 'RO', 'UE', 'AD', 'LE', 'CI', 'IO', 'ST', 'UN',
  'QU', 'ME', 'NE', 'IS', 'TR', 'TO', 'MA', 'SO', 'AC', 'ND', 'PR', 'OR', 'DI', 'EM', 'CA'
]);

const COMMON_DIGRAPHS_EN = new Set([
  'TH', 'HE', 'IN', 'ER', 'AN', 'RE', 'ON', 'AT', 'EN', 'ND', 'TI', 'ES', 'OR', 'TE', 'OF',
  'ED', 'IS', 'IT', 'AL', 'AR', 'ST', 'TO', 'NT', 'NG', 'SE', 'HA', 'AS', 'OU', 'IO', 'LE',
  'VE', 'CO', 'ME', 'DE', 'HI', 'RI', 'RO', 'IC', 'NE', 'EA', 'RA', 'CE', 'LI', 'CH', 'LL'
]);

// Highly improbable or invalid digraphs (heuristics to immediately penalize nonsense)
const FORBIDDEN_DIGRAPHS = new Set([
  'QX', 'QZ', 'QJ', 'QK', 'QW', 'QY', 'QP', 'QB', 'QC', 'QD', 'QF', 'QG', 'QH', 'QL', 'QM', 'QN', 'QR', 'QS', 'QT', 'QV',
  'WQ', 'WJ', 'WX', 'WZ', 'VK', 'VQ', 'VJ', 'XZ', 'XQ', 'XK', 'XJ', 'ZQ', 'ZX', 'ZJ', 'ZK', 'JJ', 'KK', 'WW', 'YY'
]);

export interface CribDragPosition {
  position: number;
  crib: string;
  cipherChunk: string;
  candidateKey: string;
  score: number; // 0 to 100
  verdict: 'alta' | 'media' | 'baja';
  explanation: string;
}

/**
 * Performs Crib Dragging (Probable-Word Attack) across all positions of a ciphertext.
 * For each position i: K_cand[j] = (C[i+j] - Crib[j]) mod m
 */
export function performCribDragging(
  ciphertext: string,
  crib: string,
  mode: AlphabetMode
): {
  results: CribDragPosition[];
  bestPosition: CribDragPosition | null;
  totalPositions: number;
} {
  const normCipher = normalizeText(ciphertext, mode);
  const normCrib = normalizeText(crib, mode);
  const alpha = ALPHABETS[mode].chars;
  const m = ALPHABETS[mode].mod;
  const freqTable = mode === 'en26' ? FREQ_ENGLISH : FREQ_SPANISH;
  const commonDigraphs = mode === 'en26' ? COMMON_DIGRAPHS_EN : COMMON_DIGRAPHS_ES;

  if (normCipher.length < normCrib.length || normCrib.length === 0) {
    return { results: [], bestPosition: null, totalPositions: 0 };
  }

  const results: CribDragPosition[] = [];

  for (let i = 0; i <= normCipher.length - normCrib.length; i++) {
    const cipherChunk = normCipher.slice(i, i + normCrib.length);
    let candidateKey = '';
    let rawScore = 0;
    let hasForbidden = false;

    // Calculate candidate key chunk
    for (let j = 0; j < normCrib.length; j++) {
      const cIdx = alpha.indexOf(cipherChunk[j]);
      const cribIdx = alpha.indexOf(normCrib[j]);
      if (cIdx === -1 || cribIdx === -1) continue;

      const kIdx = mod(cIdx - cribIdx, m);
      const kChar = alpha[kIdx];
      candidateKey += kChar;

      // Add unigram frequency weight
      rawScore += freqTable[kChar] || 0;
    }

    // Evaluate digraphs inside candidate key
    let validDigraphCount = 0;
    for (let j = 0; j < candidateKey.length - 1; j++) {
      const pair = candidateKey.slice(j, j + 2);
      if (commonDigraphs.has(pair)) {
        rawScore += 15;
        validDigraphCount++;
      }
      if (FORBIDDEN_DIGRAPHS.has(pair)) {
        rawScore -= 30;
        hasForbidden = true;
      }
    }

    // Normalize score to 0..100
    const normalizedScore = Math.max(0, Math.min(100, Math.round((rawScore / (normCrib.length * 14)) * 100)));

    let verdict: 'alta' | 'media' | 'baja' = 'baja';
    let explanation = '';

    if (hasForbidden || normalizedScore < 30) {
      verdict = 'baja';
      explanation = `Genera combinaciones poco naturales o infrecuentes ('${candidateKey}').`;
    } else if (normalizedScore >= 60 || validDigraphCount >= 1) {
      verdict = 'alta';
      explanation = `Clave deducida '${candidateKey}' altamente compatible con patrones de lenguaje natural.`;
    } else {
      verdict = 'media';
      explanation = `Clave deducida '${candidateKey}' plausible estadísticamente.`;
    }

    results.push({
      position: i,
      crib: normCrib,
      cipherChunk,
      candidateKey,
      score: normalizedScore,
      verdict,
      explanation,
    });
  }

  // Sort by highest score first
  const sorted = [...results].sort((a, b) => b.score - a.score);
  const bestPosition = sorted.length > 0 ? sorted[0] : null;

  return {
    results,
    bestPosition,
    totalPositions: results.length,
  };
}

export interface AutokeyCascadeStep {
  index: number;
  cipherChar: string;
  keyChar: string;
  plainChar: string;
  source: 'semilla' | 'cascada_texto_anterior';
  formula: string;
}

export interface AutokeyCascadeResult {
  seed: string;
  plaintext: string;
  score: number;
  steps: AutokeyCascadeStep[];
  isValidLanguage: boolean;
}

/**
 * Solves an Autokey cipher using a candidate seed by propagating the cascade feedback:
 * M[i] = (C[i] - Seed[i]) mod m  for i < seedLen
 * M[i] = (C[i] - M[i - seedLen]) mod m  for i >= seedLen
 */
export function solveAutokeyCascade(
  ciphertext: string,
  seedCandidate: string,
  mode: AlphabetMode
): AutokeyCascadeResult {
  const normCipher = normalizeText(ciphertext, mode);
  const normSeed = normalizeText(seedCandidate, mode);
  const alpha = ALPHABETS[mode].chars;
  const m = ALPHABETS[mode].mod;
  const freqTable = mode === 'en26' ? FREQ_ENGLISH : FREQ_SPANISH;
  const commonDigraphs = mode === 'en26' ? COMMON_DIGRAPHS_EN : COMMON_DIGRAPHS_ES;

  if (!normSeed.length || !normCipher.length) {
    return {
      seed: normSeed,
      plaintext: '',
      score: 0,
      steps: [],
      isValidLanguage: false,
    };
  }

  const steps: AutokeyCascadeStep[] = [];
  let plaintext = '';
  let fullKey = normSeed;
  let totalScore = 0;
  let forbiddenCount = 0;

  for (let i = 0; i < normCipher.length; i++) {
    const cChar = normCipher[i];
    const cIdx = alpha.indexOf(cChar);
    if (cIdx === -1) continue;

    const kChar = fullKey[i];
    const kIdx = alpha.indexOf(kChar);

    const pIdx = mod(cIdx - kIdx, m);
    const pChar = alpha[pIdx];

    plaintext += pChar;
    // Autokey feedback: decrypted character becomes the future key!
    fullKey += pChar;

    totalScore += freqTable[pChar] || 0;

    steps.push({
      index: i,
      cipherChar: cChar,
      keyChar: kChar,
      plainChar: pChar,
      source: i < normSeed.length ? 'semilla' : 'cascada_texto_anterior',
      formula: `(${cIdx} - ${kIdx} + ${m}) mod ${m} = ${pIdx} → '${pChar}'`,
    });
  }

  // Check language coherence of the resulting plaintext
  let digraphMatches = 0;
  for (let j = 0; j < plaintext.length - 1; j++) {
    const pair = plaintext.slice(j, j + 2);
    if (commonDigraphs.has(pair)) {
      digraphMatches++;
      totalScore += 8;
    }
    if (FORBIDDEN_DIGRAPHS.has(pair)) {
      forbiddenCount++;
      totalScore -= 20;
    }
  }

  const normalizedScore = Math.max(0, Math.min(100, Math.round((totalScore / (normCipher.length * 12)) * 100)));
  const isValidLanguage = normalizedScore >= 55 && forbiddenCount === 0;

  return {
    seed: normSeed,
    plaintext,
    score: normalizedScore,
    steps,
    isValidLanguage,
  };
}

/**
 * Automatically searches for short seeds (length 1 to 5) to break an Autokey ciphertext
 */
export function autoCrackAutokey(
  ciphertext: string,
  mode: AlphabetMode,
  maxCandidates: number = 8
): AutokeyCascadeResult[] {
  const normCipher = normalizeText(ciphertext, mode);
  const alpha = ALPHABETS[mode].chars;

  if (normCipher.length < 4) return [];

  // Common seed candidates in cryptographic training sets
  const COMMON_SEEDS = [
    'A', 'K', 'C', 'E', 'L', 'M', 'R', 'S', 'T',
    'LA', 'EL', 'EN', 'DE', 'NO', 'SI', 'MI', 'TU',
    'SOL', 'PAZ', 'KEY', 'LUC', 'RED', 'SKY', 'RIO', 'LUZ',
    'ROMA', 'CLAVE', 'CIPHER', 'SECRET', 'TESORO', 'DELTA'
  ];

  const results: AutokeyCascadeResult[] = [];

  for (const seed of COMMON_SEEDS) {
    const res = solveAutokeyCascade(normCipher, seed, mode);
    results.push(res);
  }

  // Also test all single-letter seeds (A..Z)
  for (const char of alpha) {
    if (!COMMON_SEEDS.includes(char)) {
      results.push(solveAutokeyCascade(normCipher, char, mode));
    }
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, maxCandidates);
}
