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
    searchTerm: {type: String, state: true},
    _searchInputValue: {type: String, state: true},
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
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 2rem;
      padding: 1rem 2rem;
    }

    .controls-section {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .search-container {
      position: relative;
      width: 280px;
    }

    .search-input {
      width: 100%;
      padding: 0.5rem 0.75rem 0.5rem 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      font-size: 1rem;
    }

    .search-icon {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      color: var(--disabled-primary);
      cursor: pointer;
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

      .top-section {
        grid-template-columns: 1fr;
        gap: 1rem;
        padding: 1rem;
      }

      .controls-section {
        order: 2;
      }

      .title {
        order: 1;
      }

      .view-toggle {
        order: 3;
        justify-content: center;
      }

      .search-container {
        width: 100%;
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
    this.searchTerm = '';
    this._searchInputValue = '';

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
        searchTerm: this.searchTerm,
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
    const employeeName = `${employee.firstName} ${employee.lastName}`;
    try {
      const confirmed = await confirmationStore.getState().show({
        title: this.t('common.areYouSure'),
        message: this.t('employees.deleteConfirmation', {
          employeeName: employeeName,
        }),
        confirmLabel: this.t('common.proceed'),
        cancelLabel: this.t('common.cancel'),
      });

      if (confirmed) {
        await employeeService.deleteEmployee(employee.id);

        await confirmationStore.getState().show({
          title: this.t('common.success'),
          message: this.t('employees.deleteSuccess', {
            employeeName: employeeName,
          }),
          confirmLabel: this.t('common.ok'),
          cancelLabel: null,
        });

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
          employeeName: employeeName,
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

  handleSearchInput(e) {
    this._searchInputValue = e.target.value;
  }

  async handleSearchSubmit(e) {
    if (e.type === 'click' || (e.type === 'keydown' && e.key === 'Enter')) {
      e.preventDefault();
      if (this.loading) return;

      this.searchTerm = this._searchInputValue;
      this.currentPage = 1;
      await this.fetchEmployees(1, false);
    }
  }

  setViewMode(mode) {
    this.viewMode = mode;
  }

  get tableColumns() {
    const departmentMap = {
      1: this.t('forms.departments.analytics'),
      2: this.t('forms.departments.tech'),
    };

    const positionMap = {
      1: this.t('forms.positions.junior'),
      2: this.t('forms.positions.medior'),
      3: this.t('forms.positions.senior'),
    };

    return [
      {
        header: this.t('forms.employeeForm.firstName.label'),
        field: 'firstName',
      },
      {
        header: this.t('forms.employeeForm.lastName.label'),
        field: 'lastName',
      },
      {
        header: this.t('forms.employeeForm.dateOfEmployment.label'),
        field: 'dateOfEmployment',
      },
      {
        header: this.t('forms.employeeForm.dateOfBirth.label'),
        field: 'dateOfBirth',
      },
      {
        header: this.t('forms.employeeForm.phone.label'),
        field: 'phone',
      },
      {
        header: this.t('forms.employeeForm.email.label'),
        field: 'email',
      },
      {
        header: this.t('forms.employeeForm.department.label'),
        template: (employee) => departmentMap[employee.department] || '-',
      },
      {
        header: this.t('forms.employeeForm.position.label'),
        template: (employee) => positionMap[employee.position] || '-',
      },
      {
        header: this.t('common.actions'),
        style: {width: '120px'},
        component: (employee) => html`
          <action-buttons
            .item=${employee}
            .actions=${[
              {
                type: 'edit',
                icon: 'edit',
                label: 'Edit Employee',
                event: 'edit',
              },
              {
                type: 'delete',
                icon: 'delete',
                label: 'Add Employee',
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
    return html`
      <div class="container">
        <div class="top-section">
          <h2 class="title">${this.t('employees.title')}</h2>

          <div class="controls-section">
            <div class="search-container">
              <input
                type="text"
                class="search-input"
                placeholder="${this.t('employees.search')}"
                .value=${this._searchInputValue}
                @input=${this.handleSearchInput}
                @keydown=${this.handleSearchSubmit}
                ?disabled=${this.loading}
              />

              <custom-icon
                class="search-icon"
                icon="search"
                size="20px"
                @click=${this.handleSearchSubmit}
              ></custom-icon>
            </div>
          </div>

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
                  .loading=${this.loading}
                  maxHeight=${'70vh'}
                  .pageSize=${this.pageSize}
                  .totalItems=${this.totalItems}
                  .currentPage=${this.currentPage}
                  .selectedItems=${this.selectedEmployees}
                  @page-change=${this.handlePageChange}
                  @selection-change=${this.handleSelectionChange}
                ></custom-table>
              `
            : html`
                <custom-list
                  .columns=${this.tableColumns}
                  .data=${this.employees}
                  .loading=${this.loading}
                  maxHeight=${'64.7vh'}
                  .pageSize=${this.pageSize}
                  .totalItems=${this.totalItems}
                  .currentPage=${this.currentPage}
                  .selectedItems=${this.selectedEmployees}
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
