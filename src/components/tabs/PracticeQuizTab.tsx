import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { AlphabetMode, normalizeText, formatInBlocks } from '../../crypto/alphabets';
import { generateExercise, ExerciseItem, ExerciseCipherType } from '../../crypto/exercises';
import { AlbertiDisk } from '../visualizers/AlbertiDisk';
import {
  GraduationCap,
  Sparkles,
  Trophy,
  Flame,
  HelpCircle,
  Eye,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Compass,
  ArrowRight,
} from 'lucide-react';

interface PracticeQuizTabProps {
  mode: AlphabetMode;
}

export const PracticeQuizTab: React.FC<PracticeQuizTabProps> = ({ mode }) => {
  const [selectedCipher, setSelectedCipher] = useState<ExerciseCipherType | 'random'>('alberti');
  const [currentExercise, setCurrentExercise] = useState<ExerciseItem | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [showDiskAssistant, setShowDiskAssistant] = useState<boolean>(true);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);

  const newQuestion = useCallback(() => {
    const cipherPool: ExerciseCipherType[] = [
      'alberti',
      'cesar',
      'afin',
      'vigenere',
      'beaufort',
      'playfair',
      'hill',
      'transposicion',
      'escitala',
      'frecuencia',
    ];
    const type = selectedCipher === 'random' ? cipherPool[Math.floor(Math.random() * cipherPool.length)] : selectedCipher;
    const ex = generateExercise(type, mode);
    setCurrentExercise(ex);
    setUserAnswer('');
    setStatus('idle');
    setShowHint(false);
    setShowSolution(false);
  }, [selectedCipher, mode]);

  useEffect(() => {
    newQuestion();
  }, [selectedCipher, mode, newQuestion]);

  const checkAnswer = () => {
    if (!currentExercise || !userAnswer.trim()) return;
    setAttempts(a => a + 1);

    const cleanUser = currentExercise.mode === 'find_key' ? userAnswer.trim() : normalizeText(userAnswer, mode);
    const cleanExpected =
      currentExercise.mode === 'find_key'
        ? currentExercise.expectedAnswer.trim()
        : normalizeText(currentExercise.expectedAnswer, mode);

    if (cleanUser === cleanExpected) {
      setStatus('correct');
      setScore(s => s + 100 + streak * 20);
      setStreak(st => st + 1);
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {}
    } else {
      setStatus('incorrect');
      setStreak(0);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-2 lg:p-4 w-full max-w-7xl mx-auto pb-10">
      {/* Top Banner with Stats & Cipher Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">Estudio de Ejercicios y Evaluación</h2>
            <p className="text-xs text-slate-400 font-mono">Entrena con retroalimentación inmediata y resolución paso a paso</p>
          </div>
        </div>

        {/* Stats Pills */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-bold text-amber-300">{score} pts</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-mono font-bold text-orange-300">{streak} racha</span>
          </div>
          <button
            onClick={() => setShowDiskAssistant(prev => !prev)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition ${
              showDiskAssistant
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>{showDiskAssistant ? 'Ocultar Disco Auxiliar' : 'Mostrar Disco Auxiliar'}</span>
          </button>
        </div>
      </div>

      {/* Cipher Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: 'alberti', label: 'Disco Alberti' },
          { id: 'cesar', label: 'César' },
          { id: 'afin', label: 'Afín' },
          { id: 'vigenere', label: 'Vigenère' },
          { id: 'beaufort', label: 'Beaufort' },
          { id: 'playfair', label: 'Playfair' },
          { id: 'hill', label: 'Hill' },
          { id: 'transposicion', label: 'Transposición' },
          { id: 'escitala', label: 'Escítala' },
          { id: 'frecuencia', label: 'Criptoanálisis' },
          { id: 'random', label: '★ Modo Aleatorio' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedCipher(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs whitespace-nowrap transition border ${
              selectedCipher === tab.id
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Practice Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Question Card */}
        <div className={showDiskAssistant ? 'lg:col-span-6 flex flex-col gap-4' : 'lg:col-span-12 flex flex-col gap-4'}>
          {currentExercise && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col gap-5">
              {/* Question Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  {currentExercise.title}
                </span>
                <span className="text-[11px] font-mono text-slate-500 uppercase">
                  {currentExercise.mode === 'encrypt' ? '▣ CIFRAR' : currentExercise.mode === 'decrypt' ? '▢ DESCIFRAR' : '🔍 DEDUCIR CLAVE'}
                </span>
              </div>

              {/* Question Body */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                <pre className="font-mono text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {currentExercise.question}
                </pre>
              </div>

              {/* User Answer Input */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono text-slate-400">
                  Tu Respuesta {currentExercise.mode !== 'find_key' ? '(sin espacios ni acentos)': ''}:
                </label>
                <textarea
                  value={userAnswer}
                  onChange={e => {
                    setUserAnswer(e.target.value);
                    setStatus('idle');
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) checkAnswer();
                  }}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition"
                  placeholder="Escribe tu resultado aquí..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={checkAnswer}
                  disabled={!userAnswer.trim()}
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-mono text-xs font-bold hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-lg shadow-amber-500/10"
                >
                  Comprobar Respuesta
                </button>
                <button
                  onClick={newQuestion}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 font-mono text-xs hover:bg-slate-700 transition"
                >
                  Siguiente Ejercicio
                </button>
                <button
                  onClick={() => setShowHint(h => !h)}
                  className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-sky-400 font-mono text-xs transition"
                >
                  <HelpCircle className="w-3.5 h-3.5 inline mr-1" />
                  {showHint ? 'Ocultar Pista' : 'Pista'}
                </button>
                <button
                  onClick={() => setShowSolution(s => !s)}
                  className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-violet-400 font-mono text-xs transition"
                >
                  <Eye className="w-3.5 h-3.5 inline mr-1" />
                  {showSolution ? 'Ocultar Solución' : 'Ver Solución'}
                </button>
              </div>

              {/* Feedback Banner */}
              {status !== 'idle' && (
                <div
                  className={`p-4 rounded-xl border flex items-start gap-3 ${
                    status === 'correct' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'
                  }`}
                >
                  {status === 'correct' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className={`font-mono text-sm font-bold block ${status === 'correct' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {status === 'correct' ? '¡Excelente! Respuesta 100% Correcta' : 'Respuesta Incorrecta'}
                    </span>
                    {status === 'incorrect' && (
                      <p className="text-xs text-slate-300 font-mono mt-1">
                        Revisa tus rotaciones o cálculos modulares. Puedes abrir la solución paso a paso abajo.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Hint Box */}
              {showHint && (
                <div className="bg-sky-950/30 border border-sky-500/30 rounded-xl p-4 text-xs font-mono text-sky-200">
                  <span className="font-bold text-sky-400 block mb-1">Pista Orientativa:</span>
                  {currentExercise.hint}
                </div>
              )}

              {/* Detailed Steps Box */}
              {showSolution && (
                <div className="bg-violet-950/30 border border-violet-500/30 rounded-xl p-4 text-xs font-mono text-violet-200 flex flex-col gap-2">
                  <span className="font-bold text-violet-400 block">Demostración y Solución Paso a Paso:</span>
                  <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                    {currentExercise.detailedSteps.map((st, i) => (
                      <div key={`sol-step-${i}`} className="p-1.5 rounded bg-slate-950/70 border border-slate-800/80">
                        {st}
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-violet-500/20 flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-400">Respuesta Oficial:</span>
                    <span className="text-emerald-400 font-mono">{currentExercise.expectedAnswer}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Embedded Interactive Alberti Disk Assistant */}
        {showDiskAssistant && (
          <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 backdrop-blur-md flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-400" />
                Asistente de Rueda de Cifrado
              </span>
              <span className="text-[10px] font-mono text-slate-500">Gira libremente para comprobar</span>
            </div>
            <AlbertiDisk mode={mode} />
          </div>
        )}
      </div>
    </div>
  );
};
