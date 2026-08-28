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
    { id: 'lab', label: 'Laboratorio de Discos y Cifras', icon: Layers, badge: 'Interactivo' },
    { id: 'practice', label: 'Estudio de Ejercicios', icon: GraduationCap, badge: 'Autoevaluación' },
    { id: 'cryptoanalysis', label: 'Criptoanálisis y Frecuencias', icon: BarChart3, badge: 'Herramientas' },
    { id: 'encyclopedia', label: 'Enciclopedia Teórica', icon: BookOpen, badge: 'Referencia' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        {/* Top bar with Logo & Global Alphabet Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-b border-slate-800/40">
          {/* Logo & Title */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
                <Shield className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-100 tracking-tight">
                  Criptografía Interactiva
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  v2.0 Pro
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Plataforma Universitaria de Criptosistemas Clásicos y Discos Cifradores
              </p>
            </div>
          </div>

          {/* Global Alphabet Mode Selector */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl shadow-inner">
            <span className="text-[11px] font-mono text-slate-400 pl-2 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
              Alfabeto:
            </span>
            {(['es27', 'en26', 'alberti24'] as AlphabetMode[]).map(mKey => {
              const cfg = ALPHABETS[mKey];
              const isSelected = alphabetMode === mKey;

              return (
                <button
                  key={mKey}
                  onClick={() => onAlphabetModeChange(mKey)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-all ${
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

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto py-2.5">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id as MainTabType)}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-xl font-mono text-xs whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-bold shadow-sm'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-900 text-slate-500'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
