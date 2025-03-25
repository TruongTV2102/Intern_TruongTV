import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api, API_ROUTES } from 'src/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const token = ref(localStorage.getItem('token') || null)

  const login = async (email, password) => {
    try {
      const { data } = await api.post(API_ROUTES.LOGIN, { email, password })
      token.value = data.token
      localStorage.setItem('token', data.token)

      await fetchUser() // Sau khi login, lấy thông tin user
    } catch (error) {
      console.error('Login failed:', error)
      throw error // Ném lỗi để component có thể bắt lỗi và hiển thị thông báo
    }
  }

  const fetchUser = async () => {
    if (!token.value) return

    try {
      const { data } = await api.get(API_ROUTES.PROFILE)
      user.value = data.user
      console.log(data.user)

      localStorage.setItem('user', JSON.stringify(data.user))
    } catch (error) {
      console.log(error)

      logout()
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  // Khi store khởi tạo, nếu có token thì tự động fetch user
  if (token.value) {
    fetchUser()
  }

  return { user, token, login, fetchUser, logout }
})
