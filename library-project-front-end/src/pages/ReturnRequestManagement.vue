<template>
  <q-page class="tw-p-5">
    <h1 class="tw-text-2xl tw-font-bold tw-mb-4">Quản lý yêu cầu trả sách</h1>
    <q-table :rows="returnRequests" :columns="columns" row-key="id">
      <!-- Cột quá hạn -->
      <template v-slot:body-cell-overdue="props">
        <q-td :props="props">
          <span v-if="calculateOverdue(props.row.returnDate).isOverdue" class="tw-text-red-500">
            Quá hạn: {{ calculateOverdue(props.row.returnDate).overdueHours }}h - Phạt:
            {{ calculateOverdue(props.row.returnDate).fine }}đ
          </span>
          <span v-else class="tw-text-green-500">Đúng hạn</span>
        </q-td>
      </template>

      <!-- Cột hành động -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            label="Nhận lại sách"
            color="primary"
            @click="confirmReturn(props.row.book.id, props.row.user.email)"
          />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useLoanStore } from 'src/stores/loanStore'

const loanStore = useLoanStore()
const returnRequests = computed(() => loanStore.returnRequests || [])
const columns = [
  { name: 'id', label: 'ID', field: (row) => row.book?.id || 'N/A', align: 'left' },
  {
    name: 'bookCode',
    label: 'Mã sách',
    field: (row) => row.book?.bookcode || 'N/A',
    align: 'left',
  },
  { name: 'book', label: 'Tên sách', field: (row) => row.book?.name || 'N/A', align: 'left' },
  { name: 'author', label: 'Tác giả', field: (row) => row.book?.author || 'N/A', align: 'left' },

  { name: 'name', label: 'Họ tên người mượn', field: (row) => row.user?.name, align: 'left' },
  { name: 'email', label: 'Email', field: (row) => row.user?.email, align: 'left' },
  { name: 'borrowDate', label: 'Ngày mượn', field: (row) => row.borrowDate, align: 'center' },
  { name: 'returnDate', label: 'Ngày trả', field: (row) => row.returnDate, align: 'center' },
  { name: 'requestDate', label: 'Ngày yêu cầu', field: (row) => row.requestDate, align: 'center' },
  { name: 'status', label: 'Trạng thái', field: 'status', align: 'center' },
  { name: 'overdue', label: 'Quá hạn', field: 'overdue', align: 'center' },
  { name: 'actions', label: 'Hành động', field: 'actions', align: 'center' },
]

// Tính toán quá hạn
const calculateOverdue = (returnDate) => {
  const now = new Date()
  const dueDate = new Date(returnDate)

  if (now > dueDate) {
    const diffMs = now - dueDate // Chênh lệch thời gian (ms)
    const overdueHours = Math.ceil(diffMs / (1000 * 60 * 60)) // Chuyển sang giờ

    return {
      isOverdue: true,
      fine: overdueHours * 500, // 500đ mỗi giờ
      overdueHours,
    }
  }
  return { isOverdue: false, fine: 0, overdueHours: 0 }
}

// Xác nhận trả sách
const confirmReturn = (id, email) => {
  loanStore.approveReturnRequest(id, email)
}
</script>
