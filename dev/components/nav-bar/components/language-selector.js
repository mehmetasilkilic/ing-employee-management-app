import {LitElement, html, css} from 'lit';

export class LanguageSelector extends LitElement {
  static properties = {
    currentLanguage: {type: String},
    languages: {type: Array},
  };

  constructor() {
    super();
    this.currentLanguage = 'EN';
    this.languages = [
      {
        code: 'EN',
        name: 'English',
        flag: '../../../../assets/images/uk-flag.png',
      },
      {
        code: 'TR',
        name: 'Türkçe',
        flag: '../../../../assets/images/turkish-flag.png',
      },
    ];
  }

  static styles = css`
    .language-selector {
      position: relative;
    }

    .language-button {
      padding: 0.25rem;
      background: transparent;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: transform 0.2s ease;
    }

    .language-button:hover {
      transform: scale(1.1);
    }

    .flag-icon {
      width: 30px;
      height: 20px;
      object-fit: cover;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .language-options {
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      margin-top: 0.5rem;
      display: none;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      min-width: 150px;
    }

    .language-options.show {
      display: block;
    }

    .language-option {
      padding: 0.5rem 1rem;
      cursor: pointer;
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .language-option:hover {
      background: #f5f5f5;
    }

    .option-flag {
      width: 24px;
      height: 16px;
      object-fit: cover;
      border-radius: 2px;
    }

    .language-name {
      font-size: 0.95rem;
      color: #333;
    }
  `;

  toggleLanguageOptions(e) {
    const options = this.shadowRoot.querySelector('.language-options');
    options.classList.toggle('show');
    e.stopPropagation();
  }

  selectLanguage(lang) {
    this.currentLanguage = lang;
    const options = this.shadowRoot.querySelector('.language-options');
    options.classList.remove('show');
    this.dispatchEvent(
      new CustomEvent('language-change', {
        detail: {language: lang},
        bubbles: true,
        composed: true,
      })
    );
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', () => {
      const options = this.shadowRoot?.querySelector('.language-options');
      if (options) {
        options.classList.remove('show');
      }
    });
  }

  getCurrentLanguage() {
    return this.languages.find((lang) => lang.code === this.currentLanguage);
  }

  render() {
    return html`
      <div class="language-selector" @click="${this.toggleLanguageOptions}">
        <button class="language-button">
          <img
            src="${this.getCurrentLanguage().flag}"
            alt="${this.getCurrentLanguage().code} flag"
            class="flag-icon"
          />
        </button>

        <div class="language-options">
          ${this.languages.map(
            (lang) => html`
              <div
                class="language-option"
                @click="${() => this.selectLanguage(lang.code)}"
              >
                <img
                  src="${lang.flag}"
                  alt="${lang.code} flag"
                  class="option-flag"
                />

                <span class="language-name">${lang.name}</span>
              </div>
            `
          )}
        </div>
      </div>
    `;
  }
}

customElements.define('language-selector', LanguageSelector);
