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
          <img :src="book.image" class="tw-rounded-lg tw-w-full tw-h-[350px] tw-object-contain" />

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
import { computed, ref, watch } from 'vue'
import GenreSearchBar from 'components/GenreSearchBar.vue'
import BookDetail from 'components/BookDetail.vue'
import BorrowBook from 'components/BorrowBook.vue'
import { useBookStore } from 'src/stores/bookStore'
import { useUserStore } from 'src/stores/userStore'
import { useRouter, useRoute } from 'vue-router'

const bookStore = useBookStore()
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const currentPage = ref(0)
const itemsPerPage = 20
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

const totalPages = computed(() => {
  return Math.ceil(filteredBooks.value.length / itemsPerPage)
})

const showPagination = computed(() => filteredBooks.value.length > 20)
const paginatedBooks = computed(() => {
  const start = currentPage.value * itemsPerPage
  const end = start + itemsPerPage
  return filteredBooks.value.slice(start, end)
})

const changePage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page
  }
}

// Tìm kiếm sách theo tên, tác giả, thể loại và năm
const filteredBooks = computed(() => {
  const query = searchQuery.value.toLowerCase().trim() // Chuyển thành chữ thường và xóa khoảng trắng
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

const isModalOpen = ref(false)
const selectedBook = ref(null)
const isBorrowFormOpen = ref(false)

const openModal = (book) => {
  selectedBook.value = book
  isModalOpen.value = true
}

const borrowBook = () => {
  if (!userStore.currentUser) {
    router.push('/login')
  } else {
    isBorrowFormOpen.value = true
  }
}
</script>
