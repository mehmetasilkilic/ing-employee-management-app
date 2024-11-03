import {LitElement, html, css} from 'lit';

export class CustomCard extends LitElement {
  static properties = {
    item: {type: Object},
    columns: {type: Array},
    selected: {type: Boolean},
    hasSelection: {type: Boolean},
  };

  static styles = css`
    :host {
      display: block;
    }

    .card {
      background: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 1rem;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      display: flex;
      flex-direction: column;
    }

    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .card-content {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 0.5rem 1rem;
      margin-bottom: 1rem;
      flex-grow: 1;
    }

    .card-label {
      color: #333;
      font-size: 0.875rem;
      white-space: nowrap;
    }

    .card-value {
      color: #666;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .card-bottom-section {
      border-top: 1px solid var(--border-color, #eee);
      padding-top: 0.5rem;
      margin-top: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    input[type='checkbox'] {
      width: 16px;
      height: 16px;
      cursor: pointer;
    }
  `;

  renderCell(item, column) {
    if (column.template) {
      return html`${column.template(item)}`;
    }
    return html`${item[column.field] || ''}`;
  }

  renderComponent(item, column) {
    if (column.component) {
      return column.component(item);
    }
  }

  handleSelect(e) {
    this.dispatchEvent(
      new CustomEvent('card-select', {
        detail: {
          item: this.item,
          selected: e.target.checked,
        },
      })
    );
  }

  render() {
    return html`
      <div class="card">
        <div class="card-content">
          ${this.columns.map(
            (column) => html`
              ${column.template || column.field
                ? html`<span class="card-label">${column.header}:</span>`
                : ''}
              <span class="card-value"
                >${this.renderCell(this.item, column)}</span
              >
            `
          )}
        </div>

        <div class="card-bottom-section">
          ${this.hasSelection
            ? html`
                <div>
                  <input
                    type="checkbox"
                    .checked=${this.selected}
                    @change=${this.handleSelect}
                  />
                </div>
              `
            : ''}
          ${this.columns.find((col) => col.component)
            ? html`
                <div>
                  ${this.columns
                    .filter((col) => col.component)
                    .map((col) => this.renderComponent(this.item, col))}
                </div>
              `
            : ''}
        </div>
      </div>
    `;
  }
}

customElements.define('custom-card', CustomCard);
