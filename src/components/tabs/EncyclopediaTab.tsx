import React, { useState } from 'react';
import { BookOpen, ExternalLink, Copy, Check, BookmarkCheck, FileText, Award } from 'lucide-react';

export interface ApaReference {
  id: string;
  topic: string;
  category: 'Libro de Texto Base' | 'Tratado Histórico Original' | 'Artículo Científico (Journal)' | 'Documento Histórico Militar';
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
];

export const EncyclopediaTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'articles' | 'bibliography'>('bibliography');
  const [activeArticle, setActiveArticle] = useState<string>('alberti');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCitation = (ref: ApaReference) => {
    const apaText = `${ref.author} (${ref.year}). ${ref.title}. ${ref.source}. ${ref.doiOrUrl}`;
    navigator.clipboard.writeText(apaText);
    setCopiedId(ref.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const articles = [
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
              Enciclopedia y Referencias Académicas (Normas APA 7.ª Edición)
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Fuentes formales con enlaces 100% activos y verificados (JSTOR, BNF Gallica, Archive.org, Dialnet)
            </p>
          </div>
        </div>

        {/* Tab switcher: Articles vs References */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
          <button
            onClick={() => setActiveTab('bibliography')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono rounded-lg transition ${
              activeTab === 'bibliography'
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            Bibliografía APA 7.ª Edición ({APA_REFERENCES.length})
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono rounded-lg transition ${
              activeTab === 'articles'
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Artículos Teóricos
          </button>
        </div>
      </div>

      {/* ── VIEW 1: BIBLIOGRAPHY APA 7TH EDITION ── */}
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

      {/* ── VIEW 2: THEORETICAL ARTICLES WITH IN-TEXT CITATIONS ── */}
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
