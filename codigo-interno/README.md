# Simulador de Primeros Auxilios Psicológicos (PFA) - Versión Web

## Descripción

Esta es una aplicación web moderna que simula escenarios de primeros auxilios psicológicos, transformando la aplicación PyQt5 original en una interfaz web accesible desde cualquier navegador. La aplicación permite a los usuarios practicar sus habilidades de PFA en un entorno seguro y controlado.

## Características Principales

### 🎯 **Configuración de Simulación**
- **Parámetros básicos**: Tipo de trauma, escenario, edad, género
- **Nivel de dificultad**: Slider ajustable de 0-100%
- **Opciones avanzadas**: Nivel educativo, estado civil, red social, hobbies
- **Rasgos de personalidad**: Sliders para los 5 factores de personalidad
- **Condiciones médicas**: Opciones para condiciones médicas y psiquiátricas
- **Simulación aleatoria**: Generación automática de parámetros

### 🏥 **Simulación de Casos**
- **Generación de historias**: Creación automática de casos realistas usando IA
- **Triage automatizado**: Evaluación inicial del caso por "enfermera virtual"
- **Chat interactivo**: Conversación en tiempo real con el superviviente
- **Detección PARE**: Identificación automática de criterios de derivación urgente

### 📊 **Sistema de Evaluación**
- **Reflexión personal**: Autoevaluación de la experiencia
- **Feedback del paciente**: Evaluación desde la perspectiva del superviviente
- **Evaluación técnica**: Análisis del protocolo ABCDE
- **Gráficos visuales**: Representación gráfica de los resultados

### 🚨 **Protocolos de Seguridad**
- **Criterios PAREN**: Detección automática de situaciones de riesgo
- **Derivación urgente**: Protocolos para casos que requieren atención inmediata
- **Recursos de apoyo**: Lista de contactos y servicios disponibles

## Archivos de la Aplicación

```
📁 PFA Simulator Web/
├── 📄 index.html          # Página principal con toda la interfaz
├── 🎨 styles.css          # Estilos CSS modernos y responsivos
├── ⚙️ script.js           # Lógica principal de la aplicación
└── 📖 README.md           # Este archivo de instrucciones
```

## Requisitos del Sistema

### 🌐 **Navegador Web**
- Chrome 80+ (recomendado)
- Firefox 75+
- Safari 13+
- Edge 80+

### 🔑 **API Key de OpenAI**
- Cuenta activa en OpenAI
- API key válida con créditos disponibles
- Modelo recomendado: GPT-4o o GPT-3.5-turbo

## Instalación y Uso

### 1️⃣ **Descarga de Archivos**
1. Descargue todos los archivos en la misma carpeta
2. Asegúrese de que los nombres de archivo coincidan exactamente

### 2️⃣ **Configuración de la API**
1. Abra `index.html` en su navegador
2. En la ventana de simulación, ingrese su API key de OpenAI
3. La clave por defecto incluida es solo para pruebas

### 3️⃣ **Inicio de la Aplicación**
1. Abra `index.html` en su navegador web
2. Complete la configuración de simulación
3. Haga clic en "Iniciar Simulación"

## Flujo de Uso

### 🔧 **Paso 1: Configuración**
1. **Información personal**: Ingrese su nombre como proveedor de PFA
2. **Parámetros del caso**: Seleccione tipo de trauma, escenario, edad, género
3. **Nivel de dificultad**: Ajuste el slider según su experiencia
4. **Opciones avanzadas**: Configure rasgos de personalidad y condiciones médicas
5. **Simulación aleatoria**: Active para generar parámetros automáticamente

### 🎭 **Paso 2: Generación del Caso**
1. La aplicación genera una historia realista usando IA
2. Se crea un perfil detallado del superviviente
3. La "enfermera de triage" evalúa y asigna el caso
4. Revise la información y acepte el caso

### 💬 **Paso 3: Simulación del Chat**
1. **Interacción**: Escriba mensajes para el superviviente
2. **Respuestas**: Reciba respuestas realistas basadas en el perfil
3. **Detección PARE**: La aplicación detecta automáticamente criterios de riesgo
4. **Recursos**: Acceda a información de contacto y servicios de apoyo

### 📋 **Paso 4: Evaluación y Feedback**
1. **Reflexión personal**: Evalúe su experiencia
2. **Feedback del paciente**: Revise la evaluación desde la perspectiva del superviviente
3. **Evaluación técnica**: Analice su desempeño en el protocolo ABCDE
4. **Resumen final**: Visualice gráficos de rendimiento

## Protocolo ABCDE

### 🟦 **A. Escucha Activa (Active Listening)**
- Crear espacio seguro para expresión
- Usar lenguaje empático
- Respetar silencios y validar emociones

### 🟦 **B. Reentrenamiento Respiratorio (Breathing Retraining)**
- Ofrecer técnicas de respiración
- Explicar importancia de forma comprensible
- Practicar junto al paciente

### 🟦 **C. Clasificación de Necesidades (Classification of Needs)**
- Ayudar a identificar preocupaciones
- Establecer prioridades sin imponer
- Validar todas las preocupaciones expresadas

### 🟦 **D. Derivación a Redes (Direct to Support Networks)**
- Orientar hacia redes sociales y familiares
- Proporcionar contactos de servicios formales
- Verificar accesibilidad de las redes sugeridas

### 🟦 **E. Psicoeducación (Psychoeducation)**
- Normalizar reacciones esperables
- Explicar síntomas comunes
- Ofrecer estrategias de autocuidado

## Criterios PAREN

### 🚨 **Situaciones que Requieren Derivación Urgente**

- **(P) Pérdida de contacto con la realidad**: Psicosis, alucinaciones, delirios
- **(A) Agresión**: Conductas auto o heteroagresivas, ideación suicida
- **(R) Ausencia de respuesta**: No responde a estímulos, desconectado del entorno
- **(E) Tratamiento de salud mental**: Seguimiento psiquiátrico o psicológico actual/pasado
- **(N) No hay mejora**: Síntomas intensos persisten más de 2 semanas

## Recursos de Apoyo Incluidos

### 🚑 **Servicios de Emergencia**
- **SAMU**: 131 (Ambulancia)
- **BOMBEROS**: 132
- **CARABINEROS**: 133
- **Policía de Investigaciones**: 134

### 🏥 **Servicios de Salud**
- **Salud Responde**: 600 360 7777
- **FONASA**: 600 360 3000
- **Centro de Apoyo a Víctimas**: 600 818 1000

### 👥 **Servicios Especializados**
- **Centro de la Mujer (SERNAM)**: 800 104 008
- **Defensoría Penal Pública**: (2) 2439 6800
- **Centro de Asistencia a Víctimas de Atentados Sexuales**: (2) 2708 1668

## Personalización y Configuración

### 🎛️ **Ajustes de Dificultad**
- **0-25%**: Casos básicos, supervivientes cooperativos
- **26-50%**: Casos moderados, algunos desafíos
- **51-75%**: Casos complejos, múltiples desafíos
- **76-100%**: Casos expertos, desafíos significativos

### 🎲 **Simulación Aleatoria**
- **Parámetros básicos**: Selección automática de edad, género, tipo de trauma
- **Rasgos de personalidad**: Valores aleatorios en múltiplos de 10%
- **Condiciones médicas**: Distribución aleatoria de condiciones
- **Desafíos PFA**: Combinación automática según nivel de dificultad

## Solución de Problemas

### ❌ **Error: "API key no proporcionada"**
- Verifique que haya ingresado su clave API de OpenAI
- Asegúrese de que la clave sea válida y tenga créditos disponibles

### ❌ **Error: "Error de API"**
- Verifique su conexión a internet
- Compruebe que su API key tenga permisos para el modelo seleccionado
- Revise si ha excedido su límite de uso

### ❌ **La simulación no responde**
- Refresque la página del navegador
- Verifique que JavaScript esté habilitado
- Limpie la caché del navegador

### ❌ **Los gráficos no se muestran**
- Asegúrese de tener conexión a internet (Chart.js se carga desde CDN)
- Verifique que la consola del navegador no muestre errores

## Características Técnicas

### 🏗️ **Arquitectura**
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Gráficos**: Chart.js para visualizaciones
- **Iconos**: Font Awesome para elementos visuales
- **Responsive**: Diseño adaptable a diferentes tamaños de pantalla

### 🔒 **Seguridad**
- Las API keys se manejan localmente en el navegador
- No se almacenan datos en servidores externos
- Las conversaciones se mantienen en memoria local

### 📱 **Compatibilidad**
- **Desktop**: Windows, macOS, Linux
- **Tablets**: iPad, Android tablets
- **Móviles**: iPhone, Android phones (con limitaciones de pantalla)

## Limitaciones Conocidas

### ⚠️ **Restricciones de la API**
- Dependencia de la disponibilidad de OpenAI
- Límites de uso según su plan de suscripción
- Posibles latencias en respuestas durante horas pico

### 🌐 **Navegador**
- Requiere JavaScript habilitado
- Algunas funciones avanzadas pueden no estar disponibles en navegadores antiguos
- Los gráficos requieren conexión a internet para cargar Chart.js

## Soporte y Contacto

### 📧 **Desarrolladores Originales**
- **Rodrigo A. Figueroa, MD, MHA, PhD(c)**: rfiguerc@uc.cl
- **Pablo Fuentes**
- **Catalina Jara**
- **Giovanni Paredes**
- **Guillermo Rios**

### 📅 **Fecha de Actualización**
- **Versión Web**: Julio 2025
- **Versión Original**: 13 de mayo de 2025

### 📄 **Licencia**
TODOS LOS DERECHOS RESERVADOS // ALL RIGHTS RESERVED

## Changelog

### 🔄 **Versión Web 1.0 (Julio 2025)**
- ✅ Transformación completa de PyQt5 a aplicación web
- ✅ Interfaz moderna y responsiva
- ✅ Integración con API de OpenAI
- ✅ Sistema de evaluación completo
- ✅ Gráficos interactivos con Chart.js
- ✅ Detección automática de criterios PARE
- ✅ Exportación de conversaciones
- ✅ Simulación aleatoria mejorada

## Agradecimientos

Esta aplicación web es una transformación de la aplicación original de PyQt5 desarrollada para la simulación de primeros auxilios psicológicos. Agradecemos a todos los profesionales de la salud mental que han contribuido al desarrollo y validación de esta herramienta educativa.

---

**Nota**: Esta aplicación está diseñada exclusivamente para fines educativos y de entrenamiento. No sustituye la formación profesional en primeros auxilios psicológicos ni la atención médica calificada.

