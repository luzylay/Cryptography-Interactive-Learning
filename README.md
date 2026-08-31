# Criptografia Interactiva: Plataforma de Aprendizaje y Simulacion de Criptosistemas Clasicos

Plataforma web de alta precision orientada al estudio teorico y experimental de **criptosistemas clasicos**, algoritmos de sustitucion monoalfabetica y polialfabetica, cifrado matricial, tecnicas de transposicion y herramientas de criptoanalisis estadistico.

[![Despliegue GitHub Pages](https://img.shields.io/badge/Despliegue-GitHub%20Pages-334155.svg)](https://luzylay.github.io/Cryptography-Interactive-Learning/)
[![React 19](https://img.shields.io/badge/React-19.0.0-1e293b.svg)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4.0.0-475569.svg)](https://tailwindcss.com/)
[![TypeScript 5.7](https://img.shields.io/badge/TypeScript-5.7.0-334155.svg)](https://www.typescriptlang.org/)
[![Licencia MIT](https://img.shields.io/badge/Licencia-MIT-0f172a.svg)](LICENSE)
[![Seguridad SSDLC](https://img.shields.io/badge/Seguridad-SSDLC%20%2F%20SSDF-1e293b.svg)](SECURITY.md)
[![Arquitectura SSD](https://img.shields.io/badge/Arquitectura-UML%20SSD-334155.svg)](docs/ARCHITECTURE_AND_SECURITY.md)

---

## 1. Caracteristicas del Sistema

### 1.1 Simulador del Disco Cifrador de Alberti (Leon Battista Alberti, c. 1466)
* Simulacion visual vectorial (SVG) con anillos concentricos moviles.
* Soporte para giro manual continuo, arrastre tactil (*drag & drop*) y saltos discretos por pasos.
* Rayo indicador de correspondencia y calculo de desfase angular $\delta = (\theta_{\text{ext}} - \theta_{\text{int}}) \pmod N$.
* Modos de operacion estatica (monoalfabetica) y dinamica con desplazamiento progresivo polialfabetico cada $k$ caracteres.

### 1.2 Adaptabilidad de Alfabetos y Anillos Modulares
* **Castellano ($\text{mod } 27$ con letra Enie):** $A=0, \dots, N=13, \tilde{N}=14, O=15, \dots, Z=26$.
* **Internacional / Ingles ($\text{mod } 26$ sin Enie):** $A=0, \dots, Z=25$.
* **Historico de Alberti (24 caracteres):** Alfabeto exterior en mayusculas latinas y digitos 1 a 4; disco interior en minusculas con el caracter $\&$.

### 1.3 Catalogo de Criptosistemas Implementados
* **Cesar y Afin:** Desplazamiento lineal y transformacion $C_i = (a \cdot M_i + b) \pmod m$ con verificacion de coprimatidad ($\text{mcd}(a, m) = 1$) e inversos modulares mediante el algoritmo extendido de Euclides.
* **Tabula Recta de Vigenere, Beaufort y Autoclave:** Matrices de $m \times m$ con iluminacion de interseccion y extension dinamica de clave.
* **Matriz 5x5 de Playfair:** Cifrado digramico con tratamiento de colisiones, sustitucion $I/J$ y reglas geometricas de fila, columna y rectangulo.
* **Cifrado Matricial de Hill ($2\times 2$ y $3\times 3$):** Evaluacion de determinantes modulares $\det(K) \pmod m$, calculo formal de matrices adjuntas y vectores de transformacion lineal.
* **Transposicion por Columnas y Escitala Espartana:** Permutacion columnar regular e irregular con clave alfabetica y modelado de baston cilindrico.

### 1.4 Modulo de Criptoanalisis Estadistico
* Histograma de frecuencias de monogramas en tiempo real frente a perfiles estandar del espanol e ingles.
* Calculo del Indice de Coincidencia de Friedman ($IC$) para clasificacion monoalfabetica versus polialfabetica.
* Factorizacion de distancias e identificacion de repeticiones mediante el Test de Kasiski.
* Evaluacion automatizada de fuerza bruta con ordenamiento estadistico por producto punto de frecuencias.

### 1.5 Evaluacion y Ejercicios Practicos
* Generador parametrizado de problemas de cifrado, descifrado y deduccion de claves.
* Asistente interactivo integrado de rueda de calculo modular.
* Solucionario detallado con justificacion matematica paso a paso y registro de progreso.

---

## 2. Fundamentos Matematicos y Algebraicos

| Criptosistema | Ecuacion de Cifrado | Ecuacion de Descifrado | Condicion de Biyectividad |
| :--- | :--- | :--- | :--- |
| **Cesar** | $C_i = (M_i + k) \pmod m$ | $M_i = (C_i - k + m) \pmod m$ | $\forall k \in \mathbb{Z}$ |
| **Afin** | $C_i = (a \cdot M_i + b) \pmod m$ | $M_i = a^{-1} \cdot (C_i - b) \pmod m$ | $\text{mcd}(a, m) = 1$ |
| **Vigenere** | $C_i = (M_i + K_{i \bmod L}) \pmod m$ | $M_i = (C_i - K_{i \bmod L} + m) \pmod m$ | $K \neq \emptyset$ |
| **Beaufort** | $C_i = (K_{i \bmod L} - M_i + m) \pmod m$ | $M_i = (K_{i \bmod L} - C_i + m) \pmod m$ | Involutivo ($\mathcal{E} \equiv \mathcal{D}$) |
| **Hill ($n\times n$)** | $\vec{C} = K \cdot \vec{M} \pmod m$ | $\vec{M} = K^{-1} \cdot \vec{C} \pmod m$ | $\text{mcd}(\det(K), m) = 1$ |

---

## 3. Estructura del Software por Capas y Tecnologias

El diseno del software aplica **Clean Architecture** separando de forma estricta la interfaz grafica del nucleo de computo criptografico puro:

| Capa / Directorio | Tecnologias Principales | Proposito y Responsabilidad |
| :--- | :--- | :--- |
| **`src/crypto/`** *(Dominio Puro)* | TypeScript 5.7 (Agnostico del DOM) | Logica algebraica, transformaciones matriciales, algoritmos de cifrado y generador de ejercicios. |
| **`src/components/tabs/`** *(Vistas)* | React 19, Lucide Icons, Recharts | Controladores de flujo y pantallas principales (Laboratorio, Practica, Criptoanalisis con graficos, Teoria). |
| **`src/components/visualizers/`** *(Visualizacion)* | React 19, Tailwind CSS v4, Recharts, SVG | Componentes graficos interactivos (Disco de Alberti SVG, Tabula Recta, Matrices de Hill, Histogramas Recharts). |
| **`tests/`** *(Validacion)* | Node.js Test Runner Nativo | Pruebas unitarias de invariantes matematicos, simetria de descifrado y seguridad de entradas. |
| **`.github/workflows/`** *(CI/CD)* | GitHub Actions | Automatizacion de integracion continua, compilacion y despliegue a GitHub Pages. |
| **`docs/`** *(Documentacion)* | Markdown, Mermaid UML | Diagramas de Secuencia del Sistema (SSD), modelo STRIDE y manuales de arquitectura. |

La documentacion formal de arquitectura y los **Diagramas de Secuencia del Sistema (SSD en notacion UML)** se encuentran detallados en:
* [Especificacion Tecnica de Arquitectura y SSD](docs/ARCHITECTURE_AND_SECURITY.md)

---

## 4. Marco de Seguridad y Desarrollo Seguro (SSDLC)

El proyecto aplica las pautas del **Marco de Desarrollo de Software Seguro (NIST SP 800-218 SSDF)** y analisis de amenazas **STRIDE**:

* **Ejecucion 100% Client-Side:** No existe persistencia remota ni transmision de textos, mensajes en claro o claves criptograficas a traves de la red.
* **Sanitizacion Estricta:** Filtrado exhaustivo por listas blancas en la normalizacion de caracteres para neutralizar inyecciones de codigo (DOM XSS).
* **Control de Limites Computacionales:** Restriccion preventiva en analisis de patrones de texto para mitigar denegacion de servicio local (DoS).
* **Validacion Matematica Defensiva:** Prevencion de singularidades y calculos indefinidos verificando la coprimatidad antes de operaciones con inversos modulares.

Para consultar el analisis completo de amenazas STRIDE y la politica de divulgacion responsable, revise:
* [Politica de Seguridad y Marco SSDLC](SECURITY.md)

---

## 5. Pruebas Automatizadas y Verificacion de Calidad

El proyecto incluye una suite de pruebas unitarias y de resiliencia ejecutadas mediante el runner nativo de Node.js:

```bash
# Ejecutar suite de pruebas de seguridad y consistencia criptografica
npm run test

# Verificacion de tipos estaticos en TypeScript
npm run typecheck

# Compilacion para produccion
npm run build
```

---

## 6. Instalacion y Ejecucion Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/luzylay/Cryptography-Interactive-Learning.git
cd Cryptography-Interactive-Learning

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Compilar aplicacion
npm run build
```

---

## 7. Despliegue en GitHub Pages

El proyecto cuenta con un flujo de trabajo de integracion continua automatizado mediante **GitHub Actions** en `.github/workflows/deploy.yml`.

Para activar el despliegue en su bifurcacion (*fork*):
1. Configure en **Settings** > **Pages** el origen de despliegue como **GitHub Actions**.
2. Al realizar un `git push` a la rama `main`, la aplicacion se compilara y desplegara automaticamente en `https://<usuario>.github.io/<repositorio>/`.

---

## 8. Referencias Bibliograficas (Normas APA 7.ª Edicion)

1. **Ramio Aguirre, J.** (1999). *Aplicaciones criptograficas* (Capitulo 3: Criptosistemas clasicos, 2.ª ed., pp. 1–105). Departamento de Publicaciones de la Escuela Universitaria de Informatica, Universidad Politecnica de Madrid (UPM). ISBN: 84-87238-57-2 / 83-87238-57-2. Deposito Legal M-23136-1999. https://dialnet.unirioja.es/servlet/libro?codigo=200844
2. **Alberti, L. B.** (1568). *De componendis cyfris [Tratado de cifras / De Cifris]*. En *Opuscoli morali di Leon Batista Alberti gentil'huomo firentino* (pp. 200–245). Appresso Francesco Franceschi. (Manuscrito original redactado c. 1466). https://archive.org/details/opvscolimoralidi00albe
3. **Hill, L. S.** (1929). Cryptography in an algebraic alphabet. *The American Mathematical Monthly*, 36(6), 306–312. https://www.jstor.org/stable/2298294
4. **Hill, L. S.** (1931). Concerning certain linear transformation apparatus of cryptography. *The American Mathematical Monthly*, 38(3), 135–154. https://www.jstor.org/stable/2300963
5. **Vigenere, B. de.** (1586). *Traicte des chiffres, ou Secretes manieres d'escrire*. Chez Abel L'Angelier. Bibliotheque nationale de France (Gallica). https://gallica.bnf.fr/ark:/12148/bpt6k1052608j
6. **Kasiski, F. W.** (1863). *Die Geheimschriften und die Dechiffrir-Kunst [Las escrituras secretas y el arte de descifrar]*. E. S. Mittler und Sohn. Bayerische Staatsbibliothek Munchen. https://www.digitale-sammlungen.de/en/view/bsb10684725
7. **Friedman, W. F.** (1922). *The index of coincidence and its applications in cryptography* (War Department Document No. 1083 / Riverbank Publication No. 22). Government Printing Office. https://archive.org/details/41761039080018
8. **Suetonio Tranquilo, C.** (1985). *Vida de los doce cesares (Libro I: Divus Iulius, cap. 56)* (R. M. Agudo Cubas, Trad.). Editorial Gredos. Perseus Digital Library, Tufts University. https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.02.0061
9. **Kahn, D.** (1996). *The codebreakers: The comprehensive history of secret communication from ancient times to the internet* (2.ª ed. rev.). Scribner. ISBN: 978-0684831305. https://archive.org/details/codebreakersstor0000kahn_k4s3
10. **National Institute of Standards and Technology.** (2022). *Secure Software Development Framework (SSDF) Version 1.1: Recommendations for Mitigating the Risk of Software Vulnerabilities* (NIST Special Publication 800-218). U.S. Department of Commerce. https://doi.org/10.6028/NIST.SP.800-218

---

## 9. Licencia

Este proyecto se distribuye bajo la licencia **MIT**. Consulte el archivo `LICENSE` para mas detalles.
