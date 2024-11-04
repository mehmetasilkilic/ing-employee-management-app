import {createStore} from 'zustand/vanilla';

const initialState = {
  isOpen: false,
  title: '',
  message: '',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  onConfirm: () => {},
  onCancel: () => {},
};

export const confirmationStore = createStore((set) => ({
  ...initialState,

  show: ({
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
  }) => {
    return new Promise((resolve) => {
      set({
        isOpen: true,
        title,
        message,
        confirmLabel,
        cancelLabel,
        onConfirm: () => {
          resolve(true);
          set(initialState);
        },
        onCancel: () => {
          resolve(false);
          set(initialState);
        },
      });
    });
  },

  hide: () => set(initialState),
}));
