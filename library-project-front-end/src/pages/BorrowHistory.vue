<template>
  <q-page class="tw-p-4">
    <h1 class="tw-text-2xl tw-font-bold tw-mb-4">Lịch sử mượn sách</h1>

    <!-- Thanh tìm kiếm -->
    <BookSearchBar @search="updateSearch" />

    <!-- Bảng hiển thị lịch sử mượn sách -->
    <q-table
      style="height: 750px"
      flat
      bordered
      :rows="borrowHistory"
      :columns="columns"
      row-key="book_id"
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
            :src="
              props.row.cover_image_url ||
              'https://res.cloudinary.com/dp39ryiip/image/upload/v1742269732/ooe26eg7synamgmmycgk.jpg'
            "
            class="tw-w-16 tw-h-24 tw-object-cover tw-rounded-md"
          />
        </q-td>
      </template>

      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-badge :color="getStatusColor(props.row.status)" class="tw-p-2 tw-rounded">
            {{ props.row.status }}
          </q-badge>
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

    <!-- Thông báo khi không có dữ liệu -->
    <div
      v-if="borrowHistory.length === 0"
      class="tw-absolute tw-top-1/2 tw-left-1/2 tw-translate-x-[-50%] tw-translate-y-[-50%] tw-text-gray-600 tw-text-sm"
    >
      Bạn chưa có lịch sử mượn sách.
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import api from 'src/api'
import BookSearchBar from 'src/components/BookSearchBar.vue'
import PaginationPage from 'src/components/PaginationPage.vue'
import { formatDate } from 'src/utils/dateUtils'

const authStore = useAuthStore()
const borrowHistory = ref([])
const total = ref(0)
const page = ref(1)
const limit = 5
const search = ref({})

const columns = [
  { name: 'image', label: 'Ảnh', align: 'center', field: 'cover_image_url', sortable: false },
  { name: 'title', label: 'Tên sách', align: 'left', field: 'title', sortable: true },
  { name: 'author', label: 'Tác giả', align: 'left', field: 'author', sortable: true },
  { name: 'genre', label: 'Thể loại', align: 'left', field: 'genre', sortable: true },
  {
    name: 'published_year',
    label: 'Năm xuất bản',
    align: 'center',
    field: 'published_year',
    sortable: true,
  },
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
  { name: 'status', label: 'Trạng thái', align: 'center', field: 'status', sortable: true },
]

const statusOptions = [
  { label: 'Tất cả', value: '' },
  { label: 'Đang chờ', value: 'Pending' },
  { label: 'Đã duyệt', value: 'Approved' },
  { label: 'Đã trả', value: 'Returned' },
  { label: 'Mất', value: 'Lost' },
  { label: 'Bị từ chối', value: 'Rejected' },
]

const getStatusColor = (status) => {
  return (
    { Pending: 'yellow', Approved: 'blue', Returned: 'green', Lost: 'red', Rejected: 'gray' }[
      status
    ] || 'gray'
  )
}

const fetchBorrowHistory = async () => {
  try {
    const res = await api.get(`/history/user/${authStore.user.id}`, {
      params: { ...search.value, page: page.value, limit },
    })
    borrowHistory.value = res.data.history
    total.value = res.data.total
    console.log(res)
    console.log(total.value)
  } catch (error) {
    console.error('Lỗi khi lấy lịch sử mượn sách:', error)
  }
}

const updateSearch = (newSearch) => {
  search.value = { ...newSearch, status: search.value.status }
  page.value = 1 // Reset về trang đầu tiên khi tìm kiếm mới
  fetchBorrowHistory()
}

const updateStatusFilter = (status) => {
  search.value.status = status
  page.value = 1
  fetchBorrowHistory()
}

onMounted(fetchBorrowHistory)
</script>
