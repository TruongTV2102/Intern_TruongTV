<template>
  <div
    class="tw-mb-4 tw-flex tw-flex-wrap tw-justify-center tw-gap-4 tw-border tw-border-gray-300 tw-p-4 tw-rounded-lg tw-bg-white"
  >
    <q-input v-model="search.title" label="Tên sách" class="tw-w-full tw-max-w-xs" outlined dense />
    <q-input v-model="search.author" label="Tác giả" class="tw-w-full tw-max-w-xs" outlined dense />
    <q-select
      v-model="search.genre"
      :options="genres"
      option-value="name"
      option-label="name"
      label="Thể loại"
      class="tw-w-full tw-max-w-xs"
      outlined
      dense
      emit-value
      map-options
    />
    <q-input
      v-model="search.published_year"
      label="Năm xuất bản"
      class="tw-w-full tw-max-w-xs"
      outlined
      dense
    />
    <q-input
      v-model="search.status"
      label="Trạng thái"
      class="tw-w-full tw-max-w-xs"
      outlined
      dense
    />

    <q-btn unelevated color="primary" icon="search" @click="emitSearch" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api, API_ROUTES } from 'src/api'

const search = ref({
  title: '',
  author: '',
  genre: '',
  published_year: '',
  status: '',
})

const genres = ref([])

const emit = defineEmits(['search'])

const emitSearch = () => {
  emit('search', { ...search.value })
}

const fetchGenres = async () => {
  try {
    const response = await api.get(API_ROUTES.GENRES)
    genres.value = response.data
  } catch (error) {
    console.error('Lỗi khi lấy danh sách thể loại:', error)
  }
}

onMounted(fetchGenres)
</script>
