import {LitElement, html, css} from 'lit';
import {Router} from '@vaadin/router';

import {i18nMixin} from '../localization/i18n.js';
import employeeService from '../../mockApi/service.js';

import {confirmationStore} from '../stores/confirmation-store.js';

import '../components/custom-table.js';
import '../components/custom-list.js';
import '../components/custom-icon.js';
import '../components/action-buttons.js';

export class EmployeesPage extends i18nMixin(LitElement) {
  static properties = {
    employees: {type: Array, state: true},
    loading: {type: Boolean, state: true},
    selectedEmployees: {type: Array, state: true},
    viewMode: {type: String, state: true},
    currentPage: {type: Number, state: true},
    totalItems: {type: Number, state: true},
    pageSize: {type: Number},
  };

  static styles = css`
    :host {
      display: block;
    }

    .table-container {
      padding: 0 2rem;
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

    .view-toggle {
      display: flex;
      gap: 0.5rem;
    }

    .view-toggle button {
      color: var(--disabled-primary);
      cursor: pointer;
      background: none;
      border: none;
      padding: 0;
    }

    .view-toggle button.active {
      color: var(--primary-color);
      cursor: default;
    }

    .view-toggle button:hover:not(.active) {
      color: var(--hover-primary);
    }

    @media (max-width: 768px) {
      .table-container {
        padding: 0 1rem;
      }
    }
  `;

  constructor() {
    super();
    this.employees = [];
    this.loading = true;
    this.selectedEmployees = [];
    this.viewMode = 'table';
    this.currentPage = 1;
    this.totalItems = 0;
    this.pageSize = 12;

    // Listen for storage events to handle updates from other tabs
    window.addEventListener('storage', (e) => {
      if (e.key === 'employees') {
        this.fetchEmployees(this.currentPage, true);
      }
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadInitialData();
  }

  firstUpdated() {
    this.addEventListener('error', (e) => {
      console.error('Error in employees-page:', e.detail);
    });
  }

  async loadInitialData() {
    await this.fetchEmployees(this.currentPage, true);
  }

  async fetchEmployees(page = this.currentPage, forceRefresh = false) {
    this.loading = true;

    try {
      const result = await employeeService.getEmployees({
        page,
        pageSize: this.pageSize,
        forceRefresh,
      });

      if (this.isConnected) {
        this.employees = result.data;
        this.totalItems = result.metadata.totalItems;
        this.currentPage = result.metadata.currentPage;
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      this.dispatchEvent(
        new CustomEvent('error', {
          detail: {
            message: 'Failed to fetch employees',
            error,
          },
        })
      );
    } finally {
      if (this.isConnected) {
        this.loading = false;
        this.requestUpdate();
      }
    }
  }

  async handleEdit(employee) {
    sessionStorage.setItem('editEmployee', JSON.stringify(employee));
    Router.go(`/edit-employee/${employee.id}`);
  }

  async handleDelete(employee) {
    try {
      const confirmed = await confirmationStore.getState().show({
        title: this.t('common.areYouSure'),
        message: this.t('employees.deleteConfirmation', {
          name: `${employee.firstName} ${employee.lastName}`,
        }),
        confirmLabel: this.t('common.proceed'),
        cancelLabel: this.t('common.cancel'),
      });

      if (confirmed) {
        await employeeService.deleteEmployee(employee.id);

        // Show success confirmation
        await confirmationStore.getState().show({
          title: this.t('common.success'),
          message: this.t('employees.deleteSuccess', {
            name: `${employee.firstName} ${employee.lastName}`,
          }),
          confirmLabel: this.t('common.ok'),
          cancelLabel: null,
        });

        // Handle pagination
        if (this.employees.length === 1 && this.currentPage > 1) {
          await this.fetchEmployees(this.currentPage - 1, true);
        } else {
          await this.fetchEmployees(this.currentPage, true);
        }
      }
    } catch (error) {
      console.error('Error deleting employee:', error);

      await confirmationStore.getState().show({
        title: this.t('common.error'),
        message: this.t('employees.deleteError', {
          name: `${employee.firstName} ${employee.lastName}`,
          error: error.message,
        }),
        confirmLabel: this.t('common.ok'),
        cancelLabel: null,
      });
    }
  }

  async handlePageChange(e) {
    if (this.loading) return;

    const newPage = e.detail.page;
    if (newPage === this.currentPage) return;

    try {
      this.currentPage = newPage;
      await this.fetchEmployees(newPage, true);
    } catch (error) {
      console.error('Error changing page:', error);
      this.currentPage = e.detail.previousPage;
      this.requestUpdate();
    }
  }

  handleSelectionChange(e) {
    this.selectedEmployees = e.detail.selectedItems;
  }

  setViewMode(mode) {
    this.viewMode = mode;
  }

  get tableColumns() {
    const departmentMap = {1: 'Analytics', 2: 'Tech'};
    const positionMap = {1: 'Junior', 2: 'Medior', 3: 'Senior'};

    return [
      {header: 'First Name', field: 'firstName'},
      {header: 'Last Name', field: 'lastName'},
      {header: 'Date of Employment', field: 'dateOfEmployment'},
      {header: 'Date of Birth', field: 'dateOfBirth'},
      {header: 'Phone', field: 'phone'},
      {header: 'Email', field: 'email'},
      {
        header: 'Department',
        template: (employee) => departmentMap[employee.department] || '-',
      },
      {
        header: 'Position',
        template: (employee) => positionMap[employee.position] || '-',
      },
      {
        header: 'Actions',
        style: {width: '120px'},
        component: (employee) => html`
          <action-buttons
            .item=${employee}
            .actions=${[
              {
                type: 'edit',
                icon: 'edit',
                label: 'Edit employee',
                event: 'edit',
              },
              {
                type: 'delete',
                icon: 'delete',
                label: 'Delete employee',
                event: 'delete',
              },
            ]}
            @edit=${(e) => this.handleEdit(e.detail.item)}
            @delete=${(e) => this.handleDelete(e.detail.item)}
          ></action-buttons>
        `,
      },
    ];
  }

  render() {
    if (this.loading && !this.employees.length) {
      return html`
        <div class="container">
          <div class="top-section">
            <h2 class="title">${this.t('employees.title')}</h2>
          </div>
          <div class="table-container">
            <div>Loading...</div>
          </div>
        </div>
      `;
    }

    return html`
      <div class="container">
        <div class="top-section">
          <h2 class="title">${this.t('employees.title')}</h2>
          <div class="view-toggle">
            <button
              class=${this.viewMode === 'table' ? 'active' : ''}
              @click=${() => this.setViewMode('table')}
              ?disabled=${this.loading}
            >
              <custom-icon icon="reorder" size="36px"></custom-icon>
            </button>
            <button
              class=${this.viewMode === 'list' ? 'active' : ''}
              @click=${() => this.setViewMode('list')}
              ?disabled=${this.loading}
            >
              <custom-icon icon="apps" size="36px"></custom-icon>
            </button>
          </div>
        </div>

        <div class="table-container">
          ${this.viewMode === 'table'
            ? html`
                <custom-table
                  .columns=${this.tableColumns}
                  .data=${this.employees}
                  maxHeight=${'70vh'}
                  .pageSize=${this.pageSize}
                  .totalItems=${this.totalItems}
                  .currentPage=${this.currentPage}
                  .selectedItems=${this.selectedEmployees}
                  ?disabled=${this.loading}
                  @page-change=${this.handlePageChange}
                  @selection-change=${this.handleSelectionChange}
                ></custom-table>
              `
            : html`
                <custom-list
                  .columns=${this.tableColumns}
                  .data=${this.employees}
                  maxHeight=${'64.7vh'}
                  .pageSize=${this.pageSize}
                  .totalItems=${this.totalItems}
                  .currentPage=${this.currentPage}
                  .selectedItems=${this.selectedEmployees}
                  ?disabled=${this.loading}
                  @page-change=${this.handlePageChange}
                  @selection-change=${this.handleSelectionChange}
                ></custom-list>
              `}
        </div>
      </div>
    `;
  }
}

customElements.define('employees-page', EmployeesPage);
