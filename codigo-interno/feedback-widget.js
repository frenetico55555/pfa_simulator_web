/**
 * PFA Simulator - Sistema de Feedback Universal
 * Copyright (c) 2025 Rodrigo A. Figueroa y colaboradores.
 * 
 * Widget de feedback integrado para desarrollo ágil
 * Configuración híbrida: GitHub Issues + Email directo
 */

(function() {
    'use strict';
    
    // Configuración
    const CONFIG = {
        enabled: true, // Solo activo en desarrollo
        email: 'rfiguerc@uc.cl',
        githubRepo: 'frenetico55555/pfa_simulator_web',
        version: '1.0.0'
    };
    
    // Solo activar en desarrollo (detectar localhost o parámetro)
    const isDev = location.hostname === 'localhost' || 
                  location.hostname === '127.0.0.1' || 
                  location.search.includes('feedback=true') ||
                  location.hostname.includes('github.io'); // Para GitHub Pages en desarrollo
    
    if (!CONFIG.enabled || !isDev) return;
    
    // Estado del widget
    let isInitialized = false;
    let sessionId = generateSessionId();
    let contextData = {};
    
    // Generar ID de sesión único
    function generateSessionId() {
        return 'pfa_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // Capturar contexto automático
    function captureContext() {
        const urlParams = new URLSearchParams(location.search);
        
        contextData = {
            timestamp: new Date().toISOString(),
            sessionId: sessionId,
            url: location.href,
            userAgent: navigator.userAgent,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            mode: urlParams.get('mode') || 'none',
            referrer: document.referrer || 'direct',
            bootLog: window.PFA_BOOT_LOG || [],
            errors: getConsoleErrors()
        };
        
        return contextData;
    }
    
    // Capturar errores de consola
    function getConsoleErrors() {
        // Interceptar errores futuros
        const errors = [];
        const originalError = console.error;
        console.error = function(...args) {
            errors.push({
                time: new Date().toISOString(),
                message: args.join(' ')
            });
            originalError.apply(console, args);
        };
        
        window.addEventListener('error', function(e) {
            errors.push({
                time: new Date().toISOString(),
                message: `${e.message} at ${e.filename}:${e.lineno}:${e.colno}`
            });
        });
        
        return errors;
    }
    
    // Crear HTML del widget
    function createWidget() {
        const widgetHTML = `
            <div id="pfa-feedback-widget" style="position: fixed; bottom: 20px; right: 20px; z-index: 9999; font-family: system-ui, -apple-system, sans-serif;">
                <!-- Botón Principal -->
                <div id="pfa-feedback-btn" style="
                    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                    color: white;
                    border: none;
                    border-radius: 50px;
                    padding: 12px 20px;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                    font-size: 14px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.3s ease;
                    max-width: 200px;
                    overflow: hidden;
                " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    <span style="font-size: 16px;">🐛</span>
                    <span id="pfa-feedback-text">Reportar Issue</span>
                </div>
                
                <!-- Modal de Feedback -->
                <div id="pfa-feedback-modal" style="
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    z-index: 10000;
                    backdrop-filter: blur(4px);
                ">
                    <div style="
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background: white;
                        border-radius: 16px;
                        padding: 30px;
                        max-width: 500px;
                        width: 90%;
                        max-height: 80vh;
                        overflow-y: auto;
                        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                    ">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                            <h3 style="margin: 0; color: #1f2937; font-size: 1.25rem;">💬 Enviar Feedback</h3>
                            <button id="pfa-feedback-close" style="
                                background: none;
                                border: none;
                                font-size: 24px;
                                cursor: pointer;
                                color: #6b7280;
                                padding: 0;
                                width: 30px;
                                height: 30px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                border-radius: 50%;
                            " onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='none'">×</button>
                        </div>
                        
                        <!-- Tipo de Feedback -->
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Tipo de Feedback:</label>
                            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                                <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; padding: 8px 12px; border: 2px solid #e5e7eb; border-radius: 8px; transition: all 0.3s;" onclick="selectFeedbackType(this, 'bug')">
                                    <input type="radio" name="feedbackType" value="bug" style="margin: 0;">
                                    <span>🐛 Bug/Error</span>
                                </label>
                                <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; padding: 8px 12px; border: 2px solid #e5e7eb; border-radius: 8px; transition: all 0.3s;" onclick="selectFeedbackType(this, 'suggestion')">
                                    <input type="radio" name="feedbackType" value="suggestion" style="margin: 0;">
                                    <span>💡 Sugerencia</span>
                                </label>
                                <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; padding: 8px 12px; border: 2px solid #e5e7eb; border-radius: 8px; transition: all 0.3s;" onclick="selectFeedbackType(this, 'urgent')">
                                    <input type="radio" name="feedbackType" value="urgent" style="margin: 0;">
                                    <span>⚡ Urgente</span>
                                </label>
                            </div>
                        </div>
                        
                        <!-- Descripción -->
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Descripción:</label>
                            <textarea id="pfa-feedback-description" placeholder="Describe el problema o sugerencia..." style="
                                width: 100%;
                                height: 100px;
                                padding: 12px;
                                border: 2px solid #e5e7eb;
                                border-radius: 8px;
                                font-family: inherit;
                                font-size: 14px;
                                resize: vertical;
                                outline: none;
                            " onfocus="this.style.borderColor='#3b82f6'" onblur="this.style.borderColor='#e5e7eb'"></textarea>
                        </div>
                        
                        <!-- Email opcional -->
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Email (opcional):</label>
                            <input type="email" id="pfa-feedback-email" placeholder="tu@email.com" style="
                                width: 100%;
                                padding: 12px;
                                border: 2px solid #e5e7eb;
                                border-radius: 8px;
                                font-family: inherit;
                                font-size: 14px;
                                outline: none;
                            " onfocus="this.style.borderColor='#3b82f6'" onblur="this.style.borderColor='#e5e7eb'">
                        </div>
                        
                        <!-- Contexto técnico -->
                        <details style="margin-bottom: 20px;">
                            <summary style="cursor: pointer; font-weight: 600; color: #6b7280; margin-bottom: 10px;">🔧 Contexto Técnico (automático)</summary>
                            <pre id="pfa-context-preview" style="
                                background: #f9fafb;
                                padding: 12px;
                                border-radius: 8px;
                                font-size: 11px;
                                color: #4b5563;
                                overflow-x: auto;
                                white-space: pre-wrap;
                                margin: 0;
                            "></pre>
                        </details>
                        
                        <!-- Botones de acción -->
                        <div style="display: flex; gap: 10px; justify-content: flex-end;">
                            <button id="pfa-feedback-copy" style="
                                background: #f3f4f6;
                                border: 1px solid #d1d5db;
                                color: #374151;
                                padding: 10px 16px;
                                border-radius: 8px;
                                cursor: pointer;
                                font-weight: 600;
                                font-size: 14px;
                            ">📋 Copiar Info</button>
                            <button id="pfa-feedback-submit" style="
                                background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                                border: none;
                                color: white;
                                padding: 10px 20px;
                                border-radius: 8px;
                                cursor: pointer;
                                font-weight: 600;
                                font-size: 14px;
                            ">🚀 Enviar Feedback</button>
                        </div>
                        
                        <!-- Estado -->
                        <div id="pfa-feedback-status" style="
                            margin-top: 15px;
                            padding: 10px;
                            border-radius: 8px;
                            font-size: 14px;
                            display: none;
                        "></div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', widgetHTML);
    }
    
    // Seleccionar tipo de feedback
    window.selectFeedbackType = function(element, type) {
        // Remover selección anterior
        const labels = element.parentNode.querySelectorAll('label');
        labels.forEach(label => {
            label.style.borderColor = '#e5e7eb';
            label.style.background = 'white';
        });
        
        // Aplicar selección actual
        element.style.borderColor = '#3b82f6';
        element.style.background = '#eff6ff';
        element.querySelector('input').checked = true;
    };
    
    // Mostrar contexto técnico
    function updateContextPreview() {
        const context = captureContext();
        const preview = document.getElementById('pfa-context-preview');
        if (preview) {
            preview.textContent = JSON.stringify(context, null, 2);
        }
    }
    
    // Generar contenido para GitHub Issue
    function generateGitHubIssueBody(type, description, email, context) {
        const typeEmoji = {
            bug: '🐛',
            suggestion: '💡',
            urgent: '⚡'
        };
        
        return `## ${typeEmoji[type]} Reporte de ${type === 'bug' ? 'Bug' : type === 'suggestion' ? 'Sugerencia' : 'Issue Urgente'}

### 📝 Descripción
${description}

### 👤 Contacto
${email ? `Email: ${email}` : 'No proporcionado'}

### 🔧 Contexto Técnico
- **URL**: ${context.url}
- **Modo**: ${context.mode}
- **Sesión**: ${context.sessionId}
- **Timestamp**: ${context.timestamp}
- **Viewport**: ${context.viewport}
- **User Agent**: ${context.userAgent}

### 📊 Logs
${context.bootLog.length > 0 ? '**Boot Log:**\n```\n' + context.bootLog.join('\n') + '\n```' : 'No boot logs disponibles'}

${context.errors.length > 0 ? '**Errores de Consola:**\n```\n' + context.errors.map(e => `[${e.time}] ${e.message}`).join('\n') + '\n```' : 'No errores de consola registrados'}

---
*Reporte generado automáticamente por PFA Feedback Widget v${CONFIG.version}*`;
    }
    
    // Enviar feedback
    function submitFeedback() {
        const type = document.querySelector('input[name="feedbackType"]:checked')?.value;
        const description = document.getElementById('pfa-feedback-description').value.trim();
        const email = document.getElementById('pfa-feedback-email').value.trim();
        
        if (!type || !description) {
            showStatus('❌ Por favor completa el tipo y descripción', 'error');
            return;
        }
        
        const context = captureContext();
        showStatus('📤 Enviando feedback...', 'loading');
        
        // Envío híbrido basado en tipo
        if (type === 'bug') {
            // Bug → GitHub Issue
            sendToGitHub(type, description, email, context);
        } else if (type === 'suggestion') {
            // Sugerencia → Email
            sendToEmail(type, description, email, context);
        } else if (type === 'urgent') {
            // Urgente → Ambos
            sendToGitHub(type, description, email, context);
            sendToEmail(type, description, email, context);
        }
    }
    
    // Enviar a GitHub Issues
    function sendToGitHub(type, description, email, context) {
        const title = `[${type.toUpperCase()}] ${description.substring(0, 50)}${description.length > 50 ? '...' : ''}`;
        const body = encodeURIComponent(generateGitHubIssueBody(type, description, email, context));
        const labels = type === 'bug' ? 'bug' : type === 'urgent' ? 'urgent' : 'enhancement';
        
        const url = `https://github.com/${CONFIG.githubRepo}/issues/new?title=${encodeURIComponent(title)}&body=${body}&labels=${labels}`;
        
        // Abrir en nueva ventana
        window.open(url, '_blank');
        showStatus('✅ GitHub Issue creado. Revisa la nueva ventana.', 'success');
    }
    
    // Enviar por email
    function sendToEmail(type, description, email, context) {
        const subject = `[PFA Feedback] ${type.charAt(0).toUpperCase() + type.slice(1)}: ${description.substring(0, 30)}`;
        const body = `Tipo: ${type}
Descripción: ${description}
Email: ${email || 'No proporcionado'}

Contexto Técnico:
${JSON.stringify(context, null, 2)}`;
        
        const mailto = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailto;
        
        showStatus('✅ Cliente de email abierto. Envía el mensaje.', 'success');
    }
    
    // Copiar información al portapapeles
    function copyToClipboard() {
        const type = document.querySelector('input[name="feedbackType"]:checked')?.value || 'general';
        const description = document.getElementById('pfa-feedback-description').value.trim();
        const email = document.getElementById('pfa-feedback-email').value.trim();
        const context = captureContext();
        
        const content = `PFA Feedback Report
==================
Tipo: ${type}
Descripción: ${description}
Email: ${email || 'No proporcionado'}

Contexto Técnico:
${JSON.stringify(context, null, 2)}`;
        
        navigator.clipboard.writeText(content).then(() => {
            showStatus('📋 Información copiada al portapapeles', 'success');
        }).catch(() => {
            showStatus('❌ Error al copiar. Usa Ctrl+C manualmente', 'error');
        });
    }
    
    // Mostrar estado
    function showStatus(message, type) {
        const status = document.getElementById('pfa-feedback-status');
        if (!status) return;
        
        const colors = {
            success: { bg: '#dcfce7', border: '#16a34a', color: '#166534' },
            error: { bg: '#fef2f2', border: '#dc2626', color: '#991b1b' },
            loading: { bg: '#eff6ff', border: '#3b82f6', color: '#1e40af' }
        };
        
        const style = colors[type] || colors.loading;
        status.style.display = 'block';
        status.style.background = style.bg;
        status.style.border = `1px solid ${style.border}`;
        status.style.color = style.color;
        status.textContent = message;
        
        if (type !== 'loading') {
            setTimeout(() => {
                status.style.display = 'none';
            }, 5000);
        }
    }
    
    // Event listeners
    function attachEventListeners() {
        // Botón principal
        document.getElementById('pfa-feedback-btn').addEventListener('click', () => {
            document.getElementById('pfa-feedback-modal').style.display = 'block';
            updateContextPreview();
        });
        
        // Cerrar modal
        document.getElementById('pfa-feedback-close').addEventListener('click', () => {
            document.getElementById('pfa-feedback-modal').style.display = 'none';
        });
        
        // Cerrar al hacer clic fuera
        document.getElementById('pfa-feedback-modal').addEventListener('click', (e) => {
            if (e.target.id === 'pfa-feedback-modal') {
                document.getElementById('pfa-feedback-modal').style.display = 'none';
            }
        });
        
        // Botones de acción
        document.getElementById('pfa-feedback-submit').addEventListener('click', submitFeedback);
        document.getElementById('pfa-feedback-copy').addEventListener('click', copyToClipboard);
        
        // Escape para cerrar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.getElementById('pfa-feedback-modal').style.display = 'none';
            }
        });
    }
    
    // Inicializar widget
    function initWidget() {
        if (isInitialized) return;
        
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initWidget);
            return;
        }
        
        createWidget();
        attachEventListeners();
        captureContext();
        isInitialized = true;
        
        console.log('%cPFA Feedback Widget', 'background: #3b82f6; color: white; padding: 4px 8px; border-radius: 4px;', 'v' + CONFIG.version + ' iniciado');
    }
    
    // Auto-inicializar
    initWidget();
    
})();