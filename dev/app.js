import {LitElement, html, css} from 'lit';
import {i18nMixin} from './localization/i18n.js';
import {router, routes} from './config/router.js';
import {languageStore} from './stores/language-store';

import './components/nav-bar/index.js';
import './components/confirmation-dialog.js';

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
    currentLanguage: {type: String, reflect: true},
  };

  constructor() {
    super();
    this.currentLanguage = languageStore.getState().language;

    this.unsubscribe = languageStore.subscribe((state) => {
      this.currentLanguage = state.language;
      this.requestUpdate();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unsubscribe?.();
  }

  firstUpdated() {
    const outlet = this.shadowRoot.getElementById('outlet');
    router.setOutlet(outlet);
    router.setRoutes(routes);
  }

  async handleLanguageChange(e) {
    const success = await languageStore
      .getState()
      .setLanguage(e.detail.language);
    if (!success) {
      console.error('Failed to change language');
    }
  }

  render() {
    return html`
      <confirmation-dialog></confirmation-dialog>

      <nav-bar
        .currentLanguage="${this.currentLanguage}"
        @language-change="${this.handleLanguageChange}"
      ></nav-bar>

      <main id="outlet"></main>
    `;
  }
}

customElements.define('app-root', AppRoot);
