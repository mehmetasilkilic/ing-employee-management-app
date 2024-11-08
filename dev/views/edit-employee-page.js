import {LitElement, html, css} from 'lit';
import {Router} from '@vaadin/router';

import {i18nMixin} from '../localization/i18n.js';

import employeeService from '../../mockApi/service.js';

import {confirmationStore} from '../stores/confirmation-store.js';
import {employeeStore} from '../stores/employee-store.js';

import {createEmployeeSchema} from '../config/forms/add-edit-employee/validation.js';
import {getEmployeeFormFields} from '../config/forms/add-edit-employee/fields.js';

import '../components/form-builder.js';
import '../components/custom-icon.js';

export class EditEmployeePage extends i18nMixin(LitElement) {
  static properties = {
    employeeId: {type: String},
    employeeData: {type: Object, state: true},
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
    this._handleEmployeeUpdate = this.handleEmployeeUpdate.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadEmployeeData();
    window.addEventListener('employee-updated', this._handleEmployeeUpdate);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('employee-updated', this._handleEmployeeUpdate);
    employeeStore.getState().clearEditingEmployee();
  }

  handleEmployeeUpdate(event) {
    this.employeeData = event.detail.employee;
  }

  loadEmployeeData() {
    const state = employeeStore.getState();
    this.employeeData = state.editingEmployee;
  }

  async handleFormSubmit(e) {
    try {
      const formData = e.detail;
      const employeeName = `${this.employeeData.firstName} ${this.employeeData.lastName}`;

      const confirmed = await confirmationStore.getState().show({
        title: this.t('common.areYouSure'),
        message: this.t('editEmployee.saveConfirmation', {
          employeeName: employeeName,
        }),
        confirmLabel: this.t('common.proceed'),
        cancelLabel: this.t('common.cancel'),
      });

      if (confirmed) {
        await employeeService.updateEmployee(this.employeeData.id, formData);
        employeeStore.getState().clearEditingEmployee();

        await confirmationStore.getState().show({
          title: this.t('common.success'),
          message: this.t('editEmployee.saveSuccess', {
            employeeName: employeeName,
          }),
          confirmLabel: this.t('common.ok'),
          cancelLabel: null,
        });

        Router.go('/');
      }
    } catch (error) {
      console.error('Error updating employee:', error);

      await confirmationStore.getState().show({
        title: this.t('common.error'),
        message: this.t('editEmployee.saveError'),
        confirmLabel: this.t('common.ok'),
        cancelLabel: null,
      });
    }
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

    const formFields = getEmployeeFormFields(this.t.bind(this));

    return html`
      <div class="form-container">
        <form-builder
          .schema=${createEmployeeSchema()}
          .formFields=${formFields}
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
