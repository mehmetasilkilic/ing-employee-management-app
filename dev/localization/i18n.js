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
    };

    constructor() {
      super();
      this.i18n = i18next;
      this._boundRequestUpdate = this.requestUpdate.bind(this);
      this.i18n.on('languageChanged', this._boundRequestUpdate);
    }

    disconnectedCallback() {
      super.disconnectedCallback?.();
      this.i18n.off('languageChanged', this._boundRequestUpdate);
    }

    t(key, options = {}) {
      return this.i18n.t(key, options);
    }
  };
