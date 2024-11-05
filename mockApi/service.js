import {mockData} from './mockData.js';

import {employeeStore} from '../dev/stores/employee-store.js';

class EmployeeService {
  constructor() {
    this.initializeData();
  }

  initializeData() {
    const employees = employeeStore.getState().employees;
    if (employees.length === 0) {
      employeeStore.getState().setEmployees([...mockData]);
    }
  }

  refreshData() {
    this.initializeData();
  }

  searchInField(value, searchTerm) {
    return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
  }

  async getEmployees({
    page = 1,
    pageSize = 12,
    department = null,
    position = null,
    searchTerm = '',
    forceRefresh = false,
  } = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (forceRefresh) {
          this.refreshData();
        }

        let filteredEmployees = [...employeeStore.getState().employees];

        if (searchTerm) {
          filteredEmployees = filteredEmployees.filter((emp) => {
            return (
              this.searchInField(emp.firstName, searchTerm) ||
              this.searchInField(emp.lastName, searchTerm) ||
              this.searchInField(emp.email, searchTerm) ||
              this.searchInField(emp.phone, searchTerm)
            );
          });
        }

        if (department !== null) {
          filteredEmployees = filteredEmployees.filter(
            (emp) => emp.department === department
          );
        }

        if (position !== null) {
          filteredEmployees = filteredEmployees.filter(
            (emp) => emp.position === position
          );
        }

        const totalItems = filteredEmployees.length;
        const totalPages = Math.ceil(totalItems / pageSize);
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedEmployees = filteredEmployees.slice(
          startIndex,
          endIndex
        );

        resolve({
          data: paginatedEmployees,
          metadata: {
            totalItems,
            totalPages,
            currentPage: page,
            pageSize,
          },
        });
      }, 300);
    });
  }

  async addEmployee(employeeData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newEmployee = {
          ...employeeData,
          id: new Date().getTime(),
        };
        employeeStore.getState().addEmployee(newEmployee);
        resolve(newEmployee);
      }, 300);
    });
  }

  async updateEmployee(id, employeeData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const employees = employeeStore.getState().employees;
        const index = employees.findIndex((emp) => emp.id === id);
        if (index !== -1) {
          const updatedEmployee = {
            ...employees[index],
            ...employeeData,
            id,
          };
          employeeStore.getState().updateEmployee(id, updatedEmployee);
          resolve(updatedEmployee);
        } else {
          reject(new Error('Employee not found'));
        }
      }, 300);
    });
  }

  async deleteEmployee(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const employees = employeeStore.getState().employees;
        const index = employees.findIndex((emp) => emp.id === id);
        if (index !== -1) {
          employeeStore.getState().deleteEmployee(id);
          resolve({success: true});
        } else {
          reject(new Error('Employee not found'));
        }
      }, 300);
    });
  }
}

const employeeService = new EmployeeService();
export default employeeService;
