<template>
  <div class="tw-p-4">
    <BookSearchBar ref="searchBar" v-model:searchQuery="searchQuery" @search="resetPage" />

    <div class="tw-grid tw-grid-cols-2 md:tw-grid-cols-4 tw-gap-4">
      <div
        v-for="book in books"
        :key="book.id"
        class="tw-bg-white tw-p-4 tw-rounded-lg tw-shadow tw-min-w-[180px] tw-w-full"
      >
        <img
          :src="
            book.cover_image_url ||
            'https://res.cloudinary.com/dp39ryiip/image/upload/v1742269732/ooe26eg7synamgmmycgk.jpg'
          "
          class="tw-rounded-lg tw-mb-2 tw-w-full tw-h-[300px] tw-object-contain"
        />
        <h3 class="tw-text-lg tw-font-bold tw-truncate">{{ book.title }}</h3>
        <p class="tw-text-sm tw-text-gray-600 tw-truncate">Tác giả: {{ book.author }}</p>
        <p class="tw-text-sm tw-text-gray-600 tw-truncate">Thể loại: {{ book.genre }}</p>
        <p class="tw-text-sm tw-text-gray-600">Năm xuất bản: {{ book.published_year }}</p>
        <p class="tw-text-gray-700">
          <b>Số lượng sách:</b> {{ book.quantity }} / {{ book.total_quantity }}
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

    <!-- Phân trang -->
    <PaginationPage v-model:page="page" :total="total" :limit="limit" @update:page="fetchBooks" />

    <BookDetail v-model:isOpen="isModalOpen" :book="selectedBook" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { api, API_ROUTES } from 'src/api'
import BookDetail from 'components/BookDetail.vue'
import BookSearchBar from 'src/components/BookSearchBar.vue'
import PaginationPage from 'src/components/PaginationPage.vue'

const searchBar = ref(null)
const books = ref([])
const searchQuery = ref({})
const isModalOpen = ref(false)
const selectedBook = ref(null)
const page = ref(1)
const limit = 5
const total = ref(0)

const fetchBooks = async () => {
  try {
    const res = await api.get(API_ROUTES.BOOKS, {
      params: {
        ...searchQuery.value,
        page: page.value,
        limit,
      },
    })
    books.value = res.data.books
    total.value = res.data.total
    console.log(res)
  } catch (error) {
    console.error('Lỗi khi tìm kiếm sách:', error)
  }
}

const resetPage = (query) => {
  searchQuery.value = query
  page.value = 1
  fetchBooks()
}

const openModal = (book) => {
  selectedBook.value = book
  isModalOpen.value = true
}

onMounted(() => {
  fetchBooks()
  searchBar.value.setShowBooksFilter(true)
})
</script>
