import {LitElement, html, css} from 'lit';

import './components/logo.js';
import './components/navigation.js';
import './components/language-selector.js';

export class NavBar extends LitElement {
  static properties = {
    isMenuOpen: {type: Boolean},
  };

  constructor() {
    super();
    this.isMenuOpen = false;
    this._handleNavigation = this._handleNavigation.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('popstate', this._handleNavigation);
    this.addEventListener('click', this._handleNavigation);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('popstate', this._handleNavigation);
    this.removeEventListener('click', this._handleNavigation);
  }

  _handleNavigation(e) {
    if (e.type === 'popstate' || (e.target.tagName === 'A' && e.target.href)) {
      this.closeMenu();
    }
  }

  static styles = css`
    :host {
      display: block;
      background-color: white;
      margin: 3rem 1.5rem 0 1.5rem;
    }

    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 1rem;
      max-width: 1400px;
      position: relative;
    }

    .right-section {
      display: flex;
      align-items: center;
    }

    .hamburger {
      display: none;
      flex-direction: column;
      justify-content: space-between;
      width: 30px;
      height: 21px;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0;
      z-index: 10;
    }

    .hamburger span {
      width: 100%;
      height: 3px;
      background-color: var(--primary-color);
      transition: all 0.3s ease-in-out;
    }

    @media (max-width: 768px) {
      .hamburger {
        display: flex;
      }

      .hamburger.active span:nth-child(1) {
        transform: translateY(9px) rotate(45deg);
      }

      .hamburger.active span:nth-child(2) {
        opacity: 0;
      }

      .hamburger.active span:nth-child(3) {
        transform: translateY(-9px) rotate(-45deg);
      }

      .right-section {
        position: fixed;
        top: 0;
        right: -100%;
        height: 100vh;
        width: 250px;
        background-color: white;
        flex-direction: column;
        padding: 80px 20px;
        transition: right 0.3s ease-in-out;
        box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
        z-index: 3;
      }

      .right-section.active {
        right: 0;
      }

      nav-buttons {
        display: flex;
        flex-direction: column;
        width: 100%;
        margin-bottom: 2rem;
      }
    }

    .overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 250px;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 2;
      transition: opacity 0.3s ease-in-out;
      opacity: 0;
    }

    .overlay.active {
      display: block;
      opacity: 1;
    }

    @media (max-width: 768px) {
      .navbar {
        z-index: 100;
      }
    }
  `;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.requestUpdate();
  }

  closeMenu() {
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
      this.requestUpdate();
    }
  }

  handleLanguageChange(e) {
    console.log('Language', e.detail.language);
    this.closeMenu();
  }

  render() {
    return html`
      <nav class="navbar">
        <nav-logo></nav-logo>

        <button
          class="hamburger ${this.isMenuOpen ? 'active' : ''}"
          @click="${this.toggleMenu}"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div class="right-section ${this.isMenuOpen ? 'active' : ''}">
          <nav-buttons></nav-buttons>

          <language-selector
            @language-change="${this.handleLanguageChange}"
          ></language-selector>
        </div>

        <div
          class="overlay ${this.isMenuOpen ? 'active' : ''}"
          @click="${this.closeMenu}"
        ></div>
      </nav>
    `;
  }
}

customElements.define('nav-bar', NavBar);
