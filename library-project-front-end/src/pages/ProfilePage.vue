<script setup>
import { ref, onMounted } from 'vue'
import api from 'src/api'

const message = ref('')

onMounted(async () => {
  try {
    const response = await api.get('/')
    message.value = response.data.message // Lấy dữ liệu từ backend
  } catch (error) {
    console.error('Lỗi khi gọi API:', error)
  }
})
</script>

<template>
  <q-page class="flex flex-center">
    <q-card class="p-4">
      <q-card-section>
        <q-icon name="cloud_done" size="lg" color="green" />
        <div class="text-h6">{{ message }}</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>
