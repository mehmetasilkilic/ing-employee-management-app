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
  };

  static styles = css`
    :host {
      display: block;
    }

    .table-container {
      background: white;
      overflow: hidden;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
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
      padding: 2rem 0.5rem;
      border-bottom: 1px solid var(--border-color);
    }

    .checkbox-cell {
      width: 48px;
      padding: 0.5rem;
    }

    input[type='checkbox'] {
      width: 16px;
      height: 16px;
      cursor: pointer;
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
  `;

  constructor() {
    super();
    this.columns = [];
    this.data = [];
    this.pageSize = 10;
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
      this.currentPageData.length > 0 &&
      this.currentPageData.every((item) => this.isItemSelected(item))
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
        <table class="data-table">
          <thead>
            <tr>
              ${this.hasSelection
                ? html`
                    <th class="table-header table-cell checkbox-cell">
                      <input
                        type="checkbox"
                        .checked=${this.isAllSelected()}
                        @change=${this.handleSelectAll}
                      />
                    </th>
                  `
                : ''}
              ${this.columns.map(
                (column) => html`
                  <th class="table-header table-cell" scope="col">
                    ${column.header}
                  </th>
                `
              )}
            </tr>
          </thead>
          <tbody>
            ${this.currentPageData.length === 0
              ? html`
                  <tr class="table-row">
                    <td
                      colspan="${this.hasSelection
                        ? this.columns.length + 1
                        : this.columns.length}"
                      class="empty-state"
                    >
                      No data available
                    </td>
                  </tr>
                `
              : this.currentPageData.map(
                  (item) => html`
                    <tr class="table-row">
                      ${this.hasSelection
                        ? html`
                            <td class="table-cell checkbox-cell">
                              <input
                                type="checkbox"
                                .checked=${this.isItemSelected(item)}
                                @change=${(e) => this.handleSelectItem(item, e)}
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
