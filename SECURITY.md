# Política de Seguridad y Marco SSDLC (Secure Software Development Lifecycle)

Este documento describe la arquitectura de seguridad, el modelo de amenazas y las directrices de desarrollo seguro aplicadas en la plataforma **Criptografía Interactiva**, conforme a los estándares de desarrollo seguro **NIST SP 800-218 (SSDF)** y las recomendaciones del **OWASP Top 10**.

---

## 1. Alcance y Arquitectura de Ejecución

La plataforma opera bajo un modelo de arquitectura **estrictamente de cliente (*100% Client-Side Execution*)**:

* **Procesamiento Local:** Todos los algoritmos criptográficos, cálculos matriciales, descomposiciones modulares y análisis estadísticos se ejecutan exclusivamente en la máquina y memoria del navegador del usuario.
* **Aislamiento de Datos:** No existe persistencia en bases de datos remotas ni transmisión de texto en claro (*plaintext*), claves criptográficas o resultados a servidores externos.
* **Cero Telemetría de Contenido:** No se implementan mecanismos de rastreo que recolecten las entradas de texto del usuario.

---

## 2. Modelo de Amenazas (Metodología STRIDE)

Se realizó un análisis sistemático de amenazas basado en el modelo STRIDE para identificar vectores de riesgo y definir contramedidas formales en el código:

| Categoría STRIDE | Amenaza Identificada | Vector de Ataque | Mitigación Implementada |
| :--- | :--- | :--- | :--- |
| **Spoofing** (Suplantación) | Alteración de integridad en el despliegue web | Modificación de artefactos en tránsito | Despliegue automatizado con firma en GitHub Actions mediante canal seguro HTTPS con HSTS. |
| **Tampering** (Manipulación) | Inyección de caracteres no válidos o código malicioso | Entradas con payloads `<script>` o entidades HTML en inputs de texto | Sanitización estricta por lista blanca (*whitelist*) en `normalizeText()`. Todos los caracteres se filtran según el alfabeto activo. |
| **Repudiation** (Repudio) | Inconsistencia en la evaluación de ejercicios prácticos | Modificación de respuestas en memoria | Validación determinista de soluciones basada en estado puro e invariantes matemáticos algebraicos. |
| **Information Disclosure** (Fuga de Información) | Filtración de textos confidenciales ingresados para análisis | Interceptación de tráfico de red | Cero peticiones de red salientes durante el cifrado, descifrado y criptoanálisis. |
| **Denial of Service** (Denegación de Servicio) | Bloqueo del hilo principal de JavaScript (*UI Freeze*) | Textos de longitud extrema o matrices singulares en el cálculo de Kasiski/Hill | Límites computacionales defensivos (`MAX_KASISKI_LENGTH = 10000`), comprobación previa de $\text{mcd}(a, m) = 1$ y control de determinante. |
| **Elevation of Privilege** (Elevación de Privilegios) | Ejecución arbitraria de código en el navegador | Ataques de tipo Cross-Site Scripting (DOM XSS) | Renderizado puramente declarativo mediante React Virtual DOM y SVG nativo. Ausencia total de `eval()` y `dangerouslySetInnerHTML`. |

---

## 3. Prácticas de Codificación Segura y Robustecimiento (*Hardening*)

### 3.1 Validación Estricta de Restricciones Matemáticas
* **Inverso Modular:** Antes de realizar operaciones de descifrado en el cifrador Afín o en matrices de Hill, se verifica la condición de coprimatidad mediante el algoritmo extendido de Euclides:
  $$\gcd(a, m) = 1$$
  Si no existe inverso multiplicativo modular, el sistema aborta la operación de forma segura y devuelve un estado tipado de error sin generar excepciones no controladas.
* **Invertibilidad Matricial:** Para matrices $2\times 2$ y $3\times 3$ en Hill, se evalúa:
  $$\gcd(\det(K), m) = 1$$
  Evitando singularidades y bucles indefinidos.

### 3.2 Tipado Estático y Ausencia de Mutabilidad Oculta
* Toda la base de código está escrita en **TypeScript 5.7+** con configuración estricta (`noImplicitAny`, chequeo riguroso de nulos).
* Las funciones del motor criptográfico (`src/crypto/`) son funciones puras libres de efectos secundarios (*side effects*).

### 3.3 Auditoría de Dependencias y Automatización
* La plataforma cuenta con una suite de pruebas automatizadas que valida la simetría matemática y la resistencia ante entradas anómalas:
  ```bash
  npm run test
  ```
* Se mantiene un control continuo de vulnerabilidades en dependencias mediante análisis estático y `npm audit`.

---

## 4. Divulgación Responsable de Vulnerabilidades

Si identifica algún comportamiento anómalo o vector de vulnerabilidad potencial en la aplicación:

1. Cree un reporte confidencial a través de los canales de seguridad del repositorio en GitHub (*Security Advisories*).
2. Proporcione una descripción detallada del vector de reproducción y el impacto estimado.
3. El equipo de mantenimiento evaluará y corregirá la incidencia en el menor tiempo posible conforme a las directrices de divulgación coordinada.
