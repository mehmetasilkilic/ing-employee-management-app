import {fixture, assert, oneEvent} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

import {CustomCard} from '../dev/components/custom-card.js';

suite('custom-card', () => {
  const sampleItem = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    status: 'Active',
  };

  const sampleColumns = [
    {field: 'name', header: 'Name'},
    {field: 'email', header: 'Email'},
    {
      field: 'status',
      header: 'Status',
      template: (item) => html`<span class="status">${item.status}</span>`,
    },
    {
      component: (item) =>
        html`<button class="action">Edit ${item.name}</button>`,
    },
  ];

  test('is defined', () => {
    const el = document.createElement('custom-card');
    assert.instanceOf(el, CustomCard);
  });

  test('renders item properties correctly', async () => {
    const el = await fixture(html`
      <custom-card
        .item=${sampleItem}
        .columns=${sampleColumns.slice(0, 2)}
      ></custom-card>
    `);

    const labels = el.shadowRoot.querySelectorAll('.card-label');
    const values = el.shadowRoot.querySelectorAll('.card-value');

    assert.equal(labels[0].textContent.trim(), 'Name:');
    assert.equal(values[0].textContent.trim(), 'John Doe');
    assert.equal(labels[1].textContent.trim(), 'Email:');
    assert.equal(values[1].textContent.trim(), 'john@example.com');
  });

  test('handles template rendering', async () => {
    const el = await fixture(html`
      <custom-card
        .item=${sampleItem}
        .columns=${[sampleColumns[2]]}
      ></custom-card>
    `);

    const statusElement = el.shadowRoot.querySelector('.status');
    assert.exists(statusElement);
    assert.equal(statusElement.textContent.trim(), 'Active');
  });

  test('renders components in footer', async () => {
    const el = await fixture(html`
      <custom-card
        .item=${sampleItem}
        .columns=${[sampleColumns[3]]}
      ></custom-card>
    `);

    const actionButton = el.shadowRoot.querySelector('.action');
    assert.exists(actionButton);
    assert.equal(actionButton.textContent.trim(), 'Edit John Doe');
  });

  suite('selection handling', () => {
    test('shows checkbox when selection is enabled', async () => {
      const el = await fixture(html`
        <custom-card
          .item=${sampleItem}
          .columns=${sampleColumns}
          .hasSelection=${true}
        ></custom-card>
      `);

      const checkbox = el.shadowRoot.querySelector('input[type="checkbox"]');
      assert.exists(checkbox);
    });

    test('does not show checkbox when selection is disabled', async () => {
      const el = await fixture(html`
        <custom-card
          .item=${sampleItem}
          .columns=${sampleColumns}
          .hasSelection=${false}
        ></custom-card>
      `);

      const checkbox = el.shadowRoot.querySelector('input[type="checkbox"]');
      assert.notExists(checkbox);
    });

    test('handles selection state correctly', async () => {
      const el = await fixture(html`
        <custom-card
          .item=${sampleItem}
          .columns=${sampleColumns}
          .hasSelection=${true}
          .selected=${true}
        ></custom-card>
      `);

      const checkbox = el.shadowRoot.querySelector('input[type="checkbox"]');
      assert.isTrue(checkbox.checked);
    });

    test('emits selection event', async () => {
      const el = await fixture(html`
        <custom-card
          .item=${sampleItem}
          .columns=${sampleColumns}
          .hasSelection=${true}
          .selected=${false}
        ></custom-card>
      `);

      const checkbox = el.shadowRoot.querySelector('input[type="checkbox"]');

      setTimeout(() => {
        checkbox.checked = true;
        checkbox.dispatchEvent(new Event('change'));
      });

      const {detail} = await oneEvent(el, 'card-select');
      assert.deepEqual(detail.item, sampleItem);
      assert.isTrue(detail.selected);
    });
  });

  test('handles missing field values', async () => {
    const itemWithMissingField = {
      id: 1,
      name: 'John Doe',
      // email is missing
    };

    const el = await fixture(html`
      <custom-card
        .item=${itemWithMissingField}
        .columns=${sampleColumns.slice(0, 2)}
      ></custom-card>
    `);

    const values = el.shadowRoot.querySelectorAll('.card-value');
    assert.equal(values[1].textContent.trim(), '');
  });

  test('handles empty columns array', async () => {
    const el = await fixture(html`
      <custom-card .item=${sampleItem} .columns=${[]}></custom-card>
    `);

    const content = el.shadowRoot.querySelector('.card-content');
    assert.equal(content.children.length, 0);
  });

  test('skips rendering for columns without field or template', async () => {
    const columnsWithEmpty = [
      {header: 'Empty'}, // No field or template
      ...sampleColumns,
    ];

    const el = await fixture(html`
      <custom-card
        .item=${sampleItem}
        .columns=${columnsWithEmpty}
      ></custom-card>
    `);

    const labels = el.shadowRoot.querySelectorAll('.card-label');
    assert.notEqual(labels[0].textContent.trim(), 'Empty:');
  });

  test('renders both template and component columns', async () => {
    const el = await fixture(html`
      <custom-card
        .item=${sampleItem}
        .columns=${[sampleColumns[2], sampleColumns[3]]}
      ></custom-card>
    `);

    assert.exists(el.shadowRoot.querySelector('.status'));
    assert.exists(el.shadowRoot.querySelector('.action'));
  });
});
