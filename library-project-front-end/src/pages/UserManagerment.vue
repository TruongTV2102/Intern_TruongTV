<template>
  <div class="tw-p-4">
    <h1 class="tw-text-xl tw-font-semibold tw-mb-4">Quản lý Người Dùng</h1>

    <div class="tw-flex tw-items-center tw-gap-2 tw-mb-4">
      <q-input
        v-model="searchQuery"
        label="Tìm kiếm email..."
        outlined
        dense
        class="tw-w-1/3 tw-transition-all tw-duration-200 focus:tw-w-1/2"
      >
        <template v-slot:append>
          <q-btn flat round dense icon="search" color="primary" @click="fetchUsers" />
        </template>
      </q-input>
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

      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="tw-space-x-2">
          <q-btn
            v-if="props.row.status === 'Active' || props.row.status === 'Deleted'"
            class="tw-w-[100px]"
            @click="showHistoryDialog(props.row)"
            color="blue"
            dense
            unelevated
          >
            Xem lịch sử
          </q-btn>
          <q-btn
            v-if="props.row.status !== 'Deleted'"
            class="tw-w-[100px]"
            @click="openConfirmDialog(props.row)"
            :color="props.row.status === 'Active' ? 'negative' : 'positive'"
            dense
            unelevated
          >
            {{ props.row.status === 'Active' ? 'Vô hiệu hóa' : 'Kích hoạt' }}
          </q-btn>
          <q-btn
            v-if="props.row.status === 'Active' && props.row.status !== 'Deleted'"
            class="tw-w-[100px]"
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

    <!-- Dialog xác nhận kích hoạt/ vô hiệu hóa -->
    <q-dialog v-model="confirmDialog" persistent>
      <q-card class="tw-w-[400px]">
        <q-card-section class="row items-center">
          <q-icon name="warning" color="orange" size="md" />
          <span class="q-ml-md">
            Bạn có chắc chắn muốn
            {{ selectedUser?.status === 'Active' ? 'Vô hiệu hóa' : 'Kích hoạt' }} tài khoản
            {{ selectedUser?.email }}
            không?
          </span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Hủy" color="grey" flat v-close-popup />
          <q-btn
            :label="selectedUser?.status === 'Active' ? 'Vô hiệu hóa' : 'Kích hoạt'"
            :color="selectedUser?.status === 'Active' ? 'negative' : 'positive'"
            @click="confirmStatusUpdate"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog Lịch Sử Mượn -->
    <q-dialog v-model="historyDialogVisible">
      <q-card class="tw-w-[1500px]">
        <q-card-section>
          <div class="tw-text-lg tw-font-semibold">
            Lịch sử mượn sách của {{ selectedUser?.email }}
          </div>
        </q-card-section>
        <q-card-section>
          <BookSearchBar ref="searchHistoryBar" @search="updateHistorySearch" />
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
                        v-for="option in statusHistoryOptions"
                        :key="option.value"
                        @click="updateStatusHistoryFilter(option.value)"
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

const searchHistoryBar = ref(null)
const users = ref([])
const searchQuery = ref('')
const historyDialogVisible = ref(false)
const borrowHistory = ref([])
const selectedUser = ref(null)
const total = ref(0)
const page = ref(1)
const limit = 2
const totalHistory = ref(0)
const totalBorrowBook = ref(0)
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
    name: 'borrowbook',
    label: 'Số sách đang mượn',
    field: 'phone',
    align: 'left',
    sortable: false,
  },

  {
    name: 'borrow_date',
    label: 'Ngày yêu cầu',
    field: (row) => formatDate(row.created_at),
    align: 'center',
    sortable: false,
  },
  {
    name: 'status',
    label: 'Trạng thái',
    align: 'center',
    field: 'status',
    sortable: true,
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

const statusHistoryOptions = [
  { label: 'Đang chờ', value: 'Pending' },
  { label: 'Đã duyệt', value: 'Approved' },
  { label: 'Đã trả', value: 'Returned' },
  { label: 'Mất', value: 'Lost' },
  { label: 'Bị từ chối', value: 'Rejected' },
]

const statusUser = ref('')

const fetchUsers = async () => {
  try {
    const res = await api.get(API_ROUTES.USERS, {
      params: {
        email: searchQuery.value,
        status: statusUser.value,
        page: page.value,
        limit,
        sortBy: sortBy.value,
        descending: descending.value,
      },
    })
    console.log('Tìm kiếm', statusUser.value)

    users.value = res.data.users
    total.value = res.data.total
    totalBorrowBook.value = res.data.totalBorrowBook

    console.log('USERS', res.data)
  } catch (error) {
    console.error(error)
    toast.error('Lỗi khi tải danh sách người dùng')
  }
}

const statusOptions = [
  { label: 'Tất cả', value: '' },
  { label: 'Đã xóa', value: 'Deleted' },
  { label: 'Đã kích hoạt', value: 'Active' },
  { label: 'Chưa kích hoạt', value: 'Inactive' },
]

const showHistoryDialog = (user) => {
  historyDialogVisible.value = true
  pageHistory.value = 1
  selectedUser.value = user

  // Gọi fetchBorrowHistory sau khi đã gán selectedUser
  fetchBorrowHistory(selectedUser.value.id)
}

const fetchBorrowHistory = async (userId) => {
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

const updateHistorySearch = (newSearch) => {
  search.value = newSearch
  page.value = 1
  fetchBorrowHistory(selectedUser.value.id)
}

const updateStatus = async (book) => {
  try {
    await api.put(`/return_or_lost/${book.id}`, { Status: 'Lost' })
    fetchBorrowHistory(selectedUser.value.id) // Refresh lại lịch sử
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
    fetchBorrowHistory(selectedUser.value.id)
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái:', error)
    toast.error(error.response?.data?.message)
  }
}

const updateStatusHistoryFilter = (status) => {
  search.value.status = status
  page.value = 1
  fetchBorrowHistory(selectedUser.value.id)
}

const updateStatusFilter = (status) => {
  statusUser.value = status
  page.value = 1
  fetchUsers()
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
  sortByHistory.value = val.sortBy
  descendingHistory.value = val.descending

  fetchBorrowHistory(selectedUser.value.id)
}

const updateSort = (val) => {
  sortBy.value = val.sortBy
  descending.value = val.descending

  fetchUsers()
}

const handlePageChange = () => {
  fetchBorrowHistory(selectedUser.value.id)
}

const openDeleteDialog = async (userId) => {
  try {
    const res = await api.get(API_ROUTES.DELETE_USER(userId), {})

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

const confirmDialog = ref(false)

const openConfirmDialog = (user) => {
  selectedUser.value = user
  confirmDialog.value = true
  console.log('selectedUser', selectedUser)
}

const confirmStatusUpdate = async () => {
  if (!selectedUser.value.id) return

  try {
    const newStatus = selectedUser.value.status === 'Active' ? 'Inactive' : 'Active'
    await api.put(`/users/${selectedUser.value.id}/status`, { status: newStatus })

    toast.info(`Đã cập nhật trạng thái thành ${newStatus}`)

    confirmDialog.value = false
    fetchUsers() // Làm mới danh sách user
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái:', error)
    toast.error('Cập nhật trạng thái thất bại')
  }
}

onMounted(fetchUsers)
</script>
