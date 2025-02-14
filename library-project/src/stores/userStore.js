import { defineStore } from 'pinia'

const STORAGE_KEY = 'loginList'
const USER_KEY = 'user'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    users: JSON.parse(localStorage.getItem(STORAGE_KEY)) || [],
    currentUser: JSON.parse(localStorage.getItem(USER_KEY)) || null,
  }),
  actions: {
    initLoginList() {
      if (!localStorage.getItem(STORAGE_KEY)) {
        const defaultUsers = [
          {
            email: 'admin@gmail.com',
            password: 'admin123',
            name: 'Admin',
            avatar: 'https://i.pravatar.cc/150?img=1',
            role: 'admin',
          },
          {
            email: 'truongtv@gmail.com',
            password: '1234567',
            name: 'Trường TV',
            avatar:
              'https://haycafe.vn/wp-content/uploads/2021/11/Anh-avatar-dep-chat-lam-hinh-dai-dien-600x600.jpg',
            role: 'admin',
          },
          {
            email: 'example1@gmail.com',
            password: 'password1',
            name: 'Nguyễn Văn A',
            avatar: 'https://i.pravatar.cc/150?img=2',
            role: 'user',
          },
          {
            email: 'example2@gmail.com',
            password: 'password2',
            name: 'Trần Thị B',
            avatar: 'https://i.pravatar.cc/150?img=3',
            role: 'user',
          },
          {
            email: 'example3@gmail.com',
            password: 'password3',
            name: 'Lê Văn C',
            avatar: 'https://i.pravatar.cc/150?img=4',
            role: 'user',
          },
        ]
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers))
        this.users = defaultUsers
      }
    },
    loginUser(email, password) {
      const user = this.users.find((u) => u.email === email && u.password === password)
      if (user) {
        const userData = {
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
        }
        localStorage.setItem(USER_KEY, JSON.stringify(userData))
        this.currentUser = userData
        return userData
      }
      return null
    },
    setCurrentUser(user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user))
      this.currentUser = user
    },
    logoutUser() {
      localStorage.removeItem(USER_KEY)
      localStorage.removeItem('loginlist')
      this.currentUser = null
    },
    changePassword(oldPassword, newPassword) {
      if (!this.currentUser) return false

      const userIndex = this.users.findIndex((u) => u.email === this.currentUser.email)
      if (userIndex === -1 || this.users[userIndex].password !== oldPassword) {
        return false
      }

      this.users[userIndex].password = newPassword
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.users))
      return true
    },
  },
})
