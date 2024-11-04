import {LitElement, html, css} from 'lit';
import {Router} from '@vaadin/router';

import {i18nMixin} from '../localization/i18n.js';

import employeeService from '../../mockApi/service.js';

import '../components/custom-table.js';
import '../components/custom-list.js';
import '../components/custom-icon.js';
import '../components/action-buttons.js';

export class EmployeesPage extends i18nMixin(LitElement) {
  static properties = {
    employees: {type: Array},
    loading: {type: Boolean},
    selectedEmployees: {type: Array},
    viewMode: {type: String},
    currentPage: {type: Number},
    totalItems: {type: Number},
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
    this.fetchEmployees();
  }

  async fetchEmployees(page = this.currentPage) {
    this.loading = true;
    try {
      const result = await employeeService.getEmployees({
        page,
        pageSize: this.pageSize,
      });
      this.employees = result.data;
      this.totalItems = result.metadata.totalItems;
      this.currentPage = result.metadata.currentPage;
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      this.loading = false;
    }
  }

  async handleEdit(employee) {
    sessionStorage.setItem('editEmployee', JSON.stringify(employee));
    Router.go(`/edit-employee/${employee.id}`);
  }

  async handleDelete(employee) {
    const confirmDelete = confirm(
      this.t('employees.deleteConfirmation', {
        name: `${employee.firstName} ${employee.lastName}`,
      })
    );

    if (confirmDelete) {
      try {
        await employeeService.deleteEmployee(employee.id);
        // If we're on a page with only one item and it's not the first page,
        // go to the previous page after deletion
        if (this.employees.length === 1 && this.currentPage > 1) {
          await this.fetchEmployees(this.currentPage - 1);
        } else {
          await this.fetchEmployees(this.currentPage);
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert(this.t('employees.deleteError'));
      }
    }
  }

  async handlePageChange(e) {
    const newPage = e.detail.page;
    this.currentPage = newPage;
    await this.fetchEmployees(newPage);
  }

  handleSelectionChange(e) {
    this.selectedEmployees = e.detail.selectedItems;
  }

  setViewMode(mode) {
    this.viewMode = mode;
  }

  get tableColumns() {
    const departmentMap = {1: 'Analytics', 2: 'Tech', 3: 'HR', 4: 'Finance'};
    const positionMap = {1: 'Junior', 2: 'Medior', 3: 'Senior', 4: 'Lead'};

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
    if (this.loading) {
      return html`<div>Loading...</div>`;
    }

    return html`
      <div class="container">
        <div class="top-section">
          <h2 class="title">${this.t('employees.title')}</h2>

          <div class="view-toggle">
            <button
              class=${this.viewMode === 'table' ? 'active' : ''}
              @click=${() => this.setViewMode('table')}
            >
              <custom-icon icon="reorder" size="36px"></custom-icon>
            </button>

            <button
              class=${this.viewMode === 'list' ? 'active' : ''}
              @click=${() => this.setViewMode('list')}
            >
              <custom-icon icon="apps" size="36px"></custom-icon>
            </button>
          </div>
        </div>

        <div class="table-container">
          ${this.viewMode === 'table'
            ? html` <custom-table
                .columns=${this.tableColumns}
                .data=${this.employees}
                maxHeight=${'28rem'}
                .pageSize=${this.pageSize}
                .totalItems=${this.totalItems}
                .currentPage=${this.currentPage}
                .selectedItems=${this.selectedEmployees}
                @page-change=${this.handlePageChange}
                @selection-change=${this.handleSelectionChange}
              ></custom-table>`
            : html` <custom-list
                .columns=${this.tableColumns}
                .data=${this.employees}
                maxHeight=${'29rem'}
                .pageSize=${this.pageSize}
                .totalItems=${this.totalItems}
                .currentPage=${this.currentPage}
                .selectedItems=${this.selectedEmployees}
                @page-change=${this.handlePageChange}
                @selection-change=${this.handleSelectionChange}
              ></custom-list>`}
        </div>
      </div>
    `;
  }
}

customElements.define('employees-page', EmployeesPage);
