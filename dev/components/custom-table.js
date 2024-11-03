import {LitElement, html, css} from 'lit';

import './pagination.js';

export class CustomTable extends LitElement {
  static properties = {
    columns: {type: Array},
    data: {type: Array},
    pageSize: {type: Number},
    currentPage: {type: Number},
    totalItems: {type: Number},
    selectedItems: {type: Array},
    maxHeight: {type: String},
  };

  static styles = css`
    .table-container {
      background: white;
      position: relative;
      display: flex;
      flex-direction: column;
    }

    .table-scroll-container {
      overflow-y: auto;
      max-height: var(--table-max-height, 400px);
    }

    .data-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      font-size: 0.875rem;
    }

    .header-container {
      position: sticky;
      top: 0;
      z-index: 1;
      background: white;
    }

    .table-header {
      font-weight: 600;
      text-transform: uppercase;
      text-align: center;
      font-size: 0.75rem;
      color: var(--primary-color);
      letter-spacing: 0.05em;
    }

    .table-cell {
      text-align: center;
      padding: 1.5rem 0.5rem;
      border-bottom: 1px solid var(--border-color);
    }

    .checkbox-cell {
      width: 48px;
      padding: 0.5rem;
    }

    input[type='checkbox'] {
      width: 1rem;
      height: 1rem;
      cursor: pointer;
      margin: 0;
    }

    .table-row:last-child .table-cell {
      border-bottom: none;
    }

    .table-row {
      transition: background-color 0.2s ease;
    }

    .table-row:hover {
      background-color: var(--hover-bg);
    }

    .empty-state {
      padding: 3rem 1rem;
      text-align: center;
      color: var(--text-secondary);
    }

    /* Custom scrollbar styles */
    .table-scroll-container::-webkit-scrollbar {
      width: 8px;
    }

    .table-scroll-container::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    .table-scroll-container::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 4px;
    }

    .table-scroll-container::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  `;

  constructor() {
    super();
    this.initializeProperties();
  }

  initializeProperties() {
    this.columns = [];
    this.data = [];
    this.pageSize = 10;
    this.currentPage = 1;
    this.totalItems = 0;
    this.selectedItems = undefined;
    this.maxHeight = '700px';
  }

  updated(changedProperties) {
    if (changedProperties.has('maxHeight')) {
      this.style.setProperty('--table-max-height', this.maxHeight);
    }
  }

  get hasSelection() {
    return Array.isArray(this.selectedItems);
  }

  get totalPages() {
    return Math.ceil(this.totalItems / this.pageSize);
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
    const newSelectedItems = isChecked ? [...this.data] : [];
    this.selectedItems = newSelectedItems;
    this.dispatchEvent(
      new CustomEvent('selection-change', {
        detail: {selectedItems: this.selectedItems},
      })
    );
  }

  handleSelectItem(item, e) {
    if (!this.hasSelection) return;

    const isChecked = e.target.checked;
    let newSelectedItems;

    if (isChecked) {
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
      this.data.length > 0 &&
      this.data.every((item) => this.isItemSelected(item))
    );
  }

  renderCell(item, column) {
    if (column.component) {
      return column.component(item);
    }

    if (column.template) {
      return html`${column.template(item)}`;
    }

    return html`${item[column.field] || ''}`;
  }

  render() {
    return html`
      <div class="table-container">
        <div class="header-container">
          <table class="data-table">
            <thead>
              <tr>
                ${this.hasSelection
                  ? html`
                      <th class="table-header table-cell checkbox-cell">
                        <input
                          type="checkbox"
                          .checked=${this.isAllSelected()}
                          @change=${(e) =>
                            this.handleSelection(true, null, e.target.checked)}
                        />
                      </th>
                    `
                  : ''}
                ${this.columns.map(
                  (column) => html`
                    <th class="table-header table-cell">${column.header}</th>
                  `
                )}
              </tr>
            </thead>
          </table>
        </div>
        <div class="table-scroll-container">
          <table class="data-table">
            <tbody>
              ${!this.data.length
                ? html`
                    <tr class="table-row">
                      <td
                        colspan=${this.hasSelection
                          ? this.columns.length + 1
                          : this.columns.length}
                        class="empty-state"
                      >
                        No data available
                      </td>
                    </tr>
                  `
                : this.data.map(
                    (item) => html`
                      <tr class="table-row">
                        ${this.hasSelection
                          ? html`
                              <td class="table-cell checkbox-cell">
                                <input
                                  type="checkbox"
                                  .checked=${this.isItemSelected(item)}
                                  @change=${(e) =>
                                    this.handleSelectItem(item, e)}
                                />
                              </td>
                            `
                          : ''}
                        ${this.columns.map(
                          (column) => html`
                            <td class="table-cell">
                              ${this.renderCell(item, column)}
                            </td>
                          `
                        )}
                      </tr>
                    `
                  )}
            </tbody>
          </table>
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
    `;
  }
}

customElements.define('custom-table', CustomTable);
