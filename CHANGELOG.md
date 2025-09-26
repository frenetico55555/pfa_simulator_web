# Changelog

Todas las notas de cambios relevantes del proyecto. Sigue el formato Keep a Changelog y versionado semántico (SemVer) cuando sea posible.

## [v1.0.0] - 2025-09-26

### 🎯 Enfoque

Primera versión web operativa lista para uso educativo.

### ✨ Funcionalidades Clave

- Modo demo (sin consumir API real) para pruebas y docencia.
- Persistencia local (localStorage) de la API Key del usuario (no se envía ni almacena remotamente).
- Eliminación de la API Key embebida en el código (mejora de seguridad).
- Flujo completo de simulación: generación de caso, triage, interacción conversacional, feedback ABCDE y criterios PAREN.
- Editor visual de prompts y sistema gestionado por `prompts.json`.
- Exportación de conversación y evaluación.
- Gráficos radar (Chart.js) para feedback cuantitativo.
- Página índice / portal y página de redirección corta (`app.html`).
- Página 404 personalizada y configuración `.nojekyll` para GitHub Pages.
- Workflow de despliegue automático a GitHub Pages.

### 🛠️ Mejoras Técnicas

- Refactor de llamadas a OpenAI con manejo de errores (401, 429, red, desconocidos).
- Mensajería de estado y toasts informativos para el usuario.
- Estructuración de tags (`version_inicial_giovanni` y `v1.0.0`).

### ⚠️ Seguridad / Privacidad

- Eliminación de clave en código fuente.
- Recomendación explícita de backend proxy futuro.

### 📂 Estructura Destacada

- `2. PFA - página Web.html` (aplicación principal)
- `1. Editor de Prompts.html` (editor visual)
- `codigo-interno/` (lógica, prompts, estilos, utilidades)
- `deploy-pages.yml` (workflow CI/CD)

### 🔍 Limitaciones Conocidas

- Prompts todavía parcialmente hard-coded en `script.js`.
- Detección PAREN basada en keywords (no clasificación semántica).
- Sin backend proxy / protección real de API Key.
- No hay tests automatizados.
- Sin soporte de streaming de respuestas.

### 🚀 Próximos Pasos Sugeridos

1. Centralizar prompts en tiempo de ejecución desde `prompts.json`.
2. Añadir capa de análisis para evaluación PAREN con modelo separado.
3. Implementar backend proxy (FastAPI/Express) para llamadas a OpenAI.
4. Añadir retries con backoff exponencial y límites.
5. Incorporar tests (Jest + Playwright o Cypress para UI, PyTest en herramientas Python opcionales).
6. Agregar modo de respuesta en streaming para mejor UX.
7. Generar métricas de uso (opt-in) para evaluación de aprendizaje.

## [version_inicial_giovanni] - 2025-09-26

### Estado

Snapshot inicial importado al repositorio antes de refactors de seguridad, despliegue y modo demo.

---

Formato basado en: <https://keepachangelog.com/es-ES/1.0.0/>
