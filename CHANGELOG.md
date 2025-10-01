# Changelog

Todas las notas de cambios relevantes del proyecto. Sigue el formato Keep a Changelog y versionado semántico (SemVer) cuando sea posible.

## [Unreleased]

### 🧪 Próximos (propuestos)

- Integrar tarea automatizada de minificación en workflow CI.
- Map de sourcemap privado opcional (no distribuido en Pages) para debugging avanzado.

## [v1.1.0] - 2025-10-01

### 🚀 Sistema de Feedback Universal

- **Widget de feedback integrado** con botón flotante en todas las páginas principales
- **Configuración híbrida de reportes**: 
  - 🐛 Bugs → GitHub Issues automático
  - 💡 Sugerencias → Email directo (rfiguerc@uc.cl)
  - ⚡ Urgente → Ambos canales simultáneamente
- **Captura automática de contexto técnico**: URL, logs, errores, viewport, sesión
- **Templates estructurados** para GitHub Issues (bug, enhancement, urgent)
- **Detección inteligente de entorno** (desarrollo vs producción)

### 🎯 Hub de Desarrollo Multi-Perfil

- **Página de entrada unificada** (`app.html`) con tres perfiles de usuario:
  - 👨‍💻 **Administrador**: Gestión completa, editor de prompts, herramientas de desarrollo
  - 👨‍🏫 **Instructor**: Configuración de simulaciones, ajuste de casos, revisión de feedback
  - 🎓 **Alumno**: Práctica de simulaciones, casos interactivos, evaluación de competencias
- **Accesos rápidos** a todas las funcionalidades del sistema
- **Diseño responsive** con interfaz moderna y intuitiva

### 🔧 Mejoras Técnicas

- **Inicialización robusta** con múltiples capas de fallback y diagnóstico
- **Logging centralizado** (window.PFA_BOOT_LOG) para debugging
- **Bootstrap automático** en script minificado para mayor autonomía
- **Workflow YAML mejorado** con sintaxis corregida

### 📋 Documentación

- **FEEDBACK_SYSTEM.md**: Guía completa del sistema de feedback
- **Templates de Issues**: Formularios estructurados para reportes eficientes
- **Configuración de contacto**: Enlaces directos y flujos de comunicación

### 🎯 Enfoque en Desarrollo Ágil

- **Feedback con mínimo esfuerzo** para acelerar ciclos de testing
- **Routing inteligente** de reportes según tipo y urgencia
- **Contexto técnico automático** para debugging eficiente
- **Múltiples canales** de comunicación según necesidad

## [v1.0.0] - 2025-09-26

### 🔒 Protección de Código / Distribución

- Añadida versión minificada/ligeramente ofuscada `script.min.js` y cargador condicional en la aplicación principal.
- Parámetro `?dev=1` fuerza uso de `script.js` legible para depuración local.
- Cabeceras legales añadidas a HTML secundarios (INDEX, app, editor, test, 404) y limpieza de duplicado en INDEX.

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
