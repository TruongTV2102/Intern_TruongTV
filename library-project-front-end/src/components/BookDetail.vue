<template>
  <q-dialog :model-value="isOpen" @update:modelValue="emit('update:isOpen', $event)">
    <q-card class="tw-w-1/2 tw-p-4 tw-shadow-lg tw-rounded-lg">
      <q-card-section>
        <div class="tw-flex">
          <!-- Ảnh sách bên trái -->
          <div class="tw-w-1/2">
            <img
              :src="
                book?.cover_image_url ||
                'https://res.cloudinary.com/dp39ryiip/image/upload/v1742269732/ooe26eg7synamgmmycgk.jpg'
              "
              class="tw-rounded-lg tw-w-full tw-h-[350px] tw-object-contain"
            />
          </div>

          <!-- Thông tin sách bên phải -->
          <div class="tw-w-1/2 tw-pl-4">
            <h1 class="tw-text-2xl tw-font-bold tw-mb-2">{{ localBook.name }}</h1>
            <p class="tw-text-gray-700"><b>Tác giả:</b> {{ localBook.author }}</p>
            <p class="tw-text-gray-700"><b>Thể loại:</b> {{ localBook.genre }}</p>
            <p class="tw-text-gray-700"><b>Năm xuất bản:</b> {{ localBook.published_year }}</p>
            <p class="tw-text-gray-700">
              <b>Số lượng sách:</b> {{ localBook.quantity }} / {{ localBook.total_quantity }}
            </p>
            <p class="tw-text-gray-700">
              <b>Tình trạng:</b>
              <span :class="{ 'tw-text-red-500': localBook.quantity === 0 }">
                {{ localBook.quantity > 0 ? 'Có sẵn' : 'Hết sách' }}
              </span>
            </p>

            <!-- Mô tả sách -->
            <div class="tw-mt-4">
              <h2 class="tw-text-xl tw-font-bold tw-mb-2">Mô tả</h2>
              <q-input
                type="textarea"
                v-model="localBook.description"
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
          label="Thêm vào đơn hàng"
          color="primary"
          class="tw-w-full"
          :disabled="localBook.quantity === 0 || authStore.user.role === 'admin'"
          @click="submitAddToCart"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import { useCartStore } from 'src/stores/cartStore'

const props = defineProps({ isOpen: Boolean, book: Object })
const emit = defineEmits(['update:isOpen'])
const authStore = useAuthStore()
const cartStore = useCartStore()

const localBook = computed(() => props.book)

const submitAddToCart = () => {
  cartStore.addBook(localBook.value) // Thêm sách vào giỏ hàng

  emit('update:isOpen', false)
}
</script>
