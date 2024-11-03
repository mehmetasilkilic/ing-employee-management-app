import {LitElement, html} from 'lit';

import {tableStyles} from './styles/table-styles.js';

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

  static styles = tableStyles;

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
