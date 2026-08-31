# Fundamentos Matemáticos y Algebraicos de los Criptosistemas Clásicos

Este documento proporciona una **guía matemática rigurosa, pedagógica y detallada** de cada uno de los algoritmos criptográficos y técnicas de criptoanálisis implementados en la plataforma *Criptografía Interactiva*.

---

## Tabla de Contenidos
1. [Aritmética Modular y Teoría de Números](#1-aritmética-modular-y-teoría-de-números)
2. [Cifrado César (Desplazamiento Aditivo)](#2-cifrado-césar-desplazamiento-aditivo)
3. [Cifrado Afín (Transformación Lineal Modular)](#3-cifrado-afín-transformación-lineal-modular)
4. [Cifrados Polialfabéticos: Vigenère, Beaufort y Autoclave](#4-cifrados-polialfabéticos-vigenère-beaufort-y-autoclave)
5. [Simulador del Disco de Alberti (Geometría y Dinámica Angular)](#5-simulador-del-disco-de-alberti-geometría-y-dinámica-angular)
6. [Cifrado de Playfair y Cuadrícula de Polibio (Geometría Digrámica)](#6-cifrado-de-playfair-y-cuadrícula-de-polibio-geometría-digrámica)
7. [Cifrado Matricial de Hill (Álgebra Lineal sobre Anillos $\mathbb{Z}_m$)](#7-cifrado-matricial-de-hill-álgebra-lineal-sobre-anillos-mathbbz_m)
8. [Cifrados de Transposición y Escítala Espartana](#8-cifrados-de-transposición-y-escítala-espartana)
9. [Fundamentos de Criptoanálisis Estadístico](#9-fundamentos-de-criptoanálisis-estadístico)
10. [Referencias y Bibliografía](#10-referencias-y-bibliografía)

---

## 1. Aritmética Modular y Teoría de Números

Todos los criptosistemas clásicos operan sobre un conjunto finito de símbolos de tamaño $m$, representados por el anillo de residuos enteros:

$$\mathbb{Z}_m = \{0, 1, 2, \dots, m - 1\}$$

### 1.1 Operación Módulo (Congruencia)
Dos enteros $a$ y $b$ son **congruentes módulo $m$** (notado $a \equiv b \pmod m$) si y solo si $m$ divide a su diferencia $(a - b)$:

$$a \equiv b \pmod m \iff \exists k \in \mathbb{Z} : a - b = k \cdot m$$

> **Regla para dividendos negativos:**
> En criptografía, el residuo siempre debe ser positivo ($0 \le r < m$).
> Para un número negativo $-n$, calculamos:
> $$\text{mod}(-n, m) = ((-n \bmod m) + m) \bmod m$$
> *Ejemplo:* $-3 \pmod{27} = -3 + 27 = 24$.

---

### 1.2 Máximo Común Divisor y Coprimalidad
Dos enteros $a$ y $m$ son **coprimos** (o primos relativos) si su único divisor común positivo es 1:

$$\text{mcd}(a, m) = 1$$

El cálculo eficiente se realiza mediante el **Algoritmo de Euclides**:
$$\text{mcd}(a, b) = \text{mcd}(b, a \bmod b)$$

---

### 1.3 Inverso Multiplicativo Modular
Dado un entero $a \in \mathbb{Z}_m$, su **inverso multiplicativo modular** es un número $a^{-1} \in \mathbb{Z}_m$ tal que:

$$a \cdot a^{-1} \equiv 1 \pmod m$$

> **Teorema Fundamental de Invertibilidad:**
> El inverso $a^{-1} \pmod m$ **existe si y solo si** $\text{mcd}(a, m) = 1$.

#### Cálculo mediante el Algoritmo Extendido de Euclides (Identidad de Bézout)
Existen enteros $x$ e $y$ tales que:

$$a \cdot x + m \cdot y = \text{mcd}(a, m)$$

Si $\text{mcd}(a, m) = 1$, aplicando módulo $m$ a ambos lados:

$$a \cdot x + m \cdot y \equiv a \cdot x + 0 \equiv a \cdot x \equiv 1 \pmod m$$

Por lo tanto, el inverso es $a^{-1} \equiv x \pmod m$.

#### Ejemplo Paso a Paso: Inverso de $a = 7$ en módulo $m = 27$ (Alfabeto Español)
1. Aplicamos divisiones sucesivas:
   - $27 = 3 \cdot 7 + 6$
   - $7 = 1 \cdot 6 + 1$
   - $6 = 6 \cdot 1 + 0$ (El $\text{mcd}(7, 27) = 1$, existe inverso).
2. Despejamos hacia atrás:
   - $1 = 7 - 1 \cdot 6$
   - Sustituimos $6 = 27 - 3 \cdot 7$:
     $$1 = 7 - 1 \cdot (27 - 3 \cdot 7) = 7 - 27 + 3 \cdot 7 = 4 \cdot 7 - 1 \cdot 27$$
3. Identidad obtenida: $7 \cdot (4) + 27 \cdot (-1) = 1$.
4. El inverso es: $x = 4 \implies 7^{-1} \equiv 4 \pmod{27}$.
5. **Comprobación:** $7 \cdot 4 = 28 \equiv 1 \pmod{27}$ (Correcto).

---

## 2. Cifrado César (Desplazamiento Aditivo)

El cifrado César es una biyección afín pura donde cada carácter del mensaje claro $M_i$ se desplaza cíclicamente un valor constante $k \in \mathbb{Z}_m$.

```
Mensaje Claro:  M_0   M_1   M_2  ...
                 +k    +k    +k  (mod m)
                 v     v     v
Texto Cifrado:  C_0   C_1   C_2  ...
```

### Ecuaciones
- **Cifrado:** $C_i = (M_i + k) \pmod m$
- **Descifrado:** $M_i = (C_i - k + m) \pmod m$

### Ejemplo Numérico ($m = 27$, Clave $k = 5$)
Para cifrar la letra **"H"**:
1. Posición numérica de **H**: $M_i = 7$ (donde $A=0, B=1, \dots, H=7$).
2. Cifrado: $C_i = (7 + 5) \bmod 27 = 12$.
3. En el alfabeto español, el índice 12 corresponde a la letra **"M"**.
4. Descifrado: $M_i = (12 - 5 + 27) \bmod 27 = 7 \implies \text{"H"}$.

---

## 3. Cifrado Afín (Transformación Lineal Modular)

El cifrado afín generaliza el cifrado César aplicando una transformación lineal de la forma $f(x) = ax + b$ en el anillo $\mathbb{Z}_m$.

### Parámetros
- **Clave:** Tupla $(a, b)$ donde $a, b \in \mathbb{Z}_m$.
- **Restricción de Biyectividad:** $\text{mcd}(a, m) = 1$.

### Ecuaciones
- **Cifrado:** $C_i = (a \cdot M_i + b) \pmod m$
- **Descifrado:**
  $$M_i = a^{-1} \cdot (C_i - b + m) \pmod m$$

### ¿Por qué es obligatoria la coprimalidad $\text{mcd}(a, m) = 1$?
Si $\text{mcd}(a, m) = d > 1$, la función de cifrado **no es inyectiva**. Múltiples letras claras colisionan en la misma letra cifrada, haciendo imposible recuperar el mensaje original.

### Ejemplo Numérico ($m = 27$, Clave $a = 7, b = 3$)
1. Verificamos coprimalidad: $\text{mcd}(7, 27) = 1$. Inverso: $a^{-1} = 4$.
2. Ciframos la letra **"S"** ($M_i = 19$):
   $$C_i = (7 \cdot 19 + 3) \bmod 27 = (133 + 3) \bmod 27 = 136 \bmod 27 = 1$$
   El índice 1 es la letra **"B"**.
3. Desciframos **"B"** ($C_i = 1$):
   $$M_i = 4 \cdot (1 - 3 + 27) \bmod 27 = 4 \cdot 25 \bmod 27 = 100 \bmod 27 = 19 \implies \text{"S"}$$.

---

## 4. Cifrados Polialfabéticos: Vigenère, Beaufort y Autoclave

Los cifrados polialfabéticos utilizan múltiples alfabetos de sustitución para aplanar la distribución estadística de frecuencias del idioma.

```
Posición i:      0    1    2    3    4    5
Mensaje Claro:   H    O    L    A    M    U
Clave Repetida:  S    O    L    S    O    L
                 -----------------------
Texto Cifrado:   ...  ...  ...  ...  ...  ...
```

### 4.1 Cifrado Vigenère
Utiliza una clave $K = (K_0, K_1, \dots, K_{L-1})$ de longitud $L$.
- **Cifrado:** $C_i = (M_i + K_{i \bmod L}) \pmod m$
- **Descifrado:** $M_i = (C_i - K_{i \bmod L} + m) \pmod m$

### 4.2 Cifrado Beaufort (Variante Involutiva)
En el cifrado Beaufort, la operación de cifrado y descifrado es idéntica (propiedad involutiva $\mathcal{E} \equiv \mathcal{D}$):
- **Cifrado:** $C_i = (K_{i \bmod L} - M_i + m) \pmod m$
- **Descifrado:** $M_i = (K_{i \bmod L} - C_i + m) \pmod m$

### 4.3 Cifrado Autoclave
Elimina la periodicidad de la clave $K$ concatenando la palabra clave inicial $K_0$ con el propio texto claro $M$:
$$K_{\text{auto}} = K_0 \mathbin{\Vert} M$$
- Hace que el Test de Kasiski convencional no encuentre repeticiones periódicas directas.

---

## 5. Simulador del Disco de Alberti (Geometría y Dinámica Angular)

Inventado en 1466 por Leon Battista Alberti, este dispositivo mecánico consta de dos discos concéntricos con particiones radiales discretas:
- **Disco Exterior (Estable):** $N$ casillas ($N=24$ en el original latino con números 1–4; $N=26/27$ en implementaciones modernas).
- **Disco Interior (Móvil):** $N$ casillas rotadas libremente.

```
          [Disco Exterior: Mayúsculas / Fijo]
                   /     |     \
                 A       B       C ...
                 |       |       |
                 k       x       p ...
                   \     |     /
          [Disco Interior: Minúsculas / Móvil]
```

### Dinámica Matemática
1. **Desfase Angular:** Si el disco exterior está en posición $\theta_{\text{ext}}$ y el interior en $\theta_{\text{int}}$, el desplazamiento relativo es:
   $$\delta = (\theta_{\text{ext}} - \theta_{\text{int}}) \pmod N$$
2. **Modo Dinámico Polialfabético:** Cada vez que se procesan $k$ caracteres (período de paso), el disco interior rota automáticamente un paso angular $\Delta \theta$:
   $$\theta_{\text{int}}^{(t+1)} = (\theta_{\text{int}}^{(t)} + \text{step}) \pmod N$$

---

## 6. Cifrado de Playfair y Cuadrícula de Polibio (Geometría Digrámica)

### 6.1 Cuadrícula de Polibio
Mapea cada letra a coordenadas bidimensionales $(fila, columna)$ en una matriz de $5 \times 5$ (fusionando I y J). Cada carácter se convierte en un par de dígitos del 1 al 5.

### 6.2 Cifrado de Playfair
Procesa el mensaje en digramas (pares de letras $L_1 L_2$):
1. Si ambas letras son iguales, se inserta una letra nula (por ejemplo, 'X').
2. Se localizan las coordenadas de $L_1 = (r_1, c_1)$ y $L_2 = (r_2, c_2)$ en la matriz $5 \times 5$:
   - **Misma Fila ($r_1 = r_2$):** Se desplazan a la derecha:
     $$c_1' = (c_1 + 1) \bmod 5, \quad c_2' = (c_2 + 1) \bmod 5$$
   - **Misma Columna ($c_1 = c_2$):** Se desplazan hacia abajo:
     $$r_1' = (r_1 + 1) \bmod 5, \quad r_2' = (r_2 + 1) \bmod 5$$
   - **Rectángulo (Distinta Fila y Columna):** Intercambian sus columnas:
     $$L_1' = (r_1, c_2), \quad L_2' = (r_2, c_1)$$

---

## 7. Cifrado Matricial de Hill (Álgebra Lineal sobre Anillos $\mathbb{Z}_m$)

Inventado por Lester S. Hill en 1929, el cifrado de Hill fue el primer cifrado poligráfico algebraico práctico. Divide el texto claro en vectores de dimensión $n$ y los multiplica por una matriz invertible $K \in \mathcal{M}_{n \times n}(\mathbb{Z}_m)$.

```
[ C_1 ]   [ k11  k12 ]   [ M_1 ]
[     ] = [          ] * [     ]  (mod m)
[ C_2 ]   [ k21  k22 ]   [ M_2 ]
```

### Ecuaciones
- **Cifrado:** $\vec{C} = K \cdot \vec{M} \pmod m$
- **Descifrado:** $\vec{M} = K^{-1} \cdot \vec{C} \pmod m$

### 7.1 Condiciones de Invertibilidad de la Matriz $K$
Para que la matriz clave $K$ admita inversa en $\mathbb{Z}_m$, deben cumplirse dos condiciones indispensables:
1. El determinante modular no debe ser cero: $\det(K) \not\equiv 0 \pmod m$.
2. El determinante debe ser coprimo con el módulo del alfabeto:
   $$\text{mcd}(\det(K) \bmod m, \; m) = 1$$

---

### 7.2 Inversión de Matrices $2 \times 2$ en $\mathbb{Z}_m$
Dada una matriz $K = \begin{pmatrix} a & b \\ c & d \end{pmatrix}$:
1. Determinante: $D = \det(K) = (a \cdot d - b \cdot c) \bmod m$.
2. Inverso del determinante: $D^{-1} = \text{modInverse}(D, m)$.
3. Matriz Inversa:
   $$K^{-1} = D^{-1} \cdot \text{Adj}(K) \equiv D^{-1} \cdot \begin{pmatrix} d & -b \\ -c & a \end{pmatrix} \pmod m$$

#### Ejemplo Numérico Completo ($2 \times 2$, Alfabeto Español $m = 27$)
Sea la matriz clave:
$$K = \begin{pmatrix} 3 & 2 \\ 5 & 7 \end{pmatrix}$$

1. **Calculamos el determinante:**
   $$\det(K) = (3 \cdot 7 - 2 \cdot 5) = 21 - 10 = 11$$
   $$11 \bmod 27 = 11$$
2. **Verificamos coprimalidad:** $\text{mcd}(11, 27) = 1$.
3. **Inverso del determinante $11^{-1} \pmod{27}$:**
   $$11 \cdot 5 = 55 = 2 \cdot 27 + 1 \implies 11^{-1} \equiv 5 \pmod{27}$$
4. **Construimos la matriz adjunta modular:**
   $$\text{Adj}(K) = \begin{pmatrix} 7 & -2 \\ -5 & 3 \end{pmatrix} \equiv \begin{pmatrix} 7 & 25 \\ 22 & 3 \end{pmatrix} \pmod{27}$$
5. **Multiplicamos por $D^{-1} = 5$:**
   $$K^{-1} = 5 \cdot \begin{pmatrix} 7 & 25 \\ 22 & 3 \end{pmatrix} = \begin{pmatrix} 35 & 125 \\ 110 & 15 \end{pmatrix} \equiv \begin{pmatrix} 8 & 17 \\ 2 & 15 \end{pmatrix} \pmod{27}$$

6. **Comprobación ($K \cdot K^{-1} \equiv I \pmod{27}$):**
   $$K \cdot K^{-1} = \begin{pmatrix} 3 & 2 \\ 5 & 7 \end{pmatrix} \begin{pmatrix} 8 & 17 \\ 2 & 15 \end{pmatrix} = \begin{pmatrix} 24+4 & 51+30 \\ 40+14 & 85+105 \end{pmatrix} = \begin{pmatrix} 28 & 81 \\ 54 & 190 \end{pmatrix} \equiv \begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix} \pmod{27}$$

---

### 7.3 Inversión de Matrices $3 \times 3$ en $\mathbb{Z}_m$
Para una matriz $3 \times 3$:
$$K = \begin{pmatrix} a & b & c \\ d & e & f \\ g & h & i \end{pmatrix}$$

1. **Determinante (Regla de Laplace / Sarrus):**
   $$\det(K) = [a(ei - fh) - b(di - fg) + c(dh - eg)] \bmod m$$
2. **Matriz de Cofactores $C$:**
   $$C_{11} = (ei - fh), \quad C_{12} = -(di - fg), \quad C_{13} = (dh - eg)$$
   $$C_{21} = -(bi - ch), \quad C_{22} = (ai - cg), \quad C_{23} = -(ah - bg)$$
   $$C_{31} = (bf - ce), \quad C_{32} = -(af - cd), \quad C_{33} = (ae - bd)$$
3. **Matriz Adjunta (Transpuesta de cofactores):**
   $$\text{Adj}(K) = C^T$$
4. **Matriz Inversa:**
   $$K^{-1} = (\det(K))^{-1} \cdot \text{Adj}(K) \pmod m$$

---

## 8. Cifrados de Transposición y Escítala Espartana

A diferencia de la sustitución, los cifrados de transposición no alteran los caracteres, sino que aplican una **permutación algebraica $\sigma \in S_n$** sobre las posiciones de los símbolos.

### 8.1 Escítala Espartana (Transposición Cilíndrica)
El mensaje se escribe longitudinalmente alrededor de una vara cilíndrica de diámetro $D$ (número de filas) y longitud $C$ (número de columnas).
- **Escritura:** Por columnas sucesivas.
- **Lectura:** Por filas horizontales continuas.

### 8.2 Transposición por Columnas con Clave Alfabética
1. Se define una clave alfabética (ej. `"CLAVE"`).
2. Se ordenan alfabéticamente las letras de la clave para determinar el orden de lectura de las columnas:
   ```
   Clave:        C  L  A  V  E
   Orden:        2  4  1  5  3
   ---------------------------
   Fila 0:       A  T  A  Q  U
   Fila 1:       E  A  L  A  S
   Fila 2:       O  C  H  O  X
   ```
3. El texto cifrado se extrae leyendo las columnas en orden $1 \to 2 \to 3 \to 4 \to 5$: `ALH AEO USX TAC QAO`.

---

## 9. Fundamentos de Criptoanálisis Estadístico

### 9.1 Índice de Coincidencia de Friedman ($IC$)
Introducido por William F. Friedman en 1922, mide la probabilidad de que dos caracteres seleccionados aleatoriamente de un texto sean idénticos.

Para un texto de longitud $N$ con frecuencias absolutas de letras $f_i$ ($i = 0, \dots, m-1$):

$$IC = \frac{\sum_{i=0}^{m-1} f_i (f_i - 1)}{N (N - 1)}$$

#### Interpretación Criptográfica
| Tipo de Texto / Idioma | $IC$ Teórico Esperado |
| :--- | :--- |
| **Texto plano en Español** | $\approx 0.074 - 0.077$ |
| **Texto plano en Inglés** | $\approx 0.065 - 0.068$ |
| **Cifrado Monoalfabético (César, Afín)** | Idéntico al texto plano ($IC \approx 0.076$) |
| **Cifrado Polialfabético (Vigenère)** | Se degrada hacia la distribución uniforme |
| **Texto completamente aleatorio** | $\frac{1}{m} \approx \frac{1}{27} \approx 0.037$ (Español) |

---

### 9.2 Test de Kasiski (Deducción de Longitud de Clave)
Desarrollado por Friedrich Kasiski en 1863 para vulnerar el cifrado Vigenère:
1. Se buscan cadenas idénticas de longitud $n \ge 3$ que se repitan en el texto cifrado.
2. Se calculan las distancias $d_1, d_2, \dots, d_r$ en número de caracteres entre dichas repeticiones.
3. **Principio Matemático:** Las repeticiones ocurren con alta probabilidad cuando la misma secuencia de texto claro coincide con la misma fase de la clave periódica.
4. Por lo tanto, la longitud de la clave $L$ es un divisor común de las distancias:
   $$L \mid \text{mcd}(d_1, d_2, \dots, d_r)$$

---

### 9.3 Análisis de Frecuencias y Ataque por Producto Punto
Para romper el cifrado César o sustituciones monoalfabéticas de forma totalmente automatizada:
1. Se calcula el vector de frecuencias normalizadas observadas del texto cifrado $\vec{p} = (p_0, p_1, \dots, p_{m-1})$.
2. Se compara contra el vector de frecuencias estándar del idioma $\vec{q}$ aplicando un desplazamiento candidato $k$:
   $$\text{Score}(k) = \sum_{i=0}^{m-1} p_{(i+k) \bmod m} \cdot q_i$$
3. El valor de $k$ que maximiza el producto punto $\text{Score}(k)$ corresponde al desplazamiento más probable con una confianza superior al 99% en textos de más de 30 caracteres.

---

## 10. Referencias y Bibliografía

1. **Ramió Aguirre, J.** (1999). *Aplicaciones criptográficas* (Capítulo 3: Criptosistemas clásicos, 2.ª ed.). UPM.
2. **Hill, L. S.** (1929). Cryptography in an algebraic alphabet. *The American Mathematical Monthly*, 36(6), 306–312.
3. **Friedman, W. F.** (1922). *The index of coincidence and its applications in cryptography*. War Department Document No. 1083.
4. **Kasiski, F. W.** (1863). *Die Geheimschriften und die Dechiffrir-Kunst*. E. S. Mittler und Sohn.
5. **Alberti, L. B.** (1568). *De componendis cyfris*. En *Opuscoli morali di Leon Batista Alberti gentil'huomo firentino*.
