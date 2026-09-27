<div align="center">
  <img src="assets/readme/banner.png" alt="Criptografía Interactiva — banner" width="100%" />

  # Criptografía Interactiva
  ### Plataforma web para el estudio teórico y experimental de criptosistemas clásicos, discos cifradores y criptoanálisis estadístico

  <br/>

  [![Despliegue GitHub Pages](https://img.shields.io/badge/Despliegue-GitHub%20Pages-22c55e?style=flat&logo=githubpages&logoColor=white)](https://luzylay.github.io/Cryptography-Interactive-Learning/)
  [![React 19](https://img.shields.io/badge/React-19.0.0-20232A?style=flat&logo=react&logoColor=61DAFB)](https://react.dev/)
  [![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4.0.0-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
  [![TypeScript 5.7](https://img.shields.io/badge/TypeScript-5.7.0-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite 8](https://img.shields.io/badge/Vite-8.0.5-646CFF?style=flat&logo=vite&logoColor=white)](https://vite.dev/)
  [![Licencia MIT](https://img.shields.io/badge/Licencia-MIT-F59E0B?style=flat&logo=open-source-initiative&logoColor=white)](LICENSE)
  [![Seguridad SSDLC](https://img.shields.io/badge/Seguridad-SSDLC%20%2F%20SSDF-E11D48?style=flat&logo=shield&logoColor=white)](SECURITY.md)

  <br/>

  [**Demo en vivo**](https://luzylay.github.io/Cryptography-Interactive-Learning/) · [**Fundamentos matemáticos**](docs/MATHEMATICAL_FOUNDATIONS.md) · [**Arquitectura y seguridad**](docs/ARCHITECTURE_AND_SECURITY.md) · [**Reportar bug**](https://github.com/luzylay/Cryptography-Interactive-Learning/issues)
</div>

---

## Demo

<div align="center">
  <img src="assets/readme/demo.gif" alt="Demo interactiva de la plataforma" width="90%" />
  <br/>
  <em>Cifra, descifra y analiza en tiempo real — todo en el navegador, sin backend y con procesamiento 100% local.</em>
</div>

---

## ¿Qué encontrarás?

- **Disco cifrador de Alberti (c. 1466)** — simulación SVG interactiva con anillos concéntricos, arrastre y giro manual, cálculo de desfase angular y modo polialfabético progresivo.
- **Criptosistemas clásicos (S06–S10)** — César, Sustitución Afín ($a \cdot x + b$), Tablero de Polibio ($5\times 5$), Tabula Recta de Vigenère, Cifrador de Beaufort, Clave Continua (Autoclave), Matriz Playfair, Cifrado matricial de Hill ($2\times 2$ y $3\times 3$), Escítala espartana y Transposición columnar.
- **Criptosistemas modernos y seguridad (S11–S15)** — Bases numéricas y lógica XOR bitwise, simulación de rondas Feistel en DES/3DES, transformaciones de estado AES-128 (SubBytes, ShiftRows, MixColumns), efecto avalancha en funciones Hash SHA-256, simulador de firma digital RSA con canal inseguro y explorador de la cadena de confianza TLS / PKI.
- **Alfabetos adaptables y anillos modulares** — Castellano (mód. 27 con Ñ), Internacional (mód. 26 sin Ñ) e histórico de Alberti (24 caracteres).
- **Criptoanálisis estadístico** — histogramas en tiempo real con Recharts comparando frecuencias observadas vs. perfiles teóricos en español/inglés, Índice de Coincidencia de Friedman ($IC$), Test de Kasiski y fuerza bruta evaluada por producto punto.
- **Estudio y autoevaluación guiada** — generador dinámico de retos de examen con solucionarios matemáticos detallados y asistentes interactivos dedicados.
- **100% client-side (Zero-Knowledge)** — sin persistencia remota, sanitización estricta por listas blancas y validación matemática defensiva.

---

## Galería de Capturas Reales

<div align="center">

### Disco Cifrador de Alberti (c. 1466)
<img src="assets/readme/alberti-disk.png" alt="Simulador real del disco de Alberti" width="85%" />

<br/><br/>

### Cifrador César y Variantes Afines ($C = (a \cdot M + b) \pmod m$)
<img src="assets/readme/caesar-cipher.png" alt="Módulo real del cifrado César y Afín" width="85%" />

<br/><br/>

### Matriz Tabula Recta Dinámica de Vigenère ($27\times 27$)
<img src="assets/readme/vigenere-tabula.png" alt="Tabula Recta de Vigenère real" width="85%" />

<br/><br/>

### Tablero Fraccionario de Polibio ($5\times 5$)
<img src="assets/readme/polybius-grid.png" alt="Cuadrícula interactiva de Polibio" width="85%" />

<br/><br/>

### Cifrador Matricial de Hill ($2\times 2$ y $3\times 3$) con Inversión Modular
<img src="assets/readme/hill-matrix.png" alt="Cifrado Hill real con cálculo de determinante" width="85%" />

<br/><br/>

### Criptoanálisis Estadístico y Distribución de Frecuencias (Recharts)
<img src="assets/readme/frequency-analysis.png" alt="Panel de análisis de frecuencias y Kasiski" width="85%" />

<br/><br/>

### Simulador de Rondas Feistel (DES & 3DES)
<img src="assets/readme/des-feistel.png" alt="Estructura de Feistel y permutaciones DES" width="85%" />

<br/><br/>

### Pipeline de Firma Digital RSA con Detección de Manipulación en Tránsito
<img src="assets/readme/digital-signature.png" alt="Simulador pedagógico de firma digital RSA" width="85%" />

<br/><br/>

### Matriz de Decisión y Comparador de Criptosistemas
<img src="assets/readme/decision-matrix.png" alt="Matriz de decisión comparativa" width="85%" />

<br/><br/>

### Diseño Adaptativo para Dispositivos Móviles
<img src="assets/readme/mobile-view.png" alt="Captura real en vista móvil" width="45%" />

</div>

---

## Stack Tecnológico

<div align="center">
  <img src="https://skillicons.dev/icons?i=react,ts,vite,tailwind,html,css,githubactions,git&theme=dark" alt="Stack tecnológico" />
</div>

<br/>

| Capa | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Dominio puro** (`src/crypto/`) | TypeScript 5.7 | Lógica algebraica y modular agnóstica de React y del DOM. |
| **Vistas** (`src/components/tabs/`) | React 19 + Lucide Icons + Recharts | Control de estado, vistas pedagógicas y autoevaluación guiada. |
| **Visualizadores** (`src/components/visualizers/`) | React 19 + Tailwind CSS v4 + SVG | Discos giratorios vectoriales, Tabula Recta y matrices interactivas. |
| **Tests de seguridad** (`tests/`) | Node.js Test Runner nativo | 23 pruebas de regresión, simetría e invariantes criptográficos. |
| **CI/CD** (`.github/workflows/`) | GitHub Actions | Compilación determinista y despliegue automatizado a GitHub Pages. |
| **Documentación** (`docs/`) | Markdown + Mermaid UML + MathJax | Especificación formal de arquitectura, modelos y normas APA 7. |

> **Arquitectura Limpia (Clean Architecture):** El núcleo criptográfico (`src/crypto/`) está completamente desacoplado de la interfaz gráfica. Los detalles de diseño se encuentran en la [Especificación de Arquitectura y Seguridad](docs/ARCHITECTURE_AND_SECURITY.md).

---

## Instalación Rápida

```bash
# 1. Clonar el repositorio
git clone https://github.com/luzylay/Cryptography-Interactive-Learning.git

# 2. Acceder al directorio
cd Cryptography-Interactive-Learning

# 3. Instalar dependencias
npm install

# 4. Iniciar servidor de desarrollo local
npm run dev
```

### Comandos de Calidad

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo local de Vite (`http://localhost:8443`). |
| `npm run build` | Compila el empaquetado de producción optimizado en `dist/`. |
| `npm test` | Ejecuta la suite de regresión matemática y pruebas de seguridad SSDLC. |
| `npm run typecheck` | Ejecuta la verificación estricta de tipos de TypeScript (`tsc --noEmit`). |
| `npm run format` | Aplica formateo consistente de código con `oxfmt`. |

---

## Seguridad y Calidad (SSDLC)

- **Marco de Desarrollo Seguro:** Alineado con el estándar **NIST SP 800-218 (SSDF)** y modelo de amenazas **STRIDE**.
- **Ejecución 100% Client-Side:** Ningún texto, clave ni mensaje sale del navegador del usuario. Cero telemetría de contenido.
- **Sanitización Estricta:** Filtrado por listas blancas (*whitelist*) de caracteres válidos para neutralizar DOM XSS.
- **Aritmética Modular Defensiva:** Comprobación estricta de coprimalidad $\gcd(a, m) = 1$ antes de calcular inversos modulares o invertir matrices de Hill.
- **Verificación Continua en CI:** La suite de tests automatizada valida la integridad criptográfica en cada *push*.

Consulte las políticas completas en [SECURITY.md](SECURITY.md) y el análisis STRIDE en [docs/ARCHITECTURE_AND_SECURITY.md](docs/ARCHITECTURE_AND_SECURITY.md).

---

## Documentación Completa

| Documento | Contenido Principal |
| :--- | :--- |
| [**Fundamentos Matemáticos**](docs/MATHEMATICAL_FOUNDATIONS.md) | Ecuaciones paso a paso, identidad de Bézout, matrices inversas y criptoanálisis. |
| [**Arquitectura y Seguridad**](docs/ARCHITECTURE_AND_SECURITY.md) | Diagramas de secuencia UML (SSD), modelo STRIDE y capas Clean Architecture. |
| [**Guía de Contribución**](CONTRIBUTING.md) | Flujo de trabajo con Git, estándares de código, commits convencionales y Pull Requests. |
| [**Política de Seguridad**](SECURITY.md) | Modelo de ejecución local, mitigaciones STRIDE y reporte de vulnerabilidades. |
| [**Historial de Cambios**](CHANGELOG.md) | Registro de versiones conforme a Keep a Changelog y SemVer. |

---

## Referencias Bibliográficas (Normas APA 7.ª Edición)

1. **Ramió Aguirre, J.** (1999). *Aplicaciones criptográficas* (Capítulo 3: Criptosistemas clásicos, 2.ª ed., pp. 1–105). Departamento de Publicaciones de la Escuela Universitaria de Informática, Universidad Politécnica de Madrid (UPM). ISBN: 84-87238-57-2. Depósito Legal M-23136-1999. https://dialnet.unirioja.es/servlet/libro?codigo=200844
2. **Alberti, L. B.** (1568). *De componendis cyfris [Tratado de cifras / De Cifris]*. En *Opuscoli morali di Leon Batista Alberti gentil'huomo firentino* (pp. 200–245). Appresso Francesco Franceschi. (Manuscrito original redactado c. 1466). https://archive.org/details/opvscolimoralidi00albe
3. **Hill, L. S.** (1929). Cryptography in an algebraic alphabet. *The American Mathematical Monthly*, 36(6), 306–312. https://www.jstor.org/stable/2298294
4. **Hill, L. S.** (1931). Concerning certain linear transformation apparatus of cryptography. *The American Mathematical Monthly*, 38(3), 135–154. https://www.jstor.org/stable/2300963
5. **Vigenère, B. de.** (1586). *Traicté des chiffres, ou Secrètes manières d'escrire*. Chez Abel L'Angelier. Bibliothèque nationale de France (Gallica). https://gallica.bnf.fr/ark:/12148/bpt6k1052608j
6. **Kasiski, F. W.** (1863). *Die Geheimschriften und die Dechiffrir-Kunst [Las escrituras secretas y el arte de descifrar]*. E. S. Mittler und Sohn. Bayerische Staatsbibliothek München. https://www.digitale-sammlungen.de/en/view/bsb10684725
7. **Friedman, W. F.** (1922). *The index of coincidence and its applications in cryptography* (War Department Document No. 1083 / Riverbank Publication No. 22). Government Printing Office. https://archive.org/details/41761039080018
8. **Suetonio Tranquilo, C.** (1985). *Vida de los doce césares (Libro I: Divus Iulius, cap. 56)* (R. M. Agudo Cubas, Trad.). Editorial Gredos. Perseus Digital Library, Tufts University. https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.02.0061
9. **Kahn, D.** (1996). *The codebreakers: The comprehensive history of secret communication from ancient times to the internet* (2.ª ed. rev.). Scribner. ISBN: 978-0684831305. https://archive.org/details/codebreakersstor0000kahn_k4s3
10. **National Institute of Standards and Technology.** (1999). *Data Encryption Standard (DES)* (FIPS PUB 46-3). U.S. Department of Commerce. https://csrc.nist.gov/publications/detail/fips/46-3/final
11. **Katsikeas, S., Johnson, P., Ekstedt, M., & Lagerström, R.** (2021). Research communities in cyber security: A comprehensive literature review. *Computer Science Review*, 42, 100431. Elsevier. https://doi.org/10.1016/j.cosrev.2021.100431
12. **National Institute of Standards and Technology.** (2022). *Secure Software Development Framework (SSDF) Version 1.1: Recommendations for Mitigating the Risk of Software Vulnerabilities* (NIST Special Publication 800-218). U.S. Department of Commerce. https://doi.org/10.6028/NIST.SP.800-218

---

## Contribuciones

Las contribuciones son bienvenidas. Revisa [CONTRIBUTING.md](CONTRIBUTING.md) para conocer el flujo de trabajo, estándares de código y directrices de Pull Requests.

---

## Licencia

Distribuido bajo la Licencia **MIT**. Consulta [LICENSE](LICENSE) para más detalles.

> *Nota:* El campo `"private": true` en `package.json` se utiliza únicamente para prevenir publicaciones accidentales al registro de npm. El proyecto es de código abierto.

---

## ⭐ ¿Te gustó el proyecto? ¡Déjanos tu estrella!

Si esta plataforma interactiva te ayudó a aprender, experimentar o te pareció interesante:

1. Ve a la esquina superior derecha de esta página en GitHub.
2. Haz clic en el botón **`Star`** (Estrella).

> **¡Muchas gracias!** Tu apoyo con una estrella ayuda a que más estudiantes, docentes y apasionados de la seguridad informática puedan conocer y utilizar este recurso educativo abierto.
