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
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 20px;
      padding: 1rem;
      background: white;
    }

    .checkbox-wrapper {
      margin-bottom: 1rem;
    }

    .empty-state {
      grid-column: 1 / -1;
      padding: 3rem 1rem;
      text-align: center;
      color: var(--text-secondary);
    }

    input[type='checkbox'] {
      width: 16px;
      height: 16px;
      cursor: pointer;
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

  get currentPageData() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.data.slice(start, end);
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
    const newSelectedItems = isChecked ? [...this.currentPageData] : [];
    this.selectedItems = newSelectedItems;
    this.dispatchEvent(
      new CustomEvent('selection-change', {
        detail: {selectedItems: this.selectedItems},
      })
    );
  }

  handleCardSelect(e) {
    if (!this.hasSelection) return;

    const {item, selected} = e.detail;
    let newSelectedItems;

    if (selected) {
      newSelectedItems = [...this.selectedItems, item];
    } else {
      newSelectedItems = this.selectedItems.filter(
        (selectedItem) => selectedItem.id !== item.id
      );
    }

    this.selectedItems = newSelectedItems;
    this.dispatchEvent(
      new CustomEvent('selection-change', {
        detail: {selectedItems: this.selectedItems},
      })
    );
  }

  isItemSelected(item) {
    if (!this.hasSelection) return false;
    return this.selectedItems.some(
      (selectedItem) => selectedItem.id === item.id
    );
  }

  isAllSelected() {
    if (!this.hasSelection) return false;
    return (
      this.currentPageData.length > 0 &&
      this.currentPageData.every((item) => this.isItemSelected(item))
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
              Select All
            </div>
          `
        : ''}

      <div class="card-grid">
        ${this.currentPageData.length === 0
          ? html`<div class="empty-state">No data available</div>`
          : this.currentPageData.map(
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
