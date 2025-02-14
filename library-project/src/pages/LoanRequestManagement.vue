<template>
  <q-page class="tw-p-5">
    <q-table :rows="requests" :columns="columns" row-key="id">
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <!-- Duyệt yêu cầu -->
          <q-btn label="Duyệt" color="green" size="sm" @click="approveRequest(props.row)" />
          <!-- Từ chối yêu cầu -->
          <q-btn label="Từ chối" color="red" size="sm" @click="rejectRequest(props.row)" />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const requests = ref([
  { id: 1, name: 'Nguyễn Văn A', book: 'Harry Potter', status: 'Pending', date: '2024-02-13' },
  { id: 2, name: 'Trần Thị B', book: 'Doraemon', status: 'Approved', date: '2024-02-12' },
  { id: 3, name: 'Lê Văn C', book: 'Sherlock Holmes', status: 'Rejected', date: '2024-02-11' },
])

const columns = [
  { name: 'book', label: 'Tên sách', field: 'book', align: 'left' },
  { name: 'name', label: 'Họ tên người mượn', field: 'name', align: 'left' },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
  { name: 'status', label: 'Trạng thái', field: 'status', align: 'center' },
  { name: 'actions', label: 'Hành động', field: 'actions', align: 'center' },
]

// // Duyệt yêu cầu
// const approveRequest = (request) => {

// }

// // Từ chối yêu cầu
// const rejectRequest = (request) => {

// }
</script>
