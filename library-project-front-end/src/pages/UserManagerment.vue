<template>
  <div class="tw-p-4">
    <h1 class="tw-text-xl tw-font-semibold tw-mb-4">Quản lý Người Dùng</h1>

    <div class="tw-flex tw-justify-between tw-items-center tw-mb-4">
      <q-input v-model="searchQuery" label="Tìm kiếm..." outlined dense class="tw-w-1/3" />
    </div>

    <q-table :rows="users" :columns="columns" row-key="id" flat bordered>
      <template v-slot:body-cell-avatar="props">
        <q-td :props="props">
          <q-img
            :src="props.row.avatar || defaultImage"
            class="tw-w-16 tw-h-24 tw-object-cover tw-rounded-md"
          />
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="tw-space-x-2">
          <q-btn
            class="tw-w-[90px]"
            @click="openHistoryDialog(props.row)"
            color="blue"
            dense
            unelevated
          >
            Xem lịch sử
          </q-btn>
          <q-btn
            class="tw-w-[90px]"
            @click="openToggleDialog(props.row)"
            :color="props.row.is_active ? 'negative' : 'positive'"
            dense
            unelevated
          >
            {{ props.row.is_active ? 'Vô hiệu hóa' : 'Kích hoạt' }}
          </q-btn>
          <q-btn
            class="tw-w-[90px]"
            @click="openDeleteDialog(props.row)"
            color="red"
            dense
            unelevated
          >
            Xóa
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- Dialog Lịch Sử Mượn -->
    <q-dialog v-model="historyDialogVisible">
      <q-card class="tw-w-[600px]">
        <q-card-section>
          <div class="tw-text-lg tw-font-semibold">
            Lịch sử mượn sách của {{ selectedUser?.email }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-table :rows="borrowHistory" :columns="historyColumns" row-key="id" flat bordered>
            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="tw-flex tw-gap-2">
                <q-btn @click="returnBook(props.row)" color="green" dense unelevated
                  >Trả sách</q-btn
                >
                <q-btn @click="reportLostBook(props.row)" color="orange" dense unelevated
                  >Báo mất</q-btn
                >
              </q-td>
            </template>
          </q-table>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Đóng" color="grey" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api, API_ROUTES } from 'src/api'
import { toast } from 'src/plugins/toast'

const users = ref([])
const searchQuery = ref('')
const historyDialogVisible = ref(false)
const borrowHistory = ref([])
const selectedUser = ref(null)

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'avatar', label: 'Avatar', field: 'avatar', align: 'center', sortable: false },
  { name: 'email', label: 'Email', field: 'email', align: 'left', sortable: true },
  { name: 'name', label: 'Tên', field: 'name', align: 'left', sortable: true },
  { name: 'name', label: 'Tên', field: 'name', align: 'left', sortable: true },
  { name: 'birthday', label: 'Ngày sinh', field: 'bỉthday', align: 'center', sortable: false },
  { name: 'phone', label: 'Số điện thoại', field: 'phone', align: 'left', sortable: false },

  { name: 'actions', label: 'Thao tác', align: 'center' },
]

const historyColumns = [
  { name: 'book_name', label: 'Tên sách', field: 'title', align: 'left', sortable: true },
  { name: 'borrow_date', label: 'Ngày mượn', field: 'borrow_date', align: 'left', sortable: true },
  { name: 'due_date', label: 'Ngày trả dự kiến', field: 'due_date', align: 'left', sortable: true },
  {
    name: 'return_date',
    label: 'Ngày trả thực tế',
    field: 'return_date',
    align: 'left',
    sortable: true,
  },
  { name: 'fine', label: 'Tiền phạt', field: 'fine', align: 'left', sortable: true },
  { name: 'actions', label: 'Thao tác', align: 'center' },
]

// const filteredUsers = computed(() => {
//   return users.value.filter(
//     (user) =>
//       user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchQuery.value.toLowerCase()),
//   )
// })

const fetchUsers = async () => {
  try {
    const response = await api.get(API_ROUTES.USERS)
    users.value = response.data
  } catch (error) {
    console.error(error)
    toast.error('Lỗi khi tải danh sách người dùng')
  }
}

const openHistoryDialog = async (user) => {
  selectedUser.value = user
  try {
    const response = await api.get(API_ROUTES.HISTORY_USER(user.id))
    borrowHistory.value = response.data.history
    historyDialogVisible.value = true
  } catch (error) {
    console.error(error)
    toast.error('Lỗi khi tải lịch sử mượn sách')
  }
}

const returnBook = async (book) => {
  try {
    await api.put(`${API_ROUTES.RETURN_BOOK}/${book.id}`)
    toast.success('Đã trả sách thành công')
    openHistoryDialog(selectedUser.value) // Refresh lại lịch sử
  } catch (error) {
    console.error(error)
    toast.error('Lỗi khi trả sách')
  }
}

const reportLostBook = async (book) => {
  try {
    await api.put(`${API_ROUTES.REPORT_LOST_BOOK}/${book.id}`)
    toast.warning('Đã báo mất sách')
    openHistoryDialog(selectedUser.value) // Refresh lại lịch sử
  } catch (error) {
    console.error(error)
    toast.error('Lỗi khi báo mất sách')
  }
}

onMounted(fetchUsers)
</script>
