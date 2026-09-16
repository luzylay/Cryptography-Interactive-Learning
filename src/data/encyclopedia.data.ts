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
];

export const ENCYCLOPEDIA_ARTICLES: EncyclopediaArticle[] = [
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
];
