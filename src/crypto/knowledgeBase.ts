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
    categoryLabel: 'Estegoanálisis y Fuerza Bruta',
    question: '¿Qué tipo de ataque permite obtener la información oculta mediante la técnica de esteganografía?',
    shortSummary:
      'Para extraer la información oculta se emplean técnicas de Estegoanálisis y Ataques de Fuerza Bruta / Diccionario contra la clave esteganográfica (Stego-Key), junto con análisis estadístico (Chi-cuadrado) y extracción por portador conocido.',
    detailedContent: [
      '• Concepto de Ataque en Esteganografía: Cuando los datos ocultos dentro del portador están protegidos por una contraseña o dispersos mediante un generador pseudoaleatorio basado en una clave secreta (Stego-Key), el método principal para recuperar la información es el Ataque de Fuerza Bruta o Ataque de Diccionario.',
      '• 1. Ataque de Fuerza Bruta / Diccionario (Stego-Key Brute Force): Consiste en iterar exhaustivamente o mediante listas de contraseñas (wordlists como RockYou) sobre el algoritmo de extracción (usando herramientas como Stegcracker o Stegdetect) hasta que el checksum o cabecera del archivo oculto valide la contraseña correcta y desensamble el mensaje.',
      '• 2. Análisis Estadístico (Prueba de Chi-cuadrado y Análisis PoVs): Detecta anomalías estadísticas en los bits menos significativos (LSB) para determinar la existencia y longitud del mensaje antes de iniciar la extracción forzada.',
      '• 3. Ataque por Portador Conocido (Known-Cover Attack): Si el atacante posee la imagen original sin modificar, una resta binaria directa (XOR / diferencia matricial) extrae inmediatamente todos los bits modificados sin necesidad de conocer la clave.',
      '• 4. Ataque por Mensaje Conocido (Known-Message Attack): Si se conoce un fragmento del texto oculto, se analiza la correlación posicional para deducir la semilla de dispersión o el algoritmo de incrustación.',
    ],
    keyTakeaways: [
      'Ataque de Fuerza Bruta / Diccionario = Prueba sistemática de contraseñas/semillas para romper la clave esteganográfica (Stego-Key).',
      'Estegoanálisis Estadístico (Chi-cuadrado) = Comprueba la presencia del mensaje oculto.',
      'Known-Cover Attack = Resta directa de matrices entre la imagen original y la portadora modificada.',
    ],
    tags: ['Fuerza Bruta', 'Stego-Key', 'Estegoanálisis', 'Chi-cuadrado', 'Known-Cover', 'Stegcracker'],
    apaCitation: '(Katsikeas et al., 2021; Katzenbeisser & Petitcolas, 2000; Westfeld & Pfitzmann, 1999)',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  },
  {
    id: 'qa-5-estegoanalisis-casos-uso',
    category: 'esteganografia',
    categoryLabel: 'Casos de Uso de Fuerza Bruta y Estegoanálisis',
    question: '¿En qué casos prácticos se utiliza el ataque de fuerza bruta en ciberseguridad?',
    shortSummary:
      'El ataque de fuerza bruta se utiliza fundamentalmente para vulnerar mecanismos de autenticación y claves: Cuentas de usuario (Password Spraying), Redes Wi-Fi (WPA2/WPA3 Handshake y WPS), Servicios SSH (Puerto 22) y Servidores Web (Formularios de Login y APIs).',
    detailedContent: [
      '1. Ataque a Cuentas de Usuario (Active Directory / Credential Stuffing / Password Spraying):',
      '   • Prueba iterativa de contraseñas comunes sobre identidades corporativas o bases de datos filtradas para eludir bloqueos por intentos fallidos (MITRE ATT&CK T1110.003; NIST SP 800-63B).',
      '2. Ataque a Redes Wi-Fi (SSID / WPA2-PSK 4-Way Handshake / PIN WPS):',
      '   • Captura pasiva del intercambio de 4 vías (EAPOL Handshake) o paquetes PMKID y posterior descifrado offline mediante GPU (Hashcat/Aircrack-ng); o fuerza bruta contra el PIN de 8 dígitos de Wi-Fi Protected Setup (WPS Pixie Dust / Reaver; IEEE 802.11i).',
      '3. Ataque a Servicios de Administración Remota SSH (Puerto 22):',
      '   • Botnets automatizadas que lanzan ataques continuos de diccionario contra credenciales por defecto (root/admin/toor) en servidores expuestos en Internet (RFC 4252 / RFC 4251).',
      '4. Ataque a Servidores Web y Paneles de Control (HTTP POST / APIs / CMS):',
      '   • Ataques masivos de fuerza bruta a formularios de autenticación web (como /wp-login.php de WordPress, phpMyAdmin, APIs REST sin rate-limiting o Basic Auth) para obtener acceso de administrador (OWASP Top 10: Identification and Authentication Failures).',
      '5. Extracción de Secretos Esteganográficos y Archivos Comprimidos:',
      '   • Fuerza bruta a claves esteganográficas (Stego-Keys) en imágenes portadoras y a contenedores cifrados (ZIP/RAR/KeePass) interceptados en investigaciones forenses.',
    ],
    keyTakeaways: [
      'Cuentas de Usuario: Vulneración de credenciales débiles (NIST SP 800-63B / MITRE T1110).',
      'Wi-Fi: Crackeo offline de 4-way handshakes WPA2 y vulnerabilidades WPS (IEEE 802.11i).',
      'SSH (Puerto 22): Intentos automatizados de intrusión remota (RFC 4252).',
      'Servidores Web: Fuerza bruta a formularios de login y endpoints HTTP (OWASP Top 10).',
    ],
    tags: ['Fuerza Bruta', 'Cuentas de Usuario', 'Wi-Fi WPA2', 'SSH Puerto 22', 'Servidores Web', 'MITRE T1110', 'NIST SP 800-63B', 'OWASP'],
    apaCitation: '(NIST SP 800-63B, 2020; MITRE ATT&CK T1110, 2024; OWASP, 2021; IEEE 802.11i; RFC 4252)',
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
