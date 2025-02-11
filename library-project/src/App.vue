<template>
  <router-view />
</template>

<script setup>
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)

// Thêm Pinia vào ứng dụng
app.use(createPinia())

app.mount('#app')
</script>
