import {LitElement, html} from 'lit';

import {paginationStyles} from './pagination-styles.js';

import '../../custom-icon.js';

export class TablePagination extends LitElement {
  static styles = paginationStyles;

  static properties = {
    currentPage: {type: Number},
    totalPages: {type: Number},
  };

  getPageNumbers() {
    const pageNumbers = [];
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;

    pageNumbers.push(1);

    if (totalPages <= 7) {
      for (let i = 2; i < totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage > 3) {
        pageNumbers.push('...');
      }

      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(currentPage + 1, totalPages - 1);
        i++
      ) {
        pageNumbers.push(i);
      }

      if (currentPage < totalPages - 2) {
        pageNumbers.push('...');
      }
    }

    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  }

  handlePageChange(newPage) {
    this.dispatchEvent(
      new CustomEvent('page-change', {
        detail: {page: newPage},
      })
    );
  }

  renderPageNumbers() {
    return this.getPageNumbers().map((pageNum) => {
      if (pageNum === '...') {
        return html`<span class="pagination-ellipsis">...</span>`;
      }

      return html`
        <button
          @click=${() => this.handlePageChange(pageNum)}
          ?disabled=${this.currentPage === pageNum}
          class="pagination-button ${this.currentPage === pageNum
            ? 'active'
            : ''}"
        >
          ${pageNum}
        </button>
      `;
    });
  }

  render() {
    return html`
      <div class="pagination-container">
        <div class="pagination">
          <button
            class="nav-btn"
            @click=${() => this.handlePageChange(this.currentPage - 1)}
            ?disabled=${this.currentPage === 1}
          >
            <custom-icon icon="arrow_back_ios" size="16px"></custom-icon>
          </button>

          ${this.renderPageNumbers()}

          <button
            class="nav-btn"
            @click=${() => this.handlePageChange(this.currentPage + 1)}
            ?disabled=${this.currentPage === this.totalPages}
          >
            <custom-icon icon="arrow_forward_ios" size="16px"></custom-icon>
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define('table-pagination', TablePagination);
