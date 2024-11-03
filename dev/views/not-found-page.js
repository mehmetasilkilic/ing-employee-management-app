import {LitElement, html, css} from 'lit';

export class NotFoundPage extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      text-align: center;
      font-family: Arial, sans-serif;
    }

    .container {
      padding: 2rem;
    }

    .error-code {
      font-size: 6rem;
      font-weight: bold;
      margin: 0;
      color: var(--primary-color);
    }

    .error-message {
      font-size: 2rem;
      color: var(--text-primary);
      margin: 1rem 0;
    }

    .description {
      color: var(--text-secondary);
      margin: 1rem 0;
    }

    .home-link {
      display: inline-block;
      margin-top: 2rem;
      padding: 0.8rem 1.5rem;
      background-color: var(--primary-color);
      color: white;
      text-decoration: none;
      border-radius: 4px;
      transition: background-color 0.3s ease;
    }

    .home-link:hover {
      background-color: var(--hover-primary);
    }
  `;

  render() {
    return html`
      <div class="container">
        <h1 class="error-code">404</h1>
        <h2 class="error-message">Page Not Found</h2>
        <p class="description">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a href="/" class="home-link">Back to Home</a>
      </div>
    `;
  }
}

customElements.define('not-found-page', NotFoundPage);
