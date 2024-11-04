import i18next from 'i18next';
import en from './locales/en.js';
import tr from './locales/tr.js';

// Initialize i18next
i18next.init({
  lng: 'EN', // default language
  resources: {
    EN: en,
    TR: tr,
  },
  fallbackLng: 'EN',
  interpolation: {
    escapeValue: false,
  },
});

// Create a mixin for i18n functionality
export const i18nMixin = (superClass) =>
  class extends superClass {
    constructor() {
      super();
      this.i18n = i18next;
      this.requestUpdate = this.requestUpdate.bind(this);

      // Re-render when language changes
      i18next.on('languageChanged', () => {
        this.requestUpdate();
      });
    }

    // Helper method to translate keys
    t(key) {
      return i18next.t(key);
    }
  };
