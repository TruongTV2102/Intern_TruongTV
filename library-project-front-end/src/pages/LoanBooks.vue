<template>
  <q-page class="tw-p-5">
    <h1 class="tw-text-2xl tw-font-bold tw-mb-4">Danh sách yêu cầu mượn sách</h1>
    <q-table :rows="loanRequests" :columns="columns" row-key="id">
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            label="Trả sách"
            color="green"
            size="sm"
            class="tw-mr-2"
            @click="requestReturn(props.row)"
            :disable="props.row.status === 'pending'"
          />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { useLoanStore } from 'src/stores/loanStore'
import { useUserStore } from 'src/stores/userStore'
import { computed } from 'vue'

const loanStore = useLoanStore()
const userStore = useUserStore()
const loanRequests = computed(() => loanStore.loanRequests)

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
  { name: 'borrowDate', label: 'Ngày mượn', field: (row) => row.borrowDate, align: 'center' },
  { name: 'returnDate', label: 'Ngày trả', field: (row) => row.returnDate, align: 'center' },
  { name: 'requestDate', label: 'Ngày yêu cầu', field: (row) => row.requestDate, align: 'center' },
  { name: 'status', label: 'Trạng thái', field: 'status', align: 'center' },
  { name: 'actions', label: 'Hành động', field: 'actions', align: 'center' },
]

const requestReturn = (row) => {
  const returnRequest = {
    user: userStore.currentUser,
    book: row.book,
    borrowDate: row.borrowDate,
    returnDate: row.returnDate,
    requestDate: new Date().toISOString().split('T')[0], // Chỉ lấy ngày
    status: 'Pending', // Trạng thái chờ xác nhận
  }

  loanStore.returnRequestsBook(returnRequest) // Gửi yêu cầu trả sách
}
</script>
