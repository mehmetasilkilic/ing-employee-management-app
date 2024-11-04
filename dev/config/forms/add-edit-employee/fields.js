export const getDepartmentOptions = (t) => [
  {value: 1, label: t('forms.departments.analytics')},
  {value: 2, label: t('forms.departments.tech')},
];

export const getPositionOptions = (t) => [
  {value: 1, label: t('forms.positions.junior')},
  {value: 2, label: t('forms.positions.medior')},
  {value: 3, label: t('forms.positions.senior')},
];

export const getEmployeeFormFields = (t) => [
  {
    type: 'text',
    name: 'firstName',
    label: t('forms.employeeForm.firstName.label'),
    placeholder: t('forms.employeeForm.firstName.placeholder'),
  },
  {
    type: 'text',
    name: 'lastName',
    label: t('forms.employeeForm.lastName.label'),
    placeholder: t('forms.employeeForm.lastName.placeholder'),
  },
  {
    type: 'date',
    name: 'dateOfBirth',
    label: t('forms.employeeForm.dateOfBirth.label'),
  },
  {
    type: 'date',
    name: 'dateOfEmployment',
    label: t('forms.employeeForm.dateOfEmployment.label'),
  },
  {
    type: 'tel',
    name: 'phone',
    label: t('forms.employeeForm.phone.label'),
    placeholder: t('forms.employeeForm.phone.placeholder'),
  },
  {
    type: 'email',
    name: 'email',
    label: t('forms.employeeForm.email.label'),
    placeholder: t('forms.employeeForm.email.placeholder'),
  },
  {
    type: 'select',
    name: 'department',
    label: t('forms.employeeForm.department.label'),
    options: getDepartmentOptions(t),
  },
  {
    type: 'select',
    name: 'position',
    label: t('forms.employeeForm.position.label'),
    options: getPositionOptions(t),
  },
];
