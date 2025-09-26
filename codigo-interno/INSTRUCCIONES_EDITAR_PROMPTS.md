# 📝 **INSTRUCCIONES PARA EDITAR PROMPTS**

## 🎯 **¿Qué es este archivo?**

El archivo `prompts.json` contiene todos los textos que la aplicación usa para comunicarse con la inteligencia artificial (OpenAI). Estos textos se llaman "prompts" y son como instrucciones que le damos a la IA para que se comporte de cierta manera.

## 🔧 **¿Por qué es útil separar los prompts?**

- **Más fácil de editar**: No necesitas tocar el código de programación
- **Más seguro**: No puedes romper la funcionalidad de la aplicación
- **Más organizado**: Todos los textos están en un solo lugar
- **Reutilizable**: Puedes usar los mismos prompts en diferentes versiones

## 📁 **Estructura del archivo prompts.json**

El archivo está organizado en secciones, cada una con:
- **description**: Explica para qué sirve ese prompt
- **content**: El texto real del prompt (esto es lo que puedes editar)

## ✏️ **¿Cómo editar los prompts?**

### **1. Abrir el archivo**
- Abre `prompts.json` con cualquier editor de texto (Notepad, WordPad, etc.)
- **IMPORTANTE**: No uses Word, ya que puede cambiar el formato

### **2. Encontrar el prompt que quieres cambiar**
- Busca la sección que contenga el prompt que quieres modificar
- Por ejemplo, si quieres cambiar cómo actúa el "Guionista", busca `screenwriter_prompt`

### **3. Editar el contenido**
- Encuentra la línea que dice `"content":`
- Todo lo que está entre las comillas `"` es el prompt
- Puedes cambiar el texto, pero **NO cambies las comillas ni la estructura**

### **4. Guardar el archivo**
- Guarda el archivo con el mismo nombre (`prompts.json`)
- Asegúrate de que la extensión sea `.json` y no `.txt`

## ⚠️ **REGLAS IMPORTANTES**

### **NO CAMBIES:**
- Las llaves `{` y `}`
- Las comillas `"`
- Las comas `,`
- Los dos puntos `:`
- La estructura general del archivo

### **SÍ PUEDES CAMBIAR:**
- El texto dentro de las comillas
- Agregar o quitar líneas dentro del prompt
- Cambiar el orden de las instrucciones

## 📋 **EJEMPLOS DE EDICIÓN**

### **Ejemplo 1: Cambiar el prompt del Guionista**

**ANTES:**
```json
"screenwriter_prompt": {
  "description": "Prompt para el GPT Guionista que crea la historia del trauma",
  "content": "Tú eres un guionista experto..."
}
```

**DESPUÉS:**
```json
"screenwriter_prompt": {
  "description": "Prompt para el GPT Guionista que crea la historia del trauma",
  "content": "Tú eres un escritor creativo especializado en crear historias realistas..."
}
```

### **Ejemplo 2: Agregar nuevas instrucciones**

**ANTES:**
```json
"content": "Eres una enfermera de triage..."
```

**DESPUÉS:**
```json
"content": "Eres una enfermera de triage con 15 años de experiencia. Tu labor es..."
```

## 🎭 **TIPOS DE PROMPTS DISPONIBLES**

### **1. Guionista (`screenwriter_prompt`)**
- **Función**: Crea la historia del trauma del paciente
- **Cuándo se usa**: Al inicio de la simulación
- **Qué puedes cambiar**: Instrucciones sobre cómo crear la historia, qué detalles incluir, etc.

### **2. Enfermera de Triage (`triage_prompt`)**
- **Función**: Evalúa el caso y lo presenta al proveedor
- **Cuándo se usa**: Después de crear la historia
- **Qué puedes cambiar**: Cómo debe presentar el caso, qué información incluir

### **3. Sobreviviente (`survivor_prompt`)**
- **Función**: Actúa como el paciente durante la conversación
- **Cuándo se usa**: Durante toda la simulación
- **Qué puedes cambiar**: Cómo debe comportarse, qué lenguaje usar, etc.

### **4. Feedback del Paciente (`patient_feedback_prompt`)**
- **Función**: Genera evaluación desde la perspectiva del paciente
- **Cuándo se usa**: Al final de la simulación
- **Qué puedes cambiar**: Qué aspectos evaluar, cómo estructurar la respuesta

### **5. Evaluación Técnica (`technical_feedback_prompt`)**
- **Función**: Evalúa el desempeño del proveedor según el protocolo ABCDE
- **Cuándo se usa**: Al final de la simulación
- **Qué puedes cambiar**: Criterios de evaluación, estructura del feedback

## 🔍 **VARIABLES DISPONIBLES**

Algunos prompts usan variables que se reemplazan automáticamente:

- `{age}` → Edad del paciente
- `{gender}` → Género del paciente
- `{trauma_type}` → Tipo de trauma
- `{education}` → Nivel educativo
- `{conversation}` → Historial de la conversación

**NO CAMBIES** estas variables, solo el texto alrededor.

## 💡 **CONSEJOS PARA EDITAR**

### **1. Haz cambios pequeños**
- Cambia una cosa a la vez
- Prueba la aplicación después de cada cambio
- Si algo no funciona, vuelve al texto original

### **2. Mantén el formato**
- Si hay saltos de línea con `\n`, mantenlos
- Si hay comillas dentro del texto, escríbelas como `\"`

### **3. Prueba tus cambios**
- Después de editar, abre la aplicación
- Ve si los cambios funcionan como esperabas
- Si hay errores, revisa que no hayas roto la estructura JSON

### **4. Haz respaldo**
- Antes de hacer cambios grandes, copia el archivo original
- Así puedes volver atrás si algo sale mal

## 🚨 **PROBLEMAS COMUNES**

### **Error: "Invalid JSON"**
- **Causa**: Rompiste la estructura del archivo
- **Solución**: Revisa que todas las llaves, comillas y comas estén en su lugar

### **Error: "File not found"**
- **Causa**: El archivo no está en la misma carpeta que la aplicación
- **Solución**: Asegúrate de que `prompts.json` esté en la misma carpeta que `index.html`

### **La aplicación no responde como esperabas**
- **Causa**: El prompt no está claro o tiene instrucciones contradictorias
- **Solución**: Simplifica el prompt, hazlo más específico

## 📚 **RECURSOS ADICIONALES**

- **Manual de PFA**: Para entender mejor el protocolo ABCDE
- **Guía de criterios PAREN**: Para entender cuándo derivar urgentemente
- **Ejemplos de casos**: Para ver cómo se comportan los prompts en la práctica

## 🆘 **¿NECESITAS AYUDA?**

Si tienes problemas editando los prompts:

1. **Revisa la estructura**: Asegúrate de no haber roto el formato JSON
2. **Haz cambios pequeños**: No cambies todo de una vez
3. **Prueba después de cada cambio**: Para identificar qué causó el problema
4. **Vuelve al original**: Si algo no funciona, restaura el archivo original

---

**Recuerda**: Los prompts son como "recetas" para la IA. Cuanto más claros y específicos sean, mejor funcionará la simulación. ¡Tómate tu tiempo para hacerlos bien!
