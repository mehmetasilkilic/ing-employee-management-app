import {LitElement, html, css} from 'lit';

import './components/logo.js';
import './components/navigation.js';
import './components/language-selector.js';

export class NavBar extends LitElement {
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
    }

    .right-section {
      display: flex;
      align-items: center;
    }
  `;

  handleLanguageChange(e) {
    console.log('Language', e.detail.language);
  }

  render() {
    return html`
      <nav class="navbar">
        <nav-logo></nav-logo>

        <div class="right-section">
          <nav-buttons></nav-buttons>

          <language-selector
            @language-change="${this.handleLanguageChange}"
          ></language-selector>
        </div>
      </nav>
    `;
  }
}

customElements.define('nav-bar', NavBar);
