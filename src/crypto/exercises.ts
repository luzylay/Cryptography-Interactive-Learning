// Exercise and Quiz generator with step-by-step mathematical proofs and hints

import { ALPHABETS, AlphabetMode, normalizeText, formatInBlocks } from './alphabets';
import { processAlberti, getDefaultAlbertiConfig } from './ciphers/alberti';
import { processAffine } from './ciphers/caesarAffine';
import { processVigenere } from './ciphers/vigenere';
import { processPlayfair } from './ciphers/playfair';
import { processHill2x2 } from './ciphers/hill';
import { processColumnarTransposition, processScytale } from './ciphers/transposition';
import { calculateFrequencies } from './cryptanalysis';
import { getCoprimes, isHillMatrixValid2x2 } from './mathUtils';

export type ExerciseCipherType =
  | 'alberti'
  | 'cesar'
  | 'afin'
  | 'vigenere'
  | 'beaufort'
  | 'playfair'
  | 'hill'
  | 'transposicion'
  | 'escitala'
  | 'frecuencia';

export interface ExerciseItem {
  id: string;
  cipherType: ExerciseCipherType;
  mode: 'encrypt' | 'decrypt' | 'find_key';
  title: string;
  question: string;
  contextParams: Record<string, any>;
  expectedAnswer: string;
  hint: string;
  detailedSteps: string[];
  alphabetMode: AlphabetMode;
}

const SAMPLE_TEXTS = [
  'VINI VIDI VINCI',
  'AL CESAR LO QUE ES DEL CESAR',
  'EL DISCO DE ALBERTI ES EL PRIMER CIFRADOR POLIALFABETICO',
  'ATACAMOS AL AMANECER POR EL FLANCO DERECHO',
  'LA SEGURIDAD EN REDES REQUIERE CRIPTOGRAFIA ROBUSTA',
  'EL ARTE DE PROTEGER LA INFORMACION CONFIDENCIAL',
  'EL CRIPTOANALISIS REVELA LOS PATRONES DEL MENSAJE',
  'TODOS LOS HOMBRES DESEAN POR NATURALEZA SABER',
  'LA CLAVE SECRETA DEBE MANTENERSE EN PRIVACIDAD',
  'NO TODO LO QUE BRILLA ES ORO NI TODO LO QUE RELUCE PLATA',
];

const KEYS_VIGENERE = ['CLAVE', 'SECRETO', 'ENIGMA', 'ROMA', 'DELTA', 'ALBERTI', 'CIPHER', 'MATRIX'];
const KEYS_PLAYFAIR = ['CRIPTOGRAFIA', 'PLAYFAIR', 'SEGURIDAD', 'MONARQUIA', 'HISTORIA', 'UNIVERSIDAD'];
const KEYS_COLUMNAR = ['ORDEN', 'CLAVE', 'SIGMA', 'DELTA', 'NOBLE', 'PRISMA'];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateExercise(cipherType: ExerciseCipherType, alphabetMode: AlphabetMode): ExerciseItem {
  const m = ALPHABETS[alphabetMode].mod;
  const rawText = pickRandom(SAMPLE_TEXTS);
  const normText = normalizeText(rawText, alphabetMode);

  switch (cipherType) {
    case 'alberti': {
      const rotation = randInt(1, m - 1);
      const config = getDefaultAlbertiConfig(alphabetMode);
      config.rotation = rotation;
      const isEncrypt = Math.random() > 0.4;
      const res = processAlberti(normText, config, isEncrypt ? 'encrypt' : 'decrypt');

      const outerRef = config.outerChars[0];
      const innerRef = config.innerChars[res.endRotation % m];

      return {
        id: `alberti-${Date.now()}`,
        cipherType: 'alberti',
        mode: isEncrypt ? 'encrypt' : 'decrypt',
        title: 'Cifrador de Disco de Alberti',
        question: isEncrypt
          ? `Gira el disco interior de Alberti ${rotation} posiciones en sentido horario (haciendo coincidir la letra exterior '${outerRef}' con la interior '${innerRef}'). Cifra el texto:\n\n"${normText}"`
          : `Con el disco interior alineado en desfase k = ${rotation} ('${outerRef}' ↔ '${innerRef}'), descifra el siguiente criptograma:\n\n"${formatInBlocks(res.outputText)}"`,
        contextParams: { rotation, startChar: outerRef, alignedChar: innerRef },
        expectedAnswer: isEncrypt ? res.outputText : normText,
        hint: `Busca la primera letra en el anillo exterior y lee la letra correspondiente directamente en el anillo interior (desplazamiento k = ${rotation}).`,
        detailedSteps: res.steps.slice(0, 8).map(s => s.explanation),
        alphabetMode,
      };
    }

    case 'cesar': {
      const shift = randInt(1, m - 1);
      const isEncrypt = Math.random() > 0.4;
      const res = processAffine(normText, { a: 1, b: isEncrypt ? shift : -shift, mode: alphabetMode });

      return {
        id: `cesar-${Date.now()}`,
        cipherType: 'cesar',
        mode: isEncrypt ? 'encrypt' : 'decrypt',
        title: 'Cifrador del César (Desplazamiento)',
        question: isEncrypt
          ? `Aplica el cifrado del César con desplazamiento k = ${shift} (módulo ${m}) al mensaje:\n\n"${normText}"`
          : `Descifra el criptograma del César generado con k = ${shift} (módulo ${m}):\n\n"${formatInBlocks(res.outputText)}"`,
        contextParams: { shift, m },
        expectedAnswer: isEncrypt ? res.outputText : normText,
        hint: isEncrypt
          ? `Fórmula: C_i = (M_i + ${shift}) mod ${m}`
          : `Fórmula: M_i = (C_i - ${shift} + ${m}) mod ${m}`,
        detailedSteps: res.steps.slice(0, 10).map(s => s.formulaCalculation),
        alphabetMode,
      };
    }

    case 'afin': {
      const coprimes = getCoprimes(m).filter(c => c > 1);
      const a = pickRandom(coprimes);
      const b = randInt(1, m - 1);
      const isEncrypt = Math.random() > 0.4;
      const res = processAffine(normText, { a, b, mode: alphabetMode }, isEncrypt ? 'encrypt' : 'decrypt');

      return {
        id: `afin-${Date.now()}`,
        cipherType: 'afin',
        mode: isEncrypt ? 'encrypt' : 'decrypt',
        title: 'Cifrador Afín',
        question: isEncrypt
          ? `Cifra con la función afín C_i = (${a} · M_i + ${b}) mod ${m} el siguiente texto:\n\n"${normText}"`
          : `Descifra el criptograma sabiendo que fue cifrado con C_i = (${a} · M_i + ${b}) mod ${m} (inverso a⁻¹ = ${res.aInv}):\n\n"${formatInBlocks(res.outputText)}"`,
        contextParams: { a, b, aInv: res.aInv, m },
        expectedAnswer: isEncrypt ? res.outputText : normText,
        hint: isEncrypt
          ? `Para cada letra calcula: ( ${a} × índice + ${b} ) mod ${m}`
          : `Usa la función inversa: M_i = ${res.aInv} · (C_i - ${b}) mod ${m}`,
        detailedSteps: res.steps.slice(0, 8).map(s => s.formulaCalculation),
        alphabetMode,
      };
    }

    case 'vigenere': {
      const key = pickRandom(KEYS_VIGENERE);
      const isEncrypt = Math.random() > 0.4;
      const res = processVigenere(normText, key, alphabetMode, isEncrypt ? 'encrypt' : 'decrypt');

      return {
        id: `vigenere-${Date.now()}`,
        cipherType: 'vigenere',
        mode: isEncrypt ? 'encrypt' : 'decrypt',
        title: 'Cifrador de Vigenère',
        question: isEncrypt
          ? `Cifra con Vigenère usando la clave "${key}" (mod ${m}):\n\n"${normText}"`
          : `Descifra con Vigenère usando la clave "${key}" (mod ${m}):\n\n"${formatInBlocks(res.outputText)}"`,
        contextParams: { key, m },
        expectedAnswer: isEncrypt ? res.outputText : normText,
        hint: `Repite la clave "${key}" sobre el texto. Suma módulo ${m} de los índices de cada posición.`,
        detailedSteps: res.steps.slice(0, 10).map(s => `Pos ${s.index + 1}: ${s.plainChar} + ${s.keyChar} → ${s.sumFormula}`),
        alphabetMode,
      };
    }

    case 'beaufort': {
      const key = pickRandom(KEYS_VIGENERE);
      const isEncrypt = Math.random() > 0.4;
      const res = processVigenere(normText, key, alphabetMode, isEncrypt ? 'encrypt' : 'decrypt', 'beaufort');

      return {
        id: `beaufort-${Date.now()}`,
        cipherType: 'beaufort',
        mode: isEncrypt ? 'encrypt' : 'decrypt',
        title: 'Cifrador de Beaufort',
        question: isEncrypt
          ? `Cifra con la variante de Beaufort (C_i = (K_i - M_i) mod ${m}) usando la clave "${key}":\n\n"${normText}"`
          : `Descifra con Beaufort (M_i = (K_i - C_i) mod ${m}) usando la clave "${key}":\n\n"${formatInBlocks(res.outputText)}"`,
        contextParams: { key, m },
        expectedAnswer: isEncrypt ? res.outputText : normText,
        hint: `Beaufort resta el carácter del mensaje del carácter de la clave: (Clave - Mensaje + ${m}) mod ${m}`,
        detailedSteps: res.steps.slice(0, 10).map(s => `Pos ${s.index + 1}: ${s.keyChar} - ${s.plainChar} → ${s.sumFormula}`),
        alphabetMode,
      };
    }

    case 'playfair': {
      const key = pickRandom(KEYS_PLAYFAIR);
      const isEncrypt = Math.random() > 0.4;
      const res = processPlayfair(normText, key, isEncrypt ? 'encrypt' : 'decrypt');

      return {
        id: `playfair-${Date.now()}`,
        cipherType: 'playfair',
        mode: isEncrypt ? 'encrypt' : 'decrypt',
        title: 'Cifrador de Playfair (5×5)',
        question: isEncrypt
          ? `Cifra con Playfair (clave "${key}", matriz 5×5, I=J, Ñ→N):\n\n"${normText}"`
          : `Descifra con Playfair (clave "${key}", matriz 5×5, I=J, Ñ→N):\n\n"${formatInBlocks(res.outputText)}"`,
        contextParams: { key, matrix: res.matrix },
        expectedAnswer: isEncrypt ? res.outputText : normText.replace(/J/g, 'I').replace(/Ñ/g, 'N'),
        hint: `Divide en pares (digramas). Aplica regla de misma fila (derecha), misma columna (abajo) o rectángulo (esquinas opuestas).`,
        detailedSteps: res.steps.slice(0, 8).map(s => `${s.inPair} → ${s.outPair}: ${s.description}`),
        alphabetMode,
      };
    }

    case 'hill': {
      let matrix: number[][];
      do {
        matrix = [
          [randInt(1, 9), randInt(0, 9)],
          [randInt(0, 9), randInt(1, 9)],
        ];
      } while (!isHillMatrixValid2x2(matrix, m));

      const isEncrypt = Math.random() > 0.4;
      const res = processHill2x2(normText, matrix, alphabetMode, isEncrypt ? 'encrypt' : 'decrypt');

      return {
        id: `hill-${Date.now()}`,
        cipherType: 'hill',
        mode: isEncrypt ? 'encrypt' : 'decrypt',
        title: `Cifrador de Hill 2×2 (mod ${m})`,
        question: isEncrypt
          ? `Cifra con Hill 2×2, matriz K = [[${matrix[0].join(',')}],[${matrix[1].join(',')}]]:\n\n"${normText}"`
          : `Descifra el criptograma sabiendo que K = [[${matrix[0].join(',')}],[${matrix[1].join(',')}]] (det=${res.det}, inv=${res.detInv}):\n\n"${formatInBlocks(res.outputText)}"`,
        contextParams: { matrix, det: res.det, detInv: res.detInv, invMatrix: res.invMatrix },
        expectedAnswer: isEncrypt ? res.outputText : normText.padEnd(Math.ceil(normText.length / 2) * 2, 'X'),
        hint: `Agrupa en pares de 2 letras [M1, M2] y multiplica por la matriz: C = K · M mod ${m}`,
        detailedSteps: res.steps.slice(0, 6).flatMap(s => [`Digrama [${s.inBlock}]:`, ...s.dotProducts]),
        alphabetMode,
      };
    }

    case 'transposicion': {
      const key = pickRandom(KEYS_COLUMNAR);
      const isEncrypt = Math.random() > 0.4;
      const res = processColumnarTransposition(normText, key, alphabetMode, isEncrypt ? 'encrypt' : 'decrypt');

      return {
        id: `transposicion-${Date.now()}`,
        cipherType: 'transposicion',
        mode: isEncrypt ? 'encrypt' : 'decrypt',
        title: 'Transposición por Columnas',
        question: isEncrypt
          ? `Cifra por transposición columnar usando la clave "${key}":\n\n"${normText}"`
          : `Descifra el criptograma columnar sabiendo que la clave es "${key}":\n\n"${formatInBlocks(res.outputText)}"`,
        contextParams: { key, numCols: res.gridInfo.numCols, numRows: res.gridInfo.numRows },
        expectedAnswer: isEncrypt ? res.outputText : normText.padEnd(res.gridInfo.numRows * res.gridInfo.numCols, 'X'),
        hint: `Escribe en filas de ${key.length} columnas. Ordena columnas alfabéticamente según "${key}" y lee en vertical.`,
        detailedSteps: [
          `Clave: ${[...key].join(' ')}`,
          `Orden columnas: ${res.gridInfo.colOrder.join(' ')}`,
          `Lectura de columnas: ${res.gridInfo.colIndicesSorted.map(i => key[i]).join(' → ')}`,
        ],
        alphabetMode,
      };
    }

    case 'escitala': {
      const diameter = randInt(3, 6);
      const isEncrypt = Math.random() > 0.4;
      const res = processScytale(normText, diameter, alphabetMode, isEncrypt ? 'encrypt' : 'decrypt');

      return {
        id: `escitala-${Date.now()}`,
        cipherType: 'escitala',
        mode: isEncrypt ? 'encrypt' : 'decrypt',
        title: 'Escítala Espartana (Bastón cilíndrico)',
        question: isEncrypt
          ? `Cifra con una escítala espartana de diámetro d = ${diameter} columnas el texto:\n\n"${normText}"`
          : `Descifra la cinta de la escítala enrollada en un bastón de diámetro d = ${diameter}:\n\n"${formatInBlocks(res.outputText)}"`,
        contextParams: { diameter, numRows: res.numRows },
        expectedAnswer: isEncrypt ? res.outputText : normText.padEnd(res.numRows * diameter, 'X'),
        hint: `Escribe las letras en ${res.numRows} vueltas de ${diameter} caracteres cada una.`,
        detailedSteps: [`Diámetro (columnas): ${diameter}`, `Filas necesarias: ${res.numRows}`, `Texto rellenado: ${res.padded}`],
        alphabetMode,
      };
    }

    case 'frecuencia': {
      const k = randInt(2, m - 2);
      const sample = pickRandom(SAMPLE_TEXTS.filter(t => normalizeText(t, alphabetMode).length >= 25));
      const clean = normalizeText(sample, alphabetMode);
      const res = processAffine(clean, { a: 1, b: k, mode: alphabetMode });
      const stats = calculateFrequencies(res.outputText, alphabetMode);
      const topLetter = [...stats].sort((a, b) => b.count - a.count)[0].char;
      const expectedEIdx = ALPHABETS[alphabetMode].chars.indexOf('E');
      const topIdx = ALPHABETS[alphabetMode].chars.indexOf(topLetter);
      const deducedK = (topIdx - expectedEIdx + m) % m;

      return {
        id: `frecuencia-${Date.now()}`,
        cipherType: 'frecuencia',
        mode: 'find_key',
        title: 'Criptoanálisis por Análisis de Frecuencias',
        question: `Se ha interceptado el siguiente criptograma cifrado con César:\n\n"${formatInBlocks(res.outputText)}"\n\nLa letra más frecuente en el criptograma es '${topLetter}'. Sabiendo que en el idioma español la letra de mayor frecuencia es la 'E', ¿cuál es el valor del desplazamiento k?`,
        contextParams: { topLetter, k },
        expectedAnswer: String(k),
        hint: `Plantea la congruencia: LetraMásFrecuente = ('E' + k) mod ${m} ⇒ k = (${topIdx} - ${expectedEIdx} + ${m}) mod ${m}`,
        detailedSteps: [
          `Letra observada de máxima frecuencia: '${topLetter}' (índice ${topIdx})`,
          `Letra teórica más frecuente en castellano: 'E' (índice ${expectedEIdx})`,
          `Deducción de la clave: k = (${topIdx} - ${expectedEIdx} + ${m}) mod ${m} = ${deducedK}`,
        ],
        alphabetMode,
      };
    }
  }
}
