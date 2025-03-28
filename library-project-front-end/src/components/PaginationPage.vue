<template>
  <div v-if="totalPages > 1" class="tw-mt-4 tw-flex tw-justify-center tw-gap-4">
    <q-btn label="« Trước" color="blue" :disabled="page === 1" @click="prevPage" />
    <span>Trang {{ page }} / {{ totalPages }}</span>
    <q-btn label="Tiếp »" color="blue" :disabled="page === totalPages" @click="nextPage" />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  total: Number,
  page: Number,
  limit: Number,
})
console.log('Phân trang', props)

const emit = defineEmits(['update:page'])

const totalPages = computed(() => Math.ceil(props.total / props.limit))

const nextPage = () => {
  if (props.page < totalPages.value) {
    emit('update:page', props.page + 1)
  }
}

const prevPage = () => {
  if (props.page > 1) {
    emit('update:page', props.page - 1)
  }
}
</script>
