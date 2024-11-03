import {LitElement, html, css} from 'lit';
import {router} from './config/router.js';

export class AppRoot extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;

  firstUpdated() {
    const outlet = this.shadowRoot.getElementById('outlet');
    router.setOutlet(outlet);
  }

  render() {
    return html` <main id="outlet"></main> `;
  }
}

customElements.define('app-root', AppRoot);
