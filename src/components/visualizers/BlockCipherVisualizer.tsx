import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { CopyButton } from '../common/CopyButton';
import {
  aes128EncryptBlockWithTrace,
  textTo16Bytes,
  hexToBytes,
  AesMatrix4x4,
  matrixToHex,
  aesEncryptEcb,
  aesEncryptCbc,
} from '../../crypto/ciphers/aes';
import {
  desEncryptBlockWithTrace,
  textTo64BitBin,
  hexToBin,
  tripleDesEncrypt,
} from '../../crypto/ciphers/des';
import {
  ShieldCheck,
  Grid,
  Layers,
  ArrowRight,
  Shuffle,
  Lock,
  Unlock,
  Eye,
  Info,
  Sliders,
} from 'lucide-react';

export const BlockCipherVisualizer: React.FC = () => {
  const [activeEngine, setActiveEngine] = useState<'aes' | 'des' | 'modes'>('aes');

  // AES State
  const [aesInputText, setAesInputText] = useState('CRIPTOGRAFIA2026');
  const [aesKeyText, setAesKeyText] = useState('LLAVESECRETA128B');
  const [selectedAesRound, setSelectedAesRound] = useState<number>(1);

  // DES State
  const [desInputText, setDesInputText] = useState('SEGURID8');
  const [desKeyText, setDesKeyText] = useState('CLAVEDES');
  const [selectedDesRound, setSelectedDesRound] = useState<number>(1);
  const [is3DesMode, setIs3DesMode] = useState(false);

  // Modes State (ECB vs CBC)
  const [modeRepeatText, setModeRepeatText] = useState('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'); // 2 identical blocks
  const [modeKey, setModeKey] = useState('LLAVEDEBLOQUE128');
  const [modeIv, setModeIv] = useState('VECTORINICIAL128');

  // Compute AES Trace
  const aesPlainBytes = textTo16Bytes(aesInputText);
  const aesKeyBytes = textTo16Bytes(aesKeyText);
  const aesTrace = aes128EncryptBlockWithTrace(aesPlainBytes, aesKeyBytes);
  const currentAesRoundData = aesTrace.rounds[selectedAesRound] || aesTrace.rounds[0];

  // Compute DES Trace
  const desPlainBin = textTo64BitBin(desInputText);
  const desKeyBin = textTo64BitBin(desKeyText);
  const desTrace = desEncryptBlockWithTrace(desPlainBin, desKeyBin);
  const currentDesRoundData = desTrace.rounds[selectedDesRound - 1] || desTrace.rounds[0];

  // Compute 3DES
  const tripleDesCipherHex = tripleDesEncrypt(
    desPlainBin,
    desKeyBin,
    textTo64BitBin('KEY2DESA'),
    desKeyBin
  );

  // Compute Modes
  const block1 = textTo16Bytes(modeRepeatText.slice(0, 16));
  const block2 = textTo16Bytes(modeRepeatText.slice(16, 32));
  const ecbResults = aesEncryptEcb([block1, block2], textTo16Bytes(modeKey));
  const cbcResults = aesEncryptCbc([block1, block2], textTo16Bytes(modeKey), textTo16Bytes(modeIv));

  const renderMatrix4x4 = (matrix: AesMatrix4x4, title: string, badgeColor: 'sky' | 'emerald' | 'amber' | 'purple' = 'sky') => (
    <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex flex-col items-center">
      <div className="flex items-center justify-between w-full mb-2">
        <span className="text-[11px] font-mono font-bold text-slate-300">{title}</span>
        <Badge variant={badgeColor}>{matrixToHex(matrix).slice(0, 8)}...</Badge>
      </div>
      <div className="grid grid-cols-4 gap-1.5 w-full">
        {matrix.map((row, r) =>
          row.map((byte, c) => (
            <div
              key={`${r}-${c}`}
              className="p-1.5 sm:p-2 bg-slate-900 border border-slate-800 rounded-lg text-center font-mono text-xs font-bold text-slate-200 hover:border-sky-500/50 hover:bg-slate-800 transition-colors"
            >
              {byte.toString(16).padStart(2, '0').toUpperCase()}
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <GlassCard borderGlow="emerald">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="emerald">Semana S12 · Cifrado Simétrico Moderno</Badge>
              <Badge variant="slate">FIPS 197 & FIPS 46-3</Badge>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              Cifrado por Bloques: AES, DES y Modos de Operación
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
              Explora en profundidad la arquitectura interna de AES (matriz de estado $4\times 4$, Galois Field $GF(2^8)$), la red de Feistel de 16 rondas de DES/3DES y la comparativa de modos ECB vs CBC.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveEngine('aes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeEngine === 'aes' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              AES-128 (Rijndael)
            </button>
            <button
              onClick={() => setActiveEngine('des')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeEngine === 'des' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              DES & 3DES (Feistel)
            </button>
            <button
              onClick={() => setActiveEngine('modes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeEngine === 'modes' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Modos ECB vs CBC
            </button>
          </div>
        </div>
      </GlassCard>

      {/* VIEW 1: AES-128 RIJNDAEL */}
      {activeEngine === 'aes' && (
        <div className="space-y-6">
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard>
              <label className="text-xs font-bold text-slate-400 font-mono uppercase mb-2 block">
                Texto en Claro (Bloque de 16 Bytes / 128 Bits)
              </label>
              <input
                type="text"
                value={aesInputText}
                maxLength={16}
                onChange={e => setAesInputText(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono text-sm"
              />
              <div className="mt-2 text-xs font-mono text-slate-400 flex items-center justify-between">
                <span>Hex: {aesTrace.plaintextHex}</span>
                <span>{aesInputText.length}/16 bytes</span>
              </div>
            </GlassCard>

            <GlassCard>
              <label className="text-xs font-bold text-slate-400 font-mono uppercase mb-2 block">
                Clave Secreta AES (16 Bytes / 128 Bits)
              </label>
              <input
                type="text"
                value={aesKeyText}
                maxLength={16}
                onChange={e => setAesKeyText(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono text-sm"
              />
              <div className="mt-2 text-xs font-mono text-slate-400 flex items-center justify-between">
                <span>Hex: {aesTrace.keyHex}</span>
                <span>{aesKeyText.length}/16 bytes</span>
              </div>
            </GlassCard>
          </div>

          {/* Ciphertext Banner */}
          <GlassCard borderGlow="emerald">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono text-slate-400 block">Criptograma Final AES-128 (Hexadecimal)</span>
                <span className="text-base font-bold font-mono text-emerald-400 break-all">{aesTrace.ciphertextHex}</span>
              </div>
              <div className="flex items-center gap-2">
                <CopyButton text={aesTrace.ciphertextHex} />
              </div>
            </div>
          </GlassCard>

          {/* Round Selector Slider / Buttons */}
          <GlassCard>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold font-mono uppercase text-slate-300 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                Selector de Rondas AES (Ronda {selectedAesRound} de 10)
              </h3>
              <Badge variant="emerald">{selectedAesRound === 0 ? 'AddRoundKey Inicial' : selectedAesRound === 10 ? 'Ronda Final (Sin MixColumns)' : `Ronda ${selectedAesRound} Estándar`}</Badge>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(r => (
                <button
                  key={r}
                  onClick={() => setSelectedAesRound(r)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs whitespace-nowrap transition-all ${
                    selectedAesRound === r
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Ronda {r}
                </button>
              ))}
            </div>
          </GlassCard>

          {/* 4 State Transformations Matrix Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {selectedAesRound === 0 ? (
              <>
                {renderMatrix4x4(currentAesRoundData.startState, '1. Estado Inicial (Input)', 'sky')}
                {renderMatrix4x4(currentAesRoundData.roundKey, '2. Subclave Ronda 0 (K0)', 'amber')}
                {renderMatrix4x4(currentAesRoundData.afterAddRoundKey, '3. Salida AddRoundKey', 'emerald')}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col justify-center text-xs text-slate-400 space-y-2">
                  <span className="font-bold text-slate-200 uppercase font-mono">Ronda 0 (Pre-Ronda):</span>
                  <p>Aplica un blanqueo preliminar ejecutando un XOR simple entre el bloque en claro y la clave maestra expandida.</p>
                </div>
              </>
            ) : selectedAesRound === 10 ? (
              <>
                {renderMatrix4x4(currentAesRoundData.startState, '1. Estado Inicial Ronda 10', 'sky')}
                {currentAesRoundData.afterSubBytes && renderMatrix4x4(currentAesRoundData.afterSubBytes, '2. SubBytes (S-Box)', 'purple')}
                {currentAesRoundData.afterShiftRows && renderMatrix4x4(currentAesRoundData.afterShiftRows, '3. ShiftRows (Rotación)', 'sky')}
                {renderMatrix4x4(currentAesRoundData.afterAddRoundKey, '4. Salida Final (K10)', 'emerald')}
              </>
            ) : (
              <>
                {currentAesRoundData.afterSubBytes && renderMatrix4x4(currentAesRoundData.afterSubBytes, '1. SubBytes (S-Box)', 'purple')}
                {currentAesRoundData.afterShiftRows && renderMatrix4x4(currentAesRoundData.afterShiftRows, '2. ShiftRows (Rotación)', 'sky')}
                {currentAesRoundData.afterMixColumns && renderMatrix4x4(currentAesRoundData.afterMixColumns, '3. MixColumns (GF 2^8)', 'amber')}
                {renderMatrix4x4(currentAesRoundData.afterAddRoundKey, '4. AddRoundKey (Salida)', 'emerald')}
              </>
            )}
          </div>

          {/* Mathematical Explanation of the 4 Transformations */}
          <GlassCard>
            <h4 className="text-xs font-bold font-mono uppercase text-slate-300 mb-3">
              Fundamentos Matemáticos de las 4 Transformaciones de Ronda
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400 font-mono">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="font-bold text-purple-400 block mb-1">1. SubBytes (Confusión No Lineal):</span>
                Mapea cada byte con la S-Box de Rijndael, calculando su inverso multiplicativo en el campo finito GF(2^8) seguido de una transformación afín sobre GF(2).
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="font-bold text-sky-400 block mb-1">2. ShiftRows (Difusión Posicional):</span>
                Desplaza cíclicamente los bytes de cada fila: la fila 0 no rota, la fila 1 rota 1 byte a la izquierda, la fila 2 rota 2 bytes y la fila 3 rota 3 bytes.
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="font-bold text-amber-400 block mb-1">3. MixColumns (Multiplicación Matricial):</span>
                Multiplica cada columna por la matriz polinomial fija c(x) = 3x^3 + x^2 + x + 2 módulo x^4 + 1 en GF(2^8) con irreducible x^8 + x^4 + x^3 + x + 1.
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="font-bold text-emerald-400 block mb-1">4. AddRoundKey (Mezcla de Clave):</span>
                Aplica la operación XOR bit a bit entre los 16 bytes de la matriz de estado y los 16 bytes de la subclave de la ronda generada por KeyExpansion.
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* VIEW 2: DES & 3DES (FEISTEL) */}
      {activeEngine === 'des' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard>
              <label className="text-xs font-bold text-slate-400 font-mono uppercase mb-2 block">
                Texto en Claro (Bloque de 8 Caracteres / 64 Bits)
              </label>
              <input
                type="text"
                value={desInputText}
                maxLength={8}
                onChange={e => setDesInputText(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono text-sm"
              />
              <div className="mt-2 text-xs font-mono text-slate-400">
                Hex Entrada: <span className="text-slate-200">{desTrace.plaintextHex}</span>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-400 font-mono uppercase">
                  Clave DES (8 Caracteres / 64 Bits con 8 bits de paridad)
                </label>
                <button
                  onClick={() => setIs3DesMode(!is3DesMode)}
                  className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                    is3DesMode ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {is3DesMode ? 'Modo: Triple-DES (3DES)' : 'Modo: DES Estándar'}
                </button>
              </div>
              <input
                type="text"
                value={desKeyText}
                maxLength={8}
                onChange={e => setDesKeyText(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono text-sm"
              />
              <div className="mt-2 text-xs font-mono text-slate-400">
                Seguridad efectiva: <span className="text-amber-400 font-bold">{is3DesMode ? '112/168 bits (EDE)' : '56 bits (16 rondas)'}</span>
              </div>
            </GlassCard>
          </div>

          {/* Results Display */}
          <GlassCard borderGlow="amber">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono text-slate-400 block">
                  {is3DesMode ? 'Criptograma Triple-DES EDE3 (Hex)' : 'Criptograma DES Simple tras FP (Hex)'}
                </span>
                <span className="text-base font-bold font-mono text-amber-400 break-all">
                  {is3DesMode ? tripleDesCipherHex : desTrace.ciphertextHex}
                </span>
              </div>
              <CopyButton text={is3DesMode ? tripleDesCipherHex : desTrace.ciphertextHex} />
            </div>
          </GlassCard>

          {/* Feistel Round Selector */}
          <GlassCard>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold font-mono uppercase text-slate-300">
                Escalera de Feistel (Ronda {selectedDesRound} de 16)
              </h3>
              <Badge variant="amber">K_{selectedDesRound}: 0x{currentDesRoundData.subKey}</Badge>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
              {Array.from({ length: 16 }, (_, i) => i + 1).map(r => (
                <button
                  key={r}
                  onClick={() => setSelectedDesRound(r)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs whitespace-nowrap transition-all ${
                    selectedDesRound === r
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  R{r}
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Feistel Round Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
              <span className="text-slate-400 font-bold block uppercase">Entrada de la Ronda {selectedDesRound}</span>
              <div className="text-sky-400">L_{selectedDesRound - 1}: 0x{currentDesRoundData.leftIn}</div>
              <div className="text-emerald-400">R_{selectedDesRound - 1}: 0x{currentDesRoundData.rightIn}</div>
              <div className="pt-2 border-t border-slate-800 text-amber-300">Subclave K_{selectedDesRound}: 0x{currentDesRoundData.subKey}</div>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
              <span className="text-slate-400 font-bold block uppercase">Función Interna f(R, K)</span>
              <div>Expansión E (32→48 b): 0x{currentDesRoundData.expandedRight}</div>
              <div>XOR Subclave (E ⊕ K): 0x{currentDesRoundData.xorSubkey}</div>
              <div className="text-purple-300">Salida 8 Cajas S (48→32 b): 0x{currentDesRoundData.sboxOutput}</div>
              <div className="text-amber-300">Permutación P (32 b): 0x{currentDesRoundData.pboxOutput}</div>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
              <span className="text-slate-400 font-bold block uppercase">Salida de la Ronda {selectedDesRound}</span>
              <div className="text-sky-400">L_{selectedDesRound} = R_{selectedDesRound - 1}: 0x{currentDesRoundData.leftOut}</div>
              <div className="text-emerald-400">R_{selectedDesRound} = L ⊕ f(R, K): 0x{currentDesRoundData.rightOut}</div>
              <p className="text-[11px] text-slate-500 pt-1">
                La mitad derecha pasa intacta como la nueva izquierda, y la nueva derecha recibe el resultado de la función f cruzada con XOR.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: MODES OF OPERATION (ECB VS CBC) */}
      {activeEngine === 'modes' && (
        <div className="space-y-6">
          <GlassCard>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="rose">Vulnerabilidad de Fuga de Patrones</Badge>
              <Badge variant="emerald">Solución con Vector de Inicialización (IV)</Badge>
            </div>
            <h3 className="text-sm font-bold text-slate-200 font-mono uppercase">
              Demostración Práctica: ¿Por qué NUNCA se debe usar ECB?
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              En modo <strong>ECB (Electronic Codebook)</strong>, dos bloques idénticos de texto en claro producen <em>exactamente el mismo criptograma</em>, preservando patrones visuales y estadísticos (famoso efecto del pingüino de Linux). En modo <strong>CBC (Cipher Block Chaining)</strong>, cada bloque se mezcla mediante XOR con el criptograma anterior (o con el IV en el primer bloque), dispersando cualquier patrón idéntico.
            </p>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard>
              <label className="text-xs font-bold text-slate-400 font-mono uppercase mb-1 block">
                Texto en Claro (2 Bloques de 16 Bytes Idénticos)
              </label>
              <input
                type="text"
                value={modeRepeatText}
                maxLength={32}
                onChange={e => setModeRepeatText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono text-xs"
              />
              <div className="mt-2 text-[11px] font-mono text-slate-500">
                Bloque 1: "{modeRepeatText.slice(0, 16)}" | Bloque 2: "{modeRepeatText.slice(16, 32)}"
              </div>
            </GlassCard>

            <GlassCard>
              <label className="text-xs font-bold text-slate-400 font-mono uppercase mb-1 block">
                Vector de Inicialización IV (16 Bytes para CBC)
              </label>
              <input
                type="text"
                value={modeIv}
                maxLength={16}
                onChange={e => setModeIv(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono text-xs"
              />
            </GlassCard>
          </div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ECB Card */}
            <GlassCard borderGlow="rose">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-rose-400 uppercase">Modo ECB (Inseguro)</span>
                <Badge variant="rose">Bloques Idénticos = Criptogramas Idénticos</Badge>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {ecbResults.map(res => (
                  <div key={res.index} className="p-3 bg-slate-950 rounded-xl border border-rose-500/30 space-y-1">
                    <div className="text-slate-400 font-bold">Bloque #{res.index + 1}</div>
                    <div className="text-slate-300">Entrada Hex: {res.inputPlaintextHex}</div>
                    <div className="text-rose-300 font-bold">Criptograma: {res.ciphertextHex}</div>
                  </div>
                ))}
              </div>

              <p className="mt-3 text-[11px] text-rose-300 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                ⚠️ Observa cómo el Criptograma del Bloque 1 es <strong>100% IDÉNTICO</strong> al Criptograma del Bloque 2. Un atacante puede inferir repeticiones sin conocer la clave.
              </p>
            </GlassCard>

            {/* CBC Card */}
            <GlassCard borderGlow="emerald">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-emerald-400 uppercase">Modo CBC (Recomendado)</span>
                <Badge variant="emerald">Encadenamiento con IV</Badge>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {cbcResults.map(res => (
                  <div key={res.index} className="p-3 bg-slate-950 rounded-xl border border-emerald-500/30 space-y-1">
                    <div className="text-slate-400 font-bold">Bloque #{res.index + 1}</div>
                    <div className="text-slate-300">Entrada tras XOR (P ⊕ C_{res.index}): {res.xoredPlaintextHex}</div>
                    <div className="text-emerald-300 font-bold">Criptograma: {res.ciphertextHex}</div>
                  </div>
                ))}
              </div>

              <p className="mt-3 text-[11px] text-emerald-300 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                ✅ Aunque los dos bloques de entrada son idénticos, los criptogramas son <strong>COMPLETAMENTE DISTINTOS</strong> gracias a la propagación del vector IV.
              </p>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
};
