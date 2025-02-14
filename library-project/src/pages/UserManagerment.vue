<template>
  <q-page class="tw-p-5">
    <q-form>
      <div class="tw-flex tw-gap-4 tw-mb-4">
        <q-input v-model="searchQuery" placeholder="Tìm người mượn sách..." class="tw-w-1/3" />
        <q-select
          v-model="statusFilter"
          :options="statusOptions"
          class="tw-w-1/4"
          placeholder="Chọn trạng thái"
        />
        <q-btn label="Tìm kiếm" color="primary" @click="searchUsers" />
      </div>
    </q-form>

    <!-- Bảng danh sách người mượn -->
    <q-table :rows="filteredUsers" :columns="columns" row-key="id">
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn icon="lock" size="sm" flat color="red" @click="toggleAccountStatus(props.row)" />
          <q-btn icon="password" size="sm" flat @click="resetPassword(props.row)" />
          <q-btn icon="book" size="sm" flat color="blue" @click="viewLoanHistory(props.row)" />
        </q-td>
      </template>
    </q-table>

    <!-- Modal xem lịch sử mượn sách -->
    <q-dialog v-model="isLoanHistoryModalOpen">
      <q-card class="tw-w-1/2 tw-p-4 tw-shadow-lg tw-rounded-lg">
        <q-card-section>
          <q-table :rows="loanHistory" :columns="loanHistoryColumns" row-key="bookId" />
        </q-card-section>
        <q-card-actions>
          <q-btn label="Đóng" flat @click="isLoanHistoryModalOpen = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from 'src/stores/userStore'

const userStore = useAuthStore()
const isLoanHistoryModalOpen = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const statusOptions = ['Tất cả', 'Đã kích hoạt', 'Chưa kích hoạt', 'Bị khóa']
const columns = ref([
  { name: 'name', label: 'Tên người mượn', field: 'name' },
  { name: 'email', label: 'Email', field: 'email' },
  { name: 'status', label: 'Trạng thái', field: 'status' },
  { name: 'actions', label: 'Hành động', field: 'actions' },
])

const filteredUsers = computed(() => {
  return userStore.users.filter((user) => {
    const statusMatch = statusFilter.value ? user.status === statusFilter.value : true
    const queryMatch = user.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    return statusMatch && queryMatch
  })
})

// const editUser = (user) => {
//   // Mở modal chỉnh sửa thông tin người mượn
// }

// const toggleAccountStatus = (user) => {
//   // Kích hoạt hoặc khóa tài khoản người mượn
// }

// const resetPassword = (user) => {
//   // Reset mật khẩu người mượn
// }

const viewLoanHistory = () => {
  // Xem lịch sử mượn sách của người mượn
  isLoanHistoryModalOpen.value = true
}

const loanHistory = ref([
  {
    id: 1,
    name: 'Nguyễn Văn A',
    book: 'Harry Potter',
    status: 'Pending',
    borrowDate: '2024-02-13',
    returnDate: '2024-02-13',
  },
  {
    id: 2,
    name: 'Trần Thị B',
    book: 'Doraemon',
    status: 'Approved',
    borrowDate: '2024-02-12',
    returnDate: '2024-02-13',
  },
  {
    id: 3,
    name: 'Lê Văn C',
    book: 'Sherlock Holmes',
    status: 'Rejected',
    borrowDate: '2024-02-11',
    returnDate: '2024-02-13',
  },
])

const loanHistoryColumns = ref([
  { name: 'book', label: 'Tên sách', field: 'book' },
  { name: 'borrowDate', label: 'Ngày mượn', field: 'borrowDate' },
  { name: 'returnDate', label: 'Ngày trả', field: 'returnDate' },
])
</script>
