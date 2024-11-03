import {LitElement, html, css} from 'lit';

export class AddEmployeePage extends LitElement {
  static styles = css`
    h1 {
      color: #333;
    }
  `;

  render() {
    return html` <h1>AddEmployeePage</h1> `;
  }
}

customElements.define('add-employee-page', AddEmployeePage);
