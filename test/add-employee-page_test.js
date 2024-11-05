import {fixture, assert, aTimeout} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import sinon from 'sinon';
import {Router} from '@vaadin/router';
import {AddEmployeePage} from '../dev/views/add-employee-page.js';
import {confirmationStore} from '../dev/stores/confirmation-store.js';
import employeeService from '../mockApi/service.js';

// Mock dependencies
const mockConfirmationState = {
  show: sinon.stub(),
};

// Mock form data
const sampleFormData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  department: 'Engineering',
};

suite('add-employee-page', () => {
  let element;

  setup(async () => {
    sinon.restore();

    // Setup mocks
    sinon.stub(confirmationStore, 'getState').returns(mockConfirmationState);
    sinon.stub(Router, 'go');
    sinon.stub(employeeService, 'addEmployee').resolves();

    mockConfirmationState.show.reset();
    mockConfirmationState.show.resolves(true);

    element = await fixture(html`<add-employee-page></add-employee-page>`);
  });

  test('is defined', () => {
    const el = document.createElement('add-employee-page');
    assert.instanceOf(el, AddEmployeePage);
  });

  test('renders with default state', async () => {
    assert.exists(element.shadowRoot.querySelector('.page-container'));
    assert.exists(element.shadowRoot.querySelector('.top-section'));
    assert.exists(element.shadowRoot.querySelector('.title'));
    assert.exists(element.shadowRoot.querySelector('.form-container'));
    assert.exists(element.shadowRoot.querySelector('form-builder'));

    assert.notExists(element.shadowRoot.querySelector('.loading-overlay'));

    assert.isFalse(element.loading);
  });

  test('form-builder is properly configured', async () => {
    const formBuilder = element.shadowRoot.querySelector('form-builder');

    assert.exists(formBuilder);
    assert.exists(formBuilder.schema);
    assert.exists(formBuilder.formFields);
    assert.isFalse(formBuilder.disabled);
  });

  test('shows loading overlay when submitting', async () => {
    mockConfirmationState.show.callsFake(async () => {
      await aTimeout(50);
      return true;
    });

    const submitPromise = element.handleFormSubmit({detail: sampleFormData});

    await element.updateComplete;
    assert.isTrue(element.loading);
    assert.exists(element.shadowRoot.querySelector('.loading-overlay'));

    await submitPromise;
  });

  test('handles successful form submission', async () => {
    mockConfirmationState.show
      .onFirstCall()
      .resolves(true)
      .onSecondCall()
      .resolves(true);

    await element.handleFormSubmit({detail: sampleFormData});

    assert.isTrue(employeeService.addEmployee.calledWith(sampleFormData));

    assert.equal(mockConfirmationState.show.callCount, 2);

    assert.isTrue(Router.go.calledWith('/'));

    assert.isFalse(element.loading);
  });

  test('handles cancelled form submission', async () => {
    mockConfirmationState.show.onFirstCall().resolves(false);

    await element.handleFormSubmit({detail: sampleFormData});

    assert.isFalse(employeeService.addEmployee.called);

    assert.equal(mockConfirmationState.show.callCount, 1);

    assert.isFalse(Router.go.called);

    assert.isFalse(element.loading);
  });

  test('handles submission error', async () => {
    mockConfirmationState.show.onFirstCall().resolves(true);

    const errorMessage = 'API Error';
    employeeService.addEmployee.rejects(new Error(errorMessage));

    await element.handleFormSubmit({detail: sampleFormData});

    assert.equal(mockConfirmationState.show.callCount, 2);
    const errorCall = mockConfirmationState.show.secondCall;
    assert.exists(errorCall);
    assert.include(errorCall.args[0].title.toLowerCase(), 'error');

    assert.isFalse(element.loading);
  });

  test('i18n integration', async () => {
    const title = element.shadowRoot.querySelector('.title');
    assert.exists(title);
    assert.isNotEmpty(title.textContent);

    element.loading = true;
    await element.updateComplete;

    const loadingOverlay = element.shadowRoot.querySelector('.loading-overlay');
    assert.exists(loadingOverlay);
    assert.isNotEmpty(loadingOverlay.textContent);
  });

  test('handles form builder disabled state', async () => {
    element.loading = true;
    await element.updateComplete;

    const formBuilder = element.shadowRoot.querySelector('form-builder');
    assert.isTrue(formBuilder.disabled);
  });
});
