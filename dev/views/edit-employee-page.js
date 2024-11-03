import {LitElement, html, css} from 'lit';
import {Router} from '@vaadin/router';

import {employeeSchema} from '../config/forms/add-edit-employee/validation.js';
import {employeeFormFields} from '../config/forms/add-edit-employee/fields.js';

import '../components/form-builder.js';

export class EditEmployeePage extends LitElement {
  static properties = {
    employeeId: {type: String},
    employeeData: {type: Object},
  };

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

    /* 
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1rem;
    }

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .cancel {
      background-color: #6c757d;
      color: white;
    } */
  `;

  constructor() {
    super();
    this.employeeId = '';
    this.employeeData = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadEmployeeData();
  }

  loadEmployeeData() {
    const storedEmployee = sessionStorage.getItem('editEmployee');
    if (storedEmployee) {
      const employee = JSON.parse(storedEmployee);
      this.employeeData = {
        ...employee,
        dateOfBirth: this.formatDateForInput(employee.dateOfBirth),
        dateOfEmployment: this.formatDateForInput(employee.dateOfEmployment),
      };

      sessionStorage.removeItem('editEmployee');
    }
  }

  formatDateForInput(dateString) {
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (err) {
      console.error('Error formatting date:', err);
      return '';
    }
  }

  handleFormSubmit(e) {
    console.log('Updated employee data:', e.detail);

    Router.go('/employees');
  }

  handleCancel() {
    Router.go('/employees');
  }

  render() {
    if (!this.employeeData) {
      return html`<div>No employee data available</div>`;
    }

    return html`
      <div class="page-container">
        <h1>Edit Employee</h1>

        <div class="form-container">
          <form-builder
            .schema=${employeeSchema}
            .formFields=${employeeFormFields}
            .initialData=${this.employeeData}
            @form-submit=${this.handleFormSubmit}
          ></form-builder>

          <!-- <div class="actions">
            <button class="cancel" @click=${this.handleCancel}>Cancel</button>
          </div> -->
        </div>
      </div>
    `;
  }
}

customElements.define('edit-employee-page', EditEmployeePage);
