# Guía para Desarrolladores y Arquitectura de Extensión (Developer Guide)

Bienvenido a la guía técnica de desarrollo de **Criptografía Interactiva**. Este documento proporciona las pautas de arquitectura, seguridad, adición de nuevos algoritmos y la hoja de ruta para la futura integración con Backend y Base de Datos.

---

## 1. Principios de Seguridad y Política de No-Filtración (Zero-Leakage)

1. **Arquitectura Zero-Knowledge**:
   - Todo el cálculo criptográfico se procesa en el cliente (`src/crypto/`).
   - Ninguna clave secreta, texto en claro o información personal debe enviarse por red sin cifrado de extremo a extremo.
2. **Control Estricto de Secretos**:
   - El archivo `.gitignore` bloquea `.env`, `.env.local`, llaves privadas (`*.pem`, `*.key`), certificados y volcados de bases de datos.
   - Si se requiere configurar variables de entorno para nuevas integraciones, use `.env.example` como plantilla. **Nunca haga commit de credenciales reales**.

---

## 2. Estructura de Capas y Mapa del Código

```
src/
├── types/                      # Contratos TypeScript globales e interfaces
│   ├── crypto.types.ts         # Tipos para algoritmos, trazas y resultados
│   ├── knowledge.types.ts      # Tipos para Q&A y artículos
│   └── navigation.types.ts     # Tipos de pestañas
│
├── data/                       # Capa de datos desacoplada de la UI
│   ├── encyclopedia.data.ts    # Artículos teóricos y referencias APA 7
│   └── decisionMatrix.data.ts  # Escenarios y matrices de decisión
│
├── crypto/                     # Dominio Criptográfico Puro (Sin dependencias de DOM ni React)
│   ├── ciphers/                # Algoritmos de cifrado y descifrado
│   ├── alphabets.ts            # Definiciones de alfabetos (es27, en26)
│   ├── mathUtils.ts            # Aritmética modular y matrices
│   ├── cryptanalysis.ts        # Frecuencias, Kasiski e Índice de Friedman
│   ├── exercises.ts            # Generador dinámico de ejercicios
│   └── knowledgeBase.ts        # Banco de preguntas evaluativas
│
├── hooks/                      # Custom Hooks reutilizables (useClipboard, useFilterSearch)
│
├── components/                 # Capa de Presentación
│   ├── common/                 # Design System atómico (GlassCard, Badge, CopyButton, SearchBar)
│   ├── visualizers/            # Componentes visuales interactivos (Alberti, Polybius, etc.)
│   ├── tabs/                   # Vistas principales de la aplicación
│   └── Navbar.tsx              # Barra de navegación principal
│
├── App.tsx                     # Orquestador raíz
└── main.tsx                    # Punto de entrada React
```

---

## 3. Cómo Agregar un Nuevo Algoritmo Criptográfico

Para incorporar un nuevo cifrador clásico o moderno de forma limpia:

1. **Definir el Contrato / Algoritmo**:
   Cree el archivo en `src/crypto/ciphers/miCifrador.ts` implementando la interfaz:
   ```typescript
   export function miCifradorEncrypt(text: string, key: string, mode: AlphabetMode): CipherResult { ... }
   export function miCifradorDecrypt(text: string, key: string, mode: AlphabetMode): CipherResult { ... }
   ```
2. **Exportar en el Barrel**:
   Añada la exportación en `src/crypto/ciphers/index.ts`.
3. **Crear el Visualizador Interactivo** (Opcional):
   Cree el componente en `src/components/visualizers/MiCifradorVisualizer.tsx` utilizando `GlassCard`, `Badge` y componentes comunes.
4. **Agregar Prueba Unitaria**:
   En `tests/crypto-security.test.mjs`, añada un test de simetría:
   ```javascript
   test('MiCifrador encrypt/decrypt roundtrip', () => {
     assert.equal(miCifradorDecrypt(miCifradorEncrypt('HOLA', key), key), 'HOLA');
   });
   ```

---

## 4. Hoja de Ruta para Integración Futura de Backend y Base de Datos

Si el proyecto escala hacia una plataforma multi-usuario (LMS / Universidad):

1. **Capa de Servicios API**:
   - Crear `src/services/api.ts` utilizando los tipos existentes en `src/types/`.
2. **Endpoints Recomendados**:
   - `POST /api/v1/auth/login`: Autenticación con JWT.
   - `GET /api/v1/quizzes`: Obtener evaluaciones parametrizadas desde la BD.
   - `POST /api/v1/quizzes/submit`: Registrar calificaciones de alumnos en PostgreSQL.
3. **Persistencia**:
   - Utilizar Prisma ORM o TypeORM en el backend mapeando las interfaces de `src/types/knowledge.types.ts`.

---

## 5. Comandos de Verificación de Calidad

Antes de enviar cualquier *Pull Request* o *Commit*:

```bash
# 1. Ejecutar suite de pruebas de seguridad y matemáticas
npm test

# 2. Verificar tipado estático estricto
npm run typecheck

# 3. Validar compilación de producción
npm run build
```
