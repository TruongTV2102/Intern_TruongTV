<template>
  <div class="tw-p-4">
    <h1 class="tw-text-xl tw-font-semibold tw-mb-4">Quản lý Người Dùng</h1>

    <div class="tw-flex tw-justify-between tw-items-center tw-mb-4">
      <q-input
        v-model="searchQuery"
        label="Tìm kiếm email..."
        outlined
        dense
        class="tw-w-1/3"
        @update:model-value="fetchUsers"
      />
    </div>

    <q-table
      :rows="users"
      :columns="columns"
      row-key="id"
      flat
      bordered
      virtual-scroll
      :rows-per-page-options="[0]"
      v-model:pagination="pagination"
      @update:pagination="updateSort"
    >
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
            @click="showHistoryDialog(props.row)"
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

    <!-- Phân trang -->
    <PaginationPage v-model:page="page" :total="total" :limit="limit" @update:page="fetchUsers" />

    <!-- Dialog Lịch Sử Mượn -->
    <q-dialog v-model="historyDialogVisible">
      <q-card class="tw-min-w-[1500px], tw-min-h-[500px]">
        <q-card-section>
          <div class="tw-text-lg tw-font-semibold">
            Lịch sử mượn sách của {{ selectedUser?.email }}
          </div>
        </q-card-section>
        <q-card-section>
          <BookSearchBar @search="updateSearch" />
        </q-card-section>

        <q-card-section>
          <q-table
            :rows="borrowHistory"
            :columns="historyColumns"
            row-key="id"
            flat
            bordered
            virtual-scroll
            :rows-per-page-options="[0]"
            v-model:pagination="paginationHistory"
            @update:pagination="updateSortHistory"
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

            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="tw-space-x-2">
                <q-btn
                  @click="handleReturnBook(props.row)"
                  color="green"
                  dense
                  unelevated
                  :disable="!!props.row.return_date || !props.row.borrow_date"
                  >Trả sách</q-btn
                >
                <q-btn
                  @click="updateStatus(props.row, 'Lost')"
                  color="orange"
                  dense
                  unelevated
                  :disable="!!props.row.return_date || !props.row.borrow_date"
                  >Báo mất</q-btn
                >
              </q-td>
            </template>
          </q-table>
          <!-- Phân trang -->
          <PaginationPage
            v-model:page="pageHistory"
            :total="totalHistory"
            :limit="limit"
            @update:page="handlePageChange"
          />
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
import BookSearchBar from 'src/components/BookSearchBar.vue'
import { formatDate } from 'src/utils/dateUtils'
import PaginationPage from 'src/components/PaginationPage.vue'

const users = ref([])
const searchQuery = ref('')
const historyDialogVisible = ref(false)
const borrowHistory = ref([])
const selectedUser = ref(null)
const total = ref(0)
const page = ref(1)
const limit = 2
const totalHistory = ref(0)
const pageHistory = ref(1)
const sortBy = ref('id')
const search = ref({})
const descending = ref(false)
const sortByHistory = ref('borrow_date') // Cột mặc định để sắp xếp
const descendingHistory = ref(false) // Sắp xếp tăng dần hoặc giảm dần
const defaultImage =
  'https://res.cloudinary.com/dp39ryiip/image/upload/v1742269732/ooe26eg7synamgmmycgk.jpg'

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'avatar', label: 'Avatar', field: 'avatar', align: 'center', sortable: false },
  { name: 'email', label: 'Email', field: 'email', align: 'left', sortable: true },
  { name: 'name', label: 'Tên', field: 'name', align: 'left', sortable: true },
  {
    name: 'birthday',
    label: 'Ngày sinh',
    field: (row) => formatDate(row.birthday),
    align: 'center',
    sortable: false,
  },
  { name: 'phone', label: 'Số điện thoại', field: 'phone', align: 'left', sortable: false },
  {
    name: 'borrow_date',
    label: 'Ngày yêu cầu',
    field: (row) => formatDate(row.birthday),
    align: 'center',
    sortable: false,
  },
  { name: 'actions', label: 'Thao tác', align: 'center' },
]

const historyColumns = [
  { name: 'image', label: 'Ảnh', align: 'center', field: 'cover_image_url', sortable: false },
  { name: 'title', label: 'Tên sách', field: 'title', align: 'left', sortable: true },
  { name: 'author', label: 'Tác giả', field: 'author', align: 'left', sortable: true },
  { name: 'genre', label: 'Thể loại', field: 'genre', align: 'left', sortable: true },
  {
    name: 'published_year',
    label: 'Năm xuất bản',
    field: 'published_year',
    align: 'left',
    sortable: true,
  },

  { name: 'status', label: 'Trạng thái', field: 'status', align: 'left', sortable: true },

  {
    name: 'borrow_date',
    label: 'Ngày mượn',
    field: (row) => formatDate(row.borrow_date),
    align: 'left',
    sortable: true,
  },
  {
    name: 'due_date',
    label: 'Ngày trả dự kiến',
    field: (row) => formatDate(row.due_date),
    align: 'left',
    sortable: true,
  },
  {
    name: 'return_date',
    label: 'Ngày trả thực tế',
    field: (row) => formatDate(row.return_date),
    align: 'left',
    sortable: true,
  },
  {
    name: 'fine',
    label: 'Tiền phạt',
    field: (row) => formatCurrency(calculateFine(row)),
    align: 'left',
    sortable: true,
  },
  { name: 'actions', label: 'Thao tác', align: 'center' },
]

const statusOptions = [
  { label: 'Đang chờ', value: 'Pending' },
  { label: 'Đã duyệt', value: 'Approved' },
  { label: 'Đã trả', value: 'Returned' },
  { label: 'Mất', value: 'Lost' },
  { label: 'Bị từ chối', value: 'Rejected' },
]

const fetchUsers = async () => {
  try {
    const res = await api.get(API_ROUTES.USERS, {
      params: {
        ...searchQuery.value,
        page: page.value,
        limit,
        sortBy: sortBy.value,
        descending: descending.value,
      },
    })
    users.value = res.data.users
    total.value = res.data.total
    console.log('USERS', users)
  } catch (error) {
    console.error(error)
    toast.error('Lỗi khi tải danh sách người dùng')
  }
}

const showHistoryDialog = (user) => {
  historyDialogVisible.value = true
  console.log('USER:', user)

  // Gọi fetchBorrowHistory sau khi đã gán selectedUser
  fetchBorrowHistory(user.id)
}

const fetchBorrowHistory = async (userId) => {
  selectedUser.value = userId
  console.log('userID', userId)

  try {
    const res = await api.get(API_ROUTES.HISTORY_USER(userId), {
      params: {
        ...search.value,
        page: pageHistory.value,
        limit,
        sortBy: sortByHistory.value,
        descending: descendingHistory.value,
      },
    })

    borrowHistory.value = res.data.history.map((item) => ({
      ...item,
      fine: calculateFine(item),
    }))
    totalHistory.value = res.data.total
  } catch (error) {
    console.error(error)
    toast.error('Lỗi khi tải lịch sử mượn sách')
  }
}

const updateSearch = (newSearch) => {
  search.value = newSearch
  page.value = 1
  fetchBorrowHistory(selectedUser.value)
}

const updateStatus = async (book) => {
  console.log(111, 'alo')
  try {
    await api.put(`/return_or_lost/${book.id}`, { Status: 'Lost' })
    fetchBorrowHistory(selectedUser.value) // Refresh lại lịch sử
  } catch (error) {
    toast.error(error.response?.data?.message)
    console.error('Lỗi khi cập nhật trạng thái:', error)
  }
}

const calculateFine = (row) => {
  if (!row.due_date) return 0

  const dueDate = new Date(row.due_date)
  const returnDate = row.return_date ? new Date(row.return_date) : new Date()

  if (returnDate <= dueDate) return 0

  const hoursLate = Math.ceil((returnDate - dueDate) / (1000 * 60 * 60))
  return hoursLate * 500
}

const formatCurrency = (amount) => amount.toLocaleString('vi-VN') + ' đ'

const handleReturnBook = async (book) => {
  const fineAmount = calculateFine(book)
  console.log('sách', book)

  try {
    await api.put(`/return_or_lost/${book.id}`, { status: 'Returned', fine: fineAmount })
    fetchBorrowHistory(selectedUser.value)
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái:', error)
    toast.error(error.response?.data?.message)
  }
}

const updateStatusFilter = (status) => {
  search.value.status = status
  page.value = 1
  fetchBorrowHistory(selectedUser.value)
}

const paginationHistory = ref({
  sortBy: 'borrow_date',
  descending: false,
})

const pagination = ref({
  sortBy: 'id',
  descending: false,
})

const updateSortHistory = (val) => {
  console.log(222, 'alo')
  sortByHistory.value = val.sortBy
  descendingHistory.value = val.descending

  fetchBorrowHistory(selectedUser.value)
}

const updateSort = (val) => {
  console.log(333, val)
  sortBy.value = val.sortBy
  descending.value = val.descending

  fetchUsers()
}

const handlePageChange = () => {
  fetchBorrowHistory(selectedUser.value)
}

onMounted(fetchUsers)
</script>
