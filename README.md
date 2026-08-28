# 🔐 Criptografía Interactiva · Interactive Classical Cryptography

Plataforma web educativa de alta precisión para el aprendizaje interactivo y práctico de **Criptosistemas Clásicos**, diseñada con simuladores visuales en tiempo real, cálculo modular riguroso y soporte adaptable para convenciones con y sin la letra **"Ñ"** ($\text{mod } 27$ vs $\text{mod } 26$).

[![GitHub Pages](https://img.shields.io/badge/Demo-GitHub%20Pages-amber.svg)](https://luzylay.github.io/Cryptography-Interactive-Learning/)
[![React 19](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

---

## 🌟 Características Principales

### 1. 🛞 Disco Cifrador de Alberti Interactivo (SVG)
- **Círculos Concéntricos Giratorios**: Simulación del primer criptosistema polialfabético de la historia (Leon Battista Alberti, siglo XVI).
- **Rotación por Arrastre (Drag & Drop / Touch)** y controles de paso fino (`-5`, `↶ -1`, `↷ +1`, `+5`).
- **Rayo Láser de Correspondencia**: Iluminación visual de los caracteres alineados entre el anillo exterior e interior.
- **Selector de Alineación**: Alineación rápida de caracteres base (ej. $A \leftrightarrow D$, $1 \leftrightarrow \&$).
- **Giro Progresivo Polialfabético**: Simulación de rotación automática del disco cada $N$ caracteres.

### 2. 🔤 Adaptabilidad Global de Alfabetos
- **Castellano (27 letras, $\text{mod } 27$ con Ñ)**: Estándar hispano ($A=0, \dots, N=13, \tilde{N}=14, O=15, \dots, Z=26$).
- **Internacional / Inglés (26 letras, $\text{mod } 26$ sin Ñ)**: Estándar anglosajón ($A=0, \dots, Z=25$).
- **Histórico de Alberti (24 caracteres)**: Alfabeto exterior en mayúsculas latinas + dígitos $1, 2, 3, 4$ y disco interior en minúsculas con $\&$.

### 3. 🧪 Simuladores Visuales de Criptosistemas
- **César y Cifrador Afín**: Desplazamiento lineal $k$ y función afín $C_i = (a \cdot M_i + b) \pmod m$ con verificación de coprimatidad ($\text{mcd}(a, m) = 1$) y cálculo de inversos modulares $a^{-1}$.
- **Tabula Recta de Vigenère y Beaufort**: Matriz interactiva de $m \times m$ con iluminación de coordenadas y modo Autoclave.
- **Matriz 5×5 de Playfair**: Cifrado digrámico con reglas geométricas ilustradas (misma fila, misma columna, rectángulo).
- **Cifrador de Hill ($2\times 2$ y $3\times 3$)**: Álgebra lineal modular con determinante $\det(K)$, matriz inversa $K^{-1}$ y producto vectorial paso a paso.
- **Transposición por Columnas y Escítala Espartana**: Reordenamiento por clave y simulación física del bastón cilíndrico.

### 4. 🔍 Laboratorio de Criptoanálisis
- **Histograma de Frecuencias en Vivo**: Comparación gráfica de monogramas del criptograma frente al perfil esperado del castellano o inglés.
- **Índice de Coincidencia (IC de Friedman)**: Detección automática de monoalfabéticos vs polialfabéticos.
- **Test de Kasiski**: Búsqueda de secuencias repetidas y factorización de distancias para deducir la longitud de clave $m$.
- **Descifrador por Fuerza Bruta del César**: Evaluación estadística de todas las rotaciones posibles ordenadas por probabilidad.

### 5. 🎯 Estudio de Ejercicios y Autoevaluación
- Generador ilimitado de problemas prácticos de cifrado, descifrado y deducción de claves.
- **Asistente de Rueda de Cifrado Lateral**: Resuelve ejercicios directamente en pantalla sin dibujar ni calcular a mano.
- Pistas guiadas, soluciones paso a paso con justificación matemática formal, racha de aciertos y puntaje.

---

## 🧮 Fundamentos Matemáticos

| Criptosistema | Fórmula de Cifrado | Fórmula de Descifrado | Condición de Invertibilidad |
| :--- | :--- | :--- | :--- |
| **César** | $C_i = (M_i + k) \pmod m$ | $M_i = (C_i - k + m) \pmod m$ | $\forall k \in \mathbb{Z}$ |
| **Afín** | $C_i = (a \cdot M_i + b) \pmod m$ | $M_i = a^{-1} \cdot (C_i - b) \pmod m$ | $\text{mcd}(a, m) = 1$ |
| **Vigenère** | $C_i = (M_i + K_{i \bmod L}) \pmod m$ | $M_i = (C_i - K_{i \bmod L} + m) \pmod m$ | $K \neq \emptyset$ |
| **Beaufort** | $C_i = (K_{i \bmod L} - M_i + m) \pmod m$ | $M_i = (K_{i \bmod L} - C_i + m) \pmod m$ | Involutivo |
| **Hill ($n\times n$)** | $\vec{C} = K \cdot \vec{M} \pmod m$ | $\vec{M} = K^{-1} \cdot \vec{C} \pmod m$ | $\text{mcd}(\det(K), m) = 1$ |

---

## 🚀 Despliegue en GitHub Pages

El proyecto incluye un flujo de trabajo automatizado con **GitHub Actions** en `.github/workflows/deploy.yml`.

### Pasos para activar GitHub Pages en tu repositorio:
1. Sube los cambios a la rama principal (`main`):
   ```bash
   git push origin main
   ```
2. En tu repositorio de GitHub, dirígete a:
   **Settings** $\rightarrow$ **Pages** (en la barra lateral izquierda).
3. En la sección **Build and deployment** $\rightarrow$ **Source**, selecciona **GitHub Actions**.
4. ¡Listo! La plataforma se desplegará automáticamente y estará disponible de forma gratuita en:
   `https://<tu-usuario>.github.io/<nombre-del-repo>/`

---

## 💻 Instalación y Ejecución Local

Si deseas ejecutar el proyecto localmente en tu ordenador:

```bash
# 1. Clonar el repositorio
git clone https://github.com/luzylay/Cryptography-Interactive-Learning.git
cd Cryptography-Interactive-Learning

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev

# 4. Compilar para producción
npm run build
```

---

## 🛡️ Seguridad y Privacidad

- **100% Client-Side**: Todo el procesamiento criptográfico, cálculos matriciales y análisis de frecuencias se ejecutan estrictamente en el navegador del usuario.
- **Cero Telemetría o Almacenamiento Externo**: No se envían datos ni textos ingresados a ningún servidor externo.
- **Diseño Responsivo**: Adaptado para pantallas de escritorio, laptops, tablets y dispositivos móviles.

---

## 📚 Referencias Bibliográficas (Normas APA 7.ª Edición)

1. **Ramió Aguirre, J.** (1999). *Aplicaciones criptográficas* (Capítulo 3: Criptosistemas clásicos, 2.ª ed., pp. 1–105). Departamento de Publicaciones de la Escuela Universitaria de Informática, Universidad Politécnica de Madrid (UPM). ISBN: 84-87238-57-2 / 83-87238-57-2. Depósito Legal M-23136-1999. [http://www.criptored.upm.es/guiacripto/indice.html](http://www.criptored.upm.es/guiacripto/indice.html)
2. **Alberti, L. B.** (1568). *De componendis cyfris [Tratado de cifras / De Cifris]*. En *Opuscoli morali di Leon Batista Alberti gentil'huomo firentino* (pp. 200–245). Appresso Francesco Franceschi. (Manuscrito original redactado c. 1466). [https://archive.org/details/opuscolimoralidi00albe](https://archive.org/details/opuscolimoralidi00albe)
3. **Hill, L. S.** (1929). Cryptography in an algebraic alphabet. *The American Mathematical Monthly*, 36(6), 306–312. [https://doi.org/10.2307/2298294](https://doi.org/10.2307/2298294)
4. **Hill, L. S.** (1931). Concerning certain linear transformation apparatus of cryptography. *The American Mathematical Monthly*, 38(3), 135–154. [https://doi.org/10.2307/2300963](https://doi.org/10.2307/2300963)
5. **Vigenère, B. de.** (1586). *Traicté des chiffres, ou Secrètes manières d'escrire*. Chez Abel L'Angelier. [https://gallica.bnf.fr/ark:/12148/bpt6k1052608j](https://gallica.bnf.fr/ark:/12148/bpt6k1052608j)
6. **Kasiski, F. W.** (1863). *Die Geheimschriften und die Dechiffrir-Kunst [Las escrituras secretas y el arte de descifrar]*. E. S. Mittler und Sohn. [https://archive.org/details/diegeheimschrif00kasigoog](https://archive.org/details/diegeheimschrif00kasigoog)
7. **Friedman, W. F.** (1922). *The index of coincidence and its applications in cryptography* (War Department Document No. 1083 / Riverbank Publication No. 22). Government Printing Office. [https://www.nsa.gov/Helpful-Links/NSA-FOIA/Declassification-Transparency-Initiatives/Historical-Publications/](https://www.nsa.gov/Helpful-Links/NSA-FOIA/Declassification-Transparency-Initiatives/Historical-Publications/)
8. **Suetonio Tranquilo, C.** (1985). *Vida de los doce césares (Libro I: Divus Iulius, cap. 56)* (R. M. Agudo Cubas, Trad.). Editorial Gredos. (Obra original redactada c. 121 d.C.). [https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.02.0061](https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.02.0061)
9. **Kahn, D.** (1996). *The codebreakers: The comprehensive history of secret communication from ancient times to the internet* (2.ª ed. rev.). Scribner. ISBN: 978-0684831305. [https://archive.org/details/the-codebreakers-david-kahn](https://archive.org/details/the-codebreakers-david-kahn)

---

## 📄 Licencia

Este proyecto se distribuye bajo la licencia **MIT**. Consulta el archivo `LICENSE` para más información.
