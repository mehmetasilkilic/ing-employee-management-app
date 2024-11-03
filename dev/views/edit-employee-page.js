import {LitElement, html, css} from 'lit';

export class EditEmployeePage extends LitElement {
  static styles = css`
    h1 {
      color: #333;
    }
  `;

  render() {
    return html` <h1>EditEmployeePage</h1> `;
  }
}

customElements.define('edit-employee-page', EditEmployeePage);
