import {LitElement, html, css} from 'lit';

export class UserList extends LitElement {
  static styles = css`
    h1 {
      color: #333;
    }
  `;

  render() {
    return html` <h1>UserList</h1> `;
  }
}

customElements.define('user-list', UserList);
