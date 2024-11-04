import {LitElement, html, css} from 'lit';

import {confirmationStore} from '../stores/confirmation-store.js';

import './custom-icon.js';

export class ConfirmationDialog extends LitElement {
  static properties = {
    _state: {state: true},
  };

  static styles = css`
    :host {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      align-items: center;
      justify-content: center;
    }

    :host([open]) {
      display: flex;
    }

    .dialog {
      background: white;
      border-radius: 4px;
      padding: 24px;
      min-width: 320px;
      max-width: 90%;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      animation: slideIn 0.2s ease-out;
    }

    @keyframes slideIn {
      from {
        transform: translateY(-20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .title {
      margin: 0;
      color: var(--primary-color);
      font-size: 1.25rem;
      font-weight: 600;
    }

    .message {
      margin: 16px 0;
      color: var(--text-primary);
      line-height: 1.5;
    }

    .close {
      border: none;
      background: none;
      cursor: pointer;
      color: var(--primary-color);
      padding: 0;
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 24px;
    }

    .action-button {
      padding: 8px 16px;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.2s;
    }

    .cancel {
      display: inline-block;
      border: 1px solid var(--text-primary);
      background: none;
      color: var(--text-primary);
    }

    .cancel:hover {
      background: var(--hover-bg);
    }

    .confirm {
      background-color: var(--primary-color);
      color: white;
    }

    .confirm:hover {
      background-color: var(--hover-primary);
    }
  `;

  constructor() {
    super();
    this._state = confirmationStore.getState();

    confirmationStore.subscribe((state) => {
      this._state = state;
      this.requestUpdate();
      this.toggleAttribute('open', state.isOpen);
    });
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('keydown', this._handleKeyDown.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this._handleKeyDown.bind(this));
  }

  _handleKeyDown(e) {
    if (!this._state.isOpen) return;
    if (e.key === 'Escape') {
      this._handleCancel();
    }
  }

  _handleConfirm() {
    if (this._state.onConfirm) {
      this._state.onConfirm();
    }
  }

  _handleCancel() {
    if (this._state.onCancel) {
      this._state.onCancel();
    }
  }

  _handleOutsideClick(e) {
    if (e.target === this) {
      this._handleCancel();
    }
  }

  render() {
    return html`
      <div class="dialog">
        <div class="header">
          <h2 class="title">${this._state.title}</h2>
          <button class="close" @click=${this._handleCancel}>
            <custom-icon icon="close" size="24px"></custom-icon>
          </button>
        </div>
        <div class="message">${this._state.message}</div>
        <div class="actions">
          <button class="action-button confirm" @click=${this._handleConfirm}>
            ${this._state.confirmLabel}
          </button>
          ${this._state.cancelLabel
            ? html`
                <button
                  class="action-button cancel"
                  @click=${this._handleCancel}
                >
                  ${this._state.cancelLabel}
                </button>
              `
            : ''}
        </div>
      </div>
    `;
  }
}

customElements.define('confirmation-dialog', ConfirmationDialog);
