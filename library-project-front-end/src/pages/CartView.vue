<template>
  <div class="tw-p-4">
    <h1 class="tw-text-xl tw-font-bold tw-mb-4">Giỏ hàng</h1>

    <!-- Hiển thị khi giỏ hàng trống -->
    <div v-if="cartStore.cart.length === 0" class="tw-text-gray-500">
      Giỏ hàng của bạn đang trống.
    </div>

    <!-- Hiển thị danh sách sách trong giỏ hàng -->
    <div v-else class="tw-grid tw-grid-cols-2 md:tw-grid-cols-4 tw-gap-4">
      <div
        v-for="book in cartStore.cart"
        :key="book.id"
        class="tw-bg-white tw-p-4 tw-rounded-lg tw-shadow tw-min-w-[180px] tw-w-full"
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
          @click="cartStore.removeBook(book.id)"
        />
      </div>
    </div>

    <!-- Nút Xóa tất cả & Xác nhận mượn -->
    <div class="tw-mt-6 tw-flex tw-justify-between">
      <q-btn
        label="Xóa tất cả"
        color="red"
        :disable="cartStore.cart.length === 0"
        @click="cartStore.clearCart"
      />
      <q-btn
        label="Xác nhận mượn"
        color="green"
        :disable="cartStore.cart.length === 0"
        @click="cartStore.borrowBooks"
      />
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from 'src/stores/cartStore'

const cartStore = useCartStore()
</script>
