# 🚀 **Sistema de Gestión de Prompts - PFA Simulator**

> Aviso Legal: Este sistema de prompts forma parte de una obra propietaria (© 2025 Rodrigo A. Figueroa y colaboradores). Uso educativo restringido. Prohibida la redistribución, extracción masiva o creación de derivados sin autorización escrita. Ver LICENSE / TERMS_OF_USE.md.

## 📋 **Descripción General**

Este sistema permite **editar fácilmente los prompts** de la aplicación sin necesidad de conocimientos de programación. Los prompts son las instrucciones que se envían a la inteligencia artificial (OpenAI) para controlar cómo se comporta durante la simulación.

## 🎯 **Beneficios del Sistema**

✅ **Fácil edición**: No necesitas tocar código  
✅ **Seguro**: No puedes romper la funcionalidad  
✅ **Organizado**: Todos los prompts en un lugar  
✅ **Reutilizable**: Mismo archivo para web y Python  
✅ **Validación**: Verifica que los cambios sean correctos  

## 📁 **Archivos del Sistema**

### **Archivos Principales:**

- `prompts.json` - **Archivo principal** con todos los prompts
- `prompt_manager.py` - **Módulo Python** para usar los prompts
- `INSTRUCCIONES_EDITAR_PROMPTS.md` - **Guía detallada** de edición
- `EJEMPLO_PROMPT_PERSONALIZADO.json` - **Ejemplos** de prompts modificados

## 🔧 **¿Cómo Funciona?**

### **1. Estructura del Archivo prompts.json**

```json
{
  "nombre_del_prompt": {
    "description": "Explica para qué sirve",
    "content": "El prompt real que se envía a la IA"
  }
}
```

### **2. Variables Disponibles**

Los prompts pueden usar variables que se reemplazan automáticamente:

- `{age}` → Edad del paciente
- `{gender}` → Género del paciente
- `{trauma_type}` → Tipo de trauma
- `{conversation}` → Historial de la conversación

## 🌐 **Uso en la Versión Web**

### **Configuración Automática:**

1. Coloca `prompts.json` en la misma carpeta que `index.html`
2. La aplicación web cargará automáticamente los prompts
3. Los cambios se aplican al recargar la página

### **Archivos Necesarios:**

```text
📁 PFA Simulator Web/
├── 📄 index.html
├── 🎨 styles.css
├── ⚙️ script.js
├── 📋 prompts.json          ← Archivo de prompts
├── 📖 INSTRUCCIONES_EDITAR_PROMPTS.md
└── 📚 README_PROMPTS.md
```

## 🐍 **Uso en la Versión Python**

### **Instalación:**

1. Coloca `prompt_manager.py` en la misma carpeta que tu aplicación Python
2. Coloca `prompts.json` en la misma carpeta
3. Importa y usa el módulo

### **Ejemplo de Uso:**

```python
from prompt_manager import PromptManager

# Crear instancia
prompt_manager = PromptManager()

# Obtener prompt del guionista
screenwriter_prompt = prompt_manager.get_screenwriter_prompt(
    age="25 años",
    gender="Femenino",
    trauma_type="Accidente de tránsito"
)

# Obtener prompt de triage
triage_prompt = prompt_manager.get_triage_prompt()

# Recargar prompts (para aplicar cambios)
prompt_manager.reload_prompts()
```

### **Métodos Disponibles:**

- `get_screenwriter_prompt(**kwargs)` - Prompt del guionista
- `get_triage_prompt(**kwargs)` - Prompt de triage
- `get_survivor_prompt(**kwargs)` - Prompt del sobreviviente
- `get_patient_feedback_prompt(**kwargs)` - Feedback del paciente
- `get_technical_feedback_prompt(**kwargs)` - Evaluación técnica
- `get_pare_criteria()` - Criterios PAREN
- `get_emergency_resources()` - Recursos de emergencia

## ✏️ **¿Cómo Editar los Prompts?**

### **Paso 1: Abrir el Archivo**

- Abre `prompts.json` con cualquier editor de texto
- **NO uses Word** (puede cambiar el formato)

### **Paso 2: Encontrar el Prompt**

- Busca la sección que quieres modificar
- Por ejemplo: `"screenwriter_prompt"`

### **Paso 3: Editar el Contenido**

- Cambia solo el texto dentro de las comillas `"content"`
- **NO cambies** la estructura JSON

### **Paso 4: Guardar y Probar**

- Guarda el archivo
- Recarga la aplicación (web) o usa `reload_prompts()` (Python)

## 🎭 **Tipos de Prompts Disponibles**

### **1. Guionista (`screenwriter_prompt`)**

**Función**: Crea la historia del trauma  
**Cuándo se usa**: Al inicio de la simulación  
**Variables**: Todas las características del paciente

### **2. Enfermera de Triage (`triage_prompt`)**

**Función**: Presenta el caso al proveedor  
**Cuándo se usa**: Luego del guión inicial  
**Variables**: Contexto sintetizado del caso

### **3. Sobreviviente (`survivor_prompt`)**

**Función**: Actúa como el paciente  
**Cuándo se usa**: Durante toda la simulación  
**Variables**: Perfil del paciente

### **4. Feedback del Paciente (`patient_feedback_prompt`)**

**Función**: Evalúa desde la perspectiva del paciente  
**Cuándo se usa**: Al finalizar la conversación

### **5. Evaluación Técnica (`technical_feedback_prompt`)**

**Función**: Evalúa el protocolo ABCDE  
**Cuándo se usa**: Tras el feedback del paciente  
**Variables**: Conversación y manual técnico

## 🔍 **Validación y Errores**

### **Validar Archivo:**

```python
# En Python
is_valid = prompt_manager.validate_prompts_file()

# En la consola
python prompt_manager.py
```

### **Errores Comunes:**

- **"Invalid JSON"**: Estructura del archivo rota
- **"File not found"**: Archivo no está en la carpeta correcta
- **Prompt no funciona**: Revisa la sintaxis y variables

## 💡 **Consejos de Edición**

### **1. Haz Cambios Pequeños**

- Modifica una cosa a la vez
- Prueba después de cada cambio
- Haz respaldo del archivo original

### **2. Mantén el Formato**

- Preserva las comillas y llaves
- Usa `\n` para saltos de línea
- Escapa comillas internas con `\"`

### **3. Prueba tus Cambios**

- Verifica que la aplicación funcione
- Revisa que los prompts se comporten como esperabas
- Ajusta si es necesario

## 🚨 **Solución de Problemas**

### **La aplicación no carga los prompts:**

1. Verifica que `prompts.json` esté en la carpeta correcta
2. Revisa que el archivo tenga extensión `.json`
3. Valida la estructura JSON del archivo

### **Los prompts no funcionan como esperabas:**

1. Revisa que no hayas roto la estructura
2. Verifica que las variables estén correctas
3. Simplifica el prompt si es muy complejo

### **Error de sintaxis JSON:**

1. Usa un validador JSON online
2. Revisa que todas las comas y llaves estén en su lugar
3. Asegúrate de que no haya comillas sin cerrar

## 📚 **Recursos Adicionales**

- **Manual de PFA**: Para entender el protocolo ABCDE
- **Guía de criterios PAREN**: Para derivación urgente
- **Ejemplos de prompts**: En `EJEMPLO_PROMPT_PERSONALIZADO.json`
- **Instrucciones detalladas**: En `INSTRUCCIONES_EDITAR_PROMPTS.md`

## 🆘 **¿Necesitas Ayuda?**

### **Pasos para Solucionar Problemas:**

1. **Revisa la estructura**: Asegúrate de no haber roto el JSON
2. **Haz cambios pequeños**: No cambies todo de una vez
3. **Prueba después de cada cambio**: Para identificar el problema
4. **Vuelve al original**: Si algo no funciona, restaura el archivo

### **Recursos de Ayuda:**

- Validador JSON online
- Editor de texto con resaltado de sintaxis
- Documentación de la aplicación
- Ejemplos de prompts funcionando

---

## 🎉 **¡Felicidades!**

Ahora tienes un sistema completo para personalizar los prompts de tu aplicación PFA Simulator sin necesidad de conocimientos de programación.

**Recuerda**: Los prompts son como "recetas" para la IA. Cuanto más claros y específicos sean, mejor funcionará la simulación.

¡Tómate tu tiempo para hacerlos bien y no dudes en experimentar!
