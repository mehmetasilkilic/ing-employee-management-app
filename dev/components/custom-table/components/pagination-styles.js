import {css} from 'lit';

export const paginationStyles = css`
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
    cursor: not-allowed;
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
