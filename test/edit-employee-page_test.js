import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import sinon from 'sinon';
import {Router} from '@vaadin/router';
import {EditEmployeePage} from '../dev/views/edit-employee-page.js';
import {confirmationStore} from '../dev/stores/confirmation-store.js';
import {employeeStore} from '../dev/stores/employee-store.js';
import employeeService from '../../mockApi/service.js';

// Mock dependencies
const mockConfirmationState = {
  show: sinon.stub(),
};

const mockEmployeeState = {
  editingEmployee: null,
  clearEditingEmployee: sinon.stub(),
};

// Sample employee data
const sampleEmployee = {
  id: '123',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  department: 'Engineering',
};

const updatedEmployee = {
  ...sampleEmployee,
  department: 'Marketing',
};

suite('edit-employee-page', () => {
  let element;

  setup(async () => {
    // Reset all stubs before each test
    sinon.restore();

    // Setup mocks
    sinon.stub(confirmationStore, 'getState').returns(mockConfirmationState);
    sinon.stub(employeeStore, 'getState').returns(mockEmployeeState);
    sinon.stub(Router, 'go');
    sinon.stub(employeeService, 'updateEmployee').resolves();

    // Reset stubs
    mockConfirmationState.show.reset();
    mockEmployeeState.clearEditingEmployee.reset();
    mockConfirmationState.show.resolves(true);

    // Set default employee data
    mockEmployeeState.editingEmployee = sampleEmployee;

    // Create fresh element for each test
    element = await fixture(html`<edit-employee-page></edit-employee-page>`);
  });

  test('is defined', () => {
    const el = document.createElement('edit-employee-page');
    assert.instanceOf(el, EditEmployeePage);
  });

  test('renders with default state', async () => {
    assert.exists(element.shadowRoot.querySelector('.page-container'));
    assert.exists(element.shadowRoot.querySelector('.top-section'));
    assert.exists(element.shadowRoot.querySelector('.title'));
    assert.exists(element.shadowRoot.querySelector('.go-back'));
    assert.exists(element.shadowRoot.querySelector('form-builder'));
  });

  test('renders empty state when no employee data', async () => {
    mockEmployeeState.editingEmployee = null;
    element = await fixture(html`<edit-employee-page></edit-employee-page>`);

    assert.exists(element.shadowRoot.querySelector('.empty-state'));
    assert.notExists(element.shadowRoot.querySelector('form-builder'));
  });

  test('loads employee data on connection', async () => {
    assert.deepEqual(element.employeeData, sampleEmployee);
  });

  test('clears employee data on disconnection', async () => {
    element.disconnectedCallback();
    assert.isTrue(mockEmployeeState.clearEditingEmployee.calledOnce);
  });

  test('handles employee update event', async () => {
    const updateEvent = new CustomEvent('employee-updated', {
      detail: {employee: updatedEmployee},
    });
    window.dispatchEvent(updateEvent);

    assert.deepEqual(element.employeeData, updatedEmployee);
  });

  test('form-builder is properly configured', async () => {
    const formBuilder = element.shadowRoot.querySelector('form-builder');

    assert.exists(formBuilder);
    assert.exists(formBuilder.schema);
    assert.exists(formBuilder.formFields);
    assert.deepEqual(formBuilder.initialData, sampleEmployee);
  });

  test('handles successful form submission', async () => {
    // Configure confirmations
    mockConfirmationState.show
      .onFirstCall()
      .resolves(true) // Initial confirmation
      .onSecondCall()
      .resolves(true); // Success confirmation

    await element.handleFormSubmit({detail: updatedEmployee});

    // Verify service called
    assert.isTrue(
      employeeService.updateEmployee.calledWith(
        sampleEmployee.id,
        updatedEmployee
      )
    );

    // Verify employee store cleared
    assert.isTrue(mockEmployeeState.clearEditingEmployee.calledOnce);

    // Verify confirmations shown (initial + success)
    assert.equal(mockConfirmationState.show.callCount, 2);

    // Verify navigation occurred
    assert.isTrue(Router.go.calledWith('/'));
  });

  test('handles cancelled form submission', async () => {
    // Configure confirmation to cancel
    mockConfirmationState.show.onFirstCall().resolves(false);

    await element.handleFormSubmit({detail: updatedEmployee});

    // Verify service not called
    assert.isFalse(employeeService.updateEmployee.called);

    // Verify employee store not cleared
    assert.isFalse(mockEmployeeState.clearEditingEmployee.called);

    // Verify only initial confirmation shown
    assert.equal(mockConfirmationState.show.callCount, 1);

    // Verify no navigation
    assert.isFalse(Router.go.called);
  });

  test('handles submission error', async () => {
    // Configure initial confirmation
    mockConfirmationState.show.onFirstCall().resolves(true);

    // Setup service to throw error
    const errorMessage = 'API Error';
    employeeService.updateEmployee.rejects(new Error(errorMessage));

    await element.handleFormSubmit({detail: updatedEmployee});

    // Verify error confirmation shown
    assert.equal(mockConfirmationState.show.callCount, 2);
    const errorCall = mockConfirmationState.show.secondCall;
    assert.exists(errorCall);
    assert.include(errorCall.args[0].title.toLowerCase(), 'error');
  });

  test('handles go back button click', async () => {
    const goBackButton = element.shadowRoot.querySelector('.go-back');
    goBackButton.click();

    assert.isTrue(Router.go.calledWith('/'));
  });

  test('i18n integration', async () => {
    // Test page title
    const title = element.shadowRoot.querySelector('.title');
    assert.exists(title);
    assert.isNotEmpty(title.textContent);

    // Test go back button
    const goBackButton = element.shadowRoot.querySelector('.go-back');
    assert.exists(goBackButton);
    assert.isNotEmpty(goBackButton.textContent);
  });

  test('updates form when employee data changes', async () => {
    // Update employee data
    element.employeeData = updatedEmployee;
    await element.updateComplete;

    const formBuilder = element.shadowRoot.querySelector('form-builder');
    assert.deepEqual(formBuilder.initialData, updatedEmployee);
  });
});
