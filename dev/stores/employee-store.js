import {createStore} from 'zustand/vanilla';
import {persist, createJSONStorage} from 'zustand/middleware';

const initialState = {
  employees: [],
  editingEmployee: null,
};

export const employeeStore = createStore(
  persist(
    (set) => ({
      ...initialState,

      setEmployees: (employees) => {
        set({employees});
      },

      addEmployee: (employee) => {
        set((state) => ({
          employees: [employee, ...state.employees],
        }));
      },

      updateEmployee: (id, updatedEmployee) => {
        set((state) => ({
          employees: state.employees.map((emp) =>
            emp.id === id ? {...emp, ...updatedEmployee} : emp
          ),
        }));
      },

      deleteEmployee: (id) => {
        set((state) => ({
          employees: state.employees.filter((emp) => emp.id !== id),
        }));
      },

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
