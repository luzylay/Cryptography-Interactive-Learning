// Decoupled Academic Encyclopedia and APA 7 References

import { EncyclopediaArticle } from '../types/knowledge.types';

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
  {
    id: 'fips197_aes',
    topic: 'Estándar de Cifrado Avanzado (AES / Rijndael)',
    category: 'Estándar Internacional / Normativa',
    author: 'National Institute of Standards and Technology (NIST)',
    year: '2001',
    title: 'Advanced Encryption Standard (AES)',
    source: 'Federal Information Processing Standards Publication (FIPS PUB 197), U.S. Department of Commerce / NIST',
    doiOrUrl: 'https://doi.org/10.6028/NIST.FIPS.197-upd1',
    displayUrlLabel: 'NIST Computer Security Resource Center - FIPS PUB 197',
    inTextCitation: '(NIST / FIPS PUB 197, 2001)',
    notes: 'Especificación canónica del algoritmo AES (Rijndael) con tamaños de clave de 128, 192 y 256 bits, matriz de estado 4x4, transformaciones SubBytes, ShiftRows, MixColumns y AddRoundKey.',
  },
  {
    id: 'fips180_4_sha',
    topic: 'Estándar de Funciones Hash Seguras (SHA-1, SHA-224, SHA-256, SHA-384, SHA-512)',
    category: 'Estándar Internacional / Normativa',
    author: 'National Institute of Standards and Technology (NIST)',
    year: '2015',
    title: 'Secure Hash Standard (SHS)',
    source: 'Federal Information Processing Standards Publication (FIPS PUB 180-4), U.S. Department of Commerce / NIST',
    doiOrUrl: 'https://doi.org/10.6028/NIST.FIPS.180-4',
    displayUrlLabel: 'NIST CSRC - FIPS PUB 180-4 (Secure Hash Standard)',
    inTextCitation: '(NIST / FIPS PUB 180-4, 2015)',
    notes: 'Especificación de las funciones de resumen criptográfico de la familia SHA-2, estableciendo la construcción iterativa de Merkle-Damgård, vectores iniciales y constantes de ronda.',
  },
  {
    id: 'rfc8446_tls13',
    topic: 'Protocolo de Seguridad de la Capa de Transporte (TLS) Versión 1.3',
    category: 'Estándar Internacional / Normativa',
    author: 'Rescorla, E.',
    year: '2018',
    title: 'The Transport Layer Security (TLS) Protocol Version 1.3',
    source: 'RFC 8446, Internet Engineering Task Force (IETF)',
    doiOrUrl: 'https://www.rfc-editor.org/rfc/rfc8446',
    displayUrlLabel: 'IETF RFC Editor - RFC 8446 (TLS 1.3)',
    inTextCitation: '(Rescorla / IETF RFC 8446, 2018)',
    notes: 'Estándar que revoluciona las comunicaciones HTTPS reduciendo la latencia a 1-RTT, eliminando algoritmos obsoletos (MD5, SHA-1, RC4, DES, CBC estático) e imponiendo Secreto Perfecto hacia Adelante (PFS) mediante ECDHE.',
  },
  {
    id: 'nist_sp800_207_zt',
    topic: 'Arquitectura de Confianza Cero (Zero Trust) y Ciberseguridad en Teletrabajo',
    category: 'Estándar Internacional / Normativa',
    author: 'Rose, S., Borchert, O., Mitchell, S., & Connelly, S.',
    year: '2020',
    title: 'Zero Trust Architecture',
    source: 'NIST Special Publication 800-207, National Institute of Standards and Technology, Gaithersburg, MD',
    doiOrUrl: 'https://doi.org/10.6028/NIST.SP.800-207',
    displayUrlLabel: 'NIST CSRC - NIST SP 800-207 (Zero Trust Architecture)',
    inTextCitation: '(Rose et al. / NIST SP 800-207, 2020)',
    notes: 'Marco de referencia para la seguridad empresarial moderna pospandemia: abandono de la seguridad perimetral tradicional en favor de la verificación continua estricta de identidad, cifrado integral de extremo a extremo y principio de menor privilegio.',
  },
  {
    id: 'wheatstone1854',
    topic: 'Cifrador de Playfair, Matriz 5×5 y Cifrado Digrámico',
    category: 'Tratado Histórico Original',
    author: 'Wheatstone, C., & Playfair, L.',
    year: '1854',
    title: 'The Playfair Cipher: Polygraphic Substitution on a 5×5 Matrix',
    source: 'British Foreign Office Archives. Documentado en Kahn, D. (1996) The Codebreakers y Stallings, W. (2017) Cryptography and Network Security (7.ª ed.)',
    doiOrUrl: 'https://archive.org/details/codebreakersstor0000kahn_k4s3',
    displayUrlLabel: 'British Foreign Office & The Codebreakers (Kahn, 1996, pp. 198–202)',
    inTextCitation: '(Wheatstone & Playfair, 1854; Stallings, 2017)',
    notes: 'Primer cifrador digrámico de sustitución poligráfica simétrica de uso práctico militar. Utiliza una matriz cuadrada de 5×5 con unificación de I/J (y N/Ñ en castellano) y reglas geométricas de desplazamiento.',
  },
  {
    id: 'diffie_hellman1976',
    topic: 'Criptografía Asimétrica y Concepto de Clave Pública/Privada',
    category: 'Artículo Científico (Journal)',
    author: 'Diffie, W., & Hellman, M. E.',
    year: '1976',
    title: 'New directions in cryptography',
    source: 'IEEE Transactions on Information Theory, 22(6), 644–654',
    doiOrUrl: 'https://doi.org/10.1109/TIT.1976.1055638',
    displayUrlLabel: 'IEEE Xplore - DOI: 10.1109/TIT.1976.1055638',
    inTextCitation: '(Diffie & Hellman, 1976)',
    notes: 'Artículo seminal que introduce formalmente el concepto de criptografía de clave pública, funciones trampa unidireccionales y el intercambio seguro de claves sin canal secreto previo.',
  },
  {
    id: 'rfc8017_oaep',
    topic: 'Estándar RSA Criptográfico PKCS #1 v2.2 y Esquema OAEP',
    category: 'Estándar Internacional / Normativa',
    author: 'Moriarty, K. (Ed.), Kaliski, B., Jonsson, J., & Rusch, A.',
    year: '2016',
    title: 'PKCS #1: RSA Cryptography Specifications Version 2.2',
    source: 'RFC 8017, Internet Engineering Task Force (IETF)',
    doiOrUrl: 'https://www.rfc-editor.org/rfc/rfc8017',
    displayUrlLabel: 'IETF RFC Editor - RFC 8017 (PKCS #1 v2.2)',
    inTextCitation: '(Moriarty et al. / IETF RFC 8017, 2016)',
    notes: 'Norma canónica que especifica el relleno OAEP (Optimal Asymmetric Encryption Padding) para RSA, previniendo ataques de texto cifrado adaptativo (Bleichenbacher) y oráculos de relleno.',
  },
  {
    id: 'rfc5531_rpc',
    topic: 'Protocolo de Llamada a Procedimiento Remoto (RPC Versión 2)',
    category: 'Estándar Internacional / Normativa',
    author: 'Thurlow, R.',
    year: '2009',
    title: 'RPC: Remote Procedure Call Protocol Specification Version 2',
    source: 'RFC 5531, Internet Engineering Task Force (IETF)',
    doiOrUrl: 'https://www.rfc-editor.org/rfc/rfc5531',
    displayUrlLabel: 'IETF RFC Editor - RFC 5531 (RPC v2)',
    inTextCitation: '(Thurlow / IETF RFC 5531, 2009)',
    notes: 'Especificación canónica del protocolo RPC en sistemas distribuidos, detallando la serialización de parámetros (XDR), el rol de stubs cliente/servidor y mecanismos de autenticación e integridad.',
  },
  {
    id: 'icao9303_dnie',
    topic: 'Documentos de Viaje e Identidad Electrónicos (DNIe / eID & MRTD)',
    category: 'Estándar Internacional / Normativa',
    author: 'International Civil Aviation Organization (ICAO)',
    year: '2021',
    title: 'Machine Readable Travel Documents (Doc 9303 Part 9–11: Deployment of Biometric Identification and Electronic Storage of Data and Security Mechanisms)',
    source: 'ICAO Standard Publications, 8.ª ed., Montreal, Canadá',
    doiOrUrl: 'https://www.icao.int/publications/pages/publication.aspx?docnum=9303',
    displayUrlLabel: 'ICAO Doc 9303 - Estándar Oficial de Pasaportes y DNIs Electrónicos',
    inTextCitation: '(ICAO Doc 9303, 2021)',
    notes: 'Estándar internacional rector de los chips criptográficos en pasaportes y DNIs electrónicos, estableciendo la protección biométrica, firma de datos y protocolos seguros BAC y PACE.',
  },
  {
    id: 'bsi_tr03110_pace',
    topic: 'Protocolo de Establecimiento de Conexión Autenticada con Contraseña (PACE)',
    category: 'Estándar Internacional / Normativa',
    author: 'Federal Office for Information Security (BSI)',
    year: '2020',
    title: 'Advanced Security Mechanisms for Machine Readable Travel Documents - Part 2: Password Authenticated Connection Establishment (PACE)',
    source: 'Technical Guideline BSI TR-03110-2 v2.21, Bonn, Alemania',
    doiOrUrl: 'https://www.bsi.bund.de/EN/The-BSI/Standards-and-Certifications/Technical-Guidelines/TR-03110/TR-03110_node.html',
    displayUrlLabel: 'BSI TR-03110 - Guía Técnica PACE para Tarjetas Inteligentes',
    inTextCitation: '(BSI TR-03110, 2020)',
    notes: 'Especificación del protocolo criptográfico PACE utilizado en los chips de DNIe modernos (v3.0 y v4.0) con cifrado AES para crear canales seguros inalámbricos inmunes a escuchas pasivas.',
  },
  {
    id: 'kleppmann2017',
    topic: 'Sistemas Distribuidos, Tablas Hash y Almacenamiento Clave-Valor (NoSQL)',
    category: 'Libro de Texto Base',
    author: 'Kleppmann, M.',
    year: '2017',
    title: 'Designing Data-Intensive Applications: The Big Ideas Behind Reliable, Scalable, and Maintainable Systems',
    source: 'O\'Reilly Media. ISBN: 978-1449373320',
    doiOrUrl: 'https://dataintensive.net/',
    displayUrlLabel: 'O\'Reilly Media - Designing Data-Intensive Applications',
    inTextCitation: '(Kleppmann, 2017, pp. 69–90)',
    notes: 'Tratado fundamental sobre índices basados en tablas hash (Hash Indexes), particionamiento distribuido (Consistent Hashing) y contraste entre modelos relacionales y no relacionales (Key-Value Stores).',
  },
  {
    id: 'tanenbaum2017',
    topic: 'Principios y Paradigmas de Sistemas Distribuidos',
    category: 'Libro de Texto Base',
    author: 'Tanenbaum, A. S., & Van Steen, M.',
    year: '2017',
    title: 'Distributed Systems: Principles and Paradigms (3.ª ed.)',
    source: 'CreateSpace Independent Publishing Platform. ISBN: 978-1543057386',
    doiOrUrl: 'https://www.distributed-systems.net/',
    displayUrlLabel: 'Distributed-Systems.net - Libro de Texto de Tanenbaum & Van Steen',
    inTextCitation: '(Tanenbaum & Van Steen, 2017)',
    notes: 'Obra cumbre sobre arquitectura cliente-servidor, comunicación por llamadas a procedimiento remoto (RPC), serialización en stubs y seguridad distribuida.',
  },
  {
    id: 'nakamoto2008',
    topic: 'Blockchain, Hash SHA-256 y Prueba de Trabajo (Proof of Work)',
    category: 'Artículo Científico (Journal)',
    author: 'Nakamoto, S.',
    year: '2008',
    title: 'Bitcoin: A Peer-to-Peer Electronic Cash System',
    source: 'Bitcoin.org Whitepaper',
    doiOrUrl: 'https://bitcoin.org/bitcoin.pdf',
    displayUrlLabel: 'Bitcoin.org - Whitepaper Original de Satoshi Nakamoto (2008)',
    inTextCitation: '(Nakamoto, 2008)',
    notes: 'Artículo seminal que introduce la arquitectura Blockchain basada en encadenamiento inmutable por hash SHA-256, árboles de Merkle y algoritmo de consenso Proof-of-Work (PoW).',
  },
  {
    id: 'smid2021_aes_development',
    topic: 'Historia y Estandarización de AES por NIST (De DES a Rijndael)',
    category: 'Artículo Científico (Journal)',
    author: 'Smid, M. E.',
    year: '2021',
    title: 'Development of the Advanced Encryption Standard',
    source: 'Journal of Research of the National Institute of Standards and Technology, 126, 126024',
    doiOrUrl: 'https://doi.org/10.6028/jres.126.024',
    displayUrlLabel: 'NIST J. Res. - DOI: 10.6028/jres.126.024 (docs/references/subreferences/jres.126.024.pdf)',
    inTextCitation: '(Smid, 2021)',
    notes: 'Historia oficial exhaustiva escrita por el líder de la Security Technology Group de NIST. Documenta el ocaso de DES (ataques DESCHALL y EFF Deep Crack), el fracaso del Clipper Chip (SKIPJACK), la transición a 3DES, las conferencias de candidatos (15 postulantes, 5 finalistas) y la selección final de Rijndael por su rendimiento superior en tarjetas inteligentes y resistencia a ataques de canal lateral.',
  },
  {
    id: 'sitraka2024_aes_modes',
    topic: 'Evaluación de Modos de Operación AES (ECB, CBC, CFB, OFB, CTR, GCM) y Entropía',
    category: 'Artículo Científico (Journal)',
    author: 'Sitraka, R. R., & Malalatiana, R. H.',
    year: '2024',
    title: 'Evaluations of Crypto-System AES Using Multiple Bloc Ciphering Mode',
    source: 'Applied Engineering, 8(1), 14–30',
    doiOrUrl: 'https://doi.org/10.11648/j.ae.20240801.12',
    displayUrlLabel: 'SciencePG - Applied Engineering (docs/references/subreferences/Evaluations_of_Crypto-System_AES_Using_Multiple_Bl.pdf)',
    inTextCitation: '(Sitraka & Malalatiana, 2024)',
    notes: 'Estudio experimental riguroso sobre los 6 modos de operación de AES. Analiza el modo autenticado GCM con tag de autenticación sobre GF(2^128) para prevenir ataques de oráculo, la derivación de claves con SHA-256 y métricas estadísticas: histogramas planos, NPCR (99.61%), UACI (30.4%) y entropía de Shannon (H ≈ 7.64 / 8.0).',
  },
  {
    id: 'shakor2024_dynamic_aes_blockchain',
    topic: 'Cifrado Dinámico AES, Gestión de Claves con Blockchain y Curvas Elípticas (ECC)',
    category: 'Artículo Científico (Journal)',
    author: 'Shakor, M. Y., Khaleel, M. I., Safran, M., Alfarhood, S., & Zhu, M.',
    year: '2024',
    title: 'Dynamic AES Encryption and Blockchain Key Management: A Novel Solution for Cloud Data Security',
    source: 'IEEE Access, 12, 26334–26343',
    doiOrUrl: 'https://doi.org/10.1109/ACCESS.2024.3351119',
    displayUrlLabel: 'IEEE Access - DOI: 10.1109/ACCESS.2024.3351119 (docs/references/subreferences/Dynamic_AES_Encryption...)',
    inTextCitation: '(Shakor et al., 2024)',
    notes: 'Propone una arquitectura híbrida que combina generación dinámica de claves de sesión AES-256 mediante XOR de hashes SHA-256, encapsulamiento de claves con criptografía de curva elíptica (ECC) y almacenamiento descentralizado inmutable de claves en una Blockchain privada.',
  },
  {
    id: 'zhang2026_lens_sse',
    topic: 'Cifrado Simétrico con Búsqueda (SSE) y Grafo HNSW sobre Vectores Cifrados (LENS)',
    category: 'Artículo Científico (Journal)',
    author: 'Zhang, Y., Xu, Q., & Li, Y.',
    year: '2026',
    title: 'LENS: A graph-based ciphertext semantic retrieval scheme with lightweight representations',
    source: 'Information Sciences, 761, 124169',
    doiOrUrl: 'https://doi.org/10.1016/j.ins.2026.124169',
    displayUrlLabel: 'Elsevier Information Sciences (docs/references/subreferences/1-s2.0-S002002552601100X-main.pdf)',
    inTextCitation: '(Zhang, Xu, & Li, 2026)',
    notes: 'Esquema de recuperación semántica sobre datos cifrados en la nube (Searchable Symmetric Encryption - SSE) mediante navegación en grafos HNSW y producto escalar seguro (EASPE), demostrando seguridad formal IND2-CKA bajo perfil de fuga controlado.',
  },
  {
    id: 'kanwal2022_orthogonal_hill',
    topic: 'Cifrado de Hill con Matrices Ortogonales y Mapas Caóticos (Henon y Tent)',
    category: 'Artículo Científico (Journal)',
    author: 'Kanwal, S., Inam, S., Othman, M. T. B., Waqar, A., Ibrahim, M., Nawaz, F., Nawaz, Z., & Hamam, H.',
    year: '2022',
    title: 'An Effective Color Image Encryption Based on Henon Map, Tent Chaotic Map, and Orthogonal Matrices',
    source: 'Sensors, 22(12), 4359',
    doiOrUrl: 'https://doi.org/10.3390/s22124359',
    displayUrlLabel: 'MDPI Sensors - DOI: 10.3390/s22124359 (docs/references/subreferences/sensors-22-04359-v3.pdf)',
    inTextCitation: '(Kanwal et al., 2022)',
    notes: 'Optimización del cifrado de Hill clásico mediante generación de matrices clave ortogonales 3x3 a partir de ecuaciones de plano (A^t A = I), combinadas con permutación de Henon y difusión con mapa tent caótico, logrando espacio de clave > 2^240.',
  },
  {
    id: 'salman2024_gaussian_hill',
    topic: 'Cifrado de Hill Extendido con Enteros Gaussianos para Sistemas Bancarios',
    category: 'Artículo Científico (Journal)',
    author: 'Salman, S. A., Mohialden, Y. M., Abdulhameed, A., & Hussien, N. M.',
    year: '2024',
    title: 'A Novel Method for Hill Cipher Encryption and Decryption Using Gaussian Integers Implemented in Banking Systems',
    source: 'Iraqi Journal for Computer Science and Mathematics, 5(1), 277–284',
    doiOrUrl: 'https://doi.org/10.52866/ijcsm.2024.05.01.019',
    displayUrlLabel: 'IJCSM - DOI: 10.52866/ijcsm.2024.05.01.019 (docs/references/subreferences/A Novel Method for Hill...)',
    inTextCitation: '(Salman et al., 2024)',
    notes: 'Extensión matemática del Cifrado de Hill utilizando números complejos en el anillo de enteros gaussianos Z[i] mod 26 para transacciones bancarias, implementado con NumPy y Pandas y resistente a ataques de texto claro conocido.',
  },
];


export const ENCYCLOPEDIA_ARTICLES: EncyclopediaArticle[] = [
  {
    id: 'playfair',
    title: 'Cifrador de Playfair (Matriz 5×5 y Cifrado Digrámico)',
    category: 'Sustitución Poligráfica',
    citation: '(Wheatstone & Playfair, 1854; Kahn, 1996; Stallings, 2017; Diapositivas S08)',
    content: `EL CIFRADOR DE PLAYFAIR (MATRIZ 5×5 Y CIFRADO POR DÍGRAFOS)
────────────────────────────────────────────────────────────────────────
Cita académica: (Wheatstone & Playfair, 1854; Kahn, 1996; Stallings, 2017; Diapositivas S08)

1. ORIGEN HISTÓRICO Y PROBLEMA QUE RESUELVE
   • Diseñado por Charles Wheatstone en 1854 y promovido por Lord Playfair ante el Ministerio de Guerra británico.
   • El Gran Salto Conceptual:
     Los cifrados monoalfabéticos previos (como César o Afín) sustituyen una letra suelta a la vez. En cualquier idioma natural, letras comunes (como 'E' o 'A' en español con ~13%) delatan el mensaje al contar sus frecuencias.
     Playfair introdujo la sustitución DIGRÁMICA (bloques de 2 letras juntas). Al haber 25×25 = 625 pares posibles, el análisis unigramático de frecuencias queda completamente inutilizado.

2. PREPARACIÓN DEL TEXTO EN DÍGRAFOS Y REGLAS DE LA LETRA NULA ('X')
   • División en pares: El mensaje se divide estrictamente de 2 en 2 caracteres (ej. "HO LA").
   • Regla de Letras Gemelas Consecutivas:
     No se permite un par con dos letras iguales (ej. "LL" o "SS"), pues la geometría de la matriz colapsaría.
     Solución: Se inserta una letra nula separadora 'X' (o 'Z' si ya es una X) entre ambas.
     Ejemplo: "CASTILLO" → CAS TI LX LO | "SOMBRAS" → SX SO MB RA SL.
   • Regla de Longitud Impar:
     Si el mensaje termina en un número impar de letras y la última queda sin pareja, se añade una 'X' al final.
     Ejemplo: "HOY" (3 letras) → HO YX.

3. CONSTRUCCIÓN DE LA MATRIZ 5×5
   • Una cuadrícula de 5 filas × 5 columnas contiene exactamente 25 casillas.
   • Unificación de Letras:
     - Estándar internacional: 'I' y 'J' comparten la misma celda (I/J).
     - Convención universitaria en español (S08): 'I' y 'J' comparten celda (I/J) y 'N' y 'Ñ' comparten celda (N/Ñ).
   • Llenado de la Cuadrícula:
     1. Se escribe la palabra clave (ej. "MIEDO" o "VERANO AZUL") sin repetir letras ya usadas.
     2. Se completan las celdas vacías con el resto del abecedario en riguroso orden alfabético.

4. LAS 3 REGLAS GEOMÉTRICAS DE CIFRADO
   Al ubicar las dos letras M1 y M2 del par en la matriz, solo existen tres situaciones:
   A. Misma Fila (Horizontal):
      Cada letra se desplaza 1 posición a la DERECHA (+1 mod 5). Salto circular Pac-Man: de columna 5 pasa a columna 1.
   B. Misma Columna (Vertical):
      Cada letra se desplaza 1 posición hacia ABAJO (+1 mod 5). Salto circular Pac-Man: de fila 5 pasa a fila 1.
   C. Rectángulo (Distinta Fila y Distinta Columna):
      Cada letra conserva su PROPIA FILA y toma la COLUMNA de su compañera:
      M1[F1, C1] → C1[F1, C2]
      M2[F2, C2] → C2[F2, C1]

5. DESCIFRADO
   • Misma fila: 1 paso a la IZQUIERDA (-1 mod 5).
   • Misma columna: 1 paso hacia ARRIBA (-1 mod 5).
   • Rectángulo: Exactamente la MISMA regla (cada una conserva su fila y toma la columna de la otra).

6. VULNERABILIDAD Y CRIPTOANÁLISIS
   • Aunque resiste frecuencias simples de 1 letra, es vulnerable al análisis de frecuencia de dígrafos en textos largos (frecuencia de pares comunes como ES, EN, DE, LA).
   • Propiedad simétrica: Un par de letras en rectángulo genera el par inverso al invertir los caracteres (AB → CD implica BA → DC).`,
  },
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
    title: 'Esteganografía, Fuerza Bruta y Estegoanálisis',
    category: 'Ocultación de Información',
    citation: '(Katsikeas et al., 2021; Katzenbeisser & Petitcolas, 2000; NIST SP 800-63B; MITRE ATT&CK T1110)',
    content: `ESTEGANOGRAFÍA DIGITAL, FUERZA BRUTA Y ESTEGOANÁLISIS
────────────────────────────────────────────────────────────────────────
Cita académica: (Katsikeas et al., 2021; Katzenbeisser & Petitcolas, 2000; Westfeld & Pfitzmann, 1999; MITRE ATT&CK T1110)

1. MECANISMOS DE INSERCIÓN ESTEGANOGRÁFICA
   • Técnica LSB (Least Significant Bit):
     Los bits menos significativos de cada muestra de audio o canal RGB de un píxel poseen un impacto visual/auditivo mínimo. Sustituir el bit 0 permite codificar texto o binarios sin deformar perceptiblemente la imagen original.
   • Clave Esteganográfica (Stego-Key):
     Contraseña o semilla matemática que define la secuencia pseudoaleatoria de píxeles donde se incrustan los bits secretos o cifra la carga útil antes de incrustarla.
   • Contraste con Criptografía:
     La Criptografía oculta el CONTENIDO (produce ruido visible o texto ilegible). La Esteganografía oculta la EXISTENCIA (produce un portador aparentemente normal).

2. ATAQUES PARA OBTENER LA INFORMACIÓN OCULTA
   • Ataque de Fuerza Bruta / Diccionario a la Stego-Key:
     Cuando la extracción requiere una contraseña o semilla pseudoaleatoria, el atacante o perito forense ejecuta herramientas automatizadas (ej. Stegcracker, Stegdetect) con diccionarios de contraseñas (wordlists) para probar sistemáticamente todas las combinaciones hasta validar la cabecera/checksum del archivo oculto.
   • Prueba de Chi-Cuadrado (χ²):
     La inserción aleatoria o secuencial de bits LSB empareja artificialmente las frecuencias de pares de valores adyacentes (PoVs: 2k y 2k+1), revelando una signatura estadística anormal.
   • Ataque por Portador Conocido (Known-Cover):
     Resta directa bit a bit (XOR) entre la matriz del archivo original y la del archivo sospechoso para extraer los bits modificados.
   • Análisis de Planos de Bits (Bit-Plane Slicing):
     Extracción aislada del plano LSB; en una imagen natural es ruido blanco puro, mientras que con datos incrustados muestra patrones geométricos o texturas artificiales.

3. VECTORES DE USO DEL ATAQUE DE FUERZA BRUTA EN CIBERSEGURIDAD
   • Cuentas de Usuario (Active Directory / Credential Stuffing):
     Pruebas sistemáticas de contraseñas débiles contra identidades de dominio o servicios federados (MITRE ATT&CK T1110; NIST SP 800-63B).
   • Redes Wi-Fi (SSID / WPA2-WPA3 Handshake / WPS):
     Crackeo offline del intercambio 4-way handshake (EAPOL) capturado en el aire o ataque al PIN WPS (IEEE 802.11i).
   • Servicios SSH (Puerto 22):
     Escaneo y ataques automatizados de diccionario contra credenciales administrativas remotas (RFC 4252).
   • Servidores Web (Formularios de Login / APIs):
     Ataques dirigidos a endpoints de autenticación (/wp-login.php, paneles de control, Basic Auth) sin limitación de tasa (OWASP Top 10).`,
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
  {
    id: 'sistemas_numeracion_xor',
    title: 'Sistemas de Numeración, Conversión de Bases y Álgebra Booleana en Criptografía',
    category: 'Fundamentos Matemáticos',
    citation: '(Ramió Aguirre, 1999; Shannon, 1949)',
    content: `SISTEMAS DE NUMERACIÓN Y ÁLGEBRA BOOLEANA EN CRIPTOGRAFÍA (S11)
────────────────────────────────────────────────────────────────────────
Cita académica: (Ramió Aguirre, 1999, pp. 45–52; Shannon, 1949)

1. BASES NUMÉRICAS Y CODIFICACIÓN BINARIA
   • Binario (Base 2): Alfabeto fundamental {0, 1} de la computación digital. Todo carácter ASCII se representa en un octeto (8 bits, 0x00 a 0xFF).
   • Hexadecimal (Base 16): Alfabeto {0-9, A-F}. Representa de forma compacta 4 bits (nibble) por dígito. Es el estándar de facto para representar claves, IVs y criptogramas.
   • Octal (Base 8): Alfabeto {0-7}. Cada dígito agrupa 3 bits.
   • Base64 (RFC 4648): Mapea bloques de 6 bits a un conjunto de 64 caracteres legibles (A-Z, a-z, 0-9, +, /) para transmisión sobre canales de texto (MIME, PEM, JSON).

2. EL OPERADOR XOR (⊕) COMO FUNDAMENTO CRIPTOGRÁFICO
   • Propiedades algebraicas:
     1. Conmutatividad: A ⊕ B = B ⊕ A
     2. Asociatividad: (A ⊕ B) ⊕ C = A ⊕ (B ⊕ C)
     3. Elemento neutro: A ⊕ 0 = A
     4. Involución / Auto-inverso: A ⊕ A = 0
     5. Reversibilidad simétrica: Si C = M ⊕ K, entonces M = C ⊕ K
   • Teorema del Secreto Perfecto de Shannon (1949):
     Si la clave K es verdaderamente aleatoria, de igual longitud que el mensaje M y se utiliza una sola vez (One-Time Pad / Cifrador de Vernam), la distribución de probabilidad condicional P(M|C) = P(M), garantizando seguridad incondicional contra adversarios con capacidad de cómputo infinita.`,
  },
  {
    id: 'aes_rijndael',
    title: 'El Estándar AES (Rijndael), Campos Finitos GF(2^8) y Modos de Operación',
    category: 'Criptografía Simétrica Moderna',
    citation: '(NIST FIPS PUB 197, 2001; Daemen & Rijmen, 2002)',
    content: `ADVANCED ENCRYPTION STANDARD (AES / RIJNDAEL - FIPS 197) (S12)
────────────────────────────────────────────────────────────────────────
Cita académica: (NIST FIPS PUB 197, 2001; Daemen & Rijmen, 2002)

1. ARQUITECTURA GENERAL Y TAMAÑOS DE CLAVE
   • Bloque estándar: 128 bits fijos estructurados en una matriz de estado de 4×4 bytes.
   • Variantes según longitud de clave:
     - AES-128: Clave de 128 bits, 10 rondas de transformación.
     - AES-192: Clave de 192 bits, 12 rondas de transformación.
     - AES-256: Clave de 256 bits, 14 rondas de transformación (Nivel militar / Top Secret).

2. LAS 4 TRANSFORMACIONES DE RONDA
   1. SubBytes: Sustitución byte a byte no lineal usando la S-Box de Rijndael. Se basa en el cálculo del inverso multiplicativo en el campo finito GF(2^8) con polinomio irreducible m(x) = x^8 + x^4 + x^3 + x + 1 (0x11B), seguido de una transformación afín sobre GF(2) para eliminar simetrías algebraicas.
   2. ShiftRows: Permutación posicional que rota cíclicamente a la izquierda los bytes de cada fila (Fila 0: 0, Fila 1: 1, Fila 2: 2, Fila 3: 3 bytes).
   3. MixColumns: Multiplicación matricial de cada columna por el polinomio fijo c(x) = 03·x^3 + 01·x^2 + 01·x + 02 módulo x^4 + 1 en GF(2^8), proporcionando máxima difusión inter-bytes. (Se omite en la última ronda).
   4. AddRoundKey: Operación XOR bit a bit entre la matriz de estado y la subclave de ronda de 128 bits provista por el algoritmo KeyExpansion.

3. MODOS DE OPERACIÓN DE CIFRADO POR BLOQUES (SP 800-38A)
   • ECB (Electronic Codebook): Cifra cada bloque de forma independiente. Inseguro: preserva patrones repetitivos (vulnerabilidad del pingüino).
   • CBC (Cipher Block Chaining): Aplica XOR entre el bloque de texto claro y el bloque cifrado anterior, utilizando un Vector de Inicialización (IV) pseudoaleatorio y único para el primer bloque.
   • GCM (Galois/Counter Mode): Modo autenticado AEAD que combina el modo CTR con multiplicación de Galois (GHASH) para garantizar simultáneamente Confidencialidad e Integridad con altísimo rendimiento hardware.`,
  },
  {
    id: 'hash_functions_integrity',
    title: 'Funciones Hash Criptográficas: MD5, SHA-1, SHA-2 y Resistencia a Colisiones',
    category: 'Integridad y Resumen',
    citation: '(NIST FIPS PUB 180-4, 2015; RFC 1321; RFC 2104)',
    content: `FUNCIONES DE RESUMEN CRIPTOGRÁFICO Y CÓDIGOS HMAC (S13)
────────────────────────────────────────────────────────────────────────
Cita académica: (NIST FIPS PUB 180-4, 2015; RFC 1321; RFC 2104)

1. PROPIEDADES FUNDAMENTALES (ISO/IEC 10118)
   • Longitud de salida fija: Transforma cualquier mensaje de longitud arbitraria en un compendio de tamaño determinista (ej. 256 bits).
   • Eficiencia computacional: H(M) se evalúa de manera casi instantánea.
   • Efecto Avalancha (Avalanche Effect): Modificar 1 solo bit en el mensaje de entrada debe alterar aproximadamente el 50% de los bits del hash final.
   • Resistencia a Preimagen: Inviable deducir M a partir de h = H(M).
   • Resistencia a Segunda Preimagen: Inviable hallar M₂ ≠ M₁ con H(M₁) = H(M₂).
   • Resistencia a Colisiones: Inviable hallar dos mensajes arbitrarios M₁ ≠ M₂ con H(M₁) = H(M₂).

2. EVOLUCIÓN HISTÓRICA Y ESTADO DE SEGURIDAD
   • MD5 (128 bits, RFC 1321): Roto formalmente en 2004 por Wang et al. Se generan colisiones en milisegundos. PROHIBIDO para seguridad.
   • SHA-1 (160 bits, FIPS 180-1): Colisión práctica demostrada en 2017 (Google / CWI - ataque SHAttered). Retirado oficialmente por NIST en 2022.
   • SHA-2 (SHA-256, SHA-384, SHA-512, FIPS 180-4): Familia estándar actual basada en la construcción de Merkle-Damgård con 64 rondas no lineales.
   • SHA-3 (FIPS 202): Algoritmo Keccak basado en la construcción esponja (Sponge Construction), independiente de SHA-2 ante futuros avances criptoanalíticos.

3. HMAC (Keyed-Hash Message Authentication Code - RFC 2104)
   • Garantiza simultáneamente Integridad y Autenticidad de origen mediante una clave secreta K compartida.
   • Fórmula: HMAC(K, M) = H( (K ⊕ opad) || H( (K ⊕ ipad) || M ) )
   • Protege contra ataques de extensión de longitud (Length Extension Attacks) que afectan a hashes puros de Merkle-Damgård.`,
  },
  {
    id: 'digital_signatures_pki',
    title: 'Firma Digital, Infraestructura de Clave Pública (PKI) y Protocolo TLS 1.3',
    category: 'Autenticación y Protocolos Seguros',
    citation: '(NIST FIPS PUB 186-5, 2023; RFC 8446, 2018; RFC 5280, 2008)',
    content: `FIRMA DIGITAL, JERARQUÍA X.509 Y PROTOCOLO TLS 1.3 (S14–S15)
────────────────────────────────────────────────────────────────────────
Cita académica: (NIST FIPS PUB 186-5, 2023; IETF RFC 8446, 2018; RFC 5280, 2008)

1. PROCESO MATEMÁTICO DE LA FIRMA DIGITAL
   • Emisión: El emisor calcula h = H(M) y cifra el hash con su clave privada d: S = h^d mod n (en RSA) o genera el par (r, s) (en ECDSA/Ed25519).
   • Verificación: El receptor descifra la firma con la clave pública del emisor e: h' = S^e mod n y la compara con el hash local h'' = H(M).
   • Si h' == h'', se certifican tres pilares inquebrantables:
     1. Integridad (el mensaje no fue alterado).
     2. Autenticidad (solo el poseedor de la clave privada pudo generarla).
     3. No Repudio (el emisor no puede negar jurídicamente su autoría).

2. INFRAESTRUCTURA DE CLAVE PÚBLICA (PKI) Y CERTIFICADOS X.509 v3
   • Problema fundamental: ¿Cómo sabemos que la clave pública le pertenece realmente a quien dice ser?
   • Solución: Una Autoridad Certificadora (CA) confiable firma digitalmente el certificado X.509 del servidor.
   • Cadena de Confianza: Root CA (almacenada en el SO/navegador) → Intermediate CA → Certificado de Servidor (Leaf).
   • Niveles de Validación:
     - DV (Domain Validation): Validación básica del control del dominio.
     - OV (Organization Validation): Validación legal y registral de la empresa.
     - EV (Extended Validation): Auditoría corporativa integral con máxima reputación.
   • Revocación: Listas CRL (Certificate Revocation Lists) y protocolo en línea OCSP (Online Certificate Status Protocol).

3. PROTOCOLO TLS 1.3 (RFC 8446) Y CONEXIÓN HTTPS
   • Handshake 1-RTT: Reduce el retardo de conexión a un único viaje de ida y vuelta intercambiando claves efímeras ECDHE desde el ClientHello.
   • Secreto Perfecto hacia Adelante (PFS - Perfect Forward Secrecy): Cada sesión genera claves temporales efímeras. Si la clave privada de la CA se compromete en el futuro, las sesiones pasadas no pueden descifrarse.
   • Eliminación de algoritmos obsoletos: Prohíbe RSA estático para intercambio de claves, RC4, 3DES, MD5, SHA-1 y compresión TLS (ataques CRIME/BREACH).`,
  },
  {
    id: 'teletrabajo_pandemia_seguridad',
    title: 'Ciberseguridad y Criptografía en Tiempos de Pandemia: VPNs, MFA y Confianza Cero',
    category: 'Ciberseguridad Moderna',
    citation: '(NIST SP 800-207, 2020; Katsikeas et al., 2021; ISO/IEC 27001:2022)',
    content: `CIBERSEGURIDAD EN TELETRABAJO Y CONTEXTO POSPANDEMIA (S16–S17)
────────────────────────────────────────────────────────────────────────
Cita académica: (NIST SP 800-207, 2020; Katsikeas et al., 2021; ISO/IEC 27001:2022)

1. VECTORES DE AMENAZA DURANTE LA TRANSICIÓN AL TELETRABAJO (COVID-19)
   • Dispersión del perímetro defensivo: Conexiones desde redes domésticas no seguras y dispositivos personales (BYOD - Bring Your Own Device).
   • Campañas masivas de Phishing e Ingeniería Social: Suplantación de entidades de salud, videoconferencias (Zoom, Teams) y alertas sanitarias falsas.
   • Ransomware Corporativo (RaaS): Secuestro extorsivo de datos corporativos mediante cifrado asimétrico/híbrido malicioso de bases de datos.

2. MECANISMOS CRIPTOGRÁFICOS DE PROTECCIÓN
   • Redes Privadas Virtuales (VPN):
     - IPSec VPN (RFC 4301): Opera en capa de red (Capa 3). Utiliza protocolos AH (Authentication Header para integridad) y ESP (Encapsulating Security Payload para cifrado y autenticación) en modo Túnel o Transporte con IKEv2.
     - SSL/TLS VPN (OpenVPN / WireGuard): Opera en capa de transporte/aplicación, facilitando acceso granular por navegador o cliente seguro.
   • Autenticación Multifactor (MFA / 2FA - NIST SP 800-63B):
     - Factores: 1. Algo que sabes (contraseña), 2. Algo que tienes (token TOTP RFC 6238, llave física FIDO2/WebAuthn), 3. Algo que eres (biometría).

3. ARQUITECTURA DE CONFIANZA CERO (ZERO TRUST - NIST SP 800-207)
   • Principio canónico: "Nunca confiar, siempre verificar" (Never trust, always verify).
   • Pilares clave:
     1. Verificación continua de identidad y postura de seguridad del dispositivo.
     2. Microsegmentación de redes internas para evitar desplazamiento lateral del atacante.
     3. Principio de Menor Privilegio (PoLP): Concesión estricta de permisos temporales mínimos necesarios.
     4. Cifrado integral de todos los datos, tanto en tránsito (TLS 1.3 / mTLS) como en reposo (AES-256-XTS).`,
  },
  {
    id: 'cifrado_transposicion_clasico',
    title: 'Cifradores por Transposición: Series (m1, m2, m3), Columnas, Filas y Escítala',
    category: 'Criptosistemas Clásicos',
    citation: '(Ramió Aguirre, 1999, pp. 88–96; Kahn, 1996)',
    content: `CIFRADORES POR TRANSPOSICIÓN Y PERMUTACIÓN GEOMÉTRICA (S04)
────────────────────────────────────────────────────────────────────────
Cita académica: (Ramió Aguirre, 1999, pp. 88–96; Kahn, 1996)

1. PRINCIPIO FUNDAMENTAL DE LA TRANSPOSICIÓN
   • A diferencia de los cifrados por sustitución (donde las letras se reemplazan por otras), en la transposición los caracteres originales del texto en claro se conservan intactos, pero sus posiciones son reordenadas (permutadas).
   • El histograma unigramático es idéntico al del texto en claro, por lo que el criptoanalista detecta el método y recurre a técnicas de anagramación o análisis de digramas.

2. TRANSPOSICIÓN POR SERIES (MS1, MS2, MS3)
   • El mensaje M = m₁m₂m₃...m_N se particiona en subseries disjuntas:
     - MS1: Posiciones que son Números Primos.
     - MS2: Posiciones que son Números Pares.
     - MS3: Posiciones que son Números Impares restantes.
   • El Debate del Número 1:
     - En el texto clásico de Ramió Aguirre (1999, p. 90), el número 1 fue catalogado dentro de la serie de números primos (MS1).
     - En la teoría de números moderna y por criterio docente (Criterio del Profesor), el número 1 NO es primo (tiene un solo divisor), por lo que pertenece a la serie de impares (MS3).
   • Cifrado: M' = MS1 + MS2 + MS3.
   • Descifrado: Se reconstruye la permutación inversa mapeando cada C_k a su posición original m_{p_k}.

3. TRANSPOSICIÓN POR COLUMNAS Y COMODÍN DE RELLENO (NULL / PADDING)
   • Se escribe el texto en claro horizontalmente en una cuadrícula de NC columnas (clave por palabra o número fijo).
   • Si la última fila queda incompleta, se rellena con un comodín o carácter nulo ('X').
   • Se permutan las columnas según el orden alfabético de la clave y se extraen verticalmente de arriba hacia abajo.
   • Descifrado: Se calcula el número de filas NF = ceil(LC / NC), se reconstruyen las columnas y se lee horizontalmente fila por fila.

4. TRANSPOSICIÓN POR FILAS (NF NIVELES)
   • El mensaje se escribe verticalmente de arriba hacia abajo en tantas filas como indique la clave NF.
   • Se completa con el comodín ('X') si no es múltiplo de NF.
   • El criptograma se obtiene leyendo horizontalmente fila por fila (Fila 1, Fila 2, ..., Fila NF).
   • Descifrado: Con LC y NF, se calcula NC = LC / NF. Se escribe horizontalmente en NF filas de NC columnas y se lee verticalmente de arriba hacia abajo columna por columna.`,
  },
  {
    id: 'cripto_simetrica_des_3des_aes',
    title: 'Criptografía Simétrica: Fundamentos, Clave Secreta y Algoritmos DES, 3DES y AES',
    category: 'Criptografía Simétrica',
    citation: '(NIST FIPS PUB 197, 2001; NIST FIPS PUB 46-3, 1999; NIST SP 800-67, 2017; Stallings, 2017)',
    content: `CRIPTOGRAFÍA SIMÉTRICA O DE CLAVE SECRETA Y CIFRADORES POR BLOQUES
────────────────────────────────────────────────────────────────────────
Cita académica: (NIST FIPS PUB 197, 2001; NIST FIPS PUB 46-3, 1999; NIST SP 800-67, 2017; Stallings, 2017)

1. FUNDAMENTOS DE LA CRIPTOGRAFÍA SIMÉTRICA
   • Principio de Clave Única: Emplea una sola clave secreta K compartida tanto para la operación de cifrado como para la de descifrado: C = E_K(M) y M = D_K(C).
   • Seguridad centrada en la clave (Principio de Kerckhoffs, 1883): La fortaleza y confidencialidad del sistema no dependen de ocultar el algoritmo (el cual debe ser público para ser auditado por la comunidad científica), sino únicamente de salvaguardar el secreto de la clave.
   • Debilidad Fundamental: El problema de distribución y compartición de la clave (Key Distribution Problem). Transmitir la clave K de forma segura entre emisor y receptor requiere un canal seguro previo. En una red de N usuarios, el número de claves bilaterales requeridas crece cuadráticamente: N × (N - 1) / 2.
   • Parámetros Esenciales de Seguridad:
     1. Unidireccionalidad computacional de la clave: Resulta matemáticamente inviable deducir la clave K a partir del conocimiento del texto cifrado C (e incluso con pares conocidos texto plano/cifrado).
     2. Criterio Económico-Temporal: El costo computacional, temporal y financiero necesario para quebrar el criptosistema debe exceder ampliamente el valor comercial o estratégico de la información resguardada, y el tiempo de descifrado debe sobrepasar la vigencia temporal de su confidencialidad.

2. DATA ENCRYPTION STANDARD (DES - FIPS 46-3)
   • Historia: Diseñado por IBM (Lucifer) y estandarizado en 1977 por el NBS (actual NIST) como FIPS PUB 46.
   • Parámetros: Bloque de 64 bits. Clave nominal de 64 bits con 8 bits de paridad, resultando en una clave efectiva de 56 bits (2^56 combinaciones).
   • Arquitectura: Red de Feistel de 16 rondas con Permutación Inicial (IP) e Inversa (IP⁻¹).
   • Función F: Expansión E (32 a 48 bits), suma XOR con la subclave K_i (48 bits), 8 Cajas S no lineales (S-Boxes de 6 a 4 bits, fuente primaria de confusión) y permutación P (difusión).
   • Modos de Operación: ECB (Electronic Codebook), CBC (Cipher Block Chaining), CFB, OFB y CTR.
   • Vulnerabilidad por Fuerza Bruta: Su espacio de 2^56 claves se demostró insuficiente en 1998 cuando la EFF quebró una clave en 56 horas con "Deep Crack". Hoy se quiebra en menos de 24 horas con clústeres de GPUs. Retirado oficialmente por NIST.

3. TRIPLE DES (3DES / TDEA - NIST SP 800-67 REV. 2)
   • Esquema EDE (Encrypt-Decrypt-Encrypt): C = E_K3( D_K2( E_K1( M ) ) ).
   • Descifrado: M = D_K1( E_K2( D_K3( C ) ) ).
   • Retrocompatibilidad: Si K1 = K2 = K3, el esquema colapsa a DES estándar (E_K(D_K(E_K(M))) = E_K(M)).
   • Variantes de Clave:
     - 3-Key 3DES (168 bits nominales): Seguridad efectiva de 112 bits debido al ataque Meet-in-the-Middle (MitM en 2^112 operaciones).
     - 2-Key 3DES (112 bits nominales, K1 = K3): Seguridad efectiva de ~80 bits.
   • Retiro Oficial por NIST: Conserva el bloque de 64 bits. El ataque Sweet32 (2016) demostró que tras 32 GB de datos cifrados en modo CBC se producen colisiones de bloques aprovechables para secuestro de sesiones HTTPS. El NIST retiró formalmente 3DES el 31 de diciembre de 2023.

4. ADVANCED ENCRYPTION STANDARD (AES / RIJNDAEL - FIPS 197)
   • Estandarización: Diseñado por Joan Daemen y Vincent Rijmen. Ganó el concurso abierto del NIST en 2001.
   • Matriz de Estado: Bloques fijos de 128 bits organizados en una matriz de 4×4 bytes.
   • Longitudes de Clave y Rondas:
     - AES-128: Clave de 128 bits → 10 rondas.
     - AES-192: Clave de 192 bits → 12 rondas.
     - AES-256: Clave de 256 bits → 14 rondas (resistente ante computación cuántica por algoritmo de Grover).
   • Las 4 Transformaciones de la Red de Sustitución-Permutación (SPN):
     1. SubBytes: Sustitución no lineal byte a byte mediante la S-Box de Rijndael, calculada sobre el campo finito GF(2^8) con el polinomio irreducible m(x) = x^8 + x^4 + x^3 + x + 1 seguido de una transformación afín.
     2. ShiftRows: Rotación cíclica de filas (Fila 0: 0, Fila 1: 1, Fila 2: 2, Fila 3: 3 bytes a la izquierda) para difusión inter-columnas.
     3. MixColumns: Multiplicación matricial de cada columna en GF(2^8) por el polinomio c(x) = {03}x^3 + {01}x^2 + {01}x + {02} mod x^4 + 1. (Se omite en la última ronda).
     4. AddRoundKey: Operación XOR bit a bit entre la matriz de estado y la subclave de ronda expandida.

5. MATRIZ DE VENTAJAS Y DESVENTAJAS COMPARATIVAS
┌────────────┬─────────────┬──────────────┬───────────────┬──────────────────────────┬────────────────────────┐
│ Algoritmo  │ Bloque      │ Clave Efect. │ Rondas        │ Ventajas                 │ Desventajas            │
├────────────┼─────────────┼──────────────┼───────────────┼──────────────────────────┼────────────────────────┤
│ DES        │ 64 bits     │ 56 bits      │ 16 (Feistel)  │ Simplicidad histórica    │ Clave corta, roto por  │
│            │             │              │               │ en circuitos de los 70   │ fuerza bruta (2^56)    │
├────────────┼─────────────┼──────────────┼───────────────┼──────────────────────────┼────────────────────────┤
│ 3DES       │ 64 bits     │ 112/168 bits │ 48 (3xFeistel)│ Mitigó la clave corta;   │ Muy lento (3x cómputo);│
│            │             │ (efect. 112) │               │ retrocompatible con DES  │ Sweet32 (bloque 64b)   │
├────────────┼─────────────┼──────────────┼───────────────┼──────────────────────────┼────────────────────────┤
│ AES        │ 128 bits    │ 128, 192,    │ 10, 12, 14    │ Ultrarrápido (AES-NI);   │ Requiere código de     │
│ (Rijndael) │             │ 256 bits     │ (SPN)         │ inmune a Sweet32; 256b   │ tiempo constante contra│
│            │             │              │               │ resiste Grover cuántico  │ canal lateral de caché │
└────────────┴─────────────┴──────────────┴───────────────┴──────────────────────────┴────────────────────────┘`,
  },
  {
    id: 'cripto_asimetrica_cleopatra_hibrido',
    title: 'Criptografía Asimétrica: RSA, DSA, ElGamal, Cleopatra (Gpg4win) y Cifrado Híbrido',
    category: 'Criptografía Asimétrica',
    citation: '(Diffie & Hellman, 1976; Rivest et al., 1978; RFC 9580, 2024; RFC 8017, 2016)',
    content: `CRIPTOGRAFÍA ASIMÉTRICA, GESTIÓN EN CLEOPATRA Y CIFRADO HÍBRIDO
────────────────────────────────────────────────────────────────────────
Cita académica: (Diffie & Hellman, 1976; Rivest, Shamir & Adleman, 1978; RFC 9580, 2024; RFC 8017, 2016)

1. PRINCIPIOS MATEMÁTICOS DE LA CLAVE PÚBLICA (DIFFIE-HELLMAN, 1976)
   • Funciones Trampa Unidireccionales (Trapdoor One-Way Functions):
     Son funciones matemáticas y = f(x) fáciles de computar para cualquier entrada x, pero computacionalmente inviables de invertir (hallar x dado y) salvo que se conozca un dato secreto complementario denominado "trampa" (la clave privada).
   • Par Asimétrico:
     - Clave Pública: Se comparte y divulga abiertamente. En confidencialidad se utiliza para CIFRAR.
     - Clave Privada: Se mantiene en estricto secreto por su titular. Se utiliza para DESCIFRAR.
     - Inversión en Firma Digital: La clave privada FIRMA y la clave pública VERIFICA.
   • Escalabilidad de Gestión: Para N participantes, se necesitan únicamente 2N claves (distribución lineal O(N)), superando la complejidad O(N^2) de la criptografía simétrica.

2. ALGORITMOS ASIMÉTRICOS PRINCIPALES
   • RSA (Rivest, Shamir & Adleman, 1978):
     - Fundamento: Dificultad computacional de factorizar el producto n = p × q de dos números primos gigantescos.
     - Función de Euler: φ(n) = (p - 1)(q - 1). Clave pública (e, n) con mcd(e, φ(n)) = 1; clave privada d ≡ e⁻¹ (mod φ(n)).
     - Cifrado: C = M^e mod n. Descifrado: M = C^d mod n.
     - Esquema de Relleno Obligatorio: RSA-OAEP (Optimal Asymmetric Encryption Padding - RFC 8017) para evitar ataques de texto cifrado elegido adaptativo (Bleichenbacher).
   • DSA (Digital Signature Algorithm - FIPS 186):
     - Fundamento: Problema del logaritmo discreto sobre subgrupos de campos finitos.
     - Diseñado exclusivamente para firma digital (no cifra datos).
     - Retiro por NIST: En FIPS 186-5 (2023), el NIST retiró DSA para generación de nuevas claves en favor de RSA y Curvas Elípticas.
   • ElGamal (Taher ElGamal, 1985):
     - Fundamento: Intercambio de claves Diffie-Hellman sobre grupos multiplicativos finitos.
     - Característica: Cifrado probabilístico (el mismo mensaje produce criptogramas distintos en cada ejecución debido al parámetro efímero k).

3. GESTIÓN PRÁCTICA CON CLEOPATRA (KLEOPATRA / GPG4WIN)
   • Cleopatra es el gestor gráfico de certificados OpenPGP y X.509 de la suite Gpg4win (basada en GnuPG).
   • Flujo de Generación de Claves:
     1. Menú "Archivo" → "Nuevo par de claves OpenPGP...".
     2. Ingresar Nombre Real y Correo Electrónico.
     3. "Configuración avanzada": Seleccionar algoritmo (RSA 3072/4096 bits o curva Ed25519) y fecha de caducidad.
     4. Frase de Paso (Passphrase): Contraseña de alta entropía que cifra la clave privada en disco mediante derivación S2K (String-to-Key / PBKDF2) con miles de rondas de hash.
   • Exportación de Claves:
     - Clave Pública: Se exporta a un archivo de texto plano ASCII Armor (\`.asc\` con encabezado \`-----BEGIN PGP PUBLIC KEY BLOCK-----\`). Puede compartirse por correo o subirse a servidores de claves HKP (keys.openpgp.org).
     - Clave Privada: Se resguarda en copia de seguridad protegida por contraseña o token de hardware (YubiKey / Smart Card). NUNCA se comparte.
   • Cifrado y Descifrado en Comunicaciones:
     - El emisor importa la clave pública del receptor en Cleopatra y cifra un archivo.
     - El receptor abre el archivo cifrado (\`.gpg\` o \`.asc\`), Cleopatra solicita su frase de paso para desbloquear la clave privada local, y recupera el texto claro.

4. ARQUITECTURA DE CIFRADO HÍBRIDO (HYBRID ENCRYPTION)
   • Problema: RSA es matemáticamente pesado (1000 veces más lento que AES) y no puede cifrar mensajes mayores a su módulo (máx. 190 bytes para RSA-2048 con OAEP).
   • Solución Híbrida:
     1. El emisor genera una clave de sesión simétrica efímera y aleatoria K_sesion de 256 bits.
     2. Los datos voluminosos M (documentos, bases de datos de varios gigabytes) se cifran a gran velocidad con AES-256-CBC o GCM usando K_sesion: C_datos = AES(M, K_sesion).
     3. La clave pequeña K_sesion (32 bytes) se cifra con la clave pública RSA del receptor usando OAEP: C_clave = RSA_Pub(K_sesion).
     4. Se envía el contenedor: [C_clave (256 bytes) || C_datos].
     5. El receptor descifra primero K_sesion con su clave privada RSA, y luego descifra los datos completos M con AES.`,
  },
  {
    id: 'fuerza_bruta_espacio_claves',
    title: 'Ataques de Fuerza Bruta: Diccionarios, Desencriptadores y Longitud de Clave',
    category: 'Criptoanálisis y Seguridad',
    citation: '(Stallings, 2017; NIST SP 800-131A Rev. 2, 2019; Shannon, 1949)',
    content: `ATAQUES DE FUERZA BRUTA, HERRAMIENTAS Y MATEMÁTICA DEL ESPACIO DE CLAVES
────────────────────────────────────────────────────────────────────────
Cita académica: (Stallings, 2017; NIST SP 800-131A Rev. 2, 2019; Shannon, 1949)

1. MECÁNICA DEL ATAQUE DE FUERZA BRUTA (EXHAUSTIVE KEY SEARCH)
   • Consiste en evaluar sistemáticamente cada una de las claves posibles de un algoritmo criptográfico hasta dar con aquella que produce un texto en claro inteligible o que genera el mismo hash objetivo.
   • A diferencia de los ataques criptoanalíticos (que explotan debilidades algebraicas o estadísticas en las cajas S, permutaciones o números aleatorios), la fuerza bruta es un ataque puramente exhaustivo que siempre tiene éxito si se cuenta con tiempo y cómputo suficientes.

2. DICCIONARIOS DE DATOS Y PROGRAMAS DESENCRIPTADORES
   • Diccionarios (Wordlists):
     - Listas de millones de contraseñas reales filtradas en brechas de seguridad (ej. RockYou.txt con 14.3 millones de contraseñas, SecLists).
     - Motores de Reglas (Rule-Based Attacks): Generan permutaciones automáticas aplicando sustituciones leet (\`e\` → \`3\`, \`a\` → \`@\`), sufijos numéricos (\`2024\`, \`!\`) y combinaciones fonéticas.
   • Programas Desencriptadores Modernos:
     - Hashcat: Motor de descifrado forense acelerado masivamente por GPU (CUDA y OpenCL). Capaz de probar decenas de miles de millones de hashes NTLM o MD5 por segundo en un clúster doméstico.
     - John the Ripper: Suite de auditoría multiplataforma para contraseñas de sistemas operativos (Unix shadow, Windows SAM), archivos comprimidos cifrados (ZIP, RAR) y documentos PDF.
     - Hydra y Medusa: Herramientas de ataque de fuerza bruta en red contra servicios de autenticación remota (SSH, RDP, HTTP POST login).
   • Tablas Arcoíris (Rainbow Tables): Tablas precalculadas que utilizan cadenas de reducción tiempo-memoria para invertir hashes que carecen de sal (salt).

3. RELACIÓN MATEMÁTICA CON LA LONGITUD DE LA CLAVE (EXPONENCIALIDAD 2^k)
   • El espacio de búsqueda de una clave binaria de k bits es N = 2^k.
   • Principio de Duplicación Exponencial:
     Cada bit adicional incorporado a la clave DUPLICA el tamaño total del espacio de búsqueda: 2^{k+1} = 2 × 2^k.
   • Análisis Comparativo de Longitudes:
     - 56 bits (DES): 2^56 ≈ 7.2 × 10^16 claves. Con un equipo de GPUs probando 10^11 claves/s, se recorre en 20 horas. Inseguro.
     - 80 bits (2-Key 3DES / SHA-1): 2^80 ≈ 1.2 × 10^24 claves. Quebrado por supercomputadoras y redes de botnets. Retirado por NIST.
     - 112 bits (3-Key 3DES efectivo): 2^112 ≈ 5.19 × 10^33 claves. Límite de seguridad alcanzable por estados nacionales para espionaje selectivo (retirado en 2023).
     - 128 bits (AES-128): 2^128 ≈ 3.4 × 10^38 claves. Inalcanzable con la física del universo conocido: si toda la supercomputadora más potente del mundo probara 10^18 combinaciones por segundo, tardaría más de 10^13 años (mucho más que la edad del universo, ~13.8 mil millones de años).
     - 256 bits (AES-256): 2^256 ≈ 1.15 × 10^77 claves. Resiste el Algoritmo Cuántico de Grover (que reduce la búsqueda a la raíz cuadrada: 2^{256/2} = 2^128 operaciones cuánticas efectivas).`,
  },
  {
    id: 'sistemas_distribuidos_rpc_dnie',
    title: 'Criptografía en Sistemas Distribuidos (RPC, Stubs) y el DNI Electrónico (DNIe)',
    category: 'Sistemas Distribuidos y DNIe',
    citation: '(Tanenbaum & Van Steen, 2017; RFC 5531, 2009; ICAO Doc 9303, 2021; BSI TR-03110, 2020)',
    content: `SISTEMAS DISTRIBUIDOS, RPC, STUBS Y CRIPTOGRAFÍA EN EL DNI ELECTRÓNICO (DNIe)
────────────────────────────────────────────────────────────────────────
Cita académica: (Tanenbaum & Van Steen, 2017; RFC 5531, 2009; ICAO Doc 9303, 2021; BSI TR-03110, 2020)

1. COMUNICACIONES CLIENTE-SERVIDOR Y LLAMADAS A PROCEDIMIENTO REMOTO (RPC)
   • Modelo Cliente-Servidor: Comunicación entre procesos distribuidos en nodos de red separados que intercambian solicitudes y respuestas sobre canales de transporte.
   • RPC (Remote Procedure Call - RFC 5531 / Birrell & Nelson, 1984): Abstracción que permite a una aplicación invocar métodos y rutinas alojadas en una máquina remota con la misma sintaxis que una función local.
   • El Papel de los Stubs en la Seguridad Criptográfica:
     - Client Stub: Intercepta la llamada a la función local, realiza el empaquetado de argumentos en formato estándar (Marshaling / Serialización XDR/Protobuf), cifra los parámetros confidenciales con clave simétrica (AES-256) y genera un hash o firma digital HMAC para autenticación.
     - Server Stub (Skeleton): Recibe la trama del socket de red, ejecuta la desencriptación simétrica de la carga útil, valida el resumen hash para confirmar la integridad, desempaca los tipos de datos (Unmarshaling) y ejecuta la función local del servidor.
   • Validación de Integridad mediante Hashes: Previene la inyección y alteración maliciosa de parámetros en tránsito (ataques Man-in-the-Middle) verificando que Hash(Payload_recibido) == Hash(Payload_enviado).

2. ARQUITECTURA CRIPTOGRÁFICA DEL DNI ELECTRÓNICO (DNIe)
   • Chip Criptográfico (Smart Card / Tarjeta Inteligente):
     - Microcontrolador seguro con memoria protegida (ROM, Flash/EEPROM) y coprocesador criptográfico por hardware resistente a intrusiones físicas y análisis de consumo eléctrico (DPA - Differential Power Analysis).
     - Dispositivo Cualificado de Creación de Firma (QSCD): Las claves privadas se generan dentro del silicio mediante generadores físicos de números aleatorios (TRNG) y NUNCA son leídas ni exportadas fuera del chip.
   • Certificados Digitales X.509 y Datos Biométricos:
     - Certificado de Autenticación: Acredita la identidad electrónica del ciudadano ante servicios telemáticos.
     - Certificado de Firma Digital Cualificada: Proporciona a las transacciones firma con plena equivalencia jurídica con la firma manuscrita.
     - Datos Biométricos (ICAO Doc 9303): Plantilla de huellas dactilares (Minutiae) y fotografía facial almacenadas bajo Control de Acceso Extendido (EAC).
   • Clave PIN Confidencial:
     - Número secreto que autoriza el uso de la clave privada dentro del chip.
     - Tres intentos consecutivos erróneos bloquean el chip por seguridad física.

3. PROCESO DE FIRMA DIGITAL DE UN DOCUMENTO PDF CON DNIe
   1. El software de usuario (Adobe Acrobat, AutoFirma) calcula localmente el resumen hash SHA-256 del archivo PDF completo.
   2. Envía exclusivamente los 32 bytes del hash al chip del DNIe a través del protocolo APDU (ISO/IEC 7816).
   3. El chip exige la verificación exitosa del PIN del ciudadano.
   4. El coprocesador interno del chip cifra el hash con la clave privada asimétrica (RSA-2048/3072 o ECC Brainpool): S = Hash^d mod n.
   5. El software anfitrión recibe la firma S y la incrusta en el PDF conforme a la norma europea PAdES (PDF Advanced Electronic Signatures), adjuntando el certificado del firmante y un sello de tiempo (TSA).

4. PROTOCOLOS DE CANAL SEGURO DEL CHIP: USO INTERNO DE AES Y 3DES
   • En la interfaz inalámbrica NFC/RFID (DNIe 3.0 y 4.0), las señales de radio podrían ser interceptadas por lectores clandestinos en las inmediaciones.
   • Protocolos de Comunicación Segura (Secure Messaging):
     - BAC (Basic Access Control) y PACE (Password Authenticated Connection Establishment - BSI TR-03110 / ICAO Doc 9303).
     - El lector y el chip negocian claves de sesión efímeras utilizando la clave CAN o MRZ impresa físicamente en la tarjeta.
     - Cifrado del Canal: Históricamente se utilizó 3DES en modo CBC para proteger las tramas APDU; en las generaciones modernas de DNIe se utiliza AES-128 o AES-256 en modo CBC/GCM, garantizando simultáneamente la Confidencialidad e la Integridad de la comunicación contra espionaje y manipulación.`,
  },
  {
    id: 'funciones_hash_tablas_nosql',
    title: 'Funciones Hash Criptográficas, Colisiones, Tablas Hash y Bases de Datos NoSQL (Clave-Valor)',
    category: 'Funciones Hash y NoSQL',
    citation: '(NIST FIPS PUB 180-4, 2015; Kleppmann, 2017; Nakamoto, 2008; Tanenbaum & Van Steen, 2017)',
    content: `FUNCIONES HASH CRIPTOGRÁFICAS, COLISIONES, TABLAS HASH Y BASES DE DATOS CLAVE-VALOR
────────────────────────────────────────────────────────────────────────
Cita académica: (NIST FIPS PUB 180-4, 2015; Kleppmann, 2017; Nakamoto, 2008; Tanenbaum & Van Steen, 2017)

1. DEFINICIÓN Y PROPIEDADES DE LAS FUNCIONES HASH (SHA-256)
   • Definición Formal: Una función hash H transforma un mensaje de entrada M de tamaño arbitrario en un compendio determinista de tamaño fijo h = H(M) (ej. 256 bits).
   • Garantiza Integridad, NO Confidencialidad:
     - El hash es una función unidireccional (One-Way): no existe inversa H⁻¹ para recuperar M a partir de h.
     - No oculta información para su posterior lectura confidencial; sirve de huella digital matemática para auditar si un conjunto de datos sufrió la mínima modificación.
   • Estructura de SHA-256 (FIPS PUB 180-4):
     - Bloques de 512 bits procesados en 64 rondas mediante la construcción de Merkle-Damgård, utilizando 8 palabras de inicialización, operaciones booleanas (Ch, Maj, rotaciones y sumas módulo 2^32).
   • Las 6 Propiedades Matemáticas Fundamentales:
     1. Entrada arbitraria: Admite cadenas cortas o gigabytes de datos.
     2. Salida fija: Exactamente 256 bits (64 caracteres hexadecimales).
     3. Eficiencia computacional: Cálculo casi instantáneo en CPU.
     4. Resistencia a Preimagen (One-Way): Dado h, es inviable hallar M con H(M) = h.
     5. Resistencia a Segunda Preimagen: Dado M₁, es inviable hallar M₂ ≠ M₁ con H(M₁) = H(M₂).
     6. Resistencia a Colisiones: Es inviable hallar dos entradas arbitrarias M₁ ≠ M₂ tales que H(M₁) = H(M₂).
     7. Efecto Avalancha: Modificar un solo bit de entrada debe alterar aproximadamente el 50% de los bits del hash final.
   • Qué es una Colisión: Situación en que dos datos distintos producen el mismo hash. Existen teóricamente por el Principio del Palomar (entradas infinitas vs salidas finitas 2^256), pero en SHA-256 requieren 2^128 operaciones (Paradoja del Cumpleaños), lo que resulta computacionalmente inexpugnable. Algoritmos como MD5 y SHA-1 fueron descontinuados por vulnerabilidades de colisión práctica.

2. APLICACIONES PRÁCTICAS DE LAS FUNCIONES HASH
   • Contraseñas Seguras:
     - Nunca en texto plano. Se almacena Hash(Contraseña || Salt).
     - Sal (Salt): Aleatoriedad que anula ataques de Tablas Arcoíris.
     - Funciones lentas y resistentes a GPU: Argon2id, bcrypt, PBKDF2 (NIST SP 800-63B).
   • Firmas Digitales: Se firma el hash de 32 bytes en vez del archivo original para optimizar tamaño y velocidad.
   • Blockchain y Criptomonedas (Bitcoin):
     - Encadenamiento de bloques por PrevBlockHash (SHA-256).
     - Árboles de Merkle: Verificación eficiente O(log N) de transacciones.
     - Proof of Work (PoW): Minería mediante búsqueda de nonces para generar hashes con ceros iniciales.

3. TABLAS HASH Y BASES DE DATOS NO RELACIONALES (MODELO CLAVE-VALOR)
   • Tablas Hash (Hash Tables) en Algoritmia:
     - Mapean una clave arbitraria k a un índice en memoria mediante una función hash h(k).
     - Complejidad: Inserción, búsqueda y eliminación en tiempo constante promedio O(1).
     - Resolución de colisiones: Encadenamiento (listas enlazadas) o direccionamiento abierto (sondeo lineal).
   • Relacionales (SQL) vs No Relacionales (NoSQL):
     - Relacionales (PostgreSQL, MySQL): Esquema rígido y tabular, normalización, claves foráneas, índices B-Tree (costo O(log N)), ideales para transacciones ACID.
     - No Relacionales (NoSQL): Sin esquemas rígidos (schemaless), particionamiento horizontal masivo y altísima concurrencia de lectura/escritura.
   • El Modelo Clave-Valor (Key-Value Stores - Redis, Amazon DynamoDB, Memcached):
     - Operan como gigantescas Tablas Hash Distribuidas (Distributed Hash Tables - DHT).
     - Hashing Consistente (Consistent Hashing - Karger et al., 1997): La clave del registro se procesa con una función hash para situarla en un anillo virtual de nodos.
     - Esto permite ubicar de forma instantánea qué partición o servidor físico almacena el valor en microsegundos, sin bloqueos de tablas ni búsquedas en árboles complejos.`,
  },
  {
    id: 'laboratorio_openssl_cyberchef',
    title: 'Laboratorio Práctico: OpenSSL CLI, CyberChef, AES-256-CBC, RSA-OAEP y SHA-256',
    category: 'Laboratorio y Práctica',
    citation: '(RFC 8017 / PKCS #1 v2.2, 2016; The OpenSSL Project, 2024; GCHQ CyberChef)',
    content: `GUÍA DE LABORATORIO: OPENSSL, CYBERCHEF, CIFRADO HÍBRIDO Y FORMATOS DE CLAVE
────────────────────────────────────────────────────────────────────────
Cita académica: (RFC 8017 / PKCS #1 v2.2, 2016; The OpenSSL Project, 2024; GCHQ CyberChef)

1. COMANDOS OFICIALES EN OPENSSL CLI
   • Generación de Claves RSA:
     $ openssl genpkey -algorithm RSA -out privada.pem -pkeyopt rsa_keygen_bits:2048
     $ openssl rsa -pubout -in privada.pem -out publica.pem
   • Cifrado Simétrico AES-256-CBC con Derivación PBKDF2:
     $ openssl enc -aes-256-cbc -salt -pbkdf2 -in mensaje.txt -out mensaje.enc -k PasswordSuperSegura123!
   • Descifrado Simétrico:
     $ openssl enc -d -aes-256-cbc -pbkdf2 -in mensaje.enc -out recuperado.txt -k PasswordSuperSegura123!
   • Cifrado Asimétrico RSA-2048 con Relleno Seguro OAEP:
     $ openssl pkeyutl -encrypt -pubin -inkey publica.pem -in clave_sesion.bin -out clave_sesion.enc -pkeyopt rsa_padding_mode:oaep
   • Descifrado Asimétrico con Clave Privada:
     $ openssl pkeyutl -decrypt -inkey privada.pem -in clave_sesion.enc -out clave_sesion_recup.bin -pkeyopt rsa_padding_mode:oaep
   • Cálculo de Resumen Criptográfico SHA-256:
     $ openssl dgst -sha256 mensaje.txt

2. PIPELINES Y RECETAS EN CYBERCHEF (THE CYBER SWISS ARMY KNIFE)
   • Receta Simétrica AES:
     - Operación "AES Encrypt" → Configurar Mode: CBC, Key (hex de 64 caracteres), IV (hex de 32 caracteres), Padding: PKCS7.
     - Operación "To Base64" para exportar el resultado en formato transferible.
   • Receta Asimétrica RSA:
     - Operación "RSA Encrypt" → Pegar clave pública PEM, Padding: OAEP, Hashing: SHA-256.
   • Receta de Resumen:
     - Operación "SHA256" → Produce directamente el compendio de 64 caracteres hex.

3. FORMATOS DE EXPORTACIÓN Y SERIALIZACIÓN DE CLAVES
   • Formato PEM (Privacy Enhanced Mail):
     - Codificación Base64 delimitada por cabeceras de texto: \`-----BEGIN RSA PRIVATE KEY-----\` o \`-----BEGIN CERTIFICATE-----\`.
   • Formato DER (Distinguished Encoding Rules):
     - Codificación binaria compacta directa de la estructura ASN.1, utilizada internamente en tarjetas inteligentes y TLS.
   • Formato PKCS #12 (.pfx / .p12):
     - Formato contenedor protegido con contraseña que almacena simultáneamente la clave privada, el certificado del servidor y la cadena de confianza de la CA.`,
  },
];
