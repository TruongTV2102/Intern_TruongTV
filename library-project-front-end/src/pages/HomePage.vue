<template>
  <div class="tw-p-4">
    <!-- Thanh tìm kiếm -->
    <GenreSearchBar v-model:searchQuery="searchQuery" />

    <!-- Hiển thị sách theo thể loại khi không tìm kiếm -->

    <div v-for="(books, genre) in groupedBooks" :key="genre">
      <h2 class="tw-text-xl tw-font-bold tw-mb-2 tw-pt-[10px]">{{ genre }}</h2>
      <div class="tw-grid tw-grid-cols-2 md:tw-grid-cols-4 tw-gap-4">
        <div
          v-for="book in expandedGenres[genre] ? books : books.slice(0, 4)"
          :key="book.id"
          class="tw-bg-white tw-p-4 tw-rounded-lg tw-shadow tw-relative tw-min-w-[180px] tw-w-full"
        >
          <!-- Ảnh -->
          <img
            :src="book.image"
            class="tw-rounded-lg tw-mb-2 tw-w-full tw-h-[300px] tw-object-contain"
          />

          <!-- Thông tin sách -->
          <h3 class="tw-text-lg tw-font-bold tw-truncate">{{ book.name }}</h3>
          <p class="tw-text-sm tw-text-gray-600 tw-truncate">Tác giả: {{ book.author }}</p>
          <p class="tw-text-sm tw-text-gray-600 tw-truncate">Thể loại: {{ book.genre }}</p>
          <p class="tw-text-sm tw-text-gray-600">Năm xuất bản: {{ book.year }}</p>
          <p class="tw-text-sm" :class="{ 'tw-text-red-500': book.quantity === 0 }">
            <b>Số lượng:</b>
            {{ book.quantity }} / {{ book.totalQuantity }} sách
          </p>
          <p class="tw-text-sm" :class="{ 'tw-text-red-500': book.quantity === 0 }">
            <b>Tình trạng:</b> {{ book.quantity > 0 ? 'Có sẵn' : 'Hết sách' }}
          </p>

          <!-- Nút Chi tiết -->
          <q-btn
            label="Chi tiết"
            color="primary"
            class="tw-mt-2 tw-w-full"
            @click="openModal(book)"
          />
        </div>
      </div>

      <!-- Nút Xem thêm -->
      <div v-if="books.length > 4" class="tw-mt-2 tw-text-center">
        <q-btn label="Xem Thêm" color="blue" flat @click="viewMoreBooks(genre)" />
      </div>
    </div>
  </div>

  <!-- Popup Modal hiển thị thông tin chi tiết sách -->
  <BookDetail v-model:isOpen="isModalOpen" :book="selectedBook" @borrow="borrowBook" />

  <!-- Form đăng ký mượn sách -->
  <BorrowBook v-model:isOpen="isBorrowFormOpen" :book="selectedBook" />
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import GenreSearchBar from 'components/GenreSearchBar.vue'
import { useUserStore } from 'src/stores/userStore'
// import { useBookStore } from 'src/stores/bookStore'
import { useRouter } from 'vue-router'
import BookDetail from 'src/components/BookDetail.vue'
import BorrowBook from 'src/components/BorrowBook.vue'
import axios from 'axios'

const router = useRouter()
const expandedGenres = ref({})
const isModalOpen = ref(false)
const selectedBook = ref(null)
const searchQuery = ref('')
const userStore = useUserStore()
// const bookStore = useBookStore()

const books = ref([])

// API - Lấy danh sách sách
const fetchBooks = async () => {
  try {
    const res = await axios.get('http://localhost:3000/books', {
      headers: {
        'api-key': 'your-secret-key',
        'user-id': '1', // ID hợp lệ từ danh sách users
      },
    })
    books.value = res.data.data
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sách:', error)
  }
}

onMounted(fetchBooks)

// Nhóm sách theo thể loại
const groupedBooks = computed(() => {
  const groups = {}
  books.value.forEach((book) => {
    if (!groups[book.genre]) {
      groups[book.genre] = []
    }
    groups[book.genre].push(book)
  })
  return groups
})

// Cập nhật phương thức tìm kiếm theo thể loại khi ấn "Xem thêm"
const viewMoreBooks = (genre) => {
  // Chuyển sang trang tìm kiếm và truyền danh sách sách và searchQuery
  router.push({
    path: '/search',
    query: { search_query: genre, search_field: 'Thể loại' },
  })
}

// Mở modal chi tiết sách
const openModal = (book) => {
  selectedBook.value = book
  isModalOpen.value = true
}
const isBorrowFormOpen = ref(false)
// Mượn sách
const borrowBook = () => {
  if (!userStore.currentUser) {
    router.push('/login')
  } else {
    isBorrowFormOpen.value = true
  }
}
</script>
