<template>
  <q-page class="tw-p-5">
    <q-table :rows="borrowHistory" :columns="columns" row-key="id">
      <!-- Hiển thị trạng thái quá hạn -->
      <template v-slot:body-cell-overdue="props">
        <q-td :props="props"> </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const borrowHistory = ref([
  {
    id: 1,

    book: 'Harry Potter',
    borrowDate: '2025-02-01 10:00',
    returnDate: '2025-02-10 10:00',
    status: 'Returned',
  },
  {
    id: 2,

    book: 'Doraemon',
    borrowDate: '2025-01-25 15:00',
    returnDate: '2025-02-05 15:00',
    status: 'Returned',
  },
  {
    id: 3,

    book: 'Sherlock Holmes',
    borrowDate: '2025-02-05 08:00',
    returnDate: '2025-02-12 08:00',
    status: 'Returned',
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
]
</script>
