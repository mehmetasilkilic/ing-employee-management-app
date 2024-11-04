import {LitElement, html, css} from 'lit';
import {i18nMixin} from './localization/i18n.js';

import {router, routes} from './config/router.js';

import './components/nav-bar/index.js';

export class AppRoot extends i18nMixin(LitElement) {
  static styles = css`
    :host {
      display: block;
    }

    #outlet {
      margin: 0 1.5rem;
    }

    @media (max-width: 768px) {
      #outlet {
        margin: 0;
      }
    }
  `;

  static properties = {
    currentLanguage: {type: String},
  };

  constructor() {
    super();
    this.currentLanguage = this.i18n.language;
  }

  firstUpdated() {
    const outlet = this.shadowRoot.getElementById('outlet');
    router.setOutlet(outlet);
    router.setRoutes(routes);
  }

  async handleLanguageChange(e) {
    try {
      const newLang = e.detail.language;
      await this.i18n.changeLanguage(newLang);
      this.currentLanguage = newLang;
      document.documentElement.lang = newLang;

      this.requestUpdate();
      this.dispatchEvent(
        new CustomEvent('language-updated', {
          detail: {language: newLang},
          bubbles: true,
          composed: true,
        })
      );
    } catch (error) {
      console.error('Error changing language:', error);
    }
  }

  render() {
    return html`
      <nav-bar
        .currentLanguage="${this.currentLanguage}"
        @language-change="${this.handleLanguageChange}"
      ></nav-bar>

      <main id="outlet"></main>
    `;
  }
}

customElements.define('app-root', AppRoot);
