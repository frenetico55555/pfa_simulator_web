#!/usr/bin/env python3
"""
Servidor Simple para Editor de Prompts - PFA Simulator

Este servidor permite guardar automáticamente los prompts editados
en el archivo prompts.json sin necesidad de conocimientos técnicos.

Uso:
    python server_prompts.py

Luego abre editor_prompts.html en tu navegador.
"""

import json
import os
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import parse_qs, urlparse
import logging

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

class PromptsHandler(SimpleHTTPRequestHandler):
    """Manejador personalizado para el servidor de prompts."""
    
    def do_POST(self):
        """Manejar solicitudes POST para guardar prompts."""
        try:
            # Obtener la ruta de la solicitud
            parsed_path = urlparse(self.path)
            
            if parsed_path.path == '/save_prompts':
                # Guardar prompts
                self.save_prompts()
            else:
                # Para otras rutas, usar el comportamiento por defecto
                return SimpleHTTPRequestHandler.do_POST(self)
                
        except Exception as e:
            logging.error(f"Error en POST: {e}")
            self.send_error(500, f"Error interno: {str(e)}")
    
    def save_prompts(self):
        """Guardar los prompts recibidos en el archivo prompts.json."""
        try:
            # Obtener el contenido del cuerpo de la solicitud
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            # Parsear el JSON
            prompts_data = json.loads(post_data.decode('utf-8'))
            
            # Guardar en el archivo prompts.json
            with open('prompts.json', 'w', encoding='utf-8') as f:
                json.dump(prompts_data, f, indent=2, ensure_ascii=False)
            
            logging.info("Prompts guardados exitosamente")
            
            # Enviar respuesta de éxito
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            response = {"status": "success", "message": "Prompts guardados correctamente"}
            self.wfile.write(json.dumps(response).encode('utf-8'))
            
        except json.JSONDecodeError as e:
            logging.error(f"Error al parsear JSON: {e}")
            self.send_error(400, "JSON inválido")
        except Exception as e:
            logging.error(f"Error al guardar prompts: {e}")
            self.send_error(500, f"Error al guardar: {str(e)}")
    
    def do_OPTIONS(self):
        """Manejar solicitudes OPTIONS para CORS."""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def end_headers(self):
        """Agregar headers CORS a todas las respuestas."""
        self.send_header('Access-Control-Allow-Origin', '*')
        SimpleHTTPRequestHandler.end_headers(self)

def create_backup():
    """Crear una copia de seguridad del archivo prompts.json."""
    if os.path.exists('prompts.json'):
        import shutil
        from datetime import datetime
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_name = f'prompts_backup_{timestamp}.json'
        
        try:
            shutil.copy2('prompts.json', backup_name)
            logging.info(f"Copia de seguridad creada: {backup_name}")
        except Exception as e:
            logging.error(f"Error al crear copia de seguridad: {e}")

def main():
    """Función principal del servidor."""
    # Puerto del servidor
    PORT = 8000
    
    # Crear copia de seguridad antes de iniciar
    create_backup()
    
    try:
        # Crear y configurar el servidor
        server = HTTPServer(('localhost', PORT), PromptsHandler)
        
        print("🚀 Servidor de Prompts PFA Simulator iniciado!")
        print(f"📡 Servidor ejecutándose en: http://localhost:{PORT}")
        print("🌐 Abre '1. Editor de Prompts.html' en tu navegador")
        print("💾 Los prompts se guardarán automáticamente")
        print("⏹️  Presiona Ctrl+C para detener el servidor")
        print("-" * 50)
        
        # Iniciar el servidor
        server.serve_forever()
        
    except KeyboardInterrupt:
        print("\n⏹️  Servidor detenido por el usuario")
        print("👋 ¡Hasta luego!")
    except Exception as e:
        print(f"❌ Error al iniciar el servidor: {e}")
        logging.error(f"Error del servidor: {e}")

if __name__ == "__main__":
    main()
