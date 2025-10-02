/*
 * PFA Simulator Web - Configuración Global
 * Copyright (c) 2025 Rodrigo A. Figueroa.
 * Obra protegida. Prohibida redistribución o uso comercial sin autorización.
 */
// Configuración de la aplicación PFA Simulator
window.PFA_CONFIG = {
    // Configuración de OpenAI
    openai: {
        // Modelo de OpenAI a utilizar
    defaultModel: 'gpt-4o-mini',
        maxTokens: 1000,
        temperature: 0.7,
        apiEndpoint: 'https://api.openai.com/v1/chat/completions'
    },
    
    // Configuración de la interfaz
    ui: {
        defaultDifficulty: 50,
        maxDifficulty: 100,
        personalityStep: 10,
        ratingScale: 5
    },
    
    // Recursos de emergencia (Chile)
    emergencyResources: {
        samu: '131',
        bomberos: '132',
        carabineros: '133',
        pdi: '134',
        saludResponde: '600 360 7777',
        fonasa: '600 360 3000',
        centroVictimas: '600 818 1000',
        sernam: '800 104 008',
        defensoria: '(2) 2439 6800'
    },
    
    // Criterios PARE
    pareCriteria: {
        P: 'Pérdida de contacto con la realidad',
        A: 'Agresión auto/hetero-dirigida',
        R: 'Ausencia de respuesta a estímulos',
        E: 'Tratamiento psiquiátrico actual o previo',
        N: 'Síntomas invalidantes que no ceden'
    },
    
    // Protocolo ABCDE
    abcdeProtocol: {
        A: 'Escucha Activa',
        B: 'Reentrenamiento Respiratorio',
        C: 'Clasificación de Necesidades',
        D: 'Derivación a Redes',
        E: 'Psicoeducación'
    }
};

// Función para obtener configuración
window.getConfig = function(key) {
    return window.PFA_CONFIG[key];
};

// Función para validar API key
window.validateAPIKey = function(apiKey) {
    return apiKey && apiKey.trim().length > 0 && apiKey.startsWith('sk-');
};

// Función para mostrar errores
window.showError = function(message) {
    console.error('PFA Error:', message);
    alert('Error: ' + message);
};

// Función para mostrar información
window.showInfo = function(message) {
    console.log('PFA Info:', message);
    alert('Información: ' + message);
};
