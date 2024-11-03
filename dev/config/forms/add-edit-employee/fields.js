export const departmentOptions = [
  {value: 1, label: 'Analytics'},
  {value: 2, label: 'Tech'},
];

export const positionOptions = [
  {value: 1, label: 'Junior'},
  {value: 2, label: 'Medior'},
  {value: 3, label: 'Senior'},
];

export const employeeFormFields = [
  {
    type: 'text',
    name: 'firstName',
    label: 'First Name',
    placeholder: 'Enter first name',
  },
  {
    type: 'text',
    name: 'lastName',
    label: 'Last Name',
    placeholder: 'Enter last name',
  },
  {
    type: 'date',
    name: 'dateOfBirth',
    label: 'Date of Birth',
  },
  {
    type: 'date',
    name: 'dateOfEmployment',
    label: 'Date of Employment',
  },
  {
    type: 'tel',
    name: 'phone',
    label: 'Phone Number',
    placeholder: 'Enter phone number',
  },
  {
    type: 'email',
    name: 'email',
    label: 'Email Address',
    placeholder: 'Enter email address',
  },
  {
    type: 'select',
    name: 'department',
    label: 'Department',
    options: departmentOptions,
  },
  {
    type: 'select',
    name: 'position',
    label: 'Position',
    options: positionOptions,
  },
];
