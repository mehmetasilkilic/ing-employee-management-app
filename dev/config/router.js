import {Router} from '@vaadin/router';

export const routes = [
  {
    path: '/',
    component: 'employees-page',
    action: async () => {
      await import('../views/employees-page.js');
    },
  },
  {
    path: '/add-employee',
    component: 'add-employee-page',
    action: async () => {
      await import('../views/add-employee-page.js');
    },
  },
  {
    path: '/edit-employee/:id',
    component: 'edit-employee-page',
    action: async () => {
      await import('../views/edit-employee-page.js');
    },
  },
];

export const router = new Router();
router.setRoutes(routes);
