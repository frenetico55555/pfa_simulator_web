# Política de Seguridad / Security Policy

## Reporte de Vulnerabilidades

Si detectas una vulnerabilidad (fuga de clave, ejecución no autorizada, XSS, CSRF, manipulación de prompts):

1. NO abras un issue público.
2. Envía un correo a <mailto:rfiguerc@uc.cl> con detalles técnicos y pasos de reproducción.
3. Incluye severidad estimada y posible impacto.

## Claves y Credenciales

- No se debe commitear ninguna API key.
- El repositorio incluye validaciones manuales; se recomienda añadir un escaneo automatizado futuro (gitleaks / trufflehog).

## Dependencias

Actualmente la aplicación es principalmente estática; cualquier futura dependencia externa debe ser auditada (hash integrity + versión fija).

## Modelo de Amenazas (Resumen)

- Exposición de prompts propietarios.
- Abuso de la interfaz para scraping masivo.
- Inyección de instrucciones maliciosas en el flujo conversacional.

## Mitigaciones Planeadas

- Backend proxy para ocultar claves y aplicar rate limiting.
- Sanitización adicional de entradas y logs.
- Monitoreo de uso (si se introduce telemetría opt-in).

## Alcance

Esta política cubre el código en este repositorio. El uso en entornos institucionales puede requerir controles adicionales (SSO, auditoría, logging seguro).
