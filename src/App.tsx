import React, { useState } from 'react';
import { AlphabetMode } from './crypto/alphabets';
import { Navbar, MainTabType } from './components/Navbar';
import { InteractiveLabTab } from './components/tabs/InteractiveLabTab';
import { PracticeQuizTab } from './components/tabs/PracticeQuizTab';
import { CryptanalysisTab } from './components/tabs/CryptanalysisTab';
import { DecisionMatrixTab } from './components/tabs/DecisionMatrixTab';
import { EncyclopediaTab } from './components/tabs/EncyclopediaTab';

export default function App() {
  const [activeTab, setActiveTab] = useState<MainTabType>('lab');
  const [alphabetMode, setAlphabetMode] = useState<AlphabetMode>('es27');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        alphabetMode={alphabetMode}
        onAlphabetModeChange={setAlphabetMode}
      />

      {/* Main Tab Views */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 lg:p-6">
        {activeTab === 'lab' && (
          <InteractiveLabTab mode={alphabetMode} onModeChange={setAlphabetMode} onNavigateTab={setActiveTab} />
        )}
        {activeTab === 'practice' && (
          <PracticeQuizTab mode={alphabetMode} onNavigateTab={setActiveTab} />
        )}
        {activeTab === 'cryptoanalysis' && (
          <CryptanalysisTab mode={alphabetMode} />
        )}
        {activeTab === 'decision' && (
          <DecisionMatrixTab />
        )}
        {activeTab === 'encyclopedia' && (
          <EncyclopediaTab onNavigateTab={setActiveTab} />
        )}
      </main>

      {/* Modern Footer */}
      <footer className="mt-auto py-6 border-t border-slate-900 bg-slate-950/80 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-3">
          <span>
            © 2026 Criptografía Interactiva · Desarrollado por{' '}
            <a
              href="https://github.com/luzylay"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 transition-colors"
            >
              Lady Luz Loayza Rodriguez (@luzylay)
            </a>
          </span>
          <span className="text-slate-600">Polibio · Alberti · César · Vigenère · Playfair · Hill · Escítala</span>
        </div>
      </footer>
    </div>
  );
}
