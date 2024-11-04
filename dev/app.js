import {LitElement, html, css} from 'lit';

import {router, routes} from './config/router.js';

import './components/nav-bar/index.js';

export class AppRoot extends LitElement {
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

  firstUpdated() {
    const outlet = this.shadowRoot.getElementById('outlet');
    router.setOutlet(outlet);
    router.setRoutes(routes);
  }

  handleLanguageChange(e) {
    console.log('Language changed to:', e.detail.language);
  }

  render() {
    return html`
      <nav-bar @language-change="${this.handleLanguageChange}"></nav-bar>

      <main id="outlet"></main>
    `;
  }
}

customElements.define('app-root', AppRoot);
