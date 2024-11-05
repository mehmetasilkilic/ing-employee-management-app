import {LitElement, html, css} from 'lit';
import {Router} from '@vaadin/router';

import {i18nMixin} from '../localization/i18n.js';

import employeeService from '../../mockApi/service.js';

import {confirmationStore} from '../stores/confirmation-store.js';

import {createEmployeeSchema} from '../config/forms/add-edit-employee/validation.js';
import {getEmployeeFormFields} from '../config/forms/add-edit-employee/fields.js';

import '../components/form-builder.js';

export class AddEmployeePage extends i18nMixin(LitElement) {
  static properties = {
    loading: {type: Boolean},
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
      position: relative;
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

    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1;
    }
  `;

  constructor() {
    super();
    this.loading = false;
  }

  async handleFormSubmit(e) {
    try {
      this.loading = true;
      const formData = e.detail;

      const confirmed = await confirmationStore.getState().show({
        title: this.t('common.areYouSure'),
        message: this.t('addEmployee.saveConfirmation', {
          employeeName: `${formData.firstName} ${formData.lastName}`,
        }),
        confirmLabel: this.t('common.proceed'),
        cancelLabel: this.t('common.cancel'),
      });

      if (confirmed) {
        await employeeService.addEmployee(formData);

        await confirmationStore.getState().show({
          title: this.t('common.success'),
          message: this.t('addEmployee.saveSuccess', {
            employeeName: `${formData.firstName} ${formData.lastName}`,
          }),
          confirmLabel: this.t('common.ok'),
          cancelLabel: null,
        });

        Router.go('/');
      }
    } catch (error) {
      console.error('Error adding employee:', error);

      await confirmationStore.getState().show({
        title: this.t('common.error'),
        message: this.t('addEmployee.saveError'),
        confirmLabel: this.t('common.ok'),
        cancelLabel: null,
      });
    } finally {
      this.loading = false;
    }
  }

  render() {
    const formFields = getEmployeeFormFields(this.t.bind(this));

    return html`
      <div class="page-container">
        <div class="top-section">
          <h2 class="title">${this.t('addEmployee.title')}</h2>
        </div>

        <div class="form-container">
          ${this.loading
            ? html`
                <div class="loading-overlay">${this.t('common.loading')}</div>
              `
            : ''}

          <form-builder
            .schema=${createEmployeeSchema()}
            .formFields=${formFields}
            .disabled=${this.loading}
            @form-submit=${this.handleFormSubmit}
          ></form-builder>
        </div>
      </div>
    `;
  }
}

customElements.define('add-employee-page', AddEmployeePage);
