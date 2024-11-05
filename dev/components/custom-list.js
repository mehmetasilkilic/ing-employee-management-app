import {LitElement, html, css} from 'lit';

import {i18nMixin} from '../localization/i18n.js';

import './pagination.js';
import './custom-card.js';
import './loading-overlay.js';

export class CustomCardList extends i18nMixin(LitElement) {
  static properties = {
    columns: {type: Array},
    data: {type: Array},
    pageSize: {type: Number},
    currentPage: {type: Number},
    totalItems: {type: Number},
    selectedItems: {type: Array},
    maxHeight: {type: String},
    loading: {type: Boolean},
  };

  static styles = css`
    :host {
      display: block;
    }

    .container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      position: relative;
    }

    .fixed-header {
      background: white;
      padding: 1rem 1rem 0.5rem 1rem;
      border-bottom: 1px solid var(--border-color, #eee);
    }

    .scroll-container {
      overflow-y: auto;
      max-height: var(--list-max-height, 600px);
      background: white;
    }

    .scroll-container::-webkit-scrollbar {
      width: 8px;
    }

    .scroll-container::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    .scroll-container::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 4px;
    }

    .scroll-container::-webkit-scrollbar-thumb:hover {
      background: #555;
    }

    .card-grid {
      display: grid;
      gap: 1rem;
      padding: 1rem;
      background: white;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }

    .checkbox-wrapper {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .empty-state {
      grid-column: 1 / -1;
      padding: 2rem;
      text-align: center;
      color: var(--text-secondary);
    }

    input[type='checkbox'] {
      width: 1rem;
      height: 1rem;
      cursor: pointer;
      margin: 0;
    }

    .fixed-footer {
      background: white;
      padding: 0.5rem;
    }
  `;

  constructor() {
    super();
    this.columns = [];
    this.data = [];
    this.pageSize = 12;
    this.currentPage = 1;
    this.totalItems = 0;
    this.selectedItems = undefined;
    this.maxHeight = '600px';
    this.loading = false;
  }

  updated(changedProperties) {
    if (changedProperties.has('maxHeight')) {
      this.style.setProperty('--list-max-height', this.maxHeight);
    }
  }

  get totalPages() {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get hasSelection() {
    return Array.isArray(this.selectedItems);
  }

  handlePageChange(e) {
    const newPage = e.detail.page;
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.dispatchEvent(
        new CustomEvent('page-change', {
          detail: {page: this.currentPage},
        })
      );
    }
  }

  handleSelectAll(e) {
    if (!this.hasSelection) return;

    const isChecked = e.target.checked;
    this.selectedItems = isChecked ? [...this.data] : [];
    this._dispatchSelectionChange();
  }

  handleCardSelect(e) {
    if (!this.hasSelection) return;

    const {item, selected} = e.detail;
    this.selectedItems = selected
      ? [...this.selectedItems, item]
      : this.selectedItems.filter(
          (selectedItem) => selectedItem.id !== item.id
        );

    this._dispatchSelectionChange();
  }

  _dispatchSelectionChange() {
    this.dispatchEvent(
      new CustomEvent('selection-change', {
        detail: {selectedItems: this.selectedItems},
        bubbles: true,
        composed: true,
      })
    );
  }

  isItemSelected(item) {
    return (
      this.hasSelection &&
      this.selectedItems.some((selected) => selected.id === item.id)
    );
  }

  isAllSelected() {
    return (
      this.hasSelection &&
      this.data.length > 0 &&
      this.data.every((item) => this.isItemSelected(item))
    );
  }

  render() {
    return html`
      <div class="container">
        <loading-overlay .loading=${this.loading}></loading-overlay>
        ${this.hasSelection
          ? html`
              <div class="fixed-header">
                <div class="checkbox-wrapper">
                  <input
                    type="checkbox"
                    .checked=${this.isAllSelected()}
                    @change=${this.handleSelectAll}
                  />
                  <span>${this.t('common.selectAll')}</span>
                </div>
              </div>
            `
          : ''}

        <div class="scroll-container">
          <div class="card-grid">
            ${!this.data.length
              ? html`<div class="empty-state">
                  ${this.loading ? 'Loading data...' : 'No data available'}
                </div>`
              : this.data.map(
                  (item) => html`
                    <custom-card
                      .item=${item}
                      .columns=${this.columns}
                      .selected=${this.isItemSelected(item)}
                      .hasSelection=${this.hasSelection}
                      @card-select=${this.handleCardSelect}
                    ></custom-card>
                  `
                )}
          </div>
        </div>

        ${this.totalItems
          ? html`
              <table-pagination
                .currentPage=${this.currentPage}
                .totalPages=${this.totalPages}
                @page-change=${this.handlePageChange}
              ></table-pagination>
            `
          : ''}
      </div>
    `;
  }
}

customElements.define('custom-list', CustomCardList);
