import { AlphabetMode } from '../../crypto/alphabets';
import { MainTabType } from '../../types';
import { AlbertiDisk } from '../visualizers/AlbertiDisk';
import { CaesarWheel } from '../visualizers/CaesarWheel';
import { VigenereTabula } from '../visualizers/VigenereTabula';
import { PlayfairGrid } from '../visualizers/PlayfairGrid';
import { PolybiusGrid } from '../visualizers/PolybiusGrid';
import { HillMatrixTool } from '../visualizers/HillMatrixTool';
import { ScytaleColumnar } from '../visualizers/ScytaleColumnar';
import { BaseConverterTool } from '../visualizers/BaseConverterTool';
import { BlockCipherVisualizer } from '../visualizers/BlockCipherVisualizer';
import { HashIntegrityLab } from '../visualizers/HashIntegrityLab';
import { DigitalSignatureSimulator } from '../visualizers/DigitalSignatureSimulator';
import { TlsPkiExplorer } from '../visualizers/TlsPkiExplorer';
import {
  RotateCw,
  Sliders,
  Grid,
  LayoutGrid,
  Calculator,
  Columns,
  Grid3X3,
  Binary,
  ShieldCheck,
  Hash,
  FileSignature,
  Globe,
  Filter,
} from 'lucide-react';

interface InteractiveLabTabProps {
  mode: AlphabetMode;
  onModeChange: (newMode: AlphabetMode) => void;
  onNavigateTab?: (tab: MainTabType) => void;
}

type CipherToolId =
  | 'alberti'
  | 'cesar'
  | 'polybius'
  | 'vigenere'
  | 'playfair'
  | 'hill'
  | 'transposicion'
  | 'bases'
  | 'bloques'
  | 'hashes'
  | 'firma'
  | 'tls';

export const InteractiveLabTab: React.FC<InteractiveLabTabProps> = ({ mode, onModeChange, onNavigateTab }) => {
  const [activeCipher, setActiveCipher] = useState<CipherToolId>('alberti');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'clasica' | 'moderna'>('all');

  const navItems = [
    // Classical Ciphers (S06 - S10)
    { id: 'alberti', label: 'Disco de Alberti', category: 'clasica', icon: RotateCw, color: 'text-amber-400', badge: 'Polialfabético' },
    { id: 'cesar', label: 'César y Afín', category: 'clasica', icon: Sliders, color: 'text-sky-400', badge: 'Monoalfabético' },
    { id: 'polybius', label: 'Tabla de Polibio', category: 'clasica', icon: Grid3X3, color: 'text-amber-300', badge: 'Fraccionario 5×5' },
    { id: 'vigenere', label: 'Tabula Vigenère', category: 'clasica', icon: Grid, color: 'text-cyan-400', badge: 'Polialfabético' },
    { id: 'playfair', label: 'Playfair 5×5', category: 'clasica', icon: LayoutGrid, color: 'text-violet-400', badge: 'Digrámico' },
    { id: 'hill', label: 'Cifrador de Hill', category: 'clasica', icon: Calculator, color: 'text-emerald-400', badge: 'Matricial' },
    { id: 'transposicion', label: 'Transposición', category: 'clasica', icon: Columns, color: 'text-rose-400', badge: 'Geométrico' },

    // Modern Cryptography (S11 - S15)
    { id: 'bases', label: 'Bases & Bitwise', category: 'moderna', icon: Binary, color: 'text-sky-400', badge: 'S11 · Bases' },
    { id: 'bloques', label: 'AES & DES Bloques', category: 'moderna', icon: ShieldCheck, color: 'text-emerald-400', badge: 'S12 · Simétrico' },
    { id: 'hashes', label: 'Hashes & Avalancha', category: 'moderna', icon: Hash, color: 'text-amber-400', badge: 'S13 · Integridad' },
    { id: 'firma', label: 'Firma Digital RSA', category: 'moderna', icon: FileSignature, color: 'text-purple-400', badge: 'S14 · Autenticación' },
    { id: 'tls', label: 'PKI & TLS 1.3', category: 'moderna', icon: Globe, color: 'text-cyan-400', badge: 'S15 · Protocolos' },
  ];

  const filteredItems = navItems.filter(
    item => categoryFilter === 'all' || item.category === categoryFilter
  );

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      {/* Category Filter & Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 max-w-7xl mx-auto w-full px-2 lg:px-4">
        {/* Category Selector Tabs */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 self-start">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              categoryFilter === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Todos ({navItems.length})
          </button>
          <button
            onClick={() => setCategoryFilter('clasica')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              categoryFilter === 'clasica'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Clásicos (S06-S10)
          </button>
          <button
            onClick={() => setCategoryFilter('moderna')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              categoryFilter === 'moderna'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Modernos (S11-S15)
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tool Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-7xl mx-auto w-full px-2 lg:px-4 scrollbar-none">
        {filteredItems.map(item => {
          const Icon = item.icon;
          const isActive = activeCipher === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveCipher(item.id as CipherToolId)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono text-xs whitespace-nowrap transition-all border flex-shrink-0 ${
                isActive
                  ? 'bg-slate-900 border-amber-500/60 text-slate-100 shadow-lg shadow-amber-500/10 font-bold'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className={`w-4 h-4 ${item.color}`} />
              <span>{item.label}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-normal">
                {item.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Visualizer Render */}
      <div className="w-full">
        {activeCipher === 'alberti' && <AlbertiDisk mode={mode} onModeChange={onModeChange} />}
        {activeCipher === 'cesar' && <CaesarWheel mode={mode} />}
        {activeCipher === 'polybius' && <PolybiusGrid />}
        {activeCipher === 'vigenere' && <VigenereTabula mode={mode} />}
        {activeCipher === 'playfair' && <PlayfairGrid onNavigateTab={onNavigateTab} />}
        {activeCipher === 'hill' && <HillMatrixTool mode={mode} />}
        {activeCipher === 'transposicion' && <ScytaleColumnar mode={mode} />}

        {/* Modern Crypto Visualizers */}
        {activeCipher === 'bases' && <BaseConverterTool />}
        {activeCipher === 'bloques' && <BlockCipherVisualizer />}
        {activeCipher === 'hashes' && <HashIntegrityLab />}
        {activeCipher === 'firma' && <DigitalSignatureSimulator />}
        {activeCipher === 'tls' && <TlsPkiExplorer />}
      </div>
    </div>
  );
};
