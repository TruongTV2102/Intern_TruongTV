<template>
  <q-page class="tw-p-5">
    <!-- Thanh tìm kiếm -->
    <div class="tw-flex tw-gap-4 tw-mb-4">
      <q-input v-model="searchQuery" placeholder="Tìm sách..." class="tw-w-1/3" />
      <q-select
        v-model="selectedCategory"
        :options="categories"
        label="Thể loại"
        class="tw-w-1/4"
      />
      <q-btn label="Tìm kiếm" color="primary" @click="searchBooks" />
    </div>

    <!-- Bảng danh sách sách -->
    <q-table :rows="books" :columns="columns" row-key="id" class="tw-shadow-lg">
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn icon="edit" size="sm" flat @click="editBook(props.row)" />
          <q-btn icon="delete" size="sm" flat color="red" @click="deleteBook(props.row.id)" />
          <q-btn icon="visibility" size="sm" flat color="blue" @click="viewHistory(props.row.id)" />
        </q-td>
      </template>
    </q-table>

    <!-- Modal Thêm/Sửa sách -->
    <q-dialog v-model="isModalOpen">
      <q-card class="tw-p-5 tw-rounded-lg">
        <q-card-section>
          <q-input v-model="book.name" label="Tên sách" />
          <q-input v-model="book.author" label="Tác giả" />
          <q-select v-model="book.category" :options="categories" label="Thể loại" />
          <q-input v-model="book.year" label="Năm xuất bản" type="number" />
        </q-card-section>
        <q-card-actions align="right" class="tw-flex tw-justify-end tw-gap-2">
          <q-btn label="Lưu" color="primary" @click="saveBook" />
          <q-btn label="Hủy" flat @click="isModalOpen = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

// State
const searchQuery = ref('')
const selectedCategory = ref(null)
const isModalOpen = ref(false)

const categories = ref(['Khoa học', 'Tiểu thuyết', 'Lịch sử'])
const books = ref([
  { id: 1, name: 'Sách A', author: 'Tác giả A', category: 'Khoa học', year: 2022 },
  { id: 2, name: 'Sách B', author: 'Tác giả B', category: 'Lịch sử', year: 2021 },
])

const book = ref({ name: '', author: '', category: '', year: null })

const columns = ref([
  { name: 'name', label: 'Tên sách', field: 'name', align: 'left' },
  { name: 'author', label: 'Tác giả', field: 'author', align: 'left' },
  { name: 'category', label: 'Thể loại', field: 'category', align: 'left' },
  { name: 'year', label: 'Năm xuất bản', field: 'year', align: 'left' },
  { name: 'actions', label: 'Hành động', field: 'actions', align: 'center' },
])

// Methods
const searchBooks = () => {
  console.log('Tìm kiếm sách:', searchQuery.value)
}

const editBook = (selectedBook) => {
  book.value = { ...selectedBook }
  isModalOpen.value = true
}

const deleteBook = (id) => {
  books.value = books.value.filter((b) => b.id !== id)
}

const viewHistory = (id) => {
  console.log('Xem lịch sử mượn sách:', id)
}

const saveBook = () => {
  isModalOpen.value = false
}
</script>
