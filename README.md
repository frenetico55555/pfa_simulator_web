# PFA Simulator Web

Simulador de Primeros Auxilios Psicológicos (PFA) para entrenamiento educativo. Permite generar casos clínicos simulados, interactuar con un "sobreviviente" controlado por IA (OpenAI) y obtener evaluación automática basada en protocolo ABCDE y criterios PAREN.

## Características

- Generación dinámica de caso (historia + triage)
- Chat interactivo con el paciente simulado
- Detección básica de criterios PAREN (palabras clave)
- Feedback automático (paciente + técnico ABCDE + criterios PAREN)
- Gráficos radar (Chart.js)
- Exportación de conversación
- Editor visual de prompts (`1. Editor de Prompts.html`)

## Estructura

```text
INDEX.html                # Índice / portal
2. PFA - página Web.html  # Aplicación principal
1. Editor de Prompts.html # Editor visual de prompts
codigo-interno/           # Lógica, estilos, prompts y utilidades
```

## Uso Rápido

1. Clonar repositorio.
2. Abrir `INDEX.html` o directamente `2. PFA - página Web.html` en el navegador.
3. Ingresar tu propia API Key de OpenAI (no se guarda).
4. Configurar parámetros y comenzar la simulación.
5. (Opcional) Usar la versión publicada en GitHub Pages cuando el workflow se ejecute: `https://frenetico55555.github.io/pfa_simulator_web/`

## Seguridad

- Se eliminó la API key embebida. Cada usuario debe ingresar la suya.
- Recomendado: implementar un backend proxy para proteger la clave.
- Escaneo automático de secretos: workflow `secret-scan` con Gitleaks (push, PR y semanal).

## Edición de Prompts

Abrir `1. Editor de Prompts.html` para modificar `prompts.json` de forma segura. Puede usarse `server_prompts.py` (Python 3) para guardar cambios vía POST:

```bash
python codigo-interno/server_prompts.py
```

Luego acceder a: <http://localhost:8000> y usar el editor.

## Mejoras Futuras Sugeridas

- Centralizar uso de `prompts.json` en lugar de prompts hard-coded en `script.js`.
- Backend proxy (FastAPI / Express) para llamadas a OpenAI.
- Detección PAREN con modelo analítico (clasificación del historial completo).
- Persistencia en localStorage / IndexedDB de sesiones.
- Tests automáticos y validación robusta de formato de feedback.

## Licencia y Propiedad Intelectual

Este proyecto es software propietario. Consulta:

- `LICENSE` (licencia de uso restringido)
- `TERMS_OF_USE.md` (términos de uso)
- `COPYRIGHT` (aviso de derechos)
- `NOTICE` (resumen legal)
- `SECURITY.md` (política de seguridad)
- `CONTRIBUTING.md` (política de contribución limitada)

No se permite redistribución, creación de obras derivadas ni uso comercial sin autorización expresa por escrito. El sistema de prompts, estructura de evaluación ABCDE/PAREN y lógica de simulación forman parte de la obra protegida.

## Autores

- Rodrigo A. Figueroa, MD, MHA, PhD(c) y equipo colaborador.
