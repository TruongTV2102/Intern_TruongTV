<template>
  <q-page class="tw-p-5">
    <q-form>
      <!-- Thanh tìm kiếm -->
      <div class="tw-flex tw-gap-4 tw-mb-4">
        <q-input v-model="searchQuery" placeholder="Tìm sách..." class="tw-w-1/3" />
        <q-select v-model="searchField" :options="options" class="tw-w-1/4" />
        <q-btn label="Tìm kiếm" color="primary" />
        <q-btn label="Thêm sách" color="green" @click="openAddBookModal" />
      </div>
    </q-form>

    <!-- Bảng danh sách sách -->
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
      <q-card class="tw-w-1/2 tw-p-4 tw-shadow-lg tw-rounded-lg">
        <q-card-section>
          <q-input v-model="newBook.name" label="Tên sách" />
          <q-input v-model="newBook.bookcode" label="Tên sách" />
          <q-input v-model="newBook.author" label="Tác giả" />
          <q-input v-model="newBook.genre" label="Thể loại" />
          <q-input v-model="newBook.year" label="Năm xuất bản" type="number" />
          <q-input v-model="newBook.quantity" label="Số lượng" type="number" />
          <q-input v-model="newBook.totalQuantity" label="Tổng số lượng" type="number" />
        </q-card-section>
        <q-card-actions align="right" class="tw-flex tw-justify-end tw-gap-2">
          <q-btn label="Thêm" color="green" @click="addBook" />
          <q-btn label="Hủy" flat @click="isAddBookModalOpen = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal Chỉnh sửa sách -->
    <q-dialog v-model="isEditBookModalOpen">
      <q-card class="tw-w-1/2 tw-p-4 tw-shadow-lg tw-rounded-lg">
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
import { computed, ref } from 'vue'
import { useBookStore } from 'src/stores/bookStore'
import { faker } from '@faker-js/faker'

// Store
const bookStore = useBookStore()
const books = computed(() => bookStore.books)

// State
const options = ['Tên sách', 'Tác giả', 'Thể loại', 'Năm']
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
  image: '',
})

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'center' },
  { name: 'name', label: 'Tên sách', field: 'name', align: 'left' },
  { name: 'bookcode', label: 'Mã sách', field: 'bookcode', align: 'left' },
  { name: 'author', label: 'Tác giả', field: 'author', align: 'left' },
  { name: 'genre', label: 'Thể loại', field: 'genre', align: 'left' },
  { name: 'year', label: 'Năm xuất bản', field: 'year', align: 'left' },
  { name: 'quantity', label: 'Số lượng', field: 'quantity', align: 'center' },
  { name: 'totalQuantity', label: 'Tổng số lượng', field: 'totalQuantity', align: 'center' },
  { name: 'actions', label: 'Hành động', field: 'actions', align: 'center' },
]

// Lọc sách theo tiêu chí
const filteredBooks = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  return books.value.filter((book) => {
    if (searchField.value === 'Tên sách') return book.name.toLowerCase().includes(query)
    if (searchField.value === 'Tác giả') return book.author.toLowerCase().includes(query)
    if (searchField.value === 'Thể loại') return book.genre.toLowerCase().includes(query)
    if (searchField.value === 'Năm') return book.year.toString().includes(query)
    return false
  })
})

const openAddBookModal = () => (isAddBookModalOpen.value = true)
const openEditBookModal = (b) => {
  book.value = { ...b }
  isEditBookModalOpen.value = true
}
const addBook = () => {
  bookStore.createBook({ id: faker.database.mongodbObjectId(), ...newBook.value })
  isAddBookModalOpen.value = false
}
const saveBook = () => {
  bookStore.updateBook(book.value.id, { ...book.value })
  isEditBookModalOpen.value = false
}
const deleteBook = (id) => bookStore.deleteBook(id)
</script>
