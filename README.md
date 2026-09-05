# Criptografía Interactiva: Plataforma de Aprendizaje y Simulación de Criptosistemas Clásicos

Plataforma web interactiva de alta precisión orientada al estudio teórico y experimental de **criptosistemas clásicos**, algoritmos de sustitución monoalfabética y polialfabética, cifrado matricial, técnicas de transposición y herramientas de criptoanálisis estadístico.

[![Despliegue GitHub Pages](https://img.shields.io/badge/Despliegue-GitHub%20Pages-22c55e?style=flat&logo=githubpages&logoColor=white)](https://luzylay.github.io/Cryptography-Interactive-Learning/)
[![React 19](https://img.shields.io/badge/React-19.0.0-20232A?style=flat&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4.0.0-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript 5.7](https://img.shields.io/badge/TypeScript-5.7.0-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite 8](https://img.shields.io/badge/Vite-8.0.5-646CFF?style=flat&logo=vite&logoColor=white)](https://vite.dev/)
[![Licencia MIT](https://img.shields.io/badge/Licencia-MIT-F59E0B?style=flat&logo=open-source-initiative&logoColor=white)](LICENSE)
[![Seguridad SSDLC](https://img.shields.io/badge/Seguridad-SSDLC%20%2F%20SSDF-E11D48?style=flat&logo=shield&logoColor=white)](SECURITY.md)
[![Arquitectura SSD](https://img.shields.io/badge/Arquitectura-UML%20SSD-8B5CF6?style=flat&logo=diagram-next&logoColor=white)](docs/ARCHITECTURE_AND_SECURITY.md)
[![Fundamentos Matemáticos](https://img.shields.io/badge/Matemáticas-Guía%20Detallada-0EA5E9?style=flat&logo=scipy&logoColor=white)](docs/MATHEMATICAL_FOUNDATIONS.md)

---

## 1. Características del Sistema

### 1.1 Simulador del Disco Cifrador de Alberti (Leon Battista Alberti, c. 1466)
* Simulación visual vectorial (SVG) con anillos concéntricos móviles.
* Soporte para giro manual continuo, arrastre táctil (*drag & drop*) y saltos discretos por pasos.
* Rayo indicador de correspondencia y cálculo de desfase angular $\delta = (\theta_{\text{ext}} - \theta_{\text{int}}) \pmod N$.
* Modos de operación estática (monoalfabética) y dinámica con desplazamiento progresivo polialfabético cada $k$ caracteres.

### 1.2 Adaptabilidad de Alfabetos y Anillos Modulares
* **Castellano (mód. 27 con letra Ñ):** $A=0, \dots, N=13, \text{Ñ}=14, O=15, \dots, Z=26$.
* **Internacional / Inglés (mód. 26 sin Ñ):** $A=0, \dots, Z=25$.
* **Histórico de Alberti (24 caracteres):** Alfabeto exterior en mayúsculas latinas y dígitos 1 a 4; disco interior en minúsculas con el carácter `&`.

### 1.3 Catálogo de Criptosistemas Implementados
* **César y Afín:** Desplazamiento lineal y transformación $C_i = (a \cdot M_i + b) \pmod m$ con verificación de coprimalidad ($\text{mcd}(a, m) = 1$) e inversos modulares mediante el algoritmo extendido de Euclides.
* **Tabula Recta de Vigenère, Beaufort y Autoclave:** Matrices de $m \times m$ con iluminación de intersección y extensión dinámica de clave.
* **Matriz 5x5 de Playfair:** Cifrado digrámico con tratamiento de colisiones, sustitución $I/J$ y reglas geométricas de fila, columna y rectángulo.
* **Cifrado Matricial de Hill ($2\times 2$ y $3\times 3$):** Evaluación de determinantes modulares $\det(K) \pmod m$, cálculo formal de matrices adjuntas y vectores de transformación lineal.
* **Transposición por Columnas y Escítala Espartana:** Permutación columnar regular e irregular con clave alfabética y modelado de bastón cilíndrico.

### 1.4 Módulo de Criptoanálisis Estadístico
* Histograma de frecuencias de monogramas en tiempo real frente a perfiles estándar del español e inglés.
* Cálculo del Índice de Coincidencia de Friedman ($IC$) para clasificación monoalfabética versus polialfabética.
* Factorización de distancias e identificación de repeticiones mediante el Test de Kasiski.
* Evaluación automatizada de fuerza bruta con ordenamiento estadístico por producto punto de frecuencias.

### 1.5 Evaluación y Ejercicios Prácticos
* Generador parametrizado de problemas de cifrado, descifrado y deducción de claves.
* Asistente interactivo integrado de rueda de cálculo modular.
* Solucionario detallado con justificación matemática paso a paso y registro de progreso.

---

## 2. Fundamentos Matemáticos y Algebraicos

Para una explicación exhaustiva con **ejemplos numéricos paso a paso, teoremas, identidades de Bézout, inversión de matrices $2\times 2$ y $3\times 3$ y criptoanálisis estadístico**, consulte el documento dedicado:
* 📘 [**Guía Completa de Fundamentos Matemáticos y Algebraicos**](docs/MATHEMATICAL_FOUNDATIONS.md)

### Resumen de Ecuaciones y Condiciones de Invertibilidad

| Criptosistema | Ecuación de Cifrado | Ecuación de Descifrado | Condición de Biyectividad / Invertibilidad |
| :--- | :--- | :--- | :--- |
| **César** | $C_i = (M_i + k) \pmod m$ | $M_i = (C_i - k + m) \pmod m$ | $\forall k \in \mathbb{Z}$ (Siempre biyectivo) |
| **Afín** | $C_i = (a \cdot M_i + b) \pmod m$ | $M_i = a^{-1} \cdot (C_i - b) \pmod m$ | $\text{mcd}(a, m) = 1$ (Existe inverso modular $a^{-1}$) |
| **Vigenère** | $C_i = (M_i + K_{i \bmod L}) \pmod m$ | $M_i = (C_i - K_{i \bmod L} + m) \pmod m$ | Longitud de clave $L \ge 1$ |
| **Beaufort** | $C_i = (K_{i \bmod L} - M_i + m) \pmod m$ | $M_i = (K_{i \bmod L} - C_i + m) \pmod m$ | Involutivo ($\mathcal{E} \equiv \mathcal{D}$, auto-inverso) |
| **Hill ($n\times n$)** | $\vec{C} = K \cdot \vec{M} \pmod m$ | $\vec{M} = K^{-1} \cdot \vec{C} \pmod m$ | $\det(K) \not\equiv 0$ y $\text{mcd}(\det(K), m) = 1$ |

### ¿Qué significa cada concepto a simple vista?
1. **Aritmética Modular ($\mathbb{Z}_m$):** Es la "matemática del reloj". Si un alfabeto tiene $m=27$ letras, el número 28 equivale a 1 ($28 \bmod 27 = 1$). El resultado siempre permanece dentro del alfabeto.
2. **Coprimalidad ($\text{mcd}(a, m) = 1$):** Significa que el multiplicador $a$ y el tamaño del alfabeto $m$ no comparten factores comunes salvo el 1. Esto garantiza que dos letras distintas nunca se conviertan en la misma letra cifrada.
3. **Inverso Modular ($a^{-1}$):** Es el número que al multiplicarse por $a$ da residuo 1 ($a \cdot a^{-1} \equiv 1 \pmod m$). Por ejemplo, en español ($m=27$), el inverso de $7$ es $4$ porque $7 \times 4 = 28 \equiv 1 \pmod{27}$.
4. **Matrices de Hill ($K^{-1}$):** Se agrupan las letras en vectores (de 2 en 2 o de 3 en 3) y se multiplican por una matriz secreta. Para descifrar, se calcula la matriz inversa utilizando la matriz adjunta y el inverso del determinante modular.
5. **Índice de Coincidencia ($IC$):** Mide la dispersión estadística de las letras. Un texto en español o cifrado César tiene $IC \approx 0.076$, mientras que un texto polialfabético o aleatorio tiene $IC \approx 0.037$.

---

## 3. Estructura del Software por Capas y Tecnologías

El diseño del software aplica **Clean Architecture** separando de forma estricta la interfaz gráfica del núcleo de cómputo criptográfico puro:

| Capa / Directorio | Tecnologías Principales | Propósito y Responsabilidad |
| :--- | :--- | :--- |
| **`src/crypto/`** *(Dominio Puro)* | TypeScript 5.7 (Agnóstico del DOM) | Lógica algebraica, transformaciones matriciales, algoritmos de cifrado y generador de ejercicios. |
| **`src/components/tabs/`** *(Vistas)* | React 19, Lucide Icons, Recharts | Controladores de flujo y pantallas principales (Laboratorio, Práctica, Criptoanálisis con gráficos, Teoría). |
| **`src/components/visualizers/`** *(Visualización)* | React 19, Tailwind CSS v4, Recharts, SVG | Componentes gráficos interactivos (Disco de Alberti SVG, Tabula Recta, Matrices de Hill, Histogramas Recharts). |
| **`tests/`** *(Validación)* | Node.js Test Runner Nativo | Pruebas unitarias de invariantes matemáticos, simetría de descifrado y seguridad de entradas. |
| **`.github/workflows/`** *(CI/CD)* | GitHub Actions | Automatización de integración continua, compilación y despliegue a GitHub Pages. |
| **`docs/`** *(Documentación)* | Markdown, Mermaid UML, MathJax/KaTeX | Diagramas SSD, modelo STRIDE, fundamentos matemáticos y manuales de arquitectura. |

La documentación técnica complementaria se encuentra detallada en:
* 📘 [Guía Completa de Fundamentos Matemáticos y Algebraicos](docs/MATHEMATICAL_FOUNDATIONS.md)
* 📐 [Especificación Técnica de Arquitectura, SSD y Seguridad](docs/ARCHITECTURE_AND_SECURITY.md)

---

## 4. Marco de Seguridad y Desarrollo Seguro (SSDLC)

El proyecto aplica las pautas del **Marco de Desarrollo de Software Seguro (NIST SP 800-218 SSDF)** y análisis de amenazas **STRIDE**:

* **Ejecución 100% Client-Side:** No existe persistencia remota ni transmisión de textos, mensajes en claro o claves criptográficas a través de la red.
* **Sanitización Estricta:** Filtrado exhaustivo por listas blancas en la normalización de caracteres para neutralizar inyecciones de código (DOM XSS).
* **Control de Límites Computacionales:** Restricción preventiva en análisis de patrones de texto para mitigar denegación de servicio local (DoS).
* **Validación Matemática Defensiva:** Prevención de singularidades y cálculos indefinidos verificando la coprimalidad antes de operaciones con inversos modulares.

Para consultar el análisis completo de amenazas STRIDE y la política de divulgación responsable, revise:
* [Política de Seguridad y Marco SSDLC](SECURITY.md)

---

## 5. Pruebas Automatizadas y Verificación de Calidad

El proyecto incluye una suite de pruebas unitarias y de resiliencia ejecutadas mediante el runner nativo de Node.js:

```bash
# Ejecutar suite de pruebas de seguridad y consistencia criptográfica
npm run test

# Verificación de tipos estáticos en TypeScript
npm run typecheck

# Compilación para producción
npm run build
```

---

## 6. Instalación y Ejecución Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/luzylay/Cryptography-Interactive-Learning.git
cd Cryptography-Interactive-Learning

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Compilar aplicación
npm run build
```

---

## 7. Despliegue en GitHub Pages

El proyecto cuenta con un flujo de trabajo de integración continua automatizado mediante **GitHub Actions** en `.github/workflows/deploy.yml`.

Para activar el despliegue en su bifurcación (*fork*):
1. Configure en **Settings** > **Pages** el origen de despliegue como **GitHub Actions**.
2. Al realizar un `git push` a la rama `main`, la aplicación se compilará y desplegará automáticamente en `https://<usuario>.github.io/<repositorio>/`.

---

## 8. Referencias Bibliográficas (Normas APA 7.ª Edición)

1. **Ramió Aguirre, J.** (1999). *Aplicaciones criptográficas* (Capítulo 3: Criptosistemas clásicos, 2.ª ed., pp. 1–105). Departamento de Publicaciones de la Escuela Universitaria de Informática, Universidad Politécnica de Madrid (UPM). ISBN: 84-87238-57-2 / 83-87238-57-2. Depósito Legal M-23136-1999. https://dialnet.unirioja.es/servlet/libro?codigo=200844
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

## Si este proyecto te fue de utilidad, aprendiste algo nuevo o te pareció interesante:

1. Ve a la **esquina superior derecha** de esta página en GitHub.
2. Haz clic en el botón **`⭐ Star`** (Estrella).

> **¡Muchísimas gracias de corazón!** ✨

---

## 9. Licencia

Este proyecto se distribuye bajo la licencia **MIT**. Consulte el archivo `LICENSE` para más detalles.
