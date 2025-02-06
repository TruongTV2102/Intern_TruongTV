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
      { path: 'lungtung', component: () => import('src/pages/LungTung.vue') },
      {
        path: 'changepassword',
        component: () => import('src/pages/ChangePassword.vue'),
        meta: { requiresAuth: true },
      },
      // { path: 'book/:id', component: () => import('src/pages/BookDetails.vue') }, // Route chi tiết sách
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
  // {
  //   path: '/lungtung',
  //   component: () => import('src/pages/LungTung.vue'),
  // },
]

export default routes
