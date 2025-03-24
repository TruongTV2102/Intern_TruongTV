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
      { path: 'search', component: () => import('src/pages/SearchResults.vue') },
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
        path: 'loanrequestmanagement',
        component: () => import('src/pages/LoanRequestManagement.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'manageusers',
        component: () => import('src/pages/UserManagerment.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'returnmanagement',
        component: () => import('src/pages/ReturnRequestManagement.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'lungtung',
        component: () => import('src/pages/LungTung.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'cart',
        component: () => import('src/pages/CartView.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
