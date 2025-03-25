<template>
  <q-page class="tw-p-4">
    <h1 class="tw-text-2xl tw-font-bold tw-mb-4">Quản lý sách</h1>

    <BookSearchBar @search="updateSearch" />
    <q-btn color="primary" label="Thêm sách" @click="addBook" class="tw-mb-4" />

    <q-table
      flat
      bordered
      :rows="books"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :rows-per-page-options="[0]"
    >
      <template v-slot:body-cell-image="props">
        <q-td :props="props">
          <q-img
            :src="props.row.cover_image_url || defaultImage"
            class="tw-w-16 tw-h-24 tw-object-cover tw-rounded-md"
          />
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat icon="edit" @click="editBook(props.row)" color="blue" dense />
          <q-btn
            flat
            icon="history"
            @click="viewBorrowHistory(props.row.id)"
            color="orange"
            dense
          />
          <q-btn flat icon="delete" @click="deleteBook(props.row.id)" color="red" dense />
        </q-td>
      </template>
    </q-table>

    <PaginationPage v-model:page="page" :total="total" :limit="limit" @update:page="fetchBooks" />

    <q-dialog v-model="showFormDialog">
      <q-card class="tw-w-[1500px] tw-p-4">
        <q-card-section>
          <h2 class="tw-text-lg tw-font-bold">{{ selectedBook ? 'Sửa sách' : 'Thêm sách' }}</h2>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="form.title"
            label="Tên sách"
            required
            :error="!!validationErrors.title"
            :error-message="validationErrors.title"
          />
          <q-input
            v-model="form.author"
            label="Tác giả"
            required
            :error="!!validationErrors.author"
            :error-message="validationErrors.author"
          />
          <q-input
            v-model="form.genre"
            label="Thể loại"
            required
            :error="!!validationErrors.genre"
            :error-message="validationErrors.genre"
          />
          <q-input
            v-model="form.published_year"
            label="Năm xuất bản"
            required
            :error="!!validationErrors.published_year"
            :error-message="validationErrors.published_year"
          />
          <q-input
            v-model.number="form.quantity"
            label="Số lượng"
            type="number"
            required
            :error="!!validationErrors.quantity"
            :error-message="validationErrors.quantity"
          />
          <q-input
            v-model.number="form.total_quantity"
            label="Tổng số lượng"
            type="number"
            required
            :error="!!validationErrors.total_quantity"
            :error-message="validationErrors.total_quantity"
          />
          <q-input
            v-model="form.description"
            label="Mô tả"
            type="textarea"
            :error="!!validationErrors.description"
            :error-message="validationErrors.description"
          />
          <div class="tw-mt-2 tw-flex tw-items-center tw-space-x-4">
            <div
              class="tw-w-32 tw-h-48 tw-bg-gray-200 tw-flex tw-items-center tw-justify-center tw-rounded-md overflow-hidden"
            >
              <img
                v-if="previewUrl || form.cover_image_url"
                :src="previewUrl || form.cover_image_url"
                alt="Ảnh bìa sách"
                class="tw-w-full tw-h-full tw-object-cover"
              />
              <span v-else class="tw-text-gray-500">Không có ảnh</span>
            </div>
            <q-file label="Chọn ảnh bìa" accept="image/*" @update:model-value="handleFileChange" />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" v-close-popup />
          <q-btn color="primary" label="Lưu" @click="saveBook" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Xem lịch sử -->
    <q-dialog v-model="showHistoryDialog">
      <q-card class="tw-w-[800px] tw-p-4">
        <q-card-section>
          <h2 class="tw-text-lg tw-font-bold">Lịch sử mượn sách</h2>
        </q-card-section>
        <q-card-section>
          <q-table
            flat
            bordered
            :rows="borrowHistory"
            :columns="historyColumns"
            row-key="id"
            :loading="loadingHistory"
            ><template v-slot:header-cell-status>
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
          </q-table>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Đóng" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Popup xác nhận thêm/sửa/xóa -->
    <q-dialog v-model="confirmDialog">
      <q-card class="tw-p-4">
        <q-card-section>
          <h2 class="tw-text-lg tw-font-bold">Xác nhận</h2>
          <p>{{ confirmMessage }}</p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" v-close-popup />
          <q-btn color="red" label="Đồng ý" @click="executeAction" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api, API_ROUTES } from 'src/api/index.js'
import BookSearchBar from 'src/components/BookSearchBar.vue'
import PaginationPage from 'src/components/PaginationPage.vue'
import { toast } from 'src/plugins/toast'
import { bookSchema } from 'src/schema/books/validationSchema'
import { validateData } from 'src/schema/validator'
import { useUploadImage } from 'src/utils/cloudinaryUpload'

const { selectedFile, previewUrl, handleFileChange, uploadImage } = useUploadImage()

const books = ref([])
const total = ref(0)
const page = ref(1)
const limit = 2
const search = ref({})
const loading = ref(false)
const showFormDialog = ref(false)
const selectedBook = ref(null)
const defaultImage =
  'https://res.cloudinary.com/dp39ryiip/image/upload/v1742114106/afffiepjj3j41aqbp9td.jpg'
const form = ref({
  title: '',
  author: '',
  genre: '',
  published_year: 1000,
  quantity: 1,
  total_quantity: 1,
  description: '',
  cover_image_url: '',
})

const columns = [
  { name: 'image', label: 'Ảnh', align: 'center', field: 'cover_image_url', sortable: false },
  { name: 'title', label: 'Tên sách', align: 'left', field: 'title', sortable: true },
  { name: 'author', label: 'Tác giả', align: 'left', field: 'author', sortable: true },
  { name: 'genre', label: 'Thể loại', align: 'left', field: 'genre', sortable: true },
  {
    name: 'published_year',
    label: 'Năm xuất bản',
    align: 'left',
    field: 'published_year',
    sortable: true,
  },
  { name: 'quantity', label: 'Số lượng', align: 'center', field: 'quantity', sortable: true },
  {
    name: 'total_quantity',
    label: 'Tổng số lượng',
    align: 'center',
    field: 'total_quantity',
    sortable: true,
  },
  { name: 'actions', label: 'Hành động', align: 'center', field: 'actions', sortable: false },
]

const fetchBooks = async () => {
  loading.value = true
  try {
    const res = await api.get(API_ROUTES.BOOKS, {
      params: { ...search.value, page: page.value, limit },
    })
    books.value = res.data.books
    total.value = res.data.total
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sách:', error)
  } finally {
    loading.value = false
  }
}

const updateSearch = (newSearch) => {
  search.value = newSearch
  page.value = 1
  fetchBooks()
}

const addBook = () => {
  selectedBook.value = null
  form.value = {
    title: '',
    author: '',
    genre: '',
    published_year: 1000,
    quantity: 1,
    total_quantity: 1,
    description: '',
    cover_image_url: '',
  }
  selectedFile.value = null
  previewUrl.value = form.value.cover_image_url || ''
  showFormDialog.value = true
}

const editBook = async (book) => {
  try {
    selectedBook.value = book
    const res = await api.get(API_ROUTES.BOOK_DETAIL(book.id))
    form.value = res.data || { ...book } // Lấy dữ liệu từ API nếu có
    console.log(form.value)

    selectedFile.value = null
    previewUrl.value = form.value.cover_image_url || ''
    showFormDialog.value = true
  } catch (error) {
    console.error('Lỗi khi lấy thông tin sách:', error)
    toast.error('Không thể lấy dữ liệu sách!')
  }
}

const validationErrors = ref({})

const saveBook = async () => {
  const { errors, isValid } = validateData(form.value, bookSchema)
  validationErrors.value = errors

  if (isValid) {
    showConfirmDialog(
      selectedBook.value
        ? 'Bạn có chắc chắn muốn sửa sách này?'
        : 'Bạn có chắc chắn muốn thêm sách này?',
      async () => {
        try {
          const uploadedImageUrl = await uploadImage()
          form.value.cover_image_url = uploadedImageUrl || form.value.cover_image_url
          const bookData = form.value

          selectedBook.value
            ? await api.put(API_ROUTES.BOOK_DETAIL(selectedBook.value.id), bookData)
            : await api.post(API_ROUTES.BOOKS, bookData)

          toast.info(selectedBook.value ? 'Sửa sách thành công!' : 'Thêm sách thành công!')
          showFormDialog.value = false
          fetchBooks()
        } catch (error) {
          console.error('Lỗi khi lưu sách:', error)
          toast.error('Không thể lưu sách!')
        }
      },
    )
  }
}

// API - Xóa sách
const deleteBook = async (id) => {
  showConfirmDialog('Bạn có chắc chắn muốn xóa sách này?', async () => {
    try {
      await api.delete(`/books/${id}`)
      toast.info('Xóa sách thành công!')
      fetchBooks()
    } catch (error) {
      console.error('Lỗi khi xóa sách:', error)
      toast.error('Không thể xóa sách!')
    }
  })
}

const showHistoryDialog = ref(false)
const borrowHistory = ref([])
const loadingHistory = ref(false)

const historyColumns = [
  { name: 'user', label: 'Người mượn', align: 'left', field: 'name' },
  { name: 'borrow_date', label: 'Ngày mượn', align: 'center', field: 'borrow_date' },
  { name: 'due_date', label: 'Ngày trả dự kiến', align: 'center', field: 'due_date' },
  { name: 'return_date', label: 'Ngày trả thực tế', align: 'center', field: 'return_date' },
  { name: 'status', label: 'Trạng thái', align: 'center', field: 'status' },
]

const viewBorrowHistory = async (bookId) => {
  showHistoryDialog.value = true
  loadingHistory.value = true

  try {
    const res = await api.get(API_ROUTES.HISTORY_BOOK(bookId))
    borrowHistory.value = res.data
    console.log(res.data)
  } catch (error) {
    console.error('Lỗi khi lấy lịch sử mượn:', error)
  } finally {
    loadingHistory.value = false
  }
}

const statusOptions = [
  { label: 'Tất cả', value: '' },
  { label: 'Đang chờ', value: 'Pending' },
  { label: 'Đã duyệt', value: 'Approved' },
  { label: 'Đã trả', value: 'Returned' },
  { label: 'Mất', value: 'Lost' },
  { label: 'Bị từ chối', value: 'Rejected' },
]

const updateStatusFilter = (status) => {
  search.value.status = status
  page.value = 1
  viewBorrowHistory()
}

const confirmDialog = ref(false)
const confirmAction = ref(null)
const confirmMessage = ref('')

const showConfirmDialog = (message, action) => {
  confirmMessage.value = message
  confirmAction.value = action
  confirmDialog.value = true
}

const executeAction = () => {
  if (confirmAction.value) confirmAction.value()
  confirmDialog.value = false
}

onMounted(fetchBooks)
</script>
