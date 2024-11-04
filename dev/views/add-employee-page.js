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

    .title {
      color: var(--primary-color);
      margin: 0;
    }

    .top-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
    }
  `;

  handleFormSubmit(e) {
    console.log('Form submitted:', e.detail);
    // Handle the form submission
  }

  render() {
    return html`
      <div class="page-container">
        <div class="top-section">
          <h2 class="title">Edit New Employee</h2>
        </div>

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
