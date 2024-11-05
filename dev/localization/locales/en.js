export default {
  translation: {
    nav: {
      employees: 'Employees',
      addNew: 'Add New',
    },
    common: {
      ok: 'Okay',
      proceed: 'Proceed',
      cancel: 'Cancel',
      success: 'Success',
      error: 'Error',
      areYouSure: 'Are You Sure?',
      actions: 'Actions',
      submit: 'Submit',
      selectAll: 'Select All',
      loading: 'Loading...',
    },
    employees: {
      title: 'Employee List',
      deleteConfirmation: 'Are you sure you want to delete the employee?',
      deleteError: 'Error deleting employee. Please try again.',
      deleteSuccess: 'Employee deleted successfully.',
      search: 'Search...',
    },
    addEmployee: {
      title: 'Add New Employee',
    },
    editEmployee: {
      title: 'Edit Employee',
      saveSuccess: 'Changes in employee info successfully submited',
      saveConfirmation:
        'Are you sure you want to save changes for the employee?',
      saveError: 'Error saving employee changes. Please try again.',
    },
    forms: {
      departments: {
        analytics: 'Analytics',
        tech: 'Tech',
      },
      positions: {
        junior: 'Junior',
        medior: 'Medior',
        senior: 'Senior',
      },
      employeeForm: {
        firstName: {
          label: 'First Name',
          placeholder: 'Enter first name',
        },
        lastName: {
          label: 'Last Name',
          placeholder: 'Enter last name',
        },
        dateOfBirth: {
          label: 'Date of Birth',
        },
        dateOfEmployment: {
          label: 'Date of Employment',
        },
        phone: {
          label: 'Phone Number',
          placeholder: 'Enter phone number',
        },
        email: {
          label: 'Email Address',
          placeholder: 'Enter email address',
        },
        department: {
          label: 'Department',
        },
        position: {
          label: 'Position',
        },
      },
    },
    validation: {
      required: 'This field is required',
      email: {
        required: 'Email is required',
        invalid: 'Please enter a valid email address',
      },
      phone: {
        required: 'Phone number is required',
        invalid: 'Please enter a valid phone number',
      },
      firstName: {
        required: 'First name is required',
        min: 'First name must be at least 2 characters',
        max: 'First name must be less than 50 characters',
      },
      lastName: {
        required: 'Last name is required',
        min: 'Last name must be at least 2 characters',
        max: 'Last name must be less than 50 characters',
      },
      dateOfBirth: {
        required: 'Date of birth is required',
        tooYoung: 'Employee must be at least 18 years old',
      },
      dateOfEmployment: {
        required: 'Employment date is required',
        futureDate: 'Employment date cannot be in the future',
      },
      department: {
        required: 'Department is required',
      },
      position: {
        required: 'Position is required',
      },
    },
  },
};
