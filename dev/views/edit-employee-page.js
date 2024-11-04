import {LitElement, html, css} from 'lit';
import {Router} from '@vaadin/router';

import {employeeSchema} from '../config/forms/add-edit-employee/validation.js';
import {employeeFormFields} from '../config/forms/add-edit-employee/fields.js';

import '../components/form-builder.js';
import '../components/custom-icon.js';

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

    .title {
      color: var(--primary-color);
      margin: 0;
      font-size: 1.5rem;
    }

    .top-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
    }

    .go-back {
      display: flex;
      align-items: center;
      background: none;
      color: var(--primary-color);
      border: none;
      cursor: pointer;
      transition: background-color 0.2s, transform 0.1s;
      font-weight: 500;
    }

    .go-back:hover {
      color: var(--hover-primary);
      transform: translateY(-1px);
    }

    .go-back:active {
      transform: translateY(0);
    }

    .empty-state {
      background: white;
      padding: 2rem;
      text-align: center;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .empty-state h3 {
      color: #666;
      margin-bottom: 1rem;
    }
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
    Router.go('/');
  }

  handleGoBack() {
    Router.go('/');
  }

  renderContent() {
    if (!this.employeeData) {
      return html`
        <div class="empty-state">
          <h3>No employee data available</h3>
        </div>
      `;
    }

    return html`
      <div class="form-container">
        <form-builder
          .schema=${employeeSchema}
          .formFields=${employeeFormFields}
          .initialData=${this.employeeData}
          @form-submit=${this.handleFormSubmit}
        ></form-builder>
      </div>
    `;
  }

  render() {
    return html`
      <div class="page-container">
        <div class="top-section">
          <h2 class="title">Edit Employee</h2>
          <button class="go-back" @click=${this.handleGoBack}>
            <custom-icon icon="arrow_back_ios" size="14px"></custom-icon>
            Go Back
          </button>
        </div>
        ${this.renderContent()}
      </div>
    `;
  }
}

customElements.define('edit-employee-page', EditEmployeePage);
