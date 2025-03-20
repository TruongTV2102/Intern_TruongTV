<template>
  <q-page class="tw-p-5">
    <h1 class="tw-text-2xl tw-font-bold tw-mb-4">Quản lý yêu cầu trả sách</h1>

    <q-table :rows="returnRequests" :columns="columns" row-key="id" v-if="returnRequests.length">
      <!-- Cột quá hạn -->
      <template v-slot:body-cell-overdue_fine="props">
        <q-td :props="props">
          <span v-if="props.row.overdue_fine > 0" class="tw-text-red-500">
            Phí trễ hạn: {{ props.row.overdue_fine }}đ
          </span>
          <span v-else class="tw-text-green-500">Đúng hạn</span>
        </q-td>
      </template>

      <!-- Cột hành động -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn label="Nhận lại sách" color="primary" @click="openConfirmDialog(props.row)" />
        </q-td>
      </template>
    </q-table>

    <q-banner v-else class="tw-bg-yellow-100 tw-text-yellow-800 tw-p-3 tw-rounded-lg">
      Không có yêu cầu trả sách nào.
    </q-banner>

    <!-- Dialog xác nhận nhận lại sách -->
    <q-dialog v-model="confirmDialogVisible">
      <q-card class="tw-p-5">
        <q-card-section>
          <h2 class="tw-text-xl tw-font-bold">Xác nhận nhận lại sách</h2>
          <p>
            Bạn có chắc chắn nhận lại sách
            <span class="tw-font-semibold">{{ selectedBook?.book_title }}</span>
            từ <span class="tw-font-semibold">{{ selectedBook?.user_email }}</span
            >?
          </p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Hủy" color="grey" flat @click="confirmDialogVisible = false" />
          <q-btn label="Xác nhận" color="primary" @click="confirmReturn" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { toast } from 'src/plugins/toast'
import axios from 'axios'

const confirmDialogVisible = ref(false)
const selectedBook = ref(null)
const returnRequests = ref([])

// Cấu hình cột bảng
const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'book', label: 'Tên sách', field: 'book_name', align: 'left' },
  { name: 'author', label: 'Tác giả', field: 'book_author', align: 'left' },
  { name: 'name', label: 'Người mượn', field: 'user_name', align: 'left' },
  { name: 'email', label: 'Email', field: 'user_email', align: 'left' },
  { name: 'borrowDate', label: 'Ngày mượn', field: 'borrow_date', align: 'center' },
  { name: 'returnDate', label: 'Ngày trả', field: 'return_date', align: 'center' },
  { name: 'overdue_fine', label: 'Phí trễ hạn', field: 'overdue_fine', align: 'center' },
  { name: 'actions', label: 'Hành động', field: 'actions', align: 'center' },
]

// Lấy danh sách yêu cầu trả sách
const fetchReturnRequests = async () => {
  try {
    const { data } = await axios.get('http://localhost:3000/return-requests')
    returnRequests.value = data
  } catch (error) {
    toast.error('Lỗi khi tải danh sách yêu cầu trả sách')
    console.error(error)
  }
}

// Mở dialog xác nhận
const openConfirmDialog = (row) => {
  selectedBook.value = row
  confirmDialogVisible.value = true
}

// Xác nhận trả sách
const confirmReturn = async () => {
  if (!selectedBook.value) return
  try {
    await axios.post('http://localhost:3000/confirm-return', {
      id: selectedBook.value.id,
    })
    toast.info(`Nhận lại sách thành công.`)
    confirmDialogVisible.value = false
    fetchReturnRequests() // Cập nhật danh sách sau khi xác nhận
  } catch (error) {
    toast.error('Lỗi khi nhận lại sách')
    console.error(error)
  }
}

onMounted(fetchReturnRequests)
</script>
