import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

import {CustomTable} from '../dev/components/custom-table.js';

// Mock pagination component
customElements.define(
  'table-pagination-test',
  class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
      this.shadowRoot.innerHTML = `<div class="pagination"></div>`;
    }
  }
);

suite('custom-table', () => {
  const sampleColumns = [
    {field: 'id', header: 'ID'},
    {field: 'name', header: 'Name'},
    {field: 'email', header: 'Email'},
  ];

  const sampleData = [
    {id: 1, name: 'John Doe', email: 'john@example.com'},
    {id: 2, name: 'Jane Smith', email: 'jane@example.com'},
  ];

  test('is defined', () => {
    const el = document.createElement('custom-table');
    assert.instanceOf(el, CustomTable);
  });

  test('renders with default values', async () => {
    const el = await fixture(html`<custom-table></custom-table>`);

    assert.equal(el.pageSize, 10);
    assert.equal(el.currentPage, 1);
    assert.equal(el.totalItems, 0);
    assert.deepEqual(el.columns, []);
    assert.deepEqual(el.data, []);
    assert.isUndefined(el.selectedItems);
  });

  test('renders empty state when no data', async () => {
    const el = await fixture(html`
      <custom-table .columns=${sampleColumns}></custom-table>
    `);

    const emptyState = el.shadowRoot.querySelector('.empty-state');
    assert.exists(emptyState);
    assert.equal(emptyState.textContent.trim(), 'No data available');
  });

  test('renders data correctly', async () => {
    const el = await fixture(html`
      <custom-table
        .columns=${sampleColumns}
        .data=${sampleData}
      ></custom-table>
    `);

    const rows = el.shadowRoot.querySelectorAll('.table-row');
    assert.equal(rows.length, sampleData.length);

    const firstRowCells = rows[0].querySelectorAll('.table-cell');
    assert.equal(firstRowCells[0].textContent.trim(), '1');
    assert.equal(firstRowCells[1].textContent.trim(), 'John Doe');
    assert.equal(firstRowCells[2].textContent.trim(), 'john@example.com');
  });

  test('handles custom template rendering', async () => {
    const columnsWithTemplate = [
      ...sampleColumns,
      {
        field: 'action',
        header: 'Action',
        template: (item) => html`<button>Edit ${item.name}</button>`,
      },
    ];

    const el = await fixture(html`
      <custom-table
        .columns=${columnsWithTemplate}
        .data=${sampleData}
      ></custom-table>
    `);

    const actionButton = el.shadowRoot.querySelector('button');
    assert.exists(actionButton);
    assert.equal(actionButton.textContent, 'Edit John Doe');
  });

  suite('pagination', () => {
    test('calculates total pages correctly', async () => {
      const el = await fixture(html`
        <custom-table .totalItems=${25} .pageSize=${10}></custom-table>
      `);

      assert.equal(el.totalPages, 3);
    });

    test('handles page change event', async () => {
      const el = await fixture(html`
        <custom-table .totalItems=${25} .pageSize=${10}></custom-table>
      `);

      let eventFired = false;
      el.addEventListener('page-change', (e) => {
        eventFired = true;
        assert.equal(e.detail.page, 2);
      });

      el.handlePageChange({detail: {page: 2}});
      assert.isTrue(eventFired);
      assert.equal(el.currentPage, 2);
    });
  });

  suite('selection', () => {
    test('enables selection when selectedItems is defined', async () => {
      const el = await fixture(html`
        <custom-table
          .columns=${sampleColumns}
          .data=${sampleData}
          .selectedItems=${[]}
        ></custom-table>
      `);

      const checkboxes = el.shadowRoot.querySelectorAll(
        'input[type="checkbox"]'
      );
      assert.isAbove(checkboxes.length, 0);
    });

    test('handles individual item selection', async () => {
      const el = await fixture(html`
        <custom-table
          .columns=${sampleColumns}
          .data=${sampleData}
          .selectedItems=${[]}
        ></custom-table>
      `);

      let eventFired = false;
      el.addEventListener('selection-change', (e) => {
        eventFired = true;
        assert.deepEqual(e.detail.selectedItems, [sampleData[0]]);
      });

      const firstCheckbox = el.shadowRoot.querySelectorAll(
        'input[type="checkbox"]'
      )[1];
      firstCheckbox.click();

      assert.isTrue(eventFired);
    });

    test('correctly identifies selected items', async () => {
      const el = await fixture(html`
        <custom-table
          .columns=${sampleColumns}
          .data=${sampleData}
          .selectedItems=${[sampleData[0]]}
        ></custom-table>
      `);

      assert.isTrue(el.isItemSelected(sampleData[0]));
      assert.isFalse(el.isItemSelected(sampleData[1]));
    });
  });

  test('updates maxHeight style property', async () => {
    const el = await fixture(html`
      <custom-table maxHeight="500px"></custom-table>
    `);

    await el.updateComplete;
    assert.equal(el.style.getPropertyValue('--table-max-height'), '500px');
  });
});
