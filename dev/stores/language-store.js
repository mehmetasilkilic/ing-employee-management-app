import {createStore} from 'zustand/vanilla';
import {persist, createJSONStorage} from 'zustand/middleware';
import i18next from 'i18next';

const initialState = {
  language: i18next.language || 'en',
};

export const languageStore = createStore(
  persist(
    (set) => ({
      ...initialState,

      setLanguage: async (newLanguage) => {
        try {
          await i18next.changeLanguage(newLanguage);
          document.documentElement.lang = newLanguage;

          window.dispatchEvent(
            new CustomEvent('language-updated', {
              detail: {language: newLanguage},
              bubbles: true,
              composed: true,
            })
          );

          set({language: newLanguage});
          return true;
        } catch (error) {
          console.error('Error changing language:', error);
          return false;
        }
      },

      reset: () => {
        i18next.changeLanguage('en');
        set(initialState);
      },
    }),
    {
      name: 'language-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.language && state.language !== i18next.language) {
          i18next.changeLanguage(state.language);
        }
      },
    }
  )
);
