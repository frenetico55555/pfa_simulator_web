# Arquitectura del PFA Simulator Web

Este documento describe los bloques principales, flujos y decisiones de diseño del simulador de Primeros Auxilios Psicológicos.

## 1. Visión General

La aplicación es una SPA ligera basada en HTML + CSS + JavaScript sin frameworks. Toda la lógica se centraliza en `script.js` (o su versión minificada) y se apoya en módulos auxiliares (`modalManager.js`, `charts.js`, `feedback.js`, `prompt_manager.py` para backend opcional y `prompts.json`).

## 2. Componentes Clave

| Componente | Rol | Notas |
|------------|-----|-------|
| `2. PFA - página Web.html` | Shell principal UI | Contiene todos los modales declarativos y el loader robusto. |
| `codigo-interno/script.js` | Núcleo de simulación | Genera historia, triage, chat, feedback, exportación. |
| `codigo-interno/modalManager.js` | Gestión de modales | Apertura/cierre declarativo via atributos `data-modal`, ARIA auto-labeling. |
| `codigo-interno/styles.css` | Estilos globales | Tokens de diseño, componentes, toasts, sliders, responsive. |
| `codigo-interno/charts.js` | Visualización | Render diferido de gráficos radar (Chart.js). |
| `codigo-interno/feedback.js` | Post-procesado | Hooks para modularizar feedback paciente/técnico. |
| `codigo-interno/prompts.json` | Fuente de verdad de prompts | Sustituye duplicados hard-coded gradualmente. |
| `feedback-widget.js` | Reporte de issues | Captura contexto + canal híbrido (GitHub / email). |

## 3. Flujo de Simulación

1. Configuración (o autoconfiguración aleatoria: parámetros via query `?mode=student&autostart=true&random=true`).
2. Generación de historia y triage (progresiva para mejorar percepción de velocidad).
3. Transición a ventana de simulación (chat con "sobreviviente").
4. Detección de criterios PARE (palabras clave heurísticas) y registro en estado.
5. Paso a Feedback: generación automática (paciente + técnico) con pre-cálculo si la conversación alcanza umbral.
6. Visualización de métricas: gráficos radar (carga diferida de Chart.js + dataset).
7. Resumen final y opción de reinicio / nueva simulación.

## 4. Arquitectura de Estado

El objeto `PFASimulator` mantiene:

- `patientCharacteristics` (configuración inicial + sliders de personalidad)
- `conversationHistory` (mensajes user/assistant/system)
- `pareCriteriaDetected` (Set)
- `currentStage` (config | triage | simulation | feedback | summary)
- `feedbackCache` (prewarming / almacenamiento temporal)
- Caché de elementos DOM (`_elCache`) vía helper `q()`.

## 5. Sistema de Modales Declarativos

Uso de atributos:

- `data-modal` en el contenedor raíz del modal.
- `data-modal-open="modalId"` en disparadores.
- `data-modal-close` en cierres (botones, íconos, acciones).

Características:

- Pila para manejo de múltiples modales superpuestos.
- Cierre con ESC (solo el tope de la pila).
- Enfoque restaurado al disparador original tras cerrar.
- Auto `aria-labelledby` y `aria-describedby` si faltan.

## 6. Accesibilidad

- Región viva (polite) de toasts en contenedor único (`#pfaToastContainer`).
- Indicador de carga con `role="status"` + `aria-live="polite"` (toggle `aria-hidden`).
- Enfoque visible (`.a11y-focus`) y manejo de `prefers-reduced-motion`.
- Auto etiquetado de modales.

## 7. Rendimiento

Estrategias:

- Carga diferida / lazy de `charts.js` (y Chart.js CDN) y partes de feedback.
- Generación progresiva de historia y triage (chunking).
- Uso de `requestIdleCallback` para cálculos no críticos (pre-procesado feedback).
- Inlining de CSS crítico para mejorar FCP.
- Diferimiento de inicializaciones no esenciales (upload, gráficos) hasta interacción o etapa correspondiente.

## 8. Feedback Automático

Pipelines:

- Paciente: Valores subjetivos por sliders + texto generado (placeholder modularizable).
- Técnico: Pilares ABCDE + criterios PARE + consolidación final.
- Prewarming: Si la conversación supera un umbral se dispara preparación en background.

## 9. Prompts y Extensibilidad

Ruta de migración: ir reemplazando strings en `script.js` hacia `prompts.json` y un `PromptFactory` central (ya introducido). Esto minimiza drift y facilita auditoría ética/educativa.

## 10. Exportación y Auditoría

- Exportación de conversación en texto simple (`exportConversation`).
- Log de arranque (`window.PFA_BOOT_LOG`) para diagnóstico de fallos de carga (minificado vs dev script).

## 11. Estilos y Tokens

Variables raíz (`:root`) concentran colores, gradientes, radios, sombras y espacio. Unificación de:

- Botones (`.btn` + variantes contextuales mediante custom property interna `--_bg`).
- Sliders (range) estilizados consistentes con foco accesible.
- Toasts no bloqueantes y modales con capas controladas (`z-index`).

## 12. Estrategia de Mejoras Futuras

| Área | Mejora sugerida | Impacto |
|------|-----------------|---------|
| Seguridad | Backend proxy para ocultar API key | Alto |
| Feedback | Análisis semántico en vez de keywords PARE | Medio |
| Persistencia | Guardar sesiones (localStorage/IndexedDB) | Medio |
| Testing | Suite unitaria mínima (mocks prompts) | Alto mantenibilidad |
| Accesibilidad | Navegación por teclado completa en listas y sliders | Medio |
| Internacionalización | Soporte multi-idioma (en-US, es-ES) | Medio |
| Observabilidad | Métricas de uso (opt-in) | Bajo/Medio |

## 13. Decisiones de Diseño Clave

1. Sin framework para reducir fricción educativa y dependencias.
2. Declaratividad vía atributos data-* para simplificar wiring de eventos.
3. Separación de responsabilidades: visual (CSS tokens), interacción (modals / toasts), lógica de simulación (PFASimulator), generación de prompts (PromptFactory), análisis (feedback.js modular).
4. Rendimiento percibido > pureza: generación progresiva de narrativa.

## 14. Riesgos Conocidos

- Dependencia directa de API OpenAI en front (exposición si se usa clave compartida).
- Heurística simple PARE puede generar falsos positivos/negativos.
- Sin tests automatizados aún (riesgo en refactors futuros).

## 15. Guía Rápida de Extensión

Agregar nuevo modal:

1. Crear markup `<div id="nuevoModal" class="modal" data-modal> ... </div>`.
2. Añadir botón con `data-modal-open="nuevoModal"`.
3. Añadir cierre con `data-modal-close`.
4. Dejar que `modalManager` genere ARIA si no se especifica.

Agregar nuevo criterio PARE:

1. Editar lista de keywords (buscar en `script.js` la función de detección).
2. Añadir explicación a la sección de feedback técnico.

Integrar nuevo gráfico:

1. Añadir dataset en `createCharts()`.
2. Ajustar `charts.js` para admitir tipo extra si se requiere (lazy import se mantiene igual).

## 16. Licenciamiento y Restricciones

Ver archivos legales (`LICENSE`, `TERMS_OF_USE.md`, etc.). El código y prompts son propietarios; no se permite redistribución ni uso comercial sin autorización.

---
Última actualización: (auto) generada el 2025-10-01.
