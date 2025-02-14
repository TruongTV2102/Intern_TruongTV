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
    <q-dialog v-model="isModalOpen" class="">
      <q-card class="tw-w-1/2 tw-p-4 tw-shadow-lg tw-rounded-lg">
        <q-card-section>
          <div class="tw-flex">
            <!-- Ảnh sách bên trái -->
            <div class="tw-w-1/2">
              <img
                :src="selectedBook.image"
                class="tw-rounded-lg tw-w-full tw-h-[350px] tw-object-contain"
              />
            </div>

            <!-- Thông tin sách bên phải -->
            <div class="tw-w-1/2 tw-pl-4">
              <h1 class="tw-text-2xl tw-font-bold tw-mb-2">{{ selectedBook.name }}</h1>
              <p class="tw-text-gray-700"><b>Tác giả:</b> {{ selectedBook.author }}</p>
              <p class="tw-text-gray-700"><b>Thể loại:</b> {{ selectedBook.genre }}</p>
              <p class="tw-text-gray-700"><b>Mã sách:</b> {{ selectedBook.bookcode }}</p>
              <p class="tw-text-gray-700"><b>Năm xuất bản:</b> {{ selectedBook.year }}</p>
              <p class="tw-text-gray-700">
                <b>Số lượng sách:</b> {{ selectedBook.quantity }} / {{ selectedBook.totalQuantity }}
              </p>
              <p class="tw-text-gray-700">
                <b>Tình trạng:</b>
                <span :class="{ 'tw-text-red-500': selectedBook.quantity === 0 }">
                  {{ selectedBook.quantity > 0 ? 'Có sẵn' : 'Hết sách' }}
                </span>
              </p>

              <!-- Mô tả sách -->
              <div class="tw-mt-4">
                <h2 class="tw-text-xl tw-font-bold tw-mb-2">Mô tả</h2>
                <q-input
                  type="textarea"
                  v-model="selectedBook.description"
                  readonly
                  outlined
                  dense
                  class="tw-text-gray-600 tw-px-4"
                />
              </div>
            </div>
          </div>
        </q-card-section>

        <!-- Nút mượn sách -->
        <q-card-actions>
          <q-btn
            label="Mượn sách"
            color="primary"
            class="tw-w-full"
            :disabled="selectedBook.quantity === 0"
            @click="borrowBook"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Form đăng ký mượn sách -->
    <q-dialog v-model="isBorrowFormOpen">
      <q-card class="tw-w-1/3 tw-p-4 tw-shadow-lg tw-rounded-lg">
        <q-card-section>
          <h2 class="tw-text-xl tw-font-bold tw-mb-4">Đăng ký mượn sách</h2>
          <q-input
            v-model="borrowForm.bookName"
            label="Tên sách"
            readonly
            outlined
            class="tw-mb-3"
          />
          <q-input
            v-model="borrowForm.borrowDate"
            label="Ngày mượn"
            type="date"
            outlined
            class="tw-mb-3"
            :min="minBorrowDate"
            :max="maxBorrowDate"
            @update:model-value="updateReturnDateRange"
          />
          <q-input
            v-model="borrowForm.returnDate"
            label="Ngày trả"
            type="date"
            outlined
            class="tw-mb-3"
            :min="minReturnDate"
            :max="maxReturnDate"
          />

          <q-btn label="Xác nhận" color="primary" class="tw-w-full" @click="submitBorrowForm" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import GenreSearchBar from 'components/GenreSearchBar.vue'
import { useAuthStore } from 'src/stores/userStore'
import { useBookStore } from 'src/stores/bookStore'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const authStore = useAuthStore()
const bookStore = useBookStore()

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

// Thêm state cho phân trang
const currentPage = ref(0)
const itemsPerPage = 20

// Tính toán tổng số trang
const totalPages = computed(() => {
  return Math.ceil(filteredBooks.value.length / itemsPerPage)
})

//Tính toán xem có phải phân trang hay không
const showPagination = computed(() => filteredBooks.value.length > 20)

// Sách phân trang
const paginatedBooks = computed(() => {
  const start = currentPage.value * itemsPerPage
  const end = start + itemsPerPage
  return filteredBooks.value.slice(start, end)
})

// Thay đổi trang
const changePage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page
  }
}

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

// Cập nhật ngày mượn và trả
const getCurrentDate = () => {
  const today = new Date()
  return today.toISOString().split('T')[0] // Format YYYY-MM-DD
}

// Ngày mượn tối đa
const calculateMaxBorrowDate = () => {
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 3) // Giới hạn tối đa 3 ngày
  return maxDate.toISOString().split('T')[0]
}

// Tính toán ngày trả dựa trên ngày mượn
const calculateMinReturnDate = (borrowDate) => {
  const minDate = new Date(borrowDate)
  minDate.setDate(minDate.getDate() + 3) // Ít nhất 3 ngày sau ngày mượn
  return minDate.toISOString().split('T')[0]
}

const calculateMaxReturnDate = (borrowDate) => {
  const maxDate = new Date(borrowDate)
  maxDate.setMonth(maxDate.getMonth() + 1) // Tối đa 1 tháng
  return maxDate.toISOString().split('T')[0]
}

const isModalOpen = ref(false)
const selectedBook = ref(null)
const isBorrowFormOpen = ref(false)
const borrowForm = ref({
  bookName: '',
  borrowDate: getCurrentDate(),
  returnDate: calculateMinReturnDate(getCurrentDate()), // Mặc định 3 ngày sau ngày mượn
})

// Biến computed để tính ngày mượn và trả
const minBorrowDate = computed(() => getCurrentDate())
const maxBorrowDate = computed(() => calculateMaxBorrowDate())
const minReturnDate = computed(() => calculateMinReturnDate(borrowForm.value.borrowDate))
const maxReturnDate = computed(() => calculateMaxReturnDate(borrowForm.value.borrowDate))

// Cập nhật lại ngày trả khi người dùng thay đổi ngày mượn
const updateReturnDateRange = () => {
  if (
    borrowForm.value.returnDate < minReturnDate.value ||
    borrowForm.value.returnDate > maxReturnDate.value
  ) {
    borrowForm.value.returnDate = minReturnDate.value
  }
}

const openModal = (book) => {
  selectedBook.value = book
  isModalOpen.value = true
}

// Mượn sách
const router = useRouter()
const borrowBook = () => {
  if (!authStore.currentUser) {
    router.push('/login')
  } else {
    borrowForm.value.bookName = selectedBook.value.name
    borrowForm.value.borrowDate = getCurrentDate()
    borrowForm.value.returnDate = calculateMinReturnDate(getCurrentDate()) // Đặt ngày trả mặc định là 3 ngày sau
    isBorrowFormOpen.value = true
  }
}

// Xác nhận mượn sách
const submitBorrowForm = () => {
  alert(`Bạn đã đăng ký mượn sách "${borrowForm.value.bookName}" thành công và đợi admin accept `)
  isBorrowFormOpen.value = false
}
</script>
