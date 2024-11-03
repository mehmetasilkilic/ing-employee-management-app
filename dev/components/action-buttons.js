import {LitElement, html, css} from 'lit';

import './custom-icon';

export class ActionButtons extends LitElement {
  static properties = {
    actions: {type: Array},
    item: {type: Object},
    size: {type: Number},
  };

  static styles = css`
    :host {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
    }

    .action-button {
      padding: 0.5rem;
      border: none;
      background: none;
      color: var(--primary-color);
      font-size: 1rem;
      cursor: pointer;
      display: flex;
      transition: transform 0.3s ease;
      align-items: center;
      justify-content: center;
    }

    .action-button:hover {
      color: var(--hover-primary);
      transform: scale(1.1);
    }

    .action-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }
  `;

  constructor() {
    super();
    this.actions = [];
    this.size = 18;
  }

  handleAction(action) {
    if (action.disabled) return;

    this.dispatchEvent(
      new CustomEvent(action.event || 'action', {
        detail: {
          type: action.type,
          item: this.item,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      ${this.actions.map(
        (action) => html`
          <button
            @click=${() => this.handleAction(action)}
            ?disabled=${action.disabled}
            class="action-button"
            aria-label=${action.label}
            title=${action.label}
          >
            <custom-icon icon=${action.icon} size=${this.size}></custom-icon>
          </button>
        `
      )}
    `;
  }
}

customElements.define('action-buttons', ActionButtons);
