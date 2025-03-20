<template>
  <div class="tw-mb-4 tw-flex tw-flex-wrap tw-justify-center tw-gap-4">
    <q-input
      v-model="search.title"
      label="Tên sách"
      class="tw-w-full tw-max-w-xs tw-bg-white"
      outlined
      dense
      @keyup.enter="emitSearch"
    />
    <q-input
      v-model="search.author"
      label="Tác giả"
      class="tw-w-full tw-max-w-xs tw-bg-white"
      outlined
      dense
      @keyup.enter="emitSearch"
    />
    <q-select
      v-model="search.genre"
      :options="genres"
      option-value="name"
      option-label="name"
      label="Thể loại"
      class="tw-w-full tw-max-w-xs tw-bg-white"
      outlined
      dense
      emit-value
      map-options
      @keyup.enter="emitSearch"
    />
    <q-input
      v-model="search.published_year"
      label="Năm xuất bản"
      class="tw-w-full tw-max-w-xs tw-bg-white"
      outlined
      dense
      @keyup.enter="emitSearch"
    />
    <q-btn flat round dense icon="search" @click="emitSearch" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from 'src/api'
const search = ref({
  title: '',
  author: '',
  genre: '',
  published_year: '',
})

const genres = ref([])

const router = useRouter()

const emitSearch = () => {
  const query = {}
  Object.keys(search.value).forEach((key) => {
    if (search.value[key]) {
      query[key] = search.value[key]
    }
  })
  router.push({ path: '/search', query })
}

const fetchGenres = async () => {
  try {
    const response = await api.get('/genres') // Adjust the API endpoint as needed
    genres.value = response.data
  } catch (error) {
    console.error('Lỗi khi lấy danh sách thể loại:', error)
  }
}

onMounted(fetchGenres)
</script>
