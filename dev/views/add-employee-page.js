import {LitElement, html, css} from 'lit';

import {i18nMixin} from '../localization/i18n.js';

import {createEmployeeSchema} from '../config/forms/add-edit-employee/validation.js';
import {getEmployeeFormFields} from '../config/forms/add-edit-employee/fields.js';

import '../components/form-builder.js';

export class AddEmployeePage extends i18nMixin(LitElement) {
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
    const formFields = getEmployeeFormFields(this.t.bind(this));

    return html`
      <div class="page-container">
        <div class="top-section">
          <h2 class="title">${this.t('addEmployee.title')}</h2>
        </div>

        <div class="form-container">
          <form-builder
            .schema=${createEmployeeSchema()}
            .formFields=${formFields}
            @form-submit=${this.handleFormSubmit}
          ></form-builder>
        </div>
      </div>
    `;
  }
}

customElements.define('add-employee-page', AddEmployeePage);
