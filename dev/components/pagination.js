import {LitElement, html, css} from 'lit';

import './custom-icon.js';

export class TablePagination extends LitElement {
  static styles = css`
    .pagination-container {
      padding: 1rem;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
    }

    .pagination-button,
    .nav-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 2rem;
      width: 2rem;
      font-size: 1rem;
      font-weight: 500;
      border: none;
      color: var(--text-primary);
      background-color: transparent;
      border-radius: 100%;
      cursor: pointer;
    }

    .pagination-button:hover:not(:disabled),
    .nav-btn:hover:not(:disabled) {
      color: var(--primary-color);
    }

    .pagination-button:disabled,
    .nav-btn:disabled {
      cursor: default;
    }

    .nav-btn:disabled {
      opacity: 0.5;
    }

    .pagination-button.active {
      background-color: var(--primary-color);
      color: white;
    }

    .pagination-ellipsis {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 2.25rem;
      min-width: 2.25rem;
      color: var(--text-secondary);
      font-weight: 500;
    }
  `;
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
