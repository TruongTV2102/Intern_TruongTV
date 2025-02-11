// src/stores/userStore.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    isAuthenticated: false,
    user: null,
    fakeAccounts: [
      {
        email: 'admin@example.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin',
      },
      {
        email: 'user1@example.com',
        password: 'password1',
        name: 'User One',
        role: 'user',
      },
    ],
  }),
  actions: {
    loginUser(email, password) {
      const account = this.fakeAccounts.find(
        (acc) => acc.email === email && acc.password === password,
      )
      if (account) {
        this.isAuthenticated = true
        this.user = account
        return account
      }
      return null
    },
    getCurrentUser() {
      return this.isAuthenticated ? this.user : null
    },
    logoutUser() {
      this.isAuthenticated = false
      this.user = null
    },
  },
})
