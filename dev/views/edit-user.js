import {LitElement, html, css} from 'lit';

export class EditUser extends LitElement {
  static styles = css`
    h1 {
      color: #333;
    }
  `;

  render() {
    return html` <h1>EditUser</h1> `;
  }
}

customElements.define('edit-user', EditUser);
