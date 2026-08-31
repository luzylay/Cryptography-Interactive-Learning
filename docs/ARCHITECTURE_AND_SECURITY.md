# Especificación Técnica de Arquitectura, Diagramas de Secuencia del Sistema (SSD) y Seguridad (SSDLC)

Este documento describe la arquitectura modular, los **Diagramas de Secuencia del Sistema (SSD en notación UML)** y los mecanismos del **Ciclo de Vida de Desarrollo de Software Seguro (SSDLC)** implementados en la plataforma *Criptografía Interactiva*.

---

## 1. Arquitectura del Sistema

La arquitectura de la aplicación sigue un patrón desacoplado en tres capas con flujo de datos unidireccional y funciones algebraicas puras en el núcleo de cálculo.

```
+------------------------------------------------------------------+
|                    Capa de Presentación (UI)                     |
|  - Tabs de Navegación (Laboratorio, Práctica, Criptoanálisis)     |
|  - Visualizadores Interactivos (Alberti SVG, Hill, Tabula, etc.) |
+---------------------------------+--------------------------------+
                                  | Eventos de Usuario
                                  v
+------------------------------------------------------------------+
|                 Capa de Control y Estado React                   |
|  - Gestión de Modo de Alfabeto (mod 26 / mod 27)                 |
|  - Sincronización de Parámetros de Cifrado                       |
+---------------------------------+--------------------------------+
                                  | Invocación de Operaciones
                                  v
+------------------------------------------------------------------+
|               Capa de Dominio y Cálculo (src/crypto)             |
|  - Normalización y Filtrado (alphabets.ts)                       |
|  - Aritmética Modular y Álgebra Lineal (mathUtils.ts)            |
|  - Motores de Cifrado y Criptoanálisis (ciphers/, cryptanalysis) |
+------------------------------------------------------------------+
```

---

## 2. Diagramas de Secuencia del Sistema (SSD - UML)

Los Diagramas de Secuencia del Sistema modelan los eventos de entrada y salida generados por el actor externo (Usuario) en la frontera del sistema.

### 2.1 SSD-01: Simulación y Cifrado con Disco de Alberti

```mermaid
sequenceDiagram
    autonumber
    actor Usuario
    participant Sistema as :Sistema (AlbertiEngine)

    Usuario->>Sistema: configurarDisco(modoAlfabeto, rotacionInicial, periodoGiro, pasoGiro)
    Sistema-->>Usuario: mostrarDiscosAlineados(anilloExterior, anilloInterior, offset)
    
    Usuario->>Sistema: ingresarTexto(textoClaro, direccion="encrypt")
    activate Sistema
    Sistema->>Sistema: normalizeText(textoClaro, modoAlfabeto)
    Sistema->>Sistema: calcularCorrespondenciasPorPaso(norm, rotacion, periodo, paso)
    Sistema-->>Usuario: renderizarTextoCifrado(textoCifrado, trazaPasoAPaso, anguloFinal)
    deactivate Sistema

    opt Interacción Manual
        Usuario->>Sistema: arrastrarDiscoInterior(deltaAngulo)
        Sistema-->>Usuario: actualizarRotacion(nuevaRotacion, rayoLaserAlineacion)
    end
```

### 2.2 SSD-02: Cifrado y Descifrado Matricial de Hill (2×2 y 3×3)

```mermaid
sequenceDiagram
    autonumber
    actor Usuario
    participant Sistema as :Sistema (HillEngine)

    Usuario->>Sistema: definirParametrosHill(dimension, matrizK, texto, modoAlfabeto, direccion)
    activate Sistema
    Sistema->>Sistema: normalizarTexto(texto, modoAlfabeto)
    Sistema->>Sistema: calcularDeterminante(K, m)
    Sistema->>Sistema: verificarCoprimatidad(det(K), m)

    alt det(K) no es coprimo con m (gcd != 1)
        Sistema-->>Usuario: mostrarErrorInvertibilidad("det(K) no es coprimo con m")
    else det(K) es coprimo con m (gcd == 1)
        Sistema->>Sistema: calcularInversaModular(det(K), m)
        Sistema->>Sistema: calcularMatrizAdjunta(K, m)
        Sistema->>Sistema: generarMatrizInversa(K_inv)
        Sistema->>Sistema: multiplicarVectoresPorBloques(matrizEfectiva, bloques)
        Sistema-->>Usuario: mostrarResultado(textoSalida, matrizInversa, pasosVectoriales)
    end
    deactivate Sistema
```

### 2.3 SSD-03: Criptoanálisis de Criptogramas

```mermaid
sequenceDiagram
    autonumber
    actor Usuario
    participant Sistema as :Sistema (CryptanalysisEngine)

    Usuario->>Sistema: ingresarCriptograma(textoCifrado, modoAlfabeto)
    activate Sistema
    Sistema->>Sistema: sanitizarEntrada(textoCifrado)
    
    par Análisis Estadístico
        Sistema->>Sistema: calcularFrecuenciasMonogramas(texto)
    and Índice de Coincidencia
        Sistema->>Sistema: calcularFriedmanIC(texto)
    and Factorización de Kasiski
        Sistema->>Sistema: detectarRepeticiones(longitudes=[3,4,5])
        Sistema->>Sistema: factorizarDistancias(divisores=[2..16])
    and Fuerza Bruta César
        Sistema->>Sistema: evaluarDesplazamientos(0..m-1, tablaEsperada)
    end

    Sistema-->>Usuario: presentarReporte(histograma, valorIC, clavesSugeridas, rankingCandidatos)
    deactivate Sistema
```

### 2.4 SSD-04: Estudio de Ejercicios y Autoevaluación

```mermaid
sequenceDiagram
    autonumber
    actor Usuario
    participant Sistema as :Sistema (QuizEngine)

    Usuario->>Sistema: solicitarNuevoEjercicio(categoriaCriptosistema, nivelDificultad)
    activate Sistema
    Sistema->>Sistema: generarInstanciaAleatoria(claveValida, mensajeBase)
    Sistema->>Sistema: calcularSolucionExacta(algoritmo, parametros)
    Sistema-->>Usuario: presentarEnunciado(pregunta, parametros, pistaInicial)
    deactivate Sistema

    Usuario->>Sistema: enviarRespuesta(respuestaUsuario)
    activate Sistema
    Sistema->>Sistema: normalizarRespuesta(respuestaUsuario)
    Sistema->>Sistema: compararConSolucion(normalizada, solucionExacta)

    alt Respuesta Correcta
        Sistema-->>Usuario: notificarExito(incrementarRacha, justificacionMatematica)
    else Respuesta Incorrecta
        Sistema-->>Usuario: notificarFallo(ofrecerPistaDetallada, desglosePasoAPaso)
    end
    deactivate Sistema
```

---

## 3. Contratos de Operaciones del Sistema

| Operación | Precondición | Postcondición | Invariante de Seguridad |
| :--- | :--- | :--- | :--- |
| `processCaesar(text, shift, mode, dir)` | `text` es una cadena de texto; `shift` $\in \mathbb{Z}$; `mode` $\in \{\text{'es27'}, \text{'en26'}\}$. | Retorna texto procesado y pasos donde $C_i = (M_i \pm k) \pmod m$. | Todo caracter de salida pertenece al conjunto del alfabeto seleccionado. |
| `processAffine(text, config, dir)` | $\gcd(a, m) = 1$ donde $m$ es el módulo del alfabeto. | Si $\gcd(a,m) = 1$, retorna $C_i = (a M_i + b) \pmod m$ o su inversa. En caso contrario, retorna error controlado. | No se ejecutan divisiones por cero ni estados de cálculo indefinido. |
| `processHill2x2/3x3(text, K, mode, dir)` | Matriz $K$ de dimensión $n \times n$ con entradas enteras. | Si $\gcd(\det(K), m) = 1$, procesa los bloques y calcula $K^{-1}$. En caso contrario, aborta la operación. | La longitud del texto de salida es siempre un múltiplo exacto de la dimensión $n$. |
| `performKasiski(text, mode)` | `text` es una cadena de caracteres. | Retorna patrones repetidos y factores comunes ordenados por frecuencia. | Entradas mayores a $10\,000$ caracteres se acotan para evitar bloqueos del hilo (*Denial of Service*). |

---

## 4. Marco de Desarrollo de Software Seguro (SSDLC)

El ciclo de vida del proyecto incorpora controles de seguridad en cada una de sus fases:

1. **Fase de Requisitos y Diseño:**
   - Adopción de arquitectura *Zero-Knowledge / 100% Client-Side*.
   - Definición de listas blancas de caracteres para evitar inyecciones.
2. **Fase de Implementación:**
   - Tipado estático estricto en TypeScript.
   - Programación defensiva con validación previa de condiciones matemáticas necesarias para biyectividad ($\gcd(a, m) = 1$, matrices regulares).
3. **Fase de Verificación y Pruebas:**
   - Suite de pruebas unitarias automatizadas (`tests/crypto-security.test.mjs`) que validan la simetría $\mathcal{D}_K(\mathcal{E}_K(M)) = M$ y la neutralización de ataques de inyección y sobrecarga.
4. **Fase de Despliegue y Mantenimiento:**
   - Pipeline de integración continua mediante GitHub Actions con compilación limpia (`tsc --noEmit` y `vite build`).
