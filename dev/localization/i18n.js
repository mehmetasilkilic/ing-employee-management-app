import i18next from 'i18next';
import en from './locales/en.js';
import tr from './locales/tr.js';

await i18next.init({
  lng: 'en',
  resources: {
    en: en,
    tr: tr,
  },
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export const i18nMixin = (superClass) =>
  class extends superClass {
    static properties = {
      ...superClass.properties,
      i18n: {type: Object},
      _currentLanguage: {type: String},
    };

    constructor() {
      super();
      this.i18n = i18next;
      this._currentLanguage = this.i18n.language;
      this._handleLanguageChange = this._handleLanguageChange.bind(this);
      this.i18n.on('languageChanged', this._handleLanguageChange);
    }

    disconnectedCallback() {
      super.disconnectedCallback?.();
      this.i18n.off('languageChanged', this._handleLanguageChange);
    }

    _handleLanguageChange(lang) {
      this._currentLanguage = lang;
      this.requestUpdate();
    }

    t(key, options = {}) {
      return this.i18n.t(key, options);
    }
  };
