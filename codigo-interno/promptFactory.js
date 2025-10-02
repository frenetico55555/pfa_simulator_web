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

  async buildSurvivorPrompt({ config, story, triage, history, lastUserMessage, maxHistory = 8 }) {
    const d = await this.load();
    const conf = d.chat && d.chat.survivor;
    if (!conf) throw new Error('Prompts.chat.survivor no disponible');
    const recent = (history || [])
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .slice(-maxHistory)
      .map(m => `${m.role === 'user' ? 'PROVEEDOR' : 'SOBREVIVIENTE'}: ${m.content}`)
      .join('\n');
    const personalityFlat = Object.entries(config.personalityValues || {})
      .map(([k,v]) => `${k}:${v}%`).join(', ');
    return {
      system: conf.system,
      user: this._fill(conf.userTemplate, {
        storySnippet: (story||'').slice(0, 600),
        triageSnippet: (triage||'').slice(0, 400),
        age: config.age,
        gender: config.gender,
        education: config.education,
        network: config.network,
        challenges: config.challenges,
        personalityFlat,
        historyCount: maxHistory,
        recentHistory: recent || '—',
        lastUserMessage: lastUserMessage || ''
      })
    };
  }

  async buildPatientFeedbackPrompt({ config, history, maxHistory = 18 }) {
    const d = await this.load();
    const conf = d.feedback && d.feedback.patient;
    if (!conf) throw new Error('Prompts.feedback.patient no disponible');
    const recent = (history || [])
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .slice(-maxHistory)
      .map(m => `${m.role === 'user' ? 'PROVEEDOR' : 'SOBREVIVIENTE'}: ${m.content}`)
      .join('\n');
    return {
      system: conf.system,
      user: this._fill(conf.template, {
        age: config.age,
        gender: config.gender,
        education: config.education,
        historyCount: maxHistory,
        recentHistory: recent || '—'
      })
    };
  }

  async buildTechnicalFeedbackPrompt({ history, pareDetectedList = [], studentReportedList = [], maxHistory = 22 }) {
    const d = await this.load();
    const conf = d.feedback && d.feedback.technical;
    if (!conf) throw new Error('Prompts.feedback.technical no disponible');
    const recent = (history || [])
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .slice(-maxHistory)
      .map(m => `${m.role === 'user' ? 'PROVEEDOR' : 'SOBREVIVIENTE'}: ${m.content}`)
      .join('\n');
    return {
      system: conf.system,
      user: this._fill(conf.template, {
        historyCount: maxHistory,
        recentHistory: recent || '—',
        pareDetectedList: pareDetectedList.length ? pareDetectedList.join(', ') : 'Ninguno',
        studentReportedList: studentReportedList.length ? studentReportedList.join(', ') : 'No reportado'
      })
    };
  }
}

window.PromptFactory = PromptFactory;
