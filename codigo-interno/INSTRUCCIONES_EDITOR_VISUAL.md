# 🎯 **INSTRUCCIONES COMPLETAS PARA EDITORES DE PROMPTS**

## 🚀 **¿Qué es el Editor Visual de Prompts?**

El **Editor Visual de Prompts** es una herramienta completamente amigable que te permite modificar cómo se comporta la inteligencia artificial en el simulador PFA **SIN NECESITAR CONOCIMIENTOS DE PROGRAMACIÓN**.

### ✨ **Características Principales:**
- 🖱️ **Interfaz visual**: Solo haz clic y escribe
- 👁️ **Vista previa en tiempo real**: Ve los cambios al instante
- 💾 **Guardado automático**: Los cambios se aplican inmediatamente
- 🔄 **Restauración**: Puedes volver al prompt original en cualquier momento
- 📱 **Responsive**: Funciona en computadoras, tablets y celulares

---

## 🎬 **¿Cómo Funciona?**

### **1. Los Prompts son "Instrucciones" para la IA**
Imagina que los prompts son como **recetas de cocina** que le das a la IA:
- 🎭 **Guionista**: Le dice a la IA cómo crear historias de trauma
- 👩‍⚕️ **Enfermera de Triage**: Le dice cómo evaluar casos
- 👤 **Sobreviviente**: Le dice cómo actuar como paciente
- 📊 **Feedback del Paciente**: Le dice cómo evaluar la interacción
- 🔬 **Evaluación Técnica**: Le dice cómo evaluar el protocolo ABCDE

### **2. Las Variables son "Ingredientes"**
Las variables como `{age}`, `{gender}`, `{trauma_type}` son como **ingredientes** que se reemplazan automáticamente:
- `{age}` → Se convierte en la edad del paciente
- `{gender}` → Se convierte en el género del paciente
- `{trauma_type}` → Se convierte en el tipo de trauma
- `{education}` → Se convierte en el nivel educativo
- `{conversation}` → Se convierte en la conversación completa

---

## 🚀 **PASO A PASO: Cómo Usar el Editor**

### **PASO 1: Iniciar el Sistema**
1. **Abre la carpeta** `PFA 23-08` en tu computadora
2. **Haz doble clic** en `server_prompts.py`
3. **Espera** a que aparezca el mensaje "Servidor ejecutándose en: http://localhost:8000"
4. **Mantén esa ventana abierta** (NO la cierres)

### **PASO 2: Abrir el Editor**
1. **Haz doble clic** en `1. Editor de Prompts.html`
2. Se abrirá en tu navegador web
3. Verás dos paneles: **Editor** (izquierda) y **Vista Previa** (derecha)

### **PASO 3: Seleccionar un Prompt**
1. **Haz clic** en el menú desplegable "Selecciona el tipo de prompt"
2. **Elige** el tipo que quieres editar:
   - 🎭 **Guionista**: Para cambiar cómo se crean las historias
   - 👩‍⚕️ **Enfermera de Triage**: Para cambiar cómo se evalúan los casos
   - 👤 **Sobreviviente**: Para cambiar cómo actúa el paciente
   - 📊 **Feedback del Paciente**: Para cambiar la evaluación del paciente
   - 🔬 **Evaluación Técnica**: Para cambiar la evaluación del protocolo ABCDE

### **PASO 4: Editar el Prompt**
1. **Lee la descripción** que aparece debajo del selector
2. **Modifica el texto** en el área de edición grande
3. **Observa la vista previa** en el panel derecho (se actualiza automáticamente)
4. **Usa las variables** como `{age}`, `{gender}`, etc. donde sea necesario

### **PASO 5: Guardar los Cambios**
1. **Haz clic** en el botón "💾 Guardar Cambios"
2. **Espera** el mensaje de confirmación
3. **¡Listo!** Los cambios se aplican inmediatamente

---

## 🔧 **Ejemplos Prácticos de Edición**

### **Ejemplo 1: Cambiar el Prompt del Guionista**

**ANTES:**
```
Eres un guionista experto en simulación médica...
```

**DESPUÉS:**
```
Eres un escritor creativo especializado en crear historias realistas de trauma...
```

**¿Qué pasó?** Cambiaste "guionista experto en simulación médica" por "escritor creativo especializado en crear historias realistas de trauma"

### **Ejemplo 2: Agregar Instrucciones Específicas**

**ANTES:**
```
Crea una historia realista de un sobreviviente de trauma.
```

**DESPUÉS:**
```
Crea una historia realista de un sobreviviente de trauma.
IMPORTANTE: La historia debe ser apropiada para el nivel educativo {education}.
Si {education} es "Básico", usa lenguaje simple.
Si {education} es "Postgrado", puedes usar términos más técnicos.
```

**¿Qué pasó?** Agregaste instrucciones específicas sobre cómo adaptar el lenguaje según el nivel educativo

### **Ejemplo 3: Usar Variables Correctamente**

**CORRECTO:**
```
El paciente tiene {age} años y experimentó {trauma_type}.
```

**INCORRECTO:**
```
El paciente tiene edad años y experimentó tipo de trauma.
```

**¿Por qué?** Las variables deben estar entre llaves `{}` para que se reemplacen automáticamente

---

## ⚠️ **REGLAS IMPORTANTES**

### ✅ **SÍ PUEDES HACER:**
- Cambiar el texto del prompt
- Agregar nuevas instrucciones
- Modificar el tono o estilo
- Agregar ejemplos o casos específicos
- Usar variables como `{age}`, `{gender}`, etc.
- Hacer el prompt más largo o más corto

### ❌ **NO HAGAS:**
- Borrar las variables entre llaves `{}`
- Cambiar la estructura del archivo
- Agregar símbolos extraños o caracteres especiales
- Borrar completamente el prompt (debe tener algún contenido)

---

## 🆘 **Solución de Problemas**

### **Problema: "No se puede guardar"**
**Solución:**
1. Asegúrate de que `server_prompts.py` esté ejecutándose
2. Verifica que no haya errores en la ventana del servidor
3. Si persiste, usa el botón "📤 Exportar Prompts" y reemplaza manualmente el archivo

### **Problema: "Los cambios no se ven en la aplicación"**
**Solución:**
1. Recarga la página de la aplicación principal
2. Verifica que el archivo `prompts.json` se haya actualizado
3. Reinicia la aplicación si es necesario

### **Problema: "Se rompió algo"**
**Solución:**
1. Usa el botón "🔄 Restaurar Original"
2. Esto devuelve el prompt a su estado inicial
3. Intenta hacer cambios más pequeños

---

## 💡 **Consejos para Editar Efectivamente**

### **1. Haz Cambios Pequeños**
- No cambies todo de una vez
- Prueba un cambio, guárdalo, y luego haz otro
- Es más fácil identificar problemas con cambios pequeños

### **2. Usa la Vista Previa**
- Siempre revisa cómo se ve tu prompt en el panel derecho
- La vista previa te muestra exactamente cómo quedará

### **3. Prueba tus Cambios**
- Después de editar, abre la aplicación principal
- Ve si los cambios funcionan como esperabas
- Si no funciona, puedes restaurar el original

### **4. Haz Copias de Seguridad**
- El sistema crea copias automáticas, pero también puedes:
- Usar "📤 Exportar Prompts" para descargar tu versión
- Guardar el archivo con un nombre diferente

---

## 🎯 **Casos de Uso Comunes**

### **Para Psicólogos/Profesionales de Salud:**
- **Modificar el lenguaje** para que sea más apropiado para tu población
- **Agregar criterios específicos** de evaluación
- **Cambiar el tono** para que sea más empático o más técnico

### **Para Educadores:**
- **Simplificar el lenguaje** para estudiantes principiantes
- **Agregar ejemplos** específicos de tu área
- **Modificar los criterios** de evaluación según tus necesidades

### **Para Investigadores:**
- **Agregar protocolos específicos** de investigación
- **Modificar los criterios** de evaluación
- **Personalizar** según tu metodología

---

## 🔄 **Flujo de Trabajo Recomendado**

### **1. Planificación**
- Piensa qué quieres cambiar
- Identifica qué prompt necesitas modificar
- Planifica los cambios paso a paso

### **2. Edición**
- Abre el editor
- Selecciona el prompt correcto
- Haz cambios pequeños y graduales
- Usa la vista previa para verificar

### **3. Prueba**
- Guarda los cambios
- Prueba la aplicación
- Verifica que funcione como esperabas

### **4. Refinamiento**
- Si algo no funciona, ajusta
- Si funciona bien, puedes hacer más cambios
- Siempre puedes restaurar al original

---

## 📞 **¿Necesitas Ayuda?**

### **Si tienes problemas técnicos:**
1. **Revisa** que el servidor esté ejecutándose
2. **Verifica** que todos los archivos estén en la misma carpeta
3. **Consulta** los mensajes de error en la consola del navegador

### **Si tienes dudas sobre el contenido:**
1. **Lee** la descripción del prompt antes de editarlo
2. **Observa** cómo funciona el prompt original
3. **Haz cambios pequeños** para entender el impacto

### **Si algo se rompe:**
1. **No te preocupes**, siempre puedes restaurar
2. **Usa** el botón "🔄 Restaurar Original"
3. **Haz** una copia de seguridad antes de hacer cambios grandes

---

## 🎉 **¡Felicidades!**

Ahora tienes el poder de personalizar completamente cómo se comporta la inteligencia artificial en tu simulador PFA. 

**Recuerda:**
- 🎯 **Sé específico** en tus instrucciones
- 🔧 **Usa las variables** correctamente
- 👁️ **Revisa la vista previa** antes de guardar
- 💾 **Guarda frecuentemente** tus cambios
- 🔄 **Puedes restaurar** en cualquier momento

**¡Tú eres el director de la IA!** 🎬✨

---

*¿Tienes más preguntas? Consulta los archivos README.md y README_PROMPTS.md para más información técnica.*
