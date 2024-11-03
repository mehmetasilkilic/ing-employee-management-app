import {LitElement, html, css} from 'lit';

export class Logo extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .left-section {
      display: flex;
      align-items: center;
      gap: 1rem;
      text-decoration: none;
    }

    .logo-image {
      width: 24px;
      height: 24px;
      object-fit: cover;
    }

    .company-name {
      font-size: 1rem;
      font-weight: bold;
      color: #333;
    }
  `;

  render() {
    return html`
      <a href="/" class="left-section">
        <img
          src="../../../../assets/images/ing-logo.jpg"
          alt="ING logo"
          class="logo-image"
        />

        <span class="company-name">ING</span>
      </a>
    `;
  }
}

customElements.define('nav-logo', Logo);
