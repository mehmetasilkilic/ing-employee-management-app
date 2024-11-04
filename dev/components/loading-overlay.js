import {LitElement, html, css} from 'lit';

export class LoadingOverlay extends LitElement {
  static properties = {
    loading: {type: Boolean},
    text: {type: String},
  };

  static styles = css`
    :host {
      display: contents;
    }

    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--border-color, #f3f3f3);
      border-top: 3px solid var(--primary-color, #3498db);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    .loading-text {
      margin-left: 1rem;
      color: var(--text-secondary);
      font-size: 0.875rem;
    }
  `;

  constructor() {
    super();
    this.loading = false;
    this.text = 'Loading...';
  }

  render() {
    if (!this.loading) return '';

    return html`
      <div class="loading-overlay">
        <div class="spinner"></div>
        <span class="loading-text">${this.text}</span>
      </div>
    `;
  }
}

customElements.define('loading-overlay', LoadingOverlay);
