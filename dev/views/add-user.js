import {LitElement, html, css} from 'lit';

export class AddUser extends LitElement {
  static styles = css`
    h1 {
      color: #333;
    }
  `;

  render() {
    return html` <h1>AddUser</h1> `;
  }
}

customElements.define('add-user', AddUser);
