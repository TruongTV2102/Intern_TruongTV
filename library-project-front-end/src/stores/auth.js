import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'boot/axios'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)

  const login = async (email, password) => {
    const { data } = await api.post('/login', { email, password })
    token.value = data.token
    localStorage.setItem('token', data.token)
    await fetchUser()
  }

  const fetchUser = async () => {
    try {
      const { data } = await api.get('/profile', {
        headers: { Authorization: `Bearer ${token.value}` },
      })
      user.value = data.user
    } catch (error) {
      console.log(error)

      logout()
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  return { user, token, login, fetchUser, logout }
})
