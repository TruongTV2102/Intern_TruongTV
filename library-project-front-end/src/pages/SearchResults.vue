<template>
  <div class="tw-p-4">
    <GenreSearchBar v-model:searchQuery="searchQuery" />

    <div v-if="filteredBooks.length > 0">
      <div class="tw-grid tw-grid-cols-2 md:tw-grid-cols-4 tw-gap-4">
        <div
          v-for="book in paginatedBooks"
          :key="book.id"
          class="tw-bg-white tw-p-4 tw-rounded-lg tw-shadow tw-relative"
        >
          <img
            :src="book.cover_image_url"
            class="tw-rounded-lg tw-w-full tw-h-[350px] tw-object-contain"
          />

          <h3 class="tw-text-lg tw-font-bold tw-truncate">{{ book.title }}</h3>
          <p class="tw-text-sm tw-text-gray-600 tw-truncate">Tác giả: {{ book.author }}</p>
          <p class="tw-text-sm tw-text-gray-600 tw-truncate">Thể loại: {{ book.genre }}</p>
          <p class="tw-text-sm tw-text-gray-600">Năm xuất bản: {{ book.published_year }}</p>
          <p class="tw-text-sm" :class="{ 'tw-text-red-500': book.quantity === 0 }">
            <b>Số lượng:</b>
            {{ book.quantity }} / {{ book.total_quantity }} sách
          </p>
          <p class="tw-text-sm" :class="{ 'tw-text-red-500': book.quantity === 0 }">
            <b>Tình trạng:</b> {{ book.quantity > 0 ? 'Có sẵn' : 'Hết sách' }}
          </p>

          <q-btn
            label="Chi tiết"
            color="primary"
            class="tw-mt-2 tw-w-full"
            @click="openModal(book)"
          />
        </div>
      </div>

      <div v-if="showPagination" class="tw-mt-4 tw-text-center">
        <q-btn
          label="Trang trước"
          color="primary"
          flat
          @click="changePage(currentPage - 1)"
          :disabled="currentPage <= 0"
        />
        <q-btn
          label="Trang sau"
          color="primary"
          flat
          @click="changePage(currentPage + 1)"
          :disabled="currentPage >= totalPages - 1"
        />
      </div>
    </div>

    <div v-else class="tw-text-center">
      <p class="tw-text-gray-600">Không tìm thấy kết quả nào!</p>
    </div>

    <!-- Popup Modal hiển thị thông tin chi tiết sách -->
    <BookDetail v-model:isOpen="isModalOpen" :book="selectedBook" @borrow="borrowBook" />

    <!-- Form đăng ký mượn sách -->
    <BorrowBook v-model:isOpen="isBorrowFormOpen" :book="selectedBook" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import GenreSearchBar from 'components/GenreSearchBar.vue'
import BookDetail from 'components/BookDetail.vue'
import BorrowBook from 'components/BorrowBook.vue'
import { useAuthStore } from 'src/stores/auth'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const books = ref([])

const currentPage = ref(0)
const itemsPerPage = 20
const searchQuery = ref(route.query.search_query || '')
const searchField = ref(route.query.search_field || 'Tên sách')

watch(
  () => route.query.search_field,
  (newVal) => {
    searchField.value = newVal || 'Tên sách'
  },
)

const fetchBooks = async () => {
  try {
    const res = await axios.get('http://localhost:3000/books')
    books.value = res.data.books
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sách:', error)
  }
}

onMounted(fetchBooks)

const totalPages = computed(() => Math.ceil(filteredBooks.value.length / itemsPerPage))
const showPagination = computed(() => filteredBooks.value.length > 20)
const paginatedBooks = computed(() => {
  const start = currentPage.value * itemsPerPage
  return filteredBooks.value.slice(start, start + itemsPerPage)
})

const changePage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page
  }
}

const filteredBooks = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  return books.value.filter((book) => {
    if (searchField.value === 'Tên sách') return book.title.toLowerCase().includes(query)
    if (searchField.value === 'Tác giả') return book.author.toLowerCase().includes(query)
    if (searchField.value === 'Thể loại') return book.genre.toLowerCase().includes(query)
    if (searchField.value === 'Năm') return book.published_year.toString().includes(query)
    return false
  })
})

const isModalOpen = ref(false)
const selectedBook = ref(null)
const isBorrowFormOpen = ref(false)

const openModal = (book) => {
  selectedBook.value = book
  isModalOpen.value = true
}

const borrowBook = () => {
  if (!authStore.user) {
    router.push('/login')
  } else {
    isBorrowFormOpen.value = true
  }
}

watch(filteredBooks, () => {
  currentPage.value = 0
})
</script>
