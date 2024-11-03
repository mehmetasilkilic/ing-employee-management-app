import {LitElement, html, css} from 'lit';

export class EmployeesPage extends LitElement {
  static styles = css`
    h1 {
      color: #333;
    }
  `;

  render() {
    return html` <h1>EmployeesPage</h1> `;
  }
}

customElements.define('employees-page', EmployeesPage);
