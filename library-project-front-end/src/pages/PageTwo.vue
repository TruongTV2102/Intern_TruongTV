<template>
  <SearchBar
    v-model="searchData"
    :fields="bookFilters"
    :schema="searchSchema"
    @search="handleSearch"
  />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { searchSchema } from 'src/schema/test/validationSchema'
import SearchBar from 'src/components/SearchBar.vue'

const searchData = ref({})
const bookFilters = ref([
  { model: 'title', label: 'Title', type: 'text' },
  { model: 'price', label: 'Price', type: 'number' },
  { model: 'date', label: 'Ngày mượn', type: 'date' },
])

const handleSearch = (searchData) => {
  console.log('Searching with data:', searchData)
  // Xử lý tìm kiếm ở đây
}
onMounted(() => {
  console.log(searchSchema)
})
</script>
