import {LitElement, html, css} from 'lit';
import '../../custom-icon';

export class Navigation extends LitElement {
  static properties = {
    currentPath: {type: String},
    navItems: {type: Array},
  };

  constructor() {
    super();
    this.currentPath = window.location.pathname;
    this.navItems = [
      {
        path: '/',
        text: 'Employees',
        icon: 'people',
      },
      {
        path: '/add-employee',
        text: 'Add New',
        icon: 'person_add',
      },
    ];
  }

  static styles = css`
    .nav-buttons {
      display: flex;
    }

    .nav-button {
      padding: 0 1rem;
      border: none;
      background: none;
      color: #ffa07a;
      font-size: 1rem;
      cursor: pointer;
      transition: color 0.3s ease;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .nav-button:hover {
      color: #ff8c00;
    }

    .nav-button.active {
      color: #ff7300;
      font-weight: 500;
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
              ${item.text}
            </a>
          `
        )}
      </div>
    `;
  }
}

customElements.define('nav-buttons', Navigation);
