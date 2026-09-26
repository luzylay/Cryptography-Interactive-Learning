import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  ExternalLink,
  BookmarkCheck,
  FileText,
  HelpCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Tag,
} from 'lucide-react';
import {
  KNOWLEDGE_BASE_QA,
  QA_CATEGORIES,
  QACategory,
  QAItem,
} from '../../crypto/knowledgeBase';
import { APA_REFERENCES, ENCYCLOPEDIA_ARTICLES, ApaReference } from '../../data/encyclopedia.data';
import { MainTabType } from '../../types';
import { Badge, GlassCard, CopyButton, SearchBar } from '../common';
import { useClipboard } from '../../hooks';

interface EncyclopediaTabProps {
  onNavigateTab?: (tab: MainTabType) => void;
}

export const EncyclopediaTab: React.FC<EncyclopediaTabProps> = ({ onNavigateTab }) => {
  const [activeTab, setActiveTab] = useState<'qa' | 'articles' | 'bibliography'>('articles');
  const [activeArticle, setActiveArticle] = useState<string>('playfair');
  const [selectedQACategory, setSelectedQACategory] = useState<QACategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedQAIds, setExpandedQAIds] = useState<Set<string>>(
    new Set(KNOWLEDGE_BASE_QA.map(q => q.id))
  );

  const { copy, isCopied } = useClipboard();

  const toggleQA = (id: string) => {
    setExpandedQAIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleCopyQA = (item: QAItem) => {
    const text = `PREGUNTA: ${item.question}\n\nRESUMEN:\n${item.shortSummary}\n\nDESARROLLO DETALLADO:\n${item.detailedContent.join('\n')}\n\nPUNTOS CLAVE:\n${item.keyTakeaways.map(k => `• ${k}`).join('\n')}\n\nREFERENCIA: ${item.apaCitation || 'N/A'}`;
    copy(text, `qa-${item.id}`);
  };

  const handleCopyCitation = (ref: ApaReference) => {
    const apaText = `${ref.author} (${ref.year}). ${ref.title}. ${ref.source}. ${ref.doiOrUrl}`;
    copy(apaText, `ref-${ref.id}`);
  };

  const filteredQA = useMemo(() => {
    return KNOWLEDGE_BASE_QA.filter(item => {
      const matchCat = selectedQACategory === 'all' || item.category === selectedQACategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.shortSummary.toLowerCase().includes(q) ||
        item.detailedContent.some(c => c.toLowerCase().includes(q)) ||
        item.tags.some(t => t.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [selectedQACategory, searchQuery]);

  const currentArticle =
    ENCYCLOPEDIA_ARTICLES.find(a => a.id === activeArticle) || ENCYCLOPEDIA_ARTICLES[0];

  return (
    <div className="flex flex-col gap-6 p-2 lg:p-4 w-full max-w-7xl mx-auto pb-10">
      {/* Header Banner */}
      <GlassCard className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Enciclopedia, Banco de Preguntas y Referencias APA 7
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Fundamentos teóricos, cuestionario conceptual escalable y fuentes académicas verificadas
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('qa')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono rounded-lg transition whitespace-nowrap ${
              activeTab === 'qa'
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            Preguntas y Fundamentos ({KNOWLEDGE_BASE_QA.length})
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono rounded-lg transition whitespace-nowrap ${
              activeTab === 'articles'
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Artículos Teóricos ({ENCYCLOPEDIA_ARTICLES.length})
          </button>
          <button
            onClick={() => setActiveTab('bibliography')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono rounded-lg transition whitespace-nowrap ${
              activeTab === 'bibliography'
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            Bibliografía APA 7 ({APA_REFERENCES.length})
          </button>
        </div>
      </GlassCard>

      {/* ── VIEW 1: SCALABLE QUESTION & ANSWER KNOWLEDGE BASE ── */}
      {activeTab === 'qa' && (
        <div className="flex flex-col gap-6">
          {/* Filter & Search Bar */}
          <GlassCard className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {QA_CATEGORIES.map(cat => {
                const count =
                  cat.id === 'all'
                    ? KNOWLEDGE_BASE_QA.length
                    : KNOWLEDGE_BASE_QA.filter(q => q.category === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedQACategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs whitespace-nowrap transition border flex items-center gap-1.5 flex-shrink-0 ${
                      selectedQACategory === cat.id
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold shadow-sm'
                        : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Buscar preguntas o conceptos..."
              className="min-w-[240px] sm:max-w-xs"
            />
          </GlassCard>

          {/* Q&A Cards List */}
          <div className="flex flex-col gap-4">
            {filteredQA.length === 0 ? (
              <GlassCard className="text-center py-12 text-slate-500 font-mono text-sm">
                No se encontraron preguntas que coincidan con &ldquo;{searchQuery}&rdquo;.
              </GlassCard>
            ) : (
              filteredQA.map((item, idx) => {
                const isExpanded = expandedQAIds.has(item.id);
                const isCopiedState = isCopied(`qa-${item.id}`);

                return (
                  <div
                    key={item.id}
                    className="bg-slate-900/70 border border-slate-800/90 rounded-2xl overflow-hidden transition-all shadow-md hover:border-slate-700/80"
                  >
                    {/* Q&A Card Header */}
                    <div
                      onClick={() => toggleQA(item.id)}
                      className="p-4 sm:p-5 flex items-start justify-between gap-3 cursor-pointer bg-slate-900/40 hover:bg-slate-900/80 transition"
                    >
                      <div className="flex items-start gap-3.5 flex-1">
                        <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="flex flex-col gap-1.5 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded-md border font-semibold ${item.badgeColor}`}
                            >
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
                          <p className="text-xs text-slate-300 font-mono mt-0.5 leading-relaxed">
                            {item.shortSummary}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <CopyButton
                          text=""
                          isCopied={isCopiedState}
                          onCopy={() => handleCopyQA(item)}
                          label="Copiar"
                        />
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            toggleQA(item.id);
                          }}
                          className="p-1 text-slate-400 hover:text-slate-200 transition"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-amber-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Detailed Content */}
                    {isExpanded && (
                      <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-slate-950/60 flex flex-col gap-4">
                        {/* Detailed Development */}
                        <div className="flex flex-col gap-2">
                          <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            Desarrollo Académico &amp; Explicación Técnica
                          </h4>
                          <div className="space-y-1.5 text-xs text-slate-300 font-mono leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                            {item.detailedContent.map((paragraph, pIdx) => (
                              <p key={pIdx} className="whitespace-pre-line">
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        </div>

                        {/* Key Takeaways */}
                        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3.5 flex flex-col gap-1.5">
                          <h4 className="text-[11px] font-mono font-bold text-amber-300 uppercase">
                            💡 Puntos Clave &amp; Conclusiones
                          </h4>
                          <ul className="space-y-1 text-xs text-amber-200/90 font-mono">
                            {item.keyTakeaways.map((takeaway, tIdx) => (
                              <li key={tIdx} className="flex items-start gap-2">
                                <span className="text-amber-400 font-bold">•</span>
                                <span>{takeaway}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Tags and Metadata */}
                        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800/50 flex-wrap text-xs font-mono">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Tag className="w-3.5 h-3.5 text-slate-500" />
                            {item.tags.map((tag, tIdx) => (
                              <Badge key={tIdx} variant="slate" size="sm">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                          {item.apaCitation && (
                            <span className="text-[10px] text-slate-500">
                              Cita formal: {item.apaCitation}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ── VIEW 2: THEORETICAL ENCYCLOPEDIC ARTICLES ── */}
      {activeTab === 'articles' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Article Selector Column */}
          <div className="md:col-span-1 flex flex-col gap-2">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
              Temas y Tratados ({ENCYCLOPEDIA_ARTICLES.length})
            </span>
            {ENCYCLOPEDIA_ARTICLES.map(art => {
              const isSelected = art.id === currentArticle.id;
              return (
                <button
                  key={art.id}
                  onClick={() => setActiveArticle(art.id)}
                  className={`text-left p-3 rounded-xl border text-xs font-mono transition-all flex flex-col gap-1 ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-200 shadow-sm font-bold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="text-[10px] text-amber-400/80 font-normal">
                    {art.category}
                  </span>
                  <span className="line-clamp-2 leading-snug">{art.title}</span>
                </button>
              );
            })}
          </div>

          {/* Article Content Viewer */}
          <GlassCard className="md:col-span-3 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block mb-1">
                  {currentArticle.category}
                </span>
                <h3 className="text-lg font-bold text-slate-100">{currentArticle.title}</h3>
                <span className="text-xs text-slate-400 font-mono mt-1 block">
                  Referencia canónica: {currentArticle.citation}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {onNavigateTab && (
                  <>
                    <button
                      onClick={() => onNavigateTab('lab')}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 text-xs font-mono font-semibold transition"
                      title="Probar este algoritmo de forma visual e interactiva"
                    >
                      🔬 Abrir Laboratorio
                    </button>
                    <button
                      onClick={() => onNavigateTab('practice')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-mono transition"
                      title="Ir a resolver ejercicios de autoevaluación"
                    >
                      📝 Ir a Práctica
                    </button>
                  </>
                )}
                <CopyButton
                  text={currentArticle.content}
                  isCopied={isCopied(`art-${currentArticle.id}`)}
                  onCopy={() => copy(currentArticle.content, `art-${currentArticle.id}`)}
                  label="Copiar Texto"
                />
              </div>
            </div>

            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {currentArticle.content}
            </pre>
          </GlassCard>
        </div>
      )}

      {/* ── VIEW 3: APA 7 BIBLIOGRAPHY DIRECTORY ── */}
      {activeTab === 'bibliography' && (
        <div className="flex flex-col gap-4">
          <GlassCard className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Directorio Bibliográfico en Formato APA 7.ª Edición
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Fuentes primarias históricas, estándares internacionales (NIST, IETF RFC, BSI) y textos base del curso
              </p>
            </div>
            <Badge variant="amber" size="md">
              {APA_REFERENCES.length} Referencias Verificadas
            </Badge>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {APA_REFERENCES.map(ref => {
              const isCopiedRef = isCopied(`ref-${ref.id}`);
              return (
                <GlassCard key={ref.id} hoverEffect className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="amber" size="sm">
                      {ref.category}
                    </Badge>
                    <CopyButton
                      text=""
                      isCopied={isCopiedRef}
                      onCopy={() => handleCopyCitation(ref)}
                      label="Cita APA"
                    />
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-100 leading-snug">{ref.topic}</h4>
                    <p className="text-xs text-slate-300 font-mono mt-2 p-2.5 bg-slate-950 rounded-lg border border-slate-800 leading-relaxed">
                      {ref.author} ({ref.year}). <em>{ref.title}</em>. {ref.source}.
                    </p>
                  </div>

                  <p className="text-xs text-slate-400 font-sans leading-relaxed">{ref.notes}</p>

                  <div className="mt-auto pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs font-mono">
                    <span className="text-[10px] text-amber-400 font-bold">
                      Cita textual: {ref.inTextCitation}
                    </span>
                    <a
                      href={ref.doiOrUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 transition"
                    >
                      <span>Abrir Fuente</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default EncyclopediaTab;
