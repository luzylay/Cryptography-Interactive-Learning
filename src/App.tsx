import React, { useState } from 'react';
import { AlphabetMode } from './crypto/alphabets';
import { Navbar, MainTabType } from './components/Navbar';
import { InteractiveLabTab } from './components/tabs/InteractiveLabTab';
import { PracticeQuizTab } from './components/tabs/PracticeQuizTab';
import { CryptanalysisTab } from './components/tabs/CryptanalysisTab';
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
          <InteractiveLabTab mode={alphabetMode} onModeChange={setAlphabetMode} />
        )}
        {activeTab === 'practice' && (
          <PracticeQuizTab mode={alphabetMode} />
        )}
        {activeTab === 'cryptoanalysis' && (
          <CryptanalysisTab mode={alphabetMode} />
        )}
        {activeTab === 'encyclopedia' && (
          <EncyclopediaTab />
        )}
      </main>

      {/* Modern Footer */}
      <footer className="mt-auto py-6 border-t border-slate-900 bg-slate-950/80 text-center text-xs font-mono text-slate-600">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-3">
          <span>Criptografía Clásica e Interactiva · Universidad Tecnológica</span>
          <span>Leon Battista Alberti · César · Vigenère · Playfair · Hill · Escítala</span>
        </div>
      </footer>
    </div>
  );
}
