import {fixture, assert, aTimeout} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import sinon from 'sinon';
import {Router} from '@vaadin/router';
import {EmployeesPage} from '../dev/views/employees-page.js';
import {confirmationStore} from '../dev/stores/confirmation-store.js';
import {employeeStore} from '../dev/stores/employee-store.js';
import employeeService from '../../mockApi/service.js';

// Mock sample data
const sampleEmployees = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    department: 1,
    position: 2,
    dateOfEmployment: '2023-01-01',
    dateOfBirth: '1990-01-01',
    phone: '1234567890',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    department: 2,
    position: 3,
    dateOfEmployment: '2023-02-01',
    dateOfBirth: '1992-01-01',
    phone: '0987654321',
  },
];

const mockConfirmationState = {
  show: sinon.stub(),
};

const mockEmployeeState = {
  setEditingEmployee: sinon.stub(),
};

suite('employees-page', () => {
  let element;

  setup(async () => {
    sinon.restore();

    sinon.stub(confirmationStore, 'getState').returns(mockConfirmationState);
    sinon.stub(employeeStore, 'getState').returns(mockEmployeeState);
    sinon.stub(Router, 'go');
    sinon.stub(employeeService, 'deleteEmployee').resolves();

    mockConfirmationState.show.reset();
    mockEmployeeState.setEditingEmployee.reset();
    mockConfirmationState.show.resolves(true);

    sinon
      .stub(employeeService, 'getEmployees')
      .callsFake(async ({page = 1, searchTerm = ''}) => ({
        data: searchTerm
          ? sampleEmployees.filter(
              (e) =>
                e.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                e.lastName.toLowerCase().includes(searchTerm.toLowerCase())
            )
          : sampleEmployees,
        metadata: {
          totalItems: 10,
          currentPage: page,
        },
      }));

    element = await fixture(html`<employees-page></employees-page>`);
    await element.updateComplete;
    await aTimeout(0);
  });

  test('is defined', () => {
    const el = document.createElement('employees-page');
    assert.instanceOf(el, EmployeesPage);
  });

  test('renders initial state', async () => {
    assert.exists(element.shadowRoot.querySelector('.container'));
    assert.exists(element.shadowRoot.querySelector('.top-section'));
    assert.exists(element.shadowRoot.querySelector('.search-container'));
    assert.exists(element.shadowRoot.querySelector('.view-toggle'));

    assert.exists(element.shadowRoot.querySelector('custom-table'));
    assert.notExists(element.shadowRoot.querySelector('custom-list'));

    assert.equal(element.viewMode, 'table');
    assert.isFalse(element.loading);
    assert.lengthOf(element.selectedEmployees, 0);
  });

  test('loads initial data on connection', async () => {
    assert.isTrue(employeeService.getEmployees.calledOnce);
    assert.deepEqual(element.employees, sampleEmployees);
    assert.equal(element.totalItems, 10);
    assert.equal(element.currentPage, 1);
  });

  test('handles fetch error', async () => {
    employeeService.getEmployees.rejects(new Error('API Error'));

    const errorListener = sinon.spy();
    element.addEventListener('error', errorListener);

    await element.loadInitialData();

    assert.isTrue(mockConfirmationState.show.called);
    assert.isTrue(errorListener.called);
    assert.isFalse(element.loading);
  });

  test('handles search input and submit', async () => {
    const searchInput = element.shadowRoot.querySelector('.search-input');

    searchInput.value = 'John';
    searchInput.dispatchEvent(new Event('input'));
    assert.equal(element._searchInputValue, 'John');

    const enterEvent = new KeyboardEvent('keydown', {key: 'Enter'});
    await searchInput.dispatchEvent(enterEvent);

    assert.equal(element.searchTerm, 'John');
    assert.equal(element.currentPage, 1);
    assert.isTrue(
      employeeService.getEmployees.calledWith({
        page: 1,
        pageSize: element.pageSize,
        searchTerm: 'John',
        forceRefresh: false,
      })
    );
  });

  test('handles search icon click', async () => {
    const searchIcon = element.shadowRoot.querySelector('.search-icon');
    element._searchInputValue = 'Jane';

    await searchIcon.click();

    assert.equal(element.searchTerm, 'Jane');
    assert.isTrue(employeeService.getEmployees.called);
  });

  test('handles view mode toggle', async () => {
    const gridViewButton = element.shadowRoot.querySelector(
      '.view-toggle button:last-child'
    );
    await gridViewButton.click();
    await element.updateComplete;

    assert.equal(element.viewMode, 'list');
    assert.exists(element.shadowRoot.querySelector('custom-list'));
    assert.notExists(element.shadowRoot.querySelector('custom-table'));
  });

  test('handles edit action', async () => {
    const employee = sampleEmployees[0];
    await element.handleEdit(employee);

    assert.isTrue(mockEmployeeState.setEditingEmployee.calledWith(employee));
    assert.isTrue(Router.go.calledWith(`/edit-employee/${employee.id}`));
  });

  test('handles delete action with confirmation', async () => {
    const employee = sampleEmployees[0];
    mockConfirmationState.show.resolves(true);

    await element.handleDelete(employee);

    assert.isTrue(employeeService.deleteEmployee.calledWith(employee.id));
    assert.equal(mockConfirmationState.show.callCount, 2); // Confirm + Success
    assert.isTrue(employeeService.getEmployees.called);
  });

  test('handles delete cancellation', async () => {
    const employee = sampleEmployees[0];
    mockConfirmationState.show.resolves(false);

    await element.handleDelete(employee);

    assert.isFalse(employeeService.deleteEmployee.called);
    assert.equal(mockConfirmationState.show.callCount, 1);
  });

  test('handles delete error', async () => {
    const employee = sampleEmployees[0];
    employeeService.deleteEmployee.rejects(new Error('Delete Error'));

    await element.handleDelete(employee);

    assert.equal(mockConfirmationState.show.callCount, 2);
    const errorCall = mockConfirmationState.show.lastCall;
    assert.include(errorCall.args[0].title.toLowerCase(), 'error');
  });

  test('handles page change', async () => {
    await element.handlePageChange({detail: {page: 2}});

    assert.equal(element.currentPage, 2);
    const lastCall = employeeService.getEmployees.lastCall;
    assert.exists(lastCall);
    assert.equal(lastCall.args[0].page, 2);
  });

  test('handles selection change', async () => {
    const selectedItems = [sampleEmployees[0]];
    await element.handleSelectionChange({detail: {selectedItems}});

    assert.deepEqual(element.selectedEmployees, selectedItems);
  });

  test('handles storage event', async () => {
    const storageEvent = new StorageEvent('storage', {key: 'employees'});
    window.dispatchEvent(storageEvent);

    assert.isTrue(
      employeeService.getEmployees.calledWith({
        page: element.currentPage,
        pageSize: element.pageSize,
        searchTerm: element.searchTerm,
        forceRefresh: true,
      })
    );
  });

  test('disables controls when loading', async () => {
    element.loading = true;
    await element.updateComplete;

    const searchInput = element.shadowRoot.querySelector('.search-input');
    const viewToggleButtons = element.shadowRoot.querySelectorAll(
      '.view-toggle button'
    );

    assert.isTrue(searchInput.disabled);
    viewToggleButtons.forEach((button) => {
      assert.isTrue(button.disabled);
    });
  });

  test('handles last page deletion correctly', async () => {
    element.currentPage = 2;
    element.employees = [sampleEmployees[0]];

    await element.handleDelete(sampleEmployees[0]);

    const lastCall = employeeService.getEmployees.lastCall;
    assert.equal(lastCall.args[0].page, 1);
  });

  test('verifies table columns structure', async () => {
    await element.updateComplete;
    const columns = element.tableColumns;

    const basicFields = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'dateOfEmployment',
      'dateOfBirth',
    ];
    basicFields.forEach((field) => {
      const column = columns.find((col) => col.field === field);
      assert.exists(column, `${field} column should exist`);
      assert.exists(column.header, `${field} column should have header`);
    });

    const templateFields = ['department', 'position'];
    templateFields.forEach((field) => {
      const column = columns.find((col) =>
        col.header.toLowerCase().includes(field)
      );
      assert.exists(column, `${field} column should exist`);
      assert.isFunction(
        column.template,
        `${field} column should have template`
      );
    });

    const actionsColumn = columns[columns.length - 1];
    assert.exists(actionsColumn);
    assert.exists(actionsColumn.component);
    assert.equal(actionsColumn.style.width, '120px');
  });

  test('verifies action buttons in table', async () => {
    const columns = element.tableColumns;
    const actionsColumn = columns[columns.length - 1];

    const actionTemplate = actionsColumn.component(sampleEmployees[0]);
    assert.exists(actionTemplate);
  });
});
