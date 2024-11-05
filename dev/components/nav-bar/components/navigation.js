import {LitElement, html, css} from 'lit';
import {i18nMixin} from '../../../localization/i18n.js';
import '../../custom-icon';

export class Navigation extends i18nMixin(LitElement) {
  static properties = {
    currentPath: {type: String},
  };

  constructor() {
    super();
    this.currentPath = window.location.pathname;
  }

  static styles = css`
    .nav-buttons {
      display: flex;
    }

    .nav-button {
      padding: 0 1rem;
      border: none;
      background: none;
      color: var(--disabled-primary);
      font-size: 1rem;
      cursor: pointer;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
    }

    .nav-button:hover {
      color: var(--hover-primary);
    }

    .nav-button.active {
      color: var(--primary-color);
      cursor: default;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .nav-buttons {
        flex-direction: column;
        width: 100%;
      }

      .nav-button {
        width: 100%;
        padding: 1rem;
      }
    }
  `;

  isActive(path) {
    return this.currentPath === path ? 'active' : '';
  }

  connectedCallback() {
    super.connectedCallback();
    const handlePopState = () => {
      this.currentPath = window.location.pathname;
      this.requestUpdate();
    };
    window.addEventListener('popstate', handlePopState);
    this._handlePopState = handlePopState;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._handlePopState) {
      window.removeEventListener('popstate', this._handlePopState);
    }
  }

  get navItems() {
    return [
      {
        path: '/',
        text: this.t('nav.employees'),
        icon: 'people',
      },
      {
        path: '/add-employee',
        text: this.t('nav.addNew'),
        icon: 'person_add',
      },
    ];
  }

  render() {
    return html`
      <div class="nav-buttons">
        ${this.navItems.map(
          (item) => html`
            <a
              href="${item.path}"
              class="nav-button ${this.isActive(item.path)}"
            >
              <custom-icon icon="${item.icon}" size="18px"></custom-icon>
              <span>${item.text}</span>
            </a>
          `
        )}
      </div>
    `;
  }
}

customElements.define('nav-buttons', Navigation);
