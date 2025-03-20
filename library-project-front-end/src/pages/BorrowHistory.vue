<template>
  <q-page class="q-pa-md">
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h6">Lịch sử mượn sách</div>
      </q-card-section>

      <!-- Nếu là admin, hiển thị dropdown chọn user -->
      <q-card-section v-if="authStore.user.role === 'admin'">
        <q-select
          v-model="selectedUser"
          :options="users"
          label="Chọn người dùng"
          emit-value
          map-options
          option-value="id"
          option-label="name"
          @update:model-value="fetchHistory"
        />
      </q-card-section>

      <!-- Hiển thị loading -->
      <q-card-section v-if="loading">
        <q-spinner color="primary" size="2em" />
      </q-card-section>

      <!-- Hiển thị lỗi -->
      <q-card-section v-if="error">
        <q-banner class="bg-red text-white">{{ error }}</q-banner>
      </q-card-section>

      <!-- Hiển thị bảng lịch sử -->
      <q-card-section v-else>
        <q-table :rows="history" :columns="columns" row-key="book_id" dense />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import axios from 'axios'

const authStore = useAuthStore()
const token = authStore.token

const history = ref([])
const loading = ref(false)
const error = ref(null)
const selectedUser = ref(authStore.user.id)
const users = ref([]) // Danh sách user cho admin chọn

const columns = [
  { name: 'title', label: 'Tên Sách', field: 'title', align: 'left' },
  { name: 'status', label: 'Trạng Thái', field: 'status', align: 'left' },
  { name: 'borrow_date', label: 'Ngày Mượn', field: 'borrow_date', align: 'left' },
  { name: 'return_date', label: 'Ngày Trả', field: 'return_date', align: 'left' },
]

// Hàm lấy lịch sử mượn sách
async function fetchHistory() {
  loading.value = true
  error.value = null
  try {
    console.log('Gọi API:', `/history/user/${selectedUser.value}`)

    const response = await axios.get(`http://localhost:3000/history/user/${selectedUser.value}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    console.log('Response data:', response.data)

    history.value = response.data
    console.log(history.value)
  } catch (err) {
    error.value = err.response?.data?.message || 'Lỗi khi tải dữ liệu'
  } finally {
    loading.value = false
  }
}

// Nếu là admin, lấy danh sách user
async function fetchUsers() {
  try {
    const response = await axios.get('http://localhost:3000/users', {
      headers: { Authorization: `Bearer ${token}` },
    })
    users.value = response.data
  } catch {
    users.value = []
  }
}

onMounted(() => {
  if (authStore.user.role === 'admin') fetchUsers()
  fetchHistory()
})
</script>
