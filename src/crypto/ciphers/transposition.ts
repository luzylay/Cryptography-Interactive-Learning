// Transposition Ciphers: Spartan Scytale and Columnar Transposition

import { AlphabetMode, normalizeText, formatInBlocks } from '../alphabets';

export interface ColumnarGridInfo {
  keyword: string;
  numCols: number;
  numRows: number;
  colOrder: number[]; // e.g. [2, 4, 1, 5, 3] (1-based ranks)
  colIndicesSorted: number[]; // indices in reading order
  grid: string[][];
  paddedText: string;
  columnsText: string[];
}

export function buildColumnarGrid(text: string, keyword: string, mode: AlphabetMode, padChar = 'X'): ColumnarGridInfo {
  const normText = normalizeText(text, mode);
  const normKey = normalizeText(keyword, mode);
  const numCols = normKey.length || 1;
  const numRows = Math.ceil(normText.length / numCols);
  const paddedText = normText.padEnd(numRows * numCols, padChar);

  // Rank columns based on alphabetical sort of key characters
  const keyChars = [...normKey].map((char, originalIndex) => ({ char, originalIndex }));
  const sorted = [...keyChars].sort((a, b) => a.char.localeCompare(b.char));

  const colOrder = new Array(numCols).fill(0);
  sorted.forEach((item, rank) => {
    colOrder[item.originalIndex] = rank + 1;
  });

  const colIndicesSorted = sorted.map(s => s.originalIndex);

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
    numCols,
    numRows,
    colOrder,
    colIndicesSorted,
    grid,
    paddedText,
    columnsText,
  };
}

export function processColumnarTransposition(
  text: string,
  keyword: string,
  mode: AlphabetMode,
  direction: 'encrypt' | 'decrypt' = 'encrypt',
  padChar = 'X'
) {
  const gridInfo = buildColumnarGrid(text, keyword, mode, padChar);
  if (direction === 'encrypt') {
    const outStr = gridInfo.columnsText.join('');
    return {
      gridInfo,
      outputText: outStr,
      formattedOutput: formatInBlocks(outStr),
    };
  } else {
    // Decrypt columnar
    const normCipher = normalizeText(text, mode);
    const numCols = gridInfo.numCols;
    const numRows = Math.ceil(normCipher.length / numCols);

    const cols: string[] = new Array(numCols).fill('');
    let ptr = 0;
    for (const colIdx of gridInfo.colIndicesSorted) {
      cols[colIdx] = normCipher.slice(ptr, ptr + numRows);
      ptr += numRows;
    }

    let outStr = '';
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        if (cols[c] && cols[c][r]) outStr += cols[c][r];
      }
    }

    return {
      gridInfo,
      outputText: outStr,
      formattedOutput: formatInBlocks(outStr),
    };
  }
}

// Spartan Scytale
export function processScytale(text: string, diameter: number, mode: AlphabetMode, direction: 'encrypt' | 'decrypt' = 'encrypt') {
  const norm = normalizeText(text, mode);
  const d = Math.max(2, diameter);
  const numCols = d;
  const numRows = Math.ceil(norm.length / numCols);
  const padded = norm.padEnd(numRows * numCols, 'X');

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
      outputText: out,
      formattedOutput: formatInBlocks(out),
    };
  } else {
    let out = '';
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        out += norm[c * numRows + r] || '';
      }
    }
    return {
      diameter: d,
      numRows,
      numCols,
      padded: norm,
      outputText: out,
      formattedOutput: formatInBlocks(out),
    };
  }
}
