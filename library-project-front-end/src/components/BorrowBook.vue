<template>
  <q-dialog v-model="localIsOpen" @update:modelValue="emit('update:isOpen', $event)">
    <q-card class="tw-w-1/3 tw-p-4 tw-shadow-lg tw-rounded-lg">
      <q-card-section>
        <h2 class="tw-text-xl tw-font-bold tw-mb-4">Đăng ký mượn sách</h2>
        <q-input v-model="borrowForm.bookName" label="Tên sách" readonly outlined class="tw-mb-3" />
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
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useLoanStore } from 'src/stores/loanStore'
import { useUserStore } from 'src/stores/userStore'
import { toast } from 'src/plugins/toast'

const props = defineProps({ isOpen: Boolean, book: Object })
const emit = defineEmits(['update:isOpen'])

const localIsOpen = ref(props.isOpen)
const loanStore = useLoanStore()
const userStore = useUserStore()

// Theo dõi sự thay đổi của `isOpen`
watch(
  () => props.isOpen,
  (newVal) => {
    localIsOpen.value = newVal
  },
)

// Lấy ngày hiện tại
const getCurrentDate = () => new Date().toISOString().split('T')[0]

// Giới hạn ngày mượn tối đa (3 ngày tới)
const calculateMaxBorrowDate = () => {
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 3)
  return maxDate.toISOString().split('T')[0]
}

// Tính toán ngày trả hợp lệ
const calculateMinReturnDate = (borrowDate) => {
  const minDate = new Date(borrowDate)
  minDate.setDate(minDate.getDate()) // Phải trả ít nhất sau 3 ngày
  return minDate.toISOString().split('T')[0]
}

const calculateMaxReturnDate = (borrowDate) => {
  const maxDate = new Date(borrowDate)
  maxDate.setMonth(maxDate.getMonth() + 1) // Trả trong vòng 1 tháng
  return maxDate.toISOString().split('T')[0]
}

// Form đăng ký mượn sách
const borrowForm = ref({
  bookName: '',
  borrowDate: getCurrentDate(),
  returnDate: calculateMinReturnDate(getCurrentDate()),
})

// Cập nhật borrowForm khi `book` thay đổi
watch(
  () => props.book,
  (newBook) => {
    if (newBook) {
      borrowForm.value = {
        bookName: newBook.name,
        borrowDate: getCurrentDate(),
        returnDate: calculateMinReturnDate(getCurrentDate()),
      }
    }
  },
)

// Giới hạn ngày
const minBorrowDate = computed(() => getCurrentDate())
const maxBorrowDate = computed(() => calculateMaxBorrowDate())
const minReturnDate = computed(() => calculateMinReturnDate(borrowForm.value.borrowDate))
const maxReturnDate = computed(() => calculateMaxReturnDate(borrowForm.value.borrowDate))

// Cập nhật ngày trả khi ngày mượn thay đổi
const updateReturnDateRange = () => {
  if (
    borrowForm.value.returnDate < minReturnDate.value ||
    borrowForm.value.returnDate > maxReturnDate.value
  ) {
    borrowForm.value.returnDate = minReturnDate.value
  }
}

// Xác nhận mượn sách
const submitBorrowForm = () => {
  const loanRequest = {
    user: userStore.currentUser,
    book: props.book,
    borrowDate: borrowForm.value.borrowDate,
    returnDate: borrowForm.value.returnDate,
    status: 'pending', // Chờ admin xác nhận
    requestDate: new Date().toISOString(),
  }

  // Lưu vào loanStore
  loanStore.addLoanRequest(loanRequest)

  toast.info('Đăng ký mượn sách thành công. Đợi admin duyệt')
  emit('update:isOpen', false) // Đóng form
}
</script>
