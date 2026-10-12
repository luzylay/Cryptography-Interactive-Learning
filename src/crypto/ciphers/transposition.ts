// Transposition Ciphers: Series (m1, m2, m3), Columnar, Row & Spartan Scytale
// Academic Reference: Ramió Aguirre (1999, pp. 88–96)

import { AlphabetMode, normalizeText, formatInBlocks } from '../alphabets';

// ==========================================
// 1. TRANSPOSICIÓN POR SERIES (m1, m2, m3)
// ==========================================

export interface SeriesTranspositionInfo {
  numChars: number;
  oneIsPrime: boolean;
  ms1Indices: number[]; // 1-based indices: Números primos (m_i)
  ms2Indices: number[]; // 1-based indices: Números pares (m_i)
  ms3Indices: number[]; // 1-based indices: Números impares restantes (m_i)
  fullOrder: number[];  // concatenated indices [ms1, ms2, ms3]
  ms1Chars: string;
  ms2Chars: string;
  ms3Chars: string;
  paddedText: string;
  padChar: string;
  direction: 'encrypt' | 'decrypt';
  steps: string[];
}

/**
 * Determina si un número entero n >= 1 es primo.
 * @param n Número a evaluar (1-indexed).
 * @param oneIsPrime Si true, el número 1 es clasificado como primo (convención Ramió Aguirre).
 *                   Si false, el 1 es clasificado como impar no primo (convención moderna / del profesor).
 */
export function isNumberPrime(n: number, oneIsPrime = false): boolean {
  if (n === 1) return oneIsPrime;
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

/**
 * Calcula la partición de índices 1..length en las 3 series:
 * MS1: Números primos
 * MS2: Números pares (excluyendo el 2 que ya está en MS1)
 * MS3: Números impares restantes (incluye el 1 si oneIsPrime es false)
 */
export function partitionSeriesIndices(length: number, oneIsPrime = false) {
  const ms1Indices: number[] = [];
  const ms2Indices: number[] = [];
  const ms3Indices: number[] = [];

  for (let i = 1; i <= length; i++) {
    if (isNumberPrime(i, oneIsPrime)) {
      ms1Indices.push(i);
    } else if (i % 2 === 0) {
      ms2Indices.push(i);
    } else {
      ms3Indices.push(i);
    }
  }

  const fullOrder = [...ms1Indices, ...ms2Indices, ...ms3Indices];
  return { ms1Indices, ms2Indices, ms3Indices, fullOrder };
}

export function processSeriesTransposition(
  text: string,
  oneIsPrime = false,
  mode: AlphabetMode = 'es27',
  direction: 'encrypt' | 'decrypt' = 'encrypt',
  padChar = 'X'
) {
  const norm = normalizeText(text, mode);
  const cleanPad = padChar ? normalizeText(padChar, mode)[0] || 'X' : 'X';
  const numChars = norm.length;

  if (numChars === 0) {
    return {
      seriesInfo: {
        numChars: 0,
        oneIsPrime,
        ms1Indices: [],
        ms2Indices: [],
        ms3Indices: [],
        fullOrder: [],
        ms1Chars: '',
        ms2Chars: '',
        ms3Chars: '',
        paddedText: '',
        padChar: cleanPad,
        direction,
        steps: ['Texto vacío'],
      },
      outputText: '',
      formattedOutput: '',
    };
  }

  const { ms1Indices, ms2Indices, ms3Indices, fullOrder } = partitionSeriesIndices(numChars, oneIsPrime);

  if (direction === 'encrypt') {
    const ms1Chars = ms1Indices.map(idx => norm[idx - 1]).join('');
    const ms2Chars = ms2Indices.map(idx => norm[idx - 1]).join('');
    const ms3Chars = ms3Indices.map(idx => norm[idx - 1]).join('');
    const outputText = ms1Chars + ms2Chars + ms3Chars;

    const steps = [
      `Longitud del mensaje: N = ${numChars} caracteres`,
      `Convención del número 1: ${oneIsPrime ? '1 es Primo (Ramió Aguirre)' : '1 es Impar (Criterio del Profesor)'}`,
      `Serie MS1 (Primos) [${ms1Indices.length} posiciones]: ${ms1Indices.join(', ')} ⇒ "${ms1Chars}"`,
      `Serie MS2 (Pares) [${ms2Indices.length} posiciones]: ${ms2Indices.join(', ')} ⇒ "${ms2Chars}"`,
      `Serie MS3 (Impares) [${ms3Indices.length} posiciones]: ${ms3Indices.join(', ')} ⇒ "${ms3Chars}"`,
      `Criptograma concatenado: M' = MS1 + MS2 + MS3 ⇒ "${outputText}"`,
    ];

    const seriesInfo: SeriesTranspositionInfo = {
      numChars,
      oneIsPrime,
      ms1Indices,
      ms2Indices,
      ms3Indices,
      fullOrder,
      ms1Chars,
      ms2Chars,
      ms3Chars,
      paddedText: norm,
      padChar: cleanPad,
      direction,
      steps,
    };

    return {
      seriesInfo,
      outputText,
      formattedOutput: formatInBlocks(outputText),
    };
  } else {
    // Decrypt: Ciphertext of length N is reconstructed into plain text
    const plainArray = new Array(numChars).fill('');
    for (let k = 0; k < numChars; k++) {
      const origPos = fullOrder[k];
      plainArray[origPos - 1] = norm[k];
    }
    const outputText = plainArray.join('');

    const ms1Chars = ms1Indices.map(idx => outputText[idx - 1]).join('');
    const ms2Chars = ms2Indices.map(idx => outputText[idx - 1]).join('');
    const ms3Chars = ms3Indices.map(idx => outputText[idx - 1]).join('');

    const steps = [
      `Longitud del criptograma recibido: LC = ${numChars}`,
      `Convención del número 1: ${oneIsPrime ? '1 es Primo (Ramió Aguirre)' : '1 es Impar (Criterio del Profesor)'}`,
      `Partición de índices original generada (${ms1Indices.length} primos, ${ms2Indices.length} pares, ${ms3Indices.length} impares)`,
      `Reubicación posicional: Cada carácter C_k se mapea a su posición original m_{p_k}`,
      `Mensaje claro reconstruido: "${outputText}"`,
    ];

    const seriesInfo: SeriesTranspositionInfo = {
      numChars,
      oneIsPrime,
      ms1Indices,
      ms2Indices,
      ms3Indices,
      fullOrder,
      ms1Chars,
      ms2Chars,
      ms3Chars,
      paddedText: outputText,
      padChar: cleanPad,
      direction,
      steps,
    };

    return {
      seriesInfo,
      outputText,
      formattedOutput: formatInBlocks(outputText),
    };
  }
}

// ==========================================
// 2. TRANSPOSICIÓN POR COLUMNAS
// ==========================================

export interface ColumnarGridInfo {
  keyword: string;
  isNumericKey: boolean;
  numCols: number;
  numRows: number;
  colOrder: number[]; // 1-based ranks [2, 4, 1, 5, 3]
  colIndicesSorted: number[]; // 0-based column indices in reading order
  grid: string[][]; // row-major grid [row][col]
  paddedText: string;
  columnsText: string[];
  padChar: string;
  direction: 'encrypt' | 'decrypt';
}

export function buildColumnarGrid(
  text: string,
  keyword: string,
  mode: AlphabetMode,
  padChar = 'X',
  direction: 'encrypt' | 'decrypt' = 'encrypt'
): ColumnarGridInfo {
  const cleanPad = padChar ? normalizeText(padChar, mode)[0] || 'X' : 'X';
  const trimmedKey = keyword.trim().toUpperCase();
  const isNumeric = /^\d+$/.test(trimmedKey) && parseInt(trimmedKey, 10) > 0;

  let normKey = '';
  let numCols = 1;

  if (isNumeric) {
    numCols = Math.max(1, Math.min(20, parseInt(trimmedKey, 10)));
    normKey = Array.from({ length: numCols }, (_, i) => `${i + 1}`).join(' ');
  } else {
    normKey = normalizeText(trimmedKey, mode);
    numCols = Math.max(1, normKey.length);
  }

  let colOrder: number[] = [];
  let colIndicesSorted: number[] = [];

  if (isNumeric) {
    // Columnas simples numeradas: lectura natural 1, 2, ..., NC
    colOrder = Array.from({ length: numCols }, (_, i) => i + 1);
    colIndicesSorted = Array.from({ length: numCols }, (_, i) => i);
  } else {
    // Rank columns based on alphabetical sort of key characters
    const keyChars = [...normKey].map((char, originalIndex) => ({ char, originalIndex }));
    const sorted = [...keyChars].sort((a, b) => a.char.localeCompare(b.char));

    colOrder = new Array(numCols).fill(0);
    sorted.forEach((item, rank) => {
      colOrder[item.originalIndex] = rank + 1;
    });

    colIndicesSorted = sorted.map(s => s.originalIndex);
  }

  if (direction === 'encrypt') {
    const normText = normalizeText(text, mode);
    const numRows = Math.max(1, Math.ceil(normText.length / numCols));
    const paddedText = normText.padEnd(numRows * numCols, cleanPad);

    // Populate row-major grid
    const grid: string[][] = [];
    for (let r = 0; r < numRows; r++) {
      const row: string[] = [];
      for (let c = 0; c < numCols; c++) {
        row.push(paddedText[r * numCols + c]);
      }
      grid.push(row);
    }

    // Extract columns in reading order
    const columnsText: string[] = colIndicesSorted.map(colIdx => {
      return grid.map(row => row[colIdx]).join('');
    });

    return {
      keyword: normKey,
      isNumericKey: isNumeric,
      numCols,
      numRows,
      colOrder,
      colIndicesSorted,
      grid,
      paddedText,
      columnsText,
      padChar: cleanPad,
      direction,
    };
  } else {
    // Decrypt: The received text is the ciphertext
    const normCipher = normalizeText(text, mode);
    const numRows = Math.max(1, Math.ceil(normCipher.length / numCols));
    const paddedCipher = normCipher.padEnd(numRows * numCols, cleanPad);

    // Each column has numRows characters.
    // The columns appear in colIndicesSorted order.
    const cols: string[] = new Array(numCols).fill('');
    let ptr = 0;
    for (const colIdx of colIndicesSorted) {
      cols[colIdx] = paddedCipher.slice(ptr, ptr + numRows);
      ptr += numRows;
    }

    // Reconstruct the original row-major grid
    const grid: string[][] = [];
    for (let r = 0; r < numRows; r++) {
      const row: string[] = [];
      for (let c = 0; c < numCols; c++) {
        row.push(cols[c] ? cols[c][r] || '' : '');
      }
      grid.push(row);
    }

    const paddedText = grid.map(r => r.join('')).join('');
    const columnsText: string[] = colIndicesSorted.map(colIdx => cols[colIdx]);

    return {
      keyword: normKey,
      isNumericKey: isNumeric,
      numCols,
      numRows,
      colOrder,
      colIndicesSorted,
      grid,
      paddedText,
      columnsText,
      padChar: cleanPad,
      direction,
    };
  }
}

export function processColumnarTransposition(
  text: string,
  keyword: string,
  mode: AlphabetMode,
  direction: 'encrypt' | 'decrypt' = 'encrypt',
  padChar = 'X'
) {
  const cleanPad = padChar ? normalizeText(padChar, mode)[0] || 'X' : 'X';
  const gridInfo = buildColumnarGrid(text, keyword, mode, cleanPad, direction);

  if (direction === 'encrypt') {
    const outStr = gridInfo.columnsText.join('');
    return {
      gridInfo,
      outputText: outStr,
      formattedOutput: formatInBlocks(outStr),
    };
  } else {
    const outStr = gridInfo.paddedText;
    return {
      gridInfo,
      outputText: outStr,
      formattedOutput: formatInBlocks(outStr),
    };
  }
}

// ==========================================
// 3. TRANSPOSICIÓN POR FILAS
// ==========================================

export interface RowGridInfo {
  numRows: number;
  numCols: number;
  grid: string[][]; // [row][col]
  paddedText: string;
  padChar: string;
  direction: 'encrypt' | 'decrypt';
  steps: string[];
}

export function processRowTransposition(
  text: string,
  numRows: number,
  mode: AlphabetMode = 'es27',
  direction: 'encrypt' | 'decrypt' = 'encrypt',
  padChar = 'X'
) {
  const norm = normalizeText(text, mode);
  const cleanPad = padChar ? normalizeText(padChar, mode)[0] || 'X' : 'X';
  const nf = Math.max(2, Math.min(25, Math.floor(numRows) || 3));

  if (norm.length === 0) {
    const emptyGridInfo: RowGridInfo = {
      numRows: nf,
      numCols: 0,
      grid: [],
      paddedText: '',
      padChar: cleanPad,
      direction,
      steps: ['Texto vacío'],
    };
    return {
      gridInfo: emptyGridInfo,
      outputText: '',
      formattedOutput: '',
    };
  }

  if (direction === 'encrypt') {
    // Escribir verticalmente (columna a columna) en NF filas, rellenando con padChar
    const nc = Math.ceil(norm.length / nf);
    const paddedText = norm.padEnd(nf * nc, cleanPad);

    const grid: string[][] = Array.from({ length: nf }, () => new Array(nc).fill(''));
    for (let c = 0; c < nc; c++) {
      for (let r = 0; r < nf; r++) {
        grid[r][c] = paddedText[c * nf + r];
      }
    }

    // Leer horizontalmente (fila por fila)
    const outStr = grid.map(row => row.join('')).join('');

    const steps = [
      `Longitud texto claro: LC = ${norm.length}`,
      `Clave número de filas: NF = ${nf}`,
      `Columnas calculadas: NC = ceil(${norm.length} / ${nf}) = ${nc}`,
      `Texto con comodín ('${cleanPad}'): ${paddedText}`,
      `Disposición: Se escribe verticalmente en ${nc} columnas de ${nf} elementos`,
      `Lectura: Se lee horizontalmente fila por fila (F1, F2, ..., F${nf})`,
    ];

    const gridInfo: RowGridInfo = {
      numRows: nf,
      numCols: nc,
      grid,
      paddedText,
      padChar: cleanPad,
      direction,
      steps,
    };

    return {
      gridInfo,
      outputText: outStr,
      formattedOutput: formatInBlocks(outStr),
    };
  } else {
    // Decrypt: Ciphertext is written horizontally in NF rows, then read vertically
    const nc = Math.ceil(norm.length / nf);
    const paddedCipher = norm.padEnd(nf * nc, cleanPad);

    const grid: string[][] = Array.from({ length: nf }, () => new Array(nc).fill(''));
    for (let r = 0; r < nf; r++) {
      for (let c = 0; c < nc; c++) {
        grid[r][c] = paddedCipher[r * nc + c];
      }
    }

    // Leer verticalmente columna a columna de arriba hacia abajo
    let plainStr = '';
    for (let c = 0; c < nc; c++) {
      for (let r = 0; r < nf; r++) {
        plainStr += grid[r][c];
      }
    }

    const steps = [
      `Longitud del criptograma recibido: LC = ${norm.length}`,
      `Clave número de filas: NF = ${nf}`,
      `Columnas calculadas: NC = LC / NF = ${nc}`,
      `Disposición: Se escribe el criptograma horizontalmente en ${nf} filas de ${nc} columnas`,
      `Lectura: Se lee verticalmente de arriba hacia abajo columna por columna`,
      `Mensaje claro recuperado: "${plainStr}"`,
    ];

    const gridInfo: RowGridInfo = {
      numRows: nf,
      numCols: nc,
      grid,
      paddedText: plainStr,
      padChar: cleanPad,
      direction,
      steps,
    };

    return {
      gridInfo,
      outputText: plainStr,
      formattedOutput: formatInBlocks(plainStr),
    };
  }
}

// ==========================================
// 4. ESCÍTALA ESPARTANA (Bastón)
// ==========================================

export function processScytale(
  text: string,
  diameter: number,
  mode: AlphabetMode,
  direction: 'encrypt' | 'decrypt' = 'encrypt',
  padChar = 'X'
) {
  const norm = normalizeText(text, mode);
  const cleanPad = padChar ? normalizeText(padChar, mode)[0] || 'X' : 'X';
  const d = Math.max(2, Math.floor(diameter) || 2);
  const numCols = d;
  const numRows = Math.max(1, Math.ceil(norm.length / numCols));
  const padded = norm.padEnd(numRows * numCols, cleanPad);

  if (direction === 'encrypt') {
    let out = '';
    for (let c = 0; c < numCols; c++) {
      for (let r = 0; r < numRows; r++) {
        out += padded[r * numCols + c];
      }
    }
    return {
      diameter: d,
      numRows,
      numCols,
      padded,
      padChar: cleanPad,
      outputText: out,
      formattedOutput: formatInBlocks(out),
    };
  } else {
    let out = '';
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        out += padded[c * numRows + r] || '';
      }
    }
    return {
      diameter: d,
      numRows,
      numCols,
      padded,
      padChar: cleanPad,
      outputText: out,
      formattedOutput: formatInBlocks(out),
    };
  }
}
