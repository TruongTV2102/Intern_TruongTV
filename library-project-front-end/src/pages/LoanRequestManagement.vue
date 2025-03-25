<template>
  <q-page class="tw-p-4">
    <h1 class="tw-text-2xl tw-font-bold tw-mb-4">Quản lý lịch sử mượn sách</h1>

    <!-- Thanh tìm kiếm -->
    <BookSearchBar @search="updateSearch" />

    <!-- Bảng hiển thị lịch sử mượn sách -->
    <q-table
      style="height: 750px"
      flat
      bordered
      :rows="borrowHistory"
      :columns="columns"
      row-key="id"
      virtual-scroll
      :rows-per-page-options="[20]"
    >
      <template v-slot:header-cell-status>
        <q-th>
          Trạng thái
          <q-btn flat dense icon="filter_list">
            <q-menu>
              <q-list>
                <q-item
                  clickable
                  v-for="option in statusOptions"
                  :key="option.value"
                  @click="updateStatusFilter(option.value)"
                >
                  <q-item-section>{{ option.label }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-th>
      </template>

      <template v-slot:body-cell-image="props">
        <q-td :props="props">
          <q-img
            :src="props.row.cover_image_url || defaultImage"
            class="tw-w-16 tw-h-24 tw-object-cover tw-rounded-md"
          />
        </q-td>
      </template>

      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-badge :color="statusColors[props.row.status]">{{
            getStatusLabel(props.row.status)
          }}</q-badge>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <template v-if="props.row.status === 'Pending'">
            <q-btn color="green" label="Duyệt" dense @click="updateStatus(props.row, 'Approved')" />
            <q-btn
              color="red"
              label="Từ chối"
              dense
              class="tw-ml-2"
              @click="updateStatus(props.row, 'Rejected')"
            />
          </template>

          <template v-else-if="props.row.status === 'Approved'">
            <q-btn color="blue" label="Trả sách" dense @click="handleReturnBook(props.row)" />
            <q-btn
              color="red"
              label="Mất sách"
              dense
              class="tw-ml-2"
              @click="updateStatus(props.row, 'Lost')"
            />
          </template>
        </q-td>
      </template>
    </q-table>

    <!-- Phân trang -->
    <PaginationPage
      v-model:page="page"
      :total="total"
      :limit="limit"
      @update:page="fetchBorrowHistory"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'src/api'
import BookSearchBar from 'src/components/BookSearchBar.vue'
import PaginationPage from 'src/components/PaginationPage.vue'
import { formatDate } from 'src/utils/dateUtils'

const borrowHistory = ref([])
const total = ref(0)
const page = ref(1)
const limit = 5
const search = ref({})
const defaultImage =
  'https://res.cloudinary.com/dp39ryiip/image/upload/v1742269732/ooe26eg7synamgmmycgk.jpg'

const columns = [
  { name: 'image', label: 'Ảnh', align: 'center', field: 'cover_image_url', sortable: false },
  { name: 'title', label: 'Tên sách', align: 'left', field: 'title', sortable: true },
  { name: 'user', label: 'Người mượn', align: 'left', field: 'user_name', sortable: true },
  {
    name: 'borrow_date',
    label: 'Ngày mượn',
    align: 'center',
    field: (row) => formatDate(row.borrow_date),
    sortable: true,
  },
  {
    name: 'due_date',
    label: 'Ngày trả dự kiến',
    align: 'center',
    field: (row) => formatDate(row.due_date),
    sortable: true,
  },
  {
    name: 'return_date',
    label: 'Ngày trả thực tế',
    align: 'center',
    field: (row) => formatDate(row.return_date),
    sortable: true,
  },
  {
    name: 'fine',
    label: 'Tiền phạt (VNĐ)',
    align: 'center',
    field: (row) => formatCurrency(calculateFine(row)),
    sortable: true,
  },
  { name: 'status', label: 'Trạng thái', align: 'center', field: 'status', sortable: true },
  { name: 'actions', label: 'Hành động', align: 'center', field: 'actions', sortable: false },
]

const statusOptions = [
  { label: 'Đang chờ', value: 'Pending' },
  { label: 'Đã duyệt', value: 'Approved' },
  { label: 'Đã trả', value: 'Returned' },
  { label: 'Mất', value: 'Lost' },
  { label: 'Bị từ chối', value: 'Rejected' },
]

const fetchBorrowHistory = async () => {
  try {
    const res = await api.get('/history/all', {
      params: { ...search.value, page: page.value, limit },
    })
    borrowHistory.value = res.data.history.map((item) => ({
      ...item,
      fine: calculateFine(item), // Tính tiền phạt ngay khi load dữ liệu
    }))
    total.value = res.data.total
  } catch (error) {
    console.error('Lỗi khi lấy lịch sử mượn sách:', error)
  }
}

const updateSearch = (newSearch) => {
  search.value = newSearch
  page.value = 1
  fetchBorrowHistory()
}

const updateStatus = async (book, status) => {
  console.log('ID nhận được:', book.id)
  try {
    await api.put(`/borrow_status/${book.id}`, { status })
    fetchBorrowHistory()
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái:', error)
  }
}

const calculateFine = (row) => {
  if (!row.return_date || !row.due_date) return 0
  const dueDate = new Date(row.due_date)
  const now = new Date()
  if (now <= dueDate) return 0
  const hoursLate = Math.ceil((now - dueDate) / (1000 * 60 * 60))
  console.log(1, hoursLate)

  return hoursLate * 500
}

const formatCurrency = (amount) => amount.toLocaleString('vi-VN') + ' đ'

const handleReturnBook = async (book) => {
  const fineAmount = calculateFine(book)
  try {
    await api.put(`/borrow_status/${book.id}`, { status: 'Returned', fine: fineAmount })
    fetchBorrowHistory()
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái:', error)
  }
}

const updateStatusFilter = (status) => {
  search.value.status = status
  page.value = 1
  fetchBorrowHistory()
}

onMounted(fetchBorrowHistory)
</script>
