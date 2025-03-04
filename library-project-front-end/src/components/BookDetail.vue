<template>
  <q-dialog v-model="localIsOpen" @update:modelValue="emit('update:isOpen', $event)">
    <q-card class="tw-w-1/2 tw-p-4 tw-shadow-lg tw-rounded-lg">
      <q-card-section>
        <div class="tw-flex">
          <!-- Ảnh sách bên trái -->
          <div class="tw-w-1/2">
            <img :src="book.image" class="tw-rounded-lg tw-w-full tw-h-[350px] tw-object-contain" />
          </div>

          <!-- Thông tin sách bên phải -->
          <div class="tw-w-1/2 tw-pl-4">
            <h1 class="tw-text-2xl tw-font-bold tw-mb-2">{{ localBook.name }}</h1>
            <p class="tw-text-gray-700"><b>Tác giả:</b> {{ localBook.author }}</p>
            <p class="tw-text-gray-700"><b>Thể loại:</b> {{ localBook.genre }}</p>
            <p class="tw-text-gray-700"><b>Mã sách:</b> {{ localBook.bookcode }}</p>
            <p class="tw-text-gray-700"><b>Năm xuất bản:</b> {{ localBook.year }}</p>
            <p class="tw-text-gray-700">
              <b>Số lượng sách:</b> {{ localBook.quantity }} / {{ localBook.totalQuantity }}
            </p>
            <p class="tw-text-gray-700">
              <b>Tình trạng:</b>
              <span :class="{ 'tw-text-red-500': localBook.quantity === 0 }">
                {{ book.quantity > 0 ? 'Có sẵn' : 'Hết sách' }}
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
          label="Mượn sách"
          color="primary"
          class="tw-w-full"
          :disabled="localBook.quantity === 0 || userStore.currentUser.role === 'admin'"
          @click="$emit('borrow')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useUserStore } from 'src/stores/userStore'

const props = defineProps({ isOpen: Boolean, book: Object })
const emit = defineEmits(['borrow', 'update:isOpen'])
const userStore = useUserStore()
const localIsOpen = ref(props.isOpen)
const localBook = ref({ ...props.book })

watch(
  () => props.isOpen,
  (newVal) => {
    localIsOpen.value = newVal
  },
)

watch(
  () => props.book,
  (newBook) => {
    localBook.value = { ...newBook } // Cập nhật lại toàn bộ dữ liệu
  },
  { deep: true }, // Đảm bảo theo dõi thay đổi bên trong object
)
</script>
