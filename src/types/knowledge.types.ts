// Knowledge Base, Encyclopedia, and Decision Matrix Types

export type QACategory =
  | 'all'
  | 'fundamentos'
  | 'esteganografia'
  | 'cifrado_moderno'
  | 'criptoanalisis';

export interface QAItem {
  id: string;
  category: 'fundamentos' | 'esteganografia' | 'cifrado_moderno' | 'criptoanalisis';
  categoryLabel: string;
  question: string;
  shortSummary: string;
  detailedContent: string[];
  keyTakeaways: string[];
  tags: string[];
  apaCitation?: string;
  badgeColor: string;
}

export interface EncyclopediaArticle {
  id: string;
  title: string;
  category: string;
  citation: string;
  content: string;
}

export interface DecisionSecurityProperty {
  id: string;
  name: string;
  description: string;
  standardReference: string;
  classicalWeakness: string;
  modernSolution: string;
}

export interface AlgorithmComparisonRow {
  algorithm: string;
  type: string;
  keySpace: string;
  knownAttacks: string;
  nistStatus: 'OBSOLETO' | 'HISTORICO' | 'LEGADO' | 'ESTANDAR_ACTIVO' | 'POST_CUANTICO';
  modernEquivalent: string;
}
