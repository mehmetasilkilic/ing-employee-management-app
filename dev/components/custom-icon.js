import {LitElement, html, css} from 'lit';

export class CustomIcon extends LitElement {
  static properties = {
    icon: {type: String},
    size: {type: String},
  };

  constructor() {
    super();
    this.icon = 'home';
    this.size = '24px';
  }

  static styles = css`
    @import url('https://fonts.googleapis.com/icon?family=Material+Icons');

    :host {
      display: inline-block;
    }

    .custom-icons {
      font-family: 'Material Icons';
      font-weight: normal;
      font-style: normal;
      font-size: var(--icon-size, 24px);
      display: inline-block;
      line-height: 1;
      text-transform: none;
      letter-spacing: normal;
      word-wrap: normal;
      white-space: nowrap;
      direction: ltr;
      transition: color 0.3s ease;
      color: currentColor;
    }
  `;

  willUpdate(changedProperties) {
    if (changedProperties.has('size')) {
      this.style.setProperty('--icon-size', this.size || '24px');
    }
  }

  render() {
    return html`<span class="custom-icons">${this.icon}</span>`;
  }
}

customElements.define('custom-icon', CustomIcon);
