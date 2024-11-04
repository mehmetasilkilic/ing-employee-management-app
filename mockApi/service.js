/* eslint-disable no-undef */

import {mockData} from './mockData';

class EmployeeService {
  constructor() {
    this.employees = JSON.parse(localStorage.getItem('employees')) || [];
    // Initialize with mock data if empty
    if (this.employees.length === 0) {
      this.employees = mockData;
      this.saveToStorage();
    }
  }

  saveToStorage() {
    localStorage.setItem('employees', JSON.stringify(this.employees));
  }

  // Get paginated employees with optional filters
  async getEmployees({
    page = 1,
    pageSize = 12,
    department = null,
    position = null,
  } = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredEmployees = [...this.employees];

        // Apply department filter
        if (department !== null) {
          filteredEmployees = filteredEmployees.filter(
            (emp) => emp.department === department
          );
        }

        // Apply position filter
        if (position !== null) {
          filteredEmployees = filteredEmployees.filter(
            (emp) => emp.position === position
          );
        }

        // Calculate pagination
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

  // Add new employee
  async addEmployee(employeeData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newEmployee = {
          ...employeeData,
          id: new Date().getTime(), // Using timestamp as unique ID
        };

        this.employees.push(newEmployee);
        this.saveToStorage();
        resolve(newEmployee);
      }, 300);
    });
  }

  // Update existing employee
  async updateEmployee(id, employeeData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.employees.findIndex((emp) => emp.id === id);
        if (index !== -1) {
          const updatedEmployee = {
            ...this.employees[index],
            ...employeeData,
            id, // Ensure ID doesn't change
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

  // Delete employee
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

// Create a singleton instance
const employeeService = new EmployeeService();
export default employeeService;
