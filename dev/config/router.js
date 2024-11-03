import {Router} from '@vaadin/router';

export const routes = [
  {
    path: '/',
    component: 'user-list',
    action: async () => {
      await import('../views/user-list.js');
    },
  },
  {
    path: '/add-user',
    component: 'add-user',
    action: async () => {
      await import('../views/add-user.js');
    },
  },
  {
    path: '/edit-user',
    component: 'edit-user',
    action: async () => {
      await import('../views/edit-user.js');
    },
  },
];

export const router = new Router();
router.setRoutes(routes);
