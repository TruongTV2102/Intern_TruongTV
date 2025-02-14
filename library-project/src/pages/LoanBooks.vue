<template>
  <q-page class="tw-p-5">
    <q-table :rows="borrowRequests" :columns="columns" row-key="id">
      <template v-slot:body-cell-overdue="props">
        <q-td :props="props">
          <span v-if="calculateOverdue(props.row.returnDate).isOverdue" class="tw-text-red-500">
            Quá hạn - Phạt {{ calculateOverdue(props.row.returnDate).fine }}đ
          </span>
          <span v-else class="tw-text-green-500">Đúng hạn</span>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn label="Yêu cầu trả sách" color="primary" />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const borrowRequests = ref([
  {
    id: 1,

    book: 'Harry Potter',
    borrowDate: '2025-02-10 14:00',
    returnDate: '2025-02-13 20:00',
    status: 'Pending',
  },
  {
    id: 2,

    book: 'Doraemon',
    borrowDate: '2025-02-05 10:00',
    returnDate: '2025-02-12 10:00',
    status: 'Pending',
  },
])

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'center' },
  { name: 'book', label: 'Tên sách', field: 'book', align: 'left' },
  { name: 'bookcode', label: 'Mã sách', field: 'bookcode', align: 'left' },
  { name: 'author', label: 'Tác giả', field: 'author', align: 'left' },
  { name: 'genre', label: 'Thể loại', field: 'genre', align: 'left' },
  { name: 'year', label: 'Năm xuất bản', field: 'year', align: 'left' },
  { name: 'borrowDate', label: 'Ngày mượn', field: 'borrowDate', align: 'center' },
  { name: 'returnDate', label: 'Ngày trả', field: 'returnDate', align: 'center' },
  { name: 'status', label: 'Trạng thái', field: 'status', align: 'center' },
  { name: 'actions', label: 'Hành động', field: 'actions', align: 'center' },
  { name: 'overdue', label: 'Quá hạn', field: 'overdue', align: 'center' },
]

const calculateOverdue = (returnDate) => {
  const now = new Date()
  const dueDate = new Date(returnDate)

  if (now > dueDate) {
    const diffMs = now - dueDate // Chênh lệch thời gian (ms)
    console.log(diffMs)

    const overdueHours = Math.ceil(diffMs / (1000 * 60 * 60)) // Đổi sang giờ
    console.log(overdueHours)

    return {
      isOverdue: true,
      fine: overdueHours * 500,
    }
  }
  return { isOverdue: false, fine: 0 }
}
</script>
