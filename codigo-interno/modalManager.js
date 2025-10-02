/* modalManager.js - Step 4: unificación de modales
 * Gestiona apertura/cierre con atributos de data y fallback accesible
 */

class ModalManager {
  constructor() {
    this.activeStack = [];
    this.keyHandler = this.onKey.bind(this);
    document.addEventListener('click', e => this.onClick(e));
  }

  onClick(e) {
    const openTrigger = e.target.closest('[data-modal-open]');
    if (openTrigger) {
      e.preventDefault();
      const id = openTrigger.getAttribute('data-modal-open');
      this.open(id, { returnFocus: openTrigger });
      return;
    }
    const closeTrigger = e.target.closest('[data-modal-close]');
    if (closeTrigger) {
      e.preventDefault();
      this.closeTop();
    }
  }

  open(id, { returnFocus } = {}) {
    const modal = document.getElementById(id);
    if (!modal) return;
    if (!this.activeStack.length) document.addEventListener('keydown', this.keyHandler);
    this.activeStack.push({ id, returnFocus: returnFocus || document.activeElement });
    modal.classList.add('active');
    modal.setAttribute('role','dialog');
    modal.setAttribute('aria-modal','true');
    const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable) focusable.focus();
  }

  closeTop() {
    const top = this.activeStack.pop();
    if (!top) return;
    const modal = document.getElementById(top.id);
    if (modal) modal.classList.remove('active');
    if (top.returnFocus && typeof top.returnFocus.focus === 'function') top.returnFocus.focus();
    if (!this.activeStack.length) document.removeEventListener('keydown', this.keyHandler);
  }

  onKey(e) {
    if (e.key === 'Escape') this.closeTop();
  }
}

// Exponer singleton
window.modalManager = new ModalManager();

export default window.modalManager;