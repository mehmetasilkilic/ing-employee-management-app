import {fixture, assert, oneEvent} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

import {CustomCardList} from '../dev/components/custom-list.js';

// Mock dependencies
customElements.define(
  'custom-card-test',
  class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({mode: 'open'});
    }

    static get observedAttributes() {
      return ['selected'];
    }

    connectedCallback() {
      this.render();
    }

    render() {
      this.shadowRoot.innerHTML = `<div class="card">Card Content</div>`;
    }
  }
);

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

suite('custom-card-list', () => {
  const sampleData = [
    {id: 1, name: 'Item 1', status: 'Active'},
    {id: 2, name: 'Item 2', status: 'Inactive'},
    {id: 3, name: 'Item 3', status: 'Active'},
  ];

  const sampleColumns = [
    {field: 'name', header: 'Name'},
    {field: 'status', header: 'Status'},
    {
      component: (item) => html`<button>Edit ${item.name}</button>`,
    },
  ];

  test('is defined', () => {
    const el = document.createElement('custom-list');
    assert.instanceOf(el, CustomCardList);
  });

  test('initializes with default values', async () => {
    const el = await fixture(html`<custom-list></custom-list>`);

    assert.deepEqual(el.columns, []);
    assert.deepEqual(el.data, []);
    assert.equal(el.pageSize, 12);
    assert.equal(el.currentPage, 1);
    assert.equal(el.totalItems, 0);
    assert.isUndefined(el.selectedItems);
    assert.equal(el.maxHeight, '600px');
  });

  suite('rendering', () => {
    test('renders empty state when no data', async () => {
      const el = await fixture(html`
        <custom-list .columns=${sampleColumns} .data=${[]}></custom-list>
      `);

      const emptyState = el.shadowRoot.querySelector('.empty-state');
      assert.exists(emptyState);
      assert.equal(emptyState.textContent.trim(), 'No data available');
    });

    test('renders cards for each data item', async () => {
      const el = await fixture(html`
        <custom-list
          .columns=${sampleColumns}
          .data=${sampleData}
        ></custom-list>
      `);

      const cards = el.shadowRoot.querySelectorAll('custom-card');
      assert.equal(cards.length, sampleData.length);
    });
  });

  suite('pagination', () => {
    test('calculates total pages correctly', async () => {
      const el = await fixture(html`
        <custom-list .totalItems=${25} .pageSize=${10}></custom-list>
      `);

      assert.equal(el.totalPages, 3);
    });

    test('handles page change event', async () => {
      const el = await fixture(html`
        <custom-list
          .data=${sampleData}
          .totalItems=${25}
          .pageSize=${10}
        ></custom-list>
      `);

      setTimeout(() => {
        el.handlePageChange({detail: {page: 2}});
      });

      const {detail} = await oneEvent(el, 'page-change');
      assert.equal(detail.page, 2);
      assert.equal(el.currentPage, 2);
    });
  });

  suite('selection', () => {
    test('shows select all when selection is enabled', async () => {
      const el = await fixture(html`
        <custom-list .data=${sampleData} .selectedItems=${[]}></custom-list>
      `);

      const selectAll = el.shadowRoot.querySelector('.checkbox-wrapper');
      assert.exists(selectAll);
    });

    test('handles select all', async () => {
      const el = await fixture(html`
        <custom-list .data=${sampleData} .selectedItems=${[]}></custom-list>
      `);

      const checkbox = el.shadowRoot.querySelector('input[type="checkbox"]');

      setTimeout(() => {
        checkbox.checked = true;
        checkbox.dispatchEvent(new Event('change'));
      });

      const {detail} = await oneEvent(el, 'selection-change');
      assert.deepEqual(detail.selectedItems, sampleData);
    });

    test('handles card selection', async () => {
      const el = await fixture(html`
        <custom-list .data=${sampleData} .selectedItems=${[]}></custom-list>
      `);

      setTimeout(() => {
        el.handleCardSelect({
          detail: {item: sampleData[0], selected: true},
        });
      });

      const {detail} = await oneEvent(el, 'selection-change');
      assert.deepEqual(detail.selectedItems, [sampleData[0]]);
    });

    test('handles card deselection', async () => {
      const el = await fixture(html`
        <custom-list
          .data=${sampleData}
          .selectedItems=${[sampleData[0]]}
        ></custom-list>
      `);

      setTimeout(() => {
        el.handleCardSelect({
          detail: {item: sampleData[0], selected: false},
        });
      });

      const {detail} = await oneEvent(el, 'selection-change');
      assert.deepEqual(detail.selectedItems, []);
    });

    test('correctly identifies selected items', async () => {
      const el = await fixture(html`
        <custom-list
          .data=${sampleData}
          .selectedItems=${[sampleData[0]]}
        ></custom-list>
      `);

      assert.isTrue(el.isItemSelected(sampleData[0]));
      assert.isFalse(el.isItemSelected(sampleData[1]));
    });

    test('correctly identifies all selected state', async () => {
      const el = await fixture(html`
        <custom-list
          .data=${sampleData}
          .selectedItems=${sampleData}
        ></custom-list>
      `);

      assert.isTrue(el.isAllSelected());
    });
  });

  test('updates maxHeight style property', async () => {
    const el = await fixture(html`
      <custom-list maxHeight="800px"></custom-list>
    `);

    await el.updateComplete;
    assert.equal(el.style.getPropertyValue('--list-max-height'), '800px');
  });

  suite('layout and styling', () => {
    test('applies grid layout to cards', async () => {
      const el = await fixture(html`
        <custom-list
          .data=${sampleData}
          .columns=${sampleColumns}
        ></custom-list>
      `);

      const grid = el.shadowRoot.querySelector('.card-grid');
      const styles = window.getComputedStyle(grid);
      assert.equal(styles.display, 'grid');
    });

    test('has scrollable container', async () => {
      const el = await fixture(html`
        <custom-list
          .data=${sampleData}
          .columns=${sampleColumns}
        ></custom-list>
      `);

      const container = el.shadowRoot.querySelector('.scroll-container');
      const styles = window.getComputedStyle(container);
      assert.equal(styles.overflowY, 'auto');
    });
  });

  suite('edge cases', () => {
    test('handles undefined selectedItems', async () => {
      const el = await fixture(html`
        <custom-list
          .data=${sampleData}
          .selectedItems=${undefined}
        ></custom-list>
      `);

      assert.isFalse(el.hasSelection);
      assert.notExists(el.shadowRoot.querySelector('.checkbox-wrapper'));
    });

    test('handles empty selection array', async () => {
      const el = await fixture(html`
        <custom-list .data=${sampleData} .selectedItems=${[]}></custom-list>
      `);

      assert.isTrue(el.hasSelection);
      assert.isFalse(el.isAllSelected());
    });

    test('handles invalid page changes', async () => {
      const el = await fixture(html`
        <custom-list
          .data=${sampleData}
          .totalItems=${10}
          .pageSize=${5}
        ></custom-list>
      `);

      const initialPage = el.currentPage;
      el.handlePageChange({detail: {page: 0}});
      assert.equal(el.currentPage, initialPage);

      el.handlePageChange({detail: {page: 999}});
      assert.equal(el.currentPage, initialPage);
    });
  });
});
