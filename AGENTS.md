# Cryptography Interactive Learning — Developer & Agent Guidelines

Plataforma web de aprendizaje interactivo de Criptosistemas Clásicos, Discos Cifradores y Criptoanálisis Estadístico.

---

## 1. Arquitectura del Proyecto (Clean Architecture)

El proyecto implementa una arquitectura modular con separación estricta de responsabilidades:

- `src/types/`: Interfaces globales y contratos TypeScript para algoritmos, resultados y modelos.
- `src/data/`: Capa de datos desacoplada (artículos enciclopédicos, referencias APA 7 y matrices de decisión).
- `src/crypto/`: Dominio criptográfico puro en TypeScript (sin dependencias de DOM ni React):
  - `src/crypto/ciphers/`: Motores de cifrado (Alberti, Polibio, César, Afín, Vigenère, Playfair, Hill, Escítala, Columnar).
  - `src/crypto/alphabets.ts`: Mapeos de alfabetos (`es27` con Ñ, `en26` internacional).
  - `src/crypto/mathUtils.ts`: Aritmética modular, Euclides extendido y matrices invertibles.
  - `src/crypto/cryptanalysis.ts`: Frecuencias, Test de Kasiski e Índice de Friedman.
  - `src/crypto/knowledgeBase.ts`: Banco de preguntas con citas oficiales y estegoanálisis.
- `src/hooks/`: Custom Hooks reutilizables (`useClipboard`, `useFilterSearch`).
- `src/components/common/`: Design System atómico (`GlassCard`, `Badge`, `CopyButton`, `SearchBar`).
- `src/components/visualizers/`: Componentes gráficos interactivos (Disco de Alberti SVG, Polibio, Hill, etc.).
- `src/components/tabs/`: Vistas principales de la aplicación.

---

## 2. Tecnologías y Dependencias

- **Runtime**: React 19 y React DOM 19
- **Estilos**: Tailwind CSS v4 con `@tailwindcss/vite`
- **Build Tooling**: Vite 8, TypeScript 5.7, Node.js 22 LTS
- **Gráficos**: Recharts, Lucide React, Canvas Confetti

---

## 3. Comandos de Calidad y Verificación

```bash
npm test          # Ejecuta la suite de 14 pruebas unitarias y de seguridad
npm run typecheck # Verificación estricta de tipos con TypeScript (0 errores)
npm run build     # Compilación optimizada para producción
```

---

## 4. Reglas de Seguridad y Calidad de Código

1. **Zero-Knowledge**: Todo el procesamiento criptográfico y matemático debe ejecutarse en el cliente (`src/crypto/`).
2. **Sin Secretos**: Nunca hardcodear claves privadas, contraseñas reales ni tokens.
3. **Neutralidad**: Usar terminología académica formal y universal.
4. **Citas Rigurosas**: Todo fundamento teórico debe contar con su respectiva cita (NIST, IETF RFC, BSI, IEEE, APA 7).
