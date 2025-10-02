# PFA Simulator Web

Simulador de Primeros Auxilios Psicológicos (PFA) para entrenamiento educativo. Permite generar casos clínicos simulados, interactuar con un "sobreviviente" controlado por IA (OpenAI) y obtener evaluación automática basada en protocolo ABCDE y criterios PAREN.

## 🚀 Novedades v1.1.0

### 🎯 Hub de Desarrollo Multi-Perfil

- **Entrada unificada** en `app.html` con tres perfiles de usuario
- **Admin**: Gestión completa y editor de prompts
- **Instructor**: Configuración de simulaciones y casos
- **Alumno**: Práctica interactiva y evaluación

### 🐛 Sistema de Feedback Universal

- **Accesibilidad mejorada**: Sistema de modales declarativos con etiquetado ARIA automático y región viva para notificaciones
- **Rendimiento**: Carga diferida de gráficos y feedback, generación progresiva de historia clínica y uso de requestIdleCallback
- **Unificación visual**: Tokens de diseño centralizados, botones modernizados y estilos de sliders unificados
- **Notificaciones no bloqueantes**: Reemplazo de alert() por toasts accesibles (aria-live polite)

- **Widget integrado** en todas las páginas para reportes instantáneos
- **Configuración híbrida**: Bugs→GitHub Issues, Sugerencias→Email
- **Contexto automático**: Captura técnica para debugging eficiente
- **Templates estructurados** para reportes organizados

## Características

- Generación dinámica de caso (historia + triage)
- Chat interactivo con el paciente simulado
- Detección básica de criterios PAREN (palabras clave)
- Feedback automático (paciente + técnico ABCDE + criterios PAREN)
- Gráficos radar (Chart.js)
- Exportación de conversación
- Editor visual de prompts (`1. Editor de Prompts.html`)
- **Sistema de feedback integrado** para desarrollo ágil

## Estructura

```text
app.html                  # 🌟 Hub de desarrollo multi-perfil (NUEVO)
INDEX.html                # Índice / portal
2. PFA - página Web.html  # Aplicación principal
1. Editor de Prompts.html # Editor visual de prompts
codigo-interno/           # Lógica, estilos, prompts y utilidades
├── feedback-widget.js    # 🐛 Widget de feedback universal (NUEVO)
├── FEEDBACK_SYSTEM.md    # 📋 Documentación del sistema (NUEVO)
└── ...
.github/ISSUE_TEMPLATE/   # 📝 Templates para reportes (NUEVO)
├── bug_report.yml
├── feature_request.yml
├── urgent_issue.yml
└── config.yml
```

## Uso Rápido

### 🎯 Para Desarrollo/Testing

1. **Accede al Hub**: [app.html](https://frenetico55555.github.io/pfa_simulator_web/app.html)
2. **Selecciona tu perfil**: Admin, Instructor, o Alumno
3. **Usa el feedback**: Botón "🐛 Reportar Issue" siempre disponible

### 📚 Para Uso Educativo

1. Clonar repositorio.
2. Abrir `INDEX.html` o directamente `2. PFA - página Web.html` en el navegador.
3. Ingresar tu propia API Key de OpenAI (no se guarda).
4. Configurar parámetros y comenzar la simulación.
5. (Opcional) Usar la versión publicada en GitHub Pages: `https://frenetico55555.github.io/pfa_simulator_web/`

## 🐛 Sistema de Feedback

### Para Reportar Issues

- **Widget integrado**: Botón flotante en todas las páginas
- **GitHub Issues**: [Crear reporte estructurado](https://github.com/frenetico55555/pfa_simulator_web/issues/new/choose)
- **Email directo**: [rfiguerc@uc.cl](mailto:rfiguerc@uc.cl) para sugerencias

### Tipos de Reporte

- 🐛 **Bugs**: Automáticamente a GitHub Issues
- 💡 **Sugerencias**: Email directo al desarrollador
- ⚡ **Urgente**: Ambos canales simultáneamente

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

### Resumen de Restricciones (Uso No Permitido)

Las siguientes acciones están expresamente prohibidas sin autorización escrita del titular:

- Reempaquetar, redistribuir o publicar el código o prompts en repositorios públicos o privados ajenos.
- Crear productos, cursos, plataformas o servicios comerciales basados en esta aplicación o sus prompts.
- Extraer masivamente prompts o lógica para entrenar/u optimizar otros modelos o datasets.
- Usar el simulador como herramienta de triage, diagnóstico clínico real o sustituto de intervención profesional.
- Quitar avisos legales, cabeceras de copyright o alterar referencias a los autores.
- Intentar desofuscar, descompilar o revertir intencionalmente la versión minificada más allá de lo necesario para auditoría legítima interna.

Si tienes una necesidad legítima fuera de este marco, solicita permiso de forma previa (ver contacto en `TERMS_OF_USE.md`).

## Autores

- Rodrigo A. Figueroa, MD, MHA, PhD(c) y equipo colaborador.
