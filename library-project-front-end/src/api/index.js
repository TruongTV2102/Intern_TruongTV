import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://127.0.0.1:3000', // Địa chỉ backend Fastify
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') // Lấy token từ localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

export const API_ROUTES = {
  BOOKS: '/books',
  BOOK_DETAIL: (id) => `/books/${id}`,
  HISTORY_USER: (id) => `/history/user/${id}`,
  HISTORY_BOOK: (id) => `/history/book/${id}`,
  GENRES: '/genres',
  PROFILE: '/profile',
  CHANGE_PASSWORD: '/change-password',
  LOGIN: '/login',
  BORROW: '/borrow',
  IMPORT_CSV: '/books/import',
  USERS: '/users',
  EACH_USERS: (id) => `/users/${id}`,
}
