import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:3000', // Địa chỉ backend Fastify
  withCredentials: true, // Nếu dùng auth/cookies
})

export default api // 🔹 Xuất mặc định
