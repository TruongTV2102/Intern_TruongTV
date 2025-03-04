import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'loginList'
const USER_KEY = 'user'

export const useUserStore = defineStore('user', () => {
  const users = ref(JSON.parse(localStorage.getItem(STORAGE_KEY)) || [])
  const currentUser = ref(JSON.parse(localStorage.getItem(USER_KEY)) || null)

  const initLoginList = () => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const defaultUsers = [
        {
          id: 1,
          email: 'admin@gmail.com',
          password: 'admin123',
          name: 'Admin',
          avatar: 'https://i.pravatar.cc/150?img=1',
          role: 'admin',
        },
        {
          id: 2,
          email: 'truongtv@gmail.com',
          password: '1234567',
          name: 'Trường TV',
          avatar:
            'https://haycafe.vn/wp-content/uploads/2021/11/Anh-avatar-dep-chat-lam-hinh-dai-dien-600x600.jpg',
          role: 'admin',
        },
        {
          id: 3,
          email: 'example1@gmail.com',
          password: 'password1',
          name: 'Nguyễn Văn A',
          avatar: 'https://i.pravatar.cc/150?img=2',
          role: 'user',
        },
        {
          id: 4,
          email: 'example2@gmail.com',
          password: 'password2',
          name: 'Trần Thị B',
          avatar: 'https://i.pravatar.cc/150?img=3',
          role: 'user',
        },
        {
          id: 5,
          email: 'example3@gmail.com',
          password: 'password3',
          name: 'Lê Văn C',
          avatar: 'https://i.pravatar.cc/150?img=4',
          role: 'user',
        },
        {
          id: 6,
          email: 'user@gmail.com',
          password: '1234567',
          name: 'Lê Văn C',
          avatar: 'https://i.pravatar.cc/150?img=4',
          role: 'user',
        },
      ]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers))
      users.value = defaultUsers
    }
  }

  const loginUser = (email, password) => {
    const user = users.value.find((u) => u.email === email && u.password === password)
    if (user) {
      const userData = {
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
      }
      localStorage.setItem(USER_KEY, JSON.stringify(userData))
      currentUser.value = userData
      return userData
    }
    return null
  }

  const setCurrentUser = (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    currentUser.value = user
  }

  const logoutUser = () => {
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(STORAGE_KEY)
    currentUser.value = null
  }

  const changePassword = (oldPassword, newPassword) => {
    if (!currentUser.value) return false

    const userIndex = users.value.findIndex((u) => u.email === currentUser.value.email)
    if (userIndex === -1 || users.value[userIndex].password !== oldPassword) {
      return false
    }

    users.value[userIndex].password = newPassword
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users.value))
    return true
  }

  const isAuthenticated = computed(() => !!currentUser.value)

  return {
    users,
    currentUser,
    initLoginList,
    loginUser,
    setCurrentUser,
    logoutUser,
    changePassword,
    isAuthenticated,
  }
})
