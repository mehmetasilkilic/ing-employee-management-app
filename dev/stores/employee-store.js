import {createStore} from 'zustand/vanilla';
import {persist, createJSONStorage} from 'zustand/middleware';

const initialState = {
  editingEmployee: null,
};

export const employeeStore = createStore(
  persist(
    (set) => ({
      ...initialState,

      setEditingEmployee: (employee) => {
        set({editingEmployee: employee});
        window.dispatchEvent(
          new CustomEvent('employee-updated', {
            detail: {employee},
            bubbles: true,
            composed: true,
          })
        );
      },

      clearEditingEmployee: () => {
        set({editingEmployee: null});
        window.dispatchEvent(
          new CustomEvent('employee-updated', {
            detail: {employee: null},
            bubbles: true,
            composed: true,
          })
        );
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'employee-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
