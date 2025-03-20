<template>
  <q-page class="tw-p-4">
    <h1 class="tw-text-2xl tw-font-bold tw-mb-4">Lịch sử mượn sách</h1>

    <!-- Thanh tìm kiếm -->
    <div class="tw-flex tw-gap-4 tw-mb-4">
      <q-input v-model="searchTitle" label="Tìm theo tên sách" outlined dense />
      <q-input v-model="searchAuthor" label="Tìm theo tác giả" outlined dense />
      <q-input v-model="searchGenre" label="Tìm theo thể loại" outlined dense />
      <q-input v-model="searchYear" label="Tìm theo năm xuất bản" outlined dense type="number" />
      <q-select
        v-model="searchStatus"
        :options="statusOptions"
        label="Lọc theo trạng thái"
        outlined
        dense
        clearable
      />
    </div>

    <q-table
      v-if="borrowHistory.length > 0"
      style="height: 750px"
      flat
      bordered
      :rows="filteredRows"
      :columns="columns"
      row-key="id"
      virtual-scroll
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
    >
      <template v-slot:body-cell-image="props">
        <q-td :props="props">
          <q-img
            :src="props.row.cover_image_url"
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

    <q-card v-else flat bordered class="tw-p-6 tw-text-center">
      <q-icon name="history" size="lg" color="gray" class="tw-mb-2" />
      <p class="tw-text-gray-500">Bạn chưa có lịch sử mượn sách.</p>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import api from 'src/api'

const authStore = useAuthStore()
const borrowHistory = ref([])

// Các trường tìm kiếm
const searchTitle = ref('')
const searchAuthor = ref('')
const searchGenre = ref('')
const searchYear = ref(null)
const searchStatus = ref(null)

// Danh sách trạng thái
const statusOptions = ['Pending', 'Approved', 'Returned', 'Lost', 'Rejected']

// Cột của bảng
const columns = [
  { name: 'index', label: '#', align: 'left', field: 'index' },
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
    field: 'borrow_date',
    sortable: true,
  },
  {
    name: 'due_date',
    label: 'Ngày trả dự kiến',
    align: 'center',
    field: 'due_date',
    sortable: true,
  },
  {
    name: 'return_date',
    label: 'Ngày trả thực tế',
    align: 'center',
    field: 'return_date',
    sortable: true,
  },
  { name: 'status', label: 'Trạng thái', align: 'center', field: 'status', sortable: true },
]

// Xử lý màu sắc trạng thái
const getStatusColor = (status) => {
  const colors = {
    Pending: 'yellow',
    Approved: 'blue',
    Returned: 'green',
    Lost: 'red',
    Rejected: 'gray',
  }
  return colors[status] || 'gray'
}

// Lọc kết quả theo tìm kiếm
const filteredRows = computed(() => {
  return borrowHistory.value.filter((book) => {
    return (
      (searchTitle.value === '' ||
        book.title.toLowerCase().includes(searchTitle.value.toLowerCase())) &&
      (searchAuthor.value === '' ||
        book.author.toLowerCase().includes(searchAuthor.value.toLowerCase())) &&
      (searchGenre.value === '' ||
        book.genre.toLowerCase().includes(searchGenre.value.toLowerCase())) &&
      (!searchYear.value || book.published_year === parseInt(searchYear.value)) &&
      (!searchStatus.value || book.status === searchStatus.value)
    )
  })
})

// Fetch dữ liệu lịch sử mượn
const fetchBorrowHistory = async () => {
  try {
    const { data } = await api.get(`/history/user/${authStore.user.id}`)
    console.log(data)

    borrowHistory.value = data.map((item, index) => ({ ...item, index: index + 1 }))
  } catch (error) {
    console.error('Lỗi khi lấy lịch sử mượn sách:', error)
  }
}

onMounted(fetchBorrowHistory)

const pagination = ref({
  rowsPerPage: 20,
})
</script>
