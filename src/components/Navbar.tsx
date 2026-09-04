import React from 'react';
import { AlphabetMode, ALPHABETS } from '../crypto/alphabets';
import { Shield, Sparkles, BookOpen, GraduationCap, BarChart3, SlidersHorizontal, Layers } from 'lucide-react';

export type MainTabType = 'lab' | 'practice' | 'cryptoanalysis' | 'encyclopedia';

interface NavbarProps {
  activeTab: MainTabType;
  onTabChange: (tab: MainTabType) => void;
  alphabetMode: AlphabetMode;
  onAlphabetModeChange: (mode: AlphabetMode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  alphabetMode,
  onAlphabetModeChange,
}) => {
  const tabs = [
    { id: 'lab', label: 'Laboratorio de Discos y Cifras', shortLabel: 'Laboratorio', icon: Layers, badge: 'Interactivo' },
    { id: 'practice', label: 'Estudio de Ejercicios', shortLabel: 'Ejercicios', icon: GraduationCap, badge: 'Autoevaluación' },
    { id: 'cryptoanalysis', label: 'Criptoanálisis y Frecuencias', shortLabel: 'Criptoanálisis', icon: BarChart3, badge: 'Herramientas' },
    { id: 'encyclopedia', label: 'Enciclopedia Teórica', shortLabel: 'Enciclopedia', icon: BookOpen, badge: 'Referencia' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Top bar with Logo & Global Alphabet Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 py-2.5 sm:py-3 border-b border-slate-800/40">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 p-0.5 shadow-lg shadow-amber-500/20 flex-shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-slate-100 tracking-tight truncate">
                  Criptografía Interactiva
                </h1>
                <span className="text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30 flex-shrink-0">
                  v2.0 Pro
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 font-mono truncate">
                Plataforma de Criptosistemas Clásicos y Discos Cifradores
              </p>
            </div>
          </div>

          {/* Global Alphabet Mode Selector */}
          <div className="flex items-center justify-between sm:justify-end gap-1.5 bg-slate-900/90 border border-slate-800 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl shadow-inner overflow-x-auto">
            <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 pl-1.5 sm:pl-2 flex items-center gap-1 flex-shrink-0">
              <SlidersHorizontal className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
              <span className="hidden xs:inline">Alfabeto:</span>
            </span>
            <div className="flex items-center gap-1">
              {(['es27', 'en26', 'alberti24'] as AlphabetMode[]).map(mKey => {
                const cfg = ALPHABETS[mKey];
                const isSelected = alphabetMode === mKey;

                return (
                  <button
                    key={mKey}
                    onClick={() => onAlphabetModeChange(mKey)}
                    className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl font-mono text-[11px] sm:text-xs whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                    title={cfg.description}
                  >
                    {cfg.shortName}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-2 scrollbar-none">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id as MainTabType)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-mono text-xs whitespace-nowrap transition-all border flex-shrink-0 ${
                  isActive
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-bold shadow-sm'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <span className="hidden md:inline">{tab.label}</span>
                <span className="inline md:hidden">{tab.shortLabel}</span>
                <span
                  className={`text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-900 text-slate-500'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
