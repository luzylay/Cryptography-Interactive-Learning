// Scalable Knowledge Base & FAQ System for Cryptography and Information Security

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

export const QA_CATEGORIES: { id: QACategory; label: string; count?: number }[] = [
  { id: 'all', label: 'Todas las Preguntas' },
  { id: 'fundamentos', label: 'Fundamentos y 6 Pilares' },
  { id: 'esteganografia', label: 'Esteganografía y Estegoanálisis' },
  { id: 'cifrado_moderno', label: 'Certificados y Cifrado Moderno' },
  { id: 'criptoanalisis', label: 'Criptoanálisis Clásico' },
];

export const KNOWLEDGE_BASE_QA: QAItem[] = [
  {
    id: 'qa-1-cripto-conceptos',
    category: 'fundamentos',
    categoryLabel: 'Conceptos Fundamentales',
    question: '¿Qué es la criptografía, criptoanálisis y ocultamiento?',
    shortSummary:
      'La criptografía cifra datos legibles en ininteligibles; el criptoanálisis estudia cómo romper o descifrar ese código sin la clave; y el ocultamiento esconde la presencia misma de la información.',
    detailedContent: [
      '• Criptografía (del griego kryptos "oculto" y graphein "escribir"): Es la disciplina científico-matemática que transforma un mensaje inteligible (texto en claro) en una secuencia incomprensible (criptograma) mediante algoritmos y claves secretas, de modo que únicamente los receptores autorizados poseedores de la clave correspondiente puedan recuperar el contenido original.',
      '• Criptoanálisis: Es el conjunto de técnicas, métodos y teorías matemáticas orientadas a descifrar, evaluar la robustez o romper criptogramas y protocolos de seguridad sin contar previamente con la autorización ni la clave secreta legítima.',
      '• Ocultamiento (Information Hiding): Es la acción o técnica diseñada para camuflar la existencia misma de la información o canal de comunicación, evitando que observadores externos sospechen que se está transmitiendo un mensaje secreto.',
    ],
    keyTakeaways: [
      'Criptografía = Hace el mensaje incomprensible a ojos no autorizados.',
      'Criptoanálisis = Ciencia y técnicas para vulnerar o quebrar el cifrado.',
      'Ocultamiento = Esconde el mensaje para que nadie sepa que existe.',
    ],
    tags: ['Criptografía', 'Criptoanálisis', 'Ocultamiento', 'Fundamentos'],
    apaCitation: '(Ramió Aguirre, 1999, pp. 1–4; Kahn, 1996, pp. 106–112)',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  },
  {
    id: 'qa-2-pilares-seguridad',
    category: 'fundamentos',
    categoryLabel: 'Pilares de Seguridad',
    question: '¿Cuáles son los objetivos y los 6 pilares de la seguridad de la información en criptografía?',
    shortSummary:
      'El objetivo es salvaguardar los activos de información mediante 6 pilares: Confidencialidad, Integridad, Disponibilidad, Autenticación, No Repudio y Control de Acceso.',
    detailedContent: [
      '1. Confidencialidad: Garantiza que la información solo resulte accesible y legible para las entidades o personas debidamente autorizadas, impidiendo la divulgación no autorizada.',
      '2. Integridad: Asegura la exactitud y completitud de la información, certificando que los datos no han sido alterados, borrados o corrompidos de forma accidental o maliciosa en tránsito o almacenamiento.',
      '3. Disponibilidad: Garantiza que los sistemas, canales de comunicación y datos se encuentren operativos y accesibles oportunamente cuando los usuarios legítimos lo requieran.',
      '4. Autenticación (Autenticidad): Procedimiento que verifica y valida con certeza inequívoca la verdadera identidad del emisor, origen del dato o parte comunicante.',
      '5. No Repudio (Irrenunciabilidad): Mecanismo técnico (ej. mediante firmas digitales con clave asimétrica) que impide que el autor o emisor de una transacción o mensaje pueda negar válidamente su autoría o envío.',
      '6. Control de Acceso (Autorización): Regulación y restricción de los privilegios y permisos que determinan quién, cuándo y con qué nivel de facultad puede acceder, leer o modificar un recurso.',
    ],
    keyTakeaways: [
      'Tríada CIA clásica: Confidencialidad, Integridad y Disponibilidad.',
      'Modelo Extendido de 6 Pilares (ISO 7498-2 / Parkerian Hexad): Añade Autenticación, No Repudio y Control de Acceso.',
      'La criptografía moderna asimétrica y de clave pública provee el soporte matemático para Confidencialidad, Integridad, Autenticación y No Repudio.',
    ],
    tags: ['6 Pilares', 'Confidencialidad', 'Integridad', 'No Repudio', 'Autenticación', 'ISO 7498-2'],
    apaCitation: '(NIST SP 800-57 Part 1 Rev. 5, 2020; ISO/IEC 7498-2, 1989)',
    badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
  },
  {
    id: 'qa-3-esteganografia',
    category: 'esteganografia',
    categoryLabel: 'Esteganografía',
    question: '¿Qué es la esteganografía y en qué se diferencia de la criptografía?',
    shortSummary:
      'La esteganografía oculta la presencia de un mensaje dentro de un archivo portador cotidiano (imagen, audio, video) para pasar desapercibido, a diferencia de la criptografía que oculta el significado del mensaje.',
    detailedContent: [
      '• Definición: Del griego steganos ("cubierto" o "protegido") y graphein ("escritura"). Es la técnica y ciencia de incrustar información confidencial dentro de un archivo portador de apariencia ordinaria (como imágenes JPEG/PNG, pistas de audio WAV/MP3 o documentos digitales) sin levantar sospechas.',
      '• Mecanismo habitual (Técnica LSB - Least Significant Bit): Modifica los bits menos significativos de los valores de píxel o muestras de audio para almacenar los bits del mensaje secreto, generando cambios imperceptibles para el ojo y oído humano.',
      '• Diferencia Fundamental:',
      '  - Criptografía: El atacante SABE que hay un mensaje (ve un criptograma ininteligible) pero NO PUEDE leerlo sin la clave.',
      '  - Esteganografía: El atacante NO SABE que existe un mensaje secreto (ve una imagen o archivo inocente).',
      '• Práctica recomendada: Combinar ambas técnicas (Cripto-esteganografía: cifrar primero con AES-256 y luego incrustar el resultado en el portador).',
    ],
    keyTakeaways: [
      'Esteganografía = Oculta la EXISTENCIA del mensaje.',
      'Criptografía = Oculta el SIGNIFICADO del mensaje.',
      'Técnica común: Sustitución de bits menos significativos (LSB).',
    ],
    tags: ['Esteganografía', 'LSB', 'Portador Digital', 'Ocultación de Información'],
    apaCitation: '(Katsikeas et al., 2021, pp. 6–8; Kahn, 1996, pp. 78–85)',
    badgeColor: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
  },
  {
    id: 'qa-4-estegoanalisis-ataques',
    category: 'esteganografia',
    categoryLabel: 'Estegoanálisis',
    question: '¿Qué tipo de ataque permite obtener la información oculta mediante la técnica de esteganografía?',
    shortSummary:
      'El Estegoanálisis (Steganalysis) permite detectar, extraer y neutralizar mensajes ocultos mediante análisis estadísticos (Chi-cuadrado), ataques por portador conocido e inspección estructural.',
    detailedContent: [
      '• Concepto de Estegoanálisis: Es el análogo al criptoanálisis, cuyo propósito es descubrir la presencia de mensajes ocultos en portadores, estimar la longitud del mensaje y, de ser posible, extraerlo o destruirlo.',
      '• Principales Tipos de Ataques de Estegoanálisis:',
      '  1. Análisis Estadístico (Prueba de Chi-cuadrado y Análisis de Pares de Valores PoVs): La inserción de bits en LSB iguala artificialmente la frecuencia de valores pares e impares adyacentes en el histograma de colores, dejando una firma matemática detectable.',
      '  2. Ataque por Portador Conocido (Known-Cover Attack): Si el analista posee la imagen original sin modificar y la imagen sospechosa, una simple operación de resta binaria (XOR / diferencia de matrices) revela de inmediato los bits modificados.',
      '  3. Ataque Visual y de Planos de Bits (Bit-Plane Slicing): Descompone la imagen en sus 8 planos de bits individuales. El plano LSB (bit 0) de una imagen natural se asemeja al ruido blanco; si contiene un mensaje ordenado o cifrado, se observan patrones geométricos artificiales.',
      '  4. Ataque por Mensaje Conocido (Known-Message Attack): Se conoce parte del mensaje secreto que fue incrustado, permitiendo deducir el patrón de dispersión o la clave esteganográfica.',
    ],
    keyTakeaways: [
      'Estegoanálisis = Disciplina que detecta y rompe la esteganografía.',
      'La alteración de LSB destruye la correlación natural del ruido en el portador.',
      'El análisis estadístico de Chi-cuadrado mide anomalías en pares de valores de color.',
    ],
    tags: ['Estegoanálisis', 'Chi-cuadrado', 'Known-Cover', 'Planos de Bits', 'LSB'],
    apaCitation: '(Katsikeas et al., 2021; Westfeld & Pfitzmann, 1999)',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  },
  {
    id: 'qa-5-estegoanalisis-casos-uso',
    category: 'esteganografia',
    categoryLabel: 'Casos de Uso en Ciberseguridad',
    question: '¿En qué casos prácticos se utiliza el estegoanálisis en la industria y seguridad nacional?',
    shortSummary:
      'Se emplea en informática forense, detección de malware con canales de comando encubiertos (Stegware), prevención de fuga de datos (DLP) e inspección profunda de tráfico en firewalls.',
    detailedContent: [
      '1. Informática Forense y Peritaje Judicial:',
      '   • Extracción de evidencias incriminatorias en dispositivos incautados a redes delictivas o terroristas que emplean imágenes inocentes para coordinar actividades ilegales.',
      '2. Detección de Malware y Amenazas Persistentes Avanzadas (Stegware / Steg-C2):',
      '   • Los actores de amenazas avanzadas ocultan comandos de control remoto (C2) o cargas útiles (payloads) en archivos JPEG/PNG alojados en servicios legítimos en la nube para eludir los antivirus tradicionales.',
      '3. Prevención de Fuga de Información Corporativa (DLP - Data Loss Prevention):',
      '   • Detección de exfiltración de secretos industriales, bases de datos o código fuente por parte de empleados desleales mediante el camuflaje de datos en memes o fotografías compartidas por redes sociales.',
      '4. Inspección Profunda de Tráfico de Red (DPI) y Cortafuegos Gubernamentales:',
      '   • Monitoreo y neutralización de canales encubiertos en pasarelas seguras (Secure Web Gateways), aplicando procesos de "sanitización de imágenes" (re-compresión o ligero remuestreo para destruir cualquier dato LSB oculto sin afectar la calidad visible).',
    ],
    keyTakeaways: [
      'Forense digital: Descubrimiento de pruebas ocultas.',
      'Ciberdefensa: Detección de código malicioso oculto en imágenes (Stegware).',
      'DLP Empresarial: Prevención de fuga de información confidencial.',
    ],
    tags: ['Casos de Uso', 'Forense Digital', 'Malware C2', 'DLP', 'Stegware'],
    apaCitation: '(Katsikeas et al., 2021, pp. 8–12; NIST SP 800-86)',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  },
  {
    id: 'qa-6-seleccion-cifrado-firma-correo',
    category: 'cifrado_moderno',
    categoryLabel: 'Selección de Algoritmos & NIST',
    question: '¿Qué tipo de cifrado y longitud de clave se recomienda para Certificados de Firma de Código y Correos Electrónicos de Máxima Confidencialidad?',
    shortSummary:
      'Para Firma de Código: EdDSA (Ed25519 de 256 bits) o RSA 3072/4096 bits. Para Correos de Máxima Confidencialidad: Cifrado híbrido con AES-256-GCM + ECDH (Curve25519 / NIST P-384) o RSA 4096 bits.',
    detailedContent: [
      'A. CERTIFICADOS DE FIRMA DE CÓDIGO (Code Signing):',
      '   • Algoritmo Recomendado Moderno: EdDSA (Curva Ed25519) o ECDSA (Curva NIST P-384).',
      '     - Longitud de Clave: 256 bits (Ed25519) o 384 bits (P-384).',
      '     - Justificación: Firmas ultracompactas (64 bytes), validación extremadamente veloz durante la instalación de software, resistencia nativa a ataques de canal lateral y equivalencia a 128/192 bits de seguridad.',
      '   • Alternativa Tradicional (Compatibilidad con SO legados): RSA de 3072 o 4096 bits con función hash SHA-256 o SHA-384 (conforme a FIPS 186-5).',
      '',
      'B. CORREOS ELECTRÓNICOS DE MÁXIMA CONFIDENCIALIDAD (OpenPGP RFC 9580 / S/MIME):',
      '   • Arquitectura: Cifrado Híbrido Asimétrico + Simétrico.',
      '   • 1. Cifrado del Cuerpo y Adjuntos (Simétrico):',
      '     - Algoritmo: AES-256 en modo GCM (Autenticado / AEAD) o ChaCha20-Poly1305.',
      '     - Longitud de Clave: 256 bits (máximo nivel de seguridad disponible, resistente ante computación cuántica por algoritmo de Grover).',
      '   • 2. Gestión e Intercambio de Clave Asimétrica:',
      '     - Algoritmo: ECDH sobre Curve25519 (256 bits) o NIST P-384 / P-521; o RSA de 4096 bits.',
      '   • 3. Firma e Integridad del Correo:',
      '     - Algoritmo: Ed25519 o RSA-4096 con función de resumen SHA-512.',
    ],
    keyTakeaways: [
      'Firma de Código: Ed25519 (256 b) o RSA-3072/4096 b (FIPS 186-5).',
      'Correo Ultra-Confidencial: AES-256-GCM (simétrico) + Curve25519 / RSA-4096 (asimétrico) + SHA-512.',
      'Cumple estrictamente con las directrices NIST SP 800-57 y RFC 9580 (Crypto Refresh).',
    ],
    tags: ['Code Signing', 'AES-256', 'Ed25519', 'Curve25519', 'NIST SP 800-57', 'RFC 9580'],
    apaCitation: '(NIST SP 800-57 Part 1 Rev. 5, 2020; RFC 9580, 2024; FIPS PUB 186-5, 2023)',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  },
];
