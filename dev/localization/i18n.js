import i18next from 'i18next';

import {languageStore} from '../stores/language-store';

import en from './locales/en.js';
import tr from './locales/tr.js';

const persistedLanguage = languageStore.getState().language;

await i18next.init({
  lng: persistedLanguage || 'en',
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

      this.unsubscribeStore = languageStore.subscribe((state) => {
        if (state.language !== this.i18n.language) {
          this.i18n.changeLanguage(state.language);
        }
      });
    }

    disconnectedCallback() {
      super.disconnectedCallback?.();
      this.i18n.off('languageChanged', this._handleLanguageChange);
      this.unsubscribeStore?.();
    }

    _handleLanguageChange(lang) {
      this._currentLanguage = lang;
      this.requestUpdate();
    }

    t(key, options = {}) {
      return this.i18n.t(key, options);
    }
  };
