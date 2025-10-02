/*
 * PFA Simulator Web - Core Logic
 * Copyright (c) 2025 Rodrigo A. Figueroa y colaboradores.
 * Propietario. Uso restringido educativo. No redistribuir ni crear derivados sin autorización escrita.
 * Ver LICENSE, TERMS_OF_USE.md y NOTICE.
 */
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
        
        this.initializeEventListeners();
        this.setupSliders();
        this.initAPIKeyPersistence();
    }

    // Inicializar todos los event listeners
    initializeEventListeners() {
        // Referencia al input de API key (puede no existir aún en etapas iniciales)
        this.apiKeyInput = document.getElementById('apiKeyInput');
        if (this.apiKeyInput) {
            this.apiKeyInput.addEventListener('input', () => {
                const value = this.apiKeyInput.value.trim();
                if (value) {
                    localStorage.setItem('pfa_api_key', value);
                }
                this.validateAndMarkAPIKey();
            });
        }

        const demoToggle = document.getElementById('demoModeToggle');
        if (demoToggle) {
            demoToggle.addEventListener('change', (e) => {
                this.demoMode = e.target.checked;
                if (this.demoMode) {
                    this.showInfoMessage('Modo demo activado: se generarán respuestas simuladas sin usar la API.');
                } else {
                    this.showInfoMessage('Modo demo desactivado: se usarán respuestas reales (requiere API key).');
                }
            });
        }
        // Configuración de simulación
        document.getElementById('difficultySlider').addEventListener('input', (e) => {
            document.getElementById('difficultyValue').textContent = e.target.value + '%';
        });

        document.getElementById('randomSimulation').addEventListener('change', (e) => {
            if (e.target.checked) {
                this.randomizeSelections();
            }
        });

        document.getElementById('advancedOptionsBtn').addEventListener('click', () => {
            this.showModal('advancedOptionsDialog');
        });

        document.getElementById('closeAdvancedOptions').addEventListener('click', () => {
            this.hideModal('advancedOptionsDialog');
        });

        document.getElementById('startSimulationBtn').addEventListener('click', () => {
            this.startSimulation();
        });

        // Personalidad aleatoria
        document.getElementById('randomizePersonality').addEventListener('click', () => {
            this.randomizePersonality();
        });

        // Ventana de triage
        document.getElementById('acceptCaseBtn').addEventListener('click', () => {
            this.acceptCase();
        });

        // Chat de simulación
        document.getElementById('sendButton').addEventListener('click', () => {
            this.sendMessage();
        });

        document.getElementById('inputText').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Botones de control del chat
        document.getElementById('pareBtn').addEventListener('click', () => {
            this.showModal('pareDialog');
        });

        document.getElementById('endConversationBtn').addEventListener('click', () => {
            this.endConversation();
        });

        // Ventana de recursos (modal separada, ya no se usa pero se mantiene compatibilidad)
        document.getElementById('copyResourcesBtn').addEventListener('click', () => {
            this.copySelectedResources();
        });

        document.getElementById('applyResourcesBtn').addEventListener('click', () => {
            this.applyResources();
        });

        // Ventana de carga de archivos
        document.getElementById('uploadMaterialBtn').addEventListener('click', () => {
            this.showModal('uploadDialog');
        });

        document.getElementById('cancelUploadBtn').addEventListener('click', () => {
            this.hideModal('uploadDialog');
        });

        document.getElementById('confirmUploadBtn').addEventListener('click', () => {
            this.uploadFiles();
        });

        // Configurar funcionalidad de arrastrar y soltar
        this.setupFileUpload();

        // Criterios PARE
        document.getElementById('confirmPareBtn').addEventListener('click', () => {
            this.confirmPareCriteria();
        });

        document.getElementById('cancelPareBtn').addEventListener('click', () => {
            this.hideModal('pareDialog');
        });

        // Ventana de menú
        document.getElementById('feedbackBtn').addEventListener('click', () => {
            this.showFeedback();
        });

        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportConversation();
        });

        document.getElementById('exitBtn').addEventListener('click', () => {
            this.exitApplication();
        });

        // Ventana de feedback
        document.getElementById('nextToPatientBtn').addEventListener('click', () => {
            this.switchTab('patient');
        });

        document.getElementById('nextToTechnicalBtn').addEventListener('click', () => {
            this.switchTab('technical');
        });

        document.getElementById('showSummaryBtn').addEventListener('click', () => {
            this.showSummary();
        });

        // Aspectos del paciente
        document.querySelectorAll('.aspect-slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const value = e.target.value;
                const aspect = e.target.dataset.aspect;
                e.target.nextElementSibling.textContent = value;
            });
        });

        // Puntajes técnicos
        document.querySelectorAll('.score-slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const value = e.target.value;
                e.target.nextElementSibling.textContent = value;
            });
        });

        // Resumen final
        document.getElementById('backToFeedbackBtn').addEventListener('click', () => {
            this.hideModal('summaryWindow');
        });

        document.getElementById('finishFeedbackBtn').addEventListener('click', () => {
            this.finishFeedback();
        });
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
        document.querySelectorAll('.personality-slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const value = e.target.value;
                const trait = e.target.dataset.trait;
                e.target.parentElement.querySelector('.slider-value').textContent = value + '%';
            });
        });
    }

    // Mostrar modal
    showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }

    // Ocultar modal
    hideModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }

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
            alert('Por favor, ingrese su nombre');
            return;
        }

        this.providerName = config.providerName;
        this.patientCharacteristics = config;
        
        this.hideModal('simulationConfigWindow');
        this.showLoading('Esperando que la enfermera de triage le asigne un caso...');
        
        try {
            await this.createTraumaStory();
        } catch (error) {
            console.error('Error al crear la historia:', error);
            this.hideLoading();
            alert('Error al generar la simulación. Por favor, intente nuevamente.');
        }
    }

    // Obtener configuración de simulación
    getSimulationConfig() {
        return {
            providerName: document.getElementById('providerName').value.trim(),
            difficulty: parseInt(document.getElementById('difficultySlider').value),
            traumaType: document.getElementById('traumaType').value,
            traumaSetting: document.getElementById('traumaSetting').value,
            age: document.getElementById('age').value,
            gender: document.getElementById('gender').value,
            challenges: document.getElementById('challenges').value,
            education: document.getElementById('education').value,
            civilStatus: document.getElementById('civilStatus').value,
            network: document.getElementById('network').value,
            livesWith: this.getCheckedValues('livesWithOptions'),
            hobbies: this.getCheckedValues('hobbiesOptions'),
            personalityValues: this.getPersonalityValues(),
            medicalConditions: document.getElementById('medicalConditions').value,
            psychiatricConditions: document.getElementById('psychiatricConditions').value,
            medications: document.getElementById('medications').value
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
    async createTraumaStory() {
        const config = this.patientCharacteristics;
        
        // Prompt para el guionista
        const screenwriterPrompt = this.createScreenwriterPrompt(config);
        // Barra de progreso simulada (dos fases)
        const bar = document.getElementById('triageProgressBar');
        const stageLabel = document.getElementById('progressStageLabel');
        const shell = document.querySelector('.progress-shell');
        const setProgress = (pct, label) => {
            if (bar) bar.style.width = pct + '%';
            if (stageLabel && label) stageLabel.textContent = label;
            if (shell) shell.setAttribute('aria-valuenow', pct);
        };
    setProgress(8, '');
        
        try {
            // Generar historia (silencioso para realismo)
            setProgress(22, '');
            const story = await this.callOpenAI(screenwriterPrompt);
            this.story = story;
            setProgress(55, '');
            
            // Generar evaluación de triage
            setProgress(65, '');
            const triagePrompt = this.createTriagePrompt(story);
            const triageEvaluation = await this.callOpenAI(triagePrompt);
            this.triageEvaluation = triageEvaluation;
            setProgress(90, '');
            
            this.hideLoading();
            this.showTriageWindow(triageEvaluation);
            setTimeout(()=> setProgress(100, ''), 150);
            
        } catch (error) {
            console.error('Error en la generación:', error);
            this.hideLoading();
            alert(`Error al generar la simulación:\n${error.message || error}`);
            throw error;
        }
    }

    // Crear prompt del guionista
    createScreenwriterPrompt(config) {
        const currentDate = new Date();
        const twoWeeksAgo = new Date(currentDate.getTime() - 14 * 24 * 60 * 60 * 1000);
        
        return `Eres un guionista experto en la generación de guiones para simulación médica. 
        Crea una historia realista y detallada de un sobreviviente de trauma.
        
        CRÍTICO: El evento traumático DEBE haber ocurrido entre hoy (${currentDate.toISOString().split('T')[0]}) 
        y hace dos semanas (${twoWeeksAgo.toISOString().split('T')[0]}).
        
        Detalles del personaje:
        - Edad: ${config.age}
        - Género: ${config.gender}
        - Tipo de Trauma: ${config.traumaType}
        - Escenario del Trauma: ${config.traumaSetting}
        - Educación: ${config.education}
        - Estado Civil: ${config.civilStatus}
        - Red Social: ${config.network}
        - Vive Con: ${config.livesWith.join(', ')}
        - Hobbies: ${config.hobbies.join(', ')}
        - Rasgos de Personalidad: ${Object.entries(config.personalityValues).map(([k, v]) => `${k}: ${v}%`).join(', ')}
        - Condiciones Médicas: ${config.medicalConditions}
        - Condiciones Psiquiátricas: ${config.psychiatricConditions}
        - Medicamentos: ${config.medications}
        - Desafíos de PFA: ${config.challenges}
        
        Incluye reacciones psicológicas típicas peritraumáticas y describe el estado actual del sobreviviente.`;
    }

    // Crear prompt de triage
    createTriagePrompt(story) {
        return `Eres una enfermera de triage en un servicio telefónico de urgencias.
        Tu tarea es entregar a un colega un resumen corto, claro y humano del caso.
        
        Usa oraciones simples y menciona SOLO:
        • Motivo de la llamada (qué pasó y dónde)
        • Estado general del paciente (alerta, inquieto, dolorido…)
        • Síntoma clave o malestar principal (dolor, miedo, confusión…)
        
        NO incluyas saludos ni despedidas. Ve directo al grano con un tono conversacional y profesional.
        
        Historia del caso:
        ${story}`;
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
                        { role: 'system', content: 'Eres un asistente experto en simulación médica.' },
                        { role: 'user', content: prompt }
                    ],
                    max_tokens: 1000,
                    temperature: 0.7
                })
            });
        } catch (netErr) {
            throw new Error('No se pudo conectar a OpenAI. Revisa tu conexión.');
        }

        if (!response.ok) {
            let errorDetails = '';
            try {
                const errorData = await response.json();
                errorDetails = errorData?.error?.message || JSON.stringify(errorData);
            } catch (e) {
                errorDetails = await response.text();
            }
            
            if (response.status === 401) {
                throw new Error('Clave API rechazada (401). Verifica que sea correcta y tenga permisos.');
            }
            if (response.status === 429) {
                throw new Error('Límite de uso excedido (429). Intenta más tarde.');
            }
            if (response.status === 400) {
                throw new Error(`Error 400: ${errorDetails}`);
            }
            throw new Error(`Error de API ${response.status}: ${errorDetails}`);
        }

        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content || '[Respuesta vacía]';
        return content;
    }

    // Generar respuesta de demostración (sin API)
    generateDemoResponse(prompt) {
        const seed = prompt.length;
        const sample = [
            'Esto es una respuesta simulada de demostración para que puedas probar la interfaz sin consumir tu cuota.',
            'El modo demo está activo: ninguna llamada real se hace a OpenAI y los contenidos son genéricos.',
            'Puedes desactivar el modo demo cuando ingreses una API key válida para obtener contenido realista.'
        ];
        return sample[seed % sample.length];
    }

    // Mostrar ventana de triage
    showTriageWindow(evaluation) {
        document.getElementById('triageMessage').innerHTML = evaluation;
        this.showModal('triageWindow');
    }

    // Aceptar caso
    acceptCase() {
        this.hideModal('triageWindow');
        this.showModal('simulationWindow');
        this.currentStage = 'survivor';
        
        // Mostrar mensaje inicial
        const chatHistory = document.getElementById('chatHistory');
    chatHistory.innerHTML = '<div class="chat-message system">La persona está en línea. Puede comenzar la interacción.</div>';
        
        // Mostrar botones de control
        document.getElementById('endConversationBtn').style.display = 'inline-block';
    }

    // Enviar mensaje
    async sendMessage() {
        const inputText = document.getElementById('inputText');
        const message = inputText.value.trim();
        
        if (!message) return;
        
        if (this.currentStage !== 'survivor') {
            alert('La simulación aún no ha comenzado');
            return;
        }

        // Agregar mensaje del usuario al chat
        this.addChatMessage(message, 'user');
        inputText.value = '';

        // Mostrar indicador de carga
        this.showLoading('Pensando...');

        try {
            // Generar respuesta del superviviente
            const survivorPrompt = this.createSurvivorPrompt(message);
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
    createSurvivorPrompt(userMessage) {
        const config = this.patientCharacteristics;
        
        // Interpretar rasgos de personalidad para instrucciones específicas
        const apertura = config.personalityValues.Apertura || 50;
        const extroversion = config.personalityValues.Extroversión || 50;
        const neuroticismo = config.personalityValues.Neuroticismo || 50;
        const amabilidad = config.personalityValues.Amabilidad || 50;
        
        // Extraer edad numérica (puede venir como "10 años", "25", etc.)
        const ageMatch = String(config.age).match(/\d+/);
        const age = ageMatch ? parseInt(ageMatch[0]) : 25;
        
        // Generar instrucciones específicas según EDAD (CRÍTICO)
        let ageInstructions = '';
        
        if (age <= 12) {
            // NIÑOS (5-12 años)
            ageInstructions = `
IMPERATIVO - ERES UN NIÑO/A DE ${age} AÑOS:
- Usa vocabulario SIMPLE y CONCRETO de niño (nada de introspección adulta)
- Frases MUY CORTAS: "No sé", "Tengo miedo", "Quiero a mi mamá"
- Comete errores al escribir: confunde letras (b/v, h, tildes), escribe palabras juntas o separadas mal
- NO reflexiones sobre tus emociones como adulto - los niños NO hacen eso
- Habla de cosas concretas: juguetes, mascotas, miedo a la oscuridad, querer ir a casa
- Puedes escribir TODO EN MAYÚSCULAS cuando estés asustado
- Responde solo 1 oración (máximo 2 MUY cortas)
- Di cosas como: "nose", "aver", "ami", "ace" (errores ortográficos típicos)
EJEMPLO REAL: "tengo muxo miedo quiero ami mama"
`;
        } else if (age <= 17) {
            // ADOLESCENTES (13-17 años)
            ageInstructions = `
IMPERATIVO - ERES ADOLESCENTE DE ${age} AÑOS:
- Usa lenguaje coloquial/juvenil: "nada que ver", "no cacho", "me carga", "igual", "como que"
- Escribe de forma más informal: sin tildes, abreviaturas (tb, tmb, pq, xq, xd)
- Muestra típica actitud adolescente: defensivo, "da lo mismo", minimizas, te da vergüenza abrirte
- Responde con desgano o monosílabos al principio: "ya", "sep", "no sé"
- 1-2 oraciones máximo, nada elaborado
- Puedes ser algo hostil o cerrado (es normal a esta edad con extraños)
EJEMPLO REAL: "no se igual estoy bn no es la gran cosa"
`;
        } else if (age <= 25) {
            // ADULTOS JÓVENES
            ageInstructions = `
AJUSTE DE EDAD - ADULTO JOVEN (${age} años):
- Lenguaje informal pero más coherente que adolescentes
- Puedes escribir mejor pero aún estar desorganizado por el trauma
- 1-3 oraciones, tono casual
`;
        } else if (age >= 65) {
            // ADULTOS MAYORES
            ageInstructions = `
AJUSTE DE EDAD - ADULTO MAYOR (${age} años):
- Lenguaje más formal o tradicional
- Puedes ser más reservado emocionalmente (generación distinta)
- Preocupaciones prácticas: salud, medicamentos, familia
- Posible dificultad con tecnología (escribir en chat puede ser más lento o torpe)
`;
        }
        
        // Generar instrucciones comportamentales basadas en personalidad configurada
        let personalityInstructions = [];
        
        if (apertura < 40) {
            personalityInstructions.push("- Baja Apertura: Sé desconfiado, escéptico de nuevas ideas, prefiere respuestas concretas y prácticas. Evita hablar de emociones o cosas abstractas");
        } else if (apertura > 60) {
            personalityInstructions.push("- Alta Apertura: Aunque estés traumatizado, intenta entender qué está pasando, haces preguntas sobre el proceso, reflexionas en voz alta");
        }
        
        if (extroversion < 40) {
            personalityInstructions.push("- Baja Extroversión (Introvertido): Responde con pocas palabras, te sientes agotado por la interacción, prefieres estar solo, te incomoda hablar con extraños");
        } else if (extroversion > 60) {
            personalityInstructions.push("- Alta Extroversión: Hablas más (pero aún de forma caótica por el trauma), necesitas el contacto, haces más preguntas, buscas más interacción");
        }
        
        if (neuroticismo > 60) {
            personalityInstructions.push("- Alto Neuroticismo: Muestra MÁS ansiedad, catastrofismo, irritabilidad. Te alteras fácilmente, piensas en el peor escenario, te preocupas obsesivamente");
        } else if (neuroticismo < 40) {
            personalityInstructions.push("- Bajo Neuroticismo: Aunque estés mal, intentas mantener la calma, minimizas más tus reacciones, aparentas estar más controlado");
        }
        
        if (amabilidad < 40) {
            personalityInstructions.push("- Baja Amabilidad: Sé más hostil, desafiante, sarcástico. Cuestiona las intenciones del ayudante, muestra más enojo que vulnerabilidad");
        } else if (amabilidad > 60) {
            personalityInstructions.push("- Alta Amabilidad: Intentas ser cortés incluso en crisis, te disculpas por molestar, te preocupas por no ser una carga");
        }
        
        const personalityBlock = personalityInstructions.length > 0 
            ? `\nAJUSTES SEGÚN TU PERSONALIDAD CONFIGURADA:\n${personalityInstructions.join('\n')}\n`
            : '';
        
        return `Eres una persona real que acaba de vivir un trauma. NO eres un caso clínico perfecto ni un paciente modelo.

CONTEXTO DE TU EXPERIENCIA:
- Edad: ${config.age} | Género: ${config.gender}
- Trauma reciente: ${config.traumaType}
- Dónde ocurrió: ${config.traumaSetting}
- Tu historia: ${this.story}
- Evaluación inicial: ${this.triageEvaluation}

QUIÉN ERES COMO PERSONA:
- Educación: ${config.education}
- Situación: ${config.civilStatus}
- Red de apoyo: ${config.network}
- Vives con: ${config.livesWith.join(', ')}
- Te gusta: ${config.hobbies.join(', ')}
- Rasgos de Personalidad: ${Object.entries(config.personalityValues).map(([k, v]) => `${k}: ${v}%`).join(', ')}
- Salud física: ${config.medicalConditions}
- Salud mental: ${config.psychiatricConditions}
- Medicamentos: ${config.medications}
- Desafíos actuales: ${config.challenges}
${ageInstructions}
${personalityBlock}
CÓMO DEBES RESPONDER (IMPERATIVO - MÁXIMO REALISMO):

1. SÉ IMPERFECTO Y HUMANO:
   - No articules tus emociones perfectamente. Las personas traumatizadas NO hablan como libros de psicología
   - Usa frases incompletas, dubitativas: "No sé... es que... como que..."
   - Contradícete a veces (es normal tras un trauma)
   - Evita COMPLETAMENTE el lenguaje terapéutico, reflexivo o académico
   - Di cosas como "estoy bien" cuando claramente no lo estás

2. MUESTRA RESISTENCIAS NATURALES:
   - No te abras inmediatamente con un extraño
   - Desconfía al principio, especialmente si tu personalidad lo indica
   - Minimiza tus problemas ("no es para tanto", "hay gente peor")
   - Pregunta para qué sirve hablar de esto
   - Muestra incomodidad si preguntan cosas muy personales muy rápido

3. RESPUESTAS REALISTAS Y BREVES:
   - MÁXIMO 1-2 oraciones CORTAS (niños: solo 1 oración)
   - Usa muletillas: "pues", "o sea", "no sé", "la verdad"
   - Divaga ocasionalmente o cambia de tema si algo te incomoda
   - A veces responde con monosílabos: "Sí", "No sé", "Puede ser"
   - Incluye silencios implícitos: "..." cuando algo es difícil de decir

4. EMOCIONES COMPLEJAS Y CONTRADICTORIAS:
   - Puedes estar enojado con quien intenta ayudarte
   - Sentir culpa, vergüenza, confusión
   - Pasar de estar tranquilo a alterarte de repente
   - Tener pensamientos irracionales (normal en trauma)
   - Negar o minimizar lo que te pasó como mecanismo de defensa

5. VARIABILIDAD SEGÚN TU NIVEL EDUCATIVO Y RED DE APOYO:
   - Educación baja/media: usa lenguaje más coloquial, evita tecnicismos
   - Educación alta: puedes usar más vocabulario pero aún estar desorganizado por el trauma
   - Red de apoyo débil o inexistente: muestra más desesperanza, desconfianza, sensación de abandono
   - Red de apoyo fuerte: menciona ocasionalmente a tus seres queridos como ancla

6. DETALLES QUE DELATEN TU ESTADO REAL:
   - Olvida cosas que acabas de decir (estrés agudo)
   - Preocúpate por cosas aparentemente triviales (evitación)
   - Haz preguntas prácticas: "¿Cuánto va a durar esto?", "¿Esto va a quedar en algún registro?"
   - Muestra preocupación por otros aunque estés mal: "¿Mi familia ya sabe?"

MENSAJE AL QUE DEBES RESPONDER:
"${userMessage}"

RECUERDA: Eres una PERSONA REAL que sufrió un trauma hace POCAS HORAS. No eres cooperativo, perfecto ni articulado. Eres confuso, defensivo, contradictorio y humano. Si eres niño o adolescente, tu lenguaje debe ser apropiado para tu edad con errores ortográficos y vocabulario limitado. Responde MÁXIMO 1-2 oraciones cortas.`;
    }

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
    }

    // Mostrar indicador de escritura (tres puntos) durante la generación de la respuesta del paciente
    showTypingIndicator() {
        if (this.typingIndicatorEl) return; // Ya existe
        const chatHistory = document.getElementById('chatHistory');
        if (!chatHistory) return;
        const div = document.createElement('div');
        div.className = 'chat-message assistant typing-indicator';
        div.innerHTML = '<div class="typing-dots" aria-label="Escribiendo" role="status"><span></span><span></span><span></span></div>';
        this.typingIndicatorEl = div;
        chatHistory.appendChild(div);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    // Ocultar indicador de escritura
    hideTypingIndicator() {
        if (this.typingIndicatorEl) {
            this.typingIndicatorEl.remove();
            this.typingIndicatorEl = null;
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
            this.showModal('pareDialog');
        }
    }

    // Confirmar criterio PARE
    confirmPareCriteria() {
        const pareCriteria = document.getElementById('pareCriteria').value;
        this.pareDetected = pareCriteria;
        this.hideModal('pareDialog');
        alert(`Criterio PARE registrado: ${pareCriteria}`);
    }

    // Finalizar conversación
    endConversation() {
        this.hideModal('simulationWindow');
        this.showModal('menuWindow');
    }

    // Mostrar feedback
    showFeedback() {
        this.hideModal('menuWindow');
        this.showModal('feedbackWindow');
        this.generateAutomatedFeedback();
    }

    // Generar feedback automático
    async generateAutomatedFeedback() {
        if (!this.conversationHistory.length) return;
        
        try {
            // Generar feedback del paciente
            const patientFeedback = await this.generatePatientFeedback();
            this.updatePatientFeedback(patientFeedback);
            
            // Generar feedback técnico
            const technicalFeedback = await this.generateTechnicalFeedback();
            this.updateTechnicalFeedback(technicalFeedback);
            
        } catch (error) {
            console.error('Error al generar feedback:', error);
        }
    }

    // Generar feedback del paciente
    async generatePatientFeedback() {
        const prompt = `Basado en esta conversación, genera un feedback desde la perspectiva del paciente:
        
        ${JSON.stringify(this.conversationHistory)}
        
        Formato requerido:
        NIVEL GENERAL DE COMODIDAD: X/5
        EMPATÍA: X/5
        RESPETO: X/5
        CLARIDAD EN LA COMUNICACIÓN: X/5
        ATENCIÓN Y ESCUCHA: X/5
        SEGURIDAD TRANSMITIDA: X/5
        
        COMENTARIOS DETALLADOS:
        [Texto libre con la experiencia del paciente]`;
        
        return await this.callOpenAI(prompt);
    }

    // Generar feedback técnico
    async generateTechnicalFeedback() {
        const prompt = `Evalúa técnicamente esta conversación de primeros auxilios psicológicos:
        
        ${JSON.stringify(this.conversationHistory)}
        
        Evalúa cada aspecto del protocolo ABCDE:
        A. Escucha Activa
        B. Reentrenamiento Respiratorio
        C. Clasificación de Necesidades
        D. Derivación a Redes
        E. Psicoeducación
        
        Para cada sección, proporciona:
        - Evaluación crítica
        - Ejemplos específicos
        - Sugerencias de mejora
        - NIVEL ALCANZADO: X/5`;
        
        return await this.callOpenAI(prompt);
    }

    // Actualizar feedback del paciente
    updatePatientFeedback(feedback) {
        document.getElementById('patientComments').value = feedback;
        this.processPatientRatings(feedback);
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
        this.hideModal('feedbackWindow');
        this.showModal('summaryWindow');
        this.createCharts();
    }

    // Crear gráficos
    createCharts() {
        this.createPatientChart();
        this.createTechnicalChart();
    }

    // Crear gráfico del paciente
    createPatientChart() {
        const ctx = document.getElementById('patientChart').getContext('2d');
        
        const data = {
            labels: ['Empatía', 'Respeto', 'Comunicación', 'Escucha', 'Seguridad', 'Comodidad'],
            datasets: [{
                label: 'Evaluación del Paciente',
                data: this.getPatientValues(),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2
            }]
        };
        
        new Chart(ctx, {
            type: 'radar',
            data: data,
            options: {
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 5,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // Crear gráfico técnico
    createTechnicalChart() {
        const ctx = document.getElementById('technicalChart').getContext('2d');
        
        const data = {
            labels: ['Escucha Activa', 'Reentrenamiento Respiratorio', 'Clasificación Necesidades', 'Derivación Redes', 'Psicoeducación'],
            datasets: [{
                label: 'Evaluación Técnica',
                data: this.getTechnicalValues(),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2
            }]
        };
        
        new Chart(ctx, {
            type: 'radar',
            data: data,
            options: {
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 5,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

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

    // Mostrar indicador de carga
    showLoading(text) {
        // Si es el indicador de pensamiento del paciente, usar burbuja de escritura en lugar del overlay global
        if (text && text.toLowerCase().startsWith('pensando')) {
            this.showTypingIndicator();
            return;
        }
        const txtEl = document.getElementById('loadingText');
        if (txtEl) txtEl.textContent = text;
        const ind = document.getElementById('loadingIndicator');
        if (ind) ind.classList.remove('hidden');
    }

    // Ocultar indicador de carga
    hideLoading() {
        // Siempre intentar ocultar el indicador de escritura si existe
        this.hideTypingIndicator && this.hideTypingIndicator();
        const ind = document.getElementById('loadingIndicator');
        if (ind) ind.classList.add('hidden');
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

    // Mostrar recursos
    showResources() {
        this.showModal('resourcesDialog');
    }

    // Copiar recursos seleccionados (desde modal o desde panel lateral)
    copySelectedResources() {
        const selected = [];
        // Buscar en el modal separado primero (compatibilidad)
        document.querySelectorAll('.resources-list input[type="checkbox"]:checked').forEach(cb => {
            selected.push(cb.value);
        });
        // Si no hay nada en el modal, buscar en el panel lateral
        if (selected.length === 0) {
            document.querySelectorAll('.resource-checkbox:checked').forEach(cb => {
                selected.push(cb.value);
            });
        }
        
        if (selected.length > 0) {
            navigator.clipboard.writeText(selected.join('\n')).then(() => {
                alert('Recursos copiados al portapapeles');
            });
        } else {
            alert('No hay recursos seleccionados');
        }
    }

    // Aplicar recursos (desde modal o automático desde panel lateral)
    applyResources() {
        const selected = [];
        // Buscar en el modal separado primero (compatibilidad)
        document.querySelectorAll('.resources-list input[type="checkbox"]:checked').forEach(cb => {
            selected.push(cb.value);
        });
        
        if (selected.length > 0) {
            const resourcesList = document.getElementById('resourcesList');
            resourcesList.innerHTML = selected.map(resource => 
                `<div>• ${resource}</div>`
            ).join('');
            
            this.hideModal('resourcesDialog');
        } else {
            alert('No hay recursos seleccionados');
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
            alert('No hay archivos seleccionados para cargar');
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
                            this.hideModal('uploadDialog');
                            alert('Archivos cargados exitosamente');
                        }, 1000);
                    }
                }, 1500);
            }, index * 500);
        });
    }

    // Exportar conversación
    exportConversation() {
        if (!this.conversationHistory.length) {
            alert('No hay mensajes en la conversación para exportar');
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
        
        alert('Conversación exportada con éxito');
    }

    // Finalizar feedback
    finishFeedback() {
        this.hideModal('summaryWindow');
        this.hideModal('feedbackWindow');
        this.showModal('simulationConfigWindow');
        
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
                        
                        window.pfaSimulator.createTraumaStory().catch(error => {
                            console.error('Error al crear la historia:', error);
                            window.pfaSimulator.hideLoading();
                            alert('Error al generar la simulación. Por favor, intente nuevamente.');
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

