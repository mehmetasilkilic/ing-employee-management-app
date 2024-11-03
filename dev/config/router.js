import {Router} from '@vaadin/router';

import '../views/add-employee-page.js';
import '../views/edit-employee-page.js';
import '../views/employees-page.js';
import '../views/not-found-page.js';

export const router = new Router();

export const routes = [
  {
    path: '/',
    component: 'employees-page',
  },
  {
    path: '/add-employee',
    component: 'add-employee-page',
  },
  {
    path: '/edit-employee/:id',
    component: 'edit-employee-page',
  },
  {
    path: '(.*)',
    component: 'not-found-page',
  },
];
