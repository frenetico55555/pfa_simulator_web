"""
Prompt Manager para el Simulador de Primeros Auxilios Psicológicos

Obra Propietaria © 2025 Rodrigo A. Figueroa y colaboradores autorizados.
Uso exclusivamente educativo interno. Prohibida la redistribución, extracción masiva de prompts
o creación de derivados sin autorización escrita. Ver LICENSE / TERMS_OF_USE.md.

Este módulo permite cargar y gestionar prompts desde un archivo JSON externo,
facilitando la edición de prompts para personas sin conocimientos de programación.

Autor: Asistente AI
Fecha: 2025-01-27
"""

import json
import os
from typing import Dict, Any, Optional
from datetime import datetime, timedelta

class PromptManager:
    """
    Gestiona la carga y uso de prompts desde archivos JSON externos.
    """
    
    def __init__(self, prompts_file: str = "prompts.json"):
        """
        Inicializa el gestor de prompts.
        
        Args:
            prompts_file (str): Ruta al archivo de prompts JSON
        """
        self.prompts_file = prompts_file
        self.prompts = {}
        self.load_prompts()
    
    def load_prompts(self) -> None:
        """
        Carga los prompts desde el archivo JSON.
        """
        try:
            if os.path.exists(self.prompts_file):
                with open(self.prompts_file, 'r', encoding='utf-8') as file:
                    self.prompts = json.load(file)
                print(f"✅ Prompts cargados exitosamente desde {self.prompts_file}")
            else:
                print(f"⚠️ Archivo {self.prompts_file} no encontrado. Usando prompts por defecto.")
                self.create_default_prompts()
        except json.JSONDecodeError as e:
            print(f"❌ Error al parsear JSON en {self.prompts_file}: {e}")
            print("Usando prompts por defecto.")
            self.create_default_prompts()
        except Exception as e:
            print(f"❌ Error inesperado al cargar prompts: {e}")
            self.create_default_prompts()
    
    def create_default_prompts(self) -> None:
        """
        Crea prompts por defecto si no se puede cargar el archivo JSON.
        """
        self.prompts = {
            "screenwriter_prompt": {
                "description": "Prompt para el GPT Guionista que crea la historia del trauma",
                "content": "Eres un guionista experto en simulación médica. Crea una historia realista de un sobreviviente de trauma."
            },
            "triage_prompt": {
                "description": "Prompt para el GPT Enfermera de Triage",
                "content": "Eres una enfermera de triage. Presenta el caso de forma clara y profesional."
            },
            "survivor_prompt": {
                "description": "Prompt para el GPT Sobreviviente",
                "content": "Eres un sobreviviente de trauma. Actúa de forma realista y coherente."
            }
        }
    
    def get_prompt(self, prompt_name: str) -> str:
        """
        Obtiene el contenido de un prompt específico.
        
        Args:
            prompt_name (str): Nombre del prompt a obtener
            
        Returns:
            str: Contenido del prompt, o mensaje de error si no existe
        """
        if prompt_name in self.prompts:
            return self.prompts[prompt_name]["content"]
        else:
            print(f"⚠️ Prompt '{prompt_name}' no encontrado.")
            return f"Prompt '{prompt_name}' no encontrado en la configuración."
    
    def get_prompt_description(self, prompt_name: str) -> str:
        """
        Obtiene la descripción de un prompt específico.
        
        Args:
            prompt_name (str): Nombre del prompt
            
        Returns:
            str: Descripción del prompt
        """
        if prompt_name in self.prompts:
            return self.prompts[prompt_name]["description"]
        return "Descripción no disponible"
    
    def list_available_prompts(self) -> list:
        """
        Lista todos los prompts disponibles.
        
        Returns:
            list: Lista de nombres de prompts disponibles
        """
        return list(self.prompts.keys())
    
    def reload_prompts(self) -> None:
        """
        Recarga los prompts desde el archivo JSON.
        Útil para aplicar cambios sin reiniciar la aplicación.
        """
        print("🔄 Recargando prompts...")
        self.load_prompts()
    
    def validate_prompts_file(self) -> bool:
        """
        Valida que el archivo de prompts tenga la estructura correcta.
        
        Returns:
            bool: True si el archivo es válido, False en caso contrario
        """
        try:
            with open(self.prompts_file, 'r', encoding='utf-8') as file:
                data = json.load(file)
            
            # Verificar estructura básica
            required_keys = ["screenwriter_prompt", "triage_prompt", "survivor_prompt"]
            for key in required_keys:
                if key not in data:
                    print(f"❌ Falta prompt requerido: {key}")
                    return False
                
                if "content" not in data[key]:
                    print(f"❌ Prompt '{key}' no tiene contenido")
                    return False
            
            print("✅ Archivo de prompts válido")
            return True
            
        except Exception as e:
            print(f"❌ Error al validar archivo de prompts: {e}")
            return False
    
    def format_prompt(self, prompt_name: str, **kwargs) -> str:
        """
        Formatea un prompt reemplazando variables con valores específicos.
        
        Args:
            prompt_name (str): Nombre del prompt a formatear
            **kwargs: Variables a reemplazar en el prompt
            
        Returns:
            str: Prompt formateado con las variables reemplazadas
        """
        prompt_content = self.get_prompt(prompt_name)
        
        # Reemplazar variables comunes
        if "current_date" in kwargs:
            prompt_content = prompt_content.replace("{current_date}", kwargs["current_date"])
        
        if "two_weeks_ago" in kwargs:
            prompt_content = prompt_content.replace("{two_weeks_ago}", kwargs["two_weeks_ago"])
        
        # Reemplazar variables específicas del paciente
        patient_vars = ["age", "gender", "trauma_type", "trauma_setting", "education", 
                       "civil_status", "network", "lives_with", "hobbies", 
                       "personality_values", "medical_conditions", "psychiatric_conditions", 
                       "medications", "challenges"]
        
        for var in patient_vars:
            placeholder = "{" + var + "}"
            if placeholder in prompt_content:
                value = kwargs.get(var, "no especificado")
                if isinstance(value, list):
                    value = ", ".join(value)
                prompt_content = prompt_content.replace(placeholder, str(value))
        
        # Reemplazar variables de conversación
        if "conversation" in kwargs:
            prompt_content = prompt_content.replace("{conversation}", str(kwargs["conversation"]))
        
        if "patient_info" in kwargs:
            prompt_content = prompt_content.replace("{patient_info}", str(kwargs["patient_info"]))
        
        if "manual_text" in kwargs:
            prompt_content = prompt_content.replace("{manual_text}", str(kwargs["manual_text"]))
        
        if "case_paren_criteria" in kwargs:
            prompt_content = prompt_content.replace("{case_paren_criteria}", str(kwargs["case_paren_criteria"]))
        
        if "student_reported_paren" in kwargs:
            prompt_content = prompt_content.replace("{student_reported_paren}", str(kwargs["student_reported_paren"]))
        
        return prompt_content
    
    def get_screenwriter_prompt(self, **kwargs) -> str:
        """
        Obtiene el prompt del guionista formateado.
        
        Args:
            **kwargs: Variables del paciente y contexto
            
        Returns:
            str: Prompt del guionista formateado
        """
        # Agregar fechas si no están proporcionadas
        if "current_date" not in kwargs:
            kwargs["current_date"] = datetime.now().strftime('%Y-%m-%d')
        
        if "two_weeks_ago" not in kwargs:
            two_weeks_ago = datetime.now() - timedelta(days=14)
            kwargs["two_weeks_ago"] = two_weeks_ago.strftime('%Y-%m-%d')
        
        return self.format_prompt("screenwriter_prompt", **kwargs)
    
    def get_triage_prompt(self, **kwargs) -> str:
        """
        Obtiene el prompt de triage formateado.
        
        Args:
            **kwargs: Variables del contexto
            
        Returns:
            str: Prompt de triage formateado
        """
        return self.format_prompt("triage_prompt", **kwargs)
    
    def get_survivor_prompt(self, **kwargs) -> str:
        """
        Obtiene el prompt del sobreviviente formateado.
        
        Args:
            **kwargs: Variables del paciente
            
        Returns:
            str: Prompt del sobreviviente formateado
        """
        return self.format_prompt("survivor_prompt", **kwargs)
    
    def get_patient_feedback_prompt(self, **kwargs) -> str:
        """
        Obtiene el prompt de feedback del paciente formateado.
        
        Args:
            **kwargs: Variables del contexto
            
        Returns:
            str: Prompt de feedback del paciente formateado
        """
        return self.format_prompt("patient_feedback_prompt", **kwargs)
    
    def get_technical_feedback_prompt(self, **kwargs) -> str:
        """
        Obtiene el prompt de evaluación técnica formateado.
        
        Args:
            **kwargs: Variables del contexto
            
        Returns:
            str: Prompt de evaluación técnica formateado
        """
        return self.format_prompt("technical_feedback_prompt", **kwargs)
    
    def get_pare_criteria(self) -> list:
        """
        Obtiene la lista de criterios PAREN.
        
        Returns:
            list: Lista de criterios PAREN
        """
        if "pare_criteria" in self.prompts and "criteria" in self.prompts["pare_criteria"]:
            return self.prompts["pare_criteria"]["criteria"]
        return []
    
    def get_emergency_resources(self) -> list:
        """
        Obtiene la lista de recursos de emergencia.
        
        Returns:
            list: Lista de recursos de emergencia
        """
        if "emergency_resources" in self.prompts and "resources" in self.prompts["emergency_resources"]:
            return self.prompts["emergency_resources"]["resources"]
        return []


# Ejemplo de uso
if __name__ == "__main__":
    # Crear instancia del gestor de prompts
    prompt_manager = PromptManager()
    
    # Listar prompts disponibles
    print("📋 Prompts disponibles:")
    for prompt_name in prompt_manager.list_available_prompts():
        description = prompt_manager.get_prompt_description(prompt_name)
        print(f"  • {prompt_name}: {description}")
    
    # Validar archivo de prompts
    print("\n🔍 Validando archivo de prompts...")
    is_valid = prompt_manager.validate_prompts_file()
    
    # Ejemplo de uso con variables
    print("\n📝 Ejemplo de prompt formateado:")
    example_prompt = prompt_manager.get_screenwriter_prompt(
        age="25 años",
        gender="Femenino",
        trauma_type="Accidente de tránsito",
        education="Profesional"
    )
    print(example_prompt[:200] + "...")
    
    # Mostrar criterios PAREN
    print("\n🚨 Criterios PAREN:")
    pare_criteria = prompt_manager.get_pare_criteria()
    for criterion in pare_criteria:
        print(f"  • {criterion}")
    
    # Mostrar recursos de emergencia
    print("\n📞 Recursos de emergencia:")
    emergency_resources = prompt_manager.get_emergency_resources()
    for resource in emergency_resources:
        print(f"  • {resource}")
