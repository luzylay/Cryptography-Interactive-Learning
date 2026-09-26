// Exercise and Quiz generator with step-by-step mathematical proofs and hints

import { ALPHABETS, AlphabetMode, normalizeText, formatInBlocks } from './alphabets';
import { processAlberti, getDefaultAlbertiConfig } from './ciphers/alberti';
import { processAffine } from './ciphers/caesarAffine';
import { processVigenere } from './ciphers/vigenere';
import { processPlayfair } from './ciphers/playfair';
import { processHill2x2 } from './ciphers/hill';
import { processColumnarTransposition, processScytale } from './ciphers/transposition';
import { processPolybius } from './ciphers/polybius';
import { calculateFrequencies } from './cryptanalysis';
import { getCoprimes, isHillMatrixValid2x2 } from './mathUtils';

export type ExerciseCipherType =
  | 'alberti'
  | 'cesar'
  | 'afin'
  | 'polybius'
  | 'vigenere'
  | 'beaufort'
  | 'playfair'
  | 'hill'
  | 'transposicion'
  | 'escitala'
  | 'frecuencia'
  | 'conceptos';

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

    case 'polybius': {
      const isEncrypt = Math.random() > 0.4;
      const polybiusSampleTexts = [
        'TABLA DE POLIBIO',
        'DEFENSA DE ATENAS',
        'SECRETO MILITAR',
        'ROMA INVENCIBLE',
        'COMUNICACION OPTICA',
        'ANTORCHAS GRIEGAS',
        'MENSAJE SEGURO',
        'ATAQUE NOCTURNO',
      ];
      const selectedRaw = Math.random() > 0.3 ? pickRandom(polybiusSampleTexts) : normText.slice(0, 16);
      const cleanPolyText = selectedRaw.toUpperCase().replace(/J/g, 'I').replace(/Ñ/g, 'N').replace(/[^A-Z]/g, '');
      const res = processPolybius(cleanPolyText, isEncrypt ? 'encrypt' : 'decrypt');

      return {
        id: `polybius-${Date.now()}`,
        cipherType: 'polybius',
        mode: isEncrypt ? 'encrypt' : 'decrypt',
        title: 'Cifrador de Tabla de Polibio (5×5)',
        question: isEncrypt
          ? `Utilizando la Tabla Cuadrada de Polibio estándar 5×5 (donde I = J y el primer dígito es la Fila y el segundo la Columna), cifra el siguiente mensaje:\n\n"${cleanPolyText}"`
          : `Descifra el siguiente criptograma numérico obtenido con la Tabla de Polibio 5×5 (I = J):\n\n"${formatInBlocks(res.outputText, 2)}"`,
        contextParams: { text: cleanPolyText, result: res.outputText },
        expectedAnswer: isEncrypt ? res.outputText : cleanPolyText,
        hint: isEncrypt
          ? 'Localiza cada letra en la matriz 5×5: el primer número es la fila (1–5) y el segundo la columna (1–5).'
          : 'Agrupa los números en pares de 2 dígitos. El primer dígito indica la fila vertical y el segundo la columna horizontal.',
        detailedSteps: res.steps.slice(0, 10).map(s => s.explanation),
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
      // 50% chance of standard curriculum slide exercises, 50% randomized
      const isCurriculum = Math.random() > 0.4;
      const curriculumPairs = [
        { pair: 'ZL', key: 'VERANO AZUL', exp: 'UB', rule: 'Misma Fila (derecha)', hint: 'Fila 2: [O, Z, U, L, B]. Z está en Col 2 -> U. L está en Col 4 -> B.' },
        { pair: 'KP', key: 'VERANO AZUL', exp: 'MQ', rule: 'Misma Fila (derecha)', hint: 'Fila 4: [I/J, K, M, P, Q]. K avanza a M, P avanza a Q.' },
        { pair: 'SY', key: 'VERANO AZUL', exp: 'TS', rule: 'Misma Fila (salto circular)', hint: 'Fila 5: [S, T, W, X, Y]. S avanza a T. Y salta circular al inicio S.' },
        { pair: 'EK', key: 'VERANO AZUL', exp: 'ZT', rule: 'Misma Columna (abajo)', hint: 'Columna 2: [E, Z, D, K, T]. E baja a Z, K baja a T.' },
        { pair: 'RU', key: 'VERANO AZUL', exp: 'UM', rule: 'Misma Columna (abajo)', hint: 'Columna 3: [R, U, F, M, W]. R baja a U, U baja hacia M.' },
        { pair: 'ZP', key: 'VERANO AZUL', exp: 'LK', rule: 'Rectángulo', hint: 'Z[F2, C2] y P[F4, C4]. Z toma Col 4 -> L. P toma Col 2 -> K.' },
        { pair: 'GE', key: 'VERANO AZUL', exp: 'DA', rule: 'Rectángulo', hint: 'G[F3, C4] y E[F1, C2]. G toma Col 2 -> D. E toma Col 4 -> A.' },
      ];

      if (isCurriculum) {
        const item = pickRandom(curriculumPairs);
        return {
          id: `playfair-curr-${Date.now()}`,
          cipherType: 'playfair',
          mode: 'encrypt',
          title: `Cifrador de Playfair (Diapositivas S08 · ${item.rule})`,
          question: `Cifra el siguiente par dígramo con la clave de clase "${item.key}":\n\n"${item.pair}"`,
          contextParams: { key: item.key, pair: item.pair },
          expectedAnswer: item.exp,
          hint: item.hint,
          detailedSteps: [
            `Clave: ${item.key}`,
            `Par a cifrar: ${item.pair}`,
            `Regla geométrica: ${item.rule}`,
            `Paso a paso: ${item.hint}`,
            `Resultado oficial: ${item.exp}`,
          ],
          alphabetMode,
        };
      }

      const key = pickRandom(KEYS_PLAYFAIR);
      const isEncrypt = Math.random() > 0.4;
      const res = processPlayfair(normText, key, isEncrypt ? 'encrypt' : 'decrypt');

      return {
        id: `playfair-${Date.now()}`,
        cipherType: 'playfair',
        mode: isEncrypt ? 'encrypt' : 'decrypt',
        title: 'Cifrador de Playfair (Matriz 5×5)',
        question: isEncrypt
          ? `Cifra con Playfair (clave "${key}", matriz 5×5, I=J, Ñ → N):\n\n"${normText}"`
          : `Descifra con Playfair (clave "${key}", matriz 5×5, I=J, Ñ → N):\n\n"${formatInBlocks(res.outputText)}"`,
        contextParams: { key, matrix: res.matrix },
        expectedAnswer: isEncrypt ? res.outputText : normText.replace(/J/g, 'I').replace(/Ñ/g, 'N'),
        hint: 'Divide en pares (dígramas). Aplica regla de misma fila (derecha), misma columna (abajo) o rectángulo (esquinas opuestas).',
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

    case 'conceptos': {
      const conceptualPool = [
        {
          title: 'Ataques a la Esteganografía',
          question: '¿Qué disciplina y tipo de ataque científico permite descubrir y extraer información oculta dentro de archivos portadores digitales mediante pruebas estadísticas como Chi-cuadrado?',
          expectedAnswer: 'ESTEGOANALISIS',
          hint: 'Es el equivalente al criptoanálisis pero aplicado a técnicas de esteganografía.',
          steps: [
            'Disciplina: Estegoanálisis (Steganalysis).',
            'Método: Prueba de Chi-cuadrado (χ²) y análisis de pares de valores (PoVs) en bits LSB.',
            'Objetivo: Detectar anomalías estadísticas en la distribución de frecuencias del archivo portador.',
          ],
        },
        {
          title: 'Pilares de Seguridad de la Información',
          question: '¿Cuántos pilares fundamentales componen el modelo formal extendido de la seguridad de la información según el estándar ISO 7498-2 (incluyendo Confidencialidad, Integridad, Disponibilidad, Autenticación, No Repudio y Control de Acceso)?',
          expectedAnswer: '6',
          hint: 'Son los 3 clásicos de la tríada CIA más 3 adicionales en el modelo extendido.',
          steps: [
            '1. Confidencialidad',
            '2. Integridad',
            '3. Disponibilidad',
            '4. Autenticación',
            '5. No Repudio',
            '6. Control de Acceso',
          ],
        },
        {
          title: 'Algoritmos Modernos para Firma de Código',
          question: '¿Qué algoritmo asimétrico de Curvas de Edwards de 256 bits se recomienda actualmente según estándares modernos (FIPS/NIST) para certificados de firma de código debido a sus firmas de 64 bytes y alta velocidad?',
          expectedAnswer: 'ED25519',
          hint: 'Es una variante de EdDSA muy popular sobre la curva 25519.',
          steps: [
            'Algoritmo: EdDSA / Ed25519.',
            'Longitud: 256 bits de clave.',
            'Tamaño de firma: 64 bytes fijos con validación ultrarrápida.',
          ],
        },
        {
          title: 'Cifrado de Correo de Máxima Confidencialidad',
          question: '¿Qué algoritmo simétrico de 256 bits en modo autenticado (AEAD) es el estándar recomendado por NIST y OpenPGP RFC 9580 para el cifrado del cuerpo y adjuntos de correos electrónicos confidenciales?',
          expectedAnswer: 'AES-256-GCM',
          hint: 'Es el estándar AES de 256 bits en modo Galois/Counter Mode (GCM).',
          steps: [
            'Algoritmo simétrico: AES-256 (Advanced Encryption Standard).',
            'Modo de operación: GCM (Galois/Counter Mode - Cifrado Autenticado AEAD).',
            'Seguridad: 256 bits (máxima inmunidad criptográfica).',
          ],
        },
        {
          title: 'Diferencia Criptografía vs Esteganografía',
          question: '¿Cuál de las dos técnicas tiene como objetivo ocultar la EXISTENCIA misma del mensaje en lugar de ocultar únicamente su significado o contenido?',
          expectedAnswer: 'ESTEGANOGRAFIA',
          hint: 'Proviene del griego "steganos" (cubierto u oculto).',
          steps: [
            'Criptografía: Oculta el SIGNIFICADO (el mensaje se vuelve incomprensible).',
            'Esteganografía: Oculta la EXISTENCIA (el mensaje se camufla en una imagen o audio).',
          ],
        },
        {
          title: 'Arquitectura del Estándar AES',
          question: '¿Cuántas rondas de transformación aplica el algoritmo AES-128 sobre su matriz de estado de 128 bits (4×4 bytes)?',
          expectedAnswer: '10',
          hint: 'AES-128 tiene 10 rondas, AES-192 tiene 12 rondas y AES-256 tiene 14 rondas.',
          steps: [
            'AES-128: 10 rondas de transformación.',
            'Transformaciones por ronda: SubBytes, ShiftRows, MixColumns (excepto ronda final) y AddRoundKey.',
          ],
        },
        {
          title: 'Vulnerabilidad del Modo ECB',
          question: '¿Qué modo de operación de cifrado por bloques está estrictamente desaconsejado en producción por cifrar bloques idénticos de manera idéntica preservando patrones visuales?',
          expectedAnswer: 'ECB',
          hint: 'Corresponde a Electronic Codebook.',
          steps: [
            'Modo: ECB (Electronic Codebook).',
            'Falla: No utiliza Vector de Inicialización (IV) ni encadenamiento entre bloques.',
            'Consecuencia: Si P₁ = P₂, entonces C₁ = C₂, revelando la estructura de imágenes o bases de datos.',
          ],
        },
        {
          title: 'Propiedad del Efecto Avalancha',
          question: 'En una función hash segura (como SHA-256), ¿qué porcentaje aproximado de los bits totales del resumen debe invertirse cuando se modifica un solo bit del mensaje de entrada?',
          expectedAnswer: '50%',
          hint: 'El valor ideal de difusión estadística es exactamente la mitad de los bits.',
          steps: [
            'Efecto Avalancha (Avalanche Effect): Dispersión del 50% de los bits de salida.',
            'Objetivo: Evitar correlación matemática entre entradas similares y sus resúmenes.',
          ],
        },
        {
          title: 'Pilares de la Firma Digital',
          question: '¿Qué pilar fundamental de la seguridad de la información garantiza la firma digital impidiendo que el autor de un mensaje o transacción niegue su emisión?',
          expectedAnswer: 'NO REPUDIO',
          hint: 'También conocido como irrenunciabilidad.',
          steps: [
            'Pilar: No Repudio (Non-repudiation).',
            'Mecanismo: Como la firma se genera con la clave privada exclusiva del emisor, este no puede rechazar su autoría.',
          ],
        },
        {
          title: 'Protocolo de Conexión Segura TLS 1.3',
          question: '¿Cuántos viajes de ida y vuelta (RTT) requiere el protocolo TLS 1.3 (RFC 8446) para negociar e iniciar la conexión cifrada HTTPS gracias al envío anticipado de claves ECDHE?',
          expectedAnswer: '1',
          hint: 'Es un Handshake de 1 RTT (frente a los 2 RTT de TLS 1.2).',
          steps: [
            'Latencia de TLS 1.3: 1 RTT (Zero Round Trip Time opcional con 0-RTT).',
            'El cliente envía sus claves efímeras ECDH en el primer mensaje ClientHello.',
          ],
        },
        {
          title: 'Filosofía de Seguridad Zero Trust',
          question: '¿Cuál es el postulado o lema central de la Arquitectura de Confianza Cero (Zero Trust NIST SP 800-207) para la protección de redes y teletrabajo?',
          expectedAnswer: 'NUNCA CONFIAR SIEMPRE VERIFICAR',
          hint: 'En inglés: "Never trust, always verify".',
          steps: [
            'Postulado canónico: "Nunca confiar, siempre verificar".',
            'Pilares: Verificación continua de identidad, microsegmentación de red y menor privilegio.',
          ],
        },
      ];

      const item = pickRandom(conceptualPool);

      return {
        id: `concepto-${Date.now()}`,
        cipherType: 'conceptos',
        mode: 'find_key',
        title: item.title,
        question: item.question,
        contextParams: {},
        expectedAnswer: item.expectedAnswer,
        hint: item.hint,
        detailedSteps: item.steps,
        alphabetMode,
      };
    }
  }
}

