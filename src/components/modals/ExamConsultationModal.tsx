import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  X,
  Zap,
  BookOpen,
  Copy,
  Check,
  Lightbulb,
  Key,
  Shield,
  Layers,
  Database,
  Cpu,
  Terminal,
  Network,
  RotateCw,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { KNOWLEDGE_BASE_QA, QAItem, QACategory } from '../../crypto/knowledgeBase';
import { ENCYCLOPEDIA_ARTICLES } from '../../data/encyclopedia.data';
import { MainTabType } from '../../types';
import { useClipboard } from '../../hooks';

interface ExamConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToEncyclopedia?: (articleId?: string) => void;
}

interface QuickExamPrompt {
  label: string;
  query: string;
  category: QACategory;
  icon: React.ComponentType<{ className?: string }>;
}

const FREQUENT_EXAM_PROMPTS: QuickExamPrompt[] = [
  {
    label: 'Simétrica vs Asimétrica',
    query: 'diferencia entre criptografía simétrica y asimétrica',
    category: 'asimetrico',
    icon: Shield,
  },
  {
    label: 'Criptografía Simétrica y Kerckhoffs',
    query: 'clave secreta única Kerckhoffs debilidad distribución',
    category: 'simetrico',
    icon: Key,
  },
  {
    label: 'DES, 3DES y AES (Rondas y Cajas S)',
    query: 'DES 56 bits 3DES Sweet32 AES 128 SubBytes MixColumns',
    category: 'simetrico',
    icon: Layers,
  },
  {
    label: 'Fuerza Bruta y Longitud 2^k',
    query: 'fuerza bruta diccionarios Hashcat longitud clave exponencial',
    category: 'fuerza_bruta',
    icon: RotateCw,
  },
  {
    label: 'Cleopatra y Asimétrica (RSA/DSA)',
    query: 'Cleopatra Kleopatra generación exportación llaves asc',
    category: 'asimetrico',
    icon: Key,
  },
  {
    label: 'Repaso: AES vs RSA',
    query: 'AES simétrico recomendado RSA asimétrico utilizado',
    category: 'asimetrico',
    icon: Shield,
  },
  {
    label: 'Sistemas Distribuidos y RPC (Stubs)',
    query: 'RPC cliente servidor encriptación stubs hash integridad',
    category: 'distribuidos_dnie',
    icon: Network,
  },
  {
    label: 'DNI Electrónico (Chip, PIN, PDF)',
    query: 'DNI electrónico chip PIN biometría firma PDF AES 3DES',
    category: 'distribuidos_dnie',
    icon: Cpu,
  },
  {
    label: 'Hashes, Colisiones y Bases NoSQL',
    query: 'funciones hash integridad no confidencialidad colisiones tablas hash clave valor NoSQL',
    category: 'hashes',
    icon: Database,
  },
  {
    label: 'OpenSSL, CyberChef y Cifrado Híbrido',
    query: 'OpenSSL CyberChef AES-256-CBC RSA-2048 OAEP SHA-256 híbrido',
    category: 'herramientas_lab',
    icon: Terminal,
  },
];

export const ExamConsultationModal: React.FC<ExamConsultationModalProps> = ({
  isOpen,
  onClose,
  onNavigateToEncyclopedia,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<QACategory>('all');
  const inputRef = useRef<HTMLInputElement>(null);
  const { copy, isCopied } = useClipboard();

  // Focus search input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setSearchTerm('');
      setSelectedCategory('all');
    }
  }, [isOpen]);

  // Global ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter Q&A items based on search query and category
  const results = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    const tokens = q.split(/\s+/).filter(Boolean);

    return KNOWLEDGE_BASE_QA.filter(item => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (tokens.length === 0) return true;

      const searchableText = `${item.question} ${item.shortSummary} ${item.detailedContent.join(' ')} ${item.keyTakeaways.join(' ')} ${item.tags.join(' ')} ${item.categoryLabel}`.toLowerCase();

      // Match all search tokens
      return tokens.every(token => searchableText.includes(token));
    });
  }, [searchTerm, selectedCategory]);

  const handleCopyExamAnswer = (item: QAItem) => {
    const textToCopy = `[RESPUESTA DE EXAMEN]\nPregunta: ${item.question}\n\nRespuesta Concisa:\n${item.shortSummary}\n\nPuntos Clave & Justificación:\n${item.keyTakeaways.map(t => `• ${t}`).join('\n')}\n\nReferencia Formal:\n${item.apaCitation || 'N/A'}`;
    copy(textToCopy, `exam-${item.id}`);
  };

  const handleOpenInEncyclopedia = (item: QAItem) => {
    onClose();
    if (onNavigateToEncyclopedia) {
      // Find corresponding article
      const article = ENCYCLOPEDIA_ARTICLES.find(
        a =>
          a.id.includes(item.category) ||
          item.tags.some(t => a.title.toLowerCase().includes(t.toLowerCase()))
      );
      onNavigateToEncyclopedia(article?.id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header with Search Input */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/90 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                  Modo Consulta de Examen · Respuestas Exactas y Objetivas
                </h2>
                <p className="text-[11px] text-slate-400 font-mono">
                  Escribe tu pregunta o términos del examen para obtener la respuesta directa y justificada
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Cerrar (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-amber-400 absolute left-3.5 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Ej: diferencia simétrica y asimétrica, AES rondas, DES 56 bits, RPC stubs, DNIe chip, colisión hash..."
              className="w-full pl-10 pr-20 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 text-xs font-mono text-slate-400 hover:text-slate-200"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-mono">
            {[
              { id: 'all', label: 'Todo' },
              { id: 'simetrico', label: 'Simétrica (DES/3DES/AES)' },
              { id: 'asimetrico', label: 'Asimétrica (RSA/Cleopatra)' },
              { id: 'distribuidos_dnie', label: 'Distribuidos (RPC) & DNIe' },
              { id: 'hashes', label: 'Hashes & NoSQL' },
              { id: 'fuerza_bruta', label: 'Fuerza Bruta' },
              { id: 'herramientas_lab', label: 'OpenSSL & CyberChef' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as QACategory)}
                className={`px-2.5 py-1 rounded-lg border whitespace-nowrap transition ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body: Results or Quick Prompt Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4">
          {/* If no search term and "all" category, show frequent exam prompts banner */}
          {!searchTerm && selectedCategory === 'all' && (
            <div className="flex flex-col gap-3">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Preguntas Típicas y Temas de Evaluación (1 Clic)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {FREQUENT_EXAM_PROMPTS.map((prompt, idx) => {
                  const Icon = prompt.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setSearchTerm(prompt.query);
                        setSelectedCategory(prompt.category);
                      }}
                      className="p-3 rounded-xl border border-slate-800 bg-slate-950/50 hover:bg-slate-800/60 hover:border-amber-500/40 text-left transition flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold text-slate-200 group-hover:text-amber-300 truncate">
                          {prompt.label}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5 flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
              <div className="border-t border-slate-800/80 my-2" />
            </div>
          )}

          {/* Results Count & Match List */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Resultados encontrados: {results.length}</span>
            {searchTerm && (
              <span className="text-[11px] text-amber-400/80">
                Filtro activo: &ldquo;{searchTerm}&rdquo;
              </span>
            )}
          </div>

          {results.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-mono text-xs flex flex-col items-center gap-2">
              <Search className="w-8 h-8 text-slate-600 mb-1" />
              <span>No se encontraron preguntas que coincidan con los términos de búsqueda.</span>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="mt-2 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs"
              >
                Ver todas las preguntas del curso
              </button>
            </div>
          ) : (
            results.map((item, idx) => {
              const copied = isCopied(`exam-${item.id}`);

              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-950/70 hover:border-slate-700 transition flex flex-col gap-3"
                >
                  {/* Card Title & Category */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-300 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${item.badgeColor}`}>
                            {item.categoryLabel}
                          </span>
                          {item.apaCitation && (
                            <span className="text-[10px] font-mono text-slate-500">
                              Ref: {item.apaCitation}
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-100 leading-snug">
                          {item.question}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleCopyExamAnswer(item)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition border ${
                          copied
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-slate-900 text-slate-300 hover:text-white border-slate-700 hover:border-amber-500/40'
                        }`}
                        title="Copiar respuesta resumida para examen"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>¡Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* 🎯 Exact Quick Exam Answer Box */}
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5 text-amber-300 text-[11px] font-mono font-bold uppercase tracking-wider">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Respuesta Rápida de Examen:</span>
                    </div>
                    <p className="text-xs sm:text-[13px] text-amber-100/90 font-mono leading-relaxed">
                      {item.shortSummary}
                    </p>
                  </div>

                  {/* 💡 Key Takeaways & Common Professor Traps */}
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2">
                    <span className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-emerald-400" />
                      Puntos Clave y Criterios de Corrección:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-300 font-mono">
                      {item.keyTakeaways.map((takeaway, tIdx) => (
                        <li key={tIdx} className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Detailed explanation collapsed preview */}
                  <div className="text-xs text-slate-400 font-mono space-y-1 bg-slate-900/40 p-3 rounded-lg border border-slate-800/60 max-h-36 overflow-y-auto">
                    {item.detailedContent.map((paragraph, pIdx) => (
                      <p key={pIdx} className="leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Bottom Footer Actions */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-xs font-mono">
                    <div className="flex items-center gap-1 flex-wrap">
                      {item.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {onNavigateToEncyclopedia && (
                      <button
                        onClick={() => handleOpenInEncyclopedia(item)}
                        className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold transition"
                      >
                        <span>Ver Tratado Completo</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-900 border border-slate-700 rounded text-amber-400 font-bold">
              Ctrl + K
            </kbd>
            <span className="hidden sm:inline">para abrir/cerrar en cualquier momento</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs transition"
          >
            Cerrar Consulta
          </button>
        </div>
      </div>
    </div>
  );
};
