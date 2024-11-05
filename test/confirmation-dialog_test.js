import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import {ConfirmationDialog} from '../dev/components/confirmation-dialog.js';
import {confirmationStore} from '../dev/stores/confirmation-store.js';

// Mock custom-icon component
customElements.define(
  'custom-icon-test',
  class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({mode: 'open'});
    }

    static get observedAttributes() {
      return ['icon', 'size'];
    }

    connectedCallback() {
      this.render();
    }

    attributeChangedCallback() {
      this.render();
    }

    render() {
      const icon = this.getAttribute('icon');
      this.shadowRoot.innerHTML = `<span class="icon">${icon}</span>`;
    }
  }
);

suite('confirmation-dialog', () => {
  const sampleState = {
    isOpen: true,
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    confirmLabel: 'Yes, proceed',
    cancelLabel: 'Cancel',
    onConfirm: () => {},
    onCancel: () => {},
  };

  test('is defined', () => {
    const el = document.createElement('confirmation-dialog');
    assert.instanceOf(el, ConfirmationDialog);
  });

  test('renders closed by default', async () => {
    const el = await fixture(html`<confirmation-dialog></confirmation-dialog>`);
    assert.isFalse(el.hasAttribute('open'));
  });

  test('handles confirm action', async () => {
    let confirmCalled = false;
    const testState = {
      ...sampleState,
      onConfirm: () => {
        confirmCalled = true;
      },
    };

    confirmationStore.setState(testState);
    const el = await fixture(html`<confirmation-dialog></confirmation-dialog>`);

    const confirmButton = el.shadowRoot.querySelector('.confirm');
    confirmButton.click();

    assert.isTrue(confirmCalled);
  });

  test('handles cancel action', async () => {
    let cancelCalled = false;
    const testState = {
      ...sampleState,
      onCancel: () => {
        cancelCalled = true;
      },
    };

    confirmationStore.setState(testState);
    const el = await fixture(html`<confirmation-dialog></confirmation-dialog>`);

    const cancelButton = el.shadowRoot.querySelector('.cancel');
    cancelButton.click();

    assert.isTrue(cancelCalled);
  });

  test('handles escape key press', async () => {
    let cancelCalled = false;
    const testState = {
      ...sampleState,
      onCancel: () => {
        cancelCalled = true;
      },
    };

    confirmationStore.setState(testState);
    const el = await fixture(html`<confirmation-dialog></confirmation-dialog>`);

    const event = new KeyboardEvent('keydown', {key: 'Escape'});
    document.dispatchEvent(event);

    assert.isTrue(cancelCalled);
  });

  test('ignores escape key when closed', async () => {
    let cancelCalled = false;
    const testState = {
      ...sampleState,
      isOpen: false,
      onCancel: () => {
        cancelCalled = true;
      },
    };

    confirmationStore.setState(testState);
    const el = await fixture(html`<confirmation-dialog></confirmation-dialog>`);

    const event = new KeyboardEvent('keydown', {key: 'Escape'});
    document.dispatchEvent(event);

    assert.isFalse(cancelCalled);
  });

  test('renders without cancel button when cancelLabel is not provided', async () => {
    const testState = {
      ...sampleState,
      cancelLabel: null,
    };

    confirmationStore.setState(testState);
    const el = await fixture(html`<confirmation-dialog></confirmation-dialog>`);

    const cancelButton = el.shadowRoot.querySelector('.cancel');
    assert.isNull(cancelButton);
  });

  test('updates when store state changes', async () => {
    const el = await fixture(html`<confirmation-dialog></confirmation-dialog>`);

    const newState = {
      ...sampleState,
      title: 'New Title',
      message: 'New Message',
    };

    confirmationStore.setState(newState);
    await el.updateComplete;

    const title = el.shadowRoot.querySelector('.title');
    const message = el.shadowRoot.querySelector('.message');

    assert.equal(title.textContent, 'New Title');
    assert.equal(message.textContent, 'New Message');
  });

  test('close button triggers cancel', async () => {
    let cancelCalled = false;
    const testState = {
      ...sampleState,
      onCancel: () => {
        cancelCalled = true;
      },
    };

    confirmationStore.setState(testState);
    const el = await fixture(html`<confirmation-dialog></confirmation-dialog>`);

    const closeButton = el.shadowRoot.querySelector('.close');
    closeButton.click();

    assert.isTrue(cancelCalled);
  });
});
