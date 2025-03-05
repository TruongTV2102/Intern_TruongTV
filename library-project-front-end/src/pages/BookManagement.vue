<template>
  <q-page class="tw-p-5">
    <q-form @submit.prevent="fetchBooks">
      <div class="tw-flex tw-gap-4 tw-mb-4">
        <q-input v-model="searchQuery" placeholder="Tìm sách..." class="tw-w-1/3" />
        <q-select v-model="searchField" :options="options" class="tw-w-1/4" />
        <q-btn label="Tìm kiếm" color="primary" type="submit" />
        <q-btn label="Thêm sách" color="green" @click="openAddBookModal" />
      </div>
    </q-form>

    <q-table :rows="filteredBooks" :columns="columns" row-key="id" class="tw-shadow-lg">
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn icon="edit" size="sm" flat @click="openEditBookModal(props.row)" />
          <q-btn icon="delete" size="sm" flat color="red" @click="deleteBook(props.row.id)" />
        </q-td>
      </template>
    </q-table>

    <!-- Modal Thêm sách -->
    <q-dialog v-model="isAddBookModalOpen">
      <q-card class="tw-w-1/2 tw-p-4">
        <q-card-section>
          <q-input v-model="newBook.name" label="Tên sách" />
          <q-input v-model="newBook.bookcode" label="Mã sách" />
          <q-input v-model="newBook.author" label="Tác giả" />
          <q-input v-model="newBook.genre" label="Thể loại" />
          <q-input v-model="newBook.year" label="Năm xuất bản" type="number" />
          <q-input v-model="newBook.quantity" label="Số lượng" type="number" />
          <q-input v-model="newBook.totalQuantity" label="Tổng số lượng" type="number" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Thêm" color="green" @click="addBook" />
          <q-btn label="Hủy" flat @click="isAddBookModalOpen = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal Chỉnh sửa sách -->
    <q-dialog v-model="isEditBookModalOpen">
      <q-card class="tw-w-1/2 tw-p-4">
        <q-card-section>
          <q-input v-model="book.name" label="Tên sách" />
          <q-input v-model="book.bookcode" label="Mã sách" />
          <q-input v-model="book.author" label="Tác giả" />
          <q-input v-model="book.genre" label="Thể loại" />
          <q-input v-model="book.year" label="Năm xuất bản" type="number" />
          <q-input v-model="book.quantity" label="Số lượng" type="number" />
          <q-input v-model="book.totalQuantity" label="Tổng số lượng" type="number" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Lưu" color="primary" @click="saveBook" />
          <q-btn label="Hủy" flat @click="isEditBookModalOpen = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

// State
const books = ref([])
const searchQuery = ref('')
const searchField = ref('Tên sách')
const isAddBookModalOpen = ref(false)
const isEditBookModalOpen = ref(false)
const book = ref({})
const newBook = ref({
  name: '',
  bookcode: '',
  author: '',
  genre: '',
  year: null,
  quantity: '',
  totalQuantity: '',
})

// Cấu hình cột bảng
const columns = [
  { name: 'name', label: 'Tên sách', field: 'name', align: 'left' },
  { name: 'bookcode', label: 'Mã sách', field: 'bookcode', align: 'left' },
  { name: 'author', label: 'Tác giả', field: 'author', align: 'left' },
  { name: 'genre', label: 'Thể loại', field: 'genre', align: 'left' },
  { name: 'year', label: 'Năm xuất bản', field: 'year', align: 'left' },
  { name: 'quantity', label: 'Số lượng', field: 'quantity', align: 'center' },
  { name: 'totalQuantity', label: 'Tổng số lượng', field: 'totalQuantity', align: 'center' },
  { name: 'actions', label: 'Hành động', field: 'actions', align: 'center' },
]

// Lọc sách theo tiêu chí tìm kiếm
const filteredBooks = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  return books.value.filter((b) => {
    if (searchField.value === 'Tên sách') return b.name.toLowerCase().includes(query)
    if (searchField.value === 'Tác giả') return b.author.toLowerCase().includes(query)
    if (searchField.value === 'Thể loại') return b.genre.toLowerCase().includes(query)
    if (searchField.value === 'Năm') return b.year.toString().includes(query)
    return false
  })
})

// API - Lấy danh sách sách
const fetchBooks = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Không tìm thấy token!')

    const res = await axios.get('http://localhost:3000/books', {
      headers: { Authorization: `Bearer ${token}` },
    })
    books.value = res.data.books
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sách:', error)
  }
}

onMounted(fetchBooks)

// API - Thêm sách
const addBook = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Không tìm thấy token!')

    await axios.post('http://localhost:3000/books', newBook.value, {
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchBooks()
    isAddBookModalOpen.value = false
  } catch (error) {
    console.error('Lỗi khi thêm sách:', error)
  }
}

// API - Cập nhật sách
const saveBook = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Không tìm thấy token!')

    await axios.put(`http://localhost:3000/books/${book.value.id}`, book.value, {
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchBooks()
    isEditBookModalOpen.value = false
  } catch (error) {
    console.error('Lỗi khi cập nhật sách:', error)
  }
}

// API - Xóa sách
const deleteBook = async (id) => {
  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Không tìm thấy token!')

    await axios.delete(`http://localhost:3000/books/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchBooks()
  } catch (error) {
    console.error('Lỗi khi xóa sách:', error)
  }
}

// Mở modal thêm sách
const openAddBookModal = () => {
  newBook.value = {
    name: '',
    bookcode: '',
    author: '',
    genre: '',
    year: null,
    quantity: '',
    totalQuantity: '',
  }
  isAddBookModalOpen.value = true
}

// Mở modal chỉnh sửa sách
const openEditBookModal = (b) => {
  book.value = { ...b }
  isEditBookModalOpen.value = true
}
</script>
