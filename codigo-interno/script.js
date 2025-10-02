/*
 * PFA Simulator Web - Core Logic
 * Copyright (c) 2025 Rodrigo A. Figueroa y colaboradores.
 * Propietario. Uso restringido educativo. No redistribuir ni crear derivados sin autorización escrita.
 * Ver LICENSE, TERMS_OF_USE.md y NOTICE.
 */
// Factoría de prompts LEGACY (simple, solo strings). La nueva estructura vive en promptFactory.js
class LegacyPromptFactory {
    screenwriter(config) {
        const currentDate = new Date();
        const twoWeeksAgo = new Date(currentDate.getTime() - 14 * 24 * 60 * 60 * 1000);
        return `Eres un guionista experto en la generación de guiones para simulación médica. 
        Crea una historia realista y detallada de un sobreviviente de trauma.
        \nCRÍTICO: El evento traumático DEBE haber ocurrido entre hoy (${currentDate.toISOString().split('T')[0]}) 
        y hace dos semanas (${twoWeeksAgo.toISOString().split('T')[0]}).\n\nDetalles del personaje:\n- Edad: ${config.age}\n- Género: ${config.gender}\n- Tipo de Trauma: ${config.traumaType}\n- Escenario del Trauma: ${config.traumaSetting}\n- Educación: ${config.education}\n- Estado Civil: ${config.civilStatus}\n- Red Social: ${config.network}\n- Vive Con: ${config.livesWith.join(', ')}\n- Hobbies: ${config.hobbies.join(', ')}\n- Rasgos de Personalidad: ${Object.entries(config.personalityValues).map(([k,v]) => `${k}: ${v}%`).join(', ')}\n- Condiciones Médicas: ${config.medicalConditions}\n- Condiciones Psiquiátricas: ${config.psychiatricConditions}\n- Medicamentos: ${config.medications}\n- Desafíos de PFA: ${config.challenges}\n\nIncluye reacciones psicológicas típicas peritraumáticas y describe el estado actual del sobreviviente.`;
    }
    triage(story) {
        return `Eres una enfermera de triage en un servicio telefónico de urgencias.\nTu tarea es entregar a un colega un resumen corto, claro y humano del caso.\n\nUsa oraciones simples y menciona SOLO:\n• Motivo de la llamada (qué pasó y dónde)\n• Estado general del paciente (alerta, inquieto, dolorido…)\n• Síntoma clave o malestar principal (dolor, miedo, confusión…)\n\nNO incluyas saludos ni despedidas. Ve directo al grano con un tono conversacional y profesional.\n\nHistoria del caso:\n${story}`;
    }
    survivor(config, story, triageEvaluation, userMessage) {
        return `Eres un sobreviviente de trauma con el siguiente perfil:\n\n- Edad: ${config.age}\n- Género: ${config.gender}\n- Tipo de trauma: ${config.traumaType}\n- Escenario del trauma: ${config.traumaSetting}\n- Nivel educativo: ${config.education}\n- Estado civil: ${config.civilStatus}\n- Red social: ${config.network}\n- Vive con: ${config.livesWith.join(', ')}\n- Hobbies: ${config.hobbies.join(', ')}\n- Rasgos de personalidad: ${Object.entries(config.personalityValues).map(([k,v]) => `${k}: ${v}%`).join(', ')}\n- Condiciones médicas: ${config.medicalConditions}\n- Condiciones psiquiátricas: ${config.psychiatricConditions}\n- Medicamentos: ${config.medications}\n- Desafíos de PFA: ${config.challenges}\n\nHistoria original: ${story}\nEvaluación de triage: ${triageEvaluation}\n\nResponde de forma auténtica y coherente con tu perfil a este mensaje: ${userMessage}\n\nNo eres el proveedor de PAP. Responde de forma auténtica y coherente con tu perfil.`;
    }
    patientFeedback(conversationHistory) {
        return `Basado en esta conversación, genera un feedback desde la perspectiva del paciente:\n\n${JSON.stringify(conversationHistory)}\n\nFormato requerido:\nNIVEL GENERAL DE COMODIDAD: X/5\nEMPATÍA: X/5\nRESPETO: X/5\nCLARIDAD EN LA COMUNICACIÓN: X/5\nATENCIÓN Y ESCUCHA: X/5\nSEGURIDAD TRANSMITIDA: X/5\n\nCOMENTARIOS DETALLADOS:\n[Texto libre con la experiencia del paciente]`;
    }
    technicalFeedback(conversationHistory) {
        return `Evalúa técnicamente esta conversación de primeros auxilios psicológicos:\n\n${JSON.stringify(conversationHistory)}\n\nEvalúa cada aspecto del protocolo ABCDE:\nA. Escucha Activa\nB. Reentrenamiento Respiratorio\nC. Clasificación de Necesidades\nD. Derivación a Redes\nE. Psicoeducación\n\nPara cada sección, proporciona:\n- Evaluación crítica\n- Ejemplos específicos\n- Sugerencias de mejora\n- NIVEL ALCANZADO: X/5`;
    }
}

// Clase principal de la aplicación
class PFASimulator {
    constructor() {
        this.currentStage = 'config';
        this.conversationHistory = [];
        this.patientCharacteristics = {};
        this.providerName = '';
        this.selectedModel = 'gpt-4o';
        this.pareDetected = null;
        this.story = '';
        this.triageEvaluation = '';
        // Modo demo (sin llamadas reales) controlado por query ?demo=1 o toggle
        const urlParams = new URLSearchParams(window.location.search);
        this.demoMode = urlParams.get('demo') === '1';
        this.apiKeyInput = null;
        this.apiKeyValid = false;
    this.prompts = new LegacyPromptFactory();
        // Cache ligero de elementos (lazy fill)
        this._elCache = new Map();
        // Enlazar eventos críticos inmediatamente tras instanciación (botón iniciar y API key)
        requestAnimationFrame(()=>{
            const startBtn = document.getElementById('startSimulationBtn');
            if (startBtn && !startBtn._pfaBound) {
                startBtn.addEventListener('click', () => this.startSimulation());
                startBtn._pfaBound = true;
            }
            // API key input
            this.apiKeyInput = document.getElementById('apiKeyInput');
            if (this.apiKeyInput && !this.apiKeyInput._pfaBound){
                this.apiKeyInput.addEventListener('input', ()=> this.validateAndMarkAPIKey());
                this.apiKeyInput._pfaBound = true;
            }
            // Auto inicializar persistencia
            this.initAPIKeyPersistence();
        });
    }

    // Delegación a modalManager (compat)
    openModal(id){ if (window.modalManager) window.modalManager.open(id); }
    closeModal(id){
        if (!window.modalManager) return;
        const top = window.modalManager.activeStack[window.modalManager.activeStack.length-1];
        if (top && top.id === id) {
            window.modalManager.closeTop();
        } else {
            const modal = document.getElementById(id);
            if (modal) modal.classList.remove('active');
        }
    }

    /** Aceptación del caso (triage) */
    bindTriageEvents() {
        const acceptBtn = document.getElementById('acceptCaseBtn');
        if (acceptBtn) acceptBtn.addEventListener('click', () => this.acceptCase());
    }

    /** Chat & controles inmediatos */
    bindChatEvents() {
        const sendBtn = document.getElementById('sendButton');
        if (sendBtn) sendBtn.addEventListener('click', () => this.sendMessage());
        const input = document.getElementById('inputText');
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
    const resourcesBtn = document.getElementById('resourcesBtn');
    if (resourcesBtn && !resourcesBtn.hasAttribute('data-modal-open')) resourcesBtn.addEventListener('click', () => this.openModal('resourcesDialog'));
    const pareBtn = document.getElementById('pareBtn');
    if (pareBtn && !pareBtn.hasAttribute('data-modal-open')) pareBtn.addEventListener('click', () => this.openModal('pareDialog'));
        const endBtn = document.getElementById('endConversationBtn');
        if (endBtn) endBtn.addEventListener('click', () => this.endConversation());
    }

    /** Recursos (selección & aplicación) */
    bindResourceEvents() {
        const copyBtn = document.getElementById('copyResourcesBtn');
        if (copyBtn) copyBtn.addEventListener('click', () => this.copySelectedResources());
        const applyBtn = document.getElementById('applyResourcesBtn');
        if (applyBtn) applyBtn.addEventListener('click', () => this.applyResources());
    }

    /** Subida de archivos */
    bindUploadEvents() {
        const uploadBtn = document.getElementById('uploadMaterialBtn');
        if (uploadBtn && !uploadBtn.hasAttribute('data-modal-open')) uploadBtn.addEventListener('click', () => {
            this.openModal('uploadDialog');
            if (!this._uploadInitialized) { this.setupFileUpload(); this._uploadInitialized = true; }
        });
        const cancelUpload = document.getElementById('cancelUploadBtn');
        if (cancelUpload && !cancelUpload.hasAttribute('data-modal-close')) cancelUpload.addEventListener('click', () => this.closeModal('uploadDialog'));
        const confirmUpload = document.getElementById('confirmUploadBtn');
        if (confirmUpload && !confirmUpload.hasAttribute('data-modal-close')) confirmUpload.addEventListener('click', () => this.uploadFiles());
    }

    /** Criterios PARE */
    bindPareEvents() {
        const confirmPare = document.getElementById('confirmPareBtn');
        if (confirmPare) confirmPare.addEventListener('click', () => this.confirmPareCriteria());
    const cancelPare = document.getElementById('cancelPareBtn');
    if (cancelPare && !cancelPare.hasAttribute('data-modal-close')) cancelPare.addEventListener('click', () => this.closeModal('pareDialog'));
    }

    /** Menú posterior a la conversación */
    bindMenuEvents() {
    const feedbackBtn = document.getElementById('feedbackBtn');
    if (feedbackBtn && !feedbackBtn.hasAttribute('data-modal-open')) feedbackBtn.addEventListener('click', () => this.showFeedback());
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) exportBtn.addEventListener('click', () => this.exportConversation());
        const exitBtn = document.getElementById('exitBtn');
        if (exitBtn) exitBtn.addEventListener('click', () => this.exitApplication());
    }

    /** Feedback (tabs, sliders, resumen) */
    bindFeedbackEvents() {
        const nextPatient = document.getElementById('nextToPatientBtn');
        if (nextPatient) nextPatient.addEventListener('click', () => this.switchTab('patient'));
        const nextTechnical = document.getElementById('nextToTechnicalBtn');
        if (nextTechnical) nextTechnical.addEventListener('click', () => this.switchTab('technical'));
    const showSummary = document.getElementById('showSummaryBtn');
    if (showSummary && !showSummary.hasAttribute('data-modal-open')) showSummary.addEventListener('click', () => this.showSummary());

        // Sliders de aspectos del paciente
        document.querySelectorAll('.aspect-slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                e.target.nextElementSibling.textContent = e.target.value;
            });
        });
        // Sliders técnicos
        document.querySelectorAll('.score-slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                e.target.nextElementSibling.textContent = e.target.value;
            });
        });
        // Navegación en resumen final
    const backBtn = document.getElementById('backToFeedbackBtn');
    if (backBtn && !backBtn.hasAttribute('data-modal-close')) backBtn.addEventListener('click', () => this.closeModal('summaryWindow'));
        const finishBtn = document.getElementById('finishFeedbackBtn');
        if (finishBtn) finishBtn.addEventListener('click', () => this.finishFeedback());
    }

    // Inicializar persistencia de API key
    initAPIKeyPersistence() {
        if (!this.apiKeyInput) return;
        const saved = localStorage.getItem('pfa_api_key');
        if (saved && saved.startsWith('sk-')) {
            this.apiKeyInput.value = saved;
            this.validateAndMarkAPIKey();
        }
        // Reflejar estado de demo si viene por query
        const demoToggle = document.getElementById('demoModeToggle');
        if (demoToggle) {
            demoToggle.checked = this.demoMode;
        }
    }

    // Validar API key y mostrar feedback visual
    validateAndMarkAPIKey() {
        if (!this.apiKeyInput) return false;
        const value = this.apiKeyInput.value.trim();
        const valid = /^sk-[a-zA-Z0-9-_]{10,}/.test(value);
        this.apiKeyValid = valid;
        this.apiKeyInput.style.border = valid ? '2px solid #28a745' : (value ? '2px solid #dc3545' : '1px solid #ccc');
        const hint = document.getElementById('apiKeyHint');
        if (hint) {
            if (!value) {
                hint.textContent = 'Ingresa tu clave de OpenAI (no se envía a ningún servidor externo, solo a OpenAI).';
                hint.style.color = '#666';
            } else if (!valid) {
                hint.textContent = 'Formato de clave no reconocido. Debe comenzar con sk-';
                hint.style.color = '#dc3545';
            } else {
                hint.textContent = 'Clave válida.';
                hint.style.color = '#28a745';
            }
        }
        return valid;
    }

    // Configurar sliders de personalidad
    setupSliders() {
        // Usa helper genérico (0-100%)
        this.bindValueMirroring('.personality-slider', (el) => {
            const display = el.parentElement.querySelector('.slider-value');
            return display;
        }, v => v + '%');
    }

    // Helper genérico para reflejar valores de sliders u otros inputs numéricos
    bindValueMirroring(selector, getDisplayEl = el => el.nextElementSibling, formatter = v => v) {
        document.querySelectorAll(selector).forEach(el => {
            el.addEventListener('input', (e) => {
                const displayEl = getDisplayEl(e.target);
                if (displayEl) displayEl.textContent = formatter(e.target.value);
            });
        });
    }
    // === Fin helpers UI ===

    // (showModal/hideModal) deprecated; replaced by openModal/closeModal wrappers

    // Aleatorizar selecciones
    randomizeSelections() {
        const selects = document.querySelectorAll('select');
        selects.forEach(select => {
            const randomIndex = Math.floor(Math.random() * (select.options.length - 1));
            select.selectedIndex = randomIndex;
        });

        // Aleatorizar checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = Math.random() > 0.5;
        });

        // Aleatorizar sliders de personalidad
        document.querySelectorAll('.personality-slider').forEach(slider => {
            const randomValue = Math.floor(Math.random() * 11) * 10;
            slider.value = randomValue;
            slider.parentElement.querySelector('.slider-value').textContent = randomValue + '%';
        });

        // Aleatorizar dificultad
        const difficultySlider = document.getElementById('difficultySlider');
        const randomDifficulty = Math.floor(Math.random() * 101);
        difficultySlider.value = randomDifficulty;
        document.getElementById('difficultyValue').textContent = randomDifficulty + '%';
    }

    // Aleatorizar personalidad
    randomizePersonality() {
        document.querySelectorAll('.personality-slider').forEach(slider => {
            const randomValue = Math.floor(Math.random() * 11) * 10;
            slider.value = randomValue;
            slider.parentElement.querySelector('.slider-value').textContent = randomValue + '%';
        });
    }

    // Iniciar simulación
    async startSimulation() {
        const config = this.getSimulationConfig();
        
        if (!config.providerName) {
            this.showToast('Por favor, ingrese su nombre', { type: 'warning' });
            return;
        }

        this.providerName = config.providerName;
        this.patientCharacteristics = config;
        
    this.closeModal('simulationConfigWindow');
        const urlParams = new URLSearchParams(window.location.search);
        const immersive = urlParams.get('mode')==='student' && urlParams.get('autostart')==='true';
        const loadingMsg = immersive ? 'Esperando que la enfermera de triage le asigne un caso...' : 'Generando simulación (historia y triage)...';
        console.debug('[autostart] startSimulation -> mostrando overlay con texto:', loadingMsg);
        this.showLoading(loadingMsg);
        // Diferir generación para liberar el hilo y permitir pintar UI
        this.scheduleTraumaStoryGeneration();
    }

    // Obtener configuración de simulación
    getSimulationConfig() {
        return {
            providerName: this.q('#providerName')?.value.trim() || '',
            difficulty: parseInt(this.q('#difficultySlider')?.value || '0'),
            traumaType: this.q('#traumaType')?.value || '',
            traumaSetting: this.q('#traumaSetting')?.value || '',
            age: this.q('#age')?.value || '',
            gender: this.q('#gender')?.value || '',
            challenges: this.q('#challenges')?.value || '',
            education: this.q('#education')?.value || '',
            civilStatus: this.q('#civilStatus')?.value || '',
            network: this.q('#network')?.value || '',
            livesWith: this.getCheckedValues('livesWithOptions'),
            hobbies: this.getCheckedValues('hobbiesOptions'),
            personalityValues: this.getPersonalityValues(),
            medicalConditions: this.q('#medicalConditions')?.value || '',
            psychiatricConditions: this.q('#psychiatricConditions')?.value || '',
            medications: this.q('#medications')?.value || ''
        };
    }

    // Obtener valores de checkboxes
    getCheckedValues(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return [];
        
        return Array.from(container.querySelectorAll('input[type="checkbox"]:checked'))
            .map(cb => cb.value);
    }

    // Obtener valores de personalidad
    getPersonalityValues() {
        const values = {};
        document.querySelectorAll('.personality-slider').forEach(slider => {
            const trait = slider.dataset.trait;
            values[trait] = parseInt(slider.value);
        });
        return values;
    }

    // Crear historia de trauma
    // Programar generación diferida (idle o pequeño timeout)
    scheduleTraumaStoryGeneration() {
        const run = () => this.createTraumaStoryProgressive();
        // Si estamos en autostart estudiante, esperar brevemente a que promptFactory cargue
        const params = new URLSearchParams(location.search);
        const waitStructured = params.get('mode')==='student' && params.get('autostart')==='true';
        if (waitStructured) {
            let attempts = 0;
            const maxAttempts = 25; // ~2.5s con 100ms
            const poll = () => {
                attempts++;
                if (window.promptFactory && typeof window.promptFactory.buildStoryPrompt === 'function') {
                    console.debug('[autostart] PromptFactory structured lista tras', attempts, 'intentos');
                    run();
                } else if (attempts < maxAttempts) {
                    setTimeout(poll, 100);
                } else {
                    console.warn('[autostart] PromptFactory no disponible tras espera. Continuando con legacy.');
                    run();
                }
            };
            return poll();
        }
        if ('requestIdleCallback' in window) {
            requestIdleCallback(run, { timeout: 1500 });
        } else {
            setTimeout(run, 60);
        }
    }

    // Generación progresiva con feedback incremental
    async createTraumaStoryProgressive() {
        const config = this.patientCharacteristics;
        try {
            const t0 = performance.now();
            console.debug('[story] fase 1 inicio');
            this.updateLoadingText('Generando historia del caso (1/2)...');
            // Nuevo flujo usando PromptFactory si disponible
            let story;
            if (window.promptFactory && typeof window.promptFactory.buildStoryPrompt === 'function') {
                console.debug('[story] usando structured PromptFactory para story');
                const { system, user } = await window.promptFactory.buildStoryPrompt({
                    traumaType: config.traumaType,
                    traumaSetting: config.traumaSetting,
                    age: config.age,
                    gender: config.gender,
                    difficulty: config.difficulty || 50
                });
                story = await this.callOpenAI({ system, user });
            } else {
                console.debug('[story] usando legacy prompt');
                story = await this.callOpenAI(this.createScreenwriterPrompt(config));
            }
            this.story = story;
            console.debug('[story] fase 1 completada, longitud historia:', story.length);
            this.updateLoadingText('Generando evaluación de triage (2/2)...');
            let triageEvaluation;
            if (window.promptFactory && typeof window.promptFactory.buildTriagePrompt === 'function') {
                console.debug('[triage] usando structured PromptFactory');
                const { system, user } = await window.promptFactory.buildTriagePrompt({
                    storySnippet: story.slice(0, 550) // pequeño extracto para triage
                });
                triageEvaluation = await this.callOpenAI({ system, user });
            } else {
                console.debug('[triage] usando legacy prompt');
                triageEvaluation = await this.callOpenAI(this.createTriagePrompt(story));
            }
            this.triageEvaluation = triageEvaluation;
            const total = (performance.now() - t0).toFixed(0);
            this._perfStoryMs = total;
            this.hideLoading();
            this.showTriageWindow(triageEvaluation);
            console.info('[perf] story+triage ms:', total);
            console.debug('[triage] longitud evaluación:', (triageEvaluation||'').length);
        } catch (error) {
            console.error('Error en la generación:', error);
            this.hideLoading();
            this.showToast('Error al generar historia/triage', { type: 'error' });
        }
    }

    // (Legacy compat) mantener createTraumaStory para rutas que aún lo llamen
    async createTraumaStory() { return this.createTraumaStoryProgressive(); }

    // Crear prompt del guionista
    createScreenwriterPrompt(config) { return this.prompts.screenwriter(config); }

    // Crear prompt de triage
    createTriagePrompt(story) { return this.prompts.triage(story); }

    // Inicialización extendida para PromptFactory
    _initPromptFactory() {
        if (window.promptFactoryInitialized) return;
        if (window.PromptFactory) {
            try {
                window.promptFactory = new window.PromptFactory();
                window.promptFactory.load().then(()=>{
                    console.log('[PromptFactory][structured] versión', window.promptFactory.version, 'cargada');
                }).catch(err=>{
                    console.warn('[PromptFactory][structured] Fallback activado', err);
                });
                window.promptFactoryInitialized = true;
            } catch(e){
                console.warn('[PromptFactory][structured] error al instanciar', e);
            }
        } else {
            console.warn('[PromptFactory][structured] no disponible aún al inicializar');
        }
    }

    // Llamar a OpenAI
    async callOpenAI(prompt) {
        // DEMO MODE: retorna una respuesta simulada sin llamar a la API real
        if (this.demoMode) {
            return this.generateDemoResponse(prompt);
        }

        const apiKey = this.apiKeyInput ? this.apiKeyInput.value.trim() : '';
        if (!apiKey) {
            throw new Error('API key no proporcionada. Ingrésala o activa modo demo.');
        }
        if (!this.validateAndMarkAPIKey()) {
            throw new Error('API key con formato inválido.');
        }
        let response;
        // Compatibilidad con prompts estructurados { system, user }
        let systemPrompt = 'Eres un asistente experto en simulación médica.';
        let userPrompt = prompt;
        if (prompt && typeof prompt === 'object' && ('system' in prompt) && ('user' in prompt)) {
            systemPrompt = prompt.system;
            userPrompt = prompt.user;
        }
        try {
            response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.selectedModel,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ],
                    max_tokens: 1000,
                    temperature: 0.7
                })
            });
        } catch (netErr) {
            throw new Error('No se pudo conectar a OpenAI. Revisa tu conexión.');
        }

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Clave API rechazada (401). Verifica que sea correcta y tenga permisos.');
            }
            if (response.status === 429) {
                throw new Error('Límite de uso excedido (429). Intenta más tarde.');
            }
            throw new Error(`Error de API: ${response.status}`);
        }

        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content || '[Respuesta vacía]';
        return content;
    }

    // Generar respuesta de demostración (sin API)
    generateDemoResponse(prompt) {
        // Aceptar prompt como string o como objeto {system,user}
        let base = '';
        if (prompt && typeof prompt === 'object') {
            base = (prompt.user || '') + ' ' + (prompt.system || '');
        } else if (typeof prompt === 'string') {
            base = prompt;
        }
        const seed = (base && base.length) ? base.length : 0;
        const sample = [
            'DEMOSTRACIÓN: Historia breve simulada. Paciente se comunica tras un evento traumático reciente y describe síntomas emocionales moderados. (Modo demo, sin IA real).',
            'DEMOSTRACIÓN: Evaluación de triage simulada. Motivo: evento agudo reciente. Estado: alerta, ansioso leve. Síntoma principal: preocupación y temblor ocasional. (Modo demo).',
            'DEMOSTRACIÓN: Respuesta generada localmente. Use una clave API válida para obtener contenido realista adaptado a la configuración.'
        ];
        return sample[seed % sample.length];
    }

    // Mostrar ventana de triage
    showTriageWindow(evaluation) {
        const triageEl = document.getElementById('triageMessage');
        if (triageEl) triageEl.innerHTML = evaluation || '(Sin evaluación)';
        console.debug('[triage] Abriendo ventana de triage. Longitud evaluación:', (evaluation||'').length);
        this.openModal('triageWindow');
        // Fallback defensivo si modalManager falla: activar manualmente
        const modal = document.getElementById('triageWindow');
        if (modal && !modal.classList.contains('active')) {
            // Esperar un frame para no interferir con modalManager si se inicializa tarde
            requestAnimationFrame(()=>{
                if (!modal.classList.contains('active')) {
                    modal.classList.add('active');
                    modal.setAttribute('aria-hidden','false');
                }
            });
        }
    }

    // Aceptar caso
    acceptCase() {
    this.closeModal('triageWindow');
    this.openModal('simulationWindow');
        this.currentStage = 'survivor';
        
        // Mostrar mensaje inicial
        const chatHistory = document.getElementById('chatHistory');
        chatHistory.innerHTML = '<div class="chat-message system">El superviviente está en línea. Puede comenzar la interacción.</div>';
        
        // Mostrar botones de control
        document.getElementById('endConversationBtn').style.display = 'inline-block';
    }

    // Enviar mensaje
    async sendMessage() {
        const inputText = document.getElementById('inputText');
        const message = inputText.value.trim();
        
        if (!message) return;
        
        if (this.currentStage !== 'survivor') {
            this.showToast('La simulación aún no ha comenzado', { type: 'warning' });
            return;
        }

        // Agregar mensaje del usuario al chat
        this.addChatMessage(message, 'user');
        inputText.value = '';

        // Mostrar indicador de carga
        this.showLoading('Pensando...');

        try {
            // Generar respuesta del superviviente (nuevo sistema si disponible)
            let survivorPrompt;
            if (window.promptFactory && typeof window.promptFactory.buildSurvivorPrompt === 'function') {
                survivorPrompt = await window.promptFactory.buildSurvivorPrompt({
                    config: this.patientCharacteristics,
                    story: this.story,
                    triage: this.triageEvaluation,
                    history: this.conversationHistory,
                    lastUserMessage: message,
                    maxHistory: 10
                });
            } else {
                survivorPrompt = this.createSurvivorPrompt(message);
            }
            const response = await this.callOpenAI(survivorPrompt);
            
            // Agregar respuesta al chat
            this.addChatMessage(response, 'assistant');
            
            // Verificar criterios PARE
            this.checkPARECriteria(response);
            
        } catch (error) {
            console.error('Error al generar respuesta:', error);
            this.addChatMessage('Error al procesar la respuesta. Por favor, intente nuevamente.', 'system');
        } finally {
            this.hideLoading();
        }
    }

    // Crear prompt del superviviente
    createSurvivorPrompt(userMessage) { return this.prompts.survivor(this.patientCharacteristics, this.story, this.triageEvaluation, userMessage); }

    // Agregar mensaje al chat
    addChatMessage(content, type) {
        const chatHistory = document.getElementById('chatHistory');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}`;
        messageDiv.textContent = content;
        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
        
        // Agregar al historial de conversación
        this.conversationHistory.push({
            role: type === 'user' ? 'user' : 'assistant',
            content: content
        });

        // Precalentamiento de prompts de feedback (cuando exista suficiente conversación)
        this.maybePrewarmFeedback();
    }

    maybePrewarmFeedback() {
        // Evitar repetir
        if (this._feedbackPrewarmed) return;
        if (this.conversationHistory.length < 6) return; // Umbral configurable
        const run = () => {
            try {
                // Generar y cachear prompts para acelerar primera llamada real
                this._prewarmedPatientPrompt = this.prompts.patientFeedback(this.conversationHistory);
                this._prewarmedTechnicalPrompt = this.prompts.technicalFeedback(this.conversationHistory);
                this._feedbackPrewarmed = true;
                // Opcional: pequeña señal
                // this.showToast('Feedback pre-calculado', { type: 'info', duration: 2000 });
            } catch (e) { console.debug('Prewarm feedback falló', e); }
        };
        if ('requestIdleCallback' in window) {
            requestIdleCallback(run, { timeout: 1200 });
        } else {
            setTimeout(run, 120);
        }
    }

    // Verificar criterios PARE
    checkPARECriteria(response) {
        const pareKeywords = [
            'quiero morir', 'suicid', 'matarme', 
            'escucho voces', 'me persiguen', 'no soy yo',
            'quiero lastimar', 'no merezco vivir', 'no aguanto más', 'quiero desaparecer'
        ];
        
        const hasPARE = pareKeywords.some(keyword => 
            response.toLowerCase().includes(keyword)
        );
        
        if (hasPARE) {
            this.openModal('pareDialog');
        }
    }

    // Confirmar criterio PARE
    confirmPareCriteria() {
        const pareCriteria = document.getElementById('pareCriteria').value;
        this.pareDetected = pareCriteria;
    this.closeModal('pareDialog');
    this.showToast(`Criterio PARE registrado: ${pareCriteria}`, { type: 'info' });
    }

    // Finalizar conversación
    endConversation() {
    this.closeModal('simulationWindow');
    this.openModal('menuWindow');
    }

    // Mostrar feedback
    showFeedback() {
    this.closeModal('menuWindow');
    this.openModal('feedbackWindow');
        this.generateAutomatedFeedback();
    }

    // Generar feedback automático
    async generateAutomatedFeedback() {
        if (!this.conversationHistory.length) return;
        // Performance: diferir a momento de baja prioridad
        const run = async () => {
            try {
                const t0 = performance.now();
                const patientFeedback = await this.generatePatientFeedback();
                this.updatePatientFeedback(patientFeedback);
                const technicalFeedback = await this.generateTechnicalFeedback();
                this.updateTechnicalFeedback(technicalFeedback);
                const total = (performance.now() - t0).toFixed(0);
                this._perfFeedbackMs = total;
                console.info('[perf] feedback total ms:', total);
            } catch (error) {
                console.error('Error al generar feedback:', error);
            }
        };
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => run());
        } else {
            setTimeout(run, 200);
        }
    }

    // Generar feedback del paciente
    async generatePatientFeedback() {
    if (window.promptFactory && typeof window.promptFactory.buildPatientFeedbackPrompt === 'function') {
            const { system, user } = await window.promptFactory.buildPatientFeedbackPrompt({
                config: this.patientCharacteristics,
                history: this.conversationHistory,
                maxHistory: 20
            });
            return await this.callOpenAI({ system, user });
        }
        const prompt = this._prewarmedPatientPrompt || this.prompts.patientFeedback(this.conversationHistory);
        return await this.callOpenAI(prompt);
    }

    // Generar feedback técnico
    async generateTechnicalFeedback() {
    if (window.promptFactory && typeof window.promptFactory.buildTechnicalFeedbackPrompt === 'function') {
            const pareDetectedList = Array.from(this.pareCriteriaDetected || []);
            const studentReportedList = Array.from(this.pareReportedByStudent || []);
            const { system, user } = await window.promptFactory.buildTechnicalFeedbackPrompt({
                history: this.conversationHistory,
                pareDetectedList,
                studentReportedList,
                maxHistory: 24
            });
            return await this.callOpenAI({ system, user });
        }
        const prompt = this._prewarmedTechnicalPrompt || this.prompts.technicalFeedback(this.conversationHistory);
        return await this.callOpenAI(prompt);
    }

    // Actualizar feedback del paciente
    updatePatientFeedback(feedback) {
        const area = document.getElementById('patientComments');
        if (area) area.value = feedback;
        this.processPatientRatings(feedback);
        // Importación diferida para lógica extra opcional
        if (!this._feedbackModulePromise) {
            this._feedbackModulePromise = import('./feedback.js').catch(()=>null);
        }
        this._feedbackModulePromise.then(mod => {
            if (mod && mod.postProcessPatient) {
                const processed = mod.postProcessPatient(feedback);
                if (area && processed !== feedback) area.value = processed;
            }
        });
    }

    // Procesar calificaciones del paciente
    processPatientRatings(feedback) {
        const patterns = {
            'NIVEL GENERAL DE COMODIDAD': /NIVEL GENERAL DE COMODIDAD:\s*(\d+)\/5/,
            'EMPATÍA': /EMPATÍA:\s*(\d+)\/5/,
            'RESPETO': /RESPETO:\s*(\d+)\/5/,
            'CLARIDAD EN LA COMUNICACIÓN': /CLARIDAD EN LA COMUNICACIÓN:\s*(\d+)\/5/,
            'ATENCIÓN Y ESCUCHA': /ATENCIÓN Y ESCUCHA:\s*(\d+)\/5/,
            'SEGURIDAD TRANSMITIDA': /SEGURIDAD TRANSMITIDA:\s*(\d+)\/5/
        };

        Object.entries(patterns).forEach(([aspect, pattern]) => {
            const match = feedback.match(pattern);
            if (match) {
                const rating = parseInt(match[1]);
                this.updateAspectRating(aspect, rating);
            }
        });
    }

    // Actualizar calificación de aspecto
    updateAspectRating(aspect, rating) {
        if (aspect === 'NIVEL GENERAL DE COMODIDAD') {
            document.getElementById('treatmentCombo').value = rating;
        } else {
            const aspectMapping = {
                'EMPATÍA': 'Empatía',
                'RESPETO': 'Respeto',
                'CLARIDAD EN LA COMUNICACIÓN': 'Claridad',
                'ATENCIÓN Y ESCUCHA': 'Atención',
                'SEGURIDAD TRANSMITIDA': 'Seguridad'
            };
            
            const aspectName = aspectMapping[aspect];
            if (aspectName) {
                const slider = document.querySelector(`[data-aspect="${aspectName}"]`);
                if (slider) {
                    slider.value = rating;
                    slider.nextElementSibling.textContent = rating;
                }
            }
        }
    }

    // Actualizar feedback técnico
    updateTechnicalFeedback(feedback) {
        this.populateFeedbackBlocks(feedback);
        if (!this._feedbackModulePromise) {
            this._feedbackModulePromise = import('./feedback.js').catch(()=>null);
        }
        this._feedbackModulePromise.then(mod => {
            if (mod && mod.summarizeTechnical) {
                const summary = mod.summarizeTechnical(feedback);
                this._technicalSummary = summary; // guardado para debugging / futura UI
            }
        });
    }

    // Poblar bloques de feedback
    populateFeedbackBlocks(feedback) {
        const letters = ['A', 'B', 'C', 'D', 'E'];
        
        letters.forEach(letter => {
            const start = feedback.indexOf(`${letter}. `);
            if (start !== -1) {
                const end = letter === 'E' ? 
                    feedback.indexOf('NIVEL ALCANZADO:', start) : 
                    feedback.indexOf(`${String.fromCharCode(letter.charCodeAt(0) + 1)}. `, start);
                
                const section = end !== -1 ? 
                    feedback.substring(start, end).trim() : 
                    feedback.substring(start).trim();
                
                const block = document.querySelector(`[data-letter="${letter}"] .feedback-text`);
                if (block) {
                    block.textContent = section;
                }
                
                // Extraer puntaje
                const scoreMatch = section.match(/NIVEL ALCANZADO:\s*(\d+)\/5/);
                if (scoreMatch) {
                    const score = parseInt(scoreMatch[1]);
                    const slider = document.querySelector(`[data-letter="${letter}"] .score-slider`);
                    const valueDisplay = document.querySelector(`[data-letter="${letter}"] .score-value`);
                    if (slider && valueDisplay) {
                        slider.value = score;
                        valueDisplay.textContent = score;
                    }
                }
            }
        });
        
        // Extraer sección PAREN
        const parenStart = feedback.indexOf('PAREN');
        if (parenStart !== -1) {
            const parenSection = feedback.substring(parenStart);
            const parenBlock = document.querySelector('[data-letter="PAREN"] .feedback-text');
            if (parenBlock) {
                parenBlock.textContent = parenSection;
            }
        }
    }

    // Cambiar pestaña
    switchTab(tabName) {
        // Ocultar todas las pestañas
        document.querySelectorAll('.tab-pane').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Mostrar pestaña seleccionada
        document.getElementById(tabName + 'Tab').classList.add('active');
        
        // Actualizar botones de pestaña
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    }

    // Mostrar resumen
    showSummary() {
    this.closeModal('feedbackWindow');
    this.openModal('summaryWindow');
        this.createCharts();
    }

    // Crear gráficos
    createCharts() {
        // Importación dinámica del módulo charts
        if (this._chartsModulePromise) {
            this._chartsModulePromise.then(mod => mod.renderCharts(this));
            return;
        }
        this._chartsModulePromise = import('./charts.js')
            .then(mod => {
                mod.renderCharts(this);
                return mod;
            })
            .catch(err => {
                console.error('Fallo al cargar módulo de gráficos', err);
                this.showToast('No se pudieron generar los gráficos', { type: 'error' });
            });
    }

    // Crear gráfico del paciente

    // Obtener valores del paciente
    getPatientValues() {
        const values = [];
        
        // Obtener valores de los sliders de aspectos
        document.querySelectorAll('.aspect-slider').forEach(slider => {
            values.push(parseInt(slider.value));
        });
        
        // Agregar valor general de comodidad
        values.push(parseInt(document.getElementById('treatmentCombo').value));
        
        return values;
    }

    // Obtener valores técnicos
    getTechnicalValues() {
        const values = [];
        const letters = ['A', 'B', 'C', 'D', 'E'];
        
        letters.forEach(letter => {
            const slider = document.querySelector(`[data-letter="${letter}"] .score-slider`);
            if (slider) {
                values.push(parseInt(slider.value));
            } else {
                values.push(0);
            }
        });
        
        return values;
    }

    // Mostrar indicador de carga (accesible)
    showLoading(text) {
        const txt = this.q('#loadingText');
        if (txt) txt.textContent = text;
        const ind = this.q('#loadingIndicator');
        if (ind) {
            ind.classList.remove('hidden');
            ind.setAttribute('aria-hidden','false');
        }
    }

    // Ocultar indicador de carga (accesible)
    hideLoading() {
        const ind = this.q('#loadingIndicator');
        if (ind) {
            ind.classList.add('hidden');
            ind.setAttribute('aria-hidden','true');
            console.debug('[loading] ocultado overlay');
        } else {
            console.warn('[loading] overlay no encontrado al intentar ocultar');
        }
    }

    updateLoadingText(text) {
        const txt = this.q('#loadingText');
        if (txt) txt.textContent = text;
    }

    // Query helper con cache (#id o selector simple)
    q(selector) {
        if (selector.startsWith('#')) {
            if (this._elCache.has(selector)) return this._elCache.get(selector);
            const el = document.querySelector(selector);
            if (el) this._elCache.set(selector, el);
            return el;
        }
        return document.querySelector(selector);
    }

    // Mensaje informativo no intrusivo
    showInfoMessage(msg) {
        console.log('[INFO]', msg);
        const existing = document.getElementById('pfaInfoToast');
        if (existing) existing.remove();
        const div = document.createElement('div');
        div.id = 'pfaInfoToast';
        div.style.position = 'fixed';
        div.style.bottom = '16px';
        div.style.right = '16px';
        div.style.background = '#1f2937';
        div.style.color = '#fff';
        div.style.padding = '12px 16px';
        div.style.borderRadius = '8px';
        div.style.fontSize = '14px';
        div.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)';
        div.textContent = msg;
        document.body.appendChild(div);
        setTimeout(()=>{ div.remove(); }, 5000);
    }

    // Sistema de notificaciones unificado (no bloqueante)
    showToast(message, { type = 'info', duration = 3800 } = {}) {
        let container = document.getElementById('pfaToastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'pfaToastContainer';
            // Accesibilidad: un único live region contenedor (polite) para evitar lectura duplicada
            container.setAttribute('role','status');
            container.setAttribute('aria-live','polite');
            container.setAttribute('aria-atomic','false');
            container.setAttribute('aria-relevant','additions text');
            container.setAttribute('aria-label','Notificaciones del simulador');
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.className = `pfa-toast ${type}`;
        toast.innerHTML = `<span style="flex:1">${message}</span><button aria-label="Cerrar">×</button>`;
        const closeBtn = toast.querySelector('button');
        closeBtn.addEventListener('click', () => this._dismissToast(toast));
        container.appendChild(toast);
        if (duration > 0) setTimeout(() => this._dismissToast(toast), duration);
    }
    _dismissToast(toast){ if (!toast) return; toast.style.opacity='0'; toast.style.transition='opacity .25s'; setTimeout(()=>toast.remove(), 250); }

    // Mostrar recursos
    showResources() {
    this.openModal('resourcesDialog');
    }

    // Copiar recursos seleccionados
    copySelectedResources() {
        const selected = [];
        document.querySelectorAll('.resources-list input[type="checkbox"]:checked').forEach(cb => {
            selected.push(cb.value);
        });
        
        if (selected.length > 0) {
            navigator.clipboard.writeText(selected.join('\n')).then(() => {
                this.showToast('Recursos copiados al portapapeles', { type: 'success' });
            });
        } else {
            this.showToast('No hay recursos seleccionados', { type: 'warning' });
        }
    }

    // Aplicar recursos
    applyResources() {
        const selected = [];
        document.querySelectorAll('.resources-list input[type="checkbox"]:checked').forEach(cb => {
            selected.push(cb.value);
        });
        
        if (selected.length > 0) {
            const resourcesList = document.getElementById('resourcesList');
            resourcesList.innerHTML = selected.map(resource => 
                `<div>• ${resource}</div>`
            ).join('');
            
            this.closeModal('resourcesDialog');
        } else {
            this.showToast('No hay recursos seleccionados', { type: 'warning' });
        }
    }

    // Configurar funcionalidad de carga de archivos
    setupFileUpload() {
        const dropZone = document.getElementById('uploadDropZone');
        const fileInput = document.getElementById('fileInput');
        const selectedFiles = document.getElementById('selectedFiles');
        
        // Hacer clic en la zona de arrastrar para abrir selector de archivos
        dropZone.addEventListener('click', () => {
            fileInput.click();
        });
        
        // Manejar selección de archivos
        fileInput.addEventListener('change', (e) => {
            this.handleFileSelection(e.target.files);
        });
        
        // Funcionalidad de arrastrar y soltar
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });
        
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            this.handleFileSelection(e.dataTransfer.files);
        });
    }

    // Manejar selección de archivos
    handleFileSelection(files) {
        const selectedFiles = document.getElementById('selectedFiles');
        selectedFiles.innerHTML = '';
        
        Array.from(files).forEach(file => {
            const fileItem = this.createFileItem(file);
            selectedFiles.appendChild(fileItem);
        });
        
        // Mostrar la lista de archivos
        document.getElementById('fileList').style.display = 'block';
    }

    // Crear elemento de archivo
    createFileItem(file) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.dataset.fileName = file.name;
        
        const fileIcon = this.getFileIcon(file.type);
        const fileSize = this.formatFileSize(file.size);
        
        fileItem.innerHTML = `
            <div class="file-info">
                <div class="file-icon">${fileIcon}</div>
                <div class="file-details">
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${fileSize}</div>
                </div>
            </div>
            <button class="file-remove" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        return fileItem;
    }

    // Obtener icono según tipo de archivo
    getFileIcon(mimeType) {
        if (mimeType.startsWith('image/')) return '<i class="fas fa-image"></i>';
        if (mimeType.startsWith('video/')) return '<i class="fas fa-video"></i>';
        if (mimeType.startsWith('audio/')) return '<i class="fas fa-music"></i>';
        if (mimeType.includes('pdf')) return '<i class="fas fa-file-pdf"></i>';
        if (mimeType.includes('word')) return '<i class="fas fa-file-word"></i>';
        if (mimeType.includes('text')) return '<i class="fas fa-file-alt"></i>';
        return '<i class="fas fa-file"></i>';
    }

    // Formatear tamaño de archivo
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Cargar archivos
    uploadFiles() {
        const fileItems = document.querySelectorAll('#selectedFiles .file-item');
        
        if (fileItems.length === 0) {
            this.showToast('No hay archivos seleccionados para cargar', { type: 'warning' });
            return;
        }
        
        // Simular proceso de carga
        fileItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('uploading');
                
                setTimeout(() => {
                    item.classList.remove('uploading');
                    item.classList.add('success');
                    
                    // Agregar a la lista de recursos
                    const fileName = item.dataset.fileName;
                    const resourcesList = document.getElementById('resourcesList');
                    const currentContent = resourcesList.innerHTML;
                    resourcesList.innerHTML = currentContent + `<div>• 📎 ${fileName}</div>`;
                    
                    if (index === fileItems.length - 1) {
                        setTimeout(() => {
                            this.closeModal('uploadDialog');
                            this.showToast('Archivos cargados exitosamente', { type: 'success' });
                        }, 1000);
                    }
                }, 1500);
            }, index * 500);
        });
    }

    // Exportar conversación
    exportConversation() {
        if (!this.conversationHistory.length) {
            this.showToast('No hay mensajes en la conversación para exportar', { type: 'warning' });
            return;
        }
        
        const content = this.conversationHistory
            .filter(msg => msg.role === 'user' || msg.role === 'assistant')
            .map(msg => `${msg.role === 'user' ? 'Usuario' : 'Sobreviviente'}: ${msg.content}`)
            .join('\n\n');
        
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'conversacion_pfa.txt';
        a.click();
        URL.revokeObjectURL(url);
        
        this.showToast('Conversación exportada con éxito', { type: 'success' });
    }

    // Finalizar feedback
    finishFeedback() {
    this.closeModal('summaryWindow');
    this.closeModal('feedbackWindow');
    this.openModal('simulationConfigWindow');
        
        // Limpiar conversación
        this.conversationHistory = [];
        this.currentStage = 'config';
    }

    // Salir de la aplicación
    exitApplication() {
        if (confirm('¿Está seguro de que desea salir?')) {
            window.close();
        }
    }
}

// Función para configuración automática de simulación aleatoria
function configureRandomSimulation() {
    const urlParams = new URLSearchParams(window.location.search);
    const isAutostart = urlParams.get('autostart') === 'true';
    const isRandom = urlParams.get('random') === 'true';
    const mode = urlParams.get('mode');
    
    if (isAutostart && isRandom && mode === 'student') {
        console.log('🎯 Configurando simulación aleatoria para alumno...');
        
        // Agregar CSS para ocultar la ventana de configuración desde el inicio
        const style = document.createElement('style');
        style.textContent = `
            #simulationConfigWindow {
                display: none !important;
            }
            .modal.active#simulationConfigWindow {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
        
        // Configurar valores aleatorios en todos los campos
        const randomConfigs = {
            // Selects con opciones aleatorias
            'traumaType': ['Agresión Sexual', 'Ataque Físico', 'Conflicto Armado', 'Terrorismo', 'Desastre Natural', 'Accidente de Tránsito', 'Accidente Doméstico', 'Condición médica repentina', 'Noticias traumáticas repentinas', 'Incendio'],
            'traumaSetting': ['Casa', 'Escuela', 'Zona de combate', 'Lugar de trabajo', 'Calle', 'Naturaleza', 'Lugar público'],
            'age': ['Joven Adulto', 'Niño', 'Adolescente', 'Adulto', 'Anciano'],
            'gender': ['Femenino', 'Masculino', 'No especificado'],
            'challenges': ['Pérdida de contacto con la realidad', 'Agresión auto/hetero-dirigida', 'Ausencia de respuesta a estímulos', 'Tratamiento de salud mental actual o previo', 'Síntomas invalidantes que no ceden'],
            'education': ['Básico', 'Secundaria', 'Técnico', 'Profesional', 'Postgrado'],
            'civilStatus': ['Soltero', 'En una relación', 'Casado', 'Divorciado', 'Viudo'],
            'network': ['Sin familia ni red social', 'Red social/familiar restringida', 'Red social y lazos fuertes'],
            'medicalConditions': ['Sí', 'No'],
            'psychiatricConditions': ['Sí', 'No'],
            'medications': ['Sí', 'No']
        };
        
        // Función para seleccionar valor aleatorio
        function getRandomValue(array) {
            return array[Math.floor(Math.random() * array.length)];
        }
        
        // Función para configurar elemento
        function setElementValue(id, value) {
            const element = document.getElementById(id);
            if (element) {
                element.value = value;
                console.log(`✓ ${id}: ${value}`);
            }
        }
        
        // Esperar a que el DOM esté listo y configurar
        function applyRandomConfiguration() {
            // Configurar dificultad aleatoria (30-80%)
            const randomDifficulty = Math.floor(Math.random() * 51) + 30; // 30-80
            setElementValue('difficultySlider', randomDifficulty);
            const difficultyDisplay = document.getElementById('difficultyValue');
            if (difficultyDisplay) {
                difficultyDisplay.textContent = randomDifficulty + '%';
            }
            
            // Configurar todos los selects con valores aleatorios
            Object.keys(randomConfigs).forEach(fieldId => {
                const randomValue = getRandomValue(randomConfigs[fieldId]);
                setElementValue(fieldId, randomValue);
            });
            
            // Activar simulación aleatoria checkbox
            const randomSimCheck = document.getElementById('randomSimulation');
            if (randomSimCheck) {
                randomSimCheck.checked = true;
                console.log('✓ Simulación aleatoria activada');
            }
            
            // Configurar personalidad aleatoria
            const personalitySliders = document.querySelectorAll('.personality-slider');
            personalitySliders.forEach(slider => {
                const randomValue = Math.floor(Math.random() * 11) * 10; // 0, 10, 20... 100
                slider.value = randomValue;
                const valueDisplay = slider.parentNode.querySelector('.slider-value');
                if (valueDisplay) {
                    valueDisplay.textContent = randomValue + '%';
                }
            });
            
            // Configurar checkboxes aleatorios para "Vive con" y "Hobbies"
            ['livesWithOptions', 'hobbiesOptions'].forEach(containerId => {
                const container = document.getElementById(containerId);
                if (container) {
                    const checkboxes = container.querySelectorAll('input[type="checkbox"]:not([value="Aleatorio"])');
                    // Seleccionar 1-3 opciones aleatorias
                    const numSelections = Math.floor(Math.random() * 3) + 1;
                    const shuffled = Array.from(checkboxes).sort(() => 0.5 - Math.random());
                    shuffled.slice(0, numSelections).forEach(cb => cb.checked = true);
                }
            });
            
            // Nombre aleatorio para el proveedor
            const randomNames = ['Dr. García', 'Dra. Rodríguez', 'Dr. Martínez', 'Dra. López', 'Dr. González', 'Dra. Pérez', 'Dr. Sánchez', 'Dra. Ramírez', 'Dr. Torres', 'Dra. Flores'];
            const randomName = getRandomValue(randomNames);
            setElementValue('providerName', randomName);
            
            console.log('🎯 Configuración aleatoria completada');
            
            // Para modo student con autostart, ir directamente a la simulación
            setTimeout(() => {
                if (window.pfaSimulator) {
                    console.log('🚀 Iniciando simulación automáticamente (modo alumno)...');
                    
                    // Aplicar configuración directamente sin usar el botón
                    const config = window.pfaSimulator.getSimulationConfig();
                    
                    if (config.providerName) {
                        window.pfaSimulator.providerName = config.providerName;
                        window.pfaSimulator.patientCharacteristics = config;
                        
                        // Mostrar loading y crear historia directamente
                        window.pfaSimulator.showLoading('Esperando que la enfermera de triage le asigne un caso...');
                        console.debug('[autostart] Loading mostrado, generando historia+triage');
                        
                        window.pfaSimulator.createTraumaStory().catch(error => {
                            console.error('Error al crear la historia:', error);
                            window.pfaSimulator.hideLoading();
                            window.pfaSimulator.showToast('Error al generar la simulación. Intente nuevamente.', { type: 'error' });
                        });
                    } else {
                        console.warn('[autostart] providerName vacío - inyectando nombre genérico');
                        window.pfaSimulator.providerName = 'Proveedor Anónimo';
                        window.pfaSimulator.patientCharacteristics = { ...config, providerName: 'Proveedor Anónimo' };
                        window.pfaSimulator.showLoading('Esperando que la enfermera de triage le asigne un caso...');
                        window.pfaSimulator.createTraumaStory().catch(error => {
                            console.error('Error al crear la historia (fallback nombre):', error);
                            window.pfaSimulator.hideLoading();
                            window.pfaSimulator.showToast('Error al generar la simulación (fallback).', { type: 'error' });
                        });
                    }
                }
            }, 500); // Reducido a 0.5 segundos para experiencia más fluida
        }
        
        // Ejecutar cuando esté todo listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(applyRandomConfiguration, 500); // Delay para asegurar que todo esté renderizado
            });
        } else {
            setTimeout(applyRandomConfiguration, 500);
        }
    }
}

// Inicialización robusta que funciona aunque el script se inyecte después de que el DOM haya cargado.
(function initPFASimulatorSafely(){
    if (window.pfaSimulator) { return; }
    const boot = () => {
        try {
            if (!window.pfaSimulator) {
                window.pfaSimulator = new PFASimulator();
                if (window.pfaSimulator && typeof window.pfaSimulator._initPromptFactory === 'function') {
                    window.pfaSimulator._initPromptFactory();
                }
                if (window.PFA_BOOT_LOG) {
                    window.PFA_BOOT_LOG.push('[init] PFASimulator instanciado OK (script.js)');
                }
                // Configurar simulación aleatoria si es necesario
                configureRandomSimulation();
            }
        } catch (err) {
            console.error('Error inicializando PFASimulator:', err);
            if (window.PFA_BOOT_LOG) {
                window.PFA_BOOT_LOG.push('[init-error] ' + (err && err.message ? err.message : err));
            }
        }
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot, { once: true });
    } else {
        boot();
    }
})();

