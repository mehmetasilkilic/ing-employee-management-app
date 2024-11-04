import {fixture, assert, oneEvent} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

import {ActionButtons} from '../dev/components/action-buttons';

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

suite('action-buttons', () => {
  const sampleActions = [
    {
      type: 'edit',
      icon: 'edit',
      label: 'Edit Item',
    },
    {
      type: 'delete',
      icon: 'delete',
      label: 'Delete Item',
      event: 'delete-item',
    },
    {
      type: 'view',
      icon: 'visibility',
      label: 'View Item',
      disabled: true,
    },
  ];

  const sampleItem = {
    id: 1,
    name: 'Test Item',
  };

  test('is defined', () => {
    const el = document.createElement('action-buttons');
    assert.instanceOf(el, ActionButtons);
  });

  test('renders with default values', async () => {
    const el = await fixture(html`<action-buttons></action-buttons>`);

    assert.deepEqual(el.actions, []);
    assert.equal(el.size, 18);
    assert.equal(el.shadowRoot.querySelectorAll('.action-button').length, 0);
  });

  test('renders all action buttons', async () => {
    const el = await fixture(html`
      <action-buttons
        .actions=${sampleActions}
        .item=${sampleItem}
      ></action-buttons>
    `);

    const buttons = el.shadowRoot.querySelectorAll('.action-button');
    assert.equal(buttons.length, sampleActions.length);

    // Check if icons are rendered correctly
    const icons = el.shadowRoot.querySelectorAll('custom-icon');
    assert.equal(icons.length, sampleActions.length);
    icons.forEach((icon, index) => {
      assert.equal(icon.getAttribute('icon'), sampleActions[index].icon);
      assert.equal(icon.getAttribute('size'), '18');
    });
  });

  test('sets button attributes correctly', async () => {
    const el = await fixture(html`
      <action-buttons
        .actions=${sampleActions}
        .item=${sampleItem}
      ></action-buttons>
    `);

    const buttons = el.shadowRoot.querySelectorAll('.action-button');
    buttons.forEach((button, index) => {
      assert.equal(
        button.getAttribute('aria-label'),
        sampleActions[index].label
      );
      assert.equal(button.getAttribute('title'), sampleActions[index].label);
      if (sampleActions[index].disabled) {
        assert.isTrue(button.disabled);
      } else {
        assert.isFalse(button.disabled);
      }
    });
  });

  test('handles custom event names', async () => {
    const el = await fixture(html`
      <action-buttons
        .actions=${sampleActions}
        .item=${sampleItem}
      ></action-buttons>
    `);

    const deleteButton = el.shadowRoot.querySelectorAll('.action-button')[1];

    setTimeout(() => deleteButton.click());
    const {detail} = await oneEvent(el, 'delete-item');

    assert.equal(detail.type, 'delete');
    assert.deepEqual(detail.item, sampleItem);
  });

  test('handles default event name', async () => {
    const el = await fixture(html`
      <action-buttons
        .actions=${sampleActions}
        .item=${sampleItem}
      ></action-buttons>
    `);

    const editButton = el.shadowRoot.querySelectorAll('.action-button')[0];

    setTimeout(() => editButton.click());
    const {detail} = await oneEvent(el, 'action');

    assert.equal(detail.type, 'edit');
    assert.deepEqual(detail.item, sampleItem);
  });

  test('disabled buttons do not trigger events', async () => {
    const el = await fixture(html`
      <action-buttons
        .actions=${sampleActions}
        .item=${sampleItem}
      ></action-buttons>
    `);

    let eventFired = false;
    el.addEventListener('action', () => {
      eventFired = true;
    });

    const disabledButton = el.shadowRoot.querySelectorAll('.action-button')[2];
    disabledButton.click();

    assert.isFalse(eventFired);
  });

  test('updates icon size when size property changes', async () => {
    const el = await fixture(html`
      <action-buttons
        .actions=${sampleActions}
        .item=${sampleItem}
        .size=${24}
      ></action-buttons>
    `);

    const icons = el.shadowRoot.querySelectorAll('custom-icon');
    icons.forEach((icon) => {
      assert.equal(icon.getAttribute('size'), '24');
    });
  });

  test('has correct flex layout', async () => {
    const el = await fixture(html`
      <action-buttons .actions=${sampleActions}></action-buttons>
    `);

    const styles = window.getComputedStyle(el);
    assert.equal(styles.display, 'flex');
    assert.equal(styles.justifyContent, 'center');
  });

  test('handles empty actions array', async () => {
    const el = await fixture(html`
      <action-buttons .actions=${[]} .item=${sampleItem}></action-buttons>
    `);

    assert.equal(el.shadowRoot.querySelectorAll('.action-button').length, 0);
  });

  test('handles undefined item', async () => {
    const el = await fixture(html`
      <action-buttons .actions=${sampleActions}></action-buttons>
    `);

    const button = el.shadowRoot.querySelector('.action-button');
    setTimeout(() => button.click());
    const {detail} = await oneEvent(el, 'action');

    assert.equal(detail.type, 'edit');
    assert.isUndefined(detail.item);
  });

  test('bubbles events correctly', async () => {
    let parentEl = await fixture(html`
      <div>
        <action-buttons
          .actions=${sampleActions}
          .item=${sampleItem}
        ></action-buttons>
      </div>
    `);

    let eventCaught = false;
    parentEl.addEventListener('action', (e) => {
      eventCaught = true;
      assert.deepEqual(e.detail.item, sampleItem);
    });

    const button = parentEl
      .querySelector('action-buttons')
      .shadowRoot.querySelector('.action-button');
    button.click();

    assert.isTrue(eventCaught);
  });
});
