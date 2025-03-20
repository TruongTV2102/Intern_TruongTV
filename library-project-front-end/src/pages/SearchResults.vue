<template>
  <div class="tw-p-4">
    <!-- Thanh tìm kiếm -->
    <BookSearchBar v-model:searchQuery="searchQuery" @search="resetPage" />

    <div class="tw-grid tw-grid-cols-2 md:tw-grid-cols-4 tw-gap-4">
      <div
        v-for="book in books"
        :key="book.id"
        class="tw-bg-white tw-p-4 tw-rounded-lg tw-shadow tw-min-w-[180px] tw-w-full"
      >
        <img
          :src="book.cover_image_url"
          class="tw-rounded-lg tw-mb-2 tw-w-full tw-h-[300px] tw-object-contain"
        />
        <h3 class="tw-text-lg tw-font-bold tw-truncate">{{ book.title }}</h3>
        <p class="tw-text-sm tw-text-gray-600 tw-truncate">Tác giả: {{ book.author }}</p>
        <p class="tw-text-sm tw-text-gray-600 tw-truncate">Thể loại: {{ book.genre_name }}</p>
        <p class="tw-text-sm tw-text-gray-600">Năm xuất bản: {{ book.published_year }}</p>
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

    <!-- Chỉ hiển thị điều hướng trang khi có ít nhất 20 sách -->
    <div v-if="total > limit" class="tw-mt-4 tw-flex tw-justify-center tw-gap-4">
      <q-btn label="« Trước" color="blue" :disabled="page === 1" @click="prevPage" />
      <span>Trang {{ page }} / {{ totalPages }}</span>
      <q-btn label="Tiếp »" color="blue" :disabled="page === totalPages" @click="nextPage" />
    </div>

    <BookDetail v-model:isOpen="isModalOpen" :book="selectedBook" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import BookDetail from 'components/BookDetail.vue'
import BookSearchBar from 'src/components/BookSearchBar.vue'

const route = useRoute()
const books = ref([])
const isModalOpen = ref(false)
const selectedBook = ref(null)
const page = ref(1)
const limit = 20
const total = ref(0)

const totalPages = computed(() => Math.ceil(total.value / limit))

const fetchBooks = async () => {
  try {
    const res = await axios.get('http://localhost:3000/books', {
      params: {
        ...route.query,
        page: page.value,
        limit,
      },
    })
    books.value = res.data.books
    total.value = res.data.total
    console.log(res.data)
  } catch (error) {
    console.error('Lỗi khi tìm kiếm sách:', error)
  }
}

const nextPage = () => {
  if (page.value < totalPages.value) {
    page.value++
    fetchBooks()
  }
}

const prevPage = () => {
  if (page.value > 1) {
    page.value--
    fetchBooks()
  }
}

// Reset page về 1 khi tìm kiếm mới
const resetPage = () => {
  page.value = 1
  fetchBooks()
}

// Mở modal chi tiết sách
const openModal = (book) => {
  selectedBook.value = book
  isModalOpen.value = true
}

watch(() => route.query, resetPage, { immediate: true })
</script>
