import {LitElement, html, css} from 'lit';
import {Router} from '@vaadin/router';

import '../components/custom-table.js';
import '../components/custom-list.js';
import '../components/custom-icon.js';
import '../components/action-buttons.js';

export class EmployeesPage extends LitElement {
  static properties = {
    employees: {type: Array},
    loading: {type: Boolean},
    selectedEmployees: {type: Array},
    viewMode: {type: String},
  };

  static styles = css`
    :host {
      display: block;
    }

    .container {
      color: var(--bg);
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
  `;

  constructor() {
    super();
    this.employees = [];
    this.loading = true;
    this.selectedEmployees = [];
    this.viewMode = 'table';
    this.fetchEmployees();
  }

  async fetchEmployees() {
    this.employees = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        dateOfEmployment: '2023-01-15',
        dateOfBirth: '1999-01-15',
        phone: '+90 555 555 55 55',
        email: 'john@example.com',
        department: 1,
        position: 1,
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfEmployment: '2023-01-15',
        dateOfBirth: '1999-01-15',
        phone: '+90 555 555 55 55',
        email: 'jane@example.com',
        department: 2,
        position: 2,
      },
    ];

    this.loading = false;
  }

  handleEdit(employee) {
    sessionStorage.setItem('editEmployee', JSON.stringify(employee));
    Router.go(`/edit-employee/${employee.id}`);
  }

  handleDelete(employee) {
    console.log('Delete employee:', employee);
    // Implement delete logic
  }

  handlePageChange(e) {
    console.log('Page changed:', e.detail.page);
    // Implement page change logic
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
    if (this.loading) {
      return html`<div>Loading...</div>`;
    }

    return html`
      <div classname="container">
        <div class="top-section">
          <h2 class="title">Employees</h2>
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
                .pageSize=${12}
                .totalItems=${100}
                .selectedItems=${this.selectedEmployees}
                @page-change=${this.handlePageChange}
                @selection-change=${this.handleSelectionChange}
              ></custom-table>`
            : html` <custom-list
                .columns=${this.tableColumns}
                .data=${this.employees}
                maxHeight=${'29rem'}
                .pageSize=${12}
                .totalItems=${100}
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
