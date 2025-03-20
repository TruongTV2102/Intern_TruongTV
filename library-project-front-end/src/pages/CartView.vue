<template>
  <div class="tw-p-4">
    <h1 class="tw-text-xl tw-font-bold tw-mb-4">Danh sách đơn hàng</h1>

    <div v-if="cart.length === 0" class="tw-text-gray-500">Không có sách nào trong giỏ hàng</div>

    <div v-else class="tw-grid tw-grid-cols-2 md:tw-grid-cols-4 tw-gap-4">
      <div
        v-for="book in cart"
        :key="book.id"
        class="tw-bg-white tw-p-4 tw-rounded-lg tw-shadow tw-relative tw-min-w-[180px] tw-w-full"
      >
        <img
          :src="book.cover_image_url"
          class="tw-rounded-lg tw-mb-2 tw-w-full tw-h-[300px] tw-object-contain"
        />

        <h3 class="tw-text-lg tw-font-bold tw-truncate">{{ book.title }}</h3>
        <p class="tw-text-sm tw-text-gray-600 tw-truncate">Tác giả: {{ book.author }}</p>
        <p class="tw-text-sm tw-text-gray-600 tw-truncate">Thể loại: {{ book.genre }}</p>

        <q-btn
          label="Xóa"
          color="red"
          class="tw-mt-2 tw-w-full"
          @click="handleRemoveBook(book.id)"
        />
      </div>
    </div>

    <div class="tw-mt-6 tw-flex tw-justify-between">
      <q-btn label="Xóa tất cả" color="red" :disable="cart.length === 0" @click="handleClearCart" />
      <q-btn
        label="Xác nhận mượn"
        color="green"
        :disable="cart.length === 0"
        @click="borrowBooks"
      />
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from 'src/stores/cartStore'
import { useAuthStore } from 'src/stores/auth'
import { toRaw } from 'vue'
import api from 'src/api/index.js'

const cartStore = useCartStore()
const authStore = useAuthStore()
const { cart, clearCart, removeBook } = cartStore

const handleRemoveBook = (id) => {
  removeBook(id)
}

const handleClearCart = () => {
  clearCart()
}

const borrowBooks = async () => {
  if (!authStore.user) {
    alert('Bạn cần đăng nhập để mượn sách!')
    return
  }

  try {
    const rawCart = toRaw(cart)
    const bookIds = rawCart.map((book) => book.id)

    const requestData = {
      user_id: authStore.user.id,
      books: bookIds,
    }

    await api.post('/borrow', requestData)
    alert('Gửi yêu cầu mượn sách thành công!')
    clearCart()
  } catch (error) {
    console.log(error)

    alert('Không thể gửi yêu cầu mượn sách!')
  }
}
</script>
