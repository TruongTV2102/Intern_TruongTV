<template>
  <SearchBar
    v-model="searchData"
    :fields="bookFilters"
    :schema="searchSchema"
    @search="handleSearch"
  />
</template>

<script setup>
import { ref } from 'vue'
import SearchBar from 'src/components/SearchBar.vue'

const searchData = ref({
  title: '',
  author: '',
  genre: '',
  published_year: '',
  date: '',
})

const genres = ref([1, 2, 3, 4])

const searchSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', minLength: 1 },
    author: { type: 'string', minLength: 1 },
    published_year: {
      type: 'integer',
      minimum: 0,
    },
    genre: { type: 'string' },
  },
  required: ['title'],
  additionalProperties: false,
}

const bookFilters = ref([
  { model: 'title', label: 'Tên sách', type: 'text', maxlength: 9 },
  { model: 'author', label: 'Tác giả', type: 'text' },
  { model: 'published_year', label: 'Năm xuất bản', type: 'number' },
  { model: 'genre', label: 'Thể loại', type: 'select', options: genres },
  { model: 'date', label: 'Ngày', type: 'date' },
])

const handleSearch = () => {
  console.log(1)
}
</script>
