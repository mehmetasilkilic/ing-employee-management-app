import {LitElement, html, css} from 'lit';
import {languageStore} from '../../../stores/language-store';

export class LanguageSelector extends LitElement {
  static properties = {
    currentLanguage: {type: String},
    languages: {type: Array},
  };

  constructor() {
    super();
    this.currentLanguage = languageStore.getState().language;
    this.languages = [
      {
        code: 'en',
        name: 'English',
        flag: '../../../../assets/images/uk-flag.png',
      },
      {
        code: 'tr',
        name: 'Türkçe',
        flag: '../../../../assets/images/turkish-flag.png',
      },
    ];
    this._handleDocumentClick = this._handleDocumentClick.bind(this);

    // Subscribe to store updates
    this.unsubscribe = languageStore.subscribe((state) => {
      this.currentLanguage = state.language;
      this.requestUpdate();
    });
  }

  static styles = css`
    .language-selector {
      position: relative;
    }

    .language-button {
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
      width: 20px;
      height: 13px;
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

    @media (max-width: 768px) {
      .language-options {
        margin-top: 0.5rem;
        width: 100%;
      }

      .language-button {
        padding: 0;
      }
    }
  `;

  toggleLanguageOptions(e) {
    const options = this.shadowRoot.querySelector('.language-options');
    options.classList.toggle('show');
    e.stopPropagation();
  }

  _handleDocumentClick(event) {
    if (!this.contains(event.target)) {
      const options = this.shadowRoot?.querySelector('.language-options');
      if (options) {
        options.classList.remove('show');
      }
    }
  }
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this._handleDocumentClick);

    // Listen for language updates from other components
    window.addEventListener('language-updated', (e) => {
      this.currentLanguage = e.detail.language;
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._handleDocumentClick);
    window.removeEventListener('language-updated', this._handleLanguageUpdated);
    this.unsubscribe?.();
  }

  async selectLanguage(lang) {
    if (lang === this.currentLanguage) return;

    const success = await languageStore.getState().setLanguage(lang);

    if (success) {
      this.dispatchEvent(
        new CustomEvent('language-change', {
          detail: {language: lang},
          bubbles: true,
          composed: true,
        })
      );

      const options = this.shadowRoot.querySelector('.language-options');
      options.classList.remove('show');
    }
  }

  getCurrentLanguage() {
    return (
      this.languages.find((lang) => lang.code === this.currentLanguage) ||
      this.languages[0]
    );
  }

  render() {
    const currentLang = this.getCurrentLanguage();

    return html`
      <div class="language-selector">
        <button class="language-button" @click="${this.toggleLanguageOptions}">
          <img
            src="${currentLang.flag}"
            alt="${currentLang.code} flag"
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
