import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { CopyButton } from '../common/CopyButton';
import {
  convertTextToBases,
  performBitwiseOp,
  xorEncryptDecrypt,
  convertBinaryToText,
  convertHexToText,
} from '../../crypto/numericBases';
import { Binary, Cpu, ArrowRightLeft, Sparkles, Key, HelpCircle, Layers } from 'lucide-react';

export const BaseConverterTool: React.FC = () => {
  const [inputText, setInputText] = useState('CRIPTO');
  const [activeTab, setActiveTab] = useState<'converter' | 'bitwise' | 'xorStream'>('converter');

  // Interactive Bit manipulation state
  const [customByte, setCustomByte] = useState<number>(0b01000001); // 65 = 'A'

  // Bitwise Op state
  const [valA, setValA] = useState<number>(0x55); // 01010101
  const [valB, setValB] = useState<number>(0xaa); // 10101010
  const [bitOp, setBitOp] = useState<'XOR' | 'AND' | 'OR' | 'NOT' | 'SHL' | 'SHR'>('XOR');
  const [bitLength, setBitLength] = useState<8 | 16 | 32>(8);

  // XOR Stream state
  const [streamText, setStreamText] = useState('HOLAMUNDO');
  const [streamKey, setStreamKey] = useState('CLAVE');

  const convResult = convertTextToBases(inputText);
  const bitwiseResult = performBitwiseOp(valA, valB, bitOp, bitLength);
  const xorStreamResult = xorEncryptDecrypt(streamText, streamKey);

  const toggleBit = (bitIndex: number) => {
    setCustomByte(prev => prev ^ (1 << bitIndex));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <GlassCard borderGlow="sky" className="relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="sky">Semana S11 · Fundamentos</Badge>
              <Badge variant="slate">Bases & Operaciones Bitwise</Badge>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
              <Binary className="w-6 h-6 text-sky-400" />
              Sistemas de Numeración y Álgebra Booleana
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
              Conversión analítica entre bases (Binario, Hexadecimal, Octal, Decimal, Base64), manipulación interactiva de bits y cálculo de involución XOR fundamental en DES, AES y Vernam.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('converter')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeTab === 'converter' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Conversor Multi-Base
            </button>
            <button
              onClick={() => setActiveTab('bitwise')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeTab === 'bitwise' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Laboratorio Bitwise
            </button>
            <button
              onClick={() => setActiveTab('xorStream')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeTab === 'xorStream' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cifrado XOR Stream
            </button>
          </div>
        </div>
      </GlassCard>

      {/* TAB 1: CONVERSOR MULTI-BASE */}
      {activeTab === 'converter' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Input and Bit Manipulation */}
          <div className="lg:col-span-5 space-y-6">
            <GlassCard>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Entrada de Texto / Caracteres</span>
                <span className="text-xs font-mono text-slate-400">{convResult.byteCount} Bytes / {convResult.bitCount} Bits</span>
              </h3>
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Escribe aquí un texto o mensaje..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />

              <div className="mt-4 flex flex-wrap gap-2">
                {['CRIPTO', 'AES-256', 'KEY2026', 'FEISTEL', 'HELLO'].map(preset => (
                  <button
                    key={preset}
                    onClick={() => setInputText(preset)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-mono border border-slate-700 transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </GlassCard>

            {/* Interactive Byte Inspector */}
            <GlassCard borderGlow="sky">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-sky-400" />
                  Manipulador Interactivo de 8 Bits
                </h3>
                <Badge variant="sky">Click en bits para conmutar</Badge>
              </div>

              <p className="text-xs text-slate-400 mb-4">
                Interactúa con los 8 bits individuales (del MSB bit 7 al LSB bit 0) para observar la transformación inmediata en ASCII, Decimal y Hexadecimal:
              </p>

              {/* Bit Grid */}
              <div className="grid grid-cols-8 gap-1.5 sm:gap-2 mb-4">
                {[7, 6, 5, 4, 3, 2, 1, 0].map(bitIdx => {
                  const isSet = (customByte & (1 << bitIdx)) !== 0;
                  return (
                    <button
                      key={bitIdx}
                      onClick={() => toggleBit(bitIdx)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl font-mono text-center transition-all ${
                        isSet
                          ? 'bg-sky-500 text-slate-950 font-bold shadow-lg shadow-sky-500/20 scale-105'
                          : 'bg-slate-950 border border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                      }`}
                    >
                      <span className="text-[10px] opacity-75">b{bitIdx}</span>
                      <span className="text-lg font-bold">{isSet ? '1' : '0'}</span>
                      <span className="text-[9px] opacity-60">2^{bitIdx}</span>
                    </button>
                  );
                })}
              </div>

              {/* Byte Metrics */}
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-center font-mono">
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">Carácter</div>
                  <div className="text-sm font-bold text-amber-300">
                    {customByte >= 32 && customByte <= 126 ? `'${String.fromCharCode(customByte)}'` : 'No impr.'}
                  </div>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">Decimal</div>
                  <div className="text-sm font-bold text-sky-300">{customByte}</div>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">Hexadecimal</div>
                  <div className="text-sm font-bold text-emerald-300">0x{customByte.toString(16).toUpperCase().padStart(2, '0')}</div>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">Octal</div>
                  <div className="text-sm font-bold text-purple-300">{customByte.toString(8).padStart(3, '0')}</div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Right Column: Multi-Base Representation Cards */}
          <div className="lg:col-span-7 space-y-4">
            {/* Binario */}
            <GlassCard>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                  <span className="font-mono text-xs font-bold text-sky-400">BINARIO (Base 2 - 8 bits/byte)</span>
                </div>
                <CopyButton text={convResult.binary} />
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-sky-200 break-all leading-relaxed max-h-28 overflow-y-auto">
                {convResult.binary || 'Esperando entrada...'}
              </div>
            </GlassCard>

            {/* Hexadecimal */}
            <GlassCard>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span className="font-mono text-xs font-bold text-emerald-400">HEXADECIMAL (Base 16 - Formato Criptográfico Estándar)</span>
                </div>
                <CopyButton text={convResult.hex} />
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-emerald-200 break-all leading-relaxed">
                {convResult.hex || 'Esperando entrada...'}
              </div>
            </GlassCard>

            {/* Base64 & Octal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GlassCard>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-amber-400">BASE64 (RFC 4648)</span>
                  <CopyButton text={convResult.base64} />
                </div>
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-amber-200 break-all">
                  {convResult.base64 || 'N/A'}
                </div>
              </GlassCard>

              <GlassCard>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-purple-400">OCTAL (Base 8)</span>
                  <CopyButton text={convResult.octal} />
                </div>
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-purple-200 break-all">
                  {convResult.octal || 'N/A'}
                </div>
              </GlassCard>
            </div>

            {/* Detailed Character ASCII Table Breakdown */}
            <GlassCard>
              <h4 className="text-xs font-bold text-slate-300 font-mono uppercase mb-3">
                Desglose Byte a Byte (Tabla ASCII / UTF-8)
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-2">Carácter</th>
                      <th className="pb-2">ASCII Dec</th>
                      <th className="pb-2">Hex (Base 16)</th>
                      <th className="pb-2">Binario (Base 2)</th>
                      <th className="pb-2">Octal (Base 8)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {inputText.split('').map((char, i) => {
                      const code = char.charCodeAt(0);
                      return (
                        <tr key={i} className="hover:bg-slate-800/30">
                          <td className="py-2 font-bold text-amber-400">'{char}'</td>
                          <td className="py-2 text-slate-300">{code}</td>
                          <td className="py-2 text-emerald-400 font-bold">0x{code.toString(16).toUpperCase().padStart(2, '0')}</td>
                          <td className="py-2 text-sky-300">{code.toString(2).padStart(8, '0')}</td>
                          <td className="py-2 text-purple-300">{code.toString(8).padStart(3, '0')}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* TAB 2: LABORATORIO BITWISE */}
      {activeTab === 'bitwise' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard>
              <h4 className="text-xs font-bold text-slate-400 font-mono mb-2 uppercase">Operando A (Hex / Dec)</h4>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-sky-400">0x</span>
                <input
                  type="text"
                  value={valA.toString(16).toUpperCase()}
                  onChange={e => setValA(parseInt(e.target.value, 16) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono text-sm"
                />
              </div>
              <div className="mt-2 text-xs font-mono text-slate-400">
                Decimal: <span className="text-slate-200">{valA}</span> | Bin: <span className="text-sky-300">{bitwiseResult.operandA}</span>
              </div>
            </GlassCard>

            <GlassCard>
              <h4 className="text-xs font-bold text-slate-400 font-mono mb-2 uppercase">Operación Lógica</h4>
              <div className="grid grid-cols-3 gap-1.5">
                {(['XOR', 'AND', 'OR', 'NOT', 'SHL', 'SHR'] as const).map(op => (
                  <button
                    key={op}
                    onClick={() => setBitOp(op)}
                    className={`py-2 px-3 rounded-lg font-mono text-xs font-bold transition-all ${
                      bitOp === op ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {op}
                  </button>
                ))}
              </div>
            </GlassCard>

            <GlassCard>
              <h4 className="text-xs font-bold text-slate-400 font-mono mb-2 uppercase">Operando B (Hex / Dec / Shift)</h4>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-emerald-400">0x</span>
                <input
                  type="text"
                  value={valB.toString(16).toUpperCase()}
                  onChange={e => setValB(parseInt(e.target.value, 16) || 0)}
                  disabled={bitOp === 'NOT'}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono text-sm disabled:opacity-40"
                />
              </div>
              {bitOp !== 'NOT' && (
                <div className="mt-2 text-xs font-mono text-slate-400">
                  Decimal: <span className="text-slate-200">{valB}</span> | Bin: <span className="text-emerald-300">{bitwiseResult.operandB}</span>
                </div>
              )}
            </GlassCard>
          </div>

          {/* Execution Result Diagram */}
          <GlassCard borderGlow="sky">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
                Cálculo Bit a Bit Paso a Paso ({bitOp})
              </h3>
              <Badge variant="sky">Resultado: 0x{bitwiseResult.hexResult}</Badge>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-sm space-y-3">
              <div className="flex items-center justify-between text-sky-400">
                <span>A (Binario):</span>
                <span className="tracking-widest font-bold">{bitwiseResult.operandA}</span>
              </div>
              {bitwiseResult.operandB && (
                <div className="flex items-center justify-between text-emerald-400">
                  <span>B (Binario):</span>
                  <span className="tracking-widest font-bold">{bitwiseResult.operandB}</span>
                </div>
              )}
              <div className="border-t border-slate-800 pt-2 flex items-center justify-between text-amber-300 text-base font-bold">
                <span>Resultado (A {bitOp} B):</span>
                <span className="tracking-widest">{bitwiseResult.result}</span>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              💡 <span className="font-semibold text-slate-200">Fundamento Criptográfico:</span> {bitwiseResult.explanation}
            </p>
          </GlassCard>
        </div>
      )}

      {/* TAB 3: CIFRADO XOR STREAM */}
      {activeTab === 'xorStream' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard>
              <label className="text-xs font-bold text-slate-400 font-mono uppercase mb-2 block">
                Texto en Claro o Criptograma
              </label>
              <input
                type="text"
                value={streamText}
                onChange={e => setStreamText(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono text-sm"
              />
            </GlassCard>

            <GlassCard>
              <label className="text-xs font-bold text-slate-400 font-mono uppercase mb-2 block">
                Clave de Flujo (Key Stream)
              </label>
              <input
                type="text"
                value={streamKey}
                onChange={e => setStreamKey(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono text-sm"
              />
            </GlassCard>
          </div>

          <GlassCard borderGlow="emerald">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-400" />
                Criptograma Resultante (Involución de Vernam: C = M ⊕ K, M = C ⊕ K)
              </h3>
              <CopyButton text={xorStreamResult.hex} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono">
                <div className="text-xs text-slate-400 mb-1">Criptograma en Hexadecimal (Bytes)</div>
                <div className="text-sm font-bold text-emerald-400 break-all">{xorStreamResult.hex}</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono">
                <div className="text-xs text-slate-400 mb-1">Criptograma en Binario</div>
                <div className="text-xs text-sky-300 break-all">{xorStreamResult.binary}</div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-300">
              📌 <span className="font-semibold text-amber-300">Propiedad de Simetría Perfecta:</span> Si vuelves a ingresar el criptograma con la misma clave <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-200">{streamKey}</code>, obtendrás exactamente el mensaje original <code className="bg-slate-800 px-1 py-0.5 rounded text-sky-200">{streamText}</code> debido a la propiedad algebraica <code className="text-emerald-300 font-bold">(M ⊕ K) ⊕ K = M</code>.
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
