<template>
  <div>
    <div v-if="authStore.currentUser">
      <p>Xin chào, {{ authStore.currentUser.name }}</p>
      <img :src="authStore.currentUser.avatar" alt="Avatar" width="50" />
      <button @click="logout">Đăng xuất</button>
    </div>
    <div v-else>
      <input v-model="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Mật khẩu" />
      <button @click="login">Đăng nhập</button>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from 'src/stores/user'
import { ref } from 'vue'

const authStore = useAuthStore()
authStore.initLoginList()

const email = ref('')
const password = ref('')

const login = () => {
  const user = authStore.loginUser(email.value, password.value)
  if (user) {
    console.log('Đăng nhập thành công', user)
  } else {
    console.log('Sai thông tin đăng nhập')
  }
}

const logout = () => {
  authStore.logoutUser()
  console.log('Đã đăng xuất')
}
</script>
