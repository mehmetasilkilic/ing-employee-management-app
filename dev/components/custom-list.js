import {LitElement, html, css} from 'lit';

import './pagination.js';
import './custom-card.js';

export class CustomCardList extends LitElement {
  static properties = {
    columns: {type: Array},
    data: {type: Array},
    pageSize: {type: Number},
    currentPage: {type: Number},
    totalItems: {type: Number},
    selectedItems: {type: Array},
  };

  static styles = css`
    :host {
      display: block;
    }

    .card-grid {
      display: grid;
      gap: 1rem;
      padding: 1rem;
      background: white;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }

    .checkbox-wrapper {
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0 1rem;
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
  `;

  constructor() {
    super();
    this.columns = [];
    this.data = [];
    this.pageSize = 12;
    this.currentPage = 1;
    this.totalItems = 0;
    this.selectedItems = undefined;
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
      ${this.hasSelection
        ? html`
            <div class="checkbox-wrapper">
              <input
                type="checkbox"
                .checked=${this.isAllSelected()}
                @change=${this.handleSelectAll}
              />
              <span>Select All</span>
            </div>
          `
        : ''}

      <div class="card-grid">
        ${!this.data.length
          ? html`<div class="empty-state">No data available</div>`
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

      ${this.totalItems
        ? html`
            <table-pagination
              .currentPage=${this.currentPage}
              .totalPages=${this.totalPages}
              @page-change=${this.handlePageChange}
            ></table-pagination>
          `
        : ''}
    `;
  }
}

customElements.define('custom-list', CustomCardList);
