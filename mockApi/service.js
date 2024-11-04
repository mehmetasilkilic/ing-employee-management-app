/* eslint-disable no-undef */
import {mockData} from './mockData.js';

class EmployeeService {
  constructor() {
    this.initializeData();
  }

  initializeData() {
    // Always check localStorage first
    const storedData = localStorage.getItem('employees');
    if (storedData) {
      this.employees = JSON.parse(storedData);
    } else {
      this.employees = [...mockData];
      this.saveToStorage();
    }
  }

  saveToStorage() {
    localStorage.setItem('employees', JSON.stringify(this.employees));
    // Update the mock data for persistence
    mockData.length = 0;
    mockData.push(...this.employees);
  }

  // Method to force refresh data from storage
  refreshData() {
    this.initializeData();
  }

  // Get paginated employees with optional filters
  async getEmployees({
    page = 1,
    pageSize = 12,
    department = null,
    position = null,
    forceRefresh = false,
  } = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Refresh data if requested
        if (forceRefresh) {
          this.refreshData();
        }

        let filteredEmployees = [...this.employees];

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
        this.employees.unshift(newEmployee);
        this.saveToStorage();
        resolve(newEmployee);
      }, 300);
    });
  }

  async updateEmployee(id, employeeData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.employees.findIndex((emp) => emp.id === id);
        if (index !== -1) {
          const updatedEmployee = {
            ...this.employees[index],
            ...employeeData,
            id,
          };
          this.employees[index] = updatedEmployee;
          this.saveToStorage();
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
        const index = this.employees.findIndex((emp) => emp.id === id);
        if (index !== -1) {
          this.employees.splice(index, 1);
          this.saveToStorage();
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
