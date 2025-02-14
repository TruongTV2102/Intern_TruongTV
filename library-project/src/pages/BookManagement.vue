<template>
  <q-page class="tw-p-5">
    <q-form>
      <!-- Thanh tìm kiếm -->
      <div class="tw-flex tw-gap-4 tw-mb-4">
        <q-input
          v-model="searchQuery"
          placeholder="Tìm sách..."
          class="tw-w-1/3"
          @keyup.enter="searchBooks"
        />
        <q-select v-model="searchField" :options="options" class="tw-w-1/4" />
        <q-btn label="Tìm kiếm" color="primary" @click="searchBooks" />
        <q-btn label="Thêm sách" color="green" @click="openAddBookModal" />
      </div>
    </q-form>

    <!-- Bảng danh sách sách -->

    <q-table
      :rows="searchQuery ? filteredBooks : books"
      :columns="columns"
      row-key="id"
      class="tw-shadow-lg"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn icon="edit" size="sm" flat @click="openEditBookModal(props.row)" />
          <q-btn icon="delete" size="sm" flat color="red" @click="deleteBook(props.row.id)" />
        </q-td>
      </template>
    </q-table>

    <!-- Modal Thêm sách -->
    <q-dialog v-model="isAddBookModalOpen">
      <q-card class="tw-p-5 tw-rounded-lg">
        <q-card-section>
          <q-input v-model="newBook.name" label="Tên sách" />
          <q-input v-model="newBook.author" label="Tác giả" />
          <q-select v-model="newBook.category" :options="categories" label="Thể loại" />
          <q-input v-model="newBook.year" label="Năm xuất bản" type="number" />
        </q-card-section>
        <q-card-actions align="right" class="tw-flex tw-justify-end tw-gap-2">
          <q-btn label="Thêm" color="green" @click="addBook" />
          <q-btn label="Hủy" flat @click="isAddBookModalOpen = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal Chỉnh sửa sách -->
    <q-dialog v-model="isEditBookModalOpen">
      <q-card class="tw-p-5 tw-rounded-lg">
        <q-card-section>
          <q-input v-model="book.bookcode" label="Mã sách" />
          <q-input v-model="book.name" label="Tên sách" />
          <q-input v-model="book.author" label="Tác giả" />
          <q-input v-model="book.genre" label="Thể loại" />
          <q-input v-model="book.year" label="Năm xuất bản" type="number" />
          <q-input v-model="book.quantity" label="Số lượng" type="number" />
          <q-input v-model="book.totalQuantity" label="Tổng số lượng" type="number" />
          <q-input v-model="book.description" label="Mô tả" />
          <q-input v-model="book.image" label="Ảnh bìa" />
        </q-card-section>
        <q-card-actions align="right" class="tw-flex tw-justify-end tw-gap-2">
          <q-btn label="Lưu" color="primary" @click="saveBook" />
          <q-btn label="Hủy" flat @click="isEditBookModalOpen = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { books } from 'src/utils/booksData'
import { useBookStore } from 'src/stores/bookStore'
import { useRoute } from 'vue-router'

// State
const route = useRoute()
const bookStore = useBookStore()
// const emit = defineEmits(['update:searchQuery'])
// const model = ref('Tên sách')
const options = ['Tên sách', 'Tác giả', 'Thể loại', 'Năm']

const book = ref({}) // Dùng để chỉnh sửa sách
const newBook = ref({ name: '', author: '', category: '', year: null }) // Dùng để thêm sách

const isAddBookModalOpen = ref(false)
const isEditBookModalOpen = ref(false)

const columns = ref([
  { name: 'id', label: 'ID', field: 'id', align: 'center' },
  { name: 'name', label: 'Tên sách', field: 'name', align: 'left' },
  { name: 'bookcode', label: 'Mã sách', field: 'bookcode', align: 'left' },
  { name: 'author', label: 'Tác giả', field: 'author', align: 'left' },
  { name: 'genre', label: 'Thể loại', field: 'genre', align: 'left' },
  { name: 'year', label: 'Năm xuất bản', field: 'year', align: 'left' },
  { name: 'quantity', label: 'Số lượng', field: 'quantity', align: 'center' },
  { name: 'totalQuantity', label: 'Tổng số lượng', field: 'totalQuantity', align: 'center' },
  { name: 'image', label: 'Ảnh bìa', field: 'image', align: 'center' },
  { name: 'actions', label: 'Hành động', field: 'actions', align: 'center' },
])

const searchQuery = ref(route.query.search_query || '')
const searchField = ref(route.query.search_field || 'Tên sách')

watch(
  () => route.query.search_field,
  (newVal) => {
    if (newVal) {
      searchField.value = newVal
    } else {
      searchField.value = 'Tên sách' // Giá trị mặc định
    }
  },
)

// Tìm kiếm sách theo tên, tác giả, thể loại và năm
const filteredBooks = computed(() => {
  const query = searchQuery.value.toLowerCase().trim() // Chuẩn hóa chuỗi tìm kiếm (chuyển thành chữ thường và xóa khoảng trắng)
  return bookStore.books.filter((book) => {
    const field = searchField.value // Trường tìm kiếm được chọn
    if (field === 'Tên sách') {
      return book.name.toLowerCase().includes(query) // Tìm kiếm tên sách chứa chuỗi tìm kiếm
    } else if (field === 'Tác giả') {
      return book.author.toLowerCase().includes(query) // Tìm kiếm tác giả chứa chuỗi tìm kiếm
    } else if (field === 'Thể loại') {
      return book.genre.toLowerCase().includes(query) // Tìm kiếm thể loại chứa chuỗi tìm kiếm
    } else if (field === 'Năm') {
      return book.year.toString().includes(query) // Tìm kiếm năm chứa chuỗi tìm kiếm
    }

    return false // Trả về false nếu không khớp với bất kỳ trường nào
  })
})

// Methods
const searchBooks = () => {
  console.log('Tìm kiếm sách:', searchQuery.value)
  console.log(searchField)
  // emit('update:searchQuery', searchQuery.value)
}

const openAddBookModal = () => {
  newBook.value = { name: '', author: '', category: '', year: null }
  isAddBookModalOpen.value = true
}

const openEditBookModal = (selectedBook) => {
  book.value = { ...selectedBook }
  isEditBookModalOpen.value = true
}

const addBook = () => {
  books.value.push({ ...newBook.value, id: books.value.length + 1 }) // Giả lập id tự động tăng
  isAddBookModalOpen.value = false
}

const saveBook = () => {
  const index = books.value.findIndex((b) => b.id === book.value.id)
  if (index !== -1) {
    books.value[index] = { ...book.value }
  }
  isEditBookModalOpen.value = false
}

const deleteBook = (id) => {
  books.value = books.value.filter((b) => b.id !== id)
}
</script>
