// Alphabets, character normalizations, and statistical frequencies for Cryptography

export type AlphabetMode = 'es27' | 'en26' | 'alberti24';

export const ALPHABETS: Record<AlphabetMode, {
  id: AlphabetMode;
  name: string;
  shortName: string;
  chars: string;
  mod: number;
  hasN: boolean;
  description: string;
}> = {
  es27: {
    id: 'es27',
    name: 'Castellano (27 letras, con Ñ)',
    shortName: 'Con Ñ (mod 27)',
    chars: 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ',
    mod: 27,
    hasN: true,
    description: 'Alfabeto estándar en español: A=0, ..., N=13, Ñ=14, O=15, ..., Z=26',
  },
  en26: {
    id: 'en26',
    name: 'Internacional / Inglés (26 letras, sin Ñ)',
    shortName: 'Sin Ñ (mod 26)',
    chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    mod: 26,
    hasN: false,
    description: 'Alfabeto internacional: A=0, ..., Z=25 (la Ñ se transforma en N o NH)',
  },
  alberti24: {
    id: 'alberti24',
    name: 'Histórico de Alberti (24 caracteres)',
    shortName: 'Alberti (24 car.)',
    chars: 'ABCDEFGILMNOPQRSTVXZ1234',
    mod: 24,
    hasN: false,
    description: 'Disco exterior histórico de Leon Battista Alberti (latín + códigos 1-4)',
  },
};

export const ALBERTI_HISTORICAL = {
  // Outer disk (24 chars): Latin capitals without H, J, K, Ñ, U, W, Y + digits 1,2,3,4
  outer: 'ABCDEFGILMNOPQRSTVXZ1234',
  // Inner disk (24 chars): lowercase Latin including &, h, k, y, without j, u, w, ñ
  inner: 'gklnprtvz&xysomqihfdbace',
};

// Frequency distributions
export const FREQ_SPANISH: Record<string, number> = {
  E: 13.11, A: 10.60, S: 8.47, O: 8.23, I: 7.16, N: 7.14, R: 6.95, D: 5.87, T: 5.40,
  C: 4.85, L: 4.42, U: 4.34, M: 3.11, P: 2.71, G: 1.40, B: 1.16, F: 1.13, V: 0.82,
  Y: 0.79, Q: 0.74, H: 0.60, Z: 0.26, J: 0.25, X: 0.15, W: 0.12, K: 0.11, Ñ: 0.10,
};

export const FREQ_ENGLISH: Record<string, number> = {
  E: 12.70, T: 9.06, A: 8.17, O: 7.51, I: 6.97, N: 6.75, S: 6.33, H: 6.09, R: 5.99,
  D: 4.25, L: 4.03, C: 2.78, U: 2.76, M: 2.41, W: 2.36, F: 2.23, G: 2.02, Y: 1.97,
  P: 1.93, B: 1.49, V: 0.98, K: 0.77, J: 0.15, X: 0.15, Q: 0.10, Z: 0.07,
};

export function normalizeText(text: string, mode: AlphabetMode): string {
  const alphaCfg = ALPHABETS[mode];
  const charMap: Record<string, string> = {
    Á: 'A', É: 'E', Í: 'I', Ó: 'O', Ú: 'U', Ü: 'U',
    á: 'A', é: 'E', í: 'I', ó: 'O', ú: 'U', ü: 'U',
  };

  if (!alphaCfg.hasN) {
    charMap['Ñ'] = 'N';
    charMap['ñ'] = 'n';
  }

  const cleaned = text
    .toUpperCase()
    .split('')
    .map(c => charMap[c] ?? c)
    .filter(c => alphaCfg.chars.includes(c))
    .join('');

  return cleaned;
}

export function formatInBlocks(text: string, blockSize = 5): string {
  return text.match(new RegExp(`.{1,${blockSize}}`, 'g'))?.join(' ') ?? text;
}
