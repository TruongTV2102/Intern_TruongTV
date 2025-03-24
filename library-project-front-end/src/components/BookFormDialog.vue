<template>
  <q-dialog v-model="localIsOpen" @update:model-value="emit('update:isOpen', $event)">
    <q-card class="tw-w-[500px] tw-p-4">
      <q-card-section>
        <h2 class="tw-text-lg tw-font-bold">
          {{ isEditing ? 'Chỉnh sửa sách' : 'Thêm sách mới' }}
        </h2>
      </q-card-section>

      <q-card-section>
        <q-input v-model="form.title" label="Tên sách" dense outlined />
        <q-input v-model="form.author" label="Tác giả" dense outlined class="tw-mt-2" />
        <q-input v-model="form.genre" label="Thể loại" dense outlined class="tw-mt-2" />
        <q-input
          v-model.number="form.published_year"
          label="Năm xuất bản"
          type="number"
          dense
          outlined
          class="tw-mt-2"
        />
        <q-input
          v-model.number="form.quantity"
          label="Số lượng"
          type="number"
          dense
          outlined
          class="tw-mt-2"
        />
        <q-input
          v-model.number="form.total_quantity"
          label="Tổng số lượng"
          type="number"
          dense
          outlined
          class="tw-mt-2"
        />
        <q-input
          v-model="form.description"
          label="Mô tả"
          type="textarea"
          dense
          outlined
          class="tw-mt-2"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Hủy" @click="localIsOpen = false" />
        <q-btn color="primary" :label="isEditing ? 'Cập nhật' : 'Thêm'" @click="submitForm" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  bookData: Object,
})
const emit = defineEmits(['update:isOpen', 'submit'])

const localIsOpen = ref(props.isOpen)
const isEditing = ref(false)
const form = ref({
  title: '',
  author: '',
  genre: '',
  published_year: '',
  quantity: '',
  total_quantity: '',
  description: '',
})

watch(
  () => props.isOpen,
  (newVal) => {
    localIsOpen.value = newVal
  },
)

watch(
  () => props.bookData,
  (newData) => {
    if (newData) {
      form.value = { ...newData }
      isEditing.value = true
    } else {
      form.value = {
        title: '',
        author: '',
        genre: '',
        published_year: '',
        quantity: '',
        total_quantity: '',
        description: '',
      }
      isEditing.value = false
    }
  },
  { immediate: true },
)

const submitForm = () => {
  emit('submit', { ...form.value, isEditing: isEditing.value })
  localIsOpen.value = false
  emit('update:isOpen', false)
}
</script>
