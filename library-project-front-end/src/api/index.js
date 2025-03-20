import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:3000', // Địa chỉ backend Fastify
  timeout: 1000,
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

export default api //
