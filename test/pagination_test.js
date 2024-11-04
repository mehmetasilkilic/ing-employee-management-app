import {TablePagination} from '../dev/components/pagination';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

// Mock custom-icon component
customElements.define(
  'custom-icon-test',
  class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
      this.shadowRoot.innerHTML = `<span>${this.getAttribute('icon')}</span>`;
    }
  }
);

suite('table-pagination', () => {
  test('is defined', () => {
    const el = document.createElement('table-pagination');
    assert.instanceOf(el, TablePagination);
  });

  test('renders with ellipsis for many pages', async () => {
    const el = await fixture(
      html`<table-pagination
        currentPage="5"
        totalPages="10"
      ></table-pagination>`
    );
    const pagination = el.shadowRoot.querySelector('.pagination');
    const ellipsis = pagination.querySelectorAll('.pagination-ellipsis');
    assert.equal(ellipsis.length, 2);
  });

  test('handles next button click', async () => {
    const el = await fixture(
      html`<table-pagination currentPage="1" totalPages="5"></table-pagination>`
    );
    const button = el.shadowRoot.querySelector('.nav-btn:last-child');

    let eventFired = false;
    el.addEventListener('page-change', (e) => {
      eventFired = true;
      assert.equal(e.detail.page, 2);
    });

    button.click();
    await el.updateComplete;
    assert.isTrue(eventFired);
  });

  test('handles previous button click', async () => {
    const el = await fixture(
      html`<table-pagination currentPage="3" totalPages="5"></table-pagination>`
    );
    const button = el.shadowRoot.querySelector('.nav-btn:first-child');

    let eventFired = false;
    el.addEventListener('page-change', (e) => {
      eventFired = true;
      assert.equal(e.detail.page, 2);
    });

    button.click();
    await el.updateComplete;
    assert.isTrue(eventFired);
  });

  test('handles direct page selection', async () => {
    const el = await fixture(
      html`<table-pagination currentPage="1" totalPages="5"></table-pagination>`
    );
    const pageButtons = el.shadowRoot.querySelectorAll('.pagination-button');
    const targetButton = pageButtons[2]; // Third page

    let eventFired = false;
    el.addEventListener('page-change', (e) => {
      eventFired = true;
      assert.equal(e.detail.page, 3);
    });

    targetButton.click();
    await el.updateComplete;
    assert.isTrue(eventFired);
  });

  test('disables navigation appropriately', async () => {
    // First page
    const firstPage = await fixture(
      html`<table-pagination currentPage="1" totalPages="5"></table-pagination>`
    );
    assert.isTrue(
      firstPage.shadowRoot.querySelector('.nav-btn:first-child').disabled
    );
    assert.isFalse(
      firstPage.shadowRoot.querySelector('.nav-btn:last-child').disabled
    );

    // Last page
    const lastPage = await fixture(
      html`<table-pagination currentPage="5" totalPages="5"></table-pagination>`
    );
    assert.isFalse(
      lastPage.shadowRoot.querySelector('.nav-btn:first-child').disabled
    );
    assert.isTrue(
      lastPage.shadowRoot.querySelector('.nav-btn:last-child').disabled
    );
  });

  test('handles single page', async () => {
    const el = await fixture(
      html`<table-pagination currentPage="1" totalPages="1"></table-pagination>`
    );
    const pageButtons = el.shadowRoot.querySelectorAll('.pagination-button');

    assert.equal(pageButtons.length, 1);
    assert.isTrue(el.shadowRoot.querySelector('.nav-btn:first-child').disabled);
    assert.isTrue(el.shadowRoot.querySelector('.nav-btn:last-child').disabled);
  });

  test('getPageNumbers returns correct array', () => {
    const el = new TablePagination();

    // Test with few pages
    el.totalPages = 5;
    el.currentPage = 1;
    assert.deepEqual(el.getPageNumbers(), [1, 2, 3, 4, 5]);

    // Test with many pages
    el.totalPages = 10;
    el.currentPage = 5;
    const numbers = el.getPageNumbers();
    assert.include(numbers, 1);
    assert.include(numbers, '...');
    assert.include(numbers, 10);
  });
});
