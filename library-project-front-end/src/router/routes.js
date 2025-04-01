const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/HomePage.vue') },
      { path: 'login', component: () => import('src/pages/LoginPage.vue') },
      { path: 'register', component: () => import('src/pages/RegisterPage.vue') },
      { path: 'forgotpassword', component: () => import('src/pages/ForgotPassword.vue') },
      {
        path: 'profile',
        component: () => import('src/pages/ProfilePage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'changepassword',
        component: () => import('src/pages/ChangePassword.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'managebooks',
        component: () => import('src/pages/BookManagement.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'history',
        component: () => import('src/pages/BorrowHistory.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'adminhistorybooks',
        component: () => import('src/pages/AdminHistoryBooks.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'manageusers',
        component: () => import('src/pages/UserManagerment.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'bookdetails',
        component: () => import('src/pages/BookDetails.vue'),
        meta: { requiresAuth: true },
      },

      {
        path: 'cart',
        component: () => import('src/pages/CartView.vue'),
        meta: { requiresAuth: true },
      },

      {
        path: 'pageone',
        component: () => import('src/pages/PageOne.vue'),
      },

      {
        path: 'pagetwo',
        component: () => import('src/pages/PageTwo.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
