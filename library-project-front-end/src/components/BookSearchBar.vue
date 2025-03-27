<template>
  <div
    class="tw-flex tw-flex-wrap tw-items-center tw-gap-4 tw-border tw-border-gray-300 tw-p-4 tw-rounded-lg tw-bg-white tw-m-[10px]"
  >
    <q-input
      v-model="search.title"
      label="Tên sách"
      class="tw-w-full sm:tw-max-w-xs"
      outlined
      dense
    />
    <q-input
      v-model="search.author"
      label="Tác giả"
      class="tw-w-full sm:tw-max-w-xs"
      outlined
      dense
    />
    <q-select
      v-model="search.genre"
      :options="genres"
      option-value="name"
      option-label="name"
      label="Thể loại"
      class="tw-w-full sm:tw-max-w-xs"
      outlined
      dense
      emit-value
      map-options
      @update:model-value="search.genre = $event || null"
    >
      <template v-if="search.genre" v-slot:append>
        <q-icon name="cancel" @click.stop.prevent="search.genre = null" class="cursor-pointer" />
      </template>
    </q-select>

    <q-input
      v-model="search.published_year"
      label="Năm xuất bản"
      class="tw-w-full sm:tw-max-w-xs"
      outlined
      dense
      type="number"
      min="0"
      @update:model-value="search.published_year = $event ? parseInt($event, 10) : null"
    />
    <q-btn
      unelevated
      color="primary"
      icon="search"
      @click="emitSearch"
      class="tw-h-10 tw-w-10 sm:tw-w-auto"
    />
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
