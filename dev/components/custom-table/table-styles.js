import {css} from 'lit';

export const tableStyles = css`
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
