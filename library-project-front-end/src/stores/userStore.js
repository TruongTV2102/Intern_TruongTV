import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref(null)

  // Đăng nhập & lưu token
  const loginUser = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:3000/login', { email, password })

      // Lưu token vào localStorage
      localStorage.setItem('token', response.data.token)

      // Gán thông tin user vào state
      currentUser.value = response.data.user
      return true
    } catch (error) {
      console.error('Đăng nhập thất bại:', error)
      return false
    }
  }

  // Lấy thông tin user khi tải trang
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await axios.get('http://localhost:3000/me', {
        headers: { Authorization: `Bearer ${token}` },
      })

      currentUser.value = response.data
    } catch (error) {
      console.error('Không thể lấy thông tin user:', error)
      currentUser.value = null
    }
  }

  // Đăng xuất
  const logoutUser = () => {
    localStorage.removeItem('token')
    currentUser.value = null
  }

  return { currentUser, loginUser, fetchUser, logoutUser }
})
