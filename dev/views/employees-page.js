import {LitElement, html, css} from 'lit';

import '../components/custom-table/index.js';
import '../components/custom-icon.js';
import '../components/action-buttons.js';

export class EmployeesPage extends LitElement {
  static properties = {
    employees: {type: Array},
    loading: {type: Boolean},
    selectedEmployees: {type: Array},
  };

  static styles = css`
    :host {
      display: block;
    }

    h1 {
      color: #333;
    }
  `;

  constructor() {
    super();
    this.employees = [];
    this.loading = true;
    this.selectedEmployees = [];
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
        department: 'Engineering',
        position: 'Junior',
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfEmployment: '2023-01-15',
        dateOfBirth: '1999-01-15',
        phone: '+90 555 555 55 55',
        email: 'jane@example.com',
        department: 'Product',
        position: 'Senior',
      },
    ];

    this.loading = false;
  }

  handleEdit(employee) {
    console.log('Edit employee:', employee);
    // Implement edit logic
  }

  handleDelete(employee) {
    console.log('Delete employee:', employee);
    // Implement delete logic
  }

  handlePageChange(e) {
    console.log('Page changed:', e.detail.page);
    // Implement page change logic (e.g., fetch new data from server)
  }

  handleSelectionChange(e) {
    this.selectedEmployees = e.detail.selectedItems;
  }

  get tableColumns() {
    return [
      {
        header: 'First Name',
        field: 'firstName',
      },
      {
        header: 'Last Name',
        field: 'lastName',
      },
      {
        header: 'Date of Employment',
        field: 'dateOfEmployment',
      },
      {
        header: 'Date of Birth',
        field: 'dateOfBirth',
      },
      {
        header: 'Phone',
        field: 'phone',
      },
      {
        header: 'Email',
        field: 'email',
      },
      {
        header: 'Department',
        field: 'department',
      },
      {
        header: 'Position',
        field: 'position',
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
      <h1>Employees</h1>

      <custom-table
        .columns=${this.tableColumns}
        .data=${this.employees}
        .pageSize=${10}
        .totalItems=${100}
        .selectedItems=${this.selectedEmployees}
        @page-change=${this.handlePageChange}
        @selection-change=${this.handleSelectionChange}
      ></custom-table>
    `;
  }
}

customElements.define('employees-page', EmployeesPage);
