// Centralized Cryptographic Domain Types

import { AlphabetMode } from '../crypto/alphabets';

export type CipherId =
  | 'polybius'
  | 'alberti'
  | 'caesar'
  | 'affine'
  | 'vigenere'
  | 'playfair'
  | 'hill'
  | 'scytale'
  | 'columnar';

export interface CipherTraceStep {
  char: string;
  mapped: string;
  explanation: string;
  extra?: Record<string, any>;
}

export interface CipherResult {
  text: string;
  trace?: CipherTraceStep[];
  error?: string;
}

export interface ICipherAlgorithm {
  id: CipherId;
  name: string;
  category: 'sustitucion_mono' | 'sustitucion_poli' | 'transposicion' | 'fraccionamiento';
  historicalPeriod: string;
  author: string;
  encrypt: (input: string, keyParams: any, mode: AlphabetMode) => CipherResult | string;
  decrypt: (input: string, keyParams: any, mode: AlphabetMode) => CipherResult | string;
}
