import {LitElement, html, css} from 'lit';

import {employeeSchema} from '../config/forms/add-edit-employee/validation.js';
import {employeeFormFields} from '../config/forms/add-edit-employee/fields.js';

import '../components/form-builder.js';

export class AddEmployeePage extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    h1 {
      color: #333;
    }

    .form-container {
      background: white;
      padding: 2rem;
    }
  `;

  handleFormSubmit(e) {
    console.log('Form submitted:', e.detail);
    // Handle the form submission
  }

  render() {
    return html`
      <div class="page-container">
        <h1>Add New Employee</h1>

        <div class="form-container">
          <form-builder
            .schema=${employeeSchema}
            .formFields=${employeeFormFields}
            @form-submit=${this.handleFormSubmit}
          ></form-builder>
        </div>
      </div>
    `;
  }
}

customElements.define('add-employee-page', AddEmployeePage);
