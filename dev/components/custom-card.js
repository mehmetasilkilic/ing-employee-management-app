import {LitElement, html, css} from 'lit';

export class CustomCard extends LitElement {
  static properties = {
    item: {type: Object},
    columns: {type: Array},
    selected: {type: Boolean},
    hasSelection: {type: Boolean},
  };

  static styles = css`
    .card {
      background: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 1rem;
      transition: transform 0.2s ease;
      display: flex;
      flex-direction: column;
    }

    .card:hover {
      transform: translateY(-2px);
      background: var(--hover-bg);
    }

    .card-content {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 0.5rem 1rem;
      margin-bottom: 1rem;
      flex-grow: 1;
    }

    .card-label {
      color: var(--text-primary);
      font-size: 0.875rem;
      white-space: nowrap;
    }

    .card-value {
      color: var(--text-secondary);
      font-size: 0.875rem;
      font-weight: 500;
      word-break: break-word;
    }

    .card-footer {
      border-top: 1px solid var(--border-color);
      padding-top: 0.5rem;
      margin-top: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    input[type='checkbox'] {
      width: 1rem;
      height: 1rem;
      cursor: pointer;
      margin: 0;
    }
  `;

  renderContent(item, column) {
    return column.template ? column.template(item) : item[column.field] || '';
  }

  handleSelect(e) {
    this.dispatchEvent(
      new CustomEvent('card-select', {
        detail: {item: this.item, selected: e.target.checked},
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
                ? html`
                    <span class="card-label">${column.header}:</span>
                    <span class="card-value">
                      ${this.renderContent(this.item, column)}
                    </span>
                  `
                : ''}
            `
          )}
        </div>

        <div class="card-footer">
          ${this.hasSelection
            ? html`
                <input
                  type="checkbox"
                  .checked=${this.selected}
                  @change=${this.handleSelect}
                />
              `
            : ''}
          ${this.columns
            .filter((col) => col.component)
            .map((col) => col.component(this.item))}
        </div>
      </div>
    `;
  }
}

customElements.define('custom-card', CustomCard);
