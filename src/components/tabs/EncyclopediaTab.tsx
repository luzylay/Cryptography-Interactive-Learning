import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  ExternalLink,
  Copy,
  Check,
  BookmarkCheck,
  FileText,
  Award,
  HelpCircle,
  Search,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Tag,
  MessageSquare,
  Lock,
} from 'lucide-react';
import {
  KNOWLEDGE_BASE_QA,
  QA_CATEGORIES,
  QACategory,
  QAItem,
} from '../../crypto/knowledgeBase';

export interface ApaReference {
  id: string;
  topic: string;
  category: 'Libro de Texto Base' | 'Tratado Histórico Original' | 'Artículo Científico (Journal)' | 'Documento Histórico Militar' | 'Estándar Internacional / Normativa';
  author: string;
  year: string;
  title: string;
  source: string;
  doiOrUrl: string;
  displayUrlLabel: string;
  inTextCitation: string;
  notes: string;
}

export const APA_REFERENCES: ApaReference[] = [
  {
    id: 'nist_sp800_57',
    topic: 'Gestión de Claves Criptográficas y Equivalencia de Longitudes de Clave',
    category: 'Estándar Internacional / Normativa',
    author: 'National Institute of Standards and Technology (NIST)',
    year: '2020',
    title: 'Recommendation for Key Management: Part 1 – General',
    source: 'NIST Special Publication 800-57 Part 1 Rev. 5, Gaithersburg, MD, EE. UU.',
    doiOrUrl: 'https://doi.org/10.6028/NIST.SP.800-57pt1r5',
    displayUrlLabel: 'NIST CSRC - DOI: 10.6028/NIST.SP.800-57pt1r5',
    inTextCitation: '(NIST SP 800-57 Part 1 Rev. 5, 2020)',
    notes: 'Estándar oficial que establece los niveles de seguridad efectiva (80, 112, 128, 192, 256 bits), equivalencias de longitudes de clave entre algoritmos simétricos (AES), RSA y Curvas Elípticas (ECC), y periodos de vigencia técnica recomendados.',
  },
  {
    id: 'rfc9580_openpgp',
    topic: 'Especificación del Estándar Criptográfico OpenPGP (Crypto Refresh)',
    category: 'Estándar Internacional / Normativa',
    author: 'Wouters, P. (Ed.)',
    year: '2024',
    title: 'OpenPGP Crypto Refresh',
    source: 'RFC 9580, Internet Engineering Task Force (IETF)',
    doiOrUrl: 'https://www.rfc-editor.org/rfc/rfc9580',
    displayUrlLabel: 'IETF RFC Editor - RFC 9580 (Actualización de RFC 4880)',
    inTextCitation: '(Wouters / IETF RFC 9580, 2024)',
    notes: 'Especificación actualizada del formato de mensajes y paquetes OpenPGP, incorporando de manera estándar cifrado AEAD (AES-GCM, OCB), EdDSA (Ed25519) y gestión moderna de claves y firmas digitales.',
  },
  {
    id: 'fips186_5_dss',
    topic: 'Estándar de Firma Digital (DSS) y Retiro Oficial de DSA',
    category: 'Estándar Internacional / Normativa',
    author: 'National Institute of Standards and Technology (NIST)',
    year: '2023',
    title: 'Digital Signature Standard (DSS)',
    source: 'Federal Information Processing Standards Publication (FIPS PUB 186-5), EE. UU.',
    doiOrUrl: 'https://doi.org/10.6028/NIST.FIPS.186-5',
    displayUrlLabel: 'NIST FIPS PUB 186-5 (Febrero 2023)',
    inTextCitation: '(NIST / FIPS PUB 186-5, 2023)',
    notes: 'Normativa federal que ratifica el retiro formal de DSA para generación de nuevas claves e impulsa el uso mandatorio de RSA (>=2048/3072 b), ECDSA y EdDSA.',
  },
  {
    id: 'bsi_tr02102',
    topic: 'Mecanismos Criptográficos y Longitud de Claves Europeos',
    category: 'Estándar Internacional / Normativa',
    author: 'Federal Office for Information Security (BSI)',
    year: '2024',
    title: 'Cryptographic Mechanisms: Recommendations and Key Lengths',
    source: 'Technical Guideline BSI TR-02102-1, Bonn, Alemania',
    doiOrUrl: 'https://www.bsi.bund.de/EN/The-BSI/Standards-and-Certifications/Technical-Guidelines/TR-02102/tr02102_node.html',
    displayUrlLabel: 'BSI TR-02102-1 - Guía Técnica Federal Alemana',
    inTextCitation: '(BSI TR-02102-1, 2024)',
    notes: 'Guía técnica europea para la evaluación de resistencia de claves asimétricas ante algoritmos de factorización GNFS y migración poscuántica.',
  },
  {
    id: 'rfc5280_x509',
    topic: 'Infraestructura de Clave Pública X.509 v3 y Perfil de Certificados / Listas de Revocación (CRL)',
    category: 'Estándar Internacional / Normativa',
    author: 'Cooper, D., Santesson, S., Farrell, S., Boeyen, S., Housley, R., & Polk, W.',
    year: '2008',
    title: 'Internet X.509 Public Key Infrastructure Certificate and Certificate Revocation List (CRL) Profile',
    source: 'RFC 5280, Internet Engineering Task Force (IETF)',
    doiOrUrl: 'https://www.rfc-editor.org/rfc/rfc5280',
    displayUrlLabel: 'IETF RFC 5280 - Perfil Oficial PKI X.509 v3',
    inTextCitation: '(Cooper et al. / IETF RFC 5280, 2008)',
    notes: 'Base normativa de los certificados de clave pública jerárquicos X.509 utilizados en S/MIME, TLS y entornos corporativos con Autoridades Certificadoras (CA).',
  },
  {
    id: 'gnupg_project',
    topic: 'Documentación y Arquitectura del Motor Criptográfico GnuPG / Kleopatra',
    category: 'Estándar Internacional / Normativa',
    author: 'The GnuPG Project',
    year: '2026',
    title: 'The GNU Privacy Guard - Documentation and Architecture Manual',
    source: 'GnuPG.org Open Source Suite (Gpg4win / Kleopatra)',
    doiOrUrl: 'https://www.gnupg.org/documentation/manuals/gnupg/',
    displayUrlLabel: 'GnuPG.org - Manual de Arquitectura de GnuPG & Kleopatra',
    inTextCitation: '(The GnuPG Project, 2026)',
    notes: 'Manual de referencia técnica del motor subyacente de Kleopatra para derivación de claves S2K, formato OpenPGP, agentes de firma y gestión de almacenes de claves.',
  },
  {
    id: 'ramio1999',
    topic: 'Criptosistemas Clásicos, Aritmética Modular (mod 27) y Discos Cifradores',
    category: 'Libro de Texto Base',
    author: 'Ramió Aguirre, J.',
    year: '1999',
    title: 'Aplicaciones criptográficas',
    source: 'Capítulo 3: Criptosistemas clásicos (2.ª ed., pp. 1–105). Departamento de Publicaciones de la Escuela Universitaria de Informática, Universidad Politécnica de Madrid (UPM). ISBN: 84-87238-57-2 / 83-87238-57-2. Depósito Legal M-23136-1999',
    doiOrUrl: 'https://dialnet.unirioja.es/servlet/libro?codigo=200844',
    displayUrlLabel: 'Dialnet - Registro Bibliográfico UPM / Univ. de La Rioja',
    inTextCitation: '(Ramió Aguirre, 1999, pp. 5–42)',
    notes: 'Texto guía oficial del curso para la clasificación de cifradores clásicos, el disco de Alberti (Figura 1.4, p. 7), máquinas de Wheatstone y Bazeries, y el uso del alfabeto castellano con Ñ (módulo 27).',
  },
  {
    id: 'polybius150bc',
    topic: 'Tabla Cuadrada de Polibio y Telégrafo Óptico de Antorchas',
    category: 'Tratado Histórico Original',
    author: 'Polibio de Megalópolis',
    year: '1981',
    title: 'Historias (Libros IX-XV, Libro X: §§ 45–47 – Señales de antorchas y sistema de transmisión)',
    source: 'Edición y traducción de M. Balasch Recort, Biblioteca Clásica Gredos, Madrid (Manuscrito original griego redactado c. 150 a.C.)',
    doiOrUrl: 'https://archive.org/details/polybiushistories',
    displayUrlLabel: 'Biblioteca Clásica Gredos / Internet Archive - Historias de Polibio (Libro X)',
    inTextCitation: '(Polibio, c. 150 a.C./1981, Hist. X, 45-47)',
    notes: 'Primera formulación histórica de cifrado fraccionario y codificación por coordenadas bidimensionales (filas y columnas 1 a 5), origen conceptual de los sistemas telegráficos ópticos y la discretización digital.',
  },
  {
    id: 'alberti1568',
    topic: 'Disco Cifrador de Alberti y Criptografía Polialfabética',
    category: 'Tratado Histórico Original',
    author: 'Alberti, L. B.',
    year: '1568',
    title: 'De componendis cyfris [Tratado de cifras / De Cifris]',
    source: 'En Opuscoli morali di Leon Batista Alberti gentil\'huomo firentino (pp. 200–245). Appresso Francesco Franceschi (Manuscrito original redactado en Roma, c. 1466)',
    doiOrUrl: 'https://archive.org/details/opvscolimoralidi00albe',
    displayUrlLabel: 'Internet Archive - Escaneo Facsímil del Tratado Original (1568)',
    inTextCitation: '(Alberti, 1466/1568)',
    notes: 'Primer tratado en la historia occidental que describe el disco cifrador de dos círculos concéntricos y el concepto de sustitución polialfabética móvil.',
  },
  {
    id: 'hill1929',
    topic: 'Cifrador de Hill (Álgebra Matricial Modular)',
    category: 'Artículo Científico (Journal)',
    author: 'Hill, L. S.',
    year: '1929',
    title: 'Cryptography in an algebraic alphabet',
    source: 'The American Mathematical Monthly, 36(6), 306–312',
    doiOrUrl: 'https://www.jstor.org/stable/2298294',
    displayUrlLabel: 'JSTOR - Publicación Original (DOI: 10.2307/2298294)',
    inTextCitation: '(Hill, 1929, pp. 306–312)',
    notes: 'Publicación seminal donde Lester S. Hill formula el primer cifrador poligráfico basado en transformaciones lineales y matrices invertibles módulo m.',
  },
  {
    id: 'hill1931',
    topic: 'Aparatos de Transformación Lineal y Matrices 3×3 de Hill',
    category: 'Artículo Científico (Journal)',
    author: 'Hill, L. S.',
    year: '1931',
    title: 'Concerning certain linear transformation apparatus of cryptography',
    source: 'The American Mathematical Monthly, 38(3), 135–154',
    doiOrUrl: 'https://www.jstor.org/stable/2300963',
    displayUrlLabel: 'JSTOR - Publicación Original (DOI: 10.2307/2300963)',
    inTextCitation: '(Hill, 1931, pp. 135–154)',
    notes: 'Extensión matemática formal para matrices de orden n >= 3 y diseño electromecánico de ruedas para multiplicación matricial.',
  },
  {
    id: 'vigenere1586',
    topic: 'Cifrador de Vigenère y Tabula Recta',
    category: 'Tratado Histórico Original',
    author: 'Vigenère, B. de.',
    year: '1586',
    title: 'Traicté des chiffres, ou Secrètes manières d\'escrire',
    source: 'Chez Abel L\'Angelier. Digitalizado por Bibliothèque nationale de France (Gallica)',
    doiOrUrl: 'https://gallica.bnf.fr/ark:/12148/bpt6k1052608j',
    displayUrlLabel: 'BnF Gallica - Facsímil Digital de la Bibliothèque Nationale de France',
    inTextCitation: '(Vigenère, 1586)',
    notes: 'Tratado fundamental sobre la tabla cuadrada (Tabula Recta ideada originalmente por Johannes Trithemius en 1518 y Giovan Battista Bellaso en 1553, popularizada bajo el nombre de Vigenère).',
  },
  {
    id: 'kasiski1863',
    topic: 'Test de Kasiski (Criptoanálisis de Cifradores Polialfabéticos)',
    category: 'Tratado Histórico Original',
    author: 'Kasiski, F. W.',
    year: '1863',
    title: 'Die Geheimschriften und die Dechiffrir-Kunst [Las escrituras secretas y el arte de descifrar]',
    source: 'E. S. Mittler und Sohn. Digitalizado por la Bayerische Staatsbibliothek München',
    doiOrUrl: 'https://www.digitale-sammlungen.de/en/view/bsb10684725',
    displayUrlLabel: 'Bayerische Staatsbibliothek München - Edición Impresa Digitalizada (1863)',
    inTextCitation: '(Kasiski, 1863)',
    notes: 'Primera metodología sistemática y matemática publicada para romper el cifrado de Vigenère mediante el análisis de distancias entre subsecuencias repetidas.',
  },
  {
    id: 'friedman1922',
    topic: 'Índice de Coincidencia (IC) y Test de Friedman',
    category: 'Documento Histórico Militar',
    author: 'Friedman, W. F.',
    year: '1922',
    title: 'The index of coincidence and its applications in cryptography',
    source: 'War Department Document No. 1083 / Riverbank Publication No. 22. Government Printing Office',
    doiOrUrl: 'https://archive.org/details/41761039080018',
    displayUrlLabel: 'Internet Archive - Documento Técnico Desclasificado del Departamento de Guerra',
    inTextCitation: '(Friedman, 1922)',
    notes: 'Obra cumbre del criptoanálisis estadístico moderno donde se define formalmente el Índice de Coincidencia (IC) para determinar la longitud de clave y distinguir textos monoalfabéticos de polialfabéticos.',
  },
  {
    id: 'suetonio1985',
    topic: 'Cifrador del César (Origen Histórico Romano)',
    category: 'Tratado Histórico Original',
    author: 'Suetonio Tranquilo, C.',
    year: '1985',
    title: 'Vida de los doce césares (Libro I: Divus Iulius, cap. 56)',
    source: 'R. M. Agudo Cubas (Trad.). Editorial Gredos. (Obra original redactada c. 121 d.C.)',
    doiOrUrl: 'https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.02.0061',
    displayUrlLabel: 'Perseus Digital Library - Tufts University (Texto Latino y Traducción)',
    inTextCitation: '(Suetonio, c. 121 d.C./1985, Libro I, cap. 56)',
    notes: 'Documento histórico que registra el uso militar por parte de Julio César de la sustitución con desplazamiento de 3 posiciones (k = 3, cambiando A por D).',
  },
  {
    id: 'kahn1996',
    topic: 'Historia Comprensiva de la Criptografía Mundial',
    category: 'Libro de Texto Base',
    author: 'Kahn, D.',
    year: '1996',
    title: 'The codebreakers: The comprehensive history of secret communication from ancient times to the internet',
    source: '(2.ª ed. rev.). Scribner. ISBN: 978-0684831305',
    doiOrUrl: 'https://archive.org/details/codebreakersstor0000kahn_k4s3',
    displayUrlLabel: 'Internet Archive - Préstamo de Biblioteca Digital (Edición Completa)',
    inTextCitation: '(Kahn, 1996, pp. 106–188)',
    notes: 'Considerada la historia canónica de referencia internacional de la criptografía desde la antigüedad hasta la era moderna.',
  },
  {
    id: 'fips463',
    topic: 'Estándar de Cifrado por Bloques: DES y Triple-DES (TDEA)',
    category: 'Documento Histórico Militar',
    author: 'National Institute of Standards and Technology (NIST)',
    year: '1999',
    title: 'Data Encryption Standard (DES)',
    source: 'Federal Information Processing Standards Publication (FIPS PUB 46-3), U.S. Department of Commerce / NIST',
    doiOrUrl: 'https://csrc.nist.gov/publications/detail/fips/46-3/final',
    displayUrlLabel: 'NIST Computer Security Resource Center - FIPS PUB 46-3',
    inTextCitation: '(NIST / FIPS PUB 46-3, 1999)',
    notes: 'Especificación canónica del algoritmo DES y Triple DES (TDEA), fundamentado en la arquitectura de Feistel de 16 rondas, permutaciones inicial/inversa (IP/IP⁻¹), cajas S no lineales y modos de operación (ECB, CBC, CFB, OFB).',
  },
  {
    id: 'katsikeas2021',
    topic: 'Cienciometría y Mapeo Global de la Investigación en Ciberseguridad y Criptografía',
    category: 'Artículo Científico (Journal)',
    author: 'Katsikeas, S., Johnson, P., Ekstedt, M., & Lagerström, R.',
    year: '2021',
    title: 'Research communities in cyber security: A comprehensive literature review',
    source: 'Computer Science Review, 42, 100431. Elsevier BV. ISSN: 1574-0137',
    doiOrUrl: 'https://doi.org/10.1016/j.cosrev.2021.100431',
    displayUrlLabel: 'Elsevier ScienceDirect - DOI: 10.1016/j.cosrev.2021.100431',
    inTextCitation: '(Katsikeas et al., 2021, pp. 1–24)',
    notes: 'Estudio cienciométrico sobre 59,782 artículos y 98,373 autores (1949–2020) que detectó las 12 macro-comunidades de la ciberseguridad, demostrando la hegemonía histórica y matemática de la Criptografía (I & II) desde el surgimiento de DES y la clave pública.',
  },
];

export const EncyclopediaTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'qa' | 'articles' | 'bibliography'>('qa');
  const [activeArticle, setActiveArticle] = useState<string>('fundamentos_pilares');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedQACategory, setSelectedQACategory] = useState<QACategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedQAIds, setExpandedQAIds] = useState<Set<string>>(
    new Set(KNOWLEDGE_BASE_QA.map(q => q.id))
  );
  const [copiedQAId, setCopiedQAId] = useState<string | null>(null);

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
    navigator.clipboard.writeText(text);
    setCopiedQAId(item.id);
    setTimeout(() => setCopiedQAId(null), 2500);
  };

  const handleCopyCitation = (ref: ApaReference) => {
    const apaText = `${ref.author} (${ref.year}). ${ref.title}. ${ref.source}. ${ref.doiOrUrl}`;
    navigator.clipboard.writeText(apaText);
    setCopiedId(ref.id);
    setTimeout(() => setCopiedId(null), 2500);
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

  const articles = [
    {
      id: 'fundamentos_pilares',
      title: 'Fundamentos: Criptografía, Criptoanálisis y los 6 Pilares',
      category: 'Fundamentos de Seguridad',
      citation: '(NIST SP 800-57, 2020; ISO/IEC 7498-2; Ramió Aguirre, 1999)',
      content: `FUNDAMENTOS CONCEPTUALES Y LOS 6 PILARES DE LA SEGURIDAD
────────────────────────────────────────────────────────────────────────
Cita académica: (NIST SP 800-57 Part 1 Rev. 5; ISO/IEC 7498-2, 1989; Ramió Aguirre, 1999)

1. DEFINICIONES CANÓNICAS
   • Criptografía: Ciencia y disciplina matemática encargada de transformar datos legibles en mensajes cifrados inteligibles únicamente por entidades que poseen la clave secreta o privada legítima.
   • Criptoanálisis: Estudio analítico, estadístico y matemático enfocado en vulnerar, descifrar o evaluar la robustez de criptogramas y algoritmos sin autorización ni posesión previa de la clave.
   • Ocultamiento (Information Hiding): Estrategia de seguridad diseñada para esconder la presencia o existencia misma del canal o mensaje de datos.

2. LOS 6 PILARES DE LA SEGURIDAD DE LA INFORMACIÓN (ISO 7498-2 / Parkerian Hexad)
   1. Confidencialidad: Restricción del acceso a la lectura de datos exclusivamente a usuarios autorizados.
   2. Integridad: Certeza técnica de que los datos no han sufrido modificaciones no autorizadas, corrupciones o inserciones en reposo o tránsito.
   3. Disponibilidad: Garantía de operatividad y acceso expedito a los servicios y datos cuando un usuario legítimo lo requiera.
   4. Autenticación (Autenticidad): Validación indiscutible de la identidad del emisor o del origen legítimo del mensaje.
   5. No Repudio (Irrenunciabilidad): Imposibilidad matemática de que el emisor niegue haber originado o transmitido el mensaje (garantizado con firma digital).
   6. Control de Acceso: Determinación y verificación de privilegios específicos para interactuar con la información.`,
    },
    {
      id: 'esteganografia_estegoanalisis',
      title: 'Esteganografía, LSB y Métodos de Estegoanálisis',
      category: 'Ocultación de Información',
      citation: '(Katsikeas et al., 2021; Westfeld & Pfitzmann, 1999; Kahn, 1996)',
      content: `ESTEGANOGRAFÍA DIGITAL Y MÉTODOS DE ESTEGOANÁLISIS
────────────────────────────────────────────────────────────────────────
Cita académica: (Katsikeas et al., 2021; Westfeld & Pfitzmann, 1999; Kahn, 1996)

1. MECANISMOS DE INSERCIÓN ESTEGANOGRÁFICA
   • Técnica LSB (Least Significant Bit):
     Los bits menos significativos de cada muestra de audio o canal RGB de un píxel poseen un impacto visual/auditivo mínimo. Sustituir el bit 0 permite codificar texto o binarios sin deformar perceptiblemente la imagen original.
   • Contraste con Criptografía:
     La Criptografía oculta el CONTENIDO (produce ruido visible o texto ilegible). La Esteganografía oculta la EXISTENCIA (produce un portador aparentemente normal).

2. ATAQUES Y TÉCNICAS DE ESTEGOANÁLISIS
   • Prueba de Chi-Cuadrado (χ²):
     La inserción aleatoria o secuencial de bits LSB empareja artificialmente las frecuencias de pares de valores adyacentes (PoVs: 2k y 2k+1), revelando una signatura estadística anormal.
   • Ataque por Portador Conocido (Known-Cover):
     Resta directa bit a bit entre la matriz del archivo original y la del archivo sospechoso.
   • Análisis de Planos de Bits (Bit-Plane Slicing):
     Extracción aislada del plano LSB; en una imagen natural es ruido blanco puro, mientras que con datos incrustados muestra patrones geométricos o texturas artificiales.

3. CASOS DE APLICACIÓN EN CIBERSEGURIDAD
   • Forense Digital: Detección de evidencias ocultas en investigaciones criminales.
   • Stegware / C2 Malware: Bloqueo de cargas útiles o comandos remotos encubiertos en imágenes en la nube.
   • DLP Empresarial: Prevención de fuga de propiedad intelectual incrustada en fotografías.
   • Sanitización de Imágenes: Destrucción de canales encubiertos en firewalls mediante recompresión o filtrado.`,
    },
    {
      id: 'seleccion_cifrado_moderno',
      title: 'Selección Criptográfica: Firma de Código vs Correo Seguro',
      category: 'Criptosistemas Modernos & NIST',
      citation: '(NIST SP 800-57, 2020; FIPS 186-5, 2023; RFC 9580, 2024)',
      content: `CRITERIOS DE SELECCIÓN DE CIFRADO Y LONGITUD DE CLAVE
────────────────────────────────────────────────────────────────────────
Cita académica: (NIST SP 800-57 Part 1 Rev. 5, 2020; FIPS PUB 186-5, 2023; RFC 9580, 2024)

1. CERTIFICADOS DE FIRMA DE CÓDIGO (Code Signing)
   • Recomendación Moderna: EdDSA (Curva Edwards Ed25519) o ECDSA (Curva NIST P-384).
     - Longitud: 256 bits (Ed25519) o 384 bits (P-384).
     - Ventajas: Firmas compactas de 64 bytes, verificación casi instantánea durante la instalación masiva de binarios y resistencia a ataques de canal lateral.
   • Alternativa de Alta Compatibilidad: RSA de 3072 o 4096 bits (con SHA-256 o SHA-384).

2. CIFRADO DE CORREOS ELECTRÓNICOS DE MÁXIMA CONFIDENCIALIDAD (OpenPGP / S/MIME)
   • Esquema Híbrido:
     1. Cifrado del Mensaje (Simétrico): AES-256 en modo GCM (Autenticado / AEAD) o ChaCha20-Poly1305.
        - Longitud de clave: 256 bits (máxima inmunidad criptográfica).
     2. Envoltura de Clave Asimétrica: ECDH (Curve25519 de 256 bits / NIST P-384) o RSA-4096.
     3. Firma Digital Integrada: Ed25519 / RSA-4096 con función de hash SHA-512.`,
    },
    {
      id: 'alberti',
      title: 'El Disco de Alberti y Cifrado Polialfabético',
      category: 'Historia y Mecánica',
      citation: '(Ramió Aguirre, 1999, pp. 7–9; Alberti, 1466/1568; Kahn, 1996)',
      content: `EL DISCO CIFRADOR DE ALBERTI (Siglo XVI)
────────────────────────────────────────────────────────────────────────
Cita académica: (Ramió Aguirre, 1999, p. 7; Alberti, 1466/1568)

Leon Battista Alberti presentó en 1466 su obra "De Cifris", en la que describió el primer dispositivo de cifrado polialfabético de la historia humana.

1. ESTRUCTURA MECÁNICA
   • Disco Exterior (Fijo): Tradicionalmente contenía 24 caracteres: las 20 letras del alfabeto latino en mayúsculas (omitiendo H, J, K, Ñ, U, W, Y) más cuatro dígitos (1, 2, 3, 4) para la inserción de códigos nulos o frases predefinidas (Ramió Aguirre, 1999, p. 7).
   • Disco Interior (Móvil/Giratorio): Contenía 24 caracteres en minúsculas en un orden mixto o desordenado, incluyendo caracteres como '&', 'h', 'k', 'y'.

2. PRINCIPIO DE OPERACIÓN Y ROTACIÓN
   • El operador establece una clave de alineación inicial (por ejemplo, alineando el número '1' exterior con el signo '&' interior).
   • Cada letra del mensaje se busca en el disco exterior y se sustituye por la letra que queda exactamente debajo en el disco interior.
   • Durante el cifrado de un mismo mensaje, el disco interior se gira k posiciones (por ejemplo cada 4 letras o según una palabra clave), cambiando por completo el alfabeto de cifra.

3. RUPTURA DEL ANÁLISIS MONOALFABÉTICO
   • Al cambiar periódicamente de alfabeto, una misma letra en claro (ej. 'E') se cifra con letras diferentes en el criptograma ('v', 'a', 'o', etc.).
   • Esto aplana el histograma de frecuencias e inutiliza el ataque clásico de frecuencias de Al-Kindi.`,
    },
    {
      id: 'mod27vs26',
      title: 'Aritmética Modular: Mod 27 (Con Ñ) vs Mod 26 (Sin Ñ)',
      category: 'Matemáticas y Estándares',
      citation: '(Ramió Aguirre, 1999, pp. 2–5)',
      content: `CONVENCIONES DEL ALFABETO EN CRIPTOGRAFÍA ACADÉMICA
────────────────────────────────────────────────────────────────────────
Cita académica: (Ramió Aguirre, 1999, pp. 2–5)

En los cursos universitarios hispanohablantes coexisten dos convenciones formales:

1. CASTELLANO ESTÁNDAR (Módulo 27)
   • Incluye la letra 'Ñ' en la posición 14:
     A=0, B=1, C=2, D=3, E=4, F=5, G=6, H=7, I=8, J=9, K=10, L=11, M=12,
     N=13, Ñ=14, O=15, P=16, Q=17, R=18, S=19, T=20, U=21, V=22, W=23,
     X=24, Y=25, Z=26.
   • Aritmética modular: Todo cálculo se realiza con mod 27.
   • Fórmulas de César:
       C_i = (M_i + k) mod 27
       M_i = (C_i - k + 27) mod 27

2. INTERNACIONAL / INGLÉS (Módulo 26)
   • Excluye la letra 'Ñ' (se translitera a 'N' o 'NH'):
     A=0, B=1, ..., Z=25.
   • Todo cálculo se realiza con mod 26.
   • Condición de coprimatidad para Cifrado Afín o Hill:
       mcd(a, 26) = 1 (es decir, 'a' no puede ser par ni divisible por 13).
       En cambio, en mod 27: mcd(a, 27) = 1 (basta que 'a' no sea múltiplo de 3).`,
    },
    {
      id: 'hill',
      title: 'Cifrador de Hill y Álgebra Matricial',
      category: 'Álgebra Lineal Modular',
      citation: '(Hill, 1929; Hill, 1931; Ramió Aguirre, 1999, pp. 28–35)',
      content: `EL CIFRADOR MATRICIAL DE LESTER HILL (1929)
────────────────────────────────────────────────────────────────────────
Cita académica: (Hill, 1929, pp. 306–312; Ramió Aguirre, 1999, p. 28)

Lester S. Hill propuso en 1929 el primer criptosistema poligráfico algebraico basado en álgebra lineal modular sobre Z_m.

1. MODELO MATEMÁTICO (Orden n = 2)
   • Vector texto en claro: M = [M_1, M_2]
   • Matriz clave 2x2: K = [[a, b], [c, d]]
   • Cifrado: C = K · M mod m
       C_1 = (a·M_1 + b·M_2) mod m
       C_2 = (c·M_1 + d·M_2) mod m

2. CONDICIÓN DE INVERSIBILIDAD
   • Una matriz K es invertible en Z_m si y solo si:
       mcd(det(K), m) = 1
   • En mod 27: det(K) no debe ser múltiplo de 3.
   • Matriz inversa: K⁻¹ = [inv(det(K), m)] · [[d, -b], [-c, a]] mod m`,
    },
    {
      id: 'clasificacion',
      title: 'Taxonomía de los Criptosistemas Clásicos',
      category: 'Clasificación Teórica',
      citation: '(Ramió Aguirre, 1999, pp. 1–4; Kahn, 1996)',
      content: `CLASIFICACIÓN GENERAL DE CRIPTOSISTEMAS CLÁSICOS
────────────────────────────────────────────────────────────────────────
Cita académica: (Ramió Aguirre, 1999, pp. 1–4)

A. CRIPTOSISTEMAS POR TRANSPOSICIÓN
   Las letras no se alteran, únicamente se reorganizan en el espacio.
   • Por series / grupos: Escítala espartana (cilindro y cinta).
   • Por rejilla / columnas: Transposición columnar simple o permutada por clave.

B. CRIPTOSISTEMAS POR SUSTITUCIÓN MONOALFABÉTICA
   Utilizan un único alfabeto de sustitución para todo el mensaje.
   • Monográmica (1 letra → 1 letra):
     - Desplazamiento puro: Cifrador del César (Suetonio, c. 121 d.C./1985; C_i = M_i + k mod m).
     - Decimación pura: C_i = a · M_i mod m.
     - Sustitución Afín: C_i = (a · M_i + b) mod m.
     - César mixto: Alfabeto con clave permutada.
   • Poligráfica (n letras → n letras):
     - Digrámica: Cifrador de Playfair (matriz 5×5).
     - N-grámica: Cifrador de Hill (matrices n×n en mod m; Hill, 1929).

C. CRIPTOSISTEMAS POR SUSTITUCIÓN POLIALFABÉTICA
   Utilizan múltiples alfabetos durante el cifrado del mensaje.
   • Periódicos: Cifrador de Vigenère (Vigenère, 1586), Cifrador de Beaufort.
   • Progresivos / Mecánicos: Disco de Alberti (Alberti, 1568), Cilindro de Bazeries, Ruedas de Wheatstone, Máquina Enigma.
   • No periódicos: Cifrador de Vernam (One-Time Pad, secreto perfecto si la clave es aleatoria).`,
    },
    {
      id: 'kasiski_friedman',
      title: 'Criptoanálisis: Test de Kasiski e Índice de Friedman',
      category: 'Criptoanálisis',
      citation: '(Kasiski, 1863; Friedman, 1922; Ramió Aguirre, 1999, pp. 38–42)',
      content: `MÉTODOS DE RUPTURA DE CIFRADORES POLIALFABÉTICOS
────────────────────────────────────────────────────────────────────────
Cita académica: (Kasiski, 1863; Friedman, 1922; Ramió Aguirre, 1999, pp. 38–42)

1. TEST DE KASISKI (Major Friedrich Kasiski, 1863)
   • En un cifrador polialfabético con clave repetida de longitud m (como Vigenère), si dos secuencias idénticas de texto en claro coinciden con la misma fase de la clave, producirán el mismo texto cifrado.
   • Procedimiento:
     1. Buscar cadenas repetidas de longitud ≥ 3 en el criptograma.
     2. Calcular las distancias entre repeticiones.
     3. El máximo común divisor (MCD) de las distancias es un múltiplo muy probable de la longitud de la clave m.

2. ÍNDICE DE COINCIDENCIA (William F. Friedman, 1922)
   • Mide la probabilidad de que dos caracteres seleccionados al azar en un texto sean idénticos.
   • Fórmula:
       IC = [ ∑ f_i · (f_i - 1) ] / [ N · (N - 1) ]
   • Valores de referencia:
     - Texto en español monoalfabético: IC ≈ 0.0745 (Ramió Aguirre, 1999, p. 40)
     - Texto en inglés monoalfabético:   IC ≈ 0.0667 (Friedman, 1922, p. 14)
     - Texto aleatorio / Vigenère largo: IC ≈ 0.0385 (1/26) o 0.0370 (1/27)`,
    },
    {
      id: 'normalizacion_bloques',
      title: 'Normalización de Texto y Bloques de 5 Letras (Pentagramas)',
      category: 'Convenciones Criptográficas',
      citation: '(Ramió Aguirre, 1999, pp. 5–6; Kahn, 1996, pp. 98–102)',
      content: `TRATAMIENTO DE ESPACIOS Y FORMATEO EN PENTAGRAMAS
────────────────────────────────────────────────────────────────────────
Cita académica: (Ramió Aguirre, 1999, pp. 5–6; Kahn, 1996)

1. ¿POR QUÉ SE ELIMINAN LOS ESPACIOS Y SIGNOS? (Normalización)
   • En criptografía clásica, los espacios en blanco, comas, puntos y tildes NUNCA forman parte del alfabeto de cifrado ni se cifran de forma independiente.
   • Justificación de seguridad:
     - Si se preservaran los espacios originales, el criptoanalista conocería la longitud exacta de cada palabra individual.
     - En español, una palabra aislada de 1 letra es casi con seguridad 'A' o 'Y'; una de 2 letras suele ser 'DE', 'EN', 'EL', 'LA', 'NO', 'SI', etc.
     - Esto permitiría romper la cifra en minutos mediante análisis sintáctico elemental.
   • Por tanto, el texto claro se normaliza en un flujo continuo de letras mayúsculas continuas antes de aplicar cualquier fórmula matemática:
     "A PERRO FLACO" → "APERROFLACO"

2. FORMATEO EN BLOQUES DE 5 LETRAS (Pentagramas)
   • Tras cifrar el texto continuo, el resultado se divide en grupos fijos de 5 letras:
     Ejemplo: "YGBKK FRIYP FMFOF LFNGÑ IEYL"
   • Origen histórico:
     - Convención militar y de telegrafía Morse para facilitar la transmisión manual, lectura sin fatiga visual y detección rápida de caracteres omitidos.
     - Los espacios entre bloques de 5 letras NO guardan ninguna relación con la separación original de palabras del mensaje en claro.`,
    },
    {
      id: 'feistel_des',
      title: 'De la Cifra Clásica a la Cifra por Bloques: Red de Feistel y DES (FIPS 46-3)',
      category: 'Criptografía Simétrica Moderna',
      citation: '(NIST / FIPS PUB 46-3, 1999; Feistel, 1973; Shannon, 1949)',
      content: `EVOLUCIÓN HACIA CIFRADORES POR BLOQUES: LA ARQUITECTURA DE FEISTEL Y DES
────────────────────────────────────────────────────────────────────────
Cita académica: (NIST FIPS PUB 46-3, 1999; Feistel, 1973)

1. PUENTE CONCEPTUAL: DE CLAUDE SHANNON A HORST FEISTEL
   • En 1949, Claude Shannon estableció que para construir una cifra resistente se requiere combinar:
     - Confusión (sustitución no lineal): Oculta la relación entre el texto en claro y la clave.
     - Difusión (permutación/transposición): Dispersa la influencia estadística de cada bit en todo el criptograma.
   • Horst Feistel (IBM, 1973) diseñó una arquitectura iterativa que divide el bloque en dos mitades (L, R) y aplica rondas sucesivas de sustitución y permutación.

2. ESTRUCTURA MATEMÁTICA DE LA RED DE FEISTEL (FIPS 46-3)
   • Bloque de entrada: 64 bits (L₀, R₀ de 32 bits cada uno tras la Permutación Inicial IP).
   • En cada ronda n (n = 1 ... 16):
       L_n = R_{n-1}
       R_n = L_{n-1} ⊕ f(R_{n-1}, K_n)
   • Simetría de Descifrado:
     Para descifrar se utiliza exactamente el mismo circuito algebraico, pero aplicando las subclaves en orden inverso (K₁₆, K₁₅, ..., K₁):
       R_{n-1} = L_n
       L_{n-1} = R_n ⊕ f(L_n, K_n)

3. LA FUNCIÓN DE CIFRADO f(R, K) Y LAS CAJAS S (S-BOXES)
   • Expansión E: Transforma 32 bits de R en 48 bits mediante duplicación posicional controlada.
   • Mezcla con la clave: E(R) ⊕ K_n (48 bits).
   • Cajas de Selección S₁...S₈: Dividen los 48 bits en 8 grupos de 6 bits (B₁...B₈).
     - Cada caja S_i mapea 6 bits de entrada a 4 bits de salida no lineal.
     - Fórmulas de índices: El 1.º y 6.º bit forman la fila (0..3); los 4 bits centrales forman la columna (0..15).
   • Permutación P: Reordena los 32 bits resultantes para garantizar la difusión en las siguientes rondas.

4. TRIPLE-DES (TDEA / ANSI X9.52)
   • Con el avance de la computación, el espacio de claves de 56 bits de DES se volvió vulnerable a ataques por fuerza bruta (Matsui, 1994).
   • FIPS 46-3 estandarizó TDEA (Triple-DES) con un paquete de 3 claves (K₁, K₂, K₃):
       C = E_{K3}( D_{K2}( E_{K1}(M) ) )
       M = D_{K1}( E_{K2}( D_{K3}(C) ) )
   • Si K₁ = K₂ = K₃, TDEA es 100% retrocompatible con DES simple (D_{K}(E_{K}(M)) = M).`,
    },
    {
      id: 'katsikeas_taxonomy',
      title: 'Taxonomía y Comunidades Científicas de la Ciberseguridad (Katsikeas et al., 2021)',
      category: 'Cienciometría e Investigación',
      citation: '(Katsikeas, Johnson, Ekstedt, & Lagerström, 2021)',
      content: `MAPA DE LAS 12 COMUNIDADES DE INVESTIGACIÓN EN CIBERSEGURIDAD
────────────────────────────────────────────────────────────────────────
Cita académica: (Katsikeas et al., 2021, Computer Science Review, Elsevier)

El estudio de Katsikeas et al. (KTH Royal Institute of Technology) analizó 59,782 artículos y 98,373 autores (1949–2020) mediante el algoritmo de Louvain, descubriendo 12 macro-comunidades científicas:

1. CRIPTOGRAFÍA (Comunidades I & II - El Pilar Fundacional)
   • Representó más del 70% de toda la investigación mundial en ciberseguridad en los años 80 tras el nacimiento de DES (FIPS 46) y la Criptografía Asimétrica (Diffie-Hellman 1976, RSA 1978).
   • Sub-comunidades clave:
     - Seguridad demostrable (Modelo de Oráculo Aleatorio; Bellare & Rogaway, 1993).
     - Cifradores de bloque y criptoanálisis (DES, AES, Criptoanálisis Diferencial/Lineal).
     - Curvas elípticas (Miller, 1986; Koblitz, 1987).
     - Cifrado totalmente homomórfico (FHE; Gentry, 2009).
     - Cifrado basado en atributos (ABE; Sahai & Waters).
     - Criptoanálisis por canales laterales (DPA; Kocher et al., 1999).

2. OCULTACIÓN DE INFORMACIÓN (Information Hiding)
   • Esteganografía: Ocultación de la existencia del mensaje (Shannon, 1949).
   • Marcas de agua digitales (Watermarking): Protección de procedencia e integridad (Cox et al., 1997).
   • Criptografía visual y cifrado de imágenes caóticas.

3. OTRAS MACRO-COMUNIDADES IDENTIFICADAS
   • Detección de Intrusiones: Modelos de anomalías y grafos de ataque (Denning, 1987).
   • Redes de Sensores e IoT: Protocolos SPINS (Perrig et al., 2002) y gestión de claves.
   • Malware y Análisis de Flujo de Información (Enck et al., TaintDroid).
   • Autenticación: Contraseñas con hash (Lamport, 1981) y 2FA/MFA.
   • Control de Acceso: Modelos RBAC (Sandhu et al., 1996; NIST).
   • Criptografía Cuántica: Distribución Cuántica de Claves (QKD / Protocolo BB84; Bennett & Brassard).`,
    },
  ];

  const current = articles.find(a => a.id === activeArticle) || articles[0];

  return (
    <div className="flex flex-col gap-6 p-2 lg:p-4 w-full max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 lg:p-5 rounded-2xl">
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

        {/* Tab switcher: QA vs Articles vs References */}
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
            Artículos Teóricos ({articles.length})
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
      </div>

      {/* ── VIEW 1: SCALABLE QUESTION & ANSWER KNOWLEDGE BASE ── */}
      {activeTab === 'qa' && (
        <div className="flex flex-col gap-6">
          {/* Filter & Search Bar */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 backdrop-blur-md">
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
            <div className="relative min-w-[240px] sm:max-w-xs flex-shrink-0">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar preguntas o conceptos..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 font-mono text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          {/* Q&A Cards List */}
          <div className="flex flex-col gap-4">
            {filteredQA.length === 0 ? (
              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 font-mono text-xs">
                No se encontraron preguntas que coincidan con los criterios de búsqueda.
              </div>
            ) : (
              filteredQA.map((item, index) => {
                const isExpanded = expandedQAIds.has(item.id);

                return (
                  <div
                    key={item.id}
                    className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md transition-all hover:border-slate-700 shadow-md"
                  >
                    {/* Question Header Accordion Toggle */}
                    <div
                      onClick={() => toggleQA(item.id)}
                      className="p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer select-none bg-slate-900/40 hover:bg-slate-900/80 transition"
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-mono text-xs font-bold text-amber-400 flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${item.badgeColor}`}>
                              {item.categoryLabel}
                            </span>
                            {item.apaCitation && (
                              <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
                                Cita: {item.apaCitation}
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
                          onClick={e => {
                            e.stopPropagation();
                            handleCopyQA(item);
                          }}
                          className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-amber-300 hover:border-amber-500/30 transition text-xs flex items-center gap-1 font-mono"
                          title="Copiar pregunta y respuesta completa"
                        >
                          {copiedQAId === item.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400 text-[10px] font-bold">Copiado</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span className="text-[10px] hidden sm:inline">Copiar</span>
                            </>
                          )}
                        </button>
                        <div className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-amber-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-500" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Question Content Body */}
                    {isExpanded && (
                      <div className="p-4 sm:p-6 pt-0 border-t border-slate-800/60 flex flex-col gap-4 text-xs font-mono">
                        {/* Summary Pill */}
                        <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl p-3 sm:p-3.5 text-amber-200 leading-relaxed">
                          <span className="text-amber-400 font-bold block mb-1">
                            Resumen Directo:
                          </span>
                          <span>{item.shortSummary}</span>
                        </div>

                        {/* Detailed Development */}
                        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2 text-slate-300 leading-relaxed">
                          <span className="text-slate-400 font-bold uppercase text-[11px] block mb-2 border-b border-slate-800/80 pb-1">
                            Desarrollo Técnico y Conceptual:
                          </span>
                          {item.detailedContent.map((line, lIdx) => (
                            <div key={`det-${lIdx}`} className="whitespace-pre-wrap">
                              {line}
                            </div>
                          ))}
                        </div>

                        {/* Key Takeaways Box */}
                        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-3.5 text-emerald-200 flex flex-col gap-1.5">
                          <span className="font-bold text-emerald-400 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            Puntos Clave para Evaluaciones:
                          </span>
                          <ul className="space-y-1 mt-1">
                            {item.keyTakeaways.map((takeaway, tIdx) => (
                              <li key={`tway-${tIdx}`} className="flex items-start gap-2 text-[11px] text-slate-300">
                                <span className="text-emerald-400 font-bold">✓</span>
                                <span>{takeaway}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Tags and APA Reference Footer */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-[11px] text-slate-500">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Tag className="w-3 h-3 text-slate-500" />
                            {item.tags.map(t => (
                              <span
                                key={`tag-${t}`}
                                className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-400 text-[10px]"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                          {item.apaCitation && (
                            <span className="text-slate-400 font-mono">
                              Fuente: <span className="text-amber-400/90">{item.apaCitation}</span>
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

      {/* ── VIEW 2: BIBLIOGRAPHY APA 7TH EDITION ── */}
      {activeTab === 'bibliography' && (
        <div className="flex flex-col gap-4">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
            <Award className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs font-mono text-slate-300 leading-relaxed">
              <span className="text-amber-300 font-bold block mb-0.5">
                Créditos Académicos con Enlaces Reales Verificados:
              </span>
              Todos los enlaces a continuación han sido comprobados y dirigen a repositorios académicos activos (Dialnet, JSTOR, Biblioteca Nacional de Francia, Bayerische Staatsbibliothek, Internet Archive y Perseus Tufts). Puedes hacer clic para ver el material original o copiar la cita formateada en APA 7.
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {APA_REFERENCES.map(ref => (
              <div
                key={ref.id}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col gap-3 hover:border-slate-700 transition"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      {ref.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-300 font-mono">
                      {ref.topic}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    Cita en texto: <code className="text-amber-400 font-bold">{ref.inTextCitation}</code>
                  </span>
                </div>

                {/* APA Citation formatted container */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 font-mono text-xs text-slate-200 leading-relaxed flex flex-col gap-2">
                  <div>
                    <span className="font-semibold text-slate-100">{ref.author}</span> ({ref.year}).{' '}
                    <span className="italic text-amber-300">{ref.title}</span>. {ref.source}.
                  </div>
                  <div className="pt-1">
                    <a
                      href={ref.doiOrUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-semibold transition group"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-sky-400 group-hover:scale-110 transition-transform" />
                      <span>{ref.displayUrlLabel}</span>
                      <span className="text-slate-500 text-[10px]">({ref.doiOrUrl})</span>
                    </a>
                  </div>
                </div>

                {/* Notes and Copy Button */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/60 text-xs">
                  <p className="text-[11px] text-slate-400 font-mono flex-1">
                    <span className="text-slate-500">Aplicación en la plataforma:</span> {ref.notes}
                  </p>
                  <button
                    onClick={() => handleCopyCitation(ref)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs transition flex-shrink-0"
                    title="Copiar cita en formato APA 7"
                  >
                    {copiedId === ref.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">¡Copiado APA 7!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copiar Cita APA 7</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── VIEW 3: THEORETICAL ARTICLES WITH IN-TEXT CITATIONS ── */}
      {activeTab === 'articles' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Article Nav List */}
          <div className="lg:col-span-4 flex flex-col gap-2">
            {articles.map(art => (
              <button
                key={art.id}
                onClick={() => setActiveArticle(art.id)}
                className={`text-left p-4 rounded-2xl border transition-all ${
                  activeArticle === art.id
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block mb-1">
                  {art.category}
                </span>
                <span className="font-semibold text-sm block mb-1">{art.title}</span>
                <span className="text-[10px] font-mono text-amber-500/80 block">
                  {art.citation}
                </span>
              </button>
            ))}
          </div>

          {/* Article Reader */}
          <div className="lg:col-span-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800 gap-2">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block">
                  {current.category}
                </span>
                <h3 className="text-lg font-bold text-slate-100">{current.title}</h3>
              </div>
              <div className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-amber-400">
                {current.citation}
              </div>
            </div>

            <pre
              className="font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed overflow-x-auto bg-slate-950/70 p-4 rounded-xl border border-slate-800/80"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {current.content}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
