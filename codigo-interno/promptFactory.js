// PromptFactory - capa de abstracción para prompts estructurados
// Carga perezosa de `prompts.json` y utilidades de interpolación.

class PromptFactory {
  constructor(url = 'codigo-interno/prompts.json') {
    this.url = url;
    this._data = null;
    this._loading = null;
    this.version = null;
  }

  async load() {
    if (this._data) return this._data;
    if (this._loading) return this._loading;
    this._loading = fetch(this.url, { cache: 'no-cache' })
      .then(r => {
        if (!r.ok) throw new Error('No se pudo cargar prompts.json');
        return r.json();
      })
      .then(json => {
        this._data = json;
        this.version = (json.metadata && json.metadata.version) || 'unknown';
        window.PROMPTS_VERSION = this.version;
        return this._data;
      })
      .catch(err => {
        console.warn('[PromptFactory] Error cargando prompts.json, usando fallback mínimo:', err);
        this._data = {
          simulation: {
            story: {
              system: 'Eres un generador de historias clínicas breves.',
              userTemplate: 'Genera una historia simple para un trauma {traumaType} en {traumaSetting}.'
            },
            triage: {
              system: 'Eres una enfermera de triage.',
              userTemplate: 'Resume en pocas líneas el estado general a partir de: {storySnippet}'
            }
          }
        };
        return this._data;
      });
    return this._loading;
  }

  _fill(tpl, data) {
    if (!tpl) return '';
    return tpl.replace(/\{(\w+)\}/g, (m, k) => (k in data ? (data[k] ?? '') : (console.warn('[PromptFactory] Placeholder no encontrado:', k), '')));
  }

  async buildStoryPrompt(data) {
    const d = await this.load();
    const conf = d.simulation && d.simulation.story;
    if (!conf) throw new Error('Prompts.story no disponible');
    return {
      system: conf.system,
      user: this._fill(conf.userTemplate, data)
    };
  }

  async buildTriagePrompt(data) {
    const d = await this.load();
    const conf = d.simulation && d.simulation.triage;
    if (!conf) throw new Error('Prompts.triage no disponible');
    return {
      system: conf.system,
      user: this._fill(conf.userTemplate, data)
    };
  }
}

window.PromptFactory = PromptFactory;
